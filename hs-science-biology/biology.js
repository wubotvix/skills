// eClaw HS Biology Interactive Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-biology');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'standard': {
    'cell-biology': ['cell-organelles', 'membrane-transport', 'cellular-respiration', 'photosynthesis'],
    'molecular-biology': ['dna-structure', 'dna-replication', 'transcription-translation', 'gene-regulation'],
    'genetics': ['mendelian-genetics', 'non-mendelian-inheritance', 'punnett-squares', 'pedigree-analysis'],
    'evolution': ['natural-selection', 'speciation', 'population-genetics', 'phylogenetics'],
    'ecology': ['energy-flow', 'biogeochemical-cycles', 'population-dynamics', 'biodiversity'],
    'body-systems': ['organ-systems', 'homeostasis', 'immune-response'],
    'biotechnology': ['pcr-gel-electrophoresis', 'genetic-engineering', 'cloning-ethics'],
    'classification': ['taxonomy-domains', 'cladograms', 'binomial-nomenclature'],
  },
  'ap': {
    'cell-biology': ['cell-organelles', 'membrane-transport', 'cellular-respiration', 'photosynthesis', 'cell-signaling', 'cell-cycle-regulation'],
    'molecular-biology': ['dna-structure', 'dna-replication', 'transcription-translation', 'gene-regulation', 'epigenetics', 'gene-expression-biotechnology'],
    'genetics': ['mendelian-genetics', 'non-mendelian-inheritance', 'punnett-squares', 'pedigree-analysis', 'chromosomal-inheritance', 'hardy-weinberg'],
    'evolution': ['natural-selection', 'speciation', 'population-genetics', 'phylogenetics', 'evidence-for-evolution', 'common-ancestry'],
    'ecology': ['energy-flow', 'biogeochemical-cycles', 'population-dynamics', 'biodiversity', 'community-ecology', 'ecosystem-disruptions'],
    'body-systems': ['organ-systems', 'homeostasis', 'immune-response', 'nervous-endocrine-integration'],
    'biotechnology': ['pcr-gel-electrophoresis', 'genetic-engineering', 'cloning-ethics', 'crispr-applications'],
    'classification': ['taxonomy-domains', 'cladograms', 'binomial-nomenclature', 'molecular-systematics'],
  },
};

