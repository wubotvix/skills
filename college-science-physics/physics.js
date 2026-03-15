// College Physics Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-science-physics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'introductory': {
    'kinematics': ['displacement-velocity', 'acceleration', 'projectile-motion', 'relative-motion', 'free-fall'],
    'newtons-laws': ['first-law-inertia', 'second-law-fma', 'third-law-pairs', 'free-body-diagrams', 'friction'],
    'work-energy': ['work-definition', 'kinetic-energy', 'potential-energy', 'conservation-of-energy', 'power'],
    'momentum': ['linear-momentum', 'impulse', 'conservation-of-momentum', 'elastic-collisions', 'inelastic-collisions'],
    'rotational-motion': ['angular-velocity', 'torque', 'moment-of-inertia', 'angular-momentum', 'rolling-motion'],
    'fluids': ['pressure', 'pascals-principle', 'buoyancy', 'continuity-equation', 'bernoullis-equation'],
  },
  'intermediate': {
    'oscillations': ['simple-harmonic-motion', 'mass-spring-system', 'pendulum', 'damped-oscillations', 'driven-resonance'],
    'mechanical-waves': ['wave-equation', 'superposition', 'standing-waves', 'sound-waves', 'doppler-effect'],
    'electrostatics': ['coulombs-law', 'electric-field', 'electric-potential', 'gauss-law', 'capacitance'],
    'circuits': ['ohms-law', 'series-parallel', 'kirchhoffs-rules', 'rc-circuits', 'power-in-circuits'],
    'magnetism': ['magnetic-force', 'biot-savart', 'amperes-law', 'faradays-law', 'inductance'],
    'optics': ['reflection-refraction', 'mirrors', 'thin-lenses', 'interference', 'diffraction'],
  },
  'upper-division': {
    'classical-mechanics': ['lagrangian-mechanics', 'hamiltonian-mechanics', 'central-force', 'rigid-body-dynamics', 'coupled-oscillators'],
    'electrodynamics': ['maxwells-equations', 'em-waves', 'waveguides', 'radiation', 'special-relativity-em'],
    'quantum-mechanics': ['wave-function', 'schrodinger-equation', 'particle-in-a-box', 'harmonic-oscillator-qm', 'hydrogen-atom'],
    'thermodynamics-stat-mech': ['laws-of-thermodynamics', 'entropy', 'statistical-ensembles', 'partition-function', 'quantum-statistics'],
    'special-relativity': ['lorentz-transformations', 'time-dilation', 'length-contraction', 'relativistic-momentum', 'mass-energy-equivalence'],
    'modern-physics': ['photoelectric-effect', 'compton-scattering', 'wave-particle-duality', 'nuclear-physics', 'particle-physics-intro'],
  },
};

