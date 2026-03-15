// eClaw HS Scientific Reasoning Tutor (Grades 9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-reasoning');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  standard: {
    'scientific-argumentation': ['cer-framework', 'toulmin-model', 'counterarguments', 'evidence-based-claims'],
    'evidence-evaluation': ['evidence-hierarchy', 'study-quality', 'replication', 'source-credibility'],
    'critical-analysis': ['bias-detection', 'logical-fallacies', 'pseudoscience-identification', 'media-literacy'],
    'quantitative-reasoning': ['proportional-reasoning', 'dimensional-analysis', 'graph-interpretation', 'statistical-significance'],
    'systems-analysis': ['system-boundaries', 'feedback-loops', 'emergent-properties', 'equilibrium'],
    'ethical-reasoning': ['science-policy', 'risk-assessment', 'equity-in-science', 'responsible-conduct'],
  },
  advanced: {
    'scientific-argumentation': ['cer-framework', 'toulmin-model', 'counterarguments', 'evidence-based-claims', 'argumentation-discourse'],
    'evidence-evaluation': ['evidence-hierarchy', 'study-quality', 'replication', 'source-credibility', 'meta-analysis-interpretation'],
    'critical-analysis': ['bias-detection', 'logical-fallacies', 'pseudoscience-identification', 'media-literacy', 'paradigm-shifts'],
    'quantitative-reasoning': ['proportional-reasoning', 'dimensional-analysis', 'graph-interpretation', 'statistical-significance', 'fermi-estimation'],
    'systems-analysis': ['system-boundaries', 'feedback-loops', 'emergent-properties', 'equilibrium', 'complex-adaptive-systems'],
    'ethical-reasoning': ['science-policy', 'risk-assessment', 'equity-in-science', 'responsible-conduct', 'dual-use-research'],
  },
};

