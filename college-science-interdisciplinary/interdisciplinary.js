// eClaw College Interdisciplinary Science Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-interdisciplinary');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'biomolecule-basics': ['amino-acids-proteins', 'nucleic-acids', 'lipids-membranes', 'carbohydrates', 'enzyme-basics'],
    'energy-in-living-systems': ['atp-energy-currency', 'photosynthesis-overview', 'cellular-respiration-overview', 'thermodynamics-in-biology', 'redox-in-biology'],
    'computational-science-intro': ['programming-for-science', 'data-types-structures', 'basic-plotting', 'spreadsheet-analysis', 'databases-intro'],
    'science-in-society': ['science-literacy', 'science-news-evaluation', 'science-communication-basics', 'pseudoscience-identification', 'science-funding-policy'],
  },
  'intermediate': {
    'enzyme-kinetics': ['michaelis-menten', 'lineweaver-burk', 'enzyme-inhibition', 'allosteric-regulation', 'enzyme-engineering'],
    'biomechanics': ['forces-in-biology', 'fluid-dynamics-biology', 'locomotion', 'structural-biology-mechanics', 'prosthetics-biomaterials'],
    'ecological-modeling': ['population-models', 'predator-prey-dynamics', 'competition-models', 'ecosystem-simulation', 'conservation-modeling'],
    'data-wrangling': ['data-cleaning', 'exploratory-analysis', 'statistical-programming', 'data-visualization-intermediate', 'reproducible-workflows'],
    'science-policy': ['regulatory-frameworks', 'environmental-policy', 'public-health-policy', 'technology-assessment', 'science-advisory-roles'],
  },
  'upper-division': {
    'signal-transduction': ['receptor-signaling', 'second-messengers', 'kinase-cascades', 'gene-regulation-networks', 'systems-biology-modeling'],
    'structural-biology': ['protein-structure-methods', 'x-ray-crystallography', 'cryo-em', 'nmr-spectroscopy', 'molecular-dynamics'],
    'climate-modeling-advanced': ['earth-system-models', 'carbon-cycle-feedbacks', 'aerosol-climate-interactions', 'sea-level-projections', 'tipping-points'],
    'ml-for-science': ['supervised-learning-science', 'unsupervised-learning-science', 'neural-networks-applications', 'image-analysis-science', 'scientific-ml-ethics'],
    'regulatory-science': ['drug-approval-process', 'environmental-impact-assessment', 'risk-assessment', 'evidence-based-policy', 'international-science-governance'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'amino-acids-proteins': { items: [
      { prompt: 'What are the four levels of protein structure?', answer: 'Primary (amino acid sequence), secondary (alpha helices/beta sheets), tertiary (3D fold), quaternary (multi-subunit)', type: 'concept' },
      { prompt: 'What bonds stabilize secondary structure?', answer: 'Hydrogen bonds between backbone N-H and C=O groups', type: 'concept' },
      { prompt: 'How many standard amino acids are there?', answer: '20', type: 'concept' },
    ] },
    'nucleic-acids': { items: [
      { prompt: 'Compare DNA and RNA structurally.', answer: 'DNA: deoxyribose, double-stranded, thymine. RNA: ribose, usually single-stranded, uracil', type: 'concept' },
      { prompt: 'What type of bond links nucleotides?', answer: 'Phosphodiester bond (between 3\' OH and 5\' phosphate)', type: 'concept' },
    ] },
    'lipids-membranes': { items: [
      { prompt: 'Why do phospholipids form bilayers in water?', answer: 'Amphipathic: hydrophilic heads face water, hydrophobic tails face each other. Thermodynamically favorable in aqueous environment', type: 'concept' },
    ] },
    'carbohydrates': { items: [
      { prompt: 'Distinguish monosaccharides, disaccharides, and polysaccharides with examples.', answer: 'Mono: glucose. Di: sucrose. Poly: starch (storage), cellulose (structural), glycogen (animal storage)', type: 'concept' },
    ] },
    'enzyme-basics': { items: [
      { prompt: 'How do enzymes catalyze reactions?', answer: 'Lower activation energy by stabilizing transition state. Substrate binds active site. Not consumed in reaction', type: 'concept' },
    ] },
    'atp-energy-currency': { items: [
      { prompt: 'Why is ATP called the energy currency of the cell?', answer: 'Hydrolysis of phosphoanhydride bonds releases energy (-30.5 kJ/mol) to drive endergonic reactions. Rapidly recycled', type: 'concept' },
    ] },
    'photosynthesis-overview': { items: [
      { prompt: 'Write the overall equation for photosynthesis.', answer: '6CO2 + 6H2O + light -> C6H12O6 + 6O2', type: 'concept' },
    ] },
    'cellular-respiration-overview': { items: [
      { prompt: 'What are the three stages of cellular respiration?', answer: 'Glycolysis (cytoplasm), Krebs cycle (mitochondrial matrix), oxidative phosphorylation (inner mitochondrial membrane)', type: 'concept' },
    ] },
    'thermodynamics-in-biology': { items: [
      { prompt: 'Is life a violation of the second law of thermodynamics?', answer: 'No. Organisms are open systems that decrease local entropy by increasing entropy of surroundings (total entropy increases)', type: 'concept' },
    ] },
    'redox-in-biology': { items: [
      { prompt: 'In cellular respiration, what is oxidized and what is reduced?', answer: 'Glucose is oxidized (loses electrons). O2 is reduced (gains electrons). Energy released drives ATP synthesis', type: 'concept' },
    ] },
    'programming-for-science': { items: [
      { prompt: 'Why is Python popular in scientific computing?', answer: 'Rich ecosystem (NumPy, SciPy, Pandas, Matplotlib), readable syntax, Jupyter notebooks for reproducibility, strong community', type: 'concept' },
    ] },
    'data-types-structures': { items: [
      { prompt: 'Compare arrays and dataframes for scientific data.', answer: 'Arrays (NumPy): homogeneous numerical data, fast math. DataFrames (Pandas): heterogeneous, labeled columns, SQL-like operations', type: 'concept' },
    ] },
    'basic-plotting': { items: [
      { prompt: 'What plot type is best for showing a relationship between two continuous variables?', answer: 'Scatter plot. Add regression line if testing linear relationship. Consider log scales for wide ranges', type: 'concept' },
    ] },
    'spreadsheet-analysis': { items: [
      { prompt: 'What are limitations of spreadsheets for scientific data?', answer: 'Not reproducible, error-prone for large datasets, limited statistical tools, version control issues, data corruption risks', type: 'concept' },
    ] },
    'databases-intro': { items: [
      { prompt: 'Name two major biological databases and what they store.', answer: 'GenBank/NCBI: nucleotide sequences. PDB (Protein Data Bank): 3D protein structures. UniProt: protein sequences and function', type: 'concept' },
    ] },
    'science-literacy': { items: [
      { prompt: 'What distinguishes a scientific claim from a non-scientific one?', answer: 'Scientific claims are testable, falsifiable, evidence-based, peer-reviewed, and provisional (open to revision)', type: 'concept' },
    ] },
    'science-news-evaluation': { items: [
      { prompt: 'Name three red flags when evaluating science news.', answer: 'Sensationalist headlines, no link to original paper, single study treated as definitive, no expert quotes, conflict of interest', type: 'concept' },
    ] },
    'science-communication-basics': { items: [
      { prompt: 'What makes an effective science communication to a general audience?', answer: 'Clear language, relevant analogies, focus on "why it matters," visual aids, honest about uncertainty, avoid jargon', type: 'concept' },
    ] },
    'pseudoscience-identification': { items: [
      { prompt: 'List criteria that distinguish science from pseudoscience.', answer: 'Falsifiability, peer review, reproducibility, evidence-based, self-correcting. Pseudoscience: unfalsifiable, anecdotal, appeal to authority', type: 'concept' },
    ] },
    'science-funding-policy': { items: [
      { prompt: 'How is basic research typically funded?', answer: 'Government agencies (NSF, NIH), competitive peer-reviewed grants, university overhead. Applied research also has industry funding', type: 'concept' },
    ] },
  },
  'intermediate': {
    'michaelis-menten': { items: [
      { prompt: 'Write the Michaelis-Menten equation and define Km and Vmax.', answer: 'v = Vmax[S]/(Km + [S]). Vmax: maximum rate at saturation. Km: substrate concentration at half-Vmax (measure of affinity)', type: 'concept' },
      { prompt: 'What does a low Km indicate?', answer: 'High enzyme affinity for substrate — reaches half-maximal velocity at lower substrate concentration', type: 'concept' },
    ] },
    'lineweaver-burk': { items: [
      { prompt: 'What is a Lineweaver-Burk plot?', answer: '1/v vs 1/[S]. Linear form of Michaelis-Menten. y-intercept = 1/Vmax, x-intercept = -1/Km, slope = Km/Vmax', type: 'concept' },
    ] },
    'enzyme-inhibition': { items: [
      { prompt: 'Compare competitive and non-competitive inhibition.', answer: 'Competitive: binds active site, increases apparent Km, same Vmax. Non-competitive: binds elsewhere, same Km, decreases Vmax', type: 'concept' },
    ] },
    'allosteric-regulation': { items: [
      { prompt: 'What is allosteric regulation?', answer: 'Binding at a site other than active site changes enzyme shape and activity. Can be activation or inhibition. Sigmoidal kinetics', type: 'concept' },
    ] },
    'enzyme-engineering': { items: [
      { prompt: 'What is directed evolution?', answer: 'Engineering enzymes by iterative rounds of random mutagenesis and selection for desired activity. Nobel Prize 2018 (Frances Arnold)', type: 'concept' },
    ] },
    'forces-in-biology': { items: [
      { prompt: 'What forces are relevant at the cellular scale?', answer: 'Surface tension, viscous drag (low Reynolds number), electrostatic, van der Waals, osmotic pressure. Gravity is negligible', type: 'concept' },
    ] },
    'fluid-dynamics-biology': { items: [
      { prompt: 'Why is blood flow modeled differently than water in a pipe?', answer: 'Blood is non-Newtonian (viscosity varies with shear rate), flows in elastic vessels, contains cells. Pulsatile, not steady', type: 'concept' },
    ] },
    'locomotion': { items: [
      { prompt: 'How does body size affect locomotion strategy?', answer: 'Small organisms: dominated by viscous forces (low Re), use cilia/flagella. Large: inertia dominates, use limbs/fins/wings', type: 'concept' },
    ] },
    'structural-biology-mechanics': { items: [
      { prompt: 'What makes bone both strong and tough?', answer: 'Composite material: mineral (hydroxyapatite, stiffness) + collagen (flexibility). Hierarchical structure resists both fracture and deformation', type: 'concept' },
    ] },
    'prosthetics-biomaterials': { items: [
      { prompt: 'What properties must a biocompatible implant material have?', answer: 'Non-toxic, non-immunogenic, appropriate mechanical properties, corrosion resistant, integrates with tissue or remains inert', type: 'concept' },
    ] },
    'population-models': { items: [
      { prompt: 'Write the logistic growth equation and explain its terms.', answer: 'dN/dt = rN(1-N/K). r: intrinsic growth rate. K: carrying capacity. Growth slows as N approaches K', type: 'concept' },
    ] },
    'predator-prey-dynamics': { items: [
      { prompt: 'Describe the Lotka-Volterra predator-prey model behavior.', answer: 'Coupled oscillations: prey increases -> predator increases -> prey decreases -> predator decreases -> cycle repeats. Phase-shifted', type: 'concept' },
    ] },
    'competition-models': { items: [
      { prompt: 'What does the competitive exclusion principle state?', answer: 'Two species competing for the same limiting resource cannot coexist indefinitely. One will outcompete the other', type: 'concept' },
    ] },
    'ecosystem-simulation': { items: [
      { prompt: 'What is agent-based modeling in ecology?', answer: 'Simulating individual organisms with rules for behavior. Emergent population-level patterns arise from individual interactions', type: 'concept' },
    ] },
    'conservation-modeling': { items: [
      { prompt: 'What is a population viability analysis (PVA)?', answer: 'Model-based assessment of extinction risk. Incorporates demographics, environment, genetics, catastrophes. Guides conservation decisions', type: 'concept' },
    ] },
    'data-cleaning': { items: [
      { prompt: 'Name common data quality issues in scientific datasets.', answer: 'Missing values, outliers, inconsistent formats, duplicate records, measurement errors, batch effects', type: 'concept' },
    ] },
    'exploratory-analysis': { items: [
      { prompt: 'What is the purpose of exploratory data analysis (EDA)?', answer: 'Understand data structure, find patterns, check assumptions, identify anomalies before formal analysis. Use plots and summaries', type: 'concept' },
    ] },
    'statistical-programming': { items: [
      { prompt: 'Compare R and Python for statistical analysis.', answer: 'R: purpose-built for statistics, rich packages (tidyverse, ggplot2). Python: general purpose, growing stats ecosystem (SciPy, statsmodels), better for ML', type: 'concept' },
    ] },
    'data-visualization-intermediate': { items: [
      { prompt: 'State three principles of effective scientific visualization.', answer: 'Maximize data-ink ratio, avoid chartjunk, use appropriate scales, label clearly, show uncertainty, colorblind-friendly palettes', type: 'concept' },
    ] },
    'reproducible-workflows': { items: [
      { prompt: 'What tools support reproducible computational research?', answer: 'Version control (Git), notebooks (Jupyter), package managers (conda), containers (Docker), workflow managers (Snakemake)', type: 'concept' },
    ] },
    'regulatory-frameworks': { items: [
      { prompt: 'What role does the EPA play in environmental science?', answer: 'Sets and enforces environmental regulations (Clean Air Act, Clean Water Act), conducts research, risk assessments, permits', type: 'concept' },
    ] },
    'environmental-policy': { items: [
      { prompt: 'What is the precautionary principle?', answer: 'When an activity poses threats to health or environment, precautionary measures should be taken even with incomplete science', type: 'concept' },
    ] },
    'public-health-policy': { items: [
      { prompt: 'How does epidemiological evidence inform public health policy?', answer: 'Identifies risk factors, tracks disease spread, evaluates interventions. Evidence hierarchy: RCTs > cohort > case-control > case reports', type: 'concept' },
    ] },
    'technology-assessment': { items: [
      { prompt: 'What is technology assessment?', answer: 'Systematic evaluation of societal consequences of introducing a new technology. Considers benefits, risks, alternatives, equity', type: 'concept' },
    ] },
    'science-advisory-roles': { items: [
      { prompt: 'How do scientists advise policymakers?', answer: 'Advisory committees (NAS), testimony, reports, science diplomacy. Challenge: communicating uncertainty while being actionable', type: 'concept' },
    ] },
  },
  'upper-division': {
    'receptor-signaling': { items: [
      { prompt: 'Compare GPCR and RTK signaling.', answer: 'GPCR: 7-transmembrane, G-protein coupled, second messengers (cAMP, IP3). RTK: dimerize on ligand binding, autophosphorylate, recruit adaptors', type: 'concept' },
    ] },
    'second-messengers': { items: [
      { prompt: 'Name four second messengers and their functions.', answer: 'cAMP (PKA activation), Ca2+ (muscle contraction, exocytosis), IP3 (Ca2+ release from ER), DAG (PKC activation)', type: 'concept' },
    ] },
    'kinase-cascades': { items: [
      { prompt: 'Describe the MAPK/ERK pathway.', answer: 'Ras -> Raf (MAPKKK) -> MEK (MAPKK) -> ERK (MAPK) -> transcription factors. Signal amplification at each step. Controls growth/differentiation', type: 'concept' },
    ] },
    'gene-regulation-networks': { items: [
      { prompt: 'What is a gene regulatory network?', answer: 'Set of genes and their regulatory interactions (transcription factors, enhancers, repressors). Forms motifs: feed-forward loops, toggle switches', type: 'concept' },
    ] },
    'systems-biology-modeling': { items: [
      { prompt: 'How does systems biology differ from traditional molecular biology?', answer: 'Systems: holistic, quantitative modeling of networks. Traditional: reductionist, one gene/protein at a time. Systems uses ODEs, stochastic models', type: 'concept' },
    ] },
    'protein-structure-methods': { items: [
      { prompt: 'Compare the three main methods for determining protein structure.', answer: 'X-ray: crystals needed, high resolution. NMR: solution state, size limited. Cryo-EM: no crystals, large complexes, resolution improving', type: 'concept' },
    ] },
    'x-ray-crystallography': { items: [
      { prompt: 'What is the "phase problem" in crystallography?', answer: 'Diffraction gives amplitudes but not phases of scattered waves. Need both to compute electron density map. Solved by MAD, MIR, or molecular replacement', type: 'concept' },
    ] },
    'cryo-em': { items: [
      { prompt: 'What made cryo-EM a breakthrough technique?', answer: 'Direct electron detectors and computational averaging of thousands of particle images. Near-atomic resolution without crystals. Nobel 2017', type: 'concept' },
    ] },
    'nmr-spectroscopy': { items: [
      { prompt: 'What unique information does NMR provide?', answer: 'Protein dynamics and structure in solution. Measures distances between atoms (NOE), dynamics (relaxation), and chemical environment', type: 'concept' },
    ] },
    'molecular-dynamics': { items: [
      { prompt: 'What is molecular dynamics simulation?', answer: 'Numerically integrating Newton\'s equations for atoms with empirical force fields. Reveals protein motions, binding, folding on ns-ms timescales', type: 'concept' },
    ] },
    'earth-system-models': { items: [
      { prompt: 'What components does an Earth System Model (ESM) include beyond a GCM?', answer: 'Biogeochemical cycles (carbon, nitrogen), dynamic vegetation, ice sheets, atmospheric chemistry, ocean ecology', type: 'concept' },
    ] },
    'carbon-cycle-feedbacks': { items: [
      { prompt: 'What is the permafrost carbon feedback?', answer: 'Warming thaws permafrost releasing stored organic carbon as CO2 and CH4, causing more warming. Positive feedback, potentially large', type: 'concept' },
    ] },
    'aerosol-climate-interactions': { items: [
      { prompt: 'How do aerosols affect climate?', answer: 'Direct: scatter/absorb radiation. Indirect: act as cloud condensation nuclei, affecting cloud properties. Net cooling effect partially masks greenhouse warming', type: 'concept' },
    ] },
    'sea-level-projections': { items: [
      { prompt: 'What are the two main contributors to sea level rise?', answer: 'Thermal expansion of warming oceans and melting of land-based ice (glaciers, Greenland, Antarctica). Also: groundwater extraction', type: 'concept' },
    ] },
    'tipping-points': { items: [
      { prompt: 'What is a climate tipping point?', answer: 'A threshold beyond which a system shifts to a qualitatively different state, potentially irreversible. Examples: ice sheet collapse, AMOC shutdown, Amazon dieback', type: 'concept' },
    ] },
    'supervised-learning-science': { items: [
      { prompt: 'Give an example of supervised learning in science.', answer: 'Predicting protein function from sequence features. Training: labeled examples (sequence -> function). Predict for unlabeled sequences', type: 'concept' },
    ] },
    'unsupervised-learning-science': { items: [
      { prompt: 'How is clustering used in genomics?', answer: 'Group genes with similar expression patterns (e.g., hierarchical clustering of microarray data). Reveals co-regulated gene sets', type: 'concept' },
    ] },
    'neural-networks-applications': { items: [
      { prompt: 'How has AlphaFold impacted structural biology?', answer: 'Predicts protein 3D structure from sequence with near-experimental accuracy. Democratizes structure knowledge. DeepMind, 2020', type: 'concept' },
    ] },
    'image-analysis-science': { items: [
      { prompt: 'How are CNNs used in microscopy?', answer: 'Automated cell counting, segmentation, classification of phenotypes. Enables high-throughput screening and reduces human bias', type: 'concept' },
    ] },
    'scientific-ml-ethics': { items: [
      { prompt: 'What ethical concerns arise with ML in science?', answer: 'Bias in training data, reproducibility of models, interpretability ("black box"), data privacy, over-reliance on predictions', type: 'concept' },
    ] },
    'drug-approval-process': { items: [
      { prompt: 'Outline the drug approval pipeline.', answer: 'Discovery -> preclinical (animal) -> Phase I (safety) -> Phase II (efficacy) -> Phase III (large-scale) -> FDA review -> Phase IV (post-market)', type: 'concept' },
    ] },
    'environmental-impact-assessment': { items: [
      { prompt: 'What is an Environmental Impact Assessment (EIA)?', answer: 'Systematic process to evaluate environmental consequences of proposed projects before decisions. Required by NEPA in US', type: 'concept' },
    ] },
    'risk-assessment': { items: [
      { prompt: 'Name the four steps of risk assessment.', answer: 'Hazard identification, dose-response assessment, exposure assessment, risk characterization', type: 'concept' },
    ] },
    'evidence-based-policy': { items: [
      { prompt: 'What challenges face evidence-based science policy?', answer: 'Scientific uncertainty, political pressures, stakeholder conflicts, communication gaps, time horizons, value judgments', type: 'concept' },
    ] },
    'international-science-governance': { items: [
      { prompt: 'Give an example of international science governance.', answer: 'IPCC (climate), WHO (health), CERN (physics), ITER (fusion), Antarctic Treaty (science cooperation). Challenges: sovereignty, funding, compliance', type: 'concept' },
    ] },
  },
};

