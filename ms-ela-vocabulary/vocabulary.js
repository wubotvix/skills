// eClaw Middle School ELA Vocabulary Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-vocabulary');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'context-clues': ['context-clues-sentence'],
    'word-parts': ['greek-latin-affixes'],
    'reference': ['reference-materials'],
    'verify': ['verify-meaning'],
    'figurative': ['figurative-personification'],
    'relationships': ['word-relationships-cause-part'],
    'connotation': ['connotation-denotation'],
    'academic': ['academic-vocab-6'],
  },
  'grade-7': {
    'context-clues': ['context-clues-advanced'],
    'word-parts': ['greek-latin-roots'],
    'reference': ['reference-specialized'],
    'verify': ['verify-context'],
    'figurative': ['figurative-allusions'],
    'relationships': ['word-analogies'],
    'connotation': ['connotation-nuance'],
    'academic': ['academic-vocab-7'],
  },
  'grade-8': {
    'context-clues': ['context-clues-complex'],
    'word-parts': ['greek-latin-patterns'],
    'reference': ['reference-etymology'],
    'verify': ['verify-multiple'],
    'figurative': ['figurative-verbal-irony'],
    'relationships': ['word-relationships-advanced'],
    'connotation': ['connotation-tone'],
    'academic': ['academic-vocab-8'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'grade-6': {
    'context-clues-sentence': {
      items: [
        { passage: 'The abandoned house was dilapidated; its walls were crumbling and the roof had caved in.', word: 'dilapidated', answer: 'falling apart; in a state of disrepair', clueType: 'definition/restatement', options: ['brand new', 'falling apart', 'brightly painted', 'very large'] },
        { passage: 'Unlike her gregarious sister who loved parties, Maya was shy and preferred to be alone.', word: 'gregarious', answer: 'sociable; enjoying the company of others', clueType: 'antonym/contrast', options: ['quiet and reserved', 'sociable and outgoing', 'angry and upset', 'tall and strong'] },
        { passage: 'The meticulous student checked every answer twice, making sure each detail was perfect.', word: 'meticulous', answer: 'extremely careful and precise', clueType: 'example', options: ['careless', 'extremely careful', 'very fast', 'confused'] },
        { passage: 'After days without rain, the parched earth cracked under the blazing sun.', word: 'parched', answer: 'extremely dry', clueType: 'inference', options: ['extremely dry', 'very wet', 'freshly planted', 'dark colored'] },
        { passage: 'The teacher wanted to alleviate, or lessen, the students\' anxiety before the test.', word: 'alleviate', answer: 'to make less severe; to lessen', clueType: 'definition/restatement', options: ['to increase', 'to ignore', 'to lessen', 'to create'] },
        { passage: 'The benevolent king was known for his generous gifts to the poor and his kind treatment of all citizens.', word: 'benevolent', answer: 'kind and generous', clueType: 'example', options: ['cruel and harsh', 'kind and generous', 'wealthy and powerful', 'old and wise'] },
        { passage: 'While some students were apathetic about the project, others showed great enthusiasm and excitement.', word: 'apathetic', answer: 'showing no interest or concern', clueType: 'antonym/contrast', options: ['very excited', 'showing no interest', 'extremely angry', 'deeply confused'] },
        { passage: 'The resilient plants survived the harsh winter, bouncing back to bloom beautifully in spring.', word: 'resilient', answer: 'able to recover quickly from difficulties', clueType: 'inference', options: ['fragile and weak', 'able to recover quickly', 'very colorful', 'extremely rare'] },
        { passage: 'Nocturnal animals, such as owls, bats, and raccoons, are most active during the nighttime hours.', word: 'nocturnal', answer: 'active at night', clueType: 'example', options: ['active during the day', 'active at night', 'living underground', 'able to fly'] },
        { passage: 'The copious notes filled three notebooks — she had written down every detail from every lecture.', word: 'copious', answer: 'abundant; in large quantities', clueType: 'inference', options: ['very few', 'neatly organized', 'abundant; plentiful', 'poorly written'] },
      ],
    },
    'greek-latin-affixes': {
      items: [
        { word: 'invisible', parts: [{ part: 'in-', type: 'prefix', meaning: 'not' }, { part: 'vis', type: 'root', meaning: 'see' }, { part: '-ible', type: 'suffix', meaning: 'able to be' }], meaning: 'not able to be seen', answer: 'not able to be seen' },
        { word: 'transportation', parts: [{ part: 'trans-', type: 'prefix', meaning: 'across' }, { part: 'port', type: 'root', meaning: 'carry' }, { part: '-ation', type: 'suffix', meaning: 'act or process' }], meaning: 'the act of carrying across', answer: 'the act of carrying across' },
        { word: 'unpredictable', parts: [{ part: 'un-', type: 'prefix', meaning: 'not' }, { part: 'pre-', type: 'prefix', meaning: 'before' }, { part: 'dict', type: 'root', meaning: 'say/tell' }, { part: '-able', type: 'suffix', meaning: 'able to be' }], meaning: 'not able to be told beforehand', answer: 'not able to be told beforehand' },
        { word: 'submarine', parts: [{ part: 'sub-', type: 'prefix', meaning: 'under' }, { part: 'mar', type: 'root', meaning: 'sea' }, { part: '-ine', type: 'suffix', meaning: 'relating to' }], meaning: 'relating to under the sea', answer: 'relating to under the sea' },
        { word: 'autobiography', parts: [{ part: 'auto-', type: 'prefix', meaning: 'self' }, { part: 'bio', type: 'root', meaning: 'life' }, { part: 'graph', type: 'root', meaning: 'write' }, { part: '-y', type: 'suffix', meaning: 'state of' }], meaning: 'self-written life story', answer: 'self-written life story' },
        { word: 'microscope', parts: [{ part: 'micro-', type: 'prefix', meaning: 'small' }, { part: 'scope', type: 'root', meaning: 'look at/examine' }], meaning: 'instrument for looking at small things', answer: 'instrument for looking at small things' },
        { word: 'beneficial', parts: [{ part: 'bene-', type: 'prefix', meaning: 'good/well' }, { part: 'fic', type: 'root', meaning: 'do/make' }, { part: '-ial', type: 'suffix', meaning: 'relating to' }], meaning: 'relating to doing good', answer: 'relating to doing good' },
        { word: 'interject', parts: [{ part: 'inter-', type: 'prefix', meaning: 'between' }, { part: 'ject', type: 'root', meaning: 'throw' }], meaning: 'to throw between; to insert', answer: 'to throw between; to insert' },
        { word: 'destruction', parts: [{ part: 'de-', type: 'prefix', meaning: 'down/away' }, { part: 'struct', type: 'root', meaning: 'build' }, { part: '-tion', type: 'suffix', meaning: 'act or process' }], meaning: 'the act of building down; tearing apart', answer: 'the act of building down; tearing apart' },
        { word: 'portable', parts: [{ part: 'port', type: 'root', meaning: 'carry' }, { part: '-able', type: 'suffix', meaning: 'able to be' }], meaning: 'able to be carried', answer: 'able to be carried' },
      ],
    },
    'reference-materials': {
      items: [
        { word: 'conduct', prompt: 'Which reference tool helps you find the correct pronunciation?', answer: 'dictionary', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { word: 'significant', prompt: 'You want to find a synonym for "significant." Which tool?', answer: 'thesaurus', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { word: 'photosynthesis', prompt: 'You encounter this word in a science textbook. Where do you look first?', answer: 'glossary', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { word: 'record', prompt: '"Record" can be a noun or verb. Which tool shows part of speech?', answer: 'dictionary', options: ['dictionary', 'thesaurus', 'glossary', 'atlas'] },
        { word: 'happy', prompt: 'You need varied words instead of repeating "happy." Which tool?', answer: 'thesaurus', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { word: 'democracy', prompt: 'Your social studies chapter defines this term at the back. That section is called a...', answer: 'glossary', options: ['dictionary', 'thesaurus', 'glossary', 'index'] },
        { word: 'rebel', prompt: '"REBel" vs "reBEL" — which tool shows syllable stress?', answer: 'dictionary', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { word: 'melancholy', prompt: 'You know the meaning but want words with a similar feeling. Which tool?', answer: 'thesaurus', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { word: 'algorithm', prompt: 'Your math textbook uses this term. Where is it defined in the book?', answer: 'glossary', options: ['dictionary', 'thesaurus', 'glossary', 'index'] },
        { word: 'present', prompt: 'This word has multiple meanings. Which tool lists all definitions?', answer: 'dictionary', options: ['dictionary', 'thesaurus', 'glossary', 'atlas'] },
      ],
    },
    'verify-meaning': {
      items: [
        { sentence: 'The coach tried to motivate the team by giving an inspiring speech.', word: 'motivate', guessedMeaning: 'to encourage someone to take action', dictionaryDef: 'to provide with a reason for doing something', answer: 'confirmed', match: true },
        { sentence: 'The novel approach surprised everyone in the meeting.', word: 'novel', guessedMeaning: 'a type of book', dictionaryDef: 'new and original; not like anything seen before', answer: 'revised', match: false },
        { sentence: 'She decided to table the discussion until next week.', word: 'table', guessedMeaning: 'a piece of furniture', dictionaryDef: 'to postpone consideration of', answer: 'revised', match: false },
        { sentence: 'The plaintiff tried to refute the false accusations.', word: 'refute', guessedMeaning: 'to prove something is wrong', dictionaryDef: 'to prove a statement or theory to be wrong or false', answer: 'confirmed', match: true },
        { sentence: 'The teacher tried to elicit responses from the quiet class.', word: 'elicit', guessedMeaning: 'to draw out or bring forth', dictionaryDef: 'to draw out a response or reaction', answer: 'confirmed', match: true },
        { sentence: 'The company will contract three new builders for the project.', word: 'contract', guessedMeaning: 'to shrink or get smaller', dictionaryDef: 'to enter into a formal agreement; to hire', answer: 'revised', match: false },
        { sentence: 'Her abstract paintings were hard to interpret.', word: 'abstract', guessedMeaning: 'a summary of an article', dictionaryDef: 'existing in thought or as an idea but not having physical existence; not concrete', answer: 'revised', match: false },
        { sentence: 'The documentary aimed to illuminate the lives of refugees.', word: 'illuminate', guessedMeaning: 'to shed light on; to clarify', dictionaryDef: 'to help clarify or explain; to light up', answer: 'confirmed', match: true },
      ],
    },
    'figurative-personification': {
      items: [
        { sentence: 'The wind whispered through the trees.', figure: 'personification', humanTrait: 'whispering', nonHuman: 'wind', meaning: 'The wind blew gently and softly through the trees.', answer: 'personification' },
        { sentence: 'The sun smiled down on the children playing in the park.', figure: 'personification', humanTrait: 'smiling', nonHuman: 'sun', meaning: 'The sun shone brightly and warmly.', answer: 'personification' },
        { sentence: 'The old house groaned under the weight of the snow.', figure: 'personification', humanTrait: 'groaning', nonHuman: 'house', meaning: 'The house creaked and strained from the heavy snow.', answer: 'personification' },
        { sentence: 'Lightning danced across the sky during the storm.', figure: 'personification', humanTrait: 'dancing', nonHuman: 'lightning', meaning: 'Lightning flashed rapidly in many directions.', answer: 'personification' },
        { sentence: 'The alarm clock screamed at me to wake up.', figure: 'personification', humanTrait: 'screaming', nonHuman: 'alarm clock', meaning: 'The alarm clock rang loudly.', answer: 'personification' },
        { sentence: 'Time crawled during the boring lecture.', figure: 'personification', humanTrait: 'crawling', nonHuman: 'time', meaning: 'Time seemed to pass very slowly.', answer: 'personification' },
        { sentence: 'The flowers nodded their heads in the gentle breeze.', figure: 'personification', humanTrait: 'nodding', nonHuman: 'flowers', meaning: 'The flowers swayed gently back and forth.', answer: 'personification' },
        { sentence: 'The stairs complained loudly every time someone walked on them.', figure: 'personification', humanTrait: 'complaining', nonHuman: 'stairs', meaning: 'The stairs creaked loudly.', answer: 'personification' },
        { sentence: 'Opportunity knocked on her door when she least expected it.', figure: 'personification', humanTrait: 'knocking', nonHuman: 'opportunity', meaning: 'A chance or possibility presented itself unexpectedly.', answer: 'personification' },
        { sentence: 'The camera loved her — every photo turned out perfectly.', figure: 'personification', humanTrait: 'loving', nonHuman: 'camera', meaning: 'She was very photogenic.', answer: 'personification' },
      ],
    },
    'word-relationships-cause-part': {
      items: [
        { pair: ['virus', 'illness'], relationship: 'cause/effect', explanation: 'A virus causes illness.', answer: 'cause/effect', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['wheel', 'bicycle'], relationship: 'part/whole', explanation: 'A wheel is part of a bicycle.', answer: 'part/whole', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['rose', 'flower'], relationship: 'item/category', explanation: 'A rose is a type of flower.', answer: 'item/category', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['drought', 'famine'], relationship: 'cause/effect', explanation: 'A drought can cause famine.', answer: 'cause/effect', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['chapter', 'book'], relationship: 'part/whole', explanation: 'A chapter is part of a book.', answer: 'part/whole', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['trumpet', 'instrument'], relationship: 'item/category', explanation: 'A trumpet is a type of instrument.', answer: 'item/category', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['exercise', 'fitness'], relationship: 'cause/effect', explanation: 'Exercise causes/leads to fitness.', answer: 'cause/effect', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['keyboard', 'computer'], relationship: 'part/whole', explanation: 'A keyboard is part of a computer.', answer: 'part/whole', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['eagle', 'bird'], relationship: 'item/category', explanation: 'An eagle is a type of bird.', answer: 'item/category', options: ['cause/effect', 'part/whole', 'item/category'] },
        { pair: ['practice', 'improvement'], relationship: 'cause/effect', explanation: 'Practice causes improvement.', answer: 'cause/effect', options: ['cause/effect', 'part/whole', 'item/category'] },
      ],
    },
    'connotation-denotation': {
      items: [
        { words: ['slender', 'thin', 'scrawny'], denotation: 'having little body fat', positive: 'slender', neutral: 'thin', negative: 'scrawny', answer: 'slender=positive, thin=neutral, scrawny=negative' },
        { words: ['thrifty', 'economical', 'cheap'], denotation: 'careful with money', positive: 'thrifty', neutral: 'economical', negative: 'cheap', answer: 'thrifty=positive, economical=neutral, cheap=negative' },
        { words: ['curious', 'interested', 'nosy'], denotation: 'wanting to know about something', positive: 'curious', neutral: 'interested', negative: 'nosy', answer: 'curious=positive, interested=neutral, nosy=negative' },
        { words: ['confident', 'self-assured', 'arrogant'], denotation: 'believing in oneself', positive: 'confident', neutral: 'self-assured', negative: 'arrogant', answer: 'confident=positive, self-assured=neutral, arrogant=negative' },
        { words: ['youthful', 'young', 'immature'], denotation: 'not old', positive: 'youthful', neutral: 'young', negative: 'immature', answer: 'youthful=positive, young=neutral, immature=negative' },
        { words: ['aroma', 'smell', 'stench'], denotation: 'something detected by the nose', positive: 'aroma', neutral: 'smell', negative: 'stench', answer: 'aroma=positive, smell=neutral, stench=negative' },
        { words: ['assertive', 'direct', 'pushy'], denotation: 'expressing opinions firmly', positive: 'assertive', neutral: 'direct', negative: 'pushy', answer: 'assertive=positive, direct=neutral, pushy=negative' },
        { words: ['vintage', 'old', 'outdated'], denotation: 'from an earlier time', positive: 'vintage', neutral: 'old', negative: 'outdated', answer: 'vintage=positive, old=neutral, outdated=negative' },
        { words: ['discuss', 'talk', 'gossip'], denotation: 'to exchange words', positive: 'discuss', neutral: 'talk', negative: 'gossip', answer: 'discuss=positive, talk=neutral, gossip=negative' },
        { words: ['determined', 'persistent', 'stubborn'], denotation: 'not giving up', positive: 'determined', neutral: 'persistent', negative: 'stubborn', answer: 'determined=positive, persistent=neutral, stubborn=negative' },
      ],
    },
    'academic-vocab-6': {
      items: [
        { word: 'analyze', definition: 'to examine something in detail to understand it', sentence: 'We need to analyze the data before drawing conclusions.', pos: 'verb', synonyms: ['examine', 'investigate', 'study'], answer: 'to examine in detail' },
        { word: 'evidence', definition: 'facts or information showing whether something is true', sentence: 'The scientist presented evidence to support her theory.', pos: 'noun', synonyms: ['proof', 'data', 'support'], answer: 'facts showing truth' },
        { word: 'interpret', definition: 'to explain the meaning of something', sentence: 'How do you interpret the author\'s message in this story?', pos: 'verb', synonyms: ['explain', 'clarify', 'decode'], answer: 'to explain meaning' },
        { word: 'significant', definition: 'important or large enough to have an effect', sentence: 'The discovery was significant because it changed how we understand the disease.', pos: 'adjective', synonyms: ['important', 'major', 'notable'], answer: 'important; having effect' },
        { word: 'cite', definition: 'to quote or refer to as evidence', sentence: 'Remember to cite your sources when writing a research paper.', pos: 'verb', synonyms: ['quote', 'reference', 'mention'], answer: 'to quote as evidence' },
        { word: 'contrast', definition: 'to compare in order to show differences', sentence: 'The essay asked us to contrast the two characters\' motivations.', pos: 'verb', synonyms: ['compare', 'differentiate', 'distinguish'], answer: 'to show differences' },
        { word: 'formulate', definition: 'to create or develop something carefully', sentence: 'The team worked together to formulate a plan for the science fair.', pos: 'verb', synonyms: ['develop', 'devise', 'create'], answer: 'to develop carefully' },
        { word: 'relevant', definition: 'closely connected or appropriate to the matter at hand', sentence: 'Only include details that are relevant to your argument.', pos: 'adjective', synonyms: ['pertinent', 'applicable', 'related'], answer: 'closely connected' },
        { word: 'summarize', definition: 'to give a brief statement of the main points', sentence: 'Please summarize the article in three sentences.', pos: 'verb', synonyms: ['condense', 'outline', 'recap'], answer: 'to state main points briefly' },
        { word: 'acquire', definition: 'to gain or obtain something', sentence: 'Students acquire new vocabulary through reading widely.', pos: 'verb', synonyms: ['obtain', 'gain', 'attain'], answer: 'to gain or obtain' },
      ],
    },
  },
  'grade-7': {
    'context-clues-advanced': {
      items: [
        { passage: 'The politician\'s speech was nothing but rhetoric — elaborate language designed to persuade but lacking real substance.', word: 'rhetoric', answer: 'persuasive but empty language', clueType: 'definition/restatement', options: ['sincere communication', 'persuasive but empty language', 'scientific terminology', 'whispered speech'] },
        { passage: 'The pragmatic businesswoman focused on practical solutions rather than idealistic theories.', word: 'pragmatic', answer: 'practical; focused on realistic solutions', clueType: 'synonym', options: ['dreamy and idealistic', 'practical and realistic', 'angry and frustrated', 'wealthy and powerful'] },
        { passage: 'His candor was refreshing; while others sugarcoated the truth, he spoke honestly and directly.', word: 'candor', answer: 'honesty and directness in speech', clueType: 'antonym/contrast', options: ['dishonesty', 'openness and honesty', 'anger', 'confusion'] },
        { passage: 'The professor\'s verbose explanation went on for thirty minutes when five would have sufficed.', word: 'verbose', answer: 'using more words than needed', clueType: 'inference', options: ['brief and clear', 'using too many words', 'very quiet', 'extremely interesting'] },
        { passage: 'Ubiquitous smartphones have become so common that it is rare to see anyone without one.', word: 'ubiquitous', answer: 'found everywhere; very common', clueType: 'definition/restatement', options: ['extremely rare', 'found everywhere', 'very expensive', 'recently invented'] },
        { passage: 'The austere room contained only a cot and a small desk — no decorations, no comforts, nothing extra.', word: 'austere', answer: 'severe; without comfort or luxury', clueType: 'example', options: ['luxurious', 'plain and severe', 'brightly colored', 'extremely large'] },
        { passage: 'Rather than exacerbate the conflict, the mediator tried to calm both sides.', word: 'exacerbate', answer: 'to make worse', clueType: 'antonym/contrast', options: ['to make worse', 'to resolve', 'to ignore', 'to celebrate'] },
        { passage: 'The unprecedented event had never occurred before in the school\'s hundred-year history.', word: 'unprecedented', answer: 'never done or experienced before', clueType: 'definition/restatement', options: ['happening frequently', 'never done before', 'carefully planned', 'well understood'] },
        { passage: 'Her enigmatic smile left everyone wondering what she was really thinking.', word: 'enigmatic', answer: 'mysterious and puzzling', clueType: 'inference', options: ['wide and cheerful', 'mysterious and puzzling', 'sad and tearful', 'angry and threatening'] },
        { passage: 'The superfluous details cluttered the essay; cutting them made the argument clearer and more concise.', word: 'superfluous', answer: 'unnecessary; more than needed', clueType: 'inference', options: ['essential', 'unnecessary; extra', 'very important', 'confusing'] },
      ],
    },
    'greek-latin-roots': {
      items: [
        { root: 'chron', origin: 'Greek', meaning: 'time', words: ['chronological', 'chronic', 'synchronize', 'chronicle'], prompt: 'What does the root "chron" mean?', answer: 'time' },
        { root: 'path', origin: 'Greek', meaning: 'feeling/suffering', words: ['sympathy', 'empathy', 'apathy', 'pathetic'], prompt: 'What does the root "path" mean?', answer: 'feeling/suffering' },
        { root: 'bene', origin: 'Latin', meaning: 'good/well', words: ['benefit', 'benevolent', 'beneficial', 'benediction'], prompt: 'What does the root "bene" mean?', answer: 'good/well' },
        { root: 'duc/duct', origin: 'Latin', meaning: 'lead', words: ['conduct', 'introduce', 'deduce', 'aqueduct'], prompt: 'What does the root "duc/duct" mean?', answer: 'lead' },
        { root: 'spec/spect', origin: 'Latin', meaning: 'look/see', words: ['inspect', 'spectacle', 'perspective', 'spectator'], prompt: 'What does the root "spec/spect" mean?', answer: 'look/see' },
        { root: 'scrib/script', origin: 'Latin', meaning: 'write', words: ['describe', 'manuscript', 'prescribe', 'scripture'], prompt: 'What does the root "scrib/script" mean?', answer: 'write' },
        { root: 'aud', origin: 'Latin', meaning: 'hear', words: ['audience', 'audible', 'auditorium', 'audition'], prompt: 'What does the root "aud" mean?', answer: 'hear' },
        { root: 'log/logue', origin: 'Greek', meaning: 'word/study', words: ['dialogue', 'monologue', 'biology', 'prologue'], prompt: 'What does the root "log/logue" mean?', answer: 'word/study' },
        { root: 'mit/mis', origin: 'Latin', meaning: 'send', words: ['transmit', 'mission', 'dismiss', 'missile'], prompt: 'What does the root "mit/mis" mean?', answer: 'send' },
        { root: 'rupt', origin: 'Latin', meaning: 'break', words: ['interrupt', 'corrupt', 'erupt', 'abrupt'], prompt: 'What does the root "rupt" mean?', answer: 'break' },
        { root: 'phon', origin: 'Greek', meaning: 'sound', words: ['telephone', 'symphony', 'phonics', 'microphone'], prompt: 'What does the root "phon" mean?', answer: 'sound' },
        { root: 'graph/gram', origin: 'Greek', meaning: 'write/draw', words: ['biography', 'telegram', 'paragraph', 'autograph'], prompt: 'What does the root "graph/gram" mean?', answer: 'write/draw' },
      ],
    },
    'reference-specialized': {
      items: [
        { scenario: 'You are reading a medical article and encounter "myocardial infarction."', bestRef: 'specialized medical dictionary', answer: 'specialized medical dictionary', options: ['general dictionary', 'thesaurus', 'specialized medical dictionary', 'encyclopedia'] },
        { scenario: 'Your history textbook uses the phrase "Manifest Destiny" without explaining it.', bestRef: 'encyclopedia or history reference', answer: 'encyclopedia or history reference', options: ['thesaurus', 'general dictionary', 'encyclopedia or history reference', 'atlas'] },
        { scenario: 'You need to understand how the word "democracy" has been used in political science.', bestRef: 'specialized political science dictionary', answer: 'specialized political science dictionary', options: ['general dictionary', 'thesaurus', 'specialized political science dictionary', 'glossary'] },
        { scenario: 'You want to know if "affect" or "effect" is correct in your sentence.', bestRef: 'usage guide or dictionary', answer: 'usage guide or dictionary', options: ['thesaurus', 'usage guide or dictionary', 'encyclopedia', 'glossary'] },
        { scenario: 'Your science teacher uses the term "endothermic." You check the textbook\'s back pages.', bestRef: 'glossary', answer: 'glossary', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { scenario: 'You want synonyms for "beautiful" that convey different shades of meaning.', bestRef: 'thesaurus', answer: 'thesaurus', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
        { scenario: 'You need the precise legal meaning of "liability" for a debate assignment.', bestRef: 'specialized legal dictionary', answer: 'specialized legal dictionary', options: ['general dictionary', 'thesaurus', 'specialized legal dictionary', 'encyclopedia'] },
        { scenario: 'You want to know how to pronounce "epitome" correctly.', bestRef: 'dictionary with pronunciation guide', answer: 'dictionary with pronunciation guide', options: ['thesaurus', 'dictionary with pronunciation guide', 'glossary', 'encyclopedia'] },
        { scenario: 'You need a list of words related to "courage" for a creative writing piece.', bestRef: 'thesaurus', answer: 'thesaurus', options: ['dictionary', 'thesaurus', 'glossary', 'usage guide'] },
        { scenario: 'Your math class introduces "asymptote." You check the math textbook back matter.', bestRef: 'glossary', answer: 'glossary', options: ['dictionary', 'thesaurus', 'glossary', 'encyclopedia'] },
      ],
    },
    'verify-context': {
      items: [
        { sentence: 'The bank of the river was covered in wildflowers.', word: 'bank', contextMeaning: 'the land alongside a river', otherMeaning: 'a financial institution', answer: 'the land alongside a river', verified: true },
        { sentence: 'She decided to address the crowd before the ceremony began.', word: 'address', contextMeaning: 'to speak to', otherMeaning: 'a location where someone lives', answer: 'to speak to', verified: true },
        { sentence: 'The bass guitar provided a deep rhythm for the song.', word: 'bass', contextMeaning: 'low-pitched musical tone', otherMeaning: 'a type of freshwater fish', answer: 'low-pitched musical tone', verified: true },
        { sentence: 'The minute details of the painting were easy to miss.', word: 'minute', contextMeaning: 'extremely small', otherMeaning: 'a unit of time (60 seconds)', answer: 'extremely small', verified: true },
        { sentence: 'Please bow to the audience at the end of the performance.', word: 'bow', contextMeaning: 'to bend forward as a sign of respect', otherMeaning: 'a weapon for shooting arrows; a ribbon tied in loops', answer: 'to bend forward as a sign of respect', verified: true },
        { sentence: 'The desert wind blew sand across the ancient ruins.', word: 'desert', contextMeaning: 'a dry, barren area of land', otherMeaning: 'to abandon or leave', answer: 'a dry barren area', verified: true },
        { sentence: 'He tried to console his friend after the loss.', word: 'console', contextMeaning: 'to comfort someone', otherMeaning: 'a panel of controls; a gaming device', answer: 'to comfort someone', verified: true },
        { sentence: 'The project will take several months to complete.', word: 'project', contextMeaning: 'a planned undertaking', otherMeaning: 'to throw forward; to estimate', answer: 'a planned undertaking', verified: true },
      ],
    },
    'figurative-allusions': {
      items: [
        { sentence: 'He had a Midas touch when it came to business — every venture turned to gold.', allusion: 'King Midas (Greek mythology)', meaning: 'Everything he did was profitable/successful.', source: 'mythological', answer: 'King Midas - everything turns to gold/success' },
        { sentence: 'She opened Pandora\'s box when she brought up the old argument.', allusion: 'Pandora\'s box (Greek mythology)', meaning: 'She started something that caused many unforeseen problems.', source: 'mythological', answer: 'Pandora\'s box - unleashing many problems' },
        { sentence: 'The company\'s Achilles\' heel was its outdated technology.', allusion: 'Achilles (Greek mythology)', meaning: 'The company\'s fatal weakness was its old technology.', source: 'mythological', answer: 'Achilles heel - a critical weakness' },
        { sentence: 'The new student was a Good Samaritan, always helping others.', allusion: 'Good Samaritan (Biblical)', meaning: 'The student was kind and helpful to everyone.', source: 'biblical', answer: 'Good Samaritan - a person who helps strangers' },
        { sentence: 'The politician met his Waterloo when the scandal broke.', allusion: 'Battle of Waterloo (Napoleon\'s defeat)', meaning: 'The politician experienced a decisive defeat.', source: 'historical', answer: 'Waterloo - a decisive defeat' },
        { sentence: 'Her new novel was her magnum opus — a true masterpiece.', allusion: 'Magnum opus (Latin/literary)', meaning: 'Her greatest work.', source: 'literary', answer: 'Magnum opus - greatest work' },
        { sentence: 'The detective was a real Sherlock Holmes, noticing every tiny detail.', allusion: 'Sherlock Holmes (literary)', meaning: 'The detective was extremely observant and analytical.', source: 'literary', answer: 'Sherlock Holmes - extremely observant detective' },
        { sentence: 'He was a Romeo, constantly falling in love.', allusion: 'Romeo (Shakespeare)', meaning: 'He was a hopeless romantic.', source: 'literary', answer: 'Romeo - a romantic lover' },
        { sentence: 'The siblings had a David and Goliath dynamic on the basketball court.', allusion: 'David and Goliath (Biblical)', meaning: 'One was much smaller/weaker but competed bravely against the bigger one.', source: 'biblical', answer: 'David and Goliath - underdog vs powerful opponent' },
        { sentence: 'Cleaning my room felt like a Herculean task.', allusion: 'Hercules (Greek mythology)', meaning: 'It required enormous effort.', source: 'mythological', answer: 'Herculean - requiring great strength or effort' },
      ],
    },
    'word-analogies': {
      items: [
        { analogy: 'hot : cold :: light : ___', answer: 'dark', relationship: 'antonym', options: ['bright', 'dark', 'lamp', 'sun'] },
        { analogy: 'author : book :: composer : ___', answer: 'symphony', relationship: 'creator to creation', options: ['piano', 'symphony', 'singer', 'audience'] },
        { analogy: 'fish : school :: wolf : ___', answer: 'pack', relationship: 'animal to group name', options: ['forest', 'pack', 'den', 'fur'] },
        { analogy: 'glove : hand :: shoe : ___', answer: 'foot', relationship: 'object to what it covers', options: ['sock', 'foot', 'leather', 'lace'] },
        { analogy: 'chapter : book :: scene : ___', answer: 'play', relationship: 'part to whole', options: ['movie', 'play', 'act', 'stage'] },
        { analogy: 'puppy : dog :: kitten : ___', answer: 'cat', relationship: 'young to adult', options: ['cat', 'fur', 'meow', 'pet'] },
        { analogy: 'telescope : stars :: microscope : ___', answer: 'cells', relationship: 'tool to what it examines', options: ['lab', 'cells', 'glass', 'doctor'] },
        { analogy: 'brave : cowardly :: generous : ___', answer: 'selfish', relationship: 'antonym', options: ['kind', 'selfish', 'rich', 'giving'] },
        { analogy: 'pen : write :: scissors : ___', answer: 'cut', relationship: 'tool to function', options: ['paper', 'cut', 'sharp', 'craft'] },
        { analogy: 'doctor : hospital :: teacher : ___', answer: 'school', relationship: 'worker to workplace', options: ['student', 'school', 'classroom', 'book'] },
      ],
    },
    'connotation-nuance': {
      items: [
        { words: ['refined', 'respectful', 'polite', 'diplomatic', 'sycophantic'], denotation: 'showing regard for others', ranking: ['sycophantic', 'diplomatic', 'polite', 'respectful', 'refined'], prompt: 'Rank from most negative to most positive connotation.', answer: 'sycophantic < diplomatic < polite < respectful < refined' },
        { words: ['frugal', 'thrifty', 'miserly', 'economical', 'stingy'], denotation: 'careful with money', ranking: ['miserly', 'stingy', 'economical', 'thrifty', 'frugal'], prompt: 'Rank from most negative to most positive.', answer: 'miserly < stingy < economical < thrifty < frugal' },
        { words: ['chatty', 'eloquent', 'talkative', 'verbose', 'articulate'], denotation: 'using many words', ranking: ['verbose', 'chatty', 'talkative', 'articulate', 'eloquent'], prompt: 'Rank from most negative to most positive.', answer: 'verbose < chatty < talkative < articulate < eloquent' },
        { words: ['inquisitive', 'nosy', 'curious', 'prying', 'interested'], denotation: 'wanting to know things', ranking: ['prying', 'nosy', 'curious', 'interested', 'inquisitive'], prompt: 'Rank from most negative to most positive.', answer: 'prying < nosy < curious < interested < inquisitive' },
        { words: ['aggressive', 'assertive', 'domineering', 'confident', 'bold'], denotation: 'strong in manner', ranking: ['domineering', 'aggressive', 'bold', 'assertive', 'confident'], prompt: 'Rank from most negative to most positive.', answer: 'domineering < aggressive < bold < assertive < confident' },
        { words: ['skinny', 'slender', 'lean', 'gaunt', 'svelte'], denotation: 'having a thin body', ranking: ['gaunt', 'skinny', 'lean', 'slender', 'svelte'], prompt: 'Rank from most negative to most positive.', answer: 'gaunt < skinny < lean < slender < svelte' },
        { words: ['childish', 'youthful', 'immature', 'juvenile', 'young'], denotation: 'having qualities of youth', ranking: ['childish', 'immature', 'juvenile', 'young', 'youthful'], prompt: 'Rank from most negative to most positive.', answer: 'childish < immature < juvenile < young < youthful' },
        { words: ['obstinate', 'resolute', 'stubborn', 'determined', 'headstrong'], denotation: 'unwilling to change', ranking: ['obstinate', 'stubborn', 'headstrong', 'determined', 'resolute'], prompt: 'Rank from most negative to most positive.', answer: 'obstinate < stubborn < headstrong < determined < resolute' },
      ],
    },
    'academic-vocab-7': {
      items: [
        { word: 'synthesize', definition: 'to combine different ideas to form a new whole', sentence: 'The essay required students to synthesize information from multiple sources.', pos: 'verb', synonyms: ['combine', 'integrate', 'merge'], answer: 'to combine ideas into a new whole' },
        { word: 'infer', definition: 'to conclude from evidence and reasoning rather than explicit statements', sentence: 'Based on the character\'s actions, we can infer that she feels guilty.', pos: 'verb', synonyms: ['deduce', 'conclude', 'gather'], answer: 'to conclude from evidence' },
        { word: 'credible', definition: 'able to be believed; trustworthy', sentence: 'A credible source provides reliable, verifiable information.', pos: 'adjective', synonyms: ['believable', 'trustworthy', 'reliable'], answer: 'able to be believed' },
        { word: 'evaluate', definition: 'to judge or assess the value or quality of something', sentence: 'The teacher asked us to evaluate the strength of the author\'s argument.', pos: 'verb', synonyms: ['assess', 'judge', 'appraise'], answer: 'to judge quality or value' },
        { word: 'convey', definition: 'to communicate or express something', sentence: 'The poet uses vivid imagery to convey a sense of loneliness.', pos: 'verb', synonyms: ['communicate', 'express', 'transmit'], answer: 'to communicate or express' },
        { word: 'predominant', definition: 'having the most importance, influence, or force', sentence: 'The predominant theme in the novel is the struggle for identity.', pos: 'adjective', synonyms: ['dominant', 'chief', 'primary'], answer: 'most important or influential' },
        { word: 'elaborate', definition: 'to add more detail or information', sentence: 'Can you elaborate on your answer with specific examples?', pos: 'verb', synonyms: ['expand', 'develop', 'explain'], answer: 'to add more detail' },
        { word: 'refine', definition: 'to improve by making small changes', sentence: 'Writers refine their drafts through multiple rounds of revision.', pos: 'verb', synonyms: ['improve', 'polish', 'perfect'], answer: 'to improve with small changes' },
        { word: 'bias', definition: 'a tendency to favor or oppose something unfairly', sentence: 'Good researchers try to identify and minimize bias in their studies.', pos: 'noun', synonyms: ['prejudice', 'partiality', 'inclination'], answer: 'unfair tendency to favor or oppose' },
        { word: 'implicit', definition: 'suggested but not directly stated', sentence: 'The implicit message of the story is that kindness matters more than wealth.', pos: 'adjective', synonyms: ['implied', 'unspoken', 'understood'], answer: 'suggested but not stated' },
      ],
    },
  },
  'grade-8': {
    'context-clues-complex': {
      items: [
        { passage: 'The senator\'s equivocal response left both sides of the debate unsatisfied — supporters wanted a clear "yes" and opponents wanted a definitive "no," but she had committed to neither.', word: 'equivocal', answer: 'ambiguous; open to more than one interpretation', clueType: 'inference', options: ['very clear', 'ambiguous and unclear', 'extremely loud', 'deeply offensive'] },
        { passage: 'While the protagonist\'s ostensible motive was to help the community, the reader gradually discovers her true intention was personal gain — a duplicity that makes her a compelling antihero.', word: 'ostensible', answer: 'appearing to be true but not necessarily so', clueType: 'antonym/contrast', options: ['hidden and secret', 'appearing true but perhaps not', 'genuinely sincere', 'completely obvious'] },
        { passage: 'The once-lauded CEO fell from grace; her erstwhile admirers now denounced her, and the media, which had been sycophantic in its praise, turned vitriolic in its criticism.', word: 'vitriolic', answer: 'cruelly harsh or bitter', clueType: 'antonym/contrast', options: ['mildly critical', 'extremely praising', 'cruelly harsh', 'quietly supportive'] },
        { passage: 'The author\'s prose was marked by brevity and precision — each sentence was pared down to its essential meaning, with no superfluous words to dilute the impact.', word: 'pared', answer: 'trimmed; reduced to essentials', clueType: 'definition/restatement', options: ['expanded greatly', 'trimmed to essentials', 'written carelessly', 'copied exactly'] },
        { passage: 'His magnanimous gesture — forgiving the debt of a rival who had wronged him — earned the respect of the entire community.', word: 'magnanimous', answer: 'generous and forgiving, especially toward a rival', clueType: 'example', options: ['selfish and cruel', 'generous and forgiving', 'weak and timid', 'wealthy and powerful'] },
        { passage: 'The researcher\'s methodology was meticulous but her conclusions were specious: they appeared logical at first glance yet crumbled under rigorous scrutiny.', word: 'specious', answer: 'seemingly true but actually false', clueType: 'inference', options: ['completely accurate', 'seemingly true but false', 'extremely complex', 'beautifully written'] },
        { passage: 'Years of political turmoil had left the nation in a state of entropy — institutions crumbled, social order dissolved, and what had once been a cohesive society splintered into factions.', word: 'entropy', answer: 'a state of disorder and decline', clueType: 'example', options: ['perfect order', 'disorder and decline', 'rapid growth', 'peaceful calm'] },
        { passage: 'The diplomat\'s insouciant attitude toward the crisis — shrugging off warnings and joking at press conferences — infuriated those who took the threat seriously.', word: 'insouciant', answer: 'casually unconcerned', clueType: 'example', options: ['deeply worried', 'casually unconcerned', 'extremely angry', 'highly motivated'] },
        { passage: 'Unlike propaganda, which seeks to manipulate, good journalism strives to be objective and dispassionate, presenting facts without emotional coloring.', word: 'dispassionate', answer: 'not influenced by strong emotion; impartial', clueType: 'antonym/contrast', options: ['extremely emotional', 'not influenced by emotion', 'secretly biased', 'completely indifferent'] },
        { passage: 'The ephemeral beauty of the cherry blossoms — lasting only a week or two before the petals fell — made them all the more precious.', word: 'ephemeral', answer: 'lasting a very short time', clueType: 'definition/restatement', options: ['lasting forever', 'lasting a very short time', 'extremely bright', 'artificially created'] },
      ],
    },
    'greek-latin-patterns': {
      items: [
        { pattern: 'mono- (one) + log (word) = monologue', prompt: 'If "mono" means one and "log" means word/speech, what is a "monologue"?', answer: 'a speech by one person', words: ['monologue', 'dialogue', 'prologue', 'epilogue'] },
        { pattern: 'bene- (good) + dict (say) = benediction', prompt: 'If "bene" means good and "dict" means say, what is a "benediction"?', answer: 'a good saying; a blessing', words: ['benediction', 'malediction', 'prediction', 'contradiction'] },
        { pattern: 'anti- (against) + path (feeling) = antipathy', prompt: 'If "anti" means against and "path" means feeling, what is "antipathy"?', answer: 'a feeling against; strong dislike', words: ['antipathy', 'sympathy', 'empathy', 'apathy'] },
        { pattern: 'circum- (around) + scrib (write) = circumscribe', prompt: 'If "circum" means around and "scrib" means write, what does "circumscribe" mean?', answer: 'to draw a line around; to limit', words: ['circumscribe', 'describe', 'inscribe', 'prescribe'] },
        { pattern: 'mal- (bad) + vol (wish) = malevolent', prompt: 'If "mal" means bad and "vol" means wish, what does "malevolent" mean?', answer: 'wishing bad things; having ill will', words: ['malevolent', 'benevolent', 'malicious', 'voluntary'] },
        { pattern: 'omni- (all) + sci (know) = omniscient', prompt: 'If "omni" means all and "sci" means know, what does "omniscient" mean?', answer: 'all-knowing', words: ['omniscient', 'omnipotent', 'omnivore', 'science'] },
        { pattern: 'pseudo- (false) + nym (name) = pseudonym', prompt: 'If "pseudo" means false and "nym" means name, what is a "pseudonym"?', answer: 'a false name; a pen name', words: ['pseudonym', 'synonym', 'antonym', 'anonymous'] },
        { pattern: 'retro- (back) + spect (look) = retrospect', prompt: 'If "retro" means back and "spect" means look, what does "retrospect" mean?', answer: 'looking back at the past', words: ['retrospect', 'prospect', 'inspect', 'perspective'] },
        { pattern: 'ambi- (both) + val (strength) = ambivalent', prompt: 'If "ambi" means both and "val" means strength/worth, what does "ambivalent" mean?', answer: 'having mixed or contradictory feelings', words: ['ambivalent', 'ambiguous', 'equivalent', 'valiant'] },
        { pattern: 'trans- (across) + luc (light) = translucent', prompt: 'If "trans" means across and "luc" means light, what does "translucent" mean?', answer: 'allowing light to pass through', words: ['translucent', 'transparent', 'lucid', 'elucidate'] },
      ],
    },
    'reference-etymology': {
      items: [
        { word: 'salary', etymology: 'From Latin "salarium" — money given to Roman soldiers to buy salt', prompt: 'How does knowing "salary" comes from the Latin word for salt help you understand its meaning?', answer: 'Salt was so valuable that it was used as payment, so salary means regular payment for work.', insight: 'Valuable commodities shaped language.' },
        { word: 'disaster', etymology: 'From Italian "disastro" — dis (bad) + astro (star)', prompt: 'The word "disaster" originally referred to bad stars. How does this connect to its modern meaning?', answer: 'Ancient people believed bad star alignments caused terrible events. Now it means any catastrophic event.', insight: 'Beliefs about celestial influence shaped vocabulary.' },
        { word: 'quarantine', etymology: 'From Italian "quaranta giorni" — forty days', prompt: 'Why might "quarantine" be related to the number forty?', answer: 'Ships suspected of carrying plague were kept in port for 40 days. Now it means any period of isolation.', insight: 'Historical health practices created new words.' },
        { word: 'sarcasm', etymology: 'From Greek "sarkazein" — to tear flesh', prompt: 'How does the violent Greek origin of "sarcasm" relate to its modern use?', answer: 'Sarcasm is meant to wound or mock, like verbally tearing at someone.', insight: 'Metaphorical extensions of physical actions.' },
        { word: 'boycott', etymology: 'Named after Captain Charles Boycott, an English land agent in Ireland, 1880', prompt: 'How did a person\'s name become a common word?', answer: 'His tenants refused to deal with him, and the practice of organized refusal took his name.', insight: 'Eponyms: people whose names became common words.' },
        { word: 'algorithm', etymology: 'From al-Khwarizmi, a 9th-century Persian mathematician', prompt: 'What does the origin of "algorithm" tell us about mathematical history?', answer: 'Key mathematical concepts were developed in the Islamic Golden Age. The word preserves that heritage.', insight: 'Scientific terms often trace to their discoverers.' },
        { word: 'cynic', etymology: 'From Greek "kynikos" — dog-like', prompt: 'Ancient Greek Cynics were called "dog-like." How does this connect to modern meaning?', answer: 'The Cynics rejected social conventions and lived simply, which others saw as dog-like. Now it means distrusting human sincerity.', insight: 'Philosophical movements shaped everyday vocabulary.' },
        { word: 'panic', etymology: 'From Greek god Pan, who could cause sudden fear in herds and crowds', prompt: 'How does the god Pan connect to the word "panic"?', answer: 'Pan was believed to cause sudden, irrational fear. Panic now means sudden uncontrollable fear.', insight: 'Mythology embedded in modern vocabulary.' },
        { word: 'candidate', etymology: 'From Latin "candidatus" — one dressed in white', prompt: 'Why were Roman political candidates associated with white clothing?', answer: 'Roman office-seekers wore bright white togas to symbolize purity. Now candidate means anyone seeking a position.', insight: 'Political customs preserved in language.' },
        { word: 'trivial', etymology: 'From Latin "trivium" — a place where three roads meet', prompt: 'How did a crossroads become associated with something unimportant?', answer: 'Common, everyday conversations happened at crossroads. Topics discussed there were considered unimportant.', insight: 'Social geography shaped word connotations.' },
      ],
    },
    'verify-multiple': {
      items: [
        { word: 'sanction', sentence: 'The government imposed sanctions on the hostile nation.', meaning1: 'a penalty for breaking a law or rule', meaning2: 'official permission or approval', correctMeaning: 'a penalty for breaking a law or rule', answer: 'penalty', pos: 'noun', pronunciation: 'SANK-shun' },
        { word: 'cleave', sentence: 'The axe will cleave the log in two.', meaning1: 'to split or divide', meaning2: 'to cling or adhere closely', correctMeaning: 'to split or divide', answer: 'split', pos: 'verb', pronunciation: 'KLEEV' },
        { word: 'oversight', sentence: 'The committee provides oversight of the project budget.', meaning1: 'supervision; watchful care', meaning2: 'an unintentional failure to notice', correctMeaning: 'supervision; watchful care', answer: 'supervision', pos: 'noun', pronunciation: 'OH-ver-site' },
        { word: 'temper', sentence: 'The coach tried to temper his criticism with encouragement.', meaning1: 'to moderate or soften', meaning2: 'a tendency to become angry', correctMeaning: 'to moderate or soften', answer: 'moderate', pos: 'verb', pronunciation: 'TEM-per' },
        { word: 'qualify', sentence: 'I need to qualify my earlier statement — it applies only in certain conditions.', meaning1: 'to limit or modify the meaning of', meaning2: 'to meet the necessary requirements', correctMeaning: 'to limit or modify the meaning of', answer: 'limit meaning', pos: 'verb', pronunciation: 'KWOL-uh-fy' },
        { word: 'flag', sentence: 'The editor will flag any passages that need revision.', meaning1: 'to mark for attention', meaning2: 'to become tired or weak', correctMeaning: 'to mark for attention', answer: 'mark for attention', pos: 'verb', pronunciation: 'FLAG' },
        { word: 'weather', sentence: 'The old ship managed to weather the terrible storm.', meaning1: 'to survive or endure', meaning2: 'the state of the atmosphere', correctMeaning: 'to survive or endure', answer: 'survive', pos: 'verb', pronunciation: 'WETH-er' },
        { word: 'conviction', sentence: 'She spoke with great conviction about the importance of education.', meaning1: 'a firmly held belief', meaning2: 'a formal declaration of guilt', correctMeaning: 'a firmly held belief', answer: 'firm belief', pos: 'noun', pronunciation: 'kun-VIK-shun' },
      ],
    },
    'figurative-verbal-irony': {
      items: [
        { sentence: '"What a beautiful day for a picnic," she said, staring at the torrential downpour.', figure: 'verbal irony', meaning: 'She means the opposite — the weather is terrible for a picnic.', signal: 'The contrast between "beautiful day" and "torrential downpour."', answer: 'verbal irony' },
        { sentence: '"I just love getting stuck in traffic," he muttered during the two-hour commute.', figure: 'verbal irony', meaning: 'He clearly does not enjoy traffic at all.', signal: 'The word "love" contrasts with "stuck" and "muttered."', answer: 'verbal irony' },
        { sentence: '"Oh great, another pop quiz," the student said, slumping in her chair.', figure: 'verbal irony', meaning: 'She is not happy at all about the quiz.', signal: '"Oh great" is positive but body language and context show displeasure.', answer: 'verbal irony' },
        { sentence: '"Nice parking job," he said to the car straddling two spaces.', figure: 'verbal irony', meaning: 'The parking is actually very poor.', signal: '"Nice" is used sarcastically since the car is in two spaces.', answer: 'verbal irony' },
        { sentence: 'The fire station burned down. Well, how ironic.', figure: 'situational irony', meaning: 'The place meant to fight fires was itself destroyed by fire.', signal: 'The expected role of a fire station contrasts with what happened.', answer: 'situational irony' },
        { sentence: '"I can\'t wait to write this ten-page essay over spring break," she said, rolling her eyes.', figure: 'verbal irony', meaning: 'She absolutely does not want to write the essay.', signal: '"Can\'t wait" is enthusiastic but eye-rolling shows the opposite.', answer: 'verbal irony' },
        { sentence: '"How generous of you to leave me the last crumb," he said, eyeing the empty cookie plate.', figure: 'verbal irony', meaning: 'He is annoyed that almost nothing was left for him.', signal: '"Generous" and "last crumb" are in obvious contradiction.', answer: 'verbal irony' },
        { sentence: '"Well, that went exactly as planned," the coach said after the team lost 42-0.', figure: 'verbal irony', meaning: 'Nothing went as planned; the loss was a disaster.', signal: '"Exactly as planned" contrasts with the devastating score.', answer: 'verbal irony' },
        { sentence: 'Time flies like an arrow; fruit flies like a banana.', figure: 'pun', meaning: 'The first "flies" means passes quickly; the second "flies" means small insects. "Like" shifts from comparison to preference.', signal: 'The double meaning of "flies" and "like" creates humor.', answer: 'pun' },
        { sentence: 'I used to be a banker, but I lost interest.', figure: 'pun', meaning: '"Interest" means both curiosity/enthusiasm and money earned on deposits.', signal: 'The word "interest" has two relevant meanings.', answer: 'pun' },
      ],
    },
    'word-relationships-advanced': {
      items: [
        { analogy: 'meticulous : careless :: generous : ___', answer: 'selfish', relationship: 'antonym', options: ['kind', 'selfish', 'wealthy', 'giving'] },
        { analogy: 'symphony : music :: novel : ___', answer: 'literature', relationship: 'type to category', options: ['book', 'literature', 'author', 'chapter'] },
        { analogy: 'starvation : hunger :: exhaustion : ___', answer: 'fatigue', relationship: 'extreme to moderate', options: ['fatigue', 'sleep', 'energy', 'rest'] },
        { analogy: 'curator : museum :: editor : ___', answer: 'publication', relationship: 'person to what they oversee', options: ['book', 'writer', 'publication', 'office'] },
        { analogy: 'cacophony : sound :: chaos : ___', answer: 'order', relationship: 'negative form to domain', options: ['order', 'noise', 'confusion', 'peace'] },
        { analogy: 'hypothesis : theory :: sketch : ___', answer: 'painting', relationship: 'preliminary to finished', options: ['drawing', 'painting', 'artist', 'canvas'] },
        { analogy: 'eloquent : speaker :: graceful : ___', answer: 'dancer', relationship: 'quality to possessor', options: ['ballet', 'dancer', 'movement', 'stage'] },
        { analogy: 'plagiarism : writing :: forgery : ___', answer: 'art', relationship: 'deception in domain', options: ['crime', 'art', 'money', 'signature'] },
        { analogy: 'prologue : epilogue :: introduction : ___', answer: 'conclusion', relationship: 'beginning to end', options: ['body', 'conclusion', 'summary', 'chapter'] },
        { analogy: 'dormant : volcano :: latent : ___', answer: 'talent', relationship: 'inactive quality to thing possessing it', options: ['talent', 'disease', 'ability', 'potential'] },
      ],
    },
    'connotation-tone': {
      items: [
        { passage: 'The politician slithered to the podium and delivered a calculated address.', tone: 'negative/distrustful', connotationWords: ['slithered', 'calculated'], neutralVersion: 'The politician walked to the podium and delivered a prepared address.', answer: 'negative — "slithered" and "calculated" suggest dishonesty' },
        { passage: 'The determined leader marched forward with unwavering resolve.', tone: 'positive/admiring', connotationWords: ['determined', 'marched', 'unwavering'], neutralVersion: 'The leader moved forward with consistent effort.', answer: 'positive — "determined," "marched," "unwavering" suggest strength and courage' },
        { passage: 'The mob swarmed the entrance, demanding to be heard.', tone: 'negative/threatening', connotationWords: ['mob', 'swarmed', 'demanding'], neutralVersion: 'The crowd gathered at the entrance, asking to be heard.', answer: 'negative — "mob," "swarmed," and "demanding" suggest danger and aggression' },
        { passage: 'The visionary entrepreneur boldly launched an innovative startup.', tone: 'positive/admiring', connotationWords: ['visionary', 'boldly', 'innovative'], neutralVersion: 'The businessperson started a new company.', answer: 'positive — "visionary," "boldly," and "innovative" suggest admiration' },
        { passage: 'The bureaucrat droned on about regulations while the audience squirmed.', tone: 'negative/mocking', connotationWords: ['bureaucrat', 'droned', 'squirmed'], neutralVersion: 'The official spoke about regulations while the audience listened.', answer: 'negative — "bureaucrat," "droned," and "squirmed" suggest boredom and disdain' },
        { passage: 'The champion gracefully accepted the hard-won trophy with humble gratitude.', tone: 'positive/respectful', connotationWords: ['champion', 'gracefully', 'humble'], neutralVersion: 'The winner took the trophy and said thank you.', answer: 'positive — "champion," "gracefully," and "humble" convey admiration and respect' },
        { passage: 'The reckless driver careened through the neighborhood, terrifying residents.', tone: 'negative/alarming', connotationWords: ['reckless', 'careened', 'terrifying'], neutralVersion: 'The driver went quickly through the neighborhood.', answer: 'negative — "reckless," "careened," and "terrifying" convey danger and irresponsibility' },
        { passage: 'The shrewd negotiator extracted concessions from the beleaguered opposition.', tone: 'mixed/ambiguous', connotationWords: ['shrewd', 'extracted', 'beleaguered'], neutralVersion: 'The skilled negotiator gained concessions from the other side.', answer: 'mixed — "shrewd" can be positive or negative; "extracted" and "beleaguered" suggest force' },
      ],
    },
    'academic-vocab-8': {
      items: [
        { word: 'ambiguous', definition: 'open to more than one interpretation; unclear', sentence: 'The ending of the story was deliberately ambiguous, leaving readers to decide for themselves.', pos: 'adjective', synonyms: ['unclear', 'vague', 'equivocal'], answer: 'open to multiple interpretations' },
        { word: 'corroborate', definition: 'to confirm or support with additional evidence', sentence: 'The witness\'s testimony helped corroborate the detective\'s theory.', pos: 'verb', synonyms: ['confirm', 'verify', 'substantiate'], answer: 'to confirm with evidence' },
        { word: 'delineate', definition: 'to describe or outline precisely', sentence: 'The author delineates the differences between the two political systems.', pos: 'verb', synonyms: ['outline', 'describe', 'specify'], answer: 'to describe precisely' },
        { word: 'juxtapose', definition: 'to place side by side for comparison or contrast', sentence: 'The filmmaker juxtaposes scenes of wealth and poverty to highlight inequality.', pos: 'verb', synonyms: ['compare', 'contrast', 'set side by side'], answer: 'to place side by side for contrast' },
        { word: 'nuance', definition: 'a subtle difference in meaning, expression, or quality', sentence: 'Understanding the nuances of language helps you become a better writer.', pos: 'noun', synonyms: ['subtlety', 'shade', 'distinction'], answer: 'a subtle difference' },
        { word: 'paradigm', definition: 'a typical example or model; a framework of thinking', sentence: 'The discovery represented a paradigm shift in how scientists understood the disease.', pos: 'noun', synonyms: ['model', 'framework', 'pattern'], answer: 'a model or framework' },
        { word: 'rhetoric', definition: 'the art of effective or persuasive speaking or writing', sentence: 'The candidate\'s rhetoric was powerful, but her policies lacked detail.', pos: 'noun', synonyms: ['persuasion', 'eloquence', 'oratory'], answer: 'art of persuasive language' },
        { word: 'scrutinize', definition: 'to examine closely and critically', sentence: 'The editor will scrutinize every paragraph for errors before publication.', pos: 'verb', synonyms: ['examine', 'inspect', 'analyze'], answer: 'to examine closely' },
        { word: 'substantiate', definition: 'to provide evidence to support a claim', sentence: 'You must substantiate your argument with credible sources.', pos: 'verb', synonyms: ['prove', 'verify', 'confirm'], answer: 'to provide supporting evidence' },
        { word: 'unprecedented', definition: 'never done or experienced before', sentence: 'The pandemic created unprecedented challenges for the education system.', pos: 'adjective', synonyms: ['unparalleled', 'unmatched', 'novel'], answer: 'never experienced before' },
      ],
    },
  },
};

// ── Word of the Day Bank ──

const WORD_OF_DAY = [
  { word: 'ephemeral', definition: 'lasting a very short time', example: 'The ephemeral beauty of the sunset faded in minutes.', root: 'Greek "ephemeros" — lasting only a day', grade: 'grade-8' },
  { word: 'benevolent', definition: 'kind and generous', example: 'The benevolent donor gave millions to charity.', root: 'Latin "bene" (good) + "volent" (wishing)', grade: 'grade-6' },
  { word: 'ubiquitous', definition: 'found everywhere', example: 'Smartphones have become ubiquitous in modern life.', root: 'Latin "ubique" — everywhere', grade: 'grade-7' },
  { word: 'resilient', definition: 'able to recover quickly from difficulties', example: 'The resilient community rebuilt after the flood.', root: 'Latin "resilire" — to spring back', grade: 'grade-6' },
  { word: 'pragmatic', definition: 'dealing with things sensibly and realistically', example: 'She took a pragmatic approach to solving the budget problem.', root: 'Greek "pragmatikos" — relating to fact', grade: 'grade-7' },
  { word: 'magnanimous', definition: 'generous or forgiving, especially toward a rival', example: 'The magnanimous winner congratulated his opponent warmly.', root: 'Latin "magnus" (great) + "animus" (soul)', grade: 'grade-8' },
  { word: 'diligent', definition: 'having or showing care in one\'s work', example: 'The diligent student reviewed her notes every evening.', root: 'Latin "diligere" — to value highly', grade: 'grade-6' },
  { word: 'eloquent', definition: 'fluent or persuasive in speaking or writing', example: 'The eloquent speaker moved the audience to tears.', root: 'Latin "eloqui" — to speak out', grade: 'grade-7' },
  { word: 'insidious', definition: 'proceeding in a harmful way that is not easily noticed', example: 'The insidious rumor slowly destroyed her reputation.', root: 'Latin "insidiae" — ambush', grade: 'grade-8' },
  { word: 'meticulous', definition: 'showing great attention to detail', example: 'Her meticulous notes covered every point from the lecture.', root: 'Latin "meticulosus" — fearful, careful', grade: 'grade-6' },
  { word: 'ambivalent', definition: 'having mixed feelings', example: 'She felt ambivalent about moving — excited but also sad.', root: 'Latin "ambi" (both) + "valere" (be strong)', grade: 'grade-8' },
  { word: 'candor', definition: 'the quality of being open and honest', example: 'His candor during the interview impressed the committee.', root: 'Latin "candor" — whiteness, purity', grade: 'grade-7' },
  { word: 'copious', definition: 'abundant in supply or quantity', example: 'She took copious notes during the three-hour lecture.', root: 'Latin "copia" — abundance', grade: 'grade-6' },
  { word: 'paradox', definition: 'a seemingly contradictory statement that may be true', example: 'It is a paradox that standing is more tiring than walking.', root: 'Greek "para" (beyond) + "doxa" (opinion)', grade: 'grade-8' },
  { word: 'synthesize', definition: 'to combine elements to form a connected whole', example: 'The essay required her to synthesize ideas from five sources.', root: 'Greek "syn" (together) + "tithenai" (to place)', grade: 'grade-7' },
  { word: 'vivacious', definition: 'attractively lively and animated', example: 'Her vivacious personality made her the life of every party.', root: 'Latin "vivax" — lively, from "vivere" (to live)', grade: 'grade-6' },
  { word: 'ameliorate', definition: 'to make something better', example: 'The new policy was designed to ameliorate working conditions.', root: 'Latin "melior" — better', grade: 'grade-8' },
  { word: 'prolific', definition: 'producing much; highly productive', example: 'The prolific author published thirty novels in her career.', root: 'Latin "proles" (offspring) + "facere" (to make)', grade: 'grade-7' },
  { word: 'tenacious', definition: 'holding firmly; persistent', example: 'The tenacious reporter pursued the story for months.', root: 'Latin "tenax" — holding fast', grade: 'grade-6' },
  { word: 'juxtapose', definition: 'to place side by side for comparison', example: 'The exhibit juxtaposes ancient and modern art.', root: 'Latin "juxta" (near) + French "poser" (to place)', grade: 'grade-8' },
  { word: 'astute', definition: 'having sharp judgment; clever', example: 'The astute investor noticed the market trend before others.', root: 'Latin "astutus" — crafty', grade: 'grade-7' },
];

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

  // Context clues exercises
  if (first.passage !== undefined && first.word !== undefined && first.options) {
    return { type: 'context-clues', skill, grade, count: selected.length, instruction: 'Use context clues to determine the meaning of the highlighted word.', items: selected.map(i => ({ passage: i.passage, word: i.word, options: i.options, answer: i.answer, clueType: i.clueType })) };
  }

  // Morphology / word parts
  if (first.parts !== undefined && first.word !== undefined) {
    return { type: 'morphology', skill, grade, count: selected.length, instruction: 'Break down the word into its parts and determine the meaning.', items: selected.map(i => ({ word: i.word, parts: i.parts, answer: i.meaning })) };
  }

  // Root meaning
  if (first.root !== undefined && first.words !== undefined && first.prompt !== undefined) {
    return { type: 'root-meaning', skill, grade, count: selected.length, instruction: 'Use your knowledge of Greek and Latin roots to answer.', items: selected.map(i => ({ prompt: i.prompt, root: i.root, origin: i.origin, exampleWords: i.words, answer: i.answer })) };
  }

  // Pattern-based root analysis (grade-8 greek-latin-patterns)
  if (first.pattern !== undefined && first.prompt !== undefined) {
    return { type: 'root-pattern', skill, grade, count: selected.length, instruction: 'Use the word part pattern to determine meaning.', items: selected.map(i => ({ pattern: i.pattern, prompt: i.prompt, relatedWords: i.words, answer: i.answer })) };
  }

  // Reference materials (choose the right tool)
  if (first.prompt !== undefined && first.options !== undefined && first.word !== undefined) {
    return { type: 'reference-choice', skill, grade, count: selected.length, instruction: 'Choose the best reference tool for the situation.', items: selected.map(i => ({ word: i.word, prompt: i.prompt, options: i.options, answer: i.answer })) };
  }

  // Reference scenarios (grade-7 specialized)
  if (first.scenario !== undefined && first.options !== undefined) {
    return { type: 'reference-scenario', skill, grade, count: selected.length, instruction: 'Which reference material is best for this situation?', items: selected.map(i => ({ scenario: i.scenario, options: i.options, answer: i.answer })) };
  }

  // Etymology exploration
  if (first.etymology !== undefined && first.prompt !== undefined) {
    return { type: 'etymology', skill, grade, count: selected.length, instruction: 'Explore the word\'s origin and connect it to modern meaning.', items: selected.map(i => ({ word: i.word, etymology: i.etymology, prompt: i.prompt, answer: i.answer, insight: i.insight })) };
  }

  // Verify meaning (confirm/revise)
  if (first.guessedMeaning !== undefined && first.dictionaryDef !== undefined) {
    return { type: 'verify-meaning', skill, grade, count: selected.length, instruction: 'Compare the guessed meaning with the dictionary definition. Should it be confirmed or revised?', items: selected.map(i => ({ sentence: i.sentence, word: i.word, guessedMeaning: i.guessedMeaning, dictionaryDef: i.dictionaryDef, answer: i.answer })) };
  }

  // Verify context (multiple meanings)
  if (first.contextMeaning !== undefined && first.otherMeaning !== undefined) {
    return { type: 'verify-context', skill, grade, count: selected.length, instruction: 'Determine which meaning of the word fits the context.', items: selected.map(i => ({ sentence: i.sentence, word: i.word, contextMeaning: i.contextMeaning, otherMeaning: i.otherMeaning, answer: i.answer })) };
  }

  // Verify multiple meanings (grade-8)
  if (first.meaning1 !== undefined && first.meaning2 !== undefined) {
    return { type: 'verify-multiple', skill, grade, count: selected.length, instruction: 'This word has multiple meanings. Which one fits the context?', items: selected.map(i => ({ sentence: i.sentence, word: i.word, meaning1: i.meaning1, meaning2: i.meaning2, correctMeaning: i.correctMeaning, answer: i.answer, pos: i.pos, pronunciation: i.pronunciation })) };
  }

  // Figurative language (personification)
  if (first.figure !== undefined && first.humanTrait !== undefined) {
    return { type: 'figurative-personification', skill, grade, count: selected.length, instruction: 'Identify the personification and explain what it really means.', items: selected.map(i => ({ sentence: i.sentence, humanTrait: i.humanTrait, nonHuman: i.nonHuman, meaning: i.meaning, answer: i.answer })) };
  }

  // Figurative language (allusions)
  if (first.allusion !== undefined && first.source !== undefined) {
    return { type: 'figurative-allusion', skill, grade, count: selected.length, instruction: 'Identify the allusion and explain its meaning in context.', items: selected.map(i => ({ sentence: i.sentence, allusion: i.allusion, source: i.source, meaning: i.meaning, answer: i.answer })) };
  }

  // Figurative language (verbal irony / puns)
  if (first.figure !== undefined && first.signal !== undefined) {
    return { type: 'figurative-irony', skill, grade, count: selected.length, instruction: 'Identify the type of figurative language and explain the real meaning.', items: selected.map(i => ({ sentence: i.sentence, figure: i.figure, meaning: i.meaning, signal: i.signal, answer: i.answer })) };
  }

  // Word relationships (cause/part/category)
  if (first.pair !== undefined && first.relationship !== undefined && first.options) {
    return { type: 'word-relationship', skill, grade, count: selected.length, instruction: 'Identify the relationship between the two words.', items: selected.map(i => ({ pair: i.pair, options: i.options, explanation: i.explanation, answer: i.answer })) };
  }

  // Analogies
  if (first.analogy !== undefined && first.options !== undefined) {
    return { type: 'analogy', skill, grade, count: selected.length, instruction: 'Complete the analogy by choosing the best word.', items: selected.map(i => ({ analogy: i.analogy, options: i.options, relationship: i.relationship, answer: i.answer })) };
  }

  // Connotation (3-word spectrum)
  if (first.words !== undefined && first.positive !== undefined && first.negative !== undefined) {
    return { type: 'connotation-spectrum', skill, grade, count: selected.length, instruction: 'Sort these words by connotation: positive, neutral, negative.', items: selected.map(i => ({ words: shuffle(i.words), denotation: i.denotation, answer: i.answer })) };
  }

  // Connotation nuance (ranking)
  if (first.words !== undefined && first.ranking !== undefined) {
    return { type: 'connotation-ranking', skill, grade, count: selected.length, instruction: 'Rank these words from most negative to most positive connotation.', items: selected.map(i => ({ words: shuffle(i.words), denotation: i.denotation, answer: i.answer })) };
  }

  // Connotation tone (passage analysis)
  if (first.passage !== undefined && first.tone !== undefined && first.connotationWords !== undefined) {
    return { type: 'connotation-tone', skill, grade, count: selected.length, instruction: 'Analyze the tone of this passage. What connotation do the word choices create?', items: selected.map(i => ({ passage: i.passage, connotationWords: i.connotationWords, neutralVersion: i.neutralVersion, answer: i.answer })) };
  }

  // Academic vocabulary
  if (first.word !== undefined && first.definition !== undefined && first.sentence !== undefined && first.synonyms !== undefined) {
    return { type: 'academic-vocab', skill, grade, count: selected.length, instruction: 'Learn the academic word: its definition, usage, and synonyms.', items: selected.map(i => ({ word: i.word, definition: i.definition, sentence: i.sentence, pos: i.pos, synonyms: i.synonyms, answer: i.answer })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  // Partial match: if the answer contains key words from expected
  const keywords = ne.split(/\s+/).filter(w => w.length > 3);
  if (keywords.length > 0) {
    const matched = keywords.filter(k => na.includes(k));
    return matched.length >= Math.ceil(keywords.length * 0.6);
  }
  return false;
}

// ── Public API ──

class Vocabulary {
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

  getWordOfDay(grade) {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    let pool = WORD_OF_DAY;
    if (grade) pool = pool.filter(w => w.grade === grade);
    if (!pool.length) pool = WORD_OF_DAY;
    return pool[dayOfYear % pool.length];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const wotd = this.getWordOfDay(grade);
    return {
      studentId: id, grade, targetSkill: target, exercise, wordOfDay: wotd,
      lessonPlan: {
        warmUp: `Word of the Day: "${wotd.word}" — ${wotd.definition}`,
        teach: `Focus: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use today\'s vocabulary in your own writing.',
      },
    };
  }
}

module.exports = Vocabulary;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const v = new Vocabulary();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) v.setGrade(id, grade);
        out({ action: 'start', profile: v.getProfile(id), nextSkills: v.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(v.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(v.generateExercise(grade, skill, 5)); }
        else { const n = v.getNextSkills(id, 1).next; out(n.length ? v.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, expected, answer] = args;
        if (expected === undefined || answer === undefined) throw new Error('Usage: check <expected> <answer>');
        out(v.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(v.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(v.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(v.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(v.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? v.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(v.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(v.setGrade(id, g)); break; }
      case 'word-of-day': { const [, g] = args; out(v.getWordOfDay(g || null)); break; }
      default: out({ usage: 'node vocabulary.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade', 'word-of-day'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
