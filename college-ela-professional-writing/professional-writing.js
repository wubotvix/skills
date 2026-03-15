// College ELA Professional Writing Lab (intro-advanced). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-ela-professional-writing');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'intro': {
    'technical-writing': ['memo-writing', 'email-professional', 'audience-analysis'],
    'business-writing': ['plain-language'],
    'visual-rhetoric': ['crap-principles'],
  },
  'intermediate': {
    'technical-writing': ['report-structure'],
    'business-writing': ['proposal-writing'],
    'digital-writing': ['data-visualization'],
    'visual-rhetoric': ['style-guides'],
  },
  'advanced': {
    'technical-writing': ['grant-writing', 'api-documentation'],
    'digital-writing': ['ux-writing'],
    'business-writing': ['portfolio-dev'],
  },
};

const ITEM_BANKS = {
  'intro': {
    'memo-writing': {
      type: 'audience-analysis', instruction: 'Read the workplace scenario and answer the question about memo writing.',
      items: [
        { prompt: 'Your team needs to switch to a new project-management tool by next Friday. Which memo element is MOST important?', answer: 'A clear action item with deadline', options: ['A clear action item with deadline', 'A detailed history of the old tool', 'Personal anecdotes about productivity', 'A list of every feature'] },
        { prompt: 'A memo to all-staff about a holiday schedule change should open with:', answer: 'The key change and effective date', options: ['The key change and effective date', 'A holiday greeting', 'The CEO\'s personal message', 'Background on the old schedule'] },
        { prompt: 'Which subject line best follows memo conventions?', answer: 'RE: Updated Q3 Budget Deadlines', options: ['RE: Updated Q3 Budget Deadlines', 'Hey everyone!!!', 'Important!!!!! Read Now!!!!!', 'Stuff about money'] },
        { prompt: 'The "CC" field on a memo is used to:', answer: 'Inform secondary readers who need awareness but not action', options: ['Inform secondary readers who need awareness but not action', 'Hide the recipient list', 'Replace the "To" field', 'Add decorative headers'] },
        { prompt: 'A memo announcing a policy change should include all EXCEPT:', answer: 'The writer\'s personal opinion of the policy', options: ['The writer\'s personal opinion of the policy', 'Effective date', 'Who is affected', 'Where to direct questions'] },
        { prompt: 'What is the standard order of a memo header?', answer: 'TO, FROM, DATE, RE (Subject)', options: ['TO, FROM, DATE, RE (Subject)', 'RE, TO, DATE, FROM', 'FROM, DATE, TO, RE', 'DATE, RE, FROM, TO'] },
      ],
    },
    'email-professional': {
      type: 'document-type', instruction: 'Choose the most professional email practice.',
      items: [
        { prompt: 'You need to request a deadline extension from your supervisor. The best approach is:', answer: 'State the situation, propose a new date, and explain briefly', options: ['State the situation, propose a new date, and explain briefly', 'Write a long apology with personal details', 'Send a one-word email: "Extension?"', 'CC the entire department'] },
        { prompt: 'Which email closing is appropriate for a first contact with a potential client?', answer: 'Best regards,', options: ['Best regards,', 'Later!', 'Thx', 'XOXO,'] },
        { prompt: 'When should you use "Reply All"?', answer: 'When all recipients need to see your response', options: ['When all recipients need to see your response', 'Always, to keep everyone informed', 'Never — it is always rude', 'Only when your manager asks'] },
        { prompt: 'A professional email subject line should:', answer: 'Summarize the email\'s purpose in a few words', options: ['Summarize the email\'s purpose in a few words', 'Be left blank to create mystery', 'Use all caps for visibility', 'Include emojis for friendliness'] },
        { prompt: 'You realize you sent an email with incorrect data. The best response is:', answer: 'Send a follow-up correction immediately, clearly labeled', options: ['Send a follow-up correction immediately, clearly labeled', 'Hope nobody notices', 'Delete the original email from your Sent folder', 'Blame a coworker'] },
        { prompt: 'What is the recommended maximum length for a routine professional email?', answer: 'Short enough to read without scrolling — roughly 5-7 sentences', options: ['Short enough to read without scrolling — roughly 5-7 sentences', 'At least two full pages', 'One word is ideal', 'There is no limit'] },
      ],
    },
    'audience-analysis': {
      type: 'audience-analysis', instruction: 'Identify the audience consideration for the given scenario.',
      items: [
        { prompt: 'You are writing software documentation for end users with no technical background. Your priority is:', answer: 'Plain language with step-by-step instructions', options: ['Plain language with step-by-step instructions', 'Extensive use of jargon to sound authoritative', 'Code samples and API references', 'Academic citations'] },
        { prompt: 'A report for the C-suite should emphasize:', answer: 'Key findings, strategic implications, and recommendations', options: ['Key findings, strategic implications, and recommendations', 'Detailed methodology and raw data', 'Informal tone and humor', 'Every data point collected'] },
        { prompt: 'When writing for a cross-functional team (marketing, engineering, finance), you should:', answer: 'Define specialized terms and avoid department-specific jargon', options: ['Define specialized terms and avoid department-specific jargon', 'Write exclusively for the engineering audience', 'Use the most technical language possible', 'Assume everyone knows all terminology'] },
        { prompt: 'A safety manual for factory workers should prioritize:', answer: 'Clear warnings, numbered steps, and visual aids', options: ['Clear warnings, numbered steps, and visual aids', 'Legal disclaimers in small print', 'Academic prose style', 'Marketing language about the company'] },
        { prompt: 'Adapting tone for a formal grant application vs. a team Slack message differs primarily in:', answer: 'Register — formal vs. informal vocabulary and structure', options: ['Register — formal vs. informal vocabulary and structure', 'Font size', 'Number of exclamation marks', 'Use of color'] },
        { prompt: 'Analyzing your audience BEFORE writing helps you determine all EXCEPT:', answer: 'Your personal salary expectations', options: ['Your personal salary expectations', 'Appropriate tone and register', 'How much background information to include', 'What terminology your readers will understand'] },
      ],
    },
    'plain-language': {
      type: 'plain-language-revision', instruction: 'Choose the plain-language revision of the given sentence.',
      items: [
        { prompt: '"Pursuant to the aforementioned regulation, all personnel are required to submit the requisite documentation prior to the established deadline."', answer: 'Under this regulation, everyone must submit the required documents before the deadline.', options: ['Under this regulation, everyone must submit the required documents before the deadline.', 'Per the aforementioned, requisite docs are due forthwith.', 'Regarding the above-referenced policy provision, submission is mandatory.', 'Documents. Deadline. Do it.'] },
        { prompt: '"It is incumbent upon the organization to effectuate a paradigm shift in operational methodology."', answer: 'The organization needs to change how it operates.', options: ['The organization needs to change how it operates.', 'A paradigm shift must be effectuated operationally.', 'The org shall implement transformative synergies.', 'Change stuff now.'] },
        { prompt: '"The utilization of the aforementioned apparatus is strictly prohibited in the absence of supervisory personnel."', answer: 'Do not use this equipment without a supervisor present.', options: ['Do not use this equipment without a supervisor present.', 'Apparatus utilization requires supervisory co-presence.', 'The equipment is banned sometimes.', 'No one can ever use this.'] },
        { prompt: '"At this point in time, we are not in a position to facilitate your request."', answer: 'We cannot help with your request right now.', options: ['We cannot help with your request right now.', 'Facilitation of said request is currently non-viable.', 'Your request is being processed in due course.', 'No.'] },
        { prompt: 'Which plain-language principle does this sentence violate? "The patient should be advised to discontinue utilization of the prescribed pharmaceutical."', answer: 'Uses complex words where simple ones work (discontinue → stop, utilization → use, pharmaceutical → medicine)', options: ['Uses complex words where simple ones work (discontinue → stop, utilization → use, pharmaceutical → medicine)', 'The sentence is too short', 'It uses active voice incorrectly', 'There are no problems with this sentence'] },
        { prompt: 'The federal Plain Writing Act of 2010 requires agencies to write clearly. Which revision best follows its principles?', answer: '"Send us your form by March 15" instead of "Submission of the requisite form must be effectuated no later than the 15th day of March"', options: ['"Send us your form by March 15" instead of "Submission of the requisite form must be effectuated no later than the 15th day of March"', 'Adding more legal disclaimers', 'Using longer sentences for completeness', 'Including Latin phrases for precision'] },
      ],
    },
    'crap-principles': {
      type: 'design-principle', instruction: 'Identify the CRAP design principle (Contrast, Repetition, Alignment, Proximity) illustrated.',
      items: [
        { prompt: 'A flyer uses the same shade of gray for the headline and body text, making them hard to distinguish. Which principle is violated?', answer: 'Contrast — elements that are different should look distinctly different', options: ['Contrast — elements that are different should look distinctly different', 'Repetition — not enough repeated elements', 'Alignment — text is not aligned', 'Proximity — items are too close together'] },
        { prompt: 'A report uses a different heading style on every page — sometimes bold, sometimes italic, sometimes underlined. Which principle is violated?', answer: 'Repetition — consistent visual elements create unity', options: ['Repetition — consistent visual elements create unity', 'Contrast — elements look too similar', 'Alignment — text is misaligned', 'Proximity — sections are too far apart'] },
        { prompt: 'A poster has text blocks scattered randomly with no visual connection to their related images. Which principle is violated?', answer: 'Proximity — related items should be grouped together', options: ['Proximity — related items should be grouped together', 'Contrast — not enough visual difference', 'Repetition — no repeated elements', 'Alignment — text is left-aligned'] },
        { prompt: 'A resume has the name centered, the objective left-aligned, experience right-aligned, and education centered. Which principle is violated?', answer: 'Alignment — every element should have a visual connection to something else on the page', options: ['Alignment — every element should have a visual connection to something else on the page', 'Contrast — all sections look the same', 'Proximity — sections are too close', 'Repetition — headings are inconsistent'] },
        { prompt: 'Using the same bullet style, font pairing, and color scheme throughout a 20-page report demonstrates:', answer: 'Repetition — it creates consistency and professionalism', options: ['Repetition — it creates consistency and professionalism', 'Contrast — visual variety', 'Proximity — grouping related items', 'Alignment — connecting elements visually'] },
        { prompt: 'A bold, 36pt dark heading above a 12pt light-gray body paragraph uses which principle effectively?', answer: 'Contrast — size, weight, and color differences create clear hierarchy', options: ['Contrast — size, weight, and color differences create clear hierarchy', 'Proximity — the heading is near the body', 'Repetition — the style is repeated', 'Alignment — both are left-aligned'] },
      ],
    },
  },
  'intermediate': {
    'report-structure': {
      type: 'document-type', instruction: 'Answer the question about professional report structure.',
      items: [
        { prompt: 'In a formal business report, the executive summary should:', answer: 'Condense key findings, conclusions, and recommendations into one page or less', options: ['Condense key findings, conclusions, and recommendations into one page or less', 'Repeat the entire report in slightly different words', 'Only list the table of contents', 'Include all raw data'] },
        { prompt: 'Which section of a report comes AFTER the findings but BEFORE the recommendations?', answer: 'Discussion/Analysis — interpreting what the findings mean', options: ['Discussion/Analysis — interpreting what the findings mean', 'Methodology', 'Executive Summary', 'Appendices'] },
        { prompt: 'The methodology section of a report serves to:', answer: 'Explain how data was gathered so readers can assess reliability', options: ['Explain how data was gathered so readers can assess reliability', 'Entertain the reader', 'Replace the executive summary', 'List staff biographies'] },
        { prompt: 'Appendices are used for:', answer: 'Supplementary material (raw data, surveys, detailed charts) that supports but is not essential to the main text', options: ['Supplementary material (raw data, surveys, detailed charts) that supports but is not essential to the main text', 'The most important findings', 'The executive summary', 'The title page'] },
        { prompt: 'A recommendation in a report should be:', answer: 'Specific, actionable, and tied to findings in the report', options: ['Specific, actionable, and tied to findings in the report', 'Vague so management can interpret freely', 'Identical to the conclusion', 'Based on the writer\'s personal preferences'] },
        { prompt: 'What distinguishes an informational report from an analytical report?', answer: 'Informational presents facts; analytical interprets data and recommends action', options: ['Informational presents facts; analytical interprets data and recommends action', 'They are the same thing', 'Informational is longer', 'Analytical never includes data'] },
      ],
    },
    'proposal-writing': {
      type: 'document-type', instruction: 'Answer the question about professional proposal writing.',
      items: [
        { prompt: 'The problem statement in a proposal should:', answer: 'Clearly define the need or gap the proposal addresses', options: ['Clearly define the need or gap the proposal addresses', 'List everything wrong with the organization', 'Be as vague as possible for flexibility', 'Focus on the writer\'s qualifications'] },
        { prompt: 'A project timeline in a proposal is most effective when it includes:', answer: 'Milestones, deliverables, and specific dates', options: ['Milestones, deliverables, and specific dates', 'Only a start and end date', 'No dates — just general phases', 'A detailed hour-by-hour schedule'] },
        { prompt: 'The budget section of a proposal should:', answer: 'Itemize costs with justifications tied to project activities', options: ['Itemize costs with justifications tied to project activities', 'Give one lump-sum total with no breakdown', 'Underestimate to look competitive', 'Be omitted if costs are uncertain'] },
        { prompt: 'What is the purpose of an evaluation plan in a proposal?', answer: 'To explain how success will be measured', options: ['To explain how success will be measured', 'To evaluate the client\'s company', 'To grade team members', 'To compare competitors'] },
        { prompt: 'An unsolicited proposal differs from a solicited proposal in that:', answer: 'It is initiated by the proposer, not in response to an RFP', options: ['It is initiated by the proposer, not in response to an RFP', 'It is shorter', 'It requires no budget', 'It is always rejected'] },
        { prompt: 'The strongest closing to a proposal typically includes:', answer: 'A summary of benefits and a clear call to action', options: ['A summary of benefits and a clear call to action', 'An apology for the proposal\'s length', 'A threat about the competition', 'Only the writer\'s signature'] },
      ],
    },
    'data-visualization': {
      type: 'design-principle', instruction: 'Answer the question about presenting data in professional documents.',
      items: [
        { prompt: 'A pie chart is most appropriate when:', answer: 'Showing parts of a whole that add up to 100%', options: ['Showing parts of a whole that add up to 100%', 'Showing trends over time', 'Comparing unrelated categories', 'Displaying raw data tables'] },
        { prompt: 'A line chart is most appropriate when:', answer: 'Showing trends or changes over continuous time', options: ['Showing trends or changes over continuous time', 'Showing proportions of a whole', 'Comparing categories at one point in time', 'Displaying geographic data'] },
        { prompt: 'Which is a common data visualization mistake?', answer: 'Truncating the y-axis to exaggerate differences', options: ['Truncating the y-axis to exaggerate differences', 'Labeling all axes clearly', 'Using a legend', 'Including a data source'] },
        { prompt: 'Edward Tufte\'s "data-ink ratio" principle states:', answer: 'Maximize the share of ink devoted to actual data; minimize non-data ink', options: ['Maximize the share of ink devoted to actual data; minimize non-data ink', 'Use as many colors as possible', 'Every chart needs 3D effects', 'Add decorative borders to all charts'] },
        { prompt: 'An effective chart title should:', answer: 'State the key takeaway or what the data shows', options: ['State the key takeaway or what the data shows', 'Simply say "Chart 1"', 'Be omitted to save space', 'Repeat the axis labels'] },
        { prompt: 'When presenting data to a non-technical audience, you should:', answer: 'Simplify visuals, highlight key numbers, and explain significance', options: ['Simplify visuals, highlight key numbers, and explain significance', 'Include all raw data for transparency', 'Use the most complex chart type available', 'Avoid visuals entirely'] },
      ],
    },
    'style-guides': {
      type: 'document-type', instruction: 'Answer the question about professional style guides.',
      items: [
        { prompt: 'A style guide for an organization typically standardizes:', answer: 'Tone, terminology, formatting, and brand voice across documents', options: ['Tone, terminology, formatting, and brand voice across documents', 'Only font choices', 'Employee dress code', 'Office layout'] },
        { prompt: 'The AP Stylebook is primarily used in:', answer: 'Journalism and public relations writing', options: ['Journalism and public relations writing', 'Academic research papers', 'Legal contracts', 'Software documentation'] },
        { prompt: 'The Chicago Manual of Style is most commonly used in:', answer: 'Academic publishing, especially humanities', options: ['Academic publishing, especially humanities', 'Newspaper reporting', 'Social media posts', 'Text messages'] },
        { prompt: 'Why would a company create its own in-house style guide?', answer: 'To ensure consistent voice, terminology, and formatting across all communications', options: ['To ensure consistent voice, terminology, and formatting across all communications', 'To replace all external grammar rules', 'To make writing harder', 'Because it is legally required'] },
        { prompt: 'A style guide entry for "login" vs. "log in" would clarify:', answer: 'Use "login" as a noun/adjective, "log in" as a verb', options: ['Use "login" as a noun/adjective, "log in" as a verb', 'They are always interchangeable', 'Never use either term', 'Always hyphenate as "log-in"'] },
        { prompt: 'What role does a style guide play in content localization?', answer: 'It ensures brand consistency when adapting content for different regions and languages', options: ['It ensures brand consistency when adapting content for different regions and languages', 'It eliminates the need for translation', 'It is irrelevant to localization', 'It only applies to English content'] },
      ],
    },
  },
  'advanced': {
    'grant-writing': {
      type: 'document-type', instruction: 'Answer the question about grant writing.',
      items: [
        { prompt: 'A needs assessment in a grant proposal demonstrates:', answer: 'Evidence that the problem exists and is significant enough to warrant funding', options: ['Evidence that the problem exists and is significant enough to warrant funding', 'The writer\'s personal interest in the topic', 'How much money the organization has already', 'A list of competing organizations'] },
        { prompt: 'Logic models in grant proposals map:', answer: 'Inputs → Activities → Outputs → Outcomes → Impact', options: ['Inputs → Activities → Outputs → Outcomes → Impact', 'Budget → Timeline → Staff → Equipment', 'Problem → Complaint → Resolution', 'Introduction → Body → Conclusion'] },
        { prompt: 'Which is the BEST example of a measurable outcome for a grant proposal?', answer: '"80% of participants will increase reading scores by one grade level within 12 months"', options: ['"80% of participants will increase reading scores by one grade level within 12 months"', '"Participants will feel better about reading"', '"Reading will improve"', '"We hope scores go up"'] },
        { prompt: 'Sustainability planning in a grant proposal addresses:', answer: 'How the project will continue after grant funding ends', options: ['How the project will continue after grant funding ends', 'Environmental concerns only', 'The writer\'s career plan', 'Building construction costs'] },
        { prompt: 'When a funder\'s RFP specifies a 5-page limit, the best approach is:', answer: 'Prioritize the strongest arguments and stay within the limit', options: ['Prioritize the strongest arguments and stay within the limit', 'Submit 10 pages because more detail is always better', 'Use 6pt font to fit everything', 'Ignore the limit — they will read it all anyway'] },
        { prompt: 'A grant budget narrative should:', answer: 'Explain and justify each line item, connecting costs to project activities', options: ['Explain and justify each line item, connecting costs to project activities', 'Simply list dollar amounts', 'Inflate numbers to get more funding', 'Be written after the project starts'] },
      ],
    },
    'api-documentation': {
      type: 'document-type', instruction: 'Answer the question about API and technical documentation.',
      items: [
        { prompt: 'Good API documentation for an endpoint should include:', answer: 'Method, URL, parameters, request/response examples, and error codes', options: ['Method, URL, parameters, request/response examples, and error codes', 'Only the URL', 'A general paragraph about the API', 'Marketing copy about the product'] },
        { prompt: 'A "quickstart guide" in technical documentation serves to:', answer: 'Help new users get a working example running in minutes', options: ['Help new users get a working example running in minutes', 'Replace all other documentation', 'Explain every feature in detail', 'Serve as a legal agreement'] },
        { prompt: 'Which documentation approach organizes content by user goals rather than product features?', answer: 'Task-based documentation', options: ['Task-based documentation', 'Reference documentation', 'Release notes', 'API changelog'] },
        { prompt: 'Code samples in documentation should:', answer: 'Be complete, tested, and copyable — readers should be able to run them directly', options: ['Be complete, tested, and copyable — readers should be able to run them directly', 'Be intentionally incomplete so users must figure things out', 'Use pseudo-code only', 'Never include comments'] },
        { prompt: 'Docs-as-code means:', answer: 'Treating documentation like source code — version-controlled, reviewed, and tested', options: ['Treating documentation like source code — version-controlled, reviewed, and tested', 'Writing code that documents itself', 'Replacing all documentation with code comments', 'Using a word processor for docs'] },
        { prompt: 'What is the purpose of API versioning in documentation?', answer: 'To help developers know which features are available in their version and manage breaking changes', options: ['To help developers know which features are available in their version and manage breaking changes', 'To make documentation longer', 'To confuse users', 'Versioning is unnecessary'] },
      ],
    },
    'ux-writing': {
      type: 'plain-language-revision', instruction: 'Answer the question about UX writing for digital products.',
      items: [
        { prompt: 'A button label of "Submit" vs. "Send your application" — which is better UX writing and why?', answer: '"Send your application" — it tells users exactly what will happen', options: ['"Send your application" — it tells users exactly what will happen', '"Submit" — shorter is always better', 'They are identical', '"Click here" is best'] },
        { prompt: 'An error message says "Error 403." A better UX-written version would be:', answer: '"You don\'t have permission to view this page. Contact your admin for access."', options: ['"You don\'t have permission to view this page. Contact your admin for access."', '"FORBIDDEN"', '"Something went wrong"', '"Error. Try again."'] },
        { prompt: 'Microcopy is:', answer: 'Small bits of text in the UI — tooltips, labels, placeholders, error messages — that guide users', options: ['Small bits of text in the UI — tooltips, labels, placeholders, error messages — that guide users', 'Very small font size text', 'Copyright notices', 'Text written under a microscope'] },
        { prompt: 'An empty state message (when a user has no data yet) should:', answer: 'Explain what belongs here and guide the user to take their first action', options: ['Explain what belongs here and guide the user to take their first action', 'Show a blank screen', 'Display a technical error', 'Say "No data" with no further guidance'] },
        { prompt: 'Progressive disclosure in UX writing means:', answer: 'Showing only essential information first, with details available on demand', options: ['Showing only essential information first, with details available on demand', 'Revealing all information at once', 'Hiding information permanently', 'Making text progressively larger'] },
        { prompt: 'Voice and tone guidelines for a product differ from a traditional style guide because they:', answer: 'Adapt tone to context (error vs. success vs. onboarding) while maintaining consistent brand voice', options: ['Adapt tone to context (error vs. success vs. onboarding) while maintaining consistent brand voice', 'Only apply to marketing materials', 'Ignore the user\'s emotional state', 'Are shorter than style guides'] },
      ],
    },
    'portfolio-dev': {
      type: 'audience-analysis', instruction: 'Answer the question about professional portfolio development.',
      items: [
        { prompt: 'A professional writing portfolio should include:', answer: 'Curated samples showing range, with context about your role and the outcome', options: ['Curated samples showing range, with context about your role and the outcome', 'Every document you have ever written', 'Only academic essays', 'A single writing sample'] },
        { prompt: 'When including a collaborative project in a portfolio, you should:', answer: 'Clearly state your specific contribution and role', options: ['Clearly state your specific contribution and role', 'Claim full credit for the entire project', 'Omit collaborative work entirely', 'List only the team members'] },
        { prompt: 'A portfolio case study should follow roughly which structure?', answer: 'Context/Problem → Process → Solution → Results/Outcome', options: ['Context/Problem → Process → Solution → Results/Outcome', 'Title → Body → End', 'Only show the finished product', 'A chronological diary of every step'] },
        { prompt: 'Tailoring a portfolio for a specific job application means:', answer: 'Selecting and reordering samples that are most relevant to the role', options: ['Selecting and reordering samples that are most relevant to the role', 'Creating fake samples that match the job description', 'Sending your entire portfolio regardless', 'Removing all technical writing if applying for a tech role'] },
        { prompt: 'Which platform consideration matters MOST for a digital writing portfolio?', answer: 'Accessibility, readability, and ease of navigation for reviewers', options: ['Accessibility, readability, and ease of navigation for reviewers', 'The most elaborate visual theme available', 'Maximum number of animations', 'Password-protecting everything'] },
        { prompt: 'A reflective annotation accompanying a portfolio sample should explain:', answer: 'The rhetorical situation, your choices, and what you learned', options: ['The rhetorical situation, your choices, and what you learned', 'Only the grade you received', 'How long it took to write', 'Your personal feelings about the assignment'] },
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

class ProfessionalWriting {
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
        context: 'Activate schema: discuss real-world application and audience',
        present: `Focus: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        reflect: 'Metacognitive check: How would you apply this in a professional setting?',
      },
    };
  }
}

module.exports = ProfessionalWriting;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const pw = new ProfessionalWriting();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) pw.setLevel(id, level); out({ action: 'start', profile: pw.getProfile(id), nextSkills: pw.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(pw.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'intro'; if (skill) { out(pw.generateExercise(level, skill, 5)); } else { const n = pw.getNextSkills(id, 1).next; out(n.length ? pw.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(pw.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total>'); out(pw.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(pw.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(pw.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(pw.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? pw.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(pw.setLevel(id, l)); break; }
      case 'students': { out(pw.listStudents()); break; }
      default: out({ usage: 'node professional-writing.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
