// eClaw HS ELA Informational Text & Rhetoric Tutor (9-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-ela-informational');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-9': {
    'cite-evidence': ['textual-support', 'inference-evidence'],
    'central-idea-summary': ['identify-central-idea', 'objective-summary'],
    'analyze-development': ['idea-development', 'connection-between-ideas'],
    'word-meaning-rhetoric': ['context-clues', 'rhetorical-word-choice'],
    'text-structure-purpose': ['organizational-patterns', 'author-purpose'],
    'author-pov-rhetoric': ['point-of-view', 'rhetorical-appeals-intro'],
    'argument-evaluation': ['claim-identification', 'evidence-relevance'],
    'compare-accounts': ['compare-genres', 'compare-perspectives'],
  },
  'grade-10': {
    'cite-strong-evidence': ['strong-vs-weak-evidence', 'implicit-meaning'],
    'central-idea-analysis': ['central-idea-development', 'analytical-summary'],
    'analyze-complex-ideas': ['idea-interaction', 'sequential-causal-analysis'],
    'cumulative-word-impact': ['cumulative-meaning', 'tone-and-diction'],
    'structural-analysis': ['section-role', 'structural-choices'],
    'rhetorical-purpose': ['ethos-logos-pathos', 'rhetorical-strategy-effect'],
    'evaluate-reasoning-evidence': ['logical-reasoning', 'evidence-sufficiency'],
    'compare-seminal-documents': ['compare-founding-docs', 'themes-across-texts'],
  },
  'grade-11': {
    'cite-thorough-evidence': ['thorough-textual-analysis', 'ambiguity-in-text'],
    'two-central-ideas': ['dual-central-ideas', 'idea-interaction-build'],
    'complex-analysis': ['complex-sequence', 'rhetorical-development'],
    'technical-connotative-figurative': ['technical-language', 'figurative-in-nonfiction'],
    'author-structure-choices': ['structural-purpose', 'manipulation-of-time'],
    'assess-reasoning-rhetoric': ['soapstone-analysis', 'rhetorical-effectiveness'],
    'evaluate-premises-logic': ['premise-identification', 'fallacy-detection'],
    'synthesize-multiple-sources': ['source-synthesis', 'conflicting-sources'],
  },
  'grade-12': {
    'demonstrate-knowledge': ['independent-textual-evidence', 'evidence-across-texts'],
    'develop-complex-analysis': ['extended-analysis', 'thematic-complexity'],
    'nuanced-analysis': ['nuanced-idea-development', 'paradox-and-tension'],
    'ambiguity-language': ['deliberate-ambiguity', 'connotation-layers'],
    'innovative-structures': ['unconventional-structure', 'genre-bending'],
    'evaluate-effectiveness': ['rhetorical-effectiveness-adv', 'audience-impact'],
    'constitutional-rhetoric': ['founding-document-rhetoric', 'constitutional-interpretation'],
    'integration-diverse-sources': ['diverse-source-integration', 'media-source-evaluation'],
  },
};

// ── Passage Bank ──

