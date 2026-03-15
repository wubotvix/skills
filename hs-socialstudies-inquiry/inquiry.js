// eClaw HS Social Studies Inquiry & Research Skills Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-inquiry');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'historical-analysis': [
    'causation',
    'change-continuity-over-time',
    'comparison',
    'periodization',
    'contextualization',
  ],
  'source-evaluation': [
    'happ-framework',
    'sourcing',
    'corroboration',
    'close-reading',
    'silences-in-record',
  ],
  'argumentation': [
    'toulmin-model',
    'thesis-writing',
    'evidence-integration',
    'counterarguments',
  ],
  'research-methodology': [
    'question-development',
    'source-identification',
    'annotated-bibliography',
    'research-design',
  ],
  'interdisciplinary-connections': [
    'history-connections',
    'government-connections',
    'economics-connections',
    'geography-connections',
  ],
  'civic-action': [
    'issue-identification',
    'evidence-based-positions',
    'action-planning',
    'democratic-participation',
  ],
};

const CONTENT_BANKS = {
  'causation': [
    { q: 'What is the difference between a proximate cause and an underlying cause?', a: 'proximate cause is the immediate trigger while underlying causes are deeper long-term factors', alt: ['immediate vs long-term', 'trigger vs deeper factors', 'proximate is immediate underlying is deeper'], type: 'sa' },
    { q: 'Historical causation involves:', a: 'B', alt: [], type: 'mc', choices: ['Only identifying the immediate trigger of events', 'Examining both immediate triggers and long-term structural causes and their interconnections', 'Only looking at economic factors', 'Blaming individuals for historical events'] },
    { q: 'The post hoc fallacy is problematic because:', a: 'B', alt: [], type: 'mc', choices: ['Timing always proves causation', 'Sequence alone does not prove that an earlier event caused a later one', 'Historians should ignore chronology', 'All events following each other are causally linked'] },
    { q: 'Counterfactual reasoning in history asks:', a: 'B', alt: [], type: 'mc', choices: ['What really happened', 'What if a specific cause had been absent to test its importance', 'How to rewrite history', 'What should have happened'] },
    { q: 'Why is multicausal analysis important for understanding historical events?', a: 'historical events result from multiple interacting causes and single-cause explanations oversimplify', alt: ['multiple causes interact', 'single cause oversimplifies', 'events have many causes'], type: 'sa' },
    { q: 'A necessary cause is one that:', a: 'B', alt: [], type: 'mc', choices: ['Alone guarantees the outcome', 'Must be present for the effect to occur but alone does not guarantee it', 'Is the most recent event', 'Is agreed upon by all historians'] },
    { q: 'Unintended consequences in history refer to:', a: 'B', alt: [], type: 'mc', choices: ['Events that were carefully planned', 'Outcomes of actions that were not anticipated or intended by the actors', 'Negative results only', 'Only modern events'] },
    { q: 'How does the concept of agency relate to causation?', a: 'agency recognizes that individuals and groups make choices that shape events within structural constraints', alt: ['people make choices within constraints', 'individuals shape events', 'choices within structures'], type: 'sa' },
  ],
  'change-continuity-over-time': [
    { q: 'What does CCOT stand for in AP history?', a: 'change and continuity over time', alt: ['changes and continuities over time'], type: 'sa' },
    { q: 'Periodization in history involves:', a: 'B', alt: [], type: 'mc', choices: ['Only memorizing dates', 'Organizing time into meaningful periods based on significant changes while acknowledging arbitrary boundaries', 'Ignoring time periods entirely', 'Using only decades as periods'] },
    { q: 'How can something change on the surface while deeper structures remain the same?', a: 'surface changes like new leaders or laws can mask underlying continuities in power structures and social hierarchies', alt: ['surface change masks deeper continuity', 'power structures persist', 'continuity beneath change'], type: 'sa' },
    { q: 'A turning point in history is significant because it:', a: 'B', alt: [], type: 'mc', choices: ['Marks the only important event in an era', 'Represents a moment where the direction of change shifted though causes preceded it', 'Is always a sudden violent event', 'Only involves wars and revolutions'] },
    { q: 'Why is analyzing continuity as important as analyzing change?', a: 'B', alt: [], type: 'mc', choices: ['Nothing ever truly changes', 'Understanding what persists reveals deep structures and power relationships that resist change', 'Change is always overrated', 'Only change matters in history'] },
    { q: 'The concept of progress in history is problematic because:', a: 'B', alt: [], type: 'mc', choices: ['Things always get better over time', 'Change is not always positive and progress for some groups may mean regression for others', 'History is always declining', 'Only technology shows progress'] },
    { q: 'What is the difference between a trend and a turning point?', a: 'a trend is a gradual direction of change over time while a turning point is a specific moment that redirects the trajectory', alt: ['trend is gradual turning point is specific', 'trend vs moment of change'], type: 'sa' },
  ],
  'comparison': [
    { q: 'Historical comparison requires examining:', a: 'B', alt: [], type: 'mc', choices: ['Only similarities between events', 'Both similarities and differences with attention to context and significance', 'Only differences between events', 'Events from the same time period only'] },
    { q: 'Why is context important when comparing historical events?', a: 'events occur in unique circumstances and comparing without context produces misleading conclusions', alt: ['context prevents misleading conclusions', 'unique circumstances matter', 'without context comparisons mislead'], type: 'sa' },
    { q: 'Comparative history is valuable because it:', a: 'B', alt: [], type: 'mc', choices: ['Proves one society is better than another', 'Reveals patterns and unique features that might not be visible studying one case alone', 'Is simpler than studying one event', 'Only compares Western nations'] },
    { q: 'When comparing revolutions across different societies, historians should:', a: 'B', alt: [], type: 'mc', choices: ['Assume all revolutions are identical', 'Identify shared structural conditions while accounting for unique cultural and political contexts', 'Only study the French Revolution as a model', 'Ignore cultural differences'] },
    { q: 'What are the risks of anachronistic comparison?', a: 'applying modern concepts or standards to past societies distorts understanding of their choices and values', alt: ['applying modern standards to the past', 'modern concepts distort past understanding', 'anachronism distorts history'], type: 'sa' },
    { q: 'Cross-cultural comparison helps historians:', a: 'B', alt: [], type: 'mc', choices: ['Rank civilizations by quality', 'Identify both universal patterns and culturally specific developments in human history', 'Prove Western superiority', 'Avoid studying non-Western cultures'] },
  ],
  'periodization': [
    { q: 'Why are period boundaries in history considered constructed rather than natural?', a: 'historians create period boundaries based on interpretive choices about which changes matter most and different criteria produce different periodizations', alt: ['historians choose boundaries', 'interpretive choices determine periods', 'boundaries are interpretive not natural'], type: 'sa' },
    { q: 'Different periodization schemes reflect:', a: 'B', alt: [], type: 'mc', choices: ['Objective truth about when periods start and end', 'Different values and interpretive frameworks about what changes matter most', 'Only Western perspectives on time', 'Scientific measurement of historical change'] },
    { q: 'Challenging traditional periodization can reveal:', a: 'B', alt: [], type: 'mc', choices: ['That all periodization is useless', 'Perspectives and experiences excluded by the dominant framework', 'That history has no patterns', 'Only minor corrections to dates'] },
    { q: 'The Renaissance is a useful example of periodization debates because:', a: 'B', alt: [], type: 'mc', choices: ['Everyone agrees on its dates', 'Scholars debate when it began and ended and whether it applies beyond Western Europe', 'It was clearly a single event', 'It affected all people equally'] },
    { q: 'How might periodization differ if centered on womens history rather than political history?', a: 'turning points and period boundaries would shift because changes in womens rights and roles do not always align with political milestones', alt: ['different turning points for women', 'womens experience has different milestones', 'political periods dont match gender history'], type: 'sa' },
    { q: 'Why is it important to consider multiple periodization frameworks?', a: 'B', alt: [], type: 'mc', choices: ['It creates confusion', 'Multiple frameworks reveal that different groups experienced the same era differently', 'Only one framework can be correct', 'It undermines historical knowledge'] },
  ],
  'contextualization': [
    { q: 'Contextualization in historical thinking means:', a: 'B', alt: [], type: 'mc', choices: ['Memorizing background facts', 'Placing sources and events within their broader historical setting to understand their significance', 'Reading only the main text', 'Ignoring the time period'] },
    { q: 'Why is historical empathy important for contextualization?', a: 'understanding historical actors decisions requires considering their context values and available information rather than applying modern standards', alt: ['understanding decisions in context', 'avoid applying modern standards', 'consider their values and information'], type: 'sa' },
    { q: 'A speech by a wartime leader should be contextualized by considering:', a: 'B', alt: [], type: 'mc', choices: ['Only the words spoken', 'The political goals audience expectations and wartime circumstances that shaped the message', 'Only modern reactions to it', 'Whether the speech was long or short'] },
    { q: 'Contextualizing a factory owners diary from the Industrial Revolution requires understanding:', a: 'B', alt: [], type: 'mc', choices: ['Only the diary entries themselves', 'Economic conditions labor laws social class dynamics and technological changes of the era', 'Only modern working conditions', 'Only the owners personal wealth'] },
    { q: 'How does the intended audience of a document affect its content?', a: 'authors tailor content for their audience so public documents differ from private ones and knowing the audience helps interpret what is said and unsaid', alt: ['audience shapes content', 'public vs private documents differ', 'tailored to audience'], type: 'sa' },
    { q: 'The danger of presentism in historical analysis is:', a: 'B', alt: [], type: 'mc', choices: ['Focusing on the present is always useful', 'Applying current values and knowledge to past people distorts understanding of their world', 'It has no dangers', 'It only affects political history'] },
    { q: 'Effective contextualization connects a source to:', a: 'B', alt: [], type: 'mc', choices: ['Only one background fact', 'The social political economic and cultural conditions of its time and place', 'Only military events', 'Only the authors biography'] },
  ],
  'happ-framework': [
    { q: 'What does HAPP stand for in source analysis?', a: 'historical context audience purpose and point of view', alt: ['historical context audience purpose point of view', 'hipp', 'context audience purpose perspective'], type: 'sa' },
    { q: 'The Historical Context element of HAPP asks:', a: 'B', alt: [], type: 'mc', choices: ['When was the source written', 'What broader historical conditions surrounded the creation of this source', 'Who read the source', 'How long is the source'] },
    { q: 'Identifying the Audience of a source matters because:', a: 'B', alt: [], type: 'mc', choices: ['Audience is irrelevant to meaning', 'The intended audience shapes what information is included and how it is presented', 'All sources have the same audience', 'Only the author matters'] },
    { q: 'The Purpose element reveals:', a: 'B', alt: [], type: 'mc', choices: ['The documents length', 'Why the source was created which affects what it includes omits and how it frames information', 'Only the topic of the source', 'The date of creation'] },
    { q: 'Why is Point of View critical in source evaluation?', a: 'every source reflects the creators perspective biases and position in society which shapes how events are described and interpreted', alt: ['creators perspective shapes content', 'bias affects description', 'position in society matters'], type: 'sa' },
    { q: 'Apply HAPP: A plantation owners letter to a Northern newspaper in 1855 defending slavery would require analyzing:', a: 'B', alt: [], type: 'mc', choices: ['Only the factual claims made', 'The antebellum context the Northern audience the persuasive purpose and the slaveholders biased viewpoint', 'Only whether it is well written', 'Only the date it was written'] },
    { q: 'How does the HAPP framework improve analysis compared to simply reading a source?', a: 'it provides a systematic method to evaluate reliability and meaning by considering factors beyond the text itself', alt: ['systematic evaluation', 'considers factors beyond text', 'improves reliability assessment'], type: 'sa' },
  ],
  'sourcing': [
    { q: 'The first question a historian should ask when sourcing a document is:', a: 'B', alt: [], type: 'mc', choices: ['Is this document interesting', 'Who created this document and when', 'Does this support my thesis', 'How long is the document'] },
    { q: 'A primary source is:', a: 'B', alt: [], type: 'mc', choices: ['Always more reliable than a secondary source', 'A firsthand account or original document from the time period being studied', 'Any published book', 'A textbook summary'] },
    { q: 'Can a source be both primary and secondary?', a: 'yes it depends on the research question such as a 1960s textbook being secondary for WWII but primary for studying Cold War education', alt: ['yes depends on research question', 'yes context determines classification', 'yes depending on how it is used'], type: 'sa' },
    { q: 'A secondary source is valuable because it:', a: 'B', alt: [], type: 'mc', choices: ['Is always more objective than a primary source', 'Synthesizes analyzes and interprets primary sources to provide broader understanding', 'Was written later and therefore knows more', 'Is easier to read'] },
    { q: 'Oral histories as primary sources are shaped by:', a: 'B', alt: [], type: 'mc', choices: ['Nothing they are perfectly accurate', 'Memory reconstruction passage of time the interview context and the narrators present circumstances', 'Only the questions asked', 'Only the narrators age'] },
    { q: 'Material culture as a primary source can reveal:', a: 'B', alt: [], type: 'mc', choices: ['Nothing useful for historians', 'Information about daily life values technology and social structures that written sources may not capture', 'Only economic information', 'Only archaeological data'] },
    { q: 'Why should government-produced documents be analyzed critically?', a: 'they serve state interests and may present information in ways that justify policy or maintain legitimacy', alt: ['serve state interests', 'justify policy', 'may be biased toward government goals'], type: 'sa' },
  ],
  'corroboration': [
    { q: 'Corroboration in historical inquiry means:', a: 'B', alt: [], type: 'mc', choices: ['Finding one excellent source', 'Comparing multiple sources to verify claims and identify patterns or contradictions', 'Accepting the first account found', 'Using only primary sources'] },
    { q: 'When two primary sources contradict each other a historian should:', a: 'B', alt: [], type: 'mc', choices: ['Choose the one that fits their thesis', 'Analyze why they differ by examining authorship purpose perspective and context', 'Discard both sources', 'Average the two accounts together'] },
    { q: 'What are the limitations of relying on a single source?', a: 'single sources reflect one perspective with particular biases and limited information access and may omit exaggerate or distort', alt: ['one perspective with biases', 'limited viewpoint', 'may distort or omit'], type: 'sa' },
    { q: 'If three independent witnesses describe the same event differently this suggests:', a: 'B', alt: [], type: 'mc', choices: ['All accounts must be wrong', 'Memory perspective and bias affect how events are observed and recorded', 'Only written accounts have value', 'The event did not actually happen'] },
    { q: 'Weighing evidence differs from counting sources because:', a: 'B', alt: [], type: 'mc', choices: ['More sources always means more truth', 'It considers source quality reliability proximity and independence not just quantity', 'Counting is always more accurate', 'All sources have equal weight'] },
    { q: 'A secondary source is most useful for corroboration when it:', a: 'B', alt: [], type: 'mc', choices: ['Agrees with your opinion', 'Is based on rigorous analysis of multiple primary sources and acknowledges competing interpretations', 'Is the most recent publication', 'Is the longest available source'] },
    { q: 'Why are contradictions between sources analytically valuable?', a: 'they reveal different perspectives biases and aspects of events and understanding why sources disagree often yields deeper historical understanding', alt: ['reveal different perspectives', 'show complexity', 'disagreement deepens understanding'], type: 'sa' },
  ],
  'close-reading': [
    { q: 'Close reading of a historical text requires:', a: 'B', alt: [], type: 'mc', choices: ['Speed reading for main ideas only', 'Careful attention to word choice tone structure and implicit meanings', 'Reading only the first and last paragraphs', 'Looking only for factual content'] },
    { q: 'How can word choice in a historical document reveal perspective?', a: 'connotation matters because words like patriot vs rebel or settlement vs invasion reveal values biases and framing', alt: ['connotation reveals values', 'word choice shows bias', 'framing through language'], type: 'sa' },
    { q: 'Subtext in a historical document refers to:', a: 'B', alt: [], type: 'mc', choices: ['The footnotes at the bottom', 'Underlying meanings assumptions or messages not explicitly stated', 'The bibliography section', 'Text highlighted by the author'] },
    { q: 'Analyzing the structure of a historical argument involves identifying:', a: 'B', alt: [], type: 'mc', choices: ['Only the conclusion of the argument', 'The claim evidence reasoning connecting them and what is left out', 'Only the introduction paragraph', 'The page count of the document'] },
    { q: 'When a document uses passive voice like mistakes were made this often indicates:', a: 'B', alt: [], type: 'mc', choices: ['Superior grammar usage', 'An attempt to avoid assigning responsibility or accountability', 'The authors stylistic preference only', 'Nothing of analytical significance'] },
    { q: 'What is the difference between the explicit claims and implicit assumptions in a text?', a: 'explicit claims are stated directly while implicit assumptions are unstated beliefs that underlie the argument', alt: ['stated vs unstated', 'direct claims vs underlying beliefs', 'explicit is stated implicit is assumed'], type: 'sa' },
    { q: 'Identifying the claim in a historical document means finding:', a: 'B', alt: [], type: 'mc', choices: ['Any factual statement', 'The main argument or position the author is advancing', 'A legal accusation', 'The longest sentence in the document'] },
  ],
  'silences-in-record': [
    { q: 'What are silences in the historical record?', a: 'voices perspectives and experiences that are absent from available sources', alt: ['absent voices', 'missing perspectives', 'marginalized voices not recorded'], type: 'sa' },
    { q: 'Historical silences often reflect:', a: 'B', alt: [], type: 'mc', choices: ['Quiet time periods in history', 'Power dynamics that determined whose perspectives were recorded and preserved', 'A lack of important events', 'Only censorship by governments'] },
    { q: 'Whose voices are most commonly absent from traditional historical records?', a: 'B', alt: [], type: 'mc', choices: ['Political leaders and elites', 'Women enslaved people indigenous populations and the poor', 'Military commanders', 'Religious leaders'] },
    { q: 'How can historians work to address silences in the record?', a: 'by using alternative sources like material culture oral histories archaeology and reading existing sources against the grain', alt: ['alternative sources', 'oral histories and archaeology', 'read sources against the grain'], type: 'sa' },
    { q: 'Reading against the grain means:', a: 'B', alt: [], type: 'mc', choices: ['Disagreeing with everything', 'Extracting information about marginalized groups from sources not created by or for them', 'Reading documents backwards', 'Only using grain production records'] },
    { q: 'The concept of the archive as a site of power means:', a: 'B', alt: [], type: 'mc', choices: ['Archives are always neutral repositories', 'Decisions about what to preserve and how to organize it reflect and reinforce power structures', 'Archives contain only government records', 'Power has nothing to do with preservation'] },
  ],
  'toulmin-model': [
    { q: 'What are the six elements of the Toulmin model of argumentation?', a: 'claim data warrant backing qualifier and rebuttal', alt: ['claim data warrant backing qualifier rebuttal', 'claim evidence warrant backing qualification rebuttal'], type: 'sa' },
    { q: 'In the Toulmin model the warrant is:', a: 'B', alt: [], type: 'mc', choices: ['The main claim being made', 'The logical connection explaining why the data supports the claim', 'The evidence presented', 'A counterargument'] },
    { q: 'A qualifier in the Toulmin model serves to:', a: 'B', alt: [], type: 'mc', choices: ['Make the argument stronger', 'Acknowledge limitations by using words like generally or in most cases', 'Eliminate all uncertainty', 'Replace the claim'] },
    { q: 'How does the Toulmin model differ from a simple claim-evidence structure?', a: 'it adds the warrant to explain why evidence supports the claim and includes qualifiers and rebuttals for nuance', alt: ['adds warrant qualifier rebuttal', 'explains why evidence supports claim', 'more nuanced than simple claim evidence'], type: 'sa' },
    { q: 'Data in the Toulmin model refers to:', a: 'B', alt: [], type: 'mc', choices: ['Only numerical statistics', 'The evidence facts or grounds that support the claim', 'The conclusions drawn', 'The counterarguments addressed'] },
    { q: 'Backing in the Toulmin model provides:', a: 'B', alt: [], type: 'mc', choices: ['Additional claims to prove', 'Support for the warrant itself showing why the reasoning is sound', 'A summary of the argument', 'The opposing viewpoint'] },
    { q: 'Why is the rebuttal element important in the Toulmin model?', a: 'B', alt: [], type: 'mc', choices: ['It weakens the argument', 'It shows awareness of counterarguments and conditions under which the claim might not hold', 'It is optional and unimportant', 'It replaces the warrant'] },
  ],
  'thesis-writing': [
    { q: 'An effective historical thesis statement:', a: 'B', alt: [], type: 'mc', choices: ['Simply states a fact everyone agrees on', 'Makes a debatable interpretive claim that can be supported with evidence', 'Is written as a question', 'Restates the essay prompt verbatim'] },
    { q: 'How does a thesis differ from a topic?', a: 'a topic is the subject matter while a thesis is an argument about the topic that takes a position', alt: ['topic is subject thesis is argument', 'thesis takes a position', 'topic vs interpretive claim'], type: 'sa' },
    { q: 'A complex thesis acknowledges:', a: 'B', alt: [], type: 'mc', choices: ['Only one perspective on the issue', 'Tensions contradictions or nuances rather than presenting an oversimplified argument', 'That both sides are equally correct', 'Only the most recent scholarship'] },
    { q: 'What does it mean for a thesis to address the so what question?', a: 'it explains why the argument matters and what its broader significance or implications are', alt: ['why the argument matters', 'broader significance', 'implications beyond the topic'], type: 'sa' },
    { q: 'Revising a thesis during the research process is:', a: 'B', alt: [], type: 'mc', choices: ['A sign of poor planning', 'A normal and important part of inquiry since evidence should shape the argument', 'Always unnecessary for good writers', 'Only for beginners'] },
    { q: 'A DBQ thesis should:', a: 'B', alt: [], type: 'mc', choices: ['Summarize each document individually', 'Present an arguable claim that can be supported by analyzing the provided documents and outside knowledge', 'List all the documents used', 'Avoid making any interpretive claims'] },
    { q: 'What makes an LEQ thesis different from a DBQ thesis?', a: 'an LEQ thesis must be supported entirely by the students own knowledge rather than provided documents', alt: ['relies on own knowledge', 'no documents provided', 'student supplies all evidence'], type: 'sa' },
  ],
  'evidence-integration': [
    { q: 'The evidence sandwich technique involves:', a: 'B', alt: [], type: 'mc', choices: ['Hiding evidence between paragraphs', 'Introducing evidence then presenting it then analyzing what it proves and why it matters', 'Using only direct quotes', 'Placing evidence randomly throughout'] },
    { q: 'Why must evidence be analyzed rather than simply presented?', a: 'evidence does not speak for itself and the writer must explain how and why it supports the claim', alt: ['evidence needs explanation', 'must connect to claim', 'does not speak for itself'], type: 'sa' },
    { q: 'In a DBQ essay documents should be used as:', a: 'B', alt: [], type: 'mc', choices: ['Items to summarize one by one', 'Evidence supporting a thesis with analysis of their perspective and limitations', 'Only if they agree with your argument', 'Background information only'] },
    { q: 'Effective transitions between evidence and analysis:', a: 'B', alt: [], type: 'mc', choices: ['Are unnecessary in good writing', 'Connect ideas logically showing relationships between evidence and the overarching argument', 'Only appear between paragraphs', 'Are just filler words'] },
    { q: 'When integrating a direct quote the writer should:', a: 'B', alt: [], type: 'mc', choices: ['Let the quote speak for itself', 'Introduce it with context present it and follow with analysis explaining its significance', 'Use only quotes longer than three sentences', 'Avoid all quotation marks'] },
    { q: 'How does paraphrasing differ from summarizing as evidence integration strategies?', a: 'paraphrasing restates a specific passage in your own words while summarizing condenses a larger work into its main ideas', alt: ['paraphrase is specific summary is broader', 'restating vs condensing', 'specific passage vs main ideas'], type: 'sa' },
    { q: 'Outside knowledge in a DBQ serves to:', a: 'B', alt: [], type: 'mc', choices: ['Replace the documents entirely', 'Provide additional context and evidence beyond what the documents contain', 'Show that documents are unreliable', 'Fill space when documents are insufficient'] },
  ],
  'counterarguments': [
    { q: 'Addressing counterarguments strengthens an argument because:', a: 'B', alt: [], type: 'mc', choices: ['It wastes the opponents time', 'It demonstrates awareness of complexity and shows the position can withstand objections', 'It confuses the reader', 'It is only required in formal debates'] },
    { q: 'What is the difference between a concession and a rebuttal?', a: 'a concession acknowledges the validity of an opposing point while a rebuttal explains why your argument remains stronger', alt: ['concession acknowledges rebuttal defends', 'acknowledge vs defend', 'admit validity then explain why yours is stronger'], type: 'sa' },
    { q: 'A steel man argument involves:', a: 'B', alt: [], type: 'mc', choices: ['Weakening the opposing view deliberately', 'Presenting the strongest version of the opposing argument before responding to it', 'Using a straw man fallacy', 'Ignoring all opposition'] },
    { q: 'When a counterargument has genuine merit the writer should:', a: 'B', alt: [], type: 'mc', choices: ['Pretend it does not exist', 'Acknowledge its strength and explain how their position accounts for it or remains stronger overall', 'Abandon the original thesis', 'Change the subject entirely'] },
    { q: 'The phrase to be sure is typically used in argumentation to:', a: 'B', alt: [], type: 'mc', choices: ['Express absolute certainty', 'Make a concession before pivoting back to the main argument', 'End an essay conclusion', 'Introduce a thesis statement'] },
    { q: 'Why is it important to anticipate counterarguments before they are raised?', a: 'it shows critical thinking and thorough preparation and prevents opponents from surprising you with objections', alt: ['shows preparation', 'prevents surprise objections', 'demonstrates critical thinking'], type: 'sa' },
  ],
  'question-development': [
    { q: 'A good research question is:', a: 'B', alt: [], type: 'mc', choices: ['Answerable with a simple yes or no', 'Open-ended specific enough to be researchable and significant enough to warrant investigation', 'As broad as possible to cover everything', 'A statement rather than a question'] },
    { q: 'How do you narrow a broad topic into a researchable question?', a: 'add specificity through time period geographic scope population and particular aspects then refine through preliminary research', alt: ['add specificity', 'narrow by time place and group', 'focus through preliminary research'], type: 'sa' },
    { q: 'Compelling inquiry questions often begin with:', a: 'B', alt: [], type: 'mc', choices: ['When did', 'How or why prompting analysis rather than factual recall', 'What is the definition of', 'Who was the leader of'] },
    { q: 'Supporting questions in the C3 Framework serve to:', a: 'B', alt: [], type: 'mc', choices: ['Replace the compelling question', 'Break down the compelling question into manageable researchable sub-questions', 'Distract from the main topic', 'Test only factual knowledge'] },
    { q: 'A fertile question is one that:', a: 'B', alt: [], type: 'mc', choices: ['Has exactly one correct answer', 'Generates multiple possible answers encourages investigation and opens further questions', 'Can be answered immediately', 'Is about agriculture'] },
    { q: 'Research questions should be revised when:', a: 'B', alt: [], type: 'mc', choices: ['Never under any circumstances', 'Preliminary research reveals the question is too broad too narrow or unanswerable', 'The teacher specifically requires revision', 'An easy answer is found immediately'] },
    { q: 'What is the difference between a compelling question and a supporting question?', a: 'a compelling question is the overarching thought-provoking question while supporting questions break it into researchable parts', alt: ['overarching vs parts', 'big question vs sub-questions', 'compelling drives inquiry supporting scaffolds it'], type: 'sa' },
  ],
  'source-identification': [
    { q: 'Effective research requires using:', a: 'B', alt: [], type: 'mc', choices: ['Only internet sources', 'A variety of primary and secondary sources from multiple perspectives', 'Only sources that support your thesis', 'Only the most recent publications'] },
    { q: 'How do you evaluate the credibility of an online source?', a: 'check the author credentials publisher date evidence cited methodology and whether other credible sources corroborate it', alt: ['check author publisher date evidence', 'evaluate credentials and corroboration', 'verify through multiple criteria'], type: 'sa' },
    { q: 'Lateral reading as a research strategy means:', a: 'B', alt: [], type: 'mc', choices: ['Reading sources from left to right', 'Checking what other sources say about a website or claim rather than only reading the site itself', 'Reading multiple books simultaneously', 'Only reading newspaper articles'] },
    { q: 'Academic databases differ from general internet searches because they:', a: 'B', alt: [], type: 'mc', choices: ['Contain fewer sources', 'Provide access to peer-reviewed scholarship and specialized research collections', 'Are always free to access', 'Only contain primary sources'] },
    { q: 'Peer review in academic sources provides:', a: 'B', alt: [], type: 'mc', choices: ['A guarantee of truth', 'Quality control through expert evaluation of methodology evidence and conclusions', 'Only editorial corrections', 'Nothing of real value'] },
    { q: 'Why is it important to include sources from multiple perspectives?', a: 'multiple perspectives reveal different facets of an issue prevent bias and produce more comprehensive understanding', alt: ['prevents bias', 'more comprehensive understanding', 'reveals different facets'], type: 'sa' },
  ],
  'annotated-bibliography': [
    { q: 'An annotated bibliography differs from a regular bibliography by:', a: 'B', alt: [], type: 'mc', choices: ['Being longer with no purpose', 'Including summaries and evaluations of each sources content relevance and reliability', 'Only listing books not articles', 'Being arranged chronologically'] },
    { q: 'What should an annotation typically include?', a: 'a summary of the source an evaluation of its reliability and an explanation of its relevance to the research question', alt: ['summary evaluation relevance', 'describe evaluate explain relevance', 'content reliability relevance'], type: 'sa' },
    { q: 'Why is an annotated bibliography useful during the research process?', a: 'B', alt: [], type: 'mc', choices: ['It is just a grading requirement', 'It helps organize sources evaluate their usefulness and plan how to integrate them into the argument', 'It replaces reading the actual sources', 'It is only useful for the final paper'] },
    { q: 'Proper citation is important beyond avoiding plagiarism because it:', a: 'B', alt: [], type: 'mc', choices: ['Only satisfies formatting requirements', 'Gives credit allows verification traces scholarly conversations and maintains knowledge integrity', 'Has no value beyond rule following', 'Is only required for published work'] },
    { q: 'When paraphrasing a source you must:', a: 'B', alt: [], type: 'mc', choices: ['Just change a few words from the original', 'Restate the idea entirely in your own words and cite the original source', 'Copy and paste with quotation marks only', 'Not cite the source if you changed it enough'] },
    { q: 'How does evaluating sources for an annotated bibliography improve research quality?', a: 'it forces critical engagement with each source ensuring only credible relevant evidence supports the argument', alt: ['forces critical evaluation', 'ensures credible evidence', 'critical engagement with sources'], type: 'sa' },
  ],
  'research-design': [
    { q: 'A literature review serves to:', a: 'B', alt: [], type: 'mc', choices: ['List every book on the topic', 'Survey existing scholarship to identify what is known debated and where gaps exist', 'Prove your thesis before starting research', 'Replace primary source research'] },
    { q: 'What is the difference between qualitative and quantitative research methods?', a: 'quantitative uses numerical data and statistical analysis while qualitative explores meaning through interviews observation and document analysis', alt: ['numbers vs meaning', 'statistical vs interpretive', 'quantitative is numerical qualitative is interpretive'], type: 'sa' },
    { q: 'Triangulation in research means:', a: 'B', alt: [], type: 'mc', choices: ['Using exactly three sources', 'Using multiple methods sources or perspectives to strengthen findings through cross-verification', 'Studying triangle-shaped regions', 'A mathematical approach only'] },
    { q: 'Ethical considerations in social studies research include:', a: 'B', alt: [], type: 'mc', choices: ['Only avoiding plagiarism', 'Informed consent accurate representation avoiding harm and honest reporting of findings', 'Only institutional approval requirements', 'Ethics do not apply to historical research'] },
    { q: 'Case study methodology is valuable because:', a: 'B', alt: [], type: 'mc', choices: ['It always proves general theories', 'It provides deep detailed examination of a specific instance that can illuminate broader patterns', 'It is the quickest method available', 'Results are always generalizable'] },
    { q: 'How does mixed-methods research combine quantitative and qualitative approaches?', a: 'it uses both numerical data and interpretive analysis to provide complementary perspectives on the research question', alt: ['combines numbers and interpretation', 'complementary perspectives', 'both statistical and interpretive'], type: 'sa' },
  ],
  'history-connections': [
    { q: 'Connecting history to other disciplines enriches analysis because:', a: 'B', alt: [], type: 'mc', choices: ['History is insufficient on its own', 'Different disciplinary lenses reveal aspects that a single discipline might miss', 'Other disciplines are more important', 'History has no connections to anything'] },
    { q: 'How does economic history deepen understanding of political events?', a: 'economic conditions like inequality trade disputes and resource competition often drive political decisions wars and social movements', alt: ['economic conditions drive politics', 'inequality drives political change', 'economics shapes political decisions'], type: 'sa' },
    { q: 'The relationship between economic inequality and political instability historically shows:', a: 'B', alt: [], type: 'mc', choices: ['Inequality has no political effects', 'Extreme inequality often precedes revolutions reforms or authoritarian responses', 'Only economic growth matters politically', 'Equality itself causes instability'] },
    { q: 'Creative destruction in economic history means:', a: 'B', alt: [], type: 'mc', choices: ['Only destruction of old industries', 'Innovation displaces old industries and ways of life creating both progress and disruption', 'Economic history is static', 'Destruction is always purely negative'] },
    { q: 'How did economic motivations drive the Atlantic slave trade?', a: 'B', alt: [], type: 'mc', choices: ['Economics was irrelevant to slavery', 'Demand for cheap labor on plantations mercantilist competition and profit motives drove enslavement', 'Only moral arguments mattered', 'Slavery had no economic dimension'] },
    { q: 'Why is it important to consider multiple disciplinary perspectives on a historical event?', a: 'each discipline reveals different causes effects and meanings that together provide a more complete understanding', alt: ['reveals different causes', 'more complete understanding', 'different perspectives complement each other'], type: 'sa' },
  ],
  'government-connections': [
    { q: 'How does understanding government structures help interpret historical events?', a: 'political institutions shape what actions are possible who has power and how decisions are made which directly affects historical outcomes', alt: ['institutions shape outcomes', 'power structures affect events', 'government shapes what is possible'], type: 'sa' },
    { q: 'The relationship between political power and historical change is:', a: 'B', alt: [], type: 'mc', choices: ['Nonexistent', 'Reciprocal as political structures both shape and are shaped by historical developments', 'One-directional from politics to history', 'Only relevant in democracies'] },
    { q: 'Constitutional principles influence historical analysis by:', a: 'B', alt: [], type: 'mc', choices: ['Being irrelevant to history', 'Providing frameworks for understanding debates about rights power and governance across time', 'Only applying to American history', 'Being static and unchanging'] },
    { q: 'How does comparative government deepen historical understanding?', a: 'B', alt: [], type: 'mc', choices: ['It does not help at all', 'Comparing political systems reveals how different structures produce different outcomes for similar challenges', 'Only Western governments can be compared', 'Government comparison is only for political science'] },
    { q: 'Federalism as a concept connects to history by:', a: 'B', alt: [], type: 'mc', choices: ['Having no historical dimension', 'Showing how the balance between central and regional power has shifted over time in response to crises and movements', 'Only applying to the US Constitution', 'Being a purely modern concept'] },
    { q: 'Why do historians need to understand political philosophy?', a: 'political ideas like natural rights social contract and consent of the governed motivated historical actors and shaped institutions', alt: ['ideas motivated actors', 'philosophy shaped institutions', 'political concepts drove historical change'], type: 'sa' },
  ],
  'economics-connections': [
    { q: 'Economic analysis enriches historical understanding by:', a: 'B', alt: [], type: 'mc', choices: ['Replacing all other analyses', 'Revealing how material conditions resource distribution and trade shape social and political developments', 'Being the only factor that matters', 'Only applying to modern history'] },
    { q: 'How does economic interdependence affect international relations historically?', a: 'it can both reduce conflict through trade relationships and create new tensions through dependency and competition', alt: ['reduces conflict and creates tensions', 'trade incentivizes peace but creates vulnerabilities', 'both cooperation and conflict'], type: 'sa' },
    { q: 'The concept of supply and demand connects to historical events by:', a: 'B', alt: [], type: 'mc', choices: ['Having no historical relevance', 'Explaining price changes resource competition and economic motivations that drove colonialism trade and conflict', 'Only applying to modern markets', 'Being purely theoretical'] },
    { q: 'How did mercantilism shape colonial history?', a: 'B', alt: [], type: 'mc', choices: ['Mercantilism had no effect on colonies', 'The drive to accumulate wealth through favorable trade balances motivated European colonization and exploitation', 'Colonies existed independently of economic systems', 'Only free trade affected colonialism'] },
    { q: 'Labor economics connects to social history by:', a: 'B', alt: [], type: 'mc', choices: ['Having no connection', 'Revealing how working conditions wages and labor movements shaped class formation and social change', 'Only concerning modern workers', 'Being irrelevant to social movements'] },
    { q: 'Why should historians consider economic data alongside qualitative sources?', a: 'economic data provides measurable evidence of material conditions while qualitative sources reveal how people experienced and responded to those conditions', alt: ['data measures conditions qualitative shows experience', 'combines measurement and meaning', 'quantitative and qualitative complement each other'], type: 'sa' },
  ],
  'geography-connections': [
    { q: 'Geopolitics examines:', a: 'B', alt: [], type: 'mc', choices: ['Only map-making techniques', 'How geographic factors like location resources and terrain influence political power and international relations', 'Only climate effects on agriculture', 'Only modern border disputes'] },
    { q: 'How has geography influenced political development historically?', a: 'geographic features like mountains rivers resources and climate shape settlement patterns trade routes political boundaries and power dynamics', alt: ['geographic features shape politics', 'terrain affects settlement and power', 'resources and location shape development'], type: 'sa' },
    { q: 'Environmental possibilism argues that:', a: 'B', alt: [], type: 'mc', choices: ['Geography completely determines culture', 'Geography sets constraints but humans make choices within those constraints', 'Geography is irrelevant to human development', 'Only climate matters'] },
    { q: 'Borders are political because they:', a: 'B', alt: [], type: 'mc', choices: ['Are natural geographic features', 'Define sovereignty control movement and often reflect historical power dynamics', 'Have no real impact on people', 'Are always permanent and unchanging'] },
    { q: 'Resource geography affects international relations through:', a: 'B', alt: [], type: 'mc', choices: ['Having no effect whatsoever', 'Resource dependency trade relationships conflict over scarce resources and uneven development', 'Only oil politics', 'Only water disputes'] },
    { q: 'How does understanding geography improve source analysis?', a: 'knowing geographic context helps explain why events occurred where they did and how location shaped perspectives and outcomes', alt: ['explains where and why events occurred', 'location shapes perspectives', 'geographic context illuminates sources'], type: 'sa' },
  ],
  'issue-identification': [
    { q: 'The first step in civic inquiry is:', a: 'B', alt: [], type: 'mc', choices: ['Taking immediate action', 'Identifying and defining a civic issue through research and evidence gathering', 'Forming an opinion without research', 'Waiting for others to act'] },
    { q: 'How does community-based research connect inquiry to civic action?', a: 'it applies inquiry skills to real local issues where students identify problems gather evidence analyze causes and propose solutions', alt: ['applies inquiry to local issues', 'identifies problems and proposes solutions', 'connects research to real communities'], type: 'sa' },
    { q: 'A stakeholder analysis identifies:', a: 'B', alt: [], type: 'mc', choices: ['Only the government officials involved', 'All parties affected by or having influence over an issue including their interests power and potential roles', 'Only opponents of change', 'Only supporters of the proposal'] },
    { q: 'Evidence-based issue identification differs from opinion by:', a: 'B', alt: [], type: 'mc', choices: ['Using bigger vocabulary', 'Grounding the problem definition in researched data logical reasoning and credible sources', 'Being louder and more passionate', 'Having more supporters'] },
    { q: 'Root cause analysis in civic inquiry requires:', a: 'B', alt: [], type: 'mc', choices: ['Only identifying symptoms', 'Investigating the underlying structural causes of problems not just their visible effects', 'Blaming specific individuals', 'Accepting the first explanation found'] },
    { q: 'Why is it important to research an issue thoroughly before taking civic action?', a: 'thorough research ensures the action addresses actual causes is evidence-based and considers unintended consequences', alt: ['ensures evidence-based action', 'addresses actual causes', 'considers unintended consequences'], type: 'sa' },
  ],
  'evidence-based-positions': [
    { q: 'An evidence-based civic position differs from mere opinion by:', a: 'B', alt: [], type: 'mc', choices: ['Being more strongly held', 'Being supported by researched evidence logical reasoning and engagement with counterarguments', 'Having more emotional appeal', 'Being held by more people'] },
    { q: 'How do you build a credible civic argument?', a: 'use reliable evidence address counterarguments acknowledge complexity and propose specific actionable solutions', alt: ['reliable evidence and counterarguments', 'evidence acknowledge complexity propose solutions', 'credible sources and actionable proposals'], type: 'sa' },
    { q: 'Policy analysis requires:', a: 'B', alt: [], type: 'mc', choices: ['Only identifying problems', 'Identifying the problem analyzing causes evaluating proposed solutions and considering implementation challenges', 'Only criticizing current government policy', 'Only economic cost-benefit analysis'] },
    { q: 'When communicating evidence-based positions to decision-makers you should:', a: 'B', alt: [], type: 'mc', choices: ['Use academic jargon extensively', 'Be concise lead with key findings propose specific actions and anticipate objections', 'Only use emotional appeals', 'Present only supporting evidence'] },
    { q: 'Intellectual honesty in civic argumentation requires:', a: 'B', alt: [], type: 'mc', choices: ['Only supporting your side', 'Reporting evidence accurately acknowledging limitations and representing opposing views fairly', 'Winning the argument at all costs', 'Avoiding controversial evidence'] },
    { q: 'Why should civic arguments address counterarguments?', a: 'addressing counterarguments builds credibility demonstrates comprehensive understanding and strengthens the overall position', alt: ['builds credibility', 'demonstrates understanding', 'strengthens position'], type: 'sa' },
  ],
  'action-planning': [
    { q: 'Taking informed action in social studies means:', a: 'B', alt: [], type: 'mc', choices: ['Any action regardless of research', 'Using inquiry findings to engage constructively in civic life through communication proposals or participation', 'Only voting in elections', 'Only protesting in the streets'] },
    { q: 'A theory of change in civic action:', a: 'B', alt: [], type: 'mc', choices: ['Is purely theoretical with no practical value', 'Maps logical steps from current conditions to desired outcomes identifying what must change and how', 'Only applies to large organizations', 'Is not needed for local civic issues'] },
    { q: 'Effective civic action strategies include:', a: 'B', alt: [], type: 'mc', choices: ['Only writing letters', 'Presenting findings to decision-makers writing op-eds creating awareness campaigns and organizing community action', 'Only social media posts', 'Only attending government meetings'] },
    { q: 'Coalition building involves:', a: 'B', alt: [], type: 'mc', choices: ['Working entirely alone', 'Identifying and partnering with diverse groups that share common goals despite different priorities', 'Only working with people who agree completely', 'Avoiding all compromise'] },
    { q: 'Evaluating civic action effectiveness requires:', a: 'B', alt: [], type: 'mc', choices: ['Only counting participants in events', 'Assessing whether goals were achieved what impact was created and what lessons were learned', 'Assuming all action is equally successful', 'Only measuring media coverage received'] },
    { q: 'How does digital civic action complement traditional organizing?', a: 'digital tools amplify reach and reduce costs but are most effective when combined with in-person relationship building and direct engagement', alt: ['amplifies reach complements in-person', 'digital plus offline is most effective', 'technology extends but does not replace organizing'], type: 'sa' },
  ],
  'democratic-participation': [
    { q: 'Democratic participation extends beyond voting to include:', a: 'B', alt: [], type: 'mc', choices: ['Nothing else matters besides voting', 'Contacting officials attending hearings jury service volunteering advocacy and community organizing', 'Only campaign donations', 'Only protesting'] },
    { q: 'How does civic education relate to democratic health?', a: 'civic education builds knowledge of institutions develops critical thinking cultivates deliberation skills and creates civic responsibility', alt: ['builds knowledge and skills', 'develops critical thinking about democracy', 'creates informed engaged citizens'], type: 'sa' },
    { q: 'Barriers to democratic participation include:', a: 'B', alt: [], type: 'mc', choices: ['Only voter ID requirements', 'Time constraints economic inequality limited information access disillusionment and structural barriers', 'Only age restrictions', 'There are no significant barriers'] },
    { q: 'Participatory budgeting is an example of:', a: 'B', alt: [], type: 'mc', choices: ['Government waste and inefficiency', 'Direct democracy where community members decide how to allocate public funds', 'A purely theoretical concept', 'Only reducing government spending'] },
    { q: 'The relationship between rights and responsibilities in democracy means:', a: 'B', alt: [], type: 'mc', choices: ['Only rights matter for citizens', 'Democratic rights come with responsibilities like informed participation and respect for others rights', 'Only responsibilities matter for citizens', 'Rights and responsibilities are unrelated'] },
    { q: 'Why is youth civic engagement important?', a: 'it builds democratic habits early addresses issues affecting young people and research shows early engagement leads to lifelong participation', alt: ['builds democratic habits', 'lifelong participation', 'ensures young voices are heard'], type: 'sa' },
  ],
};

