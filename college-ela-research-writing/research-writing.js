// College ELA Research Writing Lab (Intro-Advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-research-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'research-methods': ['research-question'],
    'source-evaluation': ['source-types'],
    'citation-styles': ['mla-citation'],
    'academic-argument': ['paraphrasing', 'annotated-bibliography'],
  },
  'intermediate': {
    'research-methods': ['lit-review-structure'],
    'citation-styles': ['apa-citation'],
    'academic-argument': ['claim-evidence-warrant', 'synthesis'],
  },
  'advanced': {
    'citation-styles': ['chicago-citation'],
    'research-methods': ['advanced-methods', 'thesis-structure'],
    'academic-argument': ['publishing'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'research-question': {
      type: 'source-eval', instruction: 'Evaluate the quality of the research question.',
      items: [
        { prompt: '"What is the effect of social media usage on college students\' academic performance?"', answer: 'Strong — specific, researchable, and measurable', options: ['Strong — specific, researchable, and measurable', 'Too broad', 'Too narrow', 'Not a research question'] },
        { prompt: '"Why is everything bad?"', answer: 'Weak — too vague and not researchable', options: ['Weak — too vague and not researchable', 'Strong and focused', 'Appropriately scoped', 'Only slightly broad'] },
        { prompt: '"How many students attended UCLA in 2023?"', answer: 'Weak — factual/lookup question, not analytical', options: ['Weak — factual/lookup question, not analytical', 'Strong research question', 'Good exploratory question', 'Appropriately narrow'] },
        { prompt: '"To what extent does bilingual education in K-12 improve standardized test outcomes?"', answer: 'Strong — specific population, measurable outcome', options: ['Strong — specific population, measurable outcome', 'Too narrow to research', 'Too broad', 'Biased framing'] },
        { prompt: '"Is climate change real?"', answer: 'Weak — settled scientific consensus, not debatable in academic context', options: ['Weak — settled scientific consensus, not debatable in academic context', 'Strong and timely', 'Good exploratory question', 'Appropriately controversial'] },
        { prompt: '"What strategies do first-generation college students use to navigate financial barriers?"', answer: 'Strong — defined population, qualitative focus, researchable', options: ['Strong — defined population, qualitative focus, researchable', 'Too narrow', 'Too broad', 'Not researchable'] },
      ],
    },
    'source-types': {
      type: 'source-eval', instruction: 'Identify the type of source described.',
      items: [
        { prompt: 'A study published in the Journal of Applied Psychology reporting original experimental data', answer: 'Primary source (peer-reviewed journal article)', options: ['Primary source (peer-reviewed journal article)', 'Secondary source', 'Tertiary source', 'Popular source'] },
        { prompt: 'An encyclopedia entry summarizing major theories of motivation', answer: 'Tertiary source (reference work)', options: ['Tertiary source (reference work)', 'Primary source', 'Secondary source', 'Scholarly article'] },
        { prompt: 'A New York Times article reporting on a recent scientific discovery', answer: 'Popular/journalistic source', options: ['Popular/journalistic source', 'Primary source', 'Peer-reviewed article', 'Tertiary source'] },
        { prompt: 'A literature review analyzing 50 studies on sleep and cognition', answer: 'Secondary source (review article)', options: ['Secondary source (review article)', 'Primary source', 'Tertiary source', 'Popular source'] },
        { prompt: 'A government census report with raw demographic data', answer: 'Primary source (government data)', options: ['Primary source (government data)', 'Secondary source', 'Tertiary source', 'Popular source'] },
        { prompt: 'A textbook chapter explaining the principles of organic chemistry', answer: 'Tertiary source (textbook)', options: ['Tertiary source (textbook)', 'Primary source', 'Secondary source', 'Peer-reviewed article'] },
      ],
    },
    'mla-citation': {
      type: 'citation-format', instruction: 'Identify the correctly formatted MLA citation or the error in formatting.',
      items: [
        { prompt: 'Smith, John. "The Future of AI." Technology Today, vol. 12, no. 3, 2024, pp. 45-60.', answer: 'Correct MLA journal article format', options: ['Correct MLA journal article format', 'Missing volume number', 'Author name reversed', 'Missing page numbers'] },
        { prompt: 'Johnson, Amy. The Art of Writing. Oxford UP, 2023.', answer: 'Correct MLA book format', options: ['Correct MLA book format', 'Missing publisher', 'Needs city of publication', 'Title should not be italicized'] },
        { prompt: '"The Art of Writing" by Amy Johnson, Oxford UP, 2023.', answer: 'Error — author name should come first in Last, First format', options: ['Error — author name should come first in Last, First format', 'Correct MLA format', 'Only missing the date', 'Only missing page numbers'] },
        { prompt: 'Williams, Sarah. "Urban Planning Challenges." City Journal, 2023, www.cityjournal.com/article. Accessed 15 Mar. 2024.', answer: 'Correct MLA web source format', options: ['Correct MLA web source format', 'Missing access date', 'URL should not be included', 'Needs DOI instead of URL'] },
        { prompt: 'Brown (2024) argues that renewable energy is essential for sustainability (p. 34).', answer: 'Error — this is APA in-text style, not MLA', options: ['Error — this is APA in-text style, not MLA', 'Correct MLA in-text citation', 'Correct MLA parenthetical', 'Missing only the title'] },
        { prompt: 'According to Lee, "data literacy is crucial" (42).', answer: 'Correct MLA in-text citation (author in signal phrase, page in parentheses)', options: ['Correct MLA in-text citation (author in signal phrase, page in parentheses)', 'Missing year', 'Needs paragraph number', 'Author should be in parentheses'] },
      ],
    },
    'paraphrasing': {
      type: 'plagiarism-detect', instruction: 'Determine whether the paraphrase is acceptable or constitutes plagiarism.',
      items: [
        { prompt: 'Original: "The industrial revolution fundamentally transformed European society." Paraphrase: "The industrial revolution fundamentally changed European society."', answer: 'Unacceptable — too close to original, only one word substituted', options: ['Unacceptable — too close to original, only one word substituted', 'Acceptable paraphrase', 'Acceptable with citation', 'Direct quote'] },
        { prompt: 'Original: "Children who read regularly develop larger vocabularies." Paraphrase: "Regular reading habits in young people contribute to vocabulary expansion (Smith 12)."', answer: 'Acceptable — restructured with citation', options: ['Acceptable — restructured with citation', 'Too close to original', 'Missing citation', 'Patchwriting'] },
        { prompt: 'Original: "Social media platforms exploit psychological vulnerabilities." Paraphrase: "Psychological vulnerabilities are exploited by social media platforms."', answer: 'Unacceptable — merely changed from active to passive voice', options: ['Unacceptable — merely changed from active to passive voice', 'Acceptable paraphrase', 'Acceptable with citation', 'Original thought'] },
        { prompt: 'Original: "The study found a significant correlation between sleep and memory." Student writes: "Research demonstrates that sleep quality is closely linked to memory consolidation processes (Lee 87)."', answer: 'Acceptable — different structure, different words, cited', options: ['Acceptable — different structure, different words, cited', 'Too close to original', 'Missing citation', 'Plagiarism'] },
        { prompt: 'Student copies three sentences verbatim and places them in quotation marks with (Garcia 201).', answer: 'Acceptable — properly quoted and cited direct quotation', options: ['Acceptable — properly quoted and cited direct quotation', 'Plagiarism — too many words copied', 'Needs paraphrasing instead', 'Missing page number'] },
        { prompt: 'Student takes a paragraph, changes a few words throughout, and adds no citation.', answer: 'Patchwriting / plagiarism — superficial changes without attribution', options: ['Patchwriting / plagiarism — superficial changes without attribution', 'Acceptable paraphrase', 'Acceptable summary', 'Common knowledge exception'] },
      ],
    },
    'annotated-bibliography': {
      type: 'argument-structure', instruction: 'Evaluate the annotated bibliography entry.',
      items: [
        { prompt: 'Entry includes: full MLA citation, 150-word summary of argument, evaluation of credibility, and explanation of relevance to thesis.', answer: 'Complete and well-structured entry', options: ['Complete and well-structured entry', 'Missing summary', 'Missing evaluation', 'Missing relevance statement'] },
        { prompt: 'Entry includes: full citation and "This article is about climate change and is very interesting."', answer: 'Weak — summary is vague, missing evaluation and relevance', options: ['Weak — summary is vague, missing evaluation and relevance', 'Complete entry', 'Only missing evaluation', 'Acceptable for a draft'] },
        { prompt: 'Entry includes: citation, detailed summary, and evaluation, but no connection to the research question.', answer: 'Missing relevance — needs to explain how source supports the project', options: ['Missing relevance — needs to explain how source supports the project', 'Complete entry', 'Only missing summary', 'Acceptable as-is'] },
        { prompt: 'Entry uses APA citation format in an MLA-assigned bibliography.', answer: 'Incorrect citation style — must match assigned format', options: ['Incorrect citation style — must match assigned format', 'Acceptable if consistent', 'Only a minor issue', 'Does not matter for annotated bibliographies'] },
        { prompt: 'Entry evaluates author credentials, publication venue, methodology, and potential bias.', answer: 'Strong source evaluation component', options: ['Strong source evaluation component', 'Over-analyzed', 'Missing key evaluation criteria', 'Should only evaluate methodology'] },
        { prompt: 'Entry is 300 words: 200-word summary, 50-word evaluation, 50-word relevance statement.', answer: 'Well-proportioned entry with all required components', options: ['Well-proportioned entry with all required components', 'Summary is too long', 'Evaluation is too short', 'Needs to be shorter overall'] },
      ],
    },
  },
  'intermediate': {
    'lit-review-structure': {
      type: 'argument-structure', instruction: 'Evaluate the literature review structure or practice.',
      items: [
        { prompt: 'A lit review organized by theme: "Economic impacts," "Environmental impacts," "Social impacts" of urbanization.', answer: 'Thematic organization — effective for synthesizing across studies', options: ['Thematic organization — effective for synthesizing across studies', 'Chronological organization', 'Methodological organization', 'Poorly organized'] },
        { prompt: 'A lit review that summarizes each source one by one: "Smith (2020) found... Jones (2021) found... Lee (2022) found..."', answer: 'Annotated bibliography style — lacks synthesis and thematic grouping', options: ['Annotated bibliography style — lacks synthesis and thematic grouping', 'Well-organized thematic review', 'Effective chronological review', 'Strong methodological review'] },
        { prompt: 'A lit review that identifies a gap: "While studies have examined X in adults, no research addresses X in adolescents."', answer: 'Effective — establishes the research gap the study aims to fill', options: ['Effective — establishes the research gap the study aims to fill', 'Irrelevant to the review', 'Should not identify gaps', 'Too critical of existing research'] },
        { prompt: 'A lit review section that compares conflicting findings: "While Smith found A, Jones found B, possibly due to methodological differences."', answer: 'Strong synthesis — compares, contrasts, and explains discrepancies', options: ['Strong synthesis — compares, contrasts, and explains discrepancies', 'Should not mention contradictions', 'Too speculative', 'Poorly structured'] },
        { prompt: 'The lit review includes only sources that support the thesis and ignores opposing evidence.', answer: 'Biased — a review must represent the full scope of existing research', options: ['Biased — a review must represent the full scope of existing research', 'Appropriate for persuasive writing', 'Acceptable if sources are strong', 'Standard practice'] },
        { prompt: 'A lit review concludes with: "These studies collectively demonstrate X, yet gaps remain in Y, which this study addresses."', answer: 'Strong conclusion — synthesizes findings and transitions to the study\'s purpose', options: ['Strong conclusion — synthesizes findings and transitions to the study\'s purpose', 'Too abrupt', 'Should not reference own study', 'Missing key elements'] },
      ],
    },
    'apa-citation': {
      type: 'citation-format', instruction: 'Identify the correctly formatted APA citation or the error.',
      items: [
        { prompt: 'Williams, R. T. (2023). Cognitive development in early childhood. Journal of Psychology, 45(2), 112-130. https://doi.org/10.1000/example', answer: 'Correct APA 7th edition journal article format', options: ['Correct APA 7th edition journal article format', 'Missing DOI', 'Year should be at end', 'Title should be in quotes'] },
        { prompt: '(Williams, 2023, p. 45)', answer: 'Correct APA in-text citation with page number', options: ['Correct APA in-text citation with page number', 'Should not include page number', 'Missing first name', 'Year format is wrong'] },
        { prompt: 'Williams, R. T. "Cognitive Development in Early Childhood." Journal of Psychology 45.2 (2023): 112-130.', answer: 'Error — this is MLA format, not APA', options: ['Error — this is MLA format, not APA', 'Correct APA format', 'Only missing the DOI', 'Only year placement is wrong'] },
        { prompt: 'Chen, L., & Patel, S. (2024). Data science fundamentals (3rd ed.). Academic Press.', answer: 'Correct APA book format with edition and two authors', options: ['Correct APA book format with edition and two authors', 'Missing city of publication', 'Ampersand should be "and"', 'Edition format is wrong'] },
        { prompt: 'A reference list entry has a hanging indent and is alphabetized by author last name.', answer: 'Correct APA reference list formatting', options: ['Correct APA reference list formatting', 'Should use numbered list', 'Should be chronological', 'First line should be indented'] },
        { prompt: 'According to recent research (Chen & Patel, 2024), data literacy is essential in STEM fields.', answer: 'Correct APA narrative-adjacent parenthetical citation', options: ['Correct APA narrative-adjacent parenthetical citation', 'Should use "and" not ampersand', 'Missing page number', 'Year should be outside parentheses'] },
      ],
    },
    'claim-evidence-warrant': {
      type: 'argument-structure', instruction: 'Identify the component of the argument (Toulmin model).',
      items: [
        { prompt: '"Standardized testing should be eliminated from college admissions."', answer: 'Claim (the arguable thesis)', options: ['Claim (the arguable thesis)', 'Evidence', 'Warrant', 'Backing'] },
        { prompt: '"A 2023 study found that SAT scores correlate more with family income than academic ability (Rivera, 2023)."', answer: 'Evidence (data supporting the claim)', options: ['Evidence (data supporting the claim)', 'Claim', 'Warrant', 'Qualifier'] },
        { prompt: '"If a metric measures wealth rather than aptitude, it is an unfair admissions criterion."', answer: 'Warrant (the logical bridge connecting evidence to claim)', options: ['Warrant (the logical bridge connecting evidence to claim)', 'Claim', 'Evidence', 'Rebuttal'] },
        { prompt: '"Admittedly, some studies show modest predictive validity for standardized tests."', answer: 'Rebuttal/Concession (acknowledging counterargument)', options: ['Rebuttal/Concession (acknowledging counterargument)', 'Claim', 'Evidence', 'Warrant'] },
        { prompt: '"In most cases" or "For the majority of applicants"', answer: 'Qualifier (limiting the scope of the claim)', options: ['Qualifier (limiting the scope of the claim)', 'Warrant', 'Evidence', 'Backing'] },
        { prompt: '"The principle that admissions should measure individual merit is supported by Title VI of the Civil Rights Act."', answer: 'Backing (support for the warrant itself)', options: ['Backing (support for the warrant itself)', 'Evidence', 'Claim', 'Qualifier'] },
      ],
    },
    'synthesis': {
      type: 'argument-structure', instruction: 'Evaluate the synthesis of sources.',
      items: [
        { prompt: '"Smith (2020) found that exercise improves memory. Similarly, Lee (2021) reported that physical activity enhances cognitive function, while Chen (2022) noted that sedentary behavior correlates with cognitive decline."', answer: 'Effective synthesis — groups related findings across sources', options: ['Effective synthesis — groups related findings across sources', 'Summary without synthesis', 'Patchwriting', 'Plagiarism'] },
        { prompt: '"Smith (2020) studied memory. Lee (2021) studied cognition. Chen (2022) studied exercise."', answer: 'Summary list, not synthesis — no connections drawn between sources', options: ['Summary list, not synthesis — no connections drawn between sources', 'Effective synthesis', 'Good thematic organization', 'Appropriate for a lit review'] },
        { prompt: '"While quantitative studies (Smith, 2020; Lee, 2021) demonstrate correlation, qualitative research (Chen, 2022) reveals participants\' lived experiences of cognitive benefits."', answer: 'Strong synthesis — contrasts methodological approaches meaningfully', options: ['Strong synthesis — contrasts methodological approaches meaningfully', 'Mere summary', 'Too complex', 'Methodologically confused'] },
        { prompt: '"Research consistently shows X (Smith, 2020; Lee, 2021; Chen, 2022), suggesting a consensus in the field."', answer: 'Effective synthesis — identifies scholarly consensus with multiple citations', options: ['Effective synthesis — identifies scholarly consensus with multiple citations', 'Lazy citation stacking', 'Needs individual summaries', 'Insufficient analysis'] },
        { prompt: '"Smith (2020) argues for A. However, Lee (2021) challenges this view, presenting evidence for B. Chen (2022) reconciles these positions by proposing C."', answer: 'Excellent synthesis — traces a scholarly conversation', options: ['Excellent synthesis — traces a scholarly conversation', 'Poorly organized', 'Too many sources', 'Biased presentation'] },
        { prompt: '"Studies vary in their findings: some support X (Smith, 2020), others Y (Lee, 2021). This discrepancy may stem from differences in sample size and methodology."', answer: 'Strong synthesis — acknowledges and explains conflicting results', options: ['Strong synthesis — acknowledges and explains conflicting results', 'Indecisive writing', 'Should pick one side', 'Too speculative'] },
      ],
    },
  },
  'advanced': {
    'chicago-citation': {
      type: 'citation-format', instruction: 'Identify the correctly formatted Chicago citation or the error.',
      items: [
        { prompt: 'Williams, Robert T. "Cognitive Development in Early Childhood." Journal of Psychology 45, no. 2 (2023): 112-130.', answer: 'Correct Chicago Notes-Bibliography journal format', options: ['Correct Chicago Notes-Bibliography journal format', 'Missing volume', 'Missing DOI', 'Author format is wrong'] },
        { prompt: '1. Robert T. Williams, "Cognitive Development in Early Childhood," Journal of Psychology 45, no. 2 (2023): 115.', answer: 'Correct Chicago footnote format (first reference)', options: ['Correct Chicago footnote format (first reference)', 'Should use parenthetical', 'Author name should be inverted', 'Missing publisher'] },
        { prompt: '2. Williams, "Cognitive Development," 118.', answer: 'Correct Chicago shortened footnote (subsequent reference)', options: ['Correct Chicago shortened footnote (subsequent reference)', 'Missing full title', 'Needs full citation again', 'Wrong format entirely'] },
        { prompt: 'Chen, Lisa, and Sanjay Patel. Data Science Fundamentals. 3rd ed. Chicago: Academic Press, 2024.', answer: 'Correct Chicago bibliography entry for a book', options: ['Correct Chicago bibliography entry for a book', 'Missing edition', 'City should not be included', 'Publisher format wrong'] },
        { prompt: '(Williams 2023, 45)', answer: 'Correct Chicago Author-Date in-text citation', options: ['Correct Chicago Author-Date in-text citation', 'Should use footnote instead', 'Missing comma after year', 'Needs "p." before page'] },
        { prompt: 'A bibliography with entries single-spaced internally and a blank line between entries, alphabetized by last name.', answer: 'Correct Chicago bibliography formatting', options: ['Correct Chicago bibliography formatting', 'Should be double-spaced throughout', 'Should be numbered', 'Should be chronological'] },
      ],
    },
    'advanced-methods': {
      type: 'source-eval', instruction: 'Evaluate the research methodology or design.',
      items: [
        { prompt: 'A mixed-methods study uses surveys (n=500) for breadth and interviews (n=20) for depth on student retention.', answer: 'Strong design — triangulation of quantitative and qualitative data', options: ['Strong design — triangulation of quantitative and qualitative data', 'Conflicting methodologies', 'Sample too small', 'Should use only one method'] },
        { prompt: 'A researcher studies the effect of tutoring on grades but does not control for prior GPA or socioeconomic status.', answer: 'Weak — confounding variables not controlled', options: ['Weak — confounding variables not controlled', 'Strong experimental design', 'Acceptable for exploratory research', 'No issues'] },
        { prompt: 'IRB approval was obtained, participants gave informed consent, and data was anonymized.', answer: 'Proper ethical research protocol followed', options: ['Proper ethical research protocol followed', 'Excessive precaution', 'Missing debriefing', 'Needs additional oversight'] },
        { prompt: 'A systematic review searches 5 databases, uses predefined inclusion criteria, and follows PRISMA guidelines.', answer: 'Rigorous and replicable systematic review methodology', options: ['Rigorous and replicable systematic review methodology', 'Too many databases', 'Should use narrative review', 'Over-structured'] },
        { prompt: 'A qualitative study uses purposive sampling, semi-structured interviews, and member checking for validation.', answer: 'Strong qualitative design with trustworthiness measures', options: ['Strong qualitative design with trustworthiness measures', 'Biased sampling', 'Not generalizable therefore weak', 'Should use random sampling'] },
        { prompt: 'A study generalizes findings from 15 undergraduate psychology students to "all adults."', answer: 'Weak — limited sample does not support broad generalization', options: ['Weak — limited sample does not support broad generalization', 'Acceptable generalization', 'Strong external validity', 'Normal practice in psychology'] },
      ],
    },
    'thesis-structure': {
      type: 'argument-structure', instruction: 'Evaluate the thesis/dissertation structural element.',
      items: [
        { prompt: 'Chapter order: Introduction, Literature Review, Methodology, Results, Discussion, Conclusion.', answer: 'Standard IMRaD-based thesis structure', options: ['Standard IMRaD-based thesis structure', 'Non-standard order', 'Missing key chapter', 'Only for journal articles'] },
        { prompt: 'The introduction ends with: "This study examines X using Y methodology to address Z gap in the literature."', answer: 'Strong — states purpose, method, and justification', options: ['Strong — states purpose, method, and justification', 'Too formulaic', 'Missing hypothesis', 'Should be in methodology'] },
        { prompt: 'The discussion chapter only restates results without connecting them to existing literature.', answer: 'Weak — discussion must interpret findings in context of prior research', options: ['Weak — discussion must interpret findings in context of prior research', 'Acceptable for brevity', 'Results speak for themselves', 'Normal for a thesis'] },
        { prompt: 'The methodology chapter justifies each design choice and addresses limitations proactively.', answer: 'Strong — demonstrates methodological awareness and transparency', options: ['Strong — demonstrates methodological awareness and transparency', 'Over-justified', 'Should save limitations for discussion', 'Too defensive'] },
        { prompt: 'A thesis abstract is 350 words covering purpose, methods, key findings, and implications.', answer: 'Appropriate length and coverage for a thesis abstract', options: ['Appropriate length and coverage for a thesis abstract', 'Too long', 'Missing literature review summary', 'Should include all data'] },
        { prompt: 'The conclusion introduces entirely new evidence not discussed in previous chapters.', answer: 'Weak — conclusions should synthesize, not introduce new material', options: ['Weak — conclusions should synthesize, not introduce new material', 'Acceptable for strengthening argument', 'Normal practice', 'Shows thorough research'] },
      ],
    },
    'publishing': {
      type: 'source-eval', instruction: 'Evaluate the academic publishing practice or scenario.',
      items: [
        { prompt: 'A researcher submits the same manuscript to three journals simultaneously.', answer: 'Unethical — simultaneous submission violates most journal policies', options: ['Unethical — simultaneous submission violates most journal policies', 'Efficient use of time', 'Acceptable practice', 'Only unethical if accepted by multiple'] },
        { prompt: 'After peer review, the author receives a "revise and resubmit" decision.', answer: 'Common and positive — the editor sees potential in the manuscript', options: ['Common and positive — the editor sees potential in the manuscript', 'Equivalent to rejection', 'Means minor changes only', 'Guarantees acceptance'] },
        { prompt: 'An open-access journal charges a $5000 APC but has no peer review process and guarantees acceptance.', answer: 'Predatory journal — pay-to-publish without quality control', options: ['Predatory journal — pay-to-publish without quality control', 'Legitimate open-access journal', 'Normal APC practice', 'Premium fast-track service'] },
        { prompt: 'A journal has an impact factor of 4.2, is indexed in Scopus and Web of Science, and has a 15% acceptance rate.', answer: 'Indicators of a reputable, competitive journal', options: ['Indicators of a reputable, competitive journal', 'Suspiciously selective', 'Impact factor too low', 'Not enough information'] },
        { prompt: 'A researcher lists a colleague as co-author who did not contribute to the research or writing.', answer: 'Gift authorship — violates research ethics and authorship guidelines', options: ['Gift authorship — violates research ethics and authorship guidelines', 'Common courtesy', 'Acceptable for mentors', 'Standard in some fields'] },
        { prompt: 'A preprint is posted to arXiv before formal peer review and journal publication.', answer: 'Acceptable and common practice for early dissemination', options: ['Acceptable and common practice for early dissemination', 'Violates copyright', 'Unprofessional', 'Only for physics'] },
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

class ResearchWriting {
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
        inquiry: 'Define research question and review source context',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: What strategies did you use?',
      },
    };
  }
}

module.exports = ResearchWriting;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rw = new ResearchWriting();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) rw.setLevel(id, level); out({ action: 'start', profile: rw.getProfile(id), nextSkills: rw.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(rw.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(rw.generateExercise(level, skill, 5)); } else { const n = rw.getNextSkills(id, 1).next; out(n.length ? rw.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(rw.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(rw.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(rw.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(rw.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(rw.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? rw.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(rw.setLevel(id, l)); break; }
      case 'students': { out(rw.listStudents()); break; }
      default: out({ usage: 'node research-writing.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
