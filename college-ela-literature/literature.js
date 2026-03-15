// College ELA Literature Lab (Intro-Advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-literature');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'close-reading': ['figurative-language-id', 'tone-identification', 'basic-close-reading'],
    'literary-devices': ['symbolism-basics', 'narrative-voice-id'],
    'literary-periods': ['periods-overview'],
    'genre-analysis': ['genre-conventions'],
  },
  'intermediate': {
    'close-reading': ['formalism-analysis'],
    'literary-devices': ['advanced-figurative', 'irony-types'],
    'critical-approaches': ['feminist-reading', 'marxist-reading'],
  },
  'advanced': {
    'literary-periods': ['comparative-lit'],
    'critical-approaches': ['postcolonial-analysis', 'queer-theory-app', 'ecocriticism'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'figurative-language-id': {
      type: 'device-id', instruction: 'Read the passage and identify the literary device used.',
      items: [
        { passage: '"The world is a stage, and all the men and women merely players." — Shakespeare', question: 'What device is used?', answer: 'Metaphor', options: ['Metaphor', 'Simile', 'Hyperbole', 'Personification'] },
        { passage: '"Her smile was like the sun breaking through clouds."', question: 'What device is used?', answer: 'Simile', options: ['Simile', 'Metaphor', 'Alliteration', 'Irony'] },
        { passage: '"The wind whispered secrets through the ancient trees."', question: 'What device is used?', answer: 'Personification', options: ['Personification', 'Metaphor', 'Onomatopoeia', 'Simile'] },
        { passage: '"I have told you a million times to clean your room."', question: 'What device is used?', answer: 'Hyperbole', options: ['Hyperbole', 'Litotes', 'Metaphor', 'Irony'] },
        { passage: '"Peter Piper picked a peck of pickled peppers."', question: 'What device is used?', answer: 'Alliteration', options: ['Alliteration', 'Assonance', 'Consonance', 'Onomatopoeia'] },
        { passage: '"The thunder grumbled and roared across the valley."', question: 'What devices are used?', answer: 'Personification and onomatopoeia', options: ['Personification and onomatopoeia', 'Simile and metaphor', 'Hyperbole and litotes', 'Alliteration and assonance'] },
      ],
    },
    'tone-identification': {
      type: 'device-id', instruction: 'Read the passage and identify the author\'s tone.',
      items: [
        { passage: '"The streets were empty, the houses dark, and the only sound was the distant tolling of a bell."', question: 'What is the tone?', answer: 'Somber', options: ['Somber', 'Joyful', 'Satirical', 'Whimsical'] },
        { passage: '"She danced through the meadow, her laughter ringing out like silver bells in the clear morning air."', question: 'What is the tone?', answer: 'Joyful', options: ['Joyful', 'Melancholic', 'Ironic', 'Foreboding'] },
        { passage: '"The committee, in its infinite wisdom, decided to solve the housing crisis by building a single park bench."', question: 'What is the tone?', answer: 'Satirical', options: ['Satirical', 'Earnest', 'Somber', 'Nostalgic'] },
        { passage: '"I remember the old house on the hill, the smell of bread baking, and my grandmother\'s voice calling us in from play."', question: 'What is the tone?', answer: 'Nostalgic', options: ['Nostalgic', 'Bitter', 'Detached', 'Satirical'] },
        { passage: '"The data suggests a statistically significant correlation between the two variables, warranting further investigation."', question: 'What is the tone?', answer: 'Objective', options: ['Objective', 'Passionate', 'Nostalgic', 'Whimsical'] },
        { passage: '"The shadows crept closer, and something in the darkness began to breathe."', question: 'What is the tone?', answer: 'Foreboding', options: ['Foreboding', 'Humorous', 'Romantic', 'Didactic'] },
      ],
    },
    'basic-close-reading': {
      type: 'close-reading-q', instruction: 'Read the passage carefully and answer the question.',
      items: [
        { passage: '"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife." — Austen', question: 'What does "universally acknowledged" suggest about the narrator\'s perspective?', answer: 'The narrator is being ironic', options: ['The narrator is being ironic', 'The narrator states a fact', 'The narrator is uncertain', 'The narrator is quoting someone'] },
        { passage: '"Call me Ishmael." — Melville', question: 'What does this opening line establish?', answer: 'A first-person narrator with a direct address to the reader', options: ['A first-person narrator with a direct address to the reader', 'An omniscient narrator', 'A second-person perspective', 'An unreliable timeline'] },
        { passage: '"Two roads diverged in a yellow wood, / And sorry I could not travel both." — Frost', question: 'What does the "yellow wood" symbolize?', answer: 'A moment of decision in life, possibly autumn or maturity', options: ['A moment of decision in life, possibly autumn or maturity', 'A literal forest in autumn', 'Danger ahead on the path', 'Wealth and prosperity'] },
        { passage: '"To be, or not to be: that is the question." — Shakespeare', question: 'What is the central tension in this line?', answer: 'The choice between existence and non-existence', options: ['The choice between existence and non-existence', 'A question about identity', 'A debate about acting on stage', 'Whether to fight or flee'] },
        { passage: '"Happy families are all alike; every unhappy family is unhappy in its own way." — Tolstoy', question: 'What structural principle does this opening establish?', answer: 'The novel will explore the unique nature of familial dysfunction', options: ['The novel will explore the unique nature of familial dysfunction', 'The novel will celebrate happy families', 'All families in the novel are happy', 'The narrator is a family therapist'] },
        { passage: '"It was the best of times, it was the worst of times." — Dickens', question: 'What literary device structures this opening?', answer: 'Antithesis (juxtaposition of opposites)', options: ['Antithesis (juxtaposition of opposites)', 'Hyperbole', 'Understatement', 'Stream of consciousness'] },
      ],
    },
    'periods-overview': {
      type: 'period-match', instruction: 'Match the description or work to the correct literary period.',
      items: [
        { prompt: 'A movement emphasizing emotion, nature, individualism, and the sublime, reacting against Enlightenment rationality.', answer: 'Romanticism', options: ['Romanticism', 'Realism', 'Modernism', 'Neoclassicism'] },
        { prompt: 'Literature focused on depicting everyday life accurately, often addressing social class and moral questions.', answer: 'Realism', options: ['Realism', 'Romanticism', 'Surrealism', 'Gothic'] },
        { prompt: 'A period of literary experimentation with stream of consciousness, fragmented narratives, and disillusionment after World War I.', answer: 'Modernism', options: ['Modernism', 'Postmodernism', 'Naturalism', 'Victorian'] },
        { prompt: 'Ancient Greek and Roman literature featuring epic poetry, drama (tragedy and comedy), and philosophical works.', answer: 'Classical Antiquity', options: ['Classical Antiquity', 'Medieval', 'Renaissance', 'Enlightenment'] },
        { prompt: 'A revival of interest in classical learning, humanism, and individual achievement, exemplified by Shakespeare and Petrarch.', answer: 'Renaissance', options: ['Renaissance', 'Classical Antiquity', 'Baroque', 'Romanticism'] },
        { prompt: 'Literature that questions grand narratives, embraces irony and pastiche, and blurs the line between high and low culture.', answer: 'Postmodernism', options: ['Postmodernism', 'Modernism', 'Realism', 'Naturalism'] },
      ],
    },
    'genre-conventions': {
      type: 'device-id', instruction: 'Identify the literary genre based on the described conventions.',
      items: [
        { passage: 'A narrative featuring a protagonist who embarks on a journey, faces trials, and returns transformed. Often includes supernatural elements.', question: 'What genre does this describe?', answer: 'Epic', options: ['Epic', 'Lyric poetry', 'Satire', 'Pastoral'] },
        { passage: 'A short fictional narrative in prose, focused on a single effect or impression, with a limited cast of characters.', question: 'What genre does this describe?', answer: 'Short story', options: ['Short story', 'Novella', 'Epic', 'Essay'] },
        { passage: 'A dramatic work in which the protagonist, often of noble birth, falls from grace due to a fatal flaw (hamartia).', question: 'What genre does this describe?', answer: 'Tragedy', options: ['Tragedy', 'Comedy', 'Melodrama', 'Farce'] },
        { passage: 'A prose narrative that uses humor, irony, or exaggeration to criticize human vices, institutions, or society.', question: 'What genre does this describe?', answer: 'Satire', options: ['Satire', 'Tragedy', 'Romance', 'Bildungsroman'] },
        { passage: 'A novel tracing the psychological and moral growth of a protagonist from youth to adulthood.', question: 'What genre does this describe?', answer: 'Bildungsroman', options: ['Bildungsroman', 'Picaresque', 'Gothic novel', 'Epistolary novel'] },
        { passage: 'A narrative set in an idealized rural landscape, celebrating the simplicity of country life, often with shepherds as characters.', question: 'What genre does this describe?', answer: 'Pastoral', options: ['Pastoral', 'Naturalism', 'Urban fiction', 'Noir'] },
      ],
    },
    'symbolism-basics': {
      type: 'device-id', instruction: 'Read the passage and identify what the symbol represents.',
      items: [
        { passage: 'In The Great Gatsby, a green light shines at the end of Daisy\'s dock, which Gatsby stares at from across the bay.', question: 'What does the green light symbolize?', answer: 'Hope, longing, and the unattainable dream', options: ['Hope, longing, and the unattainable dream', 'Wealth and materialism', 'Jealousy and envy', 'Nature and renewal'] },
        { passage: 'In Lord of the Flies, a conch shell is used to call meetings and grant the right to speak.', question: 'What does the conch symbolize?', answer: 'Order, civilization, and democratic authority', options: ['Order, civilization, and democratic authority', 'The power of the ocean', 'Childhood innocence', 'Musical talent'] },
        { passage: 'In To Kill a Mockingbird, Atticus tells his children it is a sin to kill a mockingbird because they only make music.', question: 'What does the mockingbird symbolize?', answer: 'Innocence and those who are harmless yet persecuted', options: ['Innocence and those who are harmless yet persecuted', 'The beauty of nature', 'Southern culture', 'Freedom and flight'] },
        { passage: 'In Hamlet, Yorick\'s skull is unearthed by a gravedigger and held by the prince.', question: 'What does the skull symbolize?', answer: 'Mortality and the inevitability of death', options: ['Mortality and the inevitability of death', 'Madness and delusion', 'The corruption of the court', 'Lost friendship'] },
        { passage: 'In The Scarlet Letter, Hester Prynne is forced to wear a red "A" on her clothing.', question: 'What does the scarlet letter symbolize?', answer: 'Sin, shame, and ultimately resilience', options: ['Sin, shame, and ultimately resilience', 'Love and passion', 'Wealth and status', 'Religious devotion'] },
        { passage: 'In Animal Farm, the windmill that the animals build, destroy, and rebuild represents ongoing struggle.', question: 'What does the windmill symbolize?', answer: 'The manipulation of the working class through false promises of progress', options: ['The manipulation of the working class through false promises of progress', 'Technological advancement', 'The beauty of collective labor', 'Environmental destruction'] },
      ],
    },
    'narrative-voice-id': {
      type: 'device-id', instruction: 'Read the passage and identify the narrative voice or point of view.',
      items: [
        { passage: '"I am an invisible man. No, I am not a spook like those who haunted Edgar Allan Poe." — Ellison', question: 'What narrative voice is used?', answer: 'First person', options: ['First person', 'Third person limited', 'Third person omniscient', 'Second person'] },
        { passage: '"Mrs. Dalloway said she would buy the flowers herself." — Woolf', question: 'What narrative voice is used?', answer: 'Third person limited (free indirect discourse)', options: ['Third person limited (free indirect discourse)', 'First person', 'Third person omniscient', 'Second person'] },
        { passage: '"You are about to begin reading Italo Calvino\'s new novel." — Calvino', question: 'What narrative voice is used?', answer: 'Second person', options: ['Second person', 'First person', 'Third person omniscient', 'Third person limited'] },
        { passage: '"He was an old man who fished alone in a skiff in the Gulf Stream." — Hemingway', question: 'What narrative voice is used?', answer: 'Third person limited', options: ['Third person limited', 'First person', 'Second person', 'Third person omniscient'] },
        { passage: '"In the beginning God created the heavens and the earth. And the earth was without form, and void."', question: 'What narrative voice is used?', answer: 'Third person omniscient', options: ['Third person omniscient', 'First person', 'Third person limited', 'Second person'] },
        { passage: '"If you really want to hear about it, the first thing you\'ll probably want to know is where I was born." — Salinger', question: 'What is distinctive about this narrative voice?', answer: 'First person with direct, colloquial address to the reader', options: ['First person with direct, colloquial address to the reader', 'Stream of consciousness', 'Unreliable omniscient narrator', 'Epistolary voice'] },
      ],
    },
  },
  'intermediate': {
    'advanced-figurative': {
      type: 'device-id', instruction: 'Read the passage and identify the advanced figurative device.',
      items: [
        { passage: '"Lend me your ears." — Shakespeare, Julius Caesar', question: 'What device is used?', answer: 'Metonymy', options: ['Metonymy', 'Synecdoche', 'Metaphor', 'Hyperbole'] },
        { passage: '"The pen is mightier than the sword."', question: 'What device is used?', answer: 'Metonymy', options: ['Metonymy', 'Personification', 'Simile', 'Paradox'] },
        { passage: '"All hands on deck!"', question: 'What device is used?', answer: 'Synecdoche', options: ['Synecdoche', 'Metonymy', 'Metaphor', 'Hyperbole'] },
        { passage: '"War is peace. Freedom is slavery. Ignorance is strength." — Orwell', question: 'What device is used?', answer: 'Paradox (oxymoron)', options: ['Paradox (oxymoron)', 'Irony', 'Antithesis', 'Litotes'] },
        { passage: '"Not unlike a masterful performance" (meaning it was a masterful performance).', question: 'What device is used?', answer: 'Litotes', options: ['Litotes', 'Hyperbole', 'Sarcasm', 'Euphemism'] },
        { passage: '"O Death, where is thy sting? O Grave, where is thy victory?"', question: 'What device is used?', answer: 'Apostrophe', options: ['Apostrophe', 'Personification', 'Rhetorical question', 'Metonymy'] },
      ],
    },
    'irony-types': {
      type: 'device-id', instruction: 'Identify the type of irony in the passage.',
      items: [
        { passage: 'In Romeo and Juliet, the audience knows Juliet is alive, but Romeo believes she is dead and takes poison.', question: 'What type of irony is this?', answer: 'Dramatic irony', options: ['Dramatic irony', 'Situational irony', 'Verbal irony', 'Cosmic irony'] },
        { passage: 'A fire station burns down while the firefighters are out responding to a false alarm.', question: 'What type of irony is this?', answer: 'Situational irony', options: ['Situational irony', 'Dramatic irony', 'Verbal irony', 'Structural irony'] },
        { passage: '"Oh, wonderful!" she said as she looked at the flat tire in the pouring rain.', question: 'What type of irony is this?', answer: 'Verbal irony', options: ['Verbal irony', 'Situational irony', 'Dramatic irony', 'Cosmic irony'] },
        { passage: 'In "The Gift of the Magi," Della sells her hair to buy a watch chain for Jim, while Jim sells his watch to buy combs for Della.', question: 'What type of irony is this?', answer: 'Situational irony', options: ['Situational irony', 'Dramatic irony', 'Verbal irony', 'Tragic irony'] },
        { passage: 'An unreliable narrator in a novel repeatedly insists he is perfectly sane while describing increasingly irrational behavior.', question: 'What type of irony is this?', answer: 'Structural irony', options: ['Structural irony', 'Verbal irony', 'Situational irony', 'Dramatic irony'] },
        { passage: 'Oedipus vows to find and punish the murderer of King Laius, not knowing he himself is the murderer.', question: 'What type of irony is this?', answer: 'Dramatic irony', options: ['Dramatic irony', 'Verbal irony', 'Situational irony', 'Structural irony'] },
      ],
    },
    'formalism-analysis': {
      type: 'close-reading-q', instruction: 'Analyze the passage using formalist (New Critical) principles. Focus on the text itself.',
      items: [
        { passage: '"Because I could not stop for Death — / He kindly stopped for me — / The Carriage held but just Ourselves — / And Immortality." — Dickinson', question: 'How does personification of Death function in the poem\'s structure?', answer: 'Death is presented as a courteous gentleman caller, creating tension between the pleasant tone and the grave subject', options: ['Death is presented as a courteous gentleman caller, creating tension between the pleasant tone and the grave subject', 'Death is frightening and violent', 'Death is irrelevant to the poem', 'Death represents the poet\'s father'] },
        { passage: '"Do I dare / Disturb the universe? / In a minute there is time / For decisions and revisions which a minute will reverse." — Eliot', question: 'What tension does the juxtaposition of cosmic scale and mundane time create?', answer: 'It reveals the speaker\'s paralysis between grand ambition and trivial hesitation', options: ['It reveals the speaker\'s paralysis between grand ambition and trivial hesitation', 'It shows the speaker is a scientist', 'It describes the Big Bang', 'It celebrates decisive action'] },
        { passage: '"So we beat on, boats against the current, borne back ceaselessly into the past." — Fitzgerald', question: 'How does the metaphor of boats and current unify the novel\'s themes?', answer: 'It encapsulates the futile struggle against time and the impossibility of recapturing the past', options: ['It encapsulates the futile struggle against time and the impossibility of recapturing the past', 'It describes a literal boat race', 'It celebrates progress and optimism', 'It is a reference to immigration'] },
        { passage: '"I celebrate myself, and sing myself, / And what I assume you shall assume, / For every atom belonging to me as good belongs to you." — Whitman', question: 'How does the shift from "myself" to "you" function formally?', answer: 'It dissolves the boundary between self and reader, enacting the democratic vision the poem proclaims', options: ['It dissolves the boundary between self and reader, enacting the democratic vision the poem proclaims', 'It is an error in pronoun use', 'It shows the speaker is confused about identity', 'It addresses a specific person named You'] },
        { passage: '"Things fall apart; the centre cannot hold; / Mere anarchy is loosed upon the world." — Yeats', question: 'How does the diction contribute to the poem\'s meaning?', answer: 'Words like "fall," "cannot hold," and "loosed" create a sense of violent disintegration and loss of order', options: ['Words like "fall," "cannot hold," and "loosed" create a sense of violent disintegration and loss of order', 'The diction is neutral and scientific', 'The language is celebratory', 'The words describe a building project'] },
        { passage: '"April is the cruellest month, breeding / Lilacs out of the dead land, mixing / Memory and desire." — Eliot', question: 'What paradox does the opening create?', answer: 'Spring, typically associated with renewal, is called cruel because awakening memory and desire is painful', options: ['Spring, typically associated with renewal, is called cruel because awakening memory and desire is painful', 'April is literally the coldest month', 'The poet dislikes flowers', 'Lilacs are poisonous plants'] },
      ],
    },
    'feminist-reading': {
      type: 'approach-match', instruction: 'Apply feminist literary criticism to the passage or scenario.',
      items: [
        { prompt: 'In Charlotte Bronte\'s Jane Eyre, the protagonist insists: "I am no bird; and no net ensnares me: I am a free human being with an independent will."', question: 'How does a feminist reading interpret this passage?', answer: 'Jane rejects the metaphor of woman as captive bird, asserting agency and selfhood against patriarchal constraints', options: ['Jane rejects the metaphor of woman as captive bird, asserting agency and selfhood against patriarchal constraints', 'Jane literally discusses ornithology', 'Jane is ungrateful to Rochester', 'The passage is about nature writing'] },
        { prompt: 'In The Yellow Wallpaper by Gilman, the narrator is confined to a room and forbidden from writing by her physician husband.', question: 'What does the "rest cure" represent in a feminist reading?', answer: 'Patriarchal medicine silencing women\'s creative and intellectual expression', options: ['Patriarchal medicine silencing women\'s creative and intellectual expression', 'A reasonable medical treatment', 'The narrator\'s laziness', 'A vacation from housework'] },
        { prompt: 'Virginia Woolf argues in A Room of One\'s Own that "a woman must have money and a room of her own if she is to write fiction."', question: 'What is the feminist critical significance of this claim?', answer: 'Material and spatial independence are prerequisites for women\'s artistic production, which patriarchal structures have historically denied', options: ['Material and spatial independence are prerequisites for women\'s artistic production, which patriarchal structures have historically denied', 'Women should only write in private rooms', 'Woolf is giving decorating advice', 'Writing fiction requires wealth'] },
        { prompt: 'In Kate Chopin\'s The Awakening, Edna Pontellier learns to swim and begins to assert desires independent of her husband and children.', question: 'What does swimming symbolize in a feminist reading?', answer: 'Female autonomy and liberation from the confining roles of wife and mother', options: ['Female autonomy and liberation from the confining roles of wife and mother', 'A new exercise hobby', 'Fear of drowning', 'Edna\'s desire to become an athlete'] },
        { prompt: 'Gilbert and Gubar\'s concept of "the madwoman in the attic" describes the pattern of confined or insane women in 19th-century fiction.', question: 'What does this feminist critical concept reveal?', answer: 'Female characters\' madness often represents rage against patriarchal confinement that the text cannot express directly', options: ['Female characters\' madness often represents rage against patriarchal confinement that the text cannot express directly', 'Victorian women had more mental illness', 'Attics were dangerous places', 'Authors lacked medical knowledge'] },
        { prompt: 'In examining the Western literary canon, feminist critics note the historical underrepresentation of women authors.', question: 'What is the primary feminist critique of canon formation?', answer: 'The canon reflects patriarchal power structures that excluded and devalued women\'s literary contributions', options: ['The canon reflects patriarchal power structures that excluded and devalued women\'s literary contributions', 'Women did not write before 1900', 'The canon is purely merit-based', 'Only male authors are worth studying'] },
      ],
    },
    'marxist-reading': {
      type: 'approach-match', instruction: 'Apply Marxist literary criticism to the passage or scenario.',
      items: [
        { prompt: 'In Dickens\'s Hard Times, Coketown is described as a place of "machinery and tall chimneys, out of which interminable serpents of smoke trailed themselves for ever and ever."', question: 'How does a Marxist reading interpret this description?', answer: 'The industrial landscape represents capitalism\'s dehumanizing exploitation of labor, with the serpent imagery suggesting its insidious nature', options: ['The industrial landscape represents capitalism\'s dehumanizing exploitation of labor, with the serpent imagery suggesting its insidious nature', 'Dickens liked describing factories', 'The passage is about environmental science', 'Coketown is a pleasant place'] },
        { prompt: 'In The Great Gatsby, Gatsby\'s mansion, lavish parties, and pursuit of Daisy represent the American Dream.', question: 'What does a Marxist reading reveal about the American Dream?', answer: 'It is an ideological construct that masks class inequality and the impossibility of true social mobility under capitalism', options: ['It is an ideological construct that masks class inequality and the impossibility of true social mobility under capitalism', 'Hard work always leads to success', 'Gatsby is a role model', 'The parties represent genuine community'] },
        { prompt: 'The concept of "commodity fetishism" in literary analysis examines how characters and readers relate to material objects.', question: 'What does commodity fetishism reveal in literature?', answer: 'Objects in fiction often obscure the exploited labor that produced them, reflecting capitalism\'s mystification of social relations', options: ['Objects in fiction often obscure the exploited labor that produced them, reflecting capitalism\'s mystification of social relations', 'Characters enjoy shopping', 'Authors describe objects for decoration', 'Fetishism is a psychological disorder'] },
        { prompt: 'In Steinbeck\'s The Grapes of Wrath, the Joad family is displaced from their land by corporate farming interests.', question: 'How does a Marxist reading frame this displacement?', answer: 'It illustrates the process of proletarianization as capital accumulation dispossesses small landowners', options: ['It illustrates the process of proletarianization as capital accumulation dispossesses small landowners', 'The Joads made poor farming decisions', 'It is a story about road trips', 'The dust storms were purely natural events'] },
        { prompt: 'Raymond Williams argues that literature both reflects and shapes the "structure of feeling" of its historical moment.', question: 'What is the Marxist significance of "structure of feeling"?', answer: 'Literature captures emergent class consciousness and social tensions that have not yet been formally articulated', options: ['Literature captures emergent class consciousness and social tensions that have not yet been formally articulated', 'Literature is only about emotions', 'Feelings have no political dimension', 'Williams was a psychologist'] },
        { prompt: 'The publishing industry determines which books reach readers, influencing literary taste and canon formation.', question: 'What does a Marxist analysis of publishing reveal?', answer: 'The material conditions of cultural production (who owns presses, who profits) shape which voices and ideologies circulate', options: ['The material conditions of cultural production (who owns presses, who profits) shape which voices and ideologies circulate', 'Publishers are neutral curators', 'All books are equally available', 'Literary merit alone determines publication'] },
      ],
    },
  },
  'advanced': {
    'postcolonial-analysis': {
      type: 'approach-match', instruction: 'Apply postcolonial literary criticism to the passage or scenario.',
      items: [
        { prompt: 'In Chinua Achebe\'s Things Fall Apart, the novel presents Igbo culture as complex and sophisticated before the arrival of European missionaries.', question: 'What is the postcolonial significance of this narrative strategy?', answer: 'It challenges the colonial narrative of Africa as a "blank darkness" by centering indigenous cultural complexity', options: ['It challenges the colonial narrative of Africa as a "blank darkness" by centering indigenous cultural complexity', 'It is a historical textbook about Nigeria', 'Achebe romanticizes pre-colonial life', 'The novel supports missionary work'] },
        { prompt: 'Edward Said\'s concept of "Orientalism" describes how Western literature and scholarship constructed the "East" as exotic, irrational, and inferior.', question: 'What does Orientalism reveal about literary representation?', answer: 'Western literary representations of the East served to justify imperial domination by constructing a binary of civilized West vs. primitive East', options: ['Western literary representations of the East served to justify imperial domination by constructing a binary of civilized West vs. primitive East', 'Eastern literature is inferior', 'The West accurately described the East', 'Said disliked Eastern cultures'] },
        { prompt: 'Gayatri Spivak asks "Can the Subaltern Speak?" in her influential essay on voice and representation in colonial contexts.', question: 'What is the central postcolonial concern of this question?', answer: 'Colonized subjects, especially women, are structurally prevented from being heard within dominant discourse frameworks', options: ['Colonized subjects, especially women, are structurally prevented from being heard within dominant discourse frameworks', 'Subaltern people cannot physically speak', 'Only academics should speak', 'Language barriers prevent communication'] },
        { prompt: 'In Jean Rhys\'s Wide Sargasso Sea, the story of Bertha Mason from Jane Eyre is retold from the perspective of the Creole woman.', question: 'How does this rewriting function as postcolonial critique?', answer: 'It gives voice to the silenced colonial subject, exposing how Bronte\'s novel participated in dehumanizing the colonized Other', options: ['It gives voice to the silenced colonial subject, exposing how Bronte\'s novel participated in dehumanizing the colonized Other', 'It is a simple prequel to Jane Eyre', 'Rhys disagreed with Bronte\'s writing style', 'It is a romance novel set in the Caribbean'] },
        { prompt: 'Homi Bhabha\'s concept of "hybridity" describes the cultural mixing that occurs in colonial and postcolonial contexts.', question: 'What does hybridity suggest about colonial cultural dynamics?', answer: 'Colonial encounters produce new, hybrid cultural forms that destabilize the colonizer\'s claim to cultural purity and authority', options: ['Colonial encounters produce new, hybrid cultural forms that destabilize the colonizer\'s claim to cultural purity and authority', 'Cultures should remain separate', 'Hybridity only applies to biology', 'Colonial cultures were unchanged by colonialism'] },
        { prompt: 'In Derek Walcott\'s poetry, the Caribbean landscape is layered with references to both African heritage and European literary traditions.', question: 'How does a postcolonial reading interpret this layering?', answer: 'It enacts the complex negotiation of multiple cultural inheritances that defines postcolonial identity', options: ['It enacts the complex negotiation of multiple cultural inheritances that defines postcolonial identity', 'Walcott could not choose between traditions', 'Caribbean poetry must reference Europe', 'It shows confusion about identity'] },
      ],
    },
    'queer-theory-app': {
      type: 'approach-match', instruction: 'Apply queer theory to the literary passage or scenario.',
      items: [
        { prompt: 'In examining the intense friendship between characters in Victorian novels, queer theorists note the instability of categories like "friendship" and "romance."', question: 'What does queer theory reveal about Victorian literary relationships?', answer: 'The boundary between homosocial bonds and homoerotic desire was fluid, and heteronormative readings obscure queer possibilities in these texts', options: ['The boundary between homosocial bonds and homoerotic desire was fluid, and heteronormative readings obscure queer possibilities in these texts', 'Victorian friendships were purely platonic', 'Queer theory is anachronistic for this period', 'All Victorian characters were heterosexual'] },
        { prompt: 'Judith Butler\'s concept of "gender performativity" argues that gender is not an innate identity but a repeated performance of culturally prescribed acts.', question: 'How does this concept apply to literary analysis?', answer: 'Characters\' gender expressions can be read as performances that either reinforce or subvert normative gender categories', options: ['Characters\' gender expressions can be read as performances that either reinforce or subvert normative gender categories', 'All characters are acting on a stage', 'Gender is biologically determined in literature', 'Butler is a theater critic'] },
        { prompt: 'In Shakespeare\'s comedies, cross-dressing characters like Viola (Twelfth Night) and Rosalind (As You Like It) create layers of gender play.', question: 'How does queer theory read these cross-dressing plots?', answer: 'They destabilize fixed gender and sexual categories, revealing desire as fluid and identity as performative', options: ['They destabilize fixed gender and sexual categories, revealing desire as fluid and identity as performative', 'They are simple plot devices for comedy', 'Women had to disguise themselves for safety', 'Shakespeare lacked female actors so it was practical'] },
        { prompt: 'Eve Kosofsky Sedgwick\'s "homosocial continuum" describes a spectrum from male bonding to homoerotic desire in literature.', question: 'What does this concept reveal about canonical male friendships in literature?', answer: 'Male bonds in literature often contain homoerotic tension that is managed through triangulation with female characters', options: ['Male bonds in literature often contain homoerotic tension that is managed through triangulation with female characters', 'Male friendships are never homoerotic', 'Women characters are always central', 'Sedgwick studies only modern literature'] },
        { prompt: 'The term "queer reading" involves reading texts against the grain to uncover non-normative sexualities and gender expressions the text may suppress or encode.', question: 'What is the goal of reading "against the grain"?', answer: 'To reveal how texts both produce and resist heteronormativity, uncovering silenced or coded queer presences', options: ['To reveal how texts both produce and resist heteronormativity, uncovering silenced or coded queer presences', 'To misread texts intentionally', 'To ignore the author\'s intent entirely', 'To only study openly queer authors'] },
        { prompt: 'In The Picture of Dorian Gray, Wilde encodes homoerotic desire through aestheticism and the relationship between Basil Hallward and Dorian.', question: 'How does queer theory approach the coding in this novel?', answer: 'The aesthetic language and secrecy surrounding the portrait function as a displaced expression of same-sex desire under conditions of legal and social prohibition', options: ['The aesthetic language and secrecy surrounding the portrait function as a displaced expression of same-sex desire under conditions of legal and social prohibition', 'The novel is purely about art appreciation', 'Basil and Dorian are just friends', 'Wilde wrote without any personal relevance'] },
      ],
    },
    'ecocriticism': {
      type: 'approach-match', instruction: 'Apply ecocritical analysis to the passage or scenario.',
      items: [
        { prompt: 'In Thoreau\'s Walden, the narrator retreats to the woods to "live deliberately" and discover "the essential facts of life."', question: 'How does ecocriticism read this retreat?', answer: 'It represents a counter-narrative to industrial capitalism, positioning nature as a site of authentic experience against commodified society', options: ['It represents a counter-narrative to industrial capitalism, positioning nature as a site of authentic experience against commodified society', 'Thoreau simply enjoyed camping', 'It is an escape from personal problems', 'Nature is merely a backdrop'] },
        { prompt: 'In Cormac McCarthy\'s The Road, a father and son traverse a post-apocalyptic landscape devoid of plant and animal life.', question: 'What does ecocriticism reveal about this landscape?', answer: 'The dead environment is not merely setting but the central horror: ecological collapse as the destruction of all meaning and possibility', options: ['The dead environment is not merely setting but the central horror: ecological collapse as the destruction of all meaning and possibility', 'It is a realistic weather report', 'The landscape is irrelevant to the plot', 'McCarthy dislikes nature descriptions'] },
        { prompt: 'The pastoral tradition in literature idealizes rural landscapes as peaceful and harmonious spaces opposed to corrupt urban life.', question: 'What is the ecocritical problem with the pastoral?', answer: 'It often erases the labor that shapes landscapes and romanticizes nature in ways that obscure actual environmental degradation', options: ['It often erases the labor that shapes landscapes and romanticizes nature in ways that obscure actual environmental degradation', 'Pastoral literature is always environmentally accurate', 'Rural life is always peaceful', 'There is no problem with the pastoral'] },
        { prompt: 'In Rachel Carson\'s Silent Spring, the absence of birdsong signals the devastating effects of pesticides on ecosystems.', question: 'How does this work function as ecological narrative?', answer: 'It uses the literary power of absence and silence to make invisible environmental destruction viscerally felt', options: ['It uses the literary power of absence and silence to make invisible environmental destruction viscerally felt', 'It is a birdwatching guide', 'Carson was against all technology', 'The book is purely scientific with no literary qualities'] },
        { prompt: 'The concept of the "Anthropocene" has entered literary studies as a framework for understanding literature in the age of human-caused environmental change.', question: 'How does Anthropocene thinking change literary analysis?', answer: 'It challenges the nature/culture divide in literature and asks how narratives can represent planetary-scale processes and nonhuman agency', options: ['It challenges the nature/culture divide in literature and asks how narratives can represent planetary-scale processes and nonhuman agency', 'It only applies to science fiction', 'Literature is irrelevant to environmental issues', 'The Anthropocene is a geological term with no literary application'] },
        { prompt: 'In Barbara Kingsolver\'s Prodigal Summer, intertwined narratives of human relationships are paralleled by ecological relationships among species.', question: 'What does this structural choice suggest ecocritically?', answer: 'Human stories are embedded within and inseparable from ecological systems, challenging anthropocentric narrative conventions', options: ['Human stories are embedded within and inseparable from ecological systems, challenging anthropocentric narrative conventions', 'Kingsolver writes nature documentaries', 'The parallel is coincidental', 'Animals are used as simple metaphors for human emotions'] },
      ],
    },
    'comparative-lit': {
      type: 'close-reading-q', instruction: 'Analyze the comparative literary relationship described.',
      items: [
        { passage: 'Both Dostoevsky\'s Crime and Punishment and Camus\'s The Stranger feature protagonists who commit murders, yet their philosophical frameworks differ radically.', question: 'What is the key comparative distinction?', answer: 'Raskolnikov operates within a moral universe where guilt and redemption are possible, while Meursault inhabits an absurdist world indifferent to moral meaning', options: ['Raskolnikov operates within a moral universe where guilt and redemption are possible, while Meursault inhabits an absurdist world indifferent to moral meaning', 'Both characters feel identical guilt', 'Neither character is morally significant', 'The murders are unrelated to the philosophical themes'] },
        { passage: 'Magical realism as practiced by Gabriel Garcia Marquez in Colombia and Salman Rushdie in India shares a technique of blending the fantastical with the everyday.', question: 'What comparative insight emerges from examining magical realism across these postcolonial contexts?', answer: 'Both deploy the marvelous to challenge Western rationalist epistemology and narrate histories that realist modes cannot adequately capture', options: ['Both deploy the marvelous to challenge Western rationalist epistemology and narrate histories that realist modes cannot adequately capture', 'They both simply enjoy fantasy writing', 'Magical realism is identical everywhere', 'This technique has no political significance'] },
        { passage: 'Sophocles\' Antigone and Seamus Heaney\'s The Burial at Thebes (2004 translation/adaptation) both address the conflict between state law and moral conscience.', question: 'What does Heaney\'s adaptation reveal comparatively?', answer: 'By adapting the ancient text during the Iraq War era, Heaney shows how classical literature can be reactivated to interrogate contemporary political crises', options: ['By adapting the ancient text during the Iraq War era, Heaney shows how classical literature can be reactivated to interrogate contemporary political crises', 'Heaney simply translated the Greek accurately', 'Ancient and modern politics are unrelated', 'The adaptation has no contemporary relevance'] },
        { passage: 'The tradition of the "world novel" (Moretti) suggests that the novel form spread globally from European centers but was locally adapted.', question: 'What is the central debate in comparative literature about the novel\'s global spread?', answer: 'Whether the novel is a Western form imposed through cultural imperialism or a flexible genre genuinely reinvented by diverse literary traditions', options: ['Whether the novel is a Western form imposed through cultural imperialism or a flexible genre genuinely reinvented by diverse literary traditions', 'The novel was invented simultaneously everywhere', 'Only European novels matter', 'Form is irrelevant to cultural analysis'] },
        { passage: 'Kafka\'s Metamorphosis and Ovid\'s Metamorphoses both center on transformation, separated by nearly two millennia.', question: 'What does a comparative reading reveal about the function of metamorphosis across these eras?', answer: 'In Ovid, transformation is mythic and often meaningful within a cosmic order; in Kafka, it is absurd, unexplained, and existentially isolating', options: ['In Ovid, transformation is mythic and often meaningful within a cosmic order; in Kafka, it is absurd, unexplained, and existentially isolating', 'Both treat transformation identically', 'Kafka was directly imitating Ovid', 'Metamorphosis is always a positive symbol'] },
        { passage: 'The haiku tradition in Japanese poetry and Imagist poetry in early 20th-century English (Pound, H.D.) both prize concision and vivid imagery.', question: 'What does comparative analysis reveal about this cross-cultural literary influence?', answer: 'Imagism selectively appropriated haiku aesthetics, but the cultural contexts of Zen Buddhism and Western modernist fragmentation produce fundamentally different poetic epistemologies', options: ['Imagism selectively appropriated haiku aesthetics, but the cultural contexts of Zen Buddhism and Western modernist fragmentation produce fundamentally different poetic epistemologies', 'Haiku and Imagism are identical', 'There is no connection between the traditions', 'Pound invented the haiku form'] },
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

class Literature {
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
        prereading: 'Activate schema: discuss topic, preview key terms and context',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
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
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) lit.setLevel(id, level); out({ action: 'start', profile: lit.getProfile(id), nextSkills: lit.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(lit.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(lit.generateExercise(level, skill, 5)); } else { const n = lit.getNextSkills(id, 1).next; out(n.length ? lit.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(lit.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(lit.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(lit.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(lit.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(lit.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? lit.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(lit.setLevel(id, l)); break; }
      case 'students': { out(lit.listStudents()); break; }
      default: out({ usage: 'node literature.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