const QUESTION_BANKS = {
  'cell-organelles': {
    questions: [
      { q: 'Which organelle is the "powerhouse of the cell" and produces ATP through oxidative phosphorylation?', a: 'mitochondria', type: 'recall', choices: ['mitochondria', 'chloroplast', 'ribosome', 'nucleus'] },
      { q: 'What is the function of the rough endoplasmic reticulum?', a: 'protein synthesis and modification', type: 'recall', choices: ['protein synthesis and modification', 'lipid synthesis', 'ATP production', 'DNA replication'] },
      { q: 'Which organelle contains hydrolytic enzymes for intracellular digestion?', a: 'lysosome', type: 'recall', choices: ['lysosome', 'peroxisome', 'vacuole', 'Golgi apparatus'] },
      { q: 'What structure is present in plant cells but absent in animal cells?', a: 'cell wall', type: 'recall', choices: ['cell wall', 'cell membrane', 'nucleus', 'mitochondria'] },
      { q: 'Which organelle modifies, packages, and ships proteins to their destination?', a: 'Golgi apparatus', type: 'recall', choices: ['Golgi apparatus', 'rough ER', 'smooth ER', 'lysosome'] },
      { q: 'Ribosomes are composed of which two types of molecules?', a: 'rRNA and protein', type: 'recall', choices: ['rRNA and protein', 'DNA and protein', 'mRNA and lipids', 'tRNA and carbohydrates'] },
      { q: 'What is the role of the central vacuole in plant cells?', a: 'water storage and turgor pressure', type: 'recall', choices: ['water storage and turgor pressure', 'protein synthesis', 'ATP production', 'cell division'] },
      { q: 'Which cytoskeletal element is thinnest and involved in cell movement?', a: 'microfilaments', type: 'recall', choices: ['microfilaments', 'microtubules', 'intermediate filaments', 'centrioles'] },
    ],
  },
  'membrane-transport': {
    questions: [
      { q: 'A cell placed in a hypotonic solution will do what?', a: 'swell', type: 'application', choices: ['swell', 'shrink', 'stay the same', 'lyse immediately'] },
      { q: 'Which type of transport requires ATP and moves solutes against the concentration gradient?', a: 'active transport', type: 'recall', choices: ['active transport', 'facilitated diffusion', 'osmosis', 'simple diffusion'] },
      { q: 'What is the term for the movement of water across a selectively permeable membrane?', a: 'osmosis', type: 'recall', choices: ['osmosis', 'diffusion', 'endocytosis', 'exocytosis'] },
      { q: 'Channel proteins and carrier proteins assist in which process?', a: 'facilitated diffusion', type: 'recall', choices: ['facilitated diffusion', 'active transport', 'simple diffusion', 'pinocytosis'] },
      { q: 'The sodium-potassium pump moves how many Na+ out and how many K+ in per cycle?', a: '3 Na+ out, 2 K+ in', type: 'recall', choices: ['3 Na+ out, 2 K+ in', '2 Na+ out, 3 K+ in', '3 Na+ out, 3 K+ in', '2 Na+ out, 2 K+ in'] },
      { q: 'Endocytosis is an example of what type of transport?', a: 'bulk transport', type: 'recall', choices: ['bulk transport', 'passive transport', 'facilitated diffusion', 'osmosis'] },
      { q: 'In a hypertonic solution, a red blood cell will undergo what process?', a: 'crenation', type: 'application', choices: ['crenation', 'lysis', 'plasmolysis', 'turgidity'] },
      { q: 'What property of the cell membrane is described by the fluid mosaic model?', a: 'phospholipid bilayer with embedded proteins that can move laterally', type: 'recall', choices: ['phospholipid bilayer with embedded proteins that can move laterally', 'rigid protein shell', 'single layer of lipids', 'carbohydrate wall'] },
    ],
  },
  'cellular-respiration': {
    questions: [
      { q: 'What is the net ATP yield from glycolysis?', a: '2 ATP', type: 'recall', choices: ['2 ATP', '4 ATP', '36 ATP', '38 ATP'] },
      { q: 'Where does the Krebs cycle take place?', a: 'mitochondrial matrix', type: 'recall', choices: ['mitochondrial matrix', 'inner mitochondrial membrane', 'cytoplasm', 'nucleus'] },
      { q: 'What is the final electron acceptor in the electron transport chain?', a: 'oxygen', type: 'recall', choices: ['oxygen', 'carbon dioxide', 'water', 'NADH'] },
      { q: 'Fermentation occurs when what molecule is absent?', a: 'oxygen', type: 'recall', choices: ['oxygen', 'glucose', 'ATP', 'NADH'] },
      { q: 'Which molecule is the primary product of glycolysis?', a: 'pyruvate', type: 'recall', choices: ['pyruvate', 'acetyl-CoA', 'citrate', 'lactate'] },
      { q: 'How many CO2 molecules are released per turn of the Krebs cycle?', a: '2', type: 'recall', choices: ['2', '1', '3', '6'] },
      { q: 'What is the role of NADH and FADH2 in cellular respiration?', a: 'electron carriers that donate electrons to the ETC', type: 'recall', choices: ['electron carriers that donate electrons to the ETC', 'enzymes that catalyze glycolysis', 'structural membrane components', 'products of fermentation'] },
      { q: 'Approximately how many total ATP are produced from one glucose molecule in aerobic respiration?', a: '30-32', type: 'recall', choices: ['30-32', '2', '4', '100'] },
    ],
  },
  'photosynthesis': {
    questions: [
      { q: 'Where do the light-dependent reactions of photosynthesis occur?', a: 'thylakoid membranes', type: 'recall', choices: ['thylakoid membranes', 'stroma', 'cytoplasm', 'mitochondria'] },
      { q: 'What is the primary pigment that absorbs light energy in photosynthesis?', a: 'chlorophyll a', type: 'recall', choices: ['chlorophyll a', 'chlorophyll b', 'carotenoids', 'xanthophyll'] },
      { q: 'The Calvin cycle fixes which gas into an organic molecule?', a: 'CO2', type: 'recall', choices: ['CO2', 'O2', 'N2', 'H2O'] },
      { q: 'What enzyme fixes CO2 in the Calvin cycle?', a: 'RuBisCO', type: 'recall', choices: ['RuBisCO', 'ATP synthase', 'helicase', 'DNA polymerase'] },
      { q: 'What are the products of the light-dependent reactions?', a: 'ATP, NADPH, and O2', type: 'recall', choices: ['ATP, NADPH, and O2', 'glucose and O2', 'CO2 and H2O', 'pyruvate and ATP'] },
      { q: 'C4 plants avoid photorespiration by doing what?', a: 'fixing CO2 into a 4-carbon compound in mesophyll cells first', type: 'application', choices: ['fixing CO2 into a 4-carbon compound in mesophyll cells first', 'opening stomata at night', 'using a different pigment', 'having no Calvin cycle'] },
      { q: 'What is the overall equation for photosynthesis?', a: '6CO2 + 6H2O -> C6H12O6 + 6O2', type: 'recall', choices: ['6CO2 + 6H2O -> C6H12O6 + 6O2', 'C6H12O6 + 6O2 -> 6CO2 + 6H2O', '6CO2 -> 6C + 6O2', 'H2O -> H2 + O2'] },
      { q: 'CAM plants open their stomata when?', a: 'at night', type: 'recall', choices: ['at night', 'during the day', 'all the time', 'never'] },
    ],
  },
  'dna-structure': {
    questions: [
      { q: 'What type of bond holds complementary base pairs together in DNA?', a: 'hydrogen bonds', type: 'recall', choices: ['hydrogen bonds', 'covalent bonds', 'ionic bonds', 'peptide bonds'] },
      { q: 'Which bases pair together in DNA?', a: 'A-T and G-C', type: 'recall', choices: ['A-T and G-C', 'A-G and T-C', 'A-C and G-T', 'A-U and G-C'] },
      { q: 'What are the three parts of a nucleotide?', a: 'phosphate group, deoxyribose sugar, and nitrogenous base', type: 'recall', choices: ['phosphate group, deoxyribose sugar, and nitrogenous base', 'amino acid, phosphate, and sugar', 'ribose, base, and lipid', 'glucose, phosphate, and base'] },
      { q: 'What is the shape of the DNA molecule?', a: 'double helix', type: 'recall', choices: ['double helix', 'single strand', 'triple helix', 'circular loop'] },
      { q: 'The sugar-phosphate backbone is connected by what type of bonds?', a: 'phosphodiester bonds', type: 'recall', choices: ['phosphodiester bonds', 'hydrogen bonds', 'peptide bonds', 'glycosidic bonds'] },
      { q: 'If a DNA strand reads 5\'-ATCGTA-3\', what is the complementary strand?', a: '3\'-TAGCAT-5\'', type: 'application', choices: ['3\'-TAGCAT-5\'', '3\'-ATCGTA-5\'', '3\'-UAGCAU-5\'', '3\'-GCTAAC-5\''] },
    ],
  },
  'dna-replication': {
    questions: [
      { q: 'What enzyme unwinds the DNA double helix during replication?', a: 'helicase', type: 'recall', choices: ['helicase', 'DNA polymerase', 'ligase', 'topoisomerase'] },
      { q: 'DNA polymerase synthesizes new DNA in which direction?', a: '5\' to 3\'', type: 'recall', choices: ['5\' to 3\'', '3\' to 5\'', 'both directions', 'random'] },
      { q: 'What is the lagging strand synthesized as?', a: 'Okazaki fragments', type: 'recall', choices: ['Okazaki fragments', 'one continuous strand', 'RNA primers only', 'telomeres'] },
      { q: 'Which enzyme joins Okazaki fragments together?', a: 'DNA ligase', type: 'recall', choices: ['DNA ligase', 'DNA polymerase', 'helicase', 'primase'] },
      { q: 'DNA replication is semiconservative because each new molecule has what?', a: 'one old strand and one new strand', type: 'recall', choices: ['one old strand and one new strand', 'two new strands', 'two old strands', 'randomly mixed strands'] },
      { q: 'What enzyme synthesizes the RNA primer needed to start replication?', a: 'primase', type: 'recall', choices: ['primase', 'helicase', 'ligase', 'polymerase'] },
    ],
  },
  'transcription-translation': {
    questions: [
      { q: 'What enzyme synthesizes mRNA from a DNA template?', a: 'RNA polymerase', type: 'recall', choices: ['RNA polymerase', 'DNA polymerase', 'ribosome', 'helicase'] },
      { q: 'Where does translation occur in a eukaryotic cell?', a: 'ribosome', type: 'recall', choices: ['ribosome', 'nucleus', 'Golgi apparatus', 'mitochondria'] },
      { q: 'A codon is a sequence of how many nucleotides?', a: '3', type: 'recall', choices: ['3', '1', '2', '4'] },
      { q: 'What molecule carries amino acids to the ribosome during translation?', a: 'tRNA', type: 'recall', choices: ['tRNA', 'mRNA', 'rRNA', 'DNA'] },
      { q: 'The start codon AUG codes for which amino acid?', a: 'methionine', type: 'recall', choices: ['methionine', 'alanine', 'glycine', 'stop'] },
      { q: 'What is the process of removing introns from pre-mRNA called?', a: 'RNA splicing', type: 'recall', choices: ['RNA splicing', 'transcription', 'translation', 'replication'] },
    ],
  },
  'gene-regulation': {
    questions: [
      { q: 'In the lac operon, what molecule acts as the inducer?', a: 'lactose (allolactose)', type: 'recall', choices: ['lactose (allolactose)', 'glucose', 'tryptophan', 'ATP'] },
      { q: 'What is a transcription factor?', a: 'a protein that binds to DNA to regulate gene expression', type: 'recall', choices: ['a protein that binds to DNA to regulate gene expression', 'an enzyme that copies DNA', 'a type of RNA', 'a ribosomal subunit'] },
      { q: 'Enhancers can act how relative to the promoter?', a: 'at a distance to increase transcription', type: 'recall', choices: ['at a distance to increase transcription', 'only adjacent to the gene', 'by blocking RNA polymerase', 'by degrading mRNA'] },
      { q: 'What is the role of a silencer in gene regulation?', a: 'to decrease or prevent transcription', type: 'recall', choices: ['to decrease or prevent transcription', 'to increase transcription', 'to start replication', 'to splice introns'] },
      { q: 'MicroRNAs regulate gene expression at what level?', a: 'post-transcriptional', type: 'recall', choices: ['post-transcriptional', 'DNA replication', 'transcription initiation', 'protein folding'] },
      { q: 'What is epigenetic regulation?', a: 'heritable changes in gene expression without changes to DNA sequence', type: 'recall', choices: ['heritable changes in gene expression without changes to DNA sequence', 'mutation of DNA bases', 'deletion of genes', 'duplication of chromosomes'] },
    ],
  },
  'mendelian-genetics': {
    questions: [
      { q: 'What is the genotypic ratio of Aa x Aa?', a: '1:2:1', type: 'application', choices: ['1:2:1', '3:1', '1:1', '9:3:3:1'] },
      { q: 'An organism with two different alleles for a trait is called what?', a: 'heterozygous', type: 'recall', choices: ['heterozygous', 'homozygous', 'hemizygous', 'polyploid'] },
      { q: 'Mendel\'s Law of Segregation states what?', a: 'allele pairs separate during gamete formation', type: 'recall', choices: ['allele pairs separate during gamete formation', 'genes sort independently', 'dominant alleles mask recessive ones', 'all gametes are identical'] },
      { q: 'What is the phenotypic ratio of AaBb x AaBb?', a: '9:3:3:1', type: 'application', choices: ['9:3:3:1', '1:2:1', '3:1', '1:1:1:1'] },
      { q: 'A test cross involves mating an unknown genotype with what?', a: 'homozygous recessive', type: 'recall', choices: ['homozygous recessive', 'homozygous dominant', 'heterozygous', 'another unknown'] },
      { q: 'If both parents are Aa for an autosomal recessive disorder, what is the probability their child is affected?', a: '25%', type: 'application', choices: ['25%', '50%', '75%', '100%'] },
    ],
  },
  'non-mendelian-inheritance': {
    questions: [
      { q: 'Incomplete dominance produces what phenotype in the heterozygote?', a: 'a blend of both parental phenotypes', type: 'recall', choices: ['a blend of both parental phenotypes', 'the dominant phenotype', 'the recessive phenotype', 'a new unrelated phenotype'] },
      { q: 'In codominance, the heterozygote expresses what?', a: 'both alleles fully and simultaneously', type: 'recall', choices: ['both alleles fully and simultaneously', 'only the dominant allele', 'a blended phenotype', 'neither allele'] },
      { q: 'What is polygenic inheritance?', a: 'a trait controlled by two or more genes', type: 'recall', choices: ['a trait controlled by two or more genes', 'a trait controlled by one gene', 'X-linked inheritance', 'mitochondrial inheritance'] },
      { q: 'Human blood type (ABO) is an example of what pattern?', a: 'multiple alleles and codominance', type: 'recall', choices: ['multiple alleles and codominance', 'simple dominance', 'polygenic inheritance', 'sex-linked inheritance'] },
      { q: 'Sex-linked traits are more commonly expressed in males because they have what?', a: 'only one X chromosome', type: 'recall', choices: ['only one X chromosome', 'two X chromosomes', 'no sex chromosomes', 'extra autosomes'] },
      { q: 'Epistasis occurs when what happens?', a: 'one gene masks or modifies the expression of another gene', type: 'recall', choices: ['one gene masks or modifies the expression of another gene', 'two alleles blend', 'a mutation occurs', 'chromosomes fail to separate'] },
    ],
  },
  'punnett-squares': {
    questions: [
      { q: 'In Bb x Bb, what fraction of offspring are homozygous dominant?', a: '1/4', type: 'application', choices: ['1/4', '1/2', '3/4', '0'] },
      { q: 'A dihybrid Punnett square has how many boxes?', a: '16', type: 'recall', choices: ['16', '4', '8', '9'] },
      { q: 'Cross Tt x tt: what percentage of offspring will be tall (T dominant)?', a: '50%', type: 'application', choices: ['50%', '75%', '25%', '100%'] },
      { q: 'In RrYy x RrYy, what is the expected phenotypic ratio?', a: '9:3:3:1', type: 'application', choices: ['9:3:3:1', '3:1', '1:2:1', '1:1'] },
      { q: 'What is the purpose of a Punnett square?', a: 'to predict the probability of offspring genotypes and phenotypes', type: 'recall', choices: ['to predict the probability of offspring genotypes and phenotypes', 'to sequence DNA', 'to identify mutations', 'to map chromosomes'] },
      { q: 'In Aa x Aa, what fraction will be heterozygous?', a: '1/2', type: 'application', choices: ['1/2', '1/4', '3/4', '0'] },
    ],
  },
  'pedigree-analysis': {
    questions: [
      { q: 'In a pedigree, a filled-in circle represents what?', a: 'an affected female', type: 'recall', choices: ['an affected female', 'an affected male', 'a carrier female', 'an unaffected female'] },
      { q: 'If two unaffected parents have an affected child, the trait is most likely what?', a: 'autosomal recessive', type: 'application', choices: ['autosomal recessive', 'autosomal dominant', 'X-linked dominant', 'Y-linked'] },
      { q: 'A horizontal line connecting a circle and square represents what?', a: 'a mating/marriage', type: 'recall', choices: ['a mating/marriage', 'siblings', 'parent-child', 'identical twins'] },
      { q: 'If a trait appears in every generation, it is likely what pattern?', a: 'autosomal dominant', type: 'application', choices: ['autosomal dominant', 'autosomal recessive', 'X-linked recessive', 'mitochondrial'] },
      { q: 'X-linked recessive traits affect which sex more frequently?', a: 'males', type: 'recall', choices: ['males', 'females', 'both equally', 'neither'] },
      { q: 'A carrier in a pedigree is typically shown as what?', a: 'a half-filled symbol', type: 'recall', choices: ['a half-filled symbol', 'a fully filled symbol', 'an empty symbol', 'a dotted symbol'] },
    ],
  },
  'natural-selection': {
    questions: [
      { q: 'What are the four conditions required for natural selection?', a: 'variation, heritability, differential reproduction, and overproduction', type: 'recall', choices: ['variation, heritability, differential reproduction, and overproduction', 'mutation, migration, drift, and selection', 'genotype, phenotype, allele, and gene', 'predation, competition, parasitism, and mutualism'] },
      { q: 'Stabilizing selection favors what type of phenotypes?', a: 'intermediate/average phenotypes', type: 'recall', choices: ['intermediate/average phenotypes', 'extreme phenotypes', 'one extreme only', 'random phenotypes'] },
      { q: 'The peppered moth is a classic example of what type of selection?', a: 'directional selection', type: 'application', choices: ['directional selection', 'stabilizing selection', 'disruptive selection', 'sexual selection'] },
      { q: 'What is fitness in evolutionary terms?', a: 'ability to survive and reproduce in its environment', type: 'recall', choices: ['ability to survive and reproduce in its environment', 'physical strength', 'speed of movement', 'size of the organism'] },
      { q: 'Antibiotic resistance in bacteria is an example of what?', a: 'natural selection acting on pre-existing variation', type: 'application', choices: ['natural selection acting on pre-existing variation', 'Lamarckian inheritance', 'genetic engineering', 'spontaneous generation'] },
      { q: 'Disruptive selection tends to do what?', a: 'favor both extremes over the intermediate', type: 'recall', choices: ['favor both extremes over the intermediate', 'reduce variation', 'favor the average', 'eliminate all variation'] },
    ],
  },
  'speciation': {
    questions: [
      { q: 'Allopatric speciation occurs due to what?', a: 'geographic isolation', type: 'recall', choices: ['geographic isolation', 'temporal isolation', 'behavioral isolation', 'gametic isolation'] },
      { q: 'Sympatric speciation can occur through what mechanism in plants?', a: 'polyploidy', type: 'recall', choices: ['polyploidy', 'geographic isolation', 'founder effect', 'bottleneck effect'] },
      { q: 'What are prezygotic barriers?', a: 'mechanisms that prevent mating or fertilization between species', type: 'recall', choices: ['mechanisms that prevent mating or fertilization between species', 'barriers after fertilization', 'geographic features', 'genetic mutations'] },
      { q: 'The biological species concept defines a species by what?', a: 'ability to interbreed and produce fertile offspring', type: 'recall', choices: ['ability to interbreed and produce fertile offspring', 'physical appearance', 'DNA similarity', 'geographic location'] },
      { q: 'Adaptive radiation is best described as what?', a: 'rapid diversification from a common ancestor into many niches', type: 'recall', choices: ['rapid diversification from a common ancestor into many niches', 'gradual change in one lineage', 'extinction of most species', 'convergent evolution'] },
      { q: 'Darwin\'s finches are an example of what?', a: 'adaptive radiation', type: 'application', choices: ['adaptive radiation', 'convergent evolution', 'coevolution', 'genetic drift'] },
    ],
  },
  'population-genetics': {
    questions: [
      { q: 'In the Hardy-Weinberg equation p^2 + 2pq + q^2 = 1, what does 2pq represent?', a: 'frequency of heterozygotes', type: 'recall', choices: ['frequency of heterozygotes', 'frequency of homozygous dominant', 'frequency of homozygous recessive', 'frequency of alleles'] },
      { q: 'Which is NOT a condition for Hardy-Weinberg equilibrium?', a: 'natural selection is occurring', type: 'recall', choices: ['natural selection is occurring', 'large population size', 'random mating', 'no mutation'] },
      { q: 'Genetic drift has the greatest effect on what type of population?', a: 'small populations', type: 'recall', choices: ['small populations', 'large populations', 'all populations equally', 'populations with high mutation'] },
      { q: 'The bottleneck effect occurs when what happens?', a: 'a catastrophic event drastically reduces population size', type: 'recall', choices: ['a catastrophic event drastically reduces population size', 'a few individuals colonize a new area', 'mutation rate increases', 'gene flow increases'] },
      { q: 'Gene flow between populations tends to do what?', a: 'increase genetic similarity between populations', type: 'recall', choices: ['increase genetic similarity between populations', 'increase differences', 'cause extinction', 'reduce population size'] },
      { q: 'If q = 0.3 in H-W equilibrium, what is p?', a: '0.7', type: 'application', choices: ['0.7', '0.3', '0.09', '0.49'] },
    ],
  },
  'phylogenetics': {
    questions: [
      { q: 'On a cladogram, what does a node represent?', a: 'a common ancestor', type: 'recall', choices: ['a common ancestor', 'a living species', 'an extinction event', 'a mutation'] },
      { q: 'Organisms sharing a more recent common ancestor are said to be more what?', a: 'closely related', type: 'recall', choices: ['closely related', 'distantly related', 'convergent', 'analogous'] },
      { q: 'What is a synapomorphy?', a: 'a shared derived character', type: 'recall', choices: ['a shared derived character', 'a shared ancestral character', 'an analogous structure', 'a vestigial structure'] },
      { q: 'Analogous structures are evidence of what?', a: 'convergent evolution', type: 'recall', choices: ['convergent evolution', 'divergent evolution', 'common ancestry', 'coevolution'] },
      { q: 'What type of data is most commonly used in modern phylogenetics?', a: 'DNA/molecular sequence data', type: 'recall', choices: ['DNA/molecular sequence data', 'fossil morphology only', 'behavioral data', 'geographic distribution'] },
      { q: 'An outgroup in a cladogram is used for what?', a: 'to root the tree and determine ancestral vs derived characters', type: 'recall', choices: ['to root the tree and determine ancestral vs derived characters', 'to show the most evolved species', 'to represent extinct species', 'to connect unrelated lineages'] },
    ],
  },
  'energy-flow': {
    questions: [
      { q: 'Approximately what percentage of energy transfers between trophic levels?', a: '10%', type: 'recall', choices: ['10%', '50%', '90%', '1%'] },
      { q: 'Primary producers convert what type of energy into chemical energy?', a: 'solar energy', type: 'recall', choices: ['solar energy', 'thermal energy', 'kinetic energy', 'chemical energy from soil'] },
      { q: 'A food web differs from a food chain how?', a: 'it shows multiple interconnected feeding relationships', type: 'recall', choices: ['it shows multiple interconnected feeding relationships', 'it has only one path', 'it excludes decomposers', 'it only includes plants'] },
      { q: 'Why are there usually only 4-5 trophic levels?', a: 'energy loss at each level limits the number of levels', type: 'application', choices: ['energy loss at each level limits the number of levels', 'not enough species', 'oxygen runs out', 'water is limited'] },
      { q: 'Gross primary productivity minus respiration equals what?', a: 'net primary productivity', type: 'recall', choices: ['net primary productivity', 'total ecosystem energy', 'secondary productivity', 'decomposition rate'] },
      { q: 'Decomposers process organisms from which trophic levels?', a: 'all trophic levels', type: 'recall', choices: ['all trophic levels', 'only the first level', 'only the highest level', 'no trophic level'] },
    ],
  },
  'biogeochemical-cycles': {
    questions: [
      { q: 'What process converts atmospheric N2 into ammonia?', a: 'nitrogen fixation', type: 'recall', choices: ['nitrogen fixation', 'denitrification', 'nitrification', 'ammonification'] },
      { q: 'Which process releases CO2 into the atmosphere?', a: 'cellular respiration and combustion', type: 'recall', choices: ['cellular respiration and combustion', 'photosynthesis only', 'nitrogen fixation', 'decomposition only'] },
      { q: 'Phosphorus is primarily cycled through what reservoirs?', a: 'rocks, soil, water, and organisms', type: 'recall', choices: ['rocks, soil, water, and organisms', 'the atmosphere', 'only water', 'only organisms'] },
      { q: 'What human activity has most increased atmospheric CO2?', a: 'burning fossil fuels', type: 'recall', choices: ['burning fossil fuels', 'deforestation only', 'agriculture only', 'urbanization only'] },
      { q: 'Denitrification converts nitrates back into what?', a: 'N2 gas', type: 'recall', choices: ['N2 gas', 'ammonia', 'nitrites', 'amino acids'] },
      { q: 'The water cycle is driven primarily by what?', a: 'solar energy and gravity', type: 'recall', choices: ['solar energy and gravity', 'wind only', 'tidal forces', 'geothermal energy'] },
    ],
  },
  'population-dynamics': {
    questions: [
      { q: 'What does carrying capacity (K) represent?', a: 'the maximum population size an environment can sustain', type: 'recall', choices: ['the maximum population size an environment can sustain', 'the birth rate', 'the death rate', 'the growth rate'] },
      { q: 'Logistic growth produces what shape curve?', a: 'S-shaped (sigmoidal)', type: 'recall', choices: ['S-shaped (sigmoidal)', 'J-shaped (exponential)', 'linear', 'bell curve'] },
      { q: 'A density-dependent factor has what property?', a: 'greater effect as population density increases', type: 'recall', choices: ['greater effect as population density increases', 'affects all populations equally', 'unrelated to population size', 'only affects small populations'] },
      { q: 'Which is an example of a density-independent factor?', a: 'natural disaster', type: 'recall', choices: ['natural disaster', 'competition', 'disease', 'predation'] },
      { q: 'r-selected species are characterized by what?', a: 'rapid reproduction, small body size, short lifespan', type: 'recall', choices: ['rapid reproduction, small body size, short lifespan', 'slow reproduction, large body, long lifespan', 'no reproduction', 'asexual reproduction only'] },
      { q: 'What distinguishes exponential from logistic growth?', a: 'logistic growth slows near carrying capacity; exponential does not', type: 'recall', choices: ['logistic growth slows near carrying capacity; exponential does not', 'they are the same', 'exponential is slower', 'logistic never stops'] },
    ],
  },
  'biodiversity': {
    questions: [
      { q: 'What are the three levels of biodiversity?', a: 'genetic, species, and ecosystem diversity', type: 'recall', choices: ['genetic, species, and ecosystem diversity', 'plants, animals, and fungi', 'land, water, and air', 'producers, consumers, decomposers'] },
      { q: 'A keystone species is one that what?', a: 'has a disproportionately large effect on its ecosystem', type: 'recall', choices: ['has a disproportionately large effect on its ecosystem', 'is the most abundant', 'is the largest', 'lives the longest'] },
      { q: 'What is the leading cause of biodiversity loss today?', a: 'habitat destruction', type: 'recall', choices: ['habitat destruction', 'pollution', 'climate change', 'invasive species'] },
      { q: 'An invasive species causes harm because it what?', a: 'outcompetes native species, often lacking natural predators', type: 'recall', choices: ['outcompetes native species, often lacking natural predators', 'is always a predator', 'is always larger', 'comes from the same region'] },
      { q: 'What is an ecological niche?', a: 'the role and position a species has in its environment', type: 'recall', choices: ['the role and position a species has in its environment', 'the physical habitat only', 'the food it eats only', 'its geographic range'] },
      { q: 'Why is genetic diversity important for survival?', a: 'it allows adaptation to changing environments', type: 'recall', choices: ['it allows adaptation to changing environments', 'it makes all individuals identical', 'it reduces mutation rates', 'it prevents reproduction'] },
    ],
  },
  'organ-systems': {
    questions: [
      { q: 'Which organ system is responsible for gas exchange?', a: 'respiratory system', type: 'recall', choices: ['respiratory system', 'circulatory system', 'digestive system', 'nervous system'] },
      { q: 'What is the functional unit of the kidney?', a: 'nephron', type: 'recall', choices: ['nephron', 'neuron', 'alveolus', 'villus'] },
      { q: 'The SA node is the natural pacemaker of what organ?', a: 'the heart', type: 'recall', choices: ['the heart', 'the brain', 'the lungs', 'the liver'] },
      { q: 'Villi and microvilli in the small intestine serve what function?', a: 'increase surface area for nutrient absorption', type: 'recall', choices: ['increase surface area for nutrient absorption', 'produce enzymes', 'store food', 'move food along'] },
      { q: 'The endocrine system communicates using what?', a: 'hormones', type: 'recall', choices: ['hormones', 'electrical impulses', 'sound waves', 'magnetic fields'] },
      { q: 'Which system includes bones, cartilage, and ligaments?', a: 'skeletal system', type: 'recall', choices: ['skeletal system', 'muscular system', 'integumentary system', 'lymphatic system'] },
    ],
  },
  'homeostasis': {
    questions: [
      { q: 'Homeostasis is best described as what?', a: 'maintaining a stable internal environment despite external changes', type: 'recall', choices: ['maintaining a stable internal environment despite external changes', 'constant body temperature', 'never changing', 'growing larger'] },
      { q: 'A negative feedback loop does what?', a: 'reverses a change to return to a set point', type: 'recall', choices: ['reverses a change to return to a set point', 'amplifies a change', 'has no effect', 'stops all processes'] },
      { q: 'Blood sugar regulation involves which two hormones?', a: 'insulin and glucagon', type: 'recall', choices: ['insulin and glucagon', 'estrogen and testosterone', 'adrenaline and cortisol', 'melatonin and serotonin'] },
      { q: 'Which is an example of positive feedback?', a: 'blood clotting cascade', type: 'application', choices: ['blood clotting cascade', 'body temperature regulation', 'blood glucose regulation', 'blood pH maintenance'] },
      { q: 'The hypothalamus plays what role in homeostasis?', a: 'thermostat and hormone control center', type: 'recall', choices: ['thermostat and hormone control center', 'pumping blood', 'filtering waste', 'producing red blood cells'] },
      { q: 'When body temperature drops, what response generates heat?', a: 'shivering', type: 'recall', choices: ['shivering', 'sweating', 'vasodilation', 'hyperventilation'] },
    ],
  },
  'immune-response': {
    questions: [
      { q: 'The innate immune system provides what type of defense?', a: 'nonspecific, rapid, first-line defense', type: 'recall', choices: ['nonspecific, rapid, first-line defense', 'specific, slow, targeted defense', 'no defense', 'only against bacteria'] },
      { q: 'B cells produce what to fight pathogens?', a: 'antibodies', type: 'recall', choices: ['antibodies', 'antigens', 'histamines', 'platelets'] },
      { q: 'T helper cells activate other immune cells by releasing what?', a: 'cytokines', type: 'recall', choices: ['cytokines', 'antibodies', 'antigens', 'red blood cells'] },
      { q: 'What is the role of memory cells?', a: 'enable a faster, stronger response upon re-exposure', type: 'recall', choices: ['enable a faster, stronger response upon re-exposure', 'kill pathogens directly', 'produce mucus', 'clot blood'] },
      { q: 'Vaccines work by doing what?', a: 'exposing the immune system to a harmless pathogen form to build memory', type: 'recall', choices: ['exposing the immune system to a harmless pathogen form to build memory', 'killing all pathogens', 'replacing the immune system', 'providing temporary antibodies'] },
      { q: 'An autoimmune disease occurs when what happens?', a: 'the immune system attacks the body\'s own cells', type: 'recall', choices: ['the immune system attacks the body\'s own cells', 'the immune system is too weak', 'a virus hides in cells', 'bacteria become resistant'] },
    ],
  },
  'pcr-gel-electrophoresis': {
    questions: [
      { q: 'PCR stands for what?', a: 'polymerase chain reaction', type: 'recall', choices: ['polymerase chain reaction', 'protein chain reaction', 'phosphate chain replication', 'primer chain recombination'] },
      { q: 'What are the three steps of each PCR cycle?', a: 'denaturation, annealing, extension', type: 'recall', choices: ['denaturation, annealing, extension', 'transcription, translation, replication', 'ligation, digestion, separation', 'extraction, purification, amplification'] },
      { q: 'In gel electrophoresis, smaller DNA fragments migrate how?', a: 'faster and farther toward the positive electrode', type: 'recall', choices: ['faster and farther toward the positive electrode', 'slower and closer to wells', 'to the negative electrode', 'not at all'] },
      { q: 'What enzyme is used in PCR?', a: 'Taq polymerase', type: 'recall', choices: ['Taq polymerase', 'DNA ligase', 'restriction enzyme', 'RNA polymerase'] },
      { q: 'After 5 PCR cycles starting with 1 molecule, how many copies exist?', a: '32', type: 'application', choices: ['32', '10', '25', '64'] },
      { q: 'What is the purpose of a DNA ladder in gel electrophoresis?', a: 'provide known-size fragments for comparison', type: 'recall', choices: ['provide known-size fragments for comparison', 'power the gel', 'stain the DNA', 'cut the DNA'] },
    ],
  },
  'genetic-engineering': {
    questions: [
      { q: 'Restriction enzymes cut DNA at what?', a: 'specific palindromic recognition sequences', type: 'recall', choices: ['specific palindromic recognition sequences', 'random locations', 'the ends only', 'every 100 base pairs'] },
      { q: 'A plasmid is used in genetic engineering as what?', a: 'a vector to carry foreign DNA into a host cell', type: 'recall', choices: ['a vector to carry foreign DNA into a host cell', 'an enzyme to cut DNA', 'a stain for visualization', 'a primer for PCR'] },
      { q: 'What is a genetically modified organism (GMO)?', a: 'an organism whose DNA has been altered using genetic engineering', type: 'recall', choices: ['an organism whose DNA has been altered using genetic engineering', 'any organism that reproduces', 'an organism from selective breeding', 'a clone'] },
      { q: 'Recombinant DNA is formed by combining DNA from what?', a: 'two or more different sources', type: 'recall', choices: ['two or more different sources', 'the same organism', 'only bacteria', 'only viruses'] },
      { q: 'What is gene therapy?', a: 'introducing functional genes to treat genetic disorders', type: 'recall', choices: ['introducing functional genes to treat genetic disorders', 'removing all genes', 'cloning an organism', 'creating new species'] },
      { q: 'Transgenic organisms contain genes from what?', a: 'a different species', type: 'recall', choices: ['a different species', 'the same species only', 'no genes', 'synthetic proteins'] },
    ],
  },
  'cloning-ethics': {
    questions: [
      { q: 'Reproductive cloning produces what?', a: 'a genetically identical organism', type: 'recall', choices: ['a genetically identical organism', 'a new species', 'a hybrid', 'a mutation'] },
      { q: 'Therapeutic cloning is primarily used for what?', a: 'producing stem cells for medical treatment', type: 'recall', choices: ['producing stem cells for medical treatment', 'creating identical animals', 'food production', 'criminal investigation'] },
      { q: 'Dolly the sheep was cloned using what technique?', a: 'somatic cell nuclear transfer', type: 'recall', choices: ['somatic cell nuclear transfer', 'embryo splitting', 'PCR amplification', 'gene therapy'] },
      { q: 'What is CRISPR-Cas9 used for?', a: 'precise editing of DNA sequences', type: 'recall', choices: ['precise editing of DNA sequences', 'viewing DNA under microscope', 'staining proteins', 'measuring cell size'] },
      { q: 'Stem cells are important because they can do what?', a: 'differentiate into many different cell types', type: 'recall', choices: ['differentiate into many different cell types', 'only become blood cells', 'never divide', 'only exist in embryos'] },
      { q: 'What is one major ethical concern about human cloning?', a: 'questions about identity, consent, and commodification of life', type: 'recall', choices: ['questions about identity, consent, and commodification of life', 'it is too expensive', 'it always fails', 'it requires no technology'] },
    ],
  },
  'taxonomy-domains': {
    questions: [
      { q: 'What are the three domains of life?', a: 'Bacteria, Archaea, and Eukarya', type: 'recall', choices: ['Bacteria, Archaea, and Eukarya', 'Plants, Animals, and Fungi', 'Prokaryotes, Eukaryotes, and Viruses', 'Monera, Protista, and Animalia'] },
      { q: 'The correct taxonomic order from broadest to most specific is what?', a: 'Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species', type: 'recall', choices: ['Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species', 'Kingdom, Domain, Phylum, Class, Order, Family, Genus, Species', 'Species, Genus, Family, Order, Class, Phylum, Kingdom, Domain', 'Phylum, Kingdom, Domain, Class, Order, Family, Genus, Species'] },
      { q: 'Which domain includes organisms with membrane-bound organelles?', a: 'Eukarya', type: 'recall', choices: ['Eukarya', 'Bacteria', 'Archaea', 'all three'] },
      { q: 'The kingdom Fungi obtains nutrients how?', a: 'by absorption after secreting digestive enzymes externally', type: 'recall', choices: ['by absorption after secreting digestive enzymes externally', 'by photosynthesis', 'by ingestion', 'by chemosynthesis'] },
      { q: 'Viruses are not classified in any domain because they what?', a: 'are not considered living (no cells, cannot reproduce independently)', type: 'recall', choices: ['are not considered living (no cells, cannot reproduce independently)', 'are too small', 'live in all domains', 'have DNA and RNA'] },
      { q: 'Archaea differ from Bacteria in what key way?', a: 'different cell membrane lipids and rRNA sequences', type: 'recall', choices: ['different cell membrane lipids and rRNA sequences', 'Archaea have nuclei', 'Bacteria are larger', 'Archaea cannot reproduce'] },
    ],
  },
  'cladograms': {
    questions: [
      { q: 'A cladogram is based on what type of characteristics?', a: 'shared derived characters (synapomorphies)', type: 'recall', choices: ['shared derived characters (synapomorphies)', 'overall similarity', 'geographic location', 'body size'] },
      { q: 'A monophyletic group (clade) includes what?', a: 'a common ancestor and all its descendants', type: 'recall', choices: ['a common ancestor and all its descendants', 'only living species', 'unrelated organisms', 'only extinct organisms'] },
      { q: 'What does a branch point on a cladogram represent?', a: 'a speciation event', type: 'recall', choices: ['a speciation event', 'an extinction', 'a migration event', 'a mutation'] },
      { q: 'Parsimony in cladistics prefers the tree with what?', a: 'the fewest evolutionary changes', type: 'recall', choices: ['the fewest evolutionary changes', 'the most changes', 'the most species', 'the oldest fossils'] },
      { q: 'Sister taxa are what?', a: 'two groups sharing the most recent common ancestor', type: 'recall', choices: ['two groups sharing the most recent common ancestor', 'identical species', 'the oldest groups', 'groups on opposite ends'] },
      { q: 'Convergent evolution makes cladograms difficult because what?', a: 'similar traits evolved independently', type: 'recall', choices: ['similar traits evolved independently', 'DNA cannot be sequenced', 'fossils are too old', 'species cannot be observed'] },
    ],
  },
  'binomial-nomenclature': {
    questions: [
      { q: 'Binomial nomenclature assigns what two-part name?', a: 'genus and species', type: 'recall', choices: ['genus and species', 'kingdom and phylum', 'family and order', 'domain and class'] },
      { q: 'In Homo sapiens, which word is the genus?', a: 'Homo', type: 'recall', choices: ['Homo', 'sapiens', 'both', 'neither'] },
      { q: 'Scientific names are written in what language?', a: 'Latin', type: 'recall', choices: ['Latin', 'English', 'Greek only', 'any language'] },
      { q: 'How should a scientific name be formatted?', a: 'italicized, genus capitalized, species lowercase', type: 'recall', choices: ['italicized, genus capitalized, species lowercase', 'all capitals', 'all lowercase', 'bold and underlined'] },
      { q: 'Who developed the binomial nomenclature system?', a: 'Carl Linnaeus', type: 'recall', choices: ['Carl Linnaeus', 'Charles Darwin', 'Gregor Mendel', 'Louis Pasteur'] },
      { q: 'Why is binomial nomenclature important?', a: 'it provides a universal naming system for all species', type: 'recall', choices: ['it provides a universal naming system for all species', 'it is easier than common names', 'it describes habitat', 'it classifies by diet'] },
    ],
  },
  // AP-only skills
  'cell-signaling': {
    questions: [
      { q: 'What are the three stages of cell signaling?', a: 'reception, transduction, response', type: 'recall', choices: ['reception, transduction, response', 'initiation, elongation, termination', 'G1, S, G2', 'prophase, metaphase, anaphase'] },
      { q: 'G-protein coupled receptors activate what type of molecule?', a: 'G protein', type: 'recall', choices: ['G protein', 'kinase directly', 'DNA polymerase', 'RNA polymerase'] },
      { q: 'What is a second messenger in signal transduction?', a: 'a small intracellular molecule that relays the signal (e.g., cAMP)', type: 'recall', choices: ['a small intracellular molecule that relays the signal (e.g., cAMP)', 'a second receptor', 'another ligand', 'a transcription factor'] },
      { q: 'Apoptosis is what?', a: 'programmed cell death', type: 'recall', choices: ['programmed cell death', 'uncontrolled cell growth', 'cell division', 'cell differentiation'] },
      { q: 'Kinase cascades amplify signals by doing what?', a: 'each kinase phosphorylates many copies of the next kinase', type: 'recall', choices: ['each kinase phosphorylates many copies of the next kinase', 'destroying the signal', 'blocking receptors', 'slowing transduction'] },
      { q: 'Ligand binding to a receptor tyrosine kinase causes what?', a: 'receptor dimerization and autophosphorylation', type: 'recall', choices: ['receptor dimerization and autophosphorylation', 'receptor destruction', 'gene deletion', 'membrane dissolution'] },
    ],
  },
  'cell-cycle-regulation': {
    questions: [
      { q: 'What are the three main checkpoints of the cell cycle?', a: 'G1, G2, and M (spindle) checkpoints', type: 'recall', choices: ['G1, G2, and M (spindle) checkpoints', 'S, G1, and cytokinesis', 'prophase, metaphase, anaphase', 'interphase, mitosis, meiosis'] },
      { q: 'Cyclins and CDKs regulate the cell cycle by doing what?', a: 'cyclin binding activates CDK to phosphorylate target proteins', type: 'recall', choices: ['cyclin binding activates CDK to phosphorylate target proteins', 'directly copying DNA', 'breaking down the nucleus', 'building the spindle'] },
      { q: 'What is the result of a cell passing the G1 checkpoint?', a: 'commitment to divide (enters S phase)', type: 'recall', choices: ['commitment to divide (enters S phase)', 'immediate division', 'apoptosis', 'differentiation'] },
      { q: 'Proto-oncogenes become oncogenes when they what?', a: 'mutate to promote uncontrolled cell growth', type: 'recall', choices: ['mutate to promote uncontrolled cell growth', 'are deleted', 'become tumor suppressors', 'stop transcription'] },
      { q: 'Tumor suppressor genes like p53 function how?', a: 'they halt the cell cycle or trigger apoptosis when DNA is damaged', type: 'recall', choices: ['they halt the cell cycle or trigger apoptosis when DNA is damaged', 'they promote cell division', 'they repair DNA directly', 'they destroy mutations'] },
      { q: 'Cancer results from what type of genetic changes?', a: 'accumulation of mutations in oncogenes and tumor suppressors', type: 'recall', choices: ['accumulation of mutations in oncogenes and tumor suppressors', 'a single mutation', 'loss of all DNA', 'too much apoptosis'] },
    ],
  },
  'epigenetics': {
    questions: [
      { q: 'DNA methylation typically does what to gene expression?', a: 'silences/reduces gene expression', type: 'recall', choices: ['silences/reduces gene expression', 'increases gene expression', 'has no effect', 'deletes the gene'] },
      { q: 'Histone acetylation generally does what?', a: 'loosens chromatin and increases transcription', type: 'recall', choices: ['loosens chromatin and increases transcription', 'tightens chromatin', 'destroys histones', 'replicates DNA'] },
      { q: 'Epigenetic changes are heritable but do not alter what?', a: 'the DNA sequence itself', type: 'recall', choices: ['the DNA sequence itself', 'gene expression', 'protein production', 'cell type'] },
      { q: 'X-inactivation in female mammals is an example of what?', a: 'epigenetic silencing of one X chromosome', type: 'recall', choices: ['epigenetic silencing of one X chromosome', 'deletion of an X chromosome', 'mutation of X-linked genes', 'duplication of the X chromosome'] },
      { q: 'Environmental factors can influence epigenetics through what?', a: 'diet, stress, and toxins altering methylation and acetylation patterns', type: 'recall', choices: ['diet, stress, and toxins altering methylation and acetylation patterns', 'changing DNA sequence', 'adding new chromosomes', 'removing genes'] },
      { q: 'Genomic imprinting means what?', a: 'gene expression depends on which parent the allele came from', type: 'recall', choices: ['gene expression depends on which parent the allele came from', 'both alleles are expressed equally', 'only maternal genes are expressed', 'only paternal genes are expressed'] },
    ],
  },
  'gene-expression-biotechnology': {
    questions: [
      { q: 'A DNA microarray is used for what?', a: 'measuring expression levels of thousands of genes simultaneously', type: 'recall', choices: ['measuring expression levels of thousands of genes simultaneously', 'sequencing one gene', 'cutting DNA', 'cloning organisms'] },
      { q: 'RNA interference (RNAi) works by doing what?', a: 'small RNA molecules silence specific mRNAs', type: 'recall', choices: ['small RNA molecules silence specific mRNAs', 'amplifying gene expression', 'deleting genes', 'copying DNA'] },
      { q: 'What is a knockout organism?', a: 'an organism with a specific gene inactivated', type: 'recall', choices: ['an organism with a specific gene inactivated', 'an organism with extra genes', 'a clone', 'a hybrid'] },
      { q: 'Gel electrophoresis of proteins uses what technique?', a: 'SDS-PAGE', type: 'recall', choices: ['SDS-PAGE', 'PCR', 'CRISPR', 'Southern blot'] },
      { q: 'A Western blot detects what?', a: 'specific proteins using antibodies', type: 'recall', choices: ['specific proteins using antibodies', 'DNA fragments', 'RNA sequences', 'lipids'] },
      { q: 'Next-generation sequencing allows what?', a: 'rapid sequencing of entire genomes', type: 'recall', choices: ['rapid sequencing of entire genomes', 'cloning single genes', 'protein analysis', 'cell counting'] },
    ],
  },
  'chromosomal-inheritance': {
    questions: [
      { q: 'Nondisjunction results in what?', a: 'aneuploidy (abnormal chromosome number)', type: 'recall', choices: ['aneuploidy (abnormal chromosome number)', 'polyploidy', 'normal chromosome number', 'gene mutation'] },
      { q: 'Down syndrome is caused by what?', a: 'trisomy 21', type: 'recall', choices: ['trisomy 21', 'monosomy 21', 'deletion of chromosome 21', 'translocation only'] },
      { q: 'Crossing over during meiosis results in what?', a: 'genetic recombination between homologous chromosomes', type: 'recall', choices: ['genetic recombination between homologous chromosomes', 'identical daughter cells', 'chromosome deletion', 'polyploidy'] },
      { q: 'Linked genes tend to be inherited together because they are what?', a: 'located close together on the same chromosome', type: 'recall', choices: ['located close together on the same chromosome', 'on different chromosomes', 'dominant', 'recessive'] },
      { q: 'A chromosomal translocation involves what?', a: 'a segment of one chromosome attaching to a nonhomologous chromosome', type: 'recall', choices: ['a segment of one chromosome attaching to a nonhomologous chromosome', 'loss of a chromosome', 'gain of a chromosome', 'inversion within a chromosome'] },
      { q: 'Turner syndrome (45,X) is an example of what?', a: 'monosomy', type: 'recall', choices: ['monosomy', 'trisomy', 'triploidy', 'deletion'] },
    ],
  },
  'hardy-weinberg': {
    questions: [
      { q: 'The Hardy-Weinberg equation for allele frequencies is what?', a: 'p + q = 1', type: 'recall', choices: ['p + q = 1', 'p^2 + q^2 = 1', '2pq = 1', 'p * q = 1'] },
      { q: 'If 16% of a population is homozygous recessive (q^2 = 0.16), what is q?', a: '0.4', type: 'application', choices: ['0.4', '0.16', '0.6', '0.36'] },
      { q: 'Which condition would cause a population to deviate from H-W equilibrium?', a: 'natural selection favoring one phenotype', type: 'recall', choices: ['natural selection favoring one phenotype', 'random mating', 'large population', 'no mutation'] },
      { q: 'In H-W equilibrium, the frequency of heterozygotes is what?', a: '2pq', type: 'recall', choices: ['2pq', 'p^2', 'q^2', 'pq'] },
      { q: 'If p = 0.6, what is the frequency of homozygous dominant individuals?', a: '0.36', type: 'application', choices: ['0.36', '0.6', '0.16', '0.48'] },
      { q: 'H-W equilibrium serves as what in population genetics?', a: 'a null hypothesis to test whether evolution is occurring', type: 'recall', choices: ['a null hypothesis to test whether evolution is occurring', 'proof that evolution happened', 'a measure of fitness', 'a way to count alleles'] },
    ],
  },
  'evidence-for-evolution': {
    questions: [
      { q: 'Homologous structures suggest what?', a: 'common ancestry (divergent evolution)', type: 'recall', choices: ['common ancestry (divergent evolution)', 'convergent evolution', 'no relationship', 'identical function'] },
      { q: 'Vestigial structures are evidence of evolution because they what?', a: 'are remnants of structures that were functional in ancestors', type: 'recall', choices: ['are remnants of structures that were functional in ancestors', 'have new functions', 'are always harmful', 'appear in all species'] },
      { q: 'Biogeography supports evolution by showing what?', a: 'species distribution patterns correlate with geographic and evolutionary history', type: 'recall', choices: ['species distribution patterns correlate with geographic and evolutionary history', 'all species live everywhere', 'species never migrate', 'continents never moved'] },
      { q: 'Fossil record provides evidence for evolution by showing what?', a: 'transitional forms and change over geological time', type: 'recall', choices: ['transitional forms and change over geological time', 'species never change', 'all species appeared at once', 'no extinctions'] },
      { q: 'Molecular evidence (DNA/protein comparison) supports common ancestry how?', a: 'closely related species share more similar sequences', type: 'recall', choices: ['closely related species share more similar sequences', 'all species have identical DNA', 'unrelated species share more DNA', 'DNA cannot be compared'] },
      { q: 'Embryological similarities across vertebrates suggest what?', a: 'shared developmental genes from a common ancestor', type: 'recall', choices: ['shared developmental genes from a common ancestor', 'identical adult forms', 'no evolutionary relationship', 'convergent evolution'] },
    ],
  },
  'common-ancestry': {
    questions: [
      { q: 'Universal genetic code across life suggests what?', a: 'all life shares a common ancestor', type: 'recall', choices: ['all life shares a common ancestor', 'each species has unique DNA', 'genetic code evolves randomly', 'DNA is not inherited'] },
      { q: 'Conserved genes (like Hox genes) across phyla demonstrate what?', a: 'deep evolutionary relationships and common ancestry', type: 'recall', choices: ['deep evolutionary relationships and common ancestry', 'convergent evolution', 'no relationship', 'random chance'] },
      { q: 'Endosymbiotic theory explains the origin of what?', a: 'mitochondria and chloroplasts from engulfed prokaryotes', type: 'recall', choices: ['mitochondria and chloroplasts from engulfed prokaryotes', 'the nucleus', 'ribosomes', 'cell walls'] },
      { q: 'The molecular clock uses what to estimate divergence times?', a: 'mutation rate in DNA or protein sequences', type: 'recall', choices: ['mutation rate in DNA or protein sequences', 'fossil age only', 'body size changes', 'geographic distance'] },
      { q: 'LUCA stands for what?', a: 'Last Universal Common Ancestor', type: 'recall', choices: ['Last Universal Common Ancestor', 'Latest Uniform Cellular Arrangement', 'Living Universal Cell Assembly', 'Last Unique Cellular Ancestor'] },
      { q: 'Horizontal gene transfer complicates phylogenetics because it what?', a: 'transfers genes between unrelated species', type: 'recall', choices: ['transfers genes between unrelated species', 'only occurs in eukaryotes', 'never happens', 'simplifies the tree'] },
    ],
  },
  'community-ecology': {
    questions: [
      { q: 'Mutualism is a symbiotic relationship where what happens?', a: 'both species benefit', type: 'recall', choices: ['both species benefit', 'one benefits, one is harmed', 'one benefits, the other is unaffected', 'both are harmed'] },
      { q: 'What is the competitive exclusion principle?', a: 'two species competing for the same niche cannot coexist indefinitely', type: 'recall', choices: ['two species competing for the same niche cannot coexist indefinitely', 'competition always leads to extinction', 'species never compete', 'all niches are shared'] },
      { q: 'Primary succession occurs on what type of surface?', a: 'bare substrate with no prior soil (e.g., new volcanic rock)', type: 'recall', choices: ['bare substrate with no prior soil (e.g., new volcanic rock)', 'disturbed land with soil', 'underwater only', 'in forests only'] },
      { q: 'What is a trophic cascade?', a: 'indirect effects of predators rippling through multiple trophic levels', type: 'recall', choices: ['indirect effects of predators rippling through multiple trophic levels', 'a waterfall of energy', 'predator extinction', 'plant growth only'] },
      { q: 'Resource partitioning allows competing species to coexist by doing what?', a: 'dividing the niche to reduce competition', type: 'recall', choices: ['dividing the niche to reduce competition', 'eliminating one species', 'increasing competition', 'sharing all resources equally'] },
      { q: 'Secondary succession differs from primary in what way?', a: 'it begins with existing soil after a disturbance', type: 'recall', choices: ['it begins with existing soil after a disturbance', 'it starts on bare rock', 'it takes longer', 'it has no pioneer species'] },
    ],
  },
  'ecosystem-disruptions': {
    questions: [
      { q: 'Eutrophication is caused by what?', a: 'excess nutrient runoff leading to algal blooms and oxygen depletion', type: 'recall', choices: ['excess nutrient runoff leading to algal blooms and oxygen depletion', 'drought', 'volcanic eruption', 'cooling temperatures'] },
      { q: 'Bioaccumulation refers to what?', a: 'buildup of toxins in an organism over its lifetime', type: 'recall', choices: ['buildup of toxins in an organism over its lifetime', 'increasing toxin concentration up the food chain', 'removal of toxins', 'natural detoxification'] },
      { q: 'Biomagnification differs from bioaccumulation how?', a: 'toxin concentration increases at each higher trophic level', type: 'recall', choices: ['toxin concentration increases at each higher trophic level', 'toxins decrease up the chain', 'they are the same', 'it only affects plants'] },
      { q: 'Ocean acidification is caused by what?', a: 'increased CO2 dissolving in seawater', type: 'recall', choices: ['increased CO2 dissolving in seawater', 'volcanic acid', 'acid rain only', 'oil spills'] },
      { q: 'Habitat fragmentation affects biodiversity by doing what?', a: 'isolating populations and reducing gene flow', type: 'recall', choices: ['isolating populations and reducing gene flow', 'increasing gene flow', 'creating new habitats', 'having no effect'] },
      { q: 'The sixth mass extinction is primarily driven by what?', a: 'human activities', type: 'recall', choices: ['human activities', 'asteroid impact', 'volcanic eruption', 'natural climate cycles'] },
    ],
  },
  'nervous-endocrine-integration': {
    questions: [
      { q: 'The nervous system communicates via what?', a: 'electrical impulses and neurotransmitters', type: 'recall', choices: ['electrical impulses and neurotransmitters', 'hormones only', 'sound waves', 'chemical diffusion only'] },
      { q: 'The endocrine system differs from the nervous system primarily in what?', a: 'speed (slower) and duration (longer-lasting) of responses', type: 'recall', choices: ['speed (slower) and duration (longer-lasting) of responses', 'it uses electrical signals', 'it is faster', 'it affects fewer organs'] },
      { q: 'The hypothalamus links the nervous and endocrine systems how?', a: 'it receives neural input and controls the pituitary gland', type: 'recall', choices: ['it receives neural input and controls the pituitary gland', 'it produces all hormones', 'it is part of the spinal cord', 'it only controls temperature'] },
      { q: 'Fight-or-flight response involves what gland?', a: 'adrenal glands (medulla releasing epinephrine)', type: 'recall', choices: ['adrenal glands (medulla releasing epinephrine)', 'thyroid', 'pancreas', 'pituitary'] },
      { q: 'Neurotransmitters and hormones differ in range because what?', a: 'neurotransmitters act locally at synapses; hormones travel through blood', type: 'recall', choices: ['neurotransmitters act locally at synapses; hormones travel through blood', 'they are the same', 'hormones only act locally', 'neurotransmitters travel through blood'] },
      { q: 'Feedback between the hypothalamus, pituitary, and target gland is called what?', a: 'hypothalamic-pituitary axis', type: 'recall', choices: ['hypothalamic-pituitary axis', 'reflex arc', 'autonomic pathway', 'somatic pathway'] },
    ],
  },
  'crispr-applications': {
    questions: [
      { q: 'CRISPR-Cas9 uses what to find its target DNA?', a: 'a guide RNA complementary to the target sequence', type: 'recall', choices: ['a guide RNA complementary to the target sequence', 'a restriction enzyme', 'a primer', 'a fluorescent dye'] },
      { q: 'Gene drive technology using CRISPR could do what?', a: 'spread a gene through a wild population rapidly', type: 'recall', choices: ['spread a gene through a wild population rapidly', 'slow evolution', 'prevent all mutations', 'only work in labs'] },
      { q: 'The Cas9 protein functions as what?', a: 'molecular scissors that cut both DNA strands', type: 'recall', choices: ['molecular scissors that cut both DNA strands', 'a DNA polymerase', 'a ligase', 'an RNA polymerase'] },
      { q: 'Off-target effects in CRISPR are a concern because what?', a: 'Cas9 may cut unintended genomic locations', type: 'recall', choices: ['Cas9 may cut unintended genomic locations', 'CRISPR is too slow', 'guide RNA is always perfect', 'there are no concerns'] },
      { q: 'Germline editing differs from somatic editing how?', a: 'germline changes are heritable; somatic changes are not', type: 'recall', choices: ['germline changes are heritable; somatic changes are not', 'they are the same', 'somatic changes are heritable', 'germline editing is easier'] },
      { q: 'CRISPR has been used to create disease-resistant crops by doing what?', a: 'knocking out genes that make plants susceptible to pathogens', type: 'recall', choices: ['knocking out genes that make plants susceptible to pathogens', 'adding animal genes', 'removing all plant DNA', 'inserting pesticide genes'] },
    ],
  },
  'molecular-systematics': {
    questions: [
      { q: 'Molecular systematics classifies organisms based on what?', a: 'DNA, RNA, or protein sequence comparisons', type: 'recall', choices: ['DNA, RNA, or protein sequence comparisons', 'physical appearance only', 'behavior only', 'geographic location'] },
      { q: 'The molecular clock hypothesis assumes what?', a: 'mutations accumulate at a roughly constant rate over time', type: 'recall', choices: ['mutations accumulate at a roughly constant rate over time', 'evolution stops after speciation', 'all genes mutate at the same rate', 'only coding DNA mutates'] },
      { q: 'Ribosomal RNA (rRNA) is commonly used in molecular systematics because what?', a: 'it is highly conserved and present in all living organisms', type: 'recall', choices: ['it is highly conserved and present in all living organisms', 'it mutates very fast', 'it is unique to eukaryotes', 'it is easy to see'] },
      { q: 'Maximum likelihood in phylogenetics does what?', a: 'finds the tree most likely to produce the observed data', type: 'recall', choices: ['finds the tree most likely to produce the observed data', 'uses the fewest changes', 'groups by appearance', 'ignores DNA data'] },
      { q: 'Horizontal gene transfer is most common in what group?', a: 'prokaryotes', type: 'recall', choices: ['prokaryotes', 'mammals', 'plants', 'fungi'] },
      { q: 'Comparing cytochrome c sequences across species helps determine what?', a: 'evolutionary relatedness based on protein conservation', type: 'recall', choices: ['evolutionary relatedness based on protein conservation', 'metabolic rate', 'body size', 'lifespan'] },
    ],
  },
};

