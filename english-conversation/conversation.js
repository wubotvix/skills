// English Conversation Practice (A1-C2). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'english-conversation');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'a1': {
    'social-routines': ['greetings-introductions', 'saying-goodbye', 'thanking-apologising'],
    'basic-needs': ['asking-for-help', 'shopping-basic', 'ordering-food-basic'],
    'personal-info': ['talking-about-yourself', 'asking-about-others', 'describing-family'],
  },
  'a2': {
    'social-routines': ['making-invitations', 'making-plans', 'telephoning-basic'],
    'daily-life': ['describing-routines', 'giving-directions', 'at-the-restaurant'],
    'opinions': ['likes-dislikes', 'simple-opinions', 'describing-experiences'],
  },
  'b1': {
    'functional': ['agreeing-disagreeing', 'giving-advice', 'making-complaints'],
    'narrative': ['narrating-events', 'describing-people-places', 'explaining-processes'],
    'social': ['job-interview-basic', 'polite-requests', 'making-suggestions'],
  },
  'b2': {
    'discussion': ['debating-opinions', 'hypothetical-situations', 'persuading'],
    'professional': ['formal-meetings', 'negotiation-basic', 'presenting-information'],
    'pragmatics': ['softening-language', 'indirect-requests', 'turn-taking'],
  },
  'c1': {
    'academic': ['academic-discussion', 'critical-response', 'seminar-participation'],
    'professional': ['diplomatic-language', 'mediation', 'chairing-meetings'],
    'nuance': ['hedging-qualifying', 'irony-understatement', 'register-shifting'],
  },
  'c2': {
    'rhetoric': ['persuasive-rhetoric', 'extended-monologue', 'spontaneous-debate'],
    'cultural': ['cultural-nuance', 'humour-wordplay', 'implicit-meaning'],
    'mastery': ['style-shifting', 'conflict-resolution-advanced', 'storytelling-advanced'],
  },
};