const CONTENT_BANKS = {
  standard: {
    'cer-framework': {
      questions: [
        { q: 'What are the three components of a CER argument?', a: 'claim, evidence, and reasoning', alt: ['claim evidence reasoning', 'claim evidence and reasoning'], type: 'short' },
        { q: 'A student writes: "Plants need sunlight because my plant died in the dark." Identify the claim and evidence.', a: 'claim: plants need sunlight; evidence: the plant died in the dark', type: 'open' },
        { q: 'Why is reasoning the most important part of CER?', a: 'it connects the evidence to the claim using scientific principles', type: 'open' },
        { q: 'Write a claim about the relationship between temperature and enzyme activity.', a: 'enzyme activity increases with temperature up to an optimal point, then decreases as the enzyme denatures', type: 'open' },
        { q: 'What is the difference between evidence and reasoning in CER?', a: 'evidence is data or observations; reasoning explains why the evidence supports the claim using scientific knowledge', type: 'open' },
        { q: 'A student claims "acid rain harms ecosystems" and cites pH data from a lake. What reasoning should they add?', a: 'they should explain how low pH disrupts aquatic organisms biochemistry and food webs', type: 'open' },
        { q: 'How many pieces of evidence should a strong CER typically include?', a: 'at least two or more from different sources or experiments', type: 'open' },
        { q: 'Can a CER argument be revised?', a: 'yes — as new evidence emerges, claims and reasoning should be updated', type: 'short' },
      ],
    },
    'toulmin-model': {
      questions: [
        { q: 'What are the six elements of a Toulmin argument?', a: 'claim, data, warrant, backing, qualifier, and rebuttal', type: 'open' },
        { q: 'In the Toulmin model, what is a warrant?', a: 'the logical connection between the data and the claim; it justifies why the data supports the claim', type: 'open' },
        { q: 'What is a qualifier in the Toulmin model?', a: 'a word or phrase that limits the strength of the claim, such as probably, most, or generally', type: 'open' },
        { q: 'How does a rebuttal strengthen an argument?', a: 'it acknowledges conditions under which the claim might not hold, showing intellectual honesty', type: 'open' },
        { q: 'What is the role of backing in a Toulmin argument?', a: 'backing provides additional support for the warrant, often through established scientific principles', type: 'open' },
        { q: 'Compare CER and Toulmin: which is more detailed?', a: 'Toulmin — it adds qualifier, backing, and rebuttal beyond CER basics', type: 'short' },
        { q: 'Construct a warrant for: "Data shows CO2 levels rising. Claim: Earth is warming."', a: 'CO2 is a greenhouse gas that traps infrared radiation, so higher CO2 concentrations increase the greenhouse effect', type: 'open' },
        { q: 'Why are qualifiers important in scientific arguments?', a: 'they reflect appropriate uncertainty and prevent overclaiming beyond what the evidence supports', type: 'open' },
      ],
    },
    'counterarguments': {
      questions: [
        { q: 'Why should scientists address counterarguments in their papers?', a: 'it strengthens their position by demonstrating they have considered and refuted alternatives', type: 'open' },
        { q: 'What is the difference between a counterargument and a rebuttal?', a: 'a counterargument is the opposing position; a rebuttal is the response that addresses it', type: 'open' },
        { q: 'A researcher claims vaccines are safe. A counterargument cites one adverse reaction report. How should they respond?', a: 'acknowledge rare side effects exist, then present large-scale data showing overwhelming safety and benefit', type: 'open' },
        { q: 'Is a straw man a fair way to address a counterargument?', a: 'no — a straw man misrepresents the opposing view, which is intellectually dishonest', type: 'short' },
        { q: 'How does peer review relate to counterarguments?', a: 'reviewers often raise counterarguments that authors must address before publication', type: 'open' },
        { q: 'Can counterarguments ever cause a scientist to change their claim?', a: 'yes — if the counterargument has strong evidence, the scientist should revise their position', type: 'short' },
        { q: 'What is the steel man approach to counterarguments?', a: 'presenting the strongest version of the opposing argument before refuting it', type: 'open' },
      ],
    },
    'evidence-based-claims': {
      questions: [
        { q: 'What distinguishes an evidence-based claim from an opinion?', a: 'an evidence-based claim is supported by verifiable data and observations, not personal belief', type: 'open' },
        { q: 'A news headline says "Scientists prove chocolate cures cancer." What questions should you ask?', a: 'what was the study design, sample size, was it peer-reviewed, and what does the actual data show', type: 'open' },
        { q: 'Why should scientific claims be falsifiable?', a: 'if a claim cannot be tested or potentially disproven, it is not scientific', type: 'open' },
        { q: 'How does sample size affect the strength of a claim?', a: 'larger samples provide more reliable data and stronger support for claims', type: 'open' },
        { q: 'Is "evolution is just a theory" a valid criticism of evolutionary science?', a: 'no — in science, a theory is a well-substantiated explanation supported by extensive evidence', type: 'open' },
        { q: 'What is the difference between a hypothesis and a claim?', a: 'a hypothesis is a testable prediction before data collection; a claim is a conclusion supported by evidence', type: 'open' },
      ],
    },
    'evidence-hierarchy': {
      questions: [
        { q: 'Rank from weakest to strongest evidence: anecdote, case study, randomized controlled trial, systematic review.', a: 'anecdote, case study, randomized controlled trial, systematic review', type: 'open' },
        { q: 'Why are systematic reviews considered the highest level of evidence?', a: 'they synthesize results from multiple studies, reducing individual study biases', type: 'open' },
        { q: 'What is the difference between primary and secondary sources in science?', a: 'primary sources report original research; secondary sources summarize or analyze primary research', type: 'open' },
        { q: 'Why is expert opinion considered relatively low on the evidence hierarchy?', a: 'it can be influenced by personal bias and is not systematically tested', type: 'open' },
        { q: 'A friend says a supplement works because it helped them. Where does this fall in the evidence hierarchy?', a: 'anecdotal evidence — the weakest level', type: 'short' },
        { q: 'What makes a randomized controlled trial (RCT) strong evidence?', a: 'randomization reduces bias, and a control group provides a baseline for comparison', type: 'open' },
        { q: 'Where does a cohort study fall in the evidence hierarchy relative to an RCT?', a: 'below an RCT because cohort studies are observational and cannot establish causation as effectively', type: 'open' },
      ],
    },
    'study-quality': {
      questions: [
        { q: 'What is a control group and why is it essential?', a: 'a group that does not receive the treatment; it provides a baseline for comparison', type: 'open' },
        { q: 'What is the purpose of blinding in an experiment?', a: 'to prevent bias by ensuring participants and/or researchers do not know who is in which group', type: 'open' },
        { q: 'What is a double-blind study?', a: 'neither the participants nor the researchers know who receives the treatment or placebo', type: 'open' },
        { q: 'How does sample size affect study quality?', a: 'larger samples reduce the impact of random variation and increase reliability', type: 'open' },
        { q: 'What is selection bias?', a: 'when participants are not randomly selected, leading to a non-representative sample', type: 'open' },
        { q: 'A study funded by a soda company finds sugar is not harmful. What concern arises?', a: 'conflict of interest — funding source may bias the design, analysis, or reporting', type: 'open' },
        { q: 'What is the placebo effect and why must studies account for it?', a: 'patients improve simply because they believe they are being treated; controls with placebos isolate actual treatment effects', type: 'open' },
      ],
    },
    'replication': {
      questions: [
        { q: 'Why is replication important in science?', a: 'it confirms findings are reliable and not due to chance or error', type: 'open' },
        { q: 'What is the replication crisis?', a: 'many published findings, especially in social sciences, have failed to replicate in independent studies', type: 'open' },
        { q: 'How does replication differ from reproducibility?', a: 'replication uses new data to test the same hypothesis; reproducibility uses the same data and methods to get the same results', type: 'open' },
        { q: 'A groundbreaking result is published but no other lab can replicate it. What should happen?', a: 'the original finding should be treated with skepticism until independently replicated', type: 'open' },
        { q: 'What factors can prevent successful replication?', a: 'different conditions, hidden variables, small sample sizes, or errors in the original study', type: 'open' },
        { q: 'Should a single study be enough to change medical practice?', a: 'no — multiple replicated studies and systematic reviews should inform practice changes', type: 'short' },
      ],
    },
    'source-credibility': {
      questions: [
        { q: 'What makes a scientific source credible?', a: 'peer review, author expertise, institutional affiliation, transparent methods, and replicable results', type: 'open' },
        { q: 'Is a blog post by a PhD scientist peer-reviewed?', a: 'no — a blog is not peer-reviewed regardless of the author credentials', type: 'short' },
        { q: 'How can you check if a journal is reputable?', a: 'look for impact factor, indexing in major databases, editorial board credentials, and peer review process', type: 'open' },
        { q: 'What is a predatory journal?', a: 'a journal that charges fees to publish without proper peer review, undermining quality control', type: 'open' },
        { q: 'A social media post cites a real study but misrepresents its conclusions. How do you verify?', a: 'read the original study abstract and methods to see what the researchers actually found', type: 'open' },
        { q: 'Why should you check the date of a scientific source?', a: 'science advances rapidly and older findings may have been superseded by newer research', type: 'open' },
      ],
    },
    'bias-detection': {
      questions: [
        { q: 'What is confirmation bias in science?', a: 'the tendency to search for, interpret, or recall information that confirms pre-existing beliefs', type: 'open' },
        { q: 'How does publication bias affect scientific literature?', a: 'studies with positive results are more likely to be published, skewing the available evidence', type: 'open' },
        { q: 'What is cherry-picking data?', a: 'selectively presenting data that supports a conclusion while ignoring data that contradicts it', type: 'open' },
        { q: 'A researcher only reports experiments that worked. What type of bias is this?', a: 'reporting bias or publication bias', type: 'short' },
        { q: 'How can pre-registration of studies reduce bias?', a: 'by requiring researchers to declare their methods and hypotheses before collecting data', type: 'open' },
        { q: 'What is the anchoring effect in scientific reasoning?', a: 'over-relying on the first piece of information encountered when making judgments', type: 'open' },
        { q: 'What is funding bias?', a: 'when the source of research funding influences the design, conduct, or reporting of results', type: 'open' },
      ],
    },
    'logical-fallacies': {
      questions: [
        { q: '"My grandfather smoked and lived to 95, so smoking is safe." Identify the fallacy.', a: 'anecdotal evidence fallacy — one case does not disprove statistical trends', type: 'open' },
        { q: '"You cannot prove this chemical is harmful, so it must be safe." What fallacy is this?', a: 'argument from ignorance — absence of evidence is not evidence of absence', type: 'open' },
        { q: '"This scientist was wrong once, so we cannot trust anything they say." Identify the fallacy.', a: 'ad hominem — attacking the person rather than addressing their current evidence', type: 'open' },
        { q: '"Either we ban all pesticides or we accept poisoned food." What fallacy?', a: 'false dichotomy — there are intermediate options like regulated pesticide use', type: 'open' },
        { q: '"After the vaccine rollout, cases dropped. The vaccine must be the sole cause." What fallacy?', a: 'post hoc ergo propter hoc — other factors like seasonality or behavior changes may contribute', type: 'open' },
        { q: '"Most scientists agree on climate change, so it must be true." Is this a valid argument or a fallacy?', a: 'it is valid when the consensus is based on extensive evidence, unlike appeal to popularity which lacks evidence', type: 'open' },
        { q: 'What is a slippery slope fallacy?', a: 'claiming one event will inevitably lead to extreme consequences without evidence for the chain of events', type: 'open' },
        { q: '"Natural remedies are always better because they are natural." What fallacy is this?', a: 'appeal to nature — naturalness does not guarantee safety or efficacy', type: 'open' },
      ],
    },
    'pseudoscience-identification': {
      questions: [
        { q: 'What distinguishes science from pseudoscience?', a: 'science is testable, falsifiable, peer-reviewed, and self-correcting; pseudoscience lacks these qualities', type: 'open' },
        { q: 'Name three red flags of pseudoscience.', a: 'unfalsifiable claims, reliance on anecdotes, no peer review, appeal to ancient wisdom, conspiracy thinking', type: 'open' },
        { q: 'Why is astrology considered pseudoscience?', a: 'its claims are vague, unfalsifiable, not supported by controlled studies, and lack a plausible mechanism', type: 'open' },
        { q: 'A product claims to "boost your immune system naturally." What should you look for?', a: 'peer-reviewed clinical trials, specific mechanism of action, FDA approval, and conflict of interest', type: 'open' },
        { q: 'How does the scientific method protect against pseudoscience?', a: 'through hypothesis testing, controlled experiments, peer review, and replication requirements', type: 'open' },
        { q: 'Can something once considered pseudoscience later become accepted science?', a: 'yes — plate tectonics was once rejected but later supported by overwhelming evidence', type: 'short' },
      ],
    },
    'media-literacy': {
      questions: [
        { q: 'A headline says "Study finds coffee prevents cancer." What questions should you ask?', a: 'what type of study, how large was the sample, was it correlational or causal, who funded it', type: 'open' },
        { q: 'Why do news outlets often sensationalize scientific findings?', a: 'to attract readers, they simplify or exaggerate results beyond what the data supports', type: 'open' },
        { q: 'What does "correlation does not equal causation" mean for news reporting?', a: 'observational studies showing associations are often reported as if they prove one thing causes another', type: 'open' },
        { q: 'How can you trace a news story back to the original research?', a: 'look for the journal citation, DOI, or researcher names mentioned in the article', type: 'open' },
        { q: 'A graph in an article starts its y-axis at 95 instead of 0. What effect does this have?', a: 'it exaggerates small differences and makes changes appear much larger than they are', type: 'open' },
        { q: 'What is the difference between a preprint and a peer-reviewed paper?', a: 'a preprint has not yet undergone peer review and may contain errors or unverified conclusions', type: 'open' },
      ],
    },
    'proportional-reasoning': {
      questions: [
        { q: 'If a cell is 10 micrometers and a model is 10 cm, what is the magnification?', a: '10000x', alt: ['10,000x', '10000', '10,000'], type: 'short' },
        { q: 'A medication dosage is 5 mg per kg body weight. What dose for a 70 kg person?', a: '350 mg', alt: ['350'], type: 'short' },
        { q: 'If doubling CO2 raises temperature by 3 degrees C, does quadrupling raise it by 6 degrees?', a: 'not necessarily — the relationship may not be linear due to feedback effects', type: 'open' },
        { q: 'Explain why per-capita data is more useful than total data when comparing countries.', a: 'it accounts for population differences, allowing fair comparison', type: 'open' },
        { q: 'A solution is 15% salt. How many grams of salt in 200 mL?', a: '30 grams', alt: ['30', '30g', '30 g'], type: 'short' },
        { q: 'If a reaction rate doubles for every 10 degree C increase, how much faster is it at 40 C vs 20 C?', a: '4 times faster', alt: ['4x', '4 times', 'four times'], type: 'short' },
      ],
    },
    'dimensional-analysis': {
      questions: [
        { q: 'Convert 5 km/h to m/s.', a: 'approximately 1.39 m/s', alt: ['1.39 m/s', '1.39', '1.4 m/s', '1.4'], type: 'short' },
        { q: 'What is the purpose of dimensional analysis?', a: 'to convert units and verify that equations are dimensionally consistent', type: 'open' },
        { q: 'If density = mass/volume, what are the SI units of density?', a: 'kg/m^3', alt: ['kg/m3', 'kilograms per cubic meter'], type: 'short' },
        { q: 'A student calculates velocity and gets an answer in kg. What does this indicate?', a: 'an error — velocity should have units of distance per time, not mass', type: 'open' },
        { q: 'How many seconds are in one year? Use dimensional analysis.', a: 'approximately 31,536,000 seconds', alt: ['31536000', '3.15 x 10^7', '31,536,000'], type: 'short' },
        { q: 'Why is dimensional analysis called a "sanity check"?', a: 'it catches errors by verifying that units on both sides of an equation match', type: 'open' },
        { q: 'Convert 1 atmosphere to Pascals.', a: '101325 Pa', alt: ['101325', '101,325 Pa', '101,325'], type: 'short' },
      ],
    },
    'graph-interpretation': {
      questions: [
        { q: 'A line graph shows a steep positive slope. What does this indicate about the relationship?', a: 'a strong positive correlation — as one variable increases, the other increases rapidly', type: 'open' },
        { q: 'What does a plateau on a graph represent?', a: 'a period where the dependent variable remains constant despite changes in the independent variable', type: 'open' },
        { q: 'Why should you always check the axes labels and scales before interpreting a graph?', a: 'misleading scales or unlabeled axes can lead to incorrect conclusions', type: 'open' },
        { q: 'What is the difference between interpolation and extrapolation?', a: 'interpolation estimates within the data range; extrapolation predicts beyond it, which is less reliable', type: 'open' },
        { q: 'A scatter plot shows points with no apparent pattern. What does this suggest?', a: 'there is no correlation between the two variables', type: 'open' },
        { q: 'Why might a logarithmic scale be more appropriate than a linear scale?', a: 'when data spans several orders of magnitude, a log scale reveals patterns that a linear scale compresses', type: 'open' },
      ],
    },
    'statistical-significance': {
      questions: [
        { q: 'What does a p-value of 0.03 mean?', a: 'there is a 3% probability the observed result occurred by chance alone', type: 'open' },
        { q: 'What is the commonly used threshold for statistical significance?', a: 'p < 0.05', alt: ['0.05', 'p less than 0.05', '5%'], type: 'short' },
        { q: 'Does statistical significance always mean practical significance?', a: 'no — a result can be statistically significant but have a very small real-world effect', type: 'short' },
        { q: 'What is a Type I error?', a: 'rejecting the null hypothesis when it is actually true (a false positive)', type: 'open' },
        { q: 'How does increasing sample size affect statistical significance?', a: 'larger samples make it easier to detect real effects and achieve significance', type: 'open' },
        { q: 'A study finds p = 0.051. The researcher calls it "approaching significance." Is this valid?', a: 'it is not statistically significant by the 0.05 threshold — the result should not be treated as confirmed', type: 'open' },
        { q: 'What is a Type II error?', a: 'failing to reject the null hypothesis when it is actually false (a false negative)', type: 'open' },
      ],
    },
    'system-boundaries': {
      questions: [
        { q: 'What is a system boundary in science?', a: 'the dividing line between what is inside the system being studied and what is external to it', type: 'open' },
        { q: 'What is the difference between an open and closed system?', a: 'an open system exchanges matter and energy with its surroundings; a closed system does not exchange matter', type: 'open' },
        { q: 'Is Earth an open or closed system with respect to energy? Matter?', a: 'open for energy (receives sunlight, radiates heat) but essentially closed for matter', type: 'open' },
        { q: 'Why does choosing different system boundaries change the analysis?', a: 'different boundaries include or exclude different components, interactions, and variables', type: 'open' },
        { q: 'Give an example of how a cell membrane acts as a system boundary.', a: 'it controls what enters and exits the cell, separating internal processes from the external environment', type: 'open' },
        { q: 'What are inputs and outputs in a systems context?', a: 'inputs are energy or matter entering the system; outputs are what leaves the system', type: 'open' },
      ],
    },
    'feedback-loops': {
      questions: [
        { q: 'What is the difference between positive and negative feedback loops?', a: 'positive feedback amplifies a change; negative feedback counteracts a change and maintains stability', type: 'open' },
        { q: 'Give an example of a negative feedback loop in the human body.', a: 'thermoregulation — when body temperature rises, sweating cools it back to normal', type: 'open' },
        { q: 'Ice melting reduces reflectivity, causing more warming, causing more ice to melt. What type of feedback?', a: 'positive feedback', alt: ['positive'], type: 'short' },
        { q: 'Why are positive feedback loops potentially dangerous in climate systems?', a: 'they can cause runaway changes that accelerate beyond control', type: 'open' },
        { q: 'How does predator-prey dynamics illustrate negative feedback?', a: 'more prey leads to more predators, which reduces prey, which then reduces predators, cycling back', type: 'open' },
        { q: 'Can a system have both positive and negative feedback loops simultaneously?', a: 'yes — most complex systems have multiple interacting feedback loops', type: 'short' },
        { q: 'What is a feedback delay and why does it matter?', a: 'a lag between cause and effect in a feedback loop that can cause oscillations or overshoot', type: 'open' },
      ],
    },
    'emergent-properties': {
      questions: [
        { q: 'What is an emergent property?', a: 'a property that arises from the interaction of components but is not present in any individual component', type: 'open' },
        { q: 'Consciousness arises from neurons but no single neuron is conscious. What concept does this illustrate?', a: 'emergence — the whole has properties that the parts do not', type: 'open' },
        { q: 'Why can emergent properties not be predicted by studying components in isolation?', a: 'they arise from interactions and relationships that only exist when components are together', type: 'open' },
        { q: 'Give an example of emergence in chemistry.', a: 'water has properties like wetness and surface tension that individual H2O molecules do not', type: 'open' },
        { q: 'How does emergence relate to the phrase "the whole is greater than the sum of its parts"?', a: 'it means the system has qualities that cannot be reduced to or predicted from its individual components', type: 'open' },
        { q: 'Is flocking behavior in birds an emergent property?', a: 'yes — each bird follows simple rules but the flock pattern emerges from their interactions', type: 'short' },
      ],
    },
    'equilibrium': {
      questions: [
        { q: 'What is dynamic equilibrium?', a: 'a state where opposing processes occur at equal rates, so the system appears stable while constantly changing', type: 'open' },
        { q: 'How does Le Chatelier principle relate to equilibrium?', a: 'it states that a system at equilibrium will shift to counteract any imposed change', type: 'open' },
        { q: 'Is a population at carrying capacity in equilibrium? Explain.', a: 'yes — births and deaths roughly balance, maintaining a stable population size', type: 'open' },
        { q: 'What is the difference between stable and unstable equilibrium?', a: 'stable equilibrium returns to its original state after disturbance; unstable shifts to a new state', type: 'open' },
        { q: 'How does homeostasis in organisms relate to equilibrium?', a: 'homeostasis maintains internal conditions near a set point through feedback mechanisms, similar to dynamic equilibrium', type: 'open' },
        { q: 'Can a system be in equilibrium and still have energy flowing through it?', a: 'yes — dynamic equilibrium involves ongoing processes that balance each other', type: 'short' },
      ],
    },
    'science-policy': {
      questions: [
        { q: 'How should scientific evidence inform public policy?', a: 'policy should be based on the best available evidence while also considering social, economic, and ethical factors', type: 'open' },
        { q: 'Why is the precautionary principle important?', a: 'it states that when an action risks harm to the public, protective action should be taken even without full scientific certainty', type: 'open' },
        { q: 'Can science alone determine policy?', a: 'no — policy also involves values, ethics, economics, and politics that science cannot decide', type: 'short' },
        { q: 'How did science inform policy during the ozone crisis?', a: 'evidence of CFCs damaging the ozone layer led to the Montreal Protocol banning them', type: 'open' },
        { q: 'What happens when policy ignores scientific evidence?', a: 'it can lead to public health crises, environmental damage, and loss of public trust', type: 'open' },
        { q: 'Why is communicating uncertainty important in science policy?', a: 'uncertainty does not mean ignorance — clear communication helps policymakers make informed decisions', type: 'open' },
      ],
    },
    'risk-assessment': {
      questions: [
        { q: 'What is the difference between hazard and risk?', a: 'a hazard is something that can cause harm; risk is the probability and severity of that harm occurring', type: 'open' },
        { q: 'How do scientists quantify risk?', a: 'by estimating the probability of an event and the magnitude of its consequences', type: 'open' },
        { q: 'Why do people often overestimate dramatic risks and underestimate common ones?', a: 'due to availability bias — dramatic events are more memorable even if statistically rare', type: 'open' },
        { q: 'What is a risk-benefit analysis?', a: 'comparing the potential risks of an action to its potential benefits to make informed decisions', type: 'open' },
        { q: 'A new pesticide kills 99% of pests but may harm pollinators. How would you approach this?', a: 'weigh pest control benefits against pollinator harm, consider alternatives, and evaluate long-term ecosystem effects', type: 'open' },
        { q: 'What is the LD50 and why is it used in toxicology?', a: 'the dose lethal to 50% of test organisms; it provides a standard measure for comparing substance toxicity', type: 'open' },
      ],
    },
    'equity-in-science': {
      questions: [
        { q: 'What is environmental justice?', a: 'the fair treatment of all people regardless of race, income, or origin regarding environmental laws and policies', type: 'open' },
        { q: 'Why are clinical trials that lack diversity problematic?', a: 'results may not apply to underrepresented groups who may respond differently to treatments', type: 'open' },
        { q: 'How has historical bias affected scientific knowledge?', a: 'exclusion of women and minorities has led to gaps in understanding and medical treatments biased toward majority groups', type: 'open' },
        { q: 'What is the concept of "citizen science" and how does it promote equity?', a: 'it involves the public in research, democratizing science and including diverse perspectives', type: 'open' },
        { q: 'Why are marginalized communities often disproportionately affected by pollution?', a: 'due to systemic inequities in zoning, economic power, and political representation', type: 'open' },
        { q: 'How can open-access publishing promote equity in science?', a: 'it removes financial barriers to accessing research, allowing broader participation in scientific knowledge', type: 'open' },
      ],
    },
    'responsible-conduct': {
      questions: [
        { q: 'What is research misconduct?', a: 'fabrication, falsification, or plagiarism in proposing, performing, or reporting research', type: 'open' },
        { q: 'Why must researchers disclose conflicts of interest?', a: 'to maintain transparency and allow others to evaluate potential biases in the research', type: 'open' },
        { q: 'What is informed consent in research?', a: 'ensuring participants understand the study procedures, risks, and their right to withdraw before agreeing', type: 'open' },
        { q: 'How does data fabrication differ from data falsification?', a: 'fabrication is making up data; falsification is manipulating real data or selectively reporting it', type: 'open' },
        { q: 'Why is proper attribution and citation important?', a: 'it gives credit to original researchers, allows verification, and avoids plagiarism', type: 'open' },
        { q: 'What role do Institutional Review Boards (IRBs) play?', a: 'they review research proposals to ensure the protection of human subjects and ethical compliance', type: 'open' },
      ],
    },
  },
  advanced: {
    'argumentation-discourse': {
      questions: [
        { q: 'How does scientific argumentation differ from formal debate?', a: 'scientific argumentation aims to reach the best evidence-based explanation, not to win', type: 'open' },
        { q: 'What role does epistemic humility play in scientific discourse?', a: 'it acknowledges the limits of current knowledge and remains open to revision based on new evidence', type: 'open' },
        { q: 'How do paradigm shifts affect scientific argumentation?', a: 'they force re-evaluation of accepted claims and may render previous arguments obsolete', type: 'open' },
        { q: 'What is the role of dissent in advancing scientific knowledge?', a: 'constructive dissent challenges assumptions, prompts new experiments, and prevents groupthink', type: 'open' },
        { q: 'How does the sociology of science affect which arguments gain acceptance?', a: 'power dynamics, funding, institutional prestige, and social networks can influence which ideas are promoted', type: 'open' },
        { q: 'What is Lakatos concept of research programs and how does it extend Toulmin?', a: 'research programs have a hard core of assumptions protected by auxiliary hypotheses that can be modified', type: 'open' },
      ],
    },
    'meta-analysis-interpretation': {
      questions: [
        { q: 'What is a meta-analysis?', a: 'a statistical method that combines results from multiple studies to estimate an overall effect', type: 'open' },
        { q: 'What is a forest plot and what does it show?', a: 'a graph displaying individual study results and the combined effect estimate with confidence intervals', type: 'open' },
        { q: 'What is heterogeneity in meta-analysis and why does it matter?', a: 'variation in study results beyond chance; high heterogeneity suggests studies may not be measuring the same thing', type: 'open' },
        { q: 'What is a funnel plot used to detect?', a: 'publication bias — an asymmetric funnel plot suggests missing studies with non-significant results', type: 'open' },
        { q: 'Why might a meta-analysis of flawed studies still produce flawed conclusions?', a: 'garbage in, garbage out — combining biased studies amplifies rather than corrects systematic errors', type: 'open' },
        { q: 'How does effect size differ from statistical significance?', a: 'effect size measures the magnitude of a result; significance only indicates whether the result is unlikely due to chance', type: 'open' },
      ],
    },
    'paradigm-shifts': {
      questions: [
        { q: 'What did Thomas Kuhn mean by a paradigm shift?', a: 'a fundamental change in the basic concepts and practices of a scientific discipline', type: 'open' },
        { q: 'Give an example of a paradigm shift in science.', a: 'the shift from geocentric to heliocentric model, or from Newtonian to Einsteinian physics', type: 'open' },
        { q: 'What is normal science according to Kuhn?', a: 'research conducted within an accepted paradigm that solves puzzles without questioning fundamental assumptions', type: 'open' },
        { q: 'How do anomalies contribute to paradigm shifts?', a: 'accumulated anomalies that cannot be explained by the current paradigm create crisis and openness to alternatives', type: 'open' },
        { q: 'Is scientific progress linear or revolutionary according to Kuhn?', a: 'revolutionary — periods of normal science are punctuated by paradigm shifts', type: 'short' },
        { q: 'How does Kuhn concept of incommensurability challenge the idea of objective scientific progress?', a: 'it suggests different paradigms may not be directly comparable because they define problems and standards differently', type: 'open' },
      ],
    },
    'fermi-estimation': {
      questions: [
        { q: 'What is a Fermi estimation?', a: 'a rough calculation to estimate a quantity using reasonable assumptions and order-of-magnitude reasoning', type: 'open' },
        { q: 'Estimate: How many piano tuners are in Chicago? Describe your approach.', a: 'estimate population, fraction with pianos, tuning frequency, and tuner capacity to get roughly 200-300', type: 'open' },
        { q: 'Why are Fermi estimations useful in science?', a: 'they develop quantitative intuition, check if answers are reasonable, and scope problems before detailed analysis', type: 'open' },
        { q: 'Estimate the number of golf balls that fit in a school bus.', a: 'approximately 300,000-500,000 based on bus volume divided by golf ball volume', type: 'open' },
        { q: 'What is an order of magnitude?', a: 'a factor of 10 — it describes the scale of a number rather than its exact value', type: 'open' },
        { q: 'A Fermi estimate gives 10,000 and the actual value is 8,000. Is this a good estimate?', a: 'yes — within the same order of magnitude, which is typically the goal of Fermi estimation', type: 'short' },
      ],
    },
    'complex-adaptive-systems': {
      questions: [
        { q: 'What makes a system "complex adaptive"?', a: 'it consists of many interacting agents that adapt their behavior based on experience, producing emergent patterns', type: 'open' },
        { q: 'How does an ant colony exemplify a complex adaptive system?', a: 'individual ants follow simple rules but the colony exhibits complex organized behavior without central control', type: 'open' },
        { q: 'What is self-organization in complex systems?', a: 'order that emerges spontaneously from local interactions without being directed by a central authority', type: 'open' },
        { q: 'How do complex adaptive systems differ from merely complicated systems?', a: 'complicated systems are predictable with enough information; complex adaptive systems are inherently unpredictable due to nonlinear interactions', type: 'open' },
        { q: 'What role does diversity play in complex adaptive systems?', a: 'diversity of agents increases system resilience and the potential for novel adaptive responses', type: 'open' },
        { q: 'How do tipping points manifest in complex adaptive systems?', a: 'small changes can trigger large, sudden, and often irreversible transitions to a new system state', type: 'open' },
      ],
    },
    'dual-use-research': {
      questions: [
        { q: 'What is dual-use research?', a: 'research that can be used for both beneficial purposes and to cause harm', type: 'open' },
        { q: 'Give an example of dual-use research in biology.', a: 'gain-of-function research on pathogens — it informs pandemic preparedness but could create dangerous organisms', type: 'open' },
        { q: 'How should scientists balance openness with security in dual-use research?', a: 'through risk-benefit assessment, oversight committees, and selective publication of sensitive methods', type: 'open' },
        { q: 'What is the Fink Report and why is it significant?', a: 'it recommended oversight of dual-use biological research and identified seven categories of concerning experiments', type: 'open' },
        { q: 'How does CRISPR technology illustrate dual-use concerns?', a: 'it enables beneficial gene therapy but could also be used for bioweapons or irresponsible germline editing', type: 'open' },
        { q: 'Who should decide what dual-use research is too dangerous to pursue?', a: 'ideally a combination of scientists, ethicists, policymakers, and public representatives through institutional review', type: 'open' },
      ],
    },
  },
};

