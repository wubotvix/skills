// eClaw MS ELA Grammar & Language Conventions Interactive Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-grammar-language');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'pronouns': ['pronoun-case', 'intensive-pronouns', 'vague-pronouns'],
    'sentences': ['sentence-patterns', 'sentence-variety'],
    'punctuation': ['nonrestrictive-punctuation'],
    'style': ['style-tone'],
  },
  'grade-7': {
    'clauses': ['phrases-clauses', 'sentence-types'],
    'modifiers': ['misplaced-modifiers'],
    'punctuation': ['coordinate-adjective-commas'],
    'language': ['precise-language', 'eliminate-wordiness'],
  },
  'grade-8': {
    'verbals': ['verbals-gerunds-participles-infinitives'],
    'voice': ['active-passive-voice'],
    'mood': ['verb-mood'],
    'punctuation': ['ellipsis-dash'],
    'sentences': ['sentence-combining-advanced'],
    'register': ['formal-informal-register'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'grade-6': {
    'pronoun-case': {
      items: [
        { sentence: '___ and I went to the concert.', options: ['She', 'Her'], answer: 'She', case: 'subjective', rule: 'Use subjective case (she) for subjects.' },
        { sentence: 'The teacher called on ___ and me.', options: ['he', 'him'], answer: 'him', case: 'objective', rule: 'Use objective case (him) after a verb or preposition.' },
        { sentence: 'Between you and ___, that was unfair.', options: ['I', 'me'], answer: 'me', case: 'objective', rule: 'Use objective case (me) after a preposition.' },
        { sentence: 'That trophy is ___.', options: ['our', 'ours'], answer: 'ours', case: 'possessive', rule: 'Use possessive pronoun (ours) without a noun following.' },
        { sentence: '___ and he solved the puzzle.', options: ['She', 'Her'], answer: 'She', case: 'subjective', rule: 'Use subjective case (she) for subjects.' },
        { sentence: 'The coach praised ___ and her.', options: ['he', 'him'], answer: 'him', case: 'objective', rule: 'Use objective case (him) as a direct object.' },
        { sentence: 'The best essay was ___.', options: ['my', 'mine'], answer: 'mine', case: 'possessive', rule: 'Use possessive pronoun (mine) when no noun follows.' },
        { sentence: '___ forgot their homework.', options: ['They', 'Them'], answer: 'They', case: 'subjective', rule: 'Use subjective case (they) for subjects.' },
        { sentence: 'Give the microphone to ___ and me.', options: ['she', 'her'], answer: 'her', case: 'objective', rule: 'Use objective case (her) after a preposition.' },
        { sentence: 'The decision is ___.', options: ['their', 'theirs'], answer: 'theirs', case: 'possessive', rule: 'Use possessive pronoun (theirs) when no noun follows.' },
      ],
    },
    'intensive-pronouns': {
      items: [
        { sentence: 'The principal ___ made the announcement.', answer: 'herself', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'I ___ will take responsibility for this.', answer: 'myself', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'The students ___ organized the fundraiser.', answer: 'themselves', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'You ___ should verify the answer.', answer: 'yourself', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'We ___ built the entire set for the play.', answer: 'ourselves', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'The mayor ___ attended the ceremony.', answer: 'himself', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'The cat ___ opened the door somehow.', answer: 'itself', rule: 'Intensive pronoun emphasizes the subject.' },
        { sentence: 'She ___ designed the logo for the club.', answer: 'herself', rule: 'Intensive pronoun emphasizes the subject.' },
      ],
    },
    'vague-pronouns': {
      items: [
        { wrong: 'Tom told Jake that he was late.', right: 'Tom told Jake, "You are late."', rule: 'Clarify which person "he" refers to.' },
        { wrong: 'Sara and Mia went to her house.', right: "Sara and Mia went to Mia's house.", rule: 'Clarify which person "her" refers to.' },
        { wrong: 'The dog chased the cat until it hid.', right: 'The dog chased the cat until the cat hid.', rule: 'Clarify which animal "it" refers to.' },
        { wrong: 'They say breakfast is the most important meal.', right: 'Nutritionists say breakfast is the most important meal.', rule: 'Replace vague "they" with a specific noun.' },
        { wrong: 'In the article, it says the population is growing.', right: 'The article states that the population is growing.', rule: 'Remove vague "it" by restructuring.' },
        { wrong: 'When Alex met Chris, he was nervous.', right: 'Alex was nervous when he met Chris.', rule: 'Restructure to make the antecedent clear.' },
        { wrong: 'She told her friend that she needed help.', right: 'Maria told her friend, "I need help."', rule: 'Use dialogue or names to eliminate ambiguity.' },
        { wrong: 'The teachers met with the parents, and they were concerned.', right: 'The teachers met with the parents; the parents were concerned.', rule: 'Specify which group "they" refers to.' },
      ],
    },
    'sentence-patterns': {
      items: [
        { boring: 'I went to the store. I bought apples. I came home. I made a pie.', improved: 'After buying apples at the store, I came home and baked a delicious pie.', method: 'Combine choppy sentences and vary openings.' },
        { boring: 'The dog barked. The dog was loud. The dog scared the mailman.', improved: 'The loud, barking dog scared the mailman.', method: 'Combine with adjectives to reduce repetition.' },
        { boring: 'She studied hard. She took the test. She passed. She was happy.', improved: 'Because she had studied hard, she passed the test and felt overjoyed.', method: 'Use subordination and combine related ideas.' },
        { boring: 'The movie was long. The movie was boring. We left early.', improved: 'Bored by the long movie, we left early.', method: 'Use participial phrase to open.' },
        { boring: 'He plays guitar. He plays piano. He sings. He is talented.', improved: 'A talented musician, he plays guitar and piano and sings beautifully.', method: 'Use an appositive and combine actions.' },
        { boring: 'It was raining. We stayed inside. We played games. We had fun.', improved: 'While it rained, we stayed inside playing games and having fun.', method: 'Use a subordinate clause and participial phrases.' },
      ],
    },
    'sentence-variety': {
      items: [
        { text: 'The dog barked.', answer: 'simple', explanation: 'One independent clause: subject (dog) + verb (barked).' },
        { text: 'The dog barked, and the cat ran away.', answer: 'compound', explanation: 'Two independent clauses joined by a conjunction.' },
        { text: 'When the dog barked, the cat ran away.', answer: 'complex', explanation: 'One dependent clause (When...) + one independent clause.' },
        { text: 'Although it was late, she finished her homework, and she went to bed.', answer: 'compound-complex', explanation: 'One dependent clause + two independent clauses.' },
        { text: 'The teacher smiled.', answer: 'simple', explanation: 'One independent clause.' },
        { text: 'Because the road was icy, the bus moved slowly.', answer: 'complex', explanation: 'Dependent clause (Because...) + independent clause.' },
        { text: 'I studied for the exam, but I still felt nervous.', answer: 'compound', explanation: 'Two independent clauses joined by "but".' },
        { text: 'After we ate dinner, my brother washed the dishes, and I swept the floor.', answer: 'compound-complex', explanation: 'Dependent clause + two independent clauses joined by "and".' },
      ],
    },
    'nonrestrictive-punctuation': {
      items: [
        { wrong: 'My sister who lives in Boston is a doctor.', right: 'My sister, who lives in Boston, is a doctor.', rule: 'Use commas around nonrestrictive (extra info) clauses.' },
        { wrong: 'The Eiffel Tower which is in Paris is famous.', right: 'The Eiffel Tower, which is in Paris, is famous.', rule: 'Use commas around nonrestrictive clauses with "which".' },
        { wrong: 'Mr. Garcia our neighbor fixed the fence.', right: 'Mr. Garcia, our neighbor, fixed the fence.', rule: 'Use commas around appositives.' },
        { wrong: 'The concert however was canceled.', right: 'The concert, however, was canceled.', rule: 'Use commas around parenthetical expressions.' },
        { wrong: 'My best friend Jada loves hiking.', right: 'My best friend, Jada, loves hiking.', rule: 'Use commas around appositives that rename a noun.' },
        { wrong: 'The experiment a total failure taught us a lot.', right: 'The experiment -- a total failure -- taught us a lot.', rule: 'Use dashes to set off dramatic nonrestrictive elements.' },
        { wrong: 'Abraham Lincoln the 16th president freed the enslaved.', right: 'Abraham Lincoln, the 16th president, freed the enslaved.', rule: 'Use commas around appositives.' },
        { wrong: 'Her answer surprisingly was correct.', right: 'Her answer, surprisingly, was correct.', rule: 'Use commas around parenthetical words.' },
      ],
    },
    'style-tone': {
      items: [
        { wrong: 'The experiment was conducted carefully. Then we totally messed up the data lol.', issue: 'Shift from formal to informal tone.', fix: 'The experiment was conducted carefully. However, errors occurred during data recording.' },
        { wrong: 'Dear Sir, Wassup? I am writing to apply for the internship.', issue: 'Mix of informal greeting with formal letter.', fix: 'Dear Sir, I am writing to apply for the internship.' },
        { wrong: 'The results showed significant improvement. Its pretty cool actually.', issue: 'Shift from academic to casual tone.', fix: 'The results showed significant improvement. This finding is noteworthy.' },
        { wrong: 'The civil rights movement was super important. It changed everything big time.', issue: 'Informal language in academic context.', fix: 'The civil rights movement was profoundly important. It transformed American society.' },
        { wrong: 'In conclusion, our hypothesis was supported. Yay us!', issue: 'Informal exclamation breaks academic tone.', fix: 'In conclusion, our hypothesis was supported by the data.' },
        { wrong: 'The novel explores themes of justice. Basically the author is saying fairness matters or whatever.', issue: 'Casual filler words undermine analysis.', fix: 'The novel explores themes of justice. The author argues that fairness is essential to society.' },
      ],
    },
  },
  'grade-7': {
    'phrases-clauses': {
      items: [
        { text: 'in the morning', answer: 'prepositional phrase', explanation: 'Preposition (in) + object (morning) = prepositional phrase.' },
        { text: 'because she studied hard', answer: 'dependent clause', explanation: 'Has subject and verb but begins with subordinator "because".' },
        { text: 'She studied hard.', answer: 'independent clause', explanation: 'Complete thought with subject (she) and verb (studied).' },
        { text: 'my older brother, a talented chef', answer: 'appositive phrase', explanation: '"A talented chef" renames "my older brother".' },
        { text: 'who won the contest', answer: 'dependent clause', explanation: 'Has subject/verb but starts with relative pronoun "who".' },
        { text: 'under the old wooden bridge', answer: 'prepositional phrase', explanation: 'Preposition (under) + object (bridge) with modifiers.' },
        { text: 'although the weather was terrible', answer: 'dependent clause', explanation: 'Has subject/verb but begins with subordinator "although".' },
        { text: 'The rain finally stopped.', answer: 'independent clause', explanation: 'Complete thought: subject (rain) + verb (stopped).' },
        { text: 'Ms. Rivera, our English teacher', answer: 'appositive phrase', explanation: '"Our English teacher" renames "Ms. Rivera".' },
        { text: 'before the bell rang', answer: 'dependent clause', explanation: 'Has subject/verb but begins with subordinator "before".' },
      ],
    },
    'sentence-types': {
      items: [
        { text: 'The hawk circled above the field.', answer: 'simple', explanation: 'One independent clause.' },
        { text: 'The hawk circled above the field, and the mice scattered.', answer: 'compound', explanation: 'Two independent clauses joined by "and".' },
        { text: 'When the hawk appeared, the mice scattered.', answer: 'complex', explanation: 'Dependent clause (When...) + independent clause.' },
        { text: 'When the hawk appeared, the mice scattered, and the rabbits froze.', answer: 'compound-complex', explanation: 'Dependent clause + two independent clauses.' },
        { text: 'She finished the project early.', answer: 'simple', explanation: 'One subject (she) + one predicate (finished).' },
        { text: 'She finished the project early, so she had time to review it.', answer: 'compound', explanation: 'Two independent clauses joined by "so".' },
        { text: 'Because she finished early, she reviewed her work.', answer: 'complex', explanation: 'Dependent clause (Because...) + independent clause.' },
        { text: 'Since she finished early, she reviewed her work, and she felt confident.', answer: 'compound-complex', explanation: 'Dependent clause + two independent clauses.' },
      ],
    },
    'misplaced-modifiers': {
      items: [
        { wrong: 'She almost drove her car for six hours.', right: 'She drove her car for almost six hours.', rule: 'Place "almost" next to what it modifies (six hours, not drove).' },
        { wrong: 'Walking to school, the rain started to pour.', right: 'Walking to school, I noticed the rain started to pour.', rule: 'Dangling modifier: add the subject who is walking.' },
        { wrong: 'I only ate two slices of pizza.', right: 'I ate only two slices of pizza.', rule: 'Place "only" next to what it limits (two slices).' },
        { wrong: 'Covered in mud, Mom told the dog to stay outside.', right: 'Mom told the mud-covered dog to stay outside.', rule: 'The modifier should clearly describe the dog, not Mom.' },
        { wrong: 'She nearly lost all of her money.', right: 'She lost nearly all of her money.', rule: 'Place "nearly" next to "all" — she did lose some.' },
        { wrong: 'Buzzing around the kitchen, Dad swatted at the fly.', right: 'Dad swatted at the fly buzzing around the kitchen.', rule: 'The fly is buzzing, not Dad.' },
        { wrong: 'The teacher handed out papers to the students covered in red ink.', right: 'The teacher handed out papers covered in red ink to the students.', rule: 'The papers are covered in ink, not the students.' },
        { wrong: 'Running down the hallway, the trophy fell and broke.', right: 'While I was running down the hallway, I dropped the trophy and it broke.', rule: 'Dangling modifier: the trophy was not running.' },
      ],
    },
    'coordinate-adjective-commas': {
      items: [
        { wrong: 'She wore a bright red scarf.', right: 'She wore a bright red scarf.', rule: 'No comma needed: "bright" modifies "red scarf" (not coordinate).', isCorrect: true },
        { wrong: 'He is a kind generous person.', right: 'He is a kind, generous person.', rule: 'Coordinate adjectives: both describe "person" independently. Use a comma.' },
        { wrong: 'The old crumbling building stood alone.', right: 'The old, crumbling building stood alone.', rule: 'Coordinate adjectives: you can say "old and crumbling." Use a comma.' },
        { wrong: 'We enjoyed a long relaxing vacation.', right: 'We enjoyed a long, relaxing vacation.', rule: 'Coordinate adjectives: "long and relaxing" works. Use a comma.' },
        { wrong: 'She adopted a small brown puppy.', right: 'She adopted a small brown puppy.', rule: 'No comma: size + color is a natural order (not coordinate).', isCorrect: true },
        { wrong: 'It was a dark stormy night.', right: 'It was a dark, stormy night.', rule: 'Coordinate adjectives: "dark and stormy" works. Use a comma.' },
        { wrong: 'He had a heavy wooden desk.', right: 'He had a heavy wooden desk.', rule: 'No comma needed: "heavy" modifies "wooden desk" (not coordinate).', isCorrect: true },
        { wrong: 'The tall elegant dancer took the stage.', right: 'The tall, elegant dancer took the stage.', rule: 'Coordinate adjectives: "tall and elegant" works. Use a comma.' },
      ],
    },
    'precise-language': {
      items: [
        { wrong: 'The thing was really good.', right: 'The performance was outstanding.', rule: 'Replace vague words (thing, good) with precise ones.' },
        { wrong: 'She went to the place.', right: 'She hurried to the library.', rule: 'Replace vague verb (went) and noun (place) with specifics.' },
        { wrong: 'The stuff on the table was nice.', right: 'The flower arrangement on the table was elegant.', rule: 'Replace vague "stuff" and "nice" with precise language.' },
        { wrong: 'He got a lot of things done.', right: 'He completed several assignments.', rule: 'Replace "got" and "things" with precise verb and noun.' },
        { wrong: 'It was a bad day.', right: 'It was an exhausting day.', rule: 'Replace "bad" with a word that shows exactly how.' },
        { wrong: 'The food was good and the people were nice.', right: 'The pasta was flavorful and the hosts were welcoming.', rule: 'Replace generic descriptors with specific, vivid ones.' },
        { wrong: 'She said something about the problem.', right: 'She explained her concern about the budget shortage.', rule: 'Replace vague "said something" with a precise verb and detail.' },
        { wrong: 'The big building had a lot of rooms.', right: 'The five-story office tower contained over two hundred rooms.', rule: 'Use specific details instead of vague size words.' },
      ],
    },
    'eliminate-wordiness': {
      items: [
        { wrong: 'Due to the fact that it was raining, the game was canceled.', right: 'Because it was raining, the game was canceled.', rule: '"Due to the fact that" = "Because".' },
        { wrong: 'She is a person who always arrives on time.', right: 'She always arrives on time.', rule: 'Remove "a person who" — unnecessary.' },
        { wrong: 'In my opinion, I think the book was interesting.', right: 'The book was interesting.', rule: '"In my opinion, I think" is redundant — choose one or neither.' },
        { wrong: 'At this point in time, we need to make a decision.', right: 'Now, we need to decide.', rule: '"At this point in time" = "Now"; "make a decision" = "decide".' },
        { wrong: 'The reason why she left is because she was tired.', right: 'She left because she was tired.', rule: '"The reason why...is because" is redundant.' },
        { wrong: 'He is in the process of writing a novel.', right: 'He is writing a novel.', rule: '"In the process of" adds no meaning.' },
        { wrong: 'Each and every student must complete the assignment.', right: 'Every student must complete the assignment.', rule: '"Each and every" is redundant — use one.' },
        { wrong: 'She returned back to the original starting point.', right: 'She returned to the starting point.', rule: '"Returned back" and "original starting" are redundant.' },
      ],
    },
  },
  'grade-8': {
    'verbals-gerunds-participles-infinitives': {
      items: [
        { text: 'Swimming is great exercise.', answer: 'gerund', explanation: '"Swimming" is a verb form (-ing) used as a noun (subject).' },
        { text: 'The running water sparkled in the sun.', answer: 'participle', explanation: '"Running" is a verb form used as an adjective modifying "water".' },
        { text: 'She wanted to learn French.', answer: 'infinitive', explanation: '"To learn" is the infinitive form, used as a noun (direct object).' },
        { text: 'Exhausted from the race, he collapsed.', answer: 'participle', explanation: '"Exhausted" is a past participle used as an adjective modifying "he".' },
        { text: 'Reading before bed helps me relax.', answer: 'gerund', explanation: '"Reading" is a verb form (-ing) used as a noun (subject).' },
        { text: 'The broken vase lay on the floor.', answer: 'participle', explanation: '"Broken" is a past participle used as an adjective modifying "vase".' },
        { text: 'To succeed requires hard work.', answer: 'infinitive', explanation: '"To succeed" is an infinitive used as a noun (subject).' },
        { text: 'We enjoy hiking in the mountains.', answer: 'gerund', explanation: '"Hiking" is a verb form (-ing) used as a noun (direct object).' },
        { text: 'Smiling broadly, the winner accepted the trophy.', answer: 'participle', explanation: '"Smiling" is a present participle modifying "winner".' },
        { text: 'His goal is to graduate with honors.', answer: 'infinitive', explanation: '"To graduate" is an infinitive used as a predicate noun.' },
      ],
    },
    'active-passive-voice': {
      items: [
        { text: 'The student wrote the essay.', answer: 'active', explanation: 'Subject (student) performs the action (wrote).' },
        { text: 'The essay was written by the student.', answer: 'passive', explanation: 'Subject (essay) receives the action; agent follows "by".' },
        { text: 'The committee approved the proposal.', answer: 'active', explanation: 'Subject (committee) performs the action (approved).' },
        { text: 'The proposal was approved by the committee.', answer: 'passive', explanation: 'Subject (proposal) receives the action.' },
        { text: 'Scientists discovered a new species.', answer: 'active', explanation: 'Subject (scientists) performs the action (discovered).' },
        { text: 'A new species was discovered by scientists.', answer: 'passive', explanation: 'Subject (species) receives the action.' },
        { text: 'The ball was kicked by the player.', answer: 'passive', explanation: 'Subject (ball) receives the action; agent follows "by".' },
        { text: 'The choir performed the song beautifully.', answer: 'active', explanation: 'Subject (choir) performs the action (performed).' },
      ],
    },
    'verb-mood': {
      items: [
        { sentence: 'She studies every day.', answer: 'indicative', explanation: 'States a fact.' },
        { sentence: 'Study for the test tonight.', answer: 'imperative', explanation: 'Gives a command.' },
        { sentence: 'If I were president, I would change the law.', answer: 'subjunctive', explanation: 'Expresses a hypothetical contrary to fact.' },
        { sentence: 'She would travel if she had more money.', answer: 'conditional', explanation: 'Expresses what would happen under a condition.' },
        { sentence: 'Please close the door.', answer: 'imperative', explanation: 'Makes a polite request/command.' },
        { sentence: 'I recommend that he study harder.', answer: 'subjunctive', explanation: 'Expresses a recommendation (subjunctive after "recommend that").' },
        { sentence: 'The earth revolves around the sun.', answer: 'indicative', explanation: 'States a fact.' },
        { sentence: 'If she were taller, she could reach the shelf.', answer: 'subjunctive', explanation: '"If she were" signals hypothetical — subjunctive mood.' },
        { sentence: 'If I was you, I would study harder.', answer: 'subjunctive (error)', explanation: 'Should use subjunctive "were" for hypotheticals contrary to fact.' },
        { sentence: 'I wish I were better at math.', answer: 'subjunctive', explanation: 'Uses subjunctive "were" after "wish" for an unreal condition.' },
      ],
    },
    'ellipsis-dash': {
      items: [
        { wrong: 'We hold these truths that all men are created equal.', right: 'We hold these truths ... that all men are created equal.', rule: 'Use ellipsis to indicate omitted text from a quotation.' },
        { wrong: 'The answer surprisingly was right in front of us.', right: 'The answer -- surprisingly -- was right in front of us.', rule: 'Use dashes to set off a dramatic aside or emphasis.' },
        { wrong: 'She had one goal, to win the championship.', right: 'She had one goal -- to win the championship.', rule: 'Use a dash before a dramatic explanation or restatement.' },
        { wrong: '"Four score and seven years ago our fathers brought forth on this continent a new nation" Lincoln said.', right: '"Four score and seven years ago ... a new nation," Lincoln said.', rule: 'Use ellipsis to show omitted words in a quotation.' },
        { wrong: 'Three students Alex Mia and Jordan made the team.', right: 'Three students -- Alex, Mia, and Jordan -- made the team.', rule: 'Use dashes to set off a list within a sentence.' },
        { wrong: 'The museum was incredible I had never seen anything like it.', right: 'The museum was incredible -- I had never seen anything like it.', rule: 'A dash can connect a sudden afterthought or dramatic continuation.' },
        { wrong: 'He wanted only one thing peace.', right: 'He wanted only one thing -- peace.', rule: 'Use a dash before a single dramatic word or short phrase.' },
      ],
    },
    'sentence-combining-advanced': {
      items: [
        { short: ['The dog barked loudly.', 'It was chasing a squirrel.'], combined: 'Barking loudly, the dog chased a squirrel.', method: 'Use participial phrase.' },
        { short: ['Ms. Rivera is our teacher.', 'She loves poetry.'], combined: 'Ms. Rivera, our teacher, loves poetry.', method: 'Use appositive phrase.' },
        { short: ['The boy practiced every day.', 'He won the contest.'], combined: 'The boy who practiced every day won the contest.', method: 'Use relative clause.' },
        { short: ['It was raining.', 'We still went hiking.', 'We had a great time.'], combined: 'Although it was raining, we went hiking and had a great time.', method: 'Use subordination and coordination.' },
        { short: ['She studied all night.', 'She was exhausted.', 'She aced the exam.'], combined: 'Exhausted from studying all night, she still aced the exam.', method: 'Use participial phrase with contrast.' },
        { short: ['The library is old.', 'The library is beautiful.', 'It was built in 1920.'], combined: 'The old, beautiful library was built in 1920.', method: 'Combine with coordinate adjectives.' },
        { short: ['He wanted to impress his coach.', 'He arrived early to practice.'], combined: 'To impress his coach, he arrived early to practice.', method: 'Use infinitive phrase as opener.' },
        { short: ['The storm knocked out the power.', 'We lit candles.', 'We told stories.'], combined: 'After the storm knocked out the power, we lit candles and told stories.', method: 'Use subordinate clause and compound predicate.' },
      ],
    },
    'formal-informal-register': {
      items: [
        { wrong: 'The results of the experiment were totally awesome and blew our minds.', issue: 'Informal slang in academic writing.', fix: 'The results of the experiment were remarkable and exceeded our expectations.' },
        { wrong: 'Dear Hiring Manager, Hey! I wanna apply for the job.', issue: 'Informal greeting and contraction in a formal letter.', fix: 'Dear Hiring Manager, I am writing to apply for the position.' },
        { wrong: 'The protagonist basically just gives up because stuff gets hard.', issue: 'Vague, casual language in literary analysis.', fix: 'The protagonist surrenders because the obstacles become insurmountable.' },
        { wrong: 'In conclusion, this book is like super deep and makes you think about a lot of things.', issue: 'Informal filler words weaken the conclusion.', fix: 'In conclusion, this novel provokes profound reflection on justice and identity.' },
        { wrong: 'George Washington was this really cool guy who did lots of important stuff.', issue: 'Casual, vague language in a historical essay.', fix: 'George Washington was an influential leader who shaped the foundations of American democracy.' },
        { wrong: 'The data shows that global warming is no joke and we gotta do something ASAP.', issue: 'Slang and abbreviations in a research paper.', fix: 'The data indicates that climate change is a serious threat requiring immediate action.' },
        { wrong: 'Tbh the poem is kinda sad but also beautiful in a way.', issue: 'Texting abbreviations in academic analysis.', fix: 'The poem conveys a poignant sadness intertwined with unexpected beauty.' },
        { wrong: 'FDR was a big deal president who helped America get through the Depression.', issue: 'Vague, informal phrasing in historical writing.', fix: 'FDR was a transformative president who guided America through the Great Depression.' },
      ],
    },
  },
};

const MENTOR_SENTENCES = {
  'grade-6': [
    { sentence: 'The city, which had been quiet for decades, suddenly buzzed with the energy of change -- an energy that was, quite frankly, long overdue.', focus: 'nonrestrictive elements + dashes', notice: 'Commas around "which" clause, dash for emphasis, parenthetical "quite frankly"' },
    { sentence: 'She herself had organized every detail of the event, from the seating chart to the playlist.', focus: 'intensive pronoun + sentence variety', notice: '"Herself" emphasizes she did it alone; the phrase after the comma adds specifics.' },
    { sentence: 'The old lighthouse, a relic of a forgotten era, stood guard over the empty harbor.', focus: 'appositive + style', notice: 'Appositive "a relic of a forgotten era" set off by commas adds poetic detail.' },
  ],
  'grade-7': [
    { sentence: 'Because the evidence was overwhelming, the jury reached a unanimous verdict, and the courtroom erupted in applause.', focus: 'compound-complex sentence', notice: 'Dependent clause + two independent clauses; comma after introductory clause; comma before "and".' },
    { sentence: 'The quiet, determined athlete -- overlooked by every scout -- proved them all wrong at the national championship.', focus: 'coordinate adjectives + dashes for aside', notice: 'Comma between coordinate adjectives; dashes set off the nonrestrictive aside.' },
    { sentence: 'Rather than repeating the same tired excuses, she offered a precise, honest explanation that satisfied everyone.', focus: 'precise language + wordiness elimination', notice: 'Strong, specific words replace vague ones; the sentence is concise and direct.' },
  ],
  'grade-8': [
    { sentence: 'Exhausted from the long journey, the explorers made camp beside the river, hoping to rest before the final ascent.', focus: 'participial phrases', notice: 'Opening past participle phrase; closing present participle phrase; both modify "explorers".' },
    { sentence: 'The letter was written by an unknown soldier -- a voice from the past that still resonates today.', focus: 'passive voice for effect + dash', notice: 'Passive voice emphasizes the letter; the dash introduces a dramatic appositive.' },
    { sentence: 'If I were to choose one moment that changed everything, it would be the day she decided to speak up.', focus: 'subjunctive mood + conditional', notice: '"If I were" = subjunctive; "it would be" = conditional. Hypothetical reflection.' },
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
  if (selected[0].wrong !== undefined && selected[0].right !== undefined && selected[0].issue !== undefined) {
    return { type: 'tone-fix', skill, grade, count: selected.length, instruction: 'Identify and fix the style/tone issue.', items: selected.map(i => ({ prompt: i.wrong, issue: i.issue, answer: i.fix })) };
  }
  if (selected[0].wrong !== undefined && selected[0].right !== undefined) {
    return { type: 'fix-it', skill, grade, count: selected.length, instruction: 'Fix the error in this sentence.', items: selected.map(i => ({ prompt: i.wrong, answer: i.right, rule: i.rule || i.error || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].answer !== undefined && selected[0].options) {
    return { type: 'fill-in-choice', skill, grade, count: selected.length, instruction: 'Choose the correct word to fill in the blank.', items: selected.map(i => ({ prompt: i.sentence, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  if (selected[0].sentence !== undefined && selected[0].answer !== undefined) {
    return { type: 'fill-in', skill, grade, count: selected.length, instruction: 'Fill in the blank or identify the mood/feature.', items: selected.map(i => ({ prompt: i.sentence, answer: i.answer, hint: i.hint || i.rule || i.explanation || '' })) };
  }
  if (selected[0].text !== undefined && selected[0].answer !== undefined) {
    return { type: 'identify', skill, grade, count: selected.length, instruction: 'Identify or classify this item.', items: selected.map(i => ({ prompt: i.text, answer: i.answer, explanation: i.explanation || i.reason || '' })) };
  }
  if (selected[0].boring !== undefined) {
    return { type: 'rewrite', skill, grade, count: selected.length, instruction: 'Improve this choppy or repetitive writing.', items: selected.map(i => ({ prompt: i.boring, answer: i.improved, method: i.method })) };
  }
  if (selected[0].short !== undefined && selected[0].combined !== undefined) {
    return { type: 'combine', skill, grade, count: selected.length, instruction: 'Combine these sentences into one well-crafted sentence.', items: selected.map(i => ({ prompt: i.short.join(' | '), answer: i.combined, method: i.method })) };
  }
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined) {
    return { type: 'prompt-response', skill, grade, count: selected.length, instruction: 'Answer the question.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, options: i.options, rule: i.rule || '' })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
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

  getMentorSentence(grade) {
    const sentences = MENTOR_SENTENCES[grade];
    if (!sentences) return { error: `No mentor sentences for ${grade}.` };
    return pick(sentences, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const mentor = MENTOR_SENTENCES[grade] ? pick(MENTOR_SENTENCES[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, mentorSentence: mentor,
      lessonPlan: {
        mentor: mentor ? `Study: "${mentor.sentence}" -- Focus: ${mentor.focus}` : 'Review a sentence from recent reading.',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use this grammar pattern in your own writing.',
      },
    };
  }
}

module.exports = GrammarLanguage;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const gr = new GrammarLanguage();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) gr.setGrade(id, grade);
        out({ action: 'start', profile: gr.getProfile(id), nextSkills: gr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(gr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(gr.generateExercise(grade, skill, 5)); }
        else { const n = gr.getNextSkills(id, 1).next; out(n.length ? gr.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(gr.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(gr.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(gr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(gr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(gr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? gr.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(gr.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(gr.setGrade(id, g)); break; }
      case 'mentor': { const [, g] = args; if (!g) throw new Error('Usage: mentor <grade>'); out(gr.getMentorSentence(g)); break; }
      default: out({ usage: 'node grammar-language.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','mentor'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
