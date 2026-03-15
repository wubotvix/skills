// College ELA Critical Theory Lab (Intro-Advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-critical-theory');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'formalism': ['new-criticism', 'close-reading-formalist'],
    'identity-theories': ['reader-response', 'basic-marxist', 'basic-feminist'],
  },
  'intermediate': {
    'formalism': ['post-structuralism', 'deconstruction'],
    'identity-theories': ['psychoanalytic', 'postcolonial'],
    'contemporary-theories': ['new-historicism'],
  },
  'advanced': {
    'identity-theories': ['queer-theory'],
    'contemporary-theories': ['ecocriticism', 'posthumanism', 'theory-synthesis'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'new-criticism': {
      type: 'theory-id', instruction: 'Read the passage and identify the critical approach.',
      items: [
        { passage: 'The critic argues that the poem must be analyzed solely on the basis of its language, imagery, and structure, without reference to the author\'s biography or historical context.', question: 'What critical approach is this?', answer: 'New Criticism', options: ['New Criticism', 'Historicism', 'Psychoanalytic criticism', 'Reader-response'] },
        { passage: 'Wimsatt and Beardsley\'s "The Intentional Fallacy" argues that the author\'s intended meaning is irrelevant to the interpretation of a text.', question: 'What school of thought does this represent?', answer: 'New Criticism — the text is autonomous from authorial intent', options: ['New Criticism — the text is autonomous from authorial intent', 'Romantic criticism', 'Biographical criticism', 'Deconstruction'] },
        { passage: 'The critic identifies a paradox in the poem\'s final stanza: the speaker claims to reject love while the imagery of blooming flowers contradicts that claim.', question: 'What New Critical concept is the critic applying?', answer: 'Irony and paradox — tension between stated meaning and implied meaning', options: ['Irony and paradox — tension between stated meaning and implied meaning', 'Marxist contradiction', 'Freudian repression', 'Postcolonial ambivalence'] },
        { passage: 'Cleanth Brooks argues that a poem\'s meaning cannot be paraphrased — to reduce it to a prose summary is to destroy what makes it a poem.', question: 'What is this principle called?', answer: 'The heresy of paraphrase', options: ['The heresy of paraphrase', 'The death of the author', 'The anxiety of influence', 'The willing suspension of disbelief'] },
        { passage: 'The critic treats the short story as a "verbal icon" — a self-contained artifact whose meaning is generated entirely by the relationships among its internal elements.', question: 'What approach treats the text as a self-contained object?', answer: 'New Criticism — formalist close reading', options: ['New Criticism — formalist close reading', 'Cultural studies', 'New Historicism', 'Postcolonial criticism'] },
        { passage: 'The "Affective Fallacy" warns critics against confusing the poem itself with its emotional effects on the reader.', question: 'Who articulated this concept?', answer: 'Wimsatt and Beardsley, as part of New Criticism', options: ['Wimsatt and Beardsley, as part of New Criticism', 'Jacques Derrida', 'Michel Foucault', 'Stanley Fish'] },
      ],
    },
    'close-reading-formalist': {
      type: 'passage-application', instruction: 'Apply formalist close reading to the passage.',
      items: [
        { passage: '"Do I dare / Disturb the universe? / In a minute there is time / For decisions and revisions which a minute will reverse." — T.S. Eliot', question: 'What formal tension does the passage create?', answer: 'The grandeur of "disturb the universe" is undercut by the indecisive tone and the reversal in the final line', options: ['The grandeur of "disturb the universe" is undercut by the indecisive tone and the reversal in the final line', 'The passage is purely hopeful', 'The rhyme scheme creates joy', 'There is no tension'] },
        { passage: '"I have measured out my life with coffee spoons." — T.S. Eliot', question: 'What does the metaphor reveal through close reading?', answer: 'The domestic triviality of "coffee spoons" contrasts with the enormity of measuring a life — suggesting paralysis and smallness', options: ['The domestic triviality of "coffee spoons" contrasts with the enormity of measuring a life — suggesting paralysis and smallness', 'The speaker loves coffee', 'It is literal measurement', 'The speaker is a chef'] },
        { passage: '"Because I could not stop for Death — / He kindly stopped for me —" — Emily Dickinson', question: 'What formal device is at work?', answer: 'Personification of Death as a courteous gentleman creates ironic tension with the subject matter', options: ['Personification of Death as a courteous gentleman creates ironic tension with the subject matter', 'Death is portrayed negatively', 'The speaker is afraid', 'There is no figurative language'] },
        { passage: 'The poem uses enjambment at every line break, forcing the reader forward without pause, mimicking the breathless urgency of the speaker.', question: 'What is the relationship between form and content here?', answer: 'The form (enjambment) enacts the content (urgency) — form mirrors meaning', options: ['The form (enjambment) enacts the content (urgency) — form mirrors meaning', 'The enjambment is accidental', 'Form and content are unrelated', 'The poem is poorly structured'] },
        { passage: 'A sonnet about imprisonment uses the 14-line form itself as a metaphor for confinement — the strict rhyme scheme becomes the bars of a cell.', question: 'What is this relationship called?', answer: 'Organic form — where the structure of the poem embodies its theme', options: ['Organic form — where the structure of the poem embodies its theme', 'Mechanical form', 'Free verse', 'Accidental correspondence'] },
        { passage: 'The critic notes that the word "grave" appears three times in the poem: as adjective (serious), noun (burial site), and verb (to engrave). Each usage deepens the thematic resonance.', question: 'What close-reading technique is applied here?', answer: 'Tracking polysemy — how multiple meanings of a single word create layered significance', options: ['Tracking polysemy — how multiple meanings of a single word create layered significance', 'Etymology only', 'Rhyme analysis', 'Counting word frequency'] },
      ],
    },
    'reader-response': {
      type: 'theory-id', instruction: 'Identify the reader-response concept or theorist.',
      items: [
        { passage: 'The meaning of a text is not fixed in the words on the page but is created in the act of reading — the reader is an active participant in meaning-making.', question: 'What critical school is this?', answer: 'Reader-response theory', options: ['Reader-response theory', 'New Criticism', 'Structuralism', 'Deconstruction'] },
        { passage: 'Stanley Fish argues that "interpretive communities" — groups of readers who share assumptions and strategies — determine what a text means.', question: 'What is Fish\'s key concept?', answer: 'Interpretive communities shape textual meaning', options: ['Interpretive communities shape textual meaning', 'The author determines meaning', 'Texts have a single correct reading', 'Meaning is entirely individual'] },
        { passage: 'Wolfgang Iser describes the "gaps" or "blanks" in a text that the reader must fill in through imagination and inference.', question: 'What is Iser\'s concept?', answer: 'Textual gaps — the reader completes the text through active participation', options: ['Textual gaps — the reader completes the text through active participation', 'The intentional fallacy', 'The heresy of paraphrase', 'Deconstruction'] },
        { passage: 'Louise Rosenblatt distinguishes between "efferent" reading (reading for information) and "aesthetic" reading (reading for experience).', question: 'What is the key distinction?', answer: 'Efferent reading extracts information; aesthetic reading lives through the experience', options: ['Efferent reading extracts information; aesthetic reading lives through the experience', 'Fast vs. slow reading', 'Fiction vs. nonfiction', 'Silent vs. oral reading'] },
        { passage: 'A student says: "When I read this poem about loss, I think of my grandmother." The teacher responds: "That personal connection is part of how you make meaning."', question: 'What theoretical framework validates this approach?', answer: 'Reader-response — personal experience is part of interpretation', options: ['Reader-response — personal experience is part of interpretation', 'New Criticism — only the text matters', 'Formalism — biography is irrelevant', 'Structuralism — systems determine meaning'] },
        { passage: 'The same novel is read as a feminist triumph in one classroom and as a conservative cautionary tale in another. Neither reading is "wrong."', question: 'What does this illustrate?', answer: 'Different interpretive communities produce different valid readings', options: ['Different interpretive communities produce different valid readings', 'One reading must be correct', 'The text has no meaning', 'The author failed to communicate'] },
      ],
    },
    'basic-marxist': {
      type: 'theory-id', instruction: 'Identify the Marxist critical concept.',
      items: [
        { passage: 'The critic examines how the novel naturalizes class hierarchy — the wealthy characters are portrayed as inherently more refined, while working-class characters are comic or criminal.', question: 'What Marxist concept does this analysis reveal?', answer: 'Ideology — the text naturalizes class inequality as if it were inevitable', options: ['Ideology — the text naturalizes class inequality as if it were inevitable', 'Formalist analysis', 'Psychoanalytic reading', 'Ecocriticism'] },
        { passage: 'Marx\'s concept of "base and superstructure" suggests that economic relations (base) shape cultural productions like literature (superstructure).', question: 'What does this model claim about literature?', answer: 'Literature is shaped by and reflects the economic conditions of its production', options: ['Literature is shaped by and reflects the economic conditions of its production', 'Literature is purely aesthetic', 'Literature is independent of economics', 'Only political texts have economic content'] },
        { passage: 'The critic reads the 19th-century realist novel as a product of the bourgeoisie — its form (individual protagonist, linear progress, property acquisition) reflects bourgeois values.', question: 'What is this type of analysis?', answer: 'Marxist critique of literary form as ideological', options: ['Marxist critique of literary form as ideological', 'New Critical formalism', 'Psychoanalytic criticism', 'Reader-response theory'] },
        { passage: 'Antonio Gramsci\'s concept of "hegemony" describes how the ruling class maintains power not through force alone but through cultural consensus — literature can be a tool of hegemonic control.', question: 'What is hegemony?', answer: 'Domination through cultural consent rather than coercion', options: ['Domination through cultural consent rather than coercion', 'Military dictatorship', 'Democratic voting', 'Economic competition'] },
        { passage: 'Louis Althusser argues that literature functions as an "ideological state apparatus" — it interpellates subjects, calling them into specific social roles.', question: 'What does "interpellation" mean in this context?', answer: 'The process by which ideology addresses individuals and constitutes them as subjects', options: ['The process by which ideology addresses individuals and constitutes them as subjects', 'A police interrogation', 'A literary interview', 'A form of translation'] },
        { passage: 'The critic asks: "Who benefits from this story being told this way? Whose labor is invisible? Whose wealth is unexplained?"', question: 'What critical lens generates these questions?', answer: 'Marxist criticism — interrogating class, labor, and economic power in the text', options: ['Marxist criticism — interrogating class, labor, and economic power in the text', 'Formalism', 'Reader-response', 'Ecocriticism'] },
      ],
    },
    'basic-feminist': {
      type: 'theory-id', instruction: 'Identify the feminist critical concept or theorist.',
      items: [
        { passage: 'Simone de Beauvoir wrote: "One is not born, but rather becomes, a woman" — arguing that femininity is socially constructed rather than biologically determined.', question: 'What concept does this articulate?', answer: 'Gender as social construction', options: ['Gender as social construction', 'Biological essentialism', 'Psychoanalytic feminism', 'Liberal individualism'] },
        { passage: 'The critic examines how women in the Victorian novel are defined entirely through their relationships to men — as daughters, wives, or mothers, never as autonomous agents.', question: 'What feminist critical approach is this?', answer: 'Images of women criticism — analyzing how female characters are represented', options: ['Images of women criticism — analyzing how female characters are represented', 'New Criticism', 'Marxist criticism', 'Deconstruction'] },
        { passage: 'Virginia Woolf\'s "A Room of One\'s Own" argues that women need financial independence and private space to write — material conditions shape literary production.', question: 'What does Woolf connect?', answer: 'Material conditions (money, space) to the possibility of women\'s creative work', options: ['Material conditions (money, space) to the possibility of women\'s creative work', 'Writing talent to gender', 'Education to class', 'Inspiration to nature'] },
        { passage: 'Elaine Showalter\'s "gynocriticism" focuses not on how women are depicted in men\'s writing but on the traditions, themes, and genres of women\'s own literary production.', question: 'What does gynocriticism study?', answer: 'Women\'s writing as its own tradition with distinct concerns', options: ['Women\'s writing as its own tradition with distinct concerns', 'Male representations of women', 'Gender-neutral close reading', 'Universal literary themes'] },
        { passage: 'Sandra Gilbert and Susan Gubar\'s "The Madwoman in the Attic" examines how 19th-century women writers expressed rage and creativity through doubles — the angel and the monster.', question: 'What is the central argument?', answer: 'Women writers used monstrous female characters to express the anger their culture suppressed', options: ['Women writers used monstrous female characters to express the anger their culture suppressed', 'Women writers preferred horror genres', 'Madness is a literary theme only', 'Victorian women were all angry'] },
        { passage: 'The critic notes that the literary canon has historically excluded women, people of color, and LGBTQ+ writers — the canon itself is a political construction.', question: 'What feminist concern does this raise?', answer: 'Canon formation as a site of power — who is included and excluded, and why', options: ['Canon formation as a site of power — who is included and excluded, and why', 'The canon is objectively correct', 'Only aesthetic quality matters', 'All literature is equal'] },
      ],
    },
  },
  'intermediate': {
    'post-structuralism': {
      type: 'theory-id', instruction: 'Identify the post-structuralist concept or theorist.',
      items: [
        { passage: 'Saussure argued that the relationship between signifier (word) and signified (concept) is arbitrary. Post-structuralists take this further: meaning is never fixed but always deferred.', question: 'What post-structuralist principle follows from Saussure?', answer: 'The instability of meaning — signs do not have fixed referents', options: ['The instability of meaning — signs do not have fixed referents', 'Language perfectly represents reality', 'Meaning is determined by the author', 'Signs are natural'] },
        { passage: 'Roland Barthes declared "The Death of the Author" — arguing that the text\'s meaning is produced by the reader, not controlled by the author\'s intention.', question: 'What does "The Death of the Author" claim?', answer: 'The author\'s biography and intention do not govern textual meaning', options: ['The author\'s biography and intention do not govern textual meaning', 'Authors are literally dying', 'Only authors can interpret texts', 'Reading is impossible'] },
        { passage: 'Barthes distinguishes between "readerly" (lisible) texts that demand passive consumption and "writerly" (scriptible) texts that require the reader to actively produce meaning.', question: 'Which type of text does Barthes value more?', answer: 'The writerly text — because the reader becomes a producer rather than a consumer', options: ['The writerly text — because the reader becomes a producer rather than a consumer', 'The readerly text', 'Both equally', 'Neither'] },
        { passage: 'Foucault asks not "What does this text mean?" but "What are the conditions that made this text possible? What systems of power enabled it to be written and circulated?"', question: 'What is Foucault\'s approach?', answer: 'Discourse analysis — examining the power structures that produce and regulate knowledge', options: ['Discourse analysis — examining the power structures that produce and regulate knowledge', 'Close reading', 'Biographical criticism', 'Reader-response'] },
        { passage: 'Post-structuralism challenges the idea of binary oppositions (male/female, nature/culture, speech/writing) by showing that each term depends on and contains its opposite.', question: 'What happens to binary oppositions under post-structuralist analysis?', answer: 'They are destabilized — the hierarchy between terms is shown to be constructed', options: ['They are destabilized — the hierarchy between terms is shown to be constructed', 'They are confirmed', 'They are ignored', 'They are reversed permanently'] },
        { passage: 'Julia Kristeva introduces "intertextuality" — the idea that every text is a mosaic of quotations, absorbing and transforming other texts.', question: 'What does intertextuality mean?', answer: 'No text exists in isolation — all texts are woven from prior texts', options: ['No text exists in isolation — all texts are woven from prior texts', 'Plagiarism is acceptable', 'Only original texts matter', 'Texts reference only themselves'] },
      ],
    },
    'deconstruction': {
      type: 'theory-id', instruction: 'Identify the deconstructive concept or practice.',
      items: [
        { passage: 'Jacques Derrida argues that Western philosophy privileges speech over writing, presence over absence, and identity over difference. Deconstruction exposes and overturns these hierarchies.', question: 'What is Derrida\'s core project?', answer: 'Exposing and destabilizing the hierarchical binary oppositions that structure Western thought', options: ['Exposing and destabilizing the hierarchical binary oppositions that structure Western thought', 'Defending Western philosophy', 'Replacing philosophy with literature', 'Creating new hierarchies'] },
        { passage: 'Derrida\'s concept of "différance" — a deliberate misspelling — captures both "to differ" and "to defer," suggesting meaning is always deferred, never fully present.', question: 'What does "différance" describe?', answer: 'The endless deferral of meaning — we never arrive at a final signified', options: ['The endless deferral of meaning — we never arrive at a final signified', 'A spelling error', 'The difference between languages', 'A type of literary genre'] },
        { passage: 'A deconstructive reading finds the moment where a text contradicts its own logic — where its argument undermines itself through its own language.', question: 'What is the critic looking for?', answer: 'Aporia — internal contradictions that reveal the text\'s instability', options: ['Aporia — internal contradictions that reveal the text\'s instability', 'Plot holes', 'Grammatical errors', 'The author\'s intention'] },
        { passage: 'Derrida writes: "There is nothing outside the text" (il n\'y a pas de hors-texte). This does not mean the real world doesn\'t exist, but that we have no access to meaning outside systems of signs.', question: 'What does this famous phrase mean?', answer: 'All experience is mediated by language and signification — there is no unmediated access to reality', options: ['All experience is mediated by language and signification — there is no unmediated access to reality', 'Only books exist', 'The real world is imaginary', 'Reading is the only activity'] },
        { passage: 'The "supplement" in Derrida: something added to a complete whole that reveals the whole was never complete. Writing, for instance, is supposedly a supplement to speech — but it exposes that speech was never self-sufficient.', question: 'What does the logic of the supplement reveal?', answer: 'The original was never whole — the supplement exposes a lack that was always there', options: ['The original was never whole — the supplement exposes a lack that was always there', 'Additions are unnecessary', 'Writing is inferior to speech', 'Originals are always perfect'] },
        { passage: 'A deconstructive reading of a text celebrating "nature" might show how the text relies on cultural conventions to define what counts as "natural" — nature is always already a cultural construct.', question: 'What does this analysis demonstrate?', answer: 'The nature/culture binary collapses under scrutiny — each term depends on the other', options: ['The nature/culture binary collapses under scrutiny — each term depends on the other', 'Nature is more important than culture', 'Culture is artificial', 'The text is poorly written'] },
      ],
    },
    'psychoanalytic': {
      type: 'theory-id', instruction: 'Identify the psychoanalytic critical concept or theorist.',
      items: [
        { passage: 'The critic reads the recurring image of locked doors in the novel as a symbol of the protagonist\'s repressed trauma — what cannot be faced consciously returns symbolically.', question: 'What psychoanalytic concept is applied?', answer: 'Repression and the return of the repressed', options: ['Repression and the return of the repressed', 'Formalist symbolism', 'Marxist alienation', 'Postcolonial othering'] },
        { passage: 'Freud\'s analysis of Hamlet argues that Hamlet delays killing Claudius because Claudius has fulfilled Hamlet\'s own unconscious desire — to kill his father and possess his mother.', question: 'What concept does Freud apply to Hamlet?', answer: 'The Oedipus complex', options: ['The Oedipus complex', 'The death drive', 'The mirror stage', 'Interpellation'] },
        { passage: 'Jacques Lacan argues that the unconscious is "structured like a language" — it operates through metaphor (condensation) and metonymy (displacement).', question: 'What is Lacan\'s key insight?', answer: 'The unconscious follows linguistic structures — metaphor and metonymy', options: ['The unconscious follows linguistic structures — metaphor and metonymy', 'The unconscious is purely biological', 'Language is unconscious', 'Dreams are random'] },
        { passage: 'Lacan\'s "mirror stage" describes the moment when an infant recognizes its image in a mirror and identifies with a unified body — but this wholeness is an illusion, a "méconnaissance."', question: 'What does the mirror stage produce?', answer: 'A foundational misrecognition — the ego is built on an illusion of wholeness', options: ['A foundational misrecognition — the ego is built on an illusion of wholeness', 'Perfect self-knowledge', 'Physical coordination', 'Language acquisition'] },
        { passage: 'The critic argues that the text\'s "gaps" and "silences" — what it does not say — reveal unconscious anxieties that the surface narrative tries to suppress.', question: 'What is this reading practice called?', answer: 'Symptomatic reading — the text\'s silences are symptoms of repressed content', options: ['Symptomatic reading — the text\'s silences are symptoms of repressed content', 'Close reading', 'Summary', 'Surface reading'] },
        { passage: 'The uncanny (Freud\'s "unheimlich") describes the feeling when something familiar becomes strange — a recurring motif in Gothic literature.', question: 'What does "the uncanny" describe?', answer: 'The disturbing return of something repressed that was once familiar', options: ['The disturbing return of something repressed that was once familiar', 'Simple fear', 'Cultural difference', 'Supernatural events'] },
      ],
    },
    'postcolonial': {
      type: 'theory-id', instruction: 'Identify the postcolonial critical concept or theorist.',
      items: [
        { passage: 'Edward Said\'s "Orientalism" argues that the West constructed "the Orient" as an exotic, inferior Other in order to define and justify its own identity and imperial power.', question: 'What is Orientalism?', answer: 'A Western discourse that constructs the East as Other to legitimize colonial power', options: ['A Western discourse that constructs the East as Other to legitimize colonial power', 'The study of Eastern languages', 'Appreciation of Asian art', 'Travel writing about Asia'] },
        { passage: 'Gayatri Spivak asks: "Can the subaltern speak?" She argues that the voices of the colonized poor — especially women — are systematically excluded from both colonial and nationalist discourse.', question: 'What is Spivak\'s central concern?', answer: 'Whether the most marginalized subjects can represent themselves within dominant structures', options: ['Whether the most marginalized subjects can represent themselves within dominant structures', 'Whether people can speak foreign languages', 'Whether literature is oral or written', 'Whether scholars should travel'] },
        { passage: 'Homi Bhabha\'s concept of "hybridity" describes the cultural mixing that occurs in colonial contact zones — the colonized subject is neither fully colonized nor fully resistant.', question: 'What does hybridity challenge?', answer: 'The idea that colonial identities are pure or fixed — hybridity is a "third space"', options: ['The idea that colonial identities are pure or fixed — hybridity is a "third space"', 'Biological race theory', 'Literary genre boundaries', 'Linguistic purity'] },
        { passage: 'Chinua Achebe\'s critique of Joseph Conrad\'s "Heart of Darkness" argues that the novel dehumanizes Africans by using Africa as a mere backdrop for European psychological drama.', question: 'What postcolonial critique does Achebe level?', answer: 'Conrad uses Africa as a prop for European self-exploration, denying African humanity and agency', options: ['Conrad uses Africa as a prop for European self-exploration, denying African humanity and agency', 'Conrad\'s prose is poor', 'The novel is too long', 'Conrad should have set it in Europe'] },
        { passage: 'The concept of "writing back" describes postcolonial literature that responds to, revises, or subverts canonical Western texts — such as Jean Rhys\'s "Wide Sargasso Sea" rewriting "Jane Eyre."', question: 'What does "writing back" accomplish?', answer: 'It gives voice to characters silenced or marginalized in the original text', options: ['It gives voice to characters silenced or marginalized in the original text', 'It copies the original', 'It destroys the original', 'It is fan fiction'] },
        { passage: 'Frantz Fanon\'s "Black Skin, White Masks" examines the psychological damage of colonialism — how the colonized internalize the colonizer\'s values and learn to see themselves through the colonizer\'s gaze.', question: 'What does Fanon analyze?', answer: 'The psychology of colonial subjugation — internalized inferiority', options: ['The psychology of colonial subjugation — internalized inferiority', 'Fashion in colonial Africa', 'Theatrical masks', 'Dermatology'] },
      ],
    },
    'new-historicism': {
      type: 'theory-id', instruction: 'Identify the New Historicist concept or practice.',
      items: [
        { passage: 'Stephen Greenblatt reads Shakespeare not just as literary art but alongside court documents, medical texts, and travel narratives from the same period — literature is one discourse among many.', question: 'What method is this?', answer: 'New Historicism — reading literary and non-literary texts together as part of the same cultural system', options: ['New Historicism — reading literary and non-literary texts together as part of the same cultural system', 'New Criticism — only the literary text matters', 'Formalism', 'Psychoanalytic criticism'] },
        { passage: 'New Historicism rejects the idea that literature simply "reflects" its historical context. Instead, literature actively participates in shaping, negotiating, and sometimes subverting the power structures of its time.', question: 'What is the relationship between literature and history for New Historicists?', answer: 'Literature is not a passive reflection but an active participant in cultural power dynamics', options: ['Literature is not a passive reflection but an active participant in cultural power dynamics', 'Literature is a mirror of history', 'Literature is independent of history', 'History is irrelevant to interpretation'] },
        { passage: 'Greenblatt\'s concept of "self-fashioning" describes how Renaissance individuals constructed their identities through cultural and literary practices, always in relation to authority and power.', question: 'What is "self-fashioning"?', answer: 'The construction of identity through cultural practices within systems of power', options: ['The construction of identity through cultural practices within systems of power', 'Personal fashion choices', 'Writing an autobiography', 'Acting in plays'] },
        { passage: 'A New Historicist essay on "The Tempest" places the play alongside contemporary accounts of the Virginia Colony shipwreck, arguing that the play participates in debates about colonization.', question: 'What New Historicist principle is demonstrated?', answer: 'Co-text analysis — reading literary works alongside contemporary non-literary documents', options: ['Co-text analysis — reading literary works alongside contemporary non-literary documents', 'Source study', 'Biographical criticism', 'Intertextuality'] },
        { passage: 'New Historicism draws on Foucault\'s idea that power is not held by a single group but is dispersed through discourse — literature is one site where power circulates.', question: 'What Foucauldian concept underlies New Historicism?', answer: 'Power as dispersed through discourse rather than held by a sovereign', options: ['Power as dispersed through discourse rather than held by a sovereign', 'Power belongs to the king', 'Literature has no power', 'Only economics matters'] },
        { passage: 'The "thick description" method, borrowed from anthropologist Clifford Geertz, involves reading cultural practices in rich detail to uncover their symbolic significance.', question: 'How does New Historicism use "thick description"?', answer: 'To read cultural moments — including literary texts — as densely meaningful symbolic events', options: ['To read cultural moments — including literary texts — as densely meaningful symbolic events', 'To write longer essays', 'To describe physical settings', 'To summarize plots in detail'] },
      ],
    },
  },
  'advanced': {
    'queer-theory': {
      type: 'theory-id', instruction: 'Identify the queer theory concept or theorist.',
      items: [
        { passage: 'Judith Butler argues that gender is not an essence but a performance — a set of repeated acts that create the illusion of a stable gender identity.', question: 'What is Butler\'s key concept?', answer: 'Gender performativity — gender is constituted through repeated performance, not biology', options: ['Gender performativity — gender is constituted through repeated performance, not biology', 'Gender essentialism', 'Biological determinism', 'Role theory'] },
        { passage: 'Eve Kosofsky Sedgwick\'s "Epistemology of the Closet" argues that the binary homo/heterosexual distinction structures much of modern Western culture — not just sexuality but knowledge itself.', question: 'What does Sedgwick claim?', answer: 'The homo/hetero binary organizes Western knowledge broadly, not just sexual identity', options: ['The homo/hetero binary organizes Western knowledge broadly, not just sexual identity', 'Only sexual identity is affected', 'The binary is natural and stable', 'Sexuality is irrelevant to culture'] },
        { passage: 'The term "queer" in queer theory is not just about sexual identity — it describes a critical stance against all normative categories, questioning what counts as "normal."', question: 'What does "queer" mean as a theoretical term?', answer: 'A challenge to normativity itself — destabilizing all categories presented as natural', options: ['A challenge to normativity itself — destabilizing all categories presented as natural', 'A synonym for gay or lesbian', 'An insult', 'A genre of literature'] },
        { passage: 'A queer reading of a text might focus on moments of gender ambiguity, same-sex desire, or resistance to heteronormative marriage plots — even in texts not explicitly about queerness.', question: 'What does this reveal about queer theory\'s scope?', answer: 'It can be applied to any text — queerness is about disrupting norms, not just representing LGBTQ+ characters', options: ['It can be applied to any text — queerness is about disrupting norms, not just representing LGBTQ+ characters', 'It applies only to LGBTQ+ literature', 'It requires explicit queer content', 'It is a biographical approach'] },
        { passage: 'Lee Edelman\'s "No Future" argues against "reproductive futurism" — the cultural logic that privileges the Child and heterosexual reproduction as the ultimate social good.', question: 'What does Edelman\'s anti-social thesis propose?', answer: 'Queerness should embrace its association with negativity and refusal rather than seeking assimilation', options: ['Queerness should embrace its association with negativity and refusal rather than seeking assimilation', 'Queer people should have children', 'The future is always positive', 'Reproduction is the only value'] },
        { passage: 'José Esteban Muñoz\'s "Cruising Utopia" counters Edelman by arguing that queerness is inherently utopian — it is the "not yet here," a horizon of possibility.', question: 'How does Muñoz define queerness?', answer: 'As a futurity — something always on the horizon, not yet realized', options: ['As a futurity — something always on the horizon, not yet realized', 'As a fixed identity', 'As a historical period', 'As impossibility'] },
      ],
    },
    'ecocriticism': {
      type: 'theory-id', instruction: 'Identify the ecocritical concept or approach.',
      items: [
        { passage: 'The critic examines how the pastoral tradition in English poetry idealizes nature while erasing the labor of those who work the land.', question: 'What ecocritical lens is applied?', answer: 'Critiquing the pastoral as ideological — it aestheticizes nature while hiding exploitation', options: ['Critiquing the pastoral as ideological — it aestheticizes nature while hiding exploitation', 'Celebrating pastoral beauty', 'Marxist analysis only', 'Formalist close reading'] },
        { passage: 'Lawrence Buell\'s criteria for "environmental texts" include: the nonhuman environment is present as more than mere backdrop; human interest is not the only legitimate interest; human accountability to the environment is part of the text\'s ethical orientation.', question: 'What do Buell\'s criteria define?', answer: 'What makes a text genuinely environmental rather than merely using nature as setting', options: ['What makes a text genuinely environmental rather than merely using nature as setting', 'Good nature writing', 'Scientific accuracy', 'Romantic poetry'] },
        { passage: 'The "toxic discourse" branch of ecocriticism studies how literature represents pollution, contamination, and environmental injustice — not pristine wilderness but damaged landscapes.', question: 'What does toxic discourse expand?', answer: 'Ecocriticism beyond wilderness aesthetics to include environmental degradation and injustice', options: ['Ecocriticism beyond wilderness aesthetics to include environmental degradation and injustice', 'Poison in detective novels', 'Medical humanities', 'Chemical analysis'] },
        { passage: 'Rob Nixon\'s concept of "slow violence" describes environmental destruction that occurs gradually and invisibly — not spectacular events but slow processes like climate change, deforestation, and toxic accumulation.', question: 'Why is "slow violence" hard to narrate?', answer: 'Its incremental, invisible nature resists the dramatic structure of conventional storytelling', options: ['Its incremental, invisible nature resists the dramatic structure of conventional storytelling', 'It is not real', 'It only affects plants', 'It is too fast to capture'] },
        { passage: 'A postcolonial ecocritical reading examines how colonialism involved not just the exploitation of people but the extraction and destruction of colonized lands.', question: 'What does postcolonial ecocriticism combine?', answer: 'Analysis of environmental and colonial exploitation as interconnected', options: ['Analysis of environmental and colonial exploitation as interconnected', 'Nature writing and travel writing', 'Ecology and formalism', 'Postcolonialism and psychology'] },
        { passage: 'Donna Haraway\'s concept of "naturecultures" insists that nature and culture have never been separate — they are entangled systems that cannot be understood independently.', question: 'What does "naturecultures" challenge?', answer: 'The nature/culture binary — they are always already intertwined', options: ['The nature/culture binary — they are always already intertwined', 'The existence of nature', 'Scientific method', 'Cultural studies'] },
      ],
    },
    'posthumanism': {
      type: 'theory-id', instruction: 'Identify the posthumanist concept or theorist.',
      items: [
        { passage: 'Posthumanism questions the Enlightenment assumption that "the human" is a stable, unified category at the center of knowledge, ethics, and politics.', question: 'What does posthumanism challenge?', answer: 'Anthropocentrism — the privileging of the human as the measure of all things', options: ['Anthropocentrism — the privileging of the human as the measure of all things', 'Technology', 'Literature', 'Science fiction only'] },
        { passage: 'Donna Haraway\'s "Cyborg Manifesto" argues that the boundary between human and machine is increasingly blurred — and that this blurring opens up new political possibilities.', question: 'What is the cyborg?', answer: 'A figure that dissolves the boundaries between human, animal, and machine', options: ['A figure that dissolves the boundaries between human, animal, and machine', 'A robot', 'A fictional character only', 'A medical device'] },
        { passage: 'Cary Wolfe argues that posthumanism is not "after" the human in the sense of moving beyond — it is about recognizing what the concept of "the human" has always excluded: animals, ecosystems, technologies.', question: 'What does Wolfe\'s posthumanism do?', answer: 'It critiques the boundaries of "the human" to include what humanism excluded', options: ['It critiques the boundaries of "the human" to include what humanism excluded', 'It celebrates technological progress', 'It rejects all human values', 'It predicts human extinction'] },
        { passage: 'Object-oriented ontology (OOO) argues that objects — a stone, a storm, a text — have their own reality that exceeds human perception and use. This is called "withdrawal."', question: 'What does OOO challenge?', answer: 'Correlationism — the idea that things exist only as they appear to human consciousness', options: ['Correlationism — the idea that things exist only as they appear to human consciousness', 'Materialism', 'Idealism', 'Common sense'] },
        { passage: 'N. Katherine Hayles traces how "the posthuman" emerged alongside cybernetics and information theory — the idea that the body is an information pattern, not a fixed material entity.', question: 'What does Hayles connect?', answer: 'The history of cybernetics to the destabilization of the liberal humanist subject', options: ['The history of cybernetics to the destabilization of the liberal humanist subject', 'Robots to literature', 'AI to poetry', 'Computers to novels'] },
        { passage: 'A posthumanist reading of "Frankenstein" focuses not on the monster as a failed human but on how the novel reveals that "the human" was always a constructed and exclusionary category.', question: 'What does this reading reveal about "the human"?', answer: 'The category of "the human" is constructed by excluding those deemed monstrous or non-human', options: ['The category of "the human" is constructed by excluding those deemed monstrous or non-human', 'Frankenstein is a science fiction novel', 'Monsters are real', 'The novel is about technology'] },
      ],
    },
    'theory-synthesis': {
      type: 'passage-application', instruction: 'Apply multiple theoretical lenses to the passage.',
      items: [
        { passage: 'A novel by a postcolonial woman writer uses a non-linear, fragmented structure to tell the story of displacement. A reviewer calls it "difficult" and "lacking in narrative coherence."', question: 'How might a synthesis of postcolonial and feminist theory respond to this review?', answer: 'The "difficulty" is itself the point — fragmentation enacts the experience of displacement, and the demand for coherence reflects Western patriarchal narrative norms', options: ['The "difficulty" is itself the point — fragmentation enacts the experience of displacement, and the demand for coherence reflects Western patriarchal narrative norms', 'The reviewer is correct', 'The novel should be rewritten', 'Only formalist analysis applies'] },
        { passage: 'A queer ecocritical reading of a 19th-century nature poem might examine how the poem\'s celebration of "natural" reproduction implicitly excludes non-reproductive sexualities from the "natural" order.', question: 'What does this synthesis reveal?', answer: 'Nature is deployed to naturalize heteronormativity — queerness is positioned as "unnatural"', options: ['Nature is deployed to naturalize heteronormativity — queerness is positioned as "unnatural"', 'The poem is simply about flowers', 'Ecology and sexuality are unrelated', 'Only one theory should be applied'] },
        { passage: 'A Marxist-feminist reading of a romance novel examines how the genre promises women emotional fulfillment through marriage while obscuring the economic dependency that marriage historically entailed.', question: 'What does this combined analysis expose?', answer: 'Romance narratives ideologically merge emotional desire with economic dependence, naturalizing women\'s subordination', options: ['Romance narratives ideologically merge emotional desire with economic dependence, naturalizing women\'s subordination', 'Romance novels are only entertainment', 'Marxism and feminism are incompatible', 'Marriage is always positive'] },
        { passage: 'A posthumanist-psychoanalytic reading of a science fiction novel about AI might argue that the android character represents not just technological anxiety but the human subject\'s fear of its own constructed nature — if the android can think and feel, what makes "the human" special?', question: 'What does this synthesis produce?', answer: 'The android becomes a mirror for the human\'s narcissistic investment in its own uniqueness — the uncanny double', options: ['The android becomes a mirror for the human\'s narcissistic investment in its own uniqueness — the uncanny double', 'The novel is simply about robots', 'Psychoanalysis applies only to humans', 'Posthumanism rejects all psychology'] },
        { passage: 'A New Historicist-deconstructive reading might show how a text that seems to support royal authority simultaneously contains language that undermines that authority — the text is not a stable vehicle for a single ideology.', question: 'What does this combined approach reveal?', answer: 'Texts are never fully controlled by the ideology they seem to serve — power and subversion coexist in the same language', options: ['Texts are never fully controlled by the ideology they seem to serve — power and subversion coexist in the same language', 'Texts always support authority', 'Deconstruction negates historicism', 'Only one reading is correct'] },
        { passage: 'A student writes a paper combining three lenses — postcolonial, ecocritical, and Marxist — to analyze a novel about mining in colonial Africa. The professor asks: "What does using all three lenses together reveal that any single lens would miss?"', question: 'What is the value of theoretical synthesis?', answer: 'It shows how colonial exploitation, environmental destruction, and capitalist extraction are interconnected systems, not separate issues', options: ['It shows how colonial exploitation, environmental destruction, and capitalist extraction are interconnected systems, not separate issues', 'More theories always means a better paper', 'One theory is always sufficient', 'Combining theories creates confusion'] },
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

class CriticalTheory {
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
        context: 'Introduce theoretical framework and key concepts',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = CriticalTheory;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const ct = new CriticalTheory();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) ct.setLevel(id, level); out({ action: 'start', profile: ct.getProfile(id), nextSkills: ct.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(ct.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(ct.generateExercise(level, skill, 5)); } else { const n = ct.getNextSkills(id, 1).next; out(n.length ? ct.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(ct.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(ct.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(ct.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(ct.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(ct.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? ct.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(ct.setLevel(id, l)); break; }
      case 'students': { out(ct.listStudents()); break; }
      default: out({ usage: 'node critical-theory.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
