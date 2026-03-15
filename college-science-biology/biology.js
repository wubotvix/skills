// eClaw College Biology Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-biology');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'molecular-biology': ['central-dogma', 'dna-structure', 'replication-basics', 'transcription-basics', 'translation-basics'],
    'cell-biology': ['cell-organelles', 'membrane-structure', 'passive-transport', 'active-transport', 'cell-cycle'],
    'genetics': ['mendelian-inheritance', 'punnett-squares', 'incomplete-dominance', 'sex-linked-traits', 'pedigree-analysis'],
    'evolution': ['natural-selection', 'evidence-for-evolution', 'adaptation', 'speciation-intro', 'hardy-weinberg-intro'],
    'ecology': ['ecosystem-structure', 'food-webs', 'energy-flow', 'population-growth', 'biodiversity-basics'],
    'physiology': ['homeostasis', 'organ-systems-overview', 'nervous-system-basics', 'circulatory-basics', 'respiratory-basics'],
  },
  'intermediate': {
    'molecular-biology': ['dna-replication-mechanism', 'rna-processing', 'gene-regulation-prokaryotes', 'gene-regulation-eukaryotes', 'epigenetics'],
    'cell-biology': ['signal-transduction', 'cytoskeleton', 'endomembrane-system', 'mitochondria-chloroplast', 'apoptosis'],
    'genetics': ['linkage-mapping', 'recombination', 'population-genetics', 'quantitative-traits', 'chromosomal-mutations'],
    'evolution': ['phylogenetics', 'molecular-evolution', 'genetic-drift', 'gene-flow', 'coevolution'],
    'ecology': ['community-interactions', 'succession', 'nutrient-cycling', 'biomes', 'conservation-biology'],
    'physiology': ['neurophysiology', 'cardiovascular-detail', 'renal-physiology', 'endocrine-system', 'immune-system'],
  },
  'upper-division': {
    'molecular-biology': ['chromatin-remodeling', 'rna-interference', 'crispr-gene-editing', 'proteomics', 'systems-biology'],
    'cell-biology': ['cell-signaling-cascades', 'membrane-trafficking', 'cell-adhesion', 'stem-cells', 'cancer-biology'],
    'genetics': ['genomics', 'transcriptomics', 'epigenomics', 'gwas', 'phylogenomics'],
    'developmental-biology': ['morphogens', 'cell-fate-determination', 'pattern-formation', 'model-organisms', 'regeneration'],
    'ecology': ['metapopulations', 'landscape-ecology', 'ecosystem-services', 'climate-change-biology', 'invasion-biology'],
    'physiology': ['systems-physiology', 'comparative-physiology', 'exercise-physiology', 'pathophysiology', 'pharmacology-basics'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'central-dogma': {
      questions: [
        { q: 'What is the correct order of the central dogma of molecular biology?', a: 'DNA to RNA to protein', type: 'concept', choices: ['DNA to RNA to protein', 'RNA to DNA to protein', 'Protein to RNA to DNA', 'RNA to protein to DNA'] },
        { q: 'Which enzyme synthesizes mRNA from a DNA template?', a: 'RNA polymerase', type: 'concept', choices: ['DNA polymerase', 'RNA polymerase', 'Helicase', 'Ligase'] },
        { q: 'What is the process of making protein from mRNA called?', a: 'translation', type: 'term' },
        { q: 'Reverse transcriptase violates the central dogma by converting ___ to ___.', a: 'RNA to DNA', type: 'concept' },
        { q: 'Where does transcription occur in eukaryotic cells?', a: 'nucleus', type: 'concept', choices: ['Cytoplasm', 'Nucleus', 'Ribosome', 'Mitochondria'] },
        { q: 'What molecule carries amino acids to the ribosome during translation?', a: 'tRNA', type: 'term' },
        { q: 'Which molecule serves as the intermediate between DNA and protein?', a: 'mRNA', type: 'term' },
        { q: 'True or false: Information flows from protein back to DNA in normal cells.', a: 'false', type: 'concept' },
      ],
    },
    'dna-structure': {
      questions: [
        { q: 'What type of bond holds the two strands of DNA together?', a: 'hydrogen bonds', type: 'concept', choices: ['Covalent bonds', 'Hydrogen bonds', 'Ionic bonds', 'Peptide bonds'] },
        { q: 'Adenine pairs with which nucleotide base in DNA?', a: 'thymine', type: 'term' },
        { q: 'What sugar is found in the backbone of DNA?', a: 'deoxyribose', type: 'term' },
        { q: 'DNA strands run in which orientation relative to each other?', a: 'antiparallel', type: 'concept', choices: ['Parallel', 'Antiparallel', 'Perpendicular', 'Random'] },
        { q: 'How many hydrogen bonds form between guanine and cytosine?', a: '3', type: 'calculation' },
        { q: 'If a DNA strand reads 5\'-ATCG-3\', what is the complementary strand (5\' to 3\')?', a: 'CGAT', type: 'calculation' },
        { q: 'Who discovered the double helix structure of DNA?', a: 'Watson and Crick', type: 'concept' },
        { q: 'What type of bond connects nucleotides in the same strand?', a: 'phosphodiester bond', type: 'term' },
      ],
    },
    'replication-basics': {
      questions: [
        { q: 'DNA replication is described as semiconservative. What does this mean?', a: 'Each new DNA molecule has one old strand and one new strand', type: 'concept' },
        { q: 'Which enzyme unwinds the DNA double helix during replication?', a: 'helicase', type: 'term' },
        { q: 'In which direction does DNA polymerase synthesize new DNA?', a: '5 prime to 3 prime', type: 'concept', choices: ['3\' to 5\'', '5\' to 3\'', 'Both directions', 'Random'] },
        { q: 'What are the short RNA segments that initiate DNA replication called?', a: 'primers', type: 'term' },
        { q: 'The lagging strand is synthesized in short fragments called ___ fragments.', a: 'Okazaki', type: 'term' },
        { q: 'Which enzyme joins Okazaki fragments together?', a: 'DNA ligase', type: 'term' },
        { q: 'What is the site where replication begins called?', a: 'origin of replication', type: 'term' },
        { q: 'Which enzyme removes RNA primers and replaces them with DNA?', a: 'DNA polymerase I', type: 'term' },
      ],
    },
    'transcription-basics': {
      questions: [
        { q: 'Which strand of DNA is used as a template during transcription?', a: 'template strand', type: 'concept', choices: ['Coding strand', 'Template strand', 'Leading strand', 'Lagging strand'] },
        { q: 'What is the RNA base that pairs with adenine (instead of thymine)?', a: 'uracil', type: 'term' },
        { q: 'What DNA sequence signals RNA polymerase where to begin transcription?', a: 'promoter', type: 'term' },
        { q: 'What is the TATA box?', a: 'A conserved promoter sequence in eukaryotes', type: 'concept' },
        { q: 'What is added to the 5\' end of eukaryotic mRNA after transcription?', a: '5 prime cap', type: 'term' },
        { q: 'What is added to the 3\' end of eukaryotic mRNA?', a: 'poly-A tail', type: 'term' },
        { q: 'Non-coding sequences removed from pre-mRNA are called ___.', a: 'introns', type: 'term' },
        { q: 'Coding sequences retained in mature mRNA are called ___.', a: 'exons', type: 'term' },
      ],
    },
    'translation-basics': {
      questions: [
        { q: 'What is the three-nucleotide sequence on mRNA that codes for an amino acid?', a: 'codon', type: 'term' },
        { q: 'What is the start codon and which amino acid does it code for?', a: 'AUG codes for methionine', type: 'concept' },
        { q: 'How many stop codons are there and what are they?', a: 'Three: UAA, UAG, UGA', type: 'concept' },
        { q: 'Which ribosomal site holds the growing polypeptide chain?', a: 'P site', type: 'concept', choices: ['A site', 'P site', 'E site', 'S site'] },
        { q: 'What type of bond links amino acids together?', a: 'peptide bond', type: 'term' },
        { q: 'What enzyme charges tRNA with the correct amino acid?', a: 'aminoacyl-tRNA synthetase', type: 'term' },
        { q: 'What is the wobble hypothesis?', a: 'The third base of a codon can form non-standard base pairs with the anticodon', type: 'concept' },
        { q: 'Where does translation occur in the cell?', a: 'ribosomes in the cytoplasm', type: 'concept' },
      ],
    },
    'cell-organelles': {
      questions: [
        { q: 'Which organelle is the site of aerobic respiration?', a: 'mitochondria', type: 'term' },
        { q: 'Which organelle contains the cell\'s genetic material in eukaryotes?', a: 'nucleus', type: 'term' },
        { q: 'What is the function of the rough endoplasmic reticulum?', a: 'Protein synthesis and modification', type: 'concept' },
        { q: 'Which organelle is responsible for photosynthesis in plant cells?', a: 'chloroplast', type: 'term' },
        { q: 'What organelle breaks down cellular waste and debris?', a: 'lysosome', type: 'term' },
        { q: 'The Golgi apparatus functions primarily in ___.', a: 'modifying sorting and packaging proteins', type: 'concept' },
        { q: 'Which organelle is NOT found in animal cells?', a: 'chloroplast', type: 'concept', choices: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'] },
        { q: 'What is the endosymbiotic theory?', a: 'Mitochondria and chloroplasts evolved from engulfed prokaryotes', type: 'concept' },
      ],
    },
    'membrane-structure': {
      questions: [
        { q: 'What model describes the current understanding of cell membrane structure?', a: 'fluid mosaic model', type: 'term' },
        { q: 'What is the primary lipid component of cell membranes?', a: 'phospholipid', type: 'term' },
        { q: 'Cholesterol in the membrane helps to ___.', a: 'regulate membrane fluidity', type: 'concept' },
        { q: 'Which type of membrane protein spans the entire lipid bilayer?', a: 'integral (transmembrane) protein', type: 'term' },
        { q: 'Carbohydrates attached to membrane proteins form the ___.', a: 'glycocalyx', type: 'term' },
        { q: 'Which molecules can freely cross the lipid bilayer?', a: 'Small nonpolar molecules like O2 and CO2', type: 'concept' },
        { q: 'What makes a membrane selectively permeable?', a: 'The hydrophobic core and specific transport proteins', type: 'concept' },
        { q: 'What determines membrane fluidity?', a: 'Fatty acid saturation, chain length, and cholesterol content', type: 'concept' },
      ],
    },
    'passive-transport': {
      questions: [
        { q: 'What drives passive transport across a membrane?', a: 'concentration gradient', type: 'concept' },
        { q: 'What is osmosis?', a: 'Diffusion of water across a selectively permeable membrane', type: 'concept' },
        { q: 'A cell placed in a hypertonic solution will ___.', a: 'shrink (crenate)', type: 'concept', choices: ['Swell', 'Shrink', 'Stay the same', 'Lyse'] },
        { q: 'What type of transport uses channel or carrier proteins but no ATP?', a: 'facilitated diffusion', type: 'term' },
        { q: 'Aquaporins facilitate the transport of ___ across membranes.', a: 'water', type: 'term' },
        { q: 'Does passive transport require energy input from the cell?', a: 'no', type: 'concept' },
        { q: 'In which direction do molecules move during diffusion?', a: 'From high concentration to low concentration', type: 'concept' },
        { q: 'How do channel and carrier proteins differ?', a: 'Channels form pores; carriers change shape to move molecules', type: 'concept' },
      ],
    },
    'active-transport': {
      questions: [
        { q: 'What distinguishes active transport from passive transport?', a: 'Active transport requires energy (ATP)', type: 'concept' },
        { q: 'The sodium-potassium pump moves ___ Na+ out and ___ K+ in per cycle.', a: '3 Na+ out and 2 K+ in', type: 'calculation' },
        { q: 'What is endocytosis?', a: 'The process of bringing substances into a cell by engulfing them in membrane', type: 'concept' },
        { q: 'What is the difference between pinocytosis and phagocytosis?', a: 'Pinocytosis takes in fluids; phagocytosis takes in solids', type: 'concept' },
        { q: 'Exocytosis is the process of ___.', a: 'secreting substances out of the cell via vesicle fusion', type: 'concept' },
        { q: 'Secondary active transport uses the energy stored in ___.', a: 'an ion gradient', type: 'concept' },
        { q: 'Which type of active transport moves substances against their concentration gradient?', a: 'primary active transport', type: 'concept' },
        { q: 'What is receptor-mediated endocytosis?', a: 'Uptake of specific molecules that bind to receptors on the cell surface', type: 'concept' },
      ],
    },
    'cell-cycle': {
      questions: [
        { q: 'What are the main phases of the cell cycle?', a: 'G1, S, G2 (interphase) and M phase (mitosis)', type: 'concept' },
        { q: 'During which phase is DNA replicated?', a: 'S phase', type: 'concept', choices: ['G1', 'S', 'G2', 'M'] },
        { q: 'What are the stages of mitosis in order?', a: 'Prophase, metaphase, anaphase, telophase', type: 'concept' },
        { q: 'What is cytokinesis?', a: 'Division of the cytoplasm to form two daughter cells', type: 'concept' },
        { q: 'Cyclins and CDKs regulate the cell cycle at ___.', a: 'checkpoints', type: 'term' },
        { q: 'What happens if the spindle assembly checkpoint fails?', a: 'Cells may divide with incorrect chromosome numbers (aneuploidy)', type: 'concept' },
        { q: 'What is the role of p53 in the cell cycle?', a: 'Tumor suppressor that halts the cell cycle for DNA repair or triggers apoptosis', type: 'concept' },
        { q: 'The G1 checkpoint is also called the ___.', a: 'restriction point', type: 'term' },
      ],
    },
    'mendelian-inheritance': {
      questions: [
        { q: 'What is Mendel\'s Law of Segregation?', a: 'Two alleles for each trait separate during gamete formation', type: 'concept' },
        { q: 'What is a heterozygous genotype?', a: 'Having two different alleles for a gene', type: 'term' },
        { q: 'In a cross of Aa x Aa, what fraction of offspring are homozygous recessive?', a: '1/4', type: 'calculation' },
        { q: 'What is the Law of Independent Assortment?', a: 'Genes on different chromosomes sort independently during meiosis', type: 'concept' },
        { q: 'A testcross involves crossing an individual with ___ genotype.', a: 'homozygous recessive', type: 'concept' },
        { q: 'What is the phenotypic ratio of a monohybrid cross between two heterozygotes?', a: '3:1', type: 'calculation' },
        { q: 'What is complete dominance?', a: 'The heterozygote phenotype is identical to the homozygous dominant', type: 'concept' },
        { q: 'What is the genotypic ratio of Aa x Aa?', a: '1:2:1', type: 'calculation' },
      ],
    },
    'punnett-squares': {
      questions: [
        { q: 'In a dihybrid cross AaBb x AaBb, what is the expected phenotypic ratio?', a: '9:3:3:1', type: 'calculation' },
        { q: 'If Tt x tt, what percentage of offspring will be tall (T dominant)?', a: '50%', type: 'calculation' },
        { q: 'How many unique gamete types can AaBbCc produce?', a: '8', type: 'calculation' },
        { q: 'What is a Punnett square used for?', a: 'Predicting genotype and phenotype ratios of offspring', type: 'concept' },
        { q: 'In Rr x Rr, what proportion of offspring are homozygous?', a: '1/2', type: 'calculation' },
        { q: 'If both parents are carriers (Aa x Aa), what is the chance their child is affected?', a: '25%', type: 'calculation' },
        { q: 'What size Punnett square is needed for a trihybrid cross?', a: '8x8 (64 cells)', type: 'calculation' },
        { q: 'A cross producing all dominant phenotype suggests the parent is ___.', a: 'homozygous dominant', type: 'concept' },
      ],
    },
    'incomplete-dominance': {
      questions: [
        { q: 'What is incomplete dominance?', a: 'The heterozygote shows a phenotype intermediate between the two homozygotes', type: 'concept' },
        { q: 'In snapdragons, red x white produces pink. What pattern is this?', a: 'incomplete dominance', type: 'concept' },
        { q: 'What phenotypic ratio is expected in F2 of incomplete dominance?', a: '1:2:1', type: 'calculation' },
        { q: 'How does codominance differ from incomplete dominance?', a: 'In codominance, both alleles are fully expressed (not blended)', type: 'concept' },
        { q: 'AB blood type is an example of ___.', a: 'codominance', type: 'concept' },
        { q: 'If two pink snapdragons are crossed, what fraction of offspring are pink?', a: '1/2', type: 'calculation' },
        { q: 'In incomplete dominance, the intermediate phenotype genotype is ___.', a: 'heterozygous', type: 'concept' },
        { q: 'Multiple alleles means a gene has ___.', a: 'more than two alleles in the population', type: 'concept' },
      ],
    },
    'sex-linked-traits': {
      questions: [
        { q: 'Why are X-linked recessive disorders more common in males?', a: 'Males have only one X chromosome so a single recessive allele is expressed', type: 'concept' },
        { q: 'A carrier mother and normal father have what chance of a hemophiliac son?', a: '50%', type: 'calculation' },
        { q: 'Can a father pass an X-linked trait to his son?', a: 'No, fathers pass Y to sons', type: 'concept' },
        { q: 'What is X-inactivation (Lyonization)?', a: 'Random silencing of one X chromosome in female cells', type: 'concept' },
        { q: 'Color blindness is more common in males because it is ___.', a: 'X-linked recessive', type: 'concept' },
        { q: 'A Barr body is ___.', a: 'An inactivated X chromosome visible in female cells', type: 'term' },
        { q: 'In Y-linked inheritance, affected fathers pass the trait to ___.', a: 'all sons', type: 'concept' },
        { q: 'If a carrier female marries an affected male, what fraction of daughters are affected?', a: '1/2', type: 'calculation' },
      ],
    },
    'pedigree-analysis': {
      questions: [
        { q: 'In a pedigree, a filled-in circle represents ___.', a: 'an affected female', type: 'concept' },
        { q: 'If two unaffected parents have an affected child, the trait is most likely ___.', a: 'autosomal recessive', type: 'concept' },
        { q: 'An autosomal dominant trait appears in ___ generation(s).', a: 'every generation', type: 'concept' },
        { q: 'If only males are affected via maternal transmission, the trait is likely ___.', a: 'X-linked recessive', type: 'concept' },
        { q: 'A horizontal line connecting two individuals represents ___.', a: 'a mating', type: 'concept' },
        { q: 'Consanguinity increases the risk of ___ disorders.', a: 'autosomal recessive', type: 'concept' },
        { q: 'If an affected father has all unaffected sons but some affected daughters, consider ___.', a: 'X-linked dominant', type: 'concept' },
        { q: 'What does a half-filled symbol mean in some pedigrees?', a: 'carrier of a recessive allele', type: 'concept' },
      ],
    },
    'natural-selection': {
      questions: [
        { q: 'What are the four conditions required for natural selection?', a: 'Variation, heritability, differential survival/reproduction, and fitness advantage', type: 'concept' },
        { q: 'What is fitness in an evolutionary context?', a: 'Reproductive success relative to other individuals in the population', type: 'concept' },
        { q: 'Directional selection shifts the population mean toward ___.', a: 'one phenotypic extreme', type: 'concept' },
        { q: 'Stabilizing selection favors ___ phenotypes.', a: 'intermediate', type: 'concept' },
        { q: 'Disruptive selection favors ___ phenotypes.', a: 'both extremes', type: 'concept' },
        { q: 'What is sexual selection?', a: 'Selection based on mating success, not just survival', type: 'concept' },
        { q: 'Antibiotic resistance in bacteria is an example of ___.', a: 'natural selection', type: 'concept' },
        { q: 'Natural selection acts on ___ but evolution occurs in ___.', a: 'individuals; populations', type: 'concept' },
      ],
    },
    'evidence-for-evolution': {
      questions: [
        { q: 'What are homologous structures?', a: 'Structures with shared ancestry but potentially different functions', type: 'concept' },
        { q: 'What are analogous structures?', a: 'Similar function but different evolutionary origin (convergent evolution)', type: 'concept' },
        { q: 'What are vestigial structures?', a: 'Reduced structures with no current function', type: 'concept' },
        { q: 'How do fossils provide evidence for evolution?', a: 'They show transitional forms and changes over time', type: 'concept' },
        { q: 'What does biogeography reveal about evolution?', a: 'Species distributions reflect evolutionary history and geographic barriers', type: 'concept' },
        { q: 'How does molecular biology support evolution?', a: 'DNA/protein sequence similarities correlate with evolutionary relatedness', type: 'concept' },
        { q: 'What is the molecular clock?', a: 'Using mutation accumulation rate to estimate divergence times', type: 'concept' },
        { q: 'Embryological similarities across vertebrates suggest ___.', a: 'common ancestry', type: 'concept' },
      ],
    },
    'adaptation': {
      questions: [
        { q: 'What is an adaptation?', a: 'A heritable trait that increases fitness in a specific environment', type: 'concept' },
        { q: 'What is the difference between acclimation and adaptation?', a: 'Acclimation is reversible individual response; adaptation is heritable population change', type: 'concept' },
        { q: 'What is Batesian mimicry?', a: 'A harmless species mimics the appearance of a harmful species', type: 'concept' },
        { q: 'What constraints limit adaptation?', a: 'Genetic variation, trade-offs, phylogenetic history, and time', type: 'concept' },
        { q: 'What is an exaptation?', a: 'A trait that evolved for one function but is co-opted for another', type: 'concept' },
        { q: 'Cactus spines are modified ___ that reduce water loss.', a: 'leaves', type: 'concept' },
        { q: 'Why can\'t natural selection produce perfect organisms?', a: 'Constraints: available variation, trade-offs, changing environments, historical contingency', type: 'concept' },
        { q: 'What is Mullerian mimicry?', a: 'Two harmful species resemble each other, reinforcing predator avoidance', type: 'concept' },
      ],
    },
    'speciation-intro': {
      questions: [
        { q: 'What is the biological species concept?', a: 'Species are groups of interbreeding populations reproductively isolated from other groups', type: 'concept' },
        { q: 'What is allopatric speciation?', a: 'Speciation due to geographic isolation', type: 'concept' },
        { q: 'What is sympatric speciation?', a: 'Speciation without geographic isolation, often via polyploidy', type: 'concept' },
        { q: 'What are prezygotic barriers?', a: 'Barriers before fertilization: habitat, temporal, behavioral, mechanical, gametic', type: 'concept' },
        { q: 'What are postzygotic barriers?', a: 'Barriers after fertilization: hybrid inviability, sterility, breakdown', type: 'concept' },
        { q: 'A mule is sterile. This is an example of ___.', a: 'postzygotic barrier (hybrid sterility)', type: 'concept' },
        { q: 'Polyploidy is most common in ___.', a: 'plants', type: 'concept' },
        { q: 'What is a ring species?', a: 'Connected populations where neighbors interbreed but terminal populations cannot', type: 'concept' },
      ],
    },
    'hardy-weinberg-intro': {
      questions: [
        { q: 'What are the five conditions for Hardy-Weinberg equilibrium?', a: 'No mutation, random mating, no selection, large population, no gene flow', type: 'concept' },
        { q: 'If p = 0.6, what is q?', a: '0.4', type: 'calculation' },
        { q: 'If q = 0.3, what is q squared?', a: '0.09', type: 'calculation' },
        { q: 'The Hardy-Weinberg equation for genotype frequencies is ___.', a: 'p squared + 2pq + q squared = 1', type: 'concept' },
        { q: 'If 16% of a population is homozygous recessive, what is q?', a: '0.4', type: 'calculation' },
        { q: 'What does 2pq represent?', a: 'The frequency of heterozygotes', type: 'concept' },
        { q: 'Hardy-Weinberg is useful as a ___ for detecting evolution.', a: 'null hypothesis', type: 'concept' },
        { q: 'In HW equilibrium, allele frequencies ___ across generations.', a: 'do not change', type: 'concept' },
      ],
    },
    'ecosystem-structure': {
      questions: [
        { q: 'What is the difference between a community and an ecosystem?', a: 'Community is all organisms; ecosystem includes organisms plus abiotic environment', type: 'concept' },
        { q: 'What are the trophic levels in order?', a: 'Producers, primary consumers, secondary consumers, tertiary consumers, decomposers', type: 'concept' },
        { q: 'What is primary productivity?', a: 'The rate at which producers convert solar energy to chemical energy', type: 'concept' },
        { q: 'GPP minus respiration equals ___.', a: 'net primary productivity', type: 'concept' },
        { q: 'What percentage of energy is typically transferred between trophic levels?', a: '10%', type: 'calculation' },
        { q: 'Why are there rarely more than 4-5 trophic levels?', a: 'Energy loss at each level limits the chain length', type: 'concept' },
        { q: 'What is a keystone species?', a: 'A species with disproportionately large impact relative to its abundance', type: 'concept' },
        { q: 'Abiotic factors in an ecosystem include ___.', a: 'temperature, water, sunlight, soil, wind', type: 'concept' },
      ],
    },
    'food-webs': {
      questions: [
        { q: 'How does a food web differ from a food chain?', a: 'A food web shows multiple interconnected food chains', type: 'concept' },
        { q: 'What is a trophic cascade?', a: 'Indirect effects propagating from top predators through multiple trophic levels', type: 'concept' },
        { q: 'What organisms form the base of most aquatic food webs?', a: 'phytoplankton', type: 'term' },
        { q: 'An omnivore occupies ___ trophic level(s).', a: 'multiple', type: 'concept' },
        { q: 'What is bottom-up control?', a: 'Nutrient or producer availability limits higher trophic levels', type: 'concept' },
        { q: 'What is top-down control?', a: 'Predators limit the abundance of lower trophic levels', type: 'concept' },
        { q: 'Decomposers are important because they ___.', a: 'recycle nutrients back into the ecosystem', type: 'concept' },
        { q: 'What happens when a keystone predator is removed?', a: 'Prey populations explode and biodiversity may decline', type: 'concept' },
      ],
    },
    'energy-flow': {
      questions: [
        { q: 'Energy flows through an ecosystem in what direction?', a: 'One direction: producers to consumers to decomposers (not recycled)', type: 'concept' },
        { q: 'What is the ultimate energy source for most ecosystems?', a: 'the sun', type: 'concept' },
        { q: 'Where does most energy go at each trophic level?', a: 'Lost as heat through cellular respiration', type: 'concept' },
        { q: 'What is a pyramid of energy?', a: 'A diagram showing energy at each trophic level, always upright', type: 'concept' },
        { q: 'Unlike energy, nutrients are ___ in ecosystems.', a: 'recycled', type: 'concept' },
        { q: 'Chemosynthetic ecosystems use ___ as their energy source.', a: 'chemical energy from inorganic compounds', type: 'concept' },
        { q: 'What is assimilation efficiency?', a: 'Proportion of ingested energy that is absorbed', type: 'concept' },
        { q: 'Why is a vegetarian diet more energy-efficient?', a: 'Fewer trophic level transfers means less energy lost', type: 'concept' },
      ],
    },
    'population-growth': {
      questions: [
        { q: 'What is the exponential growth equation?', a: 'dN/dt = rN', type: 'concept' },
        { q: 'What does r represent?', a: 'intrinsic rate of natural increase', type: 'term' },
        { q: 'What is carrying capacity (K)?', a: 'Maximum population size the environment can sustain', type: 'concept' },
        { q: 'The logistic growth equation is ___.', a: 'dN/dt = rN(1 - N/K)', type: 'concept' },
        { q: 'At what population size does logistic growth rate peak?', a: 'K/2', type: 'calculation' },
        { q: 'What is density-dependent regulation?', a: 'Factors increasing in intensity with population density', type: 'concept' },
        { q: 'What are r-selected species?', a: 'High reproductive rate, small body, short lifespan', type: 'concept' },
        { q: 'What are K-selected species?', a: 'Low reproductive rate, large body, long lifespan, high parental investment', type: 'concept' },
      ],
    },
    'biodiversity-basics': {
      questions: [
        { q: 'What are the three levels of biodiversity?', a: 'Genetic diversity, species diversity, ecosystem diversity', type: 'concept' },
        { q: 'What is species richness?', a: 'The number of different species in a community', type: 'term' },
        { q: 'What is species evenness?', a: 'How equally individuals are distributed among species', type: 'term' },
        { q: 'What is a biodiversity hotspot?', a: 'A region with high endemism and significant habitat loss', type: 'concept' },
        { q: 'The species-area relationship predicts larger areas support ___.', a: 'more species', type: 'concept' },
        { q: 'What are the main threats to biodiversity?', a: 'Habitat destruction, invasive species, overexploitation, pollution, climate change', type: 'concept' },
        { q: 'What is an endemic species?', a: 'A species found only in a particular geographic area', type: 'term' },
        { q: 'Why is genetic diversity important?', a: 'It provides variation for adaptation to changing conditions', type: 'concept' },
      ],
    },
    'homeostasis': {
      questions: [
        { q: 'What is homeostasis?', a: 'Maintenance of a stable internal environment despite external changes', type: 'concept' },
        { q: 'What are the three components of a feedback loop?', a: 'Receptor (sensor), control center, effector', type: 'concept' },
        { q: 'How does negative feedback work?', a: 'The response reduces the original stimulus, returning to set point', type: 'concept' },
        { q: 'Give an example of positive feedback.', a: 'Oxytocin during childbirth', type: 'concept' },
        { q: 'What is the set point?', a: 'The normal target value the body maintains', type: 'term' },
        { q: 'Thermoregulation is controlled by the ___.', a: 'hypothalamus', type: 'term' },
        { q: 'Blood glucose homeostasis involves which two hormones?', a: 'Insulin and glucagon', type: 'concept' },
        { q: 'Why is most regulation negative feedback?', a: 'It maintains stability; positive feedback amplifies away from set point', type: 'concept' },
      ],
    },
    'organ-systems-overview': {
      questions: [
        { q: 'How many major organ systems are in the human body?', a: '11', type: 'concept' },
        { q: 'Which system provides structural support?', a: 'skeletal system', type: 'concept' },
        { q: 'Which system is responsible for gas exchange?', a: 'respiratory system', type: 'concept' },
        { q: 'The lymphatic system functions in ___.', a: 'immunity and fluid balance', type: 'concept' },
        { q: 'What system filters blood and produces urine?', a: 'urinary (renal) system', type: 'concept' },
        { q: 'Which system uses hormones for signaling?', a: 'endocrine system', type: 'concept' },
        { q: 'What is the primary function of the integumentary system?', a: 'Protection, temperature regulation, sensory reception', type: 'concept' },
        { q: 'Structure and function are ___ at every level of biology.', a: 'directly related', type: 'concept' },
      ],
    },
    'nervous-system-basics': {
      questions: [
        { q: 'What are the two divisions of the nervous system?', a: 'Central nervous system (CNS) and peripheral nervous system (PNS)', type: 'concept' },
        { q: 'What is the resting membrane potential?', a: 'approximately -70 mV', type: 'concept' },
        { q: 'What is an action potential?', a: 'A rapid depolarization and repolarization of the neuron membrane', type: 'concept' },
        { q: 'Neurotransmitters are released from the ___.', a: 'axon terminal (synaptic knob)', type: 'term' },
        { q: 'What is the synapse?', a: 'The junction between two neurons where signals are transmitted', type: 'concept' },
        { q: 'Myelin sheaths increase speed via ___.', a: 'saltatory conduction', type: 'concept' },
        { q: 'The sympathetic nervous system activates the ___ response.', a: 'fight-or-flight', type: 'concept' },
        { q: 'The parasympathetic system promotes ___ functions.', a: 'rest-and-digest', type: 'concept' },
      ],
    },
    'circulatory-basics': {
      questions: [
        { q: 'How many chambers does the human heart have?', a: '4', type: 'concept' },
        { q: 'What is the path of blood through the heart?', a: 'Right atrium, right ventricle, lungs, left atrium, left ventricle, body', type: 'concept' },
        { q: 'What is the function of hemoglobin?', a: 'Transport oxygen in red blood cells', type: 'concept' },
        { q: 'Arteries carry blood ___ from the heart.', a: 'away', type: 'concept' },
        { q: 'Where does gas exchange occur?', a: 'capillaries', type: 'term' },
        { q: 'What is the SA node?', a: 'The pacemaker that initiates the heartbeat', type: 'concept' },
        { q: 'What is blood pressure?', a: 'Force of blood against vessel walls, measured as systolic/diastolic', type: 'concept' },
        { q: 'Systemic circulation carries ___ blood to the body.', a: 'oxygenated', type: 'concept' },
      ],
    },
    'respiratory-basics': {
      questions: [
        { q: 'Where does gas exchange occur in the lungs?', a: 'alveoli', type: 'term' },
        { q: 'What drives oxygen from alveoli to blood?', a: 'partial pressure gradient (diffusion)', type: 'concept' },
        { q: 'What is the role of the diaphragm?', a: 'Contracts to expand thoracic cavity, creating negative pressure for inhalation', type: 'concept' },
        { q: 'Most CO2 is transported as ___.', a: 'bicarbonate ions (HCO3-)', type: 'concept' },
        { q: 'What is the Bohr effect?', a: 'Lower pH reduces hemoglobin O2 affinity, promoting O2 release to tissues', type: 'concept' },
        { q: 'What is tidal volume?', a: 'Volume of air in a normal breath', type: 'term' },
        { q: 'Surfactant prevents ___.', a: 'alveolar collapse by reducing surface tension', type: 'concept' },
        { q: 'The breathing center is in the ___.', a: 'medulla oblongata', type: 'term' },
      ],
    },
  },
  'intermediate': {
    'dna-replication-mechanism': {
      questions: [
        { q: 'What is the role of topoisomerase during replication?', a: 'Relieves tension from supercoiling ahead of the replication fork', type: 'concept' },
        { q: 'What is the proofreading function of DNA polymerase?', a: '3\' to 5\' exonuclease activity that removes mismatched nucleotides', type: 'concept' },
        { q: 'How does the sliding clamp aid replication?', a: 'Holds DNA polymerase on the template, increasing processivity', type: 'concept' },
        { q: 'What is the end-replication problem?', a: 'Linear chromosomes shorten each replication because lagging strand cannot complete the end', type: 'concept' },
        { q: 'How does telomerase solve the end-replication problem?', a: 'Extends the 3\' end using an RNA template', type: 'concept' },
        { q: 'What is mismatch repair?', a: 'Post-replication correction of base mismatches by MutS/MutL proteins', type: 'concept' },
        { q: 'In E. coli, how is parental strand distinguished during repair?', a: 'Methylation of GATC sequences on the parental strand', type: 'concept' },
        { q: 'What is the difference between leading and lagging strand synthesis?', a: 'Leading is continuous; lagging is discontinuous (Okazaki fragments)', type: 'concept' },
      ],
    },
    'signal-transduction': {
      questions: [
        { q: 'What are the three stages of cell signaling?', a: 'Reception, transduction, response', type: 'concept' },
        { q: 'What is a second messenger? Give examples.', a: 'Small relay molecules: cAMP, Ca2+, IP3, DAG', type: 'concept' },
        { q: 'What is a kinase cascade?', a: 'Sequential phosphorylation and activation of protein kinases', type: 'concept' },
        { q: 'GPCRs have how many transmembrane domains?', a: '7', type: 'concept' },
        { q: 'What is the role of GTPase activity in G-protein signaling?', a: 'Hydrolyzes GTP to GDP, turning off the G-protein', type: 'concept' },
        { q: 'RTKs signal by ___.', a: 'dimerization and autophosphorylation of tyrosine residues', type: 'concept' },
        { q: 'What is signal amplification?', a: 'Each cascade step activates multiple molecules, greatly increasing response', type: 'concept' },
        { q: 'What terminates a signaling cascade?', a: 'Phosphatases, GTPase activity, receptor internalization, second messenger degradation', type: 'concept' },
      ],
    },
    'population-genetics': {
      questions: [
        { q: 'What is genetic drift?', a: 'Random allele frequency changes due to chance, especially in small populations', type: 'concept' },
        { q: 'What is a bottleneck effect?', a: 'Drastic population reduction that reduces genetic diversity', type: 'concept' },
        { q: 'What is the founder effect?', a: 'Small group colonizes new area with non-representative allele sample', type: 'concept' },
        { q: 'How does gene flow affect differentiation?', a: 'Reduces genetic differences between populations', type: 'concept' },
        { q: 'What is balancing selection?', a: 'Selection maintaining multiple alleles, e.g., heterozygote advantage', type: 'concept' },
        { q: 'Sickle cell heterozygote advantage is an example of ___.', a: 'balancing selection', type: 'concept' },
        { q: 'What is Fst?', a: 'Measure of genetic differentiation between populations (0=none, 1=complete)', type: 'concept' },
        { q: 'What is effective population size (Ne)?', a: 'Size of ideal population losing variation at same rate as actual population', type: 'concept' },
      ],
    },
    'phylogenetics': {
      questions: [
        { q: 'What is a clade?', a: 'A group of an ancestor and all its descendants', type: 'concept' },
        { q: 'What is a monophyletic group?', a: 'Ancestor plus ALL its descendants', type: 'concept' },
        { q: 'What is parsimony in phylogenetics?', a: 'The simplest tree (fewest changes) is preferred', type: 'concept' },
        { q: 'What is a synapomorphy?', a: 'A shared derived character that defines a clade', type: 'term' },
        { q: 'What is an outgroup used for?', a: 'To root a tree and determine ancestral vs derived characters', type: 'concept' },
        { q: 'Maximum likelihood estimates ___.', a: 'The tree most likely to produce observed data given a model', type: 'concept' },
        { q: 'What is homoplasy?', a: 'Similarity not due to common ancestry (convergence, reversal)', type: 'concept' },
        { q: 'How do molecular clocks work?', a: 'Calibrate mutation rates with fossils to estimate divergence times', type: 'concept' },
      ],
    },
    'community-interactions': {
      questions: [
        { q: 'What is the competitive exclusion principle?', a: 'Two species cannot coexist indefinitely on the same limiting resource', type: 'concept' },
        { q: 'What is resource partitioning?', a: 'Species divide resources to reduce competition', type: 'concept' },
        { q: 'What is mutualism?', a: 'Both species benefit', type: 'concept' },
        { q: 'What is commensalism?', a: 'One benefits, the other is unaffected', type: 'concept' },
        { q: 'What is character displacement?', a: 'Divergence of traits in sympatric species to reduce competition', type: 'concept' },
        { q: 'What is a trophic cascade?', a: 'Indirect effects across trophic levels when predator controls herbivores', type: 'concept' },
        { q: 'How does parasitism differ from predation?', a: 'Parasites live on/in hosts and usually don\'t kill them', type: 'concept' },
        { q: 'What is apparent competition?', a: 'Two prey species indirectly compete by sharing a common predator', type: 'concept' },
      ],
    },
    'neurophysiology': {
      questions: [
        { q: 'What ions maintain resting membrane potential?', a: 'K+ (outward leak) and Na+/K+ pump maintenance', type: 'concept' },
        { q: 'During depolarization, which ion rushes in?', a: 'Na+', type: 'concept' },
        { q: 'What is the refractory period?', a: 'Period after action potential during which neuron cannot fire again', type: 'concept' },
        { q: 'What is an EPSP?', a: 'Excitatory postsynaptic potential — a depolarizing graded potential', type: 'concept' },
        { q: 'What is temporal summation?', a: 'Multiple signals from same synapse in rapid succession summate', type: 'concept' },
        { q: 'LTP involves which receptor?', a: 'NMDA receptor', type: 'concept' },
        { q: 'What is the all-or-none principle?', a: 'Action potentials fire at full strength or not at all', type: 'concept' },
        { q: 'Na+/K+ ATPase pumps ___ Na+ out and ___ K+ in.', a: '3 Na+ out and 2 K+ in', type: 'concept' },
      ],
    },
  },
  'upper-division': {
    'chromatin-remodeling': {
      questions: [
        { q: 'What is the difference between euchromatin and heterochromatin?', a: 'Euchromatin is loosely packed and active; heterochromatin is tightly packed and silent', type: 'concept' },
        { q: 'Histone acetylation generally ___ gene expression.', a: 'increases (activates)', type: 'concept' },
        { q: 'What enzyme adds acetyl groups to histones?', a: 'histone acetyltransferase (HAT)', type: 'term' },
        { q: 'DNA methylation at CpG islands typically ___ transcription.', a: 'represses (silences)', type: 'concept' },
        { q: 'What is the histone code hypothesis?', a: 'Specific combinations of histone modifications regulate gene expression', type: 'concept' },
        { q: 'X-inactivation is mediated by ___.', a: 'XIST long non-coding RNA and heterochromatin formation', type: 'concept' },
        { q: 'SWI/SNF complexes remodel chromatin by ___.', a: 'Using ATP to slide, eject, or restructure nucleosomes', type: 'concept' },
        { q: 'What is genomic imprinting?', a: 'Parent-of-origin-specific gene silencing via DNA methylation', type: 'concept' },
      ],
    },
    'cell-signaling-cascades': {
      questions: [
        { q: 'What is the Ras-MAPK pathway?', a: 'RTK activates Ras which triggers RAF-MEK-ERK cascade for gene regulation', type: 'concept' },
        { q: 'What is the PI3K/Akt pathway involved in?', a: 'Cell survival, growth, metabolism; frequently mutated in cancer', type: 'concept' },
        { q: 'How does Wnt signaling regulate beta-catenin?', a: 'Wnt prevents beta-catenin degradation, allowing nuclear entry and transcription', type: 'concept' },
        { q: 'What is Notch signaling?', a: 'Cell-cell contact triggers proteolytic cleavage, releasing intracellular domain to nucleus', type: 'concept' },
        { q: 'JAK-STAT signaling involves ___.', a: 'Cytokine receptor activation of JAK kinases phosphorylating STAT transcription factors', type: 'concept' },
        { q: 'What is pathway crosstalk?', a: 'Components of different pathways interact, integrating signals', type: 'concept' },
        { q: 'How do scaffold proteins affect signaling?', a: 'Organize pathway components to increase specificity and efficiency', type: 'concept' },
        { q: 'What makes Ras a proto-oncogene?', a: 'Activating mutations lock Ras in GTP-bound state, promoting uncontrolled growth', type: 'concept' },
      ],
    },
    'morphogens': {
      questions: [
        { q: 'What is a morphogen?', a: 'A signaling molecule forming a concentration gradient that specifies cell fates', type: 'concept' },
        { q: 'What is the French Flag model?', a: 'Cells respond to different morphogen concentrations by adopting distinct fates', type: 'concept' },
        { q: 'Bicoid in Drosophila specifies ___.', a: 'anterior (head/thorax) structures', type: 'concept' },
        { q: 'What is Sonic Hedgehog (Shh)?', a: 'A morphogen for vertebrate limb, neural tube, and other patterning', type: 'concept' },
        { q: 'How do morphogen gradients form?', a: 'Diffusion from source combined with degradation and receptor uptake', type: 'concept' },
        { q: 'What is induction?', a: 'One cell group signals to influence neighboring cell development', type: 'concept' },
        { q: 'What is the Spemann organizer?', a: 'Amphibian region that induces neural tissue (dorsal lip of blastopore)', type: 'concept' },
        { q: 'BMP and Chordin interact as ___.', a: 'Antagonists: Chordin inhibits BMP to allow neural fate dorsally', type: 'concept' },
      ],
    },
    'genomics': {
      questions: [
        { q: 'What is a GWAS?', a: 'Genome-wide association study scanning for variants associated with traits', type: 'concept' },
        { q: 'What is the difference between a SNP and a structural variant?', a: 'SNP is single nucleotide; structural variants are larger changes', type: 'concept' },
        { q: 'What is RNA-seq used for?', a: 'Quantifying gene expression across the transcriptome', type: 'concept' },
        { q: 'What is ChIP-seq?', a: 'Identifying protein-DNA binding sites via immunoprecipitation + sequencing', type: 'concept' },
        { q: 'What is metagenomics?', a: 'Sequencing all DNA in an environmental sample for microbial community characterization', type: 'concept' },
        { q: 'What are long-read technologies used for?', a: 'Resolving repetitive regions and structural variants', type: 'concept' },
        { q: 'What is the ENCODE project?', a: 'Identifying all functional elements in the human genome', type: 'concept' },
        { q: 'What is a reference genome?', a: 'A composite standard sequence for a species', type: 'concept' },
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

  return { type: 'biology', skill, level, count: items.length, instruction: 'Answer each question. For multiple choice, select the best answer.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class CollegeBiology {
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
        apply: 'Connect concept to experimental or clinical applications',
        synthesize: `Relate ${target.skill} to broader biological themes`,
      },
    };
  }
}

module.exports = CollegeBiology;

// CLI: node biology.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CollegeBiology();
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
      default: out({ usage: 'node biology.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
