// MS Social Studies Economics Tutor (Grades 6-8). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'ms-socialstudies-economics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'grade-6': {
    'fundamentals': ['scarcity-choice', 'opportunity-cost', 'economic-systems', 'supply-demand-basics'],
    'producers-consumers': ['entrepreneurship', 'wants-vs-needs', 'incentives'],
  },
  'grade-7': {
    'markets': ['market-structures', 'labor-market', 'market-failures', 'trade-comparative-advantage'],
    'financial-literacy': ['budgeting', 'saving-investing', 'banking-basics'],
  },
  'grade-8': {
    'macroeconomics': ['gdp-indicators', 'business-cycle', 'fiscal-policy', 'monetary-policy', 'inflation'],
    'global-economy': ['globalization', 'international-trade', 'economic-development'],
    'personal-finance': ['credit-debt', 'taxes', 'consumer-awareness'],
  },
};

const CONTENT_BANKS = {
  'grade-6': {
    'scarcity-choice': {
      questions: [
        { q: 'What is scarcity?', a: 'the condition of having unlimited wants but limited resources', alts: ['not enough resources for all wants', 'limited resources'] },
        { q: 'Why does scarcity force people to make choices?', a: 'because you cannot have everything, you must decide what is most important', alts: ['limited resources mean trade-offs', 'must prioritize'] },
        { q: 'Is scarcity only about money?', a: 'no, scarcity applies to time, resources, and anything that is limited', alts: ['no', 'applies to all limited things'] },
        { q: 'What is a trade-off?', a: 'giving up one thing to get another', alts: ['choosing between alternatives', 'sacrifice one option for another'] },
        { q: 'How do governments deal with scarcity?', a: 'by making decisions about how to allocate limited resources through budgets and policies', alts: ['budgets', 'policy decisions', 'resource allocation'] },
        { q: 'Give an example of scarcity in your daily life.', a: 'having limited time means choosing between homework and playing', alts: ['limited money', 'limited time', 'choosing between activities'] },
      ],
    },
    'opportunity-cost': {
      questions: [
        { q: 'What is opportunity cost?', a: 'the value of the next best alternative you give up when making a choice', alts: ['what you give up', 'the next best option foregone'] },
        { q: 'If you spend an hour studying instead of playing video games, what is the opportunity cost?', a: 'the enjoyment you would have gotten from playing video games', alts: ['playing video games', 'the fun of gaming'] },
        { q: 'Why is opportunity cost important for decision-making?', a: 'it helps you understand the true cost of any choice, not just the money', alts: ['shows real cost', 'reveals hidden costs'] },
        { q: 'Does every decision have an opportunity cost?', a: 'yes, because choosing one option always means giving up another', alts: ['yes'] },
        { q: 'What is marginal thinking?', a: 'deciding based on the additional cost or benefit of one more unit', alts: ['thinking about one more', 'cost of one additional'] },
        { q: 'If a city spends money on a new park instead of fixing roads, what is the opportunity cost?', a: 'the road repairs that will not happen', alts: ['better roads', 'fixed roads'] },
      ],
    },
    'economic-systems': {
      questions: [
        { q: 'What are the three basic economic questions every society must answer?', a: 'what to produce, how to produce it, and for whom to produce', alts: ['what how for whom'] },
        { q: 'What is a market economy?', a: 'an economy where supply and demand guide decisions with limited government involvement', alts: ['free market', 'private ownership and competition'] },
        { q: 'What is a command economy?', a: 'an economy where the government controls production and distribution', alts: ['government-controlled economy', 'centrally planned'] },
        { q: 'What is a traditional economy?', a: 'an economy based on customs, traditions, and subsistence activities', alts: ['based on tradition', 'customs guide economic decisions'] },
        { q: 'What is a mixed economy?', a: 'an economy that combines elements of market and command systems', alts: ['mix of market and government', 'both private and public'] },
        { q: 'What type of economic system does the United States have?', a: 'a mixed economy with mostly free markets but some government regulation', alts: ['mixed economy', 'mostly market'] },
      ],
    },
    'supply-demand-basics': {
      questions: [
        { q: 'What is the law of demand?', a: 'as the price of a good rises, the quantity demanded falls, and vice versa', alts: ['higher price means less demand', 'price up demand down'] },
        { q: 'What is the law of supply?', a: 'as the price of a good rises, the quantity supplied rises, and vice versa', alts: ['higher price means more supply', 'price up supply up'] },
        { q: 'What is equilibrium price?', a: 'the price where the quantity supplied equals the quantity demanded', alts: ['where supply meets demand', 'balance point'] },
        { q: 'What happens when there is a shortage?', a: 'demand exceeds supply, typically causing prices to rise', alts: ['more demand than supply', 'prices go up'] },
        { q: 'What happens when there is a surplus?', a: 'supply exceeds demand, typically causing prices to fall', alts: ['more supply than demand', 'prices go down'] },
        { q: 'Give an example of how price signals work.', a: 'if concert tickets sell out instantly, the high demand signals the price was too low', alts: ['high demand raises prices', 'prices communicate information'] },
      ],
    },
    'entrepreneurship': {
      questions: [
        { q: 'What is an entrepreneur?', a: 'a person who starts a business, taking on risk in hopes of making a profit', alts: ['business starter', 'risk-taker who creates businesses'] },
        { q: 'What is the profit motive?', a: 'the desire to earn money that drives people to start businesses and innovate', alts: ['desire for profit', 'incentive to make money'] },
        { q: 'What is creative destruction?', a: 'when new innovations replace old products or businesses', alts: ['new replaces old', 'innovation destroys outdated businesses'] },
        { q: 'What risks do entrepreneurs face?', a: 'financial loss, failure, uncertainty, and competition', alts: ['losing money', 'business failure'] },
        { q: 'How do entrepreneurs benefit society?', a: 'they create jobs, develop new products, and drive innovation', alts: ['jobs and innovation', 'new products'] },
        { q: 'Name one famous entrepreneur and what they created.', a: 'Henry Ford — affordable automobiles through the assembly line', alts: ['steve jobs apple', 'oprah winfrey media', 'any valid entrepreneur'] },
      ],
    },
    'wants-vs-needs': {
      questions: [
        { q: 'What is the difference between a want and a need?', a: 'needs are essentials for survival like food and shelter; wants are things you desire but can live without', alts: ['needs are essential', 'wants are extras'] },
        { q: 'Give two examples of needs.', a: 'food and shelter', alts: ['water', 'clothing', 'healthcare'] },
        { q: 'Give two examples of wants.', a: 'video games and designer clothing', alts: ['entertainment', 'luxury items'] },
        { q: 'Why is it important to distinguish between wants and needs when budgeting?', a: 'to make sure essential needs are covered before spending on wants', alts: ['prioritize spending', 'needs first'] },
        { q: 'Can something be a want for one person and a need for another?', a: 'yes, like a car might be a want in a city with transit but a need in a rural area', alts: ['yes', 'depends on circumstances'] },
        { q: 'How does advertising try to make wants feel like needs?', a: 'by creating urgency, emotional appeal, and social pressure to buy', alts: ['emotional manipulation', 'makes you feel you must have it'] },
      ],
    },
    'incentives': {
      questions: [
        { q: 'What is an incentive?', a: 'a reward or punishment that motivates behavior', alts: ['motivation to act', 'reason to do something'] },
        { q: 'Give an example of a positive incentive.', a: 'a bonus for good grades or a discount for buying more', alts: ['reward', 'bonus', 'tax break'] },
        { q: 'Give an example of a negative incentive.', a: 'a fine for speeding or a penalty for late payment', alts: ['fine', 'punishment', 'tax on cigarettes'] },
        { q: 'What are unintended consequences?', a: 'unexpected results of a policy or action that were not planned', alts: ['unexpected outcomes', 'side effects of decisions'] },
        { q: 'How do incentives affect economic behavior?', a: 'people tend to do more of what is rewarded and less of what is punished', alts: ['motivate choices', 'guide behavior'] },
        { q: 'Why do economists say "people respond to incentives"?', a: 'because changing the costs or benefits of an action changes how people behave', alts: ['behavior changes with incentives', 'costs and benefits drive choices'] },
      ],
    },
  },
  'grade-7': {
    'market-structures': {
      questions: [
        { q: 'What is perfect competition?', a: 'a market with many sellers offering identical products and no one controls the price', alts: ['many sellers same product', 'no price control'] },
        { q: 'What is a monopoly?', a: 'a market with only one seller who controls the price and supply', alts: ['one seller', 'single producer controls market'] },
        { q: 'What is an oligopoly?', a: 'a market dominated by a few large firms', alts: ['few large sellers', 'small number of firms dominate'] },
        { q: 'Why are monopolies generally bad for consumers?', a: 'without competition, monopolies can charge higher prices and offer lower quality', alts: ['higher prices', 'no competition'] },
        { q: 'What are antitrust laws?', a: 'laws that prevent monopolies and promote competition', alts: ['anti-monopoly laws', 'promote competition'] },
        { q: 'How does competition benefit consumers?', a: 'it leads to lower prices, better quality, and more choices', alts: ['lower prices', 'better products', 'more options'] },
      ],
    },
    'labor-market': {
      questions: [
        { q: 'What is human capital?', a: 'the knowledge, skills, and experience that make workers productive', alts: ['worker skills', 'education and training'] },
        { q: 'How do wages get determined in a market economy?', a: 'by supply and demand for labor — scarce skills earn higher wages', alts: ['supply and demand', 'scarce skills pay more'] },
        { q: 'What is the minimum wage debate about?', a: 'whether setting a wage floor helps workers or reduces jobs', alts: ['helps workers vs reduces employment', 'wage floor effects'] },
        { q: 'What is unemployment?', a: 'when people who want to work cannot find jobs', alts: ['joblessness', 'unable to find work'] },
        { q: 'How does education affect earning potential?', a: 'more education generally leads to higher wages and more job opportunities', alts: ['more education means higher pay', 'education increases earnings'] },
        { q: 'What is a labor union?', a: 'an organization of workers that bargains collectively for better wages and conditions', alts: ['worker organization', 'collective bargaining group'] },
      ],
    },
    'market-failures': {
      questions: [
        { q: 'What is a market failure?', a: 'when the free market fails to allocate resources efficiently', alts: ['market does not work properly', 'inefficient allocation'] },
        { q: 'What is an externality?', a: 'a cost or benefit that affects someone who is not directly involved in the transaction', alts: ['side effect on third parties', 'unintended impact on others'] },
        { q: 'Give an example of a negative externality.', a: 'factory pollution that affects nearby residents health', alts: ['pollution', 'secondhand smoke'] },
        { q: 'Give an example of a positive externality.', a: 'education benefits not just the student but all of society', alts: ['education', 'vaccines protect everyone'] },
        { q: 'What is a public good?', a: 'a good that is non-excludable and non-rivalrous, like national defense or street lights', alts: ['everyone can use it', 'cannot exclude people'] },
        { q: 'Why might the government need to intervene when there are market failures?', a: 'to correct externalities, provide public goods, and protect consumers', alts: ['fix market problems', 'regulate for public benefit'] },
      ],
    },
    'trade-comparative-advantage': {
      questions: [
        { q: 'What is comparative advantage?', a: 'the ability to produce a good at a lower opportunity cost than another producer', alts: ['produce at lower cost', 'relative efficiency'] },
        { q: 'Why do countries trade with each other?', a: 'because specializing in what they do best and trading makes everyone better off', alts: ['specialization benefits all', 'mutual benefit'] },
        { q: 'What is a tariff?', a: 'a tax on imported goods', alts: ['import tax'] },
        { q: 'What is free trade?', a: 'trade between countries without tariffs or other barriers', alts: ['no trade barriers', 'unrestricted trade'] },
        { q: 'What is the balance of trade?', a: 'the difference between a countrys exports and imports', alts: ['exports minus imports'] },
        { q: 'Name one argument for and one against free trade.', a: 'for: lower prices and more choices; against: can cost domestic jobs', alts: ['pro lower prices', 'con job losses'] },
      ],
    },
    'budgeting': {
      questions: [
        { q: 'What is a budget?', a: 'a plan for how to spend and save money', alts: ['spending plan', 'financial plan'] },
        { q: 'What is the first step in creating a budget?', a: 'track your income and expenses to know where your money goes', alts: ['track spending', 'know your income'] },
        { q: 'What is the 50-30-20 budgeting rule?', a: '50 percent needs, 30 percent wants, 20 percent savings', alts: ['50 needs 30 wants 20 savings'] },
        { q: 'Why is it important to pay yourself first?', a: 'setting aside savings before spending ensures you build wealth over time', alts: ['save first', 'savings before spending'] },
        { q: 'What is the difference between fixed and variable expenses?', a: 'fixed expenses stay the same each month like rent; variable expenses change like food', alts: ['fixed is constant', 'variable changes'] },
        { q: 'What should you do if your expenses exceed your income?', a: 'reduce spending, especially on wants, or find ways to increase income', alts: ['cut spending', 'spend less'] },
      ],
    },
    'saving-investing': {
      questions: [
        { q: 'What is the difference between saving and investing?', a: 'saving is putting money aside safely; investing is using money to earn more but with risk', alts: ['saving is safe', 'investing has risk and reward'] },
        { q: 'What is compound interest?', a: 'earning interest on both your original money and the interest it has already earned', alts: ['interest on interest', 'money grows on itself'] },
        { q: 'What does diversification mean in investing?', a: 'spreading investments across different types to reduce risk', alts: ['dont put all eggs in one basket', 'spread risk'] },
        { q: 'What is the relationship between risk and return?', a: 'higher potential returns usually come with higher risk', alts: ['more risk more reward', 'risk and return are related'] },
        { q: 'Why should you start saving and investing early?', a: 'compound interest has more time to grow your money', alts: ['time value of money', 'money grows over time'] },
        { q: 'What is a stock?', a: 'a share of ownership in a company', alts: ['partial ownership', 'piece of a company'] },
      ],
    },
    'banking-basics': {
      questions: [
        { q: 'What is the main function of a bank?', a: 'to accept deposits, make loans, and provide financial services', alts: ['hold money and make loans', 'financial intermediary'] },
        { q: 'What is the difference between a checking and savings account?', a: 'checking is for everyday spending; savings earns interest and is for long-term storage', alts: ['checking for spending', 'savings earns interest'] },
        { q: 'What is FDIC insurance?', a: 'government insurance that protects bank deposits up to $250,000 if the bank fails', alts: ['protects deposits', 'bank deposit insurance'] },
        { q: 'How do banks make money?', a: 'by charging higher interest on loans than they pay on deposits', alts: ['interest spread', 'loan interest minus deposit interest'] },
        { q: 'What is interest?', a: 'the cost of borrowing money or the reward for saving money', alts: ['price of borrowing', 'payment for lending'] },
        { q: 'What is digital banking?', a: 'managing money through apps and websites instead of going to a physical bank', alts: ['online banking', 'mobile banking'] },
      ],
    },
  },
  'grade-8': {
    'gdp-indicators': {
      questions: [
        { q: 'What is GDP?', a: 'Gross Domestic Product — the total value of all goods and services produced in a country in a year', alts: ['total value of production', 'measure of economic output'] },
        { q: 'What does the unemployment rate measure?', a: 'the percentage of people in the labor force who want work but cannot find it', alts: ['percent of jobless workers', 'share of workforce without jobs'] },
        { q: 'What is the inflation rate?', a: 'the rate at which the general level of prices rises over time', alts: ['rate of price increase', 'how fast prices rise'] },
        { q: 'What is the Consumer Price Index (CPI)?', a: 'a measure that tracks changes in the price of a basket of common goods and services', alts: ['price tracker', 'measures cost of living changes'] },
        { q: 'Why is GDP per capita more useful than total GDP for comparing countries?', a: 'it divides GDP by population, showing average economic output per person', alts: ['gdp per person', 'accounts for population size'] },
        { q: 'What does it mean when GDP is growing?', a: 'the economy is producing more goods and services than before', alts: ['economic growth', 'economy expanding'] },
      ],
    },
    'business-cycle': {
      questions: [
        { q: 'What are the four phases of the business cycle?', a: 'expansion, peak, recession, and trough', alts: ['growth peak contraction bottom'] },
        { q: 'What happens during a recession?', a: 'economic output declines, unemployment rises, and spending decreases', alts: ['economy shrinks', 'less production and more unemployment'] },
        { q: 'What happens during expansion?', a: 'GDP grows, unemployment falls, and businesses invest and hire', alts: ['economy grows', 'more jobs'] },
        { q: 'What is a depression?', a: 'a severe and prolonged recession with very high unemployment', alts: ['deep recession', 'severe economic downturn'] },
        { q: 'What can cause a recession?', a: 'reduced consumer spending, financial crises, rising interest rates, or external shocks', alts: ['less spending', 'financial crisis'] },
        { q: 'How does the business cycle affect ordinary people?', a: 'recessions mean job losses and hardship; expansions mean more opportunity', alts: ['jobs and income affected', 'impacts employment'] },
      ],
    },
    'fiscal-policy': {
      questions: [
        { q: 'What is fiscal policy?', a: 'government decisions about spending and taxation to influence the economy', alts: ['government spending and taxes', 'taxing and spending policy'] },
        { q: 'How can the government stimulate the economy during a recession?', a: 'by increasing spending or cutting taxes to put more money in peoples hands', alts: ['spend more or tax less', 'stimulus spending'] },
        { q: 'What is a budget deficit?', a: 'when the government spends more than it collects in revenue', alts: ['spending exceeds revenue', 'government overspending'] },
        { q: 'What is the national debt?', a: 'the total amount of money the government owes from accumulated deficits', alts: ['total government debt', 'accumulated borrowing'] },
        { q: 'What is the trade-off of government stimulus spending?', a: 'it can boost the economy short-term but increases debt for future generations', alts: ['growth now vs debt later', 'short-term gain long-term debt'] },
        { q: 'Who decides fiscal policy in the United States?', a: 'Congress and the President through the federal budget process', alts: ['congress', 'congress and president'] },
      ],
    },
    'monetary-policy': {
      questions: [
        { q: 'What is monetary policy?', a: 'central bank actions to control the money supply and interest rates', alts: ['managing money supply', 'fed controls interest rates'] },
        { q: 'What is the Federal Reserve?', a: 'the central bank of the United States that manages monetary policy', alts: ['the fed', 'us central bank'] },
        { q: 'How does lowering interest rates stimulate the economy?', a: 'borrowing becomes cheaper, encouraging spending and investment', alts: ['cheaper loans', 'more borrowing and spending'] },
        { q: 'How does raising interest rates slow the economy?', a: 'borrowing becomes more expensive, discouraging spending and cooling inflation', alts: ['expensive loans', 'less spending'] },
        { q: 'What is the money supply?', a: 'the total amount of money circulating in the economy', alts: ['total money in circulation', 'all available money'] },
        { q: 'Why is the Federal Reserve independent from the President and Congress?', a: 'to make economic decisions based on data rather than political pressure', alts: ['avoid political influence', 'independent judgment'] },
      ],
    },
    'inflation': {
      questions: [
        { q: 'What is inflation?', a: 'a general increase in prices and decrease in the purchasing power of money', alts: ['rising prices', 'money buys less'] },
        { q: 'What causes inflation?', a: 'too much money chasing too few goods, or rising production costs', alts: ['excess money supply', 'demand exceeds supply'] },
        { q: 'What is hyperinflation?', a: 'extremely rapid inflation that makes money nearly worthless', alts: ['out of control inflation', 'prices skyrocket'] },
        { q: 'How does inflation affect people on fixed incomes?', a: 'their income stays the same while prices rise, reducing their purchasing power', alts: ['they can afford less', 'real income falls'] },
        { q: 'What is deflation and why can it be harmful?', a: 'falling prices that can cause people to delay spending, leading to economic decline', alts: ['falling prices', 'opposite of inflation'] },
        { q: 'Name a historical example of hyperinflation.', a: 'Germany in the 1920s when people needed wheelbarrows of cash to buy bread', alts: ['weimar germany', 'zimbabwe', 'venezuela'] },
      ],
    },
    'globalization': {
      questions: [
        { q: 'What is globalization?', a: 'the increasing interconnection of the worlds economies, cultures, and populations', alts: ['world becoming more connected', 'global interdependence'] },
        { q: 'How have global supply chains changed manufacturing?', a: 'products are made with parts from many countries, reducing costs but increasing complexity', alts: ['parts from everywhere', 'international production'] },
        { q: 'What is outsourcing?', a: 'when a company moves jobs or production to another country for lower costs', alts: ['moving jobs abroad', 'foreign production'] },
        { q: 'Name one benefit of globalization.', a: 'lower prices for consumers through access to cheaper goods', alts: ['cheaper goods', 'more variety', 'economic growth'] },
        { q: 'Name one criticism of globalization.', a: 'it can cause job losses in wealthier countries and exploit workers in poorer countries', alts: ['job losses', 'worker exploitation', 'inequality'] },
        { q: 'What is economic interdependence?', a: 'when countries depend on each other for goods, services, and resources', alts: ['mutual dependence', 'countries need each other'] },
      ],
    },
    'international-trade': {
      questions: [
        { q: 'What is an export?', a: 'a good or service sold to another country', alts: ['selling abroad'] },
        { q: 'What is an import?', a: 'a good or service bought from another country', alts: ['buying from abroad'] },
        { q: 'What is a trade deficit?', a: 'when a country imports more than it exports', alts: ['imports exceed exports'] },
        { q: 'What is a trade agreement?', a: 'a deal between countries to reduce trade barriers like tariffs', alts: ['agreement to reduce tariffs', 'free trade deal'] },
        { q: 'Why do some people oppose free trade agreements?', a: 'they can lead to job losses in industries that cannot compete with cheaper foreign goods', alts: ['domestic job losses', 'unfair competition'] },
        { q: 'What is an embargo?', a: 'a government ban on trade with another country', alts: ['trade ban', 'trade prohibition'] },
      ],
    },
    'economic-development': {
      questions: [
        { q: 'What is the difference between a developed and developing country?', a: 'developed countries have higher GDP, better infrastructure, and higher living standards', alts: ['rich vs poor', 'high vs low gdp'] },
        { q: 'What factors contribute to economic development?', a: 'education, infrastructure, stable government, natural resources, and investment', alts: ['education and infrastructure', 'investment and stability'] },
        { q: 'What is foreign aid?', a: 'money or resources given by wealthy countries to help developing nations', alts: ['help from rich to poor countries', 'development assistance'] },
        { q: 'What is microfinance?', a: 'small loans given to entrepreneurs in developing countries who cannot get traditional bank loans', alts: ['small loans for the poor', 'micro-lending'] },
        { q: 'How can education promote economic development?', a: 'educated workers are more productive and can innovate, driving economic growth', alts: ['human capital', 'skilled workers grow economy'] },
        { q: 'What role does infrastructure play in economic development?', a: 'roads, electricity, and internet access enable trade, communication, and economic activity', alts: ['enables trade', 'foundation for growth'] },
      ],
    },
    'credit-debt': {
      questions: [
        { q: 'What is credit?', a: 'the ability to borrow money with the promise to repay it later, usually with interest', alts: ['borrowing money', 'buy now pay later'] },
        { q: 'What is a credit score?', a: 'a number that represents your creditworthiness based on your borrowing history', alts: ['borrowing reputation', 'financial trustworthiness number'] },
        { q: 'Why is a good credit score important?', a: 'it affects your ability to get loans, rent apartments, and even get some jobs', alts: ['better loan rates', 'access to borrowing'] },
        { q: 'What is the danger of only making minimum payments on credit card debt?', a: 'interest accumulates and the total amount paid can be much more than the original purchase', alts: ['debt grows', 'pay much more over time'] },
        { q: 'What is the difference between good debt and bad debt?', a: 'good debt helps build value like a mortgage or education; bad debt is for depreciating wants', alts: ['good builds value', 'bad loses value'] },
        { q: 'What is a budget tip for managing debt?', a: 'pay more than the minimum, prioritize high-interest debt, and avoid new unnecessary debt', alts: ['pay extra', 'tackle high interest first'] },
      ],
    },
    'taxes': {
      questions: [
        { q: 'Why do governments collect taxes?', a: 'to fund public services like schools, roads, military, and social programs', alts: ['pay for public services', 'fund government'] },
        { q: 'What is the difference between a progressive and flat tax?', a: 'progressive taxes higher earners more; flat tax is the same rate for everyone', alts: ['progressive increases with income', 'flat is equal rate'] },
        { q: 'What is income tax?', a: 'a tax on the money people earn from working or investments', alts: ['tax on earnings', 'tax on wages'] },
        { q: 'What is sales tax?', a: 'a tax added to the price of goods and services at the point of sale', alts: ['tax on purchases', 'added to price'] },
        { q: 'What is property tax?', a: 'a tax on real estate and sometimes personal property', alts: ['tax on land and buildings', 'homeowner tax'] },
        { q: 'Why is there debate about how much to tax?', a: 'higher taxes fund more services but may reduce incentives to work and invest', alts: ['trade-off between services and incentives', 'fairness debate'] },
      ],
    },
    'consumer-awareness': {
      questions: [
        { q: 'What is comparison shopping?', a: 'checking prices and quality at multiple stores or online before buying', alts: ['comparing prices', 'shopping around'] },
        { q: 'How do advertisers try to influence your spending?', a: 'through emotional appeals, celebrity endorsements, and creating a sense of urgency', alts: ['emotional manipulation', 'persuasion techniques'] },
        { q: 'What is a scam and how can you protect yourself?', a: 'a dishonest scheme to steal money; protect yourself by verifying claims and never sharing personal info', alts: ['fraud', 'dont share personal information'] },
        { q: 'What are consumer rights?', a: 'the right to safety, information, choice, and to be heard when something goes wrong', alts: ['safety information choice voice'] },
        { q: 'Why is reading the fine print important before signing a contract?', a: 'it contains important terms, fees, and conditions that may not be obvious', alts: ['hidden terms', 'know what you are agreeing to'] },
        { q: 'What is the difference between a need and a marketing-created want?', a: 'needs are genuine necessities; marketing-created wants are desires manufactured by advertising', alts: ['real vs manufactured desire', 'advertising creates wants'] },
      ],
    },
  },
};

