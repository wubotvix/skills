// eClaw HS ELA Speaking & Listening Interactive Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-speaking-listening');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'socratic-seminar-participation': ['discussion-moves', 'text-evidence', 'building-on-others'],
    'informative-speech': ['structure-organization', 'clarity-delivery', 'visual-aids'],
    'active-listening-response': ['paraphrase-check', 'question-generation', 'note-taking'],
    'evaluate-speaker-basic': ['claim-identification', 'evidence-assessment', 'bias-detection'],
    'formal-discussion': ['turn-taking', 'respectful-disagreement', 'synthesizing-views'],
    'multimedia-basic': ['slide-design', 'audio-visual-integration', 'digital-presentation'],
  },
  'grade-10': {
    'persuasive-speech': ['monroes-sequence', 'emotional-appeal', 'call-to-action'],
    'lincoln-douglas-basics': ['value-criterion', 'constructive-speech', 'cross-examination'],
    'evaluate-reasoning': ['logical-fallacies', 'evidence-quality', 'counterargument-strength'],
    'debate-preparation': ['research-evidence', 'case-construction', 'flowing-basics'],
    'audience-analysis': ['demographic-awareness', 'tone-adaptation', 'purpose-alignment'],
    'multimedia-persuasion': ['persuasive-visuals', 'data-visualization', 'media-credibility'],
  },
  'grade-11': {
    'policy-debate': ['plan-text', 'disadvantages', 'counterplans'],
    'rhetorical-delivery': ['vocal-variety', 'strategic-pausing', 'gesture-movement'],
    'synthesis-discussion': ['multi-source-integration', 'perspective-comparison', 'consensus-building'],
    'evaluate-complex-argument': ['warrant-analysis', 'assumption-identification', 'fallacy-rebuttal'],
    'advanced-presentation': ['ted-structure', 'storytelling-technique', 'audience-engagement'],
    'strategic-multimedia': ['interactive-media', 'rhetorical-design', 'platform-optimization'],
  },
  'grade-12': {
    'parliamentary-debate': ['points-of-order', 'impromptu-argumentation', 'parliamentary-procedure'],
    'college-interview': ['star-method', 'self-presentation', 'question-asking'],
    'ted-style-presentation': ['big-idea-development', 'narrative-arc', 'memorable-delivery'],
    'evaluate-sophisticated-argument': ['epistemological-analysis', 'rhetorical-strategy-id', 'systemic-critique'],
    'professional-communication': ['meeting-facilitation', 'elevator-pitch', 'networking-skills'],
    'advanced-debate-strategy': ['kritik-theory', 'impact-calculus', 'round-strategy'],
  },
};

// ── Content Banks ──

const DEBATE_TOPICS = {
  'grade-9': [
    { resolution: 'Resolved: Social media does more harm than good for teenagers.', type: 'value', difficulty: 'introductory' },
    { resolution: 'Resolved: Schools should require community service for graduation.', type: 'policy', difficulty: 'introductory' },
    { resolution: 'Resolved: Standardized testing should be eliminated in public schools.', type: 'policy', difficulty: 'introductory' },
    { resolution: 'Resolved: The voting age should be lowered to 16.', type: 'value', difficulty: 'introductory' },
    { resolution: 'Resolved: Cell phones should be banned in classrooms.', type: 'policy', difficulty: 'introductory' },
    { resolution: 'Resolved: School uniforms promote equality.', type: 'value', difficulty: 'introductory' },
  ],
  'grade-10': [
    { resolution: 'Resolved: Civil disobedience is justified in a democracy.', type: 'value', difficulty: 'intermediate' },
    { resolution: 'Resolved: The United States should adopt universal basic income.', type: 'policy', difficulty: 'intermediate' },
    { resolution: 'Resolved: Plea bargaining should be abolished in the criminal justice system.', type: 'policy', difficulty: 'intermediate' },
    { resolution: 'Resolved: Individual privacy is more important than national security.', type: 'value', difficulty: 'intermediate' },
    { resolution: 'Resolved: Colleges should eliminate legacy admissions.', type: 'policy', difficulty: 'intermediate' },
    { resolution: 'Resolved: The electoral college should be abolished.', type: 'policy', difficulty: 'intermediate' },
  ],
  'grade-11': [
    { resolution: 'Resolved: The United States federal government should substantially increase its regulation of artificial intelligence.', type: 'policy', difficulty: 'advanced' },
    { resolution: 'Resolved: Wealthy nations have an obligation to accept climate refugees.', type: 'policy', difficulty: 'advanced' },
    { resolution: 'Resolved: The benefits of genetic engineering outweigh the risks.', type: 'value', difficulty: 'advanced' },
    { resolution: 'Resolved: Economic sanctions are a just tool of foreign policy.', type: 'policy', difficulty: 'advanced' },
    { resolution: 'Resolved: The right to be forgotten should be a fundamental human right.', type: 'value', difficulty: 'advanced' },
    { resolution: 'Resolved: The US should implement a single-payer healthcare system.', type: 'policy', difficulty: 'advanced' },
  ],
  'grade-12': [
    { resolution: 'Resolved: Democratic governance is incompatible with effective climate action.', type: 'value', difficulty: 'expert' },
    { resolution: 'Resolved: The United States should substantially reform its immigration system to prioritize humanitarian considerations over economic ones.', type: 'policy', difficulty: 'expert' },
    { resolution: 'Resolved: Capitalism is fundamentally incompatible with environmental sustainability.', type: 'value', difficulty: 'expert' },
    { resolution: 'Resolved: International institutions should have enforcement power over sovereign nations for human rights violations.', type: 'policy', difficulty: 'expert' },
    { resolution: 'Resolved: The pursuit of technological progress ought to be subordinated to ethical considerations.', type: 'value', difficulty: 'expert' },
    { resolution: 'Resolved: The US federal government should substantially increase foreign aid to sub-Saharan Africa.', type: 'policy', difficulty: 'expert' },
  ],
};

const DISCUSSION_PROMPTS = {
  'grade-9': [
    { text: 'In To Kill a Mockingbird, Atticus says courage is "when you know you\'re licked before you begin but you begin anyway."', question: 'Do you agree with this definition of courage? What examples from the text or your life support or challenge this idea?', type: 'socratic', skills: ['text-evidence', 'building-on-others'] },
    { text: 'Some argue that technology makes us less connected despite making communication easier.', question: 'How has technology changed the way we form and maintain relationships? Use specific examples.', type: 'discussion', skills: ['synthesizing-views', 'respectful-disagreement'] },
    { text: 'A new study suggests that homework has minimal academic benefit for high school students.', question: 'Should schools reduce or eliminate homework? What would be the consequences?', type: 'discussion', skills: ['discussion-moves', 'turn-taking'] },
    { text: 'Read the opening paragraph of "The Lottery" by Shirley Jackson.', question: 'How does the author create a false sense of normalcy? What is the effect on the reader?', type: 'socratic', skills: ['text-evidence', 'question-generation'] },
  ],
  'grade-10': [
    { text: 'Martin Luther King Jr. wrote in "Letter from Birmingham Jail": "Injustice anywhere is a threat to justice everywhere."', question: 'When is breaking the law morally justified? What criteria should determine when civil disobedience is appropriate?', type: 'socratic', skills: ['monroes-sequence', 'counterargument-strength'] },
    { text: 'Social media companies use algorithms that create echo chambers and filter bubbles.', question: 'Should social media platforms be regulated like public utilities? Argue from multiple perspectives.', type: 'debate-prep', skills: ['research-evidence', 'case-construction'] },
    { text: 'Consider the trolley problem: a runaway trolley will kill five people unless you divert it to a track where it will kill one person.', question: 'What ethical framework best resolves this dilemma? How does your framework apply to real-world policy decisions?', type: 'socratic', skills: ['value-criterion', 'logical-fallacies'] },
    { text: 'A recent editorial argues that gap years before college lead to better academic outcomes.', question: 'Evaluate the argument. What evidence would strengthen or weaken the claim?', type: 'evaluation', skills: ['evidence-quality', 'demographic-awareness'] },
  ],
  'grade-11': [
    { text: 'The US spends more on healthcare per capita than any other developed nation but ranks lower on many health outcomes.', question: 'Construct a policy debate case for or against single-payer healthcare. Include plan text, advantages, and anticipated disadvantages.', type: 'policy-prep', skills: ['plan-text', 'disadvantages'] },
    { text: 'In his "I Have a Dream" speech, Dr. King uses anaphora, metaphor, and allusion extensively.', question: 'How do King\'s rhetorical choices amplify his message? Analyze at least three specific techniques and their effects.', type: 'rhetorical-analysis', skills: ['vocal-variety', 'strategic-pausing'] },
    { text: 'Three economists present competing analyses of minimum wage effects: one finds job losses, one finds no effect, one finds increased spending.', question: 'Synthesize these perspectives. What might explain the different conclusions? Which methodology seems most reliable and why?', type: 'synthesis', skills: ['multi-source-integration', 'perspective-comparison'] },
    { text: 'A politician argues: "If we allow any restrictions on free speech, we will inevitably slide into totalitarianism."', question: 'Identify the logical fallacy, explain why the reasoning is flawed, and construct a stronger version of the argument.', type: 'evaluation', skills: ['warrant-analysis', 'fallacy-rebuttal'] },
  ],
  'grade-12': [
    { text: 'You are preparing for a college interview at your top-choice school, which values community engagement and intellectual curiosity.', question: 'Respond to: "Tell me about a time you encountered an idea that challenged your worldview. How did you respond?"', type: 'interview-prep', skills: ['star-method', 'self-presentation'] },
    { text: 'A debate opponent runs a kritik arguing that the entire framework of policy debate reinforces neoliberal assumptions.', question: 'How would you respond? Consider both the theoretical and strategic dimensions of the argument.', type: 'advanced-debate', skills: ['kritik-theory', 'round-strategy'] },
    { text: 'You must deliver a 5-minute TED-style talk on a topic you are passionate about to a general audience.', question: 'Outline your talk using the TED structure: hook, personal connection, big idea, evidence, and call to action.', type: 'presentation', skills: ['big-idea-development', 'narrative-arc'] },
    { text: 'A colleague in a professional meeting dismisses your proposal without engaging with the evidence you presented.', question: 'How would you professionally redirect the conversation? What strategies maintain both assertiveness and collegiality?', type: 'professional', skills: ['meeting-facilitation', 'networking-skills'] },
  ],
};

