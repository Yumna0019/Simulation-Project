import React, { useState } from "react";
import "../css/ggs.css";

const MG1 = () => {
  const [arrivalDistribution, setArrivalDistribution] = useState("poisson");
  const [interArrivalTime, setInterArrivalTime] = useState("0.3");
  const [serviceDistribution, setServiceDistribution] = useState("normal");
  const [meanServiceTime, setMeanServiceTime] = useState("0.25");
  const [stdDevServiceTime, setStdDevServiceTime] = useState("0.25");
  const [uniformA, setUniformA] = useState("");
  const [uniformB, setUniformB] = useState("");
  const [gammaK, setGammaK] = useState("");
  const [gammaTheta, setGammaTheta] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateQueueParameters = () => {

    let lambdaRate, mu, sigma_s2;

    switch (arrivalDistribution) {
      case "exponential":
        lambdaRate = 1 / parseFloat(interArrivalTime);
        break;

      case "poisson":
        lambdaRate = 1 / parseFloat(interArrivalTime);
        break;
    }

    switch (serviceDistribution) {
      case "normal":
        mu = 1 / parseFloat(meanServiceTime);
        sigma_s2 = Math.pow(parseFloat(stdDevServiceTime), 2);
        break;

      case "uniform":
        const a = parseFloat(uniformA);
        const b = parseFloat(uniformB);
        const meanUniformServiceTime = (a + b) / 2;
        mu = 1 / meanUniformServiceTime;
        sigma_s2 = Math.pow(b - a, 2) / 12;
        break;

      case "exponential":
        const meanExpoServiceTime = 1 / meanServiceTime
        mu = 1 / meanExpoServiceTime;
        sigma_s2 = 1 / Math.pow(meanServiceTime, 2);
        break;

      case "poisson":
        const meanPoissonServiceTime = meanServiceTime
        mu = 1 / meanPoissonServiceTime;
        sigma_s2 = meanServiceTime;
        break;

      case "gamma":
        const k = parseFloat(gammaK);
        const theta = parseFloat(gammaTheta);
        const meanGammaServiceTime = k * theta;
        mu = 1 / meanGammaServiceTime;
        sigma_s2 = k * Math.pow(theta, 2);
        break;

      default:
        setError("Unsupported distribution type");
        return;
    }
    console.log(lambdaRate)
    console.log(mu)
    const rho = lambdaRate / mu;
    console.log(rho)
    if (rho >= 1) {
      setError("Utilization factor cannot be 1 or greater. Please adjust λ or the number of servers.");
      setResult(null);
      return;
    }

    const L =
      rho +
      (Math.pow(lambdaRate, 2) * sigma_s2 + Math.pow(rho, 2)) / (2 * (1 - rho));
    const W = L / lambdaRate;
    const L_q = L - rho;
    const W_q = L_q / lambdaRate;
    const idle_time = 1 - rho;

    // Setting results with the correct keys
    setResult({ L, W, L_q, W_q, idle_time, rho });
    setError(""); // Clear any previous errors
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>M/G/1 Queue Calculator</h2>

      <div>
        <label>
          Inter-arrival Time:
          <select
            value={arrivalDistribution}
            onChange={(e) => setArrivalDistribution(e.target.value)}
          >
            <option value="poisson">Poisson</option>
            <option value="exponential">Exponential</option>

          </select>

        </label>
      </div>

      {arrivalDistribution === "exponential" && (
        <>
          <label>
            Inter Arrival Time:
            <input
              type="number"
              value={interArrivalTime}
              onChange={(e) => setInterArrivalTime(e.target.value)}
            />
          </label>

        </>
      )}
      {arrivalDistribution === "poisson" && (
        <>
          <label>
            Inter Arrival Time:
            <input
              type="number"
              value={interArrivalTime}
              onChange={(e) => setInterArrivalTime(e.target.value)}
            />
          </label>

        </>
      )}

      <div>
        <label>
          Service Time Distribution:
          <select
            value={serviceDistribution}
            onChange={(e) => setServiceDistribution(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="uniform">Uniform</option>
            <option value="gamma">Gamma</option>
            <option value="exponential">Exponential</option>
            <option value="poisson">Poisson</option>

          </select>
        </label>
      </div>

      {serviceDistribution === "normal" && (
        <>
          <label>
            Mean Service Time:
            <input
              type="number"
              value={meanServiceTime}
              onChange={(e) => setMeanServiceTime(e.target.value)}
            />
          </label>
          <label>
            Standard Deviation of Service Time:
            <input
              type="number"
              value={stdDevServiceTime}
              onChange={(e) => setStdDevServiceTime(e.target.value)}
            />
          </label>
        </>
      )}

      {serviceDistribution === "exponential" && (
        <>
          <label>
            Mean Service Time:
            <input
              type="number"
              value={meanServiceTime}
              onChange={(e) => setMeanServiceTime(e.target.value)}
            />
          </label>

        </>
      )}
      {serviceDistribution === "poisson" && (
        <>
          <label>
            Mean Service Time:
            <input
              type="number"
              value={meanServiceTime}
              onChange={(e) => setMeanServiceTime(e.target.value)}
            />
          </label>

        </>
      )}

      {serviceDistribution === "uniform" && (
        <>
          <label>
            Minimum Service Time (a):
            <input
              type="number"
              value={uniformA}
              onChange={(e) => setUniformA(e.target.value)}
            />
          </label>
          <label>
            Maximum Service Time (b):
            <input
              type="number"
              value={uniformB}
              onChange={(e) => setUniformB(e.target.value)}
            />
          </label>
        </>
      )}

      {serviceDistribution === "gamma" && (
        <>
          <label>
            Shape Parameter (k):
            <input
              type="number"
              value={gammaK}
              onChange={(e) => setGammaK(e.target.value)}
            />
          </label>
          <label>
            Scale Parameter (θ):
            <input
              type="number"
              value={gammaTheta}
              onChange={(e) => setGammaTheta(e.target.value)}
            />
          </label>
        </>
      )}

      <button onClick={calculateQueueParameters}>Calculate</button>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        result && (
          <div style={{ marginTop: "20px" }}>
            <h3>Performance Metrics</h3>
            <p>
              Average number of customers in the system (L):{" "}
              {result.L.toFixed(3)}
            </p>
            <p>
              Average time a customer spends in the system (W):{" "}
              {result.W.toFixed(3)} minutes
            </p>
            <p>
              Average number of customers in the queue (Lq):{" "}
              {result.L_q.toFixed(3)}
            </p>
            <p>
              Average time a customer spends waiting in the queue (Wq):{" "}
              {result.W_q.toFixed(3)} minutes
            </p>
            <p>Time the server was idle: {result.idle_time.toFixed(3)}</p>
            <p>Time the server was busy: {result.rho.toFixed(2)}</p>
          </div>
        )
      )}
    </div>
  );
};

export default MG1;
