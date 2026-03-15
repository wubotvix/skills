// eClaw HS Government & Politics Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-government');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'political-philosophy': {
    name: 'Political Philosophy & Foundations',
    topics: ['social-contract', 'natural-rights', 'enlightenment-thinkers', 'consent-of-governed', 'purpose-of-government'],
  },
  'constitution-federalism': {
    name: 'Constitution & Federalism',
    topics: ['separation-of-powers', 'checks-balances', 'enumerated-powers', 'reserved-powers', 'concurrent-powers', 'supremacy-clause'],
  },
  'three-branches': {
    name: 'Three Branches of Government',
    topics: ['congress', 'presidency', 'judiciary', 'bureaucracy', 'institutional-interactions'],
  },
  'civil-liberties': {
    name: 'Civil Liberties',
    topics: ['first-amendment', 'due-process', 'search-seizure', 'rights-of-accused', 'selective-incorporation'],
  },
  'civil-rights': {
    name: 'Civil Rights',
    topics: ['equal-protection', 'brown-v-board', 'voting-rights', 'gender-equality', 'affirmative-action'],
  },
  'political-parties-elections': {
    name: 'Political Parties & Elections',
    topics: ['two-party-system', 'electoral-college', 'campaign-finance', 'voter-behavior', 'media-role'],
  },
  'public-policy': {
    name: 'Public Policy',
    topics: ['policy-process', 'agenda-setting', 'iron-triangles', 'implementation', 'policy-evaluation'],
  },
  'comparative-government': {
    name: 'Comparative Government',
    topics: ['uk-parliamentary', 'russia-authoritarianism', 'china-communist', 'mexico-developing-democracy', 'iran-theocracy'],
  },
};

