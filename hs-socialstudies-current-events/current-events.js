// eClaw HS Current Events & Media Literacy Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-current-events');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'news-analysis': {
    'source-identification': { name: 'Source Identification & Credibility', category: 'news-analysis' },
    'bias-detection': { name: 'Bias Detection in News Reporting', category: 'news-analysis' },
    'fact-vs-opinion': { name: 'Distinguishing Fact from Opinion', category: 'news-analysis' },
    'headline-analysis': { name: 'Headline & Framing Analysis', category: 'news-analysis' },
    'contextual-reading': { name: 'Contextual & Critical Reading', category: 'news-analysis' },
  },
  'media-literacy-advanced': {
    'propaganda-techniques': { name: 'Propaganda & Persuasion Techniques', category: 'media-literacy-advanced' },
    'digital-literacy': { name: 'Digital & Social Media Literacy', category: 'media-literacy-advanced' },
    'data-visualization': { name: 'Data Visualization Interpretation', category: 'media-literacy-advanced' },
    'media-ownership': { name: 'Media Ownership & Influence', category: 'media-literacy-advanced' },
  },
  'domestic-policy': {
    'healthcare-policy': { name: 'Healthcare Policy Debates', category: 'domestic-policy' },
    'education-policy': { name: 'Education Policy Issues', category: 'domestic-policy' },
    'criminal-justice': { name: 'Criminal Justice Reform', category: 'domestic-policy' },
    'immigration-policy': { name: 'Immigration Policy', category: 'domestic-policy' },
    'environmental-regulation': { name: 'Environmental Regulation', category: 'domestic-policy' },
  },
  'foreign-policy': {
    'diplomacy-alliances': { name: 'Diplomacy & International Alliances', category: 'foreign-policy' },
    'military-intervention': { name: 'Military Intervention Debates', category: 'foreign-policy' },
    'trade-policy': { name: 'Trade Policy & Agreements', category: 'foreign-policy' },
    'humanitarian-intervention': { name: 'Humanitarian Aid & Intervention', category: 'foreign-policy' },
  },
  'global-issues': {
    'climate-change': { name: 'Climate Change & Global Response', category: 'global-issues' },
    'global-health': { name: 'Global Health Challenges', category: 'global-issues' },
    'human-rights': { name: 'Human Rights Issues', category: 'global-issues' },
    'technology-society': { name: 'Technology & Society', category: 'global-issues' },
    'global-inequality': { name: 'Global Inequality & Development', category: 'global-issues' },
  },
  'civic-participation': {
    'voting-elections': { name: 'Voting & Electoral Participation', category: 'civic-participation' },
    'advocacy-activism': { name: 'Advocacy & Civic Activism', category: 'civic-participation' },
    'community-engagement': { name: 'Community Engagement', category: 'civic-participation' },
    'informed-citizenship': { name: 'Informed Citizenship', category: 'civic-participation' },
  },
};

const CATEGORIES = Object.keys(SKILLS);

