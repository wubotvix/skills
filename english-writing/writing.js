// English Writing Interactive Tutor (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  a1: {
    'personal-functional': [
      'postcard-writing',
      'simple-email',
      'form-filling',
      'short-description',
      'social-media-post',
      'shopping-list'
    ]
  },
  a2: {
    'personal-functional': [
      'friendly-email',
      'short-narrative',
      'simple-instructions',
      'personal-description',
      'invitation-writing',
      'thank-you-note'
    ]
  },
  b1: {
    'narrative-opinion': [
      'informal-email',
      'formal-email-basic',
      'short-essay',
      'narrative-writing',
      'simple-review',
      'blog-post'
    ]
  },
  b2: {
    'argumentative-professional': [
      'argumentative-essay',
      'report-writing',
      'detailed-review',
      'cover-letter',
      'complaint-letter',
      'proposal-writing'
    ],
    'coherence-register': [
      'genre-identification',
      'thesis-evaluation',
      'paragraph-ordering',
      'coherence-device-fill',
      'register-matching',
      'error-correction-style'
    ]
  },
  c1: {
    'academic-professional': [
      'academic-essay',
      'professional-report',
      'critical-review',
      'detailed-proposal',
      'article-writing',
      'formal-correspondence'
    ]
  },
  c2: {
    'creative-specialised': [
      'creative-writing',
      'publication-article',
      'grant-application',
      'style-adaptation',
      'editing-others',
      'technical-documentation'
    ]
  }
};

/* ───────────────────────── ITEM BANKS ───────────────────────── */