const PROMPTS = {
  'historical-analysis': {
    name: 'Document-Based Question (DBQ)',
    tasks: [
      'To what extent did economic factors cause the American Revolution? Use provided documents and your knowledge of the period to construct your argument.',
      'Evaluate the extent to which the New Deal represented a turning point in the relationship between the federal government and American citizens.',
      'Analyze the causes and consequences of one major social movement using primary sources to support a thesis with contextualization and evidence.',
      'Using CCOT analysis, evaluate the extent to which the role of the federal government changed between 1877 and 1937.',
      'Compare and contrast two revolutionary movements and evaluate whether shared structural conditions or unique cultural factors better explain their outcomes.',
    ],
  },
  'source-evaluation': {
    name: 'Source Analysis (HAPP Framework)',
    tasks: [
      'Analyze a primary source using the HAPP framework: Historical context, Audience, Purpose, and Point of view. What does it reveal and what are its limitations?',
      'Compare and contrast two primary sources describing the same event from different perspectives. What do the differences reveal about each authors position?',
      'Evaluate the reliability of a government-produced source for understanding the experiences of ordinary citizens during a period of crisis.',
      'Identify the silences in a set of sources about a historical event. Whose voices are missing and what alternative sources could address these gaps?',
      'Conduct a close reading of a political speech, analyzing word choice, tone, structure, and implicit assumptions to evaluate the speakers argument.',
    ],
  },
  'argumentation': {
    name: 'Argumentative Essay (Toulmin Model)',
    tasks: [
      'Was the decision to drop atomic bombs on Hiroshima and Nagasaki justified? Develop a thesis using the Toulmin model with claim, data, warrant, and rebuttal.',
      'To what extent is democracy the most effective form of government? Use historical and contemporary evidence with explicit warrants connecting evidence to claims.',
      'Write a Long Essay Question (LEQ) evaluating the claim that economic inequality is the greatest threat to democratic stability across multiple time periods.',
      'Construct a Short Answer Question (SAQ) response analyzing how one specific historical development both supported and challenged democratic ideals.',
      'Write a persuasive essay on a current policy issue using the evidence sandwich technique, counterargument engagement, and a complex thesis.',
    ],
  },
  'research-methodology': {
    name: 'Research Proposal',
    tasks: [
      'Design a research project investigating a local history topic. Identify your question, potential primary and secondary sources, methodology, and expected challenges.',
      'Propose a comparative study examining how two different countries responded to the same historical challenge. Explain your research design and ethical considerations.',
      'Develop a research proposal for an oral history project with a community group, addressing methodology, ethical considerations, and an annotated bibliography plan.',
      'Create an annotated bibliography of at least five sources for a research question you develop, evaluating each sources reliability, relevance, and perspective.',
    ],
  },
  'interdisciplinary-connections': {
    name: 'Interdisciplinary Analysis',
    tasks: [
      'Analyze the impact of climate change using economic, political, geographic, and cultural lenses. How do different disciplinary perspectives deepen understanding?',
      'Examine a current global conflict through geographic, historical, economic, and governmental frameworks. What does each perspective uniquely reveal?',
      'How does the intersection of technology and society create both opportunities and challenges? Analyze using multiple social studies disciplines and historical examples.',
      'Trace a single commodity (cotton, oil, sugar) through history examining its economic, geographic, political, and social dimensions across at least three centuries.',
    ],
  },
  'civic-action': {
    name: 'Civic Action Proposal',
    tasks: [
      'Identify a problem in your community. Research its causes, analyze current responses, conduct a stakeholder analysis, and propose an evidence-based plan for civic action.',
      'Design an awareness campaign for a social issue using evidence, specifying target audience, strategy, coalition partners, and evaluation metrics.',
      'Write a letter to a public official about a policy issue using evidence-based reasoning, addressing counterarguments, and proposing specific actionable solutions.',
      'Develop a theory of change for addressing a local civic issue, mapping logical steps from current conditions to desired outcomes with evaluation criteria.',
    ],
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

function masteryLabel(r) {
  return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ]/g, ''); }

