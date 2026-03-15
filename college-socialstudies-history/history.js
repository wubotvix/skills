// eClaw College History Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-history');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'reading-comprehension': ['identifying-thesis', 'summarizing-arguments', 'contextual-reading', 'vocabulary-in-context'],
    'timeline-literacy': ['chronological-ordering', 'periodization', 'cause-and-effect-sequencing'],
    'basic-writing': ['thesis-statement-construction', 'paragraph-structure', 'evidence-integration', 'citation-basics'],
    'historical-thinking': ['primary-vs-secondary', 'perspective-taking', 'continuity-and-change'],
  },
  'intermediate': {
    'historiography': ['schools-of-thought', 'historiographic-debate', 'revisionism-vs-orthodoxy', 'intellectual-context'],
    'source-analysis': ['authorship-and-bias', 'audience-and-purpose', 'corroboration', 'sourcing-heuristic'],
    'argument-construction': ['thesis-with-qualifications', 'evidence-based-reasoning', 'counterargument-integration', 'comparative-analysis'],
    'research-skills': ['database-navigation', 'bibliography-construction', 'annotated-bibliography', 'research-question-formulation'],
  },
  'upper-division': {
    'archival-methods': ['finding-aids', 'archival-notation', 'manuscript-reading', 'digital-archives'],
    'historiographic-essay': ['literature-review', 'field-mapping', 'gap-identification', 'synthesis-writing'],
    'advanced-writing': ['book-review', 'document-analysis-essay', 'comparative-essay', 'research-proposal'],
    'thematic-history': ['social-history', 'cultural-history', 'economic-history', 'political-history'],
  },
  'advanced': {
    'original-research': ['thesis-design', 'source-base-construction', 'argument-architecture', 'chapter-drafting'],
    'professional-skills': ['conference-presentation', 'peer-review', 'public-history', 'digital-humanities'],
    'theoretical-frameworks': ['postcolonial-theory', 'gender-analysis', 'marxist-historiography', 'microhistory'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'identifying-thesis': {
      items: [
        { prompt: 'Read the following passage and identify the thesis: "The Industrial Revolution fundamentally transformed European society not primarily through technological innovation, but through the reorganization of labor and family structures."', answer: 'The reorganization of labor and family structures was the primary transformation of the Industrial Revolution, not technology alone.', type: 'analysis' },
        { prompt: 'Which sentence best states a historical thesis? A) "The French Revolution happened in 1789." B) "The French Revolution was caused primarily by fiscal crisis rather than Enlightenment ideology." C) "Many people died in the French Revolution."', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Identify the thesis: "While most scholars emphasize military factors in Rome\'s fall, the collapse of infrastructure — roads, aqueducts, trade networks — better explains the decline of imperial authority in the West."', answer: 'The collapse of Roman infrastructure better explains the decline of imperial authority than military factors.', type: 'analysis' },
        { prompt: 'What makes a strong historical thesis? A) It states a fact B) It makes an arguable claim supported by evidence C) It summarizes events D) It asks a question', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Rewrite this weak thesis into a strong one: "The Civil War was about slavery."', answer: 'While multiple factors contributed to secession, the defense of slavery as an economic and social institution was the central cause of the American Civil War.', type: 'open-response' },
        { prompt: 'Identify the thesis: "Contrary to popular memory, the New Deal did not end the Great Depression; wartime mobilization after 1941 achieved the recovery that peacetime programs could not."', answer: 'Wartime mobilization, not the New Deal, ended the Great Depression.', type: 'analysis' },
      ],
    },
    'summarizing-arguments': {
      items: [
        { prompt: 'Summarize in one sentence: Howard Zinn argues that traditional American history glorifies elites while ignoring the struggles of workers, women, and minorities who drove real social change.', answer: 'Zinn contends that conventional US history centers elite narratives at the expense of marginalized groups who were the true agents of social transformation.', type: 'open-response' },
        { prompt: 'What is the difference between summarizing and analyzing a historical argument?', answer: 'Summarizing restates what the author argues; analyzing evaluates the strength of evidence, logic, and assumptions behind the argument.', type: 'concept' },
        { prompt: 'Summarize: "Hobsbawm argues that the period 1789-1848 constituted a dual revolution — political (French) and economic (British Industrial) — that together created the modern world."', answer: 'Hobsbawm sees 1789-1848 as a dual revolution combining French political upheaval and British industrialization that produced modernity.', type: 'open-response' },
        { prompt: 'Which is a summary rather than an opinion? A) "I think Anderson is wrong about nationalism" B) "Anderson argues nations are imagined communities constructed through print capitalism" C) "Anderson\'s book is the best on nationalism"', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Summarize: "Davis demonstrates that ordinary people in early modern France used religious riots not as mindless violence but as purposeful rituals to defend communal boundaries."', answer: 'Davis argues early modern French religious violence was purposeful ritual action defending community boundaries, not senseless mob behavior.', type: 'open-response' },
      ],
    },
    'contextual-reading': {
      items: [
        { prompt: 'Why is it important to know when a historical document was written?', answer: 'The date reveals what the author could have known, what events shaped their perspective, and what audience they addressed — essential for interpreting meaning.', type: 'concept' },
        { prompt: 'A pamphlet from 1776 argues for American independence. What contextual factors should you consider?', answer: 'The imperial crisis, Enlightenment ideas, colonial grievances, the intended audience, and the author\'s social position and interests.', type: 'analysis' },
        { prompt: 'How does knowing Thucydides was an exiled Athenian general affect your reading of his History of the Peloponnesian War?', answer: 'His military experience gives authority on strategy but his exile suggests possible bias against Athenian democratic leaders who banished him.', type: 'analysis' },
        { prompt: 'A 1955 editorial praises "separate but equal" schooling. What context is essential? A) The editor\'s favorite color B) Brown v. Board (1954) and Southern resistance C) The weather that day', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Why might a medieval chronicle by a monk emphasize divine intervention?', answer: 'Medieval monks operated within a theological worldview where God directed human affairs; their institutional role shaped how they interpreted causation.', type: 'analysis' },
      ],
    },
    'vocabulary-in-context': {
      items: [
        { prompt: 'Define "historiography" in the context of historical study.', answer: 'The study of how history has been written — the methods, interpretations, and debates among historians about the past.', type: 'definition' },
        { prompt: 'What does "periodization" mean and why is it contested?', answer: 'Dividing history into named eras. Contested because boundaries are interpretive choices that privilege certain changes over others.', type: 'definition' },
        { prompt: 'Define "primary source" and give two examples.', answer: 'A document or artifact created during the period under study. Examples: a Civil War diary, a Roman coin, a medieval charter.', type: 'definition' },
        { prompt: 'What does "agency" mean in historical writing?', answer: 'The capacity of individuals or groups to act independently and make choices that shape outcomes, even within structural constraints.', type: 'definition' },
        { prompt: 'Define "contingency" as historians use the term.', answer: 'The idea that historical outcomes were not inevitable — events could have turned out differently depending on circumstances and decisions.', type: 'definition' },
      ],
    },
    'chronological-ordering': {
      items: [
        { prompt: 'Place in chronological order: A) Fall of Rome (476 CE) B) French Revolution (1789) C) Black Death (1347) D) Protestant Reformation (1517)', answer: 'A, C, D, B', type: 'ordering' },
        { prompt: 'Which came first? A) American Revolution B) Haitian Revolution C) Latin American independence movements', answer: 'A (1775-1783), then B (1791-1804), then C (1810s-1820s)', type: 'ordering' },
        { prompt: 'Order these ancient civilizations by approximate founding: A) Roman Republic B) Sumerian city-states C) Athenian democracy D) Egyptian Old Kingdom', answer: 'B, D, C, A', type: 'ordering' },
        { prompt: 'Place in order: A) Treaty of Westphalia B) Congress of Vienna C) Treaty of Versailles D) Peace of Augsburg', answer: 'D (1555), A (1648), B (1815), C (1919)', type: 'ordering' },
        { prompt: 'Which happened first? A) Printing press invented B) Columbus reaches Americas C) Constantinople falls to Ottomans', answer: 'A (c. 1440), C (1453), B (1492)', type: 'ordering' },
      ],
    },
    'periodization': {
      items: [
        { prompt: 'Why do historians debate whether "Middle Ages" is a useful period label?', answer: 'The term implies stagnation between classical and modern eras, ignoring significant developments. It is Eurocentric and obscures vibrant cultures elsewhere.', type: 'analysis' },
        { prompt: 'What assumptions does the term "Renaissance" carry?', answer: 'It assumes a cultural rebirth from classical models, implying medieval decline. Joan Kelly challenged it by showing women\'s status declined during this "rebirth."', type: 'analysis' },
        { prompt: 'Why might 1945 and 1991 both serve as endpoints for the "short twentieth century"?', answer: '1945 marks the end of European global dominance; 1991 marks the Cold War\'s end. Each foregrounds different historical forces.', type: 'analysis' },
        { prompt: 'Is "the Age of Exploration" a neutral term?', answer: 'No — it centers European perspectives. For Indigenous peoples it was invasion and colonization. Alternatives: "Age of Contact" or "Age of Conquest."', type: 'analysis' },
      ],
    },
    'cause-and-effect-sequencing': {
      items: [
        { prompt: 'Identify one long-term and one short-term cause of World War I.', answer: 'Long-term: alliance systems and imperial competition. Short-term: assassination of Archduke Franz Ferdinand in 1914.', type: 'analysis' },
        { prompt: 'What is the difference between a proximate cause and a structural cause?', answer: 'A proximate cause is the immediate trigger; a structural cause is an underlying condition that made the event possible or likely over time.', type: 'concept' },
        { prompt: 'Name a consequence of the Columbian Exchange that was biological, economic, and demographic.', answer: 'Biological: disease transfer. Economic: global crop trade. Demographic: massive Indigenous population decline.', type: 'analysis' },
        { prompt: 'Why do historians warn against single-cause explanations for complex events?', answer: 'Historical events arise from multiple interacting factors. Monocausal explanations oversimplify and often reflect ideological bias rather than evidence.', type: 'concept' },
      ],
    },
    'thesis-statement-construction': {
      items: [
        { prompt: 'Write a thesis about the causes of the American Civil War that takes a specific position.', answer: 'Although economic and constitutional disagreements contributed to tension, the defense of slavery was the central cause of the American Civil War.', type: 'open-response' },
        { prompt: 'What are the three components of a strong historical thesis?', answer: 'A specific claim, a sense of significance ("so what"), and an indication of the evidence or reasoning supporting it.', type: 'concept' },
        { prompt: 'Improve this thesis: "The Cold War was bad."', answer: 'The Cold War\'s ideological rigidity distorted US foreign policy, leading to interventions that undermined democratic self-determination in the name of anticommunism.', type: 'open-response' },
        { prompt: 'Is this a thesis or a topic sentence? "This paper examines the French Revolution."', answer: 'Topic sentence. A thesis would argue: "The French Revolution radicalized because fiscal collapse eliminated moderate political options."', type: 'analysis' },
      ],
    },
    'paragraph-structure': {
      items: [
        { prompt: 'What is the standard structure of a body paragraph in a history essay?', answer: 'Topic sentence (claim), evidence (quotation or data), analysis (how evidence supports claim), connection to thesis.', type: 'concept' },
        { prompt: 'Why should evidence be followed by analysis?', answer: 'Sources do not have self-evident meaning. The historian must interpret evidence, explain its significance, and connect it to the argument.', type: 'concept' },
        { prompt: 'How does a topic sentence differ from a thesis?', answer: 'A topic sentence states the claim of one paragraph. A thesis states the argument of the entire essay. Topic sentences support the thesis.', type: 'concept' },
      ],
    },
    'evidence-integration': {
      items: [
        { prompt: 'What is the difference between quoting, paraphrasing, and summarizing?', answer: 'Quoting uses exact words. Paraphrasing restates a specific passage in your words. Summarizing condenses a larger argument into key points.', type: 'concept' },
        { prompt: 'When should you use a direct quotation vs. paraphrase?', answer: 'Quote when exact wording matters (striking language, legal text). Paraphrase for routine factual claims to maintain your own voice.', type: 'concept' },
      ],
    },
    'citation-basics': {
      items: [
        { prompt: 'What citation style do most history departments require?', answer: 'Chicago/Turabian, typically using footnotes (Notes-Bibliography system).', type: 'concept' },
        { prompt: 'Format this as a Chicago footnote: Book by Eric Foner, "Reconstruction," Harper, 2014, page 42.', answer: 'Eric Foner, Reconstruction (New York: Harper, 2014), 42.', type: 'citation' },
        { prompt: 'What is the difference between a footnote and a bibliography entry in Chicago style?', answer: 'Footnotes use first-name-last format with page numbers. Bibliography entries use last-name-first and full page ranges, alphabetically.', type: 'concept' },
      ],
    },
    'primary-vs-secondary': {
      items: [
        { prompt: 'Is a 2020 biography of Abraham Lincoln a primary or secondary source?', answer: 'Secondary — it interprets Lincoln\'s life. Lincoln\'s own letters would be primary.', type: 'classification' },
        { prompt: 'Can a source be both primary and secondary?', answer: 'Yes. Thucydides\' History is primary for Greek thought and secondary for the Peloponnesian War\'s causes.', type: 'concept' },
        { prompt: 'Classify: A) WWI soldier diary B) WWI textbook chapter C) 1918 newspaper D) 2010 historian article on WWI', answer: 'A: primary, B: secondary/tertiary, C: primary, D: secondary', type: 'classification' },
      ],
    },
    'perspective-taking': {
      items: [
        { prompt: 'Why consider multiple perspectives when studying colonialism?', answer: 'Colonialism affected colonizers and colonized differently. Centering only European perspectives distorts understanding of resistance, agency, and impact.', type: 'analysis' },
        { prompt: 'How might an enslaved person\'s account differ from the slaveholder\'s?', answer: 'The enslaved person would foreground violence, resistance, and survival; the slaveholder might emphasize economic management and paternalism.', type: 'analysis' },
      ],
    },
    'continuity-and-change': {
      items: [
        { prompt: 'Give an example of both continuity and change in US women\'s roles from 1800 to 1920.', answer: 'Change: women gained suffrage (1920). Continuity: domestic expectations persisted and legal constraints limited married women\'s rights.', type: 'analysis' },
        { prompt: 'Why analyze both continuity AND change?', answer: 'Focusing only on change suggests inevitable progress. Continuity reveals persistent structures that resist transformation.', type: 'concept' },
      ],
    },
  },
  'intermediate': {
    'schools-of-thought': {
      items: [
        { prompt: 'Compare the Annales school with traditional political-military history.', answer: 'Annales emphasizes long-term structures (geography, economy, mentalities) and social history; traditional history focuses on events, leaders, and state politics.', type: 'comparison' },
        { prompt: 'What is social history and how did it change the discipline in the 1960s-70s?', answer: 'Social history studies ordinary people rather than elites. It expanded who counts as historical subjects and what sources are valid.', type: 'concept' },
        { prompt: 'Describe the "linguistic turn" in historiography.', answer: 'The linguistic turn argued language constructs rather than reflects reality, leading historians to analyze discourse and the limits of historical knowledge.', type: 'concept' },
        { prompt: 'How does postcolonial historiography challenge Western-centric narratives?', answer: 'It centers colonized peoples\' agency, critiques Eurocentric periodization, and examines how colonial power shaped historical knowledge production.', type: 'analysis' },
      ],
    },
    'historiographic-debate': {
      items: [
        { prompt: 'Summarize the intentionalist vs. functionalist debate on the Holocaust.', answer: 'Intentionalists: Hitler planned genocide early. Functionalists: the Holocaust emerged through bureaucratic radicalization and structural dynamics of the Nazi state.', type: 'comparison' },
        { prompt: 'What is the Turner thesis and why has it been criticized?', answer: 'Turner argued the frontier shaped American democracy. Critics note it ignores Indigenous peoples, romanticizes conquest, and applies only to white male settlers.', type: 'analysis' },
        { prompt: 'How does Atlantic history challenge nation-based narratives?', answer: 'It traces connections among Europe, Africa, and the Americas, showing trade, migration, and ideas crossed national boundaries.', type: 'analysis' },
      ],
    },
    'revisionism-vs-orthodoxy': {
      items: [
        { prompt: 'What does "revisionism" mean in academic historiography?', answer: 'Reinterpreting the past based on new evidence, methods, or questions. Unlike denialism, it is normal and essential to historical scholarship.', type: 'concept' },
        { prompt: 'Give an example of legitimate historical revisionism.', answer: 'Genovese revised understanding of slavery from passive victimhood to showing enslaved people\'s agency, culture-building, and resistance.', type: 'example' },
      ],
    },
    'intellectual-context': {
      items: [
        { prompt: 'Why must you understand Enlightenment thought to interpret the US Constitution?', answer: 'The Constitution reflects natural rights, social contract, and separation of powers from Locke and Montesquieu. Without this context its logic is opaque.', type: 'analysis' },
        { prompt: 'How did Darwinian thought influence late 19th-century social and political ideas?', answer: 'Social Darwinism misapplied evolution to justify imperialism, laissez-faire capitalism, eugenics, and racial hierarchies.', type: 'analysis' },
      ],
    },
    'authorship-and-bias': {
      items: [
        { prompt: 'A British colonial officer writes about Indian resistance in 1857. What biases might shape this source?', answer: 'Imperial perspective, interest in justifying British rule, racial assumptions, limited access to Indian viewpoints, institutional pressure.', type: 'analysis' },
        { prompt: 'Does bias make a source useless?', answer: 'No. All sources have perspectives. Bias reveals the author\'s worldview, which is historically significant. Historians read critically rather than discard.', type: 'concept' },
      ],
    },
    'audience-and-purpose': {
      items: [
        { prompt: 'A Roman emperor commissions a triumphal arch. Who is the audience and what is the purpose?', answer: 'Audience: citizens, soldiers, subject peoples. Purpose: legitimize authority, celebrate victory, project power.', type: 'analysis' },
        { prompt: 'How does the intended audience of the Federalist Papers affect their content?', answer: 'Written to persuade New York voters to ratify, they present the strongest case while minimizing weaknesses — advocacy, not neutral analysis.', type: 'analysis' },
      ],
    },
    'corroboration': {
      items: [
        { prompt: 'What does "corroboration" mean in source analysis?', answer: 'Comparing multiple independent sources to verify claims. Agreement increases confidence; disagreement signals need for further investigation.', type: 'concept' },
        { prompt: 'Two medieval chronicles describe the same battle differently. What should a historian do?', answer: 'Compare authors\' positions and biases, seek third sources. The discrepancy itself reveals how perspective shapes accounts.', type: 'analysis' },
      ],
    },
    'sourcing-heuristic': {
      items: [
        { prompt: 'What four questions should you ask before reading a primary source?', answer: 'Who wrote it? When? For whom? Why? These frame interpretation before engaging with content.', type: 'concept' },
        { prompt: 'Apply the sourcing heuristic to MLK\'s 1963 Letter from Birmingham Jail.', answer: 'Author: MLK, civil rights leader. Date: April 1963. Audience: white moderate clergymen. Purpose: justify direct action and moral urgency.', type: 'analysis' },
      ],
    },
    'thesis-with-qualifications': {
      items: [
        { prompt: 'What does it mean to "qualify" a thesis?', answer: 'Acknowledging limitations, exceptions, or counterevidence while maintaining the central argument. Demonstrates nuance and honesty.', type: 'concept' },
        { prompt: 'Add a qualification: "The New Deal transformed American government."', answer: 'While the New Deal expanded federal authority, its impact was uneven — excluding African Americans from many programs and preserving Southern racial hierarchies.', type: 'open-response' },
      ],
    },
    'evidence-based-reasoning': {
      items: [
        { prompt: 'What is the difference between using evidence to illustrate vs. to argue?', answer: 'Illustration uses evidence as decoration. Argumentation explains what evidence proves, why it matters, and how it connects to the thesis.', type: 'concept' },
        { prompt: 'Improve: "Slavery was bad because many people suffered."', answer: 'Cite specific sources (narratives, records, data). Analyze what evidence reveals about the system\'s structure, not just its moral character.', type: 'analysis' },
      ],
    },
    'counterargument-integration': {
      items: [
        { prompt: 'Why should a history essay address counterarguments?', answer: 'Engaging counterarguments strengthens your thesis by showing you considered alternatives and can explain why your interpretation is more persuasive.', type: 'concept' },
        { prompt: 'How do you integrate a counterargument without undermining your thesis?', answer: 'Acknowledge it fairly, then show why your evidence is stronger — concede where appropriate but demonstrate the weight of evidence favors your position.', type: 'concept' },
      ],
    },
    'comparative-analysis': {
      items: [
        { prompt: 'What makes a good historical comparison?', answer: 'Clear criteria, both similarities and differences, analytical conclusions. Avoid superficial parallels, anachronism, and forced equivalences.', type: 'concept' },
        { prompt: 'Compare the French and Haitian Revolutions on one dimension.', answer: 'Both invoked universal rights, but the Haitian Revolution exposed French universalism\'s contradiction — enslaved people demanded liberty France claimed to champion.', type: 'analysis' },
      ],
    },
    'database-navigation': {
      items: [
        { prompt: 'Name three academic databases for historical research.', answer: 'JSTOR (articles), ProQuest (dissertations/newspapers), Internet Archive (primary sources).', type: 'concept' },
        { prompt: 'Keyword search vs. subject heading search — what is the difference?', answer: 'Keywords scan full text for exact terms. Subject headings use standardized tags by librarians for more precise results.', type: 'concept' },
      ],
    },
    'bibliography-construction': {
      items: [
        { prompt: 'Bibliography vs. works cited — what is the difference?', answer: 'A bibliography lists all sources consulted. Works cited lists only those directly referenced. History papers typically use bibliographies.', type: 'concept' },
      ],
    },
    'annotated-bibliography': {
      items: [
        { prompt: 'What should an annotation include?', answer: 'Summary of the argument, evaluation of methodology, and a statement of how it relates to your research question.', type: 'concept' },
      ],
    },
    'research-question-formulation': {
      items: [
        { prompt: 'Transform this topic into a research question: "Women in World War II."', answer: 'How did wartime labor reshape gender expectations, and why did postwar culture attempt to reverse those changes?', type: 'open-response' },
        { prompt: 'What makes a research question "historical" rather than factual?', answer: 'It requires interpretation, causal analysis, and engagement with evidence — not just a lookup answer.', type: 'concept' },
      ],
    },
  },
  'upper-division': {
    'finding-aids': {
      items: [
        { prompt: 'What is a finding aid?', answer: 'An inventory describing contents, organization, and context of an archival collection, used to identify relevant materials before visiting.', type: 'concept' },
        { prompt: 'What information does a finding aid typically include?', answer: 'Creator biography, scope/dates, organizational structure (series/subseries), box/folder listings, access restrictions.', type: 'concept' },
      ],
    },
    'archival-notation': {
      items: [
        { prompt: 'How do you cite an archival document in Chicago style?', answer: 'Author, document description, date, collection name, box/folder numbers, repository, location.', type: 'concept' },
      ],
    },
    'manuscript-reading': {
      items: [
        { prompt: 'What challenges do historians face reading handwritten documents?', answer: 'Unfamiliar handwriting (paleography), archaic spelling, faded text, and need for contextual knowledge to interpret ambiguities.', type: 'concept' },
      ],
    },
    'digital-archives': {
      items: [
        { prompt: 'Name two major digital archive projects.', answer: 'The Internet Archive and the Smithsonian digital collections.', type: 'concept' },
        { prompt: 'What are advantages and limitations of digitized sources?', answer: 'Advantages: accessibility, searchability. Limitations: selective digitization bias, loss of material context, OCR errors.', type: 'analysis' },
      ],
    },
    'literature-review': {
      items: [
        { prompt: 'What is the purpose of a literature review?', answer: 'Survey existing scholarship, identify interpretive camps, show where your research fits, and demonstrate your question addresses a gap or debate.', type: 'concept' },
        { prompt: 'How does a literature review differ from an annotated bibliography?', answer: 'An annotated bibliography lists sources individually. A literature review synthesizes thematically, showing how scholars relate to each other.', type: 'concept' },
      ],
    },
    'field-mapping': {
      items: [
        { prompt: 'What does it mean to "map a historiographic field"?', answer: 'Identifying major scholars, debates, methods, and divisions within a subfield to understand its intellectual landscape.', type: 'concept' },
      ],
    },
    'gap-identification': {
      items: [
        { prompt: 'How do you identify a gap in the literature?', answer: 'Read broadly, note underrepresented topics/perspectives/sources, and ask questions existing scholarship does not adequately address.', type: 'concept' },
      ],
    },
    'synthesis-writing': {
      items: [
        { prompt: 'What does "synthesis" mean in historical writing?', answer: 'Combining insights from multiple sources into a coherent new interpretation, rather than summarizing each source in sequence.', type: 'concept' },
      ],
    },
    'book-review': {
      items: [
        { prompt: 'What are the components of an academic book review?', answer: 'Summary of argument, evaluation of evidence/methodology, historiographic placement, contribution assessment, and critical analysis.', type: 'concept' },
        { prompt: 'Academic vs. popular book review — what is the difference?', answer: 'Academic: evaluates methodology, evidence, historiographic contribution. Popular: focuses on readability and general interest.', type: 'concept' },
      ],
    },
    'document-analysis-essay': {
      items: [
        { prompt: 'Steps for a document analysis essay?', answer: 'Identify source, establish context, analyze content/language, assess reliability/bias, argue for historical significance.', type: 'concept' },
      ],
    },
    'comparative-essay': {
      items: [
        { prompt: 'What organizational strategies work for comparative essays?', answer: 'Point-by-point (alternating on each theme) or block (one case fully, then the other, then synthesis). Point-by-point usually produces better analysis.', type: 'concept' },
      ],
    },
    'research-proposal': {
      items: [
        { prompt: 'What should a history research proposal include?', answer: 'Research question, historiographic context, proposed argument, source base, methodology, chapter outline, timeline, significance.', type: 'concept' },
      ],
    },
    'social-history': {
      items: [
        { prompt: 'What distinguishes social history from political history?', answer: 'Social history studies everyday life, ordinary people, social structures. Political history focuses on states, leaders, and formal power.', type: 'concept' },
        { prompt: 'What sources do social historians use?', answer: 'Census records, court documents, wills, diaries, material culture, oral histories, demographic data, folk traditions.', type: 'concept' },
      ],
    },
    'cultural-history': {
      items: [
        { prompt: 'How does cultural history differ from intellectual history?', answer: 'Intellectual history studies elite ideas. Cultural history examines shared meanings, symbols, and practices across all social levels.', type: 'concept' },
      ],
    },
    'economic-history': {
      items: [
        { prompt: 'What quantitative methods do economic historians use?', answer: 'Price series, GDP estimation, trade statistics, demographic modeling, cliometrics, input-output analysis.', type: 'concept' },
      ],
    },
    'political-history': {
      items: [
        { prompt: 'How has "new political history" expanded beyond traditional focuses?', answer: 'It examines political culture, grassroots movements, voter behavior, and how ordinary people shaped political institutions.', type: 'concept' },
      ],
    },
  },
  'advanced': {
    'thesis-design': {
      items: [
        { prompt: 'What are key elements of a thesis design in history?', answer: 'Original question, defined scope, primary source base, historiographic intervention, clear methodology, realistic timeline.', type: 'concept' },
        { prompt: 'How do you narrow a broad topic into a feasible thesis?', answer: 'Limit by period, geography, source type, or analytical lens. Ask: what can I answer with available sources in available time?', type: 'concept' },
      ],
    },
    'source-base-construction': {
      items: [
        { prompt: 'What does "constructing a source base" mean?', answer: 'Identifying and assembling primary sources needed for your question — archives, collections, databases, oral history interviews.', type: 'concept' },
      ],
    },
    'argument-architecture': {
      items: [
        { prompt: 'How do you structure a multi-chapter argument?', answer: 'Each chapter advances a sub-argument supporting the thesis. Chapters build logically — chronologically, thematically, or analytically.', type: 'concept' },
      ],
    },
    'chapter-drafting': {
      items: [
        { prompt: 'Recommended process for drafting a thesis chapter?', answer: 'Outline argument, organize evidence, write rough draft quickly, then revise for clarity, evidence integration, and prose quality.', type: 'concept' },
      ],
    },
    'conference-presentation': {
      items: [
        { prompt: 'How does a conference paper differ from a seminar paper?', answer: 'Conference papers are shorter (15-20 min), more focused, designed for oral delivery, and structured to provoke discussion.', type: 'concept' },
        { prompt: 'What makes an effective history conference presentation?', answer: 'Clear argument stated early, selective evidence, engaging delivery, respect for time limits, openness to critique.', type: 'concept' },
      ],
    },
    'peer-review': {
      items: [
        { prompt: 'What should you focus on in peer review?', answer: 'Argument clarity, evidence quality, logical structure, historiographic awareness, prose quality, conclusion following from evidence.', type: 'concept' },
      ],
    },
    'public-history': {
      items: [
        { prompt: 'What is public history?', answer: 'Presenting the past to general audiences through museums, documentaries, memorials, and digital media while maintaining scholarly rigor.', type: 'concept' },
      ],
    },
    'digital-humanities': {
      items: [
        { prompt: 'Name two digital humanities methods for historical research.', answer: 'Text mining (word frequency/patterns across corpora) and GIS mapping (spatial patterns in historical data).', type: 'concept' },
      ],
    },
    'postcolonial-theory': {
      items: [
        { prompt: 'How does Said\'s "Orientalism" apply to historical research?', answer: 'Said showed Western scholarship constructed a binary (rational West vs. exotic East) justifying imperialism. Historians must examine their frameworks for colonial knowledge structures.', type: 'analysis' },
      ],
    },
    'gender-analysis': {
      items: [
        { prompt: 'How does Joan Scott define gender as a category of analysis?', answer: 'Gender is a primary way of signifying power relations — not just women\'s experiences but how societies construct difference and hierarchy through gendered meanings.', type: 'analysis' },
      ],
    },
    'marxist-historiography': {
      items: [
        { prompt: 'What are the core concepts of Marxist historiography?', answer: 'Class struggle as driver, material conditions shaping ideology, modes of production defining periods, attention to labor and exploitation.', type: 'concept' },
      ],
    },
    'microhistory': {
      items: [
        { prompt: 'What is microhistory and what is its value?', answer: 'Studying a single event, person, or community in detail to illuminate broader structures — using the particular to reveal the general.', type: 'concept' },
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

function generateExercise(level, skill, count = 5) {
  const bank = QUESTION_BANKS[level]?.[skill];
  if (!bank || !bank.items) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.items, count);
  return { type: 'history', skill, level, count: items.length, instruction: 'Answer each question thoughtfully. Use evidence and historical reasoning.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class CollegeHistory {
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
    const level = p.level || 'introductory';
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
    const level = p.level || 'introductory';
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
    const level = p.level || 'introductory';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply concept to a primary source or historical case',
        reflect: `Connect ${target.skill} to broader historiographic themes`,
      },
    };
  }
}

module.exports = CollegeHistory;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CollegeHistory();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        if (level) api.setLevel(id, level);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const level = loadProfile(id).level || 'introductory';
        if (skill) { out(api.generateExercise(level, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); }
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
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node history.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