// File I/O
function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) { const fp = profilePath(id); if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } } return { studentId: id, level: null, createdAt: new Date().toISOString(), assessments: [], skills: {} }; }
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers
function calcMastery(attempts) { if (!attempts || !attempts.length) return 0; const recent = attempts.slice(-5).filter(a => a.total > 0); return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0; }
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(level, skill, count = 5) { const bank = QUESTION_BANKS[level]?.[skill]; if (!bank || !bank.items) return { error: `No question bank for ${level}/${skill}` }; const items = pick(bank.items, count); return { type: 'interdisciplinary', skill, level, count: items.length, instruction: 'Answer each question, drawing connections across scientific disciplines.', items }; }
function checkAnswer(type, expected, answer) { return norm(expected) === norm(answer); }

// Public API
class Interdisciplinary {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { if (!SKILLS[level]) throw new Error(`Unknown level: ${level}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }

  recordAssessment(id, level, category, skill, score, total, notes = '') {
    if (!SKILLS[level]) throw new Error(`Unknown level: ${level}`); if (!SKILLS[level][category]) throw new Error(`Unknown category '${category}' for ${level}`); if (!SKILLS[level][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${level}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive'); if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.level) p.level = level; const entry = { date: new Date().toISOString(), level, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${level}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] }; p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery); saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) { const p = loadProfile(id); const level = p.level || 'introductory'; const ls = SKILLS[level] || {}; const results = {}; let mastered = 0, total = 0; for (const [cat, skills] of Object.entries(ls)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${level}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } } return { studentId: id, level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results }; }
  getNextSkills(id, count = 5) { const p = loadProfile(id); const level = p.level || 'introductory'; const candidates = []; for (const [cat, skills] of Object.entries(SKILLS[level] || {})) { for (const sk of skills) { const d = p.skills[`${level}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ level, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } } const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery); return { studentId: id, level, next: candidates.slice(0, count) }; }
  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(level) { const ls = SKILLS[level]; if (!ls) return { level, error: `Unknown level. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(ls)) { total += skills.length; catalog[cat] = [...skills]; } return { level, skills: catalog, totalSkills: total }; }
  generateExercise(level, skill, count = 5) { return generateExercise(level, skill, count); }
  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id); const level = p.level || 'introductory'; const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} -> ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Bridge to another discipline: how does this concept connect across fields?' } };
  }
}

module.exports = Interdisciplinary;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Interdisciplinary(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const level = loadProfile(id).level || 'introductory'; if (skill) { out(api.generateExercise(level, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(level, n[0].skill, 5) : { message: 'All skills proficient at current level!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, level, cat, skill, sc, tot, ...notes] = args; if (!id || !level || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <level> <cat> <skill> <score> <total> [notes]'); out(api.recordAssessment(id, level, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, l] = args; out(l ? api.getSkillCatalog(l) : { levels: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-level': { const [, id, l] = args; if (!id || !l) throw new Error('Usage: set-level <id> <level>'); out(api.setLevel(id, l)); break; }
      default: out({ usage: 'node interdisciplinary.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