const SCENARIOS = {
  standard: [
    { title: 'The Vaccine Debate', focus: 'evidence evaluation + argumentation', text: 'A school board is debating whether to require flu vaccines for students. One parent cites a blog claiming vaccines cause autoimmune disease, referencing a retracted study. Another parent presents data from the CDC showing vaccine safety across millions of doses. A third argues that "natural immunity is always better." Evaluate each argument using the evidence hierarchy. Identify logical fallacies. Construct a CER argument for your recommendation to the board.' },
    { title: 'The Coral Reef Crisis', focus: 'systems analysis + quantitative reasoning', text: 'A coral reef has experienced 40% bleaching over 5 years. Water temperature has risen 1.5 degrees C, pH dropped 0.12 units, and fishing has increased 60%. Using systems thinking: identify the system boundaries, inputs, and outputs. Map the feedback loops (positive and negative). Calculate: if bleaching continues at the current rate, when will the reef reach 80% bleaching? What emergent properties of the reef ecosystem are at risk? Propose an intervention and justify it with evidence.' },
    { title: 'The Lead in Water Investigation', focus: 'critical analysis + ethical reasoning', text: 'A city switches its water source to save money. Within a year, lead levels in tap water triple. Officials claim the water is "within acceptable limits." A researcher publishes findings showing elevated blood lead in children. The city questions her methodology. Analyze: What biases might each party have? Evaluate the quality of evidence on each side. What are the ethical obligations of the city officials? The researcher? How should the precautionary principle apply here?' },
    { title: 'The GMO Controversy', focus: 'evidence evaluation + media literacy', text: 'You find four sources about GMO safety: (1) A peer-reviewed meta-analysis of 1,783 studies finding no health risks. (2) A viral social media post claiming GMOs cause cancer, citing a retracted rat study. (3) A documentary funded by an organic food company opposing GMOs. (4) A news article with the headline "Scientists divided on GMO safety." Rank these sources by credibility. Identify bias in each. What does the scientific consensus actually say? How would you explain this to a concerned friend?' },
  ],
  advanced: [
    { title: 'The Gain-of-Function Dilemma', focus: 'ethical reasoning + argumentation', text: 'A virology lab proposes to modify a bird flu virus to become transmissible between mammals, arguing this will help predict and prevent pandemics. Critics say the risk of accidental release outweighs potential benefits. Using Toulmin argumentation: construct arguments for both sides with claims, data, warrants, qualifiers, and rebuttals. Apply risk-benefit analysis. What oversight mechanisms should exist? How does the dual-use research framework apply? Is there a middle ground?' },
    { title: 'The Climate Model Challenge', focus: 'quantitative reasoning + systems analysis', text: 'Climate models predict 2-5 degrees C warming by 2100. A politician says "they cannot even predict next week weather, so why trust 80-year predictions?" Construct a Fermi estimation of climate sensitivity. Explain why climate projections and weather forecasts are fundamentally different. Map the feedback loops in the climate system (ice-albedo, water vapor, cloud). How do complex adaptive systems concepts apply? What does the range of predictions (2-5 C) tell us about uncertainty vs. ignorance?' },
    { title: 'The Replication Crisis in Psychology', focus: 'evidence evaluation + critical analysis', text: 'The Open Science Collaboration attempted to replicate 100 psychology studies. Only 36% replicated successfully. Analyze: What does this tell us about the reliability of psychological research? Examine the role of p-hacking, publication bias, small samples, and researcher degrees of freedom. How should this affect how we interpret individual studies? What reforms (pre-registration, open data, replication funding) could help? Does this crisis extend to other fields? Use meta-analysis concepts to evaluate the replication project itself.' },
    { title: 'The AI in Healthcare Paradox', focus: 'ethical reasoning + systems analysis', text: 'An AI diagnostic system is more accurate than human doctors for detecting skin cancer (95% vs 87%). However, it performs worse on darker skin tones (88% vs 95% for lighter skin) because the training data was biased. Analyze this as a complex adaptive system. What feedback loops exist in AI training? Apply equity-in-science principles. Conduct a risk-benefit analysis comparing AI-only, human-only, and hybrid approaches. Who bears responsibility for the bias? What would responsible conduct of research look like here?' },
  ],
};