const SPEECH_SCENARIOS = {
  'grade-9': [
    { type: 'informative', topic: 'Explain how a technology you use daily works', duration: '3-5 minutes', requirements: ['clear thesis', 'at least 2 main points', 'visual aid', 'conclusion'], rubric: ['content-accuracy', 'organization', 'delivery', 'visual-aid-quality'] },
    { type: 'informative', topic: 'Present a historical event and its modern relevance', duration: '3-5 minutes', requirements: ['hook opening', 'chronological or topical organization', 'source citations', 'audience connection'], rubric: ['content-accuracy', 'organization', 'delivery', 'audience-engagement'] },
    { type: 'informative', topic: 'Describe a scientific process or natural phenomenon', duration: '3-5 minutes', requirements: ['clear explanation', 'visual demonstration', 'vocabulary definitions', 'summary'], rubric: ['content-accuracy', 'clarity', 'delivery', 'visual-aid-quality'] },
  ],
  'grade-10': [
    { type: 'persuasive', topic: 'Argue for or against a school policy change', duration: '5-7 minutes', requirements: ["Monroe's Motivated Sequence", 'at least 3 evidence sources', 'emotional appeal', 'specific call to action'], rubric: ['argument-strength', 'evidence-quality', 'delivery', 'persuasive-technique'] },
    { type: 'persuasive', topic: 'Convince your community to take action on a local issue', duration: '5-7 minutes', requirements: ['audience analysis', 'problem-solution structure', 'counterargument address', 'memorable conclusion'], rubric: ['argument-strength', 'audience-awareness', 'delivery', 'call-to-action'] },
    { type: 'persuasive', topic: 'Advocate for funding a specific program or initiative', duration: '5-7 minutes', requirements: ['cost-benefit analysis', 'testimonial evidence', 'data visualization', 'urgency establishment'], rubric: ['argument-strength', 'evidence-quality', 'delivery', 'data-presentation'] },
  ],
  'grade-11': [
    { type: 'rhetorical', topic: 'Deliver a speech on a social justice issue using at least three rhetorical devices', duration: '7-10 minutes', requirements: ['anaphora or epistrophe', 'metaphor or analogy', 'strategic pausing', 'varied vocal delivery'], rubric: ['rhetorical-sophistication', 'delivery-mastery', 'content-depth', 'audience-impact'] },
    { type: 'policy-advocacy', topic: 'Present a policy proposal with full plan, advantages, and solvency', duration: '8-10 minutes', requirements: ['plan text', 'at least 2 advantages', 'solvency evidence', 'anticipated objections'], rubric: ['argument-structure', 'evidence-quality', 'delivery', 'policy-analysis'] },
    { type: 'panel-discussion', topic: 'Lead a panel discussion synthesizing multiple expert perspectives on a controversial topic', duration: '10-15 minutes', requirements: ['facilitation questions', 'source synthesis', 'balanced perspectives', 'audience Q&A management'], rubric: ['facilitation-skill', 'synthesis-depth', 'discussion-management', 'audience-engagement'] },
  ],
  'grade-12': [
    { type: 'ted-style', topic: 'Present a big idea that could change how people think about an issue', duration: '10-15 minutes', requirements: ['compelling hook', 'personal narrative', 'research evidence', 'memorable takeaway', 'natural delivery'], rubric: ['idea-originality', 'narrative-craft', 'delivery-mastery', 'audience-impact', 'evidence-integration'] },
    { type: 'interview', topic: 'College admissions interview simulation', duration: '20-30 minutes', requirements: ['STAR method responses', 'school-specific knowledge', 'thoughtful questions', 'professional demeanor'], rubric: ['self-presentation', 'authenticity', 'specificity', 'communication-skill'] },
    { type: 'professional', topic: 'Deliver a board presentation proposing a new initiative', duration: '10-15 minutes', requirements: ['executive summary', 'data-driven argument', 'implementation timeline', 'Q&A preparation'], rubric: ['professionalism', 'argument-clarity', 'data-presentation', 'poise-under-pressure'] },
  ],
};

const LISTENING_EXERCISES = {
  'grade-9': [
    { type: 'paraphrase', prompt: 'A speaker argues: "Schools should start later because adolescent brain development requires more sleep. Studies show teens who sleep 8+ hours perform 20% better academically."', task: 'Paraphrase the speaker\'s main claim and supporting evidence in your own words.', answer: 'The speaker claims schools should have later start times, supported by evidence that teenage brains need more sleep and that well-rested teens show significantly better academic performance.', skill: 'paraphrase-check' },
    { type: 'identify-claim', prompt: 'A classmate says: "Video games aren\'t just entertainment. They improve problem-solving skills, hand-eye coordination, and teamwork. My cousin got better at math after playing strategy games."', task: 'Identify the main claim, the types of evidence used, and any weaknesses in the argument.', answer: 'Main claim: Video games have educational benefits. Evidence: general assertions (problem-solving, coordination, teamwork) and anecdotal evidence (cousin). Weakness: anecdotal evidence is not sufficient; no cited studies.', skill: 'claim-identification' },
    { type: 'question-generation', prompt: 'A presenter states: "Renewable energy is now cheaper than fossil fuels in most markets. The transition to clean energy is inevitable and will create millions of jobs."', task: 'Generate three follow-up questions that would deepen understanding or challenge assumptions.', answer: '1. What specific markets show renewables as cheaper, and are there exceptions? 2. What is the timeline for this transition, and what happens to fossil fuel workers? 3. What evidence supports the "millions of jobs" claim?', skill: 'question-generation' },
    { type: 'bias-detection', prompt: 'A news commentator says: "Obviously, anyone who opposes this policy simply doesn\'t care about children. The statistics are clear, and only the ignorant would disagree."', task: 'Identify at least two forms of bias or logical problems in this statement.', answer: 'Ad hominem attack (opponents "don\'t care about children"), false dilemma (agree or you\'re ignorant), appeal to emotion, no actual statistics cited despite claiming they\'re "clear."', skill: 'bias-detection' },
  ],
  'grade-10': [
    { type: 'fallacy-identification', prompt: 'Speaker A: "We should ban plastic bags." Speaker B: "So you want to destroy small businesses and put thousands of people out of work?"', task: 'Identify the logical fallacy and explain why the reasoning is flawed.', answer: 'Straw man fallacy. Speaker B misrepresents Speaker A\'s position by exaggerating it to an extreme consequence that was never argued. Banning plastic bags does not equate to destroying businesses.', skill: 'logical-fallacies' },
    { type: 'evidence-evaluation', prompt: 'A debater argues: "According to a 2019 study by Harvard researchers published in the New England Journal of Medicine, universal pre-K programs improved long-term educational outcomes by 15% in a sample of 10,000 students across 5 states."', task: 'Evaluate the quality of this evidence. What makes it strong? What questions remain?', answer: 'Strengths: peer-reviewed source, reputable institution, large sample size, multi-state scope, specific statistic. Questions: How was "educational outcomes" defined? What was the control group? Were there demographic variations? Is 2019 data still current?', skill: 'evidence-quality' },
    { type: 'cross-examination', prompt: 'Your opponent has argued that the US should eliminate the minimum wage because it causes unemployment. They cited one economist\'s opinion and a study from 1995.', task: 'Write three cross-examination questions designed to expose weaknesses in their argument.', answer: '1. Is one economist\'s opinion sufficient to overturn established policy? What do other economists say? 2. Your study is from 1995 — have economic conditions changed since then? Are there more recent studies? 3. If we eliminate the minimum wage, what prevents exploitation of workers?', skill: 'cross-examination' },
    { type: 'audience-analysis', prompt: 'You need to give a speech about climate change action to: (A) a group of high school students, (B) a city council meeting, (C) a business conference.', task: 'Describe how your approach, tone, evidence, and call to action would differ for each audience.', answer: 'Students: personal impact, relatable examples, social media activism CTA. City council: local data, budget implications, specific policy proposals. Business: ROI of sustainability, market trends, competitive advantage framing.', skill: 'demographic-awareness' },
  ],
  'grade-11': [
    { type: 'warrant-analysis', prompt: 'A debater argues: "The US should increase foreign aid. Claim: Foreign aid reduces terrorism. Evidence: Countries receiving US aid saw a 12% decrease in terrorist incidents. Warrant: Economic development removes the conditions that breed extremism."', task: 'Analyze the warrant. Is the logical connection between evidence and claim sound? What assumptions does it rely on?', answer: 'The warrant assumes correlation equals causation (aid may not be the cause of decrease), that economic factors are the primary driver of terrorism (ignoring political, religious, ideological factors), and that the pattern will continue. The link between "economic development" and "removing conditions for extremism" needs more support.', skill: 'warrant-analysis' },
    { type: 'synthesis', prompt: 'Source 1 argues remote work increases productivity by 13%. Source 2 says remote workers report higher burnout rates. Source 3 finds hybrid models balance both concerns.', task: 'Synthesize these three sources into a coherent position. Where do they agree and disagree? What conclusion do you draw?', answer: 'All three acknowledge remote work has significant effects on workers. Sources 1 and 2 seem contradictory but may both be true — productivity can increase while wellbeing decreases. Source 3 offers a resolution. Conclusion: A hybrid model may optimize for both productivity and worker wellbeing, though implementation details matter.', skill: 'multi-source-integration' },
    { type: 'rhetorical-analysis', prompt: 'Listen to the opening of JFK\'s inaugural address: "Ask not what your country can do for you — ask what you can do for your country."', task: 'Identify the rhetorical devices used and analyze their effectiveness for delivery.', answer: 'Antimetabole (chiasmus) — reversing the structure creates memorability and balance. The parallel structure creates rhythm suitable for emphatic delivery. The second clause carries more weight due to the reversal, directing the audience toward civic duty. Effective pausing before "ask" in the second clause would amplify the contrast.', skill: 'vocal-variety' },
    { type: 'counterplan-analysis', prompt: 'The affirmative proposes a federal carbon tax. The negative offers a counterplan: state-level cap-and-trade programs. They argue the counterplan solves the same problem without federal overreach.', task: 'Evaluate the counterplan. Does it have competitive advantages? What are its vulnerabilities?', answer: 'Competition: The counterplan is mutually exclusive if you argue federal vs. state implementation. Advantages: avoids federal bureaucracy, allows regional flexibility. Vulnerabilities: inconsistent state implementation, potential race to the bottom, interstate commerce complications, slower adoption timeline.', skill: 'counterplans' },
  ],
  'grade-12': [
    { type: 'epistemological', prompt: 'A speaker argues from a utilitarian framework that maximizing total happiness justifies wealth redistribution. An opponent argues from a libertarian framework that individual property rights are inviolable.', task: 'Analyze how each speaker\'s epistemological framework shapes their argument. Can these frameworks be reconciled?', answer: 'The utilitarian prioritizes outcomes (consequences for aggregate welfare), while the libertarian prioritizes principles (inherent rights regardless of outcomes). Reconciliation is difficult because they disagree on foundational premises: whether rights are instrumental or intrinsic. A possible bridge: Rawlsian justice, which grounds redistribution in rational self-interest behind a "veil of ignorance."', skill: 'epistemological-analysis' },
    { type: 'kritik-response', prompt: 'Your opponent runs a kritik arguing that your policy proposal reinforces systemic racism because it works within existing institutional frameworks that have historically marginalized communities of color.', task: 'Outline two different strategic responses to this kritik and explain when each would be most effective.', answer: '1. Framework argument: Argue that policy debate should evaluate specific policy outcomes, not systemic critiques. Effective when the judge is policy-oriented. 2. Permutation: Argue your plan can coexist with the kritik\'s alternative — you can reform institutions while also acknowledging systemic problems. Effective when the kritik\'s alternative is vague. Also consider: turning the kritik by showing your plan specifically addresses the harms identified.', skill: 'kritik-theory' },
    { type: 'professional-scenario', prompt: 'During a team meeting, two colleagues present conflicting data about a project\'s viability. One uses qualitative customer feedback, the other uses quantitative financial projections. Tension is rising.', task: 'How would you facilitate this discussion to reach a productive outcome? Outline your approach step by step.', answer: 'Step 1: Acknowledge both perspectives as valuable. Step 2: Clarify each person\'s key concern. Step 3: Identify where the data overlaps or diverges. Step 4: Ask what additional information might resolve the disagreement. Step 5: Propose integrating both data types into a combined framework. Step 6: Set a timeline for a follow-up discussion with merged analysis.', skill: 'meeting-facilitation' },
    { type: 'impact-calculus', prompt: 'In a policy debate, the affirmative claims their plan saves 1,000 lives per year. The negative argues the plan costs $50 billion and causes economic slowdown affecting millions. Both sides have credible evidence.', task: 'Perform impact calculus. How should a judge weigh these competing impacts? What frameworks and criteria apply?', answer: 'Consider: magnitude (lives vs. economic impact), probability (how likely each outcome is), timeframe (immediate vs. long-term), reversibility (death is irreversible; economic downturns are cyclical). Framework options: utilitarian (greatest good for greatest number), rights-based (right to life trumps economic concerns), or pragmatic (probability-weighted outcomes). The judge should also evaluate evidence quality and internal link strength for each impact chain.', skill: 'impact-calculus' },
  ],
};