const QUESTION_BANKS = {
  'source-identification': [
    { type: 'mc', q: 'Which is the most reliable type of source for factual news reporting?', choices: ['Personal blog', 'Social media post', 'Wire service report (AP, Reuters)', 'Anonymous forum post'], answer: 'C', explanation: 'Wire services like AP and Reuters follow strict editorial standards, employ fact-checkers, and are used by news outlets worldwide as primary sources.' },
    { type: 'mc', q: 'A primary source in news reporting is:', choices: ['A newspaper editorial', 'An eyewitness account or official document', 'A Wikipedia summary', 'A textbook chapter'], answer: 'B', explanation: 'Primary sources provide direct, firsthand evidence — eyewitness accounts, official documents, original data, or direct quotes from those involved.' },
    { type: 'sa', q: 'What criteria should you use to evaluate whether a news source is credible?', answer: 'track record', explanation: 'Key criteria include: track record of accuracy, transparent corrections policy, named authors with expertise, editorial standards, separation of news and opinion, and funding transparency.' },
    { type: 'mc', q: 'The "CRAAP test" for evaluating sources examines:', choices: ['Cost, Reading level, Accuracy, Author, Publisher', 'Currency, Relevance, Authority, Accuracy, Purpose', 'Credibility, Research, Audience, Argument, Proof', 'Content, References, Attribution, Analysis, Perspective'], answer: 'B', explanation: 'CRAAP evaluates Currency (timeliness), Relevance (importance to your needs), Authority (source qualifications), Accuracy (reliability/truthfulness), and Purpose (reason the information exists).' },
    { type: 'mc', q: 'When a news article cites "anonymous sources," you should:', choices: ['Automatically dismiss it', 'Accept it without question', 'Look for corroboration from other outlets and consider the publication\'s track record', 'Share it widely on social media'], answer: 'C', explanation: 'Anonymous sources are sometimes necessary (whistleblowers, sensitive topics), but readers should seek corroboration and consider whether the outlet has a history of responsible use of anonymous sources.' },
    { type: 'sa', q: 'Why is it important to consult multiple news sources on the same story?', answer: 'perspective', explanation: 'Multiple sources provide different perspectives, help identify bias or omissions in any single account, enable fact-checking through cross-referencing, and give a more complete picture of complex events.' },
    { type: 'mc', q: 'A "retraction" in journalism means:', choices: ['An article was updated with new information', 'The publication formally withdraws a story because it was inaccurate', 'The article was moved behind a paywall', 'A source changed their statement'], answer: 'B', explanation: 'A retraction is a formal withdrawal of a published story because it contained significant inaccuracies. Responsible outlets publish retractions prominently as part of accountability.' },
    { type: 'mc', q: 'Peer-reviewed sources are considered more reliable because:', choices: ['They are free to access', 'Experts in the field have evaluated the methodology and conclusions', 'They are published by the government', 'They are longer than other sources'], answer: 'B', explanation: 'Peer review means independent experts scrutinize research methodology, data analysis, and conclusions before publication, reducing errors and improving quality.' },
  ],
  'bias-detection': [
    { type: 'mc', q: 'Selection bias in media occurs when:', choices: ['Reporters select the best photos', 'News outlets choose which stories to cover and which to ignore', 'Readers select their preferred outlet', 'Editors select the font'], answer: 'B', explanation: 'Selection bias (also called gatekeeping) means editorial decisions about which stories to cover — and which to omit — shape the audience\'s perception of what matters.' },
    { type: 'mc', q: '"Confirmation bias" in news consumption means:', choices: ['Confirming facts before publishing', 'Seeking out information that confirms existing beliefs while ignoring contradictory evidence', 'Getting a second source', 'Fact-checking a story'], answer: 'B', explanation: 'Confirmation bias leads people to seek, interpret, and remember information that confirms preexisting beliefs, creating echo chambers and filter bubbles.' },
    { type: 'sa', q: 'How can word choice reveal bias in a news article?', answer: 'loaded', explanation: 'Loaded or emotionally charged language ("slammed" vs. "criticized," "illegals" vs. "undocumented immigrants") reveals bias by framing subjects positively or negatively and influencing reader perception.' },
    { type: 'mc', q: 'A news outlet consistently covering only negative stories about a political party demonstrates:', choices: ['Good journalism', 'Story selection bias and potential partisan bias', 'Objectivity', 'Investigative reporting'], answer: 'B', explanation: 'Consistently negative coverage of one group while ignoring negative stories about another reveals partisan bias through selective story choice and framing.' },
    { type: 'mc', q: '"Both-sides" journalism can be problematic when:', choices: ['It provides balanced coverage', 'It gives equal weight to a well-supported position and a fringe view, creating false equivalence', 'It interviews multiple sources', 'It covers international stories'], answer: 'B', explanation: 'False balance/false equivalence treats fringe positions as equal to well-established consensus (e.g., climate denial alongside climate science), misleading audiences about the state of evidence.' },
    { type: 'mc', q: 'Which technique helps identify bias in a news article?', choices: ['Reading only the headline', 'Comparing coverage of the same event across outlets with different editorial perspectives', 'Trusting the first result on social media', 'Only reading sources you agree with'], answer: 'B', explanation: 'Comparing coverage across the political spectrum reveals how framing, source selection, and emphasis differ, helping readers identify bias and construct a more complete understanding.' },
    { type: 'sa', q: 'What is the difference between editorial bias and reporting bias?', answer: 'opinion', explanation: 'Editorial bias is expected — opinion pages explicitly advocate positions. Reporting bias is problematic — it occurs when supposedly objective news coverage is slanted through word choice, source selection, story placement, or framing.' },
    { type: 'mc', q: 'An "echo chamber" in media consumption refers to:', choices: ['A recording studio', 'An environment where one is only exposed to opinions that reinforce their own', 'A fact-checking organization', 'A press conference room'], answer: 'B', explanation: 'Echo chambers form when people consume only media that confirms their existing views, reinforced by social media algorithms that prioritize engagement over diverse perspectives.' },
  ],
  'fact-vs-opinion': [
    { type: 'mc', q: 'Which statement is a fact?', choices: ['The president\'s policy is harmful to the economy', 'The unemployment rate fell to 3.5% in December', 'Congress should pass stricter gun laws', 'Immigration is the most important issue'], answer: 'B', explanation: 'Facts are verifiable statements that can be proven true or false with evidence. The unemployment rate is a measurable statistic, while the others express judgments or preferences.' },
    { type: 'mc', q: 'An "editorial" is best described as:', choices: ['An objective news report', 'A publication\'s official opinion on an issue', 'A fact-checked investigation', 'A press release'], answer: 'B', explanation: 'Editorials represent the official position of a publication\'s editorial board, explicitly offering opinions and arguments. They are clearly labeled and separate from news reporting.' },
    { type: 'sa', q: 'How can opinions be disguised as facts in news articles?', answer: 'presented', explanation: 'Opinions can be disguised through presenting interpretations as established facts, using vague attributions ("experts say"), mixing factual statements with value judgments, and omitting qualifying language.' },
    { type: 'mc', q: 'The phrase "many people believe" in a news article is problematic because:', choices: ['It is always accurate', 'It presents an unverified claim as if it were widely held without providing evidence', 'It cites too many sources', 'It is grammatically incorrect'], answer: 'B', explanation: '"Many people believe" is a weasel phrase that asserts something is widely believed without providing polling data, specific sources, or verifiable evidence to support the claim.' },
    { type: 'mc', q: 'A "fact-check" article is most useful when it:', choices: ['Simply says "true" or "false"', 'Provides evidence, context, and explains the reasoning behind its rating', 'Agrees with your existing view', 'Is published by a politician'], answer: 'B', explanation: 'Effective fact-checks provide the original claim, evidence examined, context that may be missing, methodology used, and transparent reasoning — not just a rating.' },
    { type: 'mc', q: 'The statement "The economy grew 2.3% last quarter but should have grown faster" contains:', choices: ['Only facts', 'Only opinions', 'A fact followed by an opinion', 'Neither facts nor opinions'], answer: 'C', explanation: 'The growth rate is a verifiable fact; "should have grown faster" is a value judgment/opinion about whether that rate is adequate, mixing both in one sentence.' },
    { type: 'sa', q: 'Why is it important for citizens to distinguish between fact and opinion in media?', answer: 'informed', explanation: 'Distinguishing fact from opinion is essential for informed decision-making, preventing manipulation, evaluating policy proposals on evidence rather than rhetoric, and maintaining a functioning democracy that depends on an informed citizenry.' },
    { type: 'mc', q: 'Statistical claims in news should be evaluated by:', choices: ['Accepting them at face value', 'Checking the sample size, methodology, who funded the study, and whether the data is being used in context', 'Ignoring all statistics', 'Only trusting government statistics'], answer: 'B', explanation: 'Critical evaluation of statistics includes checking methodology, sample size, margin of error, who conducted/funded the research, and whether data is presented in proper context.' },
  ],
  'headline-analysis': [
    { type: 'mc', q: '"Clickbait" headlines are designed primarily to:', choices: ['Inform readers accurately', 'Generate clicks and ad revenue through sensationalized or misleading text', 'Summarize the article fairly', 'Meet journalistic standards'], answer: 'B', explanation: 'Clickbait prioritizes engagement metrics over accuracy, using emotional language, curiosity gaps, and sometimes misleading framing to maximize clicks regardless of content quality.' },
    { type: 'mc', q: 'The "framing effect" in headlines refers to:', choices: ['The physical layout of the page', 'How word choice and emphasis shape reader interpretation before reading the article', 'Putting headlines in quotation marks', 'Using larger fonts'], answer: 'B', explanation: 'Framing through headlines shapes perception: "Tax Reform Passes" vs. "Tax Cuts for the Wealthy Pass" describe the same event but prime readers with different interpretations.' },
    { type: 'sa', q: 'How can the same event be framed differently by two news outlets through their headlines?', answer: 'emphasis', explanation: 'Different outlets emphasize different aspects: a protest can be framed as "Thousands March for Justice" or "Protest Blocks Downtown Traffic." Word choice, what is highlighted vs. omitted, and emotional tone all shape the frame.' },
    { type: 'mc', q: 'A headline that says "DESTROYS" or "SLAMS" is likely:', choices: ['Objective reporting', 'Using sensationalized language to increase engagement', 'Quoting someone directly', 'A breaking news alert'], answer: 'B', explanation: 'Hyperbolic verbs like "destroys," "slams," "eviscerates" in headlines are sensationalized language designed for engagement rather than accurate description of events.' },
    { type: 'mc', q: 'When a headline includes a question mark, it often:', choices: ['Presents a confirmed fact', 'Uses "Betteridge\'s Law" — implies something that may not be true or well-supported', 'Is more reliable than declarative headlines', 'Is from an academic source'], answer: 'B', explanation: 'Betteridge\'s Law of Headlines suggests that any headline ending in a question mark can be answered "no." Question headlines often imply unconfirmed claims while maintaining deniability.' },
    { type: 'mc', q: 'An effective critical reader should:', choices: ['Only read headlines', 'Read the full article and evaluate whether the headline accurately represents the content', 'Share articles based on headlines alone', 'Assume all headlines are accurate'], answer: 'B', explanation: 'Headlines often oversimplify or sensationalize. Critical readers should read the full article to assess whether the headline accurately represents the nuance and substance of the story.' },
  ],
  'contextual-reading': [
    { type: 'mc', q: 'Historical context is important in news analysis because:', choices: ['It makes articles longer', 'Current events are shaped by historical patterns, policies, and conflicts', 'It is required by law', 'It only matters for history classes'], answer: 'B', explanation: 'Understanding historical context helps readers see how current events connect to longer patterns, why certain policies exist, and what precedents inform today\'s decisions.' },
    { type: 'sa', q: 'What does it mean to "read against the grain" of a news article?', answer: 'question', explanation: 'Reading against the grain means questioning the article\'s assumptions, noting what is left out, considering whose perspective is centered and whose is marginalized, and asking what alternative interpretations exist.' },
    { type: 'mc', q: 'When a news article lacks important context, readers should:', choices: ['Accept the story as presented', 'Seek additional sources that provide background, history, and multiple perspectives', 'Ignore the story entirely', 'Write an angry comment'], answer: 'B', explanation: 'Responsible news consumption involves seeking context from additional sources, including background articles, expert analyses, and primary documents that help fill gaps.' },
    { type: 'mc', q: 'Understanding the "news cycle" is important because:', choices: ['It determines what time news airs', 'Stories can be oversimplified or dropped prematurely due to the pace of the news cycle', 'It only affects TV news', 'It is controlled by the government'], answer: 'B', explanation: 'The 24-hour news cycle and social media acceleration can lead to incomplete reporting, premature conclusions, and important stories being displaced by newer but less significant ones.' },
    { type: 'mc', q: 'A news article about a policy should ideally include:', choices: ['Only the politician\'s statement', 'Multiple perspectives including affected communities, experts, and historical context', 'Only statistics', 'The reporter\'s personal opinion'], answer: 'B', explanation: 'Comprehensive policy coverage includes the policy details, stakeholder perspectives, expert analysis, historical context, potential impacts on different communities, and relevant data.' },
    { type: 'sa', q: 'Why is understanding the publication date important when evaluating news?', answer: 'outdated', explanation: 'Publication date matters because information can become outdated, situations evolve rapidly, and sharing old news as current can mislead. Context about what was known at the time of publication vs. what is known now is essential.' },
  ],
  'propaganda-techniques': [
    { type: 'mc', q: 'The "bandwagon" propaganda technique works by:', choices: ['Providing logical arguments', 'Appealing to the desire to conform — "everyone is doing it"', 'Citing expert opinions', 'Using factual evidence'], answer: 'B', explanation: 'Bandwagon exploits social pressure and the desire to belong, arguing that because many people support something, you should too — bypassing critical thinking.' },
    { type: 'mc', q: 'A "straw man" argument:', choices: ['Uses agricultural metaphors', 'Misrepresents an opponent\'s position to make it easier to attack', 'Is a strong logical argument', 'Presents accurate counterpoints'], answer: 'B', explanation: 'A straw man distorts or exaggerates an opponent\'s argument to create a weaker version that is easier to refute, rather than addressing the actual position.' },
    { type: 'sa', q: 'How does emotional appeal (pathos) function as a propaganda technique?', answer: 'bypass', explanation: 'Emotional appeals use fear, anger, sympathy, or outrage to bypass rational analysis, making audiences more susceptible to accepting claims without evaluating evidence. Images of suffering children, dramatic music, and urgent language are common tools.' },
    { type: 'mc', q: '"Whataboutism" is a deflection technique that:', choices: ['Asks productive questions', 'Responds to criticism by pointing to someone else\'s wrongdoing rather than addressing the original issue', 'Provides additional context', 'Strengthens an argument'], answer: 'B', explanation: 'Whataboutism deflects from the issue at hand by saying "what about [unrelated wrongdoing]?" It avoids accountability and prevents productive discourse on the original topic.' },
    { type: 'mc', q: 'The "appeal to authority" fallacy occurs when:', choices: ['Citing a qualified expert', 'Using a celebrity or unqualified figure as evidence for a claim outside their expertise', 'Referencing peer-reviewed research', 'Quoting an official statement'], answer: 'B', explanation: 'Appeal to authority becomes fallacious when the cited "authority" lacks relevant expertise (e.g., an actor endorsing medical treatments) or when authority is used to shut down legitimate debate.' },
    { type: 'mc', q: '"Loaded language" in propaganda refers to:', choices: ['Technical vocabulary', 'Words chosen specifically to trigger strong emotional reactions rather than convey neutral information', 'Foreign language phrases', 'Legal terminology'], answer: 'B', explanation: 'Loaded language uses emotionally charged words to influence perception: "freedom fighters" vs. "insurgents," "reform" vs. "overhaul" carry different connotations that shape interpretation.' },
    { type: 'sa', q: 'What is "astroturfing" and why is it deceptive?', answer: 'fake grassroots', explanation: 'Astroturfing creates the false impression of widespread grassroots support through fake social media accounts, paid commenters, or manufactured movements. It is deceptive because it disguises organized campaigns as organic public opinion.' },
    { type: 'mc', q: 'The "slippery slope" fallacy argues that:', choices: ['One action will inevitably lead to extreme consequences without providing evidence for each step', 'Change is always good', 'Moderate positions are best', 'Evidence should guide decisions'], answer: 'A', explanation: 'Slippery slope claims that one action will trigger a chain of increasingly extreme events without demonstrating the causal links between steps, used to generate fear of any initial change.' },
  ],
  'digital-literacy': [
    { type: 'mc', q: 'Social media algorithms primarily promote content that:', choices: ['Is most accurate', 'Generates the most engagement (likes, shares, comments), regardless of accuracy', 'Is from verified sources', 'Is educational'], answer: 'B', explanation: 'Algorithms optimize for engagement metrics, which often means promoting sensational, emotional, or controversial content over accurate but less engaging material.' },
    { type: 'mc', q: 'A "deepfake" is:', choices: ['A very convincing lie', 'AI-generated audio or video that realistically depicts someone saying or doing something they never did', 'A fake news website', 'A phishing email'], answer: 'B', explanation: 'Deepfakes use artificial intelligence to create realistic but fabricated audio or video, posing serious threats to trust in media and creating potential for political manipulation.' },
    { type: 'sa', q: 'How do filter bubbles affect political discourse?', answer: 'isolate', explanation: 'Filter bubbles isolate users in information environments that reinforce existing beliefs, reducing exposure to diverse viewpoints, increasing polarization, and making it harder to find common ground or understand opposing perspectives.' },
    { type: 'mc', q: 'Before sharing a news article on social media, you should:', choices: ['Share it immediately if the headline aligns with your views', 'Read the full article, check the source, verify claims, and consider potential impact', 'Only share if it has many likes', 'Never share news'], answer: 'B', explanation: 'Responsible sharing requires reading beyond the headline, evaluating source credibility, checking for corroboration, and considering whether sharing contributes to informed discourse or spreads misinformation.' },
    { type: 'mc', q: 'Bots on social media are concerning because they can:', choices: ['Only post advertisements', 'Amplify misinformation, create illusions of consensus, and manipulate public opinion at scale', 'Only follow celebrities', 'Improve discourse quality'], answer: 'B', explanation: 'Social media bots can rapidly spread misinformation, create false trends, simulate grassroots movements, harass users, and distort public perception of how widely an idea is supported.' },
    { type: 'mc', q: 'A reverse image search is useful for:', choices: ['Finding higher resolution images', 'Verifying whether an image is being used in its original context or has been repurposed/manipulated', 'Editing photos', 'Creating memes'], answer: 'B', explanation: 'Reverse image search reveals where an image has appeared before, helping identify if it is being used out of context, is from a different event, or has been digitally altered.' },
    { type: 'sa', q: 'What role does digital literacy play in protecting democracy?', answer: 'informed', explanation: 'Digital literacy enables citizens to identify misinformation, resist manipulation, evaluate sources critically, and participate in informed democratic discourse — essential when digital media is the primary information source for most people.' },
  ],
  'data-visualization': [
    { type: 'mc', q: 'A truncated y-axis on a bar chart can mislead by:', choices: ['Making the chart more readable', 'Exaggerating small differences to appear dramatic', 'Showing more data', 'Improving accuracy'], answer: 'B', explanation: 'Starting the y-axis above zero exaggerates visual differences between bars. A 1% change can appear enormous if the axis only shows 49-51%, manipulating perception of the data.' },
    { type: 'mc', q: 'Cherry-picking data in a chart means:', choices: ['Selecting the best visualization type', 'Selecting only data points that support a predetermined conclusion while ignoring contradictory data', 'Using red color for data points', 'Organizing data chronologically'], answer: 'B', explanation: 'Cherry-picking selects favorable data while omitting unfavorable data, creating a misleading picture. Showing only certain years, demographics, or metrics can reverse the apparent conclusion.' },
    { type: 'sa', q: 'How can the same data set be used to support opposing arguments?', answer: 'framing', explanation: 'The same data can support different conclusions through different time frames, different baselines for comparison, different scales, different metrics (absolute vs. percentage), and different subsets of the data being emphasized.' },
    { type: 'mc', q: 'When a news article presents a pie chart showing survey results, you should check:', choices: ['Only the colors used', 'Sample size, who conducted the survey, question wording, and margin of error', 'Only the largest slice', 'Whether it looks professional'], answer: 'B', explanation: 'Survey methodology matters enormously: small samples, biased question wording, self-selected respondents, or misleading presentation can produce data that misrepresents reality.' },
    { type: 'mc', q: 'Correlation shown in a graph does NOT prove:', choices: ['That two variables are related', 'Causation — that one variable causes changes in the other', 'That data was collected', 'That a trend exists'], answer: 'B', explanation: 'Correlation shows two variables move together, but does not prove one causes the other. A third variable may cause both, or the relationship may be coincidental.' },
    { type: 'mc', q: 'A misleading map projection can distort:', choices: ['Only ocean colors', 'The relative size and shape of countries, reinforcing geographic biases', 'Only text labels', 'Nothing significant'], answer: 'B', explanation: 'Map projections distort reality differently: Mercator enlarges areas near poles (making Europe/North America appear larger), which can reinforce perceptions of relative importance.' },
  ],
  'media-ownership': [
    { type: 'mc', q: 'Media consolidation refers to:', choices: ['Newspapers getting thicker', 'Fewer corporations owning more media outlets, reducing diversity of voices', 'More independent journalism', 'Government-run media'], answer: 'B', explanation: 'Media consolidation means fewer companies control more outlets (TV, radio, newspapers, digital). This can reduce viewpoint diversity and increase corporate influence over news content.' },
    { type: 'sa', q: 'How can corporate ownership of media outlets affect news coverage?', answer: 'conflict', explanation: 'Corporate owners may discourage coverage of their business interests, advertisers, or political allies, creating conflicts of interest. Coverage of labor issues, environmental regulation, or corporate misconduct may be suppressed or softened.' },
    { type: 'mc', q: 'State-run media differs from independent media in that:', choices: ['It is always more accurate', 'The government controls editorial content, often serving propaganda purposes', 'It has higher production values', 'It is always in print form'], answer: 'B', explanation: 'State-run media (e.g., RT, CCTV, KCNA) serves government interests with editorial content controlled or influenced by the state, unlike independent media with editorial independence from government.' },
    { type: 'mc', q: 'The decline of local newspapers has led to:', choices: ['Better news coverage', '"News deserts" where communities lack local news coverage, reducing accountability', 'More informed communities', 'Stronger democracy'], answer: 'B', explanation: 'News deserts — areas without local news coverage — correlate with lower voter turnout, increased corruption, higher municipal borrowing costs, and reduced civic engagement.' },
    { type: 'mc', q: 'A news outlet\'s funding model matters because:', choices: ['Funding has no impact on content', 'Revenue sources (ads, subscriptions, donors, government) can create incentives that influence coverage priorities', 'Only subscription models are reliable', 'All funding models produce identical coverage'], answer: 'B', explanation: 'Funding affects incentives: ad-driven models prioritize engagement, subscription models serve paying readers, donor-funded outlets may reflect donors\' interests, and government funding raises independence concerns.' },
    { type: 'sa', q: 'What is the role of public media (e.g., PBS, NPR) in the media landscape?', answer: 'public interest', explanation: 'Public media aims to serve the public interest rather than maximize profit, providing educational content, in-depth reporting, and coverage of topics commercial media may neglect. Debates continue about funding levels and political independence.' },
  ],
  'healthcare-policy': [
    { type: 'mc', q: 'The Affordable Care Act (ACA) primarily aimed to:', choices: ['Create a single-payer system', 'Expand health insurance coverage through marketplaces, Medicaid expansion, and insurance reforms', 'Eliminate Medicare', 'Privatize all healthcare'], answer: 'B', explanation: 'The ACA expanded coverage through health insurance marketplaces, Medicaid expansion (optional by state), protections for pre-existing conditions, and the individual mandate.' },
    { type: 'mc', q: 'A single-payer healthcare system means:', choices: ['Only one doctor per patient', 'The government is the sole insurer, funded by taxes, covering all residents', 'Only private insurance is allowed', 'Healthcare is free without any cost'], answer: 'B', explanation: 'Single-payer means one entity (usually government) pays for all healthcare, funded through taxes. Canada and Taiwan have single-payer systems; the US has a mixed system.' },
    { type: 'sa', q: 'What are the main arguments for and against universal healthcare in the US?', answer: 'cost', explanation: 'For: covers everyone, reduces administrative costs, improves public health, moral imperative. Against: higher taxes, potential quality reduction, long wait times, government overreach, loss of choice.' },
    { type: 'mc', q: 'Medicare and Medicaid differ in that:', choices: ['They are the same program', 'Medicare covers people 65+ and some disabled; Medicaid covers low-income individuals', 'Both are only for veterans', 'Neither is a government program'], answer: 'B', explanation: 'Medicare is a federal program for those 65+ and some disabled individuals. Medicaid is a joint federal-state program for low-income people, with eligibility varying by state.' },
    { type: 'mc', q: 'Prescription drug pricing is a current policy debate because:', choices: ['Drugs are inexpensive in the US', 'US drug prices are significantly higher than other developed nations, affecting affordability', 'Drug prices are set by international law', 'Only generic drugs exist'], answer: 'B', explanation: 'The US pays far more for prescription drugs than other countries due to patent protections, lack of government price negotiation (until recent legislation), and market-based pricing.' },
    { type: 'mc', q: 'The opioid crisis is a public health issue involving:', choices: ['Only illegal drugs', 'Widespread addiction to both prescription and illegal opioids, causing mass overdose deaths', 'Only affects one state', 'Has been fully resolved'], answer: 'B', explanation: 'The opioid epidemic involves prescription painkillers, heroin, and synthetic opioids (fentanyl), causing hundreds of thousands of deaths and raising questions about pharmaceutical accountability and public health response.' },
  ],
  'education-policy': [
    { type: 'mc', q: 'School choice advocates argue that:', choices: ['All schools should be identical', 'Parents should be able to choose among public, charter, and private schools, with funding following the student', 'Only public schools should exist', 'Education should not be compulsory'], answer: 'B', explanation: 'School choice proponents argue competition improves quality and that parents deserve options. Critics argue it diverts funding from public schools and increases inequality.' },
    { type: 'sa', q: 'What are the arguments surrounding standardized testing in education?', answer: 'measure', explanation: 'For: provides objective measures, identifies achievement gaps, holds schools accountable. Against: narrows curriculum to test prep, biased against disadvantaged students, causes stress, measures socioeconomic status more than learning.' },
    { type: 'mc', q: 'The student debt crisis involves:', choices: ['Students having too many textbooks', 'Rising tuition costs and $1.7+ trillion in student loan debt affecting economic decisions', 'Only graduate students', 'Debt that is easily forgiven'], answer: 'B', explanation: 'Student debt exceeds $1.7 trillion, affecting career choices, homeownership, family formation, and retirement savings. Debates center on forgiveness, free college, and cost-reduction strategies.' },
    { type: 'mc', q: 'Charter schools differ from traditional public schools in that:', choices: ['They are private schools', 'They are publicly funded but independently operated with more flexibility', 'They charge tuition', 'They only serve gifted students'], answer: 'B', explanation: 'Charter schools receive public funding but operate independently of traditional school district oversight, with more curricular and operational flexibility in exchange for accountability through their charter agreement.' },
    { type: 'mc', q: 'The digital divide in education refers to:', choices: ['Disagreement about technology in schools', 'Unequal access to technology and internet, creating educational disparities', 'Using too much technology', 'The divide between STEM and humanities'], answer: 'B', explanation: 'The digital divide means students from lower-income families have less access to devices and reliable internet, putting them at a disadvantage for online learning and digital literacy.' },
    { type: 'mc', q: 'Debates about curriculum content often center on:', choices: ['Font choice in textbooks', 'What histories and perspectives are included, representing whose stories and values', 'The color of school buildings', 'Length of the school day only'], answer: 'B', explanation: 'Curriculum debates involve whose histories are centered, how controversial topics are taught, representation of diverse perspectives, and the values embedded in educational materials.' },
  ],
  'criminal-justice': [
    { type: 'mc', q: 'Mass incarceration in the US refers to:', choices: ['Normal imprisonment rates', 'The US having the highest incarceration rate in the world, disproportionately affecting minorities', 'Prison overcrowding in one state', 'Only violent crime sentencing'], answer: 'B', explanation: 'The US has roughly 2 million incarcerated people — the highest rate globally — with significant racial disparities, driven by mandatory minimums, the war on drugs, and three-strikes laws.' },
    { type: 'sa', q: 'What are the arguments for and against police reform?', answer: 'accountability', explanation: 'For reform: address use-of-force disparities, increase accountability/transparency, reduce racial profiling, improve community trust. Against: could reduce officer safety, undermine law enforcement effectiveness, and increase crime.' },
    { type: 'mc', q: 'Cash bail reform advocates argue that:', choices: ['Bail should be higher', 'The current system punishes poverty, keeping people jailed before trial based on inability to pay', 'All suspects should be detained', 'Bail is unconstitutional'], answer: 'B', explanation: 'Cash bail reform argues that tying pretrial release to payment discriminates against the poor, results in job loss and family disruption, and pressures innocent people to plead guilty.' },
    { type: 'mc', q: 'Recidivism refers to:', choices: ['A type of crime', 'The tendency of formerly incarcerated individuals to reoffend and return to prison', 'A sentencing guideline', 'A legal defense'], answer: 'B', explanation: 'Recidivism rates (roughly 44% within one year) highlight questions about whether the criminal justice system rehabilitates or merely punishes, and whether reentry support is adequate.' },
    { type: 'mc', q: 'Restorative justice differs from retributive justice in that:', choices: ['It is more punitive', 'It focuses on repairing harm through dialogue between victims and offenders rather than solely punishing', 'It eliminates all consequences', 'It only applies to juvenile cases'], answer: 'B', explanation: 'Restorative justice brings victims, offenders, and community together to address harm, seeking accountability, healing, and reintegration rather than focusing solely on punishment.' },
    { type: 'mc', q: 'The debate over mandatory minimum sentences involves:', choices: ['Only drug crimes', 'Whether fixed minimum sentences reduce judicial discretion, increase incarceration, and create racial disparities', 'Increasing all sentences', 'Only federal cases'], answer: 'B', explanation: 'Mandatory minimums remove judicial discretion, leading to sentences that may not fit individual circumstances. Critics argue they drive mass incarceration and racial disparities; supporters say they ensure consistent punishment.' },
  ],
  'immigration-policy': [
    { type: 'mc', q: 'DACA (Deferred Action for Childhood Arrivals) provides:', choices: ['A path to citizenship', 'Temporary protection from deportation for people brought to the US as children', 'Permanent residency', 'Only work permits'], answer: 'B', explanation: 'DACA provides temporary renewable protection from deportation and work authorization for individuals brought to the US as children, but does not provide a path to citizenship.' },
    { type: 'sa', q: 'What are the economic arguments for and against immigration?', answer: 'labor', explanation: 'For: fills labor shortages, increases innovation, boosts GDP, pays taxes, starts businesses. Against: may depress wages for low-skilled workers, strains public services, competition for jobs. Most economists find net economic benefits.' },
    { type: 'mc', q: 'Asylum seekers differ from other immigrants in that they:', choices: ['Are always granted entry', 'Are seeking protection from persecution in their home country based on international law', 'Have work visas', 'Are the same as tourists'], answer: 'B', explanation: 'Asylum seekers claim protection under international and US law from persecution based on race, religion, nationality, political opinion, or membership in a particular social group.' },
    { type: 'mc', q: 'Border security debates often center on:', choices: ['Only physical barriers', 'Balancing national security with humanitarian obligations, cost-effectiveness, and civil liberties', 'Eliminating all immigration', 'Only visa overstays'], answer: 'B', explanation: 'Border policy involves complex tradeoffs between security, humanitarian obligations (asylum law), cost-effectiveness of different approaches, civil liberties, and economic impacts.' },
    { type: 'mc', q: 'The US immigration system uses which category for most legal immigrants?', choices: ['Lottery only', 'Family-based, employment-based, diversity lottery, and refugee/asylee categories', 'Open borders', 'Only employment-based'], answer: 'B', explanation: 'Legal immigration uses multiple pathways: family-sponsored (largest category), employment-based, diversity visa lottery, and refugee/asylum admissions, each with annual caps and waiting periods.' },
    { type: 'mc', q: 'Sanctuary cities are controversial because they:', choices: ['Harbor criminals', 'Limit local cooperation with federal immigration enforcement, raising questions about federalism', 'Have no police', 'Are unconstitutional'], answer: 'B', explanation: 'Sanctuary policies limit local law enforcement cooperation with ICE, raising debates about federalism, public safety (supporters say they increase trust and reporting), and immigration enforcement.' },
  ],
  'environmental-regulation': [
    { type: 'mc', q: 'The Clean Air Act primarily:', choices: ['Regulates water pollution', 'Regulates air emissions from stationary and mobile sources to protect public health', 'Only applies to factories', 'Was repealed in 2000'], answer: 'B', explanation: 'The Clean Air Act (1970, amended 1990) authorizes the EPA to regulate air pollutants, set air quality standards, and limit emissions from vehicles, power plants, and industrial sources.' },
    { type: 'sa', q: 'What are the arguments for and against carbon pricing?', answer: 'market', explanation: 'For: uses market mechanisms to reduce emissions efficiently, generates revenue, encourages innovation. Against: regressive (hurts low-income), may harm economic competitiveness, difficult to set correct price, politically unpopular.' },
    { type: 'mc', q: 'Environmental justice refers to:', choices: ['Punishing polluters', 'The principle that all communities deserve equal protection from environmental hazards regardless of race or income', 'Only wildlife protection', 'International environmental law'], answer: 'B', explanation: 'Environmental justice addresses the disproportionate exposure of low-income and minority communities to pollution, hazardous waste, and environmental degradation.' },
    { type: 'mc', q: 'The Paris Climate Agreement requires:', choices: ['Binding emissions cuts enforced by the UN', 'Countries to set voluntary nationally determined contributions to reduce greenhouse gas emissions', 'The US to eliminate all fossil fuels', 'Only developing nations to act'], answer: 'B', explanation: 'The Paris Agreement sets a framework for voluntary national climate pledges (NDCs) aiming to limit warming to 1.5-2 degrees C, without binding enforcement mechanisms.' },
    { type: 'mc', q: 'The debate over fossil fuel regulation involves:', choices: ['Only coal', 'Balancing energy security and economic interests against climate change and public health impacts', 'Fossil fuels have no environmental impact', 'Only international policy'], answer: 'B', explanation: 'Fossil fuel policy involves tradeoffs between energy security, economic impacts (jobs, energy costs), climate change mitigation, public health (air pollution), and transition to renewable alternatives.' },
    { type: 'mc', q: 'NIMBY ("Not In My Back Yard") is relevant to environmental policy because:', choices: ['It is a recycling program', 'Communities may support environmental goals in theory but oppose local projects like wind farms or waste facilities', 'It only applies to housing', 'It is a government agency'], answer: 'B', explanation: 'NIMBY describes opposition to locally unwanted land uses (waste sites, power plants, wind farms), even when residents support the broader policy, creating challenges for environmental project siting.' },
  ],
  'diplomacy-alliances': [
    { type: 'mc', q: 'NATO is primarily:', choices: ['An economic organization', 'A military alliance where an attack on one member is considered an attack on all (Article 5)', 'A United Nations agency', 'A trade agreement'], answer: 'B', explanation: 'NATO (North Atlantic Treaty Organization) is a collective defense alliance. Article 5 commits members to mutual defense, invoked only once — after September 11, 2001.' },
    { type: 'mc', q: 'The United Nations Security Council has:', choices: ['No real power', 'Five permanent members with veto power (US, UK, France, Russia, China)', 'Equal representation of all nations', 'Only advisory authority'], answer: 'B', explanation: 'The UNSC P5 each have veto power over substantive resolutions, giving them outsized influence. This structure reflects post-WWII power dynamics and is frequently criticized.' },
    { type: 'sa', q: 'What are the arguments for and against multilateralism in foreign policy?', answer: 'legitimacy', explanation: 'For: greater legitimacy, shared burden, more resources, broader expertise, sustainable solutions. Against: slower decision-making, lowest-common-denominator outcomes, sovereignty concerns, free-rider problem.' },
    { type: 'mc', q: 'Economic sanctions are used to:', choices: ['Improve trade', 'Pressure nations to change behavior by restricting trade, financial transactions, or travel', 'Only punish individuals', 'Strengthen alliances'], answer: 'B', explanation: 'Sanctions restrict economic activity to pressure governments, but debates persist about their effectiveness, humanitarian impact on civilian populations, and whether they actually change state behavior.' },
    { type: 'mc', q: 'Soft power in diplomacy refers to:', choices: ['Military might', 'Influencing others through culture, values, and policies rather than coercion', 'Economic sanctions', 'Nuclear deterrence'], answer: 'B', explanation: 'Joseph Nye\'s concept of soft power describes influence through attraction rather than coercion — cultural appeal, democratic values, development aid, and diplomatic engagement.' },
    { type: 'mc', q: 'The concept of sovereignty in international relations means:', choices: ['One nation controls all others', 'A state has supreme authority within its territory and independence from external control', 'The UN governs all nations', 'There are no borders'], answer: 'B', explanation: 'Sovereignty — the principle that states have exclusive authority within their borders — is foundational to international law but increasingly challenged by globalization, human rights norms, and transnational threats.' },
  ],
  'military-intervention': [
    { type: 'mc', q: 'The War Powers Resolution (1973) requires the President to:', choices: ['Declare war unilaterally', 'Notify Congress within 48 hours of deploying troops and withdraw within 60 days without authorization', 'Consult the UN first', 'Get Supreme Court approval'], answer: 'B', explanation: 'The War Powers Resolution attempts to check presidential military power by requiring notification and a 60-day limit without Congressional authorization, though its effectiveness is debated.' },
    { type: 'sa', q: 'What criteria make up the "just war" theory?', answer: 'cause', explanation: 'Just war theory requires: just cause (self-defense, preventing atrocity), right authority, right intention, last resort, proportionality, probability of success, and discrimination (protecting civilians). It has been debated since Augustine and Aquinas.' },
    { type: 'mc', q: 'The debate over drone warfare centers on:', choices: ['Only cost', 'Precision vs. civilian casualties, legal authority, sovereignty violations, and accountability', 'They are universally accepted', 'Only technology questions'], answer: 'B', explanation: 'Drone strikes raise questions about civilian casualties, legal authority for targeted killings, sovereignty of nations where strikes occur, transparency, and the psychological effects of remote warfare.' },
    { type: 'mc', q: 'Nation-building efforts after military intervention have:', choices: ['Always succeeded', 'Had mixed results, often failing when they ignore local context, institutions, and culture', 'Never been attempted', 'Only succeeded in Europe'], answer: 'B', explanation: 'Post-WWII Germany and Japan succeeded, but Iraq, Afghanistan, Libya, and Somalia demonstrate that nation-building is extremely difficult without understanding of local dynamics, institutions, and long-term commitment.' },
    { type: 'mc', q: 'The Responsibility to Protect (R2P) doctrine holds that:', choices: ['Nations have no obligations to others', 'The international community has a responsibility to intervene when a state fails to protect its people from genocide, war crimes, ethnic cleansing, and crimes against humanity', 'Only the UN can use force', 'Military intervention is never justified'], answer: 'B', explanation: 'R2P (adopted 2005) asserts that sovereignty entails responsibility, and when states fail to protect populations from mass atrocities, the international community may intervene — though application remains contested.' },
    { type: 'mc', q: 'Isolationism in US foreign policy advocates:', choices: ['Aggressive intervention', 'Limiting US involvement in foreign conflicts and alliances to focus on domestic issues', 'Joining every international organization', 'Global military expansion'], answer: 'B', explanation: 'Isolationism argues the US should avoid foreign entanglements, focus on domestic needs, and let other nations manage their own conflicts. It contrasts with internationalism and has cycled in American politics.' },
  ],
  'trade-policy': [
    { type: 'mc', q: 'A trade deficit means:', choices: ['A country exports more than it imports', 'A country imports more goods and services than it exports', 'Trade is balanced', 'The country has no trade'], answer: 'B', explanation: 'A trade deficit occurs when imports exceed exports. The US has run persistent trade deficits. Economists debate whether deficits are harmful or simply reflect consumer preferences and investment flows.' },
    { type: 'sa', q: 'How do trade wars affect consumers and workers differently?', answer: 'prices', explanation: 'Consumers face higher prices on imported goods and domestic goods that use imported materials. Workers in protected industries may benefit from reduced competition, but workers in export industries and industries using imported inputs may suffer from retaliatory tariffs.' },
    { type: 'mc', q: 'NAFTA/USMCA primarily:', choices: ['Created a military alliance', 'Reduced trade barriers between the US, Canada, and Mexico', 'Only affected agriculture', 'Increased all tariffs'], answer: 'B', explanation: 'NAFTA (1994, replaced by USMCA in 2020) created a free trade zone reducing tariffs and trade barriers between the three nations, increasing trade volume while raising debates about job displacement.' },
    { type: 'mc', q: 'The WTO dispute resolution system:', choices: ['Has no enforcement power', 'Provides a legal framework for resolving trade disputes between member nations', 'Only handles US trade issues', 'Was disbanded in 2010'], answer: 'B', explanation: 'The WTO dispute settlement system allows nations to challenge unfair trade practices, with binding rulings and authorized retaliatory measures, though its effectiveness has been questioned as its appellate body faces challenges.' },
    { type: 'mc', q: 'Economic nationalism prioritizes:', choices: ['Global free trade', 'Protecting domestic industries and jobs through tariffs, subsidies, and trade restrictions', 'Eliminating all borders', 'Only foreign investment'], answer: 'B', explanation: 'Economic nationalism prioritizes national economic interests through protectionist measures, contrasting with free trade advocacy. It can protect jobs short-term but may reduce efficiency and raise consumer prices.' },
    { type: 'mc', q: 'Supply chain disruptions have become a policy concern because:', choices: ['They never happen', 'Global supply chains create vulnerabilities when concentrated in few countries, as shown by pandemic and geopolitical disruptions', 'Only affect luxury goods', 'Are easily resolved'], answer: 'B', explanation: 'COVID-19 and geopolitical tensions exposed risks of concentrated supply chains, sparking debates about reshoring, diversification, and balancing efficiency with resilience and national security.' },
  ],
  'humanitarian-intervention': [
    { type: 'mc', q: 'Humanitarian aid differs from development aid in that:', choices: ['They are identical', 'Humanitarian aid addresses immediate crises while development aid builds long-term capacity', 'Humanitarian aid is only military', 'Development aid is only financial'], answer: 'B', explanation: 'Humanitarian aid provides emergency relief (food, shelter, medical care) during crises. Development aid builds long-term capacity (education, infrastructure, governance) to prevent future crises and reduce poverty.' },
    { type: 'sa', q: 'What ethical dilemmas arise in humanitarian intervention?', answer: 'sovereignty', explanation: 'Key dilemmas: violating sovereignty to save lives, risking military/civilian casualties, choosing which crises to intervene in, potential for creating dependency, mission creep, and the risk that intervention worsens the situation.' },
    { type: 'mc', q: 'The refugee crisis involves which challenges for host countries?', choices: ['No challenges at all', 'Economic costs, social integration, security concerns, and political tensions balanced against moral obligations', 'Only military challenges', 'Only temporary challenges'], answer: 'B', explanation: 'Hosting refugees involves costs (housing, services), integration challenges (language, employment), security screening needs, and political debates, while international law and moral obligations require protection.' },
    { type: 'mc', q: 'International humanitarian law (Geneva Conventions) protects:', choices: ['Only soldiers', 'Civilians, prisoners of war, wounded soldiers, and medical personnel during armed conflict', 'Only the winning side', 'Trade during wartime'], answer: 'B', explanation: 'The Geneva Conventions (1949) establish protections for non-combatants, POWs, wounded/sick soldiers, and medical personnel, forming the core of international humanitarian law.' },
    { type: 'mc', q: 'Foreign aid as a percentage of GDP for most wealthy nations is:', choices: ['Over 5%', 'Well below the 0.7% UN target, with the US at roughly 0.2%', 'Exactly at the UN target', 'Zero'], answer: 'B', explanation: 'Despite the 0.7% GNI target set by the UN, most wealthy nations fall short. The US gives the most in absolute terms but among the least as a percentage of GDP.' },
    { type: 'mc', q: 'NGOs (Non-Governmental Organizations) play a role in humanitarian response by:', choices: ['Replacing governments entirely', 'Delivering aid, advocating for policy changes, and providing services that governments cannot or will not', 'Only fundraising', 'Having no real impact'], answer: 'B', explanation: 'NGOs like Doctors Without Borders, Red Cross, and UNHCR deliver critical services, advocate for vulnerable populations, and fill gaps in government response during humanitarian crises.' },
  ],
  'climate-change': [
    { type: 'mc', q: 'The scientific consensus on climate change is that:', choices: ['There is significant disagreement among scientists', 'Over 97% of climate scientists agree that human activities are causing global warming', 'Only some data supports warming', 'It is entirely natural'], answer: 'B', explanation: 'Multiple studies confirm that over 97% of publishing climate scientists agree that human-caused greenhouse gas emissions are driving global warming, making it one of the strongest scientific consensuses.' },
    { type: 'mc', q: 'The greenhouse effect is:', choices: ['Only harmful', 'A natural process where atmospheric gases trap heat, made dangerous by excess human-caused emissions', 'Only caused by humans', 'Not related to CO2'], answer: 'B', explanation: 'The greenhouse effect is natural and necessary for life, but human activities (burning fossil fuels, deforestation) have increased greenhouse gases, enhancing the effect and causing dangerous warming.' },
    { type: 'sa', q: 'What are the main approaches to addressing climate change at the policy level?', answer: 'mitigation', explanation: 'Approaches include: mitigation (reducing emissions through clean energy, efficiency), adaptation (preparing for impacts), carbon pricing (taxes, cap-and-trade), regulation, international agreements, and research/technology development.' },
    { type: 'mc', q: 'Climate change disproportionately affects:', choices: ['All nations equally', 'Developing nations and vulnerable communities that contributed least to the problem', 'Only cold countries', 'Only island nations'], answer: 'B', explanation: 'Climate justice recognizes that those least responsible for emissions (Global South, indigenous communities, low-income populations) face the greatest impacts from rising seas, extreme weather, and food insecurity.' },
    { type: 'mc', q: 'The transition to renewable energy faces which challenge?', choices: ['Renewables don\'t work', 'Balancing economic disruption in fossil fuel communities with environmental necessity', 'Solar and wind are more expensive than fossil fuels everywhere', 'No one supports renewables'], answer: 'B', explanation: 'The energy transition involves managing job losses in fossil fuel industries, grid reliability during transition, upfront infrastructure costs, and political opposition, while renewables are increasingly cost-competitive.' },
    { type: 'mc', q: 'Climate change skepticism in media often involves:', choices: ['Legitimate scientific debate', 'Cherry-picking data, false balance, amplifying fringe views, and industry-funded disinformation', 'Accurate representation of science', 'Peer-reviewed research'], answer: 'B', explanation: 'Climate skepticism in media often uses tactics from the tobacco industry playbook: manufacturing doubt, cherry-picking data, false balance, and industry-funded think tanks to delay action.' },
  ],
  'global-health': [
    { type: 'mc', q: 'The World Health Organization (WHO) primarily:', choices: ['Treats individual patients', 'Coordinates international health policy, disease surveillance, and emergency response', 'Only studies diseases', 'Has no real authority'], answer: 'B', explanation: 'WHO coordinates global health responses, sets standards, monitors disease outbreaks, provides technical assistance, and leads emergency responses like pandemic coordination.' },
    { type: 'sa', q: 'How did the COVID-19 pandemic reveal inequalities in global health systems?', answer: 'access', explanation: 'COVID-19 exposed disparities in healthcare access, vaccine distribution (wealthy nations hoarded vaccines), testing capacity, ability to work remotely vs. essential workers\' exposure, and pre-existing health inequities based on race and income.' },
    { type: 'mc', q: 'Vaccine equity is a global issue because:', choices: ['All nations have equal access', 'Unequal vaccine distribution allows variants to emerge and perpetuates global health disparities', 'Vaccines are free everywhere', 'Only wealthy nations need vaccines'], answer: 'B', explanation: 'Unequal vaccine access means viruses continue to circulate and mutate in under-vaccinated populations, potentially creating variants that threaten everyone, while perpetuating global health inequality.' },
    { type: 'mc', q: 'Antimicrobial resistance (AMR) is a global threat because:', choices: ['It only affects hospitals', 'Overuse of antibiotics creates drug-resistant bacteria that could make common infections untreatable', 'It has been fully solved', 'It only affects developing nations'], answer: 'B', explanation: 'AMR threatens to reverse a century of medical progress. Overuse in human medicine and agriculture breeds resistant organisms, and new antibiotic development has slowed dramatically.' },
    { type: 'mc', q: 'Global health security involves:', choices: ['Only disease treatment', 'Preparing for and responding to infectious disease outbreaks, bioterrorism, and health emergencies that cross borders', 'Only military threats', 'Individual health insurance'], answer: 'B', explanation: 'Health security addresses threats that cross borders — pandemics, bioterrorism, antimicrobial resistance — requiring international cooperation, surveillance systems, and rapid response capabilities.' },
    { type: 'mc', q: 'Mental health has gained attention as a global issue because:', choices: ['It is a new condition', 'Depression and anxiety are leading causes of disability worldwide, yet most countries underinvest in mental health services', 'It only affects wealthy nations', 'It has no economic impact'], answer: 'B', explanation: 'Mental health conditions affect hundreds of millions globally, costing trillions in lost productivity, yet most countries devote less than 2% of health budgets to mental health services.' },
  ],
  'human-rights': [
    { type: 'mc', q: 'The Universal Declaration of Human Rights (1948) establishes:', choices: ['Only civil and political rights', 'Both civil/political rights and economic/social/cultural rights as universal standards', 'Rights only for Western nations', 'Enforceable international law'], answer: 'B', explanation: 'The UDHR establishes universal rights including life, liberty, equality, freedom of expression, education, work, and adequate standard of living — though it is aspirational rather than binding law.' },
    { type: 'sa', q: 'What is the tension between cultural relativism and universal human rights?', answer: 'universal', explanation: 'Cultural relativism argues rights standards should reflect local culture. Universalists argue certain rights are inherent to all humans regardless of culture. The tension arises when cultural practices conflict with international human rights standards.' },
    { type: 'mc', q: 'Genocide is defined under international law as:', choices: ['Any war', 'Acts committed with intent to destroy, in whole or in part, a national, ethnic, racial, or religious group', 'Political repression', 'Economic sanctions'], answer: 'B', explanation: 'The 1948 Genocide Convention defines genocide as acts intended to destroy a group — killing, causing serious harm, imposing conditions to destroy, preventing births, or forcibly transferring children.' },
    { type: 'mc', q: 'The International Criminal Court (ICC) prosecutes:', choices: ['All crimes worldwide', 'Genocide, war crimes, crimes against humanity, and the crime of aggression', 'Only domestic crimes', 'Trade violations'], answer: 'B', explanation: 'The ICC (established 2002) prosecutes the most serious international crimes when national courts cannot or will not. The US, Russia, and China are not members, limiting its reach.' },
    { type: 'mc', q: 'Freedom of the press worldwide has been:', choices: ['Steadily improving', 'Declining in many regions, with journalists facing imprisonment, violence, and censorship', 'Unchanged for decades', 'Only an issue in one country'], answer: 'B', explanation: 'Press freedom has declined globally, with increasing journalist imprisonment, murders, legal harassment, and digital censorship, threatening informed public discourse and accountability.' },
    { type: 'mc', q: 'Modern slavery and human trafficking:', choices: ['Were eliminated in the 19th century', 'Continue to affect an estimated 40+ million people worldwide through forced labor and exploitation', 'Only exist in developing nations', 'Are declining rapidly'], answer: 'B', explanation: 'Modern slavery persists in forced labor, debt bondage, forced marriage, and sex trafficking across all regions, generating billions in illicit profits and affecting the most vulnerable populations.' },
  ],
  'technology-society': [
    { type: 'mc', q: 'AI regulation debates center on:', choices: ['Only self-driving cars', 'Balancing innovation with concerns about bias, privacy, job displacement, and autonomous weapons', 'AI has no risks', 'Only video games'], answer: 'B', explanation: 'AI regulation involves complex tradeoffs between encouraging innovation and addressing algorithmic bias, privacy erosion, labor displacement, deep fakes, autonomous weapons, and concentration of power.' },
    { type: 'sa', q: 'How does surveillance technology raise civil liberties concerns?', answer: 'privacy', explanation: 'Surveillance technology (facial recognition, phone tracking, data collection) raises concerns about privacy erosion, chilling effects on free expression, disproportionate targeting of minorities, government overreach, and the balance between security and liberty.' },
    { type: 'mc', q: 'The debate over social media regulation involves:', choices: ['Banning all social media', 'Content moderation, Section 230 liability, data privacy, antitrust, and child safety', 'Only advertising', 'Only entertainment'], answer: 'B', explanation: 'Social media regulation debates involve free speech vs. content moderation, platform liability (Section 230), data privacy, competition/antitrust, algorithmic transparency, and protecting minors.' },
    { type: 'mc', q: 'Data privacy laws like GDPR aim to:', choices: ['Eliminate the internet', 'Give individuals control over their personal data and hold companies accountable for data handling', 'Only affect European companies', 'Ban data collection entirely'], answer: 'B', explanation: 'GDPR and similar laws establish individuals\' rights over their data (consent, access, deletion) and require companies to handle data responsibly, transparently, and securely.' },
    { type: 'mc', q: 'The digital divide affects democratic participation because:', choices: ['Technology is irrelevant to democracy', 'Unequal access to information and digital tools limits civic engagement for disadvantaged communities', 'Everyone has equal access', 'Only affects entertainment'], answer: 'B', explanation: 'Without internet access and digital literacy, communities cannot fully participate in online civic engagement, access government services, obtain information, or make their voices heard in democratic processes.' },
    { type: 'mc', q: 'Cryptocurrency and blockchain technology raise policy questions about:', choices: ['Only investment', 'Financial regulation, environmental impact, monetary sovereignty, and use in illicit transactions', 'Only technology companies', 'Nothing significant'], answer: 'B', explanation: 'Crypto raises questions about financial regulation (consumer protection), energy consumption (mining), central bank digital currencies, tax evasion, and use in ransomware and money laundering.' },
  ],
  'global-inequality': [
    { type: 'mc', q: 'The Gini coefficient measures:', choices: ['GDP growth', 'Income or wealth inequality within a nation, from 0 (perfect equality) to 1 (perfect inequality)', 'Trade volume', 'Population growth'], answer: 'B', explanation: 'The Gini coefficient quantifies inequality: 0 means everyone has equal income, 1 means one person has all income. Higher values indicate greater inequality. The US has a relatively high Gini for a developed nation.' },
    { type: 'sa', q: 'How do colonial legacies contribute to current global inequality?', answer: 'extraction', explanation: 'Colonial powers extracted resources, disrupted indigenous institutions, drew arbitrary borders, created mono-crop economies, and established racial hierarchies whose effects persist through unequal trade relationships, institutional weakness, and debt.' },
    { type: 'mc', q: 'The Sustainable Development Goals (SDGs) aim to:', choices: ['Only reduce poverty', 'Address interconnected global challenges including poverty, inequality, climate, education, and health by 2030', 'Only help wealthy nations', 'Replace national governments'], answer: 'B', explanation: 'The 17 SDGs (adopted 2015) provide a comprehensive framework addressing poverty, hunger, health, education, gender equality, clean water, energy, economic growth, inequality, climate, and peace.' },
    { type: 'mc', q: 'Global wealth inequality means that:', choices: ['Wealth is evenly distributed', 'The richest 1% own more wealth than the bottom 50% combined', 'All nations are equally wealthy', 'Inequality is decreasing rapidly'], answer: 'B', explanation: 'Extreme wealth concentration means the richest 1% hold more wealth than half the global population, raising questions about fairness, social mobility, political influence, and economic stability.' },
    { type: 'mc', q: 'Microfinance as a development tool:', choices: ['Has been universally successful', 'Provides small loans to the poor, with debated effectiveness — helps some but can trap others in debt', 'Only works in wealthy nations', 'Is the same as foreign aid'], answer: 'B', explanation: 'Microfinance provides small loans to those excluded from traditional banking. While it has helped many entrepreneurs, critics note high interest rates, over-indebtedness, and limited evidence of lifting people out of poverty at scale.' },
    { type: 'mc', q: 'Brain drain affects developing nations by:', choices: ['Improving their economies', 'Losing educated professionals to wealthier countries, reducing local capacity for development', 'Having no real impact', 'Only affecting science'], answer: 'B', explanation: 'Brain drain — emigration of educated professionals — depletes developing nations of doctors, engineers, teachers, and other skilled workers essential for development, though remittances partially offset the loss.' },
  ],
  'voting-elections': [
    { type: 'mc', q: 'Voter suppression tactics historically and currently include:', choices: ['Encouraging voting', 'Strict ID laws, polling place closures, purging voter rolls, and reducing early voting', 'Making registration easier', 'Increasing polling hours'], answer: 'B', explanation: 'Voter suppression limits participation through strict ID requirements, reducing polling locations in minority areas, purging eligible voters from rolls, limiting early voting, and gerrymandering.' },
    { type: 'sa', q: 'How do different voting systems (plurality, ranked choice, proportional) affect representation?', answer: 'proportional', explanation: 'Plurality (first-past-the-post) tends toward two parties and can waste votes. Ranked choice reduces spoiler effects. Proportional representation gives seats based on vote share, producing multi-party systems with broader representation.' },
    { type: 'mc', q: 'The Electoral College has been criticized because:', choices: ['It works perfectly', 'It can produce winners who lose the popular vote and gives disproportionate influence to small states', 'It is in the Bill of Rights', 'It only affects local elections'], answer: 'B', explanation: 'The Electoral College has produced popular-vote losers winning the presidency (2000, 2016), gives small states disproportionate per-capita influence, and focuses campaigns on swing states.' },
    { type: 'mc', q: 'Gerrymandering undermines democracy by:', choices: ['Creating fair districts', 'Allowing politicians to choose their voters rather than voters choosing representatives', 'Increasing competition', 'Only affecting one party'], answer: 'B', explanation: 'Gerrymandering manipulates district boundaries to predetermine outcomes, reducing competitive elections, limiting voter choice, and allowing the party controlling redistricting to entrench its power.' },
    { type: 'mc', q: 'Campaign finance reform efforts aim to:', choices: ['Increase money in politics', 'Reduce the influence of wealthy donors and corporations on elections and governance', 'Eliminate all campaign spending', 'Only regulate TV ads'], answer: 'B', explanation: 'Reform efforts address the outsized influence of money through contribution limits, transparency requirements, public financing options, and attempts to overturn Citizens United.' },
    { type: 'mc', q: 'Youth voter turnout is typically lower because:', choices: ['Young people don\'t care about issues', 'Barriers include registration complexity, less political socialization, mobility, and feeling their vote doesn\'t matter', 'They are not allowed to vote', 'All demographics vote equally'], answer: 'B', explanation: 'Lower youth turnout reflects registration barriers, less established voting habits, frequent moves, feeling disconnected from candidates, and belief that politics doesn\'t affect them — though youth turnout has been rising.' },
  ],
  'advocacy-activism': [
    { type: 'mc', q: 'Grassroots organizing differs from top-down advocacy in that:', choices: ['It is less effective', 'It builds power from community members up rather than relying on institutional leaders', 'It requires more money', 'It only uses social media'], answer: 'B', explanation: 'Grassroots organizing empowers community members to advocate for change through direct action, community building, and collective power, rather than relying on institutional or elite leadership.' },
    { type: 'sa', q: 'How has social media changed civic activism?', answer: 'mobilize', explanation: 'Social media enables rapid mobilization, amplifies marginalized voices, reduces organizational costs, and connects global movements. Critics note "slacktivism" (low-effort engagement), filter bubbles, and susceptibility to manipulation.' },
    { type: 'mc', q: 'Civil disobedience, as practiced by MLK Jr. and Gandhi, involves:', choices: ['Violent protest', 'Deliberately but peacefully breaking unjust laws and accepting consequences to highlight injustice', 'Ignoring all laws', 'Only writing letters'], answer: 'B', explanation: 'Civil disobedience involves deliberately violating unjust laws peacefully and accepting punishment, drawing moral attention to injustice through personal sacrifice and nonviolent resistance.' },
    { type: 'mc', q: 'Lobbying is:', choices: ['Always corrupt', 'The constitutionally protected right to petition the government, though concerns exist about unequal access', 'Illegal in the US', 'Only done by corporations'], answer: 'B', explanation: 'Lobbying is protected by the First Amendment right to petition. Concerns arise when wealthy interests have disproportionate access to lawmakers, potentially drowning out ordinary citizens\' voices.' },
    { type: 'mc', q: 'The effectiveness of protest movements depends on:', choices: ['Only the number of participants', 'Clear goals, strategic tactics, sustained organizing, media coverage, and building broad coalitions', 'Violence', 'Social media followers'], answer: 'B', explanation: 'Research shows effective movements combine clear demands, strategic nonviolent tactics, sustained organizational capacity, coalition-building across demographics, and ability to generate public sympathy.' },
    { type: 'mc', q: 'Petition campaigns are most effective when they:', choices: ['Collect many signatures with no follow-up', 'Combine signature gathering with direct action, media attention, and engagement with decision-makers', 'Only circulate online', 'Target international audiences'], answer: 'B', explanation: 'Petitions alone rarely create change. Effective campaigns combine petitions with direct engagement of decision-makers, media coverage, coalition building, and demonstrated community support.' },
  ],
  'community-engagement': [
    { type: 'mc', q: 'Civic engagement includes:', choices: ['Only voting', 'Voting, volunteering, attending town halls, serving on boards, community organizing, and staying informed', 'Only protesting', 'Only paying taxes'], answer: 'B', explanation: 'Civic engagement encompasses all the ways citizens participate in community and political life — from voting and volunteering to serving on boards, attending meetings, and staying informed.' },
    { type: 'sa', q: 'Why are local government meetings important for civic participation?', answer: 'direct', explanation: 'Local government (city council, school board) meetings offer direct access to decision-makers on issues that immediately affect daily life — zoning, schools, policing, budgets. Participation at this level has outsized impact relative to effort.' },
    { type: 'mc', q: 'Service learning differs from regular volunteering in that:', choices: ['It pays students', 'It combines community service with structured reflection and academic learning', 'It requires less time', 'It only occurs in colleges'], answer: 'B', explanation: 'Service learning integrates community service with academic curriculum and structured reflection, helping students connect classroom learning to real-world issues while meeting community needs.' },
    { type: 'mc', q: 'A strong civil society includes:', choices: ['Only government institutions', 'Independent organizations like nonprofits, religious groups, labor unions, and civic associations', 'Only businesses', 'Only political parties'], answer: 'B', explanation: 'Civil society — the space between government and business — includes nonprofits, faith organizations, labor unions, professional associations, and community groups that strengthen democracy through collective action.' },
    { type: 'mc', q: 'Community needs assessments are important because they:', choices: ['Are required by law', 'Identify actual community needs using data and input, ensuring resources address real problems', 'Only benefit researchers', 'Always produce the same results'], answer: 'B', explanation: 'Needs assessments use surveys, data analysis, and community input to identify priorities, ensuring that programs and resources address actual needs rather than assumptions about what communities need.' },
    { type: 'mc', q: 'Volunteerism in the US has been:', choices: ['Steadily increasing', 'Evolving — formal volunteerism has declined but informal helping and episodic volunteering are changing how people engage', 'Eliminated', 'Only for students'], answer: 'B', explanation: 'Volunteer patterns are shifting: traditional long-term organizational volunteering has declined, but informal helping, skills-based volunteering, and short-term project-based engagement are evolving how communities mobilize.' },
  ],
  'informed-citizenship': [
    { type: 'mc', q: 'Political literacy means:', choices: ['Supporting a political party', 'Understanding how government works, evaluating political claims, and making informed civic decisions', 'Reading political news daily', 'Voting in every election'], answer: 'B', explanation: 'Political literacy combines understanding government structures and processes, evaluating political arguments and media, recognizing bias, and applying this knowledge to informed civic participation.' },
    { type: 'sa', q: 'Why is civic knowledge declining and what are its consequences?', answer: 'participate', explanation: 'Declining civic knowledge (fewer than half of Americans can name all three branches) results from reduced civics education, information overload, and polarization. Consequences include vulnerability to misinformation, lower participation, and weaker democratic accountability.' },
    { type: 'mc', q: 'Media literacy education should include:', choices: ['Only how to use technology', 'Critical evaluation of sources, understanding bias, identifying misinformation, and responsible information sharing', 'Memorizing news outlets', 'Only social media safety'], answer: 'B', explanation: 'Comprehensive media literacy teaches source evaluation, bias recognition, propaganda identification, data interpretation, responsible sharing, and understanding how media systems shape information access.' },
    { type: 'mc', q: 'An informed citizen should be able to:', choices: ['Recite every law', 'Evaluate policy proposals, understand tradeoffs, identify credible information, and participate effectively in democracy', 'Only follow one news source', 'Only vote'], answer: 'B', explanation: 'Informed citizenship requires evaluating policy evidence, understanding tradeoffs, distinguishing reliable from unreliable information, considering multiple perspectives, and engaging constructively in civic life.' },
    { type: 'mc', q: 'Political polarization threatens democracy by:', choices: ['Creating healthy debate', 'Reducing willingness to compromise, demonizing opponents, undermining trust in institutions, and making governance difficult', 'Having no negative effects', 'Only affecting elections'], answer: 'B', explanation: 'Extreme polarization replaces policy debate with tribal conflict, makes compromise impossible, erodes trust in institutions and fellow citizens, and can lead to political violence and democratic erosion.' },
    { type: 'mc', q: 'The concept of the "informed electorate" in democracy means:', choices: ['Only experts should vote', 'Democracy functions best when citizens have access to accurate information and the skills to evaluate it', 'Information is unnecessary for voting', 'Only politicians need to be informed'], answer: 'B', explanation: 'Democratic theory holds that self-governance requires informed citizens who can evaluate candidates, policies, and competing claims. Without informed voters, democracy is vulnerable to demagoguery and manipulation.' },
  ],
};