const ITEM_BANKS = {
  'a1': {
    'greetings-introductions': {
      type: 'discourse-completion', instruction: 'Choose the best response in this conversation.',
      items: [
        { prompt: 'Someone says: "Hello! How are you?"', answer: "I'm fine, thank you. And you?", options: ["I'm fine, thank you. And you?", 'I am 25.', 'Yes, please.', 'Goodbye.'] },
        { prompt: 'Someone says: "Nice to meet you."', answer: 'Nice to meet you too.', options: ['Nice to meet you too.', 'I am nice.', 'Thank you very much.', 'See you later.'] },
        { prompt: 'Someone says: "What\'s your name?"', answer: "My name is... (say your name)", options: ["My name is... (say your name)", 'I am fine.', 'Nice to meet you.', 'How are you?'] },
        { prompt: 'You want to introduce yourself to a new classmate. You say:', answer: "Hi, I'm... Nice to meet you.", options: ["Hi, I'm... Nice to meet you.", 'Goodbye, see you tomorrow.', 'Can I have a coffee?', 'What time is it?'] },
        { prompt: 'Someone says: "How do you do?"', answer: 'How do you do?', options: ['How do you do?', "I'm doing homework.", "I don't do anything.", 'Fine thanks.'] },
        { prompt: 'You meet your teacher in the morning. You say:', answer: 'Good morning!', options: ['Good morning!', 'Good night!', 'Goodbye!', 'See you later!'] },
      ],
    },
    'saying-goodbye': {
      type: 'discourse-completion', instruction: 'Choose the best way to say goodbye.',
      items: [
        { prompt: 'You are leaving a friend\'s house. You say:', answer: 'Bye! See you soon!', options: ['Bye! See you soon!', 'Hello!', 'Nice to meet you.', 'How are you?'] },
        { prompt: 'Your teacher says: "Have a nice weekend!"', answer: 'You too! See you on Monday.', options: ['You too! See you on Monday.', 'I am fine.', 'Nice to meet you.', 'Good morning.'] },
        { prompt: 'A shopkeeper says: "Have a nice day!"', answer: 'Thank you, you too!', options: ['Thank you, you too!', 'Hello!', 'I want to buy something.', 'How much is it?'] },
        { prompt: 'You are leaving work. A colleague says: "See you tomorrow."', answer: 'See you tomorrow! Have a good evening.', options: ['See you tomorrow! Have a good evening.', 'Good morning!', 'Nice to meet you.', 'How are you?'] },
        { prompt: 'A friend is going on holiday. You say:', answer: 'Have a great trip! See you when you get back.', options: ['Have a great trip! See you when you get back.', 'Good morning!', 'How are you?', 'Nice to meet you.'] },
        { prompt: 'You are ending a phone call with a friend. You say:', answer: 'OK, talk to you later. Bye!', options: ['OK, talk to you later. Bye!', 'Hello, who is this?', 'Can I speak to John?', 'Hold on a moment.'] },
      ],
    },
    'thanking-apologising': {
      type: 'discourse-completion', instruction: 'Choose the most appropriate response.',
      items: [
        { prompt: 'Someone holds the door open for you. You say:', answer: 'Thank you!', options: ['Thank you!', 'Sorry!', 'Excuse me.', 'Hello.'] },
        { prompt: 'You accidentally step on someone\'s foot. You say:', answer: "Oh, I'm so sorry!", options: ["Oh, I'm so sorry!", 'Thank you!', 'Goodbye.', 'How are you?'] },
        { prompt: 'Someone says: "Thank you for your help."', answer: "You're welcome!", options: ["You're welcome!", "I'm sorry.", 'Goodbye.', 'How are you?'] },
        { prompt: 'You are late for class. You say to the teacher:', answer: "Sorry I'm late.", options: ["Sorry I'm late.", 'Thank you.', 'Goodbye.', 'How are you?'] },
        { prompt: 'Someone gives you a birthday present. You say:', answer: "Thank you so much! That's very kind of you.", options: ["Thank you so much! That's very kind of you.", 'Sorry about that.', 'Excuse me.', 'See you later.'] },
        { prompt: 'You bump into someone in the street. You say:', answer: 'Oh, excuse me! Sorry about that.', options: ['Oh, excuse me! Sorry about that.', 'Thank you very much.', 'Good morning.', 'How are you?'] },
      ],
    },
    'asking-for-help': {
      type: 'discourse-completion', instruction: 'Choose the best way to ask for help.',
      items: [
        { prompt: 'You don\'t understand a word. You say to your teacher:', answer: "Excuse me, what does '...' mean?", options: ["Excuse me, what does '...' mean?", "I don't like this word.", 'Goodbye.', 'Thank you.'] },
        { prompt: 'You need to find the train station. You ask a stranger:', answer: 'Excuse me, where is the train station?', options: ['Excuse me, where is the train station?', 'I want the train.', 'Train. Now.', 'Hello, how are you?'] },
        { prompt: 'You can\'t hear someone. You say:', answer: "Sorry, could you say that again, please?", options: ["Sorry, could you say that again, please?", "I don't understand you.", 'Speak louder.', 'What?'] },
        { prompt: 'You need someone to speak more slowly. You say:', answer: 'Could you speak more slowly, please?', options: ['Could you speak more slowly, please?', 'Too fast.', 'Stop talking.', 'I am slow.'] },
        { prompt: 'You are lost in a shopping centre. You ask:', answer: "Excuse me, can you help me? I'm looking for...", options: ["Excuse me, can you help me? I'm looking for...", 'Where am I?', 'Help!', 'I am lost.'] },
        { prompt: 'You want to borrow a pen. You ask:', answer: 'Excuse me, can I borrow a pen, please?', options: ['Excuse me, can I borrow a pen, please?', 'Give me a pen.', 'Pen.', 'I need pen.'] },
      ],
    },
    'shopping-basic': {
      type: 'discourse-completion', instruction: 'Choose the best response in a shop.',
      items: [
        { prompt: 'A shop assistant says: "Can I help you?"', answer: "Yes, I'm looking for a... please.", options: ["Yes, I'm looking for a... please.", 'No.', 'How are you?', 'Goodbye.'] },
        { prompt: 'You want to know the price of something. You ask:', answer: 'How much is this, please?', options: ['How much is this, please?', 'Give me this.', 'I want it.', 'Money.'] },
        { prompt: 'A shop assistant says: "That\'s £5.50."', answer: "OK, here you are. (pay)", options: ["OK, here you are. (pay)", 'Too much.', 'No money.', 'Goodbye.'] },
        { prompt: 'You want to try on a shirt. You say:', answer: 'Can I try this on, please?', options: ['Can I try this on, please?', 'I wear this.', 'Give me this.', 'Nice shirt.'] },
        { prompt: 'Something is too expensive. You say:', answer: "I'm afraid that's a bit too expensive for me. Thank you anyway.", options: ["I'm afraid that's a bit too expensive for me. Thank you anyway.", 'Too much money!', 'No.', 'Cheaper!'] },
        { prompt: 'You are paying and the assistant says: "Would you like a bag?"', answer: 'Yes, please. / No, thank you.', options: ['Yes, please. / No, thank you.', 'Bag.', 'I have money.', 'How are you?'] },
      ],
    },
    'ordering-food-basic': {
      type: 'discourse-completion', instruction: 'Choose the best response in a café or restaurant.',
      items: [
        { prompt: 'A waiter says: "What would you like?"', answer: "I'd like a coffee, please.", options: ["I'd like a coffee, please.", 'Coffee.', 'Give me coffee.', 'I want.'] },
        { prompt: 'A waiter says: "Anything else?"', answer: 'No, thank you. That\'s all.', options: ['No, thank you. That\'s all.', 'No.', 'Finished.', 'Stop.'] },
        { prompt: 'You want to ask for the bill. You say:', answer: 'Could I have the bill, please?', options: ['Could I have the bill, please?', 'Money!', 'Pay now.', 'I go.'] },
        { prompt: 'The waiter brings the wrong dish. You say:', answer: "Excuse me, I think there's been a mistake. I ordered the...", options: ["Excuse me, I think there's been a mistake. I ordered the...", 'This is wrong!', 'I don\'t want this.', 'Take it back.'] },
        { prompt: 'You want to know what a dish contains. You ask:', answer: "Could you tell me what's in this dish, please?", options: ["Could you tell me what's in this dish, please?", 'What is this?', 'Food?', 'I eat this?'] },
        { prompt: 'The waiter asks: "How was everything?" You say:', answer: 'It was lovely, thank you.', options: ['It was lovely, thank you.', 'OK.', 'Food.', 'I ate.'] },
      ],
    },
    'talking-about-yourself': {
      type: 'discourse-completion', instruction: 'Choose the best way to talk about yourself.',
      items: [
        { prompt: 'Someone asks: "Where are you from?"', answer: "I'm from... (say your country/city).", options: ["I'm from... (say your country/city).", 'Yes.', 'Thank you.', 'How are you?'] },
        { prompt: 'Someone asks: "What do you do?"', answer: "I'm a student. / I work as a...", options: ["I'm a student. / I work as a...", 'I do things.', 'Nothing.', 'Fine, thanks.'] },
        { prompt: 'Someone asks: "Do you have any hobbies?"', answer: 'Yes, I like reading and playing football.', options: ['Yes, I like reading and playing football.', 'Hobbies.', 'Yes.', 'I am fine.'] },
        { prompt: 'Someone asks: "How old are you?" (informal)', answer: "I'm 25.", options: ["I'm 25.", 'Old.', 'Years.', 'Fine.'] },
        { prompt: 'Someone asks: "Do you have any brothers or sisters?"', answer: 'Yes, I have one brother and two sisters.', options: ['Yes, I have one brother and two sisters.', 'Family.', 'Yes.', 'Brother sister.'] },
        { prompt: 'Someone asks: "What languages do you speak?"', answer: 'I speak... and I\'m learning English.', options: ['I speak... and I\'m learning English.', 'Languages.', 'English.', 'Yes.'] },
      ],
    },
    'asking-about-others': {
      type: 'discourse-completion', instruction: 'Choose the best question to ask.',
      items: [
        { prompt: 'You want to know where someone lives. You ask:', answer: 'Where do you live?', options: ['Where do you live?', 'You live?', 'House?', 'Where?'] },
        { prompt: 'You want to know someone\'s job. You ask:', answer: 'What do you do for a living?', options: ['What do you do for a living?', 'Job?', 'Work?', 'You work?'] },
        { prompt: 'You want to know about someone\'s weekend. You ask:', answer: 'What did you do at the weekend?', options: ['What did you do at the weekend?', 'Weekend?', 'You had fun?', 'Good weekend?'] },
        { prompt: 'You want to know if someone likes their city. You ask:', answer: 'Do you like living here?', options: ['Do you like living here?', 'Good city?', 'You like?', 'City?'] },
        { prompt: 'You want to know about someone\'s family. You ask:', answer: 'Do you have a big family?', options: ['Do you have a big family?', 'Family?', 'Brothers?', 'People?'] },
        { prompt: 'You meet someone new at a party. A good first question is:', answer: 'So, how do you know the host?', options: ['So, how do you know the host?', 'Who are you?', 'Name?', 'Why are you here?'] },
      ],
    },
    'describing-family': {
      type: 'discourse-completion', instruction: 'Choose the best response about family.',
      items: [
        { prompt: 'Someone asks about your family. You say:', answer: "I have a small family — my parents and one sister.", options: ["I have a small family — my parents and one sister.", 'Family.', 'People.', 'Yes.'] },
        { prompt: 'You want to describe your mother. You say:', answer: "My mother is a teacher. She's very kind and hardworking.", options: ["My mother is a teacher. She's very kind and hardworking.", 'Mother teacher.', 'She works.', 'Mother.'] },
        { prompt: 'Someone asks: "Are you married?"', answer: 'Yes, I am. / No, not yet.', options: ['Yes, I am. / No, not yet.', 'Married.', 'Ring.', 'No.'] },
        { prompt: 'Someone asks: "Do you have children?"', answer: 'Yes, I have two children — a boy and a girl.', options: ['Yes, I have two children — a boy and a girl.', 'Children.', 'Two.', 'Boy girl.'] },
        { prompt: 'You want to talk about a family member you admire. You say:', answer: "I really admire my grandmother. She's 85 and still very active.", options: ["I really admire my grandmother. She's 85 and still very active.", 'Grandmother old.', 'I like grandmother.', 'She is 85.'] },
        { prompt: 'Someone shows you a family photo. You respond:', answer: "What a lovely family! Is that your daughter?", options: ["What a lovely family! Is that your daughter?", 'Photo.', 'Nice.', 'People.'] },
      ],
    },
  },
  'a2': {
    'making-invitations': {
      type: 'discourse-completion', instruction: 'Choose the best way to make or respond to an invitation.',
      items: [
        { prompt: 'You want to invite a friend to the cinema. You say:', answer: 'Would you like to go to the cinema this weekend?', options: ['Would you like to go to the cinema this weekend?', 'Cinema.', 'We go cinema.', 'Film?'] },
        { prompt: 'A friend invites you to dinner. You want to accept. You say:', answer: "That sounds great! What time should I come?", options: ["That sounds great! What time should I come?", 'Yes.', 'OK.', 'Food.'] },
        { prompt: 'A friend invites you out but you\'re busy. You say:', answer: "I'd love to, but I'm afraid I can't this weekend. How about next week?", options: ["I'd love to, but I'm afraid I can't this weekend. How about next week?", 'No.', "I can't.", 'Busy.'] },
        { prompt: 'Someone says: "Do you fancy a coffee?"', answer: "Yes, that would be lovely. Where shall we go?", options: ["Yes, that would be lovely. Where shall we go?", 'Coffee.', 'Yes.', 'OK.'] },
        { prompt: 'You want to suggest an activity. You say:', answer: "How about going for a walk in the park?", options: ["How about going for a walk in the park?", 'Walk.', 'Park.', 'We walk.'] },
        { prompt: 'Someone cancels plans. You respond:', answer: "No worries! We can do it another time.", options: ["No worries! We can do it another time.", 'Bad.', 'Why?', 'OK.'] },
      ],
    },
    'making-plans': {
      type: 'discourse-completion', instruction: 'Choose the best response when making plans.',
      items: [
        { prompt: 'You want to arrange a time to meet. You say:', answer: "When are you free? How about Saturday afternoon?", options: ["When are you free? How about Saturday afternoon?", 'Saturday.', 'Time?', 'You free?'] },
        { prompt: 'A friend suggests Tuesday but you\'re busy. You say:', answer: "Tuesday doesn't work for me. How about Wednesday instead?", options: ["Tuesday doesn't work for me. How about Wednesday instead?", 'No Tuesday.', "I can't.", 'Busy.'] },
        { prompt: 'You need to decide where to meet. You say:', answer: "Shall we meet at the café on the high street?", options: ["Shall we meet at the café on the high street?", 'Café.', 'Where?', 'We meet.'] },
        { prompt: 'You want to confirm plans. You say:', answer: "So, just to confirm — Saturday at 3 PM at the café?", options: ["So, just to confirm — Saturday at 3 PM at the café?", 'Saturday.', 'OK?', 'Yes?'] },
        { prompt: 'A friend is running late. They text you. You reply:', answer: "No problem! Take your time. I'll wait inside.", options: ["No problem! Take your time. I'll wait inside.", 'Hurry.', 'Late!', 'Come now.'] },
        { prompt: 'You need to change plans at the last minute. You say:', answer: "I'm really sorry, but something has come up. Can we reschedule?", options: ["I'm really sorry, but something has come up. Can we reschedule?", "I can't come.", 'No.', 'Change.'] },
      ],
    },
    'telephoning-basic': {
      type: 'discourse-completion', instruction: 'Choose the best telephone response.',
      items: [
        { prompt: 'You answer the phone at home. You say:', answer: 'Hello?', options: ['Hello?', 'Who is this?', 'Talk.', 'Yes?'] },
        { prompt: 'You want to speak to someone specific. You say:', answer: "Could I speak to... please?", options: ["Could I speak to... please?", 'Give me...', 'I want...', 'Where is...?'] },
        { prompt: 'The person you want isn\'t there. The receptionist says: "I\'m afraid she\'s not available."', answer: "Could I leave a message, please?", options: ["Could I leave a message, please?", 'Why not?', 'Bad.', 'I call later.'] },
        { prompt: 'You can\'t hear the other person clearly. You say:', answer: "Sorry, I can't hear you very well. Could you speak up a bit?", options: ["Sorry, I can't hear you very well. Could you speak up a bit?", 'Louder!', "I can't hear.", 'What?'] },
        { prompt: 'You need to end the call. You say:', answer: "Well, it was nice talking to you. I'd better go now. Bye!", options: ["Well, it was nice talking to you. I'd better go now. Bye!", 'Stop.', 'Finished.', 'Bye.'] },
        { prompt: 'Someone calls the wrong number. You say:', answer: "I'm sorry, I think you have the wrong number.", options: ["I'm sorry, I think you have the wrong number.", 'Wrong!', 'No.', 'Who?'] },
      ],
    },
    'describing-routines': {
      type: 'discourse-completion', instruction: 'Choose the best response about daily routines.',
      items: [
        { prompt: 'Someone asks: "What do you usually do in the morning?"', answer: 'I usually get up at 7, have breakfast, and then go to work.', options: ['I usually get up at 7, have breakfast, and then go to work.', 'Morning.', 'I wake up.', 'Things.'] },
        { prompt: 'Someone asks: "What do you do after work?"', answer: 'I usually go to the gym or relax at home.', options: ['I usually go to the gym or relax at home.', 'After work.', 'Nothing.', 'Home.'] },
        { prompt: 'Someone asks: "Do you cook every day?"', answer: "Not every day. I cook about three times a week.", options: ["Not every day. I cook about three times a week.", 'Cook.', 'Sometimes.', 'Yes no.'] },
        { prompt: 'Someone asks: "What time do you go to bed?"', answer: 'I usually go to bed around 11 PM.', options: ['I usually go to bed around 11 PM.', 'Bed.', 'Night.', 'Sleep.'] },
        { prompt: 'You want to ask about someone\'s weekend routine. You say:', answer: 'What do you usually do at the weekends?', options: ['What do you usually do at the weekends?', 'Weekend?', 'You do what?', 'Fun?'] },
        { prompt: 'Someone asks: "How do you get to work?"', answer: 'I take the bus. It takes about 30 minutes.', options: ['I take the bus. It takes about 30 minutes.', 'Bus.', 'I go.', 'Work.'] },
      ],
    },
    'giving-directions': {
      type: 'discourse-completion', instruction: 'Choose the best way to give or ask for directions.',
      items: [
        { prompt: 'A tourist asks: "How do I get to the museum?"', answer: 'Go straight ahead, then turn left at the traffic lights. It\'s on your right.', options: ['Go straight ahead, then turn left at the traffic lights. It\'s on your right.', 'Museum there.', 'Left.', 'I don\'t know.'] },
        { prompt: 'You want to ask how far something is. You say:', answer: "How far is it from here? Can I walk there?", options: ["How far is it from here? Can I walk there?", 'Far?', 'Walk?', 'Where?'] },
        { prompt: 'Someone gives you directions but you\'re confused. You say:', answer: "Sorry, I didn't quite catch that. Did you say left at the traffic lights?", options: ["Sorry, I didn't quite catch that. Did you say left at the traffic lights?", 'Again.', 'What?', "I don't understand."] },
        { prompt: 'You want to confirm you\'re going the right way. You ask:', answer: "Excuse me, am I going the right way to the station?", options: ["Excuse me, am I going the right way to the station?", 'Station?', 'Right way?', 'Where station?'] },
        { prompt: 'Someone asks for the nearest pharmacy. You say:', answer: "There's one just around the corner, next to the supermarket.", options: ["There's one just around the corner, next to the supermarket.", 'Pharmacy near.', 'Corner.', 'I don\'t know.'] },
        { prompt: 'Someone thanks you for directions. You say:', answer: "You're welcome! You can't miss it.", options: ["You're welcome! You can't miss it.", 'OK.', 'Yes.', 'Bye.'] },
      ],
    },
    'at-the-restaurant': {
      type: 'discourse-completion', instruction: 'Choose the best restaurant conversation response.',
      items: [
        { prompt: 'The waiter says: "Good evening. Do you have a reservation?"', answer: "Yes, a table for two under the name...", options: ["Yes, a table for two under the name...", 'Table.', 'Two.', 'Yes.'] },
        { prompt: 'You want to ask about a dish on the menu. You say:', answer: "Could you tell me what the soup of the day is?", options: ["Could you tell me what the soup of the day is?", 'Soup?', 'What soup?', 'I want soup.'] },
        { prompt: 'The waiter asks: "Are you ready to order?"', answer: "Yes, I'll have the grilled chicken, please.", options: ["Yes, I'll have the grilled chicken, please.", 'Chicken.', 'I eat chicken.', 'Give me chicken.'] },
        { prompt: 'You have a food allergy. You say:', answer: "I'm allergic to nuts. Does this dish contain any?", options: ["I'm allergic to nuts. Does this dish contain any?", 'No nuts.', 'Allergy.', 'Nuts bad.'] },
        { prompt: 'The food is taking a long time. You say:', answer: "Excuse me, we ordered about 30 minutes ago. Could you check on our food?", options: ["Excuse me, we ordered about 30 minutes ago. Could you check on our food?", 'Where is food?', 'Slow!', 'Food now.'] },
        { prompt: 'You want to compliment the food. You say:', answer: "The food was delicious! Please give our compliments to the chef.", options: ["The food was delicious! Please give our compliments to the chef.", 'Good food.', 'Nice.', 'I liked.'] },
      ],
    },
    'likes-dislikes': {
      type: 'discourse-completion', instruction: 'Choose the best way to express likes or dislikes.',
      items: [
        { prompt: 'Someone asks: "Do you like sports?"', answer: "Yes, I really enjoy football and tennis. What about you?", options: ["Yes, I really enjoy football and tennis. What about you?", 'Sports yes.', 'I like.', 'Football.'] },
        { prompt: 'Someone asks if you like a certain type of music. You don\'t. You say:', answer: "It's not really my thing, to be honest. I prefer jazz.", options: ["It's not really my thing, to be honest. I prefer jazz.", 'No.', 'Bad music.', "I don't like."] },
        { prompt: 'You want to ask about someone\'s taste in films. You say:', answer: "What kind of films do you enjoy?", options: ["What kind of films do you enjoy?", 'Films?', 'You watch?', 'Cinema?'] },
        { prompt: 'Someone suggests an activity you love. You say:', answer: "Oh, I'd love that! I'm really into hiking.", options: ["Oh, I'd love that! I'm really into hiking.", 'Yes.', 'OK.', 'Hiking.'] },
        { prompt: 'Someone asks: "Do you like cooking?"', answer: "I love it! I find it really relaxing after a long day.", options: ["I love it! I find it really relaxing after a long day.", 'Yes cook.', 'I cook.', 'Food.'] },
        { prompt: 'You want to express a strong dislike politely. You say:', answer: "I'm not really keen on... to be honest.", options: ["I'm not really keen on... to be honest.", 'I hate it.', 'No.', 'Bad.'] },
      ],
    },
    'simple-opinions': {
      type: 'discourse-completion', instruction: 'Choose the best way to give a simple opinion.',
      items: [
        { prompt: 'Someone asks: "What do you think of this restaurant?"', answer: "I think it's quite nice. The food is good but it's a bit noisy.", options: ["I think it's quite nice. The food is good but it's a bit noisy.", 'Good.', 'Nice restaurant.', 'OK.'] },
        { prompt: 'Someone asks: "Do you think English is difficult?"', answer: "I think grammar is hard, but speaking is getting easier with practice.", options: ["I think grammar is hard, but speaking is getting easier with practice.", 'Yes difficult.', 'Hard.', 'English.'] },
        { prompt: 'You want to agree with someone\'s opinion. You say:', answer: "Yes, I totally agree. I think so too.", options: ["Yes, I totally agree. I think so too.", 'Yes.', 'Same.', 'Agree.'] },
        { prompt: 'You want to politely disagree. You say:', answer: "I see what you mean, but I think...", options: ["I see what you mean, but I think...", 'No.', 'Wrong.', 'I disagree.'] },
        { prompt: 'Someone asks your opinion on a TV show. You say:', answer: "I think it's really entertaining. The acting is great.", options: ["I think it's really entertaining. The acting is great.", 'Good show.', 'I watch.', 'TV.'] },
        { prompt: 'You\'re not sure about something. You say:', answer: "I'm not sure, actually. I'd need to think about it.", options: ["I'm not sure, actually. I'd need to think about it.", "Don't know.", 'Maybe.', 'I think.'] },
      ],
    },
    'describing-experiences': {
      type: 'discourse-completion', instruction: 'Choose the best way to describe an experience.',
      items: [
        { prompt: 'Someone asks: "How was your holiday?"', answer: "It was fantastic! We went to Italy and the weather was perfect.", options: ["It was fantastic! We went to Italy and the weather was perfect.", 'Good.', 'Italy.', 'Holiday nice.'] },
        { prompt: 'You want to tell someone about a film you saw. You say:', answer: "I saw this great film last night. It was a thriller with an amazing plot twist.", options: ["I saw this great film last night. It was a thriller with an amazing plot twist.", 'Good film.', 'I watch film.', 'Film.'] },
        { prompt: 'Someone asks: "Have you ever been to London?"', answer: "Yes, I went there last summer. I loved the museums and the parks.", options: ["Yes, I went there last summer. I loved the museums and the parks.", 'Yes London.', 'I went.', 'London good.'] },
        { prompt: 'You want to describe a bad experience at a hotel. You say:', answer: "The hotel was disappointing. The room was small and not very clean.", options: ["The hotel was disappointing. The room was small and not very clean.", 'Bad hotel.', 'Not good.', 'Dirty.'] },
        { prompt: 'Someone asks about your concert experience. You say:', answer: "It was incredible! The atmosphere was electric and the band was amazing.", options: ["It was incredible! The atmosphere was electric and the band was amazing.", 'Good concert.', 'I liked.', 'Music.'] },
        { prompt: 'You want to recommend a restaurant. You say:', answer: "You should try that new Italian place. The pasta was absolutely delicious.", options: ["You should try that new Italian place. The pasta was absolutely delicious.", 'Good restaurant.', 'Go there.', 'Italian food.'] },
      ],
    },
  },
  'b1': {
    'agreeing-disagreeing': {
      type: 'discourse-completion', instruction: 'Choose the best way to agree or disagree.',
      items: [
        { prompt: '"I think public transport should be free." You partly agree:', answer: "I see your point, but I think it would be very expensive. Maybe reduced prices would work better.", options: ["I see your point, but I think it would be very expensive. Maybe reduced prices would work better.", 'No.', 'Maybe.', 'I agree.'] },
        { prompt: '"Working from home is more productive." You strongly agree:', answer: "Absolutely! I find I get so much more done without the distractions of an office.", options: ["Absolutely! I find I get so much more done without the distractions of an office.", 'Yes.', 'I agree.', 'True.'] },
        { prompt: '"Social media is a waste of time." You disagree:', answer: "I wouldn't say that. It can be really useful for staying in touch with friends and networking.", options: ["I wouldn't say that. It can be really useful for staying in touch with friends and networking.", 'Wrong.', 'No.', 'Social media good.'] },
        { prompt: 'Someone makes a point you hadn\'t considered. You say:', answer: "That's a good point. I hadn't thought of it that way.", options: ["That's a good point. I hadn't thought of it that way.", 'OK.', 'Maybe.', 'Interesting.'] },
        { prompt: 'You want to introduce a contrasting view. You say:', answer: "I take your point, but on the other hand...", options: ["I take your point, but on the other hand...", 'But...', 'No but...', 'However.'] },
        { prompt: '"Everyone should learn to drive." You partially disagree:', answer: "I'm not entirely convinced. In cities with good public transport, it's not really necessary.", options: ["I'm not entirely convinced. In cities with good public transport, it's not really necessary.", 'Not true.', 'No.', 'Disagree.'] },
      ],
    },
    'giving-advice': {
      type: 'discourse-completion', instruction: 'Choose the best way to give or respond to advice.',
      items: [
        { prompt: 'A friend says: "I can\'t sleep at night." You advise:', answer: "Have you tried cutting down on caffeine? That really helped me.", options: ["Have you tried cutting down on caffeine? That really helped me.", 'Sleep more.', 'No coffee.', 'Try sleeping.'] },
        { prompt: 'Someone asks for advice about learning English. You say:', answer: "If I were you, I'd try watching English TV shows with subtitles. It really helps.", options: ["If I were you, I'd try watching English TV shows with subtitles. It really helps.", 'Study more.', 'Read books.', 'Speak English.'] },
        { prompt: 'A friend asks: "Should I take the job?" You say:', answer: "It depends. What are the pros and cons? Let's think it through.", options: ["It depends. What are the pros and cons? Let's think it through.", 'Yes.', 'Take it.', 'Good job.'] },
        { prompt: 'Someone gives you advice you don\'t want. You respond politely:', answer: "Thanks for the suggestion. I'll think about it.", options: ["Thanks for the suggestion. I'll think about it.", 'No thanks.', "I don't want advice.", 'Bad idea.'] },
        { prompt: 'A colleague is stressed about a presentation. You say:', answer: "Why don't you practise in front of a friend first? That might help build your confidence.", options: ["Why don't you practise in front of a friend first? That might help build your confidence.", 'Relax.', "Don't worry.", 'Practise.'] },
        { prompt: 'Someone says: "I keep forgetting things." You advise:', answer: "You could try keeping a to-do list. I find writing things down really helps.", options: ["You could try keeping a to-do list. I find writing things down really helps.", 'Write it down.', 'Remember.', 'Think harder.'] },
      ],
    },
    'making-complaints': {
      type: 'discourse-completion', instruction: 'Choose the best way to make a complaint.',
      items: [
        { prompt: 'Your hotel room hasn\'t been cleaned. You say at reception:', answer: "I'm sorry to bother you, but my room hasn't been cleaned today. Could you arrange that, please?", options: ["I'm sorry to bother you, but my room hasn't been cleaned today. Could you arrange that, please?", 'Room dirty!', 'Clean my room!', 'Not cleaned.'] },
        { prompt: 'You received the wrong order online. You call customer service:', answer: "I ordered a blue jacket but I received a red one. Could you arrange an exchange?", options: ["I ordered a blue jacket but I received a red one. Could you arrange an exchange?", 'Wrong colour!', 'Send back!', 'I want blue.'] },
        { prompt: 'Your neighbour is playing loud music late at night. You say:', answer: "Excuse me, I don't mean to be difficult, but the music is quite loud. Would you mind turning it down?", options: ["Excuse me, I don't mean to be difficult, but the music is quite loud. Would you mind turning it down?", 'Too loud!', 'Stop music!', 'Quiet!'] },
        { prompt: 'A product broke after one week. You return to the shop:', answer: "I bought this last week and it's already broken. I'd like a refund or a replacement, please.", options: ["I bought this last week and it's already broken. I'd like a refund or a replacement, please.", 'Broken!', 'Give money back!', 'Bad product.'] },
        { prompt: 'Customer service asks you to wait. You\'ve been waiting 20 minutes:', answer: "I understand you're busy, but I've been waiting for quite a while now. Is there someone who can help?", options: ["I understand you're busy, but I've been waiting for quite a while now. Is there someone who can help?", 'Too slow!', 'I\'m waiting!', 'Hurry up!'] },
        { prompt: 'The complaint is resolved. You say:', answer: "Thank you for sorting that out. I appreciate your help.", options: ["Thank you for sorting that out. I appreciate your help.", 'OK.', 'Finally.', 'About time.'] },
      ],
    },
    'narrating-events': {
      type: 'discourse-completion', instruction: 'Choose the best way to narrate events.',
      items: [
        { prompt: 'You\'re telling a friend about something funny that happened. You begin:', answer: "You'll never believe what happened to me yesterday!", options: ["You'll never believe what happened to me yesterday!", 'Yesterday.', 'Funny thing.', 'Listen.'] },
        { prompt: 'You\'re describing a sequence of events. You use:', answer: "First, I... Then, ... After that, ... Finally, ...", options: ["First, I... Then, ... After that, ... Finally, ...", 'And then and then.', 'I did. I did. I did.', 'Things happened.'] },
        { prompt: 'You want to add a surprising detail to your story. You say:', answer: "And the funny thing was, it turned out to be...", options: ["And the funny thing was, it turned out to be...", 'Then surprise.', 'Guess what.', 'Also.'] },
        { prompt: 'Someone interrupts your story to ask a question. You continue:', answer: "Anyway, as I was saying...", options: ["Anyway, as I was saying...", 'So.', 'OK.', 'Wait.'] },
        { prompt: 'You\'re finishing a story. You wrap up:', answer: "So in the end, everything worked out fine.", options: ["So in the end, everything worked out fine.", 'The end.', 'Finish.', 'Done.'] },
        { prompt: 'You\'re describing a past event and want to set the scene:', answer: "It was a rainy Tuesday evening. I was walking home from work when...", options: ["It was a rainy Tuesday evening. I was walking home from work when...", 'Tuesday. Rain. Walking.', 'I walked.', 'Then.'] },
      ],
    },
    'describing-people-places': {
      type: 'discourse-completion', instruction: 'Choose the best description.',
      items: [
        { prompt: 'Someone asks you to describe your best friend. You say:', answer: "She's really outgoing and funny. She's the kind of person who lights up a room.", options: ["She's really outgoing and funny. She's the kind of person who lights up a room.", 'She nice.', 'Good person.', 'Friend.'] },
        { prompt: 'Someone asks about your hometown. You say:', answer: "It's a small coastal town. It's quite quiet but really beautiful in the summer.", options: ["It's a small coastal town. It's quite quiet but really beautiful in the summer.", 'Small town.', 'Near sea.', 'Nice.'] },
        { prompt: 'You\'re describing a place you visited. You say:', answer: "The market was incredibly lively — full of colours, sounds, and amazing smells.", options: ["The market was incredibly lively — full of colours, sounds, and amazing smells.", 'Market good.', 'Nice market.', 'I went market.'] },
        { prompt: 'You\'re describing someone\'s personality. You say:', answer: "He comes across as quiet at first, but once you get to know him, he's really witty.", options: ["He comes across as quiet at first, but once you get to know him, he's really witty.", 'He quiet.', 'Nice man.', 'Funny.'] },
        { prompt: 'You want to describe a beautiful view. You say:', answer: "The view from the top was breathtaking — you could see for miles across the valley.", options: ["The view from the top was breathtaking — you could see for miles across the valley.", 'Nice view.', 'Beautiful.', 'I saw.'] },
        { prompt: 'You\'re comparing two cities. You say:', answer: "Barcelona is livelier than Madrid, but Madrid has a more relaxed atmosphere.", options: ["Barcelona is livelier than Madrid, but Madrid has a more relaxed atmosphere.", 'Barcelona better.', 'Both nice.', 'Cities.'] },
      ],
    },
    'explaining-processes': {
      type: 'discourse-completion', instruction: 'Choose the best way to explain a process.',
      items: [
        { prompt: 'Someone asks how to make tea. You explain:', answer: "First, boil the kettle. Then, put a tea bag in a mug and pour the hot water over it. Let it brew for a few minutes, then add milk if you like.", options: ["First, boil the kettle. Then, put a tea bag in a mug and pour the hot water over it. Let it brew for a few minutes, then add milk if you like.", 'Hot water, tea, milk.', 'Make tea.', 'Boil water.'] },
        { prompt: 'Someone asks how to get a library card. You say:', answer: "Basically, you need to go to the library with some ID and proof of address. They'll sign you up on the spot.", options: ["Basically, you need to go to the library with some ID and proof of address. They'll sign you up on the spot.", 'Go library.', 'Get card.', 'Library.'] },
        { prompt: 'You want to explain how something works step by step. You use:', answer: "The first step is... After that, you need to... The final step is...", options: ["The first step is... After that, you need to... The final step is...", 'Do this then that.', 'Steps.', 'One two three.'] },
        { prompt: 'Someone asks you to explain a rule at work. You say:', answer: "The way it works is, you need to submit your request at least two weeks in advance.", options: ["The way it works is, you need to submit your request at least two weeks in advance.", 'Two weeks before.', 'Rule.', 'Submit request.'] },
        { prompt: 'You\'re giving instructions but want to add a warning. You say:', answer: "Make sure you don't skip this step, because if you do, it won't work.", options: ["Make sure you don't skip this step, because if you do, it won't work.", "Don't skip.", 'Important!', 'Careful.'] },
        { prompt: 'Someone doesn\'t understand your explanation. You try again:', answer: "Let me put it another way. Basically, what you need to do is...", options: ["Let me put it another way. Basically, what you need to do is...", 'Again.', 'Listen.', 'Same thing.'] },
      ],
    },
    'job-interview-basic': {
      type: 'discourse-completion', instruction: 'Choose the best response in a job interview.',
      items: [
        { prompt: '"Tell me about yourself."', answer: "I have three years of experience in marketing. I'm particularly good at social media campaigns and content creation.", options: ["I have three years of experience in marketing. I'm particularly good at social media campaigns and content creation.", 'I am me.', 'I like my job.', 'I work.'] },
        { prompt: '"Why do you want to work here?"', answer: "I admire your company's approach to innovation, and I think my skills would be a great fit for your team.", options: ["I admire your company's approach to innovation, and I think my skills would be a great fit for your team.", 'I need money.', 'Good company.', 'I want job.'] },
        { prompt: '"What are your weaknesses?"', answer: "I sometimes take on too much, but I've been working on prioritising my tasks more effectively.", options: ["I sometimes take on too much, but I've been working on prioritising my tasks more effectively.", 'No weaknesses.', "I'm perfect.", 'Nothing.'] },
        { prompt: '"Do you have any questions for us?"', answer: "Yes, could you tell me more about the team I'd be working with?", options: ["Yes, could you tell me more about the team I'd be working with?", 'No.', 'How much money?', 'When do I start?'] },
        { prompt: '"Where do you see yourself in five years?"', answer: "I'd like to have developed my skills further and taken on more responsibility within the organisation.", options: ["I'd like to have developed my skills further and taken on more responsibility within the organisation.", 'Your job.', "I don't know.", 'Same job.'] },
        { prompt: 'The interviewer says: "Thank you for coming in." You reply:', answer: "Thank you for the opportunity. I really enjoyed learning about the role. I look forward to hearing from you.", options: ["Thank you for the opportunity. I really enjoyed learning about the role. I look forward to hearing from you.", 'Bye.', 'Thanks.', 'OK.'] },
      ],
    },
    'polite-requests': {
      type: 'discourse-completion', instruction: 'Choose the most polite request.',
      items: [
        { prompt: 'You want a colleague to send you a file. You say:', answer: "Would you mind sending me that file when you get a chance?", options: ["Would you mind sending me that file when you get a chance?", 'Send me the file.', 'File please.', 'I need file.'] },
        { prompt: 'You want someone to move so you can sit down. You say:', answer: "Excuse me, is this seat taken? Would you mind if I sat here?", options: ["Excuse me, is this seat taken? Would you mind if I sat here?", 'Move.', 'I sit here.', 'Seat.'] },
        { prompt: 'You need to ask your boss for a day off. You say:', answer: "I was wondering if I could take Friday off, if that would be possible?", options: ["I was wondering if I could take Friday off, if that would be possible?", 'I want Friday off.', 'Give me Friday.', 'No work Friday.'] },
        { prompt: 'You want someone to repeat something. You say:', answer: "I'm sorry, would you mind repeating that? I didn't quite catch it.", options: ["I'm sorry, would you mind repeating that? I didn't quite catch it.", 'Again.', 'What?', 'Say it again.'] },
        { prompt: 'You want to borrow someone\'s charger. You say:', answer: "I don't suppose I could borrow your charger for a few minutes?", options: ["I don't suppose I could borrow your charger for a few minutes?", 'Give me charger.', 'Charger.', 'I need charger.'] },
        { prompt: 'You want a shop assistant to check stock. You say:', answer: "Would it be possible for you to check if you have this in a size 10?", options: ["Would it be possible for you to check if you have this in a size 10?", 'Check size 10.', 'Size 10?', 'I want 10.'] },
      ],
    },
    'making-suggestions': {
      type: 'discourse-completion', instruction: 'Choose the best suggestion.',
      items: [
        { prompt: 'Friends can\'t decide where to eat. You suggest:', answer: "How about trying that new Thai place? I've heard great things about it.", options: ["How about trying that new Thai place? I've heard great things about it.", 'Thai.', 'Let\'s eat.', 'I want Thai.'] },
        { prompt: 'A colleague is struggling with a task. You suggest:', answer: "Why don't you try breaking it down into smaller steps? That might make it more manageable.", options: ["Why don't you try breaking it down into smaller steps? That might make it more manageable.", 'Do it differently.', 'Try harder.', 'Smaller steps.'] },
        { prompt: 'Someone rejects your suggestion. You offer an alternative:', answer: "OK, fair enough. In that case, what about...?", options: ["OK, fair enough. In that case, what about...?", 'Fine.', 'OK.', 'Your idea.'] },
        { prompt: 'You want to suggest a compromise. You say:', answer: "What if we met halfway? We could...", options: ["What if we met halfway? We could...", 'Compromise.', 'Half.', 'Middle.'] },
        { prompt: 'Someone asks: "What shall we do this afternoon?" You say:', answer: "We could go for a walk if the weather holds, or we could visit the museum.", options: ["We could go for a walk if the weather holds, or we could visit the museum.", 'Walk.', 'Museum.', 'I don\'t know.'] },
        { prompt: 'You want to tentatively suggest an idea. You say:', answer: "This is just an idea, but what if we...?", options: ["This is just an idea, but what if we...?", 'My idea.', 'I think.', 'Do this.'] },
      ],
    },
  },
  'b2': {
    'debating-opinions': {
      type: 'discourse-completion', instruction: 'Choose the best response in a debate.',
      items: [
        { prompt: 'You want to challenge someone\'s argument respectfully. You say:', answer: "I see where you're coming from, but I'd argue that the evidence actually suggests otherwise.", options: ["I see where you're coming from, but I'd argue that the evidence actually suggests otherwise.", "You're wrong.", 'No.', 'I disagree completely.'] },
        { prompt: 'You want to concede a point before making your argument. You say:', answer: "You raise a valid point, and I agree to some extent. However, when you consider...", options: ["You raise a valid point, and I agree to some extent. However, when you consider...", 'But.', 'However.', 'No but.'] },
        { prompt: 'You want to introduce a counterargument. You say:', answer: "That may well be true, but there's another side to this. What about the fact that...?", options: ["That may well be true, but there's another side to this. What about the fact that...?", 'Other side.', 'But also.', 'What about?'] },
        { prompt: 'Someone makes an emotional argument. You steer back to facts:', answer: "I understand the emotional weight of this issue, but if we look at the data...", options: ["I understand the emotional weight of this issue, but if we look at the data...", 'Facts only.', 'No emotions.', 'Data shows.'] },
        { prompt: 'You want to summarise your position. You say:', answer: "So essentially, what I'm arguing is that... for three main reasons.", options: ["So essentially, what I'm arguing is that... for three main reasons.", 'I think.', 'My opinion.', 'So.'] },
        { prompt: 'You want to acknowledge you\'ve changed your mind slightly. You say:', answer: "Actually, you've made me reconsider. I still think... but I accept that...", options: ["Actually, you've made me reconsider. I still think... but I accept that...", 'OK you win.', 'Maybe.', 'Changed mind.'] },
      ],
    },
    'hypothetical-situations': {
      type: 'discourse-completion', instruction: 'Choose the best response about hypothetical situations.',
      items: [
        { prompt: '"What would you do if you won the lottery?"', answer: "If I won the lottery, I'd probably invest most of it, but I'd definitely travel around South America first.", options: ["If I won the lottery, I'd probably invest most of it, but I'd definitely travel around South America first.", 'Buy things.', 'I would be happy.', 'Money.'] },
        { prompt: '"What would have happened if you hadn\'t moved to this city?"', answer: "I suppose I'd still be working at my old job. I doubt I'd have met my partner either.", options: ["I suppose I'd still be working at my old job. I doubt I'd have met my partner either.", 'Different.', "I don't know.", 'Old city.'] },
        { prompt: 'You want to speculate about the future. You say:', answer: "Supposing AI replaces most jobs, what do you think people would do with their time?", options: ["Supposing AI replaces most jobs, what do you think people would do with their time?", 'AI future.', 'No jobs.', 'What if?'] },
        { prompt: 'Someone proposes an unrealistic plan. You respond:', answer: "In theory that sounds great, but in practice I think we'd run into a few problems.", options: ["In theory that sounds great, but in practice I think we'd run into a few problems.", 'Not possible.', 'No.', 'Problems.'] },
        { prompt: 'You want to express a regret about the past. You say:', answer: "Looking back, I wish I'd taken that opportunity. Things might have turned out differently.", options: ["Looking back, I wish I'd taken that opportunity. Things might have turned out differently.", 'I regret.', 'Bad choice.', 'If only.'] },
        { prompt: 'Someone asks: "If you could have any superpower, what would it be?"', answer: "I'd choose teleportation, without a doubt. Imagine never having to deal with commuting again!", options: ["I'd choose teleportation, without a doubt. Imagine never having to deal with commuting again!", 'Flying.', 'Superpower.', 'I want power.'] },
      ],
    },
    'persuading': {
      type: 'discourse-completion', instruction: 'Choose the most persuasive response.',
      items: [
        { prompt: 'You\'re trying to convince your team to adopt a new tool. You say:', answer: "I know change is always a bit daunting, but this tool would save us at least three hours a week. Can I show you a quick demo?", options: ["I know change is always a bit daunting, but this tool would save us at least three hours a week. Can I show you a quick demo?", 'Use new tool.', 'It\'s better.', 'Change now.'] },
        { prompt: 'Someone is reluctant to try something new. You encourage them:', answer: "I completely understand your hesitation, but what if we tried it for a week and then reviewed? No commitment.", options: ["I completely understand your hesitation, but what if we tried it for a week and then reviewed? No commitment.", 'Try it.', 'Just do it.', 'Why not?'] },
        { prompt: 'You want to appeal to someone\'s self-interest. You say:', answer: "Think about what this could mean for your career development. It would really strengthen your portfolio.", options: ["Think about what this could mean for your career development. It would really strengthen your portfolio.", 'Good for you.', 'Career.', 'Think about it.'] },
        { prompt: 'You want to use social proof to persuade. You say:', answer: "Several other departments have already adopted this approach, and the feedback has been overwhelmingly positive.", options: ["Several other departments have already adopted this approach, and the feedback has been overwhelmingly positive.", 'Others do it.', 'Everyone agrees.', 'Popular.'] },
        { prompt: 'Someone raises an objection. You address it:', answer: "That's a fair concern. Here's how we could address it...", options: ["That's a fair concern. Here's how we could address it...", 'No problem.', "Don't worry.", 'It\'s fine.'] },
        { prompt: 'You want to close with a call to action. You say:', answer: "So, shall we give it a go? I can set everything up by Friday.", options: ["So, shall we give it a go? I can set everything up by Friday.", 'Do it.', 'Yes?', 'Start.'] },
      ],
    },
    'formal-meetings': {
      type: 'discourse-completion', instruction: 'Choose the best response in a formal meeting.',
      items: [
        { prompt: 'You want to open a meeting. You say:', answer: "Right, shall we get started? The main item on the agenda today is...", options: ["Right, shall we get started? The main item on the agenda today is...", 'Start.', 'Meeting now.', 'Hello everyone.'] },
        { prompt: 'You want to bring someone into the discussion. You say:', answer: "I'd be interested to hear your perspective on this, Sarah. What are your thoughts?", options: ["I'd be interested to hear your perspective on this, Sarah. What are your thoughts?", 'Sarah, speak.', 'Your turn.', 'Sarah?'] },
        { prompt: 'You need to interrupt politely. You say:', answer: "Sorry to interrupt, but I think there's an important point we should consider before we move on.", options: ["Sorry to interrupt, but I think there's an important point we should consider before we move on.", 'Wait.', 'Stop.', 'I want to say something.'] },
        { prompt: 'You want to summarise a decision. You say:', answer: "So, if I understand correctly, we've agreed to... Is everyone happy with that?", options: ["So, if I understand correctly, we've agreed to... Is everyone happy with that?", 'Agreed.', 'Done.', 'OK.'] },
        { prompt: 'You want to table an item for the next meeting. You say:', answer: "I think we've covered a lot of ground on this. Shall we park it for now and come back to it next time?", options: ["I think we've covered a lot of ground on this. Shall we park it for now and come back to it next time?", 'Next time.', 'Later.', 'Stop.'] },
        { prompt: 'You want to close the meeting. You say:', answer: "I think that covers everything. Thank you all for your time. I'll circulate the minutes by end of day.", options: ["I think that covers everything. Thank you all for your time. I'll circulate the minutes by end of day.", 'Meeting over.', 'Done.', 'Bye.'] },
      ],
    },
    'negotiation-basic': {
      type: 'discourse-completion', instruction: 'Choose the best negotiation response.',
      items: [
        { prompt: 'You want to open a negotiation. You say:', answer: "I'd like to discuss the terms. I think there's room for us to find a solution that works for both sides.", options: ["I'd like to discuss the terms. I think there's room for us to find a solution that works for both sides.", 'I want more.', 'Better deal.', 'Negotiate.'] },
        { prompt: 'The other side makes an offer you can\'t accept. You say:', answer: "I appreciate the offer, but unfortunately that doesn't quite work for us. Would you be open to...?", options: ["I appreciate the offer, but unfortunately that doesn't quite work for us. Would you be open to...?", 'No.', 'Too low.', 'More.'] },
        { prompt: 'You want to propose a compromise. You say:', answer: "What if we met in the middle? We could agree on... which would give both sides what they need.", options: ["What if we met in the middle? We could agree on... which would give both sides what they need.", 'Half.', 'Compromise.', 'Split it.'] },
        { prompt: 'You need time to consider an offer. You say:', answer: "That's an interesting proposal. Would you mind if I took some time to discuss it with my team?", options: ["That's an interesting proposal. Would you mind if I took some time to discuss it with my team?", 'I think about it.', 'Wait.', 'Later.'] },
        { prompt: 'You want to reach final agreement. You say:', answer: "I think we're very close to an agreement. Shall we confirm the key points?", options: ["I think we're very close to an agreement. Shall we confirm the key points?", 'Deal.', 'Agreed.', 'Done.'] },
        { prompt: 'You want to express that a term is non-negotiable. You say:', answer: "I'm afraid that's something we really can't be flexible on. However, we could offer...", options: ["I'm afraid that's something we really can't be flexible on. However, we could offer...", 'No change.', 'Final.', "Can't."] },
      ],
    },
    'softening-language': {
      type: 'discourse-completion', instruction: 'Choose the softer, more diplomatic version.',
      items: [
        { prompt: 'Instead of "You\'re wrong," you say:', answer: "I'm not sure I'd agree with that interpretation.", options: ["I'm not sure I'd agree with that interpretation.", "You're wrong.", 'Wrong.', 'No.'] },
        { prompt: 'Instead of "That\'s a bad idea," you say:', answer: "I can see the logic, but I wonder if there might be a more effective approach.", options: ["I can see the logic, but I wonder if there might be a more effective approach.", 'Bad idea.', "That won't work.", 'No good.'] },
        { prompt: 'Instead of "You need to finish this today," you say:', answer: "It would be really helpful if we could get this wrapped up by end of play today.", options: ["It would be really helpful if we could get this wrapped up by end of play today.", 'Finish today.', 'Do it now.', 'Deadline today.'] },
        { prompt: 'Instead of "I don\'t understand," you say:', answer: "I'm not sure I follow. Could you run through that again?", options: ["I'm not sure I follow. Could you run through that again?", "I don't understand.", 'What?', 'Confusing.'] },
        { prompt: 'Instead of "That report was poorly written," you say:', answer: "There are a few areas in the report that could do with some tightening up.", options: ["There are a few areas in the report that could do with some tightening up.", 'Bad report.', 'Poorly written.', 'Fix it.'] },
        { prompt: 'Instead of "No, I can\'t do that," you say:', answer: "I'm afraid that might be a bit tricky, but let me see what I can do.", options: ["I'm afraid that might be a bit tricky, but let me see what I can do.", "I can't.", 'No.', 'Impossible.'] },
      ],
    },
    'indirect-requests': {
      type: 'discourse-completion', instruction: 'Choose the most appropriately indirect request.',
      items: [
        { prompt: 'You want a colleague to proofread your email. You say:', answer: "I don't suppose you'd have a moment to cast your eye over this email before I send it?", options: ["I don't suppose you'd have a moment to cast your eye over this email before I send it?", 'Read my email.', 'Proofread this.', 'Check email.'] },
        { prompt: 'You want your flatmate to do the washing up. You say:', answer: "I was wondering if you might get a chance to do the dishes at some point?", options: ["I was wondering if you might get a chance to do the dishes at some point?", 'Do the dishes.', 'Wash up.', 'Your turn.'] },
        { prompt: 'It\'s cold and the window is open. You say:', answer: "It's a bit chilly in here, isn't it?", options: ["It's a bit chilly in here, isn't it?", 'Close the window.', 'Cold!', 'Window.'] },
        { prompt: 'You want someone to drive more slowly. You say:', answer: "The road's a bit slippery, isn't it?", options: ["The road's a bit slippery, isn't it?", 'Slow down!', 'Drive slower.', 'Too fast.'] },
        { prompt: 'You want your manager to approve your holiday request. You say:', answer: "I was hoping to take a few days off in March, if that would work with the team schedule?", options: ["I was hoping to take a few days off in March, if that would work with the team schedule?", 'I want holiday.', 'Give me days off.', 'March off.'] },
        { prompt: 'You want someone to turn down the music. You say:', answer: "That's quite a lively playlist! My ears are just a little sensitive today.", options: ["That's quite a lively playlist! My ears are just a little sensitive today.", 'Too loud.', 'Turn it down.', 'Quiet please.'] },
      ],
    },
    'turn-taking': {
      type: 'discourse-completion', instruction: 'Choose the best turn-taking strategy.',
      items: [
        { prompt: 'You want to take a turn in a group discussion. You say:', answer: "If I could just come in here — I think there's another angle worth considering.", options: ["If I could just come in here — I think there's another angle worth considering.", 'My turn.', 'Listen to me.', 'I want to speak.'] },
        { prompt: 'You want to yield the floor to someone else. You say:', answer: "But I'd be curious to hear what you think, James.", options: ["But I'd be curious to hear what you think, James.", 'Your turn.', 'James speak.', 'You go.'] },
        { prompt: 'Someone keeps interrupting you. You say:', answer: "Could I just finish this point? Then I'd love to hear your thoughts.", options: ["Could I just finish this point? Then I'd love to hear your thoughts.", 'Stop interrupting.', "Don't interrupt.", 'Let me finish.'] },
        { prompt: 'You want to return to a previous topic. You say:', answer: "If I could just circle back to what Sarah said earlier about...", options: ["If I could just circle back to what Sarah said earlier about...", 'Back to Sarah.', 'Before.', 'Earlier.'] },
        { prompt: 'You notice someone hasn\'t spoken. You say:', answer: "We haven't heard from you yet, Maria. What's your take on this?", options: ["We haven't heard from you yet, Maria. What's your take on this?", 'Maria talk.', 'Maria?', 'Your opinion Maria.'] },
        { prompt: 'You want to signal you\'re about to wrap up your point. You say:', answer: "Just one final thought on this, and then I'll hand it back...", options: ["Just one final thought on this, and then I'll hand it back...", 'Last thing.', 'Almost done.', 'Finally.'] },
      ],
    },
    'presenting-information': {
      type: 'discourse-completion', instruction: 'Choose the best presentation language.',
      items: [
        { prompt: 'You want to introduce a presentation topic. You say:', answer: "Today I'd like to talk about three key trends that are shaping our industry.", options: ["Today I'd like to talk about three key trends that are shaping our industry.", 'I will talk.', 'My topic.', 'Today I present.'] },
        { prompt: 'You want to transition to the next section. You say:', answer: "So that covers the first point. Moving on, I'd like to turn our attention to...", options: ["So that covers the first point. Moving on, I'd like to turn our attention to...", 'Next.', 'Now point two.', 'Also.'] },
        { prompt: 'You want to refer to a graph. You say:', answer: "As you can see from this chart, there's been a steady increase since 2020.", options: ["As you can see from this chart, there's been a steady increase since 2020.", 'Chart goes up.', 'Look here.', 'Graph.'] },
        { prompt: 'You want to handle a question during your talk. You say:', answer: "That's a great question. I'll address that in more detail in a moment, if that's OK?", options: ["That's a great question. I'll address that in more detail in a moment, if that's OK?", 'Later.', 'Wait.', 'I answer later.'] },
        { prompt: 'You want to conclude your presentation. You say:', answer: "To sum up, the three key takeaways are... I'm happy to take any questions.", options: ["To sum up, the three key takeaways are... I'm happy to take any questions.", 'Finished.', 'Done.', 'The end.'] },
        { prompt: 'You want to emphasise a key point. You say:', answer: "And this is really the crucial point — without this, none of the other strategies will work.", options: ["And this is really the crucial point — without this, none of the other strategies will work.", 'Important!', 'Listen!', 'Key point.'] },
      ],
    },
  },
  'c1': {
    'academic-discussion': {
      type: 'discourse-completion', instruction: 'Choose the best response in an academic discussion.',
      items: [
        { prompt: 'You want to build on a classmate\'s argument. You say:', answer: "To extend that point, I think what's particularly significant is the way this intersects with...", options: ["To extend that point, I think what's particularly significant is the way this intersects with...", 'Also.', 'Same thing.', 'I agree and also.'] },
        { prompt: 'You want to question an assumption in a reading. You say:', answer: "I'd push back on the author's premise here. They seem to take for granted that...", options: ["I'd push back on the author's premise here. They seem to take for granted that...", 'Wrong.', 'I disagree.', "Author doesn't know."] },
        { prompt: 'You want to introduce evidence from a different field. You say:', answer: "Interestingly, research in cognitive science offers a somewhat different perspective on this...", options: ["Interestingly, research in cognitive science offers a somewhat different perspective on this...", 'Science says.', 'Other research.', 'Also in science.'] },
        { prompt: 'You want to synthesise two opposing views. You say:', answer: "I think there's a way to reconcile these two positions if we consider...", options: ["I think there's a way to reconcile these two positions if we consider...", 'Both right.', 'Middle ground.', 'Compromise.'] },
        { prompt: 'You want to acknowledge complexity. You say:', answer: "I think this is more nuanced than a simple either/or. There are several factors at play here.", options: ["I think this is more nuanced than a simple either/or. There are several factors at play here.", 'Complicated.', 'Not simple.', 'Many factors.'] },
        { prompt: 'You want to flag a limitation in the research. You say:', answer: "One thing that concerns me about this study is the relatively small sample size, which limits the generalisability.", options: ["One thing that concerns me about this study is the relatively small sample size, which limits the generalisability.", 'Small sample.', 'Not enough data.', 'Bad study.'] },
      ],
    },
    'critical-response': {
      type: 'discourse-completion', instruction: 'Choose the best critical response.',
      items: [
        { prompt: 'You want to critique a colleague\'s proposal constructively. You say:', answer: "The core idea has real merit. My concern is more with the implementation — specifically, how we'd handle...", options: ["The core idea has real merit. My concern is more with the implementation — specifically, how we'd handle...", 'Good idea bad plan.', 'Won\'t work.', 'Problems.'] },
        { prompt: 'You want to identify a logical gap in an argument. You say:', answer: "There seems to be an unexamined assumption here — namely, that correlation implies causation in this case.", options: ["There seems to be an unexamined assumption here — namely, that correlation implies causation in this case.", 'Logic error.', 'Not logical.', 'Wrong assumption.'] },
        { prompt: 'You want to offer an alternative interpretation. You say:', answer: "Could we not read this differently? It seems to me that the evidence equally supports...", options: ["Could we not read this differently? It seems to me that the evidence equally supports...", 'Other meaning.', 'Maybe different.', 'I think other thing.'] },
        { prompt: 'You want to praise before critiquing. You say:', answer: "I think the analysis of X is really strong. Where I'd want more development is in the connection to Y.", options: ["I think the analysis of X is really strong. Where I'd want more development is in the connection to Y.", 'Good but.', 'Nice but fix.', 'Part good part bad.'] },
        { prompt: 'You want to question methodology. You say:', answer: "I wonder whether a qualitative approach might have yielded richer data for this particular research question.", options: ["I wonder whether a qualitative approach might have yielded richer data for this particular research question.", 'Wrong method.', 'Should be qualitative.', 'Bad methodology.'] },
        { prompt: 'You want to request clarification on a complex claim. You say:', answer: "Could you unpack that a bit? I'm not sure I fully grasp the mechanism you're proposing.", options: ["Could you unpack that a bit? I'm not sure I fully grasp the mechanism you're proposing.", "I don't understand.", 'Explain.', 'What do you mean?'] },
      ],
    },
    'seminar-participation': {
      type: 'discourse-completion', instruction: 'Choose the best seminar contribution.',
      items: [
        { prompt: 'You want to open discussion on a reading. You say:', answer: "What struck me most about this text was... I'd be curious to know if others had the same reaction.", options: ["What struck me most about this text was... I'd be curious to know if others had the same reaction.", 'I read it.', 'The book says.', 'What do you think?'] },
        { prompt: 'You want to respectfully challenge the professor. You say:', answer: "I wonder if there's another way to frame this. Could it be that...?", options: ["I wonder if there's another way to frame this. Could it be that...?", "You're wrong.", 'I think differently.', 'No.'] },
        { prompt: 'You want to connect theory to practice. You say:', answer: "This reminds me of a case study where... which seems to either support or complicate this theory.", options: ["This reminds me of a case study where... which seems to either support or complicate this theory.", 'In real life.', 'Like my example.', 'Theory and practice.'] },
        { prompt: 'You want to admit you don\'t fully understand. You say:', answer: "I'm still grappling with this concept. Could someone help me think through how X relates to Y?", options: ["I'm still grappling with this concept. Could someone help me think through how X relates to Y?", "I don't get it.", 'Confused.', 'Help me.'] },
        { prompt: 'You want to redirect the conversation. You say:', answer: "This is a fascinating thread, but I think we might be drifting from the central question. Can we come back to...?", options: ["This is a fascinating thread, but I think we might be drifting from the central question. Can we come back to...?", 'Off topic.', 'Back to topic.', 'Wrong discussion.'] },
        { prompt: 'You want to wrap up a point concisely. You say:', answer: "In short, I think the key tension is between X and Y, and this text doesn't fully resolve it.", options: ["In short, I think the key tension is between X and Y, and this text doesn't fully resolve it.", 'X and Y problem.', 'Not resolved.', 'Basically.'] },
      ],
    },
    'diplomatic-language': {
      type: 'discourse-completion', instruction: 'Choose the most diplomatic response.',
      items: [
        { prompt: 'You need to reject a proposal without offending. You say:', answer: "I can see the thinking behind this, and I appreciate the effort. I think the challenge is that it may not align with our current strategic priorities.", options: ["I can see the thinking behind this, and I appreciate the effort. I think the challenge is that it may not align with our current strategic priorities.", 'No.', 'Bad proposal.', "We can't do this."] },
        { prompt: 'Someone is underperforming. You address it:', answer: "I've noticed things seem a bit more challenging recently. Is there anything I can do to support you?", options: ["I've noticed things seem a bit more challenging recently. Is there anything I can do to support you?", 'Do better.', 'Work harder.', "You're underperforming."] },
        { prompt: 'Two colleagues are in conflict. You mediate:', answer: "I think you both make valid points. Let's see if we can find some common ground here.", options: ["I think you both make valid points. Let's see if we can find some common ground here.", 'Stop fighting.', 'Both wrong.', 'Calm down.'] },
        { prompt: 'You need to deliver bad news. You say:', answer: "I'm afraid the news isn't what we were hoping for, but I think there's still a path forward if we...", options: ["I'm afraid the news isn't what we were hoping for, but I think there's still a path forward if we...", 'Bad news.', 'Failed.', "Didn't work."] },
        { prompt: 'You want to express doubt without being negative. You say:', answer: "I think there may be some aspects we haven't fully thought through yet.", options: ["I think there may be some aspects we haven't fully thought through yet.", 'Bad plan.', 'Not ready.', 'Problems.'] },
        { prompt: 'You want to suggest someone is wrong without saying so directly. You say:', answer: "That's an interesting perspective. I suppose one could also argue that...", options: ["That's an interesting perspective. I suppose one could also argue that...", "You're wrong.", 'Actually.', 'No.'] },
      ],
    },
    'mediation': {
      type: 'discourse-completion', instruction: 'Choose the best mediation response.',
      items: [
        { prompt: 'You want to establish ground rules. You say:', answer: "Before we begin, let's agree to hear each other out fully before responding. Does that work for both of you?", options: ["Before we begin, let's agree to hear each other out fully before responding. Does that work for both of you?", 'Rules.', 'No interrupting.', 'Be nice.'] },
        { prompt: 'You want to reframe a hostile comment. You say:', answer: "What I hear you saying is that you feel frustrated because your concerns haven't been fully addressed. Is that right?", options: ["What I hear you saying is that you feel frustrated because your concerns haven't been fully addressed. Is that right?", "You're angry.", 'Calm down.', 'Don\'t be rude.'] },
        { prompt: 'You want to identify shared interests. You say:', answer: "It sounds like you both want the project to succeed — you just have different views on the best approach.", options: ["It sounds like you both want the project to succeed — you just have different views on the best approach.", 'Same goal.', 'Both want success.', 'Agree on outcome.'] },
        { prompt: 'You want to move towards a resolution. You say:', answer: "What would a workable solution look like for each of you?", options: ["What would a workable solution look like for each of you?", 'Fix it.', 'Solution?', 'What do you want?'] },
        { prompt: 'Things are getting heated. You intervene:', answer: "Let's take a step back for a moment. I can see this is an important issue for both of you.", options: ["Let's take a step back for a moment. I can see this is an important issue for both of you.", 'Stop.', 'Calm down.', 'Break time.'] },
        { prompt: 'You want to summarise the agreed outcome. You say:', answer: "So we've agreed that... Shall I put this in writing so we all have a record?", options: ["So we've agreed that... Shall I put this in writing so we all have a record?", 'Done.', 'Agreed.', 'Written down.'] },
      ],
    },
    'chairing-meetings': {
      type: 'discourse-completion', instruction: 'Choose the best response for chairing or facilitating a meeting.',
      items: [
        { prompt: 'You need to open a meeting and set the agenda. You say:', answer: "Thank you all for coming. Today we have three items to cover. Shall we begin with the budget update?", options: ["Thank you all for coming. Today we have three items to cover. Shall we begin with the budget update?", 'Let\'s start.', 'Meeting now.', 'Hello everyone.'] },
        { prompt: 'A discussion is going off-topic. You intervene:', answer: "That\'s an interesting point — could we perhaps park that for now and return to the main agenda item?", options: ["That\'s an interesting point — could we perhaps park that for now and return to the main agenda item?", 'Stop talking about that.', 'Off topic.', 'Wrong subject.'] },
        { prompt: 'You want to bring in a quieter colleague. You say:', answer: "Alex, I know you have experience in this area. Would you like to share your perspective?", options: ["Alex, I know you have experience in this area. Would you like to share your perspective?", 'Alex, talk.', 'Alex?', 'What do you think, Alex?'] },
        { prompt: 'Two people are talking over each other. You say:', answer: "Let\'s hear from one person at a time — Sarah, would you like to finish your point first?", options: ["Let\'s hear from one person at a time — Sarah, would you like to finish your point first?", 'Be quiet.', 'One at a time.', 'Stop interrupting.'] },
        { prompt: 'You need to summarise a decision and move on. You say:', answer: "So we\'ve agreed to proceed with option B. I\'ll note that as an action item. Shall we move to the next point?", options: ["So we\'ve agreed to proceed with option B. I\'ll note that as an action item. Shall we move to the next point?", 'Next.', 'Option B. Done.', 'Moving on.'] },
        { prompt: 'You need to close the meeting. You say:', answer: "Thank you all for your contributions. To recap, we have three action items. I\'ll circulate the minutes by end of day.", options: ["Thank you all for your contributions. To recap, we have three action items. I\'ll circulate the minutes by end of day.", 'Meeting over.', 'Bye.', 'Done for today.'] },
      ],
    },
    'hedging-qualifying': {
      type: 'discourse-completion', instruction: 'Choose the best hedged or qualified statement.',
      items: [
        { prompt: 'Instead of "This will work," you say:', answer: "Based on the data we have, this approach seems likely to be effective.", options: ["Based on the data we have, this approach seems likely to be effective.", 'This will work.', 'Definitely works.', 'I promise.'] },
        { prompt: 'Instead of "You should do X," you say:', answer: "It might be worth considering X as one possible approach.", options: ["It might be worth considering X as one possible approach.", 'Do X.', 'You must.', 'X is best.'] },
        { prompt: 'Instead of "This proves that...," you say:', answer: "This would tend to suggest that... although further evidence would be needed.", options: ["This would tend to suggest that... although further evidence would be needed.", 'This proves.', 'Definitely.', 'Clearly shows.'] },
        { prompt: 'You want to qualify a generalisation. You say:', answer: "Generally speaking, this tends to be the case, though there are notable exceptions.", options: ["Generally speaking, this tends to be the case, though there are notable exceptions.", 'Always true.', 'This is the rule.', 'No exceptions.'] },
        { prompt: 'You want to express uncertainty about a claim. You say:', answer: "I'm not entirely sure, but my understanding is that...", options: ["I'm not entirely sure, but my understanding is that...", 'I know that.', 'Definitely.', 'Obviously.'] },
        { prompt: 'You want to distance yourself from a strong claim. You say:', answer: "Some might argue that... although I'd want to see more evidence before committing to that position.", options: ["Some might argue that... although I'd want to see more evidence before committing to that position.", 'I think.', 'I believe.', 'Obviously.'] },
      ],
    },
    'irony-understatement': {
      type: 'discourse-completion', instruction: 'Choose the response that uses irony or understatement.',
      items: [
        { prompt: 'It\'s pouring rain. You step outside and say:', answer: "Lovely weather we're having.", options: ["Lovely weather we're having.", 'Bad rain.', 'Very wet.', "I don't like rain."] },
        { prompt: 'Someone shows you an enormous project deadline. You say:', answer: "Well, that should keep us busy for a while.", options: ["Well, that should keep us busy for a while.", 'Too much work!', 'Impossible.', 'Very big project.'] },
        { prompt: 'After a terrible presentation, a colleague asks how it went. You say:', answer: "Let's just say there's room for improvement.", options: ["Let's just say there's room for improvement.", 'It was terrible.', 'Bad.', 'Awful.'] },
        { prompt: 'You win a major award. Someone congratulates you. You say:', answer: "Not bad for a Tuesday, I suppose.", options: ["Not bad for a Tuesday, I suppose.", 'I am the best!', 'Thank you so much!', 'I am amazing.'] },
        { prompt: 'Traffic made you 2 hours late. You arrive and say:', answer: "Slight delay on the way in.", options: ["Slight delay on the way in.", 'Traffic was terrible!', "I'm very late!", 'The road was blocked!'] },
        { prompt: 'Someone asks about your very difficult exam. You say:', answer: "It wasn't exactly a walk in the park.", options: ["It wasn't exactly a walk in the park.", 'Very hard!', 'I failed.', 'Terrible exam.'] },
      ],
    },
    'register-shifting': {
      type: 'discourse-completion', instruction: 'Choose the version that matches the required register.',
      items: [
        { prompt: 'Formal email to a client: request a meeting. You write:', answer: "I would be grateful if we could arrange a meeting at your earliest convenience.", options: ["I would be grateful if we could arrange a meeting at your earliest convenience.", 'Can we meet?', 'Let\'s grab a coffee.', 'Meeting?'] },
        { prompt: 'Casual text to a friend: suggest meeting up. You write:', answer: "Fancy grabbing a coffee later? I'm free from 3ish.", options: ["Fancy grabbing a coffee later? I'm free from 3ish.", 'I would like to request a meeting.', 'Shall we convene?', 'I propose we meet.'] },
        { prompt: 'Academic writing: express disagreement with a scholar. You write:', answer: "While Smith's analysis provides valuable insights, there are grounds to question...", options: ["While Smith's analysis provides valuable insights, there are grounds to question...", 'Smith is wrong.', "I don't agree with Smith.", 'Smith made mistakes.'] },
        { prompt: 'Casual conversation: express the same disagreement. You say:', answer: "I'm not sure Smith's got it right there, to be honest.", options: ["I'm not sure Smith's got it right there, to be honest.", 'There are grounds to question.', 'I reject Smith.', "Smith's analysis is flawed."] },
        { prompt: 'Formal complaint: report a service issue. You write:', answer: "I am writing to express my dissatisfaction with the level of service received on...", options: ["I am writing to express my dissatisfaction with the level of service received on...", 'Your service was rubbish.', 'Very bad service.', 'I am angry.'] },
        { prompt: 'Telling a friend about the same issue. You say:', answer: "Honestly, the service was absolutely dreadful. I couldn't believe it.", options: ["Honestly, the service was absolutely dreadful. I couldn't believe it.", 'I am writing to express dissatisfaction.', 'The service was suboptimal.', 'I wish to formally complain.'] },
      ],
    },
  },
  'c2': {
    'persuasive-rhetoric': {
      type: 'discourse-completion', instruction: 'Choose the most rhetorically effective response.',
      items: [
        { prompt: 'You want to open a speech with a rhetorical question. You say:', answer: "How many of us have sat in a meeting thinking: there has to be a better way?", options: ["How many of us have sat in a meeting thinking: there has to be a better way?", 'Meetings are bad.', 'I want to talk about meetings.', 'Today I discuss meetings.'] },
        { prompt: 'You want to use the rule of three for emphasis. You say:', answer: "This approach is simpler, faster, and more cost-effective than anything we've tried before.", options: ["This approach is simpler, faster, and more cost-effective than anything we've tried before.", 'This approach is good.', 'Better approach.', 'Good idea.'] },
        { prompt: 'You want to use an analogy to make a complex point. You say:', answer: "Implementing this policy without proper training is like giving someone a car without teaching them to drive.", options: ["Implementing this policy without proper training is like giving someone a car without teaching them to drive.", 'Training important.', 'Need training.', 'Bad without training.'] },
        { prompt: 'You want to use antithesis for impact. You say:', answer: "The question is not whether we can afford to invest in this — it's whether we can afford not to.", options: ["The question is not whether we can afford to invest in this — it's whether we can afford not to.", 'We must invest.', 'Investment important.', 'Spend money.'] },
        { prompt: 'You want to close a speech memorably. You say:', answer: "And so I leave you with this: the future doesn't happen to us — we shape it, starting now.", options: ["And so I leave you with this: the future doesn't happen to us — we shape it, starting now.", 'Thank you.', 'The end.', "That's all."] },
        { prompt: 'You want to appeal to shared values. You say:', answer: "I know we all came into this profession because we believe in making a difference. Let's not lose sight of that.", options: ["I know we all came into this profession because we believe in making a difference. Let's not lose sight of that.", 'We are good people.', 'Remember why we work.', 'Important work.'] },
      ],
    },
    'extended-monologue': {
      type: 'discourse-completion', instruction: 'Choose the best discourse management strategy.',
      items: [
        { prompt: 'You\'re telling a long story and want to maintain coherence. You say:', answer: "Now, the reason I mention this will become clear in a moment. Bear with me.", options: ["Now, the reason I mention this will become clear in a moment. Bear with me.", 'Wait.', 'Listen.', 'Important.'] },
        { prompt: 'You realise you\'ve gone on a tangent. You say:', answer: "But I digress. The point I was trying to make was...", options: ["But I digress. The point I was trying to make was...", 'Anyway.', 'Back to topic.', 'So.'] },
        { prompt: 'You want to foreshadow something dramatic. You say:', answer: "And this is where things took an unexpected turn.", options: ["And this is where things took an unexpected turn.", 'Then something happened.', 'Surprise.', 'Then.'] },
        { prompt: 'You want to signal the climax of your story. You say:', answer: "So there I was, standing in the middle of the boardroom, and that's when I realised...", options: ["So there I was, standing in the middle of the boardroom, and that's when I realised...", 'Then I knew.', 'Important part.', 'Climax.'] },
        { prompt: 'You want to check your audience is still engaged. You say:', answer: "Am I making sense so far? This next part is the key.", options: ["Am I making sense so far? This next part is the key.", 'You listening?', 'Understand?', 'Follow me?'] },
        { prompt: 'You want to land the punchline of an anecdote. You say:', answer: "And she just looked at me and said — completely deadpan — 'That's not a koala.'", options: ["And she just looked at me and said — completely deadpan — 'That's not a koala.'", 'Funny ending.', 'She said something funny.', 'Then joke.'] },
      ],
    },
    'spontaneous-debate': {
      type: 'discourse-completion', instruction: 'Choose the best spontaneous debate response.',
      items: [
        { prompt: 'You\'re hit with an argument you hadn\'t anticipated. You say:', answer: "That's a perspective I hadn't fully considered. Let me think about that for a moment... I suppose my response would be...", options: ["That's a perspective I hadn't fully considered. Let me think about that for a moment... I suppose my response would be...", "I don't know.", 'Good point.', 'You win.'] },
        { prompt: 'Your opponent makes a factually incorrect claim. You say:', answer: "With respect, I think the figures actually tell a different story. If I recall correctly...", options: ["With respect, I think the figures actually tell a different story. If I recall correctly...", "That's wrong.", 'Incorrect.', 'Bad facts.'] },
        { prompt: 'You want to reframe the entire debate. You say:', answer: "I think we may be asking the wrong question here. Perhaps what we should really be considering is...", options: ["I think we may be asking the wrong question here. Perhaps what we should really be considering is...", 'Wrong question.', 'Different topic.', 'New question.'] },
        { prompt: 'Your opponent accuses you of contradicting yourself. You respond:', answer: "I understand why it might seem that way, but actually there's a crucial distinction between what I said earlier and what I'm saying now.", options: ["I understand why it might seem that way, but actually there's a crucial distinction between what I said earlier and what I'm saying now.", 'No contradiction.', "I didn't.", "You're wrong."] },
        { prompt: 'The debate is wrapping up. You make a final point:', answer: "If there's one thing I'd like the audience to take away, it's this: the stakes are simply too high for us to maintain the status quo.", options: ["If there's one thing I'd like the audience to take away, it's this: the stakes are simply too high for us to maintain the status quo.", 'In conclusion.', 'I win.', 'My point stands.'] },
        { prompt: 'Your opponent makes a genuinely good point. You respond with grace:', answer: "I have to concede that's a compelling argument. I think where we part ways is on the question of implementation.", options: ["I have to concede that's a compelling argument. I think where we part ways is on the question of implementation.", 'Good point but.', 'OK fine.', 'Maybe.'] },
      ],
    },
    'cultural-nuance': {
      type: 'discourse-completion', instruction: 'Choose the most culturally nuanced response.',
      items: [
        { prompt: 'A British person says "Not bad" about something. This typically means:', answer: "Quite good — British understatement often uses negatives to express positives.", options: ["Quite good — British understatement often uses negatives to express positives.", 'Mediocre.', 'Bad.', 'Neutral.'] },
        { prompt: 'An American colleague says "Let\'s do lunch!" after a meeting. This usually means:', answer: "A polite social gesture that may or may not result in an actual lunch — context-dependent.", options: ["A polite social gesture that may or may not result in an actual lunch — context-dependent.", 'A firm lunch invitation.', 'They are hungry.', 'An insult.'] },
        { prompt: 'In a Japanese business context, a potential partner says "That would be difficult." This likely means:', answer: "No — in many East Asian business cultures, indirect refusal is preferred over direct rejection.", options: ["No — in many East Asian business cultures, indirect refusal is preferred over direct rejection.", 'They need more time.', "It's challenging but possible.", 'They want help.'] },
        { prompt: 'You\'re navigating a cross-cultural misunderstanding. You say:', answer: "I think there might be a cultural difference in how we're approaching this. In my experience, the expectation tends to be...", options: ["I think there might be a cultural difference in how we're approaching this. In my experience, the expectation tends to be...", "You don't understand my culture.", 'Wrong way.', 'In my country...'] },
        { prompt: 'You want to ask about cultural norms without causing offence. You say:', answer: "I want to make sure I'm being respectful — is there anything I should be aware of regarding...?", options: ["I want to make sure I'm being respectful — is there anything I should be aware of regarding...?", 'What are your rules?', 'Is this OK in your culture?', 'Do you do things differently?'] },
        { prompt: 'A colleague from another culture uses a communication style very different from yours. You reflect:', answer: "I think we might have different communication styles. Would it help if we talked about how we each prefer to work?", options: ["I think we might have different communication styles. Would it help if we talked about how we each prefer to work?", "You're doing it wrong.", 'Speak normally.', 'Be more direct.'] },
      ],
    },
    'humour-wordplay': {
      type: 'discourse-completion', instruction: 'Identify or respond to the humour or wordplay.',
      items: [
        { prompt: '"I used to be a banker, but I lost interest." What type of humour is this?', answer: "A pun — 'interest' means both curiosity and financial return.", options: ["A pun — 'interest' means both curiosity and financial return.", 'Sarcasm.', 'Irony.', 'A joke about banking.'] },
        { prompt: '"Well, apart from that, Mrs. Lincoln, how was the play?" This is an example of:', answer: "Dark humour / understatement — making a devastatingly inappropriate inquiry to highlight absurdity.", options: ["Dark humour / understatement — making a devastatingly inappropriate inquiry to highlight absurdity.", 'A genuine question.', 'Sarcasm.', 'A theatre review.'] },
        { prompt: 'Someone says: "I\'m on a seafood diet. I see food and I eat it." You respond:', answer: "Ha! That's terrible. I love it.", options: ["Ha! That's terrible. I love it.", "I don't understand.", 'Not funny.', 'Good diet.'] },
        { prompt: 'A colleague makes a witty observation. You build on it:', answer: "And if we extend that logic, we'd also have to conclude that... which is almost too absurd to contemplate.", options: ["And if we extend that logic, we'd also have to conclude that... which is almost too absurd to contemplate.", 'Funny.', 'Ha ha.', 'Good one.'] },
        { prompt: '"Time flies like an arrow; fruit flies like a banana." This sentence works because:', answer: "It exploits syntactic ambiguity — 'flies' and 'like' function differently in each clause.", options: ["It exploits syntactic ambiguity — 'flies' and 'like' function differently in each clause.", "It's about insects.", "It doesn't make sense.", "It's a proverb."] },
        { prompt: 'You want to use self-deprecating humour to diffuse tension. You say:', answer: "Well, my track record with technology isn't exactly stellar — as everyone here can attest.", options: ["Well, my track record with technology isn't exactly stellar — as everyone here can attest.", 'I am bad at technology.', "I don't know computers.", 'Help me.'] },
      ],
    },
    'implicit-meaning': {
      type: 'discourse-completion', instruction: 'Identify the implicit meaning.',
      items: [
        { prompt: 'A manager says: "I think we need to be realistic about timelines." The implicit meaning is:', answer: "The current timeline is too ambitious and needs extending.", options: ["The current timeline is too ambitious and needs extending.", 'Timelines are fine.', 'Be more creative.', 'Work faster.'] },
        { prompt: 'A British person says: "That\'s a very brave decision." The implicit meaning is often:', answer: "They think it's a risky or foolish decision.", options: ["They think it's a risky or foolish decision.", "They admire your courage.", "They're impressed.", "They agree with you."] },
        { prompt: '"I\'ll bear that in mind" in a business context often means:', answer: "I've heard you but I'm unlikely to act on it.", options: ["I've heard you but I'm unlikely to act on it.", "I'll definitely do it.", "It's now my top priority.", "I'll write it down."] },
        { prompt: 'An email that begins "As per my previous email..." implies:', answer: "I already told you this and I'm frustrated that I need to repeat it.", options: ["I already told you this and I'm frustrated that I need to repeat it.", 'Just a friendly reminder.', 'Referencing context.', 'A formal opening.'] },
        { prompt: '"With the greatest respect..." before a statement usually means:', answer: "I'm about to disagree with you quite strongly.", options: ["I'm about to disagree with you quite strongly.", "I deeply respect you.", "I'm being very polite.", "I agree."] },
        { prompt: 'Someone says: "Interesting" with a particular intonation (flat, drawn out). This likely means:', answer: "They don't find it interesting at all, or they disagree but don't want to say so directly.", options: ["They don't find it interesting at all, or they disagree but don't want to say so directly.", "They're genuinely fascinated.", 'They want to know more.', "They're thinking deeply."] },
      ],
    },
    'style-shifting': {
      type: 'discourse-completion', instruction: 'Choose the response that demonstrates appropriate style shifting.',
      items: [
        { prompt: 'You\'re giving feedback to a junior colleague (supportive register):', answer: "You've made a really good start here. A few things to think about for the next draft...", options: ["You've made a really good start here. A few things to think about for the next draft...", 'This needs significant revision.', 'Rewrite this.', 'Not good enough.'] },
        { prompt: 'Same feedback, but in a peer review (direct register):', answer: "The argument in section two needs tightening. The evidence doesn't fully support the claim.", options: ["The argument in section two needs tightening. The evidence doesn't fully support the claim.", "You've made a good start.", 'This is interesting.', 'Love what you did here.'] },
        { prompt: 'Explaining a concept to an expert (technical register):', answer: "The asymmetric distribution suggests a non-parametric approach would yield more robust results.", options: ["The asymmetric distribution suggests a non-parametric approach would yield more robust results.", "The numbers aren't even.", 'Use a different method.', "It's complicated."] },
        { prompt: 'Explaining the same concept to a non-expert (accessible register):', answer: "Basically, the data is a bit lopsided, so we need to use a different type of analysis that handles that better.", options: ["Basically, the data is a bit lopsided, so we need to use a different type of analysis that handles that better.", 'The asymmetric distribution requires non-parametric analysis.', 'Use different statistics.', "It's hard to explain."] },
        { prompt: 'A formal resignation letter:', answer: "After careful consideration, I have decided to tender my resignation, effective...", options: ["After careful consideration, I have decided to tender my resignation, effective...", "I'm leaving.", 'I quit.', "Don't want to work here anymore."] },
        { prompt: 'Telling a close friend the same news:', answer: "I've decided to leave the job. I've been thinking about it for a while and it's time for a change.", options: ["I've decided to leave the job. I've been thinking about it for a while and it's time for a change.", 'I have decided to tender my resignation.', 'After careful consideration.', 'I hereby inform you.'] },
      ],
    },
    'conflict-resolution-advanced': {
      type: 'discourse-completion', instruction: 'Choose the most effective conflict resolution approach.',
      items: [
        { prompt: 'A team member publicly criticises your decision. You respond:', answer: "I appreciate your candour. Let's discuss the specifics — you may be seeing something I missed.", options: ["I appreciate your candour. Let's discuss the specifics — you may be seeing something I missed.", "You're undermining me.", 'Not here.', "That's inappropriate."] },
        { prompt: 'Two team members refuse to work together. You say:', answer: "I understand there are some tensions. Can we start by identifying what you both need in order to work together effectively?", options: ["I understand there are some tensions. Can we start by identifying what you both need in order to work together effectively?", 'Work together.', 'Be professional.', 'Stop fighting.'] },
        { prompt: 'You need to apologise for a significant mistake. You say:', answer: "I take full responsibility for this. Here's what happened, here's what I've learned, and here's what I'm doing to make sure it doesn't happen again.", options: ["I take full responsibility for this. Here's what happened, here's what I've learned, and here's what I'm doing to make sure it doesn't happen again.", 'Sorry.', 'My bad.', 'It wasn\'t entirely my fault.'] },
        { prompt: 'A stakeholder is angry about a delay. You say:', answer: "I completely understand your frustration, and you have every right to be disappointed. Let me walk you through where we are and the steps we're taking to get back on track.", options: ["I completely understand your frustration, and you have every right to be disappointed. Let me walk you through where we are and the steps we're taking to get back on track.", "It's not our fault.", 'Delays happen.', 'Be patient.'] },
        { prompt: 'You need to say no to a powerful person. You say:', answer: "I've given this a great deal of thought, and while I understand the appeal, I don't believe this is the right course of action because...", options: ["I've given this a great deal of thought, and while I understand the appeal, I don't believe this is the right course of action because...", 'No.', "I can't do that.", "That won't work."] },
        { prompt: 'A miscommunication has led to a project failure. You address the team:', answer: "Let's not focus on blame. What I'd like us to do is understand where the communication broke down so we can build better systems.", options: ["Let's not focus on blame. What I'd like us to do is understand where the communication broke down so we can build better systems.", 'Whose fault?', 'Someone messed up.', 'This is unacceptable.'] },
      ],
    },
    'storytelling-advanced': {
      type: 'discourse-completion', instruction: 'Choose the most effective storytelling technique.',
      items: [
        { prompt: 'You want to open a story with a hook. You say:', answer: "The strangest thing about that Tuesday was that it started completely normally.", options: ["The strangest thing about that Tuesday was that it started completely normally.", 'I want to tell a story.', 'On Tuesday.', 'Listen to my story.'] },
        { prompt: 'You want to build suspense. You say:', answer: "And just as I was about to leave — this is the part I still can't quite explain...", options: ["And just as I was about to leave — this is the part I still can't quite explain...", 'Then something happened.', 'Surprise.', 'Wait for it.'] },
        { prompt: 'You want to use a callback to an earlier detail. You say:', answer: "And remember the woman with the red umbrella? Well, she appeared again — except this time...", options: ["And remember the woman with the red umbrella? Well, she appeared again — except this time...", 'The woman came back.', 'She appeared.', 'Red umbrella again.'] },
        { prompt: 'You want to land an emotional ending. You say:', answer: "And that was the last time I ever saw that house. But every time I smell cut grass, I'm right back there.", options: ["And that was the last time I ever saw that house. But every time I smell cut grass, I'm right back there.", 'The end.', 'That was the last time.', 'I never went back.'] },
        { prompt: 'You want to shift tone from funny to serious. You say:', answer: "We all laughed at the time, of course. But looking back, I think that was the moment everything changed.", options: ["We all laughed at the time, of course. But looking back, I think that was the moment everything changed.", 'Then it got serious.', 'Not funny anymore.', 'But then.'] },
        { prompt: 'You want to end a story with a universal reflection. You say:', answer: "And I suppose that's the thing about regret — it's never really about the thing you didn't do. It's about who you might have become if you had.", options: ["And I suppose that's the thing about regret — it's never really about the thing you didn't do. It's about who you might have become if you had.", 'Regret is bad.', 'Don\'t have regrets.', 'Learn from mistakes.'] },
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

class Conversation {
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
        scenario: `Set the scene for: ${target.category} → ${target.skill}`,
        phrases: 'Present key functional phrases for this scenario',
        practice: `Complete ${exercise.count || 0} discourse-completion items`,
        converse: 'Free conversation using the target functions',
      },
    };
  }
}

module.exports = Conversation;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const cv = new Conversation();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) cv.setLevel(id, level);
        out({ action: 'start', profile: cv.getProfile(id), nextSkills: cv.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(cv.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'a1';
        if (skill) { out(cv.generateExercise(level, skill, 5)); }
        else { const n = cv.getNextSkills(id, 1).next; out(n.length ? cv.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(cv.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(cv.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(cv.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(cv.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(cv.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? cv.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(cv.setLevel(id, l)); break; }
      case 'students': { out(cv.listStudents()); break; }
      default: out({ usage: 'node conversation.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
