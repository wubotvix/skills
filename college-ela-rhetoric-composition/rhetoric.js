// College ELA Rhetoric & Composition Lab (Intro-Advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-rhetoric-composition');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'rhetorical-analysis': ['ethos-pathos-logos', 'rhetorical-situation'],
    'argumentation': ['thesis-statements', 'essay-structure'],
    'research-citation': ['mla-basics'],
  },
  'intermediate': {
    'rhetorical-analysis': ['style-analysis'],
    'argumentation': ['toulmin-argument', 'rogerian-argument'],
    'writing-process': ['synthesis-writing'],
    'style-voice': ['voice-development'],
    'research-citation': ['apa-basics'],
  },
  'advanced': {
    'rhetorical-analysis': ['stasis-theory'],
    'argumentation': ['writing-across-disciplines'],
    'writing-process': ['genre-theory'],
    'research-citation': ['chicago-style'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'ethos-pathos-logos': {
      type: 'appeal-id', instruction: 'Identify the rhetorical appeal used in the passage.',
      items: [
        { passage: '"As a surgeon with 30 years of experience, I can assure you this procedure is safe."', question: 'What appeal is primarily used?', answer: 'Ethos', options: ['Ethos', 'Pathos', 'Logos', 'Kairos'] },
        { passage: '"Every night, children in this city go to bed hungry. Their hollow eyes haunt the doorways of our finest restaurants."', question: 'What appeal is primarily used?', answer: 'Pathos', options: ['Pathos', 'Ethos', 'Logos', 'Kairos'] },
        { passage: '"Studies show that students who sleep 8 hours perform 23% better on exams than those who sleep fewer than 6."', question: 'What appeal is primarily used?', answer: 'Logos', options: ['Logos', 'Ethos', 'Pathos', 'Kairos'] },
        { passage: '"The American Medical Association, the WHO, and 97% of peer-reviewed studies all confirm these findings."', question: 'What appeal is primarily used?', answer: 'Ethos', options: ['Ethos', 'Logos', 'Pathos', 'Kairos'] },
        { passage: '"Imagine losing your home, your belongings, everything you\'ve built over a lifetime, in a single afternoon."', question: 'What appeal is primarily used?', answer: 'Pathos', options: ['Pathos', 'Logos', 'Ethos', 'Kairos'] },
        { passage: '"If we reduce carbon emissions by 40%, global temperatures will stabilize within two decades, according to climate models."', question: 'What appeal is primarily used?', answer: 'Logos', options: ['Logos', 'Pathos', 'Ethos', 'Kairos'] },
      ],
    },
    'rhetorical-situation': {
      type: 'appeal-id', instruction: 'Identify the element of the rhetorical situation described.',
      items: [
        { passage: 'A senator delivers a speech on the Senate floor urging colleagues to vote for a climate bill before the recess deadline.', question: 'What is the "exigence" in this situation?', answer: 'The urgency of the upcoming recess deadline and the need for climate action', options: ['The urgency of the upcoming recess deadline and the need for climate action', 'The senator\'s personal beliefs', 'The physical setting of the Senate', 'The senator\'s party affiliation'] },
        { passage: 'A university president writes an open letter to alumni after a campus controversy, seeking to reassure donors and maintain institutional reputation.', question: 'Who is the primary audience?', answer: 'Alumni and donors', options: ['Alumni and donors', 'Current students', 'Faculty', 'The general public'] },
        { passage: 'A food blogger writes a restaurant review for an online magazine read by urban professionals interested in dining trends.', question: 'What constraints shape this rhetorical situation?', answer: 'The genre conventions of food criticism, the audience\'s expectations, and the publication\'s editorial standards', options: ['The genre conventions of food criticism, the audience\'s expectations, and the publication\'s editorial standards', 'The blogger\'s appetite', 'The restaurant\'s menu prices', 'The weather on the day of the visit'] },
        { passage: 'Martin Luther King Jr. delivered the "I Have a Dream" speech at the March on Washington in August 1963.', question: 'How does kairos function in this rhetorical situation?', answer: 'The timing aligned with the Civil Rights Movement\'s momentum and national attention on racial justice', options: ['The timing aligned with the Civil Rights Movement\'s momentum and national attention on racial justice', 'August is a good month for speeches', 'Washington D.C. has good acoustics', 'King was a scheduled speaker'] },
        { passage: 'A student writes a lab report for a chemistry professor following APA format guidelines.', question: 'What is the rhetorical purpose of the genre conventions?', answer: 'To demonstrate competence within the discourse community of science and meet the professor\'s evaluative criteria', options: ['To demonstrate competence within the discourse community of science and meet the professor\'s evaluative criteria', 'To make the report look professional', 'APA is the only acceptable format', 'The student enjoys formatting'] },
        { passage: 'An advertisement for a luxury car features sweeping mountain roads, a well-dressed driver, and the tagline "Arrive in distinction."', question: 'How does the ad construct its audience?', answer: 'It interpellates viewers as affluent individuals who value status and aesthetic experience', options: ['It interpellates viewers as affluent individuals who value status and aesthetic experience', 'It targets all car buyers equally', 'It is aimed at mountain climbers', 'It targets professional drivers'] },
      ],
    },
    'thesis-statements': {
      type: 'thesis-eval', instruction: 'Evaluate the thesis statement.',
      items: [
        { passage: '"Social media is bad."', question: 'What is the main weakness of this thesis?', answer: 'It is too vague and lacks a specific claim, scope, or reasoning', options: ['It is too vague and lacks a specific claim, scope, or reasoning', 'It is too long', 'It is too controversial', 'It uses incorrect grammar'] },
        { passage: '"While social media platforms increase connectivity, their algorithmic amplification of sensational content undermines democratic discourse by creating ideological echo chambers."', question: 'What makes this an effective thesis?', answer: 'It takes a specific, arguable position with a clear causal claim and defined scope', options: ['It takes a specific, arguable position with a clear causal claim and defined scope', 'It is long enough', 'It mentions technology', 'It uses sophisticated vocabulary'] },
        { passage: '"In this essay, I will discuss the causes of World War I."', question: 'What is the main weakness of this thesis?', answer: 'It announces a topic rather than making an arguable claim', options: ['It announces a topic rather than making an arguable claim', 'It is about history', 'World War I is too old a topic', 'It is grammatically incorrect'] },
        { passage: '"The sky is blue."', question: 'Why does this fail as a thesis statement?', answer: 'It states an observable fact rather than an arguable claim that requires evidence and reasoning', options: ['It states an observable fact rather than an arguable claim that requires evidence and reasoning', 'It is too short', 'It is about science', 'It is not interesting'] },
        { passage: '"Although renewable energy requires significant upfront investment, transitioning to solar and wind power will reduce long-term energy costs and carbon emissions, making it economically and environmentally imperative."', question: 'What structural feature strengthens this thesis?', answer: 'The concession clause ("Although...") acknowledges a counterargument, demonstrating nuance', options: ['The concession clause ("Although...") acknowledges a counterargument, demonstrating nuance', 'It mentions specific energy sources', 'It is exactly one sentence', 'It uses the word "imperative"'] },
        { passage: '"There are many pros and cons to standardized testing."', question: 'What is the main weakness of this thesis?', answer: 'It is a fence-sitting statement that takes no position and could not be argued for or against', options: ['It is a fence-sitting statement that takes no position and could not be argued for or against', 'It mentions standardized testing', 'It is too balanced', 'It uses informal language'] },
      ],
    },
    'essay-structure': {
      type: 'argument-structure', instruction: 'Identify the structural element or organizational pattern.',
      items: [
        { passage: 'An essay begins by describing a specific patient\'s struggle with healthcare costs, then broadens to discuss national healthcare policy, and concludes by returning to the patient.', question: 'What organizational pattern is this?', answer: 'Funnel structure (anecdotal frame with a specific-to-general-to-specific movement)', options: ['Funnel structure (anecdotal frame with a specific-to-general-to-specific movement)', 'Chronological order', 'Compare and contrast', 'Problem-solution'] },
        { passage: 'A paragraph begins: "Furthermore, the economic impact extends beyond local communities." It follows a paragraph about social effects.', question: 'What is the function of "Furthermore"?', answer: 'It is an additive transition signaling an additional, parallel point', options: ['It is an additive transition signaling an additional, parallel point', 'It introduces a counterargument', 'It signals a conclusion', 'It introduces an example'] },
        { passage: 'An essay presents Argument A fully, then presents Argument B fully, then compares the two.', question: 'What organizational pattern is this?', answer: 'Block (subject-by-subject) comparison', options: ['Block (subject-by-subject) comparison', 'Point-by-point comparison', 'Chronological order', 'Cause and effect'] },
        { passage: 'The conclusion of an essay restates the thesis in new language, synthesizes key points, and ends with a call to action.', question: 'What structural function does this conclusion serve?', answer: 'It provides closure while extending the argument\'s implications beyond the essay', options: ['It provides closure while extending the argument\'s implications beyond the essay', 'It introduces new evidence', 'It repeats the introduction verbatim', 'It summarizes each paragraph individually'] },
        { passage: 'A body paragraph begins with a claim, provides a quote from a source, explains how the quote supports the claim, and connects back to the thesis.', question: 'What paragraph structure is this?', answer: 'PIE (Point, Illustration, Explanation) or claim-evidence-analysis', options: ['PIE (Point, Illustration, Explanation) or claim-evidence-analysis', 'Narrative paragraph', 'Descriptive paragraph', 'Stream of consciousness'] },
        { passage: 'An essay discusses the causes of urban sprawl in paragraphs 2-4, then the effects in paragraphs 5-7.', question: 'What organizational pattern is this?', answer: 'Cause and effect', options: ['Cause and effect', 'Compare and contrast', 'Chronological order', 'Classification'] },
      ],
    },
    'mla-basics': {
      type: 'citation-format', instruction: 'Identify the correct MLA citation practice.',
      items: [
        { passage: 'A student writes: Smith argues that "rhetoric is the art of persuasion" (42).', question: 'Is the in-text citation correctly formatted in MLA?', answer: 'Yes: author named in signal phrase, page number in parentheses, period after closing parenthesis', options: ['Yes: author named in signal phrase, page number in parentheses, period after closing parenthesis', 'No: the page number should come before the quote', 'No: the author name should be in parentheses too', 'No: MLA does not use page numbers'] },
        { passage: 'Works Cited entry: Gladwell, Malcolm. Outliers: The Story of Success. Little, Brown, 2008.', question: 'Is this Works Cited entry correctly formatted?', answer: 'Yes: author (last, first), italicized title, publisher, year', options: ['Yes: author (last, first), italicized title, publisher, year', 'No: the title should be in quotes', 'No: the date should come before the publisher', 'No: the city of publication is missing'] },
        { passage: 'A student includes a block quote (more than 4 lines of prose) indented 0.5 inches from the left margin, with no quotation marks.', question: 'Is this block quote formatted correctly in MLA?', answer: 'Yes: MLA block quotes are indented and do not use quotation marks', options: ['Yes: MLA block quotes are indented and do not use quotation marks', 'No: block quotes must have quotation marks', 'No: the indent should be 1 inch', 'No: MLA does not allow block quotes'] },
        { passage: 'In-text citation for a source with no author: ("Impact of Climate Change" 15).', question: 'Is this correct MLA practice for a source with no identified author?', answer: 'Yes: use a shortened version of the title in quotes with the page number', options: ['Yes: use a shortened version of the title in quotes with the page number', 'No: use "Anonymous" as the author', 'No: omit the citation entirely', 'No: use the publisher name instead'] },
        { passage: 'A student paraphrases an idea from page 87 of Jones\'s book and writes: (Jones 87).', question: 'Is a citation needed for a paraphrase in MLA?', answer: 'Yes: paraphrases require in-text citations with author and page number, just like direct quotes', options: ['Yes: paraphrases require in-text citations with author and page number, just like direct quotes', 'No: only direct quotes need citations', 'No: paraphrases are common knowledge', 'Yes, but only the author name is needed'] },
        { passage: 'The Works Cited page lists sources alphabetically by author\'s last name, double-spaced, with hanging indentation.', question: 'Is this formatting correct?', answer: 'Yes: MLA Works Cited uses alphabetical order, double spacing, and hanging indentation', options: ['Yes: MLA Works Cited uses alphabetical order, double spacing, and hanging indentation', 'No: sources should be numbered', 'No: sources should be listed by publication date', 'No: single spacing is required'] },
      ],
    },
  },
  'intermediate': {
    'toulmin-argument': {
      type: 'argument-structure', instruction: 'Identify the Toulmin argument component.',
      items: [
        { passage: '"Students should be allowed to use laptops in class because digital note-taking improves retention for many learners."', question: 'Identify the claim and the grounds.', answer: 'Claim: laptops should be allowed; Grounds: digital note-taking improves retention', options: ['Claim: laptops should be allowed; Grounds: digital note-taking improves retention', 'Claim: retention is important; Grounds: laptops exist', 'Claim: note-taking is good; Grounds: students want laptops', 'Claim: classes should use technology; Grounds: laptops are cheap'] },
        { passage: '"Since effective learning tools should be available to students (warrant), and research shows digital note-taking helps retention (grounds), laptops should be permitted (claim)."', question: 'What is the warrant in this argument?', answer: 'Effective learning tools should be available to students', options: ['Effective learning tools should be available to students', 'Laptops should be permitted', 'Digital note-taking helps retention', 'Research is always correct'] },
        { passage: '"Unless the laptops prove to be a significant distraction that outweighs the learning benefits."', question: 'What Toulmin component is this?', answer: 'Rebuttal (a condition that would defeat the claim)', options: ['Rebuttal (a condition that would defeat the claim)', 'Warrant', 'Backing', 'Qualifier'] },
        { passage: '"Laptops should probably be allowed in most classroom settings."', question: 'What do the words "probably" and "most" function as?', answer: 'Qualifiers (limiting the strength and scope of the claim)', options: ['Qualifiers (limiting the strength and scope of the claim)', 'Grounds', 'Warrants', 'Rebuttals'] },
        { passage: '"Educational psychology research consistently demonstrates that multimodal engagement enhances learning outcomes (Smith 2019; Jones 2020; Lee 2021)."', question: 'What Toulmin component does this evidence serve as?', answer: 'Backing (support for the warrant that effective tools should be available)', options: ['Backing (support for the warrant that effective tools should be available)', 'The claim itself', 'A rebuttal', 'A qualifier'] },
        { passage: 'A complete Toulmin argument includes claim, grounds, warrant, backing, qualifier, and rebuttal.', question: 'Why is the Toulmin model useful for rhetorical analysis?', answer: 'It maps the logical structure of real-world arguments, including their limitations and conditions', options: ['It maps the logical structure of real-world arguments, including their limitations and conditions', 'It is the only valid argument form', 'It eliminates the need for evidence', 'It guarantees persuasion'] },
      ],
    },
    'rogerian-argument': {
      type: 'argument-structure', instruction: 'Identify the Rogerian argument strategy.',
      items: [
        { passage: '"Those who oppose universal healthcare raise legitimate concerns about government overreach, increased taxation, and potential decreases in care quality."', question: 'What Rogerian strategy is demonstrated?', answer: 'Acknowledging the opposing position\'s validity to build common ground', options: ['Acknowledging the opposing position\'s validity to build common ground', 'Refuting the opposition aggressively', 'Ignoring the counterargument', 'Appealing to emotion'] },
        { passage: '"Both supporters and opponents of school uniforms share the goal of creating an environment where students can focus on learning without unnecessary social pressure."', question: 'What Rogerian element is this?', answer: 'Identifying shared values or common ground between opposing positions', options: ['Identifying shared values or common ground between opposing positions', 'Presenting evidence for one side', 'Making an emotional appeal', 'Stating a thesis'] },
        { passage: '"A compromise might involve offering a hybrid model: uniforms on regular school days with designated free-dress days for self-expression."', question: 'What Rogerian element is this?', answer: 'Proposing a mutually beneficial solution that incorporates both perspectives', options: ['Proposing a mutually beneficial solution that incorporates both perspectives', 'Conceding defeat to the opposition', 'Presenting a straw man argument', 'Making an ultimatum'] },
        { passage: 'The Rogerian approach is particularly effective when the audience is hostile or when the issue is deeply polarizing.', question: 'Why is this the case?', answer: 'Because it reduces defensiveness by demonstrating empathy and respect for the audience\'s position before introducing an alternative view', options: ['Because it reduces defensiveness by demonstrating empathy and respect for the audience\'s position before introducing an alternative view', 'Because hostile audiences prefer weak arguments', 'Because it avoids stating a position', 'Because it uses more evidence than other approaches'] },
        { passage: 'Unlike classical argumentation, the Rogerian model delays the writer\'s thesis until after presenting and validating the opposing viewpoint.', question: 'What is the rhetorical effect of this delayed thesis?', answer: 'It creates goodwill and receptivity before the audience encounters the writer\'s position', options: ['It creates goodwill and receptivity before the audience encounters the writer\'s position', 'It confuses the reader', 'It weakens the argument', 'It is simply a formatting preference'] },
        { passage: '"I understand that many gun owners view Second Amendment rights as fundamental to personal liberty, and I respect that deeply held conviction."', question: 'What Rogerian principle does this opening exemplify?', answer: 'Empathic listening: genuinely representing the opposing view before responding', options: ['Empathic listening: genuinely representing the opposing view before responding', 'Sarcasm disguised as agreement', 'An ad hominem attack', 'An appeal to authority'] },
      ],
    },
    'synthesis-writing': {
      type: 'argument-structure', instruction: 'Identify the synthesis writing technique.',
      items: [
        { passage: 'A student paper draws on four sources: two supporting stricter emissions standards and two advocating market-based solutions. The student argues that effective climate policy requires elements of both approaches.', question: 'What type of synthesis is this?', answer: 'Argument-driven synthesis that creates a new position from multiple sources', options: ['Argument-driven synthesis that creates a new position from multiple sources', 'A simple summary of four articles', 'A compare-and-contrast essay', 'A literature review'] },
        { passage: '"While Johnson (2019) emphasizes the economic costs of regulation, Patel (2020) demonstrates that these costs are offset by long-term healthcare savings. Together, these findings suggest a more nuanced cost-benefit analysis is needed."', question: 'What synthesis technique is demonstrated?', answer: 'Putting sources in conversation with each other to generate a new insight', options: ['Putting sources in conversation with each other to generate a new insight', 'Summarizing each source separately', 'Choosing the better source', 'Ignoring contradictory evidence'] },
        { passage: 'The student organizes her synthesis paper by theme (economic impact, environmental impact, social equity) rather than by source.', question: 'Why is thematic organization preferable in synthesis writing?', answer: 'It demonstrates analytical thinking by showing how multiple sources illuminate each theme, rather than merely reporting what each source says', options: ['It demonstrates analytical thinking by showing how multiple sources illuminate each theme, rather than merely reporting what each source says', 'It is shorter', 'It avoids the need for citations', 'It is the only acceptable organization'] },
        { passage: 'A synthesis paragraph uses Smith for statistical evidence, Jones for a theoretical framework, and Lee for a case study, all supporting a single analytical point.', question: 'What makes this effective synthesis?', answer: 'Multiple sources serve different evidentiary functions (data, theory, example) to support the writer\'s own claim', options: ['Multiple sources serve different evidentiary functions (data, theory, example) to support the writer\'s own claim', 'Three sources are always better than one', 'The paragraph is long enough', 'The sources all agree with each other'] },
        { passage: '"The research on screen time and adolescent mental health reveals contradictory findings, suggesting that the relationship is mediated by factors such as content type and social context (Chen 2020; Rivera 2021; Okafor 2022)."', question: 'How does this sentence demonstrate synthesis?', answer: 'It identifies a pattern across sources (contradiction) and proposes an explanatory framework (mediating factors)', options: ['It identifies a pattern across sources (contradiction) and proposes an explanatory framework (mediating factors)', 'It lists three sources in a row', 'It disagrees with all the sources', 'It uses parenthetical citations'] },
        { passage: 'A student writes: "Source A says X. Source B says Y. Source C says Z." with no analytical connection between the summaries.', question: 'What synthesis problem does this demonstrate?', answer: '"Data dump" or "source parade": listing sources without analytical integration or a controlling idea', options: ['"Data dump" or "source parade": listing sources without analytical integration or a controlling idea', 'Effective use of multiple sources', 'Proper academic writing', 'A well-organized comparison'] },
      ],
    },
    'style-analysis': {
      type: 'appeal-id', instruction: 'Analyze the stylistic choices in the passage.',
      items: [
        { passage: '"He came. He saw. He conquered." (Veni, vidi, vici.)', question: 'What stylistic devices create the impact of this sentence?', answer: 'Asyndeton (omitting conjunctions), tricolon (three parallel clauses), and brevity', options: ['Asyndeton (omitting conjunctions), tricolon (three parallel clauses), and brevity', 'Polysyndeton and verbosity', 'Metaphor and simile', 'Passive voice and hedging'] },
        { passage: '"Ask not what your country can do for you; ask what you can do for your country." — Kennedy', question: 'What stylistic device structures this sentence?', answer: 'Chiasmus (ABBA reversal of grammatical structures)', options: ['Chiasmus (ABBA reversal of grammatical structures)', 'Parallelism only', 'Anaphora', 'Epistrophe'] },
        { passage: '"It was a bright cold day in April, and the clocks were striking thirteen." — Orwell', question: 'How does the style of this opening create unease?', answer: 'The matter-of-fact tone applied to an impossible detail (clocks striking thirteen) creates cognitive dissonance', options: ['The matter-of-fact tone applied to an impossible detail (clocks striking thirteen) creates cognitive dissonance', 'The sentence is too long', 'April is an unusual setting', 'The word "bright" is unexpected'] },
        { passage: 'Academic writing conventions typically favor the passive voice ("It was determined that...") over the active ("We determined that...").', question: 'What is the rhetorical function of passive voice in academic prose?', answer: 'It foregrounds the action or findings over the researcher, projecting objectivity and institutional authority', options: ['It foregrounds the action or findings over the researcher, projecting objectivity and institutional authority', 'It is grammatically superior', 'It makes writing more engaging', 'It is easier to write'] },
        { passage: '"We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender." — Churchill', question: 'What stylistic device dominates this passage?', answer: 'Anaphora (repetition of "we shall fight") building to a climactic final clause', options: ['Anaphora (repetition of "we shall fight") building to a climactic final clause', 'Understatement', 'Irony', 'Euphemism'] },
        { passage: 'A writer uses short, punchy sentences in an opening paragraph, then shifts to longer, more complex sentences as the argument develops.', question: 'What is the rhetorical effect of this sentence-length variation?', answer: 'Short sentences create urgency and capture attention; longer sentences develop complexity and nuance', options: ['Short sentences create urgency and capture attention; longer sentences develop complexity and nuance', 'The writer is inconsistent', 'Short sentences are always better', 'Sentence length has no effect on readers'] },
      ],
    },
    'voice-development': {
      type: 'appeal-id', instruction: 'Analyze how authorial voice is constructed through rhetorical choices.',
      items: [
        { passage: '"I came, I saw, I kicked its ass." — a student parody of Caesar', question: 'How does the writer develop a distinctive voice here?', answer: 'By subverting a well-known classical structure with colloquial register, creating a humorous, irreverent voice', options: ['By subverting a well-known classical structure with colloquial register, creating a humorous, irreverent voice', 'By copying Caesar exactly', 'By using formal academic language', 'By avoiding any stylistic choices'] },
        { passage: 'A student writes every sentence in the passive voice: "It was found that... It was observed that... It was concluded that..."', question: 'What voice problem does this demonstrate?', answer: 'The writer has erased their authorial presence entirely, producing flat, impersonal prose that lacks engagement', options: ['The writer has erased their authorial presence entirely, producing flat, impersonal prose that lacks engagement', 'This is ideal academic voice', 'Passive voice always improves writing', 'The student has a strong voice'] },
        { passage: '"Look. I know what the studies say. But here\'s the thing — studies don\'t live in my neighbourhood."', question: 'What creates the distinctive voice in this passage?', answer: 'Short declarative sentences, direct address, sentence fragments, and the shift from abstract evidence to personal experience', options: ['Short declarative sentences, direct address, sentence fragments, and the shift from abstract evidence to personal experience', 'Long complex sentences', 'Formal academic diction', 'Heavy use of citations'] },
        { passage: 'An op-ed writer consistently uses "we" and "our" when discussing national policy, even when stating personal opinions.', question: 'What rhetorical effect does this pronoun choice create?', answer: 'It builds solidarity and shared identity with readers, making the writer\'s position seem communal rather than individual', options: ['It builds solidarity and shared identity with readers, making the writer\'s position seem communal rather than individual', 'It is grammatically incorrect', 'It makes the writing vague', 'It is standard in all writing'] },
        { passage: 'A food writer describes a meal: "The risotto arrived wearing a crown of shaved truffle. It was absurdly, irresponsibly good."', question: 'What elements create this writer\'s voice?', answer: 'Personification, sensory precision, and unexpected adverbs that mix humor with genuine appreciation', options: ['Personification, sensory precision, and unexpected adverbs that mix humor with genuine appreciation', 'Objective, neutral description', 'Technical culinary terminology', 'Formal restaurant review conventions'] },
        { passage: 'Compare: "The policy failed" vs "The policy, despite its architects\' considerable enthusiasm, achieved nothing of substance — unless one counts the considerable entertainment it provided to its critics."', question: 'How do these sentences differ in voice?', answer: 'The first is neutral; the second uses irony, qualification, and wit to convey a more opinionated, engaging voice', options: ['The first is neutral; the second uses irony, qualification, and wit to convey a more opinionated, engaging voice', 'They say the same thing', 'The first is better because it is shorter', 'The second is too informal for any context'] },
      ],
    },
    'apa-basics': {
      type: 'citation-format', instruction: 'Identify the correct APA citation practice.',
      items: [
        { passage: 'In-text citation: (Smith, 2020, p. 45)', question: 'Is this APA in-text citation correctly formatted?', answer: 'Yes: APA uses author, year, and page number separated by commas', options: ['Yes: APA uses author, year, and page number separated by commas', 'No: the year should not be included', 'No: the page number should come first', 'No: APA does not use page numbers'] },
        { passage: 'Reference list entry: Johnson, M. R. (2019). The rhetoric of science. Oxford University Press.', question: 'Is this APA reference entry correctly formatted?', answer: 'Yes: author (last, initials), year in parentheses, italicized title in sentence case, publisher', options: ['Yes: author (last, initials), year in parentheses, italicized title in sentence case, publisher', 'No: the title should be in title case', 'No: the publisher city is missing', 'No: the title should be in quotes'] },
        { passage: 'A source has three authors. The student cites it as: (Lee, Chen, & Park, 2021) on first use.', question: 'Is this correct for current APA (7th edition)?', answer: 'No: APA 7th edition uses (Lee et al., 2021) for three or more authors from the first citation', options: ['No: APA 7th edition uses (Lee et al., 2021) for three or more authors from the first citation', 'Yes: all authors must be listed on first use', 'No: only the first author is ever listed', 'Yes: ampersand is always required'] },
        { passage: 'The student writes: According to Smith (2020), "rhetoric is fundamental to democratic participation" (p. 12).', question: 'Is this narrative citation formatted correctly in APA?', answer: 'Yes: author and year in the signal phrase, page number after the quote', options: ['Yes: author and year in the signal phrase, page number after the quote', 'No: the year should be at the end', 'No: narrative citations do not include years', 'No: the page number is not needed'] },
        { passage: 'APA reference list entries include a DOI (Digital Object Identifier) when available, formatted as a URL: https://doi.org/xxxxx', question: 'Why does APA require DOIs?', answer: 'DOIs provide a persistent, unique link to the exact source, improving retrieval and verification', options: ['DOIs provide a persistent, unique link to the exact source, improving retrieval and verification', 'DOIs are decorative', 'DOIs replace the need for author names', 'DOIs are only for online sources'] },
        { passage: 'The APA reference list is titled "References" (not "Works Cited" or "Bibliography") and is double-spaced with hanging indentation.', question: 'How does APA\'s reference list differ from MLA\'s Works Cited?', answer: 'APA includes publication year prominently, uses sentence case for titles, and the heading is "References" rather than "Works Cited"', options: ['APA includes publication year prominently, uses sentence case for titles, and the heading is "References" rather than "Works Cited"', 'They are formatted identically', 'APA uses single spacing', 'MLA includes DOIs but APA does not'] },
      ],
    },
  },
  'advanced': {
    'stasis-theory': {
      type: 'argument-structure', instruction: 'Apply stasis theory to the rhetorical situation.',
      items: [
        { passage: '"Did the event actually occur?" — In a courtroom, the defense argues that the alleged crime never took place.', question: 'What stasis question is at issue?', answer: 'Conjecture (fact): whether something happened', options: ['Conjecture (fact): whether something happened', 'Definition: what to call it', 'Quality: how serious it is', 'Policy: what to do about it'] },
        { passage: '"Is this act properly classified as self-defense or as assault?" — The parties agree the act occurred but disagree on its categorization.', question: 'What stasis question is at issue?', answer: 'Definition: what the act should be called', options: ['Definition: what the act should be called', 'Conjecture: whether it happened', 'Quality: its seriousness', 'Policy: what penalty to impose'] },
        { passage: '"Were there mitigating circumstances that reduce the severity of the offense?"', question: 'What stasis question is at issue?', answer: 'Quality: the seriousness or nature of the act given the circumstances', options: ['Quality: the seriousness or nature of the act given the circumstances', 'Conjecture: whether it happened', 'Definition: what to call it', 'Policy: what action to take'] },
        { passage: '"What should the university\'s policy be on AI-generated writing in academic submissions?"', question: 'What stasis question is at issue?', answer: 'Policy (procedure): what action or rule should be adopted', options: ['Policy (procedure): what action or rule should be adopted', 'Conjecture: whether AI writing exists', 'Definition: what counts as AI writing', 'Quality: whether AI writing is good'] },
        { passage: 'In a public debate about climate change, one side argues about whether warming is occurring, while the other argues about what policies to adopt. The debate is unproductive.', question: 'What does stasis theory explain about this impasse?', answer: 'The parties are arguing at different stasis levels (conjecture vs. policy) and must first agree on the factual question before policy can be discussed', options: ['The parties are arguing at different stasis levels (conjecture vs. policy) and must first agree on the factual question before policy can be discussed', 'Climate change is too complex to debate', 'Both sides need more evidence', 'The debate format is flawed'] },
        { passage: 'A rhetor analyzing a controversy uses stasis theory to determine which question is truly at issue, allowing her to focus her argument precisely.', question: 'What is the primary value of stasis theory for rhetorical invention?', answer: 'It helps identify the exact point of disagreement, preventing wasted argument on settled or irrelevant questions', options: ['It helps identify the exact point of disagreement, preventing wasted argument on settled or irrelevant questions', 'It guarantees the argument will be persuasive', 'It replaces the need for evidence', 'It is only useful in legal contexts'] },
      ],
    },
    'genre-theory': {
      type: 'argument-structure', instruction: 'Apply rhetorical genre theory to the scenario.',
      items: [
        { passage: 'Carolyn Miller argues that genres are "typified rhetorical actions based in recurrent situations" rather than fixed textual forms.', question: 'What is the significance of defining genres as social actions?', answer: 'It shifts focus from formal features to the social purposes genres serve, showing how they mediate community activity', options: ['It shifts focus from formal features to the social purposes genres serve, showing how they mediate community activity', 'It means genres are unimportant', 'It eliminates the need for genre conventions', 'It applies only to literary genres'] },
        { passage: 'A new employee learns to write the company\'s weekly status report by reading examples and receiving feedback, gradually mastering the genre\'s conventions.', question: 'What does this process illustrate about genre knowledge?', answer: 'Genre knowledge is acquired through situated practice within a discourse community, not just through explicit instruction', options: ['Genre knowledge is acquired through situated practice within a discourse community, not just through explicit instruction', 'The employee should have learned this in school', 'Status reports require no learning', 'Genre conventions are universal'] },
        { passage: 'The "five-paragraph essay" is widely taught in high schools but rarely appears in professional or academic writing beyond the classroom.', question: 'What does genre theory reveal about the five-paragraph essay?', answer: 'It is a pedagogical genre (a "school genre") whose conventions serve assessment purposes rather than genuine communicative ones', options: ['It is a pedagogical genre (a "school genre") whose conventions serve assessment purposes rather than genuine communicative ones', 'It is the ideal writing structure for all purposes', 'Professional writers secretly use it', 'It should be abolished entirely'] },
        { passage: 'When genres evolve — as when academic journal articles adopted structured abstracts and keyword listings — the changes reflect shifts in the community\'s values and practices.', question: 'What does genre evolution reveal?', answer: 'Genres are dynamic and historically situated; their changes index shifts in disciplinary values, technologies, and power relations', options: ['Genres are dynamic and historically situated; their changes index shifts in disciplinary values, technologies, and power relations', 'Genres never change', 'Changes are purely aesthetic', 'Only editors decide genre conventions'] },
        { passage: 'A student attempts to write a scientific research article but produces something that reads like a personal narrative essay, mixing "I felt" with data analysis.', question: 'What does genre theory call this kind of difficulty?', answer: 'Genre misrecognition or lack of genre awareness: the student applies the conventions of one genre to a situation calling for another', options: ['Genre misrecognition or lack of genre awareness: the student applies the conventions of one genre to a situation calling for another', 'The student is a bad writer', 'Personal narratives are never appropriate in science', 'The student should avoid writing altogether'] },
        { passage: 'Blogs, tweets, and TikTok videos can be analyzed as emergent digital genres with their own evolving conventions, audiences, and social functions.', question: 'How does genre theory accommodate digital communication?', answer: 'It treats digital forms as legitimate genres shaped by technological affordances, platform constraints, and the social actions they enable', options: ['It treats digital forms as legitimate genres shaped by technological affordances, platform constraints, and the social actions they enable', 'Digital communication is not serious enough for genre analysis', 'Only print texts can be genres', 'Social media does not have conventions'] },
      ],
    },
    'writing-across-disciplines': {
      type: 'argument-structure', instruction: 'Analyze how writing conventions differ across academic disciplines.',
      items: [
        { passage: 'In the sciences, the IMRAD structure (Introduction, Methods, Results, and Discussion) is standard for research articles.', question: 'Why does this structure dominate scientific writing?', answer: 'It mirrors the logic of the scientific method and enables efficient replication and evaluation by the discourse community', options: ['It mirrors the logic of the scientific method and enables efficient replication and evaluation by the discourse community', 'Scientists are not creative enough for other structures', 'It is the only possible way to organize information', 'Editors mandate it arbitrarily'] },
        { passage: 'A history paper relies heavily on primary source analysis and footnotes, while a psychology paper uses statistical analysis and APA-formatted references.', question: 'What does this difference reveal about disciplinary knowledge-making?', answer: 'Each discipline has distinct evidentiary standards reflecting its epistemology: history values archival evidence and interpretive argument, psychology values empirical data and replicability', options: ['Each discipline has distinct evidentiary standards reflecting its epistemology: history values archival evidence and interpretive argument, psychology values empirical data and replicability', 'History is less rigorous than psychology', 'Psychology is less creative than history', 'The differences are arbitrary'] },
        { passage: 'Engineering reports prioritize conciseness, use headings and bullet points extensively, and often include technical specifications and diagrams.', question: 'How do these conventions reflect the discipline\'s values?', answer: 'Engineering values efficiency, precision, and actionable information; the genre conventions facilitate quick decision-making by practitioners', options: ['Engineering values efficiency, precision, and actionable information; the genre conventions facilitate quick decision-making by practitioners', 'Engineers cannot write prose', 'Bullet points are always superior to paragraphs', 'These conventions are identical to humanities writing'] },
        { passage: 'A student trained in literary analysis writes a sociology paper with close readings of individual quotes but no statistical data or systematic methodology.', question: 'What WAC/WID concept does this illustrate?', answer: 'Transfer difficulty: the student applies disciplinary conventions from one field that do not meet the expectations of another', options: ['Transfer difficulty: the student applies disciplinary conventions from one field that do not meet the expectations of another', 'The student is a poor writer', 'Literary analysis is inferior to sociology', 'Close reading has no value in any field'] },
        { passage: 'The concept of "discourse community" (Swales) helps explain why writing conventions differ: each community has shared goals, participatory mechanisms, and specialized lexis.', question: 'How does discourse community theory inform writing instruction?', answer: 'It shows that learning to write in a discipline means joining its discourse community and mastering its communicative practices, not just learning rules', options: ['It shows that learning to write in a discipline means joining its discourse community and mastering its communicative practices, not just learning rules', 'All academic writing is identical', 'Students should only learn one type of writing', 'Discourse communities are exclusive clubs'] },
        { passage: 'A business memo, a legal brief, a medical case study, and a literary essay all argue for a position, but their structures, evidence types, and stylistic norms differ dramatically.', question: 'What is the key insight of Writing Across the Curriculum?', answer: 'Writing is not a single transferable skill but a set of practices shaped by disciplinary contexts, purposes, and audiences', options: ['Writing is not a single transferable skill but a set of practices shaped by disciplinary contexts, purposes, and audiences', 'There is one correct way to write', 'Business writing is the most important type', 'All disciplines should adopt the same conventions'] },
      ],
    },
    'chicago-style': {
      type: 'citation-format', instruction: 'Identify the correct Chicago Manual of Style citation practice.',
      items: [
        { passage: 'Footnote citation: 1. Martha Johnson, The Art of Rhetoric (Chicago: University of Chicago Press, 2018), 45.', question: 'Is this Chicago notes-bibliography footnote correctly formatted?', answer: 'Yes: note number, author (first last), italicized title, publication info in parentheses, page number', options: ['Yes: note number, author (first last), italicized title, publication info in parentheses, page number', 'No: the author name should be last-first', 'No: the page number should be in parentheses', 'No: Chicago does not use footnotes'] },
        { passage: 'Bibliography entry: Johnson, Martha. The Art of Rhetoric. Chicago: University of Chicago Press, 2018.', question: 'How does the bibliography entry differ from the footnote?', answer: 'The author name is inverted (last, first), there are no parentheses around publication info, and no page number', options: ['The author name is inverted (last, first), there are no parentheses around publication info, and no page number', 'They are identical', 'The bibliography uses quotation marks for titles', 'The bibliography does not include the publisher'] },
        { passage: 'A shortened footnote for a previously cited source: 5. Johnson, Art of Rhetoric, 72.', question: 'When is a shortened footnote appropriate in Chicago style?', answer: 'After the first full citation of a source, subsequent references use author last name, shortened title, and page number', options: ['After the first full citation of a source, subsequent references use author last name, shortened title, and page number', 'Never; every footnote must be complete', 'Only when citing the same page', 'Only in the bibliography'] },
        { passage: 'Chicago style offers two documentation systems: notes-bibliography (used in humanities) and author-date (used in sciences and social sciences).', question: 'Why does Chicago offer two systems?', answer: 'Different disciplines have different citation needs; humanities favor discursive footnotes while sciences favor parenthetical efficiency', options: ['Different disciplines have different citation needs; humanities favor discursive footnotes while sciences favor parenthetical efficiency', 'One system is outdated', 'Authors can choose randomly', 'Only one system is actually valid'] },
        { passage: 'A Chicago-style footnote includes a substantive comment: "3. For a contrasting view, see Rivera, Counter-Rhetoric (2020), who argues that classical models are insufficient for digital contexts."', question: 'What distinguishes this from APA or MLA citation practices?', answer: 'Chicago notes allow discursive commentary alongside citations, integrating scholarly conversation into the footnote apparatus', options: ['Chicago notes allow discursive commentary alongside citations, integrating scholarly conversation into the footnote apparatus', 'APA and MLA also allow this', 'This footnote is incorrectly formatted', 'Footnotes should only contain bibliographic information'] },
        { passage: 'When citing an archival or primary source in Chicago style, the note includes the collection name, box/folder numbers, and repository.', question: 'Why is Chicago style preferred for historical research?', answer: 'Its flexible footnote system accommodates the unique bibliographic information of archival materials that standardized author-date systems cannot easily handle', options: ['Its flexible footnote system accommodates the unique bibliographic information of archival materials that standardized author-date systems cannot easily handle', 'Historians prefer footnotes for aesthetic reasons', 'APA works equally well for archives', 'Chicago is the newest citation style'] },
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

class Rhetoric {
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
    const level = p.level || 'intro';
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
    const level = p.level || 'intro';
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
    const level = p.level || 'intro';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        prereading: 'Activate schema: review key rhetorical concepts and context',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = Rhetoric;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rhet = new Rhetoric();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) rhet.setLevel(id, level); out({ action: 'start', profile: rhet.getProfile(id), nextSkills: rhet.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(rhet.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(rhet.generateExercise(level, skill, 5)); } else { const n = rhet.getNextSkills(id, 1).next; out(n.length ? rhet.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(rhet.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(rhet.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(rhet.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(rhet.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(rhet.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? rhet.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(rhet.setLevel(id, l)); break; }
      case 'students': { out(rhet.listStudents()); break; }
      default: out({ usage: 'node rhetoric.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