const ANALYSIS_FRAMEWORKS = {
  'news-analysis': {
    name: 'SIFT Method for Source Evaluation',
    description: 'Stop (pause before sharing), Investigate the source, Find better coverage, Trace claims to their origin. Use this framework to evaluate any news article or social media post before accepting or sharing it.',
    steps: ['Stop: Pause and check your emotional reaction', 'Investigate: Look up the source — what is their track record?', 'Find: Search for other coverage of the same claim', 'Trace: Follow claims back to original sources and data'],
  },
  'media-literacy-advanced': {
    name: 'Media Message Deconstruction',
    description: 'Analyze any media message by examining who created it, what techniques are used, how different audiences might interpret it, what perspectives are included/excluded, and why it was created.',
    steps: ['Who created this message and why?', 'What techniques are used to attract attention?', 'What lifestyles, values, and points of view are represented?', 'What is omitted from this message?', 'How might different people interpret this differently?'],
  },
  'domestic-policy': {
    name: 'Policy Analysis Framework',
    description: 'Evaluate domestic policy proposals by examining the problem, proposed solution, stakeholders, costs/benefits, alternatives, and implementation challenges.',
    steps: ['Define the problem: What issue does this policy address?', 'Examine the proposal: What specific actions are proposed?', 'Identify stakeholders: Who benefits? Who bears costs?', 'Evaluate evidence: What data supports or contradicts the proposal?', 'Consider alternatives: What other approaches exist?', 'Assess implementation: How practical and enforceable is this?'],
  },
  'foreign-policy': {
    name: 'Foreign Policy Decision Framework',
    description: 'Analyze foreign policy decisions by examining national interests, international law, moral obligations, practical constraints, and potential consequences.',
    steps: ['National interest: How does this serve US strategic interests?', 'Legal framework: What does international law require/permit?', 'Moral dimension: What are the ethical obligations?', 'Practical constraints: What resources and capabilities are available?', 'Consequences: What are the likely short and long-term outcomes?', 'Alternatives: What other options exist?'],
  },
  'global-issues': {
    name: 'Global Issue Analysis Framework',
    description: 'Analyze global issues by examining root causes, affected populations, interconnections with other issues, current responses, and potential solutions.',
    steps: ['Root causes: What historical and structural factors created this issue?', 'Impact: Who is affected and how? Are impacts distributed equitably?', 'Interconnections: How does this issue relate to other global challenges?', 'Current responses: What are governments, NGOs, and international bodies doing?', 'Solutions: What approaches show promise? What tradeoffs exist?'],
  },
  'civic-participation': {
    name: 'Civic Action Planning Framework',
    description: 'Plan effective civic action by identifying the issue, researching background, mapping stakeholders, choosing strategies, and evaluating outcomes.',
    steps: ['Identify: What issue do you want to address?', 'Research: What are the facts, history, and current policy?', 'Stakeholder map: Who has power to change this? Who is affected?', 'Strategy: What actions can you take? (voting, contacting officials, organizing, media)', 'Coalitions: Who can you work with?', 'Evaluate: How will you measure success?'],
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
  return { studentId: id, createdAt: new Date().toISOString(), focus: null, assessments: [], skills: {} };
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

function allSkillKeys() {
  const keys = [];
  for (const cat of CATEGORIES) {
    for (const sk of Object.keys(SKILLS[cat])) keys.push(sk);
  }
  return keys;
}

function findSkillCategory(skill) {
  for (const cat of CATEGORIES) {
    if (SKILLS[cat][skill]) return cat;
  }
  return null;
}

// Exercise generation

function generateExercise(skill, count = 5) {
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}. Valid: ${allSkillKeys().join(', ')}` };
  const cat = findSkillCategory(skill);
  const items = pick(bank, count);
  return {
    type: 'current-events',
    skill,
    skillName: SKILLS[cat]?.[skill]?.name || skill,
    category: cat,
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

class CurrentEvents {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, createdAt: p.createdAt, focus: p.focus, totalAssessments: p.assessments.length };
  }

  setFocus(id, category) {
    if (!CATEGORIES.includes(category)) throw new Error(`Unknown category: ${category}. Valid: ${CATEGORIES.join(', ')}`);
    const p = loadProfile(id);
    p.focus = category;
    saveProfile(p);
    return { studentId: id, focus: category, skills: Object.keys(SKILLS[category]).map(sk => ({ skill: sk, name: SKILLS[category][sk].name })) };
  }

  recordAssessment(id, skill, score, total, notes = '') {
    const cat = findSkillCategory(skill);
    if (!cat) throw new Error(`Unknown skill: ${skill}. Valid: ${allSkillKeys().join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, category: cat, score, total, notes };
    p.assessments.push(entry);
    if (!p.skills[skill]) p.skills[skill] = { attempts: [] };
    p.skills[skill].attempts.push({ date: entry.date, score, total });
    p.skills[skill].mastery = calcMastery(p.skills[skill].attempts);
    p.skills[skill].label = masteryLabel(p.skills[skill].mastery);
    saveProfile(p);
    return { studentId: id, skill, category: cat, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const cat of CATEGORIES) {
      results[cat] = {};
      for (const [sk, info] of Object.entries(SKILLS[cat])) {
        total++;
        const d = p.skills[sk];
        results[cat][sk] = d ? { name: info.name, mastery: d.mastery, label: d.label } : { name: info.name, mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    const catSummary = {};
    for (const cat of CATEGORIES) {
      const vals = Object.values(results[cat]);
      const avg = vals.reduce((s, v) => s + v.mastery, 0) / vals.length;
      catSummary[cat] = { avgMastery: Math.round(avg * 100) / 100, label: masteryLabel(avg) };
    }
    return { studentId: id, focus: p.focus, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, categorySummary: catSummary, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    const focusCats = p.focus ? [p.focus] : CATEGORIES;
    for (const cat of focusCats) {
      for (const [sk, info] of Object.entries(SKILLS[cat])) {
        const d = p.skills[sk];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, name: info.name, category: cat, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, focus: p.focus, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, focus: p.focus, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog() {
    const catalog = {};
    let total = 0;
    for (const cat of CATEGORIES) {
      catalog[cat] = {};
      for (const [sk, info] of Object.entries(SKILLS[cat])) {
        total++;
        catalog[cat][sk] = { name: info.name };
      }
    }
    return { categories: CATEGORIES, catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  getFramework(category) {
    if (!ANALYSIS_FRAMEWORKS[category]) return { error: `No framework for ${category}. Valid: ${Object.keys(ANALYSIS_FRAMEWORKS).join(', ')}` };
    return ANALYSIS_FRAMEWORKS[category];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills proficient! Great work on Current Events.', categories: CATEGORIES };
    const exercise = generateExercise(target.skill, 5);
    const framework = ANALYSIS_FRAMEWORKS[target.category] || null;
    return {
      studentId: id, targetSkill: target, exercise, framework,
      lessonPlan: {
        review: 'Review previously covered concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.name}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        framework: framework ? `Apply framework: "${framework.name}"` : 'Apply critical analysis to current events',
        connect: 'Connect to current real-world events and issues',
      },
    };
  }
}

module.exports = CurrentEvents;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CurrentEvents();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id] = args;
        if (!id) throw new Error('Usage: start <id>');
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
      case 'setFocus': { const [, id, cat] = args; if (!id || !cat) throw new Error('Usage: setFocus <id> <category>'); out(api.setFocus(id, cat)); break; }
      case 'framework': { const [, cat] = args; if (!cat) throw new Error('Usage: framework <category>'); out(api.getFramework(cat)); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node current-events.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','setFocus','framework','students'], categories: CATEGORIES, skills: allSkillKeys() });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