const ITEM_BANKS = {

  /* — Genre identification — */
  'genre-identification': [
    { prompt: 'Dear Sir/Madam, I am writing to express my dissatisfaction with...', answer: 'complaint-letter', options: ['complaint-letter','cover-letter','friendly-email','blog-post'] },
    { prompt: 'Once upon a time, in a village nestled between two mountains...', answer: 'narrative', options: ['narrative','report','essay','email'] },
    { prompt: 'Executive Summary: This report examines Q3 sales figures...', answer: 'report', options: ['report','essay','proposal','review'] },
    { prompt: 'I would argue that social media does more harm than good...', answer: 'argumentative-essay', options: ['argumentative-essay','narrative','report','review'] },
    { prompt: 'Hey! Just wanted to let you know about the party on Saturday...', answer: 'informal-email', options: ['informal-email','formal-email','complaint-letter','blog-post'] },
    { prompt: 'The new Italian restaurant on Main Street is a must-visit...', answer: 'review', options: ['review','report','essay','blog-post'] },
    { prompt: 'We propose the implementation of a mentoring programme...', answer: 'proposal', options: ['proposal','report','essay','complaint-letter'] },
    { prompt: 'Hi everyone! Today I want to share my experience learning to surf...', answer: 'blog-post', options: ['blog-post','essay','narrative','review'] },
    { prompt: 'Dear Hiring Manager, I am writing to apply for the position of...', answer: 'cover-letter', options: ['cover-letter','complaint-letter','formal-email','proposal'] },
    { prompt: 'The findings of this study suggest a correlation between sleep and productivity...', answer: 'academic-essay', options: ['academic-essay','report','blog-post','review'] }
  ],

  /* — Thesis statement evaluation — */
  'thesis-evaluation': [
    { prompt: '"Social media is interesting." — Is this a strong thesis?', answer: 'weak', reason: 'Too vague; not debatable or specific.' },
    { prompt: '"While social media connects people globally, its impact on teen mental health warrants stricter regulation." — Evaluate.', answer: 'strong', reason: 'Specific, debatable, previews structure.' },
    { prompt: '"Dogs are nice." — Evaluate this thesis.', answer: 'weak', reason: 'Too vague; no argument or scope.' },
    { prompt: '"Remote work increases productivity for knowledge workers but requires structured communication policies to prevent isolation." — Evaluate.', answer: 'strong', reason: 'Specific claim with two clear facets.' },
    { prompt: '"Climate change is bad." — Evaluate.', answer: 'weak', reason: 'Vague; no specific claim or scope.' },
    { prompt: '"Although renewable energy requires high initial investment, the long-term economic and environmental benefits justify government subsidies." — Evaluate.', answer: 'strong', reason: 'Debatable, specific, clear position.' },
    { prompt: '"This essay is about technology." — Evaluate.', answer: 'weak', reason: 'Announces topic but makes no argument.' },
    { prompt: '"Mandatory voting undermines democratic freedom because it forces political participation regardless of informed consent." — Evaluate.', answer: 'strong', reason: 'Clear position with reasoning.' },
    { prompt: '"There are many opinions about education." — Evaluate.', answer: 'weak', reason: 'States a truism; not arguable.' },
    { prompt: '"Bilingual education programmes in primary schools produce measurably better cognitive outcomes than monolingual curricula." — Evaluate.', answer: 'strong', reason: 'Specific, evidence-oriented, debatable.' }
  ],

  /* — Paragraph ordering — */
  'paragraph-ordering': [
    { paragraphs: ['However, critics argue that remote work leads to isolation.','In conclusion, a hybrid model may offer the best solution.','Remote work has become increasingly popular since 2020.','Studies show that productivity often increases when employees work from home.'], answer: [2,3,0,1] },
    { paragraphs: ['Therefore, governments should invest more in renewable energy.','Solar and wind power have become significantly cheaper.','Fossil fuels remain the dominant energy source worldwide.','Despite progress, storage technology still needs improvement.'], answer: [2,1,3,0] },
    { paragraphs: ['Finally, regular exercise improves mental health.','First, it strengthens the cardiovascular system.','Exercise provides numerous health benefits.','Additionally, it helps maintain a healthy weight.'], answer: [2,1,3,0] },
    { paragraphs: ['To sum up, reading widely is the single best habit for language learners.','Research confirms that extensive reading builds vocabulary naturally.','Many students ask how to improve their English quickly.','Furthermore, reading improves grammar intuition without explicit study.'], answer: [2,1,3,0] },
    { paragraphs: ['In light of these findings, urban planners should prioritise green spaces.','Green spaces in cities reduce stress and improve air quality.','Urbanisation continues to accelerate worldwide.','Moreover, parks encourage physical activity and community interaction.'], answer: [2,1,3,0] },
    { paragraphs: ['Consequently, schools should integrate digital literacy into the curriculum.','Children today are exposed to screens from a very young age.','However, not all screen time is equal — educational content differs from passive consumption.','Studies indicate that guided technology use can enhance learning.'], answer: [1,3,2,0] },
    { paragraphs: ['On balance, the advantages of tourism outweigh the disadvantages.','Tourism brings economic benefits to local communities.','Nevertheless, mass tourism can damage fragile ecosystems.','Many countries depend heavily on tourism revenue.'], answer: [3,1,2,0] },
    { paragraphs: ['In conclusion, a balanced diet is more effective than any single superfood.','Superfoods have gained enormous popularity in recent years.','However, nutritionists warn against relying on any single food group.','Blueberries, quinoa, and kale are frequently marketed as miracle foods.'], answer: [1,3,2,0] }
  ],

  /* — Coherence device fill-in — */
  'coherence-device-fill': [
    { sentence: 'The experiment failed. ___, the team learned valuable lessons.', answer: 'Nevertheless', options: ['Nevertheless','Because','Although','Since'] },
    { sentence: 'She studied hard. ___, she passed the exam with top marks.', answer: 'As a result', options: ['As a result','However','Despite','Although'] },
    { sentence: '___ the rain, the event was a success.', answer: 'Despite', options: ['Despite','Because of','Moreover','Therefore'] },
    { sentence: 'The cost is high. ___, the quality justifies the price.', answer: 'However', options: ['However','Therefore','Because','In addition'] },
    { sentence: 'He is an excellent writer. ___, he is a talented speaker.', answer: 'Moreover', options: ['Moreover','However','Despite','Nevertheless'] },
    { sentence: '___ the evidence suggests otherwise, many people still hold this belief.', answer: 'Although', options: ['Although','Therefore','Moreover','In addition'] },
    { sentence: 'Prices have risen sharply. ___, many families are struggling.', answer: 'Consequently', options: ['Consequently','Despite','Moreover','Although'] },
    { sentence: 'The policy has drawbacks. ___, it also has clear benefits.', answer: 'On the other hand', options: ['On the other hand','Therefore','As a result','Because'] },
    { sentence: 'The report is comprehensive. ___, it covers all major topics.', answer: 'In other words', options: ['In other words','However','Despite','Although'] },
    { sentence: 'First, we analyse the data. ___, we draw conclusions.', answer: 'Then', options: ['Then','However','Despite','Moreover'] }
  ],

  /* — Register matching — */
  'register-matching': [
    { prompt: 'Match to formal register: "I wanna ask about the job."', answer: 'I would like to enquire about the position.', options: ['I would like to enquire about the position.','I wanna know about the position.','Tell me about the job.','Hey, what about that job?'] },
    { prompt: 'Match to informal register: "I am writing to inform you of my departure."', answer: 'Just letting you know I\'m leaving.', options: ['Just letting you know I\'m leaving.','I hereby notify you of my resignation.','I wish to announce my departure.','Please be advised of my leaving.'] },
    { prompt: 'Match to formal: "Can you help me out?"', answer: 'I would be grateful for your assistance.', options: ['I would be grateful for your assistance.','Help me please.','Give me a hand.','Could you help?'] },
    { prompt: 'Match to formal: "Sorry about the mess-up."', answer: 'We sincerely apologise for the error.', options: ['We sincerely apologise for the error.','My bad about that.','Sorry for the mistake.','Oops, we messed up.'] },
    { prompt: 'Match to informal: "I would appreciate it if you could forward the documents."', answer: 'Can you send me the docs?', options: ['Can you send me the docs?','Kindly forward the documents.','Please transmit the materials.','I request the forwarding of documents.'] },
    { prompt: 'Match to formal: "The thing is, we need more money."', answer: 'The issue is that additional funding is required.', options: ['The issue is that additional funding is required.','We basically need more cash.','Thing is, budget is tight.','We need more money, honestly.'] },
    { prompt: 'Match to informal: "Furthermore, the data corroborates our hypothesis."', answer: 'Plus, the numbers back up what we thought.', options: ['Plus, the numbers back up what we thought.','Additionally, the evidence supports our theory.','Moreover, data validates our premise.','The findings substantiate our claim.'] },
    { prompt: 'Match to formal: "Lots of people think this is a bad idea."', answer: 'A significant number of individuals consider this inadvisable.', options: ['A significant number of individuals consider this inadvisable.','Loads of folks think it stinks.','Many people don\'t like it.','Tons of people say no.'] }
  ],

  /* — Error correction (style/tone) — */
  'error-correction-style': [
    { text: 'Dear Mr. Smith, Hey! Just wanted to touch base about the contract.', error: 'register-mismatch', correction: 'Dear Mr. Smith, I am writing to follow up regarding the contract.' },
    { text: 'The results of the study are, like, really impressive and stuff.', error: 'informal-in-academic', correction: 'The results of the study are notably impressive.' },
    { text: 'Hereby I am informing you that your cat is cute.', error: 'overly-formal', correction: 'I just wanted to say your cat is really cute!' },
    { text: 'The corporation facilitated the implementation of synergistic solutions.', error: 'jargon-overload', correction: 'The company introduced collaborative solutions.' },
    { text: 'I think maybe it could possibly be argued that perhaps pollution is bad.', error: 'over-hedging', correction: 'It could be argued that pollution poses serious risks.' },
    { text: 'OBVIOUSLY everyone knows that exercise is DEFINITELY the BEST thing EVER.', error: 'over-boosting', correction: 'Exercise is widely regarded as one of the most beneficial health practices.' },
    { text: 'Dear Diary, Per our earlier discussion, I am writing to express my feelings about today.', error: 'register-mismatch', correction: 'Dear Diary, I want to write about how I felt today.' },
    { text: 'The patient presented with a tummy ache and owies on the arm.', error: 'informal-in-professional', correction: 'The patient presented with abdominal pain and contusions on the arm.' },
    { text: 'Gonna need u 2 send the report ASAP thx.', error: 'too-casual-for-business', correction: 'Could you please send the report at your earliest convenience? Thank you.' },
    { text: 'It is with great pleasure and profound honour that I accept your invitation to lunch.', error: 'overly-formal', correction: 'Thanks so much — I\'d love to come to lunch!' }
  ],

  /* — Writing prompts by level and genre — */
  'postcard-writing': [
    { prompt: 'Write a postcard from the beach to your friend. Include: where you are, the weather, one activity. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard from a city you are visiting. Say what you can see and what food you ate. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard to your family from the mountains. Mention the view and how you feel. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard from a museum. Say what you liked and who you are with. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard from a hotel. Describe your room and one thing nearby. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard to your teacher about your holiday. Mention the place and one new thing you tried. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard from a park. Say what animals you see and the weather. (30-50 words)', genre: 'postcard', level: 'a1' },
    { prompt: 'Write a postcard from a market. Say what you bought and the colours you saw. (30-50 words)', genre: 'postcard', level: 'a1' }
  ],

  'simple-email': [
    { prompt: 'Write an email to a friend inviting them to your birthday party. Include: date, time, place. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email to your teacher. Say you are sick and cannot come to class. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email to a shop asking about opening hours and if they sell a specific item. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email to your friend about a film you watched. Say if you liked it. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email to a hotel asking to book a room. Include dates and number of people. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email to your neighbour about a loud noise last night. Be polite. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email to your friend suggesting a restaurant for dinner. Say why you like it. (50-80 words)', genre: 'email', level: 'a1' },
    { prompt: 'Write an email thanking a friend for a gift. Say what you like about it. (50-80 words)', genre: 'email', level: 'a1' }
  ],

  'form-filling': [
    { prompt: 'Fill in a hotel registration form: name, nationality, passport number, dates of stay, room type.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in a library membership form: name, address, phone, email, preferred genres.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in a class enrolment form: name, level, days available, learning goals.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in an online order form: item, quantity, delivery address, payment method.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in a doctor appointment form: name, date of birth, symptoms, preferred date.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in a gym membership form: name, age, fitness goals, preferred times.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in a job application form: name, experience, skills, availability.', genre: 'form', level: 'a1' },
    { prompt: 'Fill in a travel visa form: name, nationality, purpose of visit, dates, accommodation.', genre: 'form', level: 'a1' }
  ],

  'short-description': [
    { prompt: 'Describe your bedroom. What furniture is there? What colours? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe your best friend. What do they look like? What do they like? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe your town or city. What can you see? What is there to do? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe your favourite food. What does it look like? How does it taste? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe your daily routine. What do you do in the morning, afternoon, and evening? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe a pet or animal you like. What does it look like? What does it do? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe your school or workplace. How many rooms? What is your favourite area? (50-100 words)', genre: 'description', level: 'a1' },
    { prompt: 'Describe the weather today. Is it hot or cold? What can you see outside? (50-100 words)', genre: 'description', level: 'a1' }
  ],

  'social-media-post': [
    { prompt: 'Write a social media post about a meal you just had. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post about a place you visited today. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post recommending a song or film. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post about your weekend plans. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post celebrating a friend\'s birthday. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post about something funny that happened today. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post about a new hobby you started. (20-50 words)', genre: 'social', level: 'a1' },
    { prompt: 'Write a social media post about the sunrise or sunset. (20-50 words)', genre: 'social', level: 'a1' }
  ],

  'shopping-list': [
    { prompt: 'Write a shopping list for making a simple dinner for two. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a shopping list for a picnic in the park. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a shopping list for back-to-school supplies. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a shopping list for a birthday party. Include food and decorations. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a shopping list for a camping trip. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a to-do list for a Saturday morning. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a packing list for a weekend trip. (10-30 words)', genre: 'list', level: 'a1' },
    { prompt: 'Write a shopping list for making breakfast for your family. (10-30 words)', genre: 'list', level: 'a1' }
  ],

  'friendly-email': [
    { prompt: 'Write an email to a friend telling them about a new hobby you started. (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a friend about your recent holiday. Where did you go? What did you do? (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a friend asking for advice about choosing a gift. (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a friend describing your new neighbourhood. (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a friend about a concert or event you went to. (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a friend explaining why you missed their party. (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a pen pal introducing yourself and your interests. (80-120 words)', genre: 'email', level: 'a2' },
    { prompt: 'Write an email to a friend recommending a book or TV show. (80-120 words)', genre: 'email', level: 'a2' }
  ],

  'short-narrative': [
    { prompt: 'Tell a story about a time you got lost. What happened? How did you feel? (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Write about your first day at school or a new job. (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Tell a story about a surprise you received. (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Write about a time you tried something new for the first time. (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Tell a story about a funny thing that happened on a trip. (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Write about a time you helped someone. What did you do? (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Tell a story about meeting a new friend. (80-120 words)', genre: 'narrative', level: 'a2' },
    { prompt: 'Write about a memorable meal. Where were you? Who were you with? (80-120 words)', genre: 'narrative', level: 'a2' }
  ],

  'simple-instructions': [
    { prompt: 'Write instructions for making a cup of tea. Use: first, then, next, finally. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for getting from your home to the nearest shop. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for using a washing machine. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for making a simple sandwich. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for setting up a new phone. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for watering indoor plants. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for playing your favourite game. (80-120 words)', genre: 'instructions', level: 'a2' },
    { prompt: 'Write instructions for taking a good photograph. (80-120 words)', genre: 'instructions', level: 'a2' }
  ],

  'personal-description': [
    { prompt: 'Describe your typical weekend. What do you usually do? (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe a person you admire. Why do you admire them? (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe your favourite season and why you like it. (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe your dream house. How many rooms? What is special? (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe what you like and dislike about your job or studies. (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe your morning routine in detail. (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe a festival or celebration in your country. (80-120 words)', genre: 'description', level: 'a2' },
    { prompt: 'Describe your favourite photograph and why it is special. (80-120 words)', genre: 'description', level: 'a2' }
  ],

  'invitation-writing': [
    { prompt: 'Write an invitation to a housewarming party. Include date, time, address, what to bring. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a barbecue in your garden. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a film night at your home. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a study group meeting. Include subject and materials needed. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a farewell party for a colleague. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a weekend hike. Include meeting point and what to wear. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a potluck dinner. Explain what a potluck is. (50-80 words)', genre: 'invitation', level: 'a2' },
    { prompt: 'Write an invitation to a game night. List the games you will play. (50-80 words)', genre: 'invitation', level: 'a2' }
  ],

  'thank-you-note': [
    { prompt: 'Write a thank-you note to someone who gave you a birthday gift. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note to a teacher who helped you. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note for a dinner invitation. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note to a neighbour who watered your plants. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note after a job interview. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note to a friend who helped you move. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note to a colleague for covering your shift. (40-60 words)', genre: 'note', level: 'a2' },
    { prompt: 'Write a thank-you note to a host family for their hospitality. (40-60 words)', genre: 'note', level: 'a2' }
  ],

  'informal-email': [
    { prompt: 'Write an email to a friend about your plans to change jobs. Ask for their advice. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend describing a problem you are having at work and asking for suggestions. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend who is feeling sad. Try to cheer them up. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend planning a group trip. Suggest destinations and dates. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend about a disagreement you had with someone. Ask what they think. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend who just moved abroad. Ask about their new life. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend comparing two films you recently watched. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write an email to a friend about a skill you are learning. Describe your progress. (100-150 words)', genre: 'email', level: 'b1' }
  ],

  'formal-email-basic': [
    { prompt: 'Write a formal email to a hotel requesting a late checkout. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to a company asking about a product warranty. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to your landlord about a maintenance issue. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to cancel a subscription and request a refund. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to request time off work. Give reasons. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to a university requesting information about a course. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to arrange a meeting with a colleague in another office. (100-150 words)', genre: 'email', level: 'b1' },
    { prompt: 'Write a formal email to thank a speaker for their presentation. (100-150 words)', genre: 'email', level: 'b1' }
  ],

  'short-essay': [
    { prompt: 'Write a short essay: "Should students wear school uniforms?" Give your opinion with reasons. (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "Is it better to live in a city or the countryside?" (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "What are the advantages and disadvantages of social media?" (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "Should homework be abolished?" (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "What is the most important invention of the last 100 years?" (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "Is learning a foreign language still important?" (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "Should zoos be closed?" Give reasons. (150-200 words)', genre: 'essay', level: 'b1' },
    { prompt: 'Write a short essay: "What makes a good friend?" (150-200 words)', genre: 'essay', level: 'b1' }
  ],

  'narrative-writing': [
    { prompt: 'Write a story beginning with: "I knew something was wrong when the phone rang at 3 a.m." (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story about a journey that did not go as planned. (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story about finding something unexpected in an old box. (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story about a day when everything went wrong. (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story beginning with: "The door was open, and no one was inside." (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story about a chance meeting that changed something in your life. (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story about an animal that saved the day. (150-200 words)', genre: 'narrative', level: 'b1' },
    { prompt: 'Write a story about a competition you entered. (150-200 words)', genre: 'narrative', level: 'b1' }
  ],

  'simple-review': [
    { prompt: 'Write a review of a restaurant you visited recently. Would you recommend it? (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of a book you read. What did you like or dislike? (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of an app you use often. (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of a hotel you stayed at. (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of a film you watched this week. (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of a product you bought online. (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of a language learning tool or website. (100-150 words)', genre: 'review', level: 'b1' },
    { prompt: 'Write a review of a local park or attraction. (100-150 words)', genre: 'review', level: 'b1' }
  ],

  'blog-post': [
    { prompt: 'Write a blog post: "5 things I learned this month." (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post about your favourite place in your city and why others should visit. (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post about a challenge you set yourself and how it went. (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post with advice for someone visiting your country. (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post about how you stay motivated to learn English. (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post about a recipe you love and how to make it. (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post about a trend you have noticed. Do you like it? (150-200 words)', genre: 'blog', level: 'b1' },
    { prompt: 'Write a blog post about your morning routine and productivity tips. (150-200 words)', genre: 'blog', level: 'b1' }
  ],

  'argumentative-essay': [
    { prompt: 'Write an argumentative essay: "Should university education be free?" Include a counter-argument. (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Is technology making us less social?" (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Should governments ban single-use plastics?" (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Does remote work benefit or harm employees?" (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Should voting be compulsory?" (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Is social media regulation necessary?" (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Should animals be used in scientific research?" (250-350 words)', genre: 'essay', level: 'b2' },
    { prompt: 'Write an argumentative essay: "Is a gap year before university a good idea?" (250-350 words)', genre: 'essay', level: 'b2' }
  ],

  'report-writing': [
    { prompt: 'Write a report on employee satisfaction in your workplace. Include findings and recommendations. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report on the advantages and disadvantages of a four-day working week. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report evaluating two options for a team-building event. Recommend one. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report on transport options in your city. Include data and suggestions. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report on the environmental impact of a local project. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report analysing customer feedback from the past quarter. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report on health and wellness programmes at work. (250-350 words)', genre: 'report', level: 'b2' },
    { prompt: 'Write a report comparing two software solutions for your team. (250-350 words)', genre: 'report', level: 'b2' }
  ],

  'detailed-review': [
    { prompt: 'Write a detailed review comparing two smartphones. Analyse features, value, and user experience. (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of an online course. Evaluate content, delivery, and value. (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of a TV series. Analyse plot, acting, and themes. (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of a co-working space. (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of a travel experience. What worked? What didn\'t? (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of a piece of software you use daily. (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of a non-fiction book relevant to your field. (200-300 words)', genre: 'review', level: 'b2' },
    { prompt: 'Write a detailed review of a fitness app or programme. (200-300 words)', genre: 'review', level: 'b2' }
  ],

  'cover-letter': [
    { prompt: 'Write a cover letter for a marketing assistant position. Match your skills to the role. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for a teaching position abroad. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for an internship at a technology company. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for a customer service role. Highlight communication skills. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for a project manager position. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for a graphic designer role. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for a volunteer coordinator position at an NGO. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a cover letter for a data analyst position. (200-300 words)', genre: 'letter', level: 'b2' }
  ],

  'complaint-letter': [
    { prompt: 'Write a complaint letter about a faulty product. State the problem and desired resolution. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about poor service at a restaurant. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about a delayed delivery. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about noisy construction near your home. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about an incorrect bill. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about misleading advertising. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about poor conditions in rented accommodation. (200-300 words)', genre: 'letter', level: 'b2' },
    { prompt: 'Write a complaint letter about a cancelled event with no refund. (200-300 words)', genre: 'letter', level: 'b2' }
  ],

  'proposal-writing': [
    { prompt: 'Write a proposal to introduce flexible working hours at your company. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal for a community garden in your neighbourhood. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal to improve recycling facilities at your workplace. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal for a language exchange programme at your school. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal to organise a charity event. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal to implement a mentoring scheme for new employees. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal to create a wellness room at work. (250-350 words)', genre: 'proposal', level: 'b2' },
    { prompt: 'Write a proposal for a digital literacy workshop for older adults. (250-350 words)', genre: 'proposal', level: 'b2' }
  ],

  'academic-essay': [
    { prompt: 'Write an academic essay discussing the impact of artificial intelligence on employment. Use hedging and citations. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay analysing the effectiveness of bilingual education. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay on the relationship between urbanisation and mental health. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay evaluating the role of standardised testing in education. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay on the ethics of genetic modification in agriculture. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay discussing whether economic growth is compatible with sustainability. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay on the influence of social media on political discourse. (400-500 words)', genre: 'essay', level: 'c1' },
    { prompt: 'Write an academic essay analysing the digital divide and its implications for education equity. (400-500 words)', genre: 'essay', level: 'c1' }
  ],

  'professional-report': [
    { prompt: 'Write a professional report with executive summary on the feasibility of expanding into a new market. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report on the impact of remote work policies, including data and recommendations. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report evaluating the success of a recent training programme. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report on cybersecurity risks and mitigation strategies. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report on sustainability initiatives and their ROI. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report on customer retention trends over the past year. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report on workplace diversity and inclusion metrics. (400-500 words)', genre: 'report', level: 'c1' },
    { prompt: 'Write a professional report comparing three vendors for a software procurement decision. (400-500 words)', genre: 'report', level: 'c1' }
  ],

  'critical-review': [
    { prompt: 'Write a critical review of a research paper on climate change policy. Evaluate methodology and conclusions. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of a book on leadership theory. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of a documentary about globalisation. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of an article on the gig economy. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of a study on second language acquisition. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of a policy paper on universal basic income. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of a TED talk on creativity. (300-400 words)', genre: 'review', level: 'c1' },
    { prompt: 'Write a critical review of a report on educational technology outcomes. (300-400 words)', genre: 'review', level: 'c1' }
  ],

  'detailed-proposal': [
    { prompt: 'Write a detailed proposal for a research project on workplace well-being. Include context, methodology, and timeline. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for implementing a company-wide sustainability programme. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for a community literacy initiative. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for a cross-departmental innovation lab. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for a scholarship programme for underrepresented students. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for a pilot remote-work programme. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for a professional development series. (400-500 words)', genre: 'proposal', level: 'c1' },
    { prompt: 'Write a detailed proposal for integrating AI tools into customer support. (400-500 words)', genre: 'proposal', level: 'c1' }
  ],

  'article-writing': [
    { prompt: 'Write an article for a professional magazine on the future of work. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article about the benefits and risks of telemedicine. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article about how cities can become more pedestrian-friendly. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article on the growing importance of data literacy. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article about the changing role of libraries in the digital age. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article about the psychology of procrastination. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article about ethical considerations in artificial intelligence. (400-500 words)', genre: 'article', level: 'c1' },
    { prompt: 'Write an article about the impact of music on cognitive performance. (400-500 words)', genre: 'article', level: 'c1' }
  ],

  'formal-correspondence': [
    { prompt: 'Write a formal letter to a government official about a local issue. Use diplomatic language. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal letter of recommendation for a colleague applying for a position. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal letter declining a business partnership offer tactfully. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal letter to a board of directors proposing a policy change. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal letter responding to a complaint with a resolution plan. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal letter to an academic journal submitting a paper for review. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal letter to a conference committee proposing a workshop session. (200-300 words)', genre: 'letter', level: 'c1' },
    { prompt: 'Write a formal condolence letter to a colleague. (200-300 words)', genre: 'letter', level: 'c1' }
  ],

  'creative-writing': [
    { prompt: 'Write a short story that begins and ends with the same sentence. Explore voice and style.', genre: 'creative', level: 'c2' },
    { prompt: 'Write a piece of flash fiction (under 500 words) set in a single room with two characters.', genre: 'creative', level: 'c2' },
    { prompt: 'Rewrite a well-known fairy tale from the villain\'s perspective.', genre: 'creative', level: 'c2' },
    { prompt: 'Write a short story using only dialogue — no narration, no description.', genre: 'creative', level: 'c2' },
    { prompt: 'Write a prose poem about a cityscape at dawn.', genre: 'creative', level: 'c2' },
    { prompt: 'Write a story where the narrator is unreliable. The reader should gradually realise the truth differs from the telling.', genre: 'creative', level: 'c2' },
    { prompt: 'Write a short piece in the style of a specific author you admire. Then write a paragraph explaining your stylistic choices.', genre: 'creative', level: 'c2' },
    { prompt: 'Write a story told in reverse chronological order.', genre: 'creative', level: 'c2' }
  ],

  'publication-article': [
    { prompt: 'Write a publication-ready long-form article on the ethics of surveillance technology. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready feature article profiling an innovative social enterprise. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready article on the neuroscience of decision-making. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready opinion piece on the future of higher education. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready investigative-style article on food supply chain transparency. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready article on the cultural significance of translation. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready article exploring the concept of digital citizenship. (500+ words)', genre: 'article', level: 'c2' },
    { prompt: 'Write a publication-ready article on the intersection of architecture and mental health. (500+ words)', genre: 'article', level: 'c2' }
  ],

  'grant-application': [
    { prompt: 'Write a grant application for a community arts project. Include objectives, methodology, budget justification, and expected outcomes. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for a research project on urban biodiversity. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for a youth mentoring programme. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for a digital inclusion initiative targeting elderly citizens. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for a pilot programme teaching coding to refugees. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for a public health awareness campaign. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for an oral history archive project. (500+ words)', genre: 'grant', level: 'c2' },
    { prompt: 'Write a grant application for a renewable energy research initiative. (500+ words)', genre: 'grant', level: 'c2' }
  ],

  'style-adaptation': [
    { prompt: 'Take this sentence: "The company reported a 15% increase in revenue." Rewrite it in five different registers: text message, blog, news article, academic paper, legal document.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Rewrite a children\'s story summary as a formal academic abstract.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Take a news headline and expand it into: (1) a tabloid opening, (2) a broadsheet opening, (3) a satirical column opening.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Rewrite a product review as a Shakespearean soliloquy.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Take a formal business memo and rewrite it as a friendly team Slack message.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Write the same event — a train delay — from three perspectives: the commuter, the train company, and a journalist.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Rewrite a recipe as a narrative essay about memory and family.', genre: 'adaptation', level: 'c2' },
    { prompt: 'Take a scientific finding and write it for: (1) a peer-reviewed journal, (2) a popular science magazine, (3) a tweet thread.', genre: 'adaptation', level: 'c2' }
  ],

  'editing-others': [
    { prompt: 'Edit this paragraph for clarity, coherence, and register consistency: "The meeting was very good and also productive. We discussed lots of things. Everyone was happy and it was a success basically."', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this academic paragraph: "I think that pollution is really bad and we should do something about it. Lots of scientists say so."', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this cover letter opening: "Hi! I really want this job because it sounds cool and I think I would be great at it!!"', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this report extract for passive voice overuse, nominalisation, and clarity.', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this blog post for tone, removing excessive exclamation marks and ensuring consistent voice.', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this student essay for argument structure: move the thesis from the third paragraph to the introduction and ensure each body paragraph has a topic sentence.', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this email for politeness and diplomatic language without changing the core message.', genre: 'editing', level: 'c2' },
    { prompt: 'Edit this proposal, tightening wordy phrases and removing redundancies while preserving meaning.', genre: 'editing', level: 'c2' }
  ],

  'technical-documentation': [
    { prompt: 'Write a user guide section explaining how to set up two-factor authentication. Prioritise clarity and precision. (300-500 words)', genre: 'technical', level: 'c2' },
    { prompt: 'Write an API documentation page for a /users endpoint including parameters, responses, and examples.', genre: 'technical', level: 'c2' },
    { prompt: 'Write a troubleshooting guide for common Wi-Fi connection issues.', genre: 'technical', level: 'c2' },
    { prompt: 'Write release notes for a software update. Include new features, bug fixes, and known issues.', genre: 'technical', level: 'c2' },
    { prompt: 'Write a style guide section on tone and voice for a health technology company.', genre: 'technical', level: 'c2' },
    { prompt: 'Write a README file for an open-source project. Include installation, usage, and contributing guidelines.', genre: 'technical', level: 'c2' },
    { prompt: 'Write a data dictionary entry for a customer database table.', genre: 'technical', level: 'c2' },
    { prompt: 'Write a standard operating procedure for onboarding new team members.', genre: 'technical', level: 'c2' }
  ]
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 -]/g, ''); }