// ── File I/O ──

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function profilePath(id) {
  return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json');
}

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch {
      fs.renameSync(fp, fp + '.corrupt.' + Date.now());
    }
  }
  return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) {
  ensureDataDir();
  fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8');
}

// ── Helpers ──

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length
    ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100
    : 0;
}

function masteryLabel(r) {
  return r >= 0.9 ? 'mastered'
    : r >= MASTERY_THRESHOLD ? 'proficient'
    : r >= 0.6 ? 'developing'
    : r > 0 ? 'emerging'
    : 'not-started';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

function resolveSkillKey(level, skillName) {
  const levelSkills = SKILLS[level];
  if (!levelSkills) return null;
  for (const [cat, skills] of Object.entries(levelSkills)) {
    if (skills.includes(skillName)) return { level, category: cat, skill: skillName };
  }
  return null;
}

function norm(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, '');
}

// ── Exercise generation ──

function generateExercise(level, skill, count = 5) {
  let bank = CONTENT_BANKS[level]?.[skill];
  if (!bank && level === 'advanced') bank = CONTENT_BANKS.standard?.[skill];
  if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q,
    answer: q.a,
    type: q.type || 'short',
    ...(q.alt && { alternatives: q.alt }),
    ...(q.hint && { hint: q.hint }),
  }));
  return {
    type: 'reasoning',
    skill,
    level,
    count: items.length,
    instruction: 'Answer each scientific reasoning question.',
    items,
  };
}

