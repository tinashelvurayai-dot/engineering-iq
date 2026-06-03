// Comprehensive Q&A cards for Analogue Electronics based on exam content
export const qaCardsData = [
  // Control Systems & Automation
  {
    topic: 'Control Systems Fundamentals',
    question: 'What is Direct Digital Control (DDC)?',
    answer: 'A control system where a digital computer or microcontroller directly adjusts control variables (e.g., valve position, motor speed) based on sensor feedback, without intermediate analog devices.',
    difficulty: 'easy',
    tags: ['definitions', 'control'],
  },
  {
    topic: 'Control Systems Fundamentals',
    question: 'Explain the three main input signals in a control system.',
    answer: '1) Setpoint (reference input) - desired value of controlled variable. 2) Feedback signal - measured actual value from sensor. 3) Disturbance input - unwanted external influence affecting system output.',
    difficulty: 'medium',
    tags: ['definitions', 'control'],
  },
  {
    topic: 'Control Systems Fundamentals',
    question: 'What is a Programmable Logic Controller (PLC)?',
    answer: 'A ruggedized industrial digital computer designed for real-time control of manufacturing processes, assembly lines, and robotic devices using ladder logic or other programming languages.',
    difficulty: 'easy',
    tags: ['definitions', 'control'],
  },
  {
    topic: 'Control Systems Fundamentals',
    question: 'Define SCADA.',
    answer: 'Supervisory Control and Data Acquisition - a high-level system for monitoring and controlling industrial processes across large geographical areas, collecting real-time data from remote sensors.',
    difficulty: 'easy',
    tags: ['definitions', 'control'],
  },
  {
    topic: 'Control Systems Fundamentals',
    question: 'What is a Distributed Control System (DCS)?',
    answer: 'A control system where control elements are distributed throughout a plant rather than centralized, with local controllers communicating over a network for process automation.',
    difficulty: 'medium',
    tags: ['definitions', 'control'],
  },

  // Transducers & Sensors
  {
    topic: 'Sensors & Transducers',
    question: 'What is the difference between a transducer and a sensor?',
    answer: 'A transducer converts one form of energy to another. A sensor detects a physical property and converts it to an electrical signal. All sensors are transducers, but not all transducers are sensors.',
    difficulty: 'medium',
    tags: ['definitions', 'sensors'],
  },
  {
    topic: 'Sensors & Transducers',
    question: 'Describe a potentiometer sensor.',
    answer: 'Measures angular or linear position by changing resistance. Simple and low-cost but subject to wear. Commonly used in joint angle measurement for robotic systems.',
    difficulty: 'easy',
    tags: ['sensors', 'robotics'],
  },
  {
    topic: 'Sensors & Transducers',
    question: 'How does an optical encoder work?',
    answer: 'Provides digital position feedback using a rotating disk with slots and a light source/detector. Can be incremental (relative) or absolute. Used for precise motor shaft position feedback.',
    difficulty: 'medium',
    tags: ['sensors', 'robotics'],
  },
  {
    topic: 'Sensors & Transducers',
    question: 'What is an ultrasonic sensor and its applications?',
    answer: 'Emits sound waves and measures time-of-flight for echoes to determine distance to objects. Commonly used for obstacle avoidance and navigation in robotic systems.',
    difficulty: 'easy',
    tags: ['sensors', 'robotics'],
  },
  {
    topic: 'Sensors & Transducers',
    question: 'Explain an Inertial Measurement Unit (IMU).',
    answer: 'Combines accelerometers and gyroscopes (and sometimes magnetometers) to measure orientation, angular velocity, and linear acceleration. Essential for balance in mobile robots.',
    difficulty: 'medium',
    tags: ['sensors', 'robotics'],
  },

  // Robotics
  {
    topic: 'Robotics',
    question: 'List the basic components of a robot.',
    answer: '1) Manipulator (arm) - mechanical structure with links and joints. 2) End effector (gripper/tool) - interacts with environment. 3) Actuators - provide movement. 4) Sensors - feedback devices. 5) Controller - brain of robot. 6) Power supply.',
    difficulty: 'easy',
    tags: ['robotics', 'definitions'],
  },
  {
    topic: 'Robotics',
    question: 'What is the role of an end-effector in a robot?',
    answer: 'The end-effector is the device attached to the wrist of the manipulator that physically interacts with the environment. Examples include grippers, welding torches, paint sprayers, or cutting tools.',
    difficulty: 'easy',
    tags: ['robotics'],
  },
  {
    topic: 'Robotics',
    question: 'Describe vision sensors (cameras) in robotics.',
    answer: 'Capture digital images for object recognition, tracking, quality inspection, and visual servoing. Algorithms process pixels to detect objects, colors, and distances. Provide rich environmental data.',
    difficulty: 'medium',
    tags: ['sensors', 'robotics'],
  },
  {
    topic: 'Robotics',
    question: 'What is a force/torque sensor used for in robotics?',
    answer: 'Measures forces and moments applied to the robot\'s wrist or end effector using strain gauges. Essential for assembly, grinding, polishing, and delicate handling tasks.',
    difficulty: 'medium',
    tags: ['sensors', 'robotics'],
  },
  {
    topic: 'Robotics',
    question: 'Explain proximity sensors in robotic applications.',
    answer: 'Inductive sensors detect metallic objects via magnetic field. Capacitive sensors detect conductive/dielectric objects via electric field. Used for end-stop detection, part presence, and collision avoidance.',
    difficulty: 'medium',
    tags: ['sensors', 'robotics'],
  },

  // Control Theory - Bode Plots
  {
    topic: 'Bode Plots & Stability',
    question: 'What is a Bode plot?',
    answer: 'A graphical representation of a transfer function consisting of two plots: magnitude (in dB) vs. log frequency and phase (in degrees) vs. log frequency. Used for frequency response analysis.',
    difficulty: 'medium',
    tags: ['control', 'bode'],
  },
  {
    topic: 'Bode Plots & Stability',
    question: 'Define gain margin.',
    answer: 'Gain margin is the amount of gain increase (in dB) required to make the system unstable. Found at the phase crossover frequency where phase equals -180 degrees.',
    difficulty: 'medium',
    tags: ['control', 'bode', 'stability'],
  },
  {
    topic: 'Bode Plots & Stability',
    question: 'Define phase margin.',
    answer: 'Phase margin is the difference between the actual phase and -180 degrees at the gain crossover frequency where magnitude equals 1 (0 dB). Higher phase margin indicates more stable system.',
    difficulty: 'medium',
    tags: ['control', 'bode', 'stability'],
  },
  {
    topic: 'Bode Plots & Stability',
    question: 'How do you identify corner frequencies on a Bode plot?',
    answer: 'Corner frequencies occur at pole and zero locations. On the magnitude plot, asymptotic slope changes by 20 dB/decade at each corner frequency. Identified from the poles/zeros of the transfer function.',
    difficulty: 'hard',
    tags: ['control', 'bode'],
  },

  // Laplace Transforms
  {
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of a unit step function?',
    answer: 'L{u(t)} = 1/s, where u(t) is the unit step function. This fundamental transform is used in solving differential equations in control systems.',
    difficulty: 'easy',
    tags: ['laplace', 'math'],
  },
  {
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of a ramp function?',
    answer: 'L{t} = 1/s^2, where t is the ramp function. Used for finding transient responses in control systems.',
    difficulty: 'easy',
    tags: ['laplace', 'math'],
  },
  {
    topic: 'Laplace Transforms',
    question: 'How do you apply the derivative property in Laplace transforms?',
    answer: 'L{f\'(t)} = sF(s) - f(0), where F(s) is the Laplace transform of f(t). The second derivative is: L{f\'\'(t)} = s^2F(s) - sf(0) - f\'(0).',
    difficulty: 'medium',
    tags: ['laplace', 'math'],
  },
  {
    topic: 'Laplace Transforms',
    question: 'What is partial fraction decomposition used for?',
    answer: 'Partial fractions break complex rational functions into simpler fractions that have known inverse Laplace transforms, allowing conversion from Laplace domain back to time domain.',
    difficulty: 'hard',
    tags: ['laplace', 'math'],
  },
  {
    topic: 'Laplace Transforms',
    question: 'What is the Laplace transform of an exponential function e^(-at)?',
    answer: 'L{e^(-at)} = 1/(s+a). This is essential for solving differential equations with exponential terms.',
    difficulty: 'easy',
    tags: ['laplace', 'math'],
  },

  // Pneumatic Systems
  {
    topic: 'Pneumatic Control',
    question: 'What is a pneumatic volume booster?',
    answer: 'Also called a relay or amplifier, it increases the flow capacity of a pneumatic control system, providing higher volume of air to large actuators without sacrificing response speed.',
    difficulty: 'medium',
    tags: ['pneumatic', 'control'],
  },
  {
    topic: 'Pneumatic Control',
    question: 'How does a pneumatic control valve work?',
    answer: 'A control valve modulates the flow of compressed air in response to a control signal. Spool movement controls ports, directing pressurized air to actuators or exhausting to atmosphere.',
    difficulty: 'medium',
    tags: ['pneumatic', 'control'],
  },
  {
    topic: 'Pneumatic Control',
    question: 'What are common applications of pneumatic systems?',
    answer: 'Used in manufacturing (assembly lines), automation, robotics, and tools where speed and reliability are important. Advantages: safe, clean, inexpensive. Disadvantages: lower power density, need for compressor.',
    difficulty: 'easy',
    tags: ['pneumatic', 'control'],
  },

  // PWM & Communication Protocols
  {
    topic: 'Control Techniques',
    question: 'What is Pulse Width Modulation (PWM)?',
    answer: 'A technique for controlling analog circuits by varying the duty cycle of a digital square wave. Adjusts average voltage/power to a load. Used in motor speed control and LED brightness.',
    difficulty: 'easy',
    tags: ['control', 'pwm'],
  },
  {
    topic: 'Control Techniques',
    question: 'How does PWM duty cycle affect output power?',
    answer: 'Output power is proportional to duty cycle. A 50% duty cycle delivers 50% of maximum power. A 75% duty cycle delivers 75% of maximum power. Used for smooth analog control.',
    difficulty: 'medium',
    tags: ['pwm', 'control'],
  },
  {
    topic: 'Communication & Protocols',
    question: 'What is Modbus protocol?',
    answer: 'A master-slave communication protocol used in industrial control. Allows communication between different devices on an industrial network. Supports both serial (RTU/ASCII) and TCP/IP variants.',
    difficulty: 'medium',
    tags: ['protocols', 'communication'],
  },
  {
    topic: 'Communication & Protocols',
    question: 'What is Profibus?',
    answer: 'A process fieldbus standard for real-time distributed control. Used for decentralized automation and modular plant expansions. Higher speed than Modbus.',
    difficulty: 'medium',
    tags: ['protocols', 'communication'],
  },

  // Stability Analysis
  {
    topic: 'System Stability',
    question: 'What is the Nyquist stability criterion?',
    answer: 'States that a closed-loop system is stable if the number of counter-clockwise encirclements of the critical point (-1, 0) by the Nyquist plot equals the number of open-loop poles in the right half-plane.',
    difficulty: 'hard',
    tags: ['stability', 'control'],
  },
  {
    topic: 'System Stability',
    question: 'How do you determine stability from a characteristic equation?',
    answer: 'A system is stable if all roots of the characteristic equation are in the left half of the s-plane (negative real parts). If any root has positive real part, system is unstable.',
    difficulty: 'hard',
    tags: ['stability', 'control'],
  },

  // Actuators
  {
    topic: 'Actuators',
    question: 'What is an actuator?',
    answer: 'A device that converts a control signal into physical action (linear or rotary motion). Examples: electric motors, solenoids, pneumatic cylinders, hydraulic cylinders.',
    difficulty: 'easy',
    tags: ['definitions', 'actuators'],
  },
  {
    topic: 'Actuators',
    question: 'What types of motors are used in robots?',
    answer: 'DC servo motors for precise position control, stepper motors for discrete positioning, AC induction motors for high power applications. Selection depends on control requirements and application.',
    difficulty: 'medium',
    tags: ['actuators', 'robotics'],
  },

  // DCS Systems
  {
    topic: 'Distributed Control Systems',
    question: 'What are the main components of a DCS?',
    answer: 'Field instruments (sensors/transmitters), control modules, operator workstations, communication network, and application software. Each level performs specific control functions.',
    difficulty: 'medium',
    tags: ['dcs', 'control'],
  },
  {
    topic: 'Distributed Control Systems',
    question: 'What are advantages of DCS over centralized control?',
    answer: 'Higher reliability (failure doesn\'t shut down entire system), easier maintenance, better scalability, reduced wiring, faster response times, and modular expansion capability.',
    difficulty: 'medium',
    tags: ['dcs', 'control'],
  },

  // Microcontrollers
  {
    topic: 'Microcontrollers & Digital Systems',
    question: 'What is a microcontroller?',
    answer: 'A small computer on a single integrated circuit containing a processor, memory, and programmable I/O. Used for embedded control applications in robots, vehicles, and industrial equipment.',
    difficulty: 'easy',
    tags: ['microcontroller', 'digital'],
  },
  {
    topic: 'Microcontrollers & Digital Systems',
    question: 'Compare hardware and software in control systems.',
    answer: 'Hardware: physical components (processors, sensors, actuators) that perform control functions. Software: programs and logic that determine how hardware operates. Both essential for system functionality.',
    difficulty: 'easy',
    tags: ['microcontroller', 'definitions'],
  },

  // System Specifications
  {
    topic: 'System Response Characteristics',
    question: 'What is peak time in second-order systems?',
    answer: 'Tp = π/ωd, where ωd is the damped natural frequency. Represents the time when the system response reaches its maximum value after a step input.',
    difficulty: 'hard',
    tags: ['control', 'math'],
  },
  {
    topic: 'System Response Characteristics',
    question: 'What is settling time?',
    answer: 'Ts = 4/(ζωn) for 2% criterion, where ζ is damping ratio and ωn is natural frequency. Time required for response to reach and stay within 2% of final steady-state value.',
    difficulty: 'hard',
    tags: ['control', 'math'],
  },
  {
    topic: 'System Response Characteristics',
    question: 'What is maximum overshoot?',
    answer: 'Mp = e^(-πζ/√(1-ζ²)) × 100%, where ζ is damping ratio. Indicates how much the response overshoots the steady-state value after step input.',
    difficulty: 'hard',
    tags: ['control', 'math'],
  },

  // Cascade Control
  {
    topic: 'Advanced Control Strategies',
    question: 'What is cascade control?',
    answer: 'A control strategy where the output of one controller (master/primary) serves as the setpoint for another controller (slave/secondary). Improves dynamic response and rejects disturbances.',
    difficulty: 'medium',
    tags: ['control', 'advanced'],
  },
  {
    topic: 'Advanced Control Strategies',
    question: 'What is ratio control?',
    answer: 'A control strategy that maintains the ratio of two process variables at a specified value. One stream is the wild stream, the other controlled to maintain desired ratio.',
    difficulty: 'medium',
    tags: ['control', 'advanced'],
  },

  // Signal Processing
  {
    topic: 'Signal Processing',
    question: 'What is signal modulation?',
    answer: 'The process of varying a carrier signal\'s properties (amplitude, frequency, or phase) with another signal. Used for encoding information and transmission over communication channels.',
    difficulty: 'medium',
    tags: ['signal', 'communication'],
  },
  {
    topic: 'Signal Processing',
    question: 'What is a modem?',
    answer: 'Modulator-Demodulator - converts digital data from computer into analog signals for transmission over communication lines and demodulates incoming analog signals back to digital.',
    difficulty: 'easy',
    tags: ['communication', 'definitions'],
  },
];

// Generate RPC function for incrementing user count
export const incrementUserCountRPC = `
CREATE OR REPLACE FUNCTION increment_user_count()
RETURNS void AS $$
BEGIN
  UPDATE site_stats
  SET total_users = total_users + 1, updated_at = NOW()
  WHERE id = (SELECT id FROM site_stats LIMIT 1);
  
  -- Insert initial row if none exists
  INSERT INTO site_stats (total_users)
  VALUES (1318)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;
`;