function allSkillKeys() {
  const keys = [];
  for (const cat of Object.keys(SKILLS)) {
    for (const sk of SKILLS[cat]) keys.push(sk);
  }
  return keys;
}

function findSkillCategory(skill) {
  for (const [cat, arr] of Object.entries(SKILLS)) {
    if (arr.includes(skill)) return cat;
  }
  return null;
}

// Exercise generation

function generateExercise(skill, count = 5) {
  const bank = CONTENT_BANKS[skill];
  if (!bank) return { error: `No content bank for ${skill}. Valid: ${allSkillKeys().join(', ')}` };
  const cat = findSkillCategory(skill);
  const items = pick(bank, count);
  return {
    type: 'inquiry',
    skill,
    category: cat,
    count: items.length,
    instruction: 'Answer each question. For multiple choice (mc), respond with the letter. For short answer (sa), provide a brief response.',
    items: items.map((item, i) => ({
      number: i + 1,
      type: item.type,
      question: item.q,
      choices: item.choices || null,
      answer: item.a,
      alt: item.alt,
    })),
  };
}

// Answer checking

function checkAnswer(item, answer) {
  if (item.type === 'mc') {
    return norm(item.a) === norm(answer.charAt(0));
  }
  const na = norm(answer);
  const ne = norm(item.a);
  if (na.includes(ne) || ne.includes(na)) return true;
  if (item.alt && item.alt.length) {
    for (const alt of item.alt) {
      const nalt = norm(alt);
      if (na.includes(nalt) || nalt.includes(na)) return true;
    }
  }
  return false;
}

