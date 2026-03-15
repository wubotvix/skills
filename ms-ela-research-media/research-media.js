// eClaw MS ELA Research & Media Literacy Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-ela-research-media');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'research-projects': ['short-research-project'],
    'gathering-info': ['gather-information'],
    'evidence': ['draw-evidence-literary', 'draw-evidence-informational'],
    'media-literacy': ['interpret-diverse-media'],
  },
  'grade-7': {
    'research-projects': ['focused-research'],
    'gathering-info': ['assess-sources', 'search-terms'],
    'evidence': ['evidence-literary-7', 'evidence-informational-7'],
    'media-literacy': ['analyze-media-main-ideas'],
  },
  'grade-8': {
    'research-projects': ['sustained-research'],
    'gathering-info': ['synthesize-sources', 'avoid-plagiarism'],
    'evidence': ['evidence-literary-8', 'evidence-informational-8'],
    'media-literacy': ['evaluate-media-advantages'],
  },
};

// ── Content Banks ──

const EXERCISE_BANKS = {
  'grade-6': {
    'short-research-project': {
      items: [
        { prompt: 'Which research question is best for a short project?', options: ['What is climate change?', 'How does plastic pollution affect sea turtles in the Gulf of Mexico?', 'Tell me about the ocean.'], answer: 'How does plastic pollution affect sea turtles in the Gulf of Mexico?', rule: 'A good research question is focused and answerable with evidence.' },
        { prompt: 'What should you do if your research question is too broad?', options: ['Give up', 'Narrow the focus to a specific aspect', 'Pick a totally new topic'], answer: 'Narrow the focus to a specific aspect', rule: 'Refocusing helps make research manageable.' },
        { prompt: 'How many sources should a short research project typically draw on?', options: ['One source only', 'Several sources', 'No sources needed'], answer: 'Several sources', rule: 'Multiple sources provide balanced information.' },
        { prompt: '"What about dogs?" is what kind of research question?', options: ['Too narrow', 'Too broad', 'Just right'], answer: 'Too broad', rule: 'A question needs specific focus to guide research.' },
        { prompt: 'Which is a sign you need to refocus your research?', options: ['You find too much information to manage', 'You found exactly three sources', 'Your teacher approved the topic'], answer: 'You find too much information to manage', rule: 'When overwhelmed with information, narrow the question.' },
        { prompt: 'What is the first step in a short research project?', options: ['Write the final paper', 'Develop a focused research question', 'Create a bibliography'], answer: 'Develop a focused research question', rule: 'Research begins with a clear question.' },
        { prompt: 'Which question is too narrow for a research project?', options: ['How do hurricanes form?', 'What was the temperature in Miami on July 4, 2024?', 'How does weather affect agriculture?'], answer: 'What was the temperature in Miami on July 4, 2024?', rule: 'Too-narrow questions can be answered with a single fact.' },
        { prompt: 'When should you refocus your inquiry?', options: ['Never — stick with your original question', 'When your sources lead you to a more interesting angle', 'Only if your teacher tells you to'], answer: 'When your sources lead you to a more interesting angle', rule: 'Good researchers adapt their questions as they learn.' },
      ],
    },
    'gather-information': {
      items: [
        { prompt: 'What does "assess credibility" mean?', options: ['Check if a source is trustworthy and reliable', 'Count how many pages a source has', 'See if the source is free'], answer: 'Check if a source is trustworthy and reliable', rule: 'Credibility means the source can be trusted.' },
        { prompt: 'Which source is most credible for a science report?', options: ['A peer-reviewed journal article', 'A random blog post', 'A social media comment'], answer: 'A peer-reviewed journal article', rule: 'Peer-reviewed sources are vetted by experts.' },
        { prompt: 'What should you provide when using information from a source?', options: ['Basic bibliographic information', 'Only the website color scheme', 'Nothing if you paraphrase'], answer: 'Basic bibliographic information', rule: 'Always give credit to your sources.' },
        { prompt: 'What is the difference between quoting and paraphrasing?', options: ['Quoting uses exact words in quotation marks; paraphrasing restates in your own words', 'They are the same thing', 'Paraphrasing uses quotation marks'], answer: 'Quoting uses exact words in quotation marks; paraphrasing restates in your own words', rule: 'Both require citation, but quoting uses exact words.' },
        { prompt: 'Which is a digital source?', options: ['A website article', 'A printed textbook', 'A handwritten letter'], answer: 'A website article', rule: 'Digital sources are accessed electronically.' },
        { prompt: 'A website with no author and no date is likely:', options: ['Very credible', 'Less credible and needs verification', 'The best kind of source'], answer: 'Less credible and needs verification', rule: 'Missing author and date are red flags for credibility.' },
        { prompt: 'When paraphrasing, you must still:', options: ['Cite the source', 'Use quotation marks', 'Copy the original sentence'], answer: 'Cite the source', rule: 'Paraphrasing without citation is plagiarism.' },
        { prompt: 'What does the "R" in the CRAAP test stand for?', options: ['Relevance', 'Reading level', 'Reputation'], answer: 'Relevance', rule: 'CRAAP: Currency, Relevance, Authority, Accuracy, Purpose.' },
      ],
    },
    'draw-evidence-literary': {
      items: [
        { prompt: 'When writing about a novel, what counts as textual evidence?', options: ['A direct quote or specific detail from the text', 'Your personal opinion without reference to the book', 'A summary of the movie version'], answer: 'A direct quote or specific detail from the text', rule: 'Evidence must come from the literary text itself.' },
        { prompt: 'How should you introduce a quote from a story?', options: ['With a signal phrase like "The author states"', 'By just pasting it with no introduction', 'By changing the words first'], answer: 'With a signal phrase like "The author states"', rule: 'Signal phrases smoothly integrate evidence into writing.' },
        { prompt: 'After providing a quote, what should you do?', options: ['Explain how it supports your point', 'Move to the next paragraph', 'Add another quote immediately'], answer: 'Explain how it supports your point', rule: 'Evidence needs analysis to be effective.' },
        { prompt: 'Which is the best use of literary evidence?', options: ['The character shows bravery when she says, "I will not back down" (23).', 'The book is good.', 'I think the character is brave.'], answer: 'The character shows bravery when she says, "I will not back down" (23).', rule: 'Strong evidence includes a quote with page number and analysis.' },
        { prompt: 'What does "drawing evidence" from a literary text mean?', options: ['Using specific details from the text to support your ideas', 'Drawing pictures of scenes from the story', 'Copying the whole paragraph'], answer: 'Using specific details from the text to support your ideas', rule: 'Drawing evidence means selecting relevant support from the source.' },
        { prompt: 'Which part of a literary analysis paragraph contains evidence?', options: ['The topic sentence', 'The supporting detail with a quote', 'The concluding sentence only'], answer: 'The supporting detail with a quote', rule: 'Evidence appears as supporting details within body paragraphs.' },
      ],
    },
    'draw-evidence-informational': {
      items: [
        { prompt: 'When writing about a nonfiction article, what is textual evidence?', options: ['Facts, data, or quotes from the article', 'Your own prior knowledge only', 'Information from a different topic'], answer: 'Facts, data, or quotes from the article', rule: 'Evidence from informational texts includes facts, statistics, and expert quotes.' },
        { prompt: 'How do you cite evidence from an informational text?', options: ['Include the author and page or paragraph number', 'Just say "I read it somewhere"', 'No citation is needed for nonfiction'], answer: 'Include the author and page or paragraph number', rule: 'All borrowed information needs proper citation.' },
        { prompt: 'Which is the strongest informational evidence?', options: ['According to NASA, global temperatures rose 1.1C since 1880.', 'It is getting hotter.', 'Everyone knows about climate change.'], answer: 'According to NASA, global temperatures rose 1.1C since 1880.', rule: 'Strong evidence is specific, attributed, and verifiable.' },
        { prompt: 'Why should you use evidence from multiple informational texts?', options: ['To show different perspectives and strengthen your argument', 'Because one source is never correct', 'To make your paper longer'], answer: 'To show different perspectives and strengthen your argument', rule: 'Multiple sources provide balanced and credible support.' },
        { prompt: 'What is the purpose of a works cited page?', options: ['To give credit to all sources used', 'To list your favorite books', 'To show how many pages you read'], answer: 'To give credit to all sources used', rule: 'A works cited page provides full source information.' },
        { prompt: 'When is it better to quote directly rather than paraphrase?', options: ['When the exact wording is important or powerful', 'Always', 'Never — always paraphrase'], answer: 'When the exact wording is important or powerful', rule: 'Direct quotes preserve the authority of the original language.' },
      ],
    },
    'interpret-diverse-media': {
      items: [
        { prompt: 'What does "diverse media" include?', options: ['Text, images, audio, video, and graphics', 'Only printed books', 'Only websites'], answer: 'Text, images, audio, video, and graphics', rule: 'Diverse media means information in many formats.' },
        { prompt: 'Why might a chart be more effective than a paragraph for showing data?', options: ['Charts make numerical patterns easy to see at a glance', 'Charts are always better than text', 'Paragraphs cannot contain numbers'], answer: 'Charts make numerical patterns easy to see at a glance', rule: 'Different media formats have different strengths.' },
        { prompt: 'When interpreting a video about a topic, what should you consider?', options: ['The main idea, supporting details, and how visuals add meaning', 'Only whether you liked it', 'Just the background music'], answer: 'The main idea, supporting details, and how visuals add meaning', rule: 'Analyzing media requires attention to content and techniques.' },
        { prompt: 'How can an infographic contribute to understanding a topic?', options: ['It combines text and visuals to present information efficiently', 'It replaces the need to read any text', 'It is only decorative'], answer: 'It combines text and visuals to present information efficiently', rule: 'Infographics synthesize complex information visually.' },
        { prompt: 'A podcast episode about climate change is an example of:', options: ['Audio media', 'Print media', 'A primary source document'], answer: 'Audio media', rule: 'Podcasts deliver information through audio format.' },
        { prompt: 'What question helps you analyze how media contributes to a topic?', options: ['What information does this format convey that text alone might not?', 'Is this media entertaining?', 'How long is this piece of media?'], answer: 'What information does this format convey that text alone might not?', rule: 'Evaluating media means considering its unique contribution.' },
        { prompt: 'A documentary uses interviews and footage. This is an example of:', options: ['Multimedia presentation combining multiple formats', 'A print source', 'A secondary source only'], answer: 'Multimedia presentation combining multiple formats', rule: 'Documentaries combine video, audio, text, and interviews.' },
        { prompt: 'When two media present the same topic differently, you should:', options: ['Compare what each format emphasizes and what it leaves out', 'Only trust the longer one', 'Ignore the differences'], answer: 'Compare what each format emphasizes and what it leaves out', rule: 'Comparing media reveals how format shapes understanding.' },
      ],
    },
  },
  'grade-7': {
    'focused-research': {
      items: [
        { prompt: 'What makes a research project "focused"?', options: ['It answers a specific question with targeted sources', 'It covers as many topics as possible', 'It uses only one source'], answer: 'It answers a specific question with targeted sources', rule: 'Focused research stays on a specific question.' },
        { prompt: 'After initial research, you should:', options: ['Generate additional related questions for further research', 'Stop researching immediately', 'Change your topic completely'], answer: 'Generate additional related questions for further research', rule: 'Good research generates new questions to explore.' },
        { prompt: 'Which is an example of a focused follow-up question?', options: ['My original question was about recycling programs — now I want to know which type of recycling reduces the most waste.', 'What about recycling?', 'Is recycling good?'], answer: 'My original question was about recycling programs — now I want to know which type of recycling reduces the most waste.', rule: 'Follow-up questions dig deeper into specific aspects.' },
        { prompt: 'How do you know when you have enough sources?', options: ['When you can answer your research question with evidence from multiple perspectives', 'When you have exactly two sources', 'When you are tired of searching'], answer: 'When you can answer your research question with evidence from multiple perspectives', rule: 'Sufficient sources cover multiple perspectives on your question.' },
        { prompt: 'What should you do if sources contradict each other?', options: ['Investigate why and consider both perspectives', 'Pick the one you agree with', 'Throw out both sources'], answer: 'Investigate why and consider both perspectives', rule: 'Contradictions are opportunities for deeper analysis.' },
        { prompt: 'A focused research question for grade 7 would be:', options: ['What are the most effective strategies for reducing plastic waste in schools?', 'What is plastic?', 'Tell me everything about pollution.'], answer: 'What are the most effective strategies for reducing plastic waste in schools?', rule: 'Grade 7 questions should allow comparison and analysis.' },
      ],
    },
    'assess-sources': {
      items: [
        { prompt: 'A website ending in .gov is published by:', options: ['A government agency', 'A commercial business', 'Any individual'], answer: 'A government agency', rule: 'Domain endings indicate the type of organization.' },
        { prompt: 'What does the "A" (first one) in CRAAP stand for?', options: ['Authority', 'Appearance', 'Argument'], answer: 'Authority', rule: 'Authority checks who wrote the source and their credentials.' },
        { prompt: 'An article from 2005 about current technology trends is likely:', options: ['Outdated for this topic', 'The most reliable option', 'Perfect because older is better'], answer: 'Outdated for this topic', rule: 'Currency matters more for fast-changing topics.' },
        { prompt: 'Which source would be most credible for a health topic?', options: ['Mayo Clinic website', 'An anonymous forum post', 'A product advertisement'], answer: 'Mayo Clinic website', rule: 'Established medical organizations are authoritative health sources.' },
        { prompt: 'What is the purpose of checking an author\'s credentials?', options: ['To see if they have expertise in the subject', 'To find their social media', 'To see if they are famous'], answer: 'To see if they have expertise in the subject', rule: 'Authority requires relevant expertise.' },
        { prompt: 'A source that only presents one side of a debate is showing:', options: ['Bias', 'Authority', 'Currency'], answer: 'Bias', rule: 'Biased sources may omit important counterarguments.' },
        { prompt: 'The SIFT method\'s "I" stands for:', options: ['Investigate the source', 'Ignore the source', 'Improve the source'], answer: 'Investigate the source', rule: 'SIFT: Stop, Investigate the source, Find better coverage, Trace claims.' },
        { prompt: 'Which question helps assess accuracy?', options: ['Can the information be verified in other reliable sources?', 'Is the website colorful?', 'Is the article long?'], answer: 'Can the information be verified in other reliable sources?', rule: 'Accurate information can be confirmed across multiple sources.' },
      ],
    },
    'search-terms': {
      items: [
        { prompt: 'Which search terms would best find information about teen sleep habits?', options: ['"adolescent sleep patterns" health effects', 'sleep', 'teen stuff'], answer: '"adolescent sleep patterns" health effects', rule: 'Specific, multi-word search terms yield better results.' },
        { prompt: 'Using quotation marks in a search engine:', options: ['Searches for that exact phrase', 'Removes that word from results', 'Makes the search faster'], answer: 'Searches for that exact phrase', rule: 'Quotation marks force an exact phrase match.' },
        { prompt: 'What should you do if your search returns too many irrelevant results?', options: ['Add more specific keywords', 'Use fewer words', 'Give up and use the first result'], answer: 'Add more specific keywords', rule: 'Adding specific terms narrows results to relevant ones.' },
        { prompt: 'Which Boolean operator narrows search results?', options: ['AND', 'OR', 'MAYBE'], answer: 'AND', rule: 'AND requires all terms to appear, narrowing results.' },
        { prompt: 'If searching for "effects of social media on teens" gives too few results, try:', options: ['Broadening with synonyms: "impact of social networking on adolescents"', 'Searching the exact same thing again', 'Using only one word: "teens"'], answer: 'Broadening with synonyms: "impact of social networking on adolescents"', rule: 'Synonyms and related terms help find more sources.' },
        { prompt: 'A database is different from a regular search engine because:', options: ['It contains curated, often peer-reviewed or edited sources', 'It only shows images', 'It is slower'], answer: 'It contains curated, often peer-reviewed or edited sources', rule: 'Academic databases provide more reliable sources than general searches.' },
        { prompt: 'The minus sign (-) before a search term:', options: ['Excludes that term from results', 'Requires that term', 'Does nothing'], answer: 'Excludes that term from results', rule: 'The minus operator filters out unwanted results.' },
        { prompt: 'Which is the most effective search strategy?', options: ['Start broad, then narrow with specific terms', 'Use only one word', 'Search only in one database'], answer: 'Start broad, then narrow with specific terms', rule: 'Iterative searching from broad to narrow is most effective.' },
      ],
    },
    'evidence-literary-7': {
      items: [
        { prompt: 'In a literary analysis, evidence should:', options: ['Directly support your claim about the text', 'Be about a completely different book', 'Only come from the first page'], answer: 'Directly support your claim about the text', rule: 'Evidence must be relevant to the specific argument.' },
        { prompt: 'What is a "claim" in literary analysis?', options: ['An arguable statement about the text that needs evidence', 'A summary of the plot', 'The title of the book'], answer: 'An arguable statement about the text that needs evidence', rule: 'Claims are debatable interpretations supported by evidence.' },
        { prompt: 'The CEI method stands for:', options: ['Claim, Evidence, Interpretation', 'Copy, Edit, Ignore', 'Cite, Explain, Include'], answer: 'Claim, Evidence, Interpretation', rule: 'CEI structures analytical paragraphs effectively.' },
        { prompt: 'Which shows proper integration of a literary quote?', options: ['Scout learns empathy when Atticus says, "You never really understand a person...until you climb into his skin" (Lee 39).', '"You never really understand a person."', 'Atticus talks about understanding people.'], answer: 'Scout learns empathy when Atticus says, "You never really understand a person...until you climb into his skin" (Lee 39).', rule: 'Integrated quotes include context, the quote, citation, and analysis.' },
        { prompt: 'When analyzing a poem, what counts as evidence?', options: ['Specific lines, imagery, word choice, and literary devices', 'Only your feelings about the poem', 'The biography of the poet only'], answer: 'Specific lines, imagery, word choice, and literary devices', rule: 'Poetry evidence includes language, structure, and literary elements.' },
        { prompt: 'What is the purpose of analysis after presenting evidence?', options: ['To explain HOW the evidence supports your claim', 'To repeat the quote', 'To introduce a new topic'], answer: 'To explain HOW the evidence supports your claim', rule: 'Analysis connects evidence to the argument.' },
      ],
    },
    'evidence-informational-7': {
      items: [
        { prompt: 'When citing evidence from an informational text, you should include:', options: ['Author and page/paragraph number', 'Only the title of the article', 'Nothing — informational texts do not need citation'], answer: 'Author and page/paragraph number', rule: 'Informational text citations follow the same rules as other sources.' },
        { prompt: 'Which is the strongest informational evidence?', options: ['A specific statistic from a credible study', 'A vague statement like "studies show"', 'Your personal experience'], answer: 'A specific statistic from a credible study', rule: 'Specific, attributed data is the strongest evidence.' },
        { prompt: 'How do you synthesize evidence from two informational texts?', options: ['Show how both sources support or complicate your point', 'Copy from one and ignore the other', 'Only use the longer source'], answer: 'Show how both sources support or complicate your point', rule: 'Synthesis combines information from multiple sources into a coherent argument.' },
        { prompt: 'What should you do when an informational source includes a graph?', options: ['Analyze what the graph shows and reference it as evidence', 'Skip it — only text counts', 'Describe only the colors used'], answer: 'Analyze what the graph shows and reference it as evidence', rule: 'Visual data in informational texts is valid evidence.' },
        { prompt: 'An effective body paragraph using informational evidence includes:', options: ['A topic sentence, evidence with citation, and analysis', 'Only a quote', 'Just your opinion'], answer: 'A topic sentence, evidence with citation, and analysis', rule: 'Strong paragraphs follow a claim-evidence-analysis structure.' },
        { prompt: 'Why is it important to use evidence from multiple informational sources?', options: ['It shows a complete picture and strengthens credibility', 'It is required to have exactly five sources', 'It makes the paper longer'], answer: 'It shows a complete picture and strengthens credibility', rule: 'Multiple sources demonstrate thorough research.' },
      ],
    },
    'analyze-media-main-ideas': {
      items: [
        { prompt: 'When analyzing media, "main ideas" refers to:', options: ['The central message or argument the media conveys', 'The visual design choices only', 'The length of the media piece'], answer: 'The central message or argument the media conveys', rule: 'Main ideas are the key points the media communicates.' },
        { prompt: 'How do supporting details in a video differ from those in text?', options: ['Videos use visuals, sound, and narration together as support', 'They do not differ at all', 'Videos have no supporting details'], answer: 'Videos use visuals, sound, and narration together as support', rule: 'Different media use format-specific supporting details.' },
        { prompt: 'A news infographic about water usage includes a bar chart. The chart serves as:', options: ['A supporting detail that clarifies the main idea with data', 'Decoration', 'The only thing that matters'], answer: 'A supporting detail that clarifies the main idea with data', rule: 'Visual elements in media serve as evidence for claims.' },
        { prompt: 'When analyzing a podcast, you should note:', options: ['Main ideas, supporting evidence, and how the format shapes understanding', 'Only the host\'s name', 'Just whether you liked it'], answer: 'Main ideas, supporting evidence, and how the format shapes understanding', rule: 'Media analysis requires examining content and format together.' },
        { prompt: 'How does a documentary clarify a topic differently than a written article?', options: ['Through real footage, interviews, and visual storytelling', 'It does not — they are identical', 'Documentaries only entertain'], answer: 'Through real footage, interviews, and visual storytelling', rule: 'Each media format has unique ways of conveying information.' },
        { prompt: 'When two media formats present the same topic, you should compare:', options: ['What each format emphasizes and what it leaves out', 'Only which is longer', 'Just which one you prefer'], answer: 'What each format emphasizes and what it leaves out', rule: 'Comparing formats reveals how presentation shapes understanding.' },
      ],
    },
  },
  'grade-8': {
    'sustained-research': {
      items: [
        { prompt: 'What distinguishes a sustained research project from a short one?', options: ['It is more in-depth, involves multiple stages, and synthesizes many sources', 'It is simply longer', 'It has a fancier cover page'], answer: 'It is more in-depth, involves multiple stages, and synthesizes many sources', rule: 'Sustained research requires deeper investigation over time.' },
        { prompt: 'A self-generated research question means:', options: ['You develop the question based on your own curiosity and prior research', 'Your teacher assigns the exact question', 'You copy a question from a source'], answer: 'You develop the question based on your own curiosity and prior research', rule: 'Self-generated questions show independent thinking.' },
        { prompt: 'When should you narrow your research inquiry?', options: ['When your topic is too broad to cover thoroughly', 'Never — always keep the original scope', 'Only at the very end'], answer: 'When your topic is too broad to cover thoroughly', rule: 'Narrowing focuses research for deeper analysis.' },
        { prompt: 'When should you broaden your research inquiry?', options: ['When you cannot find enough sources or information', 'When you have too many sources', 'At the beginning only'], answer: 'When you cannot find enough sources or information', rule: 'Broadening opens up more avenues for evidence.' },
        { prompt: 'Synthesizing multiple sources means:', options: ['Combining ideas from different sources into an original analysis', 'Summarizing each source separately', 'Copying from multiple sources'], answer: 'Combining ideas from different sources into an original analysis', rule: 'Synthesis creates new understanding from multiple perspectives.' },
        { prompt: 'A grade 8 research question should:', options: ['Require analysis and synthesis from multiple sources', 'Have a simple yes/no answer', 'Cover only one source'], answer: 'Require analysis and synthesis from multiple sources', rule: 'Grade 8 questions demand analytical thinking and multi-source evidence.' },
        { prompt: 'Which is an appropriate grade 8 research question?', options: ['To what extent has social media changed how teenagers engage in civic action?', 'What is social media?', 'Do teens use social media?'], answer: 'To what extent has social media changed how teenagers engage in civic action?', rule: 'Strong research questions require analysis, not simple facts.' },
        { prompt: 'During sustained research, keeping a research log helps you:', options: ['Track your sources, questions, and evolving understanding', 'Avoid reading your sources', 'Write the final paper faster'], answer: 'Track your sources, questions, and evolving understanding', rule: 'Research logs document the process and support reflection.' },
      ],
    },
    'synthesize-sources': {
      items: [
        { prompt: 'What is the difference between summarizing and synthesizing?', options: ['Summarizing restates one source; synthesizing combines multiple sources into new understanding', 'They are identical', 'Synthesizing is just longer summarizing'], answer: 'Summarizing restates one source; synthesizing combines multiple sources into new understanding', rule: 'Synthesis goes beyond summary to create original analysis.' },
        { prompt: 'When synthesizing, you should:', options: ['Look for patterns, connections, and contradictions across sources', 'Copy the best sentences from each source', 'Only use sources that agree with each other'], answer: 'Look for patterns, connections, and contradictions across sources', rule: 'Effective synthesis identifies relationships between sources.' },
        { prompt: 'Which sentence synthesizes two sources?', options: ['While Smith argues that social media harms teens, Jones found that it can also build community (Smith 12; Jones 45).', 'Smith says social media is bad. Jones says social media is good.', 'Social media affects teenagers.'], answer: 'While Smith argues that social media harms teens, Jones found that it can also build community (Smith 12; Jones 45).', rule: 'Synthesis weaves multiple sources into a single analytical point.' },
        { prompt: 'A synthesis paragraph should:', options: ['Present a main point supported by evidence from multiple sources', 'Summarize one source per paragraph', 'Avoid using citations'], answer: 'Present a main point supported by evidence from multiple sources', rule: 'Synthesis organizes by idea, not by source.' },
        { prompt: 'What should you do when sources present conflicting information?', options: ['Analyze why they differ and discuss the implications', 'Ignore the conflicting source', 'Only cite the source you agree with'], answer: 'Analyze why they differ and discuss the implications', rule: 'Addressing contradictions strengthens critical analysis.' },
        { prompt: 'A graphic organizer for synthesis should:', options: ['Map how ideas from different sources connect to your research question', 'List sources alphabetically', 'Only track page numbers'], answer: 'Map how ideas from different sources connect to your research question', rule: 'Graphic organizers help visualize connections across sources.' },
      ],
    },
    'avoid-plagiarism': {
      items: [
        { prompt: 'Paraphrasing without citation is:', options: ['Plagiarism', 'Acceptable', 'Only a problem in college'], answer: 'Plagiarism', rule: 'All borrowed ideas need citation, even paraphrased ones.' },
        { scenario: 'A student changes a few words in a sentence from a source but keeps the same structure. Is this plagiarism?', answer: 'yes', explanation: 'Changing a few words while keeping the structure is inadequate paraphrasing and counts as plagiarism.' },
        { scenario: 'A student writes "George Washington was the first president" without a citation. Is this plagiarism?', answer: 'no', explanation: 'Common knowledge — widely known facts do not need citation.' },
        { scenario: 'A student puts a passage in quotation marks and includes the author and page number. Is this plagiarism?', answer: 'no', explanation: 'Properly quoted and cited material is not plagiarism.' },
        { scenario: 'A student submits a paper they wrote for another class without telling the teacher. Is this plagiarism?', answer: 'yes', explanation: 'Self-plagiarism — reusing your own work without acknowledgment is dishonest.' },
        { scenario: 'A student paraphrases an idea from an article and includes an in-text citation. Is this plagiarism?', answer: 'no', explanation: 'Paraphrasing with proper citation is correct practice.' },
        { prompt: 'The best way to avoid plagiarism is to:', options: ['Take careful notes, use quotation marks for exact words, and always cite sources', 'Only use your own ideas', 'Avoid all research'], answer: 'Take careful notes, use quotation marks for exact words, and always cite sources', rule: 'Careful note-taking and consistent citation prevent plagiarism.' },
        { prompt: 'Which citation format is standard for middle school ELA?', options: ['MLA', 'Chicago', 'IEEE'], answer: 'MLA', rule: 'MLA (Modern Language Association) is the standard for ELA courses.' },
      ],
    },
    'evidence-literary-8': {
      items: [
        { prompt: 'Grade 8 literary analysis should include:', options: ['Complex claims supported by well-integrated textual evidence', 'A simple plot summary', 'Only personal opinions'], answer: 'Complex claims supported by well-integrated textual evidence', rule: 'Grade 8 analysis goes beyond summary to argumentation.' },
        { prompt: 'How should you handle a long quote (more than 3 lines) in an essay?', options: ['Use a block quote format — indent and omit quotation marks', 'Just put it in regular quotation marks', 'Never use long quotes'], answer: 'Use a block quote format — indent and omit quotation marks', rule: 'Long quotes follow block quote formatting rules.' },
        { prompt: 'An effective literary analysis thesis for grade 8:', options: ['Makes an arguable claim about theme, craft, or meaning', 'States an obvious fact', 'Summarizes the plot'], answer: 'Makes an arguable claim about theme, craft, or meaning', rule: 'Strong theses are arguable and analytical.' },
        { prompt: 'When drawing evidence from fiction, you can analyze:', options: ['Character development, themes, symbolism, and author craft', 'Only the setting', 'Only dialogue'], answer: 'Character development, themes, symbolism, and author craft', rule: 'Literary evidence encompasses many elements of the text.' },
        { prompt: 'What makes an analysis "grade 8 level"?', options: ['It connects evidence to larger themes and considers how elements work together', 'It uses bigger words', 'It is longer than grade 7 work'], answer: 'It connects evidence to larger themes and considers how elements work together', rule: 'Grade 8 analysis shows sophisticated thinking about texts.' },
        { prompt: 'An ellipsis (...) in a quote indicates:', options: ['Words have been omitted from the original', 'The sentence is unfinished', 'The writer is unsure'], answer: 'Words have been omitted from the original', rule: 'Ellipses show where you cut text from a quote for relevance.' },
      ],
    },
    'evidence-informational-8': {
      items: [
        { prompt: 'Grade 8 informational writing should:', options: ['Integrate evidence from multiple authoritative sources with analysis', 'Use only one source', 'Rely on personal anecdotes'], answer: 'Integrate evidence from multiple authoritative sources with analysis', rule: 'Grade 8 requires multi-source synthesis and analysis.' },
        { prompt: 'When sources disagree, your writing should:', options: ['Acknowledge the disagreement and analyze possible reasons', 'Pick one side only', 'Avoid the topic entirely'], answer: 'Acknowledge the disagreement and analyze possible reasons', rule: 'Addressing contradictions shows critical thinking.' },
        { prompt: 'A counterclaim in an informational argument is:', options: ['An opposing viewpoint that you address and respond to', 'A mistake in your research', 'An extra thesis statement'], answer: 'An opposing viewpoint that you address and respond to', rule: 'Addressing counterclaims strengthens your argument.' },
        { prompt: 'What is an authoritative source?', options: ['One written by a credible expert or organization with relevant expertise', 'Any source you find online', 'A source that agrees with you'], answer: 'One written by a credible expert or organization with relevant expertise', rule: 'Authoritative sources have verifiable expertise and credibility.' },
        { prompt: 'Advanced search strategies include:', options: ['Using Boolean operators, domain filters, and database-specific tools', 'Searching only one keyword', 'Using only Google'], answer: 'Using Boolean operators, domain filters, and database-specific tools', rule: 'Advanced strategies help find more relevant, credible sources.' },
        { prompt: 'How should you assess the usefulness of a source?', options: ['Consider whether it directly addresses your research question with reliable information', 'Check if it is the first search result', 'See if it has pictures'], answer: 'Consider whether it directly addresses your research question with reliable information', rule: 'Usefulness depends on relevance, credibility, and depth.' },
      ],
    },
    'evaluate-media-advantages': {
      items: [
        { prompt: 'What does it mean to evaluate the "motives" behind media?', options: ['Determine whether the purpose is social, commercial, or political', 'Check how long the media is', 'See if it has good graphics'], answer: 'Determine whether the purpose is social, commercial, or political', rule: 'Understanding motives reveals hidden purposes in media.' },
        { prompt: 'A product review video by someone who was paid by the company is an example of:', options: ['Commercial motive — potential bias due to financial relationship', 'Objective reporting', 'Academic research'], answer: 'Commercial motive — potential bias due to financial relationship', rule: 'Financial relationships can create bias in media.' },
        { prompt: 'What advantage does video have over text for presenting information?', options: ['It can show real events, facial expressions, and tone of voice', 'It is always more accurate', 'It is shorter'], answer: 'It can show real events, facial expressions, and tone of voice', rule: 'Each medium has unique strengths for conveying information.' },
        { prompt: 'What advantage does text have over video?', options: ['Readers can control pacing, re-read, and analyze carefully', 'Text is always more trustworthy', 'Text has more pictures'], answer: 'Readers can control pacing, re-read, and analyze carefully', rule: 'Text allows for self-paced, careful analysis.' },
        { prompt: 'A political advertisement uses emotional music and powerful images. This is an example of:', options: ['Persuasive techniques designed to influence the audience', 'Objective reporting', 'Educational content'], answer: 'Persuasive techniques designed to influence the audience', rule: 'Media techniques are used to shape audience response.' },
        { prompt: 'When evaluating media, "what is omitted" helps you understand:', options: ['What the creator chose to leave out and why', 'How long the media should be', 'Who the creator\'s friends are'], answer: 'What the creator chose to leave out and why', rule: 'What is left out can be as important as what is included.' },
        { prompt: 'Sensationalism in media is when:', options: ['Information is exaggerated to attract attention', 'Facts are carefully verified', 'Multiple perspectives are included'], answer: 'Information is exaggerated to attract attention', rule: 'Sensationalism prioritizes attention over accuracy.' },
        { prompt: 'Framing bias occurs when:', options: ['The same facts are presented in a way that influences perception', 'An article is placed in a picture frame', 'A source uses MLA format'], answer: 'The same facts are presented in a way that influences perception', rule: 'Framing shapes how audiences interpret information.' },
      ],
    },
  },
};

