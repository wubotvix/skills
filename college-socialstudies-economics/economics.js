// eClaw College Economics Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-socialstudies-economics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'principles': {
    'supply-and-demand': ['demand-curves', 'supply-curves', 'equilibrium', 'shifts-vs-movements', 'elasticity-intro'],
    'market-structures': ['perfect-competition', 'monopoly-basics', 'oligopoly-intro', 'monopolistic-competition'],
    'macro-fundamentals': ['gdp-measurement', 'inflation-basics', 'unemployment-types', 'business-cycle'],
    'policy-basics': ['fiscal-policy-intro', 'monetary-policy-intro', 'trade-basics', 'market-failure-intro'],
  },
  'intermediate': {
    'consumer-theory': ['utility-maximization', 'indifference-curves', 'budget-constraints', 'income-substitution-effects', 'lagrangian-optimization'],
    'producer-theory': ['production-functions', 'cost-minimization', 'profit-maximization', 'returns-to-scale'],
    'macro-models': ['is-lm-model', 'ad-as-model', 'solow-growth-model', 'phillips-curve'],
    'market-analysis': ['general-equilibrium', 'welfare-theorems', 'externalities-formal', 'public-goods-theory'],
  },
  'quantitative': {
    'econometrics-foundations': ['ols-regression', 'hypothesis-testing', 'confidence-intervals', 'multivariate-regression'],
    'causal-inference': ['instrumental-variables', 'difference-in-differences', 'regression-discontinuity', 'panel-data-methods'],
    'time-series': ['stationarity', 'autoregression', 'cointegration', 'forecasting-methods'],
    'applied-methods': ['program-evaluation', 'natural-experiments', 'survey-design', 'data-visualization'],
  },
  'advanced': {
    'game-theory': ['nash-equilibrium', 'sequential-games', 'repeated-games', 'mechanism-design', 'auction-theory'],
    'behavioral-economics': ['prospect-theory', 'bounded-rationality', 'nudge-theory', 'time-inconsistency', 'social-preferences'],
    'development-economics': ['poverty-traps', 'institutions-and-growth', 'rct-methodology', 'structural-transformation'],
    'international-economics': ['comparative-advantage', 'heckscher-ohlin', 'new-trade-theory', 'exchange-rate-models'],
  },
};