// Public API

class Inquiry {
  start(id) {
    const p = loadProfile(id);
    return {
      action: 'start',
      profile: { studentId: p.studentId, createdAt: p.createdAt, focus: p.focus, totalAssessments: p.assessments.length },
      nextSkills: this.next(id),
    };
  }

  lesson(id) {
    const p = loadProfile(id);
    const target = this.next(id, 3).next[0];
    if (!target) return { message: 'All skills proficient! Great work on Inquiry & Research.', categories: Object.keys(SKILLS) };
    const exercise = generateExercise(target.skill, 5);
    const promptData = PROMPTS[target.category] || null;
    return {
      studentId: id,
      targetSkill: target,
      exercise,
      writingPrompt: promptData ? { name: promptData.name, task: pick(promptData.tasks, 1)[0] } : null,
      lessonPlan: {
        review: 'Review previously covered concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        writing: promptData ? `Apply skill through writing: "${promptData.name}"` : 'Practice inquiry skills through analysis and writing',
        connect: 'Connect to real-world research and civic engagement',
      },
    };
  }

  exercise(skill, count = 5) {
    return generateExercise(skill, count);
  }

  check(type, expected, answer) {
    const item = { type, a: expected, alt: [] };
    return { correct: checkAnswer(item, answer), expected, studentAnswer: answer };
  }