// Exercise generation

const BANK_META = {
  'genre-identification': { type: 'multiple-choice', instruction: 'Identify the genre of this text.' },
  'thesis-evaluation': { type: 'evaluation', instruction: 'Evaluate whether this is a strong or weak thesis statement.' },
  'paragraph-ordering': { type: 'ordering', instruction: 'Put the paragraphs in the correct logical order.' },
  'coherence-device-fill': { type: 'fill-in', instruction: 'Fill in the blank with the correct cohesion device.' },
  'register-matching': { type: 'multiple-choice', instruction: 'Match the text to the appropriate register.' },
  'error-correction-style': { type: 'error-correction', instruction: 'Identify and correct the style or register error.' },
};

function generateExercise(level, skill, count = 5) {
  const bank = ITEM_BANKS[skill];
  if (!bank || !bank.length) return { error: `No item bank for ${level}/${skill}` };
  const items = pick(bank, count);
  const meta = BANK_META[skill];
  if (meta) {
    return { type: meta.type, skill, level, count: items.length, instruction: meta.instruction, items };
  }
  return { type: 'writing-prompt', skill, level, count: items.length, instruction: `Complete the writing task at ${level.toUpperCase()} level.`, items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  const a = norm(answer);
  const e = norm(expected);
  switch (type) {
    case 'multiple-choice':
    case 'fill-in':
    case 'evaluation':
      return a === e;
    case 'ordering': {
      try { return JSON.stringify(JSON.parse(answer)) === JSON.stringify(JSON.parse(expected)); }
      catch { return a === e; }
    }
    case 'error-correction': {
      const ew = e.split(/\s+/);
      const aw = a.split(/\s+/);
      const overlap = ew.filter(w => aw.includes(w)).length;
      return ew.length > 0 && (overlap / ew.length) >= 0.6;
    }
    case 'writing-prompt':
      return null;
    default:
      return a === e;
  }
}

// Public API

class Writing {
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
    const level = p.level || 'a1';
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
    const level = p.level || 'a1';
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
    const level = p.level || 'a1';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        warmup: 'Review previous writing and identify one strength and one area to improve',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} writing items`,
        reflect: 'Self-assess: What did you learn? What will you focus on next time?',
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
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) wr.setLevel(id, level);
        out({ action: 'start', profile: wr.getProfile(id), nextSkills: wr.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(wr.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'a1';
        if (skill) { out(wr.generateExercise(level, skill, 5)); }
        else { const n = wr.getNextSkills(id, 1).next; out(n.length ? wr.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(wr.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(wr.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(wr.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(wr.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(wr.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? wr.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(wr.setLevel(id, l)); break; }
      case 'students': { out(wr.listStudents()); break; }
      default: out({ usage: 'node writing.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