const PASSAGES = {
  'grade-9': {
    'textual-support': {
      passage: 'In 1962, Rachel Carson published "Silent Spring," documenting how pesticides devastated wildlife populations. Chemical companies attacked her credibility, calling her an alarmist. Yet her meticulous research — citing over 50 scientific studies — proved that DDT accumulated in food chains, thinning bird eggshells to the point of collapse. Within a decade, the EPA banned DDT.',
      source: 'Adapted from environmental history',
    },
    'inference-evidence': {
      passage: 'Frederick Douglass wrote, "Once you learn to read, you will be forever free." He had taught himself to read as an enslaved child by trading bread to white boys for reading lessons. His enslavers had forbidden literacy precisely because they understood its power. Douglass later became the most photographed American of the nineteenth century — he believed photographs could counter racist caricatures.',
      source: 'Adapted from Douglass biography',
    },
    'identify-central-idea': {
      passage: 'The Great Pacific Garbage Patch is not, as many imagine, a solid island of trash. It is a diffuse soup of microplastics — fragments smaller than a grain of rice — suspended throughout the water column. This makes cleanup exponentially harder than scooping debris from the surface. Marine organisms ingest these particles, introducing plastics into the food chain that ultimately reaches human dinner plates.',
      source: 'Adapted from oceanography report',
    },
    'objective-summary': {
      passage: 'Public libraries began as subscription services for wealthy patrons. Andrew Carnegie changed this by funding 1,689 free public libraries between 1883 and 1929. His philosophy was simple: provide the tools for self-education, and motivated individuals will improve their circumstances. Critics noted the irony — Carnegie\'s fortune came from steel mills where workers labored twelve-hour days with no time to read.',
      source: 'Adapted from library history',
    },
    'idea-development': {
      passage: 'When Jonas Salk developed the polio vaccine in 1955, he refused to patent it. "Could you patent the sun?" he asked. The vaccine was distributed freely, and polio cases in the US dropped from 58,000 to 5,600 within two years. Today, pharmaceutical companies routinely patent life-saving drugs, pricing them beyond the reach of millions. Salk\'s decision cost him an estimated $7 billion in personal wealth.',
      source: 'Adapted from medical history',
    },
    'connection-between-ideas': {
      passage: 'The invention of the printing press in 1440 democratized knowledge. Before Gutenberg, a single book cost roughly the same as a house. Afterward, books became affordable, literacy rates climbed, and the Protestant Reformation spread through printed pamphlets. Five centuries later, the internet repeated this pattern — dramatically lowering the cost of distributing information while also enabling misinformation to spread unchecked.',
      source: 'Adapted from technology history',
    },
    'context-clues': {
      passage: 'The senator\'s speech was deliberately tendentious — every statistic was cherry-picked to support her position, every anecdote chosen to provoke outrage rather than understanding. Her opponents called the rhetoric demagogic, designed to inflame rather than inform. Supporters, however, praised her as forthright, willing to say what others would not.',
      source: 'Adapted from political commentary',
    },
    'rhetorical-word-choice': {
      passage: 'The journalist described the protesters as a "mob." The editorial page called them "demonstrators." The protesters\' own website used "freedom fighters." Each word carried different weight: "mob" implied chaos and danger, "demonstrators" suggested organized dissent, and "freedom fighters" evoked heroism. The event was identical; the language shaped entirely different narratives.',
      source: 'Adapted from media analysis',
    },
    'organizational-patterns': {
      passage: 'Food deserts — neighborhoods without access to affordable fresh food — affect 23.5 million Americans. The causes are economic: grocery chains avoid low-income areas due to thin profit margins. The effects cascade: residents rely on convenience stores selling processed food, childhood obesity rates double, and diabetes hospitalizations cost taxpayers $2.4 billion annually. Solutions exist but require political will: mobile markets, urban farms, and tax incentives for grocers.',
      source: 'Adapted from public health report',
    },
    'author-purpose': {
      passage: 'You scroll past it every day — another headline about species going extinct. A frog in Panama. A bird in Hawaii. You feel a flicker of sadness, then keep scrolling. But here is what that headline does not tell you: each extinction unravels connections in an ecosystem, like pulling threads from a sweater. Lose enough threads, and the whole thing falls apart. That sweater keeps you warm. That ecosystem keeps you alive.',
      source: 'Adapted from conservation essay',
    },
    'point-of-view': {
      passage: 'The school board president explained that budget cuts were "difficult but necessary sacrifices." Teachers called them "devastating." Parents at the meeting described feeling "abandoned." The students, who would lose their art and music programs, said nothing — no one had invited them to speak. The local newspaper noted this omission in a single sentence buried on page six.',
      source: 'Adapted from local news report',
    },
    'rhetorical-appeals-intro': {
      passage: 'As a pediatrician with twenty years of experience (ethos), I have seen firsthand how childhood hunger affects brain development (pathos). The data confirms what I observe daily: children who eat breakfast score 17% higher on standardized tests (logos). We have the resources to feed every child in this district. The question is whether we have the will to act before another school year begins (kairos).',
      source: 'Adapted from public hearing testimony',
    },
    'claim-identification': {
      passage: 'Proponents of year-round schooling argue that the traditional summer break causes "summer slide" — students lose up to two months of math skills. They cite a Johns Hopkins study tracking 790 students over five years. Opponents counter that year-round schools show no significant improvement on standardized tests and that the real issue is inequity: summer slide disproportionately affects low-income students who lack access to enrichment programs.',
      source: 'Adapted from education policy analysis',
    },
    'evidence-relevance': {
      passage: 'The city council argued for building a new stadium by citing a projected 3,000 new jobs. However, independent economists noted that stadium construction typically creates temporary positions, not permanent employment. The council also claimed increased tourism revenue, yet studies of 37 other cities showed stadiums rarely generate net economic growth — they redistribute existing spending rather than creating new activity.',
      source: 'Adapted from urban planning report',
    },
    'compare-genres': {
      passage: 'The encyclopedia entry states: "The Dust Bowl was a period of severe dust storms affecting the American prairies in the 1930s, caused by drought and decades of extensive farming." Woody Guthrie, who lived through it, wrote: "On the fourteenth day of April of nineteen thirty-five, there struck the worst of dust storms that ever filled the sky." The encyclopedia informs; Guthrie makes you feel the dirt in your lungs.',
      source: 'Adapted from comparative texts',
    },
    'compare-perspectives': {
      passage: 'Thomas Edison called Nikola Tesla\'s alternating current "dangerous" and publicly electrocuted animals to prove his point. Tesla responded with a demonstration at the 1893 World\'s Fair, safely passing AC current through his own body to light bulbs. Edison was protecting his direct-current business empire. Tesla was advancing the technology that now powers every home. History sided with Tesla; the textbooks still credit Edison.',
      source: 'Adapted from science history',
    },
  },
  'grade-10': {
    'strong-vs-weak-evidence': {
      passage: 'In her analysis of wage inequality, the economist distinguished between correlation and causation. "Women earn 82 cents for every dollar men earn" is a descriptive statistic. It does not, by itself, prove discrimination. When researchers controlled for occupation, hours worked, and experience, the gap narrowed to 8%. That remaining 8%, however, could not be explained by any factor other than gender — making it the strongest evidence of systemic bias.',
      source: 'Adapted from economic analysis',
    },
    'implicit-meaning': {
      passage: 'The diplomat\'s letter was a masterpiece of understatement. "We note with interest your government\'s recent military exercises near our border," she wrote. "We trust these are routine." In diplomatic language, "note with interest" means "we are alarmed." "We trust" means "we do not trust at all." The letter\'s final line — "We remain committed to peaceful dialogue" — was, in context, a veiled threat.',
      source: 'Adapted from diplomatic history',
    },
    'central-idea-development': {
      passage: 'The myth of the "self-made" individual ignores infrastructure. The entrepreneur who "built it alone" drove on public roads to a publicly educated workforce, using internet protocols developed by government-funded research, protected by publicly funded police and fire services. Individual effort matters enormously — but it operates within systems that collective investment created. Denying this is like a fish denying the existence of water.',
      source: 'Adapted from economic commentary',
    },
    'analytical-summary': {
      passage: 'Between 1971 and 2011, the percentage of Americans in the middle class fell from 61% to 51%. Meanwhile, upper-income households grew from 14% to 20%. Optimists see upward mobility; pessimists see a hollowing out. The data supports both readings. What is undeniable is that middle-income jobs — manufacturing, clerical work, mid-level management — are disappearing, replaced by both high-skill and low-wage positions. The ladder remains; it is the middle rungs that are vanishing.',
      source: 'Adapted from Pew Research summary',
    },
    'idea-interaction': {
      passage: 'The Green Revolution of the 1960s dramatically increased global food production through high-yield crop varieties, irrigation, and chemical fertilizers. It prevented the mass famines that experts had predicted. Yet it also created dependency on petroleum-based inputs, depleted aquifers, and reduced crop genetic diversity. The revolution that saved a billion lives may have set the stage for a larger crisis — a paradox that defines modern agriculture.',
      source: 'Adapted from agricultural history',
    },
    'sequential-causal-analysis': {
      passage: 'The sequence was predictable. First, social media algorithms prioritized engagement — content that provoked outrage kept users scrolling longer. Then, political operatives learned to exploit this: inflammatory posts spread six times faster than factual ones. Next, mainstream media began covering viral social media posts as "news." Finally, citizens reported that they could no longer distinguish reliable information from propaganda. Each step caused the next.',
      source: 'Adapted from media studies',
    },
    'cumulative-meaning': {
      passage: 'Martin Luther King Jr. did not say "I have a plan." He said "I have a dream." He did not list policy proposals; he painted visions. "Dream" carries the weight of aspiration, imagination, and biblical prophecy. King understood that movements are built on hope, not white papers. The word "dream" did what a thousand position papers could not — it made justice feel not just necessary, but beautiful.',
      source: 'Adapted from rhetorical analysis',
    },
    'tone-and-diction': {
      passage: 'The company\'s press release described the oil spill as an "incident" involving the "release" of "product" into a "waterway." Environmental scientists described it as a "catastrophe" involving the "dumping" of "toxic crude" into a "river ecosystem." The first account used corporate euphemism to minimize; the second used precise scientific language to clarify. Both described the same 500,000-gallon spill.',
      source: 'Adapted from media literacy text',
    },
    'section-role': {
      passage: 'The report opened with a single statistic: 40% of food produced in America is never eaten. This hook preceded three sections. The first traced food waste from farm to fork. The second quantified the environmental cost: wasted food generates 8% of global greenhouse emissions. The third proposed solutions, from "ugly produce" markets to composting mandates. The structure moved deliberately from shock to understanding to action.',
      source: 'Adapted from policy report',
    },
    'structural-choices': {
      passage: 'Ta-Nehisi Coates structured "Between the World and Me" as a letter to his teenage son. This choice was strategic. The letter form created intimacy — readers felt they were overhearing a private conversation about race in America. It also established urgency: a father preparing his Black son for dangers that are not theoretical. The personal frame made the political argument undeniable in a way that an essay or op-ed could not.',
      source: 'Adapted from literary criticism',
    },
    'ethos-logos-pathos': {
      passage: 'Severn Cullis-Suzuki was twelve years old when she addressed the 1992 UN Earth Summit. "I am fighting for my future," she said (pathos). She cited species extinction rates and ozone depletion data (logos). Then she delivered the line that silenced the room: "If you don\'t know how to fix it, please stop breaking it" (ethos — the moral authority of a child holding adults accountable). Delegates gave her a standing ovation. Then they returned to negotiations and changed almost nothing.',
      source: 'Adapted from environmental history',
    },
    'rhetorical-strategy-effect': {
      passage: 'Jonathan Swift\'s "A Modest Proposal" suggested that Irish families sell their children as food to wealthy English landlords. The satire worked because Swift maintained a perfectly rational tone throughout — he calculated the economic benefits, discussed seasoning, and proposed recipes. By applying cold logic to a monstrous idea, Swift forced readers to confront the cold logic already being applied to Irish poverty. The absurdity was the point.',
      source: 'Adapted from rhetorical analysis',
    },
    'logical-reasoning': {
      passage: 'The argument proceeded deductively: All democratic governments derive authority from the consent of the governed. The British Parliament governed the colonies without their consent. Therefore, British rule over the colonies was illegitimate. Jefferson\'s logic in the Declaration was airtight — if you accepted the premise. The entire revolutionary argument rested on one Enlightenment assumption: that legitimate government requires consent. King George would have rejected that premise entirely.',
      source: 'Adapted from political philosophy',
    },
    'evidence-sufficiency': {
      passage: 'The school district cited a single pilot program to justify its $2 million technology initiative. In one school, test scores rose 12% after laptops were distributed. However, the pilot involved only 87 students, lasted one semester, and the school simultaneously hired two additional tutors. Without controlling for the tutoring variable, the laptop effect was impossible to isolate. The evidence was real but insufficient to justify district-wide spending.',
      source: 'Adapted from education policy',
    },
    'compare-founding-docs': {
      passage: 'The Declaration of Independence (1776) asserts that rights are "self-evident" and "unalienable" — given by the Creator, not by government. The Constitution (1787), by contrast, makes no mention of God and derives authority from "We the People." The Declaration is a philosophical document arguing why revolution is justified; the Constitution is a practical document establishing how government should function. Together they create a tension: between ideals and mechanisms, aspiration and compromise.',
      source: 'Adapted from constitutional analysis',
    },
    'themes-across-texts': {
      passage: 'Thoreau went to Walden Pond in 1845 to "live deliberately." A century later, Rachel Carson warned in "Silent Spring" that humanity was poisoning the natural world it depended on. In 2014, Naomi Klein argued in "This Changes Everything" that capitalism itself was incompatible with a livable climate. The theme connecting these texts across 170 years is consistent: the tension between economic progress and ecological survival. Each generation states it more urgently.',
      source: 'Adapted from environmental literature survey',
    },
  },
  'grade-11': {
    'thorough-textual-analysis': {
      passage: 'King opens "Letter from Birmingham Jail" by addressing his audience as "My Dear Fellow Clergymen" — a strategic choice that simultaneously asserts equality (fellow) and shared religious obligation (clergymen). He does not begin with his grievances but with their letter, methodically restating their objections before dismantling them. This structure mirrors the Socratic method and legal argumentation: acknowledge, then refute. The ethos is built through restraint.',
      source: 'Adapted from King analysis',
    },
    'ambiguity-in-text': {
      passage: 'Lincoln\'s Gettysburg Address famously begins with "our fathers" who "brought forth on this continent, a new nation, conceived in Liberty." The ambiguity is deliberate: which "fathers"? Only the signers of the Declaration? The framers of the Constitution? And "conceived in Liberty" — did that liberty include enslaved people? Lincoln does not resolve these questions. Instead, the ambiguity allows every listener to project their own meaning, uniting a fractured audience around words elastic enough to hold contradiction.',
      source: 'Adapted from Lincoln scholarship',
    },
    'dual-central-ideas': {
      passage: 'Booker T. Washington\'s "Atlanta Compromise" speech (1895) advanced two ideas simultaneously: African Americans should pursue economic self-sufficiency through vocational education, and white southerners should support Black economic progress because it served their own interests. "Cast down your bucket where you are," he told both races. The speech was pragmatic genius — or capitulation to white supremacy — depending on whether you prioritize the first idea or notice what the second concedes.',
      source: 'Adapted from Reconstruction history',
    },
    'idea-interaction-build': {
      passage: 'In "Ain\'t I a Woman?" Sojourner Truth builds her argument through accumulation. Each rhetorical question adds evidence: she has plowed, planted, gathered, borne thirteen children, and watched most sold into slavery. The ideas interact like layers of a legal brief — each example strengthens the previous one. By the time she asks "and ain\'t I a woman?" for the final time, the question is no longer a question. It is an indictment.',
      source: 'Adapted from rhetorical analysis',
    },
    'complex-sequence': {
      passage: 'The civil rights movement did not follow a simple chronological arc. The Montgomery Bus Boycott (1955) preceded the sit-ins (1960), which preceded the Freedom Rides (1961), which preceded Birmingham (1963). But within this sequence, earlier actions created the conditions for later ones: Montgomery proved that economic pressure worked; sit-ins proved that young people could sustain nonviolent discipline; Freedom Rides proved that federal intervention could be forced. Each event was both consequence and cause.',
      source: 'Adapted from civil rights history',
    },
    'rhetorical-development': {
      passage: 'Elizabeth Cady Stanton modeled the Seneca Falls Declaration (1848) directly on the Declaration of Independence. This was not laziness — it was rhetorical strategy. By substituting "all men and women" for "all men" and listing grievances against patriarchy in the same format as grievances against King George, Stanton forced her audience to confront an uncomfortable parallel: if denying colonists representation was tyranny, then denying women representation was also tyranny.',
      source: 'Adapted from feminist history',
    },
    'technical-language': {
      passage: 'The Supreme Court opinion distinguished between "strict scrutiny" and "rational basis review." Under strict scrutiny, the government must prove a "compelling interest" and use the "least restrictive means." Under rational basis, the law merely needs a "legitimate purpose." These are not just legal terms — they determine outcomes. Strict scrutiny almost always strikes down laws; rational basis almost always upholds them. The choice of standard is often the choice of result.',
      source: 'Adapted from constitutional law',
    },
    'figurative-in-nonfiction': {
      passage: 'King wrote that injustice anywhere is a "threat to justice everywhere," likening society to "an inescapable network of mutuality" and "a single garment of destiny." These metaphors do rhetorical work that abstract argument cannot. "Network" implies interconnection; "garment" implies that tearing one part damages the whole. The figurative language makes a philosophical claim feel like a physical reality — you can almost feel the fabric ripping.',
      source: 'Adapted from King analysis',
    },
    'structural-purpose': {
      passage: 'Thoreau\'s "Civil Disobedience" begins not with his night in jail but with a philosophical premise: "That government is best which governs least." He establishes principle before anecdote, theory before experience. Only after building his philosophical framework does he describe his arrest for refusing to pay a tax supporting slavery. The structure ensures readers evaluate his action through his philosophy — not the other way around.',
      source: 'Adapted from Thoreau analysis',
    },
    'manipulation-of-time': {
      passage: 'In "Hiroshima," John Hersey follows six survivors through the atomic bombing. He begins the morning of August 6, 1945, then traces each person\'s experience second by second. The slow, granular narration forces readers to inhabit the moment rather than process it as a historical abstraction. When Hersey notes that a clock stopped at 8:15 a.m., he has already made readers feel every second leading to that instant. The manipulation of time creates empathy.',
      source: 'Adapted from journalism analysis',
    },
    'soapstone-analysis': {
      passage: 'Speaker: Kennedy, newly inaugurated president, 43 years old. Occasion: Inauguration, January 1961, height of Cold War. Audience: American citizens, but also the Soviet Union and the developing world. Purpose: Unite a divided nation, assert global leadership, challenge citizens to serve. Subject: American responsibility in the Cold War era. Tone: Urgent, idealistic, demanding. "Ask not what your country can do for you — ask what you can do for you country" inverts expectations, placing obligation on citizens rather than government.',
      source: 'Adapted from SOAPSTone analysis',
    },
    'rhetorical-effectiveness': {
      passage: 'Churchill\'s "We shall fight on the beaches" speech succeeded because of what it did not say. He never promised victory. He never minimized the catastrophe at Dunkirk. Instead, he listed the places Britain would fight — "on the beaches... on the landing grounds... in the fields and in the streets" — making defeat sound not like a possibility but like an invitation to resistance. The speech transformed a military disaster into a statement of defiance.',
      source: 'Adapted from wartime rhetoric analysis',
    },
    'premise-identification': {
      passage: 'The argument for universal basic income rests on several premises: (1) automation will eliminate millions of jobs permanently; (2) retraining programs are insufficient to address this scale of displacement; (3) human dignity requires economic security; (4) the economy benefits when consumers have money to spend. Opponents challenge premise 1 (new jobs will emerge), premise 2 (retraining can work), and add a competing premise: that income without work erodes motivation and purpose.',
      source: 'Adapted from policy debate',
    },
    'fallacy-detection': {
      passage: 'The senator argued: "My opponent wants to reduce military spending. Apparently, he does not care if our soldiers die." This is an ad hominem attack combined with a straw man: it attacks the opponent\'s character (doesn\'t care about soldiers) and misrepresents the position (reducing spending ≠ wanting soldiers to die). The senator then added: "Every great nation has maintained a strong military," committing an appeal to tradition that ignores how modern threats differ from historical ones.',
      source: 'Adapted from political rhetoric analysis',
    },
    'source-synthesis': {
      passage: 'Source A (CDC report): "Adolescent sleep deprivation is a public health epidemic; 73% of high schoolers get less than 8 hours." Source B (school board): "Later start times would cost $12 million in transportation restructuring." Source C (pediatrician testimony): "Sleep-deprived teens show impairment equivalent to a blood-alcohol level of 0.05%." A synthesis must weigh health data against fiscal constraints while acknowledging that Source C uses an analogy, not a literal equivalence.',
      source: 'Adapted from synthesis exercise',
    },
    'conflicting-sources': {
      passage: 'Source 1 (industry-funded study): "Moderate social media use (1-2 hours daily) correlates with improved social connectedness among teens." Source 2 (independent longitudinal study): "Each additional hour of social media use correlates with a 13% increase in depressive symptoms among adolescents." The conflict may be partly methodological — "moderate" vs. "each additional hour" measure differently — and partly due to funding bias. Neither source is automatically wrong; both require scrutiny.',
      source: 'Adapted from research literacy',
    },
  },
  'grade-12': {
    'independent-textual-evidence': {
      passage: 'Hannah Arendt\'s concept of the "banality of evil" — developed while covering Adolf Eichmann\'s trial — argued that monstrous acts can be committed by ordinary people who simply fail to think. Eichmann was not a fanatic; he was a bureaucrat who followed orders. Arendt\'s insight has been applied to corporate malfeasance, political complicity, and institutional racism: evil does not require malice, only obedience and the suspension of moral judgment.',
      source: 'Adapted from Arendt scholarship',
    },
    'evidence-across-texts': {
      passage: 'Orwell\'s "Politics and the English Language" (1946) argued that corrupted language enables corrupted politics. Toni Morrison\'s Nobel lecture (1993) extended this: "Oppressive language does more than represent violence; it is violence." Viet Thanh Nguyen\'s "Nothing Ever Dies" (2016) showed how war narratives erase the perspectives of the defeated. Across seven decades, these writers trace the same thread: language is never neutral, and those who control narratives control power.',
      source: 'Adapted from comparative analysis',
    },
    'extended-analysis': {
      passage: 'The paradox of tolerance, articulated by Karl Popper in 1945, argues that unlimited tolerance leads to the disappearance of tolerance. If a tolerant society tolerates intolerance, the intolerant will eventually destroy tolerance itself. Therefore, a truly tolerant society must be intolerant of intolerance. This is not a contradiction but a recursive necessity — tolerance that includes self-preservation. The argument has gained renewed urgency in debates about free speech on digital platforms.',
      source: 'Adapted from political philosophy',
    },
    'thematic-complexity': {
      passage: 'James Baldwin wrote in "Notes of a Native Son" that he loved America and hated it simultaneously — that this contradiction was not a failure of logic but the essence of the Black American experience. Love for a country that does not fully love you back is not cognitive dissonance; it is the clearest possible sight. Baldwin insisted that holding both truths — love and rage, belonging and exclusion — was the beginning of wisdom, not its absence.',
      source: 'Adapted from Baldwin analysis',
    },
    'nuanced-idea-development': {
      passage: 'The debate over cultural appropriation often presents a false binary: either all cultural exchange is enrichment, or any borrowing is theft. A more nuanced analysis recognizes a spectrum. A Japanese chef mastering French technique represents mutual exchange between equals. A fashion company selling "tribal prints" without credit or compensation represents extraction. The relevant variables are power, consent, credit, and profit — not the mere fact of borrowing.',
      source: 'Adapted from cultural criticism',
    },
    'paradox-and-tension': {
      passage: 'The First Amendment protects speech that many find repugnant — and this protection is precisely what makes the amendment meaningful. A right that only covers acceptable speech is not a right at all. Yet speech can cause real harm: it can incite violence, spread dangerous misinformation, and silence vulnerable voices through intimidation. The tension is not a flaw in the Constitution; it is a feature. The framers chose the danger of too much speech over the danger of too little.',
      source: 'Adapted from constitutional scholarship',
    },
    'deliberate-ambiguity': {
      passage: 'The Constitution\'s "general welfare" clause has sustained two centuries of debate precisely because its ambiguity was intentional. The framers could have specified what "general welfare" meant. They chose not to. This strategic vagueness allowed the document to adapt: the same clause justified Social Security in 1935 and the Affordable Care Act in 2010. The ambiguity is not a flaw — it is the mechanism by which an eighteenth-century document governs a twenty-first-century nation.',
      source: 'Adapted from constitutional interpretation',
    },
    'connotation-layers': {
      passage: 'When politicians say "reform," listen carefully. Tax "reform" has meant both raising and lowering taxes. Immigration "reform" has meant both expanding and restricting entry. Criminal justice "reform" has meant both harsher and more lenient sentencing. The word carries universally positive connotations — who opposes "reform"? — while carrying no fixed meaning. It is the most politically useful word in English precisely because it means everything and nothing.',
      source: 'Adapted from political language analysis',
    },
    'unconventional-structure': {
      passage: 'Claudia Rankine\'s "Citizen" blends poetry, essay, visual art, and second-person narration to depict the experience of everyday racism. The unconventional structure is not decorative; it is argumentative. By addressing the reader as "you," Rankine forces white readers into a Black body. By mixing genres, she mirrors how racism infiltrates every domain of life. The form does not contain the argument — the form IS the argument.',
      source: 'Adapted from literary criticism',
    },
    'genre-bending': {
      passage: 'In "The Argonauts," Maggie Nelson combines memoir, critical theory, and philosophy without signaling transitions between genres. A paragraph about giving birth follows a citation of Wittgenstein follows a meditation on gender fluidity. This refusal to separate the personal from the theoretical enacts Nelson\'s central claim: that lived experience and intellectual inquiry are not separate activities. The book\'s structure practices what it preaches.',
      source: 'Adapted from contemporary nonfiction criticism',
    },
    'rhetorical-effectiveness-adv': {
      passage: 'Obama\'s 2008 "A More Perfect Union" speech succeeded where others would have failed because it refused simplification. Rather than denouncing Reverend Wright or defending him, Obama contextualized both Black anger and white resentment as legitimate responses to American history. The speech\'s effectiveness lay in its demand that listeners hold complexity — a demand that, paradoxically, unified an audience by asking them to stop seeking easy unity.',
      source: 'Adapted from rhetorical analysis',
    },
    'audience-impact': {
      passage: 'Malala Yousafzai\'s 2013 UN speech drew power from a devastating juxtaposition: "The terrorists thought that they would change our aims and stop our ambitions, but nothing changed in my life except this: weakness, fear, and hopelessness died. Strength, power, and courage were born." The audience — world leaders who had failed to protect her — became, through her words, both shamed and inspired. She transformed victimhood into moral authority, giving the audience no option except to act or be diminished by inaction.',
      source: 'Adapted from speech analysis',
    },
    'founding-document-rhetoric': {
      passage: 'The Federalist No. 10 addresses faction — what we would call partisan division — not by proposing to eliminate it but by arguing that a large republic would contain so many factions that no single one could dominate. Madison\'s rhetorical genius was reframing a problem as a solution: diversity of interests, typically seen as dangerous to unity, becomes the mechanism of stability. The argument is counterintuitive, which is precisely what makes it persuasive to a skeptical audience.',
      source: 'Adapted from constitutional history',
    },
    'constitutional-interpretation': {
      passage: 'Originalists argue that the Constitution must be interpreted as its authors intended. Living constitutionalists argue it must evolve with society. But consider: the authors included an amendment process, anticipating change. They also used deliberately broad language ("due process," "equal protection") that invites interpretation. The framers, it seems, were neither pure originalists nor living constitutionalists — they built a document designed to be both stable and adaptive.',
      source: 'Adapted from legal philosophy',
    },
    'diverse-source-integration': {
      passage: 'The opioid crisis can be understood through medical journals (prescribing patterns), court documents (pharmaceutical company communications), demographic data (geographic and socioeconomic distribution), oral histories (patient experiences), and investigative journalism (corporate accountability). No single source type tells the complete story. The medical data shows what happened; the court documents show why; the demographics show to whom; the oral histories show what it felt like; the journalism shows who profited.',
      source: 'Adapted from research methodology',
    },
    'media-source-evaluation': {
      passage: 'A viral social media post claimed a new study "proved" that a common food additive causes cancer. The linked study, published in a peer-reviewed journal, actually found a correlation in mice at doses 300 times typical human consumption. The study\'s own conclusion stated "further research is needed." Between the study and the social media post, a health blog had rewritten the findings as certainty, and an influencer had stripped away all caveats. Each stage of transmission amplified the claim and removed the nuance.',
      source: 'Adapted from media literacy exercise',
    },
  },
};

