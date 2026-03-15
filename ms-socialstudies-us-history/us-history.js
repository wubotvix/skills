// MS Social Studies US History Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-us-history');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'colonial-era': ['native-americans', 'european-exploration', 'columbian-exchange', 'jamestown-plymouth', 'thirteen-colonies', 'colonial-society'],
  },
  'grade-7': {
    'revolution-founding': ['road-to-revolution', 'declaration-of-independence', 'revolutionary-war', 'articles-of-confederation', 'constitutional-convention', 'early-republic'],
    'expansion-reform': ['westward-expansion', 'manifest-destiny', 'indian-removal', 'slavery-expansion', 'abolition-movement', 'reform-movements'],
  },
  'grade-8': {
    'civil-war-reconstruction': ['causes-of-civil-war', 'lincoln-leadership', 'emancipation', 'reconstruction', 'reconstruction-amendments', 'end-of-reconstruction'],
    'industrialization-immigration': ['industrialization', 'immigration-waves', 'progressive-era', 'labor-movement', 'urbanization', 'technological-change'],
    'modern-america': ['world-wars-overview', 'great-depression-new-deal', 'civil-rights-movement', 'cold-war-basics', 'modern-challenges', 'connecting-past-present'],
  },
};

const CONTENT_BANKS = {
  'grade-6': {
    'native-americans': {
      questions: [
        { q: 'How did geography shape the diverse cultures of Native American nations?', a: 'different environments led to different ways of life, food sources, housing, and traditions', alts: ['geography determined resources', 'climate and land shaped culture'] },
        { q: 'Why is it inaccurate to think of Native Americans as one single group?', a: 'there were hundreds of distinct nations with different languages, cultures, and governments', alts: ['many different cultures', 'hundreds of tribes', 'diverse nations'] },
        { q: 'What were the major Native American cultural regions of North America?', a: 'Eastern Woodlands, Plains, Southwest, Northwest Coast, Arctic, and Southeast', alts: ['woodlands plains southwest northwest'] },
        { q: 'How did Native Americans in the Eastern Woodlands get their food?', a: 'through farming (corn, beans, squash), hunting, and gathering', alts: ['farming hunting gathering', 'three sisters agriculture'] },
        { q: 'What type of government did the Iroquois Confederacy have?', a: 'a democratic confederation of five (later six) nations with a Great Law of Peace', alts: ['confederacy', 'democratic alliance', 'league of nations'] },
        { q: 'What were the "Three Sisters" in Native American agriculture?', a: 'corn, beans, and squash grown together', alts: ['corn beans squash'] },
      ],
    },
    'european-exploration': {
      questions: [
        { q: 'What were the three main motives for European exploration?', a: 'God, gold, and glory — religion, wealth, and fame', alts: ['god gold glory', 'wealth religion power'] },
        { q: 'What was Columbus actually looking for when he sailed west in 1492?', a: 'a western sea route to Asia for trade', alts: ['route to asia', 'trade route to india'] },
        { q: 'Which European country first established a large colonial empire in the Americas?', a: 'Spain', alts: ['the spanish'] },
        { q: 'What devastating effect did European contact have on Native Americans?', a: 'diseases like smallpox killed millions who had no immunity', alts: ['disease', 'smallpox', 'epidemic'] },
        { q: 'What was the encomienda system?', a: 'a Spanish system that forced Native Americans to work for colonists', alts: ['forced labor', 'spanish labor system'] },
        { q: 'How did the French approach to colonization differ from the Spanish?', a: 'the French focused on fur trade and built alliances with Native Americans rather than conquering them', alts: ['fur trade', 'trade alliances', 'less conquest'] },
      ],
    },
    'columbian-exchange': {
      questions: [
        { q: 'What was the Columbian Exchange?', a: 'the transfer of plants, animals, diseases, and ideas between the Americas and Europe/Africa', alts: ['exchange between old and new world', 'biological exchange'] },
        { q: 'Name two foods that went from the Americas to Europe.', a: 'potatoes and tomatoes', alts: ['corn', 'chocolate', 'tobacco', 'squash', 'peppers'] },
        { q: 'Name two animals that went from Europe to the Americas.', a: 'horses and cattle', alts: ['pigs', 'sheep', 'chickens'] },
        { q: 'Why did European diseases devastate Native American populations?', a: 'Native Americans had no immunity to diseases like smallpox, measles, and influenza', alts: ['no immunity', 'never exposed before'] },
        { q: 'How did the introduction of horses change life for Plains Indians?', a: 'horses transformed hunting, travel, and warfare, allowing them to follow buffalo herds', alts: ['better hunting', 'mobility', 'follow buffalo'] },
        { q: 'What was the most devastating consequence of the Columbian Exchange for indigenous peoples?', a: 'disease, which killed an estimated 90% of the native population', alts: ['disease killed millions', 'population collapse'] },
      ],
    },
    'jamestown-plymouth': {
      questions: [
        { q: 'Why was Jamestown established in 1607?', a: 'to make money for the Virginia Company through finding gold and trade', alts: ['profit', 'economic reasons', 'gold'] },
        { q: 'Why did the Pilgrims come to Plymouth in 1620?', a: 'to practice their religion freely', alts: ['religious freedom', 'escape religious persecution'] },
        { q: 'What was the Mayflower Compact and why was it important?', a: 'an agreement to create laws for the good of the colony — an early form of self-government', alts: ['self-government agreement', 'first written framework of government'] },
        { q: 'How did Pocahontas and the Powhatan help Jamestown survive?', a: 'they provided food and taught colonists how to farm', alts: ['food and farming knowledge', 'trade and survival skills'] },
        { q: 'What crop saved Jamestown economically?', a: 'tobacco', alts: ['tobacco farming'] },
        { q: 'What nearly destroyed the Jamestown colony in its early years?', a: 'starvation, disease, and conflict with Native Americans during the starving time', alts: ['starvation', 'disease', 'starving time'] },
      ],
    },
    'thirteen-colonies': {
      questions: [
        { q: 'How did the New England colonies differ from the Southern colonies?', a: 'New England had small farms, trade, and religious communities; the South had plantations and enslaved labor', alts: ['new england trade and farming', 'south plantations'] },
        { q: 'What were the Middle colonies known for?', a: 'religious diversity, fertile farmland (breadbasket), and trade', alts: ['breadbasket', 'diversity', 'farming and trade'] },
        { q: 'What was the economy of the Southern colonies based on?', a: 'plantation agriculture using enslaved labor, especially tobacco and rice', alts: ['plantations', 'cash crops', 'slavery'] },
        { q: 'What was the House of Burgesses?', a: 'the first elected legislative assembly in the American colonies, established in Virginia in 1619', alts: ['first legislature', 'virginia legislature'] },
        { q: 'Why did different regions of the colonies develop different economies?', a: 'because of differences in climate, soil, and geography', alts: ['geography', 'climate differences', 'natural resources'] },
        { q: 'What role did religion play in founding the New England colonies?', a: 'Puritans and Pilgrims founded colonies to practice their religion freely', alts: ['religious freedom', 'puritan communities'] },
      ],
    },
    'colonial-society': {
      questions: [
        { q: 'How did the institution of slavery become embedded in colonial America?', a: 'starting with 1619, enslaved Africans were brought to work plantations, and laws gradually made slavery permanent and hereditary', alts: ['laws made it permanent', 'plantation labor demand'] },
        { q: 'What was the difference between indentured servitude and slavery?', a: 'indentured servants worked for a set time then were freed; enslaved people were held for life', alts: ['temporary vs permanent', 'servitude ended, slavery did not'] },
        { q: 'What was daily life like for most colonial women?', a: 'they managed households, raised children, cooked, sewed, and had few legal rights', alts: ['domestic work', 'no legal rights', 'household management'] },
        { q: 'What was the Great Awakening?', a: 'a religious revival movement in the 1730s-1740s that emphasized personal faith and emotional worship', alts: ['religious revival', 'emotional religion'] },
        { q: 'How did the French and Indian War change the relationship between Britain and the colonies?', a: 'Britain taxed the colonies to pay war debts, leading to resentment and eventually revolution', alts: ['taxes', 'war debt led to taxes', 'british control increased'] },
        { q: 'What social class structure existed in colonial America?', a: 'wealthy landowners at top, middle class farmers and merchants, poor laborers, indentured servants, and enslaved people at bottom', alts: ['hierarchical', 'class system', 'wealthy to enslaved'] },
      ],
    },
  },
  'grade-7': {
    'road-to-revolution': {
      questions: [
        { q: 'What was the rallying cry "no taxation without representation" about?', a: 'colonists objected to being taxed by Parliament when they had no elected representatives there', alts: ['taxes without voice in parliament', 'no representation in parliament'] },
        { q: 'What were the Stamp Act and Townshend Acts?', a: 'British taxes on colonial goods — stamps on documents and duties on imports like tea', alts: ['taxes on colonies', 'stamp tax and import duties'] },
        { q: 'What happened at the Boston Massacre?', a: 'British soldiers killed five colonists, which was used as propaganda to fuel anti-British sentiment', alts: ['soldiers shot colonists', 'five killed'] },
        { q: 'What was the Boston Tea Party?', a: 'colonists dumped British tea into Boston Harbor to protest the Tea Act', alts: ['tea dumped in harbor', 'protest against tea tax'] },
        { q: 'What were the Intolerable Acts?', a: 'harsh British laws punishing Massachusetts for the Boston Tea Party', alts: ['coercive acts', 'punishment for boston tea party'] },
        { q: 'Was the American Revolution inevitable? What evidence supports your view?', a: 'arguments can be made both ways — escalating taxes and British responses pushed toward war, but compromise was possible', alts: ['debatable', 'both sides had chances to compromise'] },
      ],
    },
    'declaration-of-independence': {
      questions: [
        { q: 'Who was the primary author of the Declaration of Independence?', a: 'Thomas Jefferson', alts: ['jefferson'] },
        { q: 'What are the three unalienable rights listed in the Declaration?', a: 'life, liberty, and the pursuit of happiness', alts: ['life liberty pursuit of happiness'] },
        { q: 'What Enlightenment philosopher most influenced the Declaration?', a: 'John Locke', alts: ['locke'] },
        { q: 'Whose voices were missing from the Declaration of Independence?', a: 'women, enslaved people, and Native Americans', alts: ['women', 'slaves', 'indigenous people'] },
        { q: 'What does the Declaration say people should do when government violates their rights?', a: 'they have the right to alter or abolish it and create a new government', alts: ['overthrow it', 'replace the government'] },
        { q: 'What is the contradiction between the Declaration stating "all men are created equal" and the reality of 1776?', a: 'many signers owned enslaved people and women had no political rights', alts: ['slavery', 'slaveholders signed it', 'inequality'] },
      ],
    },
    'revolutionary-war': {
      questions: [
        { q: 'What advantages did the British have in the Revolutionary War?', a: 'professional army, powerful navy, more money, and more soldiers', alts: ['larger army', 'stronger navy', 'more resources'] },
        { q: 'What advantages did the American colonists have?', a: 'fighting on home ground, passionate cause, knowledge of terrain, and French alliance', alts: ['home territory', 'french support', 'motivation'] },
        { q: 'Why was the Battle of Saratoga a turning point?', a: 'the American victory convinced France to enter the war as an ally', alts: ['brought france in', 'french alliance'] },
        { q: 'What hardships did soldiers face at Valley Forge?', a: 'extreme cold, starvation, disease, and lack of supplies', alts: ['cold hunger disease', 'terrible conditions'] },
        { q: 'How did the war end?', a: 'British surrendered at Yorktown in 1781 after being trapped by American and French forces', alts: ['yorktown surrender', 'cornwallis surrendered'] },
        { q: 'How did enslaved people experience the Revolution?', a: 'some fought for freedom on both sides; British promised freedom to those who escaped; most remained enslaved', alts: ['some fought for freedom', 'british promised freedom'] },
      ],
    },
    'articles-of-confederation': {
      questions: [
        { q: 'What was the Articles of Confederation?', a: 'the first constitution of the United States, creating a weak central government', alts: ['first government', 'first constitution'] },
        { q: 'Why was the central government weak under the Articles?', a: 'it could not tax, had no executive or judicial branch, and needed unanimous consent to amend', alts: ['no taxes', 'no president', 'too weak'] },
        { q: 'What was Shays Rebellion and why did it matter?', a: 'farmers rebelled over debt and taxes, showing the government was too weak to maintain order', alts: ['farmer revolt', 'showed weakness of articles'] },
        { q: 'What could the government NOT do under the Articles?', a: 'levy taxes, regulate trade, or enforce laws', alts: ['no taxing power', 'no trade regulation'] },
        { q: 'Why did the states want a weak central government?', a: 'they feared tyranny after their experience with British rule', alts: ['feared strong government', 'afraid of tyranny'] },
        { q: 'What did the Articles prove about government?', a: 'that a government needs enough power to function — too weak is as dangerous as too strong', alts: ['need balance of power', 'too weak doesnt work'] },
      ],
    },
    'constitutional-convention': {
      questions: [
        { q: 'What was the Great Compromise?', a: 'created a two-house Congress — Senate with equal representation and House based on population', alts: ['two houses', 'senate and house compromise'] },
        { q: 'What was the Three-Fifths Compromise?', a: 'enslaved people counted as three-fifths of a person for representation and taxation', alts: ['slaves counted as 3/5', 'three fifths of a person'] },
        { q: 'Why is the Three-Fifths Compromise considered a moral failure?', a: 'it treated enslaved people as less than human and gave slaveholding states more political power', alts: ['dehumanizing', 'benefited slaveholders'] },
        { q: 'What was the debate between Federalists and Anti-Federalists?', a: 'Federalists wanted a strong central government; Anti-Federalists feared it would threaten liberty', alts: ['strong vs weak government', 'power debate'] },
        { q: 'Why was the Bill of Rights added to the Constitution?', a: 'to convince Anti-Federalists to ratify by guaranteeing protection of individual rights', alts: ['protect rights', 'anti-federalist demand'] },
        { q: 'Who is known as the Father of the Constitution?', a: 'James Madison', alts: ['madison'] },
      ],
    },
    'early-republic': {
      questions: [
        { q: 'Why was George Washington important as the first president?', a: 'he set precedents like the two-term limit, cabinet system, and peaceful transfer of power', alts: ['set precedents', 'established traditions'] },
        { q: 'What was the conflict between Hamilton and Jefferson about?', a: 'Hamilton wanted a strong federal government and national bank; Jefferson wanted states rights and an agrarian republic', alts: ['federal power vs states rights', 'bank debate'] },
        { q: 'What was the Alien and Sedition Acts controversy?', a: 'Adams signed laws restricting immigration and criminalizing criticism of the government, seen as violating the First Amendment', alts: ['limited free speech', 'anti-immigrant and anti-speech laws'] },
        { q: 'Why was the election of 1800 called the Revolution of 1800?', a: 'power transferred peacefully from one party to another for the first time', alts: ['peaceful transfer of power', 'jefferson replaced adams peacefully'] },
        { q: 'What was the Louisiana Purchase?', a: 'Jefferson bought a vast territory from France in 1803, doubling the size of the US', alts: ['bought land from france', 'doubled us territory'] },
        { q: 'What challenges did the new nation face in its early years?', a: 'establishing legitimacy, paying war debts, dealing with foreign threats, and defining federal power', alts: ['debt', 'foreign relations', 'defining government power'] },
      ],
    },
    'westward-expansion': {
      questions: [
        { q: 'What was Manifest Destiny?', a: 'the belief that Americans were destined by God to expand across the continent', alts: ['divine right to expand', 'destined to spread across america'] },
        { q: 'What did the Louisiana Purchase accomplish?', a: 'it doubled the size of the US and opened the West for exploration and settlement', alts: ['doubled territory', 'opened the west'] },
        { q: 'What was the Oregon Trail?', a: 'a 2,000-mile route used by settlers traveling to the Pacific Northwest', alts: ['trail west', 'settler route to oregon'] },
        { q: 'How did the Mexican-American War expand US territory?', a: 'the US gained California, Nevada, Utah, Arizona, New Mexico, and parts of other states', alts: ['gained southwest', 'mexican cession'] },
        { q: 'What was the Gold Rush of 1849?', a: 'discovery of gold in California brought hundreds of thousands of people west seeking fortune', alts: ['gold in california', 'forty-niners'] },
        { q: 'Was Manifest Destiny a vision or an excuse? Explain.', a: 'it can be seen as both — a genuine belief in American destiny and an excuse for taking Native American and Mexican land', alts: ['both', 'justified expansion', 'excuse for conquest'] },
      ],
    },
    'manifest-destiny': {
      questions: [
        { q: 'Who benefited most from Manifest Destiny?', a: 'white American settlers and land speculators', alts: ['white settlers', 'american settlers'] },
        { q: 'Who suffered most from Manifest Destiny?', a: 'Native Americans who were displaced from their ancestral lands', alts: ['native americans', 'indigenous peoples'] },
        { q: 'How did Manifest Destiny contribute to the debate over slavery?', a: 'every new territory raised the question of whether it would allow slavery', alts: ['slave state vs free state', 'extension of slavery debate'] },
        { q: 'What was the Missouri Compromise?', a: 'an 1820 agreement admitting Missouri as a slave state and Maine as free, with a line dividing future territories', alts: ['compromise on slavery', 'divided territories at 36-30 line'] },
        { q: 'What was the Compromise of 1850?', a: 'admitted California as free state, created popular sovereignty in new territories, and strengthened the Fugitive Slave Act', alts: ['california free', 'popular sovereignty'] },
        { q: 'How did expansion increase sectionalism?', a: 'North and South increasingly disagreed about slavery in new territories, driving them apart', alts: ['slavery debate intensified', 'north south divide grew'] },
      ],
    },
    'indian-removal': {
      questions: [
        { q: 'What was the Indian Removal Act of 1830?', a: 'a law signed by Andrew Jackson forcing Native Americans to move west of the Mississippi River', alts: ['forced relocation', 'jackson removed native americans'] },
        { q: 'What was the Trail of Tears?', a: 'the forced march of Cherokee and other nations to Indian Territory where thousands died', alts: ['forced cherokee march', 'thousands died on march'] },
        { q: 'How many Cherokee died on the Trail of Tears?', a: 'approximately 4,000 out of 15,000', alts: ['about 4000', 'thousands'] },
        { q: 'What did the Supreme Court rule in Worcester v. Georgia?', a: 'that Georgia had no authority over Cherokee lands — but Jackson ignored the ruling', alts: ['cherokee had rights', 'jackson defied the court'] },
        { q: 'Why did the US government want to remove Native Americans?', a: 'to take their land for white settlement and farming, especially after gold was found on Cherokee land', alts: ['land for settlers', 'gold on cherokee land'] },
        { q: 'What does Indian Removal tell us about the limits of democracy?', a: 'democratic governments can commit injustices when the majority ignores minority rights', alts: ['majority can be wrong', 'democracy failed native americans'] },
      ],
    },
    'slavery-expansion': {
      questions: [
        { q: 'How did the cotton gin affect slavery?', a: 'it made cotton enormously profitable, increasing demand for enslaved labor', alts: ['more cotton more slavery', 'increased demand for slaves'] },
        { q: 'What was life like for enslaved people on plantations?', a: 'brutal forced labor, family separation, physical punishment, denial of education, and no legal rights', alts: ['harsh conditions', 'no freedom', 'whipping and abuse'] },
        { q: 'How did enslaved people resist slavery?', a: 'through rebellions, running away, work slowdowns, maintaining culture, and secret education', alts: ['rebellion', 'escape', 'underground railroad', 'cultural preservation'] },
        { q: 'What was the Underground Railroad?', a: 'a network of secret routes and safe houses used by enslaved people to escape to freedom', alts: ['escape network', 'route to freedom'] },
        { q: 'Who was Harriet Tubman?', a: 'an escaped enslaved woman who returned to the South multiple times to lead others to freedom on the Underground Railroad', alts: ['conductor on underground railroad', 'freed enslaved people'] },
        { q: 'How did slavery affect the entire nation, not just the South?', a: 'Northern factories processed Southern cotton, Northern banks financed plantations, and the entire economy depended on slave labor', alts: ['north profited too', 'national economy depended on it'] },
      ],
    },
    'abolition-movement': {
      questions: [
        { q: 'Who was Frederick Douglass?', a: 'an escaped enslaved man who became the most prominent abolitionist speaker and writer', alts: ['abolitionist leader', 'escaped slave who fought against slavery'] },
        { q: 'What was William Lloyd Garrison known for?', a: 'publishing The Liberator, an anti-slavery newspaper demanding immediate abolition', alts: ['the liberator', 'abolitionist newspaper'] },
        { q: 'What strategies did abolitionists use to fight slavery?', a: 'speeches, newspapers, petitions, the Underground Railroad, and political organizing', alts: ['speaking writing organizing', 'multiple strategies'] },
        { q: 'How did Harriet Beecher Stowe influence the abolition movement?', a: 'her novel Uncle Toms Cabin showed the horrors of slavery to a wide audience', alts: ['uncle toms cabin', 'book about slavery'] },
        { q: 'What was the Seneca Falls Convention and how did it connect to abolition?', a: 'an 1848 womens rights convention — many abolitionists were also fighting for womens rights', alts: ['womens rights meeting', 'overlap with abolition'] },
        { q: 'Why did some abolitionists disagree about the best approach to ending slavery?', a: 'some wanted gradual change through politics while others demanded immediate abolition, and some supported armed resistance', alts: ['gradual vs immediate', 'political vs radical'] },
      ],
    },
    'reform-movements': {
      questions: [
        { q: 'What was the Second Great Awakening?', a: 'a religious revival in the early 1800s that inspired social reform movements', alts: ['religious revival', 'spiritual movement'] },
        { q: 'What reforms did Horace Mann push for in education?', a: 'free public education for all children, trained teachers, and longer school years', alts: ['public schools', 'education for all'] },
        { q: 'What was the temperance movement?', a: 'a movement to ban or limit alcohol consumption', alts: ['anti-alcohol', 'ban drinking'] },
        { q: 'What did Dorothea Dix advocate for?', a: 'better treatment of people with mental illness and prison reform', alts: ['mental health reform', 'humane treatment'] },
        { q: 'What was the Declaration of Sentiments?', a: 'a document at Seneca Falls modeled on the Declaration of Independence demanding equal rights for women', alts: ['womens rights document', 'seneca falls declaration'] },
        { q: 'How did reform movements reflect American democratic ideals?', a: 'reformers used democratic principles of equality and liberty to argue for expanding rights', alts: ['applied founding ideals', 'extending democracy'] },
      ],
    },
  },
  'grade-8': {
    'causes-of-civil-war': {
      questions: [
        { q: 'Was slavery the primary cause of the Civil War? What evidence supports this?', a: 'yes — Southern states explicitly cited slavery in their secession declarations', alts: ['yes', 'slavery was the main cause', 'states said so themselves'] },
        { q: 'What was states rights really about in the context of secession?', a: 'primarily the right of states to maintain and expand slavery', alts: ['right to own slaves', 'slavery'] },
        { q: 'What role did the election of Abraham Lincoln play in secession?', a: 'Southern states seceded because Lincoln opposed the expansion of slavery into new territories', alts: ['south feared lincoln would end slavery', 'lincoln opposed slavery expansion'] },
        { q: 'What was the Dred Scott decision and how did it increase tensions?', a: 'the Supreme Court ruled enslaved people were not citizens and Congress could not ban slavery in territories', alts: ['denied black citizenship', 'protected slavery'] },
        { q: 'What was Bleeding Kansas?', a: 'violent conflict in Kansas between pro-slavery and anti-slavery settlers over whether Kansas would be free or slave', alts: ['violence over slavery in kansas', 'pro and anti slavery fighting'] },
        { q: 'How did John Browns raid on Harpers Ferry affect the nation?', a: 'it terrified the South and inspired abolitionists, deepening the divide between North and South', alts: ['deepened divide', 'scared south inspired north'] },
      ],
    },
    'lincoln-leadership': {
      questions: [
        { q: 'How did Lincolns views on slavery evolve during the war?', a: 'he began focused on saving the Union and gradually moved toward abolition as a moral and military necessity', alts: ['evolved toward abolition', 'started with union moved to freedom'] },
        { q: 'What was the purpose of the Gettysburg Address?', a: 'to honor fallen soldiers and redefine the war as a fight for equality and democracy', alts: ['honor dead', 'new birth of freedom'] },
        { q: 'Why did Lincoln issue the Emancipation Proclamation as a military order?', a: 'to weaken the Confederacy by freeing enslaved people in rebel states and allowing Black soldiers to enlist', alts: ['military strategy', 'weaken confederacy'] },
        { q: 'What leadership qualities did Lincoln demonstrate during the war?', a: 'patience, willingness to change his mind, ability to communicate, and moral courage', alts: ['flexibility', 'moral strength', 'communication'] },
        { q: 'How did Lincoln handle opposition within his own party?', a: 'he appointed rivals to his cabinet (team of rivals) and found compromise between radicals and moderates', alts: ['team of rivals', 'included opponents'] },
        { q: 'What was Lincolns plan for Reconstruction before his assassination?', a: 'a lenient plan to quickly reunite the nation with minimal punishment for the South', alts: ['lenient reconstruction', 'quick reunification'] },
      ],
    },
    'emancipation': {
      questions: [
        { q: 'What did the Emancipation Proclamation actually do?', a: 'it freed enslaved people only in Confederate states — not in border states that stayed in the Union', alts: ['freed slaves in rebel states', 'did not free all enslaved people'] },
        { q: 'What did the Emancipation Proclamation NOT do?', a: 'it did not free enslaved people in border states loyal to the Union or end slavery completely', alts: ['border states excluded', 'did not end all slavery'] },
        { q: 'How did Black soldiers contribute to the Union war effort?', a: 'about 180,000 Black men served in the Union army and navy, fighting bravely in many battles', alts: ['180000 served', 'fought for union'] },
        { q: 'What was the 54th Massachusetts Regiment?', a: 'one of the first Black regiments in the Union Army, famous for their bravery at Fort Wagner', alts: ['black regiment', 'fort wagner'] },
        { q: 'How did enslaved people contribute to their own liberation?', a: 'they fled to Union lines, provided intelligence, sabotaged Confederate efforts, and served as soldiers', alts: ['escaped', 'served as spies', 'joined union army'] },
        { q: 'Which amendment finally abolished slavery everywhere in the US?', a: 'the 13th Amendment in 1865', alts: ['13th amendment', 'thirteenth amendment'] },
      ],
    },
    'reconstruction': {
      questions: [
        { q: 'What was the main goal of Reconstruction?', a: 'to rebuild the South, reintegrate former Confederate states, and define the rights of formerly enslaved people', alts: ['rebuild south', 'reintegrate states', 'define black rights'] },
        { q: 'What were the Freedmens Bureau and what did it do?', a: 'a government agency that provided food, housing, education, and legal help to formerly enslaved people', alts: ['helped freed slaves', 'provided education and aid'] },
        { q: 'What were Black Codes?', a: 'laws passed by Southern states to restrict the freedom of Black Americans and force them into labor', alts: ['laws limiting black freedom', 'restrictions on freed people'] },
        { q: 'What was sharecropping?', a: 'a system where freed people farmed land they did not own in exchange for a share of the crop, keeping them in poverty', alts: ['farming for a share', 'economic exploitation'] },
        { q: 'How did Black Americans participate in government during Reconstruction?', a: 'they voted, held local and state offices, and served in Congress', alts: ['voted and held office', 'served in congress'] },
        { q: 'Was Reconstruction a success or failure?', a: 'both — it established constitutional protections but failed to create lasting equality when it ended', alts: ['mixed results', 'amendments but not enforcement'] },
      ],
    },
    'reconstruction-amendments': {
      questions: [
        { q: 'What did the 13th Amendment do?', a: 'abolished slavery in the United States', alts: ['ended slavery', 'banned slavery'] },
        { q: 'What did the 14th Amendment establish?', a: 'citizenship for all born in the US and equal protection under the law', alts: ['equal protection', 'citizenship for all'] },
        { q: 'What did the 15th Amendment guarantee?', a: 'the right to vote regardless of race', alts: ['black men could vote', 'voting rights for all races'] },
        { q: 'Why are these three amendments called the Reconstruction Amendments?', a: 'they were passed during Reconstruction to transform the Constitution and protect the rights of formerly enslaved people', alts: ['protect freed people', 'post civil war amendments'] },
        { q: 'How were the Reconstruction Amendments undermined after 1877?', a: 'through Jim Crow laws, poll taxes, literacy tests, and violence that prevented Black Americans from exercising their rights', alts: ['jim crow', 'voter suppression', 'segregation'] },
        { q: 'Why is the 14th Amendment considered one of the most important amendments?', a: 'it applied constitutional protections to state governments and became the basis for civil rights and equal protection', alts: ['equal protection', 'applies to states', 'civil rights foundation'] },
      ],
    },
    'end-of-reconstruction': {
      questions: [
        { q: 'What event effectively ended Reconstruction in 1877?', a: 'the Compromise of 1877 removed federal troops from the South in exchange for resolving a disputed presidential election', alts: ['compromise of 1877', 'troops withdrawn'] },
        { q: 'What happened to Black rights after Reconstruction ended?', a: 'Jim Crow laws imposed segregation, voting restrictions, and systematic discrimination', alts: ['jim crow', 'segregation', 'lost rights'] },
        { q: 'What were Jim Crow laws?', a: 'state and local laws enforcing racial segregation in the South', alts: ['segregation laws', 'laws separating races'] },
        { q: 'What was the KKK and what role did it play after Reconstruction?', a: 'a white supremacist terrorist group that used violence to intimidate Black Americans and their allies', alts: ['terrorist group', 'white supremacists using violence'] },
        { q: 'How long would it take before the promises of Reconstruction were fulfilled?', a: 'nearly a century — until the Civil Rights Movement of the 1950s and 1960s', alts: ['almost 100 years', 'civil rights era'] },
        { q: 'What lessons does the end of Reconstruction teach about protecting rights?', a: 'rights written in law mean nothing without enforcement and continued political will', alts: ['laws need enforcement', 'rights require vigilance'] },
      ],
    },
    'industrialization': {
      questions: [
        { q: 'How did the Industrial Revolution change American life?', a: 'shifted from farm-based to factory-based economy, created cities, changed work, and created wealth and poverty', alts: ['farms to factories', 'urbanization', 'economic transformation'] },
        { q: 'Who were the "robber barons" or "captains of industry"?', a: 'wealthy industrialists like Carnegie, Rockefeller, and Vanderbilt who built massive businesses', alts: ['carnegie rockefeller', 'wealthy businessmen'] },
        { q: 'What was the impact of the railroad on American development?', a: 'it connected the country, enabled trade, drove economic growth, and opened the West', alts: ['connected nation', 'enabled trade', 'opened west'] },
        { q: 'What were working conditions like in factories?', a: 'long hours, low pay, dangerous conditions, child labor, and no protections', alts: ['dangerous', 'low pay', 'child labor'] },
        { q: 'What was the role of child labor in industrialization?', a: 'children worked in factories and mines for low pay in dangerous conditions', alts: ['children worked', 'exploited children'] },
        { q: 'How did industrialization create both progress and problems?', a: 'it created wealth, technology, and growth but also inequality, pollution, and exploitation', alts: ['good and bad', 'progress and exploitation'] },
      ],
    },
    'immigration-waves': {
      questions: [
        { q: 'Why did millions of immigrants come to America in the late 1800s?', a: 'escaping poverty, persecution, and war; seeking economic opportunity and freedom', alts: ['economic opportunity', 'escape persecution', 'better life'] },
        { q: 'What was Ellis Island?', a: 'the main immigration processing center in New York Harbor from 1892 to 1954', alts: ['immigration center', 'entry point for immigrants'] },
        { q: 'How were immigrants treated when they arrived?', a: 'many faced discrimination, low-paying jobs, crowded tenements, and nativist hostility', alts: ['discrimination', 'poor conditions', 'nativism'] },
        { q: 'What was nativism?', a: 'hostility toward immigrants based on the belief that native-born Americans are superior', alts: ['anti-immigrant', 'prejudice against immigrants'] },
        { q: 'How did immigrants change American culture?', a: 'they brought diverse languages, foods, traditions, religions, and skills that enriched American society', alts: ['cultural diversity', 'enriched culture'] },
        { q: 'What was the Chinese Exclusion Act?', a: 'an 1882 law banning Chinese immigration — the first law to exclude an entire nationality', alts: ['banned chinese immigrants', 'first racial immigration ban'] },
      ],
    },
    'progressive-era': {
      questions: [
        { q: 'What problems did Progressive reformers try to fix?', a: 'corruption, monopolies, unsafe food and drugs, child labor, and political machines', alts: ['corruption', 'monopolies', 'social problems'] },
        { q: 'Who were muckrakers?', a: 'journalists who exposed corruption and social problems to the public', alts: ['investigative journalists', 'reformist writers'] },
        { q: 'What did Upton Sinclair expose in The Jungle?', a: 'the horrific conditions in the meatpacking industry', alts: ['meatpacking', 'food safety problems'] },
        { q: 'What did the 19th Amendment accomplish?', a: 'gave women the right to vote in 1920', alts: ['womens suffrage', 'women could vote'] },
        { q: 'What was the purpose of trust-busting?', a: 'to break up monopolies that eliminated competition and harmed consumers', alts: ['break monopolies', 'restore competition'] },
        { q: 'How did the Progressive Era connect to democratic ideals?', a: 'reformers used democratic principles to argue for expanding rights and limiting corporate power', alts: ['extended democracy', 'applied democratic ideals'] },
      ],
    },
    'labor-movement': {
      questions: [
        { q: 'Why did workers form labor unions?', a: 'to bargain collectively for better wages, shorter hours, and safer conditions', alts: ['better conditions', 'collective bargaining'] },
        { q: 'What was the Triangle Shirtwaist Factory fire?', a: 'a 1911 fire that killed 146 workers, mostly young immigrant women, and led to workplace safety laws', alts: ['factory fire', 'led to safety reforms'] },
        { q: 'What is collective bargaining?', a: 'when workers negotiate as a group with employers over wages and conditions', alts: ['group negotiation', 'union negotiation'] },
        { q: 'How did business owners fight against unions?', a: 'through lockouts, strikebreakers, court injunctions, and violence', alts: ['strikebreakers', 'fired union workers', 'used courts'] },
        { q: 'What was the significance of the Pullman Strike?', a: 'a nationwide railroad strike that the federal government broke using troops, showing government sided with business', alts: ['federal troops broke strike', 'government supported business'] },
        { q: 'How did the labor movement improve life for all workers?', a: 'it led to minimum wage, 8-hour day, safety regulations, and end of child labor', alts: ['better conditions for all', 'workplace protections'] },
      ],
    },
    'urbanization': {
      questions: [
        { q: 'Why did cities grow rapidly during industrialization?', a: 'factories attracted workers from rural areas and immigrants seeking jobs', alts: ['jobs in factories', 'immigrants and rural migration'] },
        { q: 'What were tenements?', a: 'overcrowded, poorly built apartment buildings where immigrants and workers lived', alts: ['slum housing', 'crowded apartments'] },
        { q: 'What problems did rapid urbanization create?', a: 'overcrowding, poor sanitation, disease, crime, and fire hazards', alts: ['overcrowding', 'disease', 'poor conditions'] },
        { q: 'Who was Jacob Riis and what did he expose?', a: 'a photographer and journalist who documented terrible living conditions in New York tenements', alts: ['photographed slums', 'how the other half lives'] },
        { q: 'What were political machines?', a: 'corrupt political organizations that controlled city governments by trading favors for votes', alts: ['corrupt city politics', 'tammany hall'] },
        { q: 'How did reformers try to improve city life?', a: 'through building codes, sanitation systems, public parks, settlement houses, and anti-corruption campaigns', alts: ['settlement houses', 'building codes', 'sanitation'] },
      ],
    },
    'technological-change': {
      questions: [
        { q: 'How did the telegraph and telephone change communication?', a: 'they allowed instant long-distance communication for the first time', alts: ['instant communication', 'connected distant places'] },
        { q: 'What was the impact of Edisons inventions?', a: 'the light bulb and electrical systems transformed daily life, work, and cities', alts: ['light bulb', 'electricity changed everything'] },
        { q: 'How did the transcontinental railroad change America?', a: 'it connected East and West, enabling trade, travel, and settlement across the continent', alts: ['connected country', 'east to west travel'] },
        { q: 'What was the impact of steel production on industrialization?', a: 'cheap steel made skyscrapers, bridges, railroads, and machinery possible', alts: ['enabled construction', 'buildings and bridges'] },
        { q: 'How did new technology affect farming?', a: 'mechanical reapers and steel plows increased production but reduced the need for farm workers', alts: ['more production fewer workers', 'mechanized farming'] },
        { q: 'How does technological change create both winners and losers?', a: 'new technology creates new jobs and wealth but also eliminates old jobs and disrupts communities', alts: ['creates and destroys', 'progress has costs'] },
      ],
    },
    'world-wars-overview': {
      questions: [
        { q: 'Why did the US enter World War I?', a: 'unrestricted submarine warfare, the Zimmermann telegram, and desire to make the world safe for democracy', alts: ['submarine warfare', 'zimmermann telegram'] },
        { q: 'How did World War I change America?', a: 'expanded federal power, accelerated the Great Migration, gave women new roles, and made the US a world power', alts: ['became world power', 'great migration'] },
        { q: 'What caused the US to enter World War II?', a: 'the Japanese attack on Pearl Harbor on December 7, 1941', alts: ['pearl harbor', 'japan attacked'] },
        { q: 'What was the Holocaust?', a: 'the systematic murder of six million Jews and millions of others by Nazi Germany', alts: ['genocide', 'nazi murder of jews'] },
        { q: 'How did the home front change during WWII?', a: 'women entered the workforce, rationing was imposed, and Japanese Americans were unjustly interned', alts: ['women worked', 'japanese internment', 'rosie the riveter'] },
        { q: 'What were the lasting effects of World War II?', a: 'the US became a superpower, the UN was created, the Cold War began, and decolonization accelerated', alts: ['superpower status', 'cold war began', 'united nations'] },
      ],
    },
    'great-depression-new-deal': {
      questions: [
        { q: 'What caused the Great Depression?', a: 'stock market crash, bank failures, overproduction, and reduced consumer spending', alts: ['stock market crash', 'bank failures'] },
        { q: 'How did the Great Depression affect ordinary Americans?', a: 'massive unemployment, poverty, homelessness, hunger, and loss of savings', alts: ['unemployment', 'poverty', 'lost everything'] },
        { q: 'What was the New Deal?', a: 'President Roosevelts programs to provide relief, recovery, and reform during the Depression', alts: ['fdr programs', 'relief recovery reform'] },
        { q: 'Name two New Deal programs and what they did.', a: 'Social Security provided retirement income; the CCC employed young men in conservation work', alts: ['social security', 'ccc', 'wpa', 'fdic'] },
        { q: 'How did the New Deal change the role of government?', a: 'it established that the federal government has a responsibility to help citizens during economic crises', alts: ['expanded government role', 'government safety net'] },
        { q: 'Did the New Deal end the Depression?', a: 'it provided relief and reform but World War II spending is what fully ended the Depression', alts: ['no wwii ended it', 'helped but didnt end it'] },
      ],
    },
    'civil-rights-movement': {
      questions: [
        { q: 'What did the Civil Rights Movement fight for?', a: 'equal rights for Black Americans including ending segregation, voting rights, and equal opportunity', alts: ['equality', 'end segregation', 'voting rights'] },
        { q: 'Who was Martin Luther King Jr. and what was his approach?', a: 'a civil rights leader who advocated nonviolent protest and civil disobedience', alts: ['nonviolent leader', 'peaceful protest'] },
        { q: 'What was the Montgomery Bus Boycott?', a: 'a 1955-56 boycott sparked by Rosa Parks that ended bus segregation in Montgomery, Alabama', alts: ['rosa parks boycott', 'bus desegregation'] },
        { q: 'What was the Civil Rights Act of 1964?', a: 'a law banning discrimination based on race, color, religion, sex, or national origin', alts: ['banned discrimination', 'ended legal segregation'] },
        { q: 'What was the Voting Rights Act of 1965?', a: 'a law that banned discriminatory voting practices like literacy tests', alts: ['protected voting rights', 'ended voter suppression'] },
        { q: 'How does the Civil Rights Movement connect to the unfulfilled promises of Reconstruction?', a: 'it finally delivered on the equality promised by the 13th, 14th, and 15th Amendments nearly a century later', alts: ['fulfilled reconstruction promises', 'completed unfinished work'] },
      ],
    },
    'cold-war-basics': {
      questions: [
        { q: 'What was the Cold War?', a: 'a decades-long rivalry between the US and Soviet Union without direct military conflict', alts: ['us vs ussr', 'superpower rivalry'] },
        { q: 'What were the two competing ideologies of the Cold War?', a: 'capitalism and democracy vs communism and authoritarianism', alts: ['capitalism vs communism', 'democracy vs communism'] },
        { q: 'What was the arms race?', a: 'competition between the US and USSR to build more nuclear weapons', alts: ['nuclear weapons competition', 'building nukes'] },
        { q: 'What was the Space Race?', a: 'competition between the US and USSR to achieve firsts in space exploration', alts: ['space competition', 'race to the moon'] },
        { q: 'How did the Cold War affect American society?', a: 'it created fear of communism, led to the Red Scare, increased military spending, and shaped foreign policy', alts: ['red scare', 'mccarthyism', 'fear of communism'] },
        { q: 'When and how did the Cold War end?', a: 'it ended around 1991 with the collapse of the Soviet Union', alts: ['soviet union collapsed', '1991'] },
      ],
    },
    'modern-challenges': {
      questions: [
        { q: 'What is one major challenge facing America today that has roots in its history?', a: 'racial inequality, which traces back to slavery, Jim Crow, and systemic discrimination', alts: ['racism', 'inequality', 'immigration', 'economic inequality'] },
        { q: 'How does immigration continue to shape American identity?', a: 'America continues to be shaped by immigrants bringing diverse cultures, skills, and perspectives', alts: ['cultural diversity', 'ongoing immigration'] },
        { q: 'What is the ongoing debate about the balance between security and liberty?', a: 'Americans debate how much freedom to give up for safety, especially after events like 9/11', alts: ['security vs freedom', 'post 911 debate'] },
        { q: 'How does economic inequality connect to American history?', a: 'patterns of inequality trace back through industrialization, slavery, discrimination, and policy choices', alts: ['historical roots of inequality'] },
        { q: 'Why is understanding history important for addressing modern challenges?', a: 'history reveals the roots of current problems and shows what has and has not worked before', alts: ['learn from the past', 'understand how we got here'] },
        { q: 'What responsibility do citizens have to address social problems?', a: 'democratic citizens have a responsibility to be informed, engaged, and to work for justice', alts: ['civic engagement', 'informed participation'] },
      ],
    },
    'connecting-past-present': {
      questions: [
        { q: 'How does the debate over immigration today echo historical patterns?', a: 'nativism, debates over assimilation, and economic arguments are similar to those in the 1800s and early 1900s', alts: ['same debates repeat', 'historical parallels'] },
        { q: 'How does the ongoing struggle for racial equality connect to Reconstruction?', a: 'the unfinished work of Reconstruction — full equality and justice — continues today', alts: ['reconstruction promises still unfulfilled', 'ongoing struggle'] },
        { q: 'How do debates about government power echo the Federalist vs Anti-Federalist debate?', a: 'Americans still debate how much power the federal government should have versus states and individuals', alts: ['same debate continues', 'big vs small government'] },
        { q: 'How does Manifest Destiny connect to modern debates about American power in the world?', a: 'the idea that America has a special mission in the world continues in foreign policy debates', alts: ['american exceptionalism', 'us role in world'] },
        { q: 'What can we learn from studying how reform movements succeeded?', a: 'change requires organizing, persistence, coalition-building, and connecting to democratic ideals', alts: ['how change happens', 'organizing works'] },
        { q: 'Why does the saying "those who cannot remember the past are condemned to repeat it" matter?', a: 'studying history helps us recognize patterns and make better decisions about the future', alts: ['learn from mistakes', 'avoid repeating errors'] },
      ],
    },
  },
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) { try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); } }
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}
function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

