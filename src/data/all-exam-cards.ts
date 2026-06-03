/**
 * UNIFIED EXAM CARDS DATABASE
 * Combines all exam questions from all sources
 * Topics are organized for efficient loading and pagination
 */

export interface ExamCard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

// All exam cards organized by topic for better performance
export const ALL_EXAM_CARDS: ExamCard[] = [
  // Industrial Automation Fundamentals
  {
    id: 'iaf-001',
    topic: 'Industrial Automation Fundamentals',
    question: 'What is Industrial Automation?',
    answer: 'Industrial automation is the use of various control systems including computers, robots, and specialized controllers to operate processes and machinery in manufacturing and industrial applications. This approach replaces human intervention with automated systems for improved precision, efficiency, and safety.',
    difficulty: 'easy'
  },
  {
    id: 'iaf-002',
    topic: 'Industrial Automation Fundamentals',
    question: 'List the main benefits of Industrial Automation',
    answer: '1. Minimization of Human Error: Automated systems perform repetitive tasks with high precision. 2. Reduced Production Costs: Automation lowers labor costs and increases production speed. 3. Efficient Inventory Management: Real-time tracking and automatic replenishment. 4. Real-Time Monitoring: Continuous data acquisition enables early fault detection. 5. Enhanced Quality: Standardized processes lead to uniform product quality. 6. Improved Safety: Reduces human involvement in hazardous tasks.',
    difficulty: 'medium'
  },
  {
    id: 'iaf-003',
    topic: 'Industrial Automation Fundamentals',
    question: 'Define Programmable Logic Controller (PLC)',
    answer: 'A PLC is a rugged, industrial computer specifically designed to control manufacturing processes and machinery. It uses ladder logic or other programming languages to process inputs from sensors and produce outputs to actuators. PLCs are noted for their reliability, ease of troubleshooting, and modular design.',
    difficulty: 'easy'
  },
  {
    id: 'iaf-004',
    topic: 'Industrial Automation Fundamentals',
    question: 'Define SCADA System',
    answer: 'Supervisory Control and Data Acquisition (SCADA) is a system that provides real-time data collection and control from remote geographical locations. It integrates sensor data, process control, and historical data logging with graphical interfaces for operators to manage industrial processes across wide areas.',
    difficulty: 'medium'
  },
  {
    id: 'iaf-005',
    topic: 'Industrial Automation Fundamentals',
    question: 'Explain Distributed Control System (DCS)',
    answer: 'A DCS uses a network of controllers distributed throughout an industrial plant, with each handling a segment of the process. This decentralization increases reliability and allows for more sophisticated control strategies in large-scale continuous processes such as chemical refining.',
    difficulty: 'medium'
  },
  {
    id: 'iaf-006',
    topic: 'Industrial Automation Fundamentals',
    question: 'What is Direct Digital Control (DDC)?',
    answer: 'DDC involves digital processors executing control algorithms directly on real-time process data. Commonly used in building management systems, DDC allows for precise computer-based control of heaters, air conditioning, and lighting without intermediate analog controllers.',
    difficulty: 'medium'
  },
  {
    id: 'iaf-007',
    topic: 'Industrial Automation Fundamentals',
    question: 'Define Human-Machine Interface (HMI)',
    answer: 'An HMI provides a graphical dashboard for operators to monitor system performance, view alarms, and input commands. It is the critical link between the human operator and automated equipment, typically using touchscreen panels that display data trends and system status.',
    difficulty: 'easy'
  },
  {
    id: 'iaf-008',
    topic: 'Industrial Automation Fundamentals',
    question: 'What is a PID Controller and its purpose?',
    answer: 'The PID (Proportional Integral Derivative) controller is a control loop feedback mechanism widely used in industrial control systems. It continuously calculates error between a desired setpoint and measured variable, applying corrective control through proportional, integral, and derivative adjustments.',
    difficulty: 'hard'
  },

  // Control Systems Fundamentals
  {
    id: 'csf-001',
    topic: 'Control Systems Fundamentals',
    question: 'What is Direct Digital Control (DDC)?',
    answer: 'A control system where a digital computer or microcontroller directly adjusts the control variables (e.g., valve position, motor speed) based on sensor feedback, without intermediate analog devices.',
    difficulty: 'easy'
  },
  {
    id: 'csf-002',
    topic: 'Control Systems Fundamentals',
    question: 'Explain the three main input signals in a control system.',
    answer: '1) Setpoint (reference input) - desired value of controlled variable. 2) Feedback signal - measured actual value from sensor. 3) Disturbance input - unwanted external influence affecting system output.',
    difficulty: 'medium'
  },
  {
    id: 'csf-003',
    topic: 'Control Systems Fundamentals',
    question: 'What is a Programmable Logic Controller (PLC)?',
    answer: 'A ruggedized industrial digital computer designed for real-time control of manufacturing processes, assembly lines, and robotic devices using ladder logic or other programming languages.',
    difficulty: 'easy'
  },
  {
    id: 'csf-004',
    topic: 'Control Systems Fundamentals',
    question: 'Define SCADA.',
    answer: 'Supervisory Control and Data Acquisition - a high-level system for monitoring and controlling industrial processes across large geographical areas, collecting real-time data from remote sensors.',
    difficulty: 'easy'
  },
  {
    id: 'csf-005',
    topic: 'Control Systems Fundamentals',
    question: 'What is a Distributed Control System (DCS)?',
    answer: 'A control system where control elements are distributed throughout a plant rather than centralized, with local controllers communicating over a network for process automation.',
    difficulty: 'medium'
  },

  // Sensors & Transducers
  {
    id: 'sdt-001',
    topic: 'Sensors & Transducers',
    question: 'What is the difference between a transducer and a sensor?',
    answer: 'A transducer converts one form of energy to another. A sensor detects a physical property and converts it to an electrical signal. All sensors are transducers, but not all transducers are sensors.',
    difficulty: 'medium'
  },
  {
    id: 'sdt-002',
    topic: 'Sensors & Transducers',
    question: 'Describe a potentiometer sensor.',
    answer: 'Measures angular or linear position by changing resistance. Simple and low-cost but subject to wear. Commonly used in joint angle measurement for robotic systems.',
    difficulty: 'easy'
  },
  {
    id: 'sdt-003',
    topic: 'Sensors & Transducers',
    question: 'How does an optical encoder work?',
    answer: 'Provides digital position feedback using a rotating disk with slots and a light source/detector. Can be incremental (relative) or absolute. Used for precise motor shaft position feedback.',
    difficulty: 'medium'
  },
  {
    id: 'sdt-004',
    topic: 'Sensors & Transducers',
    question: 'What is an ultrasonic sensor and its applications?',
    answer: 'Emits sound waves and measures time-of-flight for echoes to determine distance to objects. Commonly used for obstacle avoidance and navigation in robotic systems.',
    difficulty: 'easy'
  },
  {
    id: 'sdt-005',
    topic: 'Sensors & Transducers',
    question: 'Explain an Inertial Measurement Unit (IMU).',
    answer: 'Combines accelerometers and gyroscopes (and sometimes magnetometers) to measure orientation, angular velocity, and linear acceleration. Essential for balance in mobile robots.',
    difficulty: 'medium'
  },

  // Robotics
  {
    id: 'rbt-001',
    topic: 'Robotics',
    question: 'List the basic components of a robot.',
    answer: '1) Manipulator (arm) - mechanical structure with links and joints. 2) End effector (gripper/tool) - interacts with environment. 3) Actuators - provide movement. 4) Sensors - feedback devices. 5) Controller - brain of robot. 6) Power supply.',
    difficulty: 'easy'
  },
  {
    id: 'rbt-002',
    topic: 'Robotics',
    question: 'What is the role of an end-effector in a robot?',
    answer: 'The end-effector is the device attached to the wrist of the manipulator that physically interacts with the environment. Examples include grippers, welding torches, paint sprayers, or cutting tools.',
    difficulty: 'easy'
  },
  {
    id: 'rbt-003',
    topic: 'Robotics',
    question: 'Describe vision sensors (cameras) in robotics.',
    answer: 'Capture digital images for object recognition, tracking, quality inspection, and visual servoing. Algorithms process pixels to detect objects, colors, and distances. Provide rich environmental data.',
    difficulty: 'medium'
  },
  {
    id: 'rbt-004',
    topic: 'Robotics',
    question: 'What is a force/torque sensor used for in robotics?',
    answer: 'Measures forces and moments applied to the robot\'s wrist or end effector using strain gauges. Essential for assembly, grinding, polishing, and delicate handling tasks.',
    difficulty: 'medium'
  },
  {
    id: 'rbt-005',
    topic: 'Robotics',
    question: 'Explain proximity sensors in robotic applications.',
    answer: 'Inductive sensors detect metallic objects via magnetic field. Capacitive sensors detect conductive/dielectric objects via electric field. Used for end-stop detection, part presence, and collision avoidance.',
    difficulty: 'medium'
  },

  // Bode Plots & Stability
  {
    id: 'bps-001',
    topic: 'Bode Plots & Stability',
    question: 'What is a Bode plot?',
    answer: 'A graphical representation of a transfer function consisting of two plots: magnitude (in dB) vs. log frequency and phase (in degrees) vs. log frequency. Used for frequency response analysis.',
    difficulty: 'medium'
  },
  {
    id: 'bps-002',
    topic: 'Bode Plots & Stability',
    question: 'Define gain margin.',
    answer: 'Gain margin is the amount of gain increase (in dB) required to make the system unstable. Found at the phase crossover frequency where phase equals -180 degrees.',
    difficulty: 'medium'
  },
  {
    id: 'bps-003',
    topic: 'Bode Plots & Stability',
    question: 'Define phase margin.',
    answer: 'Phase margin is the difference between the actual phase and -180 degrees at the gain crossover frequency where magnitude equals 1 (0 dB). Higher phase margin indicates more stable system.',
    difficulty: 'medium'
  },
  {
    id: 'bps-004',
    topic: 'Bode Plots & Stability',
    question: 'How do you identify corner frequencies on a Bode plot?',
    answer: 'Corner frequencies occur at pole and zero locations. On the magnitude plot, asymptotic slope changes by 20 dB/decade at each corner frequency. Identified from the poles/zeros of the transfer function.',
    difficulty: 'hard'
  },

  // Laplace Transforms
  {
    id: 'lpt-001',
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of a unit step function?',
    answer: 'L{u(t)} = 1/s, where u(t) is the unit step function. This fundamental transform is used in solving differential equations in control systems.',
    difficulty: 'easy'
  },
  {
    id: 'lpt-002',
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of a ramp function?',
    answer: 'L{t} = 1/s^2, where t is the ramp function. Used for finding transient responses in control systems.',
    difficulty: 'easy'
  },
  {
    id: 'lpt-003',
    topic: 'Laplace Transforms',
    question: 'How do you apply the derivative property in Laplace transforms?',
    answer: 'L{f\'(t)} = sF(s) - f(0), where F(s) is the Laplace transform of f(t). The second derivative is: L{f\'\'(t)} = s^2F(s) - sf(0) - f\'(0).',
    difficulty: 'medium'
  },
  {
    id: 'lpt-004',
    topic: 'Laplace Transforms',
    question: 'What is partial fraction decomposition used for?',
    answer: 'Partial fractions break complex rational functions into simpler fractions that have known inverse Laplace transforms, allowing conversion from Laplace domain back to time domain.',
    difficulty: 'hard'
  },
  {
    id: 'lpt-005',
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of an exponential function e^(-at)?',
    answer: 'L{e^(-at)} = 1/(s+a). This is essential for solving differential equations with exponential terms.',
    difficulty: 'easy'
  },

  // Pneumatic Control
  {
    id: 'pnc-001',
    topic: 'Pneumatic Control',
    question: 'What is a pneumatic volume booster?',
    answer: 'Also called a relay or amplifier, it increases the flow capacity of a pneumatic control system, providing higher volume of air to large actuators without sacrificing response speed.',
    difficulty: 'medium'
  },
  {
    id: 'pnc-002',
    topic: 'Pneumatic Control',
    question: 'How does a pneumatic control valve work?',
    answer: 'A control valve modulates the flow of compressed air in response to a control signal. Spool movement controls ports, directing pressurized air to actuators or exhausting to atmosphere.',
    difficulty: 'medium'
  },
  {
    id: 'pnc-003',
    topic: 'Pneumatic Control',
    question: 'What are common applications of pneumatic systems?',
    answer: 'Used in manufacturing (assembly lines), automation, robotics, and tools where speed and reliability are important. Advantages: safe, clean, inexpensive. Disadvantages: lower power density, need for compressor.',
    difficulty: 'easy'
  },

  // Control Techniques
  {
    id: 'ctl-001',
    topic: 'Control Techniques',
    question: 'What is Pulse Width Modulation (PWM)?',
    answer: 'A technique for controlling analog circuits by varying the duty cycle of a digital square wave. Adjusts average voltage/power to a load. Used in motor speed control and LED brightness.',
    difficulty: 'easy'
  },
  {
    id: 'ctl-002',
    topic: 'Control Techniques',
    question: 'How does PWM duty cycle affect output power?',
    answer: 'Output power is proportional to duty cycle. A 50% duty cycle delivers 50% of maximum power. A 75% duty cycle delivers 75% of maximum power. Used for smooth analog control.',
    difficulty: 'medium'
  },

  // Communication & Protocols
  {
    id: 'com-001',
    topic: 'Communication & Protocols',
    question: 'What is Modbus protocol?',
    answer: 'A master-slave communication protocol used in industrial control. Allows communication between different devices on an industrial network. Supports both serial (RTU/ASCII) and TCP/IP variants.',
    difficulty: 'medium'
  },
  {
    id: 'com-002',
    topic: 'Communication & Protocols',
    question: 'What is Profibus?',
    answer: 'A process fieldbus standard for real-time distributed control. Used for decentralized automation and modular plant expansions. Higher speed than Modbus.',
    difficulty: 'medium'
  },

  // System Stability
  {
    id: 'sys-001',
    topic: 'System Stability',
    question: 'What is the Nyquist stability criterion?',
    answer: 'States that a closed-loop system is stable if the number of counter-clockwise encirclements of the critical point (-1, 0) by the Nyquist plot equals the number of open-loop poles in the right half-plane.',
    difficulty: 'hard'
  },
  {
    id: 'sys-002',
    topic: 'System Stability',
    question: 'How do you determine stability from a characteristic equation?',
    answer: 'A system is stable if all roots of the characteristic equation are in the left half of the s-plane (negative real parts). If any root has positive real part, system is unstable.',
    difficulty: 'hard'
  },

  // Actuators
  {
    id: 'act-001',
    topic: 'Actuators',
    question: 'What is an actuator?',
    answer: 'A device that converts a control signal into physical action (linear or rotary motion). Examples: electric motors, solenoids, pneumatic cylinders, hydraulic cylinders.',
    difficulty: 'easy'
  },
  {
    id: 'act-002',
    topic: 'Actuators',
    question: 'What types of motors are used in robots?',
    answer: 'DC servo motors for precise position control, stepper motors for discrete positioning, AC induction motors for high power applications. Selection depends on control requirements and application.',
    difficulty: 'medium'
  },

  // Distributed Control Systems
  {
    id: 'dcs-001',
    topic: 'Distributed Control Systems',
    question: 'What are the main components of a DCS?',
    answer: 'Field instruments (sensors/transmitters), control modules, operator workstations, communication network, and application software. Each level performs specific control functions.',
    difficulty: 'medium'
  },
  {
    id: 'dcs-002',
    topic: 'Distributed Control Systems',
    question: 'What are advantages of DCS over centralized control?',
    answer: 'Higher reliability (failure doesn\'t shut down entire system), easier maintenance, better scalability, reduced wiring, faster response times, and modular expansion capability.',
    difficulty: 'medium'
  },

  // Microcontrollers & Digital Systems
  {
    id: 'mcu-001',
    topic: 'Microcontrollers & Digital Systems',
    question: 'What is a microcontroller?',
    answer: 'A small computer on a single integrated circuit containing a processor, memory, and programmable I/O. Used for embedded control applications in robots, vehicles, and industrial equipment.',
    difficulty: 'easy'
  },
  {
    id: 'mcu-002',
    topic: 'Microcontrollers & Digital Systems',
    question: 'Compare hardware and software in control systems.',
    answer: 'Hardware: physical components (processors, sensors, actuators) that perform control functions. Software: programs and logic that determine how hardware operates. Both essential for system functionality.',
    difficulty: 'easy'
  },

  // System Response Characteristics
  {
    id: 'src-001',
    topic: 'System Response Characteristics',
    question: 'What is peak time in second-order systems?',
    answer: 'Tp = π/ωd, where ωd is the damped natural frequency. Represents the time when the system response reaches its maximum value after a step input.',
    difficulty: 'hard'
  },
  {
    id: 'src-002',
    topic: 'System Response Characteristics',
    question: 'What is settling time?',
    answer: 'Ts = 4/(ζωn) for 2% criterion, where ζ is damping ratio and ωn is natural frequency. Time required for response to reach and stay within 2% of final steady-state value.',
    difficulty: 'hard'
  },
  {
    id: 'src-003',
    topic: 'System Response Characteristics',
    question: 'What is maximum overshoot?',
    answer: 'Mp = e^(-πζ/√(1-ζ²)) × 100%, where ζ is damping ratio. Indicates how much the response overshoots the steady-state value after step input.',
    difficulty: 'hard'
  },

  // Advanced Control Strategies
  {
    id: 'acs-001',
    topic: 'Advanced Control Strategies',
    question: 'What is cascade control?',
    answer: 'A control strategy where the output of one controller (master/primary) serves as the setpoint for another controller (slave/secondary). Improves dynamic response and rejects disturbances.',
    difficulty: 'medium'
  },
  {
    id: 'acs-002',
    topic: 'Advanced Control Strategies',
    question: 'What is ratio control?',
    answer: 'A control strategy that maintains the ratio of two process variables at a specified value. One stream is the wild stream, the other controlled to maintain desired ratio.',
    difficulty: 'medium'
  },

  // Signal Processing
  {
    id: 'sig-001',
    topic: 'Signal Processing',
    question: 'What is signal modulation?',
    answer: 'The process of varying a carrier signal\'s properties (amplitude, frequency, or phase) with another signal. Used for encoding information and transmission over communication channels.',
    difficulty: 'medium'
  },
  {
    id: 'sig-002',
    topic: 'Signal Processing',
    question: 'What is a modem?',
    answer: 'Modulator-Demodulator - converts digital data from computer into analog signals for transmission over communication lines and demodulates incoming analog signals back to digital.',
    difficulty: 'easy'
  },
];

// Utility function to get cards by topic
export function getCardsByTopic(topic: string): ExamCard[] {
  return ALL_EXAM_CARDS.filter(card => card.topic === topic);
}

// Utility function to get unique topics
export function getUniqueTopics(): string[] {
  const topics = new Set(ALL_EXAM_CARDS.map(card => card.topic));
  return Array.from(topics).sort();
}

// Utility function to get cards with pagination
export function getCardsPaginated(page: number = 1, pageSize: number = 20): { cards: ExamCard[]; total: number; pages: number } {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const cards = ALL_EXAM_CARDS.slice(start, end);
  const total = ALL_EXAM_CARDS.length;
  const pages = Math.ceil(total / pageSize);
  return { cards, total, pages };
}

// Utility function to search cards
export function searchCards(query: string): ExamCard[] {
  const lowerQuery = query.toLowerCase();
  return ALL_EXAM_CARDS.filter(
    card =>
      card.question.toLowerCase().includes(lowerQuery) ||
      card.answer.toLowerCase().includes(lowerQuery) ||
      card.topic.toLowerCase().includes(lowerQuery)
  );
}

export default ALL_EXAM_CARDS;
