// eClaw MS ELA Reading Literature Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-reading-literature');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'cite-evidence': ['cite-textual-evidence'],
    'theme-summary': ['determine-theme', 'objective-summary'],
    'character-conflict': ['character-response', 'conflict-types'],
    'figurative-connotative': ['figurative-language', 'connotative-meaning'],
    'structure-analysis': ['sentence-fits-structure', 'chapter-scene-role'],
    'author-pov': ['develop-pov', 'narrator-perspective'],
    'compare-media': ['text-vs-audio', 'text-vs-film'],
    'compare-genres': ['similar-themes-diff-genres', 'genre-conventions'],
  },
  'grade-7': {
    'cite-multiple-evidence': ['cite-several-pieces', 'support-inferences'],
    'theme-development': ['trace-theme', 'theme-vs-topic'],
    'character-plot-interaction': ['character-plot-elements', 'setting-conflict-link'],
    'sound-devices': ['rhyme-repetition', 'alliteration-onomatopoeia'],
    'structure-meaning': ['structure-contributes-meaning', 'stanza-scene-function'],
    'contrasting-pov': ['contrasting-characters', 'author-vs-character-pov'],
    'compare-fiction-history': ['fiction-vs-historical', 'historical-context-in-fiction'],
  },
  'grade-8': {
    'cite-strongest-evidence': ['strongest-evidence', 'evaluate-evidence-strength'],
    'theme-relationship': ['theme-character-setting', 'theme-across-plot'],
    'character-dialogue-pacing': ['dialogue-reveals-character', 'pacing-propels-action'],
    'word-meaning-tone': ['figurative-technical-meaning', 'tone-through-diction'],
    'structure-suspense-humor': ['structure-creates-suspense', 'structure-creates-humor'],
    'dramatic-irony-pov': ['dramatic-irony', 'pov-effects'],
    'compare-modern-traditional': ['modern-draws-on-classical', 'retelling-analysis'],
  },
};

// ── Content Banks: Passages ──

