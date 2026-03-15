// eClaw HS Economics Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-socialstudies-economics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'economic-fundamentals': {
    name: 'Economic Fundamentals',
    topics: ['scarcity', 'opportunity-cost', 'production-possibilities', 'comparative-advantage', 'economic-systems'],
  },
  'supply-demand': {
    name: 'Supply & Demand',
    topics: ['demand-curve', 'supply-curve', 'equilibrium', 'elasticity', 'price-controls', 'surplus-shortage'],
  },
  'market-structures': {
    name: 'Market Structures',
    topics: ['perfect-competition', 'monopoly', 'oligopoly', 'monopolistic-competition', 'market-failure'],
  },
  'macroeconomics': {
    name: 'Macroeconomics',
    topics: ['gdp', 'cpi-inflation', 'unemployment-types', 'business-cycle', 'ad-as-model'],
  },
  'fiscal-policy': {
    name: 'Fiscal Policy',
    topics: ['government-spending', 'taxation', 'multiplier-effect', 'crowding-out', 'budget-deficit-debt'],
  },
  'monetary-policy': {
    name: 'Monetary Policy',
    topics: ['federal-reserve', 'money-supply', 'interest-rates', 'money-market', 'loanable-funds'],
  },
  'international-trade': {
    name: 'International Trade',
    topics: ['comparative-advantage-trade', 'exchange-rates', 'trade-barriers', 'balance-of-payments', 'trade-agreements'],
  },
  'personal-finance': {
    name: 'Personal Finance',
    topics: ['budgeting', 'saving-investing', 'credit-debt', 'compound-interest', 'insurance-risk'],
  },
};

