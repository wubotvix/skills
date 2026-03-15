// eClaw HS US History Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-us-history');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'colonial-foundations': {
    name: 'Colonial Foundations (1491-1754)',
    topics: ['columbian-exchange', 'colonial-regions', 'slavery-origins', 'mercantilism', 'indigenous-societies'],
  },
  'revolution-constitution': {
    name: 'Revolution & Constitution (1754-1800)',
    topics: ['enlightenment-influence', 'declaration-of-independence', 'articles-of-confederation', 'constitutional-debates', 'bill-of-rights'],
  },
  'antebellum-civil-war': {
    name: 'Antebellum & Civil War (1800-1865)',
    topics: ['manifest-destiny', 'reform-movements', 'sectional-crisis', 'civil-war-causes', 'civil-war-course'],
  },
  'reconstruction-gilded-age': {
    name: 'Reconstruction & Gilded Age (1865-1898)',
    topics: ['reconstruction-amendments', 'freedmens-bureau', 'industrialization', 'immigration-waves', 'labor-movement'],
  },
  'progressive-era-wwi': {
    name: 'Progressive Era & WWI (1890-1920)',
    topics: ['muckrakers', 'trust-busting', 'imperialism', 'wwi-neutrality-to-war', 'home-front'],
  },
  'roaring-twenties-depression': {
    name: 'Roaring Twenties & Depression (1920-1941)',
    topics: ['cultural-change-1920s', 'harlem-renaissance', 'crash-of-1929', 'new-deal-programs', 'dust-bowl'],
  },
  'wwii-cold-war': {
    name: 'WWII & Cold War (1941-1980)',
    topics: ['arsenal-of-democracy', 'home-front-wwii', 'containment', 'korean-war', 'vietnam-war'],
  },
  'civil-rights-modern': {
    name: 'Civil Rights & Modern Era (1950-Present)',
    topics: ['brown-v-board', 'mlk-movement', 'great-society', 'conservative-resurgence', 'post-911'],
  },
};

