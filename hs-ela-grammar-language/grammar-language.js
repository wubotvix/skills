// eClaw HS ELA Grammar, Language & Style Interactive Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-grammar-language');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'sentence-structure': ['compound-complex-sentences'],
    'punctuation': ['comma-usage-advanced', 'semicolon-colon'],
    'voice': ['active-passive-voice'],
    'style': ['sentence-variety-style'],
  },
  'grade-10': {
    'sentence-structure': ['parallel-structure', 'appositives', 'participial-phrases'],
    'punctuation': ['semicolons-advanced'],
    'rhetoric': ['rhetorical-grammar-basics'],
  },
  'grade-11': {
    'syntax': ['periodic-sentences', 'cumulative-sentences', 'balanced-sentences'],
    'rhetoric': ['syntactic-schemes', 'author-style-analysis'],
  },
  'grade-12': {
    'craft': ['syntactic-imitation', 'voice-development', 'grammar-as-craft'],
    'register': ['register-flexibility', 'dialect-code-switching'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'grade-9': {
    'compound-complex-sentences': {
      items: [
        { text: 'Although she studied hard, she passed the exam, and her parents were proud.', answer: 'compound-complex', reason: 'Dependent clause ("Although...") + two independent clauses joined by "and".' },
        { text: 'The rain fell, and the streets flooded.', answer: 'compound', reason: 'Two independent clauses joined by "and" with no dependent clause.' },
        { text: 'When the bell rang, students rushed to the halls, but the teacher stayed behind.', answer: 'compound-complex', reason: 'Dependent clause ("When...") + two independent clauses joined by "but".' },
        { text: 'Because the power went out, we lit candles, and we told stories until it returned.', answer: 'compound-complex', reason: 'Dependent clause + two independent clauses.' },
        { text: 'She smiled and waved.', answer: 'simple', reason: 'One subject with compound predicate — still a simple sentence.' },
        { text: 'If you finish early, you may read, or you may work on the project.', answer: 'compound-complex', reason: 'Dependent clause ("If...") + two independent clauses joined by "or".' },
        { text: 'The dog barked because it heard a noise.', answer: 'complex', reason: 'One independent clause + one dependent clause — complex, not compound-complex.' },
        { text: 'After the storm passed, the sky cleared, and a rainbow appeared over the valley.', answer: 'compound-complex', reason: 'Dependent clause + two independent clauses.' },
      ],
    },
    'comma-usage-advanced': {
      items: [
        { wrong: 'The senator who represents our district voted yes.', right: 'The senator who represents our district voted yes.', rule: 'Restrictive clause — no commas needed because it identifies which senator.' },
        { wrong: 'My mother who is a doctor works at the hospital.', right: 'My mother, who is a doctor, works at the hospital.', rule: 'Nonrestrictive clause — commas needed because "my mother" is already specific.' },
        { wrong: 'The tall dark and handsome stranger entered.', right: 'The tall, dark, and handsome stranger entered.', rule: 'Use commas between coordinate adjectives in a series.' },
        { wrong: 'She wanted to go however she was too tired.', right: 'She wanted to go; however, she was too tired.', rule: 'Use a semicolon before and comma after a conjunctive adverb joining independent clauses.' },
        { wrong: 'On the other hand we could stay home.', right: 'On the other hand, we could stay home.', rule: 'Comma after an introductory transitional phrase.' },
        { wrong: 'The experiment which took three months produced surprising results.', right: 'The experiment, which took three months, produced surprising results.', rule: 'Nonrestrictive "which" clause needs commas.' },
        { wrong: 'Dear Mr. Thompson\nI am writing to apply for the position.', right: 'Dear Mr. Thompson,\nI am writing to apply for the position.', rule: 'Use a comma after the salutation in a friendly letter (colon in business).' },
        { wrong: 'Well I suppose we should begin.', right: 'Well, I suppose we should begin.', rule: 'Comma after an introductory interjection.' },
      ],
    },
    'active-passive-voice': {
      items: [
        { sentence: 'The committee approved the proposal.', answer: 'active', reason: 'Subject (committee) performs the action.' },
        { sentence: 'The proposal was approved by the committee.', answer: 'passive', reason: 'Subject (proposal) receives the action; agent in "by" phrase.' },
        { sentence: 'Mistakes were made.', answer: 'passive', reason: 'Subject receives the action; agent is deliberately omitted.' },
        { sentence: 'The tornado destroyed several buildings.', answer: 'active', reason: 'Subject (tornado) performs the action directly.' },
        { sentence: 'The novel was written by Toni Morrison in 1987.', answer: 'passive', reason: 'Subject (novel) receives the action.' },
        { sentence: 'Scientists discovered a new species in the Amazon.', answer: 'active', reason: 'Subject (scientists) performs the action.' },
        { sentence: 'The ball was kicked by the player.', answer: 'passive', reason: 'Subject (ball) receives the action; agent follows "by".' },
        { sentence: 'The choir sang the song beautifully.', answer: 'active', reason: 'Subject (choir) performs the action directly.' },
      ],
    },
    'semicolon-colon': {
      items: [
        { wrong: 'She loved reading, he preferred sports.', right: 'She loved reading; he preferred sports.', rule: 'Use a semicolon to join closely related independent clauses without a conjunction.' },
        { wrong: 'He had one goal, to win the championship.', right: 'He had one goal: to win the championship.', rule: 'Use a colon to introduce an explanation or amplification of the main clause.' },
        { wrong: 'The recipe requires three things, flour, sugar, and butter.', right: 'The recipe requires three things: flour, sugar, and butter.', rule: 'Use a colon to introduce a list after a complete sentence.' },
        { wrong: 'I visited three cities, Paris, France, London, England, and Rome, Italy.', right: 'I visited three cities: Paris, France; London, England; and Rome, Italy.', rule: 'Use semicolons to separate items in a list when items contain internal commas.' },
        { wrong: 'The test was difficult, however, most students passed.', right: 'The test was difficult; however, most students passed.', rule: 'Semicolon before a conjunctive adverb joining two independent clauses.' },
        { wrong: 'Dear Sir or Madam,', right: 'Dear Sir or Madam:', rule: 'Use a colon after the salutation in a formal business letter.' },
        { wrong: 'She excelled in three subjects, math, science, and English.', right: 'She excelled in three subjects: math, science, and English.', rule: 'Colon introduces a list when preceded by a complete independent clause.' },
        { wrong: 'The weather was perfect, we decided to go hiking.', right: 'The weather was perfect; we decided to go hiking.', rule: 'Semicolon joins related independent clauses without a conjunction.' },
      ],
    },
    'sentence-variety-style': {
      items: [
        { boring: 'The man walked. He walked slowly. He was old. He used a cane.', improved: 'The old man walked slowly, leaning on his cane with each careful step.', method: 'Combine choppy sentences; vary length and structure.' },
        { boring: 'She got up. She ate breakfast. She went to school. She was tired.', improved: 'Tired from a restless night, she dragged herself through breakfast before heading to school.', method: 'Open with a participial phrase; combine related ideas.' },
        { boring: 'The storm came. It was loud. The lights went out. We were scared.', improved: 'When the loud storm knocked out the lights, fear crept through the house.', method: 'Use a complex sentence with a dependent clause opener.' },
        { boring: 'He studied hard. He studied every night. He wanted to pass. He did pass.', improved: 'After studying every night with relentless determination, he finally passed.', method: 'Reduce repetition; use an introductory phrase.' },
        { boring: 'The city is big. The city is noisy. The city never sleeps. I love it.', improved: 'I love this big, noisy city that never sleeps.', method: 'Combine with coordinate adjectives and a relative clause.' },
        { boring: 'The dog ran. The dog barked. The mailman ran away. The mailman was scared.', improved: 'Barking furiously, the dog charged at the terrified mailman, who sprinted down the sidewalk.', method: 'Use participial opener; add a nonrestrictive relative clause.' },
      ],
    },
  },
  'grade-10': {
    'parallel-structure': {
      items: [
        { wrong: 'She likes hiking, swimming, and to bike.', right: 'She likes hiking, swimming, and biking.', rule: 'Items in a series must share the same grammatical form.' },
        { wrong: 'The coach told them to work hard, playing fair, and have fun.', right: 'The coach told them to work hard, play fair, and have fun.', rule: 'Infinitives in a series must all be parallel.' },
        { wrong: 'Not only did he study hard but also was volunteering.', right: 'Not only did he study hard, but he also volunteered.', rule: 'Correlative conjunctions require parallel structures on both sides.' },
        { wrong: 'Writing an essay is harder than to give a speech.', right: 'Writing an essay is harder than giving a speech.', rule: 'Comparisons must use parallel forms.' },
        { wrong: 'The program aims to educate the public, raising awareness, and to generate funding.', right: 'The program aims to educate the public, raise awareness, and generate funding.', rule: 'All items in a series must match the first item\'s form.' },
        { wrong: 'She was intelligent, hardworking, and showed great courage.', right: 'She was intelligent, hardworking, and courageous.', rule: 'Predicate adjectives in a series must be parallel.' },
        { wrong: 'The job requires patience, being attentive, and organization.', right: 'The job requires patience, attentiveness, and organization.', rule: 'Nouns in a series must all be nouns.' },
        { wrong: 'He promised to call, write, and that he would visit.', right: 'He promised to call, write, and visit.', rule: 'Keep infinitive series consistent.' },
      ],
    },
    'appositives': {
      items: [
        { sentence: 'My brother ___ is visiting next week.', answer: ', a talented musician,', type: 'nonrestrictive', rule: 'A nonrestrictive appositive is set off by commas.' },
        { sentence: 'The poet ___ wrote powerfully about nature.', answer: 'Mary Oliver', type: 'restrictive', rule: 'A restrictive appositive identifies which noun and uses no commas.' },
        { wrong: 'Maya Angelou a renowned poet wrote "Still I Rise."', right: 'Maya Angelou, a renowned poet, wrote "Still I Rise."', rule: 'Set off nonrestrictive appositives with commas.' },
        { wrong: 'My friend Sara loves to paint.', right: 'My friend, Sara, loves to paint.', rule: 'If "my friend" refers to only one person, "Sara" is nonrestrictive.' },
        { prompt: 'Combine: "The Great Gatsby is a novel. It explores the American Dream."', answer: 'The Great Gatsby, a novel that explores the American Dream, captivates readers.', type: 'combine', rule: 'Use an appositive to combine sentences and reduce wordiness.' },
        { prompt: 'Add an appositive to: "Einstein changed physics forever."', answer: 'Einstein, a theoretical physicist, changed physics forever.', type: 'expand', rule: 'Appositives add detail without a new clause.' },
        { prompt: 'Identify the appositive: "Chicago, the Windy City, sits on Lake Michigan."', answer: 'the Windy City', type: 'identify', rule: 'The appositive renames or explains the noun beside it.' },
        { prompt: 'Identify the appositive: "Her goal — a full scholarship — seemed within reach."', answer: 'a full scholarship', type: 'identify', rule: 'Dashes can set off appositives for emphasis.' },
      ],
    },
    'participial-phrases': {
      items: [
        { sentence: '___, the cat stretched lazily.', answer: 'Basking in the sunlight', type: 'present-participle', rule: 'Present participial phrases begin with an -ing verb form.' },
        { sentence: '___, the letter revealed a secret.', answer: 'Opened carefully', type: 'past-participle', rule: 'Past participial phrases begin with an -ed/-en verb form.' },
        { wrong: 'Running to the bus, my backpack fell.', right: 'Running to the bus, I dropped my backpack.', rule: 'Dangling modifier: the participial phrase must modify the subject.' },
        { wrong: 'Exhausted from the hike, the couch looked inviting.', right: 'Exhausted from the hike, she found the couch inviting.', rule: 'The couch was not exhausted — fix the dangling modifier.' },
        { prompt: 'Combine: "She clutched the railing. She climbed the stairs."', answer: 'Clutching the railing, she climbed the stairs.', type: 'combine', rule: 'Use a participial phrase to show simultaneous actions.' },
        { prompt: 'Combine: "The soldier was wounded in battle. He limped home."', answer: 'Wounded in battle, the soldier limped home.', type: 'combine', rule: 'Past participle phrase shows cause or condition.' },
        { wrong: 'Singing loudly, the neighbors complained.', right: 'Singing loudly, she drew complaints from the neighbors.', rule: 'Dangling modifier: who was singing?' },
        { prompt: 'Expand with a participial phrase: "The river flowed to the sea."', answer: 'Winding through the valley, the river flowed to the sea.', type: 'expand', rule: 'Participial phrases add visual detail and sentence variety.' },
      ],
    },
    'semicolons-advanced': {
      items: [
        { wrong: 'The project was ambitious, it required months of planning.', right: 'The project was ambitious; it required months of planning.', rule: 'Use a semicolon to join closely related independent clauses.' },
        { wrong: 'She studied French, German, and Italian, he studied Mandarin, Japanese, and Korean.', right: 'She studied French, German, and Italian; he studied Mandarin, Japanese, and Korean.', rule: 'Semicolon separates independent clauses with heavy internal punctuation.' },
        { wrong: 'The team included Maria, the captain, James, the goalie, and Priya, the midfielder.', right: 'The team included Maria, the captain; James, the goalie; and Priya, the midfielder.', rule: 'Use semicolons between list items that contain internal commas.' },
        { wrong: 'He wanted to leave, nevertheless, he stayed.', right: 'He wanted to leave; nevertheless, he stayed.', rule: 'Semicolon before conjunctive adverb; comma after it.' },
        { wrong: 'The evidence was clear, therefore, the jury reached a quick verdict.', right: 'The evidence was clear; therefore, the jury reached a quick verdict.', rule: 'Conjunctive adverbs (therefore, however, moreover) need a semicolon before them.' },
        { wrong: 'Art is long, life is short.', right: 'Art is long; life is short.', rule: 'A semicolon between balanced clauses emphasizes their connection.' },
        { sentence: 'Choose the correct punctuation: "The rain stopped ___ the sun emerged."', answer: ';', rule: 'Semicolon joins closely related independent clauses without a conjunction.' },
        { sentence: 'Choose: "She had three goals ___ moreover ___ she had the talent to achieve them."', answer: '; moreover,', rule: 'Semicolon before; comma after a conjunctive adverb.' },
      ],
    },
    'rhetorical-grammar-basics': {
      items: [
        { prompt: 'Identify the rhetorical effect: "It was the best of times, it was the worst of times."', answer: 'antithesis', rule: 'Antithesis places contrasting ideas in parallel structure for emphasis.' },
        { prompt: 'Identify the scheme: "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields."', answer: 'anaphora', rule: 'Anaphora repeats a word or phrase at the start of successive clauses.' },
        { prompt: 'Identify the effect of short sentences: "He lied. She knew. That was enough."', answer: 'emphasis through brevity', rule: 'Short sentences create emphasis, finality, and dramatic tension.' },
        { prompt: 'What is the effect of the colon here? "She wanted one thing: revenge."', answer: 'dramatic revelation', rule: 'A colon before a single word creates suspense and emphasis.' },
        { prompt: 'Name the scheme: "Ask not what your country can do for you; ask what you can do for your country."', answer: 'chiasmus', rule: 'Chiasmus reverses the structure of parallel clauses (ABBA pattern).' },
        { prompt: 'What effect does the dash create? "The answer — if there was one — eluded him."', answer: 'interruption and hesitation', rule: 'Em dashes create dramatic interruption or parenthetical emphasis.' },
        { prompt: 'Identify: "Veni, vidi, vici."', answer: 'tricolon / asyndeton', rule: 'Three parallel elements (tricolon) without conjunctions (asyndeton) create speed and force.' },
        { prompt: 'Why might an author use a sentence fragment? "Silence. Absolute silence."', answer: 'emphasis and dramatic effect', rule: 'Intentional fragments create emphasis, rhythm, or mimetic effect.' },
      ],
    },
  },
  'grade-11': {
    'periodic-sentences': {
      items: [
        { sentence: 'Despite the rain, the cold, and the growing darkness, she kept walking.', answer: 'periodic', reason: 'Main clause delayed to the end; modifiers build suspense.' },
        { sentence: 'She kept walking despite the rain.', answer: 'loose', reason: 'Main clause comes first — this is loose/cumulative, not periodic.' },
        { prompt: 'Rewrite as periodic: "The team won the championship after months of grueling practice, countless injuries, and near-elimination in the semifinals."', answer: 'After months of grueling practice, countless injuries, and near-elimination in the semifinals, the team won the championship.', rule: 'Move the main clause to the end for suspense and emphasis.' },
        { prompt: 'Rewrite as periodic: "She finally understood the truth after years of denial, painful revelations, and one devastating conversation."', answer: 'After years of denial, painful revelations, and one devastating conversation, she finally understood the truth.', rule: 'Periodic structure delays resolution, building anticipation.' },
        { sentence: 'Through the fog, past the abandoned warehouse, beyond the rusted fence, the child found the garden.', answer: 'periodic', reason: 'Prepositional phrases build before the main clause resolves.' },
        { prompt: 'Create a periodic sentence about graduating from high school.', answer: 'open-ended', type: 'create', rule: 'Place subordinate elements first; save the main clause for last.' },
        { sentence: 'In spite of everything, I still believe that people are really good at heart.', answer: 'periodic', reason: 'Anne Frank delays the main assertion; the opening phrase creates context.' },
        { prompt: 'What effect does the periodic structure create in: "Not in the clamor of the crowded street, not in the shouts and plaudits of the throng, but in ourselves, are triumph and defeat"?', answer: 'emphasis on the final revelation through delayed main clause', rule: 'Longfellow uses periodic structure to surprise the reader with the location of triumph.' },
      ],
    },
    'cumulative-sentences': {
      items: [
        { sentence: 'She walked into the room, her eyes scanning the crowd, her hands trembling at her sides.', answer: 'cumulative', reason: 'Main clause first, then free modifiers adding detail.' },
        { prompt: 'Expand into cumulative: "The city woke up."', answer: 'The city woke up, its streets filling with the sound of horns, vendors calling out their prices, and pigeons scattering from every ledge.', rule: 'Add free modifiers after the base clause to build texture.' },
        { prompt: 'Expand into cumulative: "He sat alone."', answer: 'He sat alone, staring at the empty chair across from him, turning the ring on his finger, lost in a memory he could not release.', rule: 'Cumulative sentences layer detail like a camera zooming in.' },
        { sentence: 'The old house stood at the end of the lane, its paint peeling, its windows dark, its garden overgrown with weeds.', answer: 'cumulative', reason: 'Base clause followed by three parallel absolute phrases.' },
        { prompt: 'Add two free modifiers: "The hawk circled overhead."', answer: 'The hawk circled overhead, its wings barely moving, its shadow gliding across the dry field below.', type: 'expand', rule: 'Free modifiers (absolutes, participles) enrich the base clause.' },
        { sentence: 'She laughed, a sound that filled the room and made everyone turn.', answer: 'cumulative', reason: 'Base clause + appositive modifier expanding on "laughed."' },
        { prompt: 'Identify the modifiers: "The river flowed south, winding through marshes, picking up speed near the rapids, spreading wide as it met the sea."', answer: 'Three participial phrases: winding..., picking up..., spreading...', type: 'analyze', rule: 'Cumulative sentences often stack participial phrases for rhythm.' },
        { prompt: 'Write a cumulative sentence about a thunderstorm.', answer: 'open-ended', type: 'create', rule: 'Start with the main clause; add sensory detail through free modifiers.' },
      ],
    },
    'balanced-sentences': {
      items: [
        { sentence: 'To err is human; to forgive, divine.', answer: 'balanced', reason: 'Two clauses of matching structure and weight.' },
        { sentence: 'Easy reading is damn hard writing.', answer: 'balanced', reason: 'Nathaniel Hawthorne balances "easy reading" against "hard writing."' },
        { prompt: 'Write a balanced sentence contrasting knowledge and wisdom.', answer: 'open-ended', type: 'create', rule: 'Balanced sentences place parallel ideas of equal weight in symmetrical structure.' },
        { prompt: 'Identify the balance: "It was the best of times, it was the worst of times."', answer: 'Parallel structure with antithetical content: best/worst, repeated clause structure.', rule: 'Dickens uses balance + antithesis for memorable rhythm.' },
        { sentence: 'The world will little note, nor long remember what we say here, but it can never forget what they did here.', answer: 'balanced with antithesis', reason: 'Lincoln balances "what we say" against "what they did."' },
        { wrong: 'Success requires effort and you need to be lucky.', right: 'Success requires effort; failure requires only apathy.', rule: 'Balanced sentences pair ideas of equal grammatical weight and rhetorical force.' },
        { prompt: 'Create a balanced sentence about love and hate.', answer: 'open-ended', type: 'create', rule: 'Use parallel structure with a semicolon to balance two ideas.' },
        { sentence: 'Speech is silver; silence is golden.', answer: 'balanced', reason: 'Matching Subject-Verb-Complement patterns with contrasting content.' },
      ],
    },
    'syntactic-schemes': {
      items: [
        { prompt: 'Identify the scheme: "Government of the people, by the people, for the people."', answer: 'epistrophe / tricolon', rule: 'Repetition of "the people" at end of each phrase (epistrophe) in a three-part series (tricolon).' },
        { prompt: 'Identify: "Fear leads to anger. Anger leads to hate. Hate leads to suffering."', answer: 'anadiplosis', rule: 'The end of one clause begins the next, creating a chain of logic.' },
        { prompt: 'Identify: "She lowered her standards and her neckline."', answer: 'zeugma', rule: 'One verb governs two objects in different senses.' },
        { prompt: 'Identify: "Powerful you have become; the dark side I sense in you."', answer: 'anastrophe', rule: 'Inversion of normal word order for emphasis.' },
        { prompt: 'Create an example of anaphora about perseverance.', answer: 'open-ended', type: 'create', rule: 'Repeat the same word or phrase at the start of successive clauses.' },
        { prompt: 'Identify: "I came, I saw, I conquered."', answer: 'asyndeton / tricolon / anaphora', rule: 'Omission of conjunctions (asyndeton), three parts (tricolon), repeated "I" (anaphora).' },
        { prompt: 'What scheme is this? "He ran and jumped and shouted and laughed."', answer: 'polysyndeton', rule: 'Deliberate use of multiple conjunctions slows pace and adds emphasis to each action.' },
        { prompt: 'Write an example of antithesis about freedom and security.', answer: 'open-ended', type: 'create', rule: 'Place contrasting ideas in parallel structure.' },
      ],
    },
    'author-style-analysis': {
      items: [
        { prompt: 'Analyze sentence length patterns in: "He was an old man who fished alone in a skiff in the Gulf Stream and he had gone eighty-four days now without taking a fish."', answer: 'Long, compound sentence with simple diction and coordinate clauses; Hemingway\'s style uses plain language in flowing structures.', type: 'analyze', rule: 'Notice sentence length, complexity, diction level, and conjunction patterns.' },
        { prompt: 'Analyze the syntax of: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."', answer: 'Periodic structure with formal diction; ironic tone created by the gap between "universally acknowledged" and the trivial claim.', type: 'analyze', rule: 'Austen uses periodic syntax + elevated diction for satiric effect.' },
        { prompt: 'Compare these two styles:\nA: "The old man sat. He did not move. The sun went down."\nB: "The old man, weathered by decades of labor, sat motionless as the sun descended beyond the western ridge."', answer: 'A uses parataxis (short, equal clauses) for starkness. B uses hypotaxis (subordination, modification) for richness and specificity.', type: 'compare', rule: 'Parataxis = coordination/simplicity; hypotaxis = subordination/complexity.' },
        { prompt: 'What is the effect of Cormac McCarthy\'s choice to omit quotation marks in dialogue?', answer: 'Blurs the line between narration and speech; creates immersive, stream-like prose; challenges reader to track speakers.', type: 'analyze', rule: 'Punctuation choices are stylistic decisions that shape reader experience.' },
        { prompt: 'Analyze diction in: "The apparition of these faces in the crowd; petals on a wet, black bough." (Ezra Pound)', answer: 'Juxtaposition of abstract ("apparition") and concrete imagery ("petals," "bough"); semicolon creates visual superposition.', type: 'analyze', rule: 'Diction (word choice) + punctuation work together to create meaning.' },
        { prompt: 'How does Toni Morrison use sentence fragments in her prose?', answer: 'Fragments create emphasis, rhythm, and emotional intensity; they mimic speech patterns and oral storytelling traditions.', type: 'analyze', rule: 'Intentional fragments are a craft choice, not an error.' },
      ],
    },
  },
  'grade-12': {
    'syntactic-imitation': {
      items: [
        { mentor: 'She walked into the room, her eyes scanning the crowd, her hands trembling at her sides.', pattern: 'base clause + absolute phrase + absolute phrase', prompt: 'Write a sentence imitating this pattern about a different scene.', answer: 'open-ended', type: 'imitate', rule: 'Match the syntactic pattern with original content.' },
        { mentor: 'Despite the rain, the cold, and the growing darkness, she kept walking.', pattern: 'prepositional phrase series + main clause (periodic)', prompt: 'Imitate this periodic structure about overcoming obstacles.', answer: 'open-ended', type: 'imitate', rule: 'Periodic: stack subordinate elements before the main clause.' },
        { mentor: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.', pattern: 'anaphora + antithesis in parallel clauses', prompt: 'Imitate Dickens\'s pattern about modern life.', answer: 'open-ended', type: 'imitate', rule: 'Repeat the opening structure; alternate contrasting ideas.' },
        { mentor: 'The cold passed reluctantly from the earth, and the retiring fogs revealed an army stretched out on the hills, resting.', pattern: 'personification + cumulative expansion', prompt: 'Imitate Crane\'s sentence about a cityscape at dawn.', answer: 'open-ended', type: 'imitate', rule: 'Personify an element; let the sentence expand with detail.' },
        { prompt: 'Model a sentence after: "I celebrate myself, and sing myself." (Whitman)', pattern: 'parallel first-person declarations', answer: 'open-ended', type: 'imitate', rule: 'Match the confidence, rhythm, and parallel structure.' },
        { prompt: 'Combine five simple sentences about a storm into one or two complex sentences.', answer: 'open-ended', type: 'combine', rule: 'Use subordination, coordination, and modification to create sophisticated syntax.' },
        { mentor: 'In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep.', pattern: 'simple declarative + polysyndeton + negative definition', prompt: 'Imitate this creation-narrative rhythm about building something new.', answer: 'open-ended', type: 'imitate', rule: 'Biblical syntax uses polysyndeton and simple diction for gravity.' },
        { prompt: 'Write a paragraph (3-4 sentences) imitating Hemingway\'s paratactic style about a meal.', answer: 'open-ended', type: 'pastiche', rule: 'Use short, declarative sentences; simple diction; coordination over subordination.' },
      ],
    },
    'voice-development': {
      items: [
        { prompt: 'Rewrite in a formal academic voice: "Social media is basically wrecking how kids talk to each other and it\'s pretty messed up."', answer: 'Social media has fundamentally altered adolescent communication patterns, with potentially detrimental consequences for interpersonal development.', type: 'register-shift', rule: 'Academic voice: remove slang, use precise diction, employ subordination.' },
        { prompt: 'Rewrite in a personal/narrative voice: "The experiment demonstrated a statistically significant correlation between sleep duration and academic performance."', answer: 'I started sleeping more. My grades went up. It was that simple — and that hard.', type: 'register-shift', rule: 'Personal voice: use "I," shorter sentences, concrete details.' },
        { prompt: 'Analyze the voice in: "Call me Ishmael."', answer: 'Direct, intimate, commanding; first-person invitation establishes the narrator\'s presence immediately. The imperative verb creates familiarity.', type: 'analyze', rule: 'Voice emerges from diction, syntax, person, and tone together.' },
        { prompt: 'Write two versions of the same argument — one passionate, one measured.', answer: 'open-ended', type: 'create', rule: 'Voice is a choice: diction, sentence length, and rhythm convey stance.' },
        { prompt: 'What elements create voice? Identify them in: "I\'m nobody! Who are you? Are you — Nobody — too?" (Dickinson)', answer: 'Exclamation, questions, dashes, informal diction, playful tone — all create an intimate, subversive voice.', type: 'analyze', rule: 'Voice = diction + syntax + punctuation + person + tone.' },
        { prompt: 'Revise this passage to develop a stronger voice: "The sunset was nice. The colors were pretty. I felt happy."', answer: 'open-ended', type: 'revise', rule: 'Replace vague words; vary sentence structure; add specific sensory detail.' },
        { prompt: 'Write the opening paragraph of an essay in YOUR voice about a place you know well.', answer: 'open-ended', type: 'create', rule: 'Authentic voice comes from specific detail, honest diction, and natural rhythm.' },
        { prompt: 'Compare the voices in two openings:\nA: "It was a bright cold day in April, and the clocks were striking thirteen."\nB: "If you really want to hear about it, the first thing you\'ll probably want to know is where I was born."', answer: 'A (Orwell): precise, detached, ominous — the wrong number signals dystopia. B (Salinger): casual, direct, resistant — Holden\'s voice is defined by what he won\'t do.', type: 'compare', rule: 'Opening sentences establish voice through syntax, diction, and attitude.' },
      ],
    },
    'register-flexibility': {
      items: [
        { prompt: 'Rewrite for a job application: "I\'m super good at working with people and I can totally handle pressure."', answer: 'I excel in collaborative environments and perform effectively under time-sensitive conditions.', type: 'formal', rule: 'Formal register: eliminate contractions, slang; use precise professional diction.' },
        { prompt: 'Rewrite for a text to a friend: "I would like to request your presence at a social gathering this Saturday evening."', answer: 'Hey, party at my place Saturday night — you coming?', type: 'informal', rule: 'Informal register: contractions, fragments, direct address.' },
        { prompt: 'Rewrite for a scientific audience: "We mixed the stuff together and it got really hot."', answer: 'Upon combining the reagents, an exothermic reaction produced a significant temperature increase.', type: 'technical', rule: 'Technical register: precise terminology, passive constructions, measured tone.' },
        { prompt: 'Rewrite for a 10-year-old audience: "The mitochondria facilitate cellular respiration through oxidative phosphorylation."', answer: 'Inside every cell in your body, tiny power plants called mitochondria turn food into energy you can use.', type: 'simplified', rule: 'Adjust register for audience: use analogies, shorter sentences, familiar words.' },
        { prompt: 'Identify the register and audience: "Pursuant to Section 4(a), the aforementioned party shall remit payment within thirty (30) days."', answer: 'Legal register; audience is lawyers and courts. Formal, precise, archaic diction.', type: 'identify', rule: 'Register reflects audience, purpose, and genre conventions.' },
        { prompt: 'Write the same announcement in three registers: formal, casual, and humorous.', answer: 'open-ended', type: 'create', rule: 'The same content changes meaning and tone through register choices.' },
        { prompt: 'When is it appropriate to use informal register in academic writing?', answer: 'In personal narratives, creative essays, or when breaking convention for rhetorical effect (with awareness).', type: 'analyze', rule: 'Register is a choice, not a hierarchy; context determines appropriateness.' },
        { prompt: 'Rewrite for a persuasive speech: "Research suggests that regular exercise may contribute to improved cognitive function."', answer: 'Exercise doesn\'t just build muscle — it builds brains. Every time you move, your mind sharpens.', type: 'rhetorical', rule: 'Persuasive register: direct, rhythmic, emotionally engaging.' },
      ],
    },
    'grammar-as-craft': {
      items: [
        { prompt: 'Revise for emphasis using a sentence fragment: "The stadium fell completely silent after the announcement."', answer: 'The announcement came. Silence. Complete, suffocating silence.', type: 'revise', rule: 'Intentional fragments create emphasis through disruption of expected flow.' },
        { prompt: 'Revise using a colon for dramatic effect: "She finally understood what her mother meant."', answer: 'She finally understood what her mother meant: some doors, once closed, never reopen.', type: 'revise', rule: 'A colon creates a dramatic pause before revelation.' },
        { prompt: 'Revise using em dashes: "The senator voted yes even though her own party fiercely opposed the bill."', answer: 'The senator — despite fierce opposition from her own party — voted yes.', type: 'revise', rule: 'Em dashes create an interruption that adds dramatic emphasis.' },
        { prompt: 'Use polysyndeton to create a different effect: "She packed books, clothes, photos, and letters."', answer: 'She packed books and clothes and photos and letters.', type: 'revise', rule: 'Polysyndeton slows the pace and gives weight to each item.' },
        { prompt: 'Use asyndeton to create urgency: "He ran and jumped and swam and climbed."', answer: 'He ran, jumped, swam, climbed.', type: 'revise', rule: 'Asyndeton removes conjunctions to create speed and breathlessness.' },
        { prompt: 'Deliberately use a comma splice for stylistic effect in a short passage.', answer: 'open-ended', type: 'create', rule: 'Intentional comma splices (like Caesar\'s "I came, I saw, I conquered") create urgency and rhythm.' },
        { prompt: 'Write one sentence using a periodic structure, then rewrite it as cumulative. Which is more effective for your purpose and why?', answer: 'open-ended', type: 'create', rule: 'Craft means choosing the structure that serves your meaning.' },
        { prompt: 'How does the one-sentence paragraph function as a rhetorical tool?', answer: 'It creates emphasis through isolation; forces the reader to pause; signals a shift in thought or a key idea.', type: 'analyze', rule: 'Paragraph length is a grammatical and rhetorical choice.' },
      ],
    },
    'dialect-code-switching': {
      items: [
        { prompt: 'Explain why "She be working" is grammatically valid in African American Vernacular English.', answer: 'The habitual "be" indicates an ongoing, recurring action — she works regularly/habitually. This is a systematic grammatical feature, not an error.', type: 'analyze', rule: 'All dialects have consistent, rule-governed grammar.' },
        { prompt: 'Rewrite this passage for two audiences — a college application and a personal blog: "I grew up code-switching between my grandmother\'s kitchen Spanglish and my school\'s Standard English."', answer: 'open-ended', type: 'code-switch', rule: 'Code-switching is a sophisticated linguistic skill, not a deficiency.' },
        { prompt: 'Why does Zora Neale Hurston use dialect in Their Eyes Were Watching God?', answer: 'Dialect creates authenticity, preserves cultural voice, resists the erasure of Black Southern speech, and gives literary dignity to spoken language.', type: 'analyze', rule: 'Authors use dialect as a deliberate craft choice for authenticity and voice.' },
        { prompt: 'Is "ain\'t" wrong? Explain with linguistic reasoning.', answer: 'No — "ain\'t" is a well-established contraction in many English dialects with a centuries-long history. It is informal, not incorrect. Standard English excludes it by convention, not by logic.', type: 'analyze', rule: 'Correctness is a social convention, not a linguistic absolute.' },
        { prompt: 'Write the same idea in Standard Academic English, then in a dialect or register of your choice.', answer: 'open-ended', type: 'create', rule: 'Competence means having multiple registers available and choosing deliberately.' },
        { prompt: 'How does Junot Diaz\'s use of untranslated Spanish in his fiction affect the reader?', answer: 'It centers the bilingual experience; refuses to privilege the English-only reader; creates intimacy with bilingual readers and productive disorientation for monolingual ones.', type: 'analyze', rule: 'Language mixing in literature is a rhetorical and political choice.' },
        { prompt: 'What is the difference between code-switching and code-meshing?', answer: 'Code-switching alternates between languages/dialects for different contexts. Code-meshing blends them simultaneously in one text. Both are valued communication strategies.', type: 'define', rule: 'Code-meshing is increasingly accepted in academic and professional writing.' },
        { prompt: 'When might a writer deliberately break Standard English conventions? Give three scenarios.', answer: 'In dialogue (authenticity), in personal narrative (voice), in persuasion (emphasis) — also poetry, satire, and stream of consciousness.', type: 'analyze', rule: 'Understanding rules enables purposeful breaking of them.' },
      ],
    },
  },
};

const MENTOR_SENTENCES = {
  'grade-9': [
    { sentence: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.', author: 'Jane Austen', focus: 'periodic structure and irony', notice: 'The formal, elevated syntax contrasts with the trivial claim — creating satire.' },
    { sentence: 'The old man was thin and gaunt with deep wrinkles in the back of his neck.', author: 'Ernest Hemingway', focus: 'compound structure with concrete detail', notice: 'Simple diction, coordinate structure, and precise physical description.' },
    { sentence: 'All happy families are alike; each unhappy family is unhappy in its own way.', author: 'Leo Tolstoy', focus: 'balanced sentence with semicolon', notice: 'Semicolon creates balance between two contrasting observations.' },
  ],
  'grade-10': [
    { sentence: 'Breathing dreams like air, the beautiful and the damned drifted through the night.', author: 'F. Scott Fitzgerald', focus: 'participial phrase opener', notice: 'Present participle "breathing" creates a dreamlike quality before the main clause.' },
    { sentence: 'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.', author: 'Oscar Wilde', focus: 'cumulative sentence with sensory detail', notice: 'Main clause expands through layered sensory modifiers.' },
    { sentence: 'A person who publishes a book willfully appears before the populace with his pants down.', author: 'Edna St. Vincent Millay', focus: 'appositive structure and voice', notice: 'Direct, witty voice created through unexpected metaphor and plain syntax.' },
  ],
  'grade-11': [
    { sentence: 'In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep.', author: 'King James Bible', focus: 'polysyndeton and periodic gravity', notice: 'Repeated "and" (polysyndeton) creates ceremonial rhythm; negative description builds before revelation.' },
    { sentence: 'Not in the clamor of the crowded street, not in the shouts and plaudits of the throng, but in ourselves, are triumph and defeat.', author: 'Henry Wadsworth Longfellow', focus: 'periodic sentence with anaphora', notice: 'Repeated "not in" delays the main clause; the final revelation surprises.' },
    { sentence: 'She walked into the room, her eyes scanning the crowd, her hands trembling slightly at her sides, her breath catching in her throat.', author: 'craft example', focus: 'cumulative sentence with absolute phrases', notice: 'Three absolute phrases add cinematic detail after the base clause.' },
  ],
  'grade-12': [
    { sentence: 'Call me Ishmael.', author: 'Herman Melville', focus: 'voice and economy', notice: 'Three words establish voice, authority, mystery, and intimacy.' },
    { sentence: 'I celebrate myself, and sing myself, and what I assume you shall assume, for every atom belonging to me as good belongs to you.', author: 'Walt Whitman', focus: 'parallel structure and inclusive voice', notice: 'Anaphora, polysyndeton, and first-to-second person shift create expansive, democratic voice.' },
    { sentence: 'Ships at a distance have every man\'s wish on board.', author: 'Zora Neale Hurston', focus: 'metaphor through simple syntax', notice: 'Plain sentence structure carries profound figurative meaning — simplicity as sophistication.' },
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

  // Determine exercise type from item structure
  if (selected[0].wrong !== undefined && selected[0].right !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Fix the error in this sentence.', items: selected.map(i => ({ prompt: i.wrong, answer: i.right, rule: i.rule || '' })) };
  }
  if (selected[0].text !== undefined && selected[0].answer !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify the sentence type.', items: selected.map(i => ({ prompt: i.text, answer: i.answer, reason: i.reason || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].answer !== undefined && selected[0].options) {
    return { type: 'fill-in-choice', skill, grade, count: selected.length, instruction: 'Choose the correct answer.', items: selected.map(i => ({ prompt: i.sentence, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].answer !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify or analyze.', items: selected.map(i => ({ prompt: i.sentence, answer: i.answer, reason: i.reason || i.rule || '' })) };
  }
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Respond to the prompt.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, rule: i.rule || '', type: i.type || '' })) };
  }
  if (selected[0].mentor !== undefined) {
    return { type: 'imitation', skill, grade, count: selected.length, instruction: 'Study the mentor sentence, then write your own using the same pattern.', items: selected.map(i => ({ mentor: i.mentor, pattern: i.pattern, prompt: i.prompt, answer: i.answer || 'open-ended', rule: i.rule || '' })) };
  }
  if (selected[0].boring !== undefined) {
    return { type: 'improve', skill, grade, count: selected.length, instruction: 'Improve this writing using varied sentence structures.', items: selected.map(i => ({ prompt: i.boring, answer: i.improved, method: i.method })) };
  }

  return { error: `Cannot determine exercise type for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  if (expected === 'open-ended') return true;
  return norm(expected) === norm(answer);
}

// ── Public API ──

class GrammarLanguage {
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

  getMentorSentence(grade) {
    const sentences = MENTOR_SENTENCES[grade];
    if (!sentences) return { error: `No mentor sentences for ${grade}.` };
    return pick(sentences, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const mentor = MENTOR_SENTENCES[grade] ? pick(MENTOR_SENTENCES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, mentorSentence: mentor,
      lessonPlan: {
        mentor: mentor ? `Study: "${mentor.sentence}" — ${mentor.author} — Focus: ${mentor.focus}` : 'Select a sentence from current reading for analysis.',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply this grammar/style concept in your own writing.',
        reflect: 'Articulate what this syntactic choice does for meaning and effect.',
      },
    };
  }
}

module.exports = GrammarLanguage;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const gl = new GrammarLanguage();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) gl.setGrade(id, grade);
        out({ action: 'start', profile: gl.getProfile(id), nextSkills: gl.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(gl.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(gl.generateExercise(grade, skill, 5)); }
        else { const n = gl.getNextSkills(id, 1).next; out(n.length ? gl.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(gl.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(gl.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(gl.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(gl.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(gl.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? gl.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(gl.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(gl.setGrade(id, g)); break; }
      case 'mentor': { const [, g] = args; if (!g) throw new Error('Usage: mentor <grade>'); out(gl.getMentorSentence(g)); break; }
      default: out({ usage: 'node grammar-language.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','mentor'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
