// College Research Methods Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-research-methods');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'experimental-design': ['variables-and-controls', 'hypothesis-formation', 'sampling-methods', 'randomization', 'basic-experimental-design'],
    'descriptive-statistics': ['measures-of-center', 'measures-of-spread', 'distributions', 'data-types', 'graphical-summaries'],
    'scientific-writing': ['imrad-format', 'citation-basics', 'lab-report-structure', 'scientific-language', 'paraphrasing'],
    'literature-review': ['database-searching', 'evaluating-sources', 'reading-abstracts', 'identifying-gaps', 'annotated-bibliography'],
    'data-visualization': ['bar-charts-histograms', 'scatter-plots', 'line-graphs', 'choosing-chart-types', 'labeling-conventions'],
    'ethics-basics': ['informed-consent', 'irb-overview', 'plagiarism', 'data-fabrication', 'responsible-conduct'],
  },
  'intermediate': {
    'experimental-design': ['factorial-designs', 'within-vs-between-subjects', 'blocking', 'counterbalancing', 'quasi-experimental-designs'],
    'inferential-statistics': ['t-tests', 'one-way-anova', 'chi-square-tests', 'correlation-analysis', 'simple-linear-regression'],
    'scientific-writing': ['writing-abstracts', 'results-sections', 'discussion-sections', 'peer-review-process', 'responding-to-reviewers'],
    'literature-review': ['systematic-searching', 'inclusion-exclusion-criteria', 'synthesis-vs-summary', 'conceptual-frameworks', 'theoretical-foundations'],
    'data-visualization': ['multi-panel-figures', 'error-bars', 'box-plots', 'heatmaps', 'figure-captions'],
    'research-ethics': ['irb-protocols', 'vulnerable-populations', 'conflicts-of-interest', 'authorship-ethics', 'data-management-plans'],
  },
  'upper-division': {
    'advanced-design': ['power-analysis', 'mixed-designs', 'longitudinal-designs', 'crossover-studies', 'adaptive-designs'],
    'advanced-statistics': ['multiple-regression', 'mixed-effects-models', 'effect-sizes-and-ci', 'non-parametric-tests', 'bayesian-basics'],
    'scientific-writing': ['grant-proposals', 'systematic-reviews', 'meta-analysis-writing', 'manuscript-revision', 'replication-studies'],
    'data-visualization': ['tufte-principles', 'publication-quality-figures', 'interactive-visualizations', 'multivariate-displays', 'reproducible-figures'],
    'reproducibility': ['pre-registration', 'open-data', 'open-materials', 'replication-crisis', 'registered-reports'],
    'advanced-ethics': ['research-with-animals', 'genetic-data-ethics', 'big-data-ethics', 'international-research-ethics', 'dual-use-research'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'variables-and-controls': {
      questions: [
        { q: 'What is an independent variable?', a: 'The variable manipulated by the researcher', type: 'concept' },
        { q: 'What is a dependent variable?', a: 'The variable measured as the outcome', type: 'concept' },
        { q: 'What is a confounding variable?', a: 'An unmeasured variable that affects both the IV and DV, threatening internal validity', type: 'concept' },
        { q: 'What is a control group?', a: 'A group that does not receive the experimental treatment, used for comparison', type: 'concept' },
        { q: 'What is the difference between a positive and negative control?', a: 'Positive control: expected to show effect. Negative control: expected to show no effect', type: 'concept' },
        { q: 'What is operationalization?', a: 'Defining a variable in terms of how it will be measured', type: 'concept' },
        { q: 'In a drug trial, the drug is the ___ variable and patient recovery is the ___ variable.', a: 'independent, dependent', type: 'concept' },
        { q: 'What is a controlled variable (constant)?', a: 'A variable kept the same across all conditions to prevent confounding', type: 'concept' },
      ],
    },
    'hypothesis-formation': {
      questions: [
        { q: 'What is a hypothesis?', a: 'A testable prediction about the relationship between variables', type: 'concept' },
        { q: 'What is the null hypothesis?', a: 'The hypothesis that there is no effect or no difference', type: 'concept' },
        { q: 'What is the alternative hypothesis?', a: 'The hypothesis that there is an effect or a difference', type: 'concept' },
        { q: 'What makes a hypothesis testable?', a: 'It must be falsifiable — possible to disprove with evidence', type: 'concept' },
        { q: 'What is the difference between a hypothesis and a theory?', a: 'Hypothesis: specific testable prediction. Theory: broad, well-supported explanation', type: 'concept' },
        { q: 'What is a directional hypothesis?', a: 'One that predicts the specific direction of the effect (e.g., A > B)', type: 'concept' },
      ],
    },
    'sampling-methods': {
      questions: [
        { q: 'What is random sampling?', a: 'Every member of the population has an equal chance of being selected', type: 'concept' },
        { q: 'What is stratified sampling?', a: 'Dividing the population into subgroups and sampling from each', type: 'concept' },
        { q: 'What is convenience sampling?', a: 'Selecting participants based on availability (non-random)', type: 'concept' },
        { q: 'What is sampling bias?', a: 'Systematic error in who is included in the sample, limiting generalizability', type: 'concept' },
        { q: 'What is the difference between a sample and a population?', a: 'Population: entire group of interest. Sample: subset studied', type: 'concept' },
        { q: 'What is external validity?', a: 'The extent to which results generalize to other settings, people, and times', type: 'concept' },
        { q: 'What is snowball sampling?', a: 'Existing participants recruit future participants (useful for hard-to-reach populations)', type: 'concept' },
        { q: 'Why is sample size important?', a: 'Larger samples reduce sampling error and increase statistical power', type: 'concept' },
      ],
    },
    'randomization': {
      questions: [
        { q: 'What is random assignment?', a: 'Assigning participants to conditions by chance to control for confounds', type: 'concept' },
        { q: 'How is random assignment different from random sampling?', a: 'Random sampling: who is selected. Random assignment: who goes to which condition', type: 'concept' },
        { q: 'Why is random assignment important?', a: 'It distributes confounding variables equally across groups', type: 'concept' },
        { q: 'What is a randomized controlled trial (RCT)?', a: 'An experiment with random assignment to treatment and control groups', type: 'concept' },
        { q: 'What is blinding in experiments?', a: 'Keeping participants (single-blind) or both participants and researchers (double-blind) unaware of group assignment', type: 'concept' },
        { q: 'What is a placebo?', a: 'An inert treatment given to the control group to account for expectation effects', type: 'concept' },
      ],
    },
    'basic-experimental-design': {
      questions: [
        { q: 'What is a between-subjects design?', a: 'Different participants in each condition', type: 'concept' },
        { q: 'What is a within-subjects design?', a: 'Same participants tested in all conditions', type: 'concept' },
        { q: 'What is internal validity?', a: 'Confidence that the IV caused changes in the DV', type: 'concept' },
        { q: 'What is a pretest-posttest design?', a: 'Measuring the DV before and after the treatment', type: 'concept' },
        { q: 'What is a pilot study?', a: 'A small-scale preliminary study to test procedures before the main study', type: 'concept' },
        { q: 'What is replication?', a: 'Repeating a study to verify its findings', type: 'concept' },
      ],
    },
    'measures-of-center': {
      questions: [
        { q: 'What is the mean?', a: 'Sum of all values divided by the number of values', type: 'concept' },
        { q: 'What is the median?', a: 'The middle value when data is ordered', type: 'concept' },
        { q: 'What is the mode?', a: 'The most frequently occurring value', type: 'concept' },
        { q: 'When is the median preferred over the mean?', a: 'When data is skewed or has outliers', type: 'concept' },
        { q: 'Calculate the mean of: 3, 5, 7, 9, 11', a: '7', type: 'calculation' },
        { q: 'A dataset has values 1, 2, 2, 3, 100. Which measure of center best represents it?', a: 'median (2), because the outlier (100) inflates the mean', type: 'concept' },
      ],
    },
    'measures-of-spread': {
      questions: [
        { q: 'What is the range?', a: 'Maximum value minus minimum value', type: 'concept' },
        { q: 'What is standard deviation?', a: 'Average distance of data points from the mean', type: 'concept' },
        { q: 'What is variance?', a: 'The square of the standard deviation', type: 'concept' },
        { q: 'What is the interquartile range (IQR)?', a: 'Q3 - Q1, the range of the middle 50% of data', type: 'concept' },
        { q: 'Why is standard deviation preferred over range?', a: 'SD uses all data points; range is sensitive to outliers', type: 'concept' },
        { q: 'In a normal distribution, about what percentage falls within 1 SD of the mean?', a: '68%', type: 'concept' },
      ],
    },
    'distributions': {
      questions: [
        { q: 'What is a normal distribution?', a: 'A symmetric, bell-shaped distribution defined by mean and standard deviation', type: 'concept' },
        { q: 'What is a skewed distribution?', a: 'A distribution that is asymmetric, with a longer tail on one side', type: 'concept' },
        { q: 'In a right-skewed distribution, where is the mean relative to the median?', a: 'Mean is greater than median', type: 'concept' },
        { q: 'What is the empirical rule (68-95-99.7)?', a: '68% within 1 SD, 95% within 2 SD, 99.7% within 3 SD of the mean', type: 'concept' },
        { q: 'What is a bimodal distribution?', a: 'A distribution with two peaks', type: 'concept' },
        { q: 'What is a z-score?', a: 'Number of standard deviations a value is from the mean: z = (x - mean)/SD', type: 'concept' },
      ],
    },
    'data-types': {
      questions: [
        { q: 'What is nominal data?', a: 'Categories with no natural order (e.g., colors, species)', type: 'concept' },
        { q: 'What is ordinal data?', a: 'Categories with a natural order but unequal intervals (e.g., rankings)', type: 'concept' },
        { q: 'What is interval data?', a: 'Numeric data with equal intervals but no true zero (e.g., temperature in Celsius)', type: 'concept' },
        { q: 'What is ratio data?', a: 'Numeric data with equal intervals and a true zero (e.g., mass, length)', type: 'concept' },
        { q: 'Is blood type nominal, ordinal, interval, or ratio?', a: 'nominal', type: 'concept' },
        { q: 'Is temperature in Kelvin interval or ratio?', a: 'ratio (has a true zero)', type: 'concept' },
      ],
    },
    'graphical-summaries': {
      questions: [
        { q: 'When should you use a histogram?', a: 'To show the distribution of a single continuous variable', type: 'concept' },
        { q: 'When should you use a bar chart?', a: 'To compare counts or means across categories', type: 'concept' },
        { q: 'What does a box plot show?', a: 'Median, quartiles, range, and outliers', type: 'concept' },
        { q: 'What is a scatter plot used for?', a: 'Showing the relationship between two continuous variables', type: 'concept' },
        { q: 'What is a misleading graph?', a: 'A graph that distorts data through truncated axes, inappropriate scales, or cherry-picked data', type: 'concept' },
        { q: 'What should every graph include?', a: 'Title, labeled axes with units, legend if needed, and clear data representation', type: 'concept' },
      ],
    },
    'imrad-format': {
      questions: [
        { q: 'What does IMRaD stand for?', a: 'Introduction, Methods, Results, and Discussion', type: 'concept' },
        { q: 'What goes in the Introduction section?', a: 'Background, literature review, rationale, and hypothesis', type: 'concept' },
        { q: 'What goes in the Methods section?', a: 'Detailed description of participants, materials, procedures, and analysis plan', type: 'concept' },
        { q: 'What goes in the Results section?', a: 'Data and statistical findings without interpretation', type: 'concept' },
        { q: 'What goes in the Discussion section?', a: 'Interpretation of results, limitations, implications, and future directions', type: 'concept' },
        { q: 'Why is reproducibility of methods important?', a: 'Other researchers must be able to replicate the study exactly', type: 'concept' },
      ],
    },
    'citation-basics': {
      questions: [
        { q: 'Why do we cite sources?', a: 'To give credit, avoid plagiarism, and allow readers to verify claims', type: 'concept' },
        { q: 'Name two common citation styles in science.', a: 'APA and CSE (Council of Science Editors)', type: 'concept' },
        { q: 'What is an in-text citation?', a: 'A brief reference within the text pointing to the full reference list', type: 'concept' },
        { q: 'What is a DOI?', a: 'Digital Object Identifier — a permanent link to a published work', type: 'concept' },
        { q: 'What is the difference between a reference list and a bibliography?', a: 'Reference list: only cited works. Bibliography: all works consulted', type: 'concept' },
        { q: 'What is a primary source in science?', a: 'An original research article reporting new data', type: 'concept' },
      ],
    },
    'lab-report-structure': {
      questions: [
        { q: 'What is the purpose of a lab report?', a: 'To document an experiment so it can be understood and replicated', type: 'concept' },
        { q: 'What should an abstract contain?', a: 'Brief summary of purpose, methods, key results, and conclusion', type: 'concept' },
        { q: 'How should data be presented in a lab report?', a: 'In tables and figures with clear labels, captions, and proper formatting', type: 'concept' },
        { q: 'What tense is used for the Methods section?', a: 'past tense', type: 'concept' },
        { q: 'What tense is used for established facts in the Introduction?', a: 'present tense', type: 'concept' },
        { q: 'What are significant figures?', a: 'Digits that carry meaning about the precision of a measurement', type: 'concept' },
      ],
    },
    'scientific-language': {
      questions: [
        { q: 'Why should scientific writing avoid first person (traditionally)?', a: 'To maintain objectivity, though modern practice sometimes allows it', type: 'concept' },
        { q: 'What is hedging in scientific writing?', a: 'Using cautious language (may, suggests, appears to) to avoid overclaiming', type: 'concept' },
        { q: 'Why should you avoid "proves" in science?', a: 'Science provides evidence for or against; proof is for math/logic', type: 'concept' },
        { q: 'What does it mean to write concisely?', a: 'Using the fewest words needed to convey meaning clearly', type: 'concept' },
        { q: 'What is jargon and when is it appropriate?', a: 'Technical terminology; appropriate for expert audience, define for general audience', type: 'concept' },
        { q: 'What is passive voice? Example in science?', a: 'Subject receives action. Example: "The solution was heated" vs. "We heated the solution"', type: 'concept' },
      ],
    },
    'paraphrasing': {
      questions: [
        { q: 'What is paraphrasing?', a: 'Restating someone elses ideas in your own words', type: 'concept' },
        { q: 'Does paraphrasing still require a citation?', a: 'yes', type: 'concept' },
        { q: 'What is the difference between paraphrasing and quoting?', a: 'Paraphrasing: your words, their ideas. Quoting: their exact words in quotation marks', type: 'concept' },
        { q: 'When is quoting preferred over paraphrasing in science?', a: 'Rarely; paraphrasing is preferred in scientific writing', type: 'concept' },
        { q: 'What is patchwriting?', a: 'Replacing a few words from a source without truly rephrasing — a form of plagiarism', type: 'concept' },
        { q: 'What is the best strategy for paraphrasing?', a: 'Read, set aside the source, write from memory, then check accuracy', type: 'concept' },
      ],
    },
    'database-searching': {
      questions: [
        { q: 'Name two major scientific databases.', a: 'PubMed and Web of Science (also Google Scholar, Scopus)', type: 'concept' },
        { q: 'What are Boolean operators in database searching?', a: 'AND, OR, NOT — used to combine or exclude search terms', type: 'concept' },
        { q: 'What is a MeSH term?', a: 'Medical Subject Heading — controlled vocabulary used in PubMed', type: 'concept' },
        { q: 'What does the AND operator do?', a: 'Narrows results by requiring both terms to be present', type: 'concept' },
        { q: 'What does the OR operator do?', a: 'Broadens results by including either term', type: 'concept' },
        { q: 'What is a truncation search?', a: 'Using a wildcard (e.g., neuro*) to find all words with that root', type: 'concept' },
      ],
    },
    'evaluating-sources': {
      questions: [
        { q: 'What is peer review?', a: 'Evaluation of a manuscript by experts before publication', type: 'concept' },
        { q: 'What makes a source credible in science?', a: 'Peer-reviewed, published in reputable journal, transparent methods', type: 'concept' },
        { q: 'What is a predatory journal?', a: 'A journal that charges fees but provides little or no peer review', type: 'concept' },
        { q: 'What is impact factor?', a: 'A measure of how often articles in a journal are cited', type: 'concept' },
        { q: 'What is a preprint?', a: 'A research paper shared before peer review', type: 'concept' },
        { q: 'What criteria evaluate source quality? (CRAAP test)', a: 'Currency, Relevance, Authority, Accuracy, Purpose', type: 'concept' },
      ],
    },
    'reading-abstracts': {
      questions: [
        { q: 'What information does a structured abstract contain?', a: 'Background, objectives, methods, results, conclusions', type: 'concept' },
        { q: 'Why read abstracts first when reviewing literature?', a: 'To quickly determine relevance before reading the full paper', type: 'concept' },
        { q: 'What should you look for in an abstract?', a: 'Study purpose, sample size, key findings, and main conclusion', type: 'concept' },
        { q: 'Can you cite a paper based only on the abstract?', a: 'No, you should read the full paper before citing', type: 'concept' },
        { q: 'What is the difference between structured and unstructured abstracts?', a: 'Structured has labeled sections; unstructured is a single paragraph', type: 'concept' },
        { q: 'What word count do most journal abstracts require?', a: '150-300 words', type: 'concept' },
      ],
    },
    'identifying-gaps': {
      questions: [
        { q: 'What is a research gap?', a: 'An area where existing research is insufficient or missing', type: 'concept' },
        { q: 'How do you identify research gaps?', a: 'By reading review articles, noting limitations sections, and comparing studies', type: 'concept' },
        { q: 'Why is identifying gaps important?', a: 'It justifies new research and shows the contribution of your study', type: 'concept' },
        { q: 'Where in a paper are gaps typically discussed?', a: 'Introduction (to motivate the study) and Discussion (for future directions)', type: 'concept' },
        { q: 'What is a systematic review useful for in gap identification?', a: 'It synthesizes all available evidence, making gaps visible', type: 'concept' },
        { q: 'What types of gaps exist?', a: 'Methodological, population, theoretical, practical/applied', type: 'concept' },
      ],
    },
    'annotated-bibliography': {
      questions: [
        { q: 'What is an annotated bibliography?', a: 'A list of citations each followed by a brief summary and evaluation', type: 'concept' },
        { q: 'What should an annotation include?', a: 'Summary of main findings, evaluation of quality, and relevance to your topic', type: 'concept' },
        { q: 'How long is a typical annotation?', a: '100-200 words', type: 'concept' },
        { q: 'What is the purpose of an annotated bibliography?', a: 'To organize sources, evaluate their quality, and track relevance to your research', type: 'concept' },
        { q: 'Is an annotated bibliography the same as a literature review?', a: 'No; a lit review synthesizes themes, while annotations summarize individual sources', type: 'concept' },
        { q: 'Should annotations be descriptive, evaluative, or both?', a: 'Both — summarize content and assess quality/relevance', type: 'concept' },
      ],
    },
    'bar-charts-histograms': {
      questions: [
        { q: 'What is the key difference between a bar chart and a histogram?', a: 'Bar chart: categorical data (gaps between bars). Histogram: continuous data (no gaps)', type: 'concept' },
        { q: 'What does the y-axis of a histogram represent?', a: 'Frequency or count', type: 'concept' },
        { q: 'What is a bin in a histogram?', a: 'A range of values grouped together', type: 'concept' },
        { q: 'When should you use a stacked bar chart?', a: 'To show composition of each category by sub-categories', type: 'concept' },
        { q: 'Should bar charts start at zero?', a: 'Yes, to avoid exaggerating differences', type: 'concept' },
        { q: 'What does bar height represent in a bar chart?', a: 'The value being compared (count, mean, percentage, etc.)', type: 'concept' },
      ],
    },
    'scatter-plots': {
      questions: [
        { q: 'When do you use a scatter plot?', a: 'To show the relationship between two continuous variables', type: 'concept' },
        { q: 'What does a positive trend in a scatter plot look like?', a: 'Points go from lower-left to upper-right', type: 'concept' },
        { q: 'What is a trend line?', a: 'A line of best fit showing the overall direction of the relationship', type: 'concept' },
        { q: 'Can a scatter plot show a nonlinear relationship?', a: 'Yes (e.g., U-shaped, exponential)', type: 'concept' },
        { q: 'What is the correlation coefficient r?', a: 'A measure of linear association between -1 and 1', type: 'concept' },
        { q: 'Does correlation imply causation?', a: 'no', type: 'concept' },
      ],
    },
    'line-graphs': {
      questions: [
        { q: 'When should you use a line graph?', a: 'To show change over time or a continuous ordered variable', type: 'concept' },
        { q: 'What goes on the x-axis of a time series line graph?', a: 'Time', type: 'concept' },
        { q: 'Can you connect points in a scatter plot like a line graph?', a: 'Only if the x-axis represents a continuous ordered variable', type: 'concept' },
        { q: 'What do multiple lines on the same graph represent?', a: 'Different groups or conditions for comparison', type: 'concept' },
        { q: 'Should you extrapolate beyond the data range?', a: 'Generally no, it can lead to unreliable predictions', type: 'concept' },
        { q: 'What is interpolation?', a: 'Estimating values within the range of observed data', type: 'concept' },
      ],
    },
    'choosing-chart-types': {
      questions: [
        { q: 'One categorical variable, one numeric: which chart?', a: 'bar chart', type: 'concept' },
        { q: 'Distribution of one continuous variable: which chart?', a: 'histogram', type: 'concept' },
        { q: 'Relationship between two continuous variables: which chart?', a: 'scatter plot', type: 'concept' },
        { q: 'Change over time: which chart?', a: 'line graph', type: 'concept' },
        { q: 'Proportions of a whole: which chart?', a: 'pie chart (or stacked bar chart)', type: 'concept' },
        { q: 'Why are pie charts often discouraged in science?', a: 'Humans are poor at comparing angles; bar charts are more accurate', type: 'concept' },
      ],
    },
    'labeling-conventions': {
      questions: [
        { q: 'What must every axis have?', a: 'A label and units', type: 'concept' },
        { q: 'Where should the figure caption go?', a: 'Below the figure', type: 'concept' },
        { q: 'Where should the table title go?', a: 'Above the table', type: 'concept' },
        { q: 'What font size is appropriate for axis labels?', a: 'Large enough to be readable when the figure is at publication size', type: 'concept' },
        { q: 'What is a legend in a figure?', a: 'A key explaining symbols, colors, or line styles', type: 'concept' },
        { q: 'Should you use grid lines?', a: 'Sparingly or not at all; they can add clutter', type: 'concept' },
      ],
    },
    'informed-consent': {
      questions: [
        { q: 'What is informed consent?', a: 'Voluntary agreement to participate after being told about the study, risks, and rights', type: 'concept' },
        { q: 'What elements must informed consent include?', a: 'Purpose, procedures, risks, benefits, confidentiality, voluntary participation, right to withdraw', type: 'concept' },
        { q: 'Can children give informed consent?', a: 'No; they give assent while parents/guardians give consent', type: 'concept' },
        { q: 'What is coercion in research?', a: 'Pressuring someone to participate (e.g., through authority or excessive payment)', type: 'concept' },
        { q: 'When might informed consent be waived?', a: 'Minimal risk research with anonymous data where consent is impractical', type: 'concept' },
        { q: 'What is debriefing?', a: 'Explaining the full study purpose to participants after completion', type: 'concept' },
      ],
    },
    'irb-overview': {
      questions: [
        { q: 'What is an IRB?', a: 'Institutional Review Board — committee that reviews research involving human subjects', type: 'concept' },
        { q: 'What is the purpose of an IRB?', a: 'To protect the rights and welfare of research participants', type: 'concept' },
        { q: 'What are the three levels of IRB review?', a: 'Exempt, expedited, and full board review', type: 'concept' },
        { q: 'What historical event led to the Belmont Report?', a: 'Tuskegee syphilis study', type: 'concept' },
        { q: 'What are the three principles of the Belmont Report?', a: 'Respect for persons, beneficence, justice', type: 'concept' },
        { q: 'Must all research with human subjects have IRB approval?', a: 'Yes, or an exemption determination', type: 'concept' },
      ],
    },
    'plagiarism': {
      questions: [
        { q: 'What is plagiarism?', a: 'Presenting someone elses work or ideas as your own without attribution', type: 'concept' },
        { q: 'Is self-plagiarism possible?', a: 'Yes — reusing your own published work without disclosure', type: 'concept' },
        { q: 'What is the best way to avoid plagiarism?', a: 'Always cite sources, paraphrase properly, and use quotation marks for direct quotes', type: 'concept' },
        { q: 'What tools detect plagiarism?', a: 'Turnitin, iThenticate, and other text-matching software', type: 'concept' },
        { q: 'Is it plagiarism to paraphrase without citing?', a: 'yes', type: 'concept' },
        { q: 'What are the consequences of plagiarism in academia?', a: 'Retraction, career damage, academic expulsion, loss of credibility', type: 'concept' },
      ],
    },
    'data-fabrication': {
      questions: [
        { q: 'What is data fabrication?', a: 'Making up data that was never collected', type: 'concept' },
        { q: 'What is data falsification?', a: 'Manipulating or altering real data to change results', type: 'concept' },
        { q: 'What is p-hacking?', a: 'Running many analyses until you find a significant p-value', type: 'concept' },
        { q: 'What is HARKing?', a: 'Hypothesizing After Results are Known — presenting post-hoc hypotheses as a priori', type: 'concept' },
        { q: 'What is cherry-picking data?', a: 'Selectively reporting data that supports your hypothesis while omitting contradictory data', type: 'concept' },
        { q: 'Who investigates research misconduct in the US?', a: 'Office of Research Integrity (ORI)', type: 'concept' },
      ],
    },
    'responsible-conduct': {
      questions: [
        { q: 'What is responsible conduct of research (RCR)?', a: 'Ethical practices in planning, conducting, and reporting research', type: 'concept' },
        { q: 'What is a conflict of interest in research?', a: 'When personal or financial interests could bias the research', type: 'concept' },
        { q: 'What is data sharing?', a: 'Making research data available to other researchers for verification and reuse', type: 'concept' },
        { q: 'What is mentoring responsibility in research?', a: 'Senior researchers must train juniors in ethical practices', type: 'concept' },
        { q: 'What should you do if you suspect research misconduct?', a: 'Report it through institutional channels', type: 'concept' },
        { q: 'What is intellectual property in research?', a: 'Ownership rights over inventions, data, and publications', type: 'concept' },
      ],
    },
  },
  'intermediate': {
    'factorial-designs': {
      questions: [
        { q: 'What is a factorial design?', a: 'An experiment with two or more independent variables, each with multiple levels', type: 'concept' },
        { q: 'What is a 2x3 factorial design?', a: 'Two IVs: one with 2 levels and one with 3 levels (6 conditions total)', type: 'concept' },
        { q: 'What is a main effect?', a: 'The overall effect of one IV averaging across levels of the other IV', type: 'concept' },
        { q: 'What is an interaction effect?', a: 'When the effect of one IV depends on the level of another IV', type: 'concept' },
        { q: 'How many conditions does a 2x2x3 design have?', a: '12', type: 'calculation' },
        { q: 'What pattern on a graph indicates an interaction?', a: 'Non-parallel lines when plotting means', type: 'concept' },
      ],
    },
    'within-vs-between-subjects': {
      questions: [
        { q: 'What is the main advantage of within-subjects designs?', a: 'Each participant serves as their own control, reducing individual differences', type: 'concept' },
        { q: 'What is a carryover effect?', a: 'When participation in one condition affects performance in another (within-subjects)', type: 'concept' },
        { q: 'What is the main advantage of between-subjects designs?', a: 'No carryover effects between conditions', type: 'concept' },
        { q: 'What is a mixed design?', a: 'Combines within and between-subjects factors in one study', type: 'concept' },
        { q: 'Which design requires more participants?', a: 'Between-subjects (needs separate groups)', type: 'concept' },
        { q: 'How do you counterbalance in a within-subjects design?', a: 'Vary the order of conditions across participants', type: 'concept' },
      ],
    },
    'blocking': {
      questions: [
        { q: 'What is blocking in experimental design?', a: 'Grouping similar units together before random assignment to reduce variability', type: 'concept' },
        { q: 'What is a block?', a: 'A group of experimental units that are similar on a relevant characteristic', type: 'concept' },
        { q: 'How does blocking differ from stratified sampling?', a: 'Blocking is for assignment to conditions; stratification is for selecting participants', type: 'concept' },
        { q: 'What is a randomized complete block design?', a: 'Every treatment appears once in each block', type: 'concept' },
        { q: 'When is blocking useful?', a: 'When there is a known source of variability you want to control', type: 'concept' },
        { q: 'What is a matched-pairs design?', a: 'A block design with blocks of size 2, matched on a key variable', type: 'concept' },
      ],
    },
    'counterbalancing': {
      questions: [
        { q: 'What is counterbalancing?', a: 'Systematically varying the order of conditions to control for order effects', type: 'concept' },
        { q: 'What is a Latin square design?', a: 'Each condition appears equally in each position across participants', type: 'concept' },
        { q: 'How many orders does complete counterbalancing of 3 conditions require?', a: '6 (3! = 3 factorial)', type: 'calculation' },
        { q: 'What is a practice effect?', a: 'Improved performance due to familiarity with the task', type: 'concept' },
        { q: 'What is a fatigue effect?', a: 'Decreased performance due to tiredness from repeated testing', type: 'concept' },
        { q: 'When is counterbalancing most important?', a: 'In within-subjects designs where order effects are likely', type: 'concept' },
      ],
    },
    'quasi-experimental-designs': {
      questions: [
        { q: 'What is a quasi-experiment?', a: 'A study that resembles an experiment but lacks random assignment', type: 'concept' },
        { q: 'Why might random assignment be impossible?', a: 'Ethical constraints, pre-existing groups, or practical limitations', type: 'concept' },
        { q: 'What is a natural experiment?', a: 'Researchers exploit a naturally occurring event as an IV', type: 'concept' },
        { q: 'What is an interrupted time series design?', a: 'Multiple measurements before and after an intervention without a control group', type: 'concept' },
        { q: 'What is the main threat to quasi-experiments?', a: 'Selection bias — groups may differ before the intervention', type: 'concept' },
        { q: 'What is a nonequivalent control group design?', a: 'Comparing a treatment group to a similar but not randomly assigned control group', type: 'concept' },
      ],
    },
    't-tests': {
      questions: [
        { q: 'When do you use a t-test?', a: 'To compare means of two groups', type: 'concept' },
        { q: 'What is the difference between a paired and independent t-test?', a: 'Paired: same subjects in both conditions. Independent: different subjects', type: 'concept' },
        { q: 'What does a p-value represent?', a: 'Probability of obtaining results as extreme as observed, assuming the null is true', type: 'concept' },
        { q: 'What is alpha level (significance level)?', a: 'Threshold for rejecting the null hypothesis (commonly 0.05)', type: 'concept' },
        { q: 'What assumptions does an independent t-test require?', a: 'Normality, independence, equal variances (or Welch correction)', type: 'concept' },
        { q: 'What is a Type I error?', a: 'Rejecting a true null hypothesis (false positive)', type: 'concept' },
        { q: 'What is a Type II error?', a: 'Failing to reject a false null hypothesis (false negative)', type: 'concept' },
        { q: 'What is degrees of freedom for an independent t-test?', a: 'n1 + n2 - 2', type: 'concept' },
      ],
    },
    'one-way-anova': {
      questions: [
        { q: 'When do you use a one-way ANOVA?', a: 'To compare means across three or more groups', type: 'concept' },
        { q: 'What does ANOVA stand for?', a: 'Analysis of Variance', type: 'concept' },
        { q: 'What is the F-ratio?', a: 'Between-group variance divided by within-group variance', type: 'concept' },
        { q: 'What does a significant F-test tell you?', a: 'At least one group mean differs, but not which ones', type: 'concept' },
        { q: 'What are post-hoc tests?', a: 'Follow-up tests to determine which specific groups differ (e.g., Tukey HSD)', type: 'concept' },
        { q: 'What is the assumption of homogeneity of variance?', a: 'All groups have similar variances', type: 'concept' },
      ],
    },
    'chi-square-tests': {
      questions: [
        { q: 'When do you use a chi-square test?', a: 'To test associations between categorical variables', type: 'concept' },
        { q: 'What is a chi-square goodness-of-fit test?', a: 'Tests whether observed frequencies match expected frequencies', type: 'concept' },
        { q: 'What is a chi-square test of independence?', a: 'Tests whether two categorical variables are related', type: 'concept' },
        { q: 'What data goes in a chi-square test?', a: 'Frequency counts (not means or percentages)', type: 'concept' },
        { q: 'What is the expected frequency formula?', a: '(row total x column total) / grand total', type: 'concept' },
        { q: 'What is the minimum expected frequency rule?', a: 'Expected frequency should be at least 5 in each cell', type: 'concept' },
      ],
    },
    'correlation-analysis': {
      questions: [
        { q: 'What does Pearson r measure?', a: 'The strength and direction of a linear relationship between two continuous variables', type: 'concept' },
        { q: 'What is the range of r?', a: '-1 to +1', type: 'concept' },
        { q: 'What does r = 0 mean?', a: 'No linear relationship', type: 'concept' },
        { q: 'What is coefficient of determination?', a: 'r^2 — proportion of variance in Y explained by X', type: 'concept' },
        { q: 'What is Spearmans rho used for?', a: 'Correlation between ranked/ordinal data', type: 'concept' },
        { q: 'Does correlation imply causation?', a: 'No — there may be confounding variables or reverse causation', type: 'concept' },
      ],
    },
    'simple-linear-regression': {
      questions: [
        { q: 'What does simple linear regression do?', a: 'Predicts a DV from one IV using a best-fit line', type: 'concept' },
        { q: 'What is the regression equation?', a: 'Y = a + bX (or Y-hat = b0 + b1*X)', type: 'concept' },
        { q: 'What is the slope in regression?', a: 'Change in Y for a one-unit change in X', type: 'concept' },
        { q: 'What is the intercept?', a: 'Predicted value of Y when X = 0', type: 'concept' },
        { q: 'What is a residual?', a: 'Difference between observed and predicted value (Y - Y-hat)', type: 'concept' },
        { q: 'What does R^2 represent in regression?', a: 'Proportion of variance in Y explained by the model', type: 'concept' },
      ],
    },
    'writing-abstracts': {
      questions: [
        { q: 'What is the typical word limit for a scientific abstract?', a: '150-300 words', type: 'concept' },
        { q: 'What should the first sentence of an abstract convey?', a: 'The research problem or context', type: 'concept' },
        { q: 'Should an abstract include citations?', a: 'Generally no', type: 'concept' },
        { q: 'Should an abstract include specific results?', a: 'Yes — key quantitative findings', type: 'concept' },
        { q: 'What is the last sentence typically about?', a: 'The main conclusion or implications', type: 'concept' },
        { q: 'When should you write the abstract?', a: 'Last, after the full paper is written', type: 'concept' },
      ],
    },
    'results-sections': {
      questions: [
        { q: 'What goes in the Results section?', a: 'Statistical findings organized by hypothesis, without interpretation', type: 'concept' },
        { q: 'How should you report a t-test result?', a: 't(df) = value, p = value, with effect size', type: 'concept' },
        { q: 'Should you report non-significant results?', a: 'Yes — all pre-planned analyses should be reported', type: 'concept' },
        { q: 'What is APA format for reporting statistics?', a: 'Italicize test statistic, report df, exact p, and effect size', type: 'concept' },
        { q: 'Should you include tables or figures in Results?', a: 'Yes, to supplement (not duplicate) text descriptions', type: 'concept' },
        { q: 'What is the difference between Results and Discussion?', a: 'Results: what you found. Discussion: what it means', type: 'concept' },
      ],
    },
    'discussion-sections': {
      questions: [
        { q: 'What is the first paragraph of a Discussion typically about?', a: 'Summary of key findings and whether they support hypotheses', type: 'concept' },
        { q: 'What should limitations include?', a: 'Honest assessment of design weaknesses and how they might affect conclusions', type: 'concept' },
        { q: 'What are future directions?', a: 'Suggestions for follow-up studies addressing limitations or extending findings', type: 'concept' },
        { q: 'Should you introduce new data in the Discussion?', a: 'No', type: 'concept' },
        { q: 'How do you relate findings to prior literature?', a: 'Compare your results to previous studies, explaining consistencies and discrepancies', type: 'concept' },
        { q: 'What is the practical significance of findings?', a: 'Real-world applications and implications beyond statistical significance', type: 'concept' },
      ],
    },
    'peer-review-process': {
      questions: [
        { q: 'What is single-blind peer review?', a: 'Reviewers know author identity; authors do not know reviewers', type: 'concept' },
        { q: 'What is double-blind peer review?', a: 'Neither reviewers nor authors know each others identity', type: 'concept' },
        { q: 'What possible decisions can a journal make?', a: 'Accept, minor revisions, major revisions, reject', type: 'concept' },
        { q: 'What should a reviewer evaluate?', a: 'Methods rigor, results validity, significance, writing quality, ethics', type: 'concept' },
        { q: 'What is open peer review?', a: 'Reviews are publicly accessible, sometimes with reviewer names', type: 'concept' },
        { q: 'How long does peer review typically take?', a: 'Weeks to months', type: 'concept' },
      ],
    },
    'responding-to-reviewers': {
      questions: [
        { q: 'How should you respond to reviewer comments?', a: 'Point-by-point, addressing each concern with changes made or rebuttals', type: 'concept' },
        { q: 'Should you address every reviewer comment?', a: 'Yes, even if you disagree (provide a reasoned response)', type: 'concept' },
        { q: 'What tone should a response letter have?', a: 'Professional, respectful, and grateful', type: 'concept' },
        { q: 'How do you highlight changes in a revised manuscript?', a: 'Track changes or highlighted text, referenced in the response letter', type: 'concept' },
        { q: 'What if you disagree with a reviewer?', a: 'Provide evidence-based justification for your position', type: 'concept' },
        { q: 'What is a revision deadline?', a: 'The time limit (often 30-90 days) to submit a revised manuscript', type: 'concept' },
      ],
    },
    'systematic-searching': {
      questions: [
        { q: 'What is a systematic search?', a: 'A comprehensive, reproducible search strategy to find all relevant studies', type: 'concept' },
        { q: 'What is a PRISMA flow diagram?', a: 'A diagram showing how studies were identified, screened, and included', type: 'concept' },
        { q: 'Why search multiple databases?', a: 'Different databases index different journals; no single database is comprehensive', type: 'concept' },
        { q: 'What is grey literature?', a: 'Research not published in peer-reviewed journals (theses, reports, conference papers)', type: 'concept' },
        { q: 'What is a search string?', a: 'A combination of terms with Boolean operators for database searching', type: 'concept' },
        { q: 'Why document your search strategy?', a: 'For transparency and reproducibility', type: 'concept' },
      ],
    },
    'inclusion-exclusion-criteria': {
      questions: [
        { q: 'What are inclusion criteria?', a: 'Characteristics a study must have to be included in a review', type: 'concept' },
        { q: 'What are exclusion criteria?', a: 'Characteristics that disqualify a study from the review', type: 'concept' },
        { q: 'When should criteria be defined?', a: 'Before the search begins (a priori)', type: 'concept' },
        { q: 'What is PICOS?', a: 'Population, Intervention, Comparison, Outcome, Study design — framework for criteria', type: 'concept' },
        { q: 'Should you exclude studies based on quality?', a: 'Debated; some reviews exclude, others include with quality assessment', type: 'concept' },
        { q: 'What is screening?', a: 'Reviewing titles, abstracts, then full texts against criteria', type: 'concept' },
      ],
    },
    'synthesis-vs-summary': {
      questions: [
        { q: 'What is the difference between synthesis and summary in a lit review?', a: 'Summary: describes each study. Synthesis: identifies themes and patterns across studies', type: 'concept' },
        { q: 'What is a thematic organization?', a: 'Organizing literature by themes rather than study-by-study', type: 'concept' },
        { q: 'What makes a good literature review?', a: 'Critical evaluation, synthesis of findings, and identification of gaps', type: 'concept' },
        { q: 'Should a lit review only include studies that support your hypothesis?', a: 'No — include contradictory findings too', type: 'concept' },
        { q: 'What is a narrative review?', a: 'A qualitative summary of literature without systematic methods', type: 'concept' },
        { q: 'What is a concept map?', a: 'A visual tool connecting related ideas to organize a literature review', type: 'concept' },
      ],
    },
    'conceptual-frameworks': {
      questions: [
        { q: 'What is a conceptual framework?', a: 'A visual or narrative model showing relationships between key variables in your study', type: 'concept' },
        { q: 'How does a conceptual framework differ from a theory?', a: 'Framework is specific to your study; theory is a broader established explanation', type: 'concept' },
        { q: 'What is the purpose of a conceptual framework?', a: 'To guide research design, data collection, and analysis', type: 'concept' },
        { q: 'What should a conceptual framework include?', a: 'Key variables, relationships between them, and the direction of hypothesized effects', type: 'concept' },
        { q: 'Where does the conceptual framework appear in a paper?', a: 'Usually at the end of the Introduction or literature review', type: 'concept' },
        { q: 'What is a mediator variable?', a: 'A variable that explains how/why X affects Y (X -> M -> Y)', type: 'concept' },
      ],
    },
    'theoretical-foundations': {
      questions: [
        { q: 'What is a theoretical foundation?', a: 'An established theory that provides the basis for your research', type: 'concept' },
        { q: 'Why ground research in theory?', a: 'It provides rationale, generates testable predictions, and connects to existing knowledge', type: 'concept' },
        { q: 'What is a moderator variable?', a: 'A variable that changes the strength/direction of the relationship between X and Y', type: 'concept' },
        { q: 'What is operationalization in the context of a theory?', a: 'Translating abstract theoretical concepts into measurable variables', type: 'concept' },
        { q: 'What is a testable prediction from a theory?', a: 'A specific, falsifiable hypothesis derived from the theory', type: 'concept' },
        { q: 'How do you evaluate whether a theory is useful?', a: 'By its explanatory power, predictive accuracy, parsimony, and falsifiability', type: 'concept' },
      ],
    },
    'multi-panel-figures': {
      questions: [
        { q: 'What is a multi-panel figure?', a: 'A figure with multiple sub-plots labeled A, B, C, etc.', type: 'concept' },
        { q: 'When should you use a multi-panel figure?', a: 'When comparing related results or showing different aspects of the same dataset', type: 'concept' },
        { q: 'How should panels be labeled?', a: 'With capital letters (A, B, C) in the upper-left corner', type: 'concept' },
        { q: 'Should panels share axes when possible?', a: 'Yes, to facilitate comparison', type: 'concept' },
        { q: 'What goes in the figure caption for a multi-panel figure?', a: 'Description of each panel referenced by letter', type: 'concept' },
        { q: 'What is a compound figure?', a: 'A multi-panel figure combining different plot types', type: 'concept' },
      ],
    },
    'error-bars': {
      questions: [
        { q: 'What do error bars represent?', a: 'Variability or uncertainty — typically SD, SE, or 95% CI', type: 'concept' },
        { q: 'What is the difference between SD and SE error bars?', a: 'SD shows data spread; SE shows precision of the mean estimate', type: 'concept' },
        { q: 'Which error bars are best for comparing groups?', a: '95% confidence intervals', type: 'concept' },
        { q: 'Why must figures always state what error bars represent?', a: 'Different types have different interpretations and magnitudes', type: 'concept' },
        { q: 'What is a 95% confidence interval?', a: 'Range that would contain the true mean in 95% of repeated samples', type: 'concept' },
        { q: 'Can overlapping error bars still have significant differences?', a: 'Yes (for SE bars); overlap rules are approximate', type: 'concept' },
      ],
    },
    'box-plots': {
      questions: [
        { q: 'What five values define a standard box plot?', a: 'Minimum, Q1, median, Q3, maximum (or whiskers to 1.5*IQR)', type: 'concept' },
        { q: 'What do whiskers in a box plot represent?', a: 'Range of data within 1.5*IQR from the quartiles (typically)', type: 'concept' },
        { q: 'How are outliers shown on a box plot?', a: 'As individual points beyond the whiskers', type: 'concept' },
        { q: 'What advantage do box plots have over bar charts?', a: 'They show distribution shape, spread, and outliers', type: 'concept' },
        { q: 'What is a violin plot?', a: 'A box plot combined with a density estimate showing distribution shape', type: 'concept' },
        { q: 'When should you use box plots instead of bar charts?', a: 'When showing distribution and variability is important', type: 'concept' },
      ],
    },
    'heatmaps': {
      questions: [
        { q: 'What is a heatmap?', a: 'A grid visualization where color represents data values', type: 'concept' },
        { q: 'When are heatmaps useful?', a: 'For displaying patterns in large matrices (gene expression, correlations)', type: 'concept' },
        { q: 'What is a color scale?', a: 'The legend mapping colors to data values', type: 'concept' },
        { q: 'What color palette works for diverging data?', a: 'Two-color gradient (e.g., blue-white-red) centered at zero', type: 'concept' },
        { q: 'Should heatmaps be accompanied by numerical values?', a: 'Sometimes, in small heatmaps; large ones rely on color only', type: 'concept' },
        { q: 'What is hierarchical clustering in a heatmap?', a: 'Reordering rows/columns to group similar patterns together', type: 'concept' },
      ],
    },
    'figure-captions': {
      questions: [
        { q: 'What is the first sentence of a caption called?', a: 'The figure title — a brief description of what the figure shows', type: 'concept' },
        { q: 'Should a caption allow the figure to stand alone?', a: 'Yes — readers should understand the figure without reading the main text', type: 'concept' },
        { q: 'What should a caption include?', a: 'Description of what is shown, sample sizes, statistical details, abbreviations', type: 'concept' },
        { q: 'Where are captions placed?', a: 'Below figures, above tables', type: 'concept' },
        { q: 'Should abbreviations in figures be defined in the caption?', a: 'yes', type: 'concept' },
        { q: 'How should significance be indicated in figures?', a: 'Asterisks or letters with explanation in the caption (e.g., *p < 0.05)', type: 'concept' },
      ],
    },
    'irb-protocols': {
      questions: [
        { q: 'What must an IRB protocol include?', a: 'Study purpose, methods, risks, consent procedures, data management, personnel', type: 'concept' },
        { q: 'What is a protocol amendment?', a: 'A modification to an approved protocol that must be reviewed', type: 'concept' },
        { q: 'What is continuing review?', a: 'Annual review of ongoing research by the IRB', type: 'concept' },
        { q: 'What triggers full board review?', a: 'Greater than minimal risk to participants', type: 'concept' },
        { q: 'What is minimal risk?', a: 'Risk no greater than that encountered in daily life', type: 'concept' },
        { q: 'What is an adverse event report?', a: 'Notification to the IRB of unexpected harm to participants', type: 'concept' },
      ],
    },
    'vulnerable-populations': {
      questions: [
        { q: 'Who are vulnerable populations in research?', a: 'Children, prisoners, pregnant women, cognitively impaired, economically disadvantaged', type: 'concept' },
        { q: 'What extra protections do children require?', a: 'Parental consent plus child assent; minimal risk unless direct benefit', type: 'concept' },
        { q: 'Why are prisoners considered vulnerable?', a: 'Their confined environment may limit voluntary participation', type: 'concept' },
        { q: 'What is assent?', a: 'Agreement from someone unable to give legal consent (e.g., a child)', type: 'concept' },
        { q: 'What is therapeutic misconception?', a: 'Participants mistaking research participation for individualized treatment', type: 'concept' },
        { q: 'How should research with vulnerable populations be justified?', a: 'Must demonstrate that the research cannot be done with non-vulnerable groups', type: 'concept' },
      ],
    },
    'conflicts-of-interest': {
      questions: [
        { q: 'What is a financial conflict of interest?', a: 'When a researcher has financial ties that could bias their research', type: 'concept' },
        { q: 'How should conflicts be managed?', a: 'Disclosure, independent oversight, recusal from certain decisions', type: 'concept' },
        { q: 'Where must conflicts be disclosed?', a: 'In grant applications, IRB submissions, and published papers', type: 'concept' },
        { q: 'What is an intellectual conflict of interest?', a: 'Strong theoretical commitments that might bias interpretation', type: 'concept' },
        { q: 'What is a conflict of commitment?', a: 'Outside activities that interfere with research responsibilities', type: 'concept' },
        { q: 'Can funding source introduce bias?', a: 'Yes — industry-funded studies show favorable results more often', type: 'concept' },
      ],
    },
    'authorship-ethics': {
      questions: [
        { q: 'What are the ICMJE criteria for authorship?', a: 'Substantial contribution, drafting/revising, approval, accountability', type: 'concept' },
        { q: 'What is gift authorship?', a: 'Including someone as author who did not meet authorship criteria', type: 'concept' },
        { q: 'What is ghost authorship?', a: 'Excluding someone who made substantial contributions', type: 'concept' },
        { q: 'How should author order be determined?', a: 'By contribution, with agreement among all authors', type: 'concept' },
        { q: 'What is the corresponding author responsible for?', a: 'Communication with the journal and ensuring all authors approve the manuscript', type: 'concept' },
        { q: 'What is a CRediT statement?', a: 'A standardized way to report individual author contributions', type: 'concept' },
      ],
    },
    'data-management-plans': {
      questions: [
        { q: 'What is a data management plan (DMP)?', a: 'A document describing how data will be collected, stored, shared, and preserved', type: 'concept' },
        { q: 'Why do funders require DMPs?', a: 'To ensure data is accessible, reusable, and responsibly managed', type: 'concept' },
        { q: 'What is data de-identification?', a: 'Removing personal identifiers to protect participant privacy', type: 'concept' },
        { q: 'How long should research data be retained?', a: 'Typically 5-10 years after publication, per institutional or funder policy', type: 'concept' },
        { q: 'What are FAIR data principles?', a: 'Findable, Accessible, Interoperable, Reusable', type: 'concept' },
        { q: 'What is a data repository?', a: 'A platform for storing and sharing research data (e.g., Dryad, Zenodo, figshare)', type: 'concept' },
      ],
    },
  },
  'upper-division': {
    'power-analysis': {
      questions: [
        { q: 'What is statistical power?', a: 'Probability of correctly rejecting a false null hypothesis (1 - beta)', type: 'concept' },
        { q: 'What is the conventional threshold for adequate power?', a: '0.80 (80%)', type: 'concept' },
        { q: 'What four factors determine power?', a: 'Sample size, effect size, alpha level, and variability', type: 'concept' },
        { q: 'What is effect size?', a: 'A standardized measure of the magnitude of an effect (e.g., Cohens d, r)', type: 'concept' },
        { q: 'When should power analysis be conducted?', a: 'Before data collection (a priori) to determine required sample size', type: 'concept' },
        { q: 'What is Cohens d?', a: 'Standardized difference between two means: d = (M1 - M2)/SD_pooled', type: 'concept' },
      ],
    },
    'mixed-designs': {
      questions: [
        { q: 'What is a mixed-effects model?', a: 'A model with both fixed effects (population-level) and random effects (group-specific)', type: 'concept' },
        { q: 'What is a random effect?', a: 'A factor whose levels are a random sample from a larger population', type: 'concept' },
        { q: 'When are mixed models needed?', a: 'Nested/hierarchical data, repeated measures, clustered data', type: 'concept' },
        { q: 'What is ICC (intraclass correlation)?', a: 'Proportion of variance due to grouping (between-group / total variance)', type: 'concept' },
        { q: 'What is a random intercept model?', a: 'Groups have different baseline levels but the same effect of predictors', type: 'concept' },
        { q: 'What is a random slope model?', a: 'Groups can have different relationships between predictor and outcome', type: 'concept' },
      ],
    },
    'longitudinal-designs': {
      questions: [
        { q: 'What is a longitudinal study?', a: 'Measuring the same subjects repeatedly over time', type: 'concept' },
        { q: 'What is attrition?', a: 'Loss of participants over time in a longitudinal study', type: 'concept' },
        { q: 'What is a cohort study?', a: 'Following a group sharing a common characteristic over time', type: 'concept' },
        { q: 'What is a panel study?', a: 'Measuring the same individuals at multiple time points', type: 'concept' },
        { q: 'What is a cross-sectional study?', a: 'Measuring different groups at one time point', type: 'concept' },
        { q: 'What statistical methods handle longitudinal data?', a: 'Growth curve models, mixed-effects models, time series analysis', type: 'concept' },
      ],
    },
    'crossover-studies': {
      questions: [
        { q: 'What is a crossover study?', a: 'Each participant receives all treatments in a sequence with washout periods', type: 'concept' },
        { q: 'What is a washout period?', a: 'Time between treatments to eliminate carryover effects', type: 'concept' },
        { q: 'What is the advantage of a crossover design?', a: 'Each participant serves as their own control, reducing between-subject variability', type: 'concept' },
        { q: 'When is a crossover design inappropriate?', a: 'When the treatment has lasting effects or the condition changes over time', type: 'concept' },
        { q: 'What is a period effect?', a: 'Changes over time that affect the outcome regardless of treatment', type: 'concept' },
        { q: 'What is a carryover effect in crossover studies?', a: 'The effect of the first treatment persists into the second treatment period', type: 'concept' },
      ],
    },
    'adaptive-designs': {
      questions: [
        { q: 'What is an adaptive clinical trial?', a: 'A trial that allows modifications based on interim data', type: 'concept' },
        { q: 'What modifications can adaptive designs make?', a: 'Sample size, treatment arms, randomization ratios, patient population', type: 'concept' },
        { q: 'What is interim analysis?', a: 'Evaluating data before the study is complete', type: 'concept' },
        { q: 'What is a futility analysis?', a: 'Stopping a trial early if the treatment is unlikely to show benefit', type: 'concept' },
        { q: 'What is dose-finding in adaptive designs?', a: 'Adjusting dose levels based on observed responses', type: 'concept' },
        { q: 'What safeguard prevents bias in adaptive designs?', a: 'Pre-specified decision rules and independent data monitoring committees', type: 'concept' },
      ],
    },
    'multiple-regression': {
      questions: [
        { q: 'What is multiple regression?', a: 'Predicting a DV from two or more IVs simultaneously', type: 'concept' },
        { q: 'What is multicollinearity?', a: 'When predictors are highly correlated with each other', type: 'concept' },
        { q: 'How do you detect multicollinearity?', a: 'VIF (Variance Inflation Factor) > 10 indicates problems', type: 'concept' },
        { q: 'What is adjusted R^2?', a: 'R^2 corrected for the number of predictors (penalizes overfitting)', type: 'concept' },
        { q: 'What is a standardized regression coefficient (beta)?', a: 'Coefficient when all variables are standardized; allows comparison of relative effects', type: 'concept' },
        { q: 'What assumptions does multiple regression require?', a: 'Linearity, independence, normality of residuals, homoscedasticity, no multicollinearity', type: 'concept' },
      ],
    },
    'mixed-effects-models': {
      questions: [
        { q: 'What is the difference between fixed and random effects?', a: 'Fixed: specific levels of interest. Random: levels sampled from a population', type: 'concept' },
        { q: 'What is REML?', a: 'Restricted Maximum Likelihood — a method for estimating random effect variances', type: 'concept' },
        { q: 'What is a nested design?', a: 'Lower-level units (students) are within higher-level units (classrooms)', type: 'concept' },
        { q: 'Why not just use repeated-measures ANOVA?', a: 'Mixed models handle missing data, unbalanced designs, and complex correlation structures', type: 'concept' },
        { q: 'What is a likelihood ratio test?', a: 'Comparing nested models by their log-likelihoods to test if a parameter improves fit', type: 'concept' },
        { q: 'What is AIC used for in model selection?', a: 'Comparing models — lower AIC indicates better fit (penalizing complexity)', type: 'concept' },
      ],
    },
    'effect-sizes-and-ci': {
      questions: [
        { q: 'Why report effect sizes alongside p-values?', a: 'p-values indicate significance but not magnitude; effect sizes show practical importance', type: 'concept' },
        { q: 'What is a small, medium, and large Cohens d?', a: '0.2 (small), 0.5 (medium), 0.8 (large)', type: 'concept' },
        { q: 'What is eta-squared?', a: 'Proportion of total variance explained by the IV in ANOVA', type: 'concept' },
        { q: 'What does a confidence interval tell you?', a: 'A range of plausible values for the population parameter', type: 'concept' },
        { q: 'What does a 95% CI not containing zero indicate?', a: 'The effect is statistically significant at alpha = 0.05', type: 'concept' },
        { q: 'What is the relationship between CI width and sample size?', a: 'Larger samples produce narrower CIs', type: 'concept' },
      ],
    },
    'non-parametric-tests': {
      questions: [
        { q: 'When should you use non-parametric tests?', a: 'When assumptions of parametric tests are violated (non-normal, ordinal data, small n)', type: 'concept' },
        { q: 'What is the non-parametric alternative to an independent t-test?', a: 'Mann-Whitney U test', type: 'concept' },
        { q: 'What is the non-parametric alternative to paired t-test?', a: 'Wilcoxon signed-rank test', type: 'concept' },
        { q: 'What is the non-parametric alternative to one-way ANOVA?', a: 'Kruskal-Wallis test', type: 'concept' },
        { q: 'What do non-parametric tests typically compare?', a: 'Ranks rather than means', type: 'concept' },
        { q: 'What is the disadvantage of non-parametric tests?', a: 'Less statistical power when parametric assumptions are met', type: 'concept' },
      ],
    },
    'bayesian-basics': {
      questions: [
        { q: 'What is Bayes theorem?', a: 'P(H|D) = P(D|H)*P(H)/P(D) — posterior is proportional to likelihood times prior', type: 'concept' },
        { q: 'What is a prior in Bayesian analysis?', a: 'The probability of a hypothesis before seeing the data', type: 'concept' },
        { q: 'What is a posterior?', a: 'The updated probability of a hypothesis after seeing the data', type: 'concept' },
        { q: 'What is a Bayes factor?', a: 'Ratio of evidence for one hypothesis over another', type: 'concept' },
        { q: 'How does Bayesian analysis differ from frequentist?', a: 'Bayesian updates beliefs with data; frequentist tests against null hypothesis', type: 'concept' },
        { q: 'What is a credible interval?', a: 'Bayesian analog of a confidence interval; 95% probability the parameter is in this range', type: 'concept' },
      ],
    },
    'grant-proposals': {
      questions: [
        { q: 'What are the main sections of a grant proposal?', a: 'Specific aims, significance, innovation, approach, budget', type: 'concept' },
        { q: 'What is a specific aims page?', a: 'A one-page summary of the research goals and hypotheses', type: 'concept' },
        { q: 'What is a power statement in a grant?', a: 'Justification that the sample size is adequate to detect expected effects', type: 'concept' },
        { q: 'What is broader impacts?', a: 'How the research benefits society beyond scientific knowledge', type: 'concept' },
        { q: 'What is preliminary data?', a: 'Initial results demonstrating feasibility of the proposed research', type: 'concept' },
        { q: 'How are grants typically reviewed?', a: 'By a panel of expert peers who score and discuss the proposal', type: 'concept' },
      ],
    },
    'systematic-reviews': {
      questions: [
        { q: 'What is a systematic review?', a: 'A rigorous, reproducible synthesis of all evidence on a specific question', type: 'concept' },
        { q: 'What is PROSPERO?', a: 'An international registry for systematic review protocols', type: 'concept' },
        { q: 'What is risk of bias assessment?', a: 'Evaluating methodological quality of included studies', type: 'concept' },
        { q: 'What is a forest plot?', a: 'A visual display of individual study results and the pooled estimate', type: 'concept' },
        { q: 'What is heterogeneity in a meta-analysis?', a: 'Variation in results across studies (measured by I^2)', type: 'concept' },
        { q: 'What is publication bias?', a: 'Tendency for published studies to have positive results, distorting the evidence base', type: 'concept' },
      ],
    },
    'meta-analysis-writing': {
      questions: [
        { q: 'What is a meta-analysis?', a: 'A statistical combination of results from multiple studies', type: 'concept' },
        { q: 'What is a pooled effect size?', a: 'The weighted average effect across studies', type: 'concept' },
        { q: 'What is a fixed-effect vs random-effects model?', a: 'Fixed: assumes one true effect. Random: assumes effects vary across studies', type: 'concept' },
        { q: 'What is a funnel plot?', a: 'A plot of effect sizes vs. precision to detect publication bias', type: 'concept' },
        { q: 'What is a subgroup analysis?', a: 'Examining whether effect differs across defined subgroups', type: 'concept' },
        { q: 'What is a sensitivity analysis?', a: 'Testing whether conclusions change when studies are removed or methods vary', type: 'concept' },
      ],
    },
    'manuscript-revision': {
      questions: [
        { q: 'What is tracked changes?', a: 'A feature showing additions and deletions in a revised document', type: 'concept' },
        { q: 'What is a rebuttal letter?', a: 'A detailed response to reviewer comments explaining changes and disagreements', type: 'concept' },
        { q: 'How should substantive changes be documented?', a: 'Reference specific page/line numbers and quote new text', type: 'concept' },
        { q: 'What if reviews are contradictory?', a: 'Address both, explain your reasoning, and let the editor decide', type: 'concept' },
        { q: 'When should you seek a different journal?', a: 'After a reject decision (not after revise and resubmit)', type: 'concept' },
        { q: 'What is desk rejection?', a: 'Editor rejects without peer review (out of scope, quality, formatting)', type: 'concept' },
      ],
    },
    'replication-studies': {
      questions: [
        { q: 'What is a direct replication?', a: 'Repeating a study as closely as possible to the original', type: 'concept' },
        { q: 'What is a conceptual replication?', a: 'Testing the same hypothesis with different methods or populations', type: 'concept' },
        { q: 'Why is replication important?', a: 'It verifies findings and separates true effects from false positives', type: 'concept' },
        { q: 'What was the Reproducibility Project in psychology?', a: 'A large-scale effort that replicated only ~36% of 100 psychology studies', type: 'concept' },
        { q: 'What is a multi-site replication?', a: 'The same study conducted simultaneously at multiple labs', type: 'concept' },
        { q: 'What is a replication failure?', a: 'When a replication does not reproduce the original finding', type: 'concept' },
      ],
    },
    'tufte-principles': {
      questions: [
        { q: 'What is data-ink ratio?', a: 'The proportion of ink devoted to data vs. non-data elements (higher is better)', type: 'concept' },
        { q: 'What is chartjunk?', a: 'Unnecessary visual elements that distract from the data (per Tufte)', type: 'concept' },
        { q: 'What does Tufte mean by "above all else, show the data"?', a: 'Prioritize clear data representation over decoration', type: 'concept' },
        { q: 'What are small multiples?', a: 'Repeated small charts showing the same design for different subsets', type: 'concept' },
        { q: 'What is the lie factor?', a: 'Size of effect in graphic / size of effect in data — should be close to 1', type: 'concept' },
        { q: 'Why remove gridlines and heavy borders?', a: 'They add non-data ink and can distract from the data', type: 'concept' },
      ],
    },
    'publication-quality-figures': {
      questions: [
        { q: 'What resolution should publication figures be?', a: '300 DPI minimum for print', type: 'concept' },
        { q: 'What file formats do journals typically accept?', a: 'TIFF, EPS, PDF, or high-resolution PNG', type: 'concept' },
        { q: 'Why use vector graphics when possible?', a: 'They scale without losing quality', type: 'concept' },
        { q: 'What is a color-blind friendly palette?', a: 'Colors distinguishable by people with color vision deficiency (e.g., avoid red-green)', type: 'concept' },
        { q: 'Should figures use color or grayscale?', a: 'Color if available, but ensure they work in grayscale too', type: 'concept' },
        { q: 'What is the difference between RGB and CMYK?', a: 'RGB: screen display. CMYK: print. Journals may require CMYK', type: 'concept' },
      ],
    },
    'interactive-visualizations': {
      questions: [
        { q: 'What is an interactive visualization?', a: 'A figure that responds to user input (hover, click, zoom)', type: 'concept' },
        { q: 'Name tools for creating interactive visualizations.', a: 'Plotly, D3.js, Bokeh, Shiny, Tableau', type: 'concept' },
        { q: 'When are interactive plots most useful?', a: 'For exploring complex, multi-dimensional data or in online publications', type: 'concept' },
        { q: 'What is a dashboard?', a: 'A collection of interactive visualizations summarizing key metrics', type: 'concept' },
        { q: 'What accessibility concern exists for interactive visualizations?', a: 'Must work for screen readers and provide static alternatives', type: 'concept' },
        { q: 'Can interactive figures be included in journal articles?', a: 'Some journals accept them as supplementary materials', type: 'concept' },
      ],
    },
    'multivariate-displays': {
      questions: [
        { q: 'What is a parallel coordinates plot?', a: 'Lines connecting variable values for each observation across parallel axes', type: 'concept' },
        { q: 'What is a pairs plot (scatterplot matrix)?', a: 'Grid showing pairwise scatter plots for all variable combinations', type: 'concept' },
        { q: 'What is PCA visualization?', a: 'Plotting data in reduced dimensions defined by principal components', type: 'concept' },
        { q: 'What is a bubble chart?', a: 'A scatter plot where point size encodes a third variable', type: 'concept' },
        { q: 'What is a radar/spider chart?', a: 'A circular chart showing multivariate data on axes from a center point', type: 'concept' },
        { q: 'How many dimensions can a single static plot effectively show?', a: 'About 3-4 (x, y, color, size) before becoming hard to read', type: 'concept' },
      ],
    },
    'reproducible-figures': {
      questions: [
        { q: 'What is a reproducible figure?', a: 'A figure generated by code that can be re-run to recreate it exactly', type: 'concept' },
        { q: 'Why script figure generation?', a: 'For reproducibility, easy updates, and documentation of choices', type: 'concept' },
        { q: 'Name tools for scripted figure generation.', a: 'R ggplot2, Python matplotlib/seaborn, MATLAB, Julia Plots.jl', type: 'concept' },
        { q: 'What should be included with reproducible figures?', a: 'Code, data, software version, and random seed if applicable', type: 'concept' },
        { q: 'What is a figure pipeline?', a: 'A workflow that takes raw data and produces a final figure through code', type: 'concept' },
        { q: 'What is version control for figures?', a: 'Tracking changes to figure code over time (e.g., with Git)', type: 'concept' },
      ],
    },
    'pre-registration': {
      questions: [
        { q: 'What is pre-registration?', a: 'Publicly committing to hypotheses, methods, and analysis plan before data collection', type: 'concept' },
        { q: 'What platform is commonly used for pre-registration?', a: 'OSF (Open Science Framework) or AsPredicted', type: 'concept' },
        { q: 'Why pre-register?', a: 'To prevent p-hacking, HARKing, and increase transparency', type: 'concept' },
        { q: 'Does pre-registration prevent exploratory analysis?', a: 'No, it just requires labeling analyses as confirmatory or exploratory', type: 'concept' },
        { q: 'What is a registered report?', a: 'A manuscript format where methods are peer-reviewed before data collection', type: 'concept' },
        { q: 'What should a pre-registration include?', a: 'Hypotheses, design, sample size justification, analysis plan, exclusion criteria', type: 'concept' },
      ],
    },
    'open-data': {
      questions: [
        { q: 'What is open data?', a: 'Making research data freely available for reuse', type: 'concept' },
        { q: 'What are FAIR principles?', a: 'Findable, Accessible, Interoperable, Reusable', type: 'concept' },
        { q: 'Name common data repositories.', a: 'Dryad, Zenodo, figshare, OSF, Dataverse', type: 'concept' },
        { q: 'What is a data dictionary?', a: 'Documentation describing variables, coding, units, and missing values', type: 'concept' },
        { q: 'When should data not be shared?', a: 'When it contains identifiable information that cannot be de-identified', type: 'concept' },
        { q: 'What is a DOI for a dataset?', a: 'A permanent identifier making the dataset citable', type: 'concept' },
      ],
    },
    'open-materials': {
      questions: [
        { q: 'What are open materials?', a: 'Sharing stimuli, code, protocols, and analysis scripts used in research', type: 'concept' },
        { q: 'Why share analysis code?', a: 'For transparency, error checking, and reproducibility', type: 'concept' },
        { q: 'What is a computational notebook?', a: 'A document combining code, output, and narrative (Jupyter, R Markdown)', type: 'concept' },
        { q: 'What is containerization for reproducibility?', a: 'Packaging software and dependencies (Docker) to ensure consistent environments', type: 'concept' },
        { q: 'What license should open materials use?', a: 'An open license like CC-BY or MIT', type: 'concept' },
        { q: 'What is a code repository?', a: 'A platform for storing and sharing code (GitHub, GitLab)', type: 'concept' },
      ],
    },
    'replication-crisis': {
      questions: [
        { q: 'What is the replication crisis?', a: 'The finding that many published scientific results cannot be reproduced', type: 'concept' },
        { q: 'What factors contribute to the replication crisis?', a: 'Publication bias, p-hacking, small samples, lack of pre-registration', type: 'concept' },
        { q: 'What is the file drawer problem?', a: 'Non-significant results going unpublished, biasing the literature', type: 'concept' },
        { q: 'What fields are most affected?', a: 'Psychology, medicine, and social sciences, though all fields are affected', type: 'concept' },
        { q: 'What reforms address the crisis?', a: 'Pre-registration, open data, registered reports, larger samples, multi-site studies', type: 'concept' },
        { q: 'What is the "garden of forking paths"?', a: 'The many analysis choices researchers can make that inflate false positives', type: 'concept' },
      ],
    },
    'registered-reports': {
      questions: [
        { q: 'What is a registered report?', a: 'A publication format where peer review occurs before data collection', type: 'concept' },
        { q: 'What are the two stages of review?', a: 'Stage 1: protocol review. Stage 2: results review after data collection', type: 'concept' },
        { q: 'What is in-principle acceptance?', a: 'A commitment to publish results regardless of outcome (after Stage 1 approval)', type: 'concept' },
        { q: 'How do registered reports reduce bias?', a: 'Publication is not contingent on significant results', type: 'concept' },
        { q: 'What journals accept registered reports?', a: 'Over 300 journals across many fields (Nature Human Behaviour, PLOS, etc.)', type: 'concept' },
        { q: 'Can exploratory analyses be included?', a: 'Yes, clearly labeled as exploratory', type: 'concept' },
      ],
    },
    'research-with-animals': {
      questions: [
        { q: 'What is the 3Rs framework?', a: 'Replace (use alternatives), Reduce (fewer animals), Refine (minimize suffering)', type: 'concept' },
        { q: 'What committee oversees animal research?', a: 'IACUC (Institutional Animal Care and Use Committee)', type: 'concept' },
        { q: 'What is ARRIVE?', a: 'Guidelines for reporting animal research to improve transparency', type: 'concept' },
        { q: 'What justification must animal research provide?', a: 'Scientific necessity and that the knowledge cannot be obtained otherwise', type: 'concept' },
        { q: 'What is a humane endpoint?', a: 'A predetermined point at which animals are euthanized to prevent unnecessary suffering', type: 'concept' },
        { q: 'What is enrichment in animal research?', a: 'Providing stimulation and conditions that improve animal welfare', type: 'concept' },
      ],
    },
    'genetic-data-ethics': {
      questions: [
        { q: 'What is genetic privacy?', a: 'Protection of individuals genetic information from unauthorized access', type: 'concept' },
        { q: 'What is GINA?', a: 'Genetic Information Nondiscrimination Act — prohibits genetic discrimination in employment/insurance', type: 'concept' },
        { q: 'What is re-identification risk in genomics?', a: 'The possibility of identifying individuals from anonymized genetic data', type: 'concept' },
        { q: 'What is broad consent?', a: 'Consent for future unspecified research uses of stored data/samples', type: 'concept' },
        { q: 'What are biobanks?', a: 'Repositories of biological samples linked to health data', type: 'concept' },
        { q: 'What ethical issues arise from ancestry testing?', a: 'Unexpected findings (paternity, health risks), data privacy, law enforcement access', type: 'concept' },
      ],
    },
    'big-data-ethics': {
      questions: [
        { q: 'What are ethical concerns with big data research?', a: 'Privacy, consent, algorithmic bias, re-identification, surveillance', type: 'concept' },
        { q: 'Is public data exempt from ethical review?', a: 'Not necessarily — context matters (people may expect privacy even with public data)', type: 'concept' },
        { q: 'What is algorithmic bias?', a: 'Systematic errors in algorithms that produce unfair outcomes for certain groups', type: 'concept' },
        { q: 'What is data sovereignty?', a: 'The principle that data is subject to the laws of the country where it is collected', type: 'concept' },
        { q: 'What is the right to be forgotten?', a: 'Individuals right to have their personal data deleted (GDPR)', type: 'concept' },
        { q: 'What is differential privacy?', a: 'A mathematical framework ensuring individual data cannot be identified in aggregate data', type: 'concept' },
      ],
    },
    'international-research-ethics': {
      questions: [
        { q: 'What is the Declaration of Helsinki?', a: 'Ethical principles for medical research involving human subjects (WMA)', type: 'concept' },
        { q: 'What is ethical imperialism?', a: 'Imposing one cultures ethical standards on another', type: 'concept' },
        { q: 'What is community engagement in research?', a: 'Involving local communities in research design, conduct, and dissemination', type: 'concept' },
        { q: 'What is post-trial access?', a: 'Ensuring participants in developing countries receive beneficial treatments after a trial ends', type: 'concept' },
        { q: 'What is helicopter research?', a: 'Collecting data in developing countries without local involvement or benefit', type: 'concept' },
        { q: 'What is the Nagoya Protocol?', a: 'International agreement on access to genetic resources and benefit-sharing', type: 'concept' },
      ],
    },
    'dual-use-research': {
      questions: [
        { q: 'What is dual-use research?', a: 'Research that could be used for both beneficial and harmful purposes', type: 'concept' },
        { q: 'What is DURC (Dual Use Research of Concern)?', a: 'Research with agents or knowledge that could be directly misapplied to cause harm', type: 'concept' },
        { q: 'Give an example of dual-use research.', a: 'Gain-of-function research on pathogens, gene drives, AI capabilities', type: 'concept' },
        { q: 'How is dual-use research governed?', a: 'Institutional review, federal oversight, and risk-benefit assessment', type: 'concept' },
        { q: 'What is biosecurity?', a: 'Measures to prevent misuse of biological agents and research', type: 'concept' },
        { q: 'Should dual-use findings be published?', a: 'Case-by-case: balance scientific openness against security risks', type: 'concept' },
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
  if (!bank || !bank.questions) return { error: `No question bank for ${level}/${skill}` };

  const items = pick(bank.questions, count).map(q => {
    const item = { prompt: q.q, answer: q.a, type: q.type };
    if (q.choices) item.choices = shuffle(q.choices);
    return item;
  });

  return { type: 'research-methods', skill, level, count: items.length, instruction: 'Answer each question. Apply methodological reasoning.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class ResearchMethods {
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
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Evaluate a published study using this concept',
        synthesize: `Connect ${target.skill} to the overall research process`,
      },
    };
  }
}

module.exports = ResearchMethods;

// CLI: node research-methods.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new ResearchMethods();
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
      default: out({ usage: 'node research-methods.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
