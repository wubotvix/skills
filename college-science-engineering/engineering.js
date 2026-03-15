// eClaw College Engineering Fundamentals Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-engineering');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'statics': ['free-body-diagrams', 'equilibrium-conditions', 'moments-couples', 'centroids', 'friction-basics'],
    'basic-circuits': ['ohms-law', 'series-parallel', 'kirchhoffs-laws', 'power-energy', 'rc-circuits-intro'],
    'material-properties': ['stress-strain-intro', 'elastic-modulus', 'yield-strength', 'factor-of-safety', 'material-selection-basics'],
    'engineering-fundamentals': ['unit-analysis', 'significant-figures', 'engineering-notation', 'problem-solving-methodology', 'engineering-ethics-intro'],
  },
  'intermediate': {
    'structural-analysis': ['trusses-method-of-joints', 'trusses-method-of-sections', 'frames-machines', 'beam-diagrams', 'shear-moment-diagrams'],
    'dynamics': ['kinematics-particles', 'newtons-laws-engineering', 'work-energy-theorem', 'impulse-momentum', 'rigid-body-rotation'],
    'thermodynamics': ['first-law', 'second-law-entropy', 'carnot-cycle', 'ideal-gas-processes', 'open-vs-closed-systems'],
    'fluid-mechanics': ['fluid-statics', 'bernoullis-equation', 'continuity-equation', 'reynolds-number', 'pipe-flow-basics'],
    'circuits-intermediate': ['kvl-kcl-analysis', 'thevenin-norton', 'ac-circuits-phasors', 'op-amp-basics', 'filters-intro'],
    'materials-science': ['crystal-structures', 'defects-dislocations', 'phase-diagrams-binary', 'mechanical-testing', 'heat-treatment'],
  },
  'upper-division': {
    'advanced-mechanics': ['vibrations-free-forced', 'modal-analysis', 'fatigue-fracture', 'finite-element-intro', 'composite-materials'],
    'heat-transfer': ['conduction', 'convection', 'radiation', 'heat-exchangers', 'transient-analysis'],
    'advanced-thermo': ['rankine-cycle', 'brayton-cycle', 'refrigeration-cycles', 'psychrometrics', 'combustion-basics'],
    'fluid-dynamics': ['navier-stokes', 'boundary-layers', 'drag-lift', 'dimensional-analysis', 'turbomachinery-intro'],
    'controls': ['transfer-functions', 'block-diagrams', 'stability-routh', 'pid-control', 'frequency-response'],
    'design': ['design-process', 'optimization-basics', 'reliability-engineering', 'manufacturing-considerations', 'fe-exam-review'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'free-body-diagrams': {
      items: [
        { prompt: 'What is a free-body diagram and why is it the first step in statics problems?', answer: 'An isolated sketch of a body showing all external forces and moments. Essential to systematically apply equilibrium equations.', type: 'concept' },
        { prompt: 'A book sits on a table. Draw (describe) its FBD.', answer: 'Weight W downward at center of gravity, normal force N upward at contact surface. Sum F = 0: N = W.', type: 'concept' },
        { prompt: 'What forces act on a beam supported by a pin at one end and a roller at the other?', answer: 'Pin: horizontal and vertical reactions (Ax, Ay). Roller: vertical reaction only (By). Plus any applied loads and self-weight.', type: 'concept' },
      ],
    },
    'equilibrium-conditions': {
      items: [
        { prompt: 'State the conditions for static equilibrium in 2D.', answer: 'Sum Fx = 0, Sum Fy = 0, Sum M about any point = 0', type: 'concept' },
        { prompt: 'A 100N weight hangs from two cables at 30 and 60 degrees from horizontal. Find the cable tensions.', answer: 'T1 = 86.6N (at 60 deg), T2 = 50N (at 30 deg)', type: 'calculation' },
      ],
    },
    'moments-couples': {
      items: [
        { prompt: 'Define moment of a force about a point.', answer: 'M = F * d, where d is the perpendicular distance from the point to the line of action. Tendency to cause rotation.', type: 'concept' },
        { prompt: 'What is a couple?', answer: 'Two equal and opposite parallel forces separated by a distance. Creates pure rotation (moment = F*d) independent of the point chosen.', type: 'concept' },
      ],
    },
    'centroids': {
      items: [
        { prompt: 'How do you find the centroid of a composite shape?', answer: 'x_bar = Sum(A_i * x_i) / Sum(A_i). Weight each sub-area by its centroid position, divide by total area.', type: 'concept' },
      ],
    },
    'friction-basics': {
      items: [
        { prompt: 'State Coulomb\'s friction law.', answer: 'f_max = mu_s * N (static). Kinetic: f = mu_k * N. Friction opposes motion/tendency of motion.', type: 'concept' },
      ],
    },
    'ohms-law': {
      items: [
        { prompt: 'State Ohm\'s law and its three forms.', answer: 'V = IR, I = V/R, R = V/I. Voltage across a resistor equals current times resistance.', type: 'concept' },
        { prompt: 'A 12V battery drives current through a 4-ohm resistor. What is the current?', answer: '3 A', type: 'calculation' },
      ],
    },
    'series-parallel': {
      items: [
        { prompt: 'How do resistors combine in series vs parallel?', answer: 'Series: R_total = R1 + R2 + ... Parallel: 1/R_total = 1/R1 + 1/R2 + ...', type: 'concept' },
        { prompt: 'Find equivalent resistance: 6 ohm and 3 ohm in parallel.', answer: '2 ohm', type: 'calculation' },
      ],
    },
    'kirchhoffs-laws': {
      items: [
        { prompt: 'State KVL and KCL.', answer: 'KVL: Sum of voltages around any closed loop = 0. KCL: Sum of currents entering a node = sum leaving.', type: 'concept' },
      ],
    },
    'power-energy': {
      items: [
        { prompt: 'State three forms of the electrical power equation.', answer: 'P = VI = I^2R = V^2/R. Power dissipated as heat in a resistor.', type: 'concept' },
      ],
    },
    'rc-circuits-intro': {
      items: [
        { prompt: 'What is the time constant of an RC circuit?', answer: 'tau = RC. Time for voltage to reach 63.2% of final value during charging.', type: 'concept' },
      ],
    },
    'stress-strain-intro': {
      items: [
        { prompt: 'Define stress and strain.', answer: 'Stress: sigma = F/A (force per unit area). Strain: epsilon = delta_L/L (fractional deformation). Hooke\'s law: sigma = E*epsilon.', type: 'concept' },
      ],
    },
    'elastic-modulus': {
      items: [
        { prompt: 'What is Young\'s modulus and what does a high value indicate?', answer: 'E = stress/strain in the elastic region. High E = stiff material (steel ~200 GPa vs rubber ~0.01 GPa).', type: 'concept' },
      ],
    },
    'yield-strength': {
      items: [
        { prompt: 'Distinguish yield strength from ultimate strength.', answer: 'Yield: stress at onset of permanent deformation. Ultimate: maximum stress before failure. Design below yield.', type: 'concept' },
      ],
    },
    'factor-of-safety': {
      items: [
        { prompt: 'Define factor of safety. Why is it always > 1?', answer: 'FoS = ultimate strength / actual stress (or yield strength / working stress). >1 to account for uncertainties, variability, and unexpected loads.', type: 'concept' },
      ],
    },
    'material-selection-basics': {
      items: [
        { prompt: 'Name four factors in material selection.', answer: 'Strength, weight/density, cost, corrosion resistance. Also: machinability, availability, temperature performance.', type: 'concept' },
      ],
    },
    'unit-analysis': {
      items: [
        { prompt: 'Convert 60 mph to m/s.', answer: '26.8 m/s', type: 'calculation' },
        { prompt: 'What are the SI base units for force?', answer: 'Newton: kg*m/s^2', type: 'concept' },
      ],
    },
    'significant-figures': {
      items: [
        { prompt: 'Express the result of 3.14 * 2.1 with correct significant figures.', answer: '6.6 (2 sig figs, limited by 2.1)', type: 'calculation' },
      ],
    },
    'engineering-notation': {
      items: [
        { prompt: 'Express 0.000047 F in engineering notation.', answer: '47 microfarads (47 uF)', type: 'concept' },
      ],
    },
    'problem-solving-methodology': {
      items: [
        { prompt: 'Describe the systematic engineering problem-solving approach.', answer: 'Identify, diagram, knowns/unknowns, governing equations, solve symbolically, substitute values, check units/magnitude.', type: 'concept' },
      ],
    },
    'engineering-ethics-intro': {
      items: [
        { prompt: 'What is the primary obligation of a professional engineer?', answer: 'Public safety, health, and welfare. Above all other obligations including to employer or client.', type: 'concept' },
      ],
    },
  },
  'intermediate': {
    'trusses-method-of-joints': {
      items: [
        { prompt: 'Describe the method of joints for truss analysis.', answer: 'Apply equilibrium (Sum Fx=0, Sum Fy=0) at each joint sequentially. Start at a joint with at most 2 unknowns.', type: 'concept' },
        { prompt: 'How do you identify zero-force members?', answer: 'At a joint with 2 non-collinear members and no external load: both are zero-force. At a joint with 3 members (2 collinear): third is zero-force.', type: 'concept' },
      ],
    },
    'trusses-method-of-sections': {
      items: [
        { prompt: 'When is the method of sections preferred over method of joints?', answer: 'When you need the force in a specific interior member. Cut through 3 members, apply 3 equilibrium equations.', type: 'concept' },
      ],
    },
    'frames-machines': {
      items: [
        { prompt: 'How do frames differ from trusses?', answer: 'Frames have multi-force members (forces not only at joints). Must analyze each member separately.', type: 'concept' },
      ],
    },
    'beam-diagrams': {
      items: [
        { prompt: 'What are the internal forces in a beam?', answer: 'Shear force V and bending moment M at each cross-section. Normal force N if axially loaded.', type: 'concept' },
      ],
    },
    'shear-moment-diagrams': {
      items: [
        { prompt: 'What is the relationship between load, shear, and moment diagrams?', answer: 'dV/dx = -w(x) (distributed load). dM/dx = V (shear is slope of moment). Point loads cause jumps in shear.', type: 'concept' },
      ],
    },
    'kinematics-particles': {
      items: [
        { prompt: 'A car accelerates from rest at 3 m/s^2 for 5 seconds. Find final velocity and distance.', answer: 'v = 15 m/s, d = 37.5 m', type: 'calculation' },
      ],
    },
    'newtons-laws-engineering': {
      items: [
        { prompt: 'A 500 kg elevator accelerates upward at 2 m/s^2. Find the cable tension.', answer: 'T = m(g+a) = 500(9.81+2) = 5905 N', type: 'calculation' },
      ],
    },
    'work-energy-theorem': {
      items: [
        { prompt: 'State the work-energy theorem.', answer: 'Net work done on an object equals its change in kinetic energy: W_net = delta KE = 1/2 mv2^2 - 1/2 mv1^2', type: 'concept' },
      ],
    },
    'impulse-momentum': {
      items: [
        { prompt: 'State the impulse-momentum theorem.', answer: 'Impulse = change in momentum: F*dt = m*dv. For a system: sum of external impulses = change in total momentum.', type: 'concept' },
      ],
    },
    'rigid-body-rotation': {
      items: [
        { prompt: 'State Newton\'s second law for rotation.', answer: 'Sum M = I*alpha. Net torque = moment of inertia times angular acceleration.', type: 'concept' },
      ],
    },
    'first-law': {
      items: [
        { prompt: 'State the first law of thermodynamics for a closed system.', answer: 'dU = Q - W. Change in internal energy = heat added minus work done by the system.', type: 'concept' },
      ],
    },
    'second-law-entropy': {
      items: [
        { prompt: 'State the second law of thermodynamics.', answer: 'Entropy of an isolated system never decreases. Heat flows spontaneously from hot to cold, not reverse.', type: 'concept' },
      ],
    },
    'carnot-cycle': {
      items: [
        { prompt: 'What is the Carnot efficiency?', answer: 'eta_Carnot = 1 - T_cold/T_hot (temperatures in Kelvin). Maximum possible efficiency for a heat engine.', type: 'concept' },
      ],
    },
    'ideal-gas-processes': {
      items: [
        { prompt: 'Name four ideal gas processes.', answer: 'Isothermal (constant T), isobaric (constant P), isochoric (constant V), adiabatic (no heat transfer)', type: 'concept' },
      ],
    },
    'open-vs-closed-systems': {
      items: [
        { prompt: 'Distinguish open, closed, and isolated systems.', answer: 'Open: mass and energy cross boundary. Closed: energy only. Isolated: neither mass nor energy.', type: 'concept' },
      ],
    },
    'fluid-statics': {
      items: [
        { prompt: 'State the hydrostatic pressure equation.', answer: 'P = P0 + rho*g*h. Pressure increases linearly with depth in an incompressible fluid.', type: 'concept' },
      ],
    },
    'bernoullis-equation': {
      items: [
        { prompt: 'State Bernoulli\'s equation and its assumptions.', answer: 'P + 1/2*rho*v^2 + rho*g*z = constant along a streamline. Assumes: inviscid, incompressible, steady, along streamline.', type: 'concept' },
      ],
    },
    'continuity-equation': {
      items: [
        { prompt: 'State the continuity equation for steady flow.', answer: 'A1*v1 = A2*v2 (incompressible). Mass in = mass out. Smaller area means faster flow.', type: 'concept' },
      ],
    },
    'reynolds-number': {
      items: [
        { prompt: 'What is Reynolds number and what does it indicate?', answer: 'Re = rho*v*L/mu. Ratio of inertial to viscous forces. Re < 2300: laminar. Re > 4000: turbulent (pipe flow).', type: 'concept' },
      ],
    },
    'pipe-flow-basics': {
      items: [
        { prompt: 'What causes pressure loss in pipe flow?', answer: 'Friction with pipe walls and minor losses (bends, valves). Darcy-Weisbach: h_f = f*(L/D)*(v^2/2g).', type: 'concept' },
      ],
    },
    'kvl-kcl-analysis': {
      items: [
        { prompt: 'Describe mesh analysis using KVL.', answer: 'Assign mesh currents to each loop. Write KVL equations for each mesh. Solve the system of equations.', type: 'concept' },
      ],
    },
    'thevenin-norton': {
      items: [
        { prompt: 'State Thevenin\'s theorem.', answer: 'Any linear circuit can be replaced by a voltage source V_th in series with resistance R_th as seen from two terminals.', type: 'concept' },
      ],
    },
    'ac-circuits-phasors': {
      items: [
        { prompt: 'What is impedance?', answer: 'Z = R + jX. Complex resistance in AC circuits. R: resistor, X_L = wL (inductor), X_C = -1/(wC) (capacitor).', type: 'concept' },
      ],
    },
    'op-amp-basics': {
      items: [
        { prompt: 'State the two ideal op-amp rules.', answer: '1) No current into inputs (infinite input impedance). 2) Voltage at + equals voltage at - (with negative feedback).', type: 'concept' },
      ],
    },
    'filters-intro': {
      items: [
        { prompt: 'What is a low-pass filter?', answer: 'Passes low frequencies, attenuates high. Simple RC: cutoff f_c = 1/(2*pi*RC). Used to remove noise.', type: 'concept' },
      ],
    },
    'crystal-structures': {
      items: [
        { prompt: 'Name three common crystal structures and a metal for each.', answer: 'FCC (aluminum, copper), BCC (iron, chromium), HCP (titanium, zinc)', type: 'concept' },
      ],
    },
    'defects-dislocations': {
      items: [
        { prompt: 'Why do dislocations make metals deformable?', answer: 'Dislocations allow planes to slip at stresses far below theoretical strength. Metals deform plastically by dislocation motion.', type: 'concept' },
      ],
    },
    'phase-diagrams-binary': {
      items: [
        { prompt: 'What information does an iron-carbon phase diagram provide?', answer: 'Stable phases at each temperature/composition. Predicts microstructure: ferrite, austenite, cementite, pearlite.', type: 'concept' },
      ],
    },
    'mechanical-testing': {
      items: [
        { prompt: 'Name three mechanical tests and what they measure.', answer: 'Tensile test (strength, ductility), hardness test (resistance to indentation), impact test (toughness/brittleness)', type: 'concept' },
      ],
    },
    'heat-treatment': {
      items: [
        { prompt: 'What is the purpose of quenching and tempering steel?', answer: 'Quenching: rapid cooling creates hard martensite. Tempering: reheating reduces brittleness while retaining hardness.', type: 'concept' },
      ],
    },
  },
  'upper-division': {
    'vibrations-free-forced': {
      items: [
        { prompt: 'Write the equation of motion for a damped single-DOF system.', answer: 'm*x_ddot + c*x_dot + k*x = F(t). Natural frequency: w_n = sqrt(k/m). Damping ratio: zeta = c/(2*sqrt(mk)).', type: 'concept' },
        { prompt: 'What is resonance and why is it dangerous?', answer: 'Forcing frequency = natural frequency. Amplitude grows dramatically (unbounded if undamped). Can cause structural failure.', type: 'concept' },
      ],
    },
    'modal-analysis': {
      items: [
        { prompt: 'What is modal analysis?', answer: 'Decomposing vibration response into natural modes. Each mode has its own frequency and shape. Superposition gives total response.', type: 'concept' },
      ],
    },
    'fatigue-fracture': {
      items: [
        { prompt: 'What is fatigue failure?', answer: 'Failure under cyclic loading at stresses below yield. Crack initiates, propagates over many cycles, then sudden fracture. S-N curve characterizes.', type: 'concept' },
      ],
    },
    'finite-element-intro': {
      items: [
        { prompt: 'What is the basic idea of the finite element method?', answer: 'Divide structure into small elements. Approximate displacement field in each. Assemble stiffness matrices. Solve K*u = F.', type: 'concept' },
      ],
    },
    'composite-materials': {
      items: [
        { prompt: 'What advantages do composites offer over metals?', answer: 'High strength-to-weight ratio, directional properties (tailored), corrosion resistance. Examples: carbon fiber, fiberglass.', type: 'concept' },
      ],
    },
    'conduction': {
      items: [
        { prompt: 'State Fourier\'s law of heat conduction.', answer: 'q = -k*dT/dx. Heat flux proportional to temperature gradient. k = thermal conductivity.', type: 'concept' },
      ],
    },
    'convection': {
      items: [
        { prompt: 'State Newton\'s law of cooling.', answer: 'q = h*A*(T_surface - T_fluid). h = convective heat transfer coefficient (depends on flow conditions).', type: 'concept' },
      ],
    },
    'radiation': {
      items: [
        { prompt: 'State the Stefan-Boltzmann law.', answer: 'q = epsilon*sigma*A*T^4. Thermal radiation proportional to T^4. sigma = 5.67e-8 W/m^2K^4.', type: 'concept' },
      ],
    },
    'heat-exchangers': {
      items: [
        { prompt: 'What is the LMTD method?', answer: 'Q = U*A*LMTD. Log-mean temperature difference accounts for varying delta-T along heat exchanger. LMTD = (dT1-dT2)/ln(dT1/dT2).', type: 'concept' },
      ],
    },
    'transient-analysis': {
      items: [
        { prompt: 'What is the Biot number and when can lumped capacitance be used?', answer: 'Bi = h*L_c/k_solid. If Bi < 0.1, internal resistance negligible: lumped capacitance (uniform T in body).', type: 'concept' },
      ],
    },
    'rankine-cycle': {
      items: [
        { prompt: 'Describe the ideal Rankine cycle.', answer: 'Pump -> boiler -> turbine -> condenser. Working fluid: water. Used in steam power plants. Efficiency improved by superheat, reheat, regeneration.', type: 'concept' },
      ],
    },
    'brayton-cycle': {
      items: [
        { prompt: 'Describe the ideal Brayton cycle.', answer: 'Compressor -> combustor -> turbine -> exhaust. Working fluid: air. Used in gas turbines and jet engines.', type: 'concept' },
      ],
    },
    'refrigeration-cycles': {
      items: [
        { prompt: 'What is the coefficient of performance for a refrigerator?', answer: 'COP = Q_cold/W_in = T_cold/(T_hot - T_cold) for Carnot. Higher COP = more efficient cooling.', type: 'concept' },
      ],
    },
    'psychrometrics': {
      items: [
        { prompt: 'What properties can be read from a psychrometric chart?', answer: 'Dry-bulb temperature, wet-bulb temperature, humidity ratio, relative humidity, enthalpy, specific volume, dew point.', type: 'concept' },
      ],
    },
    'combustion-basics': {
      items: [
        { prompt: 'What is the stoichiometric air-fuel ratio?', answer: 'Exact amount of air needed for complete combustion. For gasoline: ~14.7 kg air per kg fuel.', type: 'concept' },
      ],
    },
    'navier-stokes': {
      items: [
        { prompt: 'What do the Navier-Stokes equations represent?', answer: 'Conservation of momentum for viscous fluids. F = ma per unit volume: pressure, viscous, and body forces = inertial forces.', type: 'concept' },
      ],
    },
    'boundary-layers': {
      items: [
        { prompt: 'What is a boundary layer?', answer: 'Thin region near a surface where velocity transitions from zero (no-slip) to free-stream. Determines skin friction and heat transfer.', type: 'concept' },
      ],
    },
    'drag-lift': {
      items: [
        { prompt: 'What are the components of aerodynamic force?', answer: 'Drag (parallel to flow, opposes motion) and lift (perpendicular). Drag = friction + pressure drag. Lift from pressure difference.', type: 'concept' },
      ],
    },
    'dimensional-analysis': {
      items: [
        { prompt: 'State the Buckingham Pi theorem.', answer: 'A physical relationship with n variables and k fundamental dimensions can be expressed using n-k dimensionless groups.', type: 'concept' },
      ],
    },
    'turbomachinery-intro': {
      items: [
        { prompt: 'What is the difference between a pump and a turbine?', answer: 'Pump: adds energy to fluid (motor drives impeller). Turbine: extracts energy from fluid (fluid drives rotor to generate power).', type: 'concept' },
      ],
    },
    'transfer-functions': {
      items: [
        { prompt: 'What is a transfer function?', answer: 'G(s) = Y(s)/U(s). Ratio of Laplace-transformed output to input. Characterizes system dynamics.', type: 'concept' },
      ],
    },
    'block-diagrams': {
      items: [
        { prompt: 'How do you find the closed-loop transfer function with unity feedback?', answer: 'T(s) = G(s)/(1 + G(s)). Numerator: forward path. Denominator: 1 + loop gain.', type: 'concept' },
      ],
    },
    'stability-routh': {
      items: [
        { prompt: 'What does the Routh-Hurwitz criterion determine?', answer: 'Stability of a system from its characteristic polynomial without finding roots. All first-column entries positive = stable.', type: 'concept' },
      ],
    },
    'pid-control': {
      items: [
        { prompt: 'What do P, I, and D terms contribute?', answer: 'P: proportional to error (fast response). I: integral of error (eliminates steady-state error). D: derivative of error (reduces overshoot).', type: 'concept' },
      ],
    },
    'frequency-response': {
      items: [
        { prompt: 'What does a Bode plot show?', answer: 'Magnitude (dB) and phase (degrees) of transfer function vs frequency. Used for stability analysis (gain/phase margins).', type: 'concept' },
      ],
    },
    'design-process': {
      items: [
        { prompt: 'List the stages of the engineering design process.', answer: 'Define problem, research, generate concepts, evaluate/select, detail design, prototype, test, iterate, document.', type: 'concept' },
      ],
    },
    'optimization-basics': {
      items: [
        { prompt: 'What is the objective function in optimization?', answer: 'The quantity to be minimized or maximized (cost, weight, performance) subject to constraints (stress, geometry, budget).', type: 'concept' },
      ],
    },
    'reliability-engineering': {
      items: [
        { prompt: 'How do series and parallel systems differ in reliability?', answer: 'Series: all must work (R = R1*R2*...). Parallel: any one works (R = 1-(1-R1)(1-R2)...). Redundancy improves reliability.', type: 'concept' },
      ],
    },
    'manufacturing-considerations': {
      items: [
        { prompt: 'Why is design for manufacturing (DFM) important?', answer: 'Reduces cost, simplifies assembly, minimizes defects. Consider: material, tolerances, processes, assembly from early design stage.', type: 'concept' },
      ],
    },
    'fe-exam-review': {
      items: [
        { prompt: 'What is the FE exam and what topics does it cover?', answer: 'Fundamentals of Engineering exam. First step to PE license. Covers: math, statics, dynamics, thermo, fluids, circuits, materials, ethics.', type: 'concept' },
      ],
    },
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

function generateExercise(level, skill, count = 5) { const bank = QUESTION_BANKS[level]?.[skill]; if (!bank || !bank.items) return { error: `No question bank for ${level}/${skill}` }; const items = pick(bank.items, count); return { type: 'engineering', skill, level, count: items.length, instruction: 'Solve each problem systematically: diagram, equations, solve, verify.', items }; }
function checkAnswer(type, expected, answer) { return norm(expected) === norm(answer); }

// Public API

class CollegeEngineering {
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
    return { studentId: id, level, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisite concepts (2-3 min)', teach: `Introduce/reinforce: ${target.category} -> ${target.skill}`, practice: `Complete ${exercise.count || 0} practice items`, apply: 'Solve a realistic engineering problem: diagram, equations, solve, verify units and reasonableness' } };
  }
}

module.exports = CollegeEngineering;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new CollegeEngineering(); const out = d => console.log(JSON.stringify(d, null, 2));
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
      default: out({ usage: 'node engineering.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
