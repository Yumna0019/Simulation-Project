import React, { useState } from "react";
import Graph from "./Graph";

function MultiServerSimulation() {
  const [lambda, setLambda] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [num, setNum] = useState(5);
  const [serverCount, setServerCount] = useState(2);
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [A, setA1] = useState(55);
  const [C, setC1] = useState(9);
  const [M, setM1] = useState(1994);
  const [Z, setZ1] = useState(10112166);
  const [results, setResults] = useState(null);

  // const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

  const ExpCumulative = (lamb, k) => {
    let cumulativeProb = 0;
    for (let x = 0; x <= k; x++) {
      const m = 1 / lamb;
      const prob = 1 - Math.exp(-m * x);
      cumulativeProb += prob;
    }
    return cumulativeProb;
  };

  const generatePriority = (A, Z, C, M, a, b, n) => {
    const generatedPriorities = [];
    for (let i = 0; i < n; i++) {
      let randomValue = (A * Z + C) % M;
      Z = randomValue;
      const randomNumber = randomValue / M;
      const priority = Math.round((b - a) * randomNumber + a);
      generatedPriorities.push(priority);
    }
    return generatedPriorities;
  };

  const runSimulation = () => {
    
    const ranges = [];
    let previousCp = 0;
    const cpArray = [];
    for (let i = 0; i < num; i++) {
      const cp = ExpCumulative(lambda, i);
      if(cp>1){
        break;
      }
      ranges.push({ lower: previousCp, upper: cp, minVal: i });
      cpArray.push(cp);
      previousCp = cp;
    }
    const priorities = generatePriority(A, Z, C, M, a, b, cpArray.length);
    const serviceTimes = Array.from({ length: cpArray.length }, () => {
      let service;
      do {
        const randomNumber = Math.random();
        service = Math.round(a + (b - a) * randomNumber); // Uniform distribution
      } while (service < 1);
      return service;
    });

    const interArrival = [];
    for (let i = 1; i < cpArray.length; i++) {
      let ia;
      do {
        ia = Math.random();
      } while (ia >= cpArray[cpArray.length - 1]);
      interArrival.push(ia);
    }

    let arrival = 0;
    const arrivalTimes = [0];
    const iaFinalArray = [0];

    interArrival.slice(0, cpArray.length ).forEach((ia) => {
      let iaFinal = -1;
      ranges.forEach((range) => {
        if (range.lower <= ia && ia < range.upper) {
          iaFinal = range.minVal;
        }
      });

      arrival += iaFinal;
      arrivalTimes.push(arrival);
      iaFinalArray.push(iaFinal);
    });

    const patientDetails = [];
    let previousCpForIA = 0;
    for (let i = 0; i < cpArray.length; i++) {
      const cpVal = ExpCumulative(lambda, i);
      const minVal = i;
      const iaRange = `${previousCpForIA.toFixed(6)} - ${cpVal.toFixed(6)}`;
      const iaFinal = iaFinalArray[i];

      patientDetails.push({
        patientNo: i + 1,
        serviceTime: serviceTimes[i],
        cpLookup: previousCpForIA.toFixed(6),
        cp: cpVal.toFixed(6),
        min: minVal,
        iaRange,
        iaFinal,
        arrival: arrivalTimes[i],
      });
      previousCpForIA = cpVal;
    }

    const server_states = Array.from({ length: serverCount }, () => ({
      remaining_service: 0,
      process: null,
    }));
    const gantt_chart = Array.from({ length: serverCount }, () => []);
    const Finish_Time = Array(cpArray.length).fill(-1);
    const Start_Time = Array(cpArray.length).fill(-1);
    const Turnaround_Time = Array(cpArray.length).fill(0);
    const Waiting_Time = Array(cpArray.length).fill(0);
    const Response_Time = Array(cpArray.length).fill(-1);
    const server_busy_time = Array(serverCount).fill(0);

    const remaining_service = serviceTimes.slice();
    const remaining_processes = new Set([...Array(cpArray.length).keys()]);
    let current_time = 0;

    while (
      remaining_processes.size > 0 ||
      server_states.some((s) => s.remaining_service > 0)
    ) {
      const available_processes = Array.from(remaining_processes).filter(
        (p) => arrivalTimes[p] <= current_time
      );

      server_states.forEach((server_state, i) => {
        if (
          server_state.remaining_service === 0 &&
          available_processes.length > 0
        ) {
          const selected_process = available_processes.reduce(
            (minProcess, p) =>
              priorities[p] < priorities[minProcess] ? p : minProcess,
            available_processes[0]
          );

          available_processes.splice(
            available_processes.indexOf(selected_process),
            1
          );
          remaining_processes.delete(selected_process);

          server_state.process = selected_process;
          server_state.remaining_service = remaining_service[selected_process];
          gantt_chart[i].push(selected_process);

          if (Start_Time[selected_process] === -1) {
            Start_Time[selected_process] = current_time;
            Response_Time[selected_process] =
              current_time - arrivalTimes[selected_process];
          }
        } else if (
          server_state.remaining_service > 0 &&
          available_processes.length > 0
        ) {
          const highest_priority_process = available_processes.reduce(
            (minProcess, p) =>
              priorities[p] < priorities[minProcess] ? p : minProcess,
            available_processes[0]
          );

          const current_process = server_state.process;
          if (
            priorities[highest_priority_process] < priorities[current_process]
          ) {
            remaining_service[current_process] = server_state.remaining_service;
            remaining_processes.add(current_process);

            server_state.process = highest_priority_process;
            server_state.remaining_service =
              remaining_service[highest_priority_process];
            available_processes.splice(
              available_processes.indexOf(highest_priority_process),
              1
            );
            remaining_processes.delete(highest_priority_process);

            gantt_chart[i].push(highest_priority_process);

            if (Start_Time[highest_priority_process] === -1) {
              Start_Time[highest_priority_process] = current_time;
              Response_Time[highest_priority_process] =
                current_time - arrivalTimes[highest_priority_process];
            }
          } else {
            gantt_chart[i].push(current_process);
          }
        } else {
          gantt_chart[i].push(server_state.process);
        }

        if (server_state.remaining_service > 0) {
          server_state.remaining_service -= 1;
          server_busy_time[i] += 1;
          if (server_state.remaining_service === 0) {
            Finish_Time[server_state.process] = current_time + 1;
            server_state.process = null;
          }
        }
      });

      current_time += 1;
    }

    for (let i = 0; i < cpArray.length; i++) {
      Turnaround_Time[i] = Finish_Time[i] - arrivalTimes[i];
      Waiting_Time[i] = Turnaround_Time[i] - serviceTimes[i];
    }

    const metrics = {
      avgWT: Waiting_Time.reduce((a, b) => a + b) / cpArray.length,
      avgRT: Response_Time.reduce((a, b) => a + b) / cpArray.length,
      avgTAT: Turnaround_Time.reduce((a, b) => a + b) / cpArray.length,
      avgST: serviceTimes.reduce((a, b) => a + b) / cpArray.length,
      serverUtilization: server_busy_time.map((busy, idx) => ({
        server: idx + 1,
        utilization: (busy / serviceTimes.reduce((a, b) => a + b, 0)) * 100,
      })),
    };

    setResults({
      priorities,
      serviceTimes,
      arrivalTimes,
      Start_Time,
      Finish_Time,
      Turnaround_Time,
      Waiting_Time,
      Response_Time,
      metrics,
      patientDetails,
      gantt_chart,
      server_busy_time,
    });
  };

  return (
    <div>
      <h1>Multi-Server Simulation</h1>
      <div>
        <label>Lambda (λ): </label>
        <input
          type="number"
          value={lambda}
          onChange={(e) => setLambda(parseFloat(e.target.value))}
        />
        <label>Min value (a): </label>
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(parseFloat(e.target.value))}
        />
        <label>Max value (b) : </label>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(parseFloat(e.target.value))}
        />
        <label>Number of Patients: </label>
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(parseInt(e.target.value))}
        />
        <label>Number of Servers: </label>
        <input
          type="number"
          value={serverCount}
          onChange={(e) => setServerCount(parseInt(e.target.value))}
        />
        <label>a: </label>
        <input
          type="number"
          value={a}
          onChange={(e) => setA(parseInt(e.target.value))}
        />
        <label>b: </label>
        <input
          type="number"
          value={b}
          onChange={(e) => setB(parseInt(e.target.value))}
        />
        <label>A: </label>
        <input
          type="number"
          value={A}
          onChange={(e) => setA1(parseInt(e.target.value))}
        />
        <label>C: </label>
        <input
          type="number"
          value={C}
          onChange={(e) => setC1(parseInt(e.target.value))}
        />
        <label>M: </label>
        <input
          type="number"
          value={M}
          onChange={(e) => setM1(parseInt(e.target.value))}
        />
        <label>Z: </label>
        <input
          type="number"
          value={Z}
          onChange={(e) => setZ1(parseInt(e.target.value))}
        />
        <button onClick={runSimulation}>Run Simulation</button>
      </div>

      {results && (
        <div>
          <h2>Simulation Results</h2>
          <h2>Patient Details with IA Information</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Patient No</th>
                <th>Service Time</th>
                <th>CP Lookup</th>
                <th>CP</th>
                <th>Min</th>
                <th>IA Range</th>
                <th>IA Final</th>
                <th>Arrival</th>
              </tr>
            </thead>
            <tbody>
              {results.patientDetails.map((detail, idx) => (
                <tr key={idx}>
                  <td>{detail.patientNo}</td>
                  <td>{detail.serviceTime}</td>
                  <td>{detail.cpLookup}</td>
                  <td>{detail.cp}</td>
                  <td>{detail.min}</td>
                  <td>{detail.iaRange}</td>
                  <td>{detail.iaFinal}</td>
                  <td>{detail.arrival}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Start and Finish Time Table */}
          <h2>Patient Details</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Patient #</th>
                <th>Priority</th>
                <th>Arrival Time</th>
                <th>Service Time</th>
                <th>Start Time</th>
                <th>Finish Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
                <th>Response Time</th>
              </tr>
            </thead>
            <tbody>
              {results.Start_Time.map((startTime, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{results.priorities[i]}</td>
                  <td>{results.arrivalTimes[i]}</td>
                  <td>{results.serviceTimes[i]}</td>
                  <td>{startTime}</td>
                  <td>{results.Finish_Time[i]}</td>
                  <td>{results.Turnaround_Time[i]}</td>
                  <td>{results.Waiting_Time[i]}</td>
                  <td>{results.Response_Time[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Server Utilization:</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Server</th>
                <th>Utilization (%)</th>
              </tr>
            </thead>
            <tbody>
              {results.metrics.serverUtilization.map((util, idx) => (
                <tr key={idx}>
                  <td>Server {idx + 1}</td>
                  <td>{util.utilization.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Gantt Chart</h3>
          {results.gantt_chart.map((chart, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
              }}
            >
              <h4 style={{ margin: 0 }}>Server {idx + 1}</h4>
              <p>{chart.join(" | ")}</p>
            </div>
          ))}

          <h3>Metrics</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Average Waiting Time</td>
                <td>{results.metrics.avgWT.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Average Response Time</td>
                <td>{results.metrics.avgRT.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Average Turnaround Time</td>
                <td>{results.metrics.avgTAT.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Average Service Time</td>
                <td>{results.metrics.avgST.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          {/* Graphs */}
          <h3>Graphs</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {/* Interarrival Times */}
            <Graph
              title="Interarrival Times"
              labels={results.patientDetails.map((_, i) => `Patient ${i + 1}`)}
              data={results.patientDetails.map((detail) => detail.iaFinal)}
              type="bar"
            />

            {/* Arrival Times */}
            <Graph
              title="Arrival Times"
              labels={results.patientDetails.map((_, i) => `Patient ${i + 1}`)}
              data={results.arrivalTimes}
              type="bar"
            />

            {/* Waiting Times */}
            <Graph
              title="Waiting Times"
              labels={results.patientDetails.map((_, i) => `Patient ${i + 1}`)}
              data={results.Waiting_Time}
              type="bar"
            />

            {/* Turnaround Times */}
            <Graph
              title="Turnaround Times"
              labels={results.patientDetails.map((_, i) => `Patient ${i + 1}`)}
              data={results.Turnaround_Time}
              type="bar"
            />

            {/* Response Times */}
            <Graph
              title="Response Times"
              labels={results.patientDetails.map((_, i) => `Patient ${i + 1}`)}
              data={results.Response_Time}
              type="bar"
            />

            {/* Server Utilization */}
            <Graph
              title="Server Utilization"
              labels={results.metrics.serverUtilization.map(
                (util) => `Server ${util.server}`
              )}
              data={results.metrics.serverUtilization.map(
                (util) => util.utilization
              )}
              type="bar"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiServerSimulation;