const SCENARIOS = {
  'grade-6': [
    { title: 'The Lemonade Stand', focus: 'supply and demand', text: 'You are running a lemonade stand. On a hot day, 50 people want to buy lemonade but you only have 20 cups. The next day it rains and only 5 people come but you made 30 cups. What happens to your price each day? Why?' },
    { title: 'The School Budget', focus: 'scarcity and trade-offs', text: 'Your school has $10,000 to spend. They can buy new library books, new sports equipment, or new computers — but not all three. What would you choose and why? What is the opportunity cost of your choice?' },
  ],
  'grade-7': [
    { title: 'The Minimum Wage Debate', focus: 'labor market', text: 'A city is debating raising the minimum wage from $10 to $15. Workers say they cannot afford rent. Business owners say they will have to fire workers or raise prices. Using economic reasoning, what are the trade-offs of each position?' },
    { title: 'The Trade Deal', focus: 'international trade', text: 'Country A makes cars cheaply. Country B grows coffee cheaply. Should they trade? What happens to workers in Country As coffee industry? How do consumers in both countries benefit? What are the trade-offs?' },
  ],
  'grade-8': [
    { title: 'The Recession Response', focus: 'fiscal and monetary policy', text: 'The economy is in recession: unemployment is 10%, businesses are closing, and consumer spending is falling. Should the government cut taxes, increase spending, or let the market self-correct? What would the Federal Reserve do? What are the risks of each approach?' },
    { title: 'The Globalization Dilemma', focus: 'globalization', text: 'A company can move its factory overseas, cutting costs by 40% but eliminating 500 local jobs. Consumers will get cheaper products. Workers will lose their livelihoods. What should the company do? What should the government do? Who bears the costs of globalization?' },
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
  return { studentId: id, grade: null, createdAt: new Date().toISOString(), assessments: [], skills: {} };
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

function generateExercise(grade, skill, count = 5) {
  const bank = CONTENT_BANKS[grade]?.[skill];
  if (!bank || !bank.questions) return { error: `No content bank for ${grade}/${skill}` };
  const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, acceptedAnswers: q.alts || [] }));
  return { type: 'short-answer', skill, grade, count: items.length, instruction: 'Answer each economics question.', items };
}

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

