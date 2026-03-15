// eClaw HS Physics Tutor (11-12). No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'hs-science-physics');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'kinematics': ['displacement-velocity', 'acceleration', 'kinematic-equations', 'projectile-motion', 'graphical-analysis', 'relative-motion'],
  'forces-newtons-laws': ['newtons-first-law', 'newtons-second-law', 'newtons-third-law', 'friction', 'free-body-diagrams', 'inclined-planes', 'tension-normal-force'],
  'energy-work-power': ['work', 'kinetic-energy', 'potential-energy', 'conservation-of-energy', 'work-energy-theorem', 'power'],
  'momentum': ['impulse', 'momentum-conservation', 'elastic-collisions', 'inelastic-collisions', 'explosion-problems'],
  'circular-motion': ['centripetal-acceleration', 'centripetal-force', 'gravitation', 'orbits-keplers-laws', 'banked-curves'],
  'waves-sound': ['wave-properties', 'wave-equation', 'superposition', 'standing-waves', 'sound-speed', 'doppler-effect', 'resonance'],
  'light-optics': ['reflection', 'refraction-snells-law', 'thin-lenses', 'mirrors', 'diffraction', 'interference', 'electromagnetic-spectrum'],
  'electricity': ['coulombs-law', 'electric-field', 'electric-potential', 'ohms-law', 'series-circuits', 'parallel-circuits', 'power-dissipation'],
  'magnetism': ['magnetic-fields', 'force-on-moving-charge', 'force-on-current', 'faradays-law', 'lenzs-law', 'electromagnetic-induction'],
};