// Helpers

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}
function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }
function norm(s) { return String(s).toLowerCase().trim().replace(/[^a-z0-9 ']/g, ''); }

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank) return { error: `No content bank for ${grade}/${skill}` };
  if (bank.questions) {
    const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, acceptedAnswers: q.alts || [] }));
    return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each question.', items };
  }
  return { error: `Cannot generate exercise for ${grade}/${skill}` };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSUSHistory {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, grade: p.grade, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setGrade(id, grade) { if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}. Valid: ${Object.keys(SKILLS).join(', ')}`); const p = loadProfile(id); p.grade = grade; saveProfile(p); return { studentId: id, grade }; }
  recordAssessment(id, grade, category, skill, score, total, notes = '') {
    if (!SKILLS[grade]) throw new Error(`Unknown grade: ${grade}`);
    if (!SKILLS[grade][category]) throw new Error(`Unknown category '${category}' for ${grade}`);
    if (!SKILLS[grade][category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${grade}/${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id); if (!p.grade) p.grade = grade;
    const entry = { date: new Date().toISOString(), grade, category, skill, score, total, notes }; p.assessments.push(entry);
    const key = `${grade}/${category}/${skill}`; if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total }); p.skills[key].mastery = calcMastery(p.skills[key].attempts); p.skills[key].label = masteryLabel(p.skills[key].mastery); saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }
  getProgress(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const gs = SKILLS[grade] || {}; const results = {}; let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(gs)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[`${grade}/${cat}/${sk}`]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } }
    return { studentId: id, grade, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }
  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS[grade] || {})) { for (const sk of skills) { const d = p.skills[`${grade}/${cat}/${sk}`]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ grade, category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } }
    const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, grade, next: candidates.slice(0, count) };
  }
  getReport(id) { const p = loadProfile(id); return { studentId: id, grade: p.grade, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog(grade) { const gs = SKILLS[grade]; if (!gs) return { grade, error: `Unknown grade. Valid: ${Object.keys(SKILLS).join(', ')}` }; let total = 0; const catalog = {}; for (const [cat, skills] of Object.entries(gs)) { total += skills.length; catalog[cat] = [...skills]; } return { grade, skills: catalog, totalSkills: total }; }
  generateExercise(grade, skill, count = 5) { return generateExercise(grade, skill, count); }
  checkAnswer(type, expected, answer) { let exp = expected; if (typeof exp === 'string') { const bank = Object.values(CONTENT_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp)); if (bank) { const q = bank.questions.find(q => q.a === exp); if (q && q.alts) exp = [exp, ...q.alts]; } } return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer }; }
  generateLesson(id) {
    const p = loadProfile(id); const grade = p.grade || 'grade-6'; const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    return { studentId: id, grade, targetSkill: target, exercise, lessonPlan: { hook: 'Present a compelling question or primary source (3 min)', teach: `Introduce/reinforce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, think: 'Analyze causation, perspective, or significance', connect: 'How does this connect to the present?' } };
  }
}

module.exports = MSUSHistory;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new MSUSHistory(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, grade] = args; if (!id) throw new Error('Usage: start <id> [grade]'); if (grade) api.setGrade(id, grade); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); const grade = loadProfile(id).grade || 'grade-6'; if (skill) { out(api.generateExercise(grade, skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); let exp = expected; try { exp = JSON.parse(expected); } catch {} out(api.checkAnswer(type, exp, answer)); break; }
      case 'record': { const [, id, grade, cat, skill, sc, tot, ...notes] = args; if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      default: out({ usage: 'node us-history.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