const PASSAGES = {
  'grade-6': {
    'cite-textual-evidence': {
      items: [
        { passage: 'Maria stared at the trophy on the shelf, its gold surface dulled by years of dust. She had won it at age ten, back when swimming felt like flying. Now the pool was just cold water and a clock.',
          question: 'What evidence shows Maria\'s feelings about swimming have changed?',
          answer: 'The trophy is dusty showing neglect, and she now sees the pool as "just cold water and a clock" instead of feeling like flying.',
          options: ['The trophy is gold', 'She won it at age ten', 'The pool is now "just cold water and a clock" vs. feeling like flying', 'Maria stared at the shelf'],
          correct: 2 },
        { passage: 'The letter sat unopened on the kitchen table for three days. Each morning, James walked past it, poured his cereal, and sat facing the window instead. His mother finally said, "It won\'t read itself."',
          question: 'What evidence suggests James is avoiding the letter?',
          answer: 'He walks past it for three days without opening it, and deliberately sits facing away from it.',
          options: ['The letter is on the table', 'He pours cereal each morning', 'He walks past it for three days and sits facing away', 'His mother talks to him'],
          correct: 2 },
        { passage: 'Kenji lined up his charcoals by size, sharpened each one, and arranged his paper at exactly the same angle as yesterday. He drew the first line, erased it, drew it again. The portrait had to be perfect — it was the last thing his grandfather had asked for.',
          question: 'Cite evidence that shows why Kenji is being so careful with his drawing.',
          answer: 'The portrait "had to be perfect" because "it was the last thing his grandfather had asked for," explaining his meticulous preparation.',
          options: ['He uses charcoals', 'He arranged paper at the same angle', 'The portrait was the last thing his grandfather asked for', 'He drew and erased a line'],
          correct: 2 },
        { passage: 'Rain hammered the tin roof as Adaeze pressed her ear to the radio. Static swallowed every other word, but she caught enough: "School closures... flooding... until further notice." She set down her math textbook and smiled.',
          question: 'What evidence shows how Adaeze feels about the school closure?',
          answer: 'She "set down her math textbook and smiled" after hearing about school closures, showing she is pleased.',
          options: ['Rain hammered the roof', 'Static swallowed every other word', 'She pressed her ear to the radio', 'She set down her textbook and smiled'],
          correct: 3 },
        { passage: 'Devon shoved his hands into his pockets and kicked a stone across the empty lot. The other kids had already chosen teams, and no one had called his name. He turned toward home, walking faster than necessary.',
          question: 'What evidence suggests Devon feels rejected?',
          answer: 'No one called his name for teams, and he walks home "faster than necessary," suggesting he wants to leave quickly.',
          options: ['He shoved his hands in his pockets', 'The lot was empty', 'No one called his name and he walked home faster than necessary', 'He kicked a stone'],
          correct: 2 },
        { passage: 'The old oak in the schoolyard had initials carved into every reachable surface. Ms. Rivera ran her fingers over a faded "J+R" near the roots and paused. "Forty years," she whispered, then straightened her new principal\'s badge.',
          question: 'What evidence shows Ms. Rivera has a personal history with this school?',
          answer: 'She pauses at specific initials "J+R" carved forty years ago, suggesting she is one of those people, now returning as principal.',
          options: ['The oak had initials carved in it', 'She is wearing a principal\'s badge', 'She touches "J+R" and whispers "Forty years"', 'The initials are near the roots'],
          correct: 2 },
      ],
    },
    'determine-theme': {
      items: [
        { passage: 'After weeks of arguing, Tomás finally listened to his sister\'s idea for the science project. Her plan worked better than anything he\'d imagined. At the fair, they held the ribbon together, and Tomás said, "I should have listened sooner."',
          question: 'What is the theme of this passage?',
          answer: 'Being open to others\' ideas can lead to better outcomes than insisting on your own way.',
          options: ['Science fairs are competitive', 'Siblings always fight', 'Being open to others\' ideas leads to better results', 'Winning is the most important thing'],
          correct: 2 },
        { passage: 'Lina practiced her speech fifty times. On stage, her voice cracked on the first sentence. She paused, took a breath, and started again. By the end, the auditorium was silent — then erupted in applause.',
          question: 'What theme does this passage convey?',
          answer: 'Perseverance through setbacks leads to success.',
          options: ['Public speaking is scary', 'Perseverance through setbacks leads to success', 'Practice makes perfect every time', 'Audiences are unpredictable'],
          correct: 1 },
        { passage: 'Marcus had always thought his neighborhood was boring until Mr. Chen\'s garden tour. Hidden behind plain fences were roses, vegetables, and a koi pond. "You just have to look closer," Mr. Chen said, handing Marcus a seedling.',
          question: 'What is the theme?',
          answer: 'There is beauty and value in familiar places if you take the time to look.',
          options: ['Gardening is a good hobby', 'Neighbors should share more', 'There is hidden beauty in familiar places if you look closely', 'Old people are wise'],
          correct: 2 },
        { passage: 'Priya deleted the mean comment she had typed about Asha\'s drawing. She remembered how it felt when someone mocked her poem last year. Instead, she wrote, "I like the colors you chose." Asha\'s reply was a smiley face and "Thanks — I almost didn\'t post it."',
          question: 'What theme does this passage express?',
          answer: 'Choosing kindness over cruelty can make a real difference to someone who is vulnerable.',
          options: ['Social media is dangerous', 'Art is subjective', 'Choosing kindness over cruelty can make a real difference', 'People are too sensitive'],
          correct: 2 },
        { passage: 'The new kid, Amir, sat alone at lunch for a week. On Friday, Sofia set her tray down across from him. "My family moved here last year," she said. "It gets easier." By Monday, three more kids had joined their table.',
          question: 'Identify the theme of this passage.',
          answer: 'A small act of kindness can create a welcoming community for those who feel excluded.',
          options: ['Moving is difficult', 'A small act of kindness can build community', 'Lunch tables matter', 'New students should be patient'],
          correct: 1 },
      ],
    },
    'objective-summary': {
      items: [
        { passage: 'Jake wanted to win the art contest. He stayed after school every day to paint. His friend Elena suggested he try watercolors instead of acrylics. Jake resisted at first but tried it. His watercolor painting won second place, and he thanked Elena for pushing him.',
          question: 'Which is the best objective summary?',
          options: ['Jake is stubborn but his friend is smarter', 'Jake reluctantly tries a new medium on a friend\'s advice and succeeds in a contest', 'Jake should have used watercolors from the start', 'The art contest was unfair'],
          correct: 1,
          answer: 'An objective summary states facts without opinions or judgments.' },
        { passage: 'Rosa found a stray dog on her walk home. She fed it, made posters, and searched for the owner. After two weeks, no one claimed the dog. Her parents agreed to let her keep it.',
          question: 'Which is the most objective summary?',
          options: ['Rosa is the nicest person ever', 'Rosa finds a stray dog, searches for its owner, and eventually adopts it', 'The dog was lucky Rosa found it', 'Rosa\'s parents should have said yes sooner'],
          correct: 1,
          answer: 'Objective summaries avoid personal opinions and emotional language.' },
        { passage: 'Eli\'s basketball team lost every game that season. The coach made them watch film of their mistakes. Eli hated it at first, but he noticed patterns. Next season, the team won their first five games.',
          question: 'Select the best objective summary.',
          options: ['Eli\'s team was terrible', 'After a losing season, a team studies their mistakes on film and improves the following year', 'The coach was too harsh', 'Watching film is the best way to improve'],
          correct: 1,
          answer: 'Good summaries capture key events without adding judgment.' },
        { passage: 'Naya wanted to join the school newspaper but was told all positions were filled. She started her own blog covering school events. Within a month, the newspaper advisor invited her to join as a features writer.',
          question: 'Which summary is most objective?',
          options: ['Naya proved everyone wrong', 'After being turned away from the school paper, Naya starts a blog and is later invited to join', 'The newspaper was unfair to Naya', 'Blogs are better than newspapers'],
          correct: 1,
          answer: 'Objective summaries report what happened without taking sides.' },
      ],
    },
    'character-response': {
      items: [
        { passage: 'When the flood warning came, everyone in town rushed to higher ground. But old Mr. Watts walked to the river with sandbags. "This shop was my father\'s," he said. "I\'m not leaving it to the water."',
          question: 'How does Mr. Watts respond to the conflict, and what does it reveal about him?',
          answer: 'He stays to protect his shop with sandbags while others flee, revealing his deep loyalty to family legacy.',
          options: ['He panics and runs', 'He protects his father\'s shop, showing loyalty to family legacy', 'He ignores the warning completely', 'He asks others for help'],
          correct: 1 },
        { passage: 'Sara\'s best friend told everyone her secret. At lunch, Sara sat at a different table without saying a word. When her friend came over to apologize, Sara said, "I need some time. Trust is hard to rebuild."',
          question: 'How does Sara respond to the betrayal?',
          answer: 'She withdraws quietly and expresses her hurt calmly, showing maturity in handling the conflict.',
          options: ['She yells at her friend', 'She quietly withdraws and calmly expresses that trust must be rebuilt', 'She forgives immediately', 'She tells everyone her friend\'s secret'],
          correct: 1 },
        { passage: 'Coach announced that Dion wouldn\'t start in the championship game. Dion clenched his jaw, nodded, and sat on the bench. When his teammate got injured in the third quarter, Dion was ready. He scored the winning points.',
          question: 'How does Dion respond to being benched?',
          answer: 'He accepts the decision with restraint and stays prepared, showing discipline and resilience.',
          options: ['He argues with the coach', 'He quits the team', 'He accepts it with restraint and stays ready, showing discipline', 'He is happy about it'],
          correct: 2 },
        { passage: 'The wildfire was a mile away. Maya\'s family had fifteen minutes to pack. She grabbed the photo album, her brother\'s inhaler, and the cat. She left her laptop, her trophies, and her new shoes by the door.',
          question: 'What does Maya\'s response to the emergency reveal about her values?',
          answer: 'She grabs items tied to family memories and safety (album, inhaler, cat) over possessions, showing she values people and memories over things.',
          options: ['She values technology', 'She values family memories and safety over material possessions', 'She is disorganized', 'She doesn\'t care about her belongings'],
          correct: 1 },
      ],
    },
    'conflict-types': {
      items: [
        { passage: 'Zara wanted to try out for the play, but her father said actors wasted their time. Every evening she practiced lines in secret, torn between her dream and her father\'s expectations.',
          question: 'What type of conflict does Zara face?',
          options: ['character vs. nature', 'character vs. self AND character vs. character', 'character vs. technology', 'character vs. society'],
          correct: 1,
          answer: 'She faces internal conflict (torn between dream and obedience) and external conflict with her father.' },
        { passage: 'The river rose higher each hour. Miguel stacked the last sandbag and looked at the dark sky. The rain wasn\'t stopping. He had to decide: stay and protect the house or leave for safety.',
          question: 'What type of conflict is primary here?',
          options: ['character vs. character', 'character vs. nature', 'character vs. society', 'character vs. self'],
          correct: 1,
          answer: 'Miguel is struggling against natural forces — the rising river and unending rain.' },
        { passage: 'Everyone at school wore the latest brand of sneakers. Cho\'s family couldn\'t afford them. When kids laughed at her shoes, she said, "I\'d rather have books than brands." But that night, she cried into her pillow.',
          question: 'What conflicts are present?',
          options: ['character vs. nature only', 'character vs. self only', 'character vs. society and character vs. self', 'character vs. character only'],
          correct: 2,
          answer: 'Cho faces pressure from social norms (vs. society) and inner pain despite her brave words (vs. self).' },
        { passage: 'Leo knew the answer to the test question because he\'d seen it on his classmate\'s paper. He stared at his blank sheet. Writing the answer would guarantee an A. Leaving it blank felt honest but terrifying.',
          question: 'What type of conflict does Leo face?',
          options: ['character vs. technology', 'character vs. nature', 'character vs. self', 'character vs. character'],
          correct: 2,
          answer: 'Leo faces an internal moral struggle between cheating and honesty.' },
      ],
    },
    'figurative-language': {
      items: [
        { passage: 'The news hit her like a freight train. She stood frozen in the hallway while students flowed around her like a river parting around a stone.',
          question: 'Identify the figurative language and explain its effect.',
          answer: 'Two similes: "like a freight train" shows the shocking impact; "like a river parting around a stone" shows her stillness while life moves on.',
          options: ['Personification and metaphor', 'Two similes comparing news to a train and students to a river', 'Hyperbole and alliteration', 'Onomatopoeia and imagery'],
          correct: 1 },
        { passage: 'Time crawled through the last period on Friday. The clock\'s hands dragged themselves across its face, and even the sunlight seemed to yawn through the windows.',
          question: 'What figurative device is used, and what mood does it create?',
          answer: 'Personification — time "crawled," the clock\'s hands "dragged themselves," and sunlight "yawned" — creating a mood of boredom and impatience.',
          options: ['Simile creating excitement', 'Personification creating a mood of boredom', 'Metaphor creating tension', 'Hyperbole creating humor'],
          correct: 1 },
        { passage: 'Her smile was a sunrise, slow and warm, spreading light into every corner of the room. Even the grumpiest teacher softened when she walked in.',
          question: 'Identify the figurative language.',
          answer: 'Metaphor — her smile is compared directly to a sunrise without using "like" or "as."',
          options: ['Simile', 'Metaphor comparing her smile to a sunrise', 'Personification', 'Hyperbole'],
          correct: 1 },
        { passage: 'I must have called her name a million times, but she kept walking. The hallway stretched into infinity, and my voice shrank to the size of a whisper.',
          question: 'What figurative devices appear in this passage?',
          answer: 'Hyperbole ("a million times," "stretched into infinity") and personification ("voice shrank").',
          options: ['Only similes', 'Hyperbole and personification', 'Only metaphors', 'Alliteration and onomatopoeia'],
          correct: 1 },
        { passage: 'The old house groaned in the wind. Its shutters clapped like tired hands, and the chimney coughed smoke into the gray sky.',
          question: 'What figurative device dominates this passage?',
          answer: 'Personification — the house "groaned," shutters "clapped like tired hands," and chimney "coughed."',
          options: ['Metaphor', 'Simile', 'Personification giving human actions to the house', 'Alliteration'],
          correct: 2 },
      ],
    },
    'connotative-meaning': {
      items: [
        { passage: 'The politician delivered a speech. One reporter called it "passionate." Another called it "ranting." Both described the same event.',
          question: 'How do the words "passionate" and "ranting" differ in connotation?',
          answer: '"Passionate" has a positive connotation (sincere, energetic) while "ranting" has a negative connotation (uncontrolled, irrational).',
          options: ['They mean the same thing', '"Passionate" is positive; "ranting" is negative — same denotation, different connotation', 'Both are neutral', '"Ranting" is more accurate'],
          correct: 1 },
        { passage: 'The real estate ad called the apartment "cozy." When Marta walked in, she realized "cozy" meant she could touch both walls at once.',
          question: 'What is the connotative effect of "cozy" here?',
          answer: '"Cozy" has a warm, positive connotation but is used to disguise the negative reality that the apartment is tiny.',
          options: ['"Cozy" is a neutral description', '"Cozy" has positive connotation masking the reality of a very small space', '"Cozy" means warm temperature', '"Cozy" is literal'],
          correct: 1 },
        { passage: 'Mrs. Park described the new student as "curious." Mr. Allen called the same student "nosy." The student was asking lots of questions about school rules.',
          question: 'Compare the connotations of "curious" and "nosy."',
          answer: '"Curious" suggests positive intellectual interest; "nosy" suggests intrusive prying — showing how word choice reveals the speaker\'s attitude.',
          options: ['Both are compliments', '"Curious" is positive (eager to learn); "nosy" is negative (intrusive)', 'Both are insults', 'They are synonyms'],
          correct: 1 },
        { passage: 'The coach said the team played "aggressively." The opposing coach said they played "dirty." The referee said the game was "physical."',
          question: 'Rank these three words from most positive to most negative connotation.',
          answer: '"Aggressively" (positive — competitive), "physical" (neutral — descriptive), "dirty" (negative — unfair).',
          options: ['dirty, physical, aggressively', 'aggressively, physical, dirty', 'All are negative', 'All are neutral'],
          correct: 1 },
      ],
    },
    'sentence-fits-structure': {
      items: [
        { passage: 'Chapter 1 introduced a happy family at dinner. Chapter 2 opened with a phone call at midnight. The father\'s face went pale, and he left without explanation. The rest of the book follows the family trying to find out what happened.',
          question: 'How does the opening of Chapter 2 function in the story\'s structure?',
          answer: 'It serves as the inciting incident that disrupts the established normalcy and launches the central conflict.',
          options: ['It is the climax', 'It is the resolution', 'It is the inciting incident that launches the conflict', 'It is falling action'],
          correct: 2 },
        { passage: 'The final sentence of the story reads: "And for the first time in months, the house was quiet — not the heavy quiet of absence, but the soft quiet of peace."',
          question: 'How does this sentence fit the overall structure?',
          answer: 'It serves as the resolution, signaling the conflict has ended and a new emotional state has been reached.',
          options: ['It is rising action', 'It is the climax', 'It is the resolution showing conflict is settled', 'It is exposition'],
          correct: 2 },
        { passage: 'In the middle of the novel, there is a chapter written entirely as diary entries from twenty years earlier. It reveals that the villain and hero were once childhood friends.',
          question: 'What structural role does this chapter play?',
          answer: 'It is a flashback that provides backstory and complicates the reader\'s understanding of the villain-hero relationship.',
          options: ['It is filler with no purpose', 'It is a flashback providing backstory that complicates the conflict', 'It is the climax', 'It is the exposition'],
          correct: 1 },
      ],
    },
    'chapter-scene-role': {
      items: [
        { passage: 'The play\'s first scene shows two servants gossiping about their master\'s upcoming marriage. They mention debts, a rival suitor, and a mysterious letter. None of these characters appear again.',
          question: 'What role does this opening scene serve?',
          answer: 'It provides exposition — setting up key plot points (debts, rival, letter) through secondary characters without direct involvement.',
          options: ['It introduces the protagonists', 'It provides exposition and foreshadows conflicts through gossip', 'It is the climax of Act 1', 'It is comic relief only'],
          correct: 1 },
        { passage: 'After the intense trial scene, the author inserts a short chapter where the main character walks through a meadow, remembering her childhood. Nothing happens plot-wise.',
          question: 'Why would the author include this seemingly uneventful chapter?',
          answer: 'It slows the pacing after a tense scene, reveals character depth through reflection, and gives the reader emotional breathing room.',
          options: ['It is a mistake in the writing', 'It slows pacing, reveals character depth, and provides emotional relief', 'It is the resolution', 'It adds suspense'],
          correct: 1 },
      ],
    },
    'develop-pov': {
      items: [
        { passage: '"I never asked to be team captain," Dante narrated. "Coach just pointed at me, and suddenly everyone expected miracles. The thing about miracles is — people only remember the ones that work."',
          question: 'How does the first-person POV shape the reader\'s understanding?',
          answer: 'First-person narration reveals Dante\'s internal pressure and reluctance, creating sympathy. We only see his perspective on the expectations placed on him.',
          options: ['It gives an objective view of the team', 'It reveals Dante\'s internal pressure and creates reader sympathy', 'It shows what the coach thinks', 'It provides an omniscient perspective'],
          correct: 1 },
        { passage: 'The author writes about a pioneer family\'s journey west. Chapter 1 is from the mother\'s view — she lists medicines and worries about disease. Chapter 2 is from the son\'s view — he counts buffalo and dreams of adventure.',
          question: 'How does the author use alternating POVs?',
          answer: 'The contrasting perspectives show the same journey through different lenses — fear vs. excitement — revealing how experience shapes perception.',
          options: ['To confuse the reader', 'To show fear vs. excitement on the same journey, revealing how experience shapes perception', 'To prove the mother is right', 'Just for variety'],
          correct: 1 },
        { passage: 'The story is told by an outside narrator who only describes what characters do and say — never their thoughts. When Anna slammed the door, the narrator says: "The sound echoed through the empty house."',
          question: 'What POV is used, and what effect does it create?',
          answer: 'Third-person objective — the reader must infer emotions from actions and dialogue, creating distance and requiring active interpretation.',
          options: ['First person creating intimacy', 'Third-person omniscient showing all thoughts', 'Third-person objective requiring reader to infer emotions', 'Second person drawing reader in'],
          correct: 2 },
      ],
    },
    'narrator-perspective': {
      items: [
        { passage: '"Everybody loved the new park," the narrator claims. But later: "Mrs. Chen petitioned against it, Mr. Brooks called it a waste, and the children said the old lot was better for baseball."',
          question: 'What does the contradiction suggest about the narrator?',
          answer: 'The narrator may be unreliable — the claim that "everybody loved" it is contradicted by specific examples of opposition.',
          options: ['The narrator is omniscient', 'The narrator is trustworthy', 'The narrator may be unreliable since specific examples contradict the general claim', 'Mrs. Chen is wrong'],
          correct: 2 },
        { passage: 'A twelve-year-old narrator describes a dinner party: "The adults talked about boring money stuff for hours. Mom laughed too loud at that man\'s jokes. Dad kept checking his phone under the table."',
          question: 'How does the narrator\'s age affect what we learn?',
          answer: 'The child narrator observes details (Mom\'s laughter, Dad\'s phone) without understanding adult subtext, letting the reader infer tension the narrator misses.',
          options: ['The narrator understands everything', 'The young narrator reports details without grasping the adult tension, letting readers infer more', 'Age has no effect', 'Children are more reliable narrators'],
          correct: 1 },
      ],
    },
    'text-vs-audio': {
      items: [
        { passage: 'In the printed poem, the line reads: "Do not go gentle into that good night." In the audio recording, the actor\'s voice rises sharply on "Do not" and drops to a whisper on "good night."',
          question: 'How does the audio version add meaning that the text alone does not convey?',
          answer: 'The vocal emphasis on "Do not" intensifies the urgency/defiance, while the whisper on "good night" adds tenderness — emotional nuances absent from print.',
          options: ['Audio is always better', 'The audio adds no new meaning', 'Vocal emphasis and whisper add urgency and tenderness not conveyed by print alone', 'The text version is incomplete'],
          correct: 2 },
      ],
    },
    'text-vs-film': {
      items: [
        { passage: 'In the novel, the narrator spends two pages describing her anxiety before entering the school. In the film, the director shows a close-up of her hands trembling for three seconds.',
          question: 'How do the two versions convey the character\'s anxiety differently?',
          answer: 'The novel uses internal narration (thoughts over two pages); the film uses visual shorthand (trembling hands). Both convey anxiety, but through different sensory channels.',
          options: ['The film is more accurate', 'The novel is better', 'The novel uses internal narration while the film uses visual shorthand for the same emotion', 'They convey different emotions'],
          correct: 2 },
        { passage: 'The short story\'s climax is narrated in a single tense paragraph. The movie version uses slow motion, dramatic music, and cuts between three characters\' faces.',
          question: 'How does the film expand on the written climax?',
          answer: 'Film uses cinematic techniques (slow motion, music, editing) to stretch time and show multiple perspectives simultaneously, adding sensory layers absent from text.',
          options: ['The film removes content', 'Film adds slow motion, music, and multiple perspectives to create sensory layers text cannot provide', 'They are identical', 'The book version is more dramatic'],
          correct: 1 },
      ],
    },
    'similar-themes-diff-genres': {
      items: [
        { passage: 'A realistic fiction story follows a girl overcoming stage fright at a talent show. A myth tells of a young warrior who must face a dragon to save her village. Both characters must confront fear to achieve something important.',
          question: 'How do these different genres explore a similar theme?',
          answer: 'Both explore "courage means acting despite fear," but realistic fiction uses everyday situations while myth uses grand, symbolic conflict.',
          options: ['They have different themes', 'Both explore overcoming fear, but realistic fiction uses everyday settings while myth uses symbolic larger-than-life conflict', 'Only the myth has a real theme', 'The genres are too different to compare'],
          correct: 1 },
        { passage: 'A science fiction story shows a character choosing individuality over conformity in a dystopian city. A poem describes a traveler choosing the "road less traveled." Both value independent choice.',
          question: 'Compare how these genres address the theme of individuality.',
          answer: 'Sci-fi uses a dystopian setting to dramatize the cost of conformity; poetry uses metaphor (the road) to suggest the value of unconventional choices. Both celebrate independence.',
          options: ['Only sci-fi has a theme about individuality', 'Sci-fi dramatizes conformity\'s cost in dystopia while the poem uses road metaphor — both celebrate independence', 'The poem is about nature, not individuality', 'They cannot be compared'],
          correct: 1 },
      ],
    },
    'genre-conventions': {
      items: [
        { passage: 'A mystery novel reveals the culprit on the last page. A drama reveals the culprit in Act 1 and focuses on the trial. Both are about the same crime.',
          question: 'How do genre conventions shape the telling of the same story?',
          answer: 'Mystery conventions delay the reveal to build suspense; drama conventions reveal early to focus on characters\' reactions and moral questions.',
          options: ['Genre has no effect on storytelling', 'Mystery delays the reveal for suspense while drama reveals early to focus on character and morality', 'Both are the same', 'Drama is always better for crime stories'],
          correct: 1 },
      ],
    },
  },
  'grade-7': {
    'cite-several-pieces': {
      items: [
        { passage: 'The garden had been untouched for months. Weeds choked the tomato cages, a bird nested in the watering can, and brown leaves blanketed the path. Inside the house, a calendar still showed March though it was now September.',
          question: 'Cite at least two pieces of evidence that the homeowner has been absent for a long time.',
          answer: 'Multiple evidence: weeds choking tomato cages, bird nesting in the watering can, brown leaves covering the path, and the calendar six months out of date.',
          options: ['The garden has tomato cages', 'Weeds in cages, bird in watering can, and calendar six months behind all indicate prolonged absence', 'The house has a calendar', 'Brown leaves show it is autumn'],
          correct: 1 },
        { passage: 'Amira finished first in every practice race. Yet during meets, she always placed third or fourth. Her coach noticed she glanced at the other runners at the start. Her split times showed she ran faster in the second half, suggesting she held back early on.',
          question: 'Cite several pieces of evidence suggesting why Amira underperforms in meets.',
          answer: 'She glances at other runners (distracted/intimidated), and her split times show she holds back early — together suggesting anxiety or self-doubt in competition.',
          options: ['She finishes first in practice', 'She glances at runners at the start and holds back early — suggesting competition anxiety', 'She places third or fourth', 'Her coach is observant'],
          correct: 1 },
        { passage: 'The town voted to cut the library budget. Attendance records showed visits had tripled in two years. The after-school tutoring program served 200 students weekly. Three community groups held free meetings there every month.',
          question: 'Cite multiple pieces of evidence that the budget cut contradicts the library\'s value.',
          answer: 'Tripled visits, 200 weekly tutoring students, and three community groups meeting monthly all show heavy use that contradicts reducing funding.',
          options: ['The town voted', 'Tripled visits, 200 tutoring students, and monthly community meetings all show heavy use contradicting a budget cut', 'The library has a budget', 'The tutoring program exists'],
          correct: 1 },
      ],
    },
    'support-inferences': {
      items: [
        { passage: 'Grandmother set three places at the table every evening, though Grandfather had passed two years ago. When asked, she said, "Old habits," and changed the subject.',
          question: 'What can you infer, and what evidence supports it?',
          answer: 'Inference: Grandmother has not fully processed her grief. Evidence: she still sets his place after two years and deflects questions about it.',
          options: ['She is forgetful', 'She sets his place after two years and deflects — she has not fully processed grief', 'She expects a guest', 'It is just a habit with no meaning'],
          correct: 1 },
        { passage: 'Tyler volunteered to present last. He reorganized his notes three times. When the teacher called his name, he stood but didn\'t move toward the front for several seconds.',
          question: 'What can you infer about Tyler, and what evidence supports it?',
          answer: 'Inference: Tyler is anxious about presenting. Evidence: volunteering to go last (delaying), reorganizing notes repeatedly (nervous behavior), and hesitating when called.',
          options: ['Tyler is well-prepared', 'Tyler delays, reorganizes notes repeatedly, and hesitates — suggesting presentation anxiety', 'Tyler is bored', 'Tyler forgot his notes'],
          correct: 1 },
      ],
    },
    'trace-theme': {
      items: [
        { passage: 'At the start, Kai said, "I don\'t need anyone." In the middle, stranded during a storm, he accepted help from a stranger. By the end, he hosted a neighborhood dinner. "Turns out," he said, "needing people isn\'t weakness."',
          question: 'Trace how the theme develops across the passage.',
          answer: 'The theme "needing others is not weakness" develops through Kai\'s arc: refusing help → reluctantly accepting it → embracing community — each stage deepening the message.',
          options: ['The theme stays the same throughout', 'The theme develops through Kai\'s arc from isolation to reluctant acceptance to embracing community', 'There is no clear theme', 'The theme is about storms'],
          correct: 1 },
        { passage: 'Chapter 1: A girl hides her drawings. Chapter 5: A teacher praises a drawing she accidentally left out. Chapter 10: She enters an art show. Chapter 15: She teaches drawing to younger kids.',
          question: 'How does the theme of self-expression develop across these chapters?',
          answer: 'It progresses from shame/hiding → accidental exposure/validation → confident public sharing → empowering others, showing self-expression grows through encouragement.',
          options: ['She just gets better at drawing', 'The theme moves from hiding to accidental validation to public confidence to teaching others', 'The theme is about art competitions', 'There is no theme development'],
          correct: 1 },
      ],
    },
    'theme-vs-topic': {
      items: [
        { passage: 'A story about a boy who lies to avoid trouble. Each lie requires a bigger lie to cover it. Eventually, his friends stop believing even his true statements.',
          question: 'Distinguish between the topic and the theme.',
          answer: 'Topic: lying/honesty. Theme: Dishonesty destroys trust, and once trust is lost, even the truth is doubted.',
          options: ['Topic and theme are the same thing', 'Topic: lying. Theme: Dishonesty destroys trust, making even the truth unbelievable', 'Topic: friendship. Theme: Friends are important', 'Topic: school. Theme: School is hard'],
          correct: 1 },
        { passage: 'Two siblings compete for their parent\'s attention. The older one excels at sports; the younger one at music. By the end, the parent attends both a game and a concert, saying, "I have two eyes and two ears — plenty for both of you."',
          question: 'What is the topic vs. the theme?',
          answer: 'Topic: sibling rivalry. Theme: There is enough love and attention for everyone — competition for affection is unnecessary.',
          options: ['Topic: sports and music. Theme: Parents are busy', 'Topic: sibling rivalry. Theme: Love is not a limited resource — competition for affection is unnecessary', 'Topic: parenting. Theme: Parents should go to events', 'They are the same'],
          correct: 1 },
      ],
    },
    'character-plot-elements': {
      items: [
        { passage: 'Mia\'s perfectionism made her rewrite her essay seven times, causing her to miss the deadline. The missed deadline meant she couldn\'t compete in the writing contest, which forced her to confront why perfection mattered more to her than finishing.',
          question: 'How does Mia\'s character trait drive the plot?',
          answer: 'Her perfectionism (character) causes the missed deadline (plot event), which leads to self-reflection (character development) — character and plot are interconnected.',
          options: ['The plot happens independently of Mia', 'Her perfectionism drives the missed deadline, which forces self-reflection — character and plot interconnect', 'Mia has no impact on the plot', 'The contest is the main driver'],
          correct: 1 },
        { passage: 'The drought (setting) forces the family to ration water. The father insists on saving water for crops while the mother insists on saving it for drinking. Their eldest son must mediate.',
          question: 'How do setting, character, and conflict interact?',
          answer: 'Setting (drought) creates scarcity, which triggers character conflict (parents disagree on priorities), which develops the son\'s role as mediator.',
          options: ['Setting has no effect on character', 'The drought creates scarcity, triggering parental conflict, which develops the son\'s mediating role', 'Only the parents matter', 'The son causes the drought'],
          correct: 1 },
      ],
    },
    'setting-conflict-link': {
      items: [
        { passage: 'The story takes place on a lifeboat with six survivors and food for three. As days pass, alliances form and break. The shrinking supplies intensify every disagreement.',
          question: 'How does the setting shape the conflict?',
          answer: 'The confined lifeboat with limited resources forces characters into close contact and constant competition, making every conflict more intense and unavoidable.',
          options: ['The setting is just background', 'The confined space and scarce resources force competition and intensify all conflicts', 'The ocean is the main conflict', 'Setting does not affect conflict'],
          correct: 1 },
      ],
    },
    'rhyme-repetition': {
      items: [
        { passage: '"Still I rise, still I rise, still I rise." The phrase appears at the end of three stanzas, each time after describing a different hardship.',
          question: 'What is the effect of this repetition?',
          answer: 'The repeated "Still I rise" builds a sense of defiance and resilience, intensifying with each hardship described, making the speaker\'s determination feel unstoppable.',
          options: ['It is redundant', 'Repetition builds defiance and resilience, intensifying with each hardship', 'It fills space', 'It is only decorative'],
          correct: 1 },
        { passage: '"Rage, rage against the dying of the light." The end rhyme pattern (light/night, day/way) ties together each stanza\'s argument against accepting death.',
          question: 'How does rhyme contribute to meaning?',
          answer: 'The consistent end rhymes create a chanting, insistent rhythm that mirrors the poem\'s urgent plea to resist death.',
          options: ['Rhyme has no effect on meaning', 'The insistent rhyme pattern creates an urgent rhythm matching the plea to resist death', 'It just sounds nice', 'Rhyme makes it easier to memorize'],
          correct: 1 },
      ],
    },
    'alliteration-onomatopoeia': {
      items: [
        { passage: 'The snake slithered silently through the silver grass. The hiss of its scales sent sparrows scattering.',
          question: 'Identify the sound devices and their effect.',
          answer: 'Alliteration (s sounds: snake, slithered, silently, silver, scales, sparrows, scattering) and onomatopoeia ("hiss") create a slithering, sibilant atmosphere that mimics the snake\'s movement.',
          options: ['There are no sound devices', 'Alliteration of "s" and onomatopoeia ("hiss") mimic the snake\'s slithering movement', 'Only rhyme is present', 'The passage uses metaphor'],
          correct: 1 },
        { passage: 'Boom, crack, crash — the thunder broke the sky apart. Rain rat-a-tat-tatted on the tin roof like a thousand tiny drummers.',
          question: 'What sound devices are used, and what do they achieve?',
          answer: 'Onomatopoeia (boom, crack, crash, rat-a-tat-tatted) and simile (like drummers) make the storm audible to the reader, creating an immersive sensory experience.',
          options: ['Only simile is used', 'Onomatopoeia and simile make the storm audible, creating an immersive sensory experience', 'Only personification', 'No sound devices are present'],
          correct: 1 },
      ],
    },
    'structure-contributes-meaning': {
      items: [
        { passage: 'A novel alternates between two timelines: 1945 and 2020. In 1945, a grandmother hides a letter. In 2020, a granddaughter finds it. Each chapter in one timeline answers a question raised in the other.',
          question: 'How does the dual-timeline structure contribute to meaning?',
          answer: 'The alternating structure creates suspense and shows how past actions echo into the present, reinforcing the theme that family secrets connect generations.',
          options: ['It is confusing for no reason', 'Alternating timelines create suspense and show how past echoes into present, connecting generations', 'It is standard chronological order', 'The structure has no effect on meaning'],
          correct: 1 },
      ],
    },
    'stanza-scene-function': {
      items: [
        { passage: 'A poem has four stanzas. The first three each describe a season of growth (spring planting, summer blooming, fall harvest). The final stanza describes a bare winter field with one seed beneath the snow.',
          question: 'What is the function of the final stanza?',
          answer: 'It shifts from the pattern of abundance to scarcity, but the hidden seed suggests hope and renewal — the stanza serves as a volta (turn) reframing the poem\'s message.',
          options: ['It is just about winter', 'It breaks the abundance pattern but the hidden seed suggests hope — serving as a volta', 'It is the weakest stanza', 'It repeats the earlier themes'],
          correct: 1 },
      ],
    },
    'contrasting-characters': {
      items: [
        { passage: 'The novel\'s two narrators are a police officer and a teenager accused of theft. The officer describes the arrest as "routine" and "by the book." The teenager describes the same arrest as "terrifying" and "humiliating."',
          question: 'How do the contrasting POVs create meaning?',
          answer: 'The same event feels routine to the officer but traumatic to the teen, forcing readers to see how power and position shape the experience of the same moment.',
          options: ['One must be lying', 'The same event feels routine vs. traumatic, showing how power and position shape experience', 'The officer is always right', 'POV does not affect meaning'],
          correct: 1 },
      ],
    },
    'author-vs-character-pov': {
      items: [
        { passage: 'A character in a novel insists that technology makes people lazy. However, the author surrounds him with characters who use technology to solve problems creatively. By the end, the character is alone and struggling.',
          question: 'How does the author\'s POV contrast with the character\'s?',
          answer: 'The author uses the character\'s failure and others\' success to argue against the character\'s view — the author\'s POV critiques the character\'s stubbornness.',
          options: ['They agree', 'The author uses other characters\' success to undermine the character\'s anti-technology stance', 'The character is the author\'s mouthpiece', 'There is no contrast'],
          correct: 1 },
      ],
    },
    'fiction-vs-historical': {
      items: [
        { passage: 'A historical fiction novel about the Gold Rush follows a Chinese immigrant family. A textbook chapter covers the same period and mentions "Chinese laborers built much of the railroad." The novel shows one family\'s daily hunger, discrimination, and hope.',
          question: 'Compare how the fiction and historical account treat the same period.',
          answer: 'The textbook provides broad facts; the novel personalizes the experience through one family\'s emotions and daily reality, making the history feel immediate and human.',
          options: ['They are identical', 'The textbook gives broad facts while the novel personalizes through one family\'s emotional experience', 'Only the textbook is accurate', 'Fiction cannot be about history'],
          correct: 1 },
      ],
    },
    'historical-context-in-fiction': {
      items: [
        { passage: 'A novel set during the Great Depression has a character who hides food under her mattress even after the family\'s situation improves. Her daughter asks why. "You never forget hunger," she says.',
          question: 'How does historical context deepen this character moment?',
          answer: 'Knowing the Great Depression\'s widespread poverty explains the character\'s behavior — the trauma of that era shaped lasting habits, making the scene historically grounded and psychologically real.',
          options: ['Historical context is irrelevant', 'Knowledge of the Depression explains the lasting trauma behind her food-hoarding behavior', 'She is just eccentric', 'The daughter is the important character'],
          correct: 1 },
      ],
    },
  },
  'grade-8': {
    'strongest-evidence': {
      items: [
        { passage: 'Jamal says he is happy at his new school. But he eats lunch alone, declines invitations to join clubs, and his grades — once straight A\'s — have dropped to C\'s. He tells his mom, "Everything\'s fine."',
          question: 'Which is the STRONGEST evidence that Jamal is NOT happy?',
          options: ['He says he is happy', 'He eats lunch alone', 'He declines club invitations', 'His grades dropped from A\'s to C\'s'],
          correct: 3,
          answer: 'Grade decline is the strongest evidence because it is objective, measurable, and represents a significant change in performance — harder to explain away than social choices.' },
        { passage: 'The author argues that the town needs a new park. She cites a petition with 500 signatures, a study linking green spaces to lower stress, and a quote from a child saying, "I want somewhere to play."',
          question: 'Which piece of evidence is strongest?',
          options: ['The child\'s quote', 'The petition with 500 signatures', 'The study linking green spaces to lower stress', 'The author\'s personal opinion'],
          correct: 2,
          answer: 'The scientific study is strongest because it provides objective, research-based evidence rather than emotional appeal or popular opinion.' },
        { passage: 'A character claims the old bridge is safe. Evidence: the mayor says it\'s fine, a local used it yesterday, an engineer\'s report shows cracks in three support beams, and the bridge has stood for 80 years.',
          question: 'Which is the strongest evidence the bridge is NOT safe?',
          options: ['The mayor says it\'s fine', 'A local used it yesterday', 'An engineer\'s report shows cracks in three support beams', 'The bridge has stood for 80 years'],
          correct: 2,
          answer: 'The engineer\'s report is strongest — it is expert, specific, and objective, unlike opinions, anecdotes, or appeals to longevity.' },
      ],
    },
    'evaluate-evidence-strength': {
      items: [
        { passage: 'An essay claims screen time harms sleep. Evidence offered: (A) "My cousin stays up late on his phone." (B) A Harvard study of 2,000 teens found screen time before bed delays sleep onset by 30 minutes. (C) "Everyone knows screens are bad."',
          question: 'Rank the evidence from weakest to strongest and explain why.',
          answer: 'Weakest: C (unsupported generalization) → A (single anecdote) → Strongest: B (large-scale research study with specific findings).',
          options: ['A, B, C', 'C (generalization), A (anecdote), B (research study)', 'B, A, C', 'All are equally strong'],
          correct: 1 },
        { passage: 'A student argues school should start later. Evidence: (A) She feels tired at 7 AM. (B) The American Academy of Pediatrics recommends 8:30 or later. (C) A school district that shifted to 8:30 saw grades improve 10%.',
          question: 'Which evidence is strongest and why?',
          options: ['A — personal experience is most convincing', 'B — expert recommendation carries authority', 'C — real-world data showing measurable improvement is most compelling', 'All are equally strong'],
          correct: 2,
          answer: 'C is strongest because it provides measurable, real-world results, though B (expert recommendation) also carries significant weight.' },
      ],
    },
    'theme-character-setting': {
      items: [
        { passage: 'In a dystopian city where emotions are suppressed, a girl secretly listens to banned music. The setting enforces conformity; her character defies it. The music represents the human need for feeling. By the end, she broadcasts a song citywide.',
          question: 'How do character, setting, and theme relate?',
          answer: 'Setting (dystopian conformity) creates the conflict; character (defiance through music) drives the action; together they express the theme that the human need for emotional expression cannot be permanently suppressed.',
          options: ['They are unrelated', 'Setting creates conflict, character drives action, and together they express the theme that emotion cannot be suppressed', 'Only character matters for theme', 'Setting determines theme alone'],
          correct: 1 },
      ],
    },
    'theme-across-plot': {
      items: [
        { passage: 'Act 1: A king ignores advisors\' warnings. Act 2: His overconfidence leads to a lost battle. Act 3: Defeated, he listens to a shepherd\'s advice and wins back his kingdom. Act 4: He creates a council of diverse voices.',
          question: 'How does the theme develop across the plot?',
          answer: 'The theme "wisdom requires listening to others" develops: Act 1 (arrogance), Act 2 (consequence), Act 3 (humility/learning), Act 4 (lasting change). Each act deepens the message.',
          options: ['The theme does not develop', 'From arrogance to consequence to humility to lasting change — each act deepens "wisdom requires listening"', 'The theme is only in Act 4', 'The plot has nothing to do with theme'],
          correct: 1 },
      ],
    },
    'dialogue-reveals-character': {
      items: [
        { passage: '"Fine," she said. "Do whatever you want. You always do." She poured coffee into an already full cup and didn\'t wipe up the spill.',
          question: 'What does the dialogue and action reveal about the character?',
          answer: 'The clipped, sarcastic dialogue ("Fine," "You always do") and careless action (overfilling the cup) reveal suppressed anger and resignation in a recurring conflict.',
          options: ['She is calm and happy', 'She is genuinely agreeable', 'Clipped sarcastic dialogue and careless action reveal suppressed anger and resignation', 'She is just clumsy'],
          correct: 2 },
        { passage: '"I\'m not scared," the boy said, gripping the railing so hard his knuckles turned white. "I\'ve done this a hundred times." He hadn\'t moved in two minutes.',
          question: 'How do dialogue and action contradict each other?',
          answer: 'His words claim bravery and experience, but his white-knuckle grip and frozen stance reveal he is terrified — the contradiction makes the fear more vivid.',
          options: ['They match perfectly', 'His brave words are contradicted by white knuckles and frozen stance, making fear vivid', 'He is telling the truth', 'The actions are unrelated to fear'],
          correct: 1 },
      ],
    },
    'pacing-propels-action': {
      items: [
        { passage: 'The author spends ten pages on one quiet dinner conversation, then covers the next three months in a single paragraph: "Winter passed. So did her hope."',
          question: 'How does the shift in pacing affect the story?',
          answer: 'Slowing down for the dinner signals its emotional importance; the rapid time skip conveys emptiness and loss of hope — pacing mirrors the character\'s emotional state.',
          options: ['The author made a mistake', 'Slow dinner = emotional importance; fast skip = emptiness — pacing mirrors emotional state', 'Pacing does not matter', 'The dinner was unimportant'],
          correct: 1 },
        { passage: 'Short sentences pile up: "He ran. The door slammed. Glass broke. Sirens." Then the next paragraph is a long, flowing description of the quiet morning after.',
          question: 'How does the sentence-level pacing create effect?',
          answer: 'Short choppy sentences create urgency and chaos during the action; the long flowing paragraph contrasts with calm, emphasizing the shift from danger to aftermath.',
          options: ['It is random', 'Short sentences create urgency during action; long paragraph creates calm contrast in the aftermath', 'Only long sentences create mood', 'Sentence length does not affect pacing'],
          correct: 1 },
      ],
    },
    'figurative-technical-meaning': {
      items: [
        { passage: 'The scientist in the story says, "The cells are waging war on the infection." Later, the narrator describes the patient\'s face as "a battlefield of worry and exhaustion."',
          question: 'Analyze the figurative and technical language.',
          answer: '"Waging war" is both figurative (military metaphor) and loosely technical (immune response). "Battlefield" extends the metaphor to the patient\'s appearance, linking medical reality to emotional toll.',
          options: ['All language is literal', '"Waging war" blends figurative military metaphor with immune response; "battlefield" extends it to emotional toll', 'Only the scientist uses figurative language', 'There is no figurative language'],
          correct: 1 },
      ],
    },
    'tone-through-diction': {
      items: [
        { passage: 'Version A: "The child wandered into the garden." Version B: "The brat stumbled into the weeds." Both describe the same event.',
          question: 'How does diction create different tones?',
          answer: '"Child/wandered/garden" creates a gentle, innocent tone; "brat/stumbled/weeds" creates a harsh, negative tone. Word choice determines the reader\'s emotional response.',
          options: ['They have the same tone', '"Child/wandered/garden" = gentle; "brat/stumbled/weeds" = harsh — diction shapes emotional response', 'Tone only comes from plot', 'Version B is more accurate'],
          correct: 1 },
        { passage: 'The narrator describes a sunset: "The sun retreated behind the hills, surrendering the sky to encroaching darkness." The words "retreated," "surrendering," and "encroaching" all come from military language.',
          question: 'What tone does the military diction create?',
          answer: 'The military language ("retreated, surrendering, encroaching") creates an ominous, foreboding tone, suggesting that darkness is an invading force — foreshadowing conflict or loss.',
          options: ['A peaceful tone', 'An ominous, foreboding tone — darkness as invading force foreshadows conflict', 'A celebratory tone', 'A neutral descriptive tone'],
          correct: 1 },
      ],
    },
    'structure-creates-suspense': {
      items: [
        { passage: 'The chapter ends mid-sentence: "She opened the door and saw—" The next chapter jumps to a different character in a different city. The reader doesn\'t find out what she saw for 40 pages.',
          question: 'How does structure create suspense?',
          answer: 'The cliffhanger (mid-sentence break) and delayed resolution (switching to another storyline for 40 pages) force the reader to keep reading, building tension through structural withholding.',
          options: ['It does not create suspense', 'The cliffhanger and 40-page delay force continued reading, building tension through structural withholding', 'Only plot creates suspense', 'The switch is a flaw'],
          correct: 1 },
      ],
    },
    'structure-creates-humor': {
      items: [
        { passage: 'A story builds elaborate descriptions of a hero preparing for battle: polishing armor, sharpening swords, reciting a war cry. He throws open the castle doors to face... a kitten sitting on the drawbridge.',
          question: 'How does structure create humor?',
          answer: 'The structure builds grand expectations through escalating preparation, then delivers a comic anticlimax (a kitten). The humor comes from the gap between buildup and payoff.',
          options: ['Kittens are inherently funny', 'Escalating grand preparation followed by comic anticlimax creates humor through the gap between expectation and reality', 'The story is not meant to be funny', 'Only dialogue creates humor'],
          correct: 1 },
      ],
    },
    'dramatic-irony': {
      items: [
        { passage: 'The audience knows the letter contains good news — a scholarship. But the character, afraid of rejection, has avoided opening it for a week. She almost throws it away.',
          question: 'How does dramatic irony create tension?',
          answer: 'The reader knows the letter is good news while the character fears it, creating tension as she nearly discards what the audience knows would change her life.',
          options: ['There is no irony', 'The reader\'s knowledge of good news vs. the character\'s fear creates tension as she nearly throws away her future', 'Dramatic irony only creates humor', 'The character is foolish'],
          correct: 1 },
        { passage: 'In a play, a character hides a birthday party behind a door. The birthday boy complains to a friend: "Nobody remembered. Nobody even cares." The audience can see the decorations through a window.',
          question: 'Identify the dramatic irony and its effect.',
          answer: 'The audience sees the party while the character believes he\'s forgotten — the irony creates a mix of humor (we know the truth) and sympathy (his sadness is real to him).',
          options: ['There is no dramatic irony', 'The audience sees the party while the character feels forgotten — creating humor and sympathy simultaneously', 'The character is ungrateful', 'Only the friend creates irony'],
          correct: 1 },
      ],
    },
    'pov-effects': {
      items: [
        { passage: 'The horror story is told from the haunted house\'s perspective. "I felt her hand on my doorknob. I creaked my stairs to warn her. She didn\'t listen. They never listen."',
          question: 'How does this unusual POV create effects?',
          answer: 'The house as narrator inverts expectations — the "monster" is trying to help, creating both humor ("They never listen") and suspense (what is the house warning about?).',
          options: ['It is just strange', 'The house-narrator inverts expectations, creating humor and suspense simultaneously', 'First person is always the same', 'POV has no effect on mood'],
          correct: 1 },
      ],
    },
    'modern-draws-on-classical': {
      items: [
        { passage: 'A modern novel follows a girl navigating a series of challenges in a new school. Each challenge mirrors one of Odysseus\'s trials: the cafeteria "sirens" who lure her away from studying, the "Cyclops" bully who blocks her path, and the loyal friend who is her "Penelope."',
          question: 'How does the modern work draw on the classical source?',
          answer: 'The novel maps Homer\'s Odyssey onto a school setting, using parallels (sirens = distractions, Cyclops = bully, Penelope = loyal friend) to give everyday struggles mythic weight and universal resonance.',
          options: ['It is a direct copy', 'It maps Odyssey parallels onto school life, giving everyday struggles mythic weight', 'The classical source is irrelevant', 'Only names are borrowed'],
          correct: 1 },
      ],
    },
    'retelling-analysis': {
      items: [
        { passage: 'The original fairy tale has a passive princess rescued by a prince. The modern retelling makes the princess a scientist who solves the kingdom\'s drought. The dragon becomes a misunderstood creature she befriends.',
          question: 'Analyze what the retelling changes and why.',
          answer: 'The retelling transforms passive characters into active problem-solvers and reframes the "monster" as misunderstood — reflecting modern values of agency, empathy, and questioning assumptions.',
          options: ['The retelling is unfaithful to the original', 'It transforms passive characters into agents and reframes the monster, reflecting modern values of agency and empathy', 'Only the setting changes', 'The original is always better'],
          correct: 1 },
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

function generateExercise(grade, skill, count = 3) {
  // Find the skill in the passage banks
  const gradeBank = PASSAGES[grade];
  if (!gradeBank) return { error: `No content bank for grade: ${grade}` };

  const bank = gradeBank[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty content bank for ${grade}/${skill}` };

  const selected = pick(items, count);

  // Passage-based comprehension items
  if (selected[0].passage !== undefined && selected[0].options !== undefined) {
    return {
      type: 'passage-comprehension',
      skill, grade,
      count: selected.length,
      instruction: 'Read the passage and answer the question.',
      items: selected.map(i => ({
        passage: i.passage,
        question: i.question,
        options: i.options,
        correctIndex: i.correct,
        answer: i.answer,
      })),
    };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// ── Get Passage ──

function getPassage(grade, skill) {
  const gradeBank = PASSAGES[grade];
  if (!gradeBank) return { error: `No passages for grade: ${grade}` };
  const bank = gradeBank[skill];
  if (!bank || !bank.items || !bank.items.length) return { error: `No passages for ${grade}/${skill}` };
  const item = pick(bank.items, 1)[0];
  return { grade, skill, passage: item.passage, question: item.question, answer: item.answer };
}

function checkAnswer(expected, answer) {
  // For multiple choice, compare index or normalized text
  if (typeof expected === 'number') return Number(answer) === expected;
  return norm(expected) === norm(answer);
}

// ── Public API ──

class ReadingLiterature {
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
      studentId: id, grade, targetSkill: target, exercise, passage,
      lessonPlan: {
        read: passage.error ? 'Use a passage from the exercise items.' : `Read: "${passage.passage.substring(0, 80)}..."`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} comprehension items`,
        discuss: 'Discuss the passage and evidence with the student.',
      },
    };
  }
}

module.exports = ReadingLiterature;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rl = new ReadingLiterature();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) rl.setGrade(id, grade);
        out({ action: 'start', profile: rl.getProfile(id), nextSkills: rl.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(rl.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(rl.generateExercise(grade, skill, 3)); }
        else { const n = rl.getNextSkills(id, 1).next; out(n.length ? rl.generateExercise(grade, n[0].skill, 3) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <expected> <answer>');
        out(rl.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(rl.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(rl.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(rl.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(rl.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? rl.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(rl.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(rl.setGrade(id, g)); break; }
      case 'passage': { const [, g, s] = args; if (!g || !s) throw new Error('Usage: passage <grade> <skill>'); out(rl.getPassage(g, s)); break; }
      default: out({ usage: 'node reading-literature.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