const QUESTION_BANKS = {
  'political-philosophy': [
    { type: 'mc', q: 'John Locke argued that the purpose of government is to:', choices: ['Maintain order through absolute power', 'Protect natural rights of life, liberty, and property', 'Promote religious conformity', 'Expand territorial control'], answer: 'B', explanation: 'Locke\'s Second Treatise argued government exists by consent to protect natural rights, and citizens may revolt if government violates those rights.' },
    { type: 'mc', q: 'The social contract theory holds that:', choices: ['Government authority comes from divine right', 'Citizens consent to give up some freedom in exchange for government protection', 'Rulers have unlimited power over citizens', 'Government is unnecessary'], answer: 'B', explanation: 'Social contract theory (Hobbes, Locke, Rousseau) holds that government authority derives from an agreement between the people and their rulers.' },
    { type: 'mc', q: 'Montesquieu\'s most influential contribution to American government was:', choices: ['The concept of natural rights', 'The idea of separation of powers', 'The theory of popular sovereignty', 'The concept of federalism'], answer: 'B', explanation: 'Montesquieu argued in The Spirit of the Laws that liberty requires separating government into legislative, executive, and judicial branches.' },
    { type: 'sa', q: 'How does Locke\'s philosophy differ from Hobbes\'s regarding the state of nature?', answer: 'optimistic', explanation: 'Hobbes saw the state of nature as brutal ("solitary, poor, nasty, brutish, and short"), requiring absolute authority. Locke viewed it more positively, with natural rights existing before government.' },
    { type: 'mc', q: 'Rousseau\'s concept of the "general will" refers to:', choices: ['The will of the monarch', 'The collective desire of the community for the common good', 'Individual self-interest', 'Military authority'], answer: 'B', explanation: 'Rousseau argued that legitimate government must reflect the general will — the shared interest of all citizens in the common good, not just majority opinion.' },
    { type: 'mc', q: 'The Declaration of Independence reflects which political philosophy?', choices: ['Divine right of kings', 'Marxism', 'Lockean natural rights theory', 'Machiavellian realism'], answer: 'C', explanation: 'Jefferson drew directly on Locke, asserting "unalienable Rights" to "Life, Liberty and the pursuit of Happiness" and the right to alter oppressive government.' },
    { type: 'sa', q: 'What is the concept of "consent of the governed" and why does it matter?', answer: 'legitimacy', explanation: 'Consent of the governed means government derives its authority from the people. Without consent, government lacks legitimacy and citizens may justifiably resist.' },
    { type: 'mc', q: 'Thomas Hobbes believed that without government, life would be:', choices: ['Peaceful and harmonious', 'Solitary, poor, nasty, brutish, and short', 'Guided by natural law', 'Organized by religious authority'], answer: 'B', explanation: 'Hobbes\'s Leviathan argued that without a strong sovereign, humans would exist in a violent state of nature where self-preservation drives constant conflict.' },
    { type: 'mc', q: 'Which Federalist Paper argues that a large republic can control factions?', choices: ['Federalist No. 1', 'Federalist No. 10', 'Federalist No. 51', 'Federalist No. 78'], answer: 'B', explanation: 'Madison\'s Federalist No. 10 argues that a large republic with many competing factions prevents any single faction from dominating, protecting minority rights.' },
    { type: 'sa', q: 'What is the difference between direct democracy and representative democracy?', answer: 'representatives', explanation: 'In direct democracy, citizens vote on laws directly (Athens). In representative democracy, citizens elect representatives to make decisions on their behalf (US Congress).' },
  ],
  'constitution-federalism': [
    { type: 'mc', q: 'The Supremacy Clause establishes that:', choices: ['State law overrides federal law', 'The Constitution and federal law are the supreme law of the land', 'The President is supreme', 'The judiciary has final say'], answer: 'B', explanation: 'Article VI\'s Supremacy Clause establishes that the Constitution, federal laws, and treaties are the supreme law, overriding conflicting state laws.' },
    { type: 'mc', q: 'The Necessary and Proper Clause (elastic clause) allows Congress to:', choices: ['Do anything it wants', 'Make laws needed to carry out its enumerated powers', 'Override the Supreme Court', 'Amend the Constitution'], answer: 'B', explanation: 'The elastic clause (Article I, Section 8, Clause 18) gives Congress implied powers to pass laws necessary for executing its enumerated powers.' },
    { type: 'mc', q: 'McCulloch v. Maryland (1819) established:', choices: ['Judicial review', 'Implied powers and federal supremacy over states', 'The right to privacy', 'Free speech protections'], answer: 'B', explanation: 'Chief Justice Marshall ruled that Congress had implied powers (creating a national bank) and that states cannot tax federal institutions, strengthening federal power.' },
    { type: 'sa', q: 'Explain the difference between enumerated and reserved powers.', answer: 'states', explanation: 'Enumerated powers are specifically granted to Congress in Article I (tax, regulate commerce, declare war). Reserved powers (10th Amendment) belong to states or the people — anything not delegated to the federal government.' },
    { type: 'mc', q: 'Federalism divides power between:', choices: ['Three branches of government', 'National and state governments', 'The President and Congress', 'Political parties'], answer: 'B', explanation: 'Federalism is the division of power between national and state governments, with each having distinct and overlapping (concurrent) authorities.' },
    { type: 'mc', q: 'The Commerce Clause has been used to:', choices: ['Limit congressional power', 'Greatly expand federal regulatory authority', 'Give states more power', 'Eliminate tariffs'], answer: 'B', explanation: 'The Commerce Clause (Article I, Section 8) has been broadly interpreted to expand federal power over interstate economic activity, including civil rights legislation.' },
    { type: 'mc', q: 'Checks and balances means:', choices: ['Each branch has equal power', 'Each branch can limit the power of the other branches', 'The judiciary is most powerful', 'Congress controls all spending'], answer: 'B', explanation: 'Checks and balances allow each branch to constrain the others — presidential veto, congressional override, judicial review, Senate confirmation, impeachment.' },
    { type: 'sa', q: 'How does the amendment process reflect federalism?', answer: 'both', explanation: 'Amendments require both national action (2/3 of Congress proposes) and state action (3/4 of state legislatures ratify), ensuring both levels of government must agree on constitutional changes.' },
    { type: 'mc', q: 'The 10th Amendment reserves powers to:', choices: ['The federal government', 'The President', 'The states or the people', 'The Supreme Court'], answer: 'C', explanation: 'The 10th Amendment states that powers not delegated to the federal government nor prohibited to states are reserved to the states or to the people.' },
    { type: 'mc', q: 'Cooperative federalism ("marble cake") means:', choices: ['National and state governments have completely separate functions', 'National and state governments share responsibilities in policy areas', 'States have no real power', 'The federal government controls everything'], answer: 'B', explanation: 'Cooperative federalism involves shared responsibilities between national and state governments, with intermingled functions (e.g., Medicaid, highway construction).' },
  ],
  'three-branches': [
    { type: 'mc', q: 'The power of judicial review was established by:', choices: ['The Constitution explicitly', 'Marbury v. Madison (1803)', 'The Bill of Rights', 'Congress'], answer: 'B', explanation: 'Judicial review — the power to declare laws unconstitutional — was established by Chief Justice Marshall in Marbury v. Madison, not explicitly in the Constitution.' },
    { type: 'mc', q: 'The Senate differs from the House in that it:', choices: ['Has more members', 'Confirms presidential appointments and ratifies treaties', 'Initiates revenue bills', 'Has shorter terms'], answer: 'B', explanation: 'The Senate has unique powers: confirming presidential appointments, ratifying treaties (2/3 vote), and trying impeachment cases. Senators serve 6-year terms.' },
    { type: 'mc', q: 'The President\'s most significant informal power is:', choices: ['Vetoing legislation', 'The bully pulpit — using media to influence public opinion', 'Appointing judges', 'Commanding the military'], answer: 'B', explanation: 'The "bully pulpit" — the President\'s ability to shape public opinion through media — is arguably the most powerful informal tool, as it can pressure Congress on legislation.' },
    { type: 'sa', q: 'What is the significance of the filibuster in the Senate?', answer: 'debate', explanation: 'The filibuster allows unlimited debate, requiring 60 votes (cloture) to end discussion. This gives the minority party power to block legislation, requiring supermajority consensus.' },
    { type: 'mc', q: 'The bureaucracy is sometimes called the "fourth branch" because:', choices: ['It was created by the 4th Amendment', 'It exercises significant policy-making power through rule-making', 'It has four departments', 'It was the fourth institution created'], answer: 'B', explanation: 'Federal agencies exercise enormous power through administrative rule-making, interpreting and implementing laws with expertise Congress lacks, effectively making policy.' },
    { type: 'mc', q: 'The House of Representatives has the sole power to:', choices: ['Ratify treaties', 'Confirm appointments', 'Initiate impeachment proceedings', 'Declare war alone'], answer: 'C', explanation: 'The House has the sole power of impeachment (Article I, Section 2). The Senate then conducts the trial, with a 2/3 vote required for conviction and removal.' },
    { type: 'mc', q: 'Federalist No. 78 argues that the judiciary is the "least dangerous branch" because:', choices: ['It has the military', 'It controls the budget', 'It has neither the sword nor the purse', 'It is elected by the people'], answer: 'C', explanation: 'Hamilton argued in Federalist No. 78 that the judiciary is least dangerous because it has no power to enforce (sword) or fund (purse) its decisions, relying on the other branches.' },
    { type: 'sa', q: 'How does the committee system affect lawmaking in Congress?', answer: 'specialize', explanation: 'Committees allow members to specialize in policy areas, control which bills reach the floor, hold hearings, and mark up legislation. Committee chairs wield significant gatekeeping power.' },
    { type: 'mc', q: 'Executive orders allow the President to:', choices: ['Create new laws', 'Direct federal agencies without congressional approval', 'Override Supreme Court decisions', 'Amend the Constitution'], answer: 'B', explanation: 'Executive orders direct federal agencies and officials, allowing presidents to act without Congress. They can be overturned by courts, Congress, or future presidents.' },
    { type: 'mc', q: 'An independent regulatory commission differs from an executive agency in that:', choices: ['It has more funding', 'Its leaders cannot be easily removed by the President', 'It has no real power', 'It is part of the judiciary'], answer: 'B', explanation: 'Independent regulatory commissions (FCC, SEC, FTC) have leaders appointed for fixed terms who cannot be removed at will by the President, insulating them from political pressure.' },
  ],
  'civil-liberties': [
    { type: 'mc', q: 'Selective incorporation means:', choices: ['All amendments apply to states', 'The Bill of Rights is applied to states through the 14th Amendment on a case-by-case basis', 'States can ignore the Constitution', 'Only federal rights matter'], answer: 'B', explanation: 'Through selective incorporation, the Supreme Court has applied most (but not all) Bill of Rights protections to state governments via the 14th Amendment\'s Due Process Clause.' },
    { type: 'mc', q: 'In Schenck v. United States (1919), the "clear and present danger" test held that:', choices: ['All speech is protected', 'Speech can be restricted when it poses a clear and present danger', 'Only political speech is protected', 'The government can never restrict speech'], answer: 'B', explanation: 'Justice Holmes ruled that speech creating a "clear and present danger" (shouting fire in a theater) is not protected, establishing limits on the First Amendment.' },
    { type: 'mc', q: 'Gideon v. Wainwright (1963) established that:', choices: ['Miranda rights are required', 'States must provide attorneys to defendants who cannot afford one', 'The death penalty is unconstitutional', 'Exclusionary rule applies to states'], answer: 'B', explanation: 'The Court ruled that the 6th Amendment right to counsel is fundamental, requiring states to provide attorneys to defendants too poor to hire their own.' },
    { type: 'sa', q: 'What is the establishment clause and how does it apply today?', answer: 'religion', explanation: 'The establishment clause (1st Amendment) prohibits government from establishing an official religion or favoring one religion over another. It\'s applied to issues like school prayer, religious displays, and government funding.' },
    { type: 'mc', q: 'The exclusionary rule (Mapp v. Ohio) states that:', choices: ['All evidence is admissible', 'Evidence obtained through illegal search and seizure cannot be used in court', 'Police can search without warrants', 'Only federal courts use this rule'], answer: 'B', explanation: 'Mapp v. Ohio (1961) applied the exclusionary rule to states, requiring that illegally obtained evidence be excluded from criminal trials to deter police misconduct.' },
    { type: 'mc', q: 'Miranda v. Arizona (1966) requires police to:', choices: ['Obtain a warrant before arrest', 'Inform suspects of their right to remain silent and have an attorney', 'Allow suspects to leave', 'Provide bail immediately'], answer: 'B', explanation: 'Miranda requires police to inform suspects of their 5th Amendment right against self-incrimination and 6th Amendment right to counsel before custodial interrogation.' },
    { type: 'mc', q: 'Tinker v. Des Moines (1969) established that:', choices: ['Schools can ban all expression', 'Students retain First Amendment rights in school that do not disrupt learning', 'Students have no rights', 'Only verbal speech is protected'], answer: 'B', explanation: 'The Court ruled students don\'t "shed their constitutional rights at the schoolhouse gate," protecting symbolic speech (armbands) that doesn\'t materially disrupt school.' },
    { type: 'sa', q: 'What is the difference between civil liberties and civil rights?', answer: 'protection', explanation: 'Civil liberties protect individuals FROM government action (1st, 4th, 5th Amendments). Civil rights protect individuals from discrimination BY government or private entities (14th Amendment, Civil Rights Act).' },
    { type: 'mc', q: 'The right to privacy was established in:', choices: ['The Bill of Rights explicitly', 'Griswold v. Connecticut (1965) through penumbras of the Bill of Rights', 'A constitutional amendment', 'An executive order'], answer: 'B', explanation: 'In Griswold, the Court found an implicit right to privacy in the "penumbras" (shadows) of the 1st, 3rd, 4th, 5th, and 9th Amendments.' },
    { type: 'mc', q: 'The Free Exercise Clause protects:', choices: ['Only Christian denominations', 'The right to practice any religion without government interference', 'Government-sponsored religion', 'Religious displays on public property'], answer: 'B', explanation: 'The Free Exercise Clause protects individuals\' right to practice their religion, though the government may regulate religiously motivated conduct that violates generally applicable laws.' },
  ],
  'civil-rights': [
    { type: 'mc', q: 'The 14th Amendment\'s Equal Protection Clause:', choices: ['Only applies to race', 'Prohibits states from denying any person equal protection of the laws', 'Only applies to voting', 'Was repealed'], answer: 'B', explanation: 'The Equal Protection Clause prohibits states from denying equal protection to any person, becoming the basis for civil rights challenges to discrimination of all kinds.' },
    { type: 'mc', q: 'Brown v. Board of Education (1954) overturned:', choices: ['Marbury v. Madison', 'Plessy v. Ferguson\'s "separate but equal" doctrine', 'The 14th Amendment', 'Dred Scott'], answer: 'B', explanation: 'The Warren Court unanimously ruled that "separate educational facilities are inherently unequal," overturning Plessy and beginning the dismantling of legal segregation.' },
    { type: 'mc', q: 'The Voting Rights Act of 1965 primarily targeted:', choices: ['Campaign finance', 'Discriminatory voting practices like literacy tests in the South', 'Electoral College reform', 'Lowering the voting age'], answer: 'B', explanation: 'The VRA banned literacy tests, provided federal oversight of elections in areas with histories of discrimination, and dramatically increased Black voter registration.' },
    { type: 'sa', q: 'How has the standard of scrutiny affected civil rights cases?', answer: 'strict', explanation: 'Courts apply different scrutiny levels: strict scrutiny for race (government must show compelling interest), intermediate for gender, and rational basis for most other classifications. Higher scrutiny makes discrimination harder to justify.' },
    { type: 'mc', q: 'Title IX (1972) addresses:', choices: ['Racial discrimination', 'Gender discrimination in federally funded education programs', 'Religious discrimination', 'Age discrimination'], answer: 'B', explanation: 'Title IX prohibits gender discrimination in federally funded education, most visibly impacting women\'s athletics but also addressing sexual harassment and admissions.' },
    { type: 'mc', q: 'The Civil Rights Act of 1964 was significant because it:', choices: ['Only addressed voting', 'Banned discrimination in public accommodations, employment, and federally funded programs', 'Created affirmative action quotas', 'Only applied to the South'], answer: 'B', explanation: 'The Civil Rights Act banned discrimination based on race, color, religion, sex, or national origin in public accommodations, employment, and federally funded programs.' },
    { type: 'mc', q: 'Affirmative action in college admissions has been shaped by:', choices: ['Only one Supreme Court case', 'Bakke, Grutter, and Students for Fair Admissions cases', 'Congressional legislation', 'Executive order only'], answer: 'B', explanation: 'Affirmative action jurisprudence evolved from Bakke (1978, race as one factor), Grutter (2003, upheld), to Students for Fair Admissions (2023, struck down race-conscious admissions).' },
    { type: 'sa', q: 'What is the difference between de jure and de facto segregation?', answer: 'law', explanation: 'De jure segregation is mandated by law (Jim Crow). De facto segregation exists in practice through housing patterns, economic inequality, and institutional practices, even without legal mandate.' },
    { type: 'mc', q: 'The Americans with Disabilities Act (1990) requires:', choices: ['Separate facilities for disabled people', 'Reasonable accommodations and prohibits discrimination based on disability', 'Preferential hiring', 'Only government buildings to be accessible'], answer: 'B', explanation: 'The ADA prohibits discrimination based on disability in employment, public accommodations, and government services, requiring reasonable accommodations.' },
    { type: 'mc', q: 'The Equal Rights Amendment (ERA):', choices: ['Was ratified and is part of the Constitution', 'Passed Congress but was never ratified by enough states', 'Was never proposed', 'Only addressed voting rights'], answer: 'B', explanation: 'The ERA passed Congress in 1972 but fell short of the required 38 state ratifications by the 1982 deadline, though the debate about its status continues.' },
  ],
  'political-parties-elections': [
    { type: 'mc', q: 'The US has a two-party system primarily because of:', choices: ['The Constitution requires it', 'Winner-take-all elections and single-member districts', 'Voters prefer only two choices', 'Third parties are illegal'], answer: 'B', explanation: 'Duverger\'s Law explains that winner-take-all/single-member-district elections tend to produce two-party systems because third parties struggle to win seats.' },
    { type: 'mc', q: 'The Electoral College:', choices: ['Directly elects the president by popular vote', 'Uses state-level winner-take-all allocation of electors in most states', 'Gives every state equal votes', 'Was eliminated by amendment'], answer: 'B', explanation: 'Most states use winner-take-all allocation: the candidate winning the state\'s popular vote receives all its electoral votes. 270 of 538 electoral votes are needed to win.' },
    { type: 'mc', q: 'Citizens United v. FEC (2010) ruled that:', choices: ['Campaign contributions can be limited', 'Corporate and union independent expenditures are protected speech', 'All campaign spending must be disclosed', 'PACs are illegal'], answer: 'B', explanation: 'Citizens United ruled that corporations and unions have First Amendment rights to make unlimited independent expenditures, leading to the rise of Super PACs.' },
    { type: 'sa', q: 'What factors influence voter behavior?', answer: 'party', explanation: 'Key factors include party identification (strongest predictor), candidate characteristics, issues, demographics (age, education, race, religion), media coverage, and the economy.' },
    { type: 'mc', q: 'Gerrymandering refers to:', choices: ['Creating fair districts', 'Drawing district boundaries to advantage a political party', 'Eliminating districts', 'National redistricting'], answer: 'B', explanation: 'Gerrymandering manipulates district boundaries to concentrate opposition voters (packing) or spread them thin (cracking), giving one party a structural advantage.' },
    { type: 'mc', q: 'Political parties serve which function in democracy?', choices: ['Only fundraising', 'Recruiting candidates, mobilizing voters, organizing government, and aggregating interests', 'Enforcing laws', 'Appointing judges'], answer: 'B', explanation: 'Parties recruit and nominate candidates, mobilize voters, organize government (majority/minority leaders), and aggregate diverse interests into coherent policy platforms.' },
    { type: 'mc', q: 'A realignment in American politics refers to:', choices: ['Minor shifts in voter preference', 'A dramatic, lasting shift in party coalitions and voter allegiance', 'A change in party leadership', 'A constitutional amendment'], answer: 'B', explanation: 'Realignments are durable shifts in party coalitions (e.g., 1932 New Deal coalition, 1960s-80s Southern realignment), fundamentally reshaping the political landscape.' },
    { type: 'sa', q: 'How do primaries and caucuses differ?', answer: 'voting', explanation: 'Primaries are state-run elections where voters cast secret ballots to choose party nominees. Caucuses are party-run meetings where participants discuss and publicly declare support, requiring more time and effort.' },
    { type: 'mc', q: 'Voter turnout in the US is typically lower than other democracies because:', choices: ['Americans don\'t care about politics', 'Voter registration requirements, Tuesday voting, and frequency of elections', 'The Electoral College discourages voting', 'Voting is mandatory'], answer: 'B', explanation: 'Lower US turnout relates to voter registration burdens (unlike automatic registration elsewhere), Tuesday elections, frequent elections causing fatigue, and the Electoral College potentially depressing turnout in non-competitive states.' },
    { type: 'mc', q: 'The role of media in elections has changed most significantly through:', choices: ['Newspaper endorsements', 'The rise of social media, micro-targeting, and 24-hour news', 'Government censorship', 'Reduced advertising'], answer: 'B', explanation: 'Social media enables micro-targeting of voters, bypasses traditional media gatekeepers, and amplifies misinformation, fundamentally changing how campaigns communicate and how voters receive information.' },
  ],
  'public-policy': [
    { type: 'mc', q: 'An "iron triangle" consists of:', choices: ['Three branches of government', 'Congressional committees, interest groups, and bureaucratic agencies', 'Three political parties', 'President, Congress, and Supreme Court'], answer: 'B', explanation: 'Iron triangles are mutually beneficial relationships between congressional committees, interest groups, and bureaucratic agencies that dominate policy-making in specific areas.' },
    { type: 'mc', q: 'Agenda setting in public policy refers to:', choices: ['Passing legislation', 'The process by which issues gain attention and become priorities for action', 'Implementing laws', 'Judicial review'], answer: 'B', explanation: 'Agenda setting is how issues move from public concern to government attention, influenced by media coverage, focusing events, interest group lobbying, and public opinion.' },
    { type: 'sa', q: 'What is the difference between entitlement programs and discretionary spending?', answer: 'automatic', explanation: 'Entitlements (Social Security, Medicare, Medicaid) automatically provide benefits to eligible recipients regardless of annual budgets. Discretionary spending is set annually through appropriations (defense, education).' },
    { type: 'mc', q: 'Interest groups influence policy primarily through:', choices: ['Directly voting in Congress', 'Lobbying, campaign contributions, litigation, and grassroots mobilization', 'Appointing officials', 'Writing laws'], answer: 'B', explanation: 'Interest groups use lobbying (direct and grassroots), campaign contributions (PACs/Super PACs), litigation (filing lawsuits), and public campaigns to influence policy.' },
    { type: 'mc', q: 'A policy that produces concentrated benefits but diffuse costs will likely:', choices: ['Fail to pass', 'Pass because beneficiaries lobby hard while costs are spread thinly', 'Be vetoed', 'Face strong opposition'], answer: 'B', explanation: 'Mancur Olson\'s logic: when benefits are concentrated (specific industry) but costs are spread (pennies per taxpayer), beneficiaries organize effectively while opposition is weak.' },
    { type: 'mc', q: 'The federal budget process begins with:', choices: ['Congressional committees', 'The President submitting a budget proposal to Congress', 'The Supreme Court', 'State governors'], answer: 'B', explanation: 'The President submits a budget proposal to Congress, which then modifies it through the appropriations process. Congress has the "power of the purse" (Article I).' },
    { type: 'sa', q: 'How do issue networks differ from iron triangles?', answer: 'open', explanation: 'Issue networks are broader, more open, and less stable than iron triangles, involving diverse participants (media, think tanks, academics) whose influence varies by issue. Iron triangles are closed, stable, three-way relationships.' },
    { type: 'mc', q: 'Incrementalism in policy-making means:', choices: ['Dramatic policy overhauls', 'Small, gradual changes to existing policies rather than wholesale reform', 'No change at all', 'Only executive action'], answer: 'B', explanation: 'Incrementalism describes how most policy change occurs through small adjustments to existing programs, as political compromise and institutional inertia resist dramatic shifts.' },
    { type: 'mc', q: 'Policy implementation is often challenging because:', choices: ['Laws are perfectly clear', 'Bureaucratic discretion, limited resources, and competing interests create gaps between intent and execution', 'The President controls all implementation', 'Courts monitor every step'], answer: 'B', explanation: 'Implementation gaps arise from vague legislative language, bureaucratic discretion, resource constraints, intergovernmental coordination challenges, and resistance from affected parties.' },
    { type: 'mc', q: 'The revolving door refers to:', choices: ['Congressional term limits', 'Movement of individuals between government positions and private sector lobbying', 'Rotating committee assignments', 'Presidential succession'], answer: 'B', explanation: 'The revolving door describes officials moving between government and private lobbying/industry, raising concerns about conflicts of interest and regulatory capture.' },
  ],
  'comparative-government': [
    { type: 'mc', q: 'The UK\'s parliamentary system differs from the US in that:', choices: ['The head of state and head of government are the same person', 'The Prime Minister is chosen from and accountable to the legislature', 'It has a written constitution', 'It has a federal system'], answer: 'B', explanation: 'In the UK, the PM leads the majority party in Parliament and can be removed by a vote of no confidence, creating fusion of powers rather than separation.' },
    { type: 'mc', q: 'Russia\'s political system is best described as:', choices: ['Full democracy', 'Competitive authoritarian — elections occur but are not free and fair', 'Communist state', 'Constitutional monarchy'], answer: 'B', explanation: 'Russia holds elections but concentrates power in the presidency, restricts opposition, controls media, and limits civil liberties, fitting the "competitive authoritarian" model.' },
    { type: 'mc', q: 'China\'s Communist Party maintains control through:', choices: ['Free elections', 'Single-party rule, censorship, economic growth, and social control', 'Religious authority', 'Military junta'], answer: 'B', explanation: 'The CCP maintains power through single-party rule, media/internet censorship, economic legitimacy (growth), surveillance technology, and suppression of political opposition.' },
    { type: 'sa', q: 'Compare the federal systems of the US and Mexico.', answer: 'centralized', explanation: 'Both have federal systems, but Mexico\'s has been historically more centralized under dominant-party rule (PRI). Mexico has democratized since 2000 but still faces challenges with corruption, drug violence, and institutional weakness.' },
    { type: 'mc', q: 'Iran\'s government is unique because:', choices: ['It is a pure democracy', 'It combines theocratic and republican elements with the Supreme Leader above elected officials', 'It has no elections', 'It is a monarchy'], answer: 'B', explanation: 'Iran has elected officials (President, Parliament) but the Supreme Leader (unelected cleric) holds ultimate authority, the Guardian Council vets candidates, and Islamic law overrides legislation.' },
    { type: 'mc', q: 'A presidential system differs from a parliamentary system in that:', choices: ['The executive is chosen from the legislature', 'The executive and legislature are independently elected with separate terms', 'There is no separation of powers', 'The legislature can easily remove the executive'], answer: 'B', explanation: 'In presidential systems, the president is independently elected and serves a fixed term. In parliamentary systems, the PM comes from and depends on legislative majority support.' },
    { type: 'sa', q: 'What factors contribute to democratic consolidation?', answer: 'institutions', explanation: 'Democratic consolidation requires strong institutions, rule of law, civil society, free press, economic development, and a political culture where democracy is accepted as "the only game in town."' },
    { type: 'mc', q: 'Devolution refers to:', choices: ['Evolution of political parties', 'Transfer of power from central to regional governments', 'Government collapse', 'Military takeover'], answer: 'B', explanation: 'Devolution is the transfer of power from central to regional governments (e.g., UK devolving power to Scotland, Wales, Northern Ireland), creating more local autonomy.' },
    { type: 'mc', q: 'Nigeria\'s political challenges include:', choices: ['Too much democracy', 'Ethnic/religious divisions, corruption, and military intervention history', 'Isolation from global trade', 'Overly strong institutions'], answer: 'B', explanation: 'Nigeria faces challenges from ethnic/religious divisions (Hausa-Fulani, Yoruba, Igbo; Muslim/Christian), corruption, legacy of military rule, and uneven oil wealth distribution.' },
    { type: 'mc', q: 'Supranational organizations like the EU:', choices: ['Replace national governments', 'Pool sovereignty from member states for shared governance on certain issues', 'Have no real power', 'Only address military matters'], answer: 'B', explanation: 'The EU pools sovereignty from member states on trade, regulations, and some policies, creating governance above the national level while members retain sovereignty in other areas.' },
  ],
};

