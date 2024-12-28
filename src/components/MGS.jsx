import React, { useState } from "react";

const MGS = () => {
  const [arrivalDistribution, setArrivalDistribution] = useState("poisson");
  const [interArrivalTime, setInterArrivalTime] = useState("0.3");
  const [serviceDistribution, setServiceDistribution] = useState("normal");
  const [meanServiceTime, setMeanServiceTime] = useState("0.25");
  const [stdDevServiceTime, setStdDevServiceTime] = useState("0.25");
  const [minServiceTime, setMinServiceTime] = useState("");
  const [maxServiceTime, setMaxServiceTime] = useState("");
  const [shapeParam, setShapeParam] = useState("");
  const [scaleParam, setScaleParam] = useState("");
  const [numServers, setNumServers] = useState("2");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateMetrics = () => {
    let lambdaRate, mu, sigmaS2;

    switch (arrivalDistribution) {
      case "exponential":
        lambdaRate = 1 / parseFloat(interArrivalTime);
        break;

      case "poisson":
        lambdaRate = 1 / parseFloat(interArrivalTime);
        break;
    }

    if (serviceDistribution === "normal") {
      mu = 1 / meanServiceTime;
      sigmaS2 = stdDevServiceTime ** 2;
    } else if (serviceDistribution === "uniform") {
      mu = 1 / ((parseFloat(minServiceTime) + parseFloat(maxServiceTime)) / 2);
      sigmaS2 = (maxServiceTime - minServiceTime) ** 2 / 12;
    } else if (serviceDistribution === "gamma") {
      mu = 1 / (shapeParam * scaleParam);
      sigmaS2 = shapeParam * scaleParam ** 2;
    }
    else if (serviceDistribution === "exponential") {
      const meanExpoServiceTime = 1 / meanServiceTime
      mu = 1 / meanExpoServiceTime;
      sigmaS2 = 1 / Math.pow(meanServiceTime, 2);
    }

    else if (serviceDistribution === "poisson") {
      const meanPoissonServiceTime = meanServiceTime
      mu = 1 / meanPoissonServiceTime;
      sigmaS2 = meanServiceTime;

    } else {
      setError("Unsupported distribution type.");
      return;
    }

    const s = parseInt(numServers);
    const rho = lambdaRate / (s * mu);

    if (rho >= 1) {
      setError(
        "Utilization factor cannot be 1 or greater. Please adjust λ or the number of servers."
      );
      return;
    }

    // Helper function to calculate factorial
    const factorial = (n) => {
      return n <= 1 ? 1 : n * factorial(n - 1);
    };

    // Corrected calculation for P0
    let P0_inv = 0;
    for (let k = 0; k < numServers; k++) {
      P0_inv += (numServers * rho) ** k / factorial(k);
    }
    P0_inv +=
      (numServers * rho) ** numServers / (factorial(numServers) * (1 - rho));
    const P0 = 1 / P0_inv;

    console.log(P0);

    // Calculating metrics
    const Lq = P0 * (((lambdaRate / mu) ** numServers * rho) / (factorial(numServers) * (1 - rho) ** 2));
    const Wq = Lq / lambdaRate; // Average wait in queue
    const W = Wq + 1 / mu; // Average time spent in the system
    const L = lambdaRate * W; // Average number of customers in the system
    const idleTime = 1 - rho; // Proportion of time server is idle

    // Set results
    setResult({
      L,
      W,
      Lq,
      Wq,
      idleTime,
      utilization: rho,
    });
    setError(""); // Clear previous errors
  };

  return (
    <div>
      <h2>M/G/s Queue Model</h2>
      <div>
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
        {serviceDistribution === "uniform" && (
          <>
            <label>
              Minimum Service Time:
              <input
                type="number"
                value={minServiceTime}
                onChange={(e) => setMinServiceTime(e.target.value)}
              />
            </label>
            <label>
              Maximum Service Time:
              <input
                type="number"
                value={maxServiceTime}
                onChange={(e) => setMaxServiceTime(e.target.value)}
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
                value={shapeParam}
                onChange={(e) => setShapeParam(e.target.value)}
              />
            </label>
            <label>
              Scale Parameter (θ):
              <input
                type="number"
                value={scaleParam}
                onChange={(e) => setScaleParam(e.target.value)}
              />
            </label>
          </>
        )}
        <label>
          Number of Servers (s):
          <input
            type="number"
            value={numServers}
            onChange={(e) => setNumServers(e.target.value)}
          />
        </label>
        <button onClick={calculateMetrics}>Calculate</button>
      </div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        result && (
          <div style={{ marginTop: "20px" }}>
            <h3>Performance Metrics</h3>
            <p>
              Average number of customers in the system (Ls):{" "}
              {result.L.toFixed(3)}
            </p>
            <p>
              Average time a customer spends in the system (Ws):{" "}
              {result.W.toFixed(3)} minutes
            </p>
            <p>
              Average number of customers in the queue (Lq):
              {result.Lq.toFixed(3)}
            </p>
            <p>
              Average time a customer spends waiting in the queue (Wq):{" "}
              {result.Wq.toFixed(3)} minutes
            </p>
            <p>Time the server was idle:{result.idleTime.toFixed(3)}</p>
            <p>Time the server was busy: {result.utilization.toFixed(2)}</p>
            {/* <p>Coefficient of variation of service time (Cs²): {result.Cs2.toFixed(3)}</p>
                <p>Coefficient of variation of arrival process (Ca²): {result.Ca2.toFixed(3)}</p> */}
          </div>
        )
      )}
    </div>
  );
};

export default MGS;