// ── Answer checking ──

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

function checkWithAlternatives(type, expected, answer, alternatives) {
  if (checkAnswer(type, expected, answer)) return true;
  if (alternatives && Array.isArray(alternatives)) {
    return alternatives.some(alt => norm(alt) === norm(answer));
  }
  return false;
}

// ── Main class ──

class Reasoning {
  getProfile(id) {
    const p = loadProfile(id);
    return {
      studentId: p.studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: p.assessments.length,
    };
  }

  start(id, level) {
    if (level) this.setLevel(id, level);
    const profile = this.getProfile(id);
    const nextSkills = this.next(id);
    return { action: 'start', profile, nextSkills };
  }

  lesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const target = this.next(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Consider advancing to the next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    const scenario = SCENARIOS[level] ? pick(SCENARIOS[level], 1)[0] : null;
    return {
      studentId: id,
      level,
      targetSkill: target,
      exercise,
      scenario,
      lessonPlan: {
        hook: `Reasoning scenario related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Apply reasoning to: "${scenario.title}"` : 'Practice reasoning across domains',
        reflect: 'What reasoning pattern did you use? Where else could you apply it?',
      },
    };
  }

  exercise(id, skill) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    if (skill) {
      return generateExercise(level, skill, 5);
    }
    const n = this.next(id, 1).next;
    return n.length
      ? generateExercise(level, n[0].skill, 5)
      : { message: 'All skills proficient at current level!' };
  }

  check(id, type, expected, answer) {
    let exp = expected;
    let alts = null;
    for (const bankLevel of Object.values(CONTENT_BANKS)) {
      for (const bankSkill of Object.values(bankLevel)) {
        const match = bankSkill.questions?.find(q => q.a === exp);
        if (match && match.alt) { alts = match.alt; break; }
      }
      if (alts) break;
    }
    const correct = checkWithAlternatives(type, exp, answer, alts);
    return { correct, expected: exp, studentAnswer: answer };
  }

  record(id, level, category, skill, score, total, notes) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`);
    if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    if (!p.level) p.level = level;
    const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes: notes || '' };
    p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  progress(id) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const ls = SKILLS[level] || {};
    const results = {};
    let mastered = 0;
    let total = 0;
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

  report(id) {
    const p = loadProfile(id);
    return {
      studentId: id,
      level: p.level,
      progress: this.progress(id),
      recentAssessments: p.assessments.slice(-20).reverse(),
    };
  }

  next(id, count) {
    count = count || 5;
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[level] || {})) {
      for (const sk of skills) {
        const d = p.skills[`${level}/${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) {
          candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
        }
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, level, next: candidates.slice(0, count) };
  }

  catalog(level) {
    const lv = level || 'standard';
    const ls = SKILLS[lv];
    if (!ls) return { level: lv, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` };
    let total = 0;
    const cat = {};
    for (const [c, skills] of Object.entries(ls)) {
      total += skills.length;
      cat[c] = [...skills];
    }
    return { level: lv, skills: cat, totalSkills: total };
  }

  setLevel(id, level) {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    const p = loadProfile(id);
    p.level = level;
    saveProfile(p);
    return { studentId: id, level };
  }

  scenario(level) {
    const lv = level || 'standard';
    const scenarios = SCENARIOS[lv];
    if (!scenarios) return { error: `No scenarios for ${lv}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  students() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }
}