class MSEconomics {
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
    const grade = p.grade || 'grade-6';
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
    const grade = p.grade || 'grade-6';
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

  checkAnswer(type, expected, answer) {
    let exp = expected;
    if (typeof exp === 'string') {
      const bank = Object.values(CONTENT_BANKS).flatMap(g => Object.values(g)).find(b => b.questions?.some(q => q.a === exp));
      if (bank) {
        const q = bank.questions.find(q => q.a === exp);
        if (q && q.alts) exp = [exp, ...q.alts];
      }
    }
    return { correct: checkAnswer(type, exp, answer), expected, studentAnswer: answer };
  }

  getScenario(grade) {
    const scenarios = SCENARIOS[grade];
    if (!scenarios) return { error: `No scenarios for ${grade}. Available: ${Object.keys(SCENARIOS).join(', ')}` };
    return pick(scenarios, 1)[0];
  }

  generateLesson(id) {
    const p = loadProfile(id);
    const grade = p.grade || 'grade-6';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${grade} level are proficient! Ready for next grade.`, grade };
    const exercise = generateExercise(grade, target.skill, 5);
    const scenario = SCENARIOS[grade] ? pick(SCENARIOS[grade], 1)[0] : null;
    return {
      studentId: id, grade, targetSkill: target, exercise, scenario,
      lessonPlan: {
        hook: `Real-world economic scenario related to: ${target.category} - ${target.skill}`,
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: scenario ? `Analyze scenario: "${scenario.title}"` : 'Connect to real-world economics',
        connect: 'Link to personal finance, current events, or historical economics',
      },
    };
  }
}

module.exports = MSEconomics;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new MSEconomics();
  const out = d => console.log(JSON.stringify(d, null, 2));

  try {
    switch (cmd) {
      case 'start': {
        const [, id, grade] = args;
        if (!id) throw new Error('Usage: start <id> [grade]');
        if (grade) api.setGrade(id, grade);
        out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) });
        break;
      }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': {
        const [, id, skill] = args;
        if (!id) throw new Error('Usage: exercise <id> [skill]');
        const grade = loadProfile(id).grade || 'grade-6';
        if (skill) { out(api.generateExercise(grade, skill, 5)); }
        else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(grade, n[0].skill, 5) : { message: 'All skills proficient at current grade!' }); }
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
        const [, id, grade, cat, skill, sc, tot, ...notes] = args;
        if (!id || !grade || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <grade> <cat> <skill> <score> <total> [notes]');
        out(api.recordAssessment(id, grade, cat, skill, Number(sc), Number(tot), notes.join(' ')));
        break;
      }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { const [, g] = args; out(g ? api.getSkillCatalog(g) : { grades: Object.keys(SKILLS) }); break; }
      case 'students': { out(api.listStudents()); break; }
      case 'set-grade': { const [, id, g] = args; if (!id || !g) throw new Error('Usage: set-grade <id> <grade>'); out(api.setGrade(id, g)); break; }
      case 'scenario': { const [, g] = args; if (!g) throw new Error('Usage: scenario <grade>'); out(api.getScenario(g)); break; }
      default: out({ usage: 'node economics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-grade','scenario'], grades: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