// ── Exercise Banks ──

const EXERCISE_BANKS = {
  'grade-9': {
    'textual-support': {
      items: [
        { passage: 'textual-support', question: 'What evidence does the passage provide that chemical companies opposed Carson?', answer: 'They attacked her credibility and called her an alarmist.', skill: 'Citing explicit textual evidence' },
        { passage: 'textual-support', question: 'How does the passage support the claim that Carson\'s research was thorough?', answer: 'It states she cited over 50 scientific studies in her work.', skill: 'Identifying supporting evidence' },
        { passage: 'textual-support', question: 'What evidence shows DDT\'s environmental impact?', answer: 'DDT accumulated in food chains and thinned bird eggshells to the point of collapse.', skill: 'Connecting evidence to claims' },
        { passage: 'textual-support', question: 'What outcome demonstrates the long-term impact of Carson\'s work?', answer: 'Within a decade, the EPA banned DDT.', skill: 'Tracing cause and effect with evidence' },
      ],
    },
    'inference-evidence': {
      items: [
        { passage: 'inference-evidence', question: 'Why did Douglass\'s enslavers forbid literacy? What can you infer about the relationship between literacy and power?', answer: 'They understood that literacy would empower enslaved people to think independently and resist oppression — knowledge threatened the power structure of slavery.', skill: 'Making inferences from textual evidence' },
        { passage: 'inference-evidence', question: 'What can you infer about Douglass\'s character from his method of learning to read?', answer: 'His resourcefulness and determination — he found creative ways to learn despite it being forbidden, trading bread for lessons.', skill: 'Character inference from actions' },
        { passage: 'inference-evidence', question: 'Why would Douglass believe photographs could counter racist caricatures?', answer: 'Photographs showed the real dignity and humanity of Black Americans, unlike racist caricatures that dehumanized them.', skill: 'Inferring purpose from context' },
      ],
    },
    'identify-central-idea': {
      items: [
        { passage: 'identify-central-idea', question: 'What is the central idea of this passage?', answer: 'The Great Pacific Garbage Patch is a diffuse microplastic problem, not a solid trash island, making it much harder to clean up and more dangerous to marine life and humans.', skill: 'Identifying central idea' },
        { passage: 'identify-central-idea', question: 'How does the author challenge a common misconception?', answer: 'By explaining that the garbage patch is not a solid island but a diffuse soup of microplastics suspended throughout the water column.', skill: 'Analyzing how ideas are introduced' },
      ],
    },
    'objective-summary': {
      items: [
        { passage: 'objective-summary', question: 'Write an objective summary of this passage in 2-3 sentences.', answer: 'Andrew Carnegie funded 1,689 free public libraries between 1883 and 1929, transforming libraries from subscription services for the wealthy into public institutions. His philosophy emphasized self-education as a path to improvement, though critics pointed out the contradiction between this ideal and the harsh working conditions in his steel mills.', skill: 'Objective summarization' },
        { passage: 'objective-summary', question: 'What opinion or bias should be excluded from an objective summary of this passage?', answer: 'Whether Carnegie was a hypocrite or a philanthropist — an objective summary presents both his contributions and the criticism without taking sides.', skill: 'Distinguishing objective from subjective' },
      ],
    },
    'idea-development': {
      items: [
        { passage: 'idea-development', question: 'How does the author develop the idea that Salk\'s decision was significant?', answer: 'By contrasting Salk\'s refusal to patent with modern pharmaceutical patenting, providing the $7 billion figure he sacrificed, and showing the dramatic drop in polio cases.', skill: 'Analyzing idea development' },
        { passage: 'idea-development', question: 'What is the effect of including Salk\'s quote "Could you patent the sun?"', answer: 'It frames the vaccine as a public good belonging to everyone, like sunlight, making the case for open access to medical discoveries.', skill: 'Evaluating rhetorical choices in development' },
      ],
    },
    'connection-between-ideas': {
      items: [
        { passage: 'connection-between-ideas', question: 'What parallel does the author draw between the printing press and the internet?', answer: 'Both dramatically lowered the cost of distributing information, increased access to knowledge, but also enabled the spread of misinformation.', skill: 'Identifying connections between ideas' },
        { passage: 'connection-between-ideas', question: 'How does the detail about book costs support the central comparison?', answer: 'It concretely illustrates how inaccessible knowledge was before the printing press, making the parallel to pre-internet information scarcity clear.', skill: 'Analyzing supporting details' },
      ],
    },
    'context-clues': {
      items: [
        { passage: 'context-clues', question: 'Using context clues, what does "tendentious" most likely mean?', answer: 'Biased or one-sided — the context shows cherry-picked statistics and deliberately provocative anecdotes designed to support one position.', skill: 'Using context clues for vocabulary' },
        { passage: 'context-clues', question: 'What does "demagogic" mean based on context?', answer: 'Appealing to emotions and prejudices rather than reason — the passage explains it means rhetoric designed to inflame rather than inform.', skill: 'Context clues for rhetorical terms' },
      ],
    },
    'rhetorical-word-choice': {
      items: [
        { passage: 'rhetorical-word-choice', question: 'How do the three different words for the same group (mob, demonstrators, freedom fighters) shape different narratives?', answer: '"Mob" implies chaos and danger, "demonstrators" suggests organized dissent, "freedom fighters" evokes heroism — each word frames the same people differently.', skill: 'Analyzing word choice effects' },
        { passage: 'rhetorical-word-choice', question: 'What point does the author make about the relationship between language and reality?', answer: 'That language does not just describe events but actively shapes how we understand them — the same event can be perceived entirely differently based on word choice.', skill: 'Understanding rhetoric and framing' },
      ],
    },
    'organizational-patterns': {
      items: [
        { passage: 'organizational-patterns', question: 'What organizational pattern does this passage use?', answer: 'Cause-and-effect (also problem-solution): it identifies the problem of food deserts, explains the economic causes, traces the health effects, and proposes solutions.', skill: 'Identifying text structure' },
        { passage: 'organizational-patterns', question: 'Why does the author include specific statistics?', answer: 'Numbers like 23.5 million Americans and $2.4 billion in costs make the abstract problem concrete and convey its scale, supporting the argument for action.', skill: 'Analyzing use of evidence in structure' },
      ],
    },
    'author-purpose': {
      items: [
        { passage: 'author-purpose', question: 'What is the author\'s purpose, and how does the second-person point of view serve it?', answer: 'The purpose is to persuade readers to care about extinction. Using "you" directly implicates the reader in the scrolling behavior and makes the consequences personal.', skill: 'Determining author purpose' },
        { passage: 'author-purpose', question: 'How does the sweater metaphor serve the author\'s purpose?', answer: 'It makes the abstract concept of ecosystem collapse tangible and personal — a sweater keeps you warm, just as an ecosystem keeps you alive, so pulling threads (extinctions) threatens your wellbeing.', skill: 'Analyzing rhetorical strategies and purpose' },
      ],
    },
    'point-of-view': {
      items: [
        { passage: 'point-of-view', question: 'Whose perspectives are represented in this passage, and whose are notably absent?', answer: 'The school board president, teachers, and parents are quoted. Students — the most directly affected — are absent, as noted in the final line.', skill: 'Analyzing point of view and perspective' },
        { passage: 'point-of-view', question: 'How does the word choice of each group reveal their perspective?', answer: '"Necessary sacrifices" (board) minimizes impact; "devastating" (teachers) emphasizes harm; "abandoned" (parents) conveys betrayal. Each word reflects a different relationship to the cuts.', skill: 'Connecting diction to point of view' },
      ],
    },
    'rhetorical-appeals-intro': {
      items: [
        { passage: 'rhetorical-appeals-intro', question: 'Identify one example each of ethos, logos, pathos, and kairos in this passage.', answer: 'Ethos: "pediatrician with twenty years of experience." Logos: "17% higher on standardized tests." Pathos: "seen firsthand how childhood hunger affects brain development." Kairos: "before another school year begins."', skill: 'Identifying rhetorical appeals' },
        { passage: 'rhetorical-appeals-intro', question: 'Which appeal does the speaker rely on most, and why might that be strategic?', answer: 'The speaker blends all four but leads with ethos (credentials) to establish authority, then uses logos (data) to support the emotional appeal — a strategic ordering that builds credibility before asking for action.', skill: 'Evaluating rhetorical strategy' },
      ],
    },
    'claim-identification': {
      items: [
        { passage: 'claim-identification', question: 'What are the two main opposing claims about year-round schooling?', answer: 'Proponents claim summer break causes learning loss ("summer slide"). Opponents claim year-round schools show no significant test improvement and the real issue is inequity in access to summer enrichment.', skill: 'Identifying competing claims' },
        { passage: 'claim-identification', question: 'What evidence do proponents cite, and how do opponents challenge it?', answer: 'Proponents cite a Johns Hopkins study of 790 students. Opponents counter with standardized test data showing no improvement and reframe the problem as one of equity rather than calendar.', skill: 'Evaluating claim-evidence relationships' },
      ],
    },
    'evidence-relevance': {
      items: [
        { passage: 'evidence-relevance', question: 'Why is the city council\'s jobs claim potentially irrelevant?', answer: 'Because stadium construction typically creates temporary, not permanent, jobs — the claim implies lasting employment that the evidence does not support.', skill: 'Evaluating evidence relevance' },
        { passage: 'evidence-relevance', question: 'How do the independent economists\' studies challenge the tourism revenue claim?', answer: 'Studies of 37 cities showed stadiums redistribute existing spending rather than generating new economic activity, directly contradicting the claim of increased tourism revenue.', skill: 'Assessing counter-evidence' },
      ],
    },
    'compare-genres': {
      items: [
        { passage: 'compare-genres', question: 'How do the encyclopedia entry and Guthrie\'s lyrics differ in purpose and effect?', answer: 'The encyclopedia informs objectively with facts and dates. Guthrie creates an emotional, sensory experience that makes the reader feel the event. Both describe the Dust Bowl but serve different purposes.', skill: 'Comparing genres' },
      ],
    },
    'compare-perspectives': {
      items: [
        { passage: 'compare-perspectives', question: 'How did Edison\'s and Tesla\'s motivations differ, and how did this shape their rhetoric?', answer: 'Edison was protecting his DC business empire, so he used fear rhetoric (electrocuting animals). Tesla was advancing superior technology, so he used demonstration (safely lighting bulbs with AC). Self-interest shaped Edison\'s attacks; innovation shaped Tesla\'s proof.', skill: 'Comparing perspectives and motives' },
      ],
    },
  },
  'grade-10': {
    'strong-vs-weak-evidence': {
      items: [
        { passage: 'strong-vs-weak-evidence', question: 'Why is the "82 cents" statistic considered weaker evidence of discrimination than the "8%" gap?', answer: 'The 82-cent figure does not control for variables like occupation and hours worked. The 8% gap, which persists after controlling for those factors, is stronger evidence because it isolates gender as the remaining variable.', skill: 'Distinguishing strong from weak evidence' },
        { passage: 'strong-vs-weak-evidence', question: 'What is the difference between correlation and causation as used in this passage?', answer: 'The raw wage gap (correlation) shows women earn less but does not prove why. The controlled analysis attempts to establish causation by eliminating alternative explanations, leaving gender as the most likely cause.', skill: 'Analyzing evidence strength' },
      ],
    },
    'implicit-meaning': {
      items: [
        { passage: 'implicit-meaning', question: 'What does "We trust these are routine" actually mean in diplomatic context?', answer: 'It means the opposite of what it literally says — the diplomat does not trust the exercises are routine and is signaling that the military activity is seen as a threat.', skill: 'Interpreting implicit meaning' },
        { passage: 'implicit-meaning', question: 'How does the final line function as a "veiled threat"?', answer: '"Committed to peaceful dialogue" implies the alternative is non-peaceful action. By emphasizing peace, the diplomat implicitly warns of consequences if military exercises continue.', skill: 'Reading subtext' },
      ],
    },
    'central-idea-development': {
      items: [
        { passage: 'central-idea-development', question: 'What is the central idea and how does the fish metaphor reinforce it?', answer: 'The central idea is that individual success depends on collective infrastructure. The fish metaphor shows that denying this dependence is as absurd as a fish denying water — the system is so pervasive it becomes invisible.', skill: 'Analyzing central idea development' },
      ],
    },
    'analytical-summary': {
      items: [
        { passage: 'analytical-summary', question: 'How does the author use the metaphor of "middle rungs" in the summary\'s conclusion?', answer: 'The ladder metaphor shows that while upward mobility still exists (the ladder remains), the stable middle-class positions that allowed gradual climbing have disappeared (middle rungs vanishing), creating a gap between top and bottom.', skill: 'Analytical summary with figurative language' },
      ],
    },
    'idea-interaction': {
      items: [
        { passage: 'idea-interaction', question: 'How do the ideas of success and unintended consequence interact in this passage?', answer: 'The Green Revolution\'s success (preventing famine) created the conditions for its unintended consequences (dependency, depletion, reduced diversity). The passage shows how solving one problem can create larger future problems — a paradox.', skill: 'Analyzing interacting ideas' },
      ],
    },
    'sequential-causal-analysis': {
      items: [
        { passage: 'sequential-causal-analysis', question: 'How does the passage establish a causal chain? Identify each link.', answer: 'Algorithms prioritized engagement → operatives exploited this with inflammatory content → mainstream media covered viral posts → citizens couldn\'t distinguish reliable from unreliable information. Each step caused the next.', skill: 'Tracing causal sequences' },
      ],
    },
    'cumulative-meaning': {
      items: [
        { passage: 'cumulative-meaning', question: 'Why was King\'s choice of "dream" more effective than "plan" would have been?', answer: '"Dream" carries connotations of aspiration, imagination, and biblical prophecy, inspiring hope and emotional connection. "Plan" would have been technical and limited. The word built a movement because it appealed to shared human longing.', skill: 'Analyzing cumulative word impact' },
      ],
    },
    'tone-and-diction': {
      items: [
        { passage: 'tone-and-diction', question: 'Compare the diction choices of the company and the scientists. What is the effect of each?', answer: 'The company uses euphemisms ("incident," "release," "product," "waterway") to minimize. Scientists use precise terms ("catastrophe," "dumping," "toxic crude," "river ecosystem") to clarify. The company\'s diction deflects; the scientists\' diction confronts.', skill: 'Analyzing tone through diction' },
      ],
    },
    'section-role': {
      items: [
        { passage: 'section-role', question: 'What role does each section play in the overall argument?', answer: 'The opening statistic creates shock. Section 1 provides context (the problem\'s scope). Section 2 provides stakes (environmental cost). Section 3 provides solutions. The structure moves from "what" to "why it matters" to "what we can do."', skill: 'Analyzing section roles' },
      ],
    },
    'structural-choices': {
      items: [
        { passage: 'structural-choices', question: 'Why was the letter form more effective than an essay for Coates\'s subject?', answer: 'The letter form created intimacy (readers overhear a private conversation), established urgency (a father preparing his son for danger), and made the political personal in a way an essay could not.', skill: 'Evaluating structural choices' },
      ],
    },
    'ethos-logos-pathos': {
      items: [
        { passage: 'ethos-logos-pathos', question: 'How did Cullis-Suzuki\'s age function as an ethos appeal?', answer: 'Her youth gave her moral authority — a child holding adults accountable for failing her generation. Her ethos came not from credentials but from being the living consequence of the adults\' decisions.', skill: 'Analyzing rhetorical appeals' },
        { passage: 'ethos-logos-pathos', question: 'What is the effect of the passage\'s final sentence?', answer: 'It creates irony — the standing ovation suggests the speech was powerful, but the delegates "changed almost nothing," showing that rhetorical effectiveness does not guarantee action.', skill: 'Evaluating rhetoric vs. outcome' },
      ],
    },
    'rhetorical-strategy-effect': {
      items: [
        { passage: 'rhetorical-strategy-effect', question: 'How does Swift\'s use of rational tone enhance the satirical effect?', answer: 'By applying cold, calculating logic to a monstrous proposal, Swift mirrors the cold logic already being applied to Irish poverty. The rational tone makes the horror more shocking and forces readers to see their own indifference.', skill: 'Analyzing rhetorical strategy effects' },
      ],
    },
    'logical-reasoning': {
      items: [
        { passage: 'logical-reasoning', question: 'Outline Jefferson\'s deductive argument. Where is its potential weakness?', answer: 'Major premise: Legitimate government requires consent. Minor premise: Britain governed without colonial consent. Conclusion: British rule was illegitimate. The weakness is in the major premise — it assumes consent is necessary, which King George would reject.', skill: 'Analyzing deductive reasoning' },
      ],
    },
    'evidence-sufficiency': {
      items: [
        { passage: 'evidence-sufficiency', question: 'Why is the pilot program insufficient evidence for district-wide spending?', answer: 'Small sample (87 students), short duration (one semester), and an uncontrolled confounding variable (additional tutors were hired simultaneously). The laptop effect cannot be isolated from the tutoring effect.', skill: 'Evaluating evidence sufficiency' },
      ],
    },
    'compare-founding-docs': {
      items: [
        { passage: 'compare-founding-docs', question: 'How do the Declaration and Constitution differ in their source of authority?', answer: 'The Declaration claims rights from the Creator ("self-evident," "unalienable"). The Constitution derives authority from "We the People" with no mention of God. One is philosophical/theological; the other is practical/democratic.', skill: 'Comparing foundational documents' },
      ],
    },
    'themes-across-texts': {
      items: [
        { passage: 'themes-across-texts', question: 'What theme connects Thoreau, Carson, and Klein, and how does each express it differently?', answer: 'All address the tension between economic progress and ecological survival. Thoreau sought personal withdrawal; Carson documented scientific harm; Klein argued for systemic economic change. The urgency escalates across 170 years.', skill: 'Tracing themes across texts' },
      ],
    },
  },
  'grade-11': {
    'thorough-textual-analysis': {
      items: [
        { passage: 'thorough-textual-analysis', question: 'Why does King address his audience as "My Dear Fellow Clergymen"? Analyze the rhetorical effect of each word.', answer: '"My" claims personal connection. "Dear" asserts warmth despite disagreement. "Fellow" insists on equality. "Clergymen" invokes shared religious duty. Together, these words establish ethos through collegiality while morally obligating his critics.', skill: 'Thorough textual analysis' },
        { passage: 'thorough-textual-analysis', question: 'How does King\'s structural choice to restate his opponents\' objections before responding strengthen his argument?', answer: 'It demonstrates intellectual honesty and fairness (ethos), shows he takes their concerns seriously, and then makes his refutations more devastating by proving he understands their position fully before dismantling it.', skill: 'Analyzing argumentative structure' },
      ],
    },
    'ambiguity-in-text': {
      items: [
        { passage: 'ambiguity-in-text', question: 'How does Lincoln\'s deliberate ambiguity in "our fathers" and "conceived in Liberty" serve a unifying rhetorical purpose?', answer: 'The ambiguity allows listeners on both sides of the Civil War to project their own meaning onto the words, uniting a fractured audience around language elastic enough to hold contradictory interpretations. It builds consensus through vagueness rather than precision.', skill: 'Analyzing deliberate ambiguity' },
      ],
    },
    'dual-central-ideas': {
      items: [
        { passage: 'dual-central-ideas', question: 'What are Washington\'s two simultaneous ideas, and how does the passage suggest they may be in tension?', answer: 'Idea 1: Black Americans should pursue economic self-sufficiency. Idea 2: White southerners should support this because it serves their interests. The tension is that framing Black progress as beneficial to whites may concede too much, prioritizing white comfort over Black equality.', skill: 'Identifying dual central ideas' },
      ],
    },
    'idea-interaction-build': {
      items: [
        { passage: 'idea-interaction-build', question: 'How does Truth\'s accumulation of examples transform her rhetorical question from a question into an "indictment"?', answer: 'Each example (plowing, planting, bearing children, watching them sold) adds evidence that she has endured as much as or more than any man. The repetition builds until the question "ain\'t I a woman?" becomes undeniable — it is no longer asking but declaring.', skill: 'Analyzing accumulative argument' },
      ],
    },
    'complex-sequence': {
      items: [
        { passage: 'complex-sequence', question: 'How does the passage show that civil rights events were "both consequence and cause"?', answer: 'Each event built on lessons from the previous one: Montgomery proved economic pressure works, sit-ins proved youth discipline, Freedom Rides proved federal intervention could be forced. Each was caused by previous successes and caused future possibilities.', skill: 'Analyzing complex sequences' },
      ],
    },
    'rhetorical-development': {
      items: [
        { passage: 'rhetorical-development', question: 'Why was Stanton\'s use of the Declaration of Independence\'s structure a strategic rhetorical choice?', answer: 'By mirroring the Declaration\'s format, Stanton created an unavoidable parallel: if denying colonists representation was tyranny, then denying women representation was also tyranny. The familiar structure made the argument self-evident.', skill: 'Analyzing rhetorical development' },
      ],
    },
    'technical-language': {
      items: [
        { passage: 'technical-language', question: 'Why does the passage claim that "the choice of standard is often the choice of result"?', answer: 'Because strict scrutiny almost always strikes down laws while rational basis almost always upholds them. The legal standard chosen predetermines the outcome, making the supposedly neutral legal framework a tool of judicial discretion.', skill: 'Interpreting technical language' },
      ],
    },
    'figurative-in-nonfiction': {
      items: [
        { passage: 'figurative-in-nonfiction', question: 'How do King\'s metaphors of "network" and "garment" do rhetorical work that abstract argument cannot?', answer: '"Network" implies interconnection that makes isolation impossible. "Garment" implies that damaging one part damages the whole. These metaphors make philosophical claims feel physically tangible — you can almost feel the fabric ripping — which creates urgency that logic alone cannot.', skill: 'Analyzing figurative language in nonfiction' },
      ],
    },
    'structural-purpose': {
      items: [
        { passage: 'structural-purpose', question: 'Why does Thoreau present philosophy before anecdote?', answer: 'By establishing his principled framework first, readers evaluate his arrest through his philosophy rather than judging the philosophy by the arrest. The structure controls interpretation, ensuring the act is seen as principled civil disobedience rather than mere law-breaking.', skill: 'Analyzing structural purpose' },
      ],
    },
    'manipulation-of-time': {
      items: [
        { passage: 'manipulation-of-time', question: 'How does Hersey\'s second-by-second narration create empathy?', answer: 'The slow, granular pacing forces readers to inhabit each moment rather than processing the bombing as a historical abstraction. By making readers experience the passage of time as the survivors did, Hersey transforms a statistic into a human experience.', skill: 'Analyzing manipulation of time' },
      ],
    },
    'soapstone-analysis': {
      items: [
        { passage: 'soapstone-analysis', question: 'How does the SOAPSTone analysis reveal the strategic purpose of "Ask not what your country can do for you"?', answer: 'Knowing the occasion (Cold War), audience (Americans + Soviets), and purpose (unite and challenge), the chiasmus inverts the citizen-government relationship, placing obligation on citizens. It serves Kennedy\'s purpose of mobilizing a divided nation by redefining patriotism as service.', skill: 'Applying SOAPSTone framework' },
      ],
    },
    'rhetorical-effectiveness': {
      items: [
        { passage: 'rhetorical-effectiveness', question: 'How did Churchill transform military disaster into defiance through rhetorical choices?', answer: 'By never promising victory or minimizing Dunkirk, Churchill maintained credibility. By listing places Britain would fight, he made resistance feel inevitable and comprehensive, transforming the narrative from "we lost" to "we will never stop fighting."', skill: 'Assessing rhetorical effectiveness' },
      ],
    },
    'premise-identification': {
      items: [
        { passage: 'premise-identification', question: 'Identify the key premises of the UBI argument and explain how opponents challenge them.', answer: 'Premises: automation will eliminate jobs permanently, retraining is insufficient, dignity requires economic security, consumer spending helps the economy. Opponents challenge premises 1 and 2 (new jobs will emerge, retraining can work) and add a counter-premise (income without work erodes motivation).', skill: 'Identifying and evaluating premises' },
      ],
    },
    'fallacy-detection': {
      items: [
        { passage: 'fallacy-detection', question: 'Identify and explain each fallacy in the senator\'s argument.', answer: 'Ad hominem: attacks opponent\'s character ("doesn\'t care if soldiers die"). Straw man: misrepresents the position (reducing spending ≠ wanting deaths). Appeal to tradition: "every great nation" maintained a strong military, ignoring how modern threats differ.', skill: 'Detecting logical fallacies' },
      ],
    },
    'source-synthesis': {
      items: [
        { passage: 'source-synthesis', question: 'How would you synthesize Sources A, B, and C into a coherent argument? What must you account for?', answer: 'A synthesis must acknowledge the health crisis (A and C) while addressing fiscal reality (B). It should note that Source C uses analogy (sleep deprivation vs. alcohol impairment), not literal equivalence, and weigh health costs against restructuring costs for a complete argument.', skill: 'Source synthesis' },
      ],
    },
    'conflicting-sources': {
      items: [
        { passage: 'conflicting-sources', question: 'Why might these two studies reach different conclusions, and how should a critical reader evaluate them?', answer: 'Methodological differences (moderate use vs. per-hour measurement) and funding bias (industry-funded vs. independent) may explain the conflict. Neither is automatically wrong, but the independent study\'s longitudinal design and funding independence make it more reliable.', skill: 'Evaluating conflicting sources' },
      ],
    },
  },
  'grade-12': {
    'independent-textual-evidence': {
      items: [
        { passage: 'independent-textual-evidence', question: 'How does Arendt\'s characterization of Eichmann as a "bureaucrat" rather than a "fanatic" reshape our understanding of how atrocities occur?', answer: 'It shifts evil from exceptional individual malice to ordinary systemic obedience. If monstrous acts require only compliance and suspended judgment — not fanaticism — then the capacity for evil is universal, embedded in institutions rather than personalities.', skill: 'Independent textual analysis' },
        { passage: 'independent-textual-evidence', question: 'Apply Arendt\'s concept to a modern context. What textual evidence supports this application?', answer: 'The passage explicitly connects the concept to corporate malfeasance, political complicity, and institutional racism — all cases where harm results from "obedience and the suspension of moral judgment" rather than deliberate malice.', skill: 'Applying concepts with textual evidence' },
      ],
    },
    'evidence-across-texts': {
      items: [
        { passage: 'evidence-across-texts', question: 'How do Orwell, Morrison, and Nguyen build on each other\'s claims about language and power?', answer: 'Orwell argues corrupted language enables corrupted politics. Morrison extends this: oppressive language IS violence, not just its enabler. Nguyen adds that narrative control erases defeated perspectives. Together they trace escalating claims: language distorts (Orwell), language harms (Morrison), language erases (Nguyen).', skill: 'Synthesizing evidence across texts' },
      ],
    },
    'extended-analysis': {
      items: [
        { passage: 'extended-analysis', question: 'Explain the paradox of tolerance and evaluate its logical consistency.', answer: 'Popper argues unlimited tolerance self-destructs because intolerant groups will destroy tolerance. Therefore, tolerance must include intolerance of intolerance. This is logically consistent because it is not a contradiction but a recursive necessity — tolerance that preserves itself. The argument treats tolerance as a social contract, not an absolute principle.', skill: 'Extended analytical reasoning' },
      ],
    },
    'thematic-complexity': {
      items: [
        { passage: 'thematic-complexity', question: 'How does Baldwin redefine simultaneous love and hatred as wisdom rather than contradiction?', answer: 'Baldwin argues that holding both truths — love for America and rage at its failures — is not cognitive dissonance but the "clearest possible sight." The contradiction is not in the observer but in the nation. Acknowledging this complexity is the beginning of wisdom because it refuses simplification.', skill: 'Analyzing thematic complexity' },
      ],
    },
    'nuanced-idea-development': {
      items: [
        { passage: 'nuanced-idea-development', question: 'How does the passage move beyond a binary view of cultural appropriation?', answer: 'It identifies a spectrum based on power, consent, credit, and profit. A Japanese chef mastering French technique represents equal exchange; a fashion company selling "tribal prints" without credit represents extraction. The nuance lies in analyzing variables, not in declaring all borrowing acceptable or unacceptable.', skill: 'Analyzing nuanced development' },
      ],
    },
    'paradox-and-tension': {
      items: [
        { passage: 'paradox-and-tension', question: 'Why does the passage describe the First Amendment\'s tension as "a feature" rather than "a flaw"?', answer: 'Because the framers intentionally chose the danger of too much speech over too little. A right that only covers acceptable speech is meaningless. The tension between protecting harmful speech and preventing harm is what makes the right meaningful and functional.', skill: 'Analyzing constitutional paradox' },
      ],
    },
    'deliberate-ambiguity': {
      items: [
        { passage: 'deliberate-ambiguity', question: 'How does the passage argue that constitutional ambiguity is a "mechanism" rather than a flaw?', answer: 'The framers could have defined "general welfare" precisely but chose not to. This strategic vagueness allowed the same clause to justify Social Security and the ACA across different eras, enabling an 18th-century document to govern a 21st-century nation through adaptability.', skill: 'Analyzing deliberate ambiguity' },
      ],
    },
    'connotation-layers': {
      items: [
        { passage: 'connotation-layers', question: 'Why does the passage call "reform" the "most politically useful word in English"?', answer: 'Because "reform" carries universally positive connotations (improvement, progress) while having no fixed meaning — it has been used to describe opposite policies. Its usefulness lies in its emotional appeal combined with semantic emptiness, allowing any policy to sound beneficial.', skill: 'Analyzing connotative layers' },
      ],
    },
    'unconventional-structure': {
      items: [
        { passage: 'unconventional-structure', question: 'How does Rankine\'s structural choice that "the form IS the argument" work?', answer: 'Second-person narration forces readers into a Black body experiencing racism. Genre-mixing (poetry, essay, art) mirrors how racism infiltrates every domain of life. The unconventional structure does not just present an argument about pervasive racism — it enacts it structurally.', skill: 'Analyzing innovative structure' },
      ],
    },
    'genre-bending': {
      items: [
        { passage: 'genre-bending', question: 'How does Nelson\'s refusal to separate genres enact her central claim?', answer: 'By mixing memoir, theory, and philosophy without transitions, Nelson demonstrates that lived experience and intellectual inquiry are inseparable. The book\'s structure practices its thesis — the blending of genres IS the argument against compartmentalization.', skill: 'Analyzing genre-bending techniques' },
      ],
    },
    'rhetorical-effectiveness-adv': {
      items: [
        { passage: 'rhetorical-effectiveness-adv', question: 'How did Obama\'s refusal to simplify the Wright controversy make his speech more effective?', answer: 'By contextualizing both Black anger and white resentment as legitimate, Obama demanded his audience hold complexity. This paradoxically unified listeners by asking them to stop seeking easy unity — a more honest and sustainable form of persuasion than choosing sides.', skill: 'Evaluating advanced rhetorical effectiveness' },
      ],
    },
    'audience-impact': {
      items: [
        { passage: 'audience-impact', question: 'How did Malala transform her position from victim to moral authority?', answer: 'Through juxtaposition — "weakness, fear, and hopelessness died" while "strength, power, and courage were born" — she reframed the assassination attempt as empowering rather than silencing. Her audience of world leaders was simultaneously shamed (they failed to protect her) and inspired (she rose above it).', skill: 'Analyzing audience impact' },
      ],
    },
    'founding-document-rhetoric': {
      items: [
        { passage: 'founding-document-rhetoric', question: 'How does Madison reframe faction from a problem into a solution in Federalist No. 10?', answer: 'Madison argues that a large republic with diverse factions prevents any single one from dominating. He reframes diversity of interests — typically seen as dangerous — as the mechanism of stability. The counterintuitive argument works because it acknowledges the problem while proposing that scale itself is the remedy.', skill: 'Analyzing foundational rhetoric' },
      ],
    },
    'constitutional-interpretation': {
      items: [
        { passage: 'constitutional-interpretation', question: 'How does the passage challenge the binary between originalism and living constitutionalism?', answer: 'It shows the framers included both fixed elements (specific provisions) and flexible ones (broad language, amendment process). They anticipated change while establishing stability, suggesting they intended a document that was both original and living — undermining the binary.', skill: 'Analyzing interpretive frameworks' },
      ],
    },
    'diverse-source-integration': {
      items: [
        { passage: 'diverse-source-integration', question: 'Why does understanding the opioid crisis require multiple source types?', answer: 'Each source type answers a different question: medical journals show what happened, court documents show why, demographics show to whom, oral histories show the human experience, and journalism shows who profited. No single type provides the complete picture.', skill: 'Integrating diverse sources' },
      ],
    },
    'media-source-evaluation': {
      items: [
        { passage: 'media-source-evaluation', question: 'Trace how the scientific finding was distorted at each stage of transmission.', answer: 'The study found a correlation in mice at extreme doses and called for further research. A health blog rewrote findings as certainty. An influencer stripped all caveats. Each stage amplified the claim and removed nuance, transforming a cautious correlation into a definitive causal claim.', skill: 'Evaluating source reliability across media' },
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

function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, '').replace(/\s+/g, ' '); }

// ── Exercise Generation ──

function getPassage(grade, key) {
  const p = PASSAGES[grade]?.[key];
  if (!p) return null;
  return p;
}

function generateExercise(grade, skill, count = 3) {
  const bank = EXERCISE_BANKS[grade]?.[skill];
  if (!bank) return { error: `No exercise bank for ${grade}/${skill}` };
  const items = bank.items;
  if (!items || !items.length) return { error: `Empty exercise bank for ${grade}/${skill}` };

  const selected = pick(items, count);
  const passageKey = selected[0].passage;
  const passageData = getPassage(grade, passageKey);

  return {
    type: 'passage-analysis',
    skill,
    grade,
    count: selected.length,
    passage: passageData ? passageData.passage : null,
    source: passageData ? passageData.source : null,
    instruction: 'Read the passage carefully, then answer the questions.',
    items: selected.map(i => ({
      question: i.question,
      answer: i.answer,
      skill: i.skill,
    })),
  };
}

function checkAnswer(expected, answer) {
  const ne = norm(expected);
  const na = norm(answer);
  if (ne === na) return true;
  // Partial credit: check if key phrases from expected appear in answer
  const keywords = ne.split(' ').filter(w => w.length > 4);
  if (keywords.length === 0) return ne === na;
  const matched = keywords.filter(k => na.includes(k));
  return matched.length / keywords.length >= 0.6;
}

// ── Public API ──

class Informational {
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

  generateExercise(grade, skill, count = 3) { return generateExercise(grade, skill, count); }

  checkAnswer(expected, answer) { return { correct: checkAnswer(expected, answer), expected, studentAnswer: answer }; }

  getPassage(grade, key) {
    const p = getPassage(grade, key);
    if (!p) return { error: `No passage for ${grade}/${key}` };
    return p;
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-9';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 3);
    return {
      studentId: id, grade, targetSkill: target, exercise,
      lessonPlan: {
        warmup: 'Read the passage carefully and identify the rhetorical situation (speaker, audience, purpose).',
        teach: `Focus skill: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} analysis questions`,
        apply: 'Apply this analytical skill to a text you encounter outside class.',
      },
    };
  }
}

module.exports = Informational;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const tutor = new Informational();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) tutor.setGrade(id, grade);
        out({ action: 'start', profile: tutor.getProfile(id), nextSkills: tutor.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(tutor.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-9';
        if (skill) { out(tutor.generateExercise(grade, skill, 3)); }
        else { const n = tutor.getNextSkills(id, 1).next; out(n.length ? tutor.generateExercise(grade, n[0].skill, 3) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, expected, ...rest] = args;
        const answer = rest.join(' ');
        if (!expected || !answer) throw new Error('Usage: check <expected> <answer>');
        out(tutor.checkAnswer(expected, answer));
        break;
      }
      case 'record': {
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(tutor.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(tutor.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(tutor.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(tutor.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? tutor.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(tutor.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(tutor.setGrade(id, g)); break; }
      case 'passage': { const [, g, key] = args; if (!g || !key) throw new Error('Usage: passage <grade> <key>'); out(tutor.getPassage(g, key)); break; }
      default: out({ usage: 'node informational.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students', 'set-grade', 'passage'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