const QUESTION_BANKS = {
  'economic-fundamentals': [
    { type: 'mc', q: 'Scarcity is best defined as:', choices: ['A shortage of money', 'Unlimited wants exceeding limited resources', 'Government rationing', 'Poverty'], answer: 'B', explanation: 'Scarcity is the fundamental economic problem: human wants are unlimited, but the resources to satisfy them are limited, forcing choices.' },
    { type: 'mc', q: 'Opportunity cost is:', choices: ['The monetary price of a good', 'The value of the next best alternative given up', 'The total cost of production', 'The profit margin'], answer: 'B', explanation: 'Opportunity cost is the value of what you give up when making a choice — the next best alternative forgone.' },
    { type: 'mc', q: 'A point inside the Production Possibilities Curve (PPC) indicates:', choices: ['Efficient use of resources', 'Underutilization of resources', 'Unattainable production', 'Maximum output'], answer: 'B', explanation: 'Points inside the PPC represent inefficiency — the economy is not using all available resources. Points on the curve are efficient; points outside are unattainable with current resources.' },
    { type: 'sa', q: 'Explain how comparative advantage leads to mutual gains from trade.', answer: 'lower', explanation: 'A country has comparative advantage when it can produce a good at a lower opportunity cost. When countries specialize in goods where they have comparative advantage and trade, total output increases and both benefit.' },
    { type: 'mc', q: 'In a market economy, the "invisible hand" refers to:', choices: ['Government regulation', 'Self-interest guiding efficient resource allocation through prices', 'Central planning', 'Corporate manipulation'], answer: 'B', explanation: 'Adam Smith\'s "invisible hand" describes how individuals pursuing self-interest, guided by market prices, unintentionally promote efficient resource allocation and social welfare.' },
    { type: 'mc', q: 'The three basic economic questions are:', choices: ['Who, what, where', 'What to produce, how to produce, for whom to produce', 'Supply, demand, price', 'Import, export, trade'], answer: 'B', explanation: 'Every economic system must answer: What goods/services to produce? How to produce them? For whom to produce them? Different systems answer these differently.' },
    { type: 'mc', q: 'Marginal analysis involves:', choices: ['Looking at total costs', 'Evaluating the additional benefit vs. additional cost of one more unit', 'Ignoring costs', 'Maximizing revenue only'], answer: 'B', explanation: 'Marginal analysis compares the marginal benefit (MB) of one more unit to its marginal cost (MC). Rational decisions continue an activity as long as MB >= MC.' },
    { type: 'sa', q: 'What causes the PPC to shift outward?', answer: 'growth', explanation: 'The PPC shifts outward with economic growth: more resources (labor, capital), better technology, improved education/training, or discovery of new resources increase production capacity.' },
    { type: 'mc', q: 'A mixed economy combines elements of:', choices: ['Only capitalism', 'Market and command economic systems', 'Only socialism', 'Feudalism and capitalism'], answer: 'B', explanation: 'Most modern economies are mixed, combining market mechanisms (private enterprise, price signals) with government intervention (regulation, public goods, social safety nets).' },
    { type: 'mc', q: 'The "guns or butter" tradeoff illustrates:', choices: ['Military spending vs. consumer goods', 'Opportunity cost and the PPC', 'Both A and B', 'Neither A nor B'], answer: 'C', explanation: '"Guns or butter" illustrates opportunity cost using the PPC: producing more military goods (guns) means fewer consumer goods (butter), and vice versa.' },
  ],
  'supply-demand': [
    { type: 'mc', q: 'The Law of Demand states that:', choices: ['As price increases, quantity demanded increases', 'As price increases, quantity demanded decreases, ceteris paribus', 'Demand and supply are equal', 'Price has no effect on demand'], answer: 'B', explanation: 'The Law of Demand: there is an inverse relationship between price and quantity demanded, holding all else constant (ceteris paribus).' },
    { type: 'mc', q: 'A shift in the demand curve (not a movement along it) is caused by:', choices: ['A change in the price of the good', 'Changes in income, tastes, expectations, or prices of related goods', 'A change in quantity supplied', 'Market equilibrium'], answer: 'B', explanation: 'Demand curve shifts are caused by non-price determinants: income, tastes/preferences, expectations, prices of substitutes/complements, and number of buyers.' },
    { type: 'mc', q: 'At equilibrium:', choices: ['There is a surplus', 'Quantity supplied equals quantity demanded', 'There is a shortage', 'Price is at its highest'], answer: 'B', explanation: 'Equilibrium occurs where supply and demand curves intersect: quantity supplied equals quantity demanded, and there is no pressure for price to change.' },
    { type: 'sa', q: 'What happens when a price ceiling is set below the equilibrium price?', answer: 'shortage', explanation: 'A price ceiling below equilibrium (like rent control) creates a shortage: quantity demanded exceeds quantity supplied because the artificially low price discourages supply and encourages demand.' },
    { type: 'mc', q: 'If demand is elastic, a price increase will:', choices: ['Increase total revenue', 'Decrease total revenue', 'Have no effect on revenue', 'Double revenue'], answer: 'B', explanation: 'With elastic demand (Ed > 1), consumers are price-sensitive. A price increase causes a proportionally larger drop in quantity demanded, reducing total revenue.' },
    { type: 'mc', q: 'A surplus occurs when:', choices: ['Price is below equilibrium', 'Price is above equilibrium, so quantity supplied exceeds quantity demanded', 'Demand increases', 'Supply decreases'], answer: 'B', explanation: 'A surplus occurs when price is above equilibrium: producers supply more than consumers demand, creating excess inventory that pushes price down.' },
    { type: 'mc', q: 'Complementary goods have what relationship?', choices: ['As one\'s price rises, demand for both rises', 'As one\'s price rises, demand for the other falls', 'They are unrelated', 'They are identical'], answer: 'B', explanation: 'Complements are used together (cars and gas). When the price of one rises, demand for both decreases because the combined cost increases.' },
    { type: 'sa', q: 'How does a price floor above equilibrium affect the market?', answer: 'surplus', explanation: 'A price floor above equilibrium (like minimum wage) creates a surplus: quantity supplied exceeds quantity demanded. In labor markets, this means unemployment as more workers want jobs than employers want to hire.' },
    { type: 'mc', q: 'The price elasticity of demand measures:', choices: ['How much supply changes', 'How responsive quantity demanded is to a change in price', 'Total revenue', 'Consumer surplus'], answer: 'B', explanation: 'Price elasticity of demand = % change in quantity demanded / % change in price. It measures consumers\' price sensitivity for a good.' },
    { type: 'mc', q: 'Consumer surplus is:', choices: ['Extra goods produced', 'The difference between what consumers are willing to pay and what they actually pay', 'Producer profit', 'Government revenue'], answer: 'B', explanation: 'Consumer surplus is the area between the demand curve and the equilibrium price — the benefit consumers receive from buying at a price lower than their maximum willingness to pay.' },
  ],
  'market-structures': [
    { type: 'mc', q: 'Perfect competition is characterized by:', choices: ['Few sellers with differentiated products', 'Many sellers with identical products, free entry/exit, and price-taking', 'One seller with no substitutes', 'A few dominant firms'], answer: 'B', explanation: 'Perfect competition has many small firms selling identical products, free entry/exit, perfect information, and firms are price takers (no market power).' },
    { type: 'mc', q: 'A monopoly exists when:', choices: ['Two firms dominate a market', 'One firm controls the entire market with high barriers to entry', 'Many firms sell similar products', 'The government sets prices'], answer: 'B', explanation: 'A monopoly has a single seller, no close substitutes, and high barriers to entry (legal, natural, or technological), giving the firm price-making power.' },
    { type: 'mc', q: 'In oligopoly, firms are interdependent, meaning:', choices: ['They ignore competitors', 'Each firm\'s decisions affect and are affected by competitors\' actions', 'They are price takers', 'They freely enter/exit'], answer: 'B', explanation: 'Oligopolistic interdependence means firms must consider rivals\' reactions when making pricing and output decisions, leading to strategic behavior (game theory).' },
    { type: 'sa', q: 'Why do monopolies produce at a higher price and lower quantity than competitive markets?', answer: 'restrict', explanation: 'Monopolies maximize profit by restricting output below competitive levels (where MR=MC, not P=MC), charging higher prices. This creates deadweight loss — a market inefficiency.' },
    { type: 'mc', q: 'A natural monopoly occurs when:', choices: ['The government creates it', 'One firm can supply the market at lower cost than multiple firms due to economies of scale', 'Multiple firms collude', 'Demand is perfectly elastic'], answer: 'B', explanation: 'Natural monopolies (utilities, infrastructure) have such large economies of scale that one firm can serve the market more cheaply than multiple competitors.' },
    { type: 'mc', q: 'Monopolistic competition differs from perfect competition because firms:', choices: ['Are price takers', 'Sell differentiated products and have some market power', 'Face no competition', 'Have high barriers to entry'], answer: 'B', explanation: 'Monopolistic competition has many firms with free entry/exit (like perfect competition) but products are differentiated (branding, quality), giving firms limited pricing power.' },
    { type: 'mc', q: 'Market failure occurs when:', choices: ['Markets always work perfectly', 'Markets fail to allocate resources efficiently, justifying government intervention', 'Government fails', 'Prices are too low'], answer: 'B', explanation: 'Market failures include externalities, public goods, monopoly power, and imperfect information — situations where free markets don\'t produce efficient outcomes.' },
    { type: 'sa', q: 'What is a negative externality and how can government address it?', answer: 'cost', explanation: 'A negative externality is a cost imposed on third parties not involved in a transaction (pollution). Government can address it with taxes (Pigouvian tax), regulation, cap-and-trade, or property rights assignment.' },
    { type: 'mc', q: 'The prisoner\'s dilemma in oligopoly illustrates:', choices: ['Perfect cooperation', 'Why firms tend to cheat on collusive agreements despite mutual benefit from cooperating', 'Market efficiency', 'Government failure'], answer: 'B', explanation: 'The prisoner\'s dilemma shows why oligopolistic firms struggle to maintain collusion: each firm has an incentive to cheat (lower prices) even though mutual cooperation would yield higher profits.' },
    { type: 'mc', q: 'Public goods are:', choices: ['Goods produced by government', 'Non-rival and non-excludable goods that markets underprovide', 'Private property', 'Luxury goods'], answer: 'B', explanation: 'Public goods (national defense, streetlights) are non-rival (one person\'s use doesn\'t reduce availability) and non-excludable (can\'t prevent free-riders), so markets underprovide them.' },
  ],
  'macroeconomics': [
    { type: 'mc', q: 'GDP measures:', choices: ['Only government spending', 'The total market value of all final goods and services produced within a country in a year', 'Stock market performance', 'National debt'], answer: 'B', explanation: 'GDP = C + I + G + (X-M): consumption + investment + government spending + net exports. It measures total economic output within a country\'s borders.' },
    { type: 'mc', q: 'The Consumer Price Index (CPI) measures:', choices: ['GDP growth', 'Changes in the price level of a basket of consumer goods over time', 'Unemployment', 'Interest rates'], answer: 'B', explanation: 'The CPI tracks price changes in a fixed basket of consumer goods and services, measuring inflation. The inflation rate = (CPI_new - CPI_old) / CPI_old x 100.' },
    { type: 'mc', q: 'Structural unemployment is caused by:', choices: ['Seasonal changes', 'Mismatch between workers\' skills and available jobs', 'Economic downturns', 'Job searching between positions'], answer: 'B', explanation: 'Structural unemployment results from changes in technology, industry, or economy that make workers\' skills obsolete (e.g., automation replacing factory workers).' },
    { type: 'sa', q: 'Describe the four phases of the business cycle.', answer: 'expansion', explanation: 'The business cycle: expansion (rising GDP, falling unemployment), peak (maximum output), contraction/recession (falling GDP, rising unemployment), trough (minimum output). Then the cycle repeats.' },
    { type: 'mc', q: 'In the AD/AS model, stagflation is represented by:', choices: ['Rightward shift of AD', 'Leftward shift of short-run AS', 'Rightward shift of AS', 'Leftward shift of AD'], answer: 'B', explanation: 'Stagflation (rising prices + falling output) occurs when short-run AS shifts left (e.g., oil price shock), increasing the price level while reducing real GDP.' },
    { type: 'mc', q: 'The natural rate of unemployment includes:', choices: ['Cyclical unemployment', 'Frictional and structural unemployment only', 'All unemployment', 'Zero unemployment'], answer: 'B', explanation: 'The natural rate includes frictional (job searching) and structural (skills mismatch) unemployment — it exists even in a healthy economy. Cyclical unemployment is above this rate during recessions.' },
    { type: 'mc', q: 'Real GDP differs from nominal GDP because:', choices: ['It includes only government spending', 'It adjusts for inflation using a base year\'s prices', 'It includes imports', 'It is always higher'], answer: 'B', explanation: 'Real GDP adjusts nominal GDP for inflation, giving a more accurate picture of actual output changes. Real GDP = Nominal GDP / GDP Deflator x 100.' },
    { type: 'sa', q: 'What is the relationship between unemployment and inflation shown by the Phillips Curve?', answer: 'inverse', explanation: 'The short-run Phillips Curve shows an inverse relationship: lower unemployment is associated with higher inflation (and vice versa). This tradeoff breaks down in the long run, where the curve is vertical at the natural rate.' },
    { type: 'mc', q: 'Aggregate demand shifts right when:', choices: ['Consumers spend less', 'Government increases spending, taxes are cut, or consumer confidence rises', 'Interest rates rise', 'The price level increases'], answer: 'B', explanation: 'AD shifts right with increased consumption, investment, government spending, or net exports — caused by tax cuts, increased confidence, lower interest rates, or weaker currency.' },
    { type: 'mc', q: 'A recession is technically defined as:', choices: ['Any decline in GDP', 'Two consecutive quarters of declining real GDP', 'High unemployment', 'Stock market crash'], answer: 'B', explanation: 'A recession is commonly defined as two consecutive quarters of declining real GDP, characterized by falling output, rising unemployment, and reduced business investment.' },
  ],
  'fiscal-policy': [
    { type: 'mc', q: 'Expansionary fiscal policy involves:', choices: ['Raising taxes and cutting spending', 'Increasing government spending and/or cutting taxes to stimulate the economy', 'Raising interest rates', 'Selling government bonds'], answer: 'B', explanation: 'Expansionary fiscal policy (used during recessions) increases AD through higher government spending and/or tax cuts, boosting output and employment.' },
    { type: 'mc', q: 'The spending multiplier effect means:', choices: ['Government spending has no impact', 'An initial change in spending creates a larger change in GDP', 'Taxes reduce GDP dollar for dollar', 'Only investment has multiplier effects'], answer: 'B', explanation: 'The multiplier (1/MPS or 1/(1-MPC)) means $1 of government spending creates more than $1 of GDP increase as the money circulates through the economy.' },
    { type: 'mc', q: 'Crowding out occurs when:', choices: ['Government spending decreases', 'Increased government borrowing raises interest rates, reducing private investment', 'Taxes are cut', 'The money supply increases'], answer: 'B', explanation: 'Crowding out: government borrowing to finance deficits increases demand for loanable funds, pushing up interest rates, which discourages private investment — partially offsetting fiscal stimulus.' },
    { type: 'sa', q: 'What is the difference between automatic stabilizers and discretionary fiscal policy?', answer: 'automatic', explanation: 'Automatic stabilizers (unemployment insurance, progressive taxes) adjust automatically without legislation, smoothing the business cycle. Discretionary policy requires deliberate Congressional action (stimulus packages, tax changes).' },
    { type: 'mc', q: 'The national debt differs from the annual deficit in that:', choices: ['They are the same thing', 'The debt is the accumulated total of past deficits; the deficit is the annual shortfall', 'The deficit is always larger', 'The debt is only foreign-held'], answer: 'B', explanation: 'The annual deficit is how much spending exceeds revenue in one year. The national debt is the total accumulation of all past deficits minus surpluses.' },
    { type: 'mc', q: 'Contractionary fiscal policy is appropriate when:', choices: ['The economy is in recession', 'The economy is overheating with high inflation', 'Unemployment is high', 'GDP is falling'], answer: 'B', explanation: 'Contractionary fiscal policy (reduced spending, higher taxes) decreases AD to combat demand-pull inflation when the economy is overheating above full employment.' },
    { type: 'mc', q: 'Supply-side economics emphasizes:', choices: ['Demand management', 'Tax cuts and deregulation to increase production capacity (shift AS right)', 'Government spending increases', 'Price controls'], answer: 'B', explanation: 'Supply-side economics argues that reducing taxes (especially on businesses and high earners) and deregulation incentivize production, investment, and work, shifting long-run AS right.' },
    { type: 'sa', q: 'What are the time lags in fiscal policy and why do they matter?', answer: 'delay', explanation: 'Fiscal policy faces recognition lag (identifying the problem), legislative lag (passing legislation), and implementation lag (spending reaching the economy). These delays mean policy may arrive too late or worsen conditions.' },
    { type: 'mc', q: 'Progressive taxation means:', choices: ['Everyone pays the same rate', 'Higher income earners pay a higher percentage of their income in taxes', 'Lower income earners pay more', 'Only corporations pay taxes'], answer: 'B', explanation: 'Progressive taxes (US income tax) charge higher rates on higher income brackets, designed to distribute tax burden based on ability to pay.' },
    { type: 'mc', q: 'An increase in government spending shifts:', choices: ['Aggregate supply right', 'Aggregate demand right', 'Aggregate demand left', 'Neither curve'], answer: 'B', explanation: 'Increased government spending (G) directly increases a component of AD (C+I+G+NX), shifting the AD curve rightward, increasing both price level and real GDP in the short run.' },
  ],
  'monetary-policy': [
    { type: 'mc', q: 'The Federal Reserve\'s primary tool for monetary policy is:', choices: ['Printing money', 'Open market operations (buying/selling government bonds)', 'Setting tax rates', 'Government spending'], answer: 'B', explanation: 'The Fed\'s main tool is open market operations: buying bonds injects money (expansionary), selling bonds removes money (contractionary), affecting interest rates and lending.' },
    { type: 'mc', q: 'Expansionary monetary policy involves:', choices: ['Selling bonds and raising reserve requirements', 'Buying bonds and/or lowering the federal funds rate to increase money supply', 'Raising taxes', 'Cutting government spending'], answer: 'B', explanation: 'Expansionary policy: Fed buys bonds (increasing bank reserves), lowers discount rate, or lowers reserve requirements, expanding money supply and reducing interest rates to stimulate borrowing and spending.' },
    { type: 'mc', q: 'In the money market, an increase in the money supply:', choices: ['Raises interest rates', 'Lowers interest rates (money supply curve shifts right)', 'Has no effect', 'Increases money demand'], answer: 'B', explanation: 'Increasing money supply shifts the MS curve right in the money market, lowering the equilibrium interest rate, which encourages borrowing and investment.' },
    { type: 'sa', q: 'How does the Fed use the federal funds rate to influence the economy?', answer: 'borrowing', explanation: 'The federal funds rate (the rate banks charge each other for overnight loans) influences all other interest rates. Lowering it makes borrowing cheaper, stimulating investment and consumption. Raising it cools the economy.' },
    { type: 'mc', q: 'The quantity theory of money (MV=PQ) implies that:', choices: ['Money has no effect on prices', 'Increasing the money supply proportionally increases the price level if V and Q are constant', 'Velocity always changes', 'Output determines money supply'], answer: 'B', explanation: 'MV=PQ (money supply x velocity = price level x real output). If V and Q are constant, increasing M proportionally increases P — the basis for monetarist inflation theory.' },
    { type: 'mc', q: 'The loanable funds market determines:', choices: ['The price level', 'The real interest rate through the interaction of saving (supply) and borrowing (demand)', 'The money supply', 'Exchange rates'], answer: 'B', explanation: 'In the loanable funds market, supply comes from saving and demand from borrowing (investment). Their intersection determines the real interest rate.' },
    { type: 'mc', q: 'Contractionary monetary policy is used to:', choices: ['Fight recession', 'Combat inflation by reducing money supply and raising interest rates', 'Increase employment', 'Lower the price level permanently'], answer: 'B', explanation: 'Contractionary policy (selling bonds, raising rates) reduces money supply, increases interest rates, and decreases AD to fight inflation.' },
    { type: 'sa', q: 'What are the limitations of monetary policy?', answer: 'liquidity', explanation: 'Limitations include: liquidity trap (rates near zero, can\'t lower further), time lags, dependence on bank willingness to lend and consumer willingness to borrow, and inability to target specific sectors.' },
    { type: 'mc', q: 'Banks create money through:', choices: ['Printing currency', 'Fractional reserve lending — lending out deposits while keeping only a fraction in reserve', 'Government grants', 'Stock market trading'], answer: 'B', explanation: 'Fractional reserve banking: banks keep a fraction of deposits as reserves and lend the rest. Each loan creates new deposits, multiplying the money supply (money multiplier = 1/reserve ratio).' },
    { type: 'mc', q: 'The Fed is considered independent because:', choices: ['It has no oversight', 'Its governors serve 14-year terms and it doesn\'t need Congressional approval for policy', 'It is a private bank', 'It is part of Congress'], answer: 'B', explanation: 'Fed independence (long terms, no Congressional approval for rate decisions) insulates monetary policy from short-term political pressure, though the Fed is still accountable to Congress.' },
  ],
  'international-trade': [
    { type: 'mc', q: 'Comparative advantage in trade means:', choices: ['Producing everything cheaper', 'A country should specialize in goods it produces at the lowest opportunity cost', 'Absolute advantage determines trade', 'Larger countries always win'], answer: 'B', explanation: 'Comparative advantage: even if one country is more productive at everything, both benefit by specializing in goods where their opportunity cost is lowest and trading.' },
    { type: 'mc', q: 'A tariff is:', choices: ['A subsidy to domestic producers', 'A tax on imported goods', 'A ban on imports', 'A trade agreement'], answer: 'B', explanation: 'A tariff is a tax on imports that raises their price, protecting domestic producers but increasing costs for consumers and potentially reducing economic efficiency.' },
    { type: 'mc', q: 'If the US dollar appreciates against the euro:', choices: ['US exports become cheaper for Europeans', 'US exports become more expensive for Europeans, reducing exports', 'There is no effect on trade', 'Both currencies weaken'], answer: 'B', explanation: 'Dollar appreciation means each dollar buys more euros, making US goods more expensive abroad (reducing exports) but foreign goods cheaper for Americans (increasing imports).' },
    { type: 'sa', q: 'What are the arguments for and against free trade?', answer: 'efficiency', explanation: 'For: increased efficiency, lower prices, greater variety, economic growth. Against: job losses in uncompetitive sectors, environmental concerns, exploitation of developing nations, national security risks.' },
    { type: 'mc', q: 'The balance of trade is:', choices: ['Always balanced', 'The difference between a country\'s exports and imports of goods and services', 'The same as GDP', 'Only about financial flows'], answer: 'B', explanation: 'The balance of trade (current account component) is exports minus imports. A trade deficit means imports exceed exports; a surplus means the reverse.' },
    { type: 'mc', q: 'Exchange rates in a floating system are determined by:', choices: ['Government decree', 'Supply and demand for currencies in foreign exchange markets', 'The gold standard', 'International law'], answer: 'B', explanation: 'In a floating exchange rate system, currency values are determined by supply and demand in forex markets, influenced by trade flows, interest rates, and speculation.' },
    { type: 'mc', q: 'A quota differs from a tariff in that a quota:', choices: ['Raises revenue for government', 'Sets a physical limit on the quantity of imports rather than taxing them', 'Encourages imports', 'Is less restrictive'], answer: 'B', explanation: 'A quota directly limits the quantity of imports allowed, while a tariff taxes imports. Quotas don\'t generate government revenue (revenue goes to import license holders).' },
    { type: 'sa', q: 'How do interest rates affect exchange rates?', answer: 'attract', explanation: 'Higher domestic interest rates attract foreign investment (capital inflows), increasing demand for the domestic currency and causing it to appreciate. Lower rates have the opposite effect.' },
    { type: 'mc', q: 'The World Trade Organization (WTO) primarily:', choices: ['Sets exchange rates', 'Establishes rules for international trade and resolves trade disputes', 'Controls monetary policy', 'Manages foreign aid'], answer: 'B', explanation: 'The WTO provides a framework of trade rules, oversees trade agreements, and serves as a forum for negotiating trade disputes between member nations.' },
    { type: 'mc', q: 'Outsourcing jobs to other countries is driven by:', choices: ['Government mandates', 'Lower labor costs and comparative advantage in those countries', 'Higher quality abroad', 'Taxes only'], answer: 'B', explanation: 'Outsourcing reflects comparative advantage: firms move production where labor and other costs are lower, increasing profits but potentially causing domestic job losses.' },
  ],
  'personal-finance': [
    { type: 'mc', q: 'The Rule of 72 is used to estimate:', choices: ['Tax payments', 'How many years it takes an investment to double at a given interest rate', 'Monthly expenses', 'Loan payments'], answer: 'B', explanation: 'Rule of 72: divide 72 by the annual interest rate to estimate doubling time. At 6% interest, money doubles in approximately 72/6 = 12 years.' },
    { type: 'mc', q: 'Compound interest differs from simple interest because:', choices: ['It is always lower', 'You earn interest on both principal AND previously earned interest', 'It only applies to savings', 'It is taxed differently'], answer: 'B', explanation: 'Compound interest calculates interest on the principal plus accumulated interest, causing exponential growth. Simple interest is calculated only on the original principal.' },
    { type: 'mc', q: 'A credit score is affected by:', choices: ['Only income level', 'Payment history, credit utilization, length of history, types of credit, and new inquiries', 'Only the amount of debt', 'Your education'], answer: 'B', explanation: 'FICO scores weigh: payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit inquiries (10%).' },
    { type: 'sa', q: 'Why is diversification important in investing?', answer: 'risk', explanation: 'Diversification spreads investments across different assets (stocks, bonds, sectors, geographies) to reduce risk. If one investment loses value, others may gain, smoothing overall returns.' },
    { type: 'mc', q: 'The relationship between risk and return in investing is:', choices: ['No relationship', 'Higher potential returns generally require accepting higher risk', 'Lower risk always means higher returns', 'Risk can be eliminated'], answer: 'B', explanation: 'The risk-return tradeoff: investments with higher potential returns (stocks) typically carry more risk, while safer investments (bonds, savings) offer lower returns.' },
    { type: 'mc', q: 'A budget helps you:', choices: ['Spend more money', 'Track income and expenses, prioritize spending, and save toward goals', 'Avoid taxes', 'Get out of debt instantly'], answer: 'B', explanation: 'Budgeting tracks where money goes, ensures needs are met before wants, identifies savings opportunities, and provides a plan for achieving financial goals.' },
    { type: 'mc', q: 'The difference between a stock and a bond is:', choices: ['They are the same', 'A stock represents ownership; a bond represents a loan to a company or government', 'Bonds are always better', 'Stocks have no risk'], answer: 'B', explanation: 'Stocks represent equity (ownership shares) with variable returns and higher risk. Bonds represent debt (loans) with fixed interest payments and generally lower risk.' },
    { type: 'sa', q: 'What is the difference between a need and a want in budgeting?', answer: 'essential', explanation: 'Needs are essential for survival and basic functioning (food, shelter, healthcare, transportation). Wants are things that improve quality of life but aren\'t essential (entertainment, dining out, luxury items).' },
    { type: 'mc', q: 'An emergency fund should typically cover:', choices: ['One week of expenses', 'Three to six months of living expenses', 'One year of income', 'Only medical costs'], answer: 'B', explanation: 'Financial advisors recommend 3-6 months of living expenses in an easily accessible emergency fund to cover unexpected costs (job loss, medical emergencies, car repairs).' },
    { type: 'mc', q: 'Inflation erodes the value of money over time, which means:', choices: ['Saving is pointless', 'Investments should aim to earn returns that exceed the inflation rate', 'Prices always decrease', 'Cash is the best investment'], answer: 'B', explanation: 'Inflation reduces purchasing power over time. To preserve and grow wealth, investments should aim to earn returns above the inflation rate (positive real returns).' },
  ],
};