// ── Citation Exercise Bank ──

const CITATION_EXERCISES = [
  { type: 'book', info: 'Author: Jane Smith. Title: Ocean Worlds. Publisher: Sea Press. Year: 2023.', answer: 'Smith, Jane. Ocean Worlds. Sea Press, 2023.', rule: 'Book MLA: Last, First. Title. Publisher, Year.' },
  { type: 'website', info: 'Author: John Lee. Article: "Rising Tides." Website: Science Daily. Date: 15 Mar. 2025. URL: www.example.com.', answer: 'Lee, John. "Rising Tides." Science Daily, 15 Mar. 2025, www.example.com.', rule: 'Website MLA: Author. "Article." Website, Date, URL.' },
  { type: 'book', info: 'Author: Maria Garcia. Title: The Digital Age. Publisher: Tech Books. Year: 2024.', answer: 'Garcia, Maria. The Digital Age. Tech Books, 2024.', rule: 'Book MLA: Last, First. Title. Publisher, Year.' },
  { type: 'website', info: 'Author: none. Article: "Water Conservation Tips." Website: EPA.gov. Date: 10 Jan. 2025. URL: www.epa.gov/water.', answer: '"Water Conservation Tips." EPA.gov, 10 Jan. 2025, www.epa.gov/water.', rule: 'No author: start with article title in quotes.' },
  { type: 'article', info: 'Author: Kai Patel. Article: "Sleep and Teens." Publication: Health Weekly. Date: 5 May 2024. Pages: 12-15.', answer: 'Patel, Kai. "Sleep and Teens." Health Weekly, 5 May 2024, pp. 12-15.', rule: 'Article MLA: Author. "Title." Publication, Date, pages.' },
  { type: 'video', info: 'Title: "How Volcanoes Erupt." Platform: YouTube. Uploader: SciShow. Date: 20 Feb. 2025. URL: www.youtube.com/watch123.', answer: '"How Volcanoes Erupt." YouTube, uploaded by SciShow, 20 Feb. 2025, www.youtube.com/watch123.', rule: 'Video MLA: "Title." Platform, uploaded by User, Date, URL.' },
];