const CONTENT_BANKS = {
  'displacement-velocity': { questions: [
    { q: 'What is the difference between distance and displacement?', a: 'distance is total path length while displacement is straight-line change in position', alt: ['distance is scalar displacement is vector'], type: 'concept' },
    { q: 'What is the difference between speed and velocity?', a: 'speed is scalar and velocity is a vector with direction', alt: ['velocity has direction speed does not'], type: 'concept' },
    { q: 'A car travels 60 km north then 40 km south. What is the displacement?', a: '20 km north', alt: ['20 km'], type: 'calculation' },
    { q: 'What is instantaneous velocity?', a: 'the velocity at a specific moment in time', alt: ['velocity at one instant'], type: 'concept' },
    { q: 'What does the slope of a position-time graph represent?', a: 'velocity', type: 'recall' },
    { q: 'If position is x = 5t + 2, what is the velocity?', a: '5 m/s', alt: ['5'], type: 'calculation' },
  ]},
  'acceleration': { questions: [
    { q: 'What is acceleration?', a: 'the rate of change of velocity', alt: ['change in velocity over time'], type: 'concept' },
    { q: 'What are the units of acceleration?', a: 'm/s^2', alt: ['meters per second squared'], type: 'recall' },
    { q: 'What does the slope of a velocity-time graph represent?', a: 'acceleration', type: 'recall' },
    { q: 'A car goes from 0 to 30 m/s in 10 seconds. What is the acceleration?', a: '3 m/s^2', alt: ['3'], type: 'calculation' },
    { q: 'What is the acceleration due to gravity near Earth\'s surface?', a: '9.8 m/s^2', alt: ['9.8', '9.81', '10 m/s^2'], type: 'recall' },
    { q: 'What does negative acceleration mean?', a: 'acceleration opposite to the direction of motion (deceleration)', alt: ['slowing down or accelerating in negative direction'], type: 'concept' },
  ]},
  'kinematic-equations': { questions: [
    { q: 'State the kinematic equation relating v, v0, a, and t.', a: 'v = v0 + at', alt: ['vf = vi + at'], type: 'recall' },
    { q: 'State the kinematic equation for displacement with constant acceleration.', a: 'x = v0t + 1/2at^2', alt: ['d = vit + 0.5at^2'], type: 'recall' },
    { q: 'A ball is dropped from rest. How far does it fall in 3 seconds?', a: '44.1 m', alt: ['44.1', '45 m', '44'], type: 'calculation' },
    { q: 'An object starts at 10 m/s and accelerates at 2 m/s^2 for 5 s. What is final velocity?', a: '20 m/s', alt: ['20'], type: 'calculation' },
    { q: 'What equation links v^2, v0^2, a, and displacement?', a: 'v^2 = v0^2 + 2ax', alt: ['vf^2 = vi^2 + 2ad'], type: 'recall' },
    { q: 'When can you use kinematic equations?', a: 'when acceleration is constant', alt: ['constant acceleration only'], type: 'concept' },
  ]},
  'projectile-motion': { questions: [
    { q: 'Are horizontal and vertical components of projectile motion independent?', a: 'yes', type: 'tf' },
    { q: 'What is the acceleration in the horizontal direction for a projectile (no air resistance)?', a: '0', alt: ['zero', '0 m/s^2'], type: 'recall' },
    { q: 'What is the acceleration in the vertical direction for a projectile?', a: '9.8 m/s^2 downward', alt: ['g', '-9.8 m/s^2', '9.8'], type: 'recall' },
    { q: 'At what angle does a projectile achieve maximum range?', a: '45 degrees', alt: ['45'], type: 'recall' },
    { q: 'What is the vertical velocity at the peak of a projectile\'s path?', a: '0', alt: ['zero', '0 m/s'], type: 'recall' },
    { q: 'A ball is thrown horizontally at 10 m/s from a 20m cliff. How long does it take to hit the ground?', a: 'about 2 seconds', alt: ['2 s', '2.02 s', '2'], type: 'calculation' },
  ]},
  'graphical-analysis': { questions: [
    { q: 'What does the area under a velocity-time graph represent?', a: 'displacement', type: 'recall' },
    { q: 'What does the area under an acceleration-time graph represent?', a: 'change in velocity', alt: ['delta v'], type: 'recall' },
    { q: 'A straight line on a position-time graph means what kind of motion?', a: 'constant velocity', alt: ['uniform motion'], type: 'concept' },
    { q: 'A parabola on a position-time graph means what?', a: 'constant acceleration', alt: ['uniformly accelerated motion'], type: 'concept' },
    { q: 'On a v-t graph, what does a horizontal line represent?', a: 'constant velocity (zero acceleration)', alt: ['no acceleration'], type: 'concept' },
    { q: 'On a v-t graph, what does a line with positive slope represent?', a: 'constant positive acceleration', alt: ['speeding up in positive direction'], type: 'concept' },
  ]},
  'relative-motion': { questions: [
    { q: 'What is relative velocity?', a: 'the velocity of one object as observed from another', alt: ['velocity measured from a different reference frame'], type: 'concept' },
    { q: 'If car A moves at 60 km/h east and car B at 40 km/h east, what is A\'s velocity relative to B?', a: '20 km/h east', alt: ['20 km/h'], type: 'calculation' },
    { q: 'A boat travels 5 m/s across a river with a 3 m/s current. What is the boat\'s speed relative to the ground?', a: 'about 5.8 m/s', alt: ['5.83 m/s', 'sqrt(34)', '5.8'], type: 'calculation' },
    { q: 'What is a reference frame?', a: 'a coordinate system from which motion is observed', alt: ['perspective from which motion is measured'], type: 'concept' },
    { q: 'Two cars approach each other at 50 km/h each. What is their relative speed?', a: '100 km/h', alt: ['100'], type: 'calculation' },
    { q: 'Why is relative motion important?', a: 'all motion is relative to a chosen reference frame', alt: ['motion depends on observer'], type: 'concept' },
  ]},
  'newtons-first-law': { questions: [
    { q: 'State Newton\'s first law.', a: 'an object at rest stays at rest and an object in motion stays in motion unless acted on by a net external force', alt: ['law of inertia'], type: 'concept' },
    { q: 'What is inertia?', a: 'the tendency of an object to resist changes in motion', alt: ['resistance to acceleration'], type: 'concept' },
    { q: 'What property of an object determines its inertia?', a: 'mass', type: 'recall' },
    { q: 'If the net force on an object is zero, what can you say about its motion?', a: 'it is at rest or moving at constant velocity', alt: ['constant velocity or stationary'], type: 'concept' },
    { q: 'True or false: An object needs a force to keep moving at constant velocity.', a: 'false', type: 'tf' },
    { q: 'What is an inertial reference frame?', a: 'a frame of reference that is not accelerating', alt: ['non-accelerating frame'], type: 'concept' },
  ]},
  'newtons-second-law': { questions: [
    { q: 'State Newton\'s second law as an equation.', a: 'f = ma', alt: ['force equals mass times acceleration'], type: 'recall' },
    { q: 'What is the unit of force?', a: 'newton', alt: ['n', 'kg m/s^2'], type: 'recall' },
    { q: 'A 10 kg object is pushed with 50 N of force. What is its acceleration?', a: '5 m/s^2', alt: ['5'], type: 'calculation' },
    { q: 'If mass doubles and force stays the same, what happens to acceleration?', a: 'it halves', alt: ['decreases by half', 'halved'], type: 'concept' },
    { q: 'What is net force?', a: 'the vector sum of all forces acting on an object', alt: ['sum of all forces', 'total force'], type: 'concept' },
    { q: 'How much force is needed to accelerate a 5 kg mass at 3 m/s^2?', a: '15 n', alt: ['15', '15 newtons'], type: 'calculation' },
  ]},
  'newtons-third-law': { questions: [
    { q: 'State Newton\'s third law.', a: 'for every action there is an equal and opposite reaction', alt: ['action-reaction pairs'], type: 'concept' },
    { q: 'Do action-reaction forces act on the same object?', a: 'no they act on different objects', alt: ['no', 'different objects'], type: 'concept' },
    { q: 'Why don\'t action-reaction forces cancel each other?', a: 'they act on different objects', alt: ['different objects so no cancellation'], type: 'concept' },
    { q: 'When you push on a wall, what does the wall do?', a: 'pushes back on you with equal force', alt: ['exerts equal and opposite force on you'], type: 'concept' },
    { q: 'If a 60 kg person pushes against a 1000 kg car, which experiences more force?', a: 'they experience equal force', alt: ['equal', 'same force'], type: 'concept' },
    { q: 'What is the reaction force to Earth pulling you down with gravity?', a: 'you pulling earth up with equal gravitational force', alt: ['you attract earth equally'], type: 'concept' },
  ]},
  'friction': { questions: [
    { q: 'What is the formula for friction force?', a: 'f = mu times normal force', alt: ['f = un', 'ff = mu * fn'], type: 'recall' },
    { q: 'Which is typically larger: static or kinetic friction coefficient?', a: 'static', type: 'recall' },
    { q: 'What is kinetic friction?', a: 'friction acting on a moving object', alt: ['friction during sliding'], type: 'concept' },
    { q: 'What is static friction?', a: 'friction that prevents an object from starting to move', alt: ['friction keeping object stationary'], type: 'concept' },
    { q: 'Does friction depend on surface area?', a: 'no for ideal surfaces', alt: ['no'], type: 'recall' },
    { q: 'A 20 kg box is on a floor with mu_k = 0.3. What is the kinetic friction force?', a: '58.8 n', alt: ['59 n', '58.8', '60 n'], type: 'calculation' },
  ]},
  'free-body-diagrams': { questions: [
    { q: 'What is a free body diagram?', a: 'a diagram showing all forces acting on a single object', alt: ['force diagram for one object'], type: 'concept' },
    { q: 'What forces act on a book sitting on a table?', a: 'gravity downward and normal force upward', alt: ['weight and normal force'], type: 'recall' },
    { q: 'When is the normal force equal to the weight?', a: 'on a flat horizontal surface with no other vertical forces', alt: ['horizontal surface no extra forces'], type: 'concept' },
    { q: 'What direction does tension in a rope always point?', a: 'along the rope away from the object', alt: ['along the string pulling'], type: 'concept' },
    { q: 'In a free body diagram, how do you represent forces?', a: 'as arrows starting from the object pointing in the direction of the force', alt: ['arrows from center of object'], type: 'recall' },
    { q: 'If an object is in equilibrium, what is the net force?', a: 'zero', alt: ['0', '0 n'], type: 'recall' },
  ]},
  'inclined-planes': { questions: [
    { q: 'On an inclined plane, what component of gravity acts parallel to the surface?', a: 'mg sin theta', alt: ['mg sin(theta)', 'mgsin0'], type: 'recall' },
    { q: 'On an inclined plane, what component of gravity acts perpendicular to the surface?', a: 'mg cos theta', alt: ['mg cos(theta)'], type: 'recall' },
    { q: 'What is the normal force on a frictionless incline?', a: 'mg cos theta', alt: ['mg cos(theta)'], type: 'recall' },
    { q: 'A 5 kg block is on a 30 degree frictionless incline. What is its acceleration?', a: '4.9 m/s^2', alt: ['4.9', 'g/2', '5 m/s^2'], type: 'calculation' },
    { q: 'Does the normal force on an incline equal the weight?', a: 'no it equals mg cos theta which is less than mg', alt: ['no'], type: 'concept' },
    { q: 'What direction does friction act on an object sliding down an incline?', a: 'up the incline', alt: ['uphill', 'opposing motion'], type: 'recall' },
  ]},
  'tension-normal-force': { questions: [
    { q: 'What is tension?', a: 'the pulling force transmitted through a string rope or cable', alt: ['force through a rope'], type: 'concept' },
    { q: 'What is the normal force?', a: 'the perpendicular contact force exerted by a surface', alt: ['support force from surface'], type: 'concept' },
    { q: 'In an Atwood machine with masses 3kg and 5kg, which way does the system accelerate?', a: 'toward the heavier mass', alt: ['the 5kg side goes down', 'down on the 5kg side'], type: 'concept' },
    { q: 'Can tension be negative?', a: 'no tension is always a pull', alt: ['no'], type: 'recall' },
    { q: 'If you stand on a scale in an elevator accelerating upward, does the scale read more or less than your weight?', a: 'more', alt: ['greater than your weight'], type: 'concept' },
    { q: 'What is the apparent weight?', a: 'the normal force you feel which can differ from true weight during acceleration', alt: ['normal force during acceleration'], type: 'concept' },
  ]},
  'work': { questions: [
    { q: 'What is the formula for work?', a: 'w = fd cos theta', alt: ['work = force times distance times cosine of angle'], type: 'recall' },
    { q: 'What is the unit of work?', a: 'joule', alt: ['j', 'joules'], type: 'recall' },
    { q: 'If force and displacement are perpendicular, how much work is done?', a: 'zero', alt: ['0', 'no work'], type: 'recall' },
    { q: 'You push a box 5m with 20N of force in the direction of motion. How much work?', a: '100 j', alt: ['100', '100 joules'], type: 'calculation' },
    { q: 'Can work be negative?', a: 'yes when force opposes displacement', alt: ['yes'], type: 'concept' },
    { q: 'What does the area under a force vs displacement graph represent?', a: 'work done', alt: ['work'], type: 'recall' },
  ]},
  'kinetic-energy': { questions: [
    { q: 'What is the formula for kinetic energy?', a: 'ke = 1/2 mv^2', alt: ['ke = 0.5mv^2', 'half m v squared'], type: 'recall' },
    { q: 'A 2 kg ball moves at 3 m/s. What is its kinetic energy?', a: '9 j', alt: ['9', '9 joules'], type: 'calculation' },
    { q: 'If velocity doubles, what happens to kinetic energy?', a: 'it quadruples', alt: ['4 times as much', 'increases by factor of 4'], type: 'concept' },
    { q: 'What is the kinetic energy of a stationary object?', a: '0', alt: ['zero', '0 j'], type: 'recall' },
    { q: 'Is kinetic energy a scalar or vector?', a: 'scalar', type: 'recall' },
    { q: 'What happens to kinetic energy when mass is halved and speed is doubled?', a: 'it doubles', alt: ['doubles', '2 times'], type: 'concept' },
  ]},
  'potential-energy': { questions: [
    { q: 'What is gravitational potential energy?', a: 'pe = mgh', alt: ['energy due to height', 'mass times g times height'], type: 'recall' },
    { q: 'What is elastic potential energy?', a: 'pe = 1/2 kx^2', alt: ['energy stored in a spring', 'half k x squared'], type: 'recall' },
    { q: 'A 5 kg object is 10m high. What is its gravitational PE? (g=10)', a: '500 j', alt: ['500', '490 j'], type: 'calculation' },
    { q: 'Is potential energy relative?', a: 'yes it depends on the chosen reference point', alt: ['yes'], type: 'concept' },
    { q: 'What is the spring constant?', a: 'a measure of the stiffness of a spring in n/m', alt: ['stiffness constant', 'k'], type: 'concept' },
    { q: 'Where is gravitational PE zero?', a: 'at the chosen reference level', alt: ['at the reference point', 'wherever you define it'], type: 'concept' },
  ]},
  'conservation-of-energy': { questions: [
    { q: 'What does the conservation of energy state?', a: 'energy cannot be created or destroyed only transformed', alt: ['total energy is constant in an isolated system'], type: 'concept' },
    { q: 'A ball dropped from 20m has what speed just before hitting the ground? (g=10)', a: '20 m/s', alt: ['20', 'about 20 m/s'], type: 'calculation' },
    { q: 'At what point does a pendulum have maximum kinetic energy?', a: 'at the lowest point', alt: ['bottom of swing'], type: 'recall' },
    { q: 'At what point does a pendulum have maximum potential energy?', a: 'at the highest point', alt: ['top of swing'], type: 'recall' },
    { q: 'If friction is present, is mechanical energy conserved?', a: 'no some converts to heat', alt: ['no'], type: 'concept' },
    { q: 'What is mechanical energy?', a: 'the sum of kinetic and potential energy', alt: ['ke + pe'], type: 'recall' },
  ]},
  'work-energy-theorem': { questions: [
    { q: 'What does the work-energy theorem state?', a: 'net work equals the change in kinetic energy', alt: ['wnet = delta ke', 'w = ke_f - ke_i'], type: 'concept' },
    { q: '10 J of net work is done on a stationary 2 kg object. What is its final speed?', a: 'about 3.16 m/s', alt: ['sqrt(10)', '3.16', '3.2 m/s'], type: 'calculation' },
    { q: 'If net work is negative, what happens to kinetic energy?', a: 'it decreases', alt: ['object slows down'], type: 'concept' },
    { q: 'Can the work-energy theorem be applied to systems with friction?', a: 'yes net work includes all forces', alt: ['yes'], type: 'concept' },
    { q: 'If only gravity does work on a falling object, what equals mgh?', a: 'the change in kinetic energy', alt: ['delta ke', '1/2mv^2'], type: 'concept' },
    { q: 'How is the work-energy theorem derived?', a: 'from f=ma and kinematic equations', alt: ['from newtons second law'], type: 'concept' },
  ]},
  'power': { questions: [
    { q: 'What is power?', a: 'the rate at which work is done', alt: ['work per unit time', 'energy per time'], type: 'concept' },
    { q: 'What is the formula for power?', a: 'p = w/t', alt: ['power = work / time'], type: 'recall' },
    { q: 'What is the unit of power?', a: 'watt', alt: ['w', 'watts'], type: 'recall' },
    { q: 'A machine does 1000 J of work in 5 seconds. What is its power?', a: '200 w', alt: ['200', '200 watts'], type: 'calculation' },
    { q: 'What is another formula for power involving force and velocity?', a: 'p = fv', alt: ['power = force times velocity'], type: 'recall' },
    { q: 'How many watts is 1 horsepower?', a: '746 w', alt: ['746', 'about 746 watts', '745.7'], type: 'recall' },
  ]},
  'impulse': { questions: [
    { q: 'What is impulse?', a: 'the product of force and time interval', alt: ['j = f delta t', 'force times time'], type: 'concept' },
    { q: 'What are the units of impulse?', a: 'n s', alt: ['newton seconds', 'kg m/s'], type: 'recall' },
    { q: 'How is impulse related to momentum?', a: 'impulse equals change in momentum', alt: ['j = delta p'], type: 'concept' },
    { q: 'A 0.5 kg ball changes velocity from 10 m/s to -10 m/s. What is the impulse?', a: '-10 n s', alt: ['10 n s', '10 kg m/s'], type: 'calculation' },
    { q: 'Why do airbags reduce injury?', a: 'they increase the time of collision reducing the force', alt: ['longer time means less force'], type: 'concept' },
    { q: 'What does the area under a force-time graph represent?', a: 'impulse', alt: ['change in momentum'], type: 'recall' },
  ]},
  'momentum-conservation': { questions: [
    { q: 'What is the formula for momentum?', a: 'p = mv', alt: ['momentum = mass times velocity'], type: 'recall' },
    { q: 'When is momentum conserved?', a: 'when no external net force acts on the system', alt: ['isolated system', 'no external forces'], type: 'concept' },
    { q: 'Is momentum a scalar or vector?', a: 'vector', type: 'recall' },
    { q: 'A 2 kg cart moving at 3 m/s collides with a stationary 1 kg cart and they stick. What is their final velocity?', a: '2 m/s', alt: ['2'], type: 'calculation' },
    { q: 'What is the momentum of a 5 kg object at 4 m/s?', a: '20 kg m/s', alt: ['20'], type: 'calculation' },
    { q: 'In an explosion, is momentum conserved?', a: 'yes', type: 'tf' },
  ]},
  'elastic-collisions': { questions: [
    { q: 'What is conserved in an elastic collision?', a: 'both momentum and kinetic energy', alt: ['momentum and ke'], type: 'concept' },
    { q: 'Do perfectly elastic collisions occur in real life?', a: 'approximately in some cases like billiard balls', alt: ['rarely perfectly but approximately'], type: 'concept' },
    { q: 'In a 1D elastic collision between equal masses where one is stationary, what happens?', a: 'the moving object stops and the stationary one moves with the same velocity', alt: ['they swap velocities'], type: 'concept' },
    { q: 'Is kinetic energy a scalar or vector?', a: 'scalar', type: 'recall' },
    { q: 'What is the coefficient of restitution for a perfectly elastic collision?', a: '1', alt: ['one'], type: 'recall' },
    { q: 'What type of collision conserves KE?', a: 'elastic', type: 'recall' },
  ]},
  'inelastic-collisions': { questions: [
    { q: 'What is a perfectly inelastic collision?', a: 'a collision where objects stick together', alt: ['objects combine after collision'], type: 'concept' },
    { q: 'Is kinetic energy conserved in an inelastic collision?', a: 'no some is converted to heat sound or deformation', alt: ['no'], type: 'concept' },
    { q: 'Is momentum conserved in an inelastic collision?', a: 'yes', type: 'tf' },
    { q: 'Where does the lost kinetic energy go in an inelastic collision?', a: 'heat sound deformation', alt: ['thermal energy and deformation'], type: 'concept' },
    { q: 'A 3 kg object at 4 m/s hits a 1 kg stationary object and sticks. Final velocity?', a: '3 m/s', alt: ['3'], type: 'calculation' },
    { q: 'What is the coefficient of restitution for a perfectly inelastic collision?', a: '0', alt: ['zero'], type: 'recall' },
  ]},
  'explosion-problems': { questions: [
    { q: 'What is the total momentum before an explosion of a stationary object?', a: '0', alt: ['zero'], type: 'recall' },
    { q: 'After an explosion, what must the sum of momenta of all fragments equal?', a: '0', alt: ['zero', 'the initial momentum'], type: 'recall' },
    { q: 'A 10 kg object at rest splits into 4 kg moving right at 5 m/s. What does the 6 kg piece do?', a: 'moves left at 3.33 m/s', alt: ['3.33 m/s left', '-3.33 m/s'], type: 'calculation' },
    { q: 'Is momentum conserved in an explosion?', a: 'yes', type: 'tf' },
    { q: 'Is kinetic energy conserved in an explosion?', a: 'no kinetic energy increases from internal energy', alt: ['no'], type: 'concept' },
    { q: 'What provides the energy in an explosion?', a: 'internal potential energy', alt: ['chemical energy', 'stored energy'], type: 'concept' },
  ]},
  'centripetal-acceleration': { questions: [
    { q: 'What is centripetal acceleration?', a: 'acceleration directed toward the center of a circular path', alt: ['inward acceleration in circular motion'], type: 'concept' },
    { q: 'What is the formula for centripetal acceleration?', a: 'ac = v^2/r', alt: ['a = v squared over r'], type: 'recall' },
    { q: 'What direction does centripetal acceleration point?', a: 'toward the center of the circle', alt: ['inward', 'radially inward'], type: 'recall' },
    { q: 'Does centripetal acceleration change the speed of an object?', a: 'no only the direction', alt: ['no'], type: 'concept' },
    { q: 'A car goes around a 50m radius curve at 10 m/s. What is ac?', a: '2 m/s^2', alt: ['2'], type: 'calculation' },
    { q: 'Is centrifugal force a real force?', a: 'no it is a fictitious force in rotating reference frames', alt: ['no'], type: 'concept' },
  ]},
  'centripetal-force': { questions: [
    { q: 'What is centripetal force?', a: 'the net force directed toward the center that causes circular motion', alt: ['inward force for circular motion'], type: 'concept' },
    { q: 'What is the formula for centripetal force?', a: 'fc = mv^2/r', alt: ['f = mv^2/r'], type: 'recall' },
    { q: 'What provides the centripetal force for a car turning on a flat road?', a: 'friction', type: 'recall' },
    { q: 'What provides the centripetal force for a satellite orbiting Earth?', a: 'gravity', type: 'recall' },
    { q: 'What provides the centripetal force for a ball on a string?', a: 'tension', type: 'recall' },
    { q: 'A 1000 kg car turns a 100m curve at 20 m/s. What centripetal force is needed?', a: '4000 n', alt: ['4000'], type: 'calculation' },
  ]},
  'gravitation': { questions: [
    { q: 'State Newton\'s law of universal gravitation.', a: 'f = gm1m2/r^2', alt: ['every mass attracts every other mass'], type: 'recall' },
    { q: 'What is the value of G?', a: '6.67 x 10^-11 n m^2/kg^2', alt: ['6.67e-11'], type: 'recall' },
    { q: 'How does gravitational force change if the distance between two objects doubles?', a: 'it becomes one-fourth', alt: ['decreases by factor of 4', '1/4'], type: 'concept' },
    { q: 'What is the gravitational field strength at Earth\'s surface?', a: '9.8 n/kg', alt: ['9.8 m/s^2', 'g'], type: 'recall' },
    { q: 'Are astronauts in the ISS weightless because there is no gravity?', a: 'no they are in free fall and gravity still acts', alt: ['no'], type: 'concept' },
    { q: 'What is the relationship between weight and mass?', a: 'weight = mg', alt: ['w = mg'], type: 'recall' },
  ]},
  'orbits-keplers-laws': { questions: [
    { q: 'State Kepler\'s first law.', a: 'planets orbit in ellipses with the sun at one focus', alt: ['elliptical orbits'], type: 'recall' },
    { q: 'State Kepler\'s second law.', a: 'a planet sweeps equal areas in equal times', alt: ['equal area law'], type: 'recall' },
    { q: 'State Kepler\'s third law relationship.', a: 't^2 is proportional to r^3', alt: ['t squared proportional to r cubed', 'period squared proportional to radius cubed'], type: 'recall' },
    { q: 'What provides the centripetal force for a planet orbiting the sun?', a: 'gravity', type: 'recall' },
    { q: 'What happens to orbital period as orbital radius increases?', a: 'it increases', alt: ['longer period'], type: 'concept' },
    { q: 'What is orbital velocity?', a: 'the speed needed to maintain a circular orbit', alt: ['v = sqrt(gm/r)'], type: 'concept' },
  ]},
  'banked-curves': { questions: [
    { q: 'Why are roads banked on curves?', a: 'so that a component of the normal force provides centripetal force', alt: ['to help provide centripetal force'], type: 'concept' },
    { q: 'On a frictionless banked curve, what provides the centripetal force?', a: 'the horizontal component of the normal force', alt: ['normal force component'], type: 'concept' },
    { q: 'What happens if a car goes faster than the designed speed on a banked curve?', a: 'it slides up and outward', alt: ['moves toward outside'], type: 'concept' },
    { q: 'What is the ideal banking angle equation?', a: 'tan theta = v^2 / rg', alt: ['theta = arctan(v^2/rg)'], type: 'recall' },
    { q: 'Do banked curves allow higher speeds than flat curves?', a: 'yes', type: 'tf' },
    { q: 'At ideal speed on a frictionless bank, is friction needed?', a: 'no', type: 'tf' },
  ]},
  'wave-properties': { questions: [
    { q: 'What is wavelength?', a: 'the distance between successive crests or troughs', alt: ['distance of one full wave cycle'], type: 'concept' },
    { q: 'What is frequency?', a: 'the number of waves passing a point per second', alt: ['cycles per second'], type: 'concept' },
    { q: 'What is amplitude?', a: 'the maximum displacement from equilibrium', alt: ['height of wave from rest'], type: 'concept' },
    { q: 'What is the unit of frequency?', a: 'hertz', alt: ['hz'], type: 'recall' },
    { q: 'What is the difference between transverse and longitudinal waves?', a: 'transverse vibrate perpendicular to travel direction while longitudinal vibrate parallel', alt: ['perpendicular vs parallel vibration'], type: 'concept' },
    { q: 'Is a sound wave transverse or longitudinal?', a: 'longitudinal', type: 'recall' },
  ]},
  'wave-equation': { questions: [
    { q: 'What is the wave equation?', a: 'v = f lambda', alt: ['velocity = frequency times wavelength', 'v = f x wavelength'], type: 'recall' },
    { q: 'A wave has f=500 Hz and wavelength=0.68m. What is its speed?', a: '340 m/s', alt: ['340'], type: 'calculation' },
    { q: 'If frequency doubles and speed stays the same, what happens to wavelength?', a: 'it halves', alt: ['decreases by half'], type: 'concept' },
    { q: 'What is the period of a wave?', a: 'the time for one complete cycle', alt: ['t = 1/f', 'inverse of frequency'], type: 'concept' },
    { q: 'What is the relationship between period and frequency?', a: 't = 1/f', alt: ['they are inverse of each other'], type: 'recall' },
    { q: 'A wave with period 0.02 s has what frequency?', a: '50 hz', alt: ['50'], type: 'calculation' },
  ]},
  'superposition': { questions: [
    { q: 'What is the principle of superposition?', a: 'when waves overlap the resulting displacement is the sum of individual displacements', alt: ['waves add together'], type: 'concept' },
    { q: 'What is constructive interference?', a: 'when waves combine to produce a larger amplitude', alt: ['waves add up', 'in phase combination'], type: 'concept' },
    { q: 'What is destructive interference?', a: 'when waves combine to produce a smaller amplitude', alt: ['waves cancel out', 'out of phase combination'], type: 'concept' },
    { q: 'When two crests meet, what type of interference occurs?', a: 'constructive', type: 'recall' },
    { q: 'When a crest meets a trough of equal amplitude, what happens?', a: 'complete destructive interference', alt: ['they cancel out', 'zero amplitude'], type: 'concept' },
    { q: 'What are beats?', a: 'periodic variations in loudness caused by two waves of slightly different frequencies', alt: ['interference of close frequencies'], type: 'concept' },
  ]},
  'standing-waves': { questions: [
    { q: 'What is a standing wave?', a: 'a wave pattern that appears stationary formed by interference of two waves traveling in opposite directions', alt: ['stationary wave pattern'], type: 'concept' },
    { q: 'What is a node?', a: 'a point of zero displacement in a standing wave', alt: ['point that does not move'], type: 'recall' },
    { q: 'What is an antinode?', a: 'a point of maximum displacement in a standing wave', alt: ['point of maximum amplitude'], type: 'recall' },
    { q: 'What is the fundamental frequency?', a: 'the lowest frequency standing wave (first harmonic)', alt: ['first harmonic', 'lowest resonant frequency'], type: 'concept' },
    { q: 'The second harmonic has how many antinodes?', a: '2', alt: ['two'], type: 'recall' },
    { q: 'For a string fixed at both ends, the fundamental wavelength is what?', a: '2l', alt: ['twice the length', '2 times the string length'], type: 'recall' },
  ]},
  'sound-speed': { questions: [
    { q: 'What is the approximate speed of sound in air at room temperature?', a: '343 m/s', alt: ['340 m/s', '343', '340'], type: 'recall' },
    { q: 'Does sound travel faster in solids, liquids, or gases?', a: 'solids', type: 'recall' },
    { q: 'How does temperature affect the speed of sound?', a: 'speed increases with temperature', alt: ['higher temperature faster sound'], type: 'concept' },
    { q: 'What medium cannot transmit sound?', a: 'vacuum', alt: ['a vacuum', 'empty space'], type: 'recall' },
    { q: 'What is the speed of sound in water approximately?', a: '1500 m/s', alt: ['about 1500 m/s', '1480'], type: 'recall' },
    { q: 'Why does sound travel faster in solids?', a: 'particles are closer together allowing faster energy transfer', alt: ['denser medium transmits faster'], type: 'concept' },
  ]},
  'doppler-effect': { questions: [
    { q: 'What is the Doppler effect?', a: 'the change in observed frequency due to relative motion between source and observer', alt: ['frequency shift from motion'], type: 'concept' },
    { q: 'When a source moves toward you, does the frequency increase or decrease?', a: 'increase', alt: ['higher frequency', 'increases'], type: 'recall' },
    { q: 'When an ambulance drives away, what happens to the pitch?', a: 'it decreases', alt: ['lower pitch', 'frequency drops'], type: 'recall' },
    { q: 'Does the Doppler effect apply to light?', a: 'yes', type: 'tf' },
    { q: 'What is redshift?', a: 'the shift to longer wavelengths when a source moves away', alt: ['light stretched by receding source'], type: 'concept' },
    { q: 'What is a sonic boom?', a: 'a shock wave produced when an object exceeds the speed of sound', alt: ['shock wave from supersonic travel'], type: 'concept' },
  ]},
  'resonance': { questions: [
    { q: 'What is resonance?', a: 'when a force is applied at the natural frequency causing large amplitude oscillations', alt: ['driving frequency matches natural frequency'], type: 'concept' },
    { q: 'What is natural frequency?', a: 'the frequency at which an object vibrates when disturbed', alt: ['inherent vibration frequency'], type: 'concept' },
    { q: 'What happens to amplitude at resonance?', a: 'it reaches maximum', alt: ['maximum amplitude', 'greatly increases'], type: 'recall' },
    { q: 'Name an example of resonance.', a: 'pushing a swing at the right timing', alt: ['breaking a glass with sound', 'bridge vibration'], type: 'recall' },
    { q: 'Can resonance be destructive?', a: 'yes', type: 'tf' },
    { q: 'What famous bridge collapsed due to resonance-like effects?', a: 'tacoma narrows bridge', alt: ['tacoma narrows'], type: 'recall' },
  ]},
  'reflection': { questions: [
    { q: 'What is the law of reflection?', a: 'angle of incidence equals angle of reflection', alt: ['theta i = theta r'], type: 'recall' },
    { q: 'What are the angles measured from in reflection?', a: 'the normal to the surface', alt: ['the normal', 'perpendicular to surface'], type: 'recall' },
    { q: 'What is specular reflection?', a: 'reflection from a smooth surface producing a clear image', alt: ['mirror-like reflection'], type: 'concept' },
    { q: 'What is diffuse reflection?', a: 'reflection from a rough surface scattering light in many directions', alt: ['scattered reflection'], type: 'concept' },
    { q: 'Is the image in a flat mirror real or virtual?', a: 'virtual', type: 'recall' },
    { q: 'Is the image in a flat mirror upright or inverted?', a: 'upright', type: 'recall' },
  ]},
  'refraction-snells-law': { questions: [
    { q: 'What is refraction?', a: 'the bending of light as it passes from one medium to another', alt: ['light changes direction at boundary'], type: 'concept' },
    { q: 'What is Snell\'s law?', a: 'n1 sin theta1 = n2 sin theta2', alt: ['n1sin01 = n2sin02'], type: 'recall' },
    { q: 'What is the index of refraction?', a: 'the ratio of speed of light in vacuum to speed in a medium', alt: ['n = c/v', 'measure of how much light slows'], type: 'concept' },
    { q: 'When light goes from air to glass, does it bend toward or away from the normal?', a: 'toward the normal', alt: ['toward'], type: 'recall' },
    { q: 'What is total internal reflection?', a: 'all light reflects when the angle exceeds the critical angle in denser medium', alt: ['complete reflection at boundary'], type: 'concept' },
    { q: 'What is the index of refraction of water?', a: '1.33', alt: ['about 1.33'], type: 'recall' },
  ]},
  'thin-lenses': { questions: [
    { q: 'What is the thin lens equation?', a: '1/f = 1/do + 1/di', alt: ['1/f = 1/object distance + 1/image distance'], type: 'recall' },
    { q: 'What does a converging (convex) lens do to parallel light?', a: 'focuses it to the focal point', alt: ['converges to focus'], type: 'recall' },
    { q: 'What does a diverging (concave) lens do to parallel light?', a: 'spreads it out as if from the focal point', alt: ['diverges light'], type: 'recall' },
    { q: 'What is magnification?', a: 'm = -di/do', alt: ['image height over object height', 'hi/ho'], type: 'recall' },
    { q: 'If magnification is negative, the image is what?', a: 'inverted', alt: ['upside down'], type: 'recall' },
    { q: 'If di is negative, the image is what type?', a: 'virtual', type: 'recall' },
  ]},
  'mirrors': { questions: [
    { q: 'What is the mirror equation?', a: '1/f = 1/do + 1/di', alt: ['same as thin lens equation'], type: 'recall' },
    { q: 'For a concave mirror, where is the focal point?', a: 'in front of the mirror', alt: ['on the reflecting side'], type: 'recall' },
    { q: 'For a convex mirror, what type of image does it always produce?', a: 'virtual upright and reduced', alt: ['virtual and smaller'], type: 'recall' },
    { q: 'What is the relationship between focal length and radius of curvature?', a: 'f = r/2', alt: ['focal length is half the radius'], type: 'recall' },
    { q: 'Where must an object be placed for a concave mirror to produce a real image?', a: 'beyond the focal point', alt: ['outside f'], type: 'recall' },
    { q: 'What type of mirror is used in car side mirrors?', a: 'convex', type: 'recall' },
  ]},
  'diffraction': { questions: [
    { q: 'What is diffraction?', a: 'the bending of waves around obstacles or through openings', alt: ['wave spreading through slits'], type: 'concept' },
    { q: 'When is diffraction most noticeable?', a: 'when the opening or obstacle is similar in size to the wavelength', alt: ['wavelength comparable to slit size'], type: 'concept' },
    { q: 'What pattern does single-slit diffraction produce?', a: 'a central bright band with dimmer bands on either side', alt: ['central maximum with side fringes'], type: 'concept' },
    { q: 'What is a diffraction grating?', a: 'a device with many parallel slits used to separate light into spectra', alt: ['many slits for spectral analysis'], type: 'concept' },
    { q: 'Does diffraction occur with all types of waves?', a: 'yes', type: 'tf' },
    { q: 'What equation governs diffraction grating maxima?', a: 'd sin theta = m lambda', alt: ['d sin0 = m wavelength'], type: 'recall' },
  ]},
  'interference': { questions: [
    { q: 'What is Young\'s double slit experiment?', a: 'an experiment showing light interference pattern proving wave nature of light', alt: ['double slit shows light is a wave'], type: 'concept' },
    { q: 'What produces bright fringes in the double slit experiment?', a: 'constructive interference', type: 'recall' },
    { q: 'What produces dark fringes?', a: 'destructive interference', type: 'recall' },
    { q: 'For constructive interference, the path difference must be what?', a: 'a whole number of wavelengths', alt: ['m lambda', 'integer multiple of wavelength'], type: 'concept' },
    { q: 'For destructive interference, the path difference must be what?', a: 'a half wavelength plus a whole number', alt: ['(m + 0.5) lambda', 'half-integer wavelengths'], type: 'concept' },
    { q: 'What does double slit interference prove about light?', a: 'that light has wave properties', alt: ['light is a wave'], type: 'concept' },
  ]},
  'electromagnetic-spectrum': { questions: [
    { q: 'List the EM spectrum from lowest to highest frequency.', a: 'radio microwave infrared visible ultraviolet x-ray gamma', alt: ['radio micro ir vis uv xray gamma'], type: 'recall' },
    { q: 'What is the speed of all electromagnetic waves in vacuum?', a: '3 x 10^8 m/s', alt: ['speed of light', 'c', '300000000 m/s'], type: 'recall' },
    { q: 'Which EM wave has the highest energy?', a: 'gamma rays', alt: ['gamma'], type: 'recall' },
    { q: 'What is the visible light spectrum order?', a: 'red orange yellow green blue indigo violet', alt: ['roygbiv'], type: 'recall' },
    { q: 'Do electromagnetic waves need a medium?', a: 'no they can travel through vacuum', alt: ['no'], type: 'recall' },
    { q: 'What type of EM radiation do warm objects emit?', a: 'infrared', alt: ['ir', 'thermal radiation'], type: 'recall' },
  ]},
  'coulombs-law': { questions: [
    { q: 'State Coulomb\'s law.', a: 'f = kq1q2/r^2', alt: ['force between charges is proportional to product of charges divided by distance squared'], type: 'recall' },
    { q: 'What is the value of Coulomb\'s constant k?', a: '8.99 x 10^9 n m^2/c^2', alt: ['9 x 10^9', '8.99e9'], type: 'recall' },
    { q: 'Do like charges attract or repel?', a: 'repel', type: 'recall' },
    { q: 'What is the unit of electric charge?', a: 'coulomb', alt: ['c'], type: 'recall' },
    { q: 'If the distance between two charges triples, the force becomes what fraction?', a: '1/9', alt: ['one ninth'], type: 'concept' },
    { q: 'What is the charge of a proton?', a: '1.6 x 10^-19 c', alt: ['+e', '1.6e-19'], type: 'recall' },
  ]},
  'electric-field': { questions: [
    { q: 'What is an electric field?', a: 'the force per unit positive test charge at a point', alt: ['e = f/q'], type: 'concept' },
    { q: 'What is the unit of electric field?', a: 'n/c', alt: ['newtons per coulomb', 'v/m'], type: 'recall' },
    { q: 'In which direction do electric field lines point?', a: 'away from positive charges toward negative charges', alt: ['from positive to negative'], type: 'recall' },
    { q: 'What is the electric field due to a point charge?', a: 'e = kq/r^2', alt: ['kq over r squared'], type: 'recall' },
    { q: 'What does the density of field lines indicate?', a: 'the strength of the field', alt: ['stronger field has closer lines'], type: 'concept' },
    { q: 'What is the electric field inside a conductor at equilibrium?', a: 'zero', alt: ['0'], type: 'recall' },
  ]},
  'electric-potential': { questions: [
    { q: 'What is electric potential (voltage)?', a: 'electric potential energy per unit charge', alt: ['v = pe/q', 'energy per charge'], type: 'concept' },
    { q: 'What is the unit of electric potential?', a: 'volt', alt: ['v', 'volts', 'j/c'], type: 'recall' },
    { q: 'What is potential difference?', a: 'the difference in electric potential between two points', alt: ['voltage difference', 'delta v'], type: 'concept' },
    { q: 'What is the electric potential due to a point charge?', a: 'v = kq/r', alt: ['kq over r'], type: 'recall' },
    { q: 'What are equipotential lines?', a: 'lines connecting points of equal electric potential', alt: ['same voltage lines'], type: 'concept' },
    { q: 'How much work is done moving a charge along an equipotential line?', a: 'zero', alt: ['0', 'no work'], type: 'recall' },
  ]},
  'ohms-law': { questions: [
    { q: 'State Ohm\'s law.', a: 'v = ir', alt: ['voltage equals current times resistance'], type: 'recall' },
    { q: 'What is the unit of resistance?', a: 'ohm', alt: ['ohms', 'omega'], type: 'recall' },
    { q: 'What is the unit of current?', a: 'ampere', alt: ['amp', 'a', 'amps'], type: 'recall' },
    { q: 'If voltage is 12V and resistance is 4 ohms, what is the current?', a: '3 a', alt: ['3', '3 amps'], type: 'calculation' },
    { q: 'What is resistance?', a: 'opposition to the flow of current', alt: ['how much a material impedes current'], type: 'concept' },
    { q: 'What is a conductor?', a: 'a material that allows electric current to flow easily', alt: ['low resistance material'], type: 'concept' },
  ]},
  'series-circuits': { questions: [
    { q: 'How do you find total resistance in series?', a: 'add all resistances', alt: ['rt = r1 + r2 + ...', 'sum them'], type: 'recall' },
    { q: 'In a series circuit, is the current the same or different through each component?', a: 'same', alt: ['equal', 'identical'], type: 'recall' },
    { q: 'In a series circuit, how is voltage distributed?', a: 'divided among components proportional to resistance', alt: ['voltage drops add up to total'], type: 'concept' },
    { q: 'Three 10-ohm resistors in series have total resistance of?', a: '30 ohms', alt: ['30'], type: 'calculation' },
    { q: 'If one component in a series circuit fails, what happens?', a: 'the entire circuit stops', alt: ['no current flows', 'circuit breaks'], type: 'concept' },
    { q: 'What is Kirchhoff\'s voltage law?', a: 'the sum of voltage drops around a closed loop equals zero', alt: ['voltages sum to zero in a loop'], type: 'concept' },
  ]},
  'parallel-circuits': { questions: [
    { q: 'How do you find total resistance in parallel?', a: '1/rt = 1/r1 + 1/r2 + ...', alt: ['reciprocal sum'], type: 'recall' },
    { q: 'In a parallel circuit, is the voltage the same or different across each branch?', a: 'same', alt: ['equal voltage'], type: 'recall' },
    { q: 'In a parallel circuit, how is current distributed?', a: 'divided among branches inversely proportional to resistance', alt: ['total current splits among branches'], type: 'concept' },
    { q: 'Two 10-ohm resistors in parallel have total resistance of?', a: '5 ohms', alt: ['5'], type: 'calculation' },
    { q: 'What is Kirchhoff\'s current law?', a: 'total current entering a junction equals total current leaving', alt: ['current in = current out at a node'], type: 'concept' },
    { q: 'If one branch in a parallel circuit fails, what happens?', a: 'other branches continue to function', alt: ['rest keeps working'], type: 'concept' },
  ]},
  'power-dissipation': { questions: [
    { q: 'What is the formula for electrical power?', a: 'p = iv', alt: ['power = current times voltage'], type: 'recall' },
    { q: 'What are two other formulas for power using resistance?', a: 'p = i^2r and p = v^2/r', alt: ['i squared r and v squared over r'], type: 'recall' },
    { q: 'What is the unit of electrical power?', a: 'watt', alt: ['w', 'watts'], type: 'recall' },
    { q: 'A 100W lightbulb at 120V draws how much current?', a: '0.83 a', alt: ['0.83', 'about 0.83 amps'], type: 'calculation' },
    { q: 'What is a kilowatt-hour?', a: 'a unit of energy equal to using 1 kw for 1 hour', alt: ['energy unit for billing', '3.6 million joules'], type: 'concept' },
    { q: 'Which resistor in series dissipates the most power?', a: 'the largest resistor', alt: ['highest resistance'], type: 'concept' },
  ]},
  'magnetic-fields': { questions: [
    { q: 'What creates a magnetic field?', a: 'moving electric charges or current', alt: ['electric current', 'moving charges'], type: 'concept' },
    { q: 'What is the unit of magnetic field strength?', a: 'tesla', alt: ['t', 'teslas'], type: 'recall' },
    { q: 'What is the shape of magnetic field lines around a bar magnet?', a: 'they form closed loops from north to south pole outside the magnet', alt: ['loops from n to s'], type: 'recall' },
    { q: 'What is the right-hand rule for a current-carrying wire?', a: 'thumb points in current direction fingers curl in direction of magnetic field', alt: ['thumb = current, fingers = b field'], type: 'concept' },
    { q: 'Do magnetic field lines start and end?', a: 'no they form continuous loops', alt: ['no they are closed loops'], type: 'concept' },
    { q: 'What is a solenoid?', a: 'a coil of wire that produces a uniform magnetic field inside', alt: ['coil of wire acting as electromagnet'], type: 'concept' },
  ]},
  'force-on-moving-charge': { questions: [
    { q: 'What is the formula for the magnetic force on a moving charge?', a: 'f = qvb sin theta', alt: ['f = qvb sinθ'], type: 'recall' },
    { q: 'What is the direction of force on a positive charge moving through a magnetic field?', a: 'perpendicular to both velocity and field direction', alt: ['use right hand rule'], type: 'concept' },
    { q: 'What is the force on a charge moving parallel to the magnetic field?', a: 'zero', alt: ['0'], type: 'recall' },
    { q: 'What path does a charged particle follow in a uniform magnetic field?', a: 'circular', alt: ['circle', 'circular path'], type: 'recall' },
    { q: 'Does the magnetic force do work on a moving charge?', a: 'no because force is always perpendicular to velocity', alt: ['no'], type: 'concept' },
    { q: 'What does the magnetic force change about a charged particle\'s motion?', a: 'direction only not speed', alt: ['only direction'], type: 'concept' },
  ]},
  'force-on-current': { questions: [
    { q: 'What is the formula for force on a current-carrying wire in a magnetic field?', a: 'f = bil sin theta', alt: ['f = ilb sinθ'], type: 'recall' },
    { q: 'What is the direction of force on a current-carrying wire in a magnetic field?', a: 'determined by the right hand rule perpendicular to both current and field', alt: ['use right hand rule'], type: 'concept' },
    { q: 'When is the force maximum on a current-carrying wire?', a: 'when the wire is perpendicular to the field', alt: ['theta = 90 degrees'], type: 'recall' },
    { q: 'When is the force zero on a current-carrying wire?', a: 'when the wire is parallel to the field', alt: ['theta = 0'], type: 'recall' },
    { q: 'What is the principle behind an electric motor?', a: 'force on current-carrying coil in a magnetic field causes rotation', alt: ['magnetic force on current loop'], type: 'concept' },
    { q: 'Do parallel wires carrying current in the same direction attract or repel?', a: 'attract', type: 'recall' },
  ]},
  'faradays-law': { questions: [
    { q: 'What does Faraday\'s law state?', a: 'a changing magnetic flux induces an emf', alt: ['changing flux produces voltage'], type: 'concept' },
    { q: 'What is magnetic flux?', a: 'the product of magnetic field and area perpendicular to it', alt: ['phi = ba cos theta', 'b times a'], type: 'concept' },
    { q: 'What are three ways to change magnetic flux?', a: 'change field strength change area change angle', alt: ['change b a or theta'], type: 'recall' },
    { q: 'What is induced emf?', a: 'a voltage produced by changing magnetic flux', alt: ['voltage from changing flux'], type: 'concept' },
    { q: 'How does increasing the number of loops in a coil affect induced emf?', a: 'increases it proportionally', alt: ['more loops = more emf'], type: 'concept' },
    { q: 'What is the unit of magnetic flux?', a: 'weber', alt: ['wb'], type: 'recall' },
  ]},
  'lenzs-law': { questions: [
    { q: 'What does Lenz\'s law state?', a: 'the induced current flows in a direction to oppose the change in flux that caused it', alt: ['induced current opposes change'], type: 'concept' },
    { q: 'Lenz\'s law is a consequence of what conservation law?', a: 'conservation of energy', type: 'recall' },
    { q: 'If flux through a loop is increasing, what does the induced current do?', a: 'creates a magnetic field opposing the increase', alt: ['opposes the change'], type: 'concept' },
    { q: 'If a magnet north pole approaches a loop, what pole does the loop face toward the magnet?', a: 'north', alt: ['north pole to repel'], type: 'concept' },
    { q: 'Why must the induced current oppose the change?', a: 'otherwise energy would be created from nothing violating conservation', alt: ['energy conservation'], type: 'concept' },
    { q: 'How do you determine the direction of induced current?', a: 'use lenzs law then right hand rule', alt: ['oppose the change then use right hand rule'], type: 'concept' },
  ]},
  'electromagnetic-induction': { questions: [
    { q: 'What is electromagnetic induction?', a: 'the production of emf by changing magnetic flux', alt: ['generating voltage from changing magnetic field'], type: 'concept' },
    { q: 'Who discovered electromagnetic induction?', a: 'michael faraday', alt: ['faraday'], type: 'recall' },
    { q: 'What device uses electromagnetic induction to change voltage?', a: 'transformer', type: 'recall' },
    { q: 'How does an electric generator work?', a: 'a coil rotates in a magnetic field producing changing flux and emf', alt: ['rotating coil in b field'], type: 'concept' },
    { q: 'What is motional emf?', a: 'emf induced when a conductor moves through a magnetic field', alt: ['voltage from moving wire in field'], type: 'concept' },
    { q: 'What is the transformer equation?', a: 'v1/v2 = n1/n2', alt: ['voltage ratio equals turns ratio'], type: 'recall' },
  ]},
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

// Exercise generation
function generateExercise(skill, count = 5) { const bank = CONTENT_BANKS[skill]; if (!bank || !bank.questions) return { error: `No content bank for skill: ${skill}` }; const items = pick(bank.questions, count).map(q => ({ prompt: q.q, answer: q.a, type: q.type, ...(q.alt ? { acceptedAnswers: [q.a, ...q.alt] } : {}) })); return { skill, count: items.length, items }; }

// Public API
class Physics {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, level: p.level, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }
  setLevel(id, level) { const valid = ['standard', 'ap']; if (!valid.includes(level)) throw new Error(`Unknown level: ${level}. Valid: ${valid.join(', ')}`); const p = loadProfile(id); p.level = level; saveProfile(p); return { studentId: id, level }; }
  recordAssessment(id, skill, score, total, notes = '') { if (!CONTENT_BANKS[skill]) throw new Error(`Unknown skill: ${skill}`); if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive'); if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`); const p = loadProfile(id); const entry = { date: new Date().toISOString(), skill, score, total, notes }; p.assessments.push(entry); if (!p.skills[skill]) p.skills[skill] = { attempts: [] }; p.skills[skill].attempts.push({ date: entry.date, score, total }); p.skills[skill].mastery = calcMastery(p.skills[skill].attempts); p.skills[skill].label = masteryLabel(p.skills[skill].mastery); saveProfile(p); return { studentId: id, skill, score: `${score}/${total}`, mastery: p.skills[skill].mastery, label: p.skills[skill].label }; }
  getProgress(id) { const p = loadProfile(id); const results = {}; let mastered = 0, total = 0; for (const [cat, skills] of Object.entries(SKILLS)) { results[cat] = {}; for (const sk of skills) { total++; const d = p.skills[sk]; results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' }; if (d && d.mastery >= MASTERY_THRESHOLD) mastered++; } } return { studentId: id, level: p.level, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results }; }
  getNextSkills(id, count = 5) { const p = loadProfile(id); const candidates = []; for (const [cat, skills] of Object.entries(SKILLS)) { for (const sk of skills) { const d = p.skills[sk]; const m = d ? d.mastery : 0; if (m < MASTERY_THRESHOLD) candidates.push({ category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' }); } } const order = { developing: 0, emerging: 1, 'not-started': 2 }; candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery); return { studentId: id, next: candidates.slice(0, count) }; }
  getReport(id) { const p = loadProfile(id); return { studentId: id, level: p.level, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }
  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }
  getSkillCatalog() { const catalog = {}; let total = 0; for (const [cat, skills] of Object.entries(SKILLS)) { total += skills.length; catalog[cat] = [...skills]; } return { skills: catalog, totalSkills: total }; }
  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  generateLesson(id) {
    const p = loadProfile(id);
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills are proficient!', level: p.level };
    const exercise = generateExercise(target.skill, 5);
    return {
      studentId: id, level: p.level, targetSkill: target, exercise,
      lessonPlan: {
        review: 'Review previously learned concepts (2-3 min)',
        teach: `Introduce/reinforce: ${target.category} → ${target.skill}`,
        practice: `Complete ${exercise.count || 0} practice items`,
        apply: `Connect ${target.skill} to real-world physics applications`,
      },
    };
  }

  checkAnswer(type, expected, answer) { let exp = expected; try { exp = JSON.parse(expected); } catch {} if (Array.isArray(exp)) return { correct: exp.some(r => norm(r) === norm(answer)), expected: exp, studentAnswer: answer }; return { correct: norm(exp) === norm(answer), expected: exp, studentAnswer: answer }; }
}

module.exports = Physics;

if (require.main === module) {
  const args = process.argv.slice(2); const cmd = args[0]; const api = new Physics(); const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id, level] = args; if (!id) throw new Error('Usage: start <id> [level]'); if (level) api.setLevel(id, level); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); if (skill) { out(api.generateExercise(skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, skill, sc, tot, ...notes] = args; if (!id || !skill || !sc || !tot) throw new Error('Usage: record <id> <skill> <score> <total>'); out(api.recordAssessment(id, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node physics.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
