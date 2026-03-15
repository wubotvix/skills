// MS Social Studies Civics & Government Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-civics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'foundations-of-government': ['why-government', 'types-of-government', 'democratic-principles', 'social-contract', 'philosophical-roots', 'comparing-systems'],
  },
  'grade-7': {
    'constitution-principles': ['preamble', 'articles-overview', 'bill-of-rights', 'key-amendments', 'federalism', 'separation-of-powers'],
  },
  'grade-8': {
    'rights-liberties': ['first-amendment', 'due-process', 'equal-protection', 'rights-vs-limits', 'landmark-cases', 'civil-liberties-today'],
    'citizenship-civic-duties': ['citizenship-requirements', 'civic-responsibilities', 'community-engagement', 'informed-citizen', 'civic-action', 'democratic-participation'],
    'political-processes': ['elections', 'political-parties', 'campaigns-media', 'voting-rights', 'electoral-college', 'beyond-voting'],
    'law-justice': ['rule-of-law', 'court-system', 'criminal-vs-civil', 'juvenile-justice', 'judicial-review', 'landmark-decisions'],
  },
};

const CONTENT_BANKS = {
  'grade-6': {
    'why-government': {
      questions: [
        { q: 'According to Thomas Hobbes, what would life be like without government?', a: 'nasty, brutish, and short', alts: ['solitary poor nasty brutish and short', 'state of nature', 'war of all against all'] },
        { q: 'What is a social contract?', a: 'an agreement between people and their government', alts: ['agreement to give up some freedom for protection', 'people agree to follow rules in exchange for order'] },
        { q: 'Which philosopher believed people have natural rights to life, liberty, and property?', a: 'John Locke', alts: ['locke'] },
        { q: 'What is the main purpose of government according to the Declaration of Independence?', a: 'to protect natural rights', alts: ['to secure rights', 'protect life liberty and pursuit of happiness'] },
        { q: 'What happens when a government fails to protect the rights of the people, according to Locke?', a: 'the people have the right to replace it', alts: ['revolution', 'overthrow it', 'change the government'] },
        { q: 'What is popular sovereignty?', a: 'government power comes from the people', alts: ['the people rule', 'power of the people', 'consent of the governed'] },
      ],
    },
    'types-of-government': {
      questions: [
        { q: 'What type of government is ruled by a king or queen?', a: 'monarchy', alts: ['a monarchy'] },
        { q: 'What type of government is ruled by a small group of powerful people?', a: 'oligarchy', alts: ['an oligarchy'] },
        { q: 'In a democracy, who holds the power?', a: 'the people', alts: ['citizens', 'the citizens'] },
        { q: 'What is a dictatorship?', a: 'government ruled by one person with absolute power', alts: ['one person rules', 'single ruler with total control'] },
        { q: 'What is the difference between a democracy and a republic?', a: 'in a republic citizens elect representatives to make decisions', alts: ['republic has elected representatives', 'representative democracy'] },
        { q: 'What type of government is based on religious law?', a: 'theocracy', alts: ['a theocracy'] },
      ],
    },
    'democratic-principles': {
      questions: [
        { q: 'What does "rule of law" mean?', a: 'everyone must follow the law, including leaders', alts: ['no one is above the law', 'laws apply equally to all'] },
        { q: 'What is majority rule with minority rights?', a: 'the majority decides but cannot take away the rights of the minority', alts: ['majority wins but minority is protected'] },
        { q: 'What does "consent of the governed" mean?', a: 'government gets its power from the agreement of the people', alts: ['people agree to be governed', 'people give permission to be ruled'] },
        { q: 'What is due process?', a: 'the government must follow fair procedures before taking away rights', alts: ['fair legal procedures', 'following the law fairly'] },
        { q: 'Why is individual rights a key democratic principle?', a: 'democracy protects each person from government abuse of power', alts: ['to protect people from tyranny', 'limits government power over individuals'] },
        { q: 'What is limited government?', a: 'government can only do what the people give it power to do', alts: ['government power is restricted', 'constitution limits what government can do'] },
      ],
    },
    'social-contract': {
      questions: [
        { q: 'Who wrote "Leviathan" and argued for a strong government to prevent chaos?', a: 'Thomas Hobbes', alts: ['hobbes'] },
        { q: 'Who argued that people are born with natural rights and government should protect them?', a: 'John Locke', alts: ['locke'] },
        { q: 'What did Rousseau believe about the social contract?', a: 'people must agree together on rules for the common good', alts: ['general will', 'collective agreement for common good'] },
        { q: 'In social contract theory, what do people give up in exchange for government protection?', a: 'some individual freedom', alts: ['some liberty', 'some rights', 'unlimited freedom'] },
        { q: 'How did social contract ideas influence the American Revolution?', a: 'colonists argued Britain broke the social contract by violating their rights', alts: ['britain failed to protect rights', 'king broke the agreement'] },
        { q: 'What is the "state of nature" in political philosophy?', a: 'life without government or laws', alts: ['no government', 'before government existed'] },
      ],
    },
    'philosophical-roots': {
      questions: [
        { q: 'Which ancient civilization is considered the birthplace of democracy?', a: 'Athens', alts: ['ancient athens', 'greece', 'ancient greece'] },
        { q: 'What did Montesquieu argue government should have?', a: 'separation of powers into branches', alts: ['divided power', 'three branches', 'separation of powers'] },
        { q: 'What Roman contribution influenced American government?', a: 'the republic with elected representatives and written laws', alts: ['republic', 'representative government', 'written law'] },
        { q: 'What did the Magna Carta establish in 1215?', a: 'that even the king must follow the law', alts: ['limits on royal power', 'rule of law applies to the king'] },
        { q: 'Which Enlightenment idea most influenced the Declaration of Independence?', a: 'natural rights', alts: ["locke's natural rights", 'life liberty property'] },
        { q: 'What is the English Bill of Rights and why does it matter to American government?', a: 'it limited the power of the monarch and influenced the US Bill of Rights', alts: ['limited monarchy', 'protected rights of parliament'] },
      ],
    },
    'comparing-systems': {
      questions: [
        { q: 'How does a presidential democracy differ from a parliamentary democracy?', a: 'in presidential the executive is separate from the legislature', alts: ['president is independent of congress', 'separate branches vs prime minister from parliament'] },
        { q: 'Name a country with a parliamentary system.', a: 'United Kingdom', alts: ['uk', 'canada', 'india', 'australia', 'japan', 'germany'] },
        { q: 'What is a constitutional monarchy?', a: 'a system where a monarch is head of state but a constitution limits their power', alts: ['king or queen with limited power', 'monarch as figurehead'] },
        { q: 'What is the main weakness of authoritarian government?', a: 'it limits individual freedom and concentrates power', alts: ['no freedom', 'too much power in one person', 'no checks on power'] },
        { q: 'Why might a country choose a federal system over a unitary system?', a: 'to share power between national and regional governments in a large diverse country', alts: ['divide power', 'protect regional differences'] },
        { q: 'What advantage does democracy have over other systems?', a: 'it gives people a voice in government and protects rights', alts: ['representation', 'freedom', 'consent of the governed', 'accountability'] },
      ],
    },
  },
  'grade-7': {
    'preamble': {
      questions: [
        { q: 'What are the first three words of the Constitution and why do they matter?', a: 'We the People — they show government power comes from the people', alts: ['we the people'] },
        { q: 'Name three of the six goals listed in the Preamble.', a: 'form a more perfect union, establish justice, ensure domestic tranquility', alts: ['provide for common defense', 'promote general welfare', 'secure blessings of liberty'] },
        { q: 'What does "establish justice" mean in the Preamble?', a: 'create a fair system of laws and courts', alts: ['fair legal system', 'justice for all'] },
        { q: 'What does "ensure domestic tranquility" mean?', a: 'keep peace within the country', alts: ['maintain order', 'prevent conflict at home'] },
        { q: 'What does "provide for the common defense" mean?', a: 'protect the country from foreign threats', alts: ['national security', 'military defense'] },
        { q: 'What does "secure the blessings of liberty" mean?', a: 'protect freedom for current and future generations', alts: ['preserve liberty', 'protect freedom'] },
      ],
    },
    'articles-overview': {
      questions: [
        { q: 'Which article of the Constitution establishes the legislative branch?', a: 'Article I', alts: ['article 1', 'article one'] },
        { q: 'Which article establishes the executive branch?', a: 'Article II', alts: ['article 2', 'article two'] },
        { q: 'Which article establishes the judicial branch?', a: 'Article III', alts: ['article 3', 'article three'] },
        { q: 'What does Article IV address?', a: 'relations between states', alts: ['state relations', 'states must respect each other'] },
        { q: 'How can the Constitution be amended?', a: 'two-thirds vote in Congress and ratification by three-fourths of states', alts: ['article v process', 'amendment process'] },
        { q: 'What is the Supremacy Clause in Article VI?', a: 'the Constitution is the supreme law of the land', alts: ['federal law overrides state law', 'constitution is highest law'] },
      ],
    },
    'bill-of-rights': {
      questions: [
        { q: 'What does the First Amendment protect?', a: 'freedom of religion, speech, press, assembly, and petition', alts: ['five freedoms', 'speech religion press assembly petition'] },
        { q: 'What does the Second Amendment address?', a: 'the right to keep and bear arms', alts: ['gun rights', 'right to bear arms'] },
        { q: 'What does the Fourth Amendment protect against?', a: 'unreasonable searches and seizures', alts: ['search and seizure', 'need a warrant'] },
        { q: 'What does the Fifth Amendment guarantee?', a: 'due process, no self-incrimination, no double jeopardy', alts: ['right to remain silent', 'due process'] },
        { q: 'What does the Eighth Amendment prohibit?', a: 'cruel and unusual punishment and excessive bail', alts: ['cruel punishment', 'excessive fines'] },
        { q: 'Why was the Bill of Rights added to the Constitution?', a: 'to protect individual rights and convince Anti-Federalists to ratify', alts: ['protect rights', 'limit government power over individuals'] },
      ],
    },
    'key-amendments': {
      questions: [
        { q: 'What did the 13th Amendment do?', a: 'abolished slavery', alts: ['ended slavery', 'banned slavery'] },
        { q: 'What does the 14th Amendment guarantee?', a: 'equal protection under the law and citizenship for all born in the US', alts: ['equal protection', 'citizenship clause', 'due process for states'] },
        { q: 'What did the 15th Amendment do?', a: 'gave Black men the right to vote', alts: ['voting rights regardless of race', 'cannot deny vote based on race'] },
        { q: 'What did the 19th Amendment do?', a: 'gave women the right to vote', alts: ['women suffrage', "women's suffrage"] },
        { q: 'What did the 26th Amendment do?', a: 'lowered the voting age to 18', alts: ['18 year olds can vote', 'voting age 18'] },
        { q: 'Why is the 14th Amendment considered one of the most important amendments?', a: 'it applied the Bill of Rights to state governments through incorporation', alts: ['equal protection applies to states', 'extends rights to state level'] },
      ],
    },
    'federalism': {
      questions: [
        { q: 'What is federalism?', a: 'a system where power is shared between national and state governments', alts: ['divided power between federal and state', 'shared power'] },
        { q: 'What are enumerated powers?', a: 'powers specifically listed in the Constitution for the federal government', alts: ['listed powers', 'expressed powers'] },
        { q: 'What are reserved powers?', a: 'powers kept by the states under the 10th Amendment', alts: ['state powers', 'powers not given to federal government'] },
        { q: 'What are concurrent powers?', a: 'powers shared by both federal and state governments', alts: ['shared powers', 'both can tax'] },
        { q: 'Give an example of a power reserved to the states.', a: 'education', alts: ['marriage laws', 'drivers licenses', 'police power', 'establishing schools'] },
        { q: 'What is the elastic clause and why is it important?', a: 'it allows Congress to make laws necessary and proper to carry out its powers', alts: ['necessary and proper clause', 'implied powers'] },
      ],
    },
    'separation-of-powers': {
      questions: [
        { q: 'Why did the Founders create three separate branches of government?', a: 'to prevent any one branch from becoming too powerful', alts: ['prevent tyranny', 'distribute power', 'checks and balances'] },
        { q: 'How can the President check the legislative branch?', a: 'by vetoing bills', alts: ['veto', 'refuse to sign a bill'] },
        { q: 'How can Congress check the President?', a: 'by overriding vetoes and through impeachment', alts: ['override veto', 'impeach', 'confirm appointments', 'control funding'] },
        { q: 'How can the Supreme Court check both other branches?', a: 'by declaring laws or executive actions unconstitutional', alts: ['judicial review', 'rule laws unconstitutional'] },
        { q: 'What is impeachment and which branch has that power?', a: 'the process of charging a government official with misconduct — Congress has this power', alts: ['house impeaches senate tries', 'congress can remove the president'] },
        { q: 'Who confirms Supreme Court nominees?', a: 'the Senate', alts: ['senate'] },
      ],
    },
  },
  'grade-8': {
    'first-amendment': {
      questions: [
        { q: 'Does freedom of speech protect a student from punishment for threatening another student?', a: 'no, threats are not protected speech', alts: ['no', 'threats are not protected'] },
        { q: 'In Tinker v. Des Moines, what did the Court rule about student expression?', a: 'students do not lose their constitutional rights at school', alts: ['students have free speech at school', 'armbands were protected speech'] },
        { q: 'What is the establishment clause of the First Amendment?', a: 'government cannot establish or promote an official religion', alts: ['no official religion', 'separation of church and state'] },
        { q: 'What is the free exercise clause?', a: 'people have the right to practice their religion freely', alts: ['freedom of religion', 'practice any religion'] },
        { q: 'Can the government censor a newspaper before it publishes?', a: 'generally no — this is called prior restraint and is almost always unconstitutional', alts: ['no', 'prior restraint is unconstitutional'] },
        { q: 'What is the right to petition?', a: 'the right to ask the government to change something', alts: ['ask government to address grievances', 'request change from government'] },
      ],
    },
    'due-process': {
      questions: [
        { q: 'What did Miranda v. Arizona establish?', a: 'police must inform suspects of their rights before questioning', alts: ['miranda rights', 'right to remain silent warning'] },
        { q: 'What does "innocent until proven guilty" mean?', a: 'the government must prove you committed a crime, not the other way around', alts: ['burden of proof on prosecution', 'presumption of innocence'] },
        { q: 'What is the right to a speedy trial?', a: 'the 6th Amendment right to have your case heard without unnecessary delay', alts: ['trial without unreasonable delay', 'quick trial'] },
        { q: 'What did Gideon v. Wainwright establish?', a: 'the right to a lawyer even if you cannot afford one', alts: ['right to free attorney', 'public defender'] },
        { q: 'What does the 5th Amendment protection against self-incrimination mean?', a: 'you cannot be forced to testify against yourself', alts: ['right to remain silent', 'plead the fifth'] },
        { q: 'What is double jeopardy?', a: 'being tried twice for the same crime, which is prohibited by the 5th Amendment', alts: ['cannot be tried twice for same offense'] },
      ],
    },
    'equal-protection': {
      questions: [
        { q: 'What did Brown v. Board of Education decide?', a: 'school segregation is unconstitutional', alts: ['separate is not equal', 'overturned plessy v ferguson'] },
        { q: 'What did Plessy v. Ferguson establish and why was it wrong?', a: 'it established separate but equal which legalized segregation', alts: ['separate but equal', 'allowed segregation'] },
        { q: 'What is the equal protection clause?', a: 'the 14th Amendment requirement that states treat all people equally under the law', alts: ['no state can deny equal protection', 'equal treatment under law'] },
        { q: 'How did the Civil Rights Act of 1964 expand equal protection?', a: 'it banned discrimination based on race, color, religion, sex, or national origin', alts: ['outlawed discrimination', 'ended legal segregation'] },
        { q: 'What is the difference between de jure and de facto segregation?', a: 'de jure is segregation by law, de facto is segregation in practice', alts: ['by law vs in reality', 'legal vs actual'] },
        { q: 'Why is the 14th Amendment called the second founding of America?', a: 'it transformed the Constitution by extending rights and equality to all citizens', alts: ['it redefined citizenship', 'applied bill of rights to states'] },
      ],
    },
    'rights-vs-limits': {
      questions: [
        { q: 'Can you yell "fire" in a crowded theater as free speech?', a: 'no, speech that creates a clear and present danger is not protected', alts: ['no', 'not protected'] },
        { q: 'What is the legal test for when speech can be limited?', a: 'when it creates a clear and present danger or imminent lawless action', alts: ['clear and present danger', 'imminent lawless action'] },
        { q: 'Can a school limit student speech that substantially disrupts learning?', a: 'yes, schools can limit disruptive speech', alts: ['yes'] },
        { q: 'How does the phrase "your right to swing your fist ends where my nose begins" explain rights?', a: 'every right has limits where it interferes with another persons rights', alts: ['rights end where others rights begin', 'rights have limits'] },
        { q: 'Can the government take private property?', a: 'yes, through eminent domain with just compensation under the 5th Amendment', alts: ['eminent domain', 'yes with compensation'] },
        { q: 'Why do rights come with responsibilities in a democracy?', a: 'because exercising rights requires respecting the rights of others', alts: ['must respect others rights', 'freedom requires responsibility'] },
      ],
    },
    'landmark-cases': {
      questions: [
        { q: 'What principle did Marbury v. Madison establish?', a: 'judicial review — the power of courts to declare laws unconstitutional', alts: ['judicial review'] },
        { q: 'What did McCulloch v. Maryland decide about federal power?', a: 'federal law is supreme over state law and Congress has implied powers', alts: ['supremacy of federal law', 'implied powers'] },
        { q: 'Why is Dred Scott v. Sandford considered one of the worst Supreme Court decisions?', a: 'it ruled enslaved people were not citizens and Congress could not ban slavery in territories', alts: ['denied citizenship to enslaved people', 'protected slavery'] },
        { q: 'What did Tinker v. Des Moines decide about student rights?', a: 'students retain First Amendment rights in school', alts: ['student free speech', 'students dont lose rights at school'] },
        { q: 'What did Miranda v. Arizona require?', a: 'police must inform suspects of their rights before interrogation', alts: ['miranda warnings', 'right to remain silent'] },
        { q: 'What did Gideon v. Wainwright guarantee?', a: 'the right to a court-appointed attorney if you cannot afford one', alts: ['right to a lawyer', 'free lawyer'] },
      ],
    },
    'civil-liberties-today': {
      questions: [
        { q: 'How does the Fourth Amendment apply to digital privacy?', a: 'courts are debating whether phone data and online activity are protected from unreasonable search', alts: ['digital privacy debate', 'phone searches need warrants'] },
        { q: 'Why is freedom of the press important in a democracy?', a: 'it holds government accountable by informing the public', alts: ['government accountability', 'watchdog role', 'informed citizens'] },
        { q: 'What is the tension between national security and civil liberties?', a: 'governments may want to limit rights to protect safety, but this can go too far', alts: ['security vs freedom', 'safety vs privacy'] },
        { q: 'How does the First Amendment apply to social media?', a: 'it protects speech from government censorship, but private companies can set their own rules', alts: ['only applies to government', 'private platforms can moderate'] },
        { q: 'What is the importance of an independent judiciary?', a: 'judges can protect rights without political pressure', alts: ['courts free from political influence', 'protects minority rights'] },
        { q: 'Why is peaceful protest protected but violence is not?', a: 'the First Amendment protects assembly and petition, but violence harms others rights', alts: ['peaceful assembly is a right', 'violence is not speech'] },
      ],
    },
    'citizenship-requirements': {
      questions: [
        { q: 'What are the two ways to become a US citizen?', a: 'by birth or through naturalization', alts: ['born in the us or naturalized', 'birthright or naturalization'] },
        { q: 'What must applicants demonstrate during the naturalization process?', a: 'knowledge of US history and government, English ability, and good moral character', alts: ['pass civics test', 'english and civics knowledge'] },
        { q: 'What does the 14th Amendment say about citizenship?', a: 'all persons born in the US are citizens', alts: ['birthright citizenship', 'born in us equals citizen'] },
        { q: 'How long must a legal resident live in the US before applying for citizenship?', a: 'typically 5 years', alts: ['5 years', 'five years'] },
        { q: 'What oath do new citizens take?', a: 'the Oath of Allegiance to support and defend the Constitution', alts: ['oath of allegiance', 'pledge to defend the constitution'] },
        { q: 'What is the difference between a citizen and a legal resident?', a: 'citizens can vote and hold certain offices; residents cannot', alts: ['citizens can vote', 'voting rights'] },
      ],
    },
    'civic-responsibilities': {
      questions: [
        { q: 'Name three civic responsibilities of citizens.', a: 'voting, serving on juries, and paying taxes', alts: ['vote jury duty taxes', 'obeying laws serving on juries voting'] },
        { q: 'Why is jury duty important in a democracy?', a: 'it ensures citizens judge their peers, not just the government', alts: ['right to trial by peers', 'citizens participate in justice'] },
        { q: 'How can citizens stay informed about government?', a: 'by following news from multiple sources and evaluating information critically', alts: ['read news', 'follow current events', 'multiple news sources'] },
        { q: 'What is the difference between a civic duty and a civic responsibility?', a: 'duties are legally required (like taxes); responsibilities are voluntary but important (like voting)', alts: ['duties are mandatory', 'responsibilities are voluntary'] },
        { q: 'Why should citizens respect the rights of others?', a: 'democracy depends on people protecting each others freedoms', alts: ['mutual respect', 'everyones rights matter'] },
        { q: 'How does community service strengthen democracy?', a: 'it builds social bonds and helps solve local problems through citizen action', alts: ['helps community', 'active citizenship'] },
      ],
    },
    'community-engagement': {
      questions: [
        { q: 'Name three ways a middle school student can be civically engaged.', a: 'volunteer, attend school board meetings, and organize community service projects', alts: ['volunteer', 'join community organizations', 'write to representatives'] },
        { q: 'What is a town hall meeting?', a: 'a public meeting where citizens can speak to elected officials about issues', alts: ['public forum', 'citizen meeting with officials'] },
        { q: 'How can writing a letter to a representative make a difference?', a: 'representatives pay attention to constituent concerns and it can influence policy', alts: ['influences policy', 'representatives listen to constituents'] },
        { q: 'What is a petition and how is it a civic tool?', a: 'a formal request signed by many people asking the government to take action', alts: ['signed request for change', 'collective demand'] },
        { q: 'Why is volunteering an important form of civic engagement?', a: 'it addresses community needs and builds skills for democratic participation', alts: ['helps community', 'builds citizenship skills'] },
        { q: 'How can social media be used for positive civic engagement?', a: 'by spreading awareness, organizing events, and connecting people around shared causes', alts: ['raise awareness', 'organize', 'connect people'] },
      ],
    },
    'informed-citizen': {
      questions: [
        { q: 'Why should citizens get news from multiple sources?', a: 'to get a more complete picture and identify bias', alts: ['avoid bias', 'different perspectives', 'check accuracy'] },
        { q: 'What is the difference between a fact and an opinion in news?', a: 'a fact can be verified with evidence; an opinion is a personal judgment', alts: ['facts are provable', 'opinions are personal views'] },
        { q: 'How can you identify bias in a news source?', a: 'look for loaded language, missing perspectives, and one-sided coverage', alts: ['loaded language', 'check what is left out', 'source analysis'] },
        { q: 'Why is media literacy important for citizens?', a: 'so they can evaluate information and make informed decisions about civic issues', alts: ['informed decisions', 'avoid manipulation', 'critical thinking'] },
        { q: 'What is the SIFT method for evaluating information?', a: 'Stop, Investigate the source, Find better coverage, Trace claims', alts: ['stop investigate find trace'] },
        { q: 'How does misinformation threaten democracy?', a: 'it misleads citizens and undermines informed decision-making', alts: ['bad decisions', 'people vote based on lies', 'erodes trust'] },
      ],
    },
    'civic-action': {
      questions: [
        { q: 'What are the steps of a civic action project?', a: 'identify a problem, research it, analyze solutions, plan, act, and reflect', alts: ['research plan act reflect', 'find problem propose solution take action'] },
        { q: 'Give an example of a civic action a student could take.', a: 'organize a recycling program, lead a voter registration drive, or start a petition', alts: ['community service project', 'write to officials', 'organize a fundraiser'] },
        { q: 'Why is it important to research before taking civic action?', a: 'to understand the problem fully and choose the most effective solution', alts: ['informed action', 'know the issue', 'effective solutions'] },
        { q: 'What is the difference between service and advocacy?', a: 'service directly helps people; advocacy tries to change policies or systems', alts: ['service is direct help', 'advocacy changes systems'] },
        { q: 'Why should civic action include reflection?', a: 'to learn what worked, what did not, and how to be more effective next time', alts: ['learn from experience', 'improve future action'] },
        { q: 'How does civic action connect to the First Amendment?', a: 'the First Amendment protects the rights to speak, assemble, and petition that make civic action possible', alts: ['free speech assembly petition'] },
      ],
    },
    'democratic-participation': {
      questions: [
        { q: 'Why is voting considered the most basic form of democratic participation?', a: 'it is how citizens directly choose their representatives and influence policy', alts: ['choose leaders', 'voice in government'] },
        { q: 'What are some barriers to voting that have existed in US history?', a: 'poll taxes, literacy tests, grandfather clauses, and voter ID requirements', alts: ['poll taxes', 'literacy tests', 'intimidation'] },
        { q: 'How did the Voting Rights Act of 1965 strengthen democracy?', a: 'it banned discriminatory voting practices and protected minority voting rights', alts: ['ended literacy tests', 'protected Black voters'] },
        { q: 'What is voter apathy and why is it a problem?', a: 'when citizens do not care about voting, which weakens democratic representation', alts: ['not voting', 'low turnout', 'disengaged citizens'] },
        { q: 'Name a form of political participation beyond voting.', a: 'contacting elected officials', alts: ['protesting', 'running for office', 'joining a political party', 'campaigning', 'volunteering'] },
        { q: 'Why does democracy require an engaged citizenry?', a: 'because government by the people only works when people participate', alts: ['people must participate', 'democracy needs active citizens'] },
      ],
    },
    'elections': {
      questions: [
        { q: 'What is the difference between a primary election and a general election?', a: 'primaries choose party nominees; general elections choose officeholders', alts: ['primary picks candidates', 'general picks winners'] },
        { q: 'What is the Electoral College?', a: 'the system where electors from each state cast votes for president', alts: ['indirect election of president', 'state electors vote for president'] },
        { q: 'How many electoral votes are needed to win the presidency?', a: '270', alts: ['two hundred seventy'] },
        { q: 'What is a swing state?', a: 'a state that could vote for either party and often decides elections', alts: ['battleground state', 'competitive state'] },
        { q: 'Why do some people criticize the Electoral College?', a: 'a candidate can win the presidency without winning the popular vote', alts: ['popular vote loser can win', 'not truly democratic'] },
        { q: 'What role do political parties play in elections?', a: 'they nominate candidates, organize campaigns, and present platforms to voters', alts: ['nominate candidates', 'organize voters', 'present issues'] },
      ],
    },
    'political-parties': {
      questions: [
        { q: 'What are the two major political parties in the US?', a: 'Democratic and Republican', alts: ['democrats and republicans'] },
        { q: 'What is a party platform?', a: 'a set of positions on issues that a political party supports', alts: ['party positions', 'statement of beliefs'] },
        { q: 'What is a third party and why do they rarely win?', a: 'a party other than the two major ones; the winner-take-all system makes it hard for them to win', alts: ['minor party', 'two party system disadvantages them'] },
        { q: 'What is political ideology?', a: 'a set of beliefs about the role of government and how society should be organized', alts: ['political beliefs', 'liberal vs conservative worldview'] },
        { q: 'How do political parties differ from interest groups?', a: 'parties run candidates for office; interest groups try to influence policy without running candidates', alts: ['parties nominate candidates', 'interest groups lobby'] },
        { q: 'Why did the Founders warn against political parties?', a: 'they feared factions would divide the nation and put party above country', alts: ['factions', 'division', 'washington warned against parties'] },
      ],
    },
    'campaigns-media': {
      questions: [
        { q: 'How does media influence elections?', a: 'by shaping public opinion through coverage, framing, and advertising', alts: ['shapes opinions', 'frames issues', 'political ads'] },
        { q: 'What is a political advertisement designed to do?', a: 'persuade voters to support or oppose a candidate', alts: ['persuade voters', 'win votes'] },
        { q: 'What is negative campaigning?', a: 'attacking an opponent rather than promoting your own ideas', alts: ['attack ads', 'criticizing opponents'] },
        { q: 'How has social media changed political campaigns?', a: 'candidates can communicate directly with voters and information spreads faster', alts: ['direct communication', 'viral content', 'micro-targeting'] },
        { q: 'What is the role of debates in elections?', a: 'they allow voters to compare candidates positions and speaking abilities', alts: ['compare candidates', 'hear positions directly'] },
        { q: 'Why is campaign finance a controversial issue?', a: 'large donations may give wealthy donors outsized influence over elected officials', alts: ['money in politics', 'wealthy influence'] },
      ],
    },
    'voting-rights': {
      questions: [
        { q: 'Which amendment gave women the right to vote?', a: '19th Amendment', alts: ['19th', 'the nineteenth amendment'] },
        { q: 'Which amendment banned poll taxes?', a: '24th Amendment', alts: ['24th', 'the twenty-fourth amendment'] },
        { q: 'What was the purpose of literacy tests at polling places?', a: 'to prevent Black Americans from voting', alts: ['suppress black votes', 'disenfranchise minorities'] },
        { q: 'What did the Voting Rights Act of 1965 do?', a: 'banned discriminatory voting practices like literacy tests', alts: ['protected voting rights', 'ended voter suppression tactics'] },
        { q: 'How has the right to vote expanded throughout US history?', a: 'from white male property owners to all citizens 18 and older regardless of race or gender', alts: ['expanded to include minorities women and young people'] },
        { q: 'What is voter registration and why is it required?', a: 'the process of signing up to vote to verify eligibility and prevent fraud', alts: ['sign up to vote', 'verify identity'] },
      ],
    },
    'electoral-college': {
      questions: [
        { q: 'How are electoral votes allocated to each state?', a: 'based on the number of representatives plus two senators', alts: ['house members plus senators', 'based on population plus two'] },
        { q: 'What is the winner-take-all system?', a: 'the candidate who wins a states popular vote gets all of that states electoral votes', alts: ['all or nothing', 'winner gets all electors'] },
        { q: 'Which two states do not use winner-take-all?', a: 'Maine and Nebraska', alts: ['maine nebraska'] },
        { q: 'Has a president ever won without the popular vote?', a: 'yes, including in 2000 and 2016', alts: ['yes', 'bush 2000', 'trump 2016'] },
        { q: 'What happens if no candidate gets 270 electoral votes?', a: 'the House of Representatives chooses the president', alts: ['house votes', 'contingent election'] },
        { q: 'Why did the Founders create the Electoral College instead of direct popular vote?', a: 'as a compromise between congressional selection and direct democracy', alts: ['compromise', 'balance large and small states', 'indirect election'] },
      ],
    },
    'beyond-voting': {
      questions: [
        { q: 'Name three forms of political participation besides voting.', a: 'contacting representatives, protesting, and volunteering for campaigns', alts: ['petition', 'campaign', 'community organizing'] },
        { q: 'What is grassroots organizing?', a: 'building political power from the community level up', alts: ['local organizing', 'community-based political action'] },
        { q: 'How does freedom of assembly support political participation?', a: 'it allows people to gather peacefully to express views and demand change', alts: ['protests', 'rallies', 'marches'] },
        { q: 'What is lobbying?', a: 'trying to influence government officials on behalf of a cause or group', alts: ['persuading officials', 'advocating to lawmakers'] },
        { q: 'Why is community organizing important in a democracy?', a: 'it gives ordinary citizens power to influence policy through collective action', alts: ['collective power', 'citizen influence'] },
        { q: 'How can young people participate in politics before they can vote?', a: 'volunteer, attend meetings, contact officials, protest, and stay informed', alts: ['volunteer', 'advocate', 'organize', 'speak up'] },
      ],
    },
    'rule-of-law': {
      questions: [
        { q: 'What does rule of law mean?', a: 'everyone, including government officials, must follow the law', alts: ['no one is above the law', 'laws apply equally'] },
        { q: 'Why is rule of law essential to democracy?', a: 'it prevents abuse of power and ensures fairness', alts: ['prevents tyranny', 'equal treatment'] },
        { q: 'What is the opposite of rule of law?', a: 'rule by a person or group without legal limits', alts: ['tyranny', 'authoritarianism', 'arbitrary rule'] },
        { q: 'How does the Constitution establish rule of law?', a: 'by setting limits on government power and guaranteeing individual rights', alts: ['limits on power', 'constitutional limits'] },
        { q: 'What happens when government officials break the law?', a: 'they can be impeached, prosecuted, or removed from office', alts: ['held accountable', 'face legal consequences'] },
        { q: 'How does an independent judiciary protect rule of law?', a: 'judges can strike down illegal government actions without political pressure', alts: ['courts check government', 'judicial independence'] },
      ],
    },
    'court-system': {
      questions: [
        { q: 'What are the three levels of the federal court system?', a: 'district courts, courts of appeals, and the Supreme Court', alts: ['trial courts appeals courts supreme court'] },
        { q: 'How many justices serve on the Supreme Court?', a: 'nine', alts: ['9'] },
        { q: 'How are federal judges selected?', a: 'nominated by the President and confirmed by the Senate', alts: ['presidential nomination senate confirmation'] },
        { q: 'What is the role of the Supreme Court?', a: 'to interpret the Constitution and be the final authority on what the law means', alts: ['interpret constitution', 'final court of appeal'] },
        { q: 'What is appellate jurisdiction?', a: 'the authority to review decisions made by lower courts', alts: ['review lower court decisions', 'appeals'] },
        { q: 'Why do federal judges serve for life?', a: 'to protect them from political pressure so they can make independent decisions', alts: ['judicial independence', 'free from politics'] },
      ],
    },
    'criminal-vs-civil': {
      questions: [
        { q: 'What is the difference between criminal and civil law?', a: 'criminal law deals with crimes against society; civil law deals with disputes between people', alts: ['criminal is crimes', 'civil is disputes'] },
        { q: 'Who brings a criminal case to court?', a: 'the government (prosecutor)', alts: ['the state', 'prosecutor', 'district attorney'] },
        { q: 'What is the standard of proof in a criminal case?', a: 'beyond a reasonable doubt', alts: ['beyond reasonable doubt'] },
        { q: 'What is the standard of proof in a civil case?', a: 'preponderance of the evidence', alts: ['more likely than not', 'preponderance'] },
        { q: 'What is a plaintiff in a civil case?', a: 'the person who brings the lawsuit', alts: ['person suing', 'complaining party'] },
        { q: 'Can the same action lead to both criminal and civil cases?', a: 'yes, like assault can be a crime and also grounds for a civil lawsuit', alts: ['yes'] },
      ],
    },
    'juvenile-justice': {
      questions: [
        { q: 'How does the juvenile justice system differ from the adult system?', a: 'it focuses more on rehabilitation than punishment', alts: ['rehabilitation', 'reform not punish'] },
        { q: 'What rights do juveniles have in court?', a: 'right to an attorney, right to confront witnesses, protection against self-incrimination', alts: ['due process rights', 'right to lawyer'] },
        { q: 'What did In re Gault (1967) establish?', a: 'that juveniles have the same due process rights as adults in court', alts: ['due process for juveniles', 'juvenile rights'] },
        { q: 'What is the main goal of juvenile court?', a: 'to rehabilitate young offenders and help them become productive citizens', alts: ['rehabilitation', 'reform'] },
        { q: 'Can a juvenile be tried as an adult?', a: 'yes, for serious crimes a judge may transfer the case to adult court', alts: ['yes for serious crimes'] },
        { q: 'Why does society treat juvenile offenders differently from adults?', a: 'because young peoples brains are still developing and they have greater capacity for change', alts: ['brain development', 'potential for reform'] },
      ],
    },
    'judicial-review': {
      questions: [
        { q: 'What is judicial review?', a: 'the power of courts to declare laws or government actions unconstitutional', alts: ['courts can strike down laws', 'review constitutionality'] },
        { q: 'Which case established judicial review?', a: 'Marbury v. Madison (1803)', alts: ['marbury v madison'] },
        { q: 'Who was the Chief Justice who established judicial review?', a: 'John Marshall', alts: ['marshall'] },
        { q: 'Why is judicial review considered a powerful check on government?', a: 'it gives the courts the final say on what the Constitution means', alts: ['courts interpret constitution', 'can overrule congress and president'] },
        { q: 'Can judicial review be used to overturn executive orders?', a: 'yes, courts can strike down executive actions that violate the Constitution', alts: ['yes'] },
        { q: 'What is a constitutional challenge?', a: 'a legal argument that a law or action violates the Constitution', alts: ['arguing something is unconstitutional', 'challenging a law in court'] },
      ],
    },
    'landmark-decisions': {
      questions: [
        { q: 'What did Marbury v. Madison establish?', a: 'judicial review', alts: ['power of courts to declare laws unconstitutional'] },
        { q: 'What did Brown v. Board of Education overturn?', a: 'Plessy v. Ferguson and the separate but equal doctrine', alts: ['plessy', 'separate but equal', 'school segregation'] },
        { q: 'What right did Gideon v. Wainwright guarantee?', a: 'the right to a court-appointed attorney', alts: ['right to a lawyer', 'free attorney'] },
        { q: 'What did Miranda v. Arizona require police to do?', a: 'inform suspects of their rights before questioning', alts: ['miranda warnings', 'read rights'] },
        { q: 'What did Tinker v. Des Moines protect?', a: 'student free speech rights in public schools', alts: ['student expression', 'student first amendment rights'] },
        { q: 'Why are landmark Supreme Court cases important?', a: 'they set precedents that shape how the Constitution is interpreted for future cases', alts: ['set precedent', 'define constitutional meaning'] },
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
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };

  if (bank.questions) {
    const items = pick(bank.questions, count).map(q => ({
      prompt: q.q,
      answer: q.a,
      acceptedAnswers: q.alts || [],
    }));
    return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each question.', items };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class MSCivics {
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

  checkAnswer(type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') {
      // For short-answer, also check alts from the bank
      const bank = Object.values(CONTENT_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp));
      if (bank) {
        const q = bank.questions.find(q => q.a === exp);
        if (q && q.alts) exp = [exp, ...q.alts];
      }
    }
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        hook: 'Present a civic dilemma or constitutional question (3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        discuss: 'Consider multiple perspectives on the issue',
        connect: 'How does this apply to your life, school, or community?',
      },
    };
  }
}

module.exports = MSCivics;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSCivics();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(api.generateExercise(grade, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected; try { exp = JSON.parse(expected); } catch {}
        out(api.checkAnswer(type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      default: out({ usage: 'node civics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