// ── Paraphrase vs Plagiarism Exercise Bank ──

const PARAPHRASE_EXERCISES = [
  { original: 'Climate change is the defining challenge of our era, requiring immediate action from governments worldwide.', good_paraphrase: 'The most critical issue facing the world today is climate change, which demands urgent government response globally (Smith 42).', bad_paraphrase: 'Climate change is the defining challenge of our time, needing immediate action from governments around the world.', rule: 'Good paraphrasing changes both words AND sentence structure while keeping the meaning.' },
  { original: 'Social media has fundamentally altered how young people communicate, creating both opportunities and risks.', good_paraphrase: 'The way teenagers interact has been transformed by platforms like Instagram and TikTok, opening doors for connection while also introducing dangers (Jones 18).', bad_paraphrase: 'Social media has fundamentally changed how young people talk, creating both opportunities and dangers.', rule: 'Swapping a few synonyms while keeping the structure is still plagiarism.' },
  { original: 'Recycling programs in schools have shown a 30 percent reduction in waste over five years.', good_paraphrase: 'Over a five-year period, schools with recycling initiatives cut their waste output by nearly a third (Green 7).', bad_paraphrase: 'Recycling programs in schools have shown a thirty percent reduction in waste over 5 years.', rule: 'Changing numbers from digits to words is not real paraphrasing.' },
  { original: 'Access to clean water remains one of the most pressing global health issues.', good_paraphrase: 'Around the world, the availability of safe drinking water continues to be a major public health concern (WHO 3).', bad_paraphrase: 'Access to clean water is still one of the most urgent global health problems.', rule: 'Effective paraphrasing significantly restructures the original while preserving meaning.' },
];