const QUESTION_BANKS = {
  'colonial-foundations': [
    { type: 'mc', q: 'What was the Columbian Exchange?', choices: ['A transfer of plants, animals, and diseases between hemispheres', 'A trade agreement between Spain and Portugal', 'A system of colonial taxation', 'A navigation route across the Pacific'], answer: 'A', explanation: 'The Columbian Exchange was the widespread transfer of plants, animals, culture, populations, technology, diseases, and ideas between the Americas, West Africa, and the Old World after 1492.' },
    { type: 'mc', q: 'Which colony was founded primarily for religious freedom by Puritans?', choices: ['Virginia', 'Massachusetts Bay', 'Maryland', 'Georgia'], answer: 'B', explanation: 'Massachusetts Bay was founded in 1630 by Puritans seeking to create a "city upon a hill" — a model religious community.' },
    { type: 'mc', q: 'What was the primary labor system in the Southern colonies by the early 1700s?', choices: ['Indentured servitude', 'Free wage labor', 'Chattel slavery', 'Encomienda'], answer: 'C', explanation: 'By the early 1700s, chattel slavery had replaced indentured servitude as the primary labor system in the Southern colonies, driven by tobacco and rice cultivation.' },
    { type: 'mc', q: 'What was mercantilism?', choices: ['A system of free trade between colonies', 'An economic theory that colonies exist to enrich the mother country', 'A form of democratic governance', 'A religious movement in the colonies'], answer: 'B', explanation: 'Mercantilism held that colonies existed to provide raw materials and markets for the mother country, enriching it through a favorable balance of trade.' },
    { type: 'mc', q: 'What was Bacon\'s Rebellion (1676) significant for?', choices: ['It established colonial independence from Britain', 'It revealed class tensions and accelerated the shift to slavery', 'It created the first colonial legislature', 'It ended the French and Indian War'], answer: 'B', explanation: 'Bacon\'s Rebellion exposed tensions between frontier settlers and the colonial elite, and its aftermath accelerated the transition from indentured servitude to African slavery.' },
    { type: 'sa', q: 'Explain one way the Columbian Exchange affected Indigenous populations in the Americas.', answer: 'disease', explanation: 'European diseases like smallpox, measles, and influenza devastated Indigenous populations who had no immunity, causing demographic collapse estimated at 50-90% population loss in many areas.' },
    { type: 'sa', q: 'Describe one key difference between the New England and Southern colonial economies.', answer: 'agriculture', explanation: 'New England had small farms, fishing, shipbuilding, and trade; the South relied on large-scale plantation agriculture (tobacco, rice, indigo) using enslaved labor.' },
    { type: 'sa', q: 'What was the significance of the Mayflower Compact?', answer: 'self-government', explanation: 'The Mayflower Compact (1620) established the principle of self-government and majority rule, serving as a foundation for democratic governance in the colonies.' },
    { type: 'mc', q: 'The Middle Passage refers to:', choices: ['The journey of Pilgrims across the Atlantic', 'The forced transport of enslaved Africans across the Atlantic', 'A trade route through the Appalachian Mountains', 'The navigation of the Northwest Passage'], answer: 'B', explanation: 'The Middle Passage was the brutal transatlantic voyage of enslaved Africans from West Africa to the Americas, characterized by horrific conditions and high mortality.' },
    { type: 'mc', q: 'Which Native American confederation influenced colonial ideas about representative government?', choices: ['Cherokee Nation', 'Iroquois Confederacy', 'Powhatan Confederacy', 'Pueblo peoples'], answer: 'B', explanation: 'The Iroquois Confederacy (Haudenosaunee) had a sophisticated governance structure that influenced some colonial and later American ideas about representative government and federation.' },
  ],
  'revolution-constitution': [
    { type: 'mc', q: 'Which Enlightenment thinker most influenced the Declaration of Independence?', choices: ['Thomas Hobbes', 'Jean-Jacques Rousseau', 'John Locke', 'Baron de Montesquieu'], answer: 'C', explanation: 'John Locke\'s ideas about natural rights (life, liberty, property) and the social contract directly influenced Jefferson\'s Declaration of Independence.' },
    { type: 'mc', q: 'What was the primary weakness of the Articles of Confederation?', choices: ['Too much power for the president', 'No power to tax or regulate commerce', 'Too many branches of government', 'Mandatory military service'], answer: 'B', explanation: 'The Articles created a weak central government that could not levy taxes, regulate interstate commerce, or enforce laws, leading to economic and political instability.' },
    { type: 'mc', q: 'The Great Compromise resolved a dispute over:', choices: ['Slavery', 'Representation in Congress', 'Presidential term limits', 'Judicial review'], answer: 'B', explanation: 'The Great Compromise created a bicameral legislature with proportional representation in the House and equal representation in the Senate.' },
    { type: 'mc', q: 'What did the Three-Fifths Compromise address?', choices: ['How to count enslaved people for representation and taxation', 'The ratio of free states to slave states', 'Voting rights for women', 'Trade tariff rates'], answer: 'A', explanation: 'The Three-Fifths Compromise counted each enslaved person as three-fifths of a person for determining representation and taxation, giving slave states more political power.' },
    { type: 'mc', q: 'Federalist No. 10 argued that:', choices: ['A bill of rights was essential', 'A large republic could control the effects of faction', 'The executive should be weak', 'States should retain sovereignty'], answer: 'B', explanation: 'Madison argued in Federalist No. 10 that a large republic with many competing factions would prevent any single faction from dominating, protecting minority rights.' },
    { type: 'sa', q: 'What was the central disagreement between Federalists and Anti-Federalists?', answer: 'power', explanation: 'Federalists favored a strong central government under the Constitution, while Anti-Federalists feared centralized power and demanded a Bill of Rights to protect individual liberties.' },
    { type: 'sa', q: 'Explain the significance of the Bill of Rights.', answer: 'rights', explanation: 'The Bill of Rights (first 10 amendments) guaranteed individual liberties such as freedom of speech, religion, and press, and was crucial for ratification by addressing Anti-Federalist concerns.' },
    { type: 'mc', q: 'The principle of "separation of powers" was most influenced by:', choices: ['John Locke', 'Baron de Montesquieu', 'Thomas Paine', 'Adam Smith'], answer: 'B', explanation: 'Montesquieu argued in The Spirit of the Laws that government power should be divided among separate branches to prevent tyranny, directly influencing the Constitution\'s structure.' },
    { type: 'mc', q: 'Shays\' Rebellion (1786-87) demonstrated:', choices: ['The strength of state governments', 'The weakness of the national government under the Articles', 'Popular support for the Constitution', 'The success of colonial militias'], answer: 'B', explanation: 'Shays\' Rebellion exposed the inability of the national government under the Articles of Confederation to maintain order, strengthening calls for a stronger federal government.' },
    { type: 'sa', q: 'How did the Hamilton-Jefferson debate shape early American politics?', answer: 'parties', explanation: 'Hamilton favored a strong central government, national bank, and manufacturing; Jefferson favored states\' rights and agrarianism. Their disagreements gave rise to the first political parties (Federalists and Democratic-Republicans).' },
  ],
  'antebellum-civil-war': [
    { type: 'mc', q: 'Manifest Destiny was the belief that:', choices: ['The US should remain neutral in European affairs', 'American expansion across the continent was inevitable and justified', 'Slavery should be abolished immediately', 'States had the right to nullify federal laws'], answer: 'B', explanation: 'Manifest Destiny was the 19th-century belief that American expansion across North America was divinely ordained and inevitable.' },
    { type: 'mc', q: 'The Missouri Compromise (1820) established:', choices: ['The 36°30\' line dividing free and slave territory', 'Universal male suffrage', 'The annexation of Texas', 'The end of the slave trade'], answer: 'A', explanation: 'The Missouri Compromise admitted Missouri as a slave state and Maine as a free state, establishing the 36°30\' line as the boundary between free and slave territory in the Louisiana Purchase.' },
    { type: 'mc', q: 'The Seneca Falls Convention (1848) is most associated with:', choices: ['Abolitionism', 'Women\'s rights', 'Temperance', 'Labor reform'], answer: 'B', explanation: 'The Seneca Falls Convention was the first major women\'s rights convention in the US, where the Declaration of Sentiments demanded equality including suffrage.' },
    { type: 'mc', q: 'The Dred Scott decision (1857) ruled that:', choices: ['Enslaved people could sue for freedom', 'Congress could not prohibit slavery in territories', 'The Missouri Compromise was constitutional', 'Slavery was unconstitutional'], answer: 'B', explanation: 'Chief Justice Taney ruled that enslaved people were not citizens and had no right to sue, and that Congress could not prohibit slavery in the territories, inflaming sectional tensions.' },
    { type: 'mc', q: 'What was the most fundamental cause of the Civil War?', choices: ['Tariff disputes', 'States\' rights in the abstract', 'Slavery and its expansion', 'Cultural differences between North and South'], answer: 'C', explanation: 'While states\' rights was invoked, Confederate states explicitly cited the preservation and expansion of slavery as their primary reason for secession.' },
    { type: 'sa', q: 'Explain how the Market Revolution changed American society.', answer: 'economy', explanation: 'The Market Revolution (1800s-1840s) transformed America from subsistence farming to a commercial economy through canals, railroads, and factories, creating new class divisions and regional economic differences.' },
    { type: 'sa', q: 'Why did the Kansas-Nebraska Act (1854) intensify sectional conflict?', answer: 'sovereignty', explanation: 'The Kansas-Nebraska Act repealed the Missouri Compromise by allowing popular sovereignty to decide slavery in new territories, leading to "Bleeding Kansas" and the formation of the Republican Party.' },
    { type: 'mc', q: 'The Emancipation Proclamation (1863):', choices: ['Freed all enslaved people in the US', 'Freed enslaved people only in Confederate states', 'Ended the Civil War', 'Gave formerly enslaved people voting rights'], answer: 'B', explanation: 'Lincoln\'s Emancipation Proclamation freed enslaved people in Confederate states, transforming the war into a fight for freedom and allowing Black men to enlist.' },
    { type: 'mc', q: 'Which reform movement sought to end alcohol consumption?', choices: ['Abolitionism', 'Transcendentalism', 'Temperance', 'Nativism'], answer: 'C', explanation: 'The temperance movement sought to reduce or eliminate alcohol consumption, arguing it caused social problems including poverty and domestic violence.' },
    { type: 'sa', q: 'Describe one way the Indian Removal Act (1830) reflected Manifest Destiny.', answer: 'removal', explanation: 'The Indian Removal Act forced southeastern Indigenous nations (Cherokee, Creek, Choctaw, Chickasaw, Seminole) from their lands to Indian Territory, reflecting the belief that white American expansion took priority over Indigenous sovereignty.' },
  ],
  'reconstruction-gilded-age': [
    { type: 'mc', q: 'The 14th Amendment guarantees:', choices: ['Abolition of slavery', 'Equal protection and due process for all citizens', 'Voting rights regardless of race', 'Women\'s suffrage'], answer: 'B', explanation: 'The 14th Amendment (1868) established birthright citizenship and guaranteed equal protection under the law and due process, becoming the most litigated amendment in history.' },
    { type: 'mc', q: 'What ended Reconstruction in 1877?', choices: ['The assassination of Lincoln', 'The Compromise of 1877 removing federal troops from the South', 'The passage of the 15th Amendment', 'A Supreme Court ruling'], answer: 'B', explanation: 'The Compromise of 1877 resolved the disputed 1876 election by giving Hayes the presidency in exchange for removing federal troops from the South, ending Reconstruction.' },
    { type: 'mc', q: 'Andrew Carnegie\'s business strategy was known as:', choices: ['Horizontal integration', 'Vertical integration', 'Monopolistic competition', 'Laissez-faire'], answer: 'B', explanation: 'Carnegie used vertical integration in steel, controlling every stage of production from raw materials to finished product, reducing costs and eliminating middlemen.' },
    { type: 'mc', q: 'The Chinese Exclusion Act (1882) was significant because it:', choices: ['Encouraged Chinese immigration', 'Was the first federal law restricting immigration by nationality', 'Granted citizenship to Chinese immigrants', 'Established diplomatic relations with China'], answer: 'B', explanation: 'The Chinese Exclusion Act was the first significant federal law restricting immigration based on nationality and race, reflecting nativist sentiments during industrialization.' },
    { type: 'mc', q: 'Jim Crow laws established:', choices: ['Voting rights for African Americans', 'Legal racial segregation in the South', 'Equal educational opportunities', 'Labor protections for freed people'], answer: 'B', explanation: 'Jim Crow laws enforced racial segregation in the South from the 1870s through the 1960s, upheld by Plessy v. Ferguson\'s "separate but equal" doctrine.' },
    { type: 'sa', q: 'What was the significance of the 13th, 14th, and 15th Amendments?', answer: 'freedom', explanation: 'The Reconstruction Amendments abolished slavery (13th), established equal protection and citizenship (14th), and prohibited racial discrimination in voting (15th), fundamentally reshaping American constitutional law.' },
    { type: 'sa', q: 'How did Social Darwinism justify inequality during the Gilded Age?', answer: 'survival', explanation: 'Social Darwinism applied "survival of the fittest" to society, arguing that wealthy industrialists deserved their success and the poor were naturally inferior, opposing government regulation and social programs.' },
    { type: 'mc', q: 'The Knights of Labor and the AFL differed primarily in:', choices: ['Their opposition to capitalism', 'Whether to include unskilled workers', 'Their support for women\'s suffrage', 'Their views on immigration'], answer: 'B', explanation: 'The Knights of Labor included all workers (skilled, unskilled, women, African Americans), while the AFL under Gompers focused on skilled craft workers and practical gains.' },
    { type: 'mc', q: '"New" immigrants of the late 1800s primarily came from:', choices: ['Northern and Western Europe', 'Southern and Eastern Europe', 'East Asia', 'Latin America'], answer: 'B', explanation: '"New" immigrants from Southern and Eastern Europe (Italy, Poland, Russia, Greece) faced nativism and discrimination, settling primarily in urban industrial centers.' },
    { type: 'sa', q: 'Why is the period 1870-1900 called the "Gilded Age"?', answer: 'surface', explanation: 'Mark Twain coined "Gilded Age" to describe an era that appeared golden on the surface but concealed serious problems beneath — extreme wealth inequality, political corruption, and labor exploitation.' },
  ],
  'progressive-era-wwi': [
    { type: 'mc', q: 'Muckrakers were journalists who:', choices: ['Supported big business', 'Exposed corruption and social problems', 'Advocated for isolationism', 'Promoted immigration'], answer: 'B', explanation: 'Muckrakers like Upton Sinclair (The Jungle), Ida Tarbell (Standard Oil exposé), and Lincoln Steffens (urban corruption) exposed societal problems to drive reform.' },
    { type: 'mc', q: 'Theodore Roosevelt\'s "Square Deal" included:', choices: ['Elimination of all trusts', 'Trust-busting, consumer protection, and conservation', 'Lowering all tariffs', 'Ending immigration'], answer: 'B', explanation: 'TR\'s Square Deal pursued trust regulation (not elimination), consumer protection (Pure Food and Drug Act), and conservation of natural resources.' },
    { type: 'mc', q: 'The Spanish-American War (1898) resulted in the US gaining:', choices: ['Canada and Mexico', 'Philippines, Puerto Rico, and Guam', 'Hawaii and Alaska', 'Panama and Cuba'], answer: 'B', explanation: 'The Spanish-American War made the US an imperial power, gaining the Philippines, Puerto Rico, and Guam, and establishing a protectorate over Cuba.' },
    { type: 'mc', q: 'What event triggered US entry into WWI?', choices: ['The sinking of the Lusitania', 'Unrestricted submarine warfare and the Zimmermann Telegram', 'The assassination of Archduke Franz Ferdinand', 'A direct attack on US territory'], answer: 'B', explanation: 'Germany\'s resumption of unrestricted submarine warfare and the Zimmermann Telegram (proposing a German-Mexican alliance) pushed the US to enter WWI in April 1917.' },
    { type: 'mc', q: 'The 19th Amendment (1920) granted:', choices: ['Prohibition of alcohol', 'Women\'s suffrage', 'Direct election of senators', 'Income tax'], answer: 'B', explanation: 'The 19th Amendment guaranteed women the right to vote, the culmination of decades of activism by suffragists like Susan B. Anthony and Alice Paul.' },
    { type: 'sa', q: 'How did the settlement house movement address urban problems?', answer: 'services', explanation: 'Settlement houses like Hull House (Jane Addams) provided education, childcare, health services, and cultural programs to immigrant communities, while also advocating for labor and housing reform.' },
    { type: 'sa', q: 'What was the significance of the Open Door Policy?', answer: 'trade', explanation: 'The Open Door Policy (1899-1900) sought to keep China open to trade with all nations and prevent any single power from monopolizing access, reflecting US commercial expansion in Asia.' },
    { type: 'mc', q: 'The Red Scare of 1919-1920 was driven by fear of:', choices: ['German invasion', 'Communist revolution', 'Economic depression', 'Immigration from Asia'], answer: 'B', explanation: 'The first Red Scare was fueled by the Russian Revolution and labor unrest, leading to the Palmer Raids, deportations, and suppression of civil liberties.' },
    { type: 'mc', q: 'Wilson\'s Fourteen Points proposed:', choices: ['American isolationism', 'Self-determination, free trade, and a League of Nations', 'Harsh punishment of Germany', 'Colonial expansion'], answer: 'B', explanation: 'Wilson\'s Fourteen Points outlined a vision for post-war peace including self-determination, open diplomacy, free trade, and a League of Nations, though the Senate rejected US membership.' },
    { type: 'sa', q: 'How did the NAACP work for racial justice during the Progressive Era?', answer: 'legal', explanation: 'The NAACP (founded 1909) pursued racial justice through legal challenges to segregation and lynching, public education campaigns, and lobbying for anti-lynching legislation.' },
  ],
  'roaring-twenties-depression': [
    { type: 'mc', q: 'The Harlem Renaissance was a:', choices: ['Political movement for voting rights', 'Cultural and artistic flowering of African American culture', 'Economic reform program', 'Migration pattern from the South'], answer: 'B', explanation: 'The Harlem Renaissance was an intellectual and cultural flowering of African American art, literature, and music in the 1920s, featuring figures like Langston Hughes, Zora Neale Hurston, and Duke Ellington.' },
    { type: 'mc', q: 'What was a major cause of the Great Depression?', choices: ['Government overspending', 'Stock market speculation, overproduction, and bank failures', 'Foreign invasion', 'Natural disaster'], answer: 'B', explanation: 'The Great Depression resulted from stock market speculation, overproduction, underconsumption, bank failures, and the Federal Reserve\'s tight monetary policy.' },
    { type: 'mc', q: 'FDR\'s New Deal aimed to provide:', choices: ['Relief, Recovery, and Reform', 'Tax cuts for businesses', 'Military expansion', 'Isolationist foreign policy'], answer: 'A', explanation: 'The New Deal\'s "Three Rs" — Relief for the unemployed, Recovery of the economy, and Reform of the financial system — represented an unprecedented expansion of federal power.' },
    { type: 'mc', q: 'The Dust Bowl primarily affected:', choices: ['The Northeast', 'The Great Plains', 'The Pacific Northwest', 'The Deep South'], answer: 'B', explanation: 'The Dust Bowl devastated the Great Plains in the 1930s, caused by drought and poor farming practices, displacing hundreds of thousands of "Okies" who migrated westward.' },
    { type: 'mc', q: 'The Scopes Trial (1925) centered on:', choices: ['Prohibition enforcement', 'Teaching evolution in public schools', 'Women\'s suffrage', 'Immigration restrictions'], answer: 'B', explanation: 'The Scopes Trial highlighted the cultural tension between modernism and traditionalism, specifically the teaching of evolution versus creationism in Tennessee schools.' },
    { type: 'sa', q: 'How did the automobile transform American society in the 1920s?', answer: 'mobility', explanation: 'The automobile (mass-produced via Ford\'s assembly line) transformed society by enabling suburbanization, creating new industries, changing dating customs, and giving Americans unprecedented personal mobility.' },
    { type: 'sa', q: 'What was the significance of the Social Security Act (1935)?', answer: 'safety net', explanation: 'The Social Security Act created a federal safety net providing old-age pensions, unemployment insurance, and aid to dependent children, establishing the principle of government responsibility for citizen welfare.' },
    { type: 'mc', q: 'Prohibition (18th Amendment) led to:', choices: ['Reduced alcohol consumption', 'Rise of organized crime and bootlegging', 'Stronger law enforcement', 'Economic prosperity'], answer: 'B', explanation: 'Prohibition (1920-1933) failed to eliminate alcohol consumption and instead fueled organized crime, bootlegging, and speakeasies, leading to its repeal by the 21st Amendment.' },
    { type: 'mc', q: 'The Great Migration refers to:', choices: ['European immigration to America', 'Movement of African Americans from South to North', 'Westward expansion', 'Dust Bowl displacement'], answer: 'B', explanation: 'The Great Migration (1910s-1970s) saw millions of African Americans move from the rural South to Northern and Western cities, seeking economic opportunity and escape from Jim Crow.' },
    { type: 'sa', q: 'How did the New Deal change the relationship between citizens and the federal government?', answer: 'expanded', explanation: 'The New Deal fundamentally expanded federal power and responsibility, establishing the expectation that the government would regulate the economy, provide social programs, and protect citizens from economic hardship.' },
  ],
  'wwii-cold-war': [
    { type: 'mc', q: 'The US became the "Arsenal of Democracy" by:', choices: ['Sending troops immediately after war began in Europe', 'Providing massive military supplies to Allies before entering the war', 'Remaining completely neutral', 'Building nuclear weapons'], answer: 'B', explanation: 'Before entering WWII, the US supplied Allies through Lend-Lease and other programs, becoming the "Arsenal of Democracy" as FDR described it.' },
    { type: 'mc', q: 'Executive Order 9066 authorized:', choices: ['The draft', 'Japanese American internment', 'Desegregation of the military', 'The Manhattan Project'], answer: 'B', explanation: 'Executive Order 9066 forced approximately 120,000 Japanese Americans into internment camps, representing a massive violation of civil liberties justified by wartime hysteria.' },
    { type: 'mc', q: 'The Truman Doctrine established the policy of:', choices: ['Isolationism', 'Containment of communism', 'Rollback of communism', 'Detente'], answer: 'B', explanation: 'The Truman Doctrine (1947) committed the US to containing the spread of communism, initially through economic and military aid to Greece and Turkey.' },
    { type: 'mc', q: 'The Marshall Plan aimed to:', choices: ['Rebuild European economies to prevent communist expansion', 'Create a military alliance', 'Develop nuclear weapons', 'Establish the United Nations'], answer: 'A', explanation: 'The Marshall Plan (1948-1952) provided over $13 billion in economic aid to rebuild Western Europe, stabilizing economies and reducing the appeal of communism.' },
    { type: 'mc', q: 'The domino theory argued that:', choices: ['Nuclear war was inevitable', 'If one country fell to communism, neighbors would follow', 'Democracy would spread naturally', 'The Soviet Union would collapse internally'], answer: 'B', explanation: 'The domino theory held that if one country in a region fell to communism, surrounding countries would follow, justifying US intervention in Korea and Vietnam.' },
    { type: 'sa', q: 'How did WWII affect women and African Americans on the home front?', answer: 'workforce', explanation: 'WWII opened workforce opportunities for women (Rosie the Riveter) and African Americans (Double V Campaign), challenging traditional roles and laying groundwork for postwar civil rights movements.' },
    { type: 'sa', q: 'What were the consequences of the Vietnam War for American society?', answer: 'trust', explanation: 'Vietnam eroded public trust in government (credibility gap), sparked massive anti-war protests, contributed to the counterculture, and led to the War Powers Act limiting presidential military authority.' },
    { type: 'mc', q: 'The Cuban Missile Crisis (1962) was resolved when:', choices: ['The US invaded Cuba', 'The USSR removed missiles in exchange for US concessions', 'Nuclear war occurred', 'The UN intervened militarily'], answer: 'B', explanation: 'The crisis was resolved when the USSR agreed to remove missiles from Cuba in exchange for a US pledge not to invade Cuba and secret removal of US missiles from Turkey.' },
    { type: 'mc', q: 'Detente refers to:', choices: ['Aggressive confrontation with the USSR', 'Easing of Cold War tensions in the 1970s', 'The end of the Cold War', 'Nuclear proliferation'], answer: 'B', explanation: 'Detente was a period of eased Cold War tensions in the 1970s under Nixon, marked by arms control agreements (SALT I), diplomatic openings with China, and reduced confrontation.' },
    { type: 'sa', q: 'How did the GI Bill transform postwar America?', answer: 'education', explanation: 'The GI Bill (1944) provided veterans with education benefits, home loans, and job training, expanding the middle class, fueling suburbanization, and democratizing higher education — though benefits were unevenly accessed by Black veterans.' },
  ],
  'civil-rights-modern': [
    { type: 'mc', q: 'Brown v. Board of Education (1954) ruled that:', choices: ['Separate but equal was constitutional', 'School segregation was inherently unequal and unconstitutional', 'Busing was required', 'Affirmative action was constitutional'], answer: 'B', explanation: 'The Supreme Court unanimously ruled that racial segregation in public schools violated the Equal Protection Clause, overturning Plessy v. Ferguson\'s "separate but equal" doctrine.' },
    { type: 'mc', q: 'The Civil Rights Act of 1964 prohibited:', choices: ['Only school segregation', 'Discrimination based on race, color, religion, sex, or national origin', 'Voter registration requirements', 'Housing discrimination'], answer: 'B', explanation: 'The Civil Rights Act of 1964 banned discrimination in public accommodations, employment, and federally funded programs based on race, color, religion, sex, or national origin.' },
    { type: 'mc', q: 'The Voting Rights Act of 1965 primarily addressed:', choices: ['Campaign finance reform', 'Barriers to Black voter registration in the South', 'The Electoral College system', 'Congressional redistricting'], answer: 'B', explanation: 'The Voting Rights Act outlawed discriminatory voting practices like literacy tests and poll taxes, and provided federal oversight of elections in areas with histories of discrimination.' },
    { type: 'mc', q: 'The "Reagan Revolution" emphasized:', choices: ['Expanding social programs', 'Tax cuts, deregulation, and reduced government', 'Detente with the Soviet Union', 'Environmental protection'], answer: 'B', explanation: 'Reagan\'s conservative agenda emphasized supply-side economics (tax cuts), deregulation, military buildup, and reduced government spending on social programs.' },
    { type: 'mc', q: 'The 9/11 attacks led to:', choices: ['Isolationist foreign policy', 'The War on Terror, Patriot Act, and wars in Afghanistan and Iraq', 'Reduced military spending', 'Improved relations with the Middle East'], answer: 'B', explanation: 'The 9/11 attacks led to the War on Terror, the Patriot Act expanding surveillance powers, and military interventions in Afghanistan (2001) and Iraq (2003).' },
    { type: 'sa', q: 'How did Martin Luther King Jr.\'s strategy of nonviolent resistance advance civil rights?', answer: 'nonviolence', explanation: 'King\'s strategy of nonviolent direct action (sit-ins, marches, boycotts) exposed the brutality of segregation to national audiences, generated moral pressure, and built broad coalitions that led to landmark legislation.' },
    { type: 'sa', q: 'What were the key programs of Johnson\'s Great Society?', answer: 'programs', explanation: 'The Great Society included Medicare, Medicaid, the War on Poverty, Head Start, the Elementary and Secondary Education Act, the Immigration Act of 1965, and environmental protections.' },
    { type: 'mc', q: 'The conservative resurgence of the 1980s was partly driven by:', choices: ['Labor union growth', 'The Moral Majority and religious right', 'Expansion of welfare programs', 'Anti-war protests'], answer: 'B', explanation: 'The conservative movement was energized by the Moral Majority and religious right, who mobilized around social issues like abortion, school prayer, and traditional family values.' },
    { type: 'mc', q: 'Which best describes the impact of globalization on the US economy since the 1990s?', choices: ['No significant change', 'Manufacturing job loss but cheaper consumer goods', 'Complete economic isolation', 'Elimination of income inequality'], answer: 'B', explanation: 'Globalization brought cheaper consumer goods and new markets but also contributed to manufacturing job losses, wage stagnation for some workers, and increased economic inequality.' },
    { type: 'sa', q: 'How did the civil rights movement influence other social movements?', answer: 'inspired', explanation: 'The civil rights movement\'s tactics and rhetoric inspired the women\'s movement, Chicano movement, American Indian Movement, gay rights movement, and disability rights movement.' },
  ],
};

