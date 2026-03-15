// eClaw HS Research & Media Literacy Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-research-media');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'research-question-formulation': ['narrowing-topics', 'open-ended-questions', 'researchable-claims'],
    'source-evaluation-basic': ['craap-test-intro', 'source-types', 'credibility-basics'],
    'mla-citation-basic': ['in-text-author-page', 'works-cited-book', 'works-cited-website'],
    'paraphrase-vs-plagiarism': ['identify-plagiarism', 'effective-paraphrase', 'when-to-quote'],
    'short-research-report': ['thesis-from-research', 'integrating-evidence', 'intro-conclusion'],
    'media-evaluation-basic': ['fact-vs-opinion', 'clickbait-detection', 'source-comparison'],
  },
  'grade-10': {
    'annotated-bibliography': ['summary-component', 'evaluation-component', 'reflection-component'],
    'multi-source-research': ['synthesis-matrix', 'source-agreement-disagreement', 'filling-gaps'],
    'mla-citation-advanced': ['multiple-authors', 'secondary-sources', 'multimedia-citations'],
    'note-taking-synthesis': ['cornell-notes', 'paraphrase-notes', 'quote-integration'],
    'extended-research-essay': ['outline-structure', 'counterargument', 'works-cited-page'],
    'media-bias-analysis': ['selection-bias', 'framing-bias', 'comparing-outlets'],
  },
  'grade-11': {
    'ap-synthesis-skills': ['synthesizing-multiple-perspectives', 'qualifying-claims', 'evidence-commentary'],
    'advanced-source-analysis': ['scholarly-vs-popular', 'primary-vs-secondary', 'lateral-reading'],
    'mla-apa-citation': ['apa-in-text', 'apa-references', 'choosing-mla-vs-apa'],
    'research-paper-full': ['literature-review-section', 'argument-structure', 'revision-strategies'],
    'media-rhetoric-analysis': ['rhetorical-appeals-media', 'propaganda-techniques', 'visual-rhetoric'],
    'literature-review-basics': ['identifying-themes', 'organizing-by-theme', 'gap-analysis'],
  },
  'grade-12': {
    'senior-thesis-research': ['thesis-proposal', 'methodology-basics', 'research-timeline'],
    'academic-source-evaluation': ['peer-review-process', 'database-searching', 'evaluating-methodology'],
    'citation-mastery': ['complex-mla-cases', 'complex-apa-cases', 'annotated-bib-full'],
    'college-level-research': ['academic-tone', 'hedging-language', 'entering-scholarly-conversation'],
    'digital-media-criticism': ['algorithm-awareness', 'deepfake-detection', 'misinformation-tracking'],
    'capstone-project': ['proposal-writing', 'project-management', 'presentation-defense'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'grade-9': {
    'narrowing-topics': { items: [
      { broad: 'Climate change', narrowed: 'How does rising sea level affect coastal farming communities in Bangladesh?', answer: 'narrowed', rule: 'A good research question is specific, focused, and researchable.' },
      { broad: 'Social media', narrowed: 'How does Instagram use affect body image in teenage girls aged 13-17?', answer: 'narrowed', rule: 'Narrow by population, time, place, or aspect.' },
      { broad: 'Education', narrowed: 'Does later school start time improve academic performance in US high schools?', answer: 'narrowed', rule: 'Add specific variables and a measurable outcome.' },
      { broad: 'Technology', narrowed: 'How has AI-generated art impacted freelance digital illustrators since 2022?', answer: 'narrowed', rule: 'Specify the technology, population, and timeframe.' },
      { broad: 'Health', narrowed: 'What effect does daily meditation have on anxiety levels in college students?', answer: 'narrowed', rule: 'Include cause, effect, and population.' },
      { broad: 'Sports', narrowed: 'Should youth football leagues ban tackling for players under 12 to reduce concussions?', answer: 'narrowed', rule: 'Focus on a specific policy, population, and outcome.' },
    ]},
    'open-ended-questions': { items: [
      { question: 'What year did World War II end?', answer: 'closed', explanation: 'This has a single factual answer (1945). Research questions should require analysis.' },
      { question: 'How did propaganda shape public opinion during World War II?', answer: 'open', explanation: 'This requires analysis of evidence and can be argued from multiple angles.' },
      { question: 'Is social media good or bad?', answer: 'closed', explanation: 'Yes/no questions are too simple. Reframe: "In what ways does social media affect..."' },
      { question: 'To what extent has social media changed political engagement among young voters?', answer: 'open', explanation: '"To what extent" invites nuanced analysis with evidence.' },
      { question: 'Who invented the internet?', answer: 'closed', explanation: 'Factual recall, not analysis. Better: "How did the development of the internet reshape..."' },
      { question: 'How should schools balance student privacy with campus safety in surveillance policies?', answer: 'open', explanation: 'Requires weighing competing values with evidence.' },
    ]},
    'researchable-claims': { items: [
      { claim: 'Dogs are the best pets.', answer: 'opinion', explanation: '"Best" is subjective. Reframe with measurable criteria.' },
      { claim: 'Bilingual education programs improve standardized test scores.', answer: 'researchable', explanation: 'Can be investigated with data and studies.' },
      { claim: 'Everyone should exercise daily.', answer: 'opinion', explanation: 'Too broad and prescriptive. Reframe with specific population and outcome.' },
      { claim: 'Minimum wage increases in Seattle correlated with reduced hours for low-wage workers.', answer: 'researchable', explanation: 'Specific, measurable, and evidence-based.' },
      { claim: 'Video games cause violence.', answer: 'opinion', explanation: 'Oversimplified causal claim. Reframe: "Research suggests a correlation between..."' },
      { claim: 'Sleep deprivation among teenagers correlates with lower GPA.', answer: 'researchable', explanation: 'Specific variables that can be studied empirically.' },
    ]},
    'craap-test-intro': { items: [
      { scenario: 'A website about vaccines has no author listed, no date, and is sponsored by a supplement company.', rating: 'unreliable', criteria: 'Fails Authority (no author), Currency (no date), and Purpose (commercial bias).', answer: 'unreliable' },
      { scenario: 'A 2024 peer-reviewed journal article by a university professor studying teen social media use.', rating: 'reliable', criteria: 'Passes Currency (recent), Authority (professor), Accuracy (peer-reviewed).', answer: 'reliable' },
      { scenario: 'A blog post from 2009 about smartphone effects on children, written by an anonymous parent.', rating: 'unreliable', criteria: 'Fails Currency (outdated tech), Authority (anonymous), Accuracy (no evidence cited).', answer: 'unreliable' },
      { scenario: 'A CDC report from 2023 on teen mental health trends with cited statistics.', rating: 'reliable', criteria: 'Passes Authority (government agency), Accuracy (cited data), Purpose (inform public).', answer: 'reliable' },
      { scenario: 'An article on a .com site with emotional language, no sources cited, urging readers to buy a product.', rating: 'unreliable', criteria: 'Fails Accuracy (no sources), Purpose (selling), and shows bias through emotional language.', answer: 'unreliable' },
      { scenario: 'A New York Times investigative report from 2024 with named sources and linked documents.', rating: 'reliable', criteria: 'Passes Authority (major newspaper), Accuracy (named sources, documents), Currency (recent).', answer: 'reliable' },
    ]},
    'source-types': { items: [
      { source: 'An article in The Journal of Adolescent Health', answer: 'scholarly', explanation: 'Peer-reviewed academic journal — highest authority for research.' },
      { source: 'A Wikipedia article on climate change', answer: 'reference', explanation: 'Good starting point but not a citable source. Follow its citations to primary sources.' },
      { source: 'A CNN news broadcast about an election', answer: 'popular', explanation: 'News media — useful for current events but check for bias and verify claims.' },
      { source: 'A government census report', answer: 'primary', explanation: 'Primary source of statistical data — high authority for demographic claims.' },
      { source: 'A personal blog about nutrition', answer: 'informal', explanation: 'No editorial oversight — verify any claims against reliable sources.' },
      { source: 'An editorial in The Washington Post', answer: 'opinion', explanation: 'Editorials present arguments, not neutral reporting. Useful for understanding perspectives.' },
    ]},
    'credibility-basics': { items: [
      { prompt: 'Which domain is generally most credible for academic research?', options: ['.edu', '.com', '.biz'], answer: '.edu', rule: 'Educational institutions have academic oversight.' },
      { prompt: 'A source with no author listed is...', options: ['always unreliable', 'less credible and needs extra verification', 'fine if the website looks professional'], answer: 'less credible and needs extra verification', rule: 'Anonymous sources lack accountability.' },
      { prompt: 'Why is peer review important?', options: ['It makes articles longer', 'Experts verify the methodology and claims', 'It guarantees the article is correct'], answer: 'Experts verify the methodology and claims', rule: 'Peer review is quality control, not a guarantee of truth.' },
      { prompt: 'What should you do if two sources contradict each other?', options: ['Pick the one you agree with', 'Look for additional sources to verify', 'Ignore both'], answer: 'Look for additional sources to verify', rule: 'Triangulate claims across multiple reliable sources.' },
      { prompt: 'A 2005 article about social media trends is...', options: ['still perfectly relevant', 'outdated for this rapidly changing topic', 'more reliable because it is older'], answer: 'outdated for this rapidly changing topic', rule: 'Currency matters most for fast-changing topics.' },
      { prompt: 'An article funded by a tobacco company about smoking risks is...', options: ['automatically false', 'potentially biased and needs independent verification', 'more trustworthy because they know the industry'], answer: 'potentially biased and needs independent verification', rule: 'Funding sources can create conflicts of interest.' },
    ]},
    'in-text-author-page': { items: [
      { scenario: 'Author Smith, page 42, not named in sentence', answer: '(Smith 42)', rule: 'MLA in-text: (Author Page) when author is not in the signal phrase.' },
      { scenario: 'Author Garcia, page 15, named in sentence: According to Garcia...', answer: '(15)', rule: 'When author is named in signal phrase, only include page number.' },
      { scenario: 'Authors Lee and Park, page 78', answer: '(Lee and Park 78)', rule: 'Two authors: include both names joined by "and."' },
      { scenario: 'Authors Johnson, Smith, and Brown, page 103', answer: '(Johnson et al. 103)', rule: 'Three or more authors: use first author et al.' },
      { scenario: 'No author, article titled "Rising Seas," page 5', answer: '("Rising Seas" 5)', rule: 'No author: use shortened title in quotes.' },
      { scenario: 'Web source by Davis, no page numbers', answer: '(Davis)', rule: 'No page number: just include the author name.' },
    ]},
    'works-cited-book': { items: [
      { info: 'Author: Harper Lee, Title: To Kill a Mockingbird, Publisher: HarperCollins, Year: 2006', answer: 'Lee, Harper. To Kill a Mockingbird. HarperCollins, 2006.', rule: 'Book: Last, First. Title (italics). Publisher, Year.' },
      { info: 'Author: George Orwell, Title: 1984, Publisher: Signet Classics, Year: 1961', answer: 'Orwell, George. 1984. Signet Classics, 1961.', rule: 'Book: Last, First. Title (italics). Publisher, Year.' },
      { info: 'Author: Toni Morrison, Title: Beloved, Publisher: Vintage, Year: 2004', answer: 'Morrison, Toni. Beloved. Vintage, 2004.', rule: 'Book: Last, First. Title (italics). Publisher, Year.' },
      { info: 'Authors: Strunk and White, Title: The Elements of Style, Publisher: Pearson, Year: 2019', answer: 'Strunk, William, and E. B. White. The Elements of Style. Pearson, 2019.', rule: 'Two authors: Last, First, and First Last.' },
      { info: 'Author: Michelle Obama, Title: Becoming, Publisher: Crown, Year: 2018', answer: 'Obama, Michelle. Becoming. Crown, 2018.', rule: 'Book: Last, First. Title (italics). Publisher, Year.' },
    ]},
    'works-cited-website': { items: [
      { info: 'Author: John Smith, Page: "Climate Policy Update", Site: EPA.gov, Date: 15 Mar. 2024, URL: www.epa.gov/climate', answer: 'Smith, John. "Climate Policy Update." EPA.gov, 15 Mar. 2024, www.epa.gov/climate.', rule: 'Website: Author. "Page Title." Site Name, Date, URL.' },
      { info: 'No author, Page: "About Recycling", Site: Earth911, Date: 2023, URL: earth911.com/recycling', answer: '"About Recycling." Earth911, 2023, earth911.com/recycling.', rule: 'No author: start with title in quotes.' },
      { info: 'Author: CDC, Page: "Teen Health Data", Site: CDC.gov, Date: 10 Jan. 2024, URL: cdc.gov/teen', answer: 'CDC. "Teen Health Data." CDC.gov, 10 Jan. 2024, cdc.gov/teen.', rule: 'Organization as author: list the organization name.' },
      { info: 'Author: Maria Lopez, Page: "AI in Education", Site: EdWeek, Date: 5 May 2024, URL: edweek.org/ai', answer: 'Lopez, Maria. "AI in Education." EdWeek, 5 May 2024, edweek.org/ai.', rule: 'Website: Author. "Page Title." Site Name, Date, URL.' },
    ]},
    'identify-plagiarism': { items: [
      { original: 'The rise of social media has fundamentally altered how teenagers form their identities.', student: 'The rise of social media has fundamentally altered how teenagers form their identities.', answer: 'plagiarism', explanation: 'Word-for-word copy with no quotation marks or citation.' },
      { original: 'The rise of social media has fundamentally altered how teenagers form their identities.', student: 'According to Chen (2023), "The rise of social media has fundamentally altered how teenagers form their identities" (p. 45).', answer: 'proper-quote', explanation: 'Direct quote with quotation marks, signal phrase, and citation.' },
      { original: 'The rise of social media has fundamentally altered how teenagers form their identities.', student: 'Social media has changed how teens build their sense of self (Chen 45).', answer: 'proper-paraphrase', explanation: 'Restated in original words with different structure, plus citation.' },
      { original: 'Climate change poses an existential threat to island nations in the Pacific.', student: 'Climate change poses an existential threat to Pacific island nations.', answer: 'plagiarism', explanation: 'Nearly identical wording with minor rearrangement — still plagiarism.' },
      { original: 'Studies show that regular exercise reduces symptoms of depression by up to 30 percent.', student: 'Research indicates that consistent physical activity can decrease depressive symptoms significantly (Torres 112).', answer: 'proper-paraphrase', explanation: 'Completely reworded with different structure and citation included.' },
      { original: 'The digital divide continues to widen between urban and rural communities.', student: 'The digital divide keeps getting bigger between cities and the countryside.', answer: 'plagiarism', explanation: 'Same structure with synonym swaps and no citation — this is patchwork plagiarism.' },
    ]},
    'effective-paraphrase': { items: [
      { original: 'Adolescents who sleep fewer than eight hours show measurable declines in cognitive performance.', good: 'Teens getting insufficient sleep — under eight hours — tend to perform worse on thinking tasks (Rivera 23).', bad: 'Adolescents who sleep less than eight hours show declines in cognitive performance.', answer: 'good', rule: 'Good paraphrases change both words AND sentence structure.' },
      { original: 'The invention of the printing press democratized access to information across Europe.', good: 'By making books affordable, Gutenberg\'s press allowed ordinary Europeans to access knowledge previously restricted to elites (Adams 56).', bad: 'The printing press made information democratic across Europe.', answer: 'good', rule: 'Add interpretation and context while fully rewording.' },
      { original: 'Rising ocean temperatures have caused widespread coral bleaching events.', good: 'As seas warm, coral reefs worldwide are losing their symbiotic algae, turning white in a process known as bleaching (Nguyen 89).', bad: 'Warming ocean temperatures have led to widespread coral bleaching.', answer: 'good', rule: 'Demonstrate understanding by explaining the concept in new terms.' },
      { original: 'Social media algorithms prioritize engagement over accuracy.', good: 'The systems that determine what users see on platforms like Facebook are designed to maximize interaction, even if the content is misleading (Park 34).', bad: 'Social media algorithms put engagement ahead of accuracy.', answer: 'good', rule: 'Synonym swaps alone are not real paraphrasing.' },
    ]},
    'when-to-quote': { items: [
      { text: 'Martin Luther King Jr. said, "Injustice anywhere is a threat to justice everywhere."', answer: 'quote', rule: 'Quote when the exact wording is famous, powerful, or historically significant.' },
      { text: 'A study found that 67% of teens use social media daily.', answer: 'paraphrase', rule: 'Paraphrase statistics and findings — the data matters, not the exact words.' },
      { text: 'The legal definition states: "negligence is the failure to exercise reasonable care."', answer: 'quote', rule: 'Quote technical or legal definitions where precise wording matters.' },
      { text: 'The author argues that schools should start later to benefit student health.', answer: 'paraphrase', rule: 'Paraphrase general arguments and summarize in your own words.' },
      { text: 'Shakespeare wrote, "To be, or not to be, that is the question."', answer: 'quote', rule: 'Quote literary passages you are analyzing.' },
      { text: 'Researchers concluded that the program was effective in most cases.', answer: 'paraphrase', rule: 'Paraphrase conclusions unless the specific language is being analyzed.' },
    ]},
    'thesis-from-research': { items: [
      { topic: 'School uniforms', weak: 'School uniforms are a topic many people discuss.', strong: 'Mandatory school uniforms reduce bullying related to clothing but limit students\' self-expression, suggesting a compromise policy is needed.', answer: 'strong', rule: 'A thesis must make a specific, arguable claim based on evidence.' },
      { topic: 'Social media and teens', weak: 'Social media affects teenagers.', strong: 'While social media offers teens valuable community connections, its algorithm-driven design exacerbates anxiety, requiring platform redesign and digital literacy education.', answer: 'strong', rule: 'Avoid vague claims. Include your position and reasoning.' },
      { topic: 'Renewable energy', weak: 'Renewable energy is important for the future.', strong: 'Federal subsidies for residential solar panels would reduce carbon emissions by 15% while creating economic opportunity in underserved communities.', answer: 'strong', rule: 'Strong theses are specific, arguable, and suggest a course of action or analysis.' },
      { topic: 'College admissions', weak: 'College admissions are complicated.', strong: 'Test-optional admissions policies increase socioeconomic diversity without sacrificing academic quality, as demonstrated by data from over 1,000 institutions.', answer: 'strong', rule: 'Ground your thesis in evidence and make a clear argumentative claim.' },
    ]},
    'integrating-evidence': { items: [
      { text: 'Studies show this is true (Smith 12).', answer: 'dropped-in', explanation: 'Dropped-in quote with vague signal. Name the study, give context.' },
      { text: 'According to Smith\'s 2023 study of 500 high schoolers, "academic performance improved by 20% with later start times" (12), suggesting that sleep plays a crucial role in learning.', answer: 'well-integrated', explanation: 'Signal phrase, context, quote, citation, and commentary.' },
      { text: '"Students need more sleep." Schools should start later.', answer: 'dropped-in', explanation: 'No signal phrase, no citation, no connection between quote and claim.' },
      { text: 'Rivera (2022) found that teens who read for pleasure scored higher on vocabulary tests, which supports the argument that reading programs deserve increased funding (45).', answer: 'well-integrated', explanation: 'Author in signal phrase, findings summarized, connected to argument, cited.' },
    ]},
    'intro-conclusion': { items: [
      { text: 'In this essay I will talk about school uniforms and whether they are good or bad.', answer: 'weak-intro', explanation: 'Avoid "In this essay I will." Start with a hook and lead to your thesis.' },
      { text: 'Every morning, 23 million American students put on the same outfit — not by choice, but by policy. The school uniform debate reveals deeper tensions between institutional control and individual identity.', answer: 'strong-intro', explanation: 'Starts with a specific hook (statistic) and frames the larger significance.' },
      { text: 'In conclusion, school uniforms are good and bad. That is my essay.', answer: 'weak-conclusion', explanation: 'Restating without synthesis. A conclusion should connect to broader implications.' },
      { text: 'The uniform debate ultimately asks what we value more: conformity or self-expression. As schools seek to reduce inequality, they must find policies that address root causes without silencing student voices.', answer: 'strong-conclusion', explanation: 'Connects to bigger ideas and offers forward-looking insight.' },
    ]},
    'fact-vs-opinion': { items: [
      { statement: 'The Earth\'s average temperature has risen 1.1°C since pre-industrial times.', answer: 'fact', explanation: 'Measurable, verifiable scientific data from climate records.' },
      { statement: 'Climate change is the most important issue of our time.', answer: 'opinion', explanation: '"Most important" is a value judgment, even if widely held.' },
      { statement: 'The US minimum wage is $7.25 per hour federally.', answer: 'fact', explanation: 'Verifiable legal fact.' },
      { statement: 'The minimum wage should be raised to $20 per hour.', answer: 'opinion', explanation: 'Policy recommendation based on values, not pure fact.' },
      { statement: 'Voter turnout in the 2020 US election was approximately 66%.', answer: 'fact', explanation: 'Verifiable statistic from election data.' },
      { statement: 'Young people are too lazy to vote.', answer: 'opinion', explanation: 'Generalization with value judgment — not supported by evidence as stated.' },
    ]},
    'clickbait-detection': { items: [
      { headline: 'You Won\'t BELIEVE What This Teacher Did — #5 Will Shock You!', answer: 'clickbait', indicators: 'Numbered list teaser, all-caps emotion words, vague "this teacher."' },
      { headline: 'Study Finds Correlation Between Screen Time and Sleep Quality in Adolescents', answer: 'legitimate', indicators: 'Specific, measured language, names the finding and population.' },
      { headline: 'EXPOSED: The Secret They Don\'t Want You to Know About Vaccines', answer: 'clickbait', indicators: 'Conspiracy framing ("they"), emotional caps, vague "secret."' },
      { headline: 'City Council Approves $2M Budget for Park Renovations', answer: 'legitimate', indicators: 'Specific facts: who, what, how much.' },
      { headline: 'This One Trick Will Make You a Genius Overnight!', answer: 'clickbait', indicators: '"One trick," impossible promise, no specifics.' },
      { headline: 'CDC Reports 12% Increase in Teen Anxiety Diagnoses Since 2019', answer: 'legitimate', indicators: 'Named source, specific data, clear timeframe.' },
    ]},
    'source-comparison': { items: [
      { sourceA: 'Peer-reviewed journal article on teen nutrition', sourceB: 'Food company blog about their "healthy" products', better: 'A', explanation: 'Peer-reviewed research is more credible than marketing content.' },
      { sourceA: 'A 2008 article on smartphone addiction', sourceB: 'A 2024 meta-analysis on smartphone use and mental health', better: 'B', explanation: 'The 2024 source is more current and a meta-analysis synthesizes multiple studies.' },
      { sourceA: 'An unsigned editorial arguing for school vouchers', sourceB: 'A Brookings Institution policy analysis on school vouchers with data', better: 'B', explanation: 'Named institution, data-driven analysis is more credible than anonymous opinion.' },
      { sourceA: 'A Reddit thread discussing immigration policy', sourceB: 'A Congressional Research Service report on immigration statistics', better: 'B', explanation: 'Government research service provides verified data; Reddit is informal opinion.' },
    ]},
  },
  'grade-10': {
    'summary-component': { items: [
      { annotation: 'This source is good and has lots of information about the topic.', answer: 'weak', explanation: 'Too vague. A summary must state the source\'s main argument and key evidence.' },
      { annotation: 'Chen (2023) argues that algorithmic curation on social media creates filter bubbles that limit teens\' exposure to diverse perspectives, drawing on surveys of 2,000 adolescents across five states.', answer: 'strong', explanation: 'Names author, states main argument, identifies evidence type and scope.' },
      { annotation: 'The article talks about social media and teenagers. It has statistics.', answer: 'weak', explanation: 'Vague topic description. What argument? What statistics? Be specific.' },
      { annotation: 'Rivera (2022) examines how school start times affect teen academic performance, finding that districts shifting to 8:30 AM starts saw a 12% improvement in graduation rates over five years.', answer: 'strong', explanation: 'Specific author, topic, method, and quantified findings.' },
    ]},
    'evaluation-component': { items: [
      { annotation: 'This seems like a good source because it was published recently.', answer: 'weak', explanation: 'Evaluate authority, accuracy, and purpose — not just currency.' },
      { annotation: 'Published in a peer-reviewed journal, this study\'s methodology is sound (randomized control trial, n=500), though its focus on suburban schools limits generalizability to urban settings.', answer: 'strong', explanation: 'Assesses methodology, sample size, and acknowledges limitations.' },
      { annotation: 'The author is a professor so it must be accurate.', answer: 'weak', explanation: 'Credentials help but don\'t guarantee accuracy. Evaluate the evidence itself.' },
      { annotation: 'While the author\'s expertise in marine biology lends authority, the study\'s reliance on a single coral reef site and small sample (n=30) suggests cautious interpretation of its broad claims about ocean warming.', answer: 'strong', explanation: 'Weighs authority against methodological limitations.' },
    ]},
    'reflection-component': { items: [
      { annotation: 'I will use this source in my paper.', answer: 'weak', explanation: 'How will you use it? For what claim? In what section?' },
      { annotation: 'This source will serve as my primary evidence for the counterargument section, as it presents the strongest case against year-round schooling, which I need to address to strengthen my own position.', answer: 'strong', explanation: 'Specifies where, why, and how the source fits into the argument.' },
      { annotation: 'This is relevant to my topic.', answer: 'weak', explanation: 'Explain the specific connection and planned use.' },
      { annotation: 'I will pair this source\'s statistical data on dropout rates with Chen\'s qualitative interviews to provide both quantitative and qualitative evidence for my claim about funding inequity.', answer: 'strong', explanation: 'Shows synthesis planning — combining sources strategically.' },
    ]},
    'synthesis-matrix': { items: [
      { claim: 'School start times affect academic performance', sources: ['Source A agrees (p.12)', 'Source B agrees with qualification (p.34)', 'Source C disagrees (p.56)'], answer: 'synthesis', explanation: 'A synthesis matrix maps how multiple sources relate to each claim.' },
      { claim: 'Social media causes teen depression', sources: ['Source A: correlation found', 'Source B: no causal link', 'Source C: depends on usage patterns'], answer: 'synthesis', explanation: 'Note agreement, disagreement, and qualifications across sources.' },
      { claim: 'Renewable energy is cost-effective', sources: ['Source A: solar costs dropped 90% since 2010', 'Source B: initial installation costs remain barriers', 'Source C: long-term savings outweigh upfront costs'], answer: 'synthesis', explanation: 'Sources can agree on facts but disagree on interpretation.' },
      { claim: 'Standardized testing measures student ability', sources: ['Source A: strong predictor of college GPA', 'Source B: biased against low-income students', 'Source C: measures test-taking skill, not knowledge'], answer: 'synthesis', explanation: 'Map each source\'s position to build a nuanced argument.' },
    ]},
    'source-agreement-disagreement': { items: [
      { sourceA: 'Smith argues teens benefit from social media connections.', sourceB: 'Jones finds social media increases teen isolation.', relationship: 'disagreement', explanation: 'These sources directly contradict — address both in your paper.' },
      { sourceA: 'Chen finds later start times improve grades.', sourceB: 'Park finds later start times improve attendance.', relationship: 'agreement', explanation: 'Different evidence supporting the same general conclusion.' },
      { sourceA: 'Report A: 60% of teens experience cyberbullying.', sourceB: 'Report B: 25% of teens experience cyberbullying.', relationship: 'disagreement', explanation: 'Contradictory data — investigate methodology differences.' },
      { sourceA: 'Lee argues school uniforms reduce bullying.', sourceB: 'Davis argues school uniforms have no effect on academic performance.', relationship: 'partial', explanation: 'Different claims — not contradictory. They address different aspects.' },
    ]},
    'filling-gaps': { items: [
      { existing: 'You have three sources about social media and teen mental health, all from the US.', gap: 'international perspectives', explanation: 'Seek sources from other countries to avoid geographic bias.' },
      { existing: 'You have several opinion articles but no empirical studies.', gap: 'peer-reviewed research', explanation: 'Add scholarly sources with data to support claims.' },
      { existing: 'All sources are from 2015 or earlier.', gap: 'current sources', explanation: 'Find recent publications — especially for rapidly changing topics.' },
      { existing: 'You have quantitative data but no personal narratives.', gap: 'qualitative evidence', explanation: 'Add interviews, case studies, or first-person accounts for depth.' },
    ]},
    'multiple-authors': { items: [
      { info: 'Two authors: Kim and Patel, page 89', answer: '(Kim and Patel 89)', rule: 'MLA two authors: (Author1 and Author2 Page).' },
      { info: 'Four authors: Adams, Baker, Clark, Davis, page 112', answer: '(Adams et al. 112)', rule: 'MLA three+ authors: (First Author et al. Page).' },
      { info: 'Corporate author: World Health Organization, page 7', answer: '(World Health Organization 7)', rule: 'Use organization name when no individual author.' },
      { info: 'Two authors APA style: Kim and Patel, 2023, page 89', answer: '(Kim & Patel, 2023, p. 89)', rule: 'APA two authors: (Author1 & Author2, Year, p. Page).' },
      { info: 'Three authors APA: Adams, Baker, and Clark, 2022, page 45', answer: '(Adams et al., 2022, p. 45)', rule: 'APA three+: (First Author et al., Year, p. Page).' },
    ]},
    'secondary-sources': { items: [
      { scenario: 'You read a quote by Dr. Lee in an article by Chen.', answer: '(qtd. in Chen 34)', rule: 'MLA indirect source: (qtd. in Author Page).' },
      { scenario: 'Smith\'s study is discussed in a textbook by Rivera.', answer: '(qtd. in Rivera 78)', rule: 'Use "qtd. in" when you access a source through another source.' },
      { scenario: 'A 1995 study by Jones is cited in a 2023 review by Park.', answer: '(qtd. in Park 15)', rule: 'Cite the source you actually read — the secondary source.' },
      { scenario: 'APA: Jones (1995) as cited in Park (2023).', answer: '(Jones, 1995, as cited in Park, 2023)', rule: 'APA indirect: (Original Author, Year, as cited in Source Author, Year).' },
    ]},
    'multimedia-citations': { items: [
      { info: 'YouTube video: "History of Jazz" by Channel Music Matters, 15 June 2023', answer: '"History of Jazz." YouTube, uploaded by Music Matters, 15 June 2023.', rule: 'Video: "Title." Platform, uploaded by Creator, Date.' },
      { info: 'Podcast episode: "The Future of AI" on Tech Talk, hosted by Sarah Lee, 3 Mar. 2024', answer: 'Lee, Sarah, host. "The Future of AI." Tech Talk, 3 Mar. 2024.', rule: 'Podcast: Host, role. "Episode Title." Podcast Name, Date.' },
      { info: 'Film: Oppenheimer, directed by Christopher Nolan, Universal Pictures, 2023', answer: 'Oppenheimer. Directed by Christopher Nolan, Universal Pictures, 2023.', rule: 'Film: Title (italics). Directed by Director, Studio, Year.' },
      { info: 'TED Talk: "The Power of Vulnerability" by Brené Brown, June 2010', answer: 'Brown, Brené. "The Power of Vulnerability." TED, June 2010.', rule: 'TED Talk: Speaker. "Title." TED, Date.' },
    ]},
    'cornell-notes': { items: [
      { prompt: 'What goes in the right column of Cornell notes?', options: ['Key questions', 'Detailed notes from the source', 'Your personal opinions'], answer: 'Detailed notes from the source', rule: 'Right column: main notes. Left column: questions/keywords. Bottom: summary.' },
      { prompt: 'What is the purpose of the summary section at the bottom?', options: ['Copy the introduction', 'Synthesize the main ideas in your own words', 'List page numbers'], answer: 'Synthesize the main ideas in your own words', rule: 'The summary forces you to process and condense what you learned.' },
      { prompt: 'When should you write the cue column (left side)?', options: ['Before reading', 'During note-taking', 'After completing notes, during review'], answer: 'After completing notes, during review', rule: 'Write questions and keywords after notes to aid review and recall.' },
    ]},
    'paraphrase-notes': { items: [
      { original: 'The study found that 73% of participants reported improved sleep quality after reducing screen time by one hour before bed.', note: '73% slept better when cutting 1hr screen time before bed', answer: 'good', rule: 'Capture the key data in your own words. Include numbers and context.' },
      { original: 'Deforestation in the Amazon has accelerated dramatically since 2019.', note: 'Deforestation in the Amazon has accelerated dramatically since 2019.', answer: 'poor', rule: 'This is copying, not note-taking. Restate: "Amazon tree loss sped up post-2019."' },
      { original: 'Researchers concluded that bilingual children demonstrate greater cognitive flexibility.', note: 'Kids who speak 2 languages show more flexible thinking — cognitive advantage (researchers found)', answer: 'good', rule: 'Restated in own words with the key finding preserved.' },
    ]},
    'quote-integration': { items: [
      { text: '"Social media is bad." (Smith 12)', answer: 'poor', explanation: 'Dropped-in quote. Needs a signal phrase and commentary.' },
      { text: 'As Smith (12) warns, "the algorithmic feed creates an echo chamber that narrows rather than broadens teen perspectives," highlighting how platform design itself drives polarization.', answer: 'good', explanation: 'Signal phrase, embedded quote, citation, and analytical commentary.' },
      { text: 'According to Rivera, "students who participated in the mentoring program showed a 25% increase in self-reported confidence" (45). This suggests mentoring addresses not just academics but emotional wellbeing.', answer: 'good', explanation: 'Signal phrase, full quote with citation, followed by analysis.' },
      { text: 'Studies show things are getting worse. "Climate change is real" (Jones 5).', answer: 'poor', explanation: 'Vague setup, generic quote, no analysis connecting quote to argument.' },
    ]},
    'outline-structure': { items: [
      { prompt: 'What comes between the introduction and body paragraphs in a research essay?', options: ['Conclusion', 'Background/literature review', 'Works Cited'], answer: 'Background/literature review', rule: 'Provide context by surveying existing research before your argument.' },
      { prompt: 'Where should the counterargument appear?', options: ['In the introduction', 'After presenting your evidence, before conclusion', 'In the Works Cited'], answer: 'After presenting your evidence, before conclusion', rule: 'Address counterarguments after building your case.' },
      { prompt: 'How many sources should a body paragraph typically synthesize?', options: ['Exactly one', 'Two or more', 'None — use your own ideas'], answer: 'Two or more', rule: 'Synthesis means weaving multiple sources together, not one per paragraph.' },
    ]},
    'counterargument': { items: [
      { text: 'Some people disagree, but they are wrong.', answer: 'weak', explanation: 'Dismissive. A real counterargument presents the opposing view fairly before rebutting.' },
      { text: 'Opponents argue that later start times would disrupt bus schedules and after-school activities (Davis 34). However, districts that implemented the change, such as Seattle, resolved logistics within one semester while seeing a 7% GPA increase (Chen 89).', answer: 'strong', explanation: 'Fairly presents the objection with a source, then rebuts with evidence.' },
      { text: 'Nobody thinks school uniforms are a good idea.', answer: 'weak', explanation: 'Straw man — ignores actual proponents. Engage with real arguments.' },
      { text: 'While proponents of standardized testing contend that tests provide an objective measure of achievement (Park 23), this view overlooks significant evidence of cultural and socioeconomic bias in test design (Rivera 56).', answer: 'strong', explanation: 'Cites the opposing view fairly, then counters with specific evidence.' },
    ]},
    'works-cited-page': { items: [
      { prompt: 'How should entries be ordered on a Works Cited page?', options: ['By date published', 'Alphabetically by author last name', 'In order of appearance in the paper'], answer: 'Alphabetically by author last name', rule: 'MLA Works Cited is always alphabetical.' },
      { prompt: 'What spacing is used for Works Cited entries?', options: ['Single-spaced', 'Double-spaced', '1.5 spacing'], answer: 'Double-spaced', rule: 'MLA format requires double-spacing throughout.' },
      { prompt: 'What indentation format is used for entries longer than one line?', options: ['No indent', 'First line indent', 'Hanging indent'], answer: 'Hanging indent', rule: 'Hanging indent: first line flush left, subsequent lines indented 0.5 inches.' },
    ]},
    'selection-bias': { items: [
      { scenario: 'A news outlet covers every crime committed by immigrants but rarely reports crimes by citizens.', answer: 'selection-bias', explanation: 'Choosing which stories to cover creates a skewed picture of reality.' },
      { scenario: 'During an election, a network gives one candidate 80% of airtime.', answer: 'selection-bias', explanation: 'Unequal coverage influences public perception of candidate viability.' },
      { scenario: 'A paper reports on climate protests but never covers climate science conferences.', answer: 'selection-bias', explanation: 'Covering conflict over substance creates a distorted view of the issue.' },
      { scenario: 'A health news site only publishes stories about alternative medicine, ignoring conventional studies.', answer: 'selection-bias', explanation: 'Selective coverage promotes one perspective while hiding the mainstream view.' },
    ]},
    'framing-bias': { items: [
      { headlineA: 'Protesters Demand Justice for Victims', headlineB: 'Angry Mob Disrupts City Streets', answer: 'framing-bias', explanation: 'Same event framed as righteous ("demand justice") vs. dangerous ("angry mob").' },
      { headlineA: 'Tax Relief for Working Families', headlineB: 'Government Revenue Cut Threatens Services', answer: 'framing-bias', explanation: 'Same policy framed positively ("relief") vs. negatively ("cut threatens").' },
      { headlineA: 'Undocumented Immigrants Contribute $12B in Taxes', headlineB: 'Illegal Aliens Cost Taxpayers Billions', answer: 'framing-bias', explanation: 'Word choice ("undocumented" vs. "illegal," "contribute" vs. "cost") reveals framing.' },
      { headlineA: 'City Invests in Public Transit Expansion', headlineB: 'City Spends Millions on Controversial Rail Project', answer: 'framing-bias', explanation: '"Invests" vs. "spends millions," "expansion" vs. "controversial" — same event, different frames.' },
    ]},
    'comparing-outlets': { items: [
      { prompt: 'Why should you read coverage of the same event from multiple outlets?', options: ['To find the longest article', 'To identify what each outlet emphasizes or omits', 'To pick the one that agrees with you'], answer: 'To identify what each outlet emphasizes or omits', rule: 'Comparing outlets reveals bias through selection, framing, and omission.' },
      { prompt: 'If three outlets report the same fact but one includes additional context, that outlet is...', options: ['Biased for including extra information', 'Providing more complete coverage', 'Wrong because it differs from the others'], answer: 'Providing more complete coverage', rule: 'More context generally means better journalism, not bias.' },
      { prompt: 'What is the best way to get a balanced view of a controversial topic?', options: ['Read one trusted source carefully', 'Read sources from multiple perspectives and political leanings', 'Only read sources that are neutral'], answer: 'Read sources from multiple perspectives and political leanings', rule: 'No source is perfectly neutral. Reading broadly compensates for individual biases.' },
    ]},
  },
  'grade-11': {
    'synthesizing-multiple-perspectives': { items: [
      { prompt: 'Which best demonstrates synthesis of three sources?', optionA: 'Smith says X. Jones says Y. Lee says Z.', optionB: 'While Smith and Lee agree that X leads to Y, Jones qualifies this by noting Z, suggesting the relationship is more complex than initially apparent.', answer: 'B', explanation: 'Option A is summary. Option B weaves sources together around a shared idea.' },
      { prompt: 'What is the difference between summarizing and synthesizing sources?', options: ['They are the same thing', 'Summary restates each source; synthesis connects them to build an argument', 'Synthesis is just a longer summary'], answer: 'Summary restates each source; synthesis connects them to build an argument', rule: 'Synthesis creates new meaning by putting sources in conversation.' },
      { prompt: 'The phrase "While Source A argues... Source B complicates this by..." is an example of...', options: ['Summary', 'Synthesis', 'Quotation'], answer: 'Synthesis', rule: 'Connecting sources through analytical transitions is synthesis.' },
    ]},
    'qualifying-claims': { items: [
      { unqualified: 'Social media causes depression in all teenagers.', qualified: 'Emerging research suggests a correlation between heavy social media use and increased depressive symptoms in some adolescent populations.', answer: 'qualified', rule: 'Use hedging language: "suggests," "some," "in certain contexts."' },
      { unqualified: 'School uniforms solve bullying.', qualified: 'Evidence indicates that school uniform policies may reduce appearance-based bullying, though they do not address other common forms of peer aggression.', answer: 'qualified', rule: 'Acknowledge limitations: "may," "though," "does not address."' },
      { unqualified: 'Technology is destroying education.', qualified: 'While excessive screen time can detract from focused study, educational technology, when thoughtfully integrated, has shown measurable benefits in personalized learning.', answer: 'qualified', rule: 'Avoid absolutes. Present nuance: "while... can... when thoughtfully..."' },
    ]},
    'evidence-commentary': { items: [
      { text: 'According to Chen (2023), "teen anxiety rates have doubled since 2010" (p. 45). This shows that anxiety is increasing.', answer: 'weak-commentary', explanation: 'The commentary merely restates the evidence. Analyze WHY and SO WHAT.' },
      { text: 'According to Chen (2023), "teen anxiety rates have doubled since 2010" (p. 45). This doubling coincides precisely with smartphone adoption, lending weight to the argument that platform design — not technology itself — drives mental health impacts.', answer: 'strong-commentary', explanation: 'Connects evidence to a larger argument, offers interpretation.' },
      { text: 'Rivera notes that "72% of teachers support later start times" (34). This proves schools should change.', answer: 'weak-commentary', explanation: 'Opinion polls don\'t "prove" policy. Analyze what the data means and its limitations.' },
      { text: 'Rivera notes that "72% of teachers support later start times" (34). This broad support from educators who observe student fatigue daily suggests that the academic case for schedule reform is increasingly difficult to dismiss.', answer: 'strong-commentary', explanation: 'Interprets why teacher support matters and connects to the broader argument.' },
    ]},
    'scholarly-vs-popular': { items: [
      { source: 'An article in Nature with a DOI, abstract, and methodology section', answer: 'scholarly', markers: 'DOI, abstract, methodology, peer review — hallmarks of scholarly work.' },
      { source: 'A Time magazine article about the same study, summarized for general readers', answer: 'popular', markers: 'Written for lay audience, no methodology section, simplified language.' },
      { source: 'A Brookings Institution policy brief with cited data and named researchers', answer: 'gray-literature', markers: 'Not peer-reviewed but from a reputable institution with expertise — "gray literature."' },
      { source: 'A TikTok video by a doctor explaining a medical study', answer: 'popular', markers: 'Social media format, no peer review, may simplify or distort findings.' },
    ]},
    'primary-vs-secondary': { items: [
      { source: 'The text of the Emancipation Proclamation', answer: 'primary', explanation: 'Original historical document — a firsthand record.' },
      { source: 'A history textbook chapter about the Emancipation Proclamation', answer: 'secondary', explanation: 'Analyzes and interprets the primary source.' },
      { source: 'Raw survey data from a psychology experiment', answer: 'primary', explanation: 'Original data collected firsthand by researchers.' },
      { source: 'A literature review analyzing 30 studies on teen social media use', answer: 'secondary', explanation: 'Synthesizes and interprets multiple primary sources.' },
      { source: 'A diary written during the Civil War', answer: 'primary', explanation: 'Firsthand account written by someone who experienced the events.' },
      { source: 'A documentary about the Civil War using diary excerpts', answer: 'secondary', explanation: 'Uses primary sources but presents them through an editorial lens.' },
    ]},
    'lateral-reading': { items: [
      { prompt: 'What is the first step in lateral reading?', options: ['Read the article carefully from start to finish', 'Leave the source and search for information about the author/organization', 'Check the URL'], answer: 'Leave the source and search for information about the author/organization', rule: 'Lateral reading means checking OUTSIDE the source, not evaluating it on its own terms.' },
      { prompt: 'A website looks professional with a clean design. Does this mean it is credible?', options: ['Yes, professional design indicates reliability', 'No — anyone can create a professional-looking site', 'Probably, if it has a .org domain'], answer: 'No — anyone can create a professional-looking site', rule: 'Design is not evidence of credibility. Check the organization and funding.' },
      { prompt: 'You find a health claim on a site called "Natural Health Freedom." What should you do?', options: ['Trust it because it sounds scientific', 'Search for the organization to see who funds it and what experts say', 'Reject it because the name sounds biased'], answer: 'Search for the organization to see who funds it and what experts say', rule: 'Investigate the source through external verification before accepting or rejecting.' },
    ]},
    'apa-in-text': { items: [
      { scenario: 'Author Park, published 2023, page 45, not in sentence', answer: '(Park, 2023, p. 45)', rule: 'APA: (Author, Year, p. Page).' },
      { scenario: 'Author Rivera in signal phrase, 2022', answer: 'Rivera (2022)', rule: 'APA with signal phrase: Author (Year) — page number after quote if applicable.' },
      { scenario: 'Three authors: Lee, Kim, and Chen, 2024', answer: '(Lee et al., 2024)', rule: 'APA three+ authors: use et al. from the first citation.' },
      { scenario: 'Organization: American Psychological Association, 2023', answer: '(American Psychological Association, 2023)', rule: 'Use full organization name. Can abbreviate in subsequent citations.' },
      { scenario: 'No date available, author Garcia', answer: '(Garcia, n.d.)', rule: 'APA: use "n.d." when no date is available.' },
    ]},
    'apa-references': { items: [
      { info: 'Author: Park, S., Year: 2023, Title: Digital minds, Publisher: Academic Press', answer: 'Park, S. (2023). Digital minds. Academic Press.', rule: 'APA book: Author, A. A. (Year). Title in sentence case (italics). Publisher.' },
      { info: 'Author: Lee, J., Year: 2024, Article: Teen screen time effects, Journal: Psychology Today, Vol 58, Issue 3, Pages 45-67, DOI: 10.1234/pt.2024', answer: 'Lee, J. (2024). Teen screen time effects. Psychology Today, 58(3), 45-67. https://doi.org/10.1234/pt.2024', rule: 'APA journal: Author (Year). Article title. Journal Title, Volume(Issue), pages. DOI' },
      { info: 'Author: CDC, Year: 2024, Title: Youth Risk Behavior Survey, URL: cdc.gov/yrbs', answer: 'Centers for Disease Control and Prevention. (2024). Youth risk behavior survey. https://cdc.gov/yrbs', rule: 'APA: spell out organization name. Title in sentence case.' },
    ]},
    'choosing-mla-vs-apa': { items: [
      { field: 'English literature essay', answer: 'MLA', rule: 'MLA is standard for humanities: literature, languages, cultural studies.' },
      { field: 'Psychology research paper', answer: 'APA', rule: 'APA is standard for social sciences: psychology, sociology, education.' },
      { field: 'History research paper', answer: 'MLA', rule: 'History typically uses MLA or Chicago style (humanities).' },
      { field: 'Nursing research paper', answer: 'APA', rule: 'Health sciences use APA format.' },
      { field: 'Communication studies paper', answer: 'APA', rule: 'Social science fields use APA.' },
    ]},
    'literature-review-section': { items: [
      { prompt: 'What is the purpose of a literature review in a research paper?', options: ['To list every source you read', 'To survey existing research and identify where your work fits', 'To prove you did research'], answer: 'To survey existing research and identify where your work fits', rule: 'A lit review situates your research within the existing conversation.' },
      { prompt: 'How should a literature review be organized?', options: ['Chronologically by publication date', 'By theme or subtopic', 'Alphabetically by author'], answer: 'By theme or subtopic', rule: 'Thematic organization shows how sources relate to each other and your argument.' },
      { prompt: 'A literature review should end by identifying...', options: ['The oldest source', 'A gap in existing research that your paper addresses', 'The most cited author'], answer: 'A gap in existing research that your paper addresses', rule: 'The gap justifies your research question and contribution.' },
    ]},
    'argument-structure': { items: [
      { prompt: 'Which organizational pattern presents both sides before taking a position?', options: ['Point-by-point', 'Classical (Aristotelian)', 'Rogerian'], answer: 'Rogerian', rule: 'Rogerian argument builds common ground before stating your position.' },
      { prompt: 'In a classical argument, what follows the introduction and background?', options: ['Conclusion', 'Presentation of evidence (confirmation)', 'Works Cited'], answer: 'Presentation of evidence (confirmation)', rule: 'Classical: intro, background, confirmation (evidence), refutation, conclusion.' },
      { prompt: 'What is a warrant in Toulmin argument structure?', options: ['The main claim', 'The underlying assumption connecting evidence to the claim', 'A direct quote'], answer: 'The underlying assumption connecting evidence to the claim', rule: 'Warrant: the logical bridge between data (evidence) and claim.' },
    ]},
    'revision-strategies': { items: [
      { prompt: 'What should you check first when revising a research paper?', options: ['Spelling and punctuation', 'Argument structure and evidence quality', 'Font and margins'], answer: 'Argument structure and evidence quality', rule: 'Revise for content and argument first (global), then edit for mechanics (local).' },
      { prompt: 'Reverse outlining helps you...', options: ['Write your introduction', 'Check if each paragraph supports your thesis', 'Find spelling errors'], answer: 'Check if each paragraph supports your thesis', rule: 'Summarize each paragraph in one sentence to verify logical flow.' },
      { prompt: 'What is the "so what?" test for a conclusion?', options: ['Check that it is long enough', 'Verify that it explains why the argument matters beyond the paper', 'Make sure it repeats the thesis word for word'], answer: 'Verify that it explains why the argument matters beyond the paper', rule: 'A conclusion should address broader implications, not just restate.' },
    ]},
    'rhetorical-appeals-media': { items: [
      { example: 'A charity ad showing a thin, crying child with sad music playing.', appeal: 'pathos', explanation: 'Designed to evoke emotional response (pity, guilt) to drive donations.' },
      { example: 'A toothpaste ad featuring a dentist in a white coat citing clinical studies.', appeal: 'ethos', explanation: 'Uses authority figure and scientific language to build credibility.' },
      { example: 'An infographic showing that Product X is 40% more effective based on a controlled study.', appeal: 'logos', explanation: 'Uses data and logical reasoning to persuade.' },
      { example: 'A political ad saying "9 out of 10 Americans agree — it\'s time for change."', appeal: 'ethos-bandwagon', explanation: 'Appeals to popularity (bandwagon) as a form of social proof/authority.' },
      { example: 'A fast-food commercial showing happy families laughing together over meals.', appeal: 'pathos', explanation: 'Associates the product with positive emotions and belonging.' },
    ]},
    'propaganda-techniques': { items: [
      { example: 'You\'re either with us or against us.', technique: 'false-dilemma', explanation: 'Presents only two options when more exist.' },
      { example: 'Millions of Americans already trust Brand X!', technique: 'bandwagon', explanation: 'Appeals to popularity rather than merit.' },
      { example: 'My opponent is just another corrupt politician.', technique: 'name-calling', explanation: 'Uses negative labels instead of addressing arguments.' },
      { example: 'As a mother, I know what\'s best for children\'s education.', technique: 'plain-folks', explanation: 'Appeals to common identity rather than expertise or evidence.' },
      { example: 'If we allow this, next thing you know they\'ll ban all personal freedoms.', technique: 'slippery-slope', explanation: 'Claims one step will inevitably lead to extreme consequences.' },
      { example: 'Our brave troops deserve your support — buy war bonds today.', technique: 'transfer', explanation: 'Transfers respect for soldiers onto an unrelated action (buying bonds).' },
    ]},
    'visual-rhetoric': { items: [
      { prompt: 'A photo of a political candidate is shot from below, making them look tall and powerful. This is an example of...', options: ['Neutral journalism', 'Visual framing that conveys authority', 'Accidental camera angle'], answer: 'Visual framing that conveys authority', rule: 'Camera angles, lighting, and composition are rhetorical choices.' },
      { prompt: 'A graph that starts its Y-axis at 95 instead of 0, making a 2% change look dramatic. This is...', options: ['Good data visualization', 'A misleading graph that exaggerates differences', 'Standard practice'], answer: 'A misleading graph that exaggerates differences', rule: 'Truncated axes are a common way to visually distort data.' },
      { prompt: 'An ad uses red, white, and blue colors to sell hamburgers. This appeals to...', options: ['Logos', 'Patriotic emotions (pathos)', 'Nothing — colors are neutral'], answer: 'Patriotic emotions (pathos)', rule: 'Color symbolism is a deliberate rhetorical choice in visual media.' },
    ]},
    'identifying-themes': { items: [
      { prompt: 'You have 10 sources about teen mental health. Five discuss social media, three discuss sleep, two discuss academic pressure. How should you organize your review?', options: ['By author', 'By theme: social media, sleep, academic pressure', 'By publication date'], answer: 'By theme: social media, sleep, academic pressure', rule: 'Group sources by what they discuss, not who wrote them.' },
      { prompt: 'What is a "theme" in the context of a literature review?', options: ['A recurring topic or pattern across multiple sources', 'The thesis of your paper', 'The title of each source'], answer: 'A recurring topic or pattern across multiple sources', rule: 'Themes emerge from reading across sources and noting patterns.' },
    ]},
    'organizing-by-theme': { items: [
      { prompt: 'A thematic literature review paragraph should...', options: ['Discuss one source in depth', 'Weave together multiple sources that address the same theme', 'Summarize each source in order'], answer: 'Weave together multiple sources that address the same theme', rule: 'Each paragraph = one theme, multiple sources in conversation.' },
      { prompt: 'Transitions between literature review sections should...', options: ['Simply say "Next, I will discuss..."', 'Show how themes connect and build toward your research question', 'Not be included'], answer: 'Show how themes connect and build toward your research question', rule: 'Transitions reveal the logic of your review\'s organization.' },
    ]},
    'gap-analysis': { items: [
      { prompt: 'You notice that all studies on teen screen time focus on American teens. This is a...', options: ['Strength of the literature', 'Gap — no international perspectives', 'Reason to ignore the research'], answer: 'Gap — no international perspectives', rule: 'Geographic limitations represent research gaps your work could address.' },
      { prompt: 'What makes a research gap worth investigating?', options: ['Nobody has studied it at all', 'Existing research has limitations that your study can address', 'You personally find it interesting'], answer: 'Existing research has limitations that your study can address', rule: 'Gaps include missing populations, methods, timeframes, or perspectives.' },
    ]},
  },
  'grade-12': {
    'thesis-proposal': { items: [
      { prompt: 'A thesis proposal should include...', options: ['Just the thesis statement', 'Research question, preliminary thesis, methodology, and significance', 'A complete draft of the paper'], answer: 'Research question, preliminary thesis, methodology, and significance', rule: 'A proposal lays out what, how, and why before full research begins.' },
      { prompt: 'What is the difference between a research question and a thesis statement?', options: ['They are the same thing', 'A question asks; a thesis answers with an arguable claim', 'A thesis comes first, then the question'], answer: 'A question asks; a thesis answers with an arguable claim', rule: 'Research starts with a question. The thesis is your evidence-based answer.' },
      { prompt: 'How should a thesis proposal establish significance?', options: ['Say "this is important"', 'Explain what gap it fills and who benefits from the findings', 'List how many sources you will use'], answer: 'Explain what gap it fills and who benefits from the findings', rule: 'Significance = gap addressed + real-world impact + contribution to knowledge.' },
    ]},
    'methodology-basics': { items: [
      { prompt: 'A student plans to analyze how three newspapers covered an election. This is...', options: ['Quantitative research', 'Qualitative content analysis', 'An experiment'], answer: 'Qualitative content analysis', rule: 'Analyzing media texts for patterns and themes is qualitative methodology.' },
      { prompt: 'A student surveys 200 peers about study habits and calculates averages. This is...', options: ['Qualitative research', 'Quantitative research', 'A literature review'], answer: 'Quantitative research', rule: 'Numerical data and statistical analysis = quantitative methodology.' },
      { prompt: 'What is a "mixed methods" approach?', options: ['Using both MLA and APA', 'Combining quantitative data with qualitative analysis', 'Reading sources from different fields'], answer: 'Combining quantitative data with qualitative analysis', rule: 'Mixed methods provides both statistical evidence and contextual depth.' },
    ]},
    'research-timeline': { items: [
      { prompt: 'In what order should a senior thesis proceed?', options: ['Write first, research later', 'Proposal > research > outline > draft > revise > defend', 'Research until you run out of time, then write everything at once'], answer: 'Proposal > research > outline > draft > revise > defend', rule: 'Break the project into phases with deadlines for each stage.' },
      { prompt: 'Why should you set a "stop researching" deadline?', options: ['Research is not important', 'Without a cutoff, you may never start writing — also known as "research paralysis"', 'You should use exactly five sources'], answer: 'Without a cutoff, you may never start writing — also known as "research paralysis"', rule: 'Diminishing returns: at some point, you must synthesize what you have.' },
    ]},
    'peer-review-process': { items: [
      { prompt: 'What does "peer-reviewed" mean?', options: ['Reviewed by classmates', 'Evaluated by experts in the field before publication', 'Published on a popular website'], answer: 'Evaluated by experts in the field before publication', rule: 'Peer review is academic quality control by subject-matter experts.' },
      { prompt: 'Why might a peer-reviewed article still contain errors or bias?', options: ['Peer review is perfect', 'Reviewers may share the same biases, methods may have flaws, and fields evolve', 'Only non-reviewed articles have errors'], answer: 'Reviewers may share the same biases, methods may have flaws, and fields evolve', rule: 'Peer review reduces errors but does not eliminate them. Stay critical.' },
      { prompt: 'What is a predatory journal?', options: ['A journal about predatory animals', 'A fake journal that charges fees but provides no real peer review', 'Any journal that charges publication fees'], answer: 'A fake journal that charges fees but provides no real peer review', rule: 'Check journal reputation through databases like Beall\'s List or DOAJ.' },
    ]},
    'database-searching': { items: [
      { prompt: 'The Boolean operator AND...', options: ['Broadens results', 'Narrows results by requiring both terms', 'Excludes a term'], answer: 'Narrows results by requiring both terms', rule: 'AND narrows: "climate change" AND "agriculture" finds sources with both.' },
      { prompt: 'Using truncation (environ*) will...', options: ['Only find the word "environ"', 'Find environment, environmental, environmentalism, etc.', 'Search for an exact phrase'], answer: 'Find environment, environmental, environmentalism, etc.', rule: 'Truncation with * finds all word variations sharing the same root.' },
      { prompt: 'What does limiting to "peer-reviewed" in a database search do?', options: ['Shows only the best results', 'Filters to only scholarly, peer-reviewed articles', 'Removes all results'], answer: 'Filters to only scholarly, peer-reviewed articles', rule: 'Use database filters to quickly narrow to academic sources.' },
      { prompt: 'The Boolean operator OR...', options: ['Narrows results', 'Broadens results by including either term', 'Excludes results'], answer: 'Broadens results by including either term', rule: 'OR broadens: "teenagers" OR "adolescents" finds sources using either word.' },
    ]},
    'evaluating-methodology': { items: [
      { prompt: 'A study of "teen social media use" surveys only 15 students at one school. The main limitation is...', options: ['Too many participants', 'Small, non-representative sample limits generalizability', 'The topic is uninteresting'], answer: 'Small, non-representative sample limits generalizability', rule: 'Sample size and representativeness determine how broadly findings apply.' },
      { prompt: 'A study finds correlation between ice cream sales and drowning. This means...', options: ['Ice cream causes drowning', 'Correlation does not equal causation — a third variable (summer heat) likely explains both', 'Drowning causes ice cream sales'], answer: 'Correlation does not equal causation — a third variable (summer heat) likely explains both', rule: 'Always look for confounding variables in correlational studies.' },
      { prompt: 'What is "selection bias" in research?', options: ['Choosing which journal to publish in', 'When participants are not randomly selected, skewing results', 'When researchers select their favorite data'], answer: 'When participants are not randomly selected, skewing results', rule: 'Non-random samples may not represent the broader population.' },
    ]},
    'complex-mla-cases': { items: [
      { scenario: 'An article found in a database, originally in a print journal', answer: 'Include the database name as a second container after the journal information.', rule: 'MLA containers: Journal (container 1) within Database (container 2).' },
      { scenario: 'A translated novel', answer: 'Author. Title. Translated by Translator, Publisher, Year.', rule: 'Include "Translated by" after the title.' },
      { scenario: 'A republished classic (original 1818, republished 2018)', answer: 'Author. Title. Original Year. Publisher, Republication Year.', rule: 'Include original publication date before publisher.' },
    ]},
    'complex-apa-cases': { items: [
      { scenario: 'An article with a DOI', answer: 'Always include DOI as a URL: https://doi.org/xxxxx', rule: 'APA 7th ed: present DOI as a hyperlink, no period after.' },
      { scenario: 'A source with no date', answer: 'Use (n.d.) in place of the year.', rule: 'APA: (Author, n.d.) for undated sources.' },
      { scenario: 'An article with 21+ authors', answer: 'List first 19 authors, then ellipsis (...), then last author.', rule: 'APA 7th ed: up to 20 authors listed; 21+ use ellipsis format.' },
    ]},
    'annotated-bib-full': { items: [
      { prompt: 'How long should each annotation typically be?', options: ['One sentence', '150-200 words (summary + evaluation + reflection)', 'One full page'], answer: '150-200 words (summary + evaluation + reflection)', rule: 'Three components: summary (what), evaluation (how credible), reflection (how used).' },
      { prompt: 'Should annotations be written in first or third person?', options: ['Always first person', 'Evaluation in third person; reflection may use first person', 'It does not matter'], answer: 'Evaluation in third person; reflection may use first person', rule: 'Keep summary and evaluation objective. Reflection can be personal.' },
    ]},
    'academic-tone': { items: [
      { informal: 'This study is really cool and shows some awesome stuff about teen brains.', formal: 'This study provides compelling evidence regarding adolescent neurological development.', answer: 'formal', rule: 'Academic writing avoids slang, colloquialisms, and vague intensifiers.' },
      { informal: 'Everybody knows that social media is bad for you.', formal: 'Research consistently suggests a correlation between heavy social media use and adverse mental health outcomes.', answer: 'formal', rule: 'Replace assumptions ("everybody knows") with evidence-based claims.' },
      { informal: 'The author totally destroys the other side\'s argument.', formal: 'The author effectively refutes the opposing position with empirical evidence.', answer: 'formal', rule: 'Use precise academic verbs: refutes, argues, demonstrates, contends.' },
      { informal: 'I think this proves my point.', formal: 'This evidence supports the thesis that...', answer: 'formal', rule: 'Let evidence speak. Replace "I think" with evidence-based assertions.' },
    ]},
    'hedging-language': { items: [
      { prompt: 'Which sentence uses appropriate academic hedging?', optionA: 'This proves that all teens are addicted to phones.', optionB: 'These findings suggest that a significant proportion of adolescents may exhibit patterns consistent with problematic phone use.', answer: 'B', rule: 'Hedging (suggest, may, patterns consistent with) shows scholarly caution.' },
      { prompt: 'Why is hedging important in academic writing?', options: ['It makes writing longer', 'It acknowledges the limits of evidence and avoids overclaiming', 'It sounds more impressive'], answer: 'It acknowledges the limits of evidence and avoids overclaiming', rule: 'No study "proves" something absolutely. Hedging reflects intellectual honesty.' },
      { prompt: 'Which is an appropriate hedging phrase?', options: ['"Obviously"', '"The data indicate that"', '"Everyone agrees"'], answer: '"The data indicate that"', rule: 'Good hedging: "suggests," "indicates," "appears to," "tends to."' },
    ]},
    'entering-scholarly-conversation': { items: [
      { prompt: 'What does it mean to "enter the scholarly conversation"?', options: ['Cite as many sources as possible', 'Position your argument in relation to existing research, agreeing, disagreeing, or extending', 'Email professors about your paper'], answer: 'Position your argument in relation to existing research, agreeing, disagreeing, or extending', rule: 'Research contributes to an ongoing dialogue among scholars.' },
      { prompt: 'Which phrase best positions your work in the scholarly conversation?', options: ['"Nobody has ever studied this"', '"Building on Chen\'s (2023) findings, this paper extends the analysis to..."', '"I am going to talk about..."'], answer: '"Building on Chen\'s (2023) findings, this paper extends the analysis to..."', rule: 'Show how your work builds on, challenges, or extends existing scholarship.' },
    ]},
    'algorithm-awareness': { items: [
      { prompt: 'Why do social media feeds show you certain content?', options: ['Random selection', 'Algorithms prioritize content likely to keep you engaged', 'The platform shows all posts chronologically'], answer: 'Algorithms prioritize content likely to keep you engaged', rule: 'Engagement-driven algorithms create filter bubbles and can amplify misinformation.' },
      { prompt: 'What is a "filter bubble"?', options: ['A water purification system', 'When algorithms limit your exposure to diverse viewpoints', 'A type of internet security'], answer: 'When algorithms limit your exposure to diverse viewpoints', rule: 'Filter bubbles narrow your information diet without your awareness.' },
      { prompt: 'How can you counteract algorithmic filtering?', options: ['Only use one platform', 'Actively seek out diverse sources and perspectives beyond your feed', 'Trust that the algorithm shows you everything important'], answer: 'Actively seek out diverse sources and perspectives beyond your feed', rule: 'Intentional media consumption is the antidote to algorithmic curation.' },
    ]},
    'deepfake-detection': { items: [
      { prompt: 'What is a deepfake?', options: ['A very deep website', 'AI-generated synthetic media (images, video, audio) designed to look real', 'A type of hacking'], answer: 'AI-generated synthetic media (images, video, audio) designed to look real', rule: 'Deepfakes use AI to create convincing but fabricated media.' },
      { prompt: 'Which is the best strategy for detecting manipulated media?', options: ['Trust your instincts', 'Verify through reverse image search and check if other reputable outlets confirm', 'Check if it has lots of likes'], answer: 'Verify through reverse image search and check if other reputable outlets confirm', rule: 'Cross-reference with trusted sources. Use tools like reverse image search.' },
      { prompt: 'Why are deepfakes a threat to democratic society?', options: ['They waste internet bandwidth', 'They can fabricate evidence, manipulate elections, and erode trust in authentic media', 'They are not really a threat'], answer: 'They can fabricate evidence, manipulate elections, and erode trust in authentic media', rule: 'The erosion of trust in media threatens informed democratic participation.' },
    ]},
    'misinformation-tracking': { items: [
      { prompt: 'What is the difference between misinformation and disinformation?', options: ['They are the same', 'Misinformation is unintentional; disinformation is deliberately false', 'Misinformation is online; disinformation is in print'], answer: 'Misinformation is unintentional; disinformation is deliberately false', rule: 'Intent matters: sharing a false claim unknowingly vs. creating it on purpose.' },
      { prompt: 'When a claim goes viral, what should you check first?', options: ['How many shares it has', 'The original source and whether credible outlets have verified it', 'Whether friends have shared it'], answer: 'The original source and whether credible outlets have verified it', rule: 'Virality is not verification. Trace claims back to primary sources.' },
      { prompt: 'What is "prebunking"?', options: ['Debunking claims before they spread by teaching critical thinking', 'Pre-publishing a news story', 'Blocking websites'], answer: 'Debunking claims before they spread by teaching critical thinking', rule: 'Prebunking inoculates people against manipulation techniques.' },
    ]},
    'proposal-writing': { items: [
      { prompt: 'What is the purpose of a capstone project proposal?', options: ['To get a grade for writing', 'To outline your project\'s question, method, timeline, and significance for approval', 'To show you have already finished the project'], answer: 'To outline your project\'s question, method, timeline, and significance for approval', rule: 'The proposal is a plan, not a finished product. It demonstrates feasibility.' },
      { prompt: 'A proposal should convince your reader that...', options: ['You are the smartest student', 'The project is feasible, significant, and well-planned', 'You have already completed similar work'], answer: 'The project is feasible, significant, and well-planned', rule: 'Address: What? Why does it matter? How will you do it? When?' },
    ]},
    'project-management': { items: [
      { prompt: 'What is a Gantt chart used for in a capstone project?', options: ['Displaying survey results', 'Visualizing the project timeline with milestones and deadlines', 'Formatting the Works Cited page'], answer: 'Visualizing the project timeline with milestones and deadlines', rule: 'Gantt charts break complex projects into manageable phases.' },
      { prompt: 'What should you do if your research takes longer than planned?', options: ['Panic and start over', 'Reassess scope, narrow focus if needed, and adjust timeline', 'Skip the research and write from memory'], answer: 'Reassess scope, narrow focus if needed, and adjust timeline', rule: 'Scope management is a key skill. Narrowing is not failing.' },
    ]},
    'presentation-defense': { items: [
      { prompt: 'In a thesis defense, when asked a question you cannot answer, you should...', options: ['Make up an answer', 'Acknowledge the limitation honestly and suggest how future research could address it', 'Refuse to answer'], answer: 'Acknowledge the limitation honestly and suggest how future research could address it', rule: 'Intellectual honesty is valued. No research answers everything.' },
      { prompt: 'What makes a strong thesis defense presentation?', options: ['Reading the paper aloud', 'Clearly presenting the question, methodology, findings, and significance with visuals', 'Having the longest slideshow'], answer: 'Clearly presenting the question, methodology, findings, and significance with visuals', rule: 'Structure: question, why it matters, how you studied it, what you found, so what.' },
    ]},
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

function generateExercise(grade, skill, count = 5) {
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);

  // Research question exercises (narrowing topics)
  if (selected[0].broad !== undefined && selected[0].narrowed !== undefined) {
    return { type: 'narrowing', skill, grade, count: selected.length, instruction: 'Identify whether the topic is too broad or properly narrowed for research.', items: selected.map(i => ({ prompt: `Broad: "${i.broad}" vs. Narrowed: "${i.narrowed}"`, answer: i.answer, rule: i.rule })) };
  }
  // Open/closed question identification
  if (selected[0].question !== undefined && (selected[0].answer === 'open' || selected[0].answer === 'closed')) {
    return { type: 'classify-question', skill, grade, count: selected.length, instruction: 'Is this research question open-ended or closed?', items: selected.map(i => ({ prompt: i.question, answer: i.answer, explanation: i.explanation })) };
  }
  // Researchable claims
  if (selected[0].claim !== undefined) {
    return { type: 'classify-claim', skill, grade, count: selected.length, instruction: 'Is this claim researchable or just an opinion?', items: selected.map(i => ({ prompt: i.claim, answer: i.answer, explanation: i.explanation })) };
  }
  // Source evaluation scenarios (CRAAP, credibility)
  if (selected[0].scenario !== undefined && selected[0].answer !== undefined && selected[0].criteria !== undefined) {
    return { type: 'source-evaluation', skill, grade, count: selected.length, instruction: 'Evaluate this source for reliability.', items: selected.map(i => ({ prompt: i.scenario, answer: i.answer, explanation: i.criteria })) };
  }
  // Source type classification
  if (selected[0].source !== undefined && selected[0].answer !== undefined && selected[0].explanation !== undefined) {
    return { type: 'classify-source', skill, grade, count: selected.length, instruction: 'Classify the source type.', items: selected.map(i => ({ prompt: i.source, answer: i.answer, explanation: i.explanation })) };
  }
  // Fill-in-choice (credibility basics, cornell notes, etc.)
  if (selected[0].prompt !== undefined && selected[0].options !== undefined && selected[0].answer !== undefined) {
    return { type: 'multiple-choice', skill, grade, count: selected.length, instruction: 'Choose the best answer.', items: selected.map(i => ({ prompt: i.prompt, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Citation exercises
  if (selected[0].scenario !== undefined && selected[0].answer !== undefined && selected[0].rule !== undefined) {
    return { type: 'citation-format', skill, grade, count: selected.length, instruction: 'Provide the correct citation format.', items: selected.map(i => ({ prompt: i.scenario, answer: i.answer, rule: i.rule })) };
  }
  if (selected[0].info !== undefined && selected[0].answer !== undefined) {
    return { type: 'citation-create', skill, grade, count: selected.length, instruction: 'Create the correct citation from this information.', items: selected.map(i => ({ prompt: i.info, answer: i.answer, rule: i.rule || '' })) };
  }
  // Plagiarism identification
  if (selected[0].original !== undefined && selected[0].student !== undefined) {
    return { type: 'plagiarism-check', skill, grade, count: selected.length, instruction: 'Is this plagiarism, a proper quote, or a proper paraphrase?', items: selected.map(i => ({ prompt: `Original: "${i.original}" | Student: "${i.student}"`, answer: i.answer, explanation: i.explanation })) };
  }
  // Paraphrase quality
  if (selected[0].original !== undefined && selected[0].good !== undefined) {
    return { type: 'paraphrase-evaluate', skill, grade, count: selected.length, instruction: 'Identify the effective paraphrase.', items: selected.map(i => ({ prompt: `Original: "${i.original}"`, good: i.good, bad: i.bad, answer: i.answer, rule: i.rule })) };
  }
  // Quote vs paraphrase decision
  if (selected[0].text !== undefined && (selected[0].answer === 'quote' || selected[0].answer === 'paraphrase')) {
    return { type: 'quote-or-paraphrase', skill, grade, count: selected.length, instruction: 'Should this be quoted directly or paraphrased?', items: selected.map(i => ({ prompt: i.text, answer: i.answer, rule: i.rule })) };
  }
  // Thesis evaluation
  if (selected[0].topic !== undefined && selected[0].weak !== undefined && selected[0].strong !== undefined) {
    return { type: 'thesis-evaluate', skill, grade, count: selected.length, instruction: 'Identify the strong thesis statement.', items: selected.map(i => ({ prompt: `Topic: ${i.topic} | Weak: "${i.weak}" | Strong: "${i.strong}"`, answer: i.answer, rule: i.rule })) };
  }
  // Evidence integration evaluation
  if (selected[0].text !== undefined && (selected[0].answer === 'dropped-in' || selected[0].answer === 'well-integrated' || selected[0].answer === 'poor' || selected[0].answer === 'good')) {
    return { type: 'evaluate-writing', skill, grade, count: selected.length, instruction: 'Evaluate this writing sample.', items: selected.map(i => ({ prompt: i.text, answer: i.answer, explanation: i.explanation })) };
  }
  // Annotation evaluation
  if (selected[0].annotation !== undefined) {
    return { type: 'evaluate-annotation', skill, grade, count: selected.length, instruction: 'Is this annotation weak or strong?', items: selected.map(i => ({ prompt: i.annotation, answer: i.answer, explanation: i.explanation })) };
  }
  // Fact vs opinion
  if (selected[0].statement !== undefined && (selected[0].answer === 'fact' || selected[0].answer === 'opinion')) {
    return { type: 'fact-or-opinion', skill, grade, count: selected.length, instruction: 'Is this a fact or an opinion?', items: selected.map(i => ({ prompt: i.statement, answer: i.answer, explanation: i.explanation })) };
  }
  // Clickbait detection
  if (selected[0].headline !== undefined) {
    return { type: 'clickbait-check', skill, grade, count: selected.length, instruction: 'Is this headline clickbait or legitimate?', items: selected.map(i => ({ prompt: i.headline, answer: i.answer, indicators: i.indicators })) };
  }
  // Source comparison
  if (selected[0].sourceA !== undefined && selected[0].sourceB !== undefined && selected[0].better !== undefined) {
    return { type: 'source-compare', skill, grade, count: selected.length, instruction: 'Which source is more credible and why?', items: selected.map(i => ({ prompt: `A: ${i.sourceA} | B: ${i.sourceB}`, answer: i.better, explanation: i.explanation })) };
  }
  // Source relationship (agreement/disagreement)
  if (selected[0].sourceA !== undefined && selected[0].sourceB !== undefined && selected[0].relationship !== undefined) {
    return { type: 'source-relationship', skill, grade, count: selected.length, instruction: 'What is the relationship between these sources?', items: selected.map(i => ({ prompt: `A: ${i.sourceA} | B: ${i.sourceB}`, answer: i.relationship, explanation: i.explanation })) };
  }
  // Gap identification
  if (selected[0].existing !== undefined && selected[0].gap !== undefined) {
    return { type: 'identify-gap', skill, grade, count: selected.length, instruction: 'What gap exists in this research collection?', items: selected.map(i => ({ prompt: i.existing, answer: i.gap, explanation: i.explanation })) };
  }
  // Synthesis matrix
  if (selected[0].claim !== undefined && selected[0].sources !== undefined) {
    return { type: 'synthesis-matrix', skill, grade, count: selected.length, instruction: 'Map how sources relate to this claim.', items: selected.map(i => ({ prompt: `Claim: "${i.claim}" | Sources: ${i.sources.join('; ')}`, answer: i.answer, explanation: i.explanation })) };
  }
  // Bias analysis (headlines)
  if (selected[0].headlineA !== undefined && selected[0].headlineB !== undefined) {
    return { type: 'framing-analysis', skill, grade, count: selected.length, instruction: 'Identify how framing differs between these headlines.', items: selected.map(i => ({ prompt: `A: "${i.headlineA}" | B: "${i.headlineB}"`, answer: i.answer, explanation: i.explanation })) };
  }
  // Selection bias scenarios
  if (selected[0].scenario !== undefined && selected[0].answer !== undefined && selected[0].explanation !== undefined) {
    return { type: 'bias-identify', skill, grade, count: selected.length, instruction: 'Identify the type of media bias.', items: selected.map(i => ({ prompt: i.scenario, answer: i.answer, explanation: i.explanation })) };
  }
  // Option A vs B comparisons
  if (selected[0].optionA !== undefined && selected[0].optionB !== undefined) {
    return { type: 'compare-options', skill, grade, count: selected.length, instruction: 'Which option is better and why?', items: selected.map(i => ({ prompt: `A: ${i.optionA} | B: ${i.optionB}`, answer: i.answer, explanation: i.explanation || i.rule || '' })) };
  }
  // Unqualified vs qualified claims
  if (selected[0].unqualified !== undefined && selected[0].qualified !== undefined) {
    return { type: 'qualify-claim', skill, grade, count: selected.length, instruction: 'Identify the properly qualified academic claim.', items: selected.map(i => ({ prompt: `Unqualified: "${i.unqualified}" | Qualified: "${i.qualified}"`, answer: i.answer, rule: i.rule })) };
  }
  // Commentary evaluation
  if (selected[0].text !== undefined && selected[0].answer !== undefined) {
    return { type: 'evaluate-text', skill, grade, count: selected.length, instruction: 'Evaluate this research writing.', items: selected.map(i => ({ prompt: i.text, answer: i.answer, explanation: i.explanation || '' })) };
  }
  // Rhetorical appeals
  if (selected[0].example !== undefined && selected[0].appeal !== undefined) {
    return { type: 'identify-appeal', skill, grade, count: selected.length, instruction: 'Identify the rhetorical appeal or technique used.', items: selected.map(i => ({ prompt: i.example, answer: i.appeal, explanation: i.explanation })) };
  }
  // Propaganda techniques
  if (selected[0].example !== undefined && selected[0].technique !== undefined) {
    return { type: 'identify-technique', skill, grade, count: selected.length, instruction: 'Identify the propaganda technique.', items: selected.map(i => ({ prompt: i.example, answer: i.technique, explanation: i.explanation })) };
  }
  // Scholarly vs popular
  if (selected[0].source !== undefined && selected[0].markers !== undefined) {
    return { type: 'classify-source-level', skill, grade, count: selected.length, instruction: 'Classify this source as scholarly, popular, or gray literature.', items: selected.map(i => ({ prompt: i.source, answer: i.answer, explanation: i.markers })) };
  }
  // Primary vs secondary
  if (selected[0].source !== undefined && (selected[0].answer === 'primary' || selected[0].answer === 'secondary')) {
    return { type: 'primary-secondary', skill, grade, count: selected.length, instruction: 'Is this a primary or secondary source?', items: selected.map(i => ({ prompt: i.source, answer: i.answer, explanation: i.explanation })) };
  }
  // Academic tone
  if (selected[0].informal !== undefined && selected[0].formal !== undefined) {
    return { type: 'tone-evaluate', skill, grade, count: selected.length, instruction: 'Identify the appropriately academic version.', items: selected.map(i => ({ prompt: `Informal: "${i.informal}" | Formal: "${i.formal}"`, answer: i.answer, rule: i.rule })) };
  }
  // Field-citation match
  if (selected[0].field !== undefined) {
    return { type: 'citation-field', skill, grade, count: selected.length, instruction: 'Which citation style is standard for this field?', items: selected.map(i => ({ prompt: i.field, answer: i.answer, rule: i.rule })) };
  }
  // Generic prompt-answer (fallback for many grade-11/12 items)
  if (selected[0].prompt !== undefined && selected[0].answer !== undefined) {
    return { type: 'short-answer', skill, grade, count: selected.length, instruction: 'Answer the question.', items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, rule: i.rule || i.explanation || '' })) };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  const ne = norm(expected), na = norm(answer);
  if (ne === na) return true;
  if (ne.length > 30) {
    const keywords = ne.split(/\s+/).filter(w => w.length > 3);
    if (keywords.length === 0) return false;
    const matched = keywords.filter(k => na.includes(k)).length;
    return matched / keywords.length >= 0.6;
  }
  return false;
}

// ── Public API ──

class ResearchMedia {
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

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        warmup: `Review: What do you already know about ${target.category.replace(/-/g, ' ')}?`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply this skill to your own research or media analysis.',
      },
    };
  }
}

module.exports = ResearchMedia;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rm = new ResearchMedia();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) rm.setGrade(id, grade);
        out({ action: 'start', profile: rm.getProfile(id), nextSkills: rm.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(rm.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(rm.generateExercise(grade, skill, 5)); }
        else { const n = rm.getNextSkills(id, 1).next; out(n.length ? rm.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(rm.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(rm.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(rm.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(rm.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(rm.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? rm.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(rm.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(rm.setGrade(id, g)); break; }
      default: out({ usage: 'node research-media.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