// ── Media Analysis Exercise Bank ──

const MEDIA_ANALYSIS_EXERCISES = [
  { media_type: 'advertisement', description: 'A cereal commercial shows a happy family eating breakfast together while upbeat music plays. The tagline says "Start every morning right."', question: 'What technique is being used to sell the product?', answer: 'emotional appeal', options: ['emotional appeal', 'scientific evidence', 'expert testimony'], explanation: 'The ad associates the product with family happiness rather than providing factual information.' },
  { media_type: 'news_headline', description: 'Headline: "SHOCKING Study Reveals TERRIFYING Truth About Screen Time!"', question: 'What type of media bias does this headline show?', answer: 'sensationalism', options: ['sensationalism', 'omission', 'authority'], explanation: 'Words like SHOCKING and TERRIFYING exaggerate to attract clicks.' },
  { media_type: 'infographic', description: 'An infographic shows ocean plastic pollution data with a bar chart, map, and key statistics. Published by National Geographic.', question: 'What makes this infographic credible?', answer: 'Published by a reputable organization with verifiable data', options: ['Published by a reputable organization with verifiable data', 'It has bright colors', 'It is on the internet'], explanation: 'National Geographic is a credible publisher, and the data can be verified.' },
  { media_type: 'social_media', description: 'A TikTok video claims that a certain food cures all diseases. It has 2 million views.', question: 'Why should you be skeptical of this claim?', answer: 'No scientific evidence; popularity does not equal accuracy', options: ['No scientific evidence; popularity does not equal accuracy', 'It has too many views', 'TikTok videos are always wrong'], explanation: 'Viral content is not vetted for accuracy; extraordinary claims need scientific support.' },
  { media_type: 'news_article', description: 'An article about a new school policy quotes only parents who oppose it. No supporters or school officials are quoted.', question: 'What type of bias is present?', answer: 'selection bias', options: ['selection bias', 'sensationalism', 'framing'], explanation: 'Only presenting one perspective is selection bias through omission of other viewpoints.' },
  { media_type: 'documentary', description: 'A documentary about fast food uses dark lighting, ominous music, and close-ups of greasy food while narrating health statistics.', question: 'How do the filmmaking techniques influence the viewer?', answer: 'They create a negative emotional response to reinforce the health message', options: ['They create a negative emotional response to reinforce the health message', 'They are just artistic choices with no purpose', 'They make the food look appetizing'], explanation: 'Visual and audio techniques are deliberate choices that shape viewer perception.' },
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
  // Check skill-specific banks first
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };

  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);

  // Multiple-choice with prompt/options/answer
  if (selected[0].prompt !== undefined && selected[0].options !== undefined && selected[0].answer !== undefined) {
    return { type: 'multiple-choice', skill, grade, count: selected.length, instruction: 'Choose the best answer.', items: selected.map(i => ({ prompt: i.prompt, options: i.options, answer: i.answer, rule: i.rule || '' })) };
  }
  // Scenario-based (plagiarism yes/no)
  if (selected[0].scenario !== undefined && selected[0].answer !== undefined) {
    return { type: 'scenario-judgment', skill, grade, count: selected.length, instruction: 'Is this plagiarism? Answer yes or no.', items: selected.map(i => ({ prompt: i.scenario, answer: i.answer, explanation: i.explanation || '' })) };
  }
  // Mixed items (some prompts, some scenarios) — handle the avoid-plagiarism mixed bank
  const mcItems = selected.filter(i => i.prompt !== undefined);
  const scItems = selected.filter(i => i.scenario !== undefined);
  if (mcItems.length > 0 || scItems.length > 0) {
    const formatted = selected.map(i => {
      if (i.prompt) return { type: 'multiple-choice', prompt: i.prompt, options: i.options, answer: i.answer, rule: i.rule || '' };
      if (i.scenario) return { type: 'scenario-judgment', prompt: i.scenario, answer: i.answer, explanation: i.explanation || '' };
      return i;
    });
    return { type: 'mixed', skill, grade, count: formatted.length, instruction: 'Answer each question.', items: formatted };
  }

  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function generateCitationExercise(count = 3) {
  const selected = pick(CITATION_EXERCISES, count);
  return { type: 'citation', count: selected.length, instruction: 'Write the MLA citation for this source.', items: selected.map(i => ({ prompt: i.info, answer: i.answer, sourceType: i.type, rule: i.rule })) };
}