const QUESTION_BANKS = {
  'introductory': {
    'displacement-velocity': {
      questions: [
        { q: 'A car travels 100 m in 5 s. What is its average speed?', a: '20 m/s', type: 'calculation' },
        { q: 'What is the difference between speed and velocity?', a: 'Speed is scalar (magnitude only); velocity is a vector (magnitude and direction)', type: 'concept' },
        { q: 'A runner goes 400 m around a circular track back to start. What is the displacement?', a: '0 m', type: 'calculation' },
        { q: 'What is the SI unit of velocity?', a: 'meters per second', type: 'term' },
        { q: 'If position x(t) = 3t^2 + 2t, what is the velocity at t = 2 s?', a: '14 m/s', type: 'calculation' },
        { q: 'Can an object have zero displacement but nonzero distance traveled?', a: 'yes', type: 'concept' },
        { q: 'What does the slope of a position-time graph represent?', a: 'velocity', type: 'concept' },
        { q: 'A boat moves east at 5 m/s in a river flowing south at 3 m/s. What is the speed relative to shore?', a: 'sqrt(34) or about 5.83 m/s', type: 'calculation' },
      ],
    },
    'acceleration': {
      questions: [
        { q: 'What is acceleration?', a: 'The rate of change of velocity with respect to time', type: 'concept' },
        { q: 'A car goes from 0 to 30 m/s in 6 s. What is its acceleration?', a: '5 m/s^2', type: 'calculation' },
        { q: 'What are the kinematic equations used for?', a: 'Solving problems with constant acceleration in one dimension', type: 'concept' },
        { q: 'Using v = v0 + at, find v when v0 = 10 m/s, a = 2 m/s^2, t = 3 s.', a: '16 m/s', type: 'calculation' },
        { q: 'What does the slope of a velocity-time graph represent?', a: 'acceleration', type: 'concept' },
        { q: 'What does the area under a velocity-time graph represent?', a: 'displacement', type: 'concept' },
        { q: 'An object has constant velocity. What is its acceleration?', a: '0', type: 'calculation' },
        { q: 'Can an object be accelerating while its speed is constant?', a: 'yes, if direction changes (e.g. circular motion)', type: 'concept' },
      ],
    },
    'projectile-motion': {
      questions: [
        { q: 'What is the acceleration of a projectile (ignoring air resistance)?', a: '9.8 m/s^2 downward', type: 'concept' },
        { q: 'In projectile motion, what happens to the horizontal velocity?', a: 'It remains constant (no horizontal acceleration)', type: 'concept' },
        { q: 'At the highest point of projectile motion, what is the vertical velocity?', a: '0', type: 'concept' },
        { q: 'A ball is launched at 45 degrees. For what angle does it land at the same distance?', a: '45 degrees gives maximum range; complementary angles give the same range', type: 'concept' },
        { q: 'What two independent motions make up projectile motion?', a: 'Constant horizontal velocity and constant vertical acceleration (gravity)', type: 'concept' },
        { q: 'A ball is thrown horizontally from a cliff at 10 m/s. After 2 s, what is its vertical speed?', a: '19.6 m/s', type: 'calculation' },
        { q: 'What shape is the trajectory of a projectile?', a: 'parabola', type: 'term' },
        { q: 'If you double the launch speed (same angle), how does the range change?', a: 'Range quadruples (R proportional to v^2)', type: 'concept' },
      ],
    },
    'relative-motion': {
      questions: [
        { q: 'What is a reference frame?', a: 'A coordinate system from which observations and measurements are made', type: 'concept' },
        { q: 'Person A walks 2 m/s on a train moving 30 m/s. What is their speed relative to ground?', a: '32 m/s (if walking forward)', type: 'calculation' },
        { q: 'How do you add velocities in Galilean relativity?', a: 'v_AG = v_AT + v_TG (vector addition)', type: 'concept' },
        { q: 'Two cars approach each other at 60 km/h each. What is their closing speed?', a: '120 km/h', type: 'calculation' },
        { q: 'Is velocity absolute or relative?', a: 'relative', type: 'concept' },
        { q: 'A passenger on a bus throws a ball straight up. What path does a ground observer see?', a: 'parabolic', type: 'concept' },
      ],
    },
    'free-fall': {
      questions: [
        { q: 'What is the acceleration due to gravity near Earths surface?', a: '9.8 m/s^2', type: 'concept' },
        { q: 'A ball is dropped from rest. How far does it fall in 3 s?', a: '44.1 m', type: 'calculation' },
        { q: 'Do heavier objects fall faster (in vacuum)?', a: 'no, all objects fall at the same rate in vacuum', type: 'concept' },
        { q: 'A ball is thrown upward at 20 m/s. How long until it stops rising?', a: 'about 2.04 s', type: 'calculation' },
        { q: 'What is terminal velocity?', a: 'The constant velocity reached when air resistance equals gravitational force', type: 'concept' },
        { q: 'At the peak of vertical motion, velocity is ___ and acceleration is ___.', a: 'zero velocity, 9.8 m/s^2 downward', type: 'concept' },
      ],
    },
    'first-law-inertia': {
      questions: [
        { q: 'State Newtons first law.', a: 'An object at rest stays at rest and an object in motion stays in motion unless acted on by a net external force', type: 'concept' },
        { q: 'What is inertia?', a: 'The tendency of an object to resist changes in its state of motion', type: 'concept' },
        { q: 'What property of an object determines its inertia?', a: 'mass', type: 'term' },
        { q: 'If no net force acts on a moving object, what happens to it?', a: 'It continues at constant velocity in a straight line', type: 'concept' },
        { q: 'A book sits on a table. What forces act on it and are they balanced?', a: 'Gravity downward and normal force upward; yes, they are balanced', type: 'concept' },
        { q: 'What is an inertial reference frame?', a: 'A reference frame in which Newtons first law holds (not accelerating)', type: 'concept' },
      ],
    },
    'second-law-fma': {
      questions: [
        { q: 'State Newtons second law mathematically.', a: 'F_net = ma', type: 'concept' },
        { q: 'A 5 kg object experiences a net force of 20 N. What is its acceleration?', a: '4 m/s^2', type: 'calculation' },
        { q: 'What is the SI unit of force?', a: 'Newton (N = kg*m/s^2)', type: 'term' },
        { q: 'If mass doubles but force stays the same, what happens to acceleration?', a: 'acceleration halves', type: 'concept' },
        { q: 'What is a free body diagram?', a: 'A diagram showing all forces acting on an object as vectors', type: 'concept' },
        { q: 'A 1000 kg car accelerates at 2 m/s^2. What net force is needed?', a: '2000 N', type: 'calculation' },
        { q: 'What does the net in net force mean?', a: 'The vector sum of all forces acting on the object', type: 'concept' },
        { q: 'Does F = ma apply to net force or individual forces?', a: 'net force', type: 'concept' },
      ],
    },
    'third-law-pairs': {
      questions: [
        { q: 'State Newtons third law.', a: 'For every action there is an equal and opposite reaction', type: 'concept' },
        { q: 'If you push a wall with 50 N, how much force does the wall push back?', a: '50 N', type: 'calculation' },
        { q: 'Do third-law force pairs act on the same object or different objects?', a: 'different objects', type: 'concept' },
        { q: 'A person stands on the ground. Identify the third-law pair for the gravitational force on the person.', a: 'The gravitational force the person exerts on Earth', type: 'concept' },
        { q: 'Why dont third-law force pairs cancel each other out?', a: 'Because they act on different objects', type: 'concept' },
        { q: 'A horse pulls a cart. The cart pulls back equally. Why does the system accelerate?', a: 'The horse pushes backward on the ground; ground pushes forward on horse (net external force)', type: 'concept' },
      ],
    },
    'free-body-diagrams': {
      questions: [
        { q: 'What forces typically act on a block sliding on a surface?', a: 'Gravity, normal force, friction, and any applied force', type: 'concept' },
        { q: 'On an inclined plane, which direction does the normal force point?', a: 'Perpendicular to the surface of the incline', type: 'concept' },
        { q: 'How do you decompose weight on an incline?', a: 'mg sin(theta) along the plane, mg cos(theta) perpendicular to plane', type: 'concept' },
        { q: 'When is the normal force equal to mg?', a: 'When the object is on a horizontal surface with no other vertical forces', type: 'concept' },
        { q: 'What is tension in a rope?', a: 'The pulling force transmitted along the rope', type: 'concept' },
        { q: 'How many forces act on a book at rest on a table?', a: '2: gravity and normal force', type: 'concept' },
      ],
    },
    'friction': {
      questions: [
        { q: 'What is the formula for static friction?', a: 'f_s <= mu_s * N', type: 'concept' },
        { q: 'What is the formula for kinetic friction?', a: 'f_k = mu_k * N', type: 'concept' },
        { q: 'Is static or kinetic friction typically larger?', a: 'static friction', type: 'concept' },
        { q: 'A 10 kg block sits on a surface with mu_s = 0.4. What is the maximum static friction?', a: '39.2 N', type: 'calculation' },
        { q: 'Does friction depend on surface area?', a: 'no (approximately, for simple friction model)', type: 'concept' },
        { q: 'In what direction does friction act?', a: 'Opposite to the direction of motion or attempted motion', type: 'concept' },
      ],
    },
    'work-definition': {
      questions: [
        { q: 'What is the formula for work done by a constant force?', a: 'W = F * d * cos(theta)', type: 'concept' },
        { q: 'What is the SI unit of work?', a: 'Joule (J = N*m)', type: 'term' },
        { q: 'A force of 10 N moves an object 5 m in the direction of the force. How much work?', a: '50 J', type: 'calculation' },
        { q: 'If force is perpendicular to displacement, how much work is done?', a: '0', type: 'calculation' },
        { q: 'Can work be negative?', a: 'yes, when the force component is opposite to displacement', type: 'concept' },
        { q: 'How do you calculate work from a force-displacement graph?', a: 'Area under the curve', type: 'concept' },
      ],
    },
    'kinetic-energy': {
      questions: [
        { q: 'What is the formula for kinetic energy?', a: 'KE = (1/2)mv^2', type: 'concept' },
        { q: 'A 2 kg object moves at 3 m/s. What is its kinetic energy?', a: '9 J', type: 'calculation' },
        { q: 'State the work-energy theorem.', a: 'The net work done on an object equals its change in kinetic energy', type: 'concept' },
        { q: 'If speed doubles, how does kinetic energy change?', a: 'Quadruples (KE proportional to v^2)', type: 'concept' },
        { q: 'Can kinetic energy be negative?', a: 'no', type: 'concept' },
        { q: 'What is the kinetic energy of a stationary object?', a: '0', type: 'concept' },
      ],
    },
    'potential-energy': {
      questions: [
        { q: 'What is gravitational potential energy near Earths surface?', a: 'PE = mgh', type: 'concept' },
        { q: 'What is elastic potential energy in a spring?', a: 'PE = (1/2)kx^2', type: 'concept' },
        { q: 'A 3 kg object is 4 m above the ground. What is its gravitational PE?', a: '117.6 J', type: 'calculation' },
        { q: 'Is potential energy relative or absolute?', a: 'relative (depends on chosen reference point)', type: 'concept' },
        { q: 'What type of force has an associated potential energy?', a: 'conservative force', type: 'concept' },
        { q: 'What is the relationship between force and potential energy?', a: 'F = -dU/dx', type: 'concept' },
      ],
    },
    'conservation-of-energy': {
      questions: [
        { q: 'State the conservation of mechanical energy.', a: 'In the absence of non-conservative forces, KE + PE = constant', type: 'concept' },
        { q: 'A ball falls from 5 m. What is its speed just before hitting the ground?', a: 'about 9.9 m/s', type: 'calculation' },
        { q: 'What type of forces violate conservation of mechanical energy?', a: 'non-conservative forces like friction', type: 'concept' },
        { q: 'Is total energy (including heat) still conserved with friction?', a: 'yes', type: 'concept' },
        { q: 'A pendulum swings. Where is KE maximum?', a: 'at the lowest point', type: 'concept' },
        { q: 'A pendulum swings. Where is PE maximum?', a: 'at the highest points of the swing', type: 'concept' },
      ],
    },
    'power': {
      questions: [
        { q: 'What is power?', a: 'The rate at which work is done (P = W/t)', type: 'concept' },
        { q: 'What is the SI unit of power?', a: 'Watt (W = J/s)', type: 'term' },
        { q: 'Express power in terms of force and velocity.', a: 'P = Fv', type: 'concept' },
        { q: 'An engine does 5000 J of work in 10 s. What is its power output?', a: '500 W', type: 'calculation' },
        { q: 'What is 1 horsepower in watts?', a: 'about 746 W', type: 'concept' },
        { q: 'If power is constant and time doubles, what happens to the work done?', a: 'work doubles', type: 'concept' },
      ],
    },
    'linear-momentum': {
      questions: [
        { q: 'What is the formula for linear momentum?', a: 'p = mv', type: 'concept' },
        { q: 'What is the SI unit of momentum?', a: 'kg*m/s', type: 'term' },
        { q: 'A 3 kg object moves at 4 m/s. What is its momentum?', a: '12 kg*m/s', type: 'calculation' },
        { q: 'How is Newtons second law written in terms of momentum?', a: 'F = dp/dt', type: 'concept' },
        { q: 'Is momentum a scalar or vector?', a: 'vector', type: 'concept' },
        { q: 'When is momentum conserved?', a: 'When there is no net external force on the system', type: 'concept' },
      ],
    },
    'impulse': {
      questions: [
        { q: 'What is impulse?', a: 'The change in momentum (J = F*delta_t = delta_p)', type: 'concept' },
        { q: 'What is the SI unit of impulse?', a: 'N*s or kg*m/s', type: 'term' },
        { q: 'A 0.5 kg ball changes velocity from 4 m/s to -3 m/s. What is the impulse?', a: '-3.5 kg*m/s', type: 'calculation' },
        { q: 'Why do airbags reduce injury?', a: 'They increase the time of collision, reducing the average force', type: 'concept' },
        { q: 'How is impulse found from a force-time graph?', a: 'Area under the force-time curve', type: 'concept' },
        { q: 'State the impulse-momentum theorem.', a: 'Impulse equals the change in momentum', type: 'concept' },
      ],
    },
    'conservation-of-momentum': {
      questions: [
        { q: 'State the law of conservation of momentum.', a: 'In an isolated system, total momentum before = total momentum after', type: 'concept' },
        { q: 'A 2 kg cart moving at 3 m/s hits a 1 kg cart at rest and they stick together. What is the final velocity?', a: '2 m/s', type: 'calculation' },
        { q: 'Does conservation of momentum apply in all directions independently?', a: 'yes', type: 'concept' },
        { q: 'Is momentum conserved in explosions?', a: 'yes (internal forces only)', type: 'concept' },
        { q: 'A gun fires a bullet. Why does the gun recoil?', a: 'Conservation of momentum: the bullet goes forward, the gun goes backward', type: 'concept' },
        { q: 'Can external forces change the total momentum of a system?', a: 'yes', type: 'concept' },
      ],
    },
    'elastic-collisions': {
      questions: [
        { q: 'What is conserved in an elastic collision?', a: 'Both kinetic energy and momentum', type: 'concept' },
        { q: 'In a 1D elastic collision of equal masses, what happens?', a: 'The objects exchange velocities', type: 'concept' },
        { q: 'Are most real-world collisions perfectly elastic?', a: 'no', type: 'concept' },
        { q: 'Name an example of a nearly elastic collision.', a: 'billiard balls or atomic/molecular collisions', type: 'concept' },
        { q: 'How do you distinguish elastic from inelastic collisions?', a: 'Check if kinetic energy is conserved; if yes, elastic', type: 'concept' },
        { q: 'In a head-on elastic collision, a light ball hits a heavy stationary ball. What happens?', a: 'The light ball bounces back; the heavy ball barely moves', type: 'concept' },
      ],
    },
    'inelastic-collisions': {
      questions: [
        { q: 'What is conserved in an inelastic collision?', a: 'momentum (but not kinetic energy)', type: 'concept' },
        { q: 'What is a perfectly inelastic collision?', a: 'Objects stick together after collision (maximum KE loss)', type: 'concept' },
        { q: 'Where does the lost kinetic energy go in an inelastic collision?', a: 'heat, sound, deformation', type: 'concept' },
        { q: 'A 3 kg object at 4 m/s collides with a 1 kg object at rest; they stick. Find final velocity.', a: '3 m/s', type: 'calculation' },
        { q: 'Can a collision be partially inelastic?', a: 'yes, most real collisions lose some but not all kinetic energy', type: 'concept' },
        { q: 'Is a car crash elastic or inelastic?', a: 'inelastic', type: 'concept' },
      ],
    },
    'angular-velocity': {
      questions: [
        { q: 'What is angular velocity?', a: 'Rate of change of angular position (omega = d(theta)/dt)', type: 'concept' },
        { q: 'What is the SI unit of angular velocity?', a: 'radians per second', type: 'term' },
        { q: 'How is linear velocity related to angular velocity?', a: 'v = r*omega', type: 'concept' },
        { q: 'Convert 1 revolution per second to radians per second.', a: '2*pi rad/s', type: 'calculation' },
        { q: 'What is the period of rotation?', a: 'Time for one complete revolution (T = 2*pi/omega)', type: 'concept' },
        { q: 'What is angular acceleration?', a: 'Rate of change of angular velocity (alpha = d(omega)/dt)', type: 'concept' },
      ],
    },
    'torque': {
      questions: [
        { q: 'What is torque?', a: 'The rotational analog of force (tau = r x F)', type: 'concept' },
        { q: 'What is the SI unit of torque?', a: 'Newton-meter (N*m)', type: 'term' },
        { q: 'What is the formula for torque magnitude?', a: 'tau = rF sin(theta)', type: 'concept' },
        { q: 'A 10 N force is applied 0.5 m from a pivot at 90 degrees. What is the torque?', a: '5 N*m', type: 'calculation' },
        { q: 'What is the lever arm?', a: 'The perpendicular distance from the pivot to the line of action of the force', type: 'concept' },
        { q: 'What is the rotational analog of F = ma?', a: 'tau = I*alpha', type: 'concept' },
      ],
    },
    'moment-of-inertia': {
      questions: [
        { q: 'What is moment of inertia?', a: 'Resistance to rotational acceleration (rotational analog of mass)', type: 'concept' },
        { q: 'What is the moment of inertia of a point mass?', a: 'I = mr^2', type: 'concept' },
        { q: 'Does the distribution of mass affect moment of inertia?', a: 'yes, mass farther from axis increases I', type: 'concept' },
        { q: 'What is the parallel axis theorem?', a: 'I = I_cm + Md^2', type: 'concept' },
        { q: 'A solid disk has I = (1/2)MR^2. A hoop has I = MR^2. Which is easier to spin up?', a: 'the disk (smaller I)', type: 'concept' },
        { q: 'What are the SI units of moment of inertia?', a: 'kg*m^2', type: 'term' },
      ],
    },
    'angular-momentum': {
      questions: [
        { q: 'What is angular momentum?', a: 'L = I*omega (or L = r x p)', type: 'concept' },
        { q: 'When is angular momentum conserved?', a: 'When there is no net external torque', type: 'concept' },
        { q: 'A figure skater pulls arms in. What happens to spin speed?', a: 'Increases (L = I*omega constant, I decreases so omega increases)', type: 'concept' },
        { q: 'What is the SI unit of angular momentum?', a: 'kg*m^2/s', type: 'term' },
        { q: 'Is angular momentum a scalar or vector?', a: 'vector', type: 'concept' },
        { q: 'What determines the direction of angular momentum?', a: 'right-hand rule', type: 'concept' },
      ],
    },
    'rolling-motion': {
      questions: [
        { q: 'What is the condition for rolling without slipping?', a: 'v_cm = R*omega', type: 'concept' },
        { q: 'A rolling object has what types of kinetic energy?', a: 'Both translational (1/2 mv^2) and rotational (1/2 I omega^2)', type: 'concept' },
        { q: 'Which reaches the bottom of an incline first: a solid sphere or a hollow sphere?', a: 'solid sphere (smaller I/MR^2 ratio)', type: 'concept' },
        { q: 'What is the role of friction in rolling without slipping?', a: 'Static friction provides the torque; it does no work', type: 'concept' },
        { q: 'What is the total KE of a rolling solid sphere?', a: '(7/10)mv^2', type: 'concept' },
        { q: 'Is the contact point of a rolling object moving relative to the ground?', a: 'no (instantaneously at rest for pure rolling)', type: 'concept' },
      ],
    },
    'pressure': {
      questions: [
        { q: 'What is pressure?', a: 'Force per unit area (P = F/A)', type: 'concept' },
        { q: 'What is the SI unit of pressure?', a: 'Pascal (Pa = N/m^2)', type: 'term' },
        { q: 'What is atmospheric pressure at sea level?', a: 'about 101,325 Pa or 1 atm', type: 'concept' },
        { q: 'How does pressure vary with depth in a fluid?', a: 'P = P_0 + rho*g*h', type: 'concept' },
        { q: 'A 500 N force on 0.25 m^2 area produces what pressure?', a: '2000 Pa', type: 'calculation' },
        { q: 'Is pressure a scalar or vector?', a: 'scalar', type: 'concept' },
      ],
    },
    'pascals-principle': {
      questions: [
        { q: 'State Pascals principle.', a: 'A pressure change in a confined fluid is transmitted equally to all parts', type: 'concept' },
        { q: 'How does a hydraulic lift work?', a: 'Small force on small piston creates large force on large piston (F1/A1 = F2/A2)', type: 'concept' },
        { q: 'If piston A has area 0.01 m^2 and piston B has area 0.1 m^2, what is the force multiplication?', a: '10 times', type: 'calculation' },
        { q: 'Does Pascal principle apply to open or enclosed fluids?', a: 'enclosed fluids', type: 'concept' },
        { q: 'Name a device based on Pascals principle.', a: 'hydraulic press, hydraulic brakes, hydraulic jack', type: 'concept' },
        { q: 'Is work conserved in a hydraulic system (ideal)?', a: 'yes (what you gain in force you lose in distance)', type: 'concept' },
      ],
    },
    'buoyancy': {
      questions: [
        { q: 'State Archimedes principle.', a: 'Buoyant force equals the weight of fluid displaced', type: 'concept' },
        { q: 'What is the formula for buoyant force?', a: 'F_b = rho_fluid * V_displaced * g', type: 'concept' },
        { q: 'An object floats when its density is ___ the fluids density.', a: 'less than', type: 'concept' },
        { q: 'A block displaces 0.002 m^3 of water. What is the buoyant force?', a: 'about 19.6 N', type: 'calculation' },
        { q: 'What fraction of an iceberg is submerged? (ice density = 917, water = 1000)', a: 'about 91.7%', type: 'calculation' },
        { q: 'Does buoyancy depend on the shape of the object?', a: 'no, only on volume of fluid displaced', type: 'concept' },
      ],
    },
    'continuity-equation': {
      questions: [
        { q: 'State the continuity equation for fluids.', a: 'A1*v1 = A2*v2 (for incompressible fluids)', type: 'concept' },
        { q: 'If a pipes cross-section narrows, what happens to the flow speed?', a: 'increases', type: 'concept' },
        { q: 'Water flows through a pipe at 2 m/s with area 0.1 m^2. If area narrows to 0.05 m^2, what is the new speed?', a: '4 m/s', type: 'calculation' },
        { q: 'What physical principle does the continuity equation express?', a: 'conservation of mass', type: 'concept' },
        { q: 'What is volumetric flow rate?', a: 'Q = A*v (volume per unit time)', type: 'concept' },
        { q: 'Does the continuity equation apply to compressible fluids as written?', a: 'no, it must be modified to include density changes', type: 'concept' },
      ],
    },
    'bernoullis-equation': {
      questions: [
        { q: 'State Bernoullis equation.', a: 'P + (1/2)*rho*v^2 + rho*g*h = constant along a streamline', type: 'concept' },
        { q: 'As fluid speed increases (same height), what happens to pressure?', a: 'decreases', type: 'concept' },
        { q: 'What principle explains why airplane wings generate lift?', a: 'Bernoullis principle (faster air over top, lower pressure above)', type: 'concept' },
        { q: 'What assumptions underlie Bernoullis equation?', a: 'Steady, incompressible, inviscid (no friction) flow along a streamline', type: 'concept' },
        { q: 'What is a Venturi tube?', a: 'A constricted pipe section demonstrating Bernoullis principle (speed up, pressure drop)', type: 'concept' },
        { q: 'Is Bernoulli a statement of conservation of energy or momentum?', a: 'energy', type: 'concept' },
      ],
    },
  },
  'intermediate': {
    'simple-harmonic-motion': {
      questions: [
        { q: 'What defines simple harmonic motion?', a: 'Restoring force proportional to displacement (F = -kx)', type: 'concept' },
        { q: 'What is the equation of motion for SHM?', a: 'x(t) = A*cos(omega*t + phi)', type: 'concept' },
        { q: 'What is the angular frequency for a mass-spring system?', a: 'omega = sqrt(k/m)', type: 'concept' },
        { q: 'What is the period of SHM for a mass on a spring?', a: 'T = 2*pi*sqrt(m/k)', type: 'concept' },
        { q: 'At what position is velocity maximum in SHM?', a: 'at the equilibrium position (x = 0)', type: 'concept' },
        { q: 'At what position is acceleration maximum in SHM?', a: 'at maximum displacement (amplitude)', type: 'concept' },
        { q: 'What is the total energy in SHM?', a: 'E = (1/2)kA^2 (constant)', type: 'concept' },
        { q: 'Does the period of a mass-spring system depend on amplitude?', a: 'no', type: 'concept' },
      ],
    },
    'mass-spring-system': {
      questions: [
        { q: 'A 0.5 kg mass on a spring (k = 200 N/m) has what angular frequency?', a: '20 rad/s', type: 'calculation' },
        { q: 'What is the potential energy stored in a spring stretched by x?', a: '(1/2)kx^2', type: 'concept' },
        { q: 'Springs in parallel: how do spring constants combine?', a: 'k_eff = k1 + k2', type: 'concept' },
        { q: 'Springs in series: how do spring constants combine?', a: '1/k_eff = 1/k1 + 1/k2', type: 'concept' },
        { q: 'If spring constant quadruples, what happens to the period?', a: 'halves (T proportional to 1/sqrt(k))', type: 'concept' },
        { q: 'In vertical spring-mass, does gravity affect the frequency?', a: 'no, only shifts the equilibrium position', type: 'concept' },
      ],
    },
    'pendulum': {
      questions: [
        { q: 'What is the period of a simple pendulum (small angle)?', a: 'T = 2*pi*sqrt(L/g)', type: 'concept' },
        { q: 'Does the period of a simple pendulum depend on mass?', a: 'no', type: 'concept' },
        { q: 'What approximation makes a pendulum execute SHM?', a: 'sin(theta) approximately equals theta for small angles', type: 'concept' },
        { q: 'If the pendulum length quadruples, what happens to the period?', a: 'doubles', type: 'concept' },
        { q: 'What is a physical pendulum?', a: 'Any rigid body oscillating about a pivot point', type: 'concept' },
        { q: 'What is the period of a physical pendulum?', a: 'T = 2*pi*sqrt(I/(mgh))', type: 'concept' },
      ],
    },
    'damped-oscillations': {
      questions: [
        { q: 'What causes damping in oscillation?', a: 'Dissipative forces like friction or air resistance', type: 'concept' },
        { q: 'What is the equation of motion for a damped oscillator?', a: 'mx double-dot + bx-dot + kx = 0', type: 'concept' },
        { q: 'Name the three damping regimes.', a: 'Underdamped, critically damped, overdamped', type: 'concept' },
        { q: 'Which damping regime returns to equilibrium fastest without oscillating?', a: 'critically damped', type: 'concept' },
        { q: 'In underdamping, the amplitude decays as what function?', a: 'exponential envelope (A*e^(-bt/2m))', type: 'concept' },
        { q: 'What is the quality factor Q?', a: 'A measure of how many oscillations before energy decays significantly (Q = omega_0*m/b)', type: 'concept' },
      ],
    },
    'driven-resonance': {
      questions: [
        { q: 'What is resonance?', a: 'Maximum amplitude response when driving frequency equals natural frequency', type: 'concept' },
        { q: 'What happens to amplitude at resonance with low damping?', a: 'becomes very large', type: 'concept' },
        { q: 'What determines the width of the resonance peak?', a: 'damping (more damping = wider peak)', type: 'concept' },
        { q: 'Name a real example of destructive resonance.', a: 'Tacoma Narrows Bridge collapse', type: 'concept' },
        { q: 'What is the phase relationship between driving force and response at resonance?', a: '90 degrees (pi/2) phase lag', type: 'concept' },
        { q: 'What is a forced oscillator?', a: 'An oscillator driven by an external periodic force', type: 'concept' },
      ],
    },
    'wave-equation': {
      questions: [
        { q: 'What is the wave equation?', a: 'd^2y/dx^2 = (1/v^2) * d^2y/dt^2', type: 'concept' },
        { q: 'What is the speed of a wave on a string?', a: 'v = sqrt(T/mu) where T is tension and mu is linear density', type: 'concept' },
        { q: 'What is the relationship between wavelength, frequency, and speed?', a: 'v = f*lambda', type: 'concept' },
        { q: 'What is a transverse wave?', a: 'Oscillation perpendicular to propagation direction', type: 'concept' },
        { q: 'What is a longitudinal wave?', a: 'Oscillation parallel to propagation direction', type: 'concept' },
        { q: 'A wave has f = 500 Hz and lambda = 0.68 m. What is the wave speed?', a: '340 m/s', type: 'calculation' },
      ],
    },
    'superposition': {
      questions: [
        { q: 'What is the principle of superposition?', a: 'The net displacement is the sum of individual displacements', type: 'concept' },
        { q: 'What is constructive interference?', a: 'Waves combine to produce larger amplitude (in phase)', type: 'concept' },
        { q: 'What is destructive interference?', a: 'Waves combine to produce smaller amplitude (out of phase)', type: 'concept' },
        { q: 'What is a beat frequency?', a: 'f_beat = |f1 - f2|', type: 'concept' },
        { q: 'Two waves with f = 440 Hz and f = 444 Hz produce what beat frequency?', a: '4 Hz', type: 'calculation' },
        { q: 'Does superposition apply to all types of waves?', a: 'yes, for linear media', type: 'concept' },
      ],
    },
    'standing-waves': {
      questions: [
        { q: 'How are standing waves formed?', a: 'By superposition of two identical waves traveling in opposite directions', type: 'concept' },
        { q: 'What are nodes in a standing wave?', a: 'Points of zero displacement', type: 'concept' },
        { q: 'What are antinodes?', a: 'Points of maximum displacement', type: 'concept' },
        { q: 'For a string fixed at both ends, what is the fundamental wavelength?', a: 'lambda_1 = 2L', type: 'concept' },
        { q: 'What are the allowed frequencies for a string fixed at both ends?', a: 'f_n = n*v/(2L) for n = 1, 2, 3...', type: 'concept' },
        { q: 'What harmonics can a pipe open at both ends produce?', a: 'all harmonics (n = 1, 2, 3...)', type: 'concept' },
        { q: 'What harmonics can a pipe closed at one end produce?', a: 'odd harmonics only (n = 1, 3, 5...)', type: 'concept' },
        { q: 'What is the fundamental frequency of a 1 m string with wave speed 340 m/s?', a: '170 Hz', type: 'calculation' },
      ],
    },
    'sound-waves': {
      questions: [
        { q: 'Are sound waves transverse or longitudinal?', a: 'longitudinal', type: 'concept' },
        { q: 'What is the speed of sound in air at room temperature?', a: 'about 343 m/s', type: 'concept' },
        { q: 'What determines the pitch of a sound?', a: 'frequency', type: 'concept' },
        { q: 'What determines the loudness of a sound?', a: 'amplitude (intensity)', type: 'concept' },
        { q: 'What is the decibel scale?', a: 'Logarithmic measure of sound intensity: beta = 10*log10(I/I_0)', type: 'concept' },
        { q: 'If intensity increases by a factor of 100, how many dB is that?', a: '20 dB', type: 'calculation' },
      ],
    },
    'doppler-effect': {
      questions: [
        { q: 'What is the Doppler effect?', a: 'Change in observed frequency due to relative motion between source and observer', type: 'concept' },
        { q: 'If a source moves toward the observer, what happens to the observed frequency?', a: 'increases (higher pitch)', type: 'concept' },
        { q: 'What is the Doppler formula for a moving source?', a: 'f_obs = f_source * v/(v - v_source) for approach', type: 'concept' },
        { q: 'What happens at the speed of sound (Mach 1)?', a: 'A shock wave (sonic boom) forms', type: 'concept' },
        { q: 'Name a practical application of the Doppler effect.', a: 'Radar speed guns, medical ultrasound, astronomical redshift', type: 'concept' },
        { q: 'Does the Doppler effect apply to light as well as sound?', a: 'yes', type: 'concept' },
      ],
    },
    'coulombs-law': {
      questions: [
        { q: 'State Coulombs law.', a: 'F = k*q1*q2/r^2', type: 'concept' },
        { q: 'What is the value of Coulombs constant k?', a: '8.99 x 10^9 N*m^2/C^2', type: 'concept' },
        { q: 'Two charges of 1 C are 1 m apart. What is the force?', a: '8.99 x 10^9 N', type: 'calculation' },
        { q: 'Like charges ___ and unlike charges ___.', a: 'repel, attract', type: 'concept' },
        { q: 'What is the SI unit of charge?', a: 'Coulomb (C)', type: 'term' },
        { q: 'What is the charge of an electron?', a: '-1.6 x 10^-19 C', type: 'concept' },
        { q: 'How does the force change if the distance is tripled?', a: 'decreases by a factor of 9', type: 'concept' },
        { q: 'Is Coulombs law valid for point charges?', a: 'yes, and for spherically symmetric charge distributions', type: 'concept' },
      ],
    },
    'electric-field': {
      questions: [
        { q: 'What is the electric field?', a: 'Force per unit positive test charge (E = F/q)', type: 'concept' },
        { q: 'What is the electric field of a point charge?', a: 'E = kq/r^2', type: 'concept' },
        { q: 'In what direction does the electric field point?', a: 'Away from positive charges, toward negative charges', type: 'concept' },
        { q: 'What is the SI unit of electric field?', a: 'N/C or V/m', type: 'term' },
        { q: 'What is the electric field inside a conductor in electrostatic equilibrium?', a: 'zero', type: 'concept' },
        { q: 'What is the superposition principle for electric fields?', a: 'Total field is the vector sum of fields from individual charges', type: 'concept' },
      ],
    },
    'electric-potential': {
      questions: [
        { q: 'What is electric potential?', a: 'Potential energy per unit charge (V = U/q)', type: 'concept' },
        { q: 'What is the SI unit of electric potential?', a: 'Volt (V = J/C)', type: 'term' },
        { q: 'What is the potential due to a point charge?', a: 'V = kq/r', type: 'concept' },
        { q: 'How is electric field related to electric potential?', a: 'E = -dV/dx (field points from high to low potential)', type: 'concept' },
        { q: 'What is an equipotential surface?', a: 'Surface where potential is constant; E is perpendicular to it', type: 'concept' },
        { q: 'What work is done moving a charge along an equipotential?', a: '0', type: 'concept' },
        { q: 'What is voltage?', a: 'potential difference between two points', type: 'concept' },
        { q: 'What is an electron-volt?', a: 'Energy gained by one electron through 1 V potential difference (1.6 x 10^-19 J)', type: 'concept' },
      ],
    },
    'gauss-law': {
      questions: [
        { q: 'State Gauss law.', a: 'The electric flux through a closed surface equals the enclosed charge divided by epsilon_0', type: 'concept' },
        { q: 'What is electric flux?', a: 'Phi_E = integral of E dot dA', type: 'concept' },
        { q: 'What is a Gaussian surface?', a: 'An imaginary closed surface used to apply Gauss law', type: 'concept' },
        { q: 'What is the field of an infinite plane of charge?', a: 'E = sigma/(2*epsilon_0), uniform and perpendicular', type: 'concept' },
        { q: 'What is the electric field inside a uniformly charged sphere?', a: 'E = (rho*r)/(3*epsilon_0), proportional to r', type: 'concept' },
        { q: 'When is Gauss law most useful?', a: 'When there is sufficient symmetry (spherical, cylindrical, planar)', type: 'concept' },
      ],
    },
    'capacitance': {
      questions: [
        { q: 'What is capacitance?', a: 'The ability to store charge per unit voltage (C = Q/V)', type: 'concept' },
        { q: 'What is the SI unit of capacitance?', a: 'Farad (F = C/V)', type: 'term' },
        { q: 'What is the capacitance of a parallel plate capacitor?', a: 'C = epsilon_0*A/d', type: 'concept' },
        { q: 'What is the energy stored in a capacitor?', a: 'U = (1/2)CV^2', type: 'concept' },
        { q: 'Capacitors in parallel combine how?', a: 'C_total = C1 + C2', type: 'concept' },
        { q: 'Capacitors in series combine how?', a: '1/C_total = 1/C1 + 1/C2', type: 'concept' },
        { q: 'What is a dielectric?', a: 'Insulating material that increases capacitance when inserted', type: 'concept' },
        { q: 'How does a dielectric affect capacitance?', a: 'Multiplies it by the dielectric constant (C = kappa*C_0)', type: 'concept' },
      ],
    },
    'ohms-law': {
      questions: [
        { q: 'State Ohms law.', a: 'V = IR', type: 'concept' },
        { q: 'What is the SI unit of resistance?', a: 'Ohm', type: 'term' },
        { q: 'A 12 V battery drives current through a 4 ohm resistor. What is the current?', a: '3 A', type: 'calculation' },
        { q: 'What factors affect the resistance of a wire?', a: 'Length, cross-sectional area, resistivity (R = rho*L/A)', type: 'concept' },
        { q: 'What is the difference between resistance and resistivity?', a: 'Resistivity is a material property; resistance depends on geometry', type: 'concept' },
        { q: 'What is current?', a: 'Rate of flow of charge (I = dQ/dt)', type: 'concept' },
      ],
    },
    'series-parallel': {
      questions: [
        { q: 'How do resistors in series combine?', a: 'R_total = R1 + R2 + ...', type: 'concept' },
        { q: 'How do resistors in parallel combine?', a: '1/R_total = 1/R1 + 1/R2 + ...', type: 'concept' },
        { q: 'In a series circuit, what is the same through each resistor?', a: 'current', type: 'concept' },
        { q: 'In a parallel circuit, what is the same across each resistor?', a: 'voltage', type: 'concept' },
        { q: 'Two 6 ohm resistors in parallel have what total resistance?', a: '3 ohm', type: 'calculation' },
        { q: 'Three 3 ohm resistors in series have what total resistance?', a: '9 ohm', type: 'calculation' },
      ],
    },
    'kirchhoffs-rules': {
      questions: [
        { q: 'State Kirchhoffs junction rule.', a: 'Sum of currents entering a junction equals sum leaving (conservation of charge)', type: 'concept' },
        { q: 'State Kirchhoffs loop rule.', a: 'Sum of voltage changes around any closed loop equals zero (conservation of energy)', type: 'concept' },
        { q: 'What conservation law does the junction rule represent?', a: 'conservation of charge', type: 'concept' },
        { q: 'What conservation law does the loop rule represent?', a: 'conservation of energy', type: 'concept' },
        { q: 'When must you use Kirchhoffs rules instead of simple series-parallel?', a: 'When the circuit cannot be reduced to simple series-parallel combinations', type: 'concept' },
        { q: 'How many independent equations do you need for a circuit with N unknowns?', a: 'N equations', type: 'concept' },
      ],
    },
    'rc-circuits': {
      questions: [
        { q: 'What is the time constant of an RC circuit?', a: 'tau = RC', type: 'concept' },
        { q: 'How does charge build up in an RC charging circuit?', a: 'Q(t) = Q_max(1 - e^(-t/RC))', type: 'concept' },
        { q: 'After how many time constants is a capacitor approximately fully charged?', a: 'about 5 time constants (>99%)', type: 'concept' },
        { q: 'What is the voltage across a discharging capacitor?', a: 'V(t) = V_0*e^(-t/RC)', type: 'concept' },
        { q: 'An RC circuit with R = 1 kohm and C = 1 microF has what time constant?', a: '1 ms', type: 'calculation' },
        { q: 'At t = tau, the voltage across a charging capacitor is what fraction of maximum?', a: 'about 63%', type: 'concept' },
      ],
    },
    'power-in-circuits': {
      questions: [
        { q: 'What is the formula for electrical power?', a: 'P = IV', type: 'concept' },
        { q: 'Express power in terms of resistance and current.', a: 'P = I^2*R', type: 'concept' },
        { q: 'Express power in terms of voltage and resistance.', a: 'P = V^2/R', type: 'concept' },
        { q: 'A 120 V appliance draws 10 A. What is the power?', a: '1200 W', type: 'calculation' },
        { q: 'What is the SI unit of electrical power?', a: 'Watt', type: 'term' },
        { q: 'What form does dissipated power take in a resistor?', a: 'heat', type: 'concept' },
      ],
    },
    'magnetic-force': {
      questions: [
        { q: 'What is the magnetic force on a moving charge?', a: 'F = qv x B (cross product)', type: 'concept' },
        { q: 'What is the magnitude of the magnetic force on a charge?', a: 'F = qvB sin(theta)', type: 'concept' },
        { q: 'Does the magnetic force do work on a moving charge?', a: 'no (force is perpendicular to velocity)', type: 'concept' },
        { q: 'What path does a charged particle follow in a uniform magnetic field?', a: 'circular (or helical if there is a parallel velocity component)', type: 'concept' },
        { q: 'What is the force on a current-carrying wire in a magnetic field?', a: 'F = IL x B', type: 'concept' },
        { q: 'What is the SI unit of magnetic field?', a: 'Tesla (T)', type: 'term' },
      ],
    },
    'biot-savart': {
      questions: [
        { q: 'What does the Biot-Savart law calculate?', a: 'The magnetic field produced by a current-carrying wire', type: 'concept' },
        { q: 'State the Biot-Savart law.', a: 'dB = (mu_0/4pi) * (I*dl x r-hat)/r^2', type: 'concept' },
        { q: 'What is the magnetic field at the center of a circular loop?', a: 'B = mu_0*I/(2R)', type: 'concept' },
        { q: 'What is the magnetic field of a long straight wire?', a: 'B = mu_0*I/(2*pi*r)', type: 'concept' },
        { q: 'What is the direction of the field around a straight wire?', a: 'circular loops around the wire (right-hand rule)', type: 'concept' },
        { q: 'What is mu_0?', a: 'permeability of free space (4*pi x 10^-7 T*m/A)', type: 'concept' },
      ],
    },
    'amperes-law': {
      questions: [
        { q: 'State Amperes law.', a: 'Line integral of B dot dl around closed path = mu_0 * I_enclosed', type: 'concept' },
        { q: 'When is Amperes law most useful?', a: 'When there is sufficient symmetry (infinite wire, solenoid, toroid)', type: 'concept' },
        { q: 'What is the magnetic field inside a solenoid?', a: 'B = mu_0*n*I (uniform, where n is turns per length)', type: 'concept' },
        { q: 'What is the magnetic field outside an ideal solenoid?', a: 'approximately zero', type: 'concept' },
        { q: 'What is the magnetic field inside a toroid?', a: 'B = mu_0*N*I/(2*pi*r)', type: 'concept' },
        { q: 'What correction did Maxwell add to Amperes law?', a: 'displacement current term (epsilon_0 * d(Phi_E)/dt)', type: 'concept' },
      ],
    },
    'faradays-law': {
      questions: [
        { q: 'State Faradays law of induction.', a: 'EMF = -d(Phi_B)/dt (induced EMF equals negative rate of change of magnetic flux)', type: 'concept' },
        { q: 'What is magnetic flux?', a: 'Phi_B = B dot A = BA cos(theta)', type: 'concept' },
        { q: 'What does the negative sign in Faradays law represent?', a: 'Lenz law: induced current opposes the change in flux', type: 'concept' },
        { q: 'Name three ways to change magnetic flux.', a: 'Change B, change A, or change the angle between them', type: 'concept' },
        { q: 'What is Lenz law?', a: 'Induced current creates a magnetic field that opposes the change in flux', type: 'concept' },
        { q: 'Name a device based on Faradays law.', a: 'electric generator, transformer, induction cooktop', type: 'concept' },
      ],
    },
    'inductance': {
      questions: [
        { q: 'What is inductance?', a: 'The property of a circuit that opposes changes in current (L = N*Phi_B/I)', type: 'concept' },
        { q: 'What is the SI unit of inductance?', a: 'Henry (H)', type: 'term' },
        { q: 'What is the inductance of a solenoid?', a: 'L = mu_0*n^2*A*l', type: 'concept' },
        { q: 'What is the energy stored in an inductor?', a: 'U = (1/2)LI^2', type: 'concept' },
        { q: 'What is the time constant of an RL circuit?', a: 'tau = L/R', type: 'concept' },
        { q: 'What is an LC circuit?', a: 'An oscillating circuit where energy transfers between inductor and capacitor', type: 'concept' },
      ],
    },
    'reflection-refraction': {
      questions: [
        { q: 'State the law of reflection.', a: 'angle of incidence = angle of reflection', type: 'concept' },
        { q: 'State Snells law.', a: 'n1*sin(theta1) = n2*sin(theta2)', type: 'concept' },
        { q: 'What is the index of refraction?', a: 'n = c/v (ratio of speed of light in vacuum to speed in medium)', type: 'concept' },
        { q: 'What is total internal reflection?', a: 'When light hits a boundary at angle greater than critical angle from denser medium', type: 'concept' },
        { q: 'What is the critical angle formula?', a: 'sin(theta_c) = n2/n1 (where n1 > n2)', type: 'concept' },
        { q: 'What is dispersion?', a: 'Different wavelengths refract at different angles (e.g., prism making rainbow)', type: 'concept' },
      ],
    },
    'mirrors': {
      questions: [
        { q: 'What is the mirror equation?', a: '1/f = 1/d_o + 1/d_i', type: 'concept' },
        { q: 'What is the magnification formula for mirrors?', a: 'm = -d_i/d_o', type: 'concept' },
        { q: 'For a concave mirror, where is the focal point?', a: 'In front of the mirror at f = R/2', type: 'concept' },
        { q: 'What type of image does a flat mirror produce?', a: 'virtual, upright, same size', type: 'concept' },
        { q: 'When does a concave mirror produce a virtual image?', a: 'When the object is inside the focal point', type: 'concept' },
        { q: 'What type of image does a convex mirror always produce?', a: 'virtual, upright, reduced', type: 'concept' },
      ],
    },
    'thin-lenses': {
      questions: [
        { q: 'What is the thin lens equation?', a: '1/f = 1/d_o + 1/d_i', type: 'concept' },
        { q: 'A converging lens has what sign of focal length?', a: 'positive', type: 'concept' },
        { q: 'A diverging lens has what sign of focal length?', a: 'negative', type: 'concept' },
        { q: 'What is the lensmakers equation?', a: '1/f = (n-1)(1/R1 - 1/R2)', type: 'concept' },
        { q: 'What is lens power?', a: 'P = 1/f (measured in diopters)', type: 'concept' },
        { q: 'An object at 2f from a converging lens produces an image where?', a: 'at 2f on the other side (inverted, same size)', type: 'concept' },
      ],
    },
    'interference': {
      questions: [
        { q: 'What is the condition for constructive interference (double slit)?', a: 'd*sin(theta) = m*lambda (m = 0, 1, 2...)', type: 'concept' },
        { q: 'What is the condition for destructive interference (double slit)?', a: 'd*sin(theta) = (m+1/2)*lambda', type: 'concept' },
        { q: 'What does Youngs double-slit experiment demonstrate?', a: 'Wave nature of light (interference pattern)', type: 'concept' },
        { q: 'What is a thin-film interference?', a: 'Interference from reflections off front and back surfaces of a thin film', type: 'concept' },
        { q: 'Does a phase change occur upon reflection from a denser medium?', a: 'yes, a half-wavelength (pi) phase shift', type: 'concept' },
        { q: 'What determines the spacing of interference fringes?', a: 'wavelength and slit separation', type: 'concept' },
      ],
    },
    'diffraction': {
      questions: [
        { q: 'What is diffraction?', a: 'Bending of waves around obstacles or through openings', type: 'concept' },
        { q: 'What is the condition for single-slit minima?', a: 'a*sin(theta) = m*lambda (m = 1, 2, 3...)', type: 'concept' },
        { q: 'What is the Rayleigh criterion?', a: 'Two sources are resolved when the central max of one falls on the first min of the other', type: 'concept' },
        { q: 'What is a diffraction grating?', a: 'Many parallel slits producing sharp bright fringes', type: 'concept' },
        { q: 'How does slit width affect the diffraction pattern?', a: 'Narrower slit = wider central maximum', type: 'concept' },
        { q: 'What is the resolving power of a diffraction grating?', a: 'R = mN where N is number of slits', type: 'concept' },
      ],
    },
  },
  'upper-division': {
    'lagrangian-mechanics': {
      questions: [
        { q: 'What is the Lagrangian?', a: 'L = T - V (kinetic energy minus potential energy)', type: 'concept' },
        { q: 'State the Euler-Lagrange equation.', a: 'd/dt(dL/dq-dot) - dL/dq = 0', type: 'concept' },
        { q: 'What is the advantage of Lagrangian mechanics over Newtonian?', a: 'Works with generalized coordinates; constraint forces drop out', type: 'concept' },
        { q: 'What is a generalized coordinate?', a: 'Any variable that describes the configuration of the system', type: 'concept' },
        { q: 'What is Hamiltons principle?', a: 'The actual path extremizes the action S = integral of L dt', type: 'concept' },
        { q: 'What is a cyclic (ignorable) coordinate?', a: 'A coordinate that does not appear explicitly in L; its conjugate momentum is conserved', type: 'concept' },
      ],
    },
    'hamiltonian-mechanics': {
      questions: [
        { q: 'What is the Hamiltonian?', a: 'H = sum(p_i * q_i-dot) - L; often equals T + V (total energy)', type: 'concept' },
        { q: 'What are Hamiltons equations?', a: 'q-dot = dH/dp, p-dot = -dH/dq', type: 'concept' },
        { q: 'What is phase space?', a: 'The space of all (q, p) pairs — position and momentum coordinates', type: 'concept' },
        { q: 'What is a Poisson bracket?', a: '{f, g} = sum(df/dq_i * dg/dp_i - df/dp_i * dg/dq_i)', type: 'concept' },
        { q: 'When is H conserved?', a: 'When it does not depend explicitly on time', type: 'concept' },
        { q: 'What is Liouvilles theorem?', a: 'Phase space density is conserved along trajectories', type: 'concept' },
      ],
    },
    'central-force': {
      questions: [
        { q: 'What is a central force?', a: 'A force directed along the line connecting two bodies, depending only on distance', type: 'concept' },
        { q: 'What is conserved in a central force problem?', a: 'angular momentum', type: 'concept' },
        { q: 'What is the effective potential?', a: 'V_eff = V(r) + L^2/(2*m*r^2)', type: 'concept' },
        { q: 'What are Keplers three laws?', a: '1) Elliptical orbits, 2) Equal areas in equal times, 3) T^2 proportional to a^3', type: 'concept' },
        { q: 'What is the reduced mass?', a: 'mu = m1*m2/(m1 + m2)', type: 'concept' },
        { q: 'What determines whether an orbit is bound or unbound?', a: 'Total energy: E < 0 is bound, E >= 0 is unbound', type: 'concept' },
      ],
    },
    'rigid-body-dynamics': {
      questions: [
        { q: 'What is the inertia tensor?', a: 'A 3x3 matrix generalizing moment of inertia to three dimensions', type: 'concept' },
        { q: 'What are principal axes?', a: 'Axes for which the inertia tensor is diagonal', type: 'concept' },
        { q: 'What are Eulers equations for rigid body rotation?', a: 'I1*omega1-dot - (I2 - I3)*omega2*omega3 = tau1, and cyclic permutations', type: 'concept' },
        { q: 'What are Euler angles?', a: 'Three angles (phi, theta, psi) describing orientation of a rigid body', type: 'concept' },
        { q: 'What is precession?', a: 'Rotation of the angular momentum vector around a fixed axis due to torque', type: 'concept' },
        { q: 'What is nutation?', a: 'Oscillation of the precession angle of a spinning top', type: 'concept' },
      ],
    },
    'coupled-oscillators': {
      questions: [
        { q: 'What is a normal mode?', a: 'A pattern of motion where all parts oscillate at the same frequency', type: 'concept' },
        { q: 'How many normal modes do N coupled oscillators have?', a: 'N', type: 'concept' },
        { q: 'What mathematical technique finds normal modes?', a: 'Eigenvalue problem (diagonalizing the matrix equation of motion)', type: 'concept' },
        { q: 'In two coupled pendulums, what are the two normal modes?', a: 'In-phase (symmetric) and out-of-phase (antisymmetric)', type: 'concept' },
        { q: 'What is a normal frequency?', a: 'The frequency of a normal mode', type: 'concept' },
        { q: 'How is general motion related to normal modes?', a: 'It is a superposition of all normal modes', type: 'concept' },
      ],
    },
    'maxwells-equations': {
      questions: [
        { q: 'How many Maxwell equations are there? Name them.', a: 'Four: Gauss (E), Gauss (B), Faraday, Ampere-Maxwell', type: 'concept' },
        { q: 'What does Gauss law for magnetism state?', a: 'div B = 0 (no magnetic monopoles)', type: 'concept' },
        { q: 'What is the displacement current?', a: 'epsilon_0 * d(Phi_E)/dt — Maxwells addition to Amperes law', type: 'concept' },
        { q: 'What do Maxwells equations predict about light?', a: 'Light is an electromagnetic wave with speed c = 1/sqrt(mu_0*epsilon_0)', type: 'concept' },
        { q: 'Write the differential form of Faradays law.', a: 'curl E = -dB/dt', type: 'concept' },
        { q: 'What is the continuity equation derived from Maxwells equations?', a: 'div J + d(rho)/dt = 0 (conservation of charge)', type: 'concept' },
      ],
    },
    'em-waves': {
      questions: [
        { q: 'What is the speed of electromagnetic waves in vacuum?', a: 'c = 3 x 10^8 m/s', type: 'concept' },
        { q: 'What is the relationship between E and B in an EM wave?', a: 'E = cB, and E and B are perpendicular', type: 'concept' },
        { q: 'What is the Poynting vector?', a: 'S = (1/mu_0) E x B — gives direction and magnitude of energy flow', type: 'concept' },
        { q: 'What is radiation pressure?', a: 'P = I/c (for absorption) or 2I/c (for reflection)', type: 'concept' },
        { q: 'What is the intensity of an EM wave?', a: 'I = (1/2)*c*epsilon_0*E_0^2', type: 'concept' },
        { q: 'Are EM waves transverse or longitudinal?', a: 'transverse', type: 'concept' },
      ],
    },
    'waveguides': {
      questions: [
        { q: 'What is a waveguide?', a: 'A structure that confines and guides electromagnetic waves', type: 'concept' },
        { q: 'What is the cutoff frequency?', a: 'Minimum frequency that can propagate in a given mode', type: 'concept' },
        { q: 'What are TE and TM modes?', a: 'TE: no E along propagation; TM: no B along propagation', type: 'concept' },
        { q: 'Can a TEM mode propagate in a hollow waveguide?', a: 'no, it requires two conductors', type: 'concept' },
        { q: 'What is the dominant mode in a rectangular waveguide?', a: 'TE10', type: 'concept' },
        { q: 'What determines which modes can propagate?', a: 'frequency relative to cutoff for each mode', type: 'concept' },
      ],
    },
    'radiation': {
      questions: [
        { q: 'What causes electromagnetic radiation?', a: 'accelerating charges', type: 'concept' },
        { q: 'What is the Larmor formula?', a: 'Power radiated by an accelerating charge: P = q^2*a^2/(6*pi*epsilon_0*c^3)', type: 'concept' },
        { q: 'What is the radiation pattern of an oscillating dipole?', a: 'Maximum perpendicular to the dipole; zero along the axis', type: 'concept' },
        { q: 'What is synchrotron radiation?', a: 'Radiation from charged particles moving in curved paths at relativistic speeds', type: 'concept' },
        { q: 'What is Bremsstrahlung?', a: 'Radiation produced when a charged particle decelerates', type: 'concept' },
        { q: 'What are retarded potentials?', a: 'Potentials evaluated at the retarded time t - r/c', type: 'concept' },
      ],
    },
    'special-relativity-em': {
      questions: [
        { q: 'How are E and B fields related by special relativity?', a: 'They transform into each other; a pure E field in one frame has a B component in another', type: 'concept' },
        { q: 'What is the electromagnetic field tensor?', a: 'An antisymmetric 4x4 tensor F^(mu nu) unifying E and B', type: 'concept' },
        { q: 'Write Maxwells equations in covariant form.', a: 'partial_mu F^(mu nu) = mu_0 J^nu and partial_[mu F_nu lambda] = 0', type: 'concept' },
        { q: 'What is the 4-potential?', a: 'A^mu = (phi/c, A) combining scalar and vector potentials', type: 'concept' },
        { q: 'What is the Lorentz gauge condition?', a: 'partial_mu A^mu = 0', type: 'concept' },
        { q: 'What are the two Lorentz invariants of the EM field?', a: 'E^2 - c^2*B^2 and E dot B', type: 'concept' },
      ],
    },
    'wave-function': {
      questions: [
        { q: 'What is the Born interpretation of the wave function?', a: '|psi(x)|^2 gives the probability density of finding the particle at x', type: 'concept' },
        { q: 'What normalization condition must psi satisfy?', a: 'integral of |psi|^2 dx = 1 over all space', type: 'concept' },
        { q: 'What is the Heisenberg uncertainty principle?', a: 'delta_x * delta_p >= hbar/2', type: 'concept' },
        { q: 'What is an eigenstate?', a: 'A state that yields a definite measurement value for an observable', type: 'concept' },
        { q: 'What happens when you measure an observable?', a: 'The wave function collapses to an eigenstate of that observable', type: 'concept' },
        { q: 'What is the expectation value of an observable?', a: '<A> = integral of psi* A psi dx', type: 'concept' },
      ],
    },
    'schrodinger-equation': {
      questions: [
        { q: 'Write the time-dependent Schrodinger equation.', a: 'i*hbar * d(psi)/dt = H*psi', type: 'concept' },
        { q: 'Write the time-independent Schrodinger equation.', a: 'H*psi = E*psi', type: 'concept' },
        { q: 'What is the Hamiltonian operator in 1D?', a: 'H = -hbar^2/(2m) * d^2/dx^2 + V(x)', type: 'concept' },
        { q: 'What does the time-independent equation give?', a: 'stationary states and their energies', type: 'concept' },
        { q: 'How do stationary states evolve in time?', a: 'psi(x,t) = psi(x)*e^(-iEt/hbar)', type: 'concept' },
        { q: 'What is a superposition state?', a: 'A linear combination of energy eigenstates', type: 'concept' },
      ],
    },
    'particle-in-a-box': {
      questions: [
        { q: 'What are the energy levels of a particle in a 1D infinite well?', a: 'E_n = n^2*pi^2*hbar^2/(2*m*L^2)', type: 'concept' },
        { q: 'What is the ground state energy of a particle in a box?', a: 'E_1 = pi^2*hbar^2/(2*m*L^2) (not zero)', type: 'concept' },
        { q: 'Why is the ground state energy nonzero?', a: 'Due to the uncertainty principle (confining the particle requires nonzero KE)', type: 'concept' },
        { q: 'What are the wave functions for a particle in a box?', a: 'psi_n = sqrt(2/L)*sin(n*pi*x/L)', type: 'concept' },
        { q: 'How many nodes does the nth state have (inside the box)?', a: 'n - 1 nodes', type: 'concept' },
        { q: 'What is quantum tunneling?', a: 'Nonzero probability of particle penetrating a classically forbidden region', type: 'concept' },
      ],
    },
    'harmonic-oscillator-qm': {
      questions: [
        { q: 'What are the energy levels of the quantum harmonic oscillator?', a: 'E_n = (n + 1/2)*hbar*omega', type: 'concept' },
        { q: 'What is zero-point energy?', a: 'The minimum energy E_0 = (1/2)*hbar*omega (ground state energy)', type: 'concept' },
        { q: 'What are raising and lowering operators?', a: 'a+ and a- that move between adjacent energy levels', type: 'concept' },
        { q: 'What is the ground state wave function of the QHO?', a: 'A Gaussian: psi_0 = (m*omega/(pi*hbar))^(1/4) * e^(-m*omega*x^2/(2*hbar))', type: 'concept' },
        { q: 'Are the energy levels equally spaced?', a: 'yes, separated by hbar*omega', type: 'concept' },
        { q: 'What physical systems are modeled by the QHO?', a: 'molecular vibrations, phonons, quantized EM field modes', type: 'concept' },
      ],
    },
    'hydrogen-atom': {
      questions: [
        { q: 'What are the quantum numbers for hydrogen?', a: 'n (principal), l (angular momentum), m_l (magnetic), m_s (spin)', type: 'concept' },
        { q: 'What are the allowed values of l for a given n?', a: 'l = 0, 1, 2, ..., n-1', type: 'concept' },
        { q: 'What is the energy of the nth level in hydrogen?', a: 'E_n = -13.6 eV/n^2', type: 'concept' },
        { q: 'What is the degeneracy of level n in hydrogen?', a: '2n^2 (including spin)', type: 'concept' },
        { q: 'What is the Bohr radius?', a: 'a_0 = 0.529 angstroms', type: 'concept' },
        { q: 'What do spherical harmonics describe?', a: 'The angular part of the wave function', type: 'concept' },
      ],
    },
    'laws-of-thermodynamics': {
      questions: [
        { q: 'State the zeroth law of thermodynamics.', a: 'If A is in thermal equilibrium with B, and B with C, then A is in equilibrium with C', type: 'concept' },
        { q: 'State the first law.', a: 'dU = Q - W (energy conservation)', type: 'concept' },
        { q: 'State the second law (Clausius).', a: 'Heat cannot spontaneously flow from cold to hot', type: 'concept' },
        { q: 'State the third law.', a: 'Entropy approaches a constant (zero for perfect crystal) as T approaches absolute zero', type: 'concept' },
        { q: 'What is the Carnot efficiency?', a: 'eta = 1 - T_cold/T_hot', type: 'concept' },
        { q: 'What is a reversible process?', a: 'One that can be reversed with no net change in entropy of system + surroundings', type: 'concept' },
      ],
    },
    'entropy': {
      questions: [
        { q: 'What is entropy (thermodynamic definition)?', a: 'dS = dQ_rev/T', type: 'concept' },
        { q: 'What is the statistical definition of entropy?', a: 'S = k_B * ln(Omega) where Omega is the number of microstates', type: 'concept' },
        { q: 'What does the second law say about entropy in isolated systems?', a: 'Entropy never decreases (dS >= 0)', type: 'concept' },
        { q: 'What is the Gibbs free energy?', a: 'G = H - TS; spontaneous processes have dG < 0 at constant T, P', type: 'concept' },
        { q: 'What is the Helmholtz free energy?', a: 'F = U - TS; spontaneous processes have dF < 0 at constant T, V', type: 'concept' },
        { q: 'What is a Maxwell relation?', a: 'An equality between partial derivatives of thermodynamic potentials (e.g., dS/dV|T = dP/dT|V)', type: 'concept' },
      ],
    },
    'statistical-ensembles': {
      questions: [
        { q: 'What is the microcanonical ensemble?', a: 'Fixed E, V, N (isolated system)', type: 'concept' },
        { q: 'What is the canonical ensemble?', a: 'Fixed T, V, N (system in thermal contact with heat bath)', type: 'concept' },
        { q: 'What is the grand canonical ensemble?', a: 'Fixed T, V, mu (system exchanging energy and particles)', type: 'concept' },
        { q: 'What is the fundamental postulate of statistical mechanics?', a: 'Equal a priori probabilities: all accessible microstates are equally likely', type: 'concept' },
        { q: 'What is the Boltzmann distribution?', a: 'P(state) proportional to e^(-E/(k_B*T))', type: 'concept' },
        { q: 'What is ergodicity?', a: 'Time average equals ensemble average for a sufficiently long observation', type: 'concept' },
      ],
    },
    'partition-function': {
      questions: [
        { q: 'What is the partition function?', a: 'Z = sum of e^(-E_i/(k_B*T)) over all states', type: 'concept' },
        { q: 'How is free energy related to the partition function?', a: 'F = -k_B*T*ln(Z)', type: 'concept' },
        { q: 'How is average energy obtained from Z?', a: '<E> = -d(ln Z)/d(beta) where beta = 1/(k_B*T)', type: 'concept' },
        { q: 'What is the equipartition theorem?', a: 'Each quadratic degree of freedom contributes (1/2)*k_B*T to average energy', type: 'concept' },
        { q: 'What is the partition function of an ideal gas?', a: 'Z = (V/lambda^3)^N / N! where lambda is thermal de Broglie wavelength', type: 'concept' },
        { q: 'What is the chemical potential?', a: 'mu = -k_B*T * d(ln Z)/dN = dF/dN', type: 'concept' },
      ],
    },
    'quantum-statistics': {
      questions: [
        { q: 'What is the Fermi-Dirac distribution?', a: 'f(E) = 1/(e^((E-mu)/(k_B*T)) + 1) for fermions', type: 'concept' },
        { q: 'What is the Bose-Einstein distribution?', a: 'f(E) = 1/(e^((E-mu)/(k_B*T)) - 1) for bosons', type: 'concept' },
        { q: 'What distinguishes fermions from bosons?', a: 'Fermions have half-integer spin (obey Pauli exclusion); bosons have integer spin', type: 'concept' },
        { q: 'What is the Fermi energy?', a: 'Energy of the highest occupied state at T = 0', type: 'concept' },
        { q: 'What is Bose-Einstein condensation?', a: 'Macroscopic occupation of the ground state below a critical temperature', type: 'concept' },
        { q: 'What is blackbody radiation described by?', a: 'Planck distribution: photons as bosons with mu = 0', type: 'concept' },
      ],
    },
    'lorentz-transformations': {
      questions: [
        { q: 'What are the Lorentz transformations?', a: 'x\' = gamma*(x - vt), t\' = gamma*(t - vx/c^2)', type: 'concept' },
        { q: 'What is the Lorentz factor gamma?', a: 'gamma = 1/sqrt(1 - v^2/c^2)', type: 'concept' },
        { q: 'What are the two postulates of special relativity?', a: '1) Laws of physics are the same in all inertial frames. 2) Speed of light is constant.', type: 'concept' },
        { q: 'What is a spacetime interval?', a: 'ds^2 = -c^2*dt^2 + dx^2 + dy^2 + dz^2 (Lorentz invariant)', type: 'concept' },
        { q: 'What is a 4-vector?', a: 'A quantity with four components that transforms according to Lorentz transformations', type: 'concept' },
        { q: 'What is proper time?', a: 'Time measured in the rest frame of the observer', type: 'concept' },
      ],
    },
    'time-dilation': {
      questions: [
        { q: 'What is time dilation?', a: 'Moving clocks run slower: delta_t = gamma * delta_t_proper', type: 'concept' },
        { q: 'A muon lives 2.2 microseconds at rest. At 0.99c, how long does it live in lab frame?', a: 'about 15.6 microseconds (gamma approximately 7.09)', type: 'calculation' },
        { q: 'What is the twin paradox?', a: 'Traveling twin ages less; resolved by noting the traveler accelerates', type: 'concept' },
        { q: 'Is time dilation reciprocal?', a: 'yes, each observer sees the others clock running slow', type: 'concept' },
        { q: 'What experiment confirmed time dilation?', a: 'muon lifetime measurements; Hafele-Keating experiment', type: 'concept' },
        { q: 'What is GPS correction for time dilation?', a: 'GPS satellites correct for both special and general relativistic time dilation', type: 'concept' },
      ],
    },
    'length-contraction': {
      questions: [
        { q: 'What is length contraction?', a: 'Moving objects are shorter along direction of motion: L = L_proper/gamma', type: 'concept' },
        { q: 'In which direction does length contraction occur?', a: 'Only along the direction of relative motion', type: 'concept' },
        { q: 'Is length contraction real or just apparent?', a: 'Real (frame-dependent), not an optical illusion', type: 'concept' },
        { q: 'A 100 m spaceship travels at 0.8c. What is its length in the lab frame?', a: '60 m', type: 'calculation' },
        { q: 'What is the proper length?', a: 'Length measured in the rest frame of the object', type: 'concept' },
        { q: 'Does transverse length change?', a: 'no', type: 'concept' },
      ],
    },
    'relativistic-momentum': {
      questions: [
        { q: 'What is relativistic momentum?', a: 'p = gamma*m*v', type: 'concept' },
        { q: 'Why is classical momentum insufficient at high speeds?', a: 'It is not conserved in relativistic collisions', type: 'concept' },
        { q: 'What happens to momentum as v approaches c?', a: 'momentum approaches infinity', type: 'concept' },
        { q: 'What is the relativistic force equation?', a: 'F = dp/dt = d(gamma*m*v)/dt', type: 'concept' },
        { q: 'What is the 4-momentum?', a: 'p^mu = (E/c, p) — a Lorentz 4-vector', type: 'concept' },
        { q: 'What is the invariant mass?', a: 'm^2*c^4 = E^2 - (pc)^2', type: 'concept' },
      ],
    },
    'mass-energy-equivalence': {
      questions: [
        { q: 'What is Einsteins mass-energy relation?', a: 'E = mc^2 (rest energy)', type: 'concept' },
        { q: 'What is the total relativistic energy?', a: 'E = gamma*m*c^2', type: 'concept' },
        { q: 'What is the energy-momentum relation?', a: 'E^2 = (pc)^2 + (mc^2)^2', type: 'concept' },
        { q: 'What is the rest energy of a proton (approximately)?', a: '938 MeV', type: 'concept' },
        { q: 'What is nuclear binding energy?', a: 'Mass defect converted to energy: energy needed to separate nucleons', type: 'concept' },
        { q: 'How much energy is in 1 kg of mass?', a: '9 x 10^16 J', type: 'calculation' },
      ],
    },
    'photoelectric-effect': {
      questions: [
        { q: 'What is the photoelectric effect?', a: 'Emission of electrons from a surface when light of sufficient frequency strikes it', type: 'concept' },
        { q: 'What is the photoelectric equation?', a: 'KE_max = hf - phi (where phi is the work function)', type: 'concept' },
        { q: 'What is the threshold frequency?', a: 'Minimum frequency to eject electrons: f_0 = phi/h', type: 'concept' },
        { q: 'What does the photoelectric effect demonstrate?', a: 'Light has particle-like properties (photons)', type: 'concept' },
        { q: 'Does increasing intensity (below threshold) cause emission?', a: 'no', type: 'concept' },
        { q: 'Who explained the photoelectric effect?', a: 'Einstein (1905)', type: 'concept' },
      ],
    },
    'compton-scattering': {
      questions: [
        { q: 'What is Compton scattering?', a: 'Scattering of a photon by a free electron, resulting in wavelength increase', type: 'concept' },
        { q: 'What is the Compton shift formula?', a: 'delta_lambda = (h/(m_e*c))(1 - cos(theta))', type: 'concept' },
        { q: 'What is the Compton wavelength of an electron?', a: 'h/(m_e*c) = 2.43 x 10^-12 m', type: 'concept' },
        { q: 'At what angle is the wavelength shift maximum?', a: '180 degrees (backscattering)', type: 'concept' },
        { q: 'What does Compton scattering demonstrate?', a: 'Photons carry momentum (p = h/lambda)', type: 'concept' },
        { q: 'What is the momentum of a photon?', a: 'p = h/lambda = E/c', type: 'concept' },
      ],
    },
    'wave-particle-duality': {
      questions: [
        { q: 'What is the de Broglie wavelength?', a: 'lambda = h/p = h/(mv)', type: 'concept' },
        { q: 'What experiment demonstrates wave-particle duality for electrons?', a: 'electron double-slit experiment (Davisson-Germer for diffraction)', type: 'concept' },
        { q: 'What is wave-particle duality?', a: 'All matter exhibits both wave and particle properties', type: 'concept' },
        { q: 'What is complementarity?', a: 'Wave and particle properties are complementary; observing one precludes observing the other', type: 'concept' },
        { q: 'Calculate the de Broglie wavelength of a 1 kg ball at 1 m/s.', a: '6.63 x 10^-34 m (negligibly small)', type: 'calculation' },
        { q: 'What is a matter wave?', a: 'The wave associated with a particle, described by its de Broglie wavelength', type: 'concept' },
      ],
    },
    'nuclear-physics': {
      questions: [
        { q: 'What holds the nucleus together?', a: 'Strong nuclear force', type: 'concept' },
        { q: 'What is radioactive decay?', a: 'Spontaneous emission of particles or radiation from unstable nuclei', type: 'concept' },
        { q: 'Name three types of radioactive decay.', a: 'Alpha (helium nucleus), beta (electron/positron), gamma (photon)', type: 'concept' },
        { q: 'What is the half-life?', a: 'Time for half of a radioactive sample to decay', type: 'concept' },
        { q: 'What is nuclear fission?', a: 'Splitting of a heavy nucleus into lighter nuclei, releasing energy', type: 'concept' },
        { q: 'What is nuclear fusion?', a: 'Combining light nuclei into a heavier one, releasing energy', type: 'concept' },
      ],
    },
    'particle-physics-intro': {
      questions: [
        { q: 'What are the four fundamental forces?', a: 'Gravitational, electromagnetic, strong, weak', type: 'concept' },
        { q: 'What are quarks?', a: 'Fundamental particles that make up protons and neutrons (6 flavors)', type: 'concept' },
        { q: 'What are leptons?', a: 'Fundamental particles including electron, muon, tau, and their neutrinos', type: 'concept' },
        { q: 'What is the Standard Model?', a: 'Theory describing all known fundamental particles and their interactions (except gravity)', type: 'concept' },
        { q: 'What is the Higgs boson?', a: 'Particle associated with the Higgs field, which gives mass to particles', type: 'concept' },
        { q: 'What is antimatter?', a: 'Particles with opposite quantum numbers to normal matter', type: 'concept' },
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

  return { type: 'physics', skill, level, count: items.length, instruction: 'Answer each question. Show your work for calculations. For multiple choice, select the best answer.', items };
}

function checkAnswer(type, expected, answer) {
  return norm(expected) === norm(answer);
}

// Public API

class CollegePhysics {
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
        teach: `Introduce/reinforce: ${target.category} > ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: 'Solve a real-world application problem using this concept',
        synthesize: `Connect ${target.skill} to broader physics principles`,
      },
    };
  }
}

module.exports = CollegePhysics;

// CLI: node physics.js <command> [args]
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new CollegePhysics();
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
      default: out({ usage: 'node physics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students','set-level'], levels: Object.keys(SKILLS) });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