// ── CLI dispatch ──

module.exports = Reasoning;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Reasoning();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': {
        const [, id, level] = args;
        if (!id) throw new Error('Usage: start <id> [level]');
        out(api.start(id, level || null));
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
        out(api.exercise(id, skill || null));
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        let exp = expected;
        try { exp = JSON.parse(expected); } catch {}
        out(api.check(args[1], type, exp, answer));
        break;
      }
      case 'record': {
        const [, id, level, cat, skill, sc, tot, ...notes] = args;
        if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]');
        out(api.record(id, level, cat, skill, Number(sc), Number(tot), notes.join(' ')));
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
        const [, lv] = args;
        out(lv ? api.catalog(lv) : { levels: Object.keys(SKILLS) });
        break;
      }
      case 'set-level': {
        const [, id, lv] = args;
        if (!id || !lv) throw new Error('Usage: set-level <id> <level>');
        out(api.setLevel(id, lv));
        break;
      }
      case 'scenario': {
        const [, lv] = args;
        if (!lv) throw new Error('Usage: scenario <level>');
        out(api.scenario(lv));
        break;
      }
      case 'students': {
        out(api.students());
        break;
      }
      default:
        out({
          usage: 'node reasoning.js <command> [args]',
          commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-level', 'scenario'],
          levels: Object.keys(SKILLS),
        });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