const SCENARIOS = {
  'standard': [
    { title: 'The Mystery Illness', focus: 'cell biology, immune response', text: 'A patient presents with fatigue, frequent infections, and enlarged lymph nodes. Blood work shows abnormally low white blood cell counts. The remaining WBCs show swollen, dysfunctional mitochondria under electron microscopy. Consider how cellular energy production affects immune function and what organelles might be compromised.' },
    { title: 'Island Finches', focus: 'evolution, genetics', text: 'Researchers discover finches on an isolated island with beak sizes ranging from very small to very large, but few medium-sized beaks. The island has two main food sources: tiny seeds and large hard-shelled nuts. Analyze what type of selection is occurring and predict how allele frequencies might change over generations.' },
    { title: 'Lake Ecosystem Collapse', focus: 'ecology, biogeochemical cycles', text: 'A lake near agricultural land experiences rapid algal bloom. Fish begin dying, the water turns green, and dissolved oxygen drops to near zero in deeper waters. Trace the sequence of ecological events from nutrient runoff through eutrophication.' },
    { title: 'The CRISPR Dilemma', focus: 'biotechnology, ethics', text: 'A biotech company proposes using CRISPR-Cas9 to edit human embryos to eliminate a gene linked to a fatal hereditary disease. The treatment would be heritable. Analyze the molecular mechanism and the ethical considerations of germline editing.' },
    { title: 'Pandemic Response', focus: 'molecular biology, immune response', text: 'A new RNA virus emerges with a high mutation rate. Scientists must develop a vaccine quickly. Explain how mRNA vaccines work at the molecular level, how the immune system responds, and why viral mutation rate matters for vaccine design.' },
  ],
  'ap': [
    { title: 'Signal Transduction Cascade', focus: 'cell signaling, gene regulation', text: 'A growth factor binds to a receptor tyrosine kinase. Trace the entire signal transduction pathway from receptor activation through Ras, the MAP kinase cascade, and ultimately to changes in gene expression. Explain how mutations in any component could lead to uncontrolled cell division.' },
    { title: 'Hardy-Weinberg Analysis', focus: 'population genetics', text: 'In a population of 1000 butterflies, 160 have white wings (recessive, bb). The rest are blue-winged (B_). Calculate allele and genotype frequencies. Determine if the population is in H-W equilibrium given that 200 are Bb and 640 are BB.' },
    { title: 'Photosynthesis Under Stress', focus: 'photosynthesis, ecology', text: 'A C3, C4, and CAM plant are grown under increasing temperature and decreasing water. Predict how each plant\'s photosynthetic rate will change, referencing RuBisCO, PEP carboxylase, and stomatal behavior.' },
  ],
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
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}` };
  const items = pick(bank.questions, count).map(q => ({
    prompt: q.q, answer: q.a, type: q.type,
    choices: q.choices ? shuffle(q.choices) : undefined,
  }));
  return { type: 'multiple-choice', skill, level, count: items.length, instruction: 'Choose the best answer for each question.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class Biology {
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
    const level = p.level || 'standard';
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
    const level = p.level || 'standard';
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

  getScenario(level) {
    const texts = SCENARIOS[level];
    if (!texts) return { error: `No scenarios for ${level}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(texts, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const level = p.level || 'standard';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    const scenario = SCENARIOS[level] ? pick(SCENARIOS[level], 1)[0] : null;
    return {
      studentId: id, level, targetSkill: target, exercise, scenario,
      lessonPlan: {
        review: 'Review previously learned concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Analyze scenario: "${scenario.title}"` : 'Apply concepts to a real-world example',
        extend: `Connect ${target.skill} to related biology concepts`,
      },
    };
  }
}

module.exports = Biology;

// CLI: node biology.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new Biology();
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
        const level = loadProfile(id).level || 'standard';
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
      case 'scenario': { const [, l] = args; if (!l) throw new Error('Usage: scenario <level>'); out(api.getScenario(l)); break; }
      default: out({ usage: 'node biology.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level','scenario'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