const QUESTION_BANKS = {
  'principles': {
    'demand-curves': {
      items: [
        { prompt: 'What does the law of demand state?', answer: 'As price increases, quantity demanded decreases (ceteris paribus), creating a downward-sloping demand curve.', type: 'concept' },
        { prompt: 'What is the difference between a change in demand and a change in quantity demanded?', answer: 'A change in quantity demanded is a movement along the curve from price change. A change in demand shifts the entire curve due to non-price factors.', type: 'concept' },
        { prompt: 'If consumer income rises and good X is normal, what happens to demand for X? A) Shifts left B) Shifts right C) Movement along curve', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Name three factors that shift the demand curve.', answer: 'Consumer income, prices of related goods (substitutes/complements), consumer preferences, population, and expectations about future prices.', type: 'concept' },
        { prompt: 'If a frost destroys coffee crops, what happens to price and quantity in the coffee market?', answer: 'Supply shifts left. Equilibrium price rises and equilibrium quantity falls.', type: 'graphical' },
      ],
    },
    'supply-curves': {
      items: [
        { prompt: 'What does the law of supply state?', answer: 'As price increases, quantity supplied increases (ceteris paribus), creating an upward-sloping supply curve.', type: 'concept' },
        { prompt: 'Name three factors that shift the supply curve.', answer: 'Input prices, technology, number of sellers, government regulations/taxes, and expectations.', type: 'concept' },
        { prompt: 'New technology reduces production costs. What happens to supply? A) Shifts left B) Shifts right C) Movement along curve', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Why is the supply curve typically upward-sloping?', answer: 'Higher prices make production more profitable; increasing marginal costs mean firms need higher prices for additional units.', type: 'concept' },
      ],
    },
    'equilibrium': {
      items: [
        { prompt: 'What defines market equilibrium?', answer: 'The price and quantity where quantity demanded equals quantity supplied — no surplus or shortage.', type: 'concept' },
        { prompt: 'If market price is above equilibrium, what occurs? A) Shortage B) Surplus C) Equilibrium', answer: 'B', type: 'multiple-choice' },
        { prompt: 'Both demand and supply increase. What happens to equilibrium price and quantity?', answer: 'Quantity increases. Price is ambiguous — depends on relative magnitude of the shifts.', type: 'analysis' },
        { prompt: 'Price ceiling vs. price floor — define each with an example.', answer: 'Ceiling: legal maximum (rent control), causes shortages when binding. Floor: legal minimum (minimum wage), causes surpluses when binding.', type: 'concept' },
      ],
    },
    'shifts-vs-movements': {
      items: [
        { prompt: 'A tax on cigarettes increases their price. Shift or movement? Explain.', answer: 'Tax shifts supply left. Consumers experience a movement along the demand curve to higher price and lower quantity.', type: 'analysis' },
        { prompt: 'True or false: A change in price causes the demand curve to shift.', answer: 'False. Price change causes movement along the curve. Only non-price factors shift it.', type: 'true-false' },
      ],
    },
    'elasticity-intro': {
      items: [
        { prompt: 'Define price elasticity of demand.', answer: 'Percentage change in quantity demanded divided by percentage change in price. Measures consumer responsiveness to price changes.', type: 'concept' },
        { prompt: 'If elasticity = -2, a 10% price increase causes what change in quantity demanded?', answer: 'A 20% decrease in quantity demanded.', type: 'calculation' },
        { prompt: 'Why is demand for insulin relatively inelastic?', answer: 'It is a medical necessity with no close substitutes, so quantity demanded changes little regardless of price.', type: 'analysis' },
        { prompt: 'What happens to total revenue when price increases and demand is elastic?', answer: 'Total revenue decreases because the percentage drop in quantity exceeds the percentage increase in price.', type: 'concept' },
      ],
    },
    'perfect-competition': {
      items: [
        { prompt: 'List four characteristics of perfect competition.', answer: 'Many buyers/sellers, homogeneous products, free entry/exit, perfect information.', type: 'concept' },
        { prompt: 'Why is a perfectly competitive firm a "price taker"?', answer: 'Each firm is too small to influence price. Charging above market price means zero sales; below is unnecessary.', type: 'concept' },
        { prompt: 'In long-run competitive equilibrium, economic profit equals: A) Positive B) Zero C) Negative', answer: 'B', type: 'multiple-choice' },
      ],
    },
    'monopoly-basics': {
      items: [
        { prompt: 'Why does a monopolist face a downward-sloping demand curve?', answer: 'The monopolist IS the market — to sell more it must lower price, unlike a competitive firm that can sell any quantity at market price.', type: 'concept' },
        { prompt: 'What is deadweight loss from monopoly?', answer: 'Reduction in total surplus caused by the monopolist restricting output below competitive level and charging higher price.', type: 'concept' },
      ],
    },
    'oligopoly-intro': {
      items: [
        { prompt: 'What distinguishes oligopoly from other market structures?', answer: 'Few large firms, interdependent decisions (each firm\'s choices affect others), significant barriers to entry.', type: 'concept' },
        { prompt: 'Why is game theory relevant to oligopoly?', answer: 'Firms are interdependent — each must consider rivals\' reactions, which is strategic interaction modeled by game theory.', type: 'concept' },
      ],
    },
    'monopolistic-competition': {
      items: [
        { prompt: 'How does monopolistic competition combine monopoly and perfect competition?', answer: 'Like monopoly: pricing power from differentiated products. Like competition: many firms and free entry drives long-run profit to zero.', type: 'concept' },
      ],
    },
    'gdp-measurement': {
      items: [
        { prompt: 'Define GDP and the expenditure approach.', answer: 'Total market value of final goods/services produced in a country in a year. Expenditure: GDP = C + I + G + (X - M).', type: 'concept' },
        { prompt: 'Nominal vs. real GDP — what is the difference?', answer: 'Nominal uses current prices; real adjusts for inflation using base-year prices, measuring actual output changes.', type: 'concept' },
        { prompt: 'Name two limitations of GDP as a welfare measure.', answer: 'Excludes non-market activities, ignores income distribution, omits environmental degradation, does not measure quality of life.', type: 'analysis' },
      ],
    },
    'inflation-basics': {
      items: [
        { prompt: 'Define inflation and name two measurement methods.', answer: 'Sustained increase in general price level. Measured by CPI and GDP deflator.', type: 'concept' },
        { prompt: 'Demand-pull vs. cost-push inflation?', answer: 'Demand-pull: aggregate demand exceeds supply. Cost-push: rising production costs push prices up.', type: 'concept' },
      ],
    },
    'unemployment-types': {
      items: [
        { prompt: 'Distinguish frictional, structural, and cyclical unemployment.', answer: 'Frictional: temporary, between jobs. Structural: skills mismatch. Cyclical: caused by economic downturns.', type: 'concept' },
        { prompt: 'What is the natural rate of unemployment?', answer: 'The rate at full employment — includes frictional and structural but not cyclical. Economy at potential GDP.', type: 'concept' },
      ],
    },
    'business-cycle': {
      items: [
        { prompt: 'Name the four phases of the business cycle.', answer: 'Expansion (rising output), peak (maximum), contraction/recession (falling output), trough (minimum before recovery).', type: 'concept' },
        { prompt: 'How is a recession typically defined?', answer: 'Two consecutive quarters of declining real GDP, though NBER uses a broader assessment.', type: 'concept' },
      ],
    },
    'fiscal-policy-intro': {
      items: [
        { prompt: 'What are the two main tools of fiscal policy?', answer: 'Government spending and taxation. Expansionary: increase spending or cut taxes. Contractionary: opposite.', type: 'concept' },
        { prompt: 'What is the multiplier effect?', answer: 'Initial spending change leads to larger GDP change because each dollar spent becomes income, part of which is re-spent.', type: 'concept' },
      ],
    },
    'monetary-policy-intro': {
      items: [
        { prompt: 'What are the Fed\'s main monetary policy tools?', answer: 'Federal funds rate target, open market operations (buying/selling bonds), reserve requirements.', type: 'concept' },
        { prompt: 'How does lowering interest rates stimulate the economy?', answer: 'Lower rates reduce borrowing costs, encouraging investment and consumption, increasing aggregate demand.', type: 'concept' },
      ],
    },
    'trade-basics': {
      items: [
        { prompt: 'What is comparative advantage?', answer: 'A country has comparative advantage if it produces a good at lower opportunity cost. Trade allows both countries to consume beyond their PPFs.', type: 'concept' },
      ],
    },
    'market-failure-intro': {
      items: [
        { prompt: 'Name four types of market failure.', answer: 'Externalities, public goods, asymmetric information, market power (monopoly/oligopoly).', type: 'concept' },
        { prompt: 'What is an externality? Give one positive and one negative example.', answer: 'Cost/benefit affecting uninvolved third parties. Negative: factory pollution. Positive: vaccination protecting others.', type: 'concept' },
      ],
    },
  },
  'intermediate': {
    'utility-maximization': {
      items: [
        { prompt: 'State the utility maximization condition with two goods.', answer: 'MUx/Px = MUy/Py, or MRS = Px/Py at tangency of indifference curve and budget line.', type: 'concept' },
        { prompt: 'If MUx/Px > MUy/Py, what should the consumer do?', answer: 'Buy more X and less Y until ratios equalize through diminishing marginal utility.', type: 'analysis' },
      ],
    },
    'indifference-curves': {
      items: [
        { prompt: 'Why are indifference curves convex to the origin?', answer: 'Diminishing marginal rate of substitution — as you consume more of one good, you give up less of the other for an additional unit.', type: 'concept' },
        { prompt: 'Why can indifference curves never cross?', answer: 'Crossing would place one bundle on two curves with different utility levels, violating transitivity.', type: 'concept' },
      ],
    },
    'budget-constraints': {
      items: [
        { prompt: 'Write the budget constraint for goods X and Y with income M.', answer: 'PxX + PyY = M. Budget line slope: -Px/Py.', type: 'concept' },
        { prompt: 'How does an income increase affect the budget line?', answer: 'Parallel outward shift — can afford more of both goods. Slope unchanged.', type: 'concept' },
      ],
    },
    'income-substitution-effects': {
      items: [
        { prompt: 'Decompose a price decrease into income and substitution effects.', answer: 'Substitution: good is relatively cheaper, buy more. Income: purchasing power rises — for normal goods buy more, for inferior goods buy less.', type: 'concept' },
        { prompt: 'What is a Giffen good?', answer: 'A good where negative income effect (inferior) outweighs substitution effect, so demand falls when price falls — upward-sloping demand.', type: 'concept' },
      ],
    },
    'lagrangian-optimization': {
      items: [
        { prompt: 'Set up the Lagrangian for max U(x,y) subject to PxX + PyY = M.', answer: 'L = U(x,y) + lambda(M - PxX - PyY). FOCs: dU/dx = lambda*Px, dU/dy = lambda*Py, plus budget constraint.', type: 'calculation' },
        { prompt: 'What does the Lagrange multiplier represent economically?', answer: 'Marginal utility of income — additional utility from one more dollar of income.', type: 'concept' },
      ],
    },
    'production-functions': {
      items: [
        { prompt: 'Write the Cobb-Douglas production function.', answer: 'Q = A * K^alpha * L^beta. A = TFP, alpha + beta determines returns to scale.', type: 'concept' },
        { prompt: 'Define marginal product of labor and its typical behavior.', answer: 'MPL = dQ/dL. Typically declines as labor increases (diminishing returns) with fixed capital.', type: 'concept' },
      ],
    },
    'cost-minimization': {
      items: [
        { prompt: 'State the cost-minimization condition for two inputs.', answer: 'MPL/w = MPK/r, or MRTS = w/r. Equalize marginal product per dollar across inputs.', type: 'concept' },
      ],
    },
    'profit-maximization': {
      items: [
        { prompt: 'Profit-maximization condition for a competitive firm?', answer: 'P = MC, provided P >= AVC (short run) and P >= ATC (long run).', type: 'concept' },
        { prompt: 'Why shut down if P < AVC?', answer: 'Cannot cover variable costs. Losing less money by shutting down and paying only fixed costs.', type: 'concept' },
      ],
    },
    'returns-to-scale': {
      items: [
        { prompt: 'Distinguish constant, increasing, and decreasing returns to scale.', answer: 'Doubling inputs: doubles output = constant; more than doubles = increasing; less = decreasing.', type: 'concept' },
      ],
    },
    'is-lm-model': {
      items: [
        { prompt: 'What do IS and LM curves represent?', answer: 'IS: goods market equilibrium (I=S). LM: money market equilibrium (money demand = supply). Intersection gives equilibrium r and Y.', type: 'concept' },
        { prompt: 'In IS-LM, what happens when government spending increases?', answer: 'IS shifts right: output and interest rate rise. Higher interest rate partially crowds out private investment.', type: 'analysis' },
      ],
    },
    'ad-as-model': {
      items: [
        { prompt: 'Why is short-run aggregate supply upward-sloping?', answer: 'Sticky wages/prices. Firms produce more when prices rise because input costs adjust slowly.', type: 'concept' },
      ],
    },
    'solow-growth-model': {
      items: [
        { prompt: 'What drives long-run growth in the Solow model?', answer: 'Technological progress. Capital alone faces diminishing returns. Only sustained TFP growth drives permanent per-capita growth.', type: 'concept' },
        { prompt: 'What is the steady state?', answer: 'Where investment equals depreciation, so capital and output per worker are constant. Economy converges naturally.', type: 'concept' },
      ],
    },
    'phillips-curve': {
      items: [
        { prompt: 'What is the short-run Phillips curve?', answer: 'Inverse relationship between inflation and unemployment — lower unemployment associated with higher inflation.', type: 'concept' },
        { prompt: 'Why is the long-run Phillips curve vertical?', answer: 'Expectations adjust — workers demand higher wages, unemployment returns to natural rate regardless of inflation.', type: 'concept' },
      ],
    },
    'general-equilibrium': {
      items: [
        { prompt: 'General equilibrium vs. partial equilibrium?', answer: 'General: all markets simultaneously with interactions. Partial: one market in isolation, others held constant.', type: 'concept' },
      ],
    },
    'welfare-theorems': {
      items: [
        { prompt: 'State the First Welfare Theorem.', answer: 'Under perfect competition with complete markets and no externalities, competitive equilibrium is Pareto efficient.', type: 'concept' },
      ],
    },
    'externalities-formal': {
      items: [
        { prompt: 'How does a Pigouvian tax correct a negative externality?', answer: 'Tax equals marginal external cost, forcing internalization. Aligns private with social marginal cost for efficient output.', type: 'concept' },
      ],
    },
    'public-goods-theory': {
      items: [
        { prompt: 'Define public good and explain the free-rider problem.', answer: 'Non-rival and non-excludable. Free-rider: individuals benefit without paying, so markets under-provide.', type: 'concept' },
      ],
    },
  },
  'quantitative': {
    'ols-regression': {
      items: [
        { prompt: 'What does OLS minimize?', answer: 'Sum of squared residuals: min Sum(Yi - b0 - b1Xi)^2. Best fit by vertical distance.', type: 'concept' },
        { prompt: 'List the Gauss-Markov assumptions.', answer: 'Linearity, random sampling, no perfect multicollinearity, E[u|X]=0, homoskedasticity. OLS is then BLUE.', type: 'concept' },
        { prompt: 'What does R-squared measure and what are its limitations?', answer: 'Proportion of Y variance explained. Limitations: always rises with variables, no causation, misleading with nonlinearity.', type: 'concept' },
      ],
    },
    'hypothesis-testing': {
      items: [
        { prompt: 'Explain the null and alternative for a two-sided test of b1 = 0.', answer: 'H0: b1=0 (no effect). H1: b1 != 0. Reject H0 if t-statistic exceeds critical value or p < alpha.', type: 'concept' },
        { prompt: 'Statistical significance vs. economic significance?', answer: 'Statistical: unlikely due to chance. Economic: large enough to matter practically. Large samples can make tiny effects significant.', type: 'concept' },
      ],
    },
    'confidence-intervals': {
      items: [
        { prompt: 'Interpret a 95% CI for b1 of [0.3, 0.7].', answer: 'If repeated, 95% of intervals would contain true b1. This interval is one realization.', type: 'concept' },
      ],
    },
    'multivariate-regression': {
      items: [
        { prompt: 'Why include control variables?', answer: 'To reduce omitted variable bias by holding other factors constant, isolating the partial effect of interest.', type: 'concept' },
        { prompt: 'What is omitted variable bias?', answer: 'Arises when a variable correlated with both X and Y is excluded. Bias = effect on Y times correlation with X.', type: 'concept' },
      ],
    },
    'instrumental-variables': {
      items: [
        { prompt: 'What two conditions must a valid instrument satisfy?', answer: 'Relevance: correlated with endogenous variable. Exogeneity: affects Y only through X (exclusion restriction).', type: 'concept' },
        { prompt: 'Give a famous IV example.', answer: 'Angrist-Krueger: quarter of birth as instrument for schooling (compulsory attendance creates exogenous variation).', type: 'example' },
      ],
    },
    'difference-in-differences': {
      items: [
        { prompt: 'Explain the DiD estimator.', answer: 'Compares change over time between treatment and control: (Y_treat_post - Y_treat_pre) - (Y_control_post - Y_control_pre).', type: 'concept' },
        { prompt: 'What is the key DiD assumption?', answer: 'Parallel trends: absent treatment, both groups would have followed the same trend.', type: 'concept' },
      ],
    },
    'regression-discontinuity': {
      items: [
        { prompt: 'Explain regression discontinuity design.', answer: 'Exploits a threshold in a running variable that determines treatment. Comparing units just above/below gives local causal estimate.', type: 'concept' },
      ],
    },
    'panel-data-methods': {
      items: [
        { prompt: 'Advantage of panel data over cross-sectional?', answer: 'Controls for unobserved time-invariant heterogeneity through fixed effects, reducing omitted variable bias.', type: 'concept' },
        { prompt: 'Fixed effects vs. random effects?', answer: 'FE: unobserved effects can correlate with regressors. RE: assumes no correlation. Hausman test chooses.', type: 'concept' },
      ],
    },
    'stationarity': {
      items: [
        { prompt: 'What is stationarity and why does it matter?', answer: 'Constant mean, variance, autocovariance over time. Non-stationary data produces spurious regressions.', type: 'concept' },
      ],
    },
    'autoregression': {
      items: [
        { prompt: 'What is an AR(1) model?', answer: 'Yt = c + phi*Yt-1 + et. Current value depends on previous value plus shock. Stationary if |phi| < 1.', type: 'concept' },
      ],
    },
    'cointegration': {
      items: [
        { prompt: 'What is cointegration?', answer: 'Two non-stationary series whose linear combination is stationary — they share a long-run equilibrium.', type: 'concept' },
      ],
    },
    'forecasting-methods': {
      items: [
        { prompt: 'In-sample fit vs. out-of-sample performance?', answer: 'In-sample: explains historical data. Out-of-sample: predicts unseen data — better measure of forecasting ability.', type: 'concept' },
      ],
    },
    'program-evaluation': {
      items: [
        { prompt: 'What is the fundamental problem of causal inference?', answer: 'Cannot observe the same unit in both treatment and control states. The counterfactual is unobservable.', type: 'concept' },
      ],
    },
    'natural-experiments': {
      items: [
        { prompt: 'What is a natural experiment?', answer: 'An event creating quasi-random treatment assignment. Example: Card-Krueger used NJ minimum wage increase vs. PA.', type: 'concept' },
      ],
    },
    'survey-design': {
      items: [
        { prompt: 'Name two common sources of survey bias.', answer: 'Response bias (misreporting) and selection bias (non-random response, especially with low rates).', type: 'concept' },
      ],
    },
    'data-visualization': {
      items: [
        { prompt: 'Scatter plot vs. time series plot — when to use each?', answer: 'Scatter: relationship between two variables. Time series: how one variable changes over time.', type: 'concept' },
      ],
    },
  },
  'advanced': {
    'nash-equilibrium': {
      items: [
        { prompt: 'Define Nash equilibrium.', answer: 'Strategy profile where no player can improve payoff by unilaterally changing strategy, given others\' strategies.', type: 'concept' },
        { prompt: 'Find the Nash equilibrium in the Prisoner\'s Dilemma. Why is it not Pareto optimal?', answer: 'Both defect. Not Pareto optimal because mutual cooperation would make both better off, but individual incentives prevent it.', type: 'analysis' },
      ],
    },
    'sequential-games': {
      items: [
        { prompt: 'What is subgame perfect equilibrium?', answer: 'Strategies that are Nash equilibria in every subgame, eliminating non-credible threats. Found by backward induction.', type: 'concept' },
      ],
    },
    'repeated-games': {
      items: [
        { prompt: 'How can cooperation be sustained in infinitely repeated games?', answer: 'Trigger strategies (grim trigger, tit-for-tat) when players are patient enough. Folk Theorem shows many outcomes are sustainable.', type: 'concept' },
      ],
    },
    'mechanism-design': {
      items: [
        { prompt: 'What is mechanism design?', answer: '"Reverse game theory" — designing rules to achieve desired outcomes given strategic behavior with private information.', type: 'concept' },
      ],
    },
    'auction-theory': {
      items: [
        { prompt: 'State the Revenue Equivalence Theorem.', answer: 'Under standard assumptions (IPV, risk-neutral, symmetric bidders), all standard auction formats yield same expected revenue.', type: 'concept' },
      ],
    },
    'prospect-theory': {
      items: [
        { prompt: 'How does prospect theory differ from expected utility theory?', answer: 'Reference-dependent evaluation, loss aversion (losses loom larger), probability weighting. EU assumes global wealth maximization.', type: 'concept' },
        { prompt: 'What is loss aversion?', answer: 'Losses felt ~2x as strongly as gains. People reject favorable bets (e.g., 50-50 win $110/lose $100) despite positive expected value.', type: 'concept' },
      ],
    },
    'bounded-rationality': {
      items: [
        { prompt: 'What is bounded rationality?', answer: 'Simon argued people use heuristics and satisfice due to cognitive limits, challenging perfect rationality assumptions.', type: 'concept' },
      ],
    },
    'nudge-theory': {
      items: [
        { prompt: 'What is a "nudge"? Give an example.', answer: 'Changes choice architecture to steer behavior without restricting options. Example: opt-out retirement savings dramatically increases enrollment.', type: 'concept' },
      ],
    },
    'time-inconsistency': {
      items: [
        { prompt: 'What is time inconsistency?', answer: 'Preferences change over time so an ex-ante optimal plan is no longer optimal ex post. Example: planning to save but spending instead.', type: 'concept' },
      ],
    },
    'social-preferences': {
      items: [
        { prompt: 'What evidence challenges pure self-interest?', answer: 'Ultimatum game rejections, dictator game giving, public goods contributions, trust game reciprocity all show fairness concerns.', type: 'concept' },
      ],
    },
    'poverty-traps': {
      items: [
        { prompt: 'What is a poverty trap?', answer: 'Self-reinforcing cycle where poverty persists. Example: poor nutrition reduces productivity, reducing income, reducing nutrition.', type: 'concept' },
      ],
    },
    'institutions-and-growth': {
      items: [
        { prompt: 'Summarize Acemoglu and Robinson on institutions and growth.', answer: 'Inclusive institutions (property rights, rule of law, democracy) drive growth; extractive institutions concentrate power and inhibit development.', type: 'concept' },
      ],
    },
    'rct-methodology': {
      items: [
        { prompt: 'What is an RCT in development economics?', answer: 'Random assignment to measure causal effects. Strengths: clean identification. Limits: external validity, ethics, Hawthorne effects.', type: 'concept' },
      ],
    },
    'structural-transformation': {
      items: [
        { prompt: 'What is structural transformation?', answer: 'Shift from agriculture to manufacturing to services as countries develop, driven by productivity growth and Engel\'s law.', type: 'concept' },
      ],
    },
    'comparative-advantage': {
      items: [
        { prompt: 'Explain Ricardo\'s comparative advantage.', answer: 'Even if one country is more efficient at both goods, both benefit from trade by specializing where opportunity cost is lowest.', type: 'concept' },
      ],
    },
    'heckscher-ohlin': {
      items: [
        { prompt: 'What does Heckscher-Ohlin predict?', answer: 'Countries export goods intensive in their abundant factor. Labor-abundant exports labor-intensive goods.', type: 'concept' },
      ],
    },
    'new-trade-theory': {
      items: [
        { prompt: 'How does new trade theory differ from classical?', answer: 'Explains trade between similar countries via economies of scale and differentiation, not just factor endowments. First-mover advantages matter.', type: 'concept' },
      ],
    },
    'exchange-rate-models': {
      items: [
        { prompt: 'What is PPP and why does it fail short-run?', answer: 'Exchange rates should equalize prices. Fails due to trade barriers, non-tradables, transport costs, capital flows.', type: 'concept' },
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
  if (!bank || !bank.items) return { error: `No question bank for ${level}/${skill}` };
  const items = pick(bank.items, count);
  return { type: 'economics', skill, level, count: items.length, instruction: 'Answer each question. Show your reasoning for calculations.', items };
}

// Answer checking

function checkAnswer(type, expected, answer) {
  if (Array.isArray(expected)) return expected.some(r => norm(r) === norm(answer));
  return norm(expected) === norm(answer);
}

// Public API

class CollegeEconomics {
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
    const level = p.level || 'principles';
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
    const level = p.level || 'principles';
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
    const level = p.level || 'principles';
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: `All skills at ${level} level are proficient! Ready for next level.`, level };
    const exercise = generateExercise(level, target.skill, 5);
    return {
      studentId: id, level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Apply concept to a real-world economic scenario or policy question',
        reflect: `Connect ${target.skill} to the broader economic framework`,
      },
    };
  }
}

module.exports = CollegeEconomics;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CollegeEconomics();
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
        const level = loadProfile(id).level || 'principles';
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
      default: out({ usage: 'node economics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
