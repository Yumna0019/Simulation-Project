import React, { useState, useEffect } from "react";
import Graph from "./Graph";

function MultiServerSimulation() {
  const [a, seta] = useState(2.58);
  const [b, setb] = useState(2.58);
  const [mu, setMu] = useState(2.58);
  const [sd, setSd] = useState(2.58);
  const [num, setNum] = useState(5);
  const [server, setServer] = useState(2);
  const [results, setResults] = useState(null);

  // Error function approximation
  const erf = (z) => {
    const t = 1 / (1 + 0.5 * Math.abs(z));
    const tau =
      t * Math.exp(
        -z * z - 1.26551223 +
        1.00002368 * t +
        0.37409196 * t * t +
        0.09678418 * t * t * t -
        0.18628806 * t * t * t * t +
        0.27886807 * t * t * t * t * t -
        1.13520398 * t * t * t * t * t * t +
        1.48851587 * t * t * t * t * t * t * t -
        0.82215223 * t * t * t * t * t * t * t * t +
        0.17087277 * t * t * t * t * t * t * t * t * t
      );
    return z >= 0 ? 1 - tau : tau - 1;
  };

  // CDF calculation using the error function
  const normal_cumulative = (k) => {
    let cumulativeProb = 0;
    for (let x = 0; x <= k; x++) {
      const prob = 0.5 * (1 + erf((x - mu) / (sd * Math.sqrt(2))));

      cumulativeProb += prob;
    }
    return cumulativeProb;
  };

  const runSimulation = () => {
    const ranges = [];
    let previousCp = 0;
    const cpArray = [];
    for (let i = 0; i < num; i++) {
      const cp = normal_cumulative(i);
      if (cp > 1) {
        break;
      }
      ranges.push({ lower: previousCp, upper: cp, minVal: i });
      cpArray.push(cp);
      previousCp = cp;
    }
    const serviceTimes = Array.from({ length: cpArray.length }, () => {
      let service;
      do {
        const randomNumber = Math.random();
        service = Math.round(a + (b - a) * randomNumber);  // Uniform distribution
      } while (service < 1);
      return service;
    });

    const interArrival = [0];
    for (let i = 1; i < cpArray.length; i++) {
      let ia;
      do {
        ia = Math.random();
      } while (ia >= cpArray[cpArray.length - 1]);
      interArrival.push(ia);
    }

    let arrival = 0;
    const arrivalTimes = [];
    const iaFinalArray = [];

    interArrival.slice(0, cpArray.length).forEach((ia, i) => {
      let iaFinal = -1;
      ranges.forEach((range) => {
        if (range.lower <= ia && ia <= range.upper) {
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
      const cpVal = normal_cumulative(i);
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
        iaFinal: iaFinal,
        arrival: arrivalTimes[i],
      });
      previousCpForIA = cpVal;
    }

    const Start_Time = Array(cpArray.length).fill(0);
    const Finish_Time = Array(cpArray.length).fill(0);
    const Turnaround_Time = Array(cpArray.length).fill(0);
    const Waiting_Time = Array(cpArray.length).fill(0);
    const Response_Time = Array(cpArray.length).fill(0);

    const serverAvailability = Array(server).fill(0);
    const serverTasks = Array(server).fill().map(() => []);
    const serverBusyTime = Array(server).fill(0);

    const processOrder = [...Array(cpArray.length).keys()].sort(
      (a, b) => arrivalTimes[a] - arrivalTimes[b]
    );

    processOrder.forEach((i) => {
      let assignedServer = -1;
      for (let s = 0; s < server; s++) {
        if (serverAvailability[s] <= arrivalTimes[i]) {
          assignedServer = s;
          break;
        }
      }

      if (assignedServer === -1) {
        assignedServer = serverAvailability.indexOf(
          Math.min(...serverAvailability)
        );
      }

      Start_Time[i] = Math.max(
        serverAvailability[assignedServer],
        arrivalTimes[i]
      );
      Finish_Time[i] = Start_Time[i] + serviceTimes[i];
      Turnaround_Time[i] = Finish_Time[i] - arrivalTimes[i];
      Response_Time[i] = Start_Time[i] - arrivalTimes[i];
      Waiting_Time[i] = Turnaround_Time[i] - serviceTimes[i];

      serverAvailability[assignedServer] = Finish_Time[i];
      serverBusyTime[assignedServer] += serviceTimes[i];
      serverTasks[assignedServer].push({
        start: Start_Time[i],
        finish: Finish_Time[i],
        process: i,
      });
    });

    const totalServiceTime = serviceTimes.reduce((a, b) => a + b, 0);
    const serverUtilization = serverBusyTime.map(
      (busyTime) => busyTime / totalServiceTime
    );

    const metrics = {
      avgWT: Waiting_Time.reduce((a, b) => a + b) / cpArray.length,
      avgRT: Response_Time.reduce((a, b) => a + b) / cpArray.length,
      avgTAT: Turnaround_Time.reduce((a, b) => a + b) / cpArray.length,
      avgST: serviceTimes.reduce((a, b) => a + b) / cpArray.length,
      overallUtilization: serverUtilization.reduce((a, b) => a + b, 0),
    };

    setResults({
      patientDetails,
      metrics,
      serverUtilization,
      serverTasks,
      Start_Time,
      Finish_Time,
      Turnaround_Time,
      Waiting_Time,
      Response_Time,
    });
  };

  return (
    <div>
      <h1>Multi-Server Simulation</h1>
      <div>
        <label>Min value (a): </label>
        <input
          type="number"
          value={a}
          onChange={(e) => seta(parseFloat(e.target.value))}
        />
        <label>Max value (b): </label>
        <input
          type="number"
          value={b}
          onChange={(e) => setb(parseFloat(e.target.value))}
        />
        <label>Mu: </label>
        <input
          type="number"
          value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))}
        />
        <label>Standard Deviation: </label>
        <input
          type="number"
          value={sd}
          onChange={(e) => setSd(parseFloat(e.target.value))}
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
          value={server}
          onChange={(e) => setServer(parseInt(e.target.value))}
        />
        <button onClick={runSimulation}>Run Simulation</button>
      </div>
      {results && (
        <div>
          <h2>Patient Details with IA Information</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Patient #</th>
                <th>Service Time</th>
                <th>CP Lookup</th>
                <th>CP</th>
                <th>MIN</th>
                <th>IA RANGE</th>
                <th>IA FINAL</th>
                <th>ARRIVAL</th>
              </tr>
            </thead>
            <tbody>
              {results.patientDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
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

          <h2>Additional Patient Metrics</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Patient #</th>
                <th>Arrival Time</th>
                <th>Service Time</th>
                <th>Start Time</th>
                <th>Finish Time</th>
                <th>Turnaround Time (TA)</th>
                <th>Waiting Time (WT)</th>
                <th>Response Time (RT)</th>
              </tr>
            </thead>
            <tbody>
              {results.patientDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{detail.arrival}</td>
                  <td>{detail.serviceTime}</td>
                  <td>{results.Start_Time[index]}</td>
                  <td>{results.Finish_Time[index]}</td>
                  <td>{results.Turnaround_Time[index]}</td>
                  <td>{results.Waiting_Time[index]}</td>
                  <td>{results.Response_Time[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Server Utilization</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Server #</th>
                <th>Busy Time</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {results.serverUtilization.map((util, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{util.toFixed(2)}</td>
                  <td>{(util * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Simulation Metrics</h2>
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
              <tr>
                <td>Overall Server Utilization</td>
                <td>{results.metrics.overallUtilization.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      )}
      <div>
        {results && (
          <div>
            <h2>Graphs</h2>

            {/* Interarrival Times Graph */}
            <Graph
              title="Interarrival Times"
              labels={results.patientDetails.map(
                (_, i) => `Patient ${i + 1}`
              )}
              data={results.patientDetails.map((detail) => detail.iaFinal)}
            />

            {/* Arrival Times Graph */}
            <Graph
              title="Arrival Times"
              labels={results.patientDetails.map(
                (_, i) => `Patient ${i + 1}`
              )}
              data={results.patientDetails.map((detail) => detail.arrival)}
            />

            {/* Waiting Times Graph */}
            <Graph
              title="Waiting Times"
              labels={results.patientDetails.map(
                (_, i) => `Patient ${i + 1}`
              )}
              data={results.Waiting_Time}
            />

            {/* Turnaround Times Graph */}
            <Graph
              title="Turnaround Times"
              labels={results.patientDetails.map(
                (_, i) => `Patient ${i + 1}`
              )}
              data={results.Turnaround_Time}
            />

            {/* Response Times Graph */}
            <Graph
              title="Response Times"
              labels={results.patientDetails.map(
                (_, i) => `Patient ${i + 1}`
              )}
              data={results.Response_Time}
            />

            {/* Server Utilization Graph */}
            <Graph
              title="Server Utilization"
              labels={results.serverUtilization.map(
                (_, i) => `Server ${i + 1}`
              )}
              data={results.serverUtilization}
              type="bar" // This can be set to 'line' if you prefer line chart for server utilization
            />
          </div>
        )}
      </div>

    </div>
  );
}

export default MultiServerSimulation;