function generateParaphraseExercise(count = 2) {
  const selected = pick(PARAPHRASE_EXERCISES, count);
  return { type: 'paraphrase-judgment', count: selected.length, instruction: 'Identify which paraphrase is acceptable and which is plagiarism.', items: selected.map(i => ({ original: i.original, optionA: i.good_paraphrase, optionB: i.bad_paraphrase, answer: 'A', rule: i.rule })) };
}

function generateMediaAnalysisExercise(count = 3) {
  const selected = pick(MEDIA_ANALYSIS_EXERCISES, count);
  return { type: 'media-analysis', count: selected.length, instruction: 'Analyze the media example and choose the best answer.', items: selected.map(i => ({ mediaType: i.media_type, description: i.description, question: i.question, options: i.options, answer: i.answer, explanation: i.explanation })) };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
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

  generateCitationExercise(count = 3) { return generateCitationExercise(count); }

  generateParaphraseExercise(count = 2) { return generateParaphraseExercise(count); }

  generateMediaAnalysisExercise(count = 3) { return generateMediaAnalysisExercise(count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const citation = generateCitationExercise(1);
    return {
      studentId: id, grade, targetSkill: target, exercise, bonusCitation: citation,
      lessonPlan: {
        warmup: 'Review a concept from the previous session or evaluate a quick source.',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Use this research or media literacy skill in your own project.',
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
        if (skill === 'citation') { out(rm.generateCitationExercise(3)); break; }
        if (skill === 'paraphrase') { out(rm.generateParaphraseExercise(2)); break; }
        if (skill === 'media-analysis') { out(rm.generateMediaAnalysisExercise(3)); break; }
        const grade = loadProfile(id).grade || 'grade-6';
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
      default: out({ usage: 'node research-media.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS), specialExercises: ['citation','paraphrase','media-analysis'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