const SOURCE_EXCERPTS = {
  'colonial-foundations': { title: 'John Winthrop, "A Model of Christian Charity" (1630)', text: '"We shall be as a city upon a hill, the eyes of all people are upon us."', context: 'Winthrop addressed Puritan colonists aboard the Arbella before founding Massachusetts Bay Colony.' },
  'revolution-constitution': { title: 'Declaration of Independence (1776)', text: '"We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness."', context: 'Thomas Jefferson drafted the Declaration, drawing on Enlightenment philosophy to justify independence.' },
  'antebellum-civil-war': { title: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" (1852)', text: '"What, to the American slave, is your 4th of July? I answer: a day that reveals to him, more than all other days in the year, the gross injustice and cruelty to which he is the constant victim."', context: 'Douglass delivered this speech in Rochester, NY, challenging the hypocrisy of celebrating freedom while slavery persisted.' },
  'reconstruction-gilded-age': { title: 'Andrew Carnegie, "The Gospel of Wealth" (1889)', text: '"The man who dies rich dies disgraced... The duty of the man of wealth is to set an example of modest, unostentatious living, and to consider all surplus revenues as trust funds for the community."', context: 'Carnegie argued that the wealthy had a duty to use their fortunes for public benefit through philanthropy.' },
  'progressive-era-wwi': { title: 'Upton Sinclair, The Jungle (1906)', text: '"I aimed at the public\'s heart, and by accident I hit it in the stomach."', context: 'Sinclair intended to expose labor conditions in meatpacking but his descriptions of unsanitary food processing led to the Pure Food and Drug Act.' },
  'roaring-twenties-depression': { title: 'FDR, First Inaugural Address (1933)', text: '"The only thing we have to fear is fear itself — nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance."', context: 'Roosevelt addressed the nation during the depths of the Great Depression, promising bold action.' },
  'wwii-cold-war': { title: 'George Kennan, "Long Telegram" (1946)', text: '"Soviet power is impervious to the logic of reason but highly sensitive to the logic of force."', context: 'Kennan\'s analysis from Moscow became the intellectual foundation for the US containment policy.' },
  'civil-rights-modern': { title: 'Martin Luther King Jr., "Letter from Birmingham Jail" (1963)', text: '"Injustice anywhere is a threat to justice everywhere. We are caught in an inescapable network of mutuality, tied in a single garment of destiny."', context: 'King wrote from jail defending nonviolent direct action against those who called for patience and gradual change.' },
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
  return { studentId: id, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(skill, count = 5) {
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}` };
  const items = pick(bank, count);
  return {
    type: 'us-history',
    skill,
    skillName: SKILLS[skill]?.name || skill,
    count: items.length,
    instruction: 'Answer each question. For multiple choice, respond with the letter. For short answer, provide a brief response.',
    items: items.map((item, i) => ({
      number: i + 1,
      type: item.type,
      question: item.q,
      choices: item.choices || null,
      answer: item.answer,
      explanation: item.explanation,
    })),
  };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (type === 'mc') return norm(expected) === norm(answer.charAt(0));
  // For short answer, check if the key concept appears
  return norm(answer).includes(norm(expected)) || norm(expected).includes(norm(answer));
}

// Public API

class HSUSHistory {
  getProfile(id) {
    const p = loadProfile(id);
    return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length };
  }

  recordAssessment(id, skill, score, total, notes = '') {
    if (!SKILLS[skill]) throw new Error(`Unknown skill: ${skill}. Valid: ${Object.keys(SKILLS).join(', ')}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);

    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), skill, score, total, notes };
    p.assessments.push(entry);
    if (!p.skills[skill]) p.skills[skill] = { attempts: [] };
    p.skills[skill].attempts.push({ date: entry.date, score, total });
    p.skills[skill].mastery = calcMastery(p.skills[skill].attempts);
    p.skills[skill].label = masteryLabel(p.skills[skill].mastery);
    saveProfile(p);
    return { studentId: id, skill, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) {
      total++;
      const d = p.skills[sk];
      results[sk] = d ? { name: info.name, mastery: d.mastery, label: d.label } : { name: info.name, mastery: 0, label: 'not-started' };
      if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
    }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    for (const [sk, info] of Object.entries(SKILLS)) {
      const d = p.skills[sk];
      const m = d ? d.mastery : 0;
      if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, name: info.name, mastery: m, label: d ? d.label : 'not-started' });
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) {
    const p = loadProfile(id);
    return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() };
  }

  listStudents() {
    ensureDataDir();
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) };
  }

  getSkillCatalog() {
    const catalog = {};
    let total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) { total++; catalog[sk] = { name: info.name, topics: info.topics }; }
    return { skills: catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient! Great work on US History.', skills: Object.keys(SKILLS) };
    const exercise = generateExercise(target.skill, 5);
    const source = SOURCE_EXCERPTS[target.skill] || null;
    return {
      studentId: id, targetSkill: target, exercise, sourceExcerpt: source,
      lessonPlan: {
        review: 'Review previously covered period concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.name}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        source: source ? `Analyze source: "${source.title}"` : 'Review key primary sources from this period',
        connect: `Connect to APUSH themes and adjacent periods`,
      },
    };
  }
}

module.exports = HSUSHistory;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new HSUSHistory();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: start <id> [skill]');
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        if (skill) { out(api.generateExercise(skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); }
        break;
      }
      case 'check': {
        const [, , type, expected, answer] = args;
        if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>');
        out(api.checkAnswer(type, expected, answer));
        break;
      }
      case 'record': {
        const [, id, skill, sc, tot, ...notes] = args;
        if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node us-history.js <command> [args]', commands: ['start', 'lesson', 'exercise', 'check', 'record', 'progress', 'report', 'next', 'catalog', 'students'], skills: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
