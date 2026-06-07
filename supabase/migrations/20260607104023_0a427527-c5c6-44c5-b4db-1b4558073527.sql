
ALTER TABLE public.access_requests
  ADD COLUMN IF NOT EXISTS is_pair boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS second_full_name text,
  ADD COLUMN IF NOT EXISTS second_whatsapp text,
  ADD COLUMN IF NOT EXISTS second_email text;

CREATE OR REPLACE FUNCTION public.get_public_user_count()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT 1428 + COALESCE((SELECT count(*) FROM public.access_requests WHERE status = 'approved'), 0)::int;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_user_count() TO anon, authenticated;

INSERT INTO public.topic_sets (id, title, description, order_index, free_card_limit) VALUES
  ('f0000011-0000-0000-0000-000000000000', 'Past Paper Oct/Nov 2024 (518/23/M01)', 'Full revision answer guide for Paper 518/23/M01 - October/November 2024. All 8 questions with definitions, diagrams and worked solutions.', 100, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

WITH new_cards(order_index, question, answer) AS (VALUES
  (1, 'Q1(a)(i) Define HMI (Human Machine Interface).', 'A user interface that connects an operator to a machine, system or device. It displays process data (temperatures, pressures, motor status) from a PLC and lets the operator send commands (start/stop, setpoints) via a touch screen or keypad.'),
  (2, 'Q1(a)(ii) Define Actuator.', 'A device that converts a control signal (electrical, pneumatic or hydraulic) into physical motion - linear or rotary - to perform work. Examples: electric motor, pneumatic cylinder, solenoid valve.'),
  (3, 'Q1(a)(iii) Define Transducer.', 'A device that converts one form of energy into another. In automation it typically converts a physical quantity (pressure, temperature, displacement) into an electrical signal, or vice versa.'),
  (4, 'Q1(a)(iv) Define Sensor.', 'A device that detects or measures a physical property (light, temperature, position, pressure) and produces an output signal (usually electrical) that a control system can read.'),
  (5, 'Q1(a)(v) Define Robotics.', 'The branch of engineering dealing with the design, construction, operation and application of robots - programmable machines that carry out complex tasks automatically.'),
  (6, 'Q1(b) Give two examples each of a Sensor, Transducer and Actuator.', 'Sensors: proximity sensor (inductive/capacitive); thermocouple. Transducers: piezoelectric crystal (pressure to voltage); LVDT (displacement to voltage). Actuators: electric stepper motor; pneumatic diaphragm actuator for a control valve.'),
  (7, 'Q1(c) State four communication protocols used in industrial automation.', '1. Modbus (RS-232/485 or TCP/IP) - widely used between PLCs, drives and HMIs. 2. Profinet - industrial Ethernet for real-time data exchange. 3. EtherNet/IP - Ethernet using CIP for control and information. 4. Profibus - fieldbus for fast cyclic data exchange between controllers and field devices.'),
  (10, 'Q2 What is the principle of measuring PLC scan cycle time in ladder logic?', 'A free-running millisecond timer (e.g. T1 with a 1 ms time base) increments continuously. At the end of every scan the current timer value is read and the previous-scan value is subtracted: ScanTime = T1.CV - Prev. The Prev register is then updated with the current value. The timer period must be much larger than the expected scan time so it cannot roll over within one scan.'),
  (11, 'Q2 Typical I/O tags used by a PLC scan-time program.',
$$| Tag | Type | Description |
|-----|------|-------------|
| Start_Measurement | DI (I0.0) | Push button to start measuring |
| Reset | DI (I0.1) | Reset the scan-time value |
| Scan_Time_ms | MW (e.g. MW10) | Measured scan time in ms |
| Scan_Valid | DO (Q0.0) | Indicator that measurement is ready |$$),
  (12, 'Q2 Two-rung ladder logic that computes scan time each cycle.',
$$Rung 1 - subtract previous timer value from current value:
  |--[ Always On ]--[ SUB  IN1=T1.CV  IN2=Prev  OUT=ScanTime ]--|

Rung 2 - store current value as Prev for the next scan:
  |--[ Always On ]--[ MOVE IN=T1.CV  OUT=Prev ]--|

ScanTime (MW10) can be displayed on the HMI or used for diagnostics.$$),
  (13, 'Q3(a) Briefly describe the operation of an HMI.', 'An HMI is a graphical interface that lets an operator interact with a machine or process. It reads real-time data (temperatures, pressures, statuses) from a PLC over Modbus/Profinet/etc and displays it. The operator sends commands (start/stop, setpoint changes) via touch buttons or numeric entry. The HMI also logs alarms, trends and events.'),
  (14, 'Q3(b) List five parameters that must be backed up from an HMI.', '1. Screen layouts and graphics (all pages, buttons, indicators). 2. Tag database linking objects to PLC addresses. 3. Alarm configuration (messages, triggers, priorities). 4. Recipes and historical data logs. 5. User accounts and security settings.'),
  (15, 'Q3(c) Why is backing up HMI data important?', 'Disaster recovery - restore quickly after hardware failure or corruption. Version control - roll back to a known good configuration after a bad change. System migration - move settings to a replacement or duplicate HMI with minimal downtime.'),
  (16, 'Q3(d) Importance of HMI touch-screen maintenance (three aspects).',
$$| Aspect | Explanation |
|--------|-------------|
| Performance optimisation | Cleaning and calibration prevent false touches and unresponsive areas, keeping the interface accurate. |
| Extended lifespan | Preventive checks on cables, ambient temperature and contact pressure reduce wear on the screen, backlight and electronics. |
| Reduced downtime | Scheduled maintenance catches dimming backlights or intermittent response before they cause unplanned stoppages. |$$),
  (17, 'Q4(a) Define troubleshooting in networking.', 'The systematic process of identifying, diagnosing and resolving problems in a communication network. It isolates the root cause of a failure (no connectivity, slow transfer, packet loss) using tools like ping, traceroute, cable testers and protocol analysers, then applies corrective actions to restore normal operation.'),
  (18, 'Q4(b) Ethernet troubleshooting flow (OSI-layer order).',
$$START
  |
  v
1. Identify symptom (no link, slow, intermittent)
  |
  v
2. Physical layer - check cable seating, link LEDs, swap with known-good cable
  |
  v  link LED on? --No--> back to step 2
  v
3. IP config - ipconfig/ifconfig; ping 127.0.0.1
  |
  v  loopback OK? --No--> reinstall TCP/IP stack
  v
4. Ping default gateway --No--> check switch/router/VLAN
  |
  v
5. Ping remote host by IP --No--> check routing/firewall
  |
  v
6. Ping by hostname --No--> check DNS settings
  |
  v
7. Test application (Modbus TCP port 502, HTTP port 80) --No--> check firewall and service
  |
  v
PROBLEM RESOLVED
END$$),
  (19, 'Q5(a) Describe four robotic configurations.',
$$| Configuration | How it works |
|---------------|--------------|
| SCARA | Two parallel rotary joints for X-Y, one linear Z. Fast and rigid vertically; ideal for pick-and-place and assembly. |
| Spherical (polar) | Two rotary joints (base, shoulder) plus one linear extension. Spherical work envelope. Early industrial robots (Unimate). |
| Cylindrical | Rotary base + vertical linear column + horizontal linear arm. Cylindrical envelope. Used for coating and handling. |
| Cartesian | Three orthogonal linear axes (X, Y, Z). High rigidity and accuracy; common in CNC, 3D printers, gantry pick-and-place. |$$),
  (20, 'Q5(b) Six major types of robots and how each operates.',
$$| Type | Operation |
|------|-----------|
| Articulated | 6 rotary joints, arm-like. High flexibility - welding, painting, assembly. |
| Cartesian | Three perpendicular linear axes. Simple control, high precision. |
| Cylindrical | Rotary base + 2 linear axes. Casting, coating, machine tending. |
| Spherical/Polar | Two rotary + one linear. Older heavy-handling robots. |
| SCARA | Two parallel rotary + one linear vertical. Fast assembly and insertion. |
| Delta (parallel) | Three arms on parallel linkages move a common platform. Very high speed - packaging, food. |$$),
  (21, 'Q6(a) Four fundamental components of a hydraulic system.',
$$| Component | Function |
|-----------|----------|
| Hydraulic pump | Converts mechanical energy (motor/engine) into hydraulic energy by pressurising oil from the reservoir. |
| Reservoir (tank) | Stores fluid, lets contaminants settle, dissipates heat, supplies the pump intake. |
| Control valves (directional, pressure, flow) | Direct fluid to actuators, regulate pressure (relief valve) and flow rate (flow control valve). |
| Actuator (cylinder or motor) | Converts hydraulic energy back to mechanical - linear cylinder for linear motion, hydraulic motor for rotation. |$$),
  (22, 'Q6(b) Compare and contrast hydraulic and pneumatic systems.',
$$| Feature | Hydraulic | Pneumatic |
|---------|-----------|-----------|
| Medium | Incompressible oil | Compressible air |
| Pressure | 100-700 bar (up to 1000) | 5-10 bar (rarely >15) |
| Force | Very high (tons) | Low-moderate (hundreds of N) |
| Precision | Excellent (servo valves) | Limited by air compressibility |
| Speed | Moderate (0.1-1 m/s) | Fast (several m/s) |
| Efficiency | Generally efficient | Poor (compression and exhaust losses) |
| Maintenance | Complex (leaks, filtration) | Simple (clean air, no return) |
| Safety | Fire risk, high pressure | Lower risk |
| Cost | Higher | Lower |
| Applications | Heavy presses, aircraft | Packaging, clamping, pick-and-place |$$),
  (23, 'Q6(c) Two types of pneumatic cylinders.',
$$| Type | Description |
|------|-------------|
| Single-acting | Air pressure acts on one side of the piston to extend (or retract). A spring or external force returns the piston. Uses less air, shorter stroke. Used for clamping, pressing, ejection. |
| Double-acting | Air alternately enters both sides of the piston - one port extends, the other retracts. Full stroke length, force in both directions. Used in most industrial automation. |$$),
  (24, 'Q7 Modelling and simulation procedure (flow).',
$$START
  v
1. Define problem and objectives (system, questions to answer)
  v
2. Gather system data and assumptions (parameters, ranges, initial conditions)
  v
3. Develop mathematical model (Newton, Kirchhoff, thermodynamics)
  v
4. Choose simulation tool (Matlab/Simulink, Python/SciPy, LabVIEW)
  v
5. Implement model in the tool (blocks/code/graphical)
  v
6. Verify model -- correct? No --> back to 3 or 5
  v
7. Validate against real system -- acceptable? No --> refine (3) or gather more data (2)
  v
8. Run simulation experiments (vary parameters, disturbances, controllers)
  v
9. Analyse and interpret results (rise time, overshoot, energy)
  v
10. Document and recommend
  v
END

Verification = "are the equations solved correctly?"
Validation = "does the model match the real system?"$$),
  (25, 'Q8(a) Basic PLC block diagram.',
$$                    PROGRAMMABLE LOGIC CONTROLLER
                  +-------------------------------+
                  |                               |
 Inputs --------->| Input  |---->| CPU |---->| Output |---> Outputs
 (sensors,        | modules|     |     |     | modules |     (relays,
  push buttons,   +--------+     +--+--+     +---------+      solenoids,
  limit switches)                   |                          lamps)
                                    v
                              +-----------+
                              |  Memory   |
                              | (program  |
                              |  and data)|
                              +-----------+
                                    ^
                  +-----------+     |     +--------------+
                  |  Power    |<----+---->| Programming  |
                  |  supply   | system bus|  device (PC) |
                  +-----------+           +--------------+

Blocks to label: Input modules, CPU, Memory, Output modules, Power supply, System bus (backplane), Programming device.$$),
  (26, 'Q8(b)(i) Operation of the PLC processor (CPU).', 'The "brain" of the PLC. It runs the cyclic scan: read inputs -> execute the user program (ladder logic) -> update outputs -> diagnostics and communication. It contains an arithmetic logic unit (ALU), registers and a control unit.'),
  (27, 'Q8(b)(ii) Operation of the PLC mounting system (rack / backplane).', 'A mechanical and electrical chassis that holds the CPU, power supply and I/O modules. The backplane provides a communication bus (data, address, control lines) so modules can exchange data and also distributes power to the modules.'),
  (28, 'Q8(b)(iii) Operation of the PLC power supply.', 'Converts incoming AC or DC mains into regulated DC voltages (+5 V, +24 V) for the CPU and I/O. It provides short-circuit and overload protection and may include a battery backup for RAM retention.'),
  (29, 'Q8(b)(iv) Operation of the PLC input and output interfaces.', 'Input interface: accepts 24 V signals from field devices, optically isolates them, filters noise and converts them to 5 V logic for the CPU. Output interface: takes CPU logic signals, isolates them, and drives field loads via relay, transistor or triac outputs.'),
  (30, 'Q8(b)(v) Operation of the PLC programming device.', 'A PC running vendor software (TIA Portal, RSLogix, GX Works) or a handheld terminal that lets the user create, edit, download and monitor the PLC program. It connects via Ethernet, USB or RS-232 serial.')
)
INSERT INTO public.cards (topic_set_id, question, answer, order_index)
SELECT s.id, n.question, n.answer, n.order_index
FROM new_cards n
CROSS JOIN (VALUES
  ('f0000011-0000-0000-0000-000000000000'::uuid),
  ('f0000010-0000-0000-0000-000000000000'::uuid)
) AS s(id);