const SOURCE_EXCERPTS = {
  'political-philosophy': { title: 'John Locke, Second Treatise of Government (1689)', text: '"The state of nature has a law of nature to govern it, which obliges every one: and reason, which is that law, teaches all mankind... that being all equal and independent, no one ought to harm another in his life, health, liberty, or possessions."', context: 'Locke established the philosophical foundation for natural rights and government by consent.' },
  'constitution-federalism': { title: 'Federalist No. 51 (1788)', text: '"If men were angels, no government would be necessary. If angels were to govern men, neither external nor internal controls on government would be necessary."', context: 'Madison argues for separation of powers and checks and balances as safeguards against tyranny.' },
  'three-branches': { title: 'Marbury v. Madison (1803)', text: '"It is emphatically the province and duty of the judicial department to say what the law is."', context: 'Chief Justice Marshall established judicial review — the courts\' power to determine constitutionality of laws.' },
  'civil-liberties': { title: 'Tinker v. Des Moines (1969)', text: '"It can hardly be argued that either students or teachers shed their constitutional rights to freedom of speech or expression at the schoolhouse gate."', context: 'The Court protected students\' First Amendment right to symbolic political speech in schools.' },
  'civil-rights': { title: 'Brown v. Board of Education (1954)', text: '"We conclude that in the field of public education the doctrine of \'separate but equal\' has no place. Separate educational facilities are inherently unequal."', context: 'The Warren Court unanimously struck down school segregation, overturning Plessy v. Ferguson.' },
  'political-parties-elections': { title: 'George Washington, Farewell Address (1796)', text: '"The alternate domination of one faction over another, sharpened by the spirit of revenge... is itself a frightful despotism."', context: 'Washington warned against the dangers of political parties and factionalism.' },
  'public-policy': { title: 'Federalist No. 10 (1787)', text: '"The regulation of these various and interfering interests forms the principal task of modern legislation, and involves the spirit of party and faction in the necessary and ordinary operations of the government."', context: 'Madison recognizes that managing competing interests is the central challenge of governance.' },
  'comparative-government': { title: 'Alexis de Tocqueville, Democracy in America (1835)', text: '"The greatness of America lies not in being more enlightened than any other nation, but rather in her ability to repair her faults."', context: 'Tocqueville analyzed American democracy\'s strengths and weaknesses from a comparative perspective.' },
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
  return { studentId: id, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(skill, count = 5) {
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}` };
  const items = pick(bank, count);
  return {
    type: 'government',
    skill,
    skillName: SKILLS[skill]?.name || skill,
    count: items.length,
    instruction: 'Answer each question. For multiple choice, respond with the letter. For short answer, provide a brief response.',
    items: items.map((item, i) => ({
      number: i + 1, type: item.type, question: item.q, choices: item.choices || null, answer: item.answer, explanation: item.explanation,
    })),
  };
}

function checkAnswer(type, expected, answer) {
  if (type === 'mc') return norm(expected) === norm(answer.charAt(0));
  return norm(answer).includes(norm(expected)) || norm(expected).includes(norm(answer));
}

// Public API

class HSGovernment {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  recordAssessment(id, skill, score, total, notes = '') {
    if (!SKILLS[skill]) throw new Error(`Unknown skill: ${skill}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, score, total, notes };
    p.assessments.push(entry);
    if (!p.skills[skill]) p.skills[skill] = { attempts: [] };
    p.skills[skill].attempts.push({ date: entry.date, score, total });
    p.skills[skill].mastery = calcMastery(p.skills[skill].attempts);
    p.skills[skill].label = masteryLabel(p.skills[skill].mastery);
    saveProfile(p);
    return { studentId: id, skill, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) {
      total++;
      const d = p.skills[sk];
      results[sk] = d ? { name: info.name, mastery: d.mastery, label: d.label } : { name: info.name, mastery: 0, label: 'not-started' };
      if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
    }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    for (const [sk, info] of Object.entries(SKILLS)) {
      const d = p.skills[sk];
      const m = d ? d.mastery : 0;
      if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, name: info.name, mastery: m, label: d ? d.label : 'not-started' });
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog() {
    const catalog = {};
    let total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) { total++; catalog[sk] = { name: info.name, topics: info.topics }; }
    return { skills: catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient! Great work on Government.', skills: Object.keys(SKILLS) };
    const exercise = generateExercise(target.skill, 5);
    const source = SOURCE_EXCERPTS[target.skill] || null;
    return {
      studentId: id, targetSkill: target, exercise, caseExcerpt: source,
      lessonPlan: {
        review: 'Review previously covered concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.name}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        source: source ? `Analyze case/document: "${source.title}"` : 'Review key SCOTUS cases and foundational documents',
        connect: 'Connect to constitutional principles and real-world governance',
      },
    };
  }
}

module.exports = HSGovernment;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new HSGovernment();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: start <id> [skill]');
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        if (skill) { out(api.generateExercise(skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, skill, sc, tot, ...notes] = args;
        if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node government.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'], skills: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