const SOURCE_EXCERPTS = {
  'economic-fundamentals': { title: 'Adam Smith, The Wealth of Nations (1776)', text: '"It is not from the benevolence of the butcher, the brewer, or the baker, that we expect our dinner, but from their regard to their own interest."', context: 'Smith argues that self-interest, guided by market competition, promotes economic welfare more effectively than central planning.' },
  'supply-demand': { title: 'Supply and Demand Graph Analysis', text: 'Graph: Standard S&D diagram with equilibrium at P=$5, Q=100. Demand shifts right due to increased income.', context: 'Analyze: What happens to equilibrium price and quantity? New equilibrium: higher P and higher Q.' },
  'market-structures': { title: 'Sherman Antitrust Act (1890)', text: '"Every contract, combination in the form of trust or otherwise, or conspiracy, in restraint of trade or commerce among the several States, or with foreign nations, is declared to be illegal."', context: 'The Sherman Act established the legal framework for breaking up monopolies and preventing anticompetitive behavior.' },
  'macroeconomics': { title: 'John Maynard Keynes, The General Theory (1936)', text: '"The outstanding faults of the economic society in which we live are its failure to provide for full employment and its arbitrary and inequitable distribution of wealth and incomes."', context: 'Keynes argued that government intervention through fiscal policy is necessary to manage aggregate demand and combat unemployment.' },
  'fiscal-policy': { title: 'FDR on the New Deal (1933)', text: '"The only thing we have to fear is fear itself — nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance."', context: 'FDR launched the New Deal — the largest fiscal policy expansion in US history — to combat the Great Depression.' },
  'monetary-policy': { title: 'Federal Reserve Mission Statement', text: '"The Federal Reserve System is the central bank of the United States. It performs five general functions to promote the effective operation of the U.S. economy and the public interest."', context: 'The Fed\'s dual mandate: maximum employment and stable prices (targeting ~2% inflation).' },
  'international-trade': { title: 'David Ricardo, On Comparative Advantage (1817)', text: '"Under a system of perfectly free commerce, each country naturally devotes its capital and labour to such employments as are most beneficial to each."', context: 'Ricardo demonstrated that even countries with absolute disadvantage in all goods benefit from specializing in their comparative advantage.' },
  'personal-finance': { title: 'Albert Einstein (attributed)', text: '"Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn\'t, pays it."', context: 'Whether or not Einstein said this, the power of compound growth is the most important concept in personal finance.' },
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

function generateExercise(skill, count = 5) {
  const bank = QUESTION_BANKS[skill];
  if (!bank) return { error: `No question bank for ${skill}` };
  const items = pick(bank, count);
  return {
    type: 'economics', skill, skillName: SKILLS[skill]?.name || skill, count: items.length,
    instruction: 'Answer each question. For multiple choice, respond with the letter. For short answer, provide a brief response.',
    items: items.map((item, i) => ({ number: i + 1, type: item.type, question: item.q, choices: item.choices || null, answer: item.answer, explanation: item.explanation })),
  };
}

function checkAnswer(type, expected, answer) {
  if (type === 'mc') return norm(expected) === norm(answer.charAt(0));
  return norm(answer).includes(norm(expected)) || norm(expected).includes(norm(answer));
}

class HSEconomics {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }

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
    const results = {}; let mastered = 0, total = 0;
    for (const [sk, info] of Object.entries(SKILLS)) {
      total++; const d = p.skills[sk];
      results[sk] = d ? { name: info.name, mastery: d.mastery, label: d.label } : { name: info.name, mastery: 0, label: 'not-started' };
      if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
    }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id); const candidates = [];
    for (const [sk, info] of Object.entries(SKILLS)) {
      const d = p.skills[sk]; const m = d ? d.mastery : 0;
      if (m < MASTERY_THRESHOLD) candidates.push({ skill: sk, name: info.name, mastery: m, label: d ? d.label : 'not-started' });
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog() { const catalog = {}; let total = 0; for (const [sk, info] of Object.entries(SKILLS)) { total++; catalog[sk] = { name: info.name, topics: info.topics }; } return { skills: catalog, totalSkills: total }; }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient! Great work on Economics.', skills: Object.keys(SKILLS) };
    const exercise = generateExercise(target.skill, 5);
    const source = SOURCE_EXCERPTS[target.skill] || null;
    return {
      studentId: id, targetSkill: target, exercise, graphDescription: source,
      lessonPlan: {
        review: 'Review previously covered concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.name}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        graph: source ? `Analyze: "${source.title}"` : 'Review key economic models and graphs',
        connect: 'Apply concepts to real-world economic situations',
      },
    };
  }
}

module.exports = HSEconomics;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new HSEconomics();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': { const [, id] = args; if (!id) throw new Error('Usage: start <id>'); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); if (skill) { out(api.generateExercise(skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, skill, sc, tot, ...notes] = args; if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total>'); out(api.recordAssessment(id, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node economics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'], skills: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