const AUDIENCE_ANALYSIS_EXERCISES = {
  'grade-10': [
    { scenario: 'You are presenting a proposal to extend school library hours to the school board.', audiences: ['school board members', 'fellow students', 'parents'], task: 'For each audience, identify their primary concerns and how you would tailor your argument.', skill: 'demographic-awareness' },
    { scenario: 'You are advocating for a new recycling program.', audiences: ['environmental club', 'city budget committee', 'local business owners'], task: 'Describe how your evidence, tone, and call to action would differ for each group.', skill: 'tone-adaptation' },
  ],
  'grade-11': [
    { scenario: 'You must present the same research findings about social media\'s effect on mental health to three audiences.', audiences: ['academic conference', 'parent workshop', 'student assembly'], task: 'Outline your presentation approach for each, including vocabulary level, evidence type, and delivery style.', skill: 'purpose-alignment' },
  ],
  'grade-12': [
    { scenario: 'You are pitching a startup idea to different stakeholders.', audiences: ['venture capitalists', 'potential users', 'technical team', 'media journalists'], task: 'Create a one-paragraph pitch tailored to each audience, highlighting what each group cares about most.', skill: 'networking-skills' },
  ],
};

// ── Exercise Banks (keyed by grade then subskill) ──

const EXERCISE_BANKS = {
  'grade-9': {
    'discussion-moves': {
      items: [
        { prompt: 'A classmate says: "I think the theme of the novel is loneliness." How would you BUILD on this idea?', options: ['That\'s wrong.', 'Building on that, I notice the author isolates the protagonist in every chapter, reinforcing that theme.', 'I agree.'], answer: 'Building on that, I notice the author isolates the protagonist in every chapter, reinforcing that theme.', rule: 'Use "Building on..." to extend another person\'s idea with evidence.' },
        { prompt: 'Which discussion move CHALLENGES an idea respectfully?', options: ['You\'re not making sense.', 'I see it differently because the text on page 45 suggests the opposite.', 'Whatever.'], answer: 'I see it differently because the text on page 45 suggests the opposite.', rule: 'Challenge ideas with evidence, not personal attacks.' },
        { prompt: 'Which response best SYNTHESIZES two different viewpoints?', options: ['Both of you are wrong.', 'It seems like Maya is focusing on the economic impact while Jayden is emphasizing the moral dimension. Both are relevant.', 'I don\'t know who to agree with.'], answer: 'It seems like Maya is focusing on the economic impact while Jayden is emphasizing the moral dimension. Both are relevant.', rule: 'Synthesis connects multiple perspectives without dismissing either.' },
        { prompt: 'What is the purpose of a CLARIFYING question in discussion?', options: ['To show the speaker is wrong', 'To seek deeper understanding of the speaker\'s point', 'To change the subject'], answer: 'To seek deeper understanding of the speaker\'s point', rule: 'Clarifying questions deepen understanding, not attack the speaker.' },
        { prompt: 'Which is a strong EVIDENCE-BASED discussion contribution?', options: ['I just feel like the character is good.', 'On page 112, the character sacrifices his safety for others, which demonstrates his moral courage.', 'Everyone knows the character is good.'], answer: 'On page 112, the character sacrifices his safety for others, which demonstrates his moral courage.', rule: 'Ground discussion contributions in specific textual evidence.' },
        { prompt: 'How should you REDIRECT a discussion that has gone off topic?', options: ['Stop talking about that!', 'That\'s interesting, but I\'d like to return to the question about the author\'s use of symbolism on page 78.', 'This is boring.'], answer: 'That\'s interesting, but I\'d like to return to the question about the author\'s use of symbolism on page 78.', rule: 'Redirect respectfully by acknowledging the tangent and refocusing.' },
      ],
    },
    'text-evidence': {
      items: [
        { prompt: 'Which response best uses text evidence in a Socratic seminar?', options: ['I think the character is brave.', 'The character demonstrates bravery when she says on page 34, "I will not stand by while injustice prevails."', 'The book is about bravery.'], answer: 'The character demonstrates bravery when she says on page 34, "I will not stand by while injustice prevails."', rule: 'Cite specific pages and quotes to support your claims.' },
        { prompt: 'What makes a strong textual citation?', options: ['It mentions the book title', 'It includes the specific passage, page number, and connects the quote to the argument', 'It uses big words'], answer: 'It includes the specific passage, page number, and connects the quote to the argument', rule: 'Strong citations include source location and explicit connection to your claim.' },
        { prompt: 'How should you introduce a quotation in discussion?', options: ['The author says...', 'As the author argues on page 67, "[quote]," which demonstrates...', 'Quote: "[text]"'], answer: 'As the author argues on page 67, "[quote]," which demonstrates...', rule: 'Introduce quotes with context and follow with analysis.' },
        { prompt: 'When a classmate asks "Where does the text support that?", you should:', options: ['Say "I just know"', 'Point to a specific passage and explain how it supports your claim', 'Change your argument'], answer: 'Point to a specific passage and explain how it supports your claim', rule: 'Always be prepared to point to specific textual evidence.' },
        { prompt: 'Which is the strongest use of evidence?', options: ['The book mentions war.', 'On page 89, the author juxtaposes the peaceful village with battlefield imagery, suggesting war corrupts innocence.', 'War is a theme in many books.'], answer: 'On page 89, the author juxtaposes the peaceful village with battlefield imagery, suggesting war corrupts innocence.', rule: 'Strong evidence use connects specific textual details to analytical claims.' },
      ],
    },
    'building-on-others': {
      items: [
        { prompt: 'A peer argues the poem is about loss. You notice it could also represent transformation. How do you respond?', options: ['No, you\'re wrong.', 'I agree with the idea of loss, and I\'d add that the loss may represent transformation — the imagery of seasons changing on line 5 supports both readings.', 'I disagree completely.'], answer: 'I agree with the idea of loss, and I\'d add that the loss may represent transformation — the imagery of seasons changing on line 5 supports both readings.', rule: 'Build on others by acknowledging their point and extending it.' },
        { prompt: 'What phrase best introduces building on someone\'s idea?', options: ['Actually...', 'To add to what Maria said...', 'Maria is wrong because...'], answer: 'To add to what Maria said...', rule: 'Use collaborative language like "Adding to..." or "Building on..."' },
        { prompt: 'Building on others requires:', options: ['Repeating exactly what they said', 'Listening carefully and connecting your idea to theirs', 'Waiting to say your own unrelated point'], answer: 'Listening carefully and connecting your idea to theirs', rule: 'Active listening is the foundation of building on others\' ideas.' },
        { prompt: 'Which response best builds on a peer\'s analysis of symbolism?', options: ['I also noticed symbolism.', 'Expanding on your point about the river as a symbol of time, I noticed the author also uses the bridge as a symbol of connection between past and present.', 'Symbolism is common in literature.'], answer: 'Expanding on your point about the river as a symbol of time, I noticed the author also uses the bridge as a symbol of connection between past and present.', rule: 'Extend by adding a related but new observation to the existing analysis.' },
      ],
    },
    'structure-organization': {
      items: [
        { prompt: 'What is the correct order for an informative speech?', options: ['Body, Introduction, Conclusion', 'Introduction (hook + thesis), Body (main points with evidence), Conclusion (summary + significance)', 'Start with the conclusion for impact'], answer: 'Introduction (hook + thesis), Body (main points with evidence), Conclusion (summary + significance)', rule: 'Informative speeches follow introduction-body-conclusion structure.' },
        { prompt: 'Which is the strongest thesis statement for an informative speech about sleep?', options: ['Sleep is important.', 'Sleep deprivation among teenagers leads to decreased academic performance, impaired mental health, and increased accident risk.', 'I\'m going to talk about sleep.'], answer: 'Sleep deprivation among teenagers leads to decreased academic performance, impaired mental health, and increased accident risk.', rule: 'A strong thesis previews your main points specifically.' },
        { prompt: 'What makes an effective transition between main points?', options: ['Just start the next point', '"Now that we\'ve seen how sleep affects academics, let\'s examine its impact on mental health."', 'Say "next"'], answer: '"Now that we\'ve seen how sleep affects academics, let\'s examine its impact on mental health."', rule: 'Effective transitions summarize the previous point and preview the next.' },
        { prompt: 'Which hook would best open an informative speech about ocean pollution?', options: ['Today I will talk about pollution.', 'By the year 2050, there will be more plastic in the ocean than fish. Imagine a world where every trip to the beach means walking on trash.', 'Pollution is bad.'], answer: 'By the year 2050, there will be more plastic in the ocean than fish. Imagine a world where every trip to the beach means walking on trash.', rule: 'Hooks should capture attention with startling facts, questions, or vivid imagery.' },
        { prompt: 'What should an informative speech conclusion include?', options: ['Just say "thank you"', 'A summary of main points, restatement of thesis, and a memorable closing thought', 'New information not covered in the body'], answer: 'A summary of main points, restatement of thesis, and a memorable closing thought', rule: 'Conclusions reinforce your message without introducing new content.' },
      ],
    },
    'clarity-delivery': {
      items: [
        { prompt: 'Which delivery technique helps the audience follow your speech?', options: ['Speaking as fast as possible', 'Using clear signposts like "first," "second," and "finally"', 'Reading directly from notes without looking up'], answer: 'Using clear signposts like "first," "second," and "finally"', rule: 'Signpost language helps audiences track your organization.' },
        { prompt: 'What should you do if you lose your place during a speech?', options: ['Apologize repeatedly', 'Pause briefly, glance at your notes, and continue smoothly', 'Start over from the beginning'], answer: 'Pause briefly, glance at your notes, and continue smoothly', rule: 'Brief pauses are natural; the audience likely won\'t notice.' },
        { prompt: 'Eye contact during a presentation should be:', options: ['Fixed on one person the whole time', 'Distributed across different sections of the audience', 'Focused on the back wall'], answer: 'Distributed across different sections of the audience', rule: 'Use the "lighthouse technique" — sweep your gaze across sections.' },
        { prompt: 'What is the ideal speaking pace for clarity?', options: ['As fast as possible to fit more content', 'Varied — slower for key points, moderate for transitions, with strategic pauses', 'Extremely slow throughout'], answer: 'Varied — slower for key points, moderate for transitions, with strategic pauses', rule: 'Pace variety maintains audience attention and emphasizes key ideas.' },
        { prompt: 'When presenting complex information, you should:', options: ['Use as much jargon as possible', 'Define key terms and use analogies the audience can relate to', 'Assume the audience already knows everything'], answer: 'Define key terms and use analogies the audience can relate to', rule: 'Adapt vocabulary and use analogies to make complex ideas accessible.' },
      ],
    },
    'visual-aids': {
      items: [
        { prompt: 'What makes an effective presentation slide?', options: ['Full paragraphs of text', 'Key phrases, relevant images, and minimal text (6x6 rule)', 'Decorative animations on every element'], answer: 'Key phrases, relevant images, and minimal text (6x6 rule)', rule: 'Follow the 6x6 rule: no more than 6 words per line, 6 lines per slide.' },
        { prompt: 'When should you refer to a visual aid?', options: ['Never mention it', 'Explicitly direct the audience\'s attention: "As you can see in this chart..."', 'Only if someone asks'], answer: 'Explicitly direct the audience\'s attention: "As you can see in this chart..."', rule: 'Always verbally connect your visual aid to your spoken content.' },
        { prompt: 'Which visual aid best supports a speech about population growth?', options: ['A paragraph from Wikipedia', 'A line graph showing population trends over time with clear labels', 'A random stock photo'], answer: 'A line graph showing population trends over time with clear labels', rule: 'Choose visuals that directly illustrate your data or concept.' },
      ],
    },
    'paraphrase-check': {
      items: [
        { prompt: 'A speaker says: "The educational system prioritizes standardized testing over creative thinking, which ultimately harms student development." Paraphrase this.', options: ['Testing is bad for students.', 'The speaker argues that schools focus too much on standardized tests at the expense of creativity, which negatively affects how students grow and learn.', 'Schools should stop testing.'], answer: 'The speaker argues that schools focus too much on standardized tests at the expense of creativity, which negatively affects how students grow and learn.', rule: 'Paraphrasing restates the idea in your own words while preserving the full meaning.' },
        { prompt: 'What is the purpose of paraphrasing before responding in a discussion?', options: ['To waste time', 'To confirm you understood the speaker correctly before adding your perspective', 'To show you\'re smarter'], answer: 'To confirm you understood the speaker correctly before adding your perspective', rule: 'Paraphrase checks prevent misunderstanding and show respect.' },
        { prompt: 'Which paraphrase best captures: "Democracy requires an informed citizenry, which is why press freedom is essential"?', options: ['We need newspapers.', 'The speaker connects democracy\'s success to having well-informed citizens and argues that a free press is necessary to achieve this.', 'Freedom is important.'], answer: 'The speaker connects democracy\'s success to having well-informed citizens and argues that a free press is necessary to achieve this.', rule: 'Effective paraphrases capture both the claim and the reasoning.' },
      ],
    },
    'question-generation': {
      items: [
        { prompt: 'After hearing a speech about renewable energy, which follow-up question best deepens understanding?', options: ['Did you like making this speech?', 'What are the primary barriers to widespread adoption of solar energy in developing nations?', 'Is renewable energy good?'], answer: 'What are the primary barriers to widespread adoption of solar energy in developing nations?', rule: 'Strong follow-up questions probe specifics and deepen analysis.' },
        { prompt: 'Which type of question challenges assumptions?', options: ['"When was this study published?"', '"What evidence would change your mind about this position?"', '"Can you repeat that?"'], answer: '"What evidence would change your mind about this position?"', rule: 'Assumption-challenging questions test the limits of an argument.' },
        { prompt: 'Which question would best follow up on a claim that "technology always improves education"?', options: ['Do you like technology?', 'Can you provide a specific example where technology failed to improve educational outcomes?', 'What is technology?'], answer: 'Can you provide a specific example where technology failed to improve educational outcomes?', rule: 'Challenge absolute claims by asking for counterexamples.' },
      ],
    },
    'note-taking': {
      items: [
        { prompt: 'What is the Cornell note-taking method?', options: ['Writing everything word for word', 'Dividing the page into cues, notes, and summary sections for organized review', 'Only writing down things you disagree with'], answer: 'Dividing the page into cues, notes, and summary sections for organized review', rule: 'Cornell notes divide the page into three sections: cue column, notes, and summary.' },
        { prompt: 'When taking notes during a speech, you should focus on:', options: ['Every single word', 'Main claims, key evidence, and questions that arise', 'Only the parts you agree with'], answer: 'Main claims, key evidence, and questions that arise', rule: 'Focus on capturing the argument structure, not transcribing.' },
        { prompt: 'What is "flowing" in debate?', options: ['Speaking smoothly', 'A note-taking system that tracks arguments in columns across speeches', 'Going with the flow of the conversation'], answer: 'A note-taking system that tracks arguments in columns across speeches', rule: 'Flowing tracks which arguments have been addressed and which are "dropped."' },
      ],
    },
    'claim-identification': {
      items: [
        { prompt: 'In the statement "Schools should adopt year-round calendars because students lose knowledge during summer break, as shown by Cooper\'s 1996 meta-analysis," identify the claim.', options: ['Students lose knowledge during summer break', 'Cooper\'s 1996 meta-analysis', 'Schools should adopt year-round calendars'], answer: 'Schools should adopt year-round calendars', rule: 'The claim is the main assertion the speaker wants you to accept.' },
        { prompt: 'What is the difference between a claim and evidence?', options: ['They are the same thing', 'A claim is the assertion; evidence is the support for that assertion', 'Evidence is more important than claims'], answer: 'A claim is the assertion; evidence is the support for that assertion', rule: 'Claims state a position; evidence provides proof or support.' },
        { prompt: 'Which statement is a CLAIM rather than evidence?', options: ['A 2023 study found 67% of teens report anxiety', 'Social media companies should be required to verify user ages', 'The Pew Research Center surveyed 1,500 participants'], answer: 'Social media companies should be required to verify user ages', rule: 'Claims express a position or judgment; evidence provides factual support.' },
      ],
    },
    'evidence-assessment': {
      items: [
        { prompt: 'Which is the strongest type of evidence for a formal discussion?', options: ['A personal anecdote', 'A peer-reviewed study with a large sample size', 'A celebrity endorsement'], answer: 'A peer-reviewed study with a large sample size', rule: 'Peer-reviewed research with large samples provides the most credible evidence.' },
        { prompt: 'What makes evidence RELEVANT?', options: ['It comes from a famous person', 'It directly supports or relates to the specific claim being made', 'It is recent'], answer: 'It directly supports or relates to the specific claim being made', rule: 'Relevant evidence has a clear logical connection to the claim.' },
        { prompt: 'A speaker cites "a study" without naming the source, sample size, or date. This evidence is:', options: ['Strong because studies are always reliable', 'Weak because it lacks specificity and cannot be verified', 'Moderate because it mentions research'], answer: 'Weak because it lacks specificity and cannot be verified', rule: 'Vague citations are weak evidence; specifics enable verification.' },
      ],
    },
    'bias-detection': {
      items: [
        { prompt: 'A speaker says: "Everyone knows that..." This phrase signals:', options: ['Strong evidence', 'Bandwagon fallacy or unsupported assumption', 'Expert consensus'], answer: 'Bandwagon fallacy or unsupported assumption', rule: '"Everyone knows" is often a substitute for actual evidence.' },
        { prompt: 'How can you detect bias in a speaker\'s argument?', options: ['Check if you agree with them', 'Look for one-sided evidence, loaded language, and omission of counterarguments', 'Bias is impossible to detect'], answer: 'Look for one-sided evidence, loaded language, and omission of counterarguments', rule: 'Bias indicators include selective evidence, emotional language, and ignoring opposition.' },
        { prompt: 'A speaker only presents evidence supporting their position and ignores contradicting studies. This is an example of:', options: ['Thorough research', 'Cherry-picking or confirmation bias', 'Strong argumentation'], answer: 'Cherry-picking or confirmation bias', rule: 'Credible speakers acknowledge and address contradicting evidence.' },
      ],
    },
    'turn-taking': {
      items: [
        { prompt: 'In a formal discussion, when should you speak?', options: ['Whenever you want, even if someone else is talking', 'When recognized by the facilitator or after the current speaker finishes their point', 'Only when directly asked a question'], answer: 'When recognized by the facilitator or after the current speaker finishes their point', rule: 'Formal discussions require respecting speaking turns and facilitator management.' },
        { prompt: 'What should you do if you notice one person is dominating the discussion?', options: ['Let them continue', 'Politely invite others: "I\'d like to hear what others think about this point."', 'Talk over them'], answer: 'Politely invite others: "I\'d like to hear what others think about this point."', rule: 'Ensure equity by inviting quieter participants to share.' },
      ],
    },
    'respectful-disagreement': {
      items: [
        { prompt: 'Which response models respectful disagreement?', options: ['That\'s the dumbest thing I\'ve heard.', 'I understand your perspective, but I reach a different conclusion because the evidence on page 42 suggests...', 'Whatever.'], answer: 'I understand your perspective, but I reach a different conclusion because the evidence on page 42 suggests...', rule: 'Respectful disagreement acknowledges the other view and responds with evidence.' },
        { prompt: 'When disagreeing in a Socratic seminar, you should attack:', options: ['The person making the argument', 'The idea or argument itself, using evidence', 'Both the person and the idea'], answer: 'The idea or argument itself, using evidence', rule: 'Attack arguments, not people. This is called "ad rem" (to the thing).' },
      ],
    },
    'synthesizing-views': {
      items: [
        { prompt: 'What does it mean to synthesize in a discussion?', options: ['To agree with everyone', 'To connect and integrate multiple perspectives into a more complete understanding', 'To summarize what one person said'], answer: 'To connect and integrate multiple perspectives into a more complete understanding', rule: 'Synthesis creates new understanding by connecting different viewpoints.' },
        { prompt: 'Which statement best synthesizes two opposing views on school start times?', options: ['Both sides have good points.', 'While the health research supports later start times, the logistical concerns about bus schedules and after-school activities suggest we need a phased implementation approach.', 'One side is right and one is wrong.'], answer: 'While the health research supports later start times, the logistical concerns about bus schedules and after-school activities suggest we need a phased implementation approach.', rule: 'Effective synthesis acknowledges tensions and proposes integrative solutions.' },
      ],
    },
    'slide-design': {
      items: [
        { prompt: 'Which slide design principle is most important for audience comprehension?', options: ['Using as many fonts as possible for variety', 'Maintaining visual consistency with limited text and clear hierarchy', 'Filling every space with information'], answer: 'Maintaining visual consistency with limited text and clear hierarchy', rule: 'Consistency and simplicity help audiences focus on your message.' },
        { prompt: 'The 6x6 rule for slides means:', options: ['Use 6 slides maximum', 'No more than 6 bullet points per slide, 6 words per bullet', 'Present for exactly 6 minutes'], answer: 'No more than 6 bullet points per slide, 6 words per bullet', rule: 'The 6x6 rule prevents text-heavy slides that distract from speaking.' },
      ],
    },
    'audio-visual-integration': {
      items: [
        { prompt: 'When showing a video clip during a presentation, you should:', options: ['Let it speak for itself', 'Introduce it with context, then debrief by connecting it to your argument', 'Apologize for using multimedia'], answer: 'Introduce it with context, then debrief by connecting it to your argument', rule: 'Always frame multimedia with introduction and analysis.' },
      ],
    },
    'digital-presentation': {
      items: [
        { prompt: 'What is the most important technical consideration before a digital presentation?', options: ['Having the fanciest animations', 'Testing all technology (projector, audio, links) beforehand', 'Using the newest software'], answer: 'Testing all technology (projector, audio, links) beforehand', rule: 'Technical preparation prevents disruptions during your presentation.' },
      ],
    },
  },
  'grade-10': {
    'monroes-sequence': {
      items: [
        { prompt: 'What is the correct order of Monroe\'s Motivated Sequence?', options: ['Need, Attention, Action, Satisfaction, Visualization', 'Attention, Need, Satisfaction, Visualization, Action', 'Action, Need, Attention, Visualization, Satisfaction'], answer: 'Attention, Need, Satisfaction, Visualization, Action', rule: 'Monroe\'s sequence: Attention, Need, Satisfaction, Visualization, Action.' },
        { prompt: 'In the "Visualization" step, you should:', options: ['Show your visual aids', 'Paint a picture of the future WITH your solution and WITHOUT it', 'Visualize yourself succeeding'], answer: 'Paint a picture of the future WITH your solution and WITHOUT it', rule: 'Visualization contrasts the positive future (with solution) and negative future (without).' },
        { prompt: 'Which is the strongest "Attention" step opening?', options: ['Today I will talk about hunger.', 'Right now, a child dies of hunger every 10 seconds. In the time it takes me to give this speech, 36 children will die.', 'Hunger is a problem.'], answer: 'Right now, a child dies of hunger every 10 seconds. In the time it takes me to give this speech, 36 children will die.', rule: 'The Attention step should shock, provoke, or emotionally engage the audience.' },
        { prompt: 'The "Need" step establishes:', options: ['What the audience needs to do', 'That a significant problem exists that affects the audience', 'Your credentials as a speaker'], answer: 'That a significant problem exists that affects the audience', rule: 'The Need step proves the problem is real, significant, and relevant to the audience.' },
        { prompt: 'The "Action" step should:', options: ['Be vague about what to do', 'Give the audience a specific, achievable action they can take immediately', 'Repeat the introduction'], answer: 'Give the audience a specific, achievable action they can take immediately', rule: 'Effective calls to action are specific, concrete, and immediately actionable.' },
      ],
    },
    'emotional-appeal': {
      items: [
        { prompt: 'Pathos (emotional appeal) is most effective when:', options: ['Used instead of evidence', 'Combined with logos (logic) and ethos (credibility) to strengthen an evidence-based argument', 'Used to manipulate the audience\'s feelings'], answer: 'Combined with logos (logic) and ethos (credibility) to strengthen an evidence-based argument', rule: 'Pathos supports but should not replace logical argument.' },
        { prompt: 'Which technique creates emotional connection in a persuasive speech?', options: ['Citing statistics only', 'Telling a specific person\'s story that illustrates the broader issue', 'Using abstract language'], answer: 'Telling a specific person\'s story that illustrates the broader issue', rule: 'Personal narratives create empathy and make abstract issues concrete.' },
        { prompt: 'When is emotional appeal inappropriate?', options: ['In persuasive speeches', 'When it replaces evidence or manipulates through fear without factual basis', 'It is always appropriate'], answer: 'When it replaces evidence or manipulates through fear without factual basis', rule: 'Emotional appeals should supplement, not substitute for, evidence.' },
      ],
    },
    'call-to-action': {
      items: [
        { prompt: 'Which is the strongest call to action?', options: ['Do something about this.', 'Text CHANGE to 55555 right now to donate $5 to the local food bank.', 'Think about what I said.'], answer: 'Text CHANGE to 55555 right now to donate $5 to the local food bank.', rule: 'Strong CTAs are specific, immediate, and achievable.' },
        { prompt: 'A call to action should be placed:', options: ['At the very beginning', 'At the end, after you\'ve built your case through need, satisfaction, and visualization', 'In the middle of the speech'], answer: 'At the end, after you\'ve built your case through need, satisfaction, and visualization', rule: 'Build the case first; the CTA is the culmination of your argument.' },
      ],
    },
    'value-criterion': {
      items: [
        { prompt: 'In Lincoln-Douglas debate, what is a "value"?', options: ['How much the argument is worth', 'The core principle (e.g., justice, liberty) that your case upholds', 'Your personal values'], answer: 'The core principle (e.g., justice, liberty) that your case upholds', rule: 'The value is the ideal standard your case defends.' },
        { prompt: 'What is the role of the "criterion" in LD debate?', options: ['It is the topic of the debate', 'It is the standard used to measure whether the value is achieved', 'It is the judge\'s scoring system'], answer: 'It is the standard used to measure whether the value is achieved', rule: 'The criterion provides a measurable way to evaluate the value.' },
        { prompt: 'For the resolution "Civil disobedience is justified in a democracy," a strong AFF value-criterion pair could be:', options: ['Value: Money. Criterion: Economic growth', 'Value: Justice. Criterion: Protecting individual rights against unjust laws', 'Value: Popularity. Criterion: Public opinion polls'], answer: 'Value: Justice. Criterion: Protecting individual rights against unjust laws', rule: 'Value-criterion pairs must logically connect to the resolution.' },
        { prompt: 'Why must the criterion link to the value?', options: ['It doesn\'t need to', 'Because the criterion is the mechanism through which you prove the value is achieved or upheld', 'For decorative purposes'], answer: 'Because the criterion is the mechanism through which you prove the value is achieved or upheld', rule: 'The criterion bridges your contentions to your value.' },
      ],
    },
    'constructive-speech': {
      items: [
        { prompt: 'An LD constructive speech should include:', options: ['Only attacks on the opponent', 'Value, criterion, and contentions with evidence and warrants', 'A summary of the debate'], answer: 'Value, criterion, and contentions with evidence and warrants', rule: 'Constructives build your case: value + criterion + contentions with support.' },
        { prompt: 'What is a "contention" in debate?', options: ['A disagreement with the judge', 'A main argument that supports your position, with evidence and reasoning', 'The same as a value'], answer: 'A main argument that supports your position, with evidence and reasoning', rule: 'Contentions are your main arguments, each with evidence and warrants.' },
        { prompt: 'The Affirmative Constructive in LD is how long?', options: ['3 minutes', '6 minutes', '10 minutes'], answer: '6 minutes', rule: 'The AC in LD is 6 minutes — use it to present your full case.' },
      ],
    },
    'cross-examination': {
      items: [
        { prompt: 'The primary purpose of cross-examination is to:', options: ['Give a second speech', 'Clarify your opponent\'s arguments and expose weaknesses for later use', 'Be aggressive and intimidating'], answer: 'Clarify your opponent\'s arguments and expose weaknesses for later use', rule: 'CX is strategic: clarify, set traps, and expose weaknesses.' },
        { prompt: 'Which is the best CX question strategy?', options: ['Ask yes/no questions that lead to a concession', 'Ask open-ended questions that let your opponent explain', 'Ask about their personal life'], answer: 'Ask yes/no questions that lead to a concession', rule: 'Closed questions in CX control the narrative and build toward concessions.' },
        { prompt: 'If your opponent gives a long-winded CX answer, you should:', options: ['Let them talk as long as they want', 'Politely interrupt: "Thank you, but my question was specifically about..."', 'Get angry'], answer: 'Politely interrupt: "Thank you, but my question was specifically about..."', rule: 'Control CX by politely redirecting to your specific question.' },
      ],
    },
    'logical-fallacies': {
      items: [
        { prompt: '"We should ban violent video games because the next thing you know, kids will be committing real violence." This is a:', options: ['Valid argument', 'Slippery slope fallacy', 'Straw man fallacy'], answer: 'Slippery slope fallacy', rule: 'Slippery slope assumes one event will inevitably lead to extreme consequences without evidence.' },
        { prompt: '"You can\'t trust her argument about climate change — she\'s not a scientist." This is a:', options: ['Ad hominem fallacy', 'Straw man fallacy', 'Valid point'], answer: 'Ad hominem fallacy', rule: 'Ad hominem attacks the person rather than the argument.' },
        { prompt: '"Either you support this policy or you don\'t care about children." This is a:', options: ['Logical conclusion', 'False dilemma (either/or fallacy)', 'Appeal to authority'], answer: 'False dilemma (either/or fallacy)', rule: 'False dilemma presents only two options when more exist.' },
        { prompt: '"9 out of 10 dentists recommend this toothpaste." This could be an example of:', options: ['Solid evidence', 'Appeal to authority / misleading statistic', 'Hasty generalization'], answer: 'Appeal to authority / misleading statistic', rule: 'Question the source, methodology, and context of statistical claims.' },
        { prompt: '"My opponent wants to defund the military." (Your opponent actually proposed a 2% budget reduction.) This is a:', options: ['Accurate summary', 'Straw man fallacy', 'Red herring'], answer: 'Straw man fallacy', rule: 'Straw man misrepresents the opponent\'s actual position to make it easier to attack.' },
      ],
    },
    'evidence-quality': {
      items: [
        { prompt: 'Rank these evidence sources from strongest to weakest for an academic debate:', options: ['Blog post > peer-reviewed study > news article', 'Peer-reviewed study > news article from reputable source > blog post', 'They are all equally strong'], answer: 'Peer-reviewed study > news article from reputable source > blog post', rule: 'Peer-reviewed research is the gold standard; source credibility matters.' },
        { prompt: 'What makes evidence "sufficient"?', options: ['One example proves the point', 'Multiple, varied sources that consistently support the claim', 'It comes from an expert'], answer: 'Multiple, varied sources that consistently support the claim', rule: 'Sufficient evidence requires multiple corroborating sources.' },
        { prompt: 'When evaluating evidence, the acronym RAVEN stands for:', options: ['Read, Analyze, Verify, Explain, Note', 'Reputation, Ability to observe, Vested interest, Expertise, Neutrality', 'Research, Ask, View, Examine, Negotiate'], answer: 'Reputation, Ability to observe, Vested interest, Expertise, Neutrality', rule: 'RAVEN evaluates source credibility across five dimensions.' },
      ],
    },
    'counterargument-strength': {
      items: [
        { prompt: 'A strong counterargument does what?', options: ['Ignores the opponent\'s evidence', 'Directly addresses the opponent\'s strongest point and provides evidence for an alternative conclusion', 'Changes the subject'], answer: 'Directly addresses the opponent\'s strongest point and provides evidence for an alternative conclusion', rule: 'Strong counterarguments engage with the opponent\'s best evidence, not their weakest.' },
        { prompt: 'The "steel man" technique means:', options: ['Making your opponent\'s argument weaker', 'Presenting the strongest version of your opponent\'s argument before responding to it', 'Using strong language'], answer: 'Presenting the strongest version of your opponent\'s argument before responding to it', rule: 'Steel-manning shows intellectual honesty and makes your rebuttal more convincing.' },
      ],
    },
    'research-evidence': {
      items: [
        { prompt: 'When preparing for a debate, your evidence should:', options: ['Only support your side', 'Include research for both sides so you can anticipate and respond to opponent arguments', 'Come from a single source'], answer: 'Include research for both sides so you can anticipate and respond to opponent arguments', rule: 'Research both sides to prepare for rebuttals and cross-examination.' },
        { prompt: 'What is an "evidence card" in debate?', options: ['A playing card used in debate games', 'A formatted piece of evidence with tag, citation, and body text ready to read in a round', 'A card the judge gives for good evidence'], answer: 'A formatted piece of evidence with tag, citation, and body text ready to read in a round', rule: 'Evidence cards include: tag (summary), citation (source), and body (quoted text).' },
      ],
    },
    'case-construction': {
      items: [
        { prompt: 'A well-constructed debate case should include:', options: ['Only emotional appeals', 'Definitions, framework (value/criterion), contentions with evidence, and impact analysis', 'A list of facts'], answer: 'Definitions, framework (value/criterion), contentions with evidence, and impact analysis', rule: 'Cases need structure: definitions, framework, contentions, evidence, and impacts.' },
        { prompt: 'Why are definitions important in a debate case?', options: ['They fill time', 'They establish the scope and meaning of key terms in the resolution to prevent definitional disputes', 'They are optional'], answer: 'They establish the scope and meaning of key terms in the resolution to prevent definitional disputes', rule: 'Definitions frame the debate and prevent your opponent from shifting ground.' },
      ],
    },
    'flowing-basics': {
      items: [
        { prompt: 'In debate flowing, each column represents:', options: ['A different topic', 'A different speech in the round (1AC, 1NC, etc.)', 'A different debater\'s opinion'], answer: 'A different speech in the round (1AC, 1NC, etc.)', rule: 'Flow columns track arguments through each speech in chronological order.' },
        { prompt: 'A "dropped" argument in debate means:', options: ['An argument that was poorly made', 'An argument the opponent failed to respond to, which typically counts against them', 'An argument the judge didn\'t hear'], answer: 'An argument the opponent failed to respond to, which typically counts against them', rule: 'Dropped arguments are often considered conceded in competitive debate.' },
      ],
    },
    'demographic-awareness': {
      items: [
        { prompt: 'Audience analysis should consider:', options: ['Only age', 'Age, knowledge level, values, beliefs, attitudes toward your topic, and cultural background', 'Only whether they agree with you'], answer: 'Age, knowledge level, values, beliefs, attitudes toward your topic, and cultural background', rule: 'Thorough audience analysis considers multiple demographic and psychographic factors.' },
        { prompt: 'When speaking to an audience that likely disagrees with you, you should:', options: ['Be more aggressive', 'Find common ground first, acknowledge their concerns, then build your argument', 'Avoid the topic'], answer: 'Find common ground first, acknowledge their concerns, then build your argument', rule: 'Common ground and acknowledgment build credibility with hostile audiences.' },
      ],
    },
    'tone-adaptation': {
      items: [
        { prompt: 'How should your tone differ between a school assembly and a formal debate round?', options: ['Use the same tone for both', 'Assembly: conversational, energetic, accessible. Debate: precise, measured, evidence-focused.', 'Be formal in both'], answer: 'Assembly: conversational, energetic, accessible. Debate: precise, measured, evidence-focused.', rule: 'Match tone to context: casual settings allow more energy; formal settings require precision.' },
      ],
    },
    'purpose-alignment': {
      items: [
        { prompt: 'When your purpose is to inform, your primary strategy should be:', options: ['Emotional manipulation', 'Clear explanation with organized supporting details and defined terms', 'Aggressive argumentation'], answer: 'Clear explanation with organized supporting details and defined terms', rule: 'Informative speaking prioritizes clarity and comprehension over persuasion.' },
      ],
    },
    'persuasive-visuals': {
      items: [
        { prompt: 'Which visual is most persuasive for a speech about poverty?', options: ['A spreadsheet of data', 'A photograph of affected individuals paired with key statistics', 'A generic clipart image'], answer: 'A photograph of affected individuals paired with key statistics', rule: 'Combine emotional imagery with data for maximum persuasive impact.' },
      ],
    },
    'data-visualization': {
      items: [
        { prompt: 'When should you use a bar chart vs. a line graph?', options: ['They are interchangeable', 'Bar charts compare categories; line graphs show trends over time', 'Always use pie charts'], answer: 'Bar charts compare categories; line graphs show trends over time', rule: 'Choose chart types that match your data story.' },
      ],
    },
    'media-credibility': {
      items: [
        { prompt: 'How do you evaluate whether a media source is credible for a presentation?', options: ['Check if it looks professional', 'Verify the author\'s expertise, check for citations, look for bias, and cross-reference with other sources', 'If it\'s on the internet, it\'s credible'], answer: 'Verify the author\'s expertise, check for citations, look for bias, and cross-reference with other sources', rule: 'Use the CRAAP test: Currency, Relevance, Authority, Accuracy, Purpose.' },
      ],
    },
  },
  'grade-11': {
    'plan-text': {
      items: [
        { prompt: 'A policy debate plan text must include:', options: ['Just the idea', 'Agent of action, mandate (what specifically will be done), enforcement mechanism, funding source, and timeline', 'A catchy slogan'], answer: 'Agent of action, mandate (what specifically will be done), enforcement mechanism, funding source, and timeline', rule: 'Plan texts must be specific and implementable.' },
        { prompt: 'Why must the agent of action be specified in a plan text?', options: ['It doesn\'t matter', 'Because it clarifies who implements the policy and determines the scope of fiat', 'For style points'], answer: 'Because it clarifies who implements the policy and determines the scope of fiat', rule: 'The agent determines jurisdictional authority and implementation feasibility.' },
        { prompt: '"The United States federal government should substantially increase funding for renewable energy research through the Department of Energy, funded by redirecting fossil fuel subsidies, effective January 2026." This plan text is:', options: ['Too vague', 'Well-structured with agent, mandate, mechanism, funding, and timeline', 'Too detailed'], answer: 'Well-structured with agent, mandate, mechanism, funding, and timeline', rule: 'Good plan texts include all five key elements.' },
      ],
    },
    'disadvantages': {
      items: [
        { prompt: 'A disadvantage (DA) in policy debate has which structure?', options: ['Just a bad outcome', 'Uniqueness (status quo avoids the harm), Link (the plan causes it), Internal link (chain of events), Impact (ultimate consequence)', 'An emotional appeal'], answer: 'Uniqueness (status quo avoids the harm), Link (the plan causes it), Internal link (chain of events), Impact (ultimate consequence)', rule: 'DAs need uniqueness, link, internal link, and impact.' },
        { prompt: '"Uniqueness" in a DA means:', options: ['The DA is original', 'The harm doesn\'t happen in the status quo — only the plan triggers it', 'The DA is unique to this debate'], answer: 'The harm doesn\'t happen in the status quo — only the plan triggers it', rule: 'Uniqueness proves the DA is caused by the plan, not pre-existing conditions.' },
        { prompt: 'How do you answer a disadvantage?', options: ['Ignore it', 'No uniqueness (already happening), no link (plan doesn\'t cause it), turn (plan actually helps), or impact defense (harm is exaggerated)', 'Agree with it'], answer: 'No uniqueness (already happening), no link (plan doesn\'t cause it), turn (plan actually helps), or impact defense (harm is exaggerated)', rule: 'Attack DAs at any point in the chain: uniqueness, link, or impact.' },
      ],
    },
    'counterplans': {
      items: [
        { prompt: 'A counterplan must be:', options: ['Identical to the affirmative plan', 'Competitive — the judge can\'t reasonably vote for both the plan and counterplan simultaneously', 'Just any alternative'], answer: 'Competitive — the judge can\'t reasonably vote for both the plan and counterplan simultaneously', rule: 'Counterplans must be mutually exclusive with or net-better than the plan.' },
        { prompt: 'What is a "permutation" argument against a counterplan?', options: ['A mathematical calculation', 'An argument that the plan and counterplan can be done together, proving the CP is not competitive', 'Rearranging the words of the plan'], answer: 'An argument that the plan and counterplan can be done together, proving the CP is not competitive', rule: 'Permutations test competition by combining plan + counterplan.' },
      ],
    },
    'vocal-variety': {
      items: [
        { prompt: 'Vocal variety includes changes in:', options: ['Only volume', 'Pitch, pace, volume, tone, and emphasis', 'Only speed'], answer: 'Pitch, pace, volume, tone, and emphasis', rule: 'Effective speakers vary multiple vocal elements for engagement.' },
        { prompt: 'To emphasize a key point in a speech, you should:', options: ['Speed up', 'Slow down, pause before and after, and slightly increase volume', 'Whisper'], answer: 'Slow down, pause before and after, and slightly increase volume', rule: 'Slowing down and pausing signals importance to the audience.' },
        { prompt: 'Monotone delivery causes:', options: ['Greater audience attention', 'Audience disengagement and difficulty distinguishing key points from details', 'Better comprehension'], answer: 'Audience disengagement and difficulty distinguishing key points from details', rule: 'Vocal variety maintains attention and signals organizational structure.' },
      ],
    },
    'strategic-pausing': {
      items: [
        { prompt: 'A strategic pause is most effective:', options: ['When you forget your next line', 'Before or after a key point, after a rhetorical question, or during a transition', 'Every few words'], answer: 'Before or after a key point, after a rhetorical question, or during a transition', rule: 'Pauses create emphasis, allow processing time, and build anticipation.' },
        { prompt: 'How long should a strategic pause typically last?', options: ['10 seconds', '2-3 seconds', '30 seconds'], answer: '2-3 seconds', rule: '2-3 seconds feels long to the speaker but perfect for the audience.' },
      ],
    },
    'gesture-movement': {
      items: [
        { prompt: 'Effective gestures in public speaking should:', options: ['Be constant and distracting', 'Reinforce your message naturally — open palms for inclusivity, counting for enumeration', 'Be avoided entirely'], answer: 'Reinforce your message naturally — open palms for inclusivity, counting for enumeration', rule: 'Gestures should amplify meaning, not distract from it.' },
        { prompt: 'Purposeful movement on stage can:', options: ['Confuse the audience', 'Signal transitions between points and create visual engagement', 'Show nervousness'], answer: 'Signal transitions between points and create visual engagement', rule: 'Move with purpose: a step signals a new idea; stillness signals importance.' },
      ],
    },
    'multi-source-integration': {
      items: [
        { prompt: 'Synthesis differs from summary because:', options: ['They are the same', 'Synthesis creates new understanding by connecting ideas across sources; summary just restates each source', 'Synthesis is longer'], answer: 'Synthesis creates new understanding by connecting ideas across sources; summary just restates each source', rule: 'Synthesis integrates; summary restates.' },
        { prompt: 'When synthesizing three sources that partially agree, you should:', options: ['Pick the one you agree with', 'Identify areas of agreement, note where they diverge, and explain what the combined evidence suggests', 'Average their conclusions'], answer: 'Identify areas of agreement, note where they diverge, and explain what the combined evidence suggests', rule: 'Effective synthesis maps agreement, divergence, and cumulative implications.' },
      ],
    },
    'perspective-comparison': {
      items: [
        { prompt: 'When comparing perspectives in a discussion, you should:', options: ['Declare a winner', 'Identify the underlying values and assumptions that lead each perspective to its conclusion', 'Ignore differences'], answer: 'Identify the underlying values and assumptions that lead each perspective to its conclusion', rule: 'Understanding root assumptions explains why reasonable people disagree.' },
      ],
    },
    'consensus-building': {
      items: [
        { prompt: 'Which facilitation technique best builds consensus?', options: ['Majority vote on everything', 'Identifying shared values, finding areas of agreement, and proposing solutions that address key concerns from all sides', 'Ignoring minority opinions'], answer: 'Identifying shared values, finding areas of agreement, and proposing solutions that address key concerns from all sides', rule: 'Consensus requires honoring all perspectives while finding common ground.' },
      ],
    },
    'warrant-analysis': {
      items: [
        { prompt: 'A "warrant" in argumentation is:', options: ['A legal document', 'The logical reasoning that connects evidence to the claim', 'The source of the evidence'], answer: 'The logical reasoning that connects evidence to the claim', rule: 'Warrants explain WHY the evidence supports the claim.' },
        { prompt: 'If the warrant is weak but the evidence is strong, the argument is:', options: ['Still strong', 'Vulnerable because the logical connection between evidence and claim can be challenged', 'Perfect'], answer: 'Vulnerable because the logical connection between evidence and claim can be challenged', rule: 'Strong evidence with weak warrants is like strong materials with a weak bridge design.' },
      ],
    },
    'assumption-identification': {
      items: [
        { prompt: '"Raising the minimum wage will reduce poverty because workers will have more money." The hidden assumption is:', options: ['Workers deserve more money', 'That raising wages won\'t cause job losses, price increases, or reduced hours that could offset the wage increase', 'Poverty is bad'], answer: 'That raising wages won\'t cause job losses, price increases, or reduced hours that could offset the wage increase', rule: 'Hidden assumptions are unstated premises the argument depends on.' },
      ],
    },
    'fallacy-rebuttal': {
      items: [
        { prompt: 'When you identify a fallacy in an opponent\'s argument, the strongest rebuttal:', options: ['Just names the fallacy', 'Names the fallacy, explains why the reasoning is flawed, and offers what a valid argument would look like', 'Commits a fallacy in return'], answer: 'Names the fallacy, explains why the reasoning is flawed, and offers what a valid argument would look like', rule: 'Effective fallacy rebuttal: identify, explain, and model correct reasoning.' },
      ],
    },
    'ted-structure': {
      items: [
        { prompt: 'A TED-style talk typically follows which structure?', options: ['Outline, data, conclusion', 'Hook, personal story, big idea, supporting evidence, call to action/memorable close', 'Introduction, three points, conclusion'], answer: 'Hook, personal story, big idea, supporting evidence, call to action/memorable close', rule: 'TED talks blend narrative, idea, and evidence for maximum impact.' },
      ],
    },
    'storytelling-technique': {
      items: [
        { prompt: 'Why is storytelling effective in presentations?', options: ['It fills time', 'Stories activate empathy, are memorable, and make abstract ideas concrete and relatable', 'It avoids the need for evidence'], answer: 'Stories activate empathy, are memorable, and make abstract ideas concrete and relatable', rule: 'Stories engage emotionally and make information stick.' },
      ],
    },
    'audience-engagement': {
      items: [
        { prompt: 'Which technique best re-engages an audience that seems distracted?', options: ['Speak louder', 'Ask a rhetorical question, change your vocal pace, or use a brief audience participation moment', 'Ignore them'], answer: 'Ask a rhetorical question, change your vocal pace, or use a brief audience participation moment', rule: 'Variety and interaction re-capture wandering attention.' },
      ],
    },
    'interactive-media': {
      items: [
        { prompt: 'Interactive elements in a presentation (polls, Q&A, activities) should:', options: ['Replace your content', 'Reinforce key points and increase audience investment in your message', 'Be used for entertainment only'], answer: 'Reinforce key points and increase audience investment in your message', rule: 'Interactive elements should serve your message, not distract from it.' },
      ],
    },
    'rhetorical-design': {
      items: [
        { prompt: 'Designing multimedia with rhetorical purpose means:', options: ['Making it look pretty', 'Every visual, audio, and interactive element intentionally supports your persuasive or informative goal', 'Using the most advanced technology'], answer: 'Every visual, audio, and interactive element intentionally supports your persuasive or informative goal', rule: 'Rhetorical design aligns form with purpose.' },
      ],
    },
    'platform-optimization': {
      items: [
        { prompt: 'When adapting a presentation for a virtual platform, you should:', options: ['Use the same approach as in person', 'Increase visual engagement, shorten segments, use more direct address to camera, and build in interaction points', 'Use more text on slides since people are closer to screens'], answer: 'Increase visual engagement, shorten segments, use more direct address to camera, and build in interaction points', rule: 'Virtual presentations require more visual variety and shorter attention spans.' },
      ],
    },
  },
  'grade-12': {
    'points-of-order': {
      items: [
        { prompt: 'In parliamentary debate, a "point of order" is used when:', options: ['You want to ask a question', 'A rule of procedure has been violated and you want the chair to address it', 'You disagree with the opponent'], answer: 'A rule of procedure has been violated and you want the chair to address it', rule: 'Points of order address procedural violations, not substantive disagreements.' },
        { prompt: 'A "point of personal privilege" is raised when:', options: ['You want special treatment', 'You cannot hear the speaker or conditions prevent fair participation', 'You want more time'], answer: 'You cannot hear the speaker or conditions prevent fair participation', rule: 'Points of personal privilege address conditions affecting participation.' },
      ],
    },
    'impromptu-argumentation': {
      items: [
        { prompt: 'In parliamentary debate, you have limited prep time. The best strategy for impromptu argumentation is:', options: ['Wing it entirely', 'Use a framework (e.g., problem-cause-solution or past-present-future) to quickly organize your thoughts', 'Speak slowly to fill time'], answer: 'Use a framework (e.g., problem-cause-solution or past-present-future) to quickly organize your thoughts', rule: 'Frameworks provide instant organization for impromptu arguments.' },
        { prompt: 'When given an unfamiliar topic in parli debate, you should:', options: ['Admit you know nothing', 'Draw on general knowledge, use logical reasoning, and apply universal principles to the specific topic', 'Make up evidence'], answer: 'Draw on general knowledge, use logical reasoning, and apply universal principles to the specific topic', rule: 'In parli, strong reasoning from general principles compensates for specific knowledge gaps.' },
      ],
    },
    'parliamentary-procedure': {
      items: [
        { prompt: 'In parliamentary debate, "heckling" refers to:', options: ['Insulting the opponent', 'Brief interjections of agreement ("hear, hear") or disagreement ("shame") during speeches', 'Yelling at the judge'], answer: 'Brief interjections of agreement ("hear, hear") or disagreement ("shame") during speeches', rule: 'Parliamentary heckling is a tradition of brief, respectful interjections.' },
      ],
    },
    'star-method': {
      items: [
        { prompt: 'The STAR method stands for:', options: ['Start, Think, Act, Review', 'Situation, Task, Action, Result', 'Study, Try, Assess, Repeat'], answer: 'Situation, Task, Action, Result', rule: 'STAR provides a narrative structure for behavioral interview responses.' },
        { prompt: 'In the STAR method, the "Action" section should:', options: ['Describe what the team did', 'Focus specifically on what YOU did, the decisions YOU made, and the skills YOU demonstrated', 'Be the shortest part'], answer: 'Focus specifically on what YOU did, the decisions YOU made, and the skills YOU demonstrated', rule: 'Interviewers want to understand YOUR contribution, not the group\'s.' },
        { prompt: 'For the question "Tell me about a challenge you overcame," which STAR response is strongest?', options: ['I overcome challenges every day.', 'When our debate team lost three straight tournaments [Situation], I was tasked with analyzing our weaknesses [Task], so I reviewed recordings and created targeted practice drills [Action], and we won the next regional tournament [Result].', 'I\'m a hard worker who never gives up.'], answer: 'When our debate team lost three straight tournaments [Situation], I was tasked with analyzing our weaknesses [Task], so I reviewed recordings and created targeted practice drills [Action], and we won the next regional tournament [Result].', rule: 'Specific stories with clear STAR elements are more compelling than generalizations.' },
      ],
    },
    'self-presentation': {
      items: [
        { prompt: 'In a college interview, "Tell me about yourself" should be answered by:', options: ['Reciting your resume', 'Sharing a focused narrative that highlights your intellectual curiosity, growth, and what drives you', 'Giving your name and GPA'], answer: 'Sharing a focused narrative that highlights your intellectual curiosity, growth, and what drives you', rule: 'This question is about your story and what makes you unique, not your stats.' },
        { prompt: 'Authenticity in a college interview means:', options: ['Saying whatever comes to mind', 'Being genuine about your interests and experiences while presenting them thoughtfully and articulately', 'Performing a rehearsed script'], answer: 'Being genuine about your interests and experiences while presenting them thoughtfully and articulately', rule: 'Authentic does not mean unrehearsed; it means genuinely representing who you are.' },
      ],
    },
    'question-asking': {
      items: [
        { prompt: 'At the end of a college interview, you should ask questions that:', options: ['Can be easily answered by the website', 'Demonstrate genuine research about the school and intellectual curiosity about specific programs or opportunities', 'Focus on rankings and prestige'], answer: 'Demonstrate genuine research about the school and intellectual curiosity about specific programs or opportunities', rule: 'Thoughtful questions show you\'ve done your homework and are genuinely interested.' },
      ],
    },
    'big-idea-development': {
      items: [
        { prompt: 'A TED-style "big idea" should be:', options: ['Obvious to everyone', 'A single insight worth sharing that challenges conventional thinking or offers a new perspective', 'As complex as possible'], answer: 'A single insight worth sharing that challenges conventional thinking or offers a new perspective', rule: 'The best TED talks distill complex topics into one powerful, shareable idea.' },
        { prompt: 'How do you test if your big idea is strong enough?', options: ['Ask if it\'s complicated', 'Can you state it in one sentence? Would someone share it with a friend? Does it change how people think?', 'Check if it\'s been done before'], answer: 'Can you state it in one sentence? Would someone share it with a friend? Does it change how people think?', rule: 'Strong ideas are concise, shareable, and paradigm-shifting.' },
      ],
    },
    'narrative-arc': {
      items: [
        { prompt: 'An effective narrative arc in a TED talk follows:', options: ['A list of facts', 'Setup (establish stakes), confrontation (the challenge or tension), and resolution (the insight or transformation)', 'Chronological autobiography'], answer: 'Setup (establish stakes), confrontation (the challenge or tension), and resolution (the insight or transformation)', rule: 'Narrative arcs create emotional investment through tension and resolution.' },
      ],
    },
    'memorable-delivery': {
      items: [
        { prompt: 'What makes a TED talk ending memorable?', options: ['Saying "thank you"', 'Circling back to the opening, delivering a powerful final line, and leaving the audience with a clear takeaway', 'Asking for applause'], answer: 'Circling back to the opening, delivering a powerful final line, and leaving the audience with a clear takeaway', rule: 'Memorable endings create a sense of completeness and leave a lasting impression.' },
      ],
    },
    'epistemological-analysis': {
      items: [
        { prompt: 'Epistemological analysis of an argument examines:', options: ['Grammar and style', 'How the arguer knows what they claim to know — what counts as evidence, truth, and valid reasoning within their framework', 'The argument\'s emotional appeal'], answer: 'How the arguer knows what they claim to know — what counts as evidence, truth, and valid reasoning within their framework', rule: 'Epistemology questions the foundations of knowledge claims.' },
      ],
    },
    'rhetorical-strategy-id': {
      items: [
        { prompt: 'Identifying rhetorical strategy requires analyzing:', options: ['Only the words used', 'The speaker\'s choices about audience, purpose, context, ethos/pathos/logos balance, and structural decisions', 'Only the evidence quality'], answer: 'The speaker\'s choices about audience, purpose, context, ethos/pathos/logos balance, and structural decisions', rule: 'Rhetorical strategy analysis considers the full ecology of persuasion.' },
      ],
    },
    'systemic-critique': {
      items: [
        { prompt: 'A systemic critique differs from a surface-level critique because:', options: ['It is longer', 'It examines root causes and structural factors rather than just symptoms or individual cases', 'It is more emotional'], answer: 'It examines root causes and structural factors rather than just symptoms or individual cases', rule: 'Systemic critique addresses underlying structures, not just visible effects.' },
      ],
    },
    'meeting-facilitation': {
      items: [
        { prompt: 'Effective meeting facilitation includes:', options: ['Letting whoever talks loudest dominate', 'Setting clear agendas, managing time, ensuring equitable participation, and summarizing action items', 'Avoiding conflict at all costs'], answer: 'Setting clear agendas, managing time, ensuring equitable participation, and summarizing action items', rule: 'Good facilitators create structure that enables productive dialogue.' },
      ],
    },
    'elevator-pitch': {
      items: [
        { prompt: 'An elevator pitch should be:', options: ['As long as needed', '30-60 seconds, clearly stating who you are, what you offer, and why it matters to the listener', 'A detailed project description'], answer: '30-60 seconds, clearly stating who you are, what you offer, and why it matters to the listener', rule: 'Elevator pitches must be concise, clear, and audience-focused.' },
      ],
    },
    'networking-skills': {
      items: [
        { prompt: 'Professional networking conversations should:', options: ['Focus on what you need from the other person', 'Focus on mutual interests, ask thoughtful questions, listen actively, and follow up afterward', 'Be as brief as possible'], answer: 'Focus on mutual interests, ask thoughtful questions, listen actively, and follow up afterward', rule: 'Networking is about building genuine relationships, not transactions.' },
      ],
    },
    'kritik-theory': {
      items: [
        { prompt: 'A "kritik" (K) in debate:', options: ['Is just a regular disadvantage', 'Challenges the fundamental assumptions, language, or framework underlying the opponent\'s advocacy', 'Is always invalid'], answer: 'Challenges the fundamental assumptions, language, or framework underlying the opponent\'s advocacy', rule: 'Kritiks operate at the level of assumptions and frameworks, not just policy outcomes.' },
        { prompt: 'A kritik has which structure?', options: ['Uniqueness, link, impact', 'Link (how the opponent\'s advocacy triggers the critique), impact (the harm of the assumption), and alternative (a different framework or approach)', 'Introduction, body, conclusion'], answer: 'Link (how the opponent\'s advocacy triggers the critique), impact (the harm of the assumption), and alternative (a different framework or approach)', rule: 'K structure: link, impact, alternative.' },
      ],
    },
    'impact-calculus': {
      items: [
        { prompt: 'Impact calculus weighs competing impacts using:', options: ['Just magnitude (number affected)', 'Magnitude, probability, timeframe, and reversibility', 'Whoever speaks more passionately'], answer: 'Magnitude, probability, timeframe, and reversibility', rule: 'Impact calculus uses multiple dimensions to compare competing harms and benefits.' },
        { prompt: 'In impact calculus, "probability" matters because:', options: ['It doesn\'t matter', 'A highly probable small impact may outweigh an improbable catastrophic one, since impacts must be probability-weighted', 'The biggest impact always wins'], answer: 'A highly probable small impact may outweigh an improbable catastrophic one, since impacts must be probability-weighted', rule: 'Always multiply magnitude by probability for realistic impact comparison.' },
      ],
    },
    'round-strategy': {
      items: [
        { prompt: 'Strategic choice of which arguments to extend in rebuttals should be based on:', options: ['Extending everything equally', 'Which arguments you\'re winning, which have the biggest impacts, and which the opponent has dropped or under-covered', 'Whichever argument you wrote'], answer: 'Which arguments you\'re winning, which have the biggest impacts, and which the opponent has dropped or under-covered', rule: 'Rebuttals require strategic selection: go deep on your best arguments.' },
      ],
    },
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

  // Multiple-choice with options
  if (selected[0].options) {
    return {
      type: 'multiple-choice', skill, grade, count: selected.length,
      instruction: 'Choose the best answer.',
      items: selected.map(i => ({ prompt: i.prompt, options: i.options, answer: i.answer, rule: i.rule || '' })),
    };
  }
  // Prompt-response (open-ended)
  if (selected[0].prompt && selected[0].answer) {
    return {
      type: 'prompt-response', skill, grade, count: selected.length,
      instruction: 'Answer the question.',
      items: selected.map(i => ({ prompt: i.prompt, answer: i.answer, rule: i.rule || '' })),
    };
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

class SpeakingListening {
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

  getDebateTopic(grade) {
    const topics = DEBATE_TOPICS[grade];
    if (!topics) return { error: `No debate topics for ${grade}. Valid: ${Object.keys(DEBATE_TOPICS).join(', ')}` };
    return pick(topics, 1)[0];
  }

  getDiscussionPrompt(grade) {
    const prompts = DISCUSSION_PROMPTS[grade];
    if (!prompts) return { error: `No discussion prompts for ${grade}.` };
    return pick(prompts, 1)[0];
  }

  getSpeechScenario(grade) {
    const scenarios = SPEECH_SCENARIOS[grade];
    if (!scenarios) return { error: `No speech scenarios for ${grade}.` };
    return pick(scenarios, 1)[0];
  }

  getListeningExercise(grade) {
    const exercises = LISTENING_EXERCISES[grade];
    if (!exercises) return { error: `No listening exercises for ${grade}.` };
    return pick(exercises, 1)[0];
  }

  getAudienceExercise(grade) {
    const exercises = AUDIENCE_ANALYSIS_EXERCISES[grade];
    if (!exercises) return { error: `No audience analysis exercises for ${grade}.` };
    return pick(exercises, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const discussion = DISCUSSION_PROMPTS[grade] ? pick(DISCUSSION_PROMPTS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, discussionPrompt: discussion,
      lessonPlan: {
        warmUp: 'Deliver a 60-second impromptu speech on a random topic.',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: discussion ? `Discussion: ${discussion.question}` : 'Apply this skill in a partner conversation.',
        reflect: 'Self-assess: What did I do well? What is my goal for next session?',
      },
    };
  }
}

module.exports = SpeakingListening;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const sl = new SpeakingListening();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) sl.setGrade(id, grade);
        out({ action: 'start', profile: sl.getProfile(id), nextSkills: sl.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(sl.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(sl.generateExercise(grade, skill, 5)); }
        else { const n = sl.getNextSkills(id, 1).next; out(n.length ? sl.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(sl.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(sl.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(sl.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(sl.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(sl.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? sl.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(sl.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(sl.setGrade(id, g)); break; }
      case 'debate-topic': { const [, g] = args; if (!g) throw new Error('Usage: debate-topic <grade>'); out(sl.getDebateTopic(g)); break; }
      default: out({
        usage: 'node speaking-listening.js <command> [args]',
        commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade', 'debate-topic'],
        grades: Object.keys(SKILLS),
      });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