  record(id, skill, score, total, notes = '') {
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

  progress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, arr] of Object.entries(SKILLS)) {
      results[cat] = {};
      for (const sk of arr) {
        total++;
        const d = p.skills[sk];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    const catSummary = {};
    for (const [cat, arr] of Object.entries(SKILLS)) {
      const vals = arr.map(sk => {
        const d = p.skills[sk];
        return d ? d.mastery : 0;
      });
      const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
      catSummary[cat] = { avgMastery: Math.round(avg * 100) / 100, label: masteryLabel(avg) };
    }
    return { studentId: id, focus: p.focus, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, categorySummary: catSummary, skills: results };
  }

  report(id) {
    const p = loadProfile(id);
    return { studentId: id, focus: p.focus, progress: this.progress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  next(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    const focusCats = p.focus ? [p.focus] : Object.keys(SKILLS);
    for (const cat of focusCats) {
      if (!SKILLS[cat]) continue;
      for (const sk of SKILLS[cat]) {
        const d = p.skills[sk];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, category: cat, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, focus: p.focus, next: candidates.slice(0, count) };
  }

  catalog() {
    const cat = {};
    let total = 0;
    for (const [category, arr] of Object.entries(SKILLS)) {
      cat[category] = arr;
      total += arr.length;
    }
    return { categories: Object.keys(SKILLS), catalog: cat, totalSkills: total };
  }

  setFocus(id, category) {
    if (!SKILLS[category]) throw new Error(`Unknown category: ${category}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id);
    p.focus = category;
    saveProfile(p);
    return { studentId: id, focus: category, skills: SKILLS[category] };
  }

  prompt(category) {
    if (!PROMPTS[category]) return { error: `No prompts for ${category}. Valid: ${Object.keys(PROMPTS).join(', ')}` };
    const data = PROMPTS[category];
    return { category, name: data.name, task: pick(data.tasks, 1)[0], allTasks: data.tasks };
  }

  students() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

module.exports = Inquiry;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Inquiry();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id] = args;
        if (!id) throw new Error('Usage: start <id>');
        out(api.start(id));
        break;
      }
      case 'lesson': {
        const [, id] = args;
        if (!id) throw new Error('Usage: lesson <id>');
        out(api.lesson(id));
        break;
      }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        if (skill) { out(api.exercise(skill, 5)); }
        else { const n = api.next(id, 1).next; out(n.length ? api.exercise(n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.check(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, skill, sc, tot, ...notes] = args;
        if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total> [notes]');
        out(api.record(id, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': {
        const [, id] = args;
        if (!id) throw new Error('Usage: progress <id>');
        out(api.progress(id));
        break;
      }
      case 'report': {
        const [, id] = args;
        if (!id) throw new Error('Usage: report <id>');
        out(api.report(id));
        break;
      }
      case 'next': {
        const [, id, n] = args;
        if (!id) throw new Error('Usage: next <id> [count]');
        out(api.next(id, n ? Number(n) : 5));
        break;
      }
      case 'catalog': {
        out(api.catalog());
        break;
      }
      case 'setFocus': {
        const [, id, cat] = args;
        if (!id || !cat) throw new Error('Usage: setFocus <id> <category>');
        out(api.setFocus(id, cat));
        break;
      }
      case 'prompt': {
        const [, cat] = args;
        if (!cat) throw new Error('Usage: prompt <category>');
        out(api.prompt(cat));
        break;
      }
      case 'students': {
        out(api.students());
        break;
      }
      default:
        out({
          usage: 'node inquiry.js <command> [args]',
          commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'setFocus', 'prompt', 'students'],
          categories: Object.keys(SKILLS),
          skills: allSkillKeys(),
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
