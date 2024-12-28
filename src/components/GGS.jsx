import React, { useState } from "react";

const GGS = () => {
  const [interArrivalDistribution, setInterArrivalDistribution] = useState("gamma");
  const [serviceDistribution, setServiceDistribution] = useState("normal");

  const [meanInterArrival, setMeanInterArrival] = useState("10");
  const [varianceInterArrival, setVarianceInterArrival] = useState("20");

  const [meanService, setMeanService] = useState("8");
  const [varianceService, setVarianceService] = useState("25");

  const [minInterArrival, setMinInterArrival] = useState("");
  const [maxInterArrival, setMaxInterArrival] = useState("");

  const [minService, setMinService] = useState("");
  const [maxService, setMaxService] = useState("");

  const [servers, setServers] = useState(2);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const calculateQueueMetrics = () => {
    try {
      let lamda, mu, Ca2, Cs2;

      if (interArrivalDistribution === "uniform") {
        const min = parseFloat(minInterArrival);
        const max = parseFloat(maxInterArrival);
        lamda = 2 / (min + max);
        Ca2 = (Math.pow(max - min, 2)) / 12 / Math.pow((max + min) / 2, 2);
      } else if (interArrivalDistribution === "exponential") {
        lamda = 1 / parseFloat(meanInterArrival);
        let variance = Math.pow(parseFloat(meanInterArrival), 2);
        Ca2 = variance / Math.pow((1 / lamda), 2);
      } else if (interArrivalDistribution === "poisson") {
        lamda = 1 / parseFloat(meanInterArrival);
        let variance = parseFloat(meanInterArrival);
        Ca2 = variance / Math.pow((1 / lamda), 2);
      } else {
        lamda = 1 / parseFloat(meanInterArrival);
        Ca2 = parseFloat(varianceInterArrival) / Math.pow(1 / lamda, 2);
      }

      if (serviceDistribution === "uniform") {
        const min = parseFloat(minService);
        const max = parseFloat(maxService);
        mu = 2 / (min + max);
        Cs2 = (Math.pow(max - min, 2)) / 12 / Math.pow((max + min) / 2, 2);
      } else if (serviceDistribution === "exponential") {
        mu = 1 / parseFloat(meanService);
        let variance = Math.pow(parseFloat(meanService), 2);
        Cs2 = variance / Math.pow((1 / mu), 2);
      } else if (serviceDistribution === "poisson") {
        mu = 1 / parseFloat(meanService);
        let variance = parseFloat(meanService);
        Cs2 = variance / Math.pow((1 / mu), 2);
      } else {
        mu = 1 / parseFloat(meanService);
        Cs2 = parseFloat(varianceService) / Math.pow(1 / mu, 2);
      }

      const s = parseInt(servers);
      const rho = lamda / (s * mu);

      if (s <= 0) {
        setError("Number of servers must be at least 1.");
        return;
      }

      if (rho >= 1) {
        setError(
          "System is overloaded (rho >= 1). Infinite queue and wait times expected."
        );
        return;
      }

      const factorial = (n) => {
        return n <= 1 ? 1 : n * factorial(n - 1);
      };

      let P0_inv = 0;
      for (let k = 0; k < s; k++) {
        P0_inv += (s * rho) ** k / factorial(k);
      }
      P0_inv += (s * rho) ** s / (factorial(s) * (1 - rho));
      const P0 = 1 / P0_inv;

      console.log(P0);
      
      const Lq1 =
        P0 *
        (((lamda / mu) ** servers * rho) /
          (factorial(servers) * (1 - rho) ** 2));
      console.log(Lq1)
      const Wq1 = Lq1 / lamda; 
      const Wq = Wq1 * ((Ca2 + Cs2) / 2);
      console.log(Wq);
      const Lq = Wq * lamda;
      const Ws = Wq + 1 / mu;
      const Ls = lamda * Ws;
      const idle = 1 - rho;

      setResult({
        rho,
        Ca2,
        Cs2,
        Lq,
        Wq,
        Ws,
        Ls,
        idle,
      });
      setError(null);
    } catch (err) {
      setError("Error in calculation. Please check your input values." + err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>G/G/s Queue Calculator</h2>

      <div>
        <h3>Inter-arrival Time Distribution</h3>
        <label>
          Distribution Type:
          <select
            value={interArrivalDistribution}
            onChange={(e) => setInterArrivalDistribution(e.target.value)}
          >
            <option value="gamma">Gamma</option>
            <option value="uniform">Uniform</option>
            <option value="normal">Normal</option>
            <option value="exponential">Exponential</option>
            <option value="poisson">Poisson</option>
          </select>
        </label>

        {(interArrivalDistribution === "gamma" || interArrivalDistribution == "normal") && (
          <>
            <label>
              Mean Inter-arrival Time:
              <input
                type="number"
                value={meanInterArrival}
                onChange={(e) => setMeanInterArrival(e.target.value)}
              />
            </label>
            <label>
              Variance Inter-arrival Time:
              <input
                type="number"
                value={varianceInterArrival}
                onChange={(e) => setVarianceInterArrival(e.target.value)}
              />
            </label>
          </>
        )}

        {interArrivalDistribution === "uniform" && (
          <>
            <label>
              Min Inter-arrival Time:
              <input
                type="number"
                value={minInterArrival}
                onChange={(e) => setMinInterArrival(e.target.value)}
              />
            </label>
            <label>
              Max Inter-arrival Time:
              <input
                type="number"
                value={maxInterArrival}
                onChange={(e) => setMaxInterArrival(e.target.value)}
              />
            </label>
          </>
        )}

        {(interArrivalDistribution === "exponential" ||
          interArrivalDistribution === "poisson") && (
            <>
              <label>
                Mean Inter-arrival Time:
                <input
                  type="number"
                  value={meanInterArrival}
                  onChange={(e) => setMeanInterArrival(e.target.value)}
                />
              </label>
            </>
          )}
      </div>

      <div>
        <h3>Service Time Distribution</h3>
        <label>
          Distribution Type:
          <select
            value={serviceDistribution}
            onChange={(e) => setServiceDistribution(e.target.value)}
          >
            <option value="gamma">Gamma</option>
            <option value="uniform">Uniform</option>
            <option value="normal">Normal</option>
            <option value="exponential">Exponential</option>
            <option value="poisson">Poisson</option>
          </select>
        </label>

        {(serviceDistribution === "gamma" || serviceDistribution == "normal") && (
          <>
            <label>
              Mean Service Time:
              <input
                type="number"
                value={meanService}
                onChange={(e) => setMeanService(e.target.value)}
              />
            </label>
            <label>
              Variance Service Time:
              <input
                type="number"
                value={varianceService}
                onChange={(e) => setVarianceService(e.target.value)}
              />
            </label>
          </>
        )}

        {serviceDistribution === "uniform" && (
          <>
            <label>
              Min Service Time:
              <input
                type="number"
                value={minService}
                onChange={(e) => setMinService(e.target.value)}
              />
            </label>
            <label>
              Max Service Time:
              <input
                type="number"
                value={maxService}
                onChange={(e) => setMaxService(e.target.value)}
              />
            </label>
          </>
        )}

        {(serviceDistribution === "exponential" ||
          serviceDistribution === "poisson") && (
            <>
              <label>
                Mean Service Time:
                <input
                  type="number"
                  value={meanService}
                  onChange={(e) => setMeanService(e.target.value)}
                />
              </label>
            </>
          )}
      </div>

      <div>
        <h3>Number of Servers</h3>
        <label>
          Servers (s):
          <input
            type="number"
            value={servers}
            onChange={(e) => setServers(e.target.value)}
          />
        </label>
      </div>

      <button onClick={calculateQueueMetrics}>Calculate</button>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        result && (
          <div style={{ marginTop: "20px" }}>
            <h3>Performance Metrics</h3>
            <p>
              Average number of customers in the system (Ls):{" "}
              {result.Ls.toFixed(3)}
            </p>
            <p>
              Average time a customer spends in the system (Ws):{" "}
              {result.Ws.toFixed(3)} minutes
            </p>
            <p>
              Average number of customers in the queue (Lq):
              {result.Lq.toFixed(3)}
            </p>
            <p>
              Average time a customer spends waiting in the queue (Wq):{" "}
              {result.Wq.toFixed(3)} minutes
            </p>
            <p>Time the server was idle: {result.idle.toFixed(3)}</p>
            <p>Time the server was busy: {result.rho.toFixed(2)}</p>
          </div>
        )
      )}
    </div>
  );
};

export default GGS;
