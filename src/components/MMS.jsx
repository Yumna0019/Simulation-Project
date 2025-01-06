import React, { useState } from 'react';

const MMS = () => {
    const [numServers, setNumServers] = useState('2');
    const [meanInterarrival, setMeanInterarrival] = useState('2');
    const [meanService, setMeanService] = useState('1.8');
    const [interarrivalType, setInterarrivalType] = useState('Exponential'); // Dropdown for interarrival type
    const [serviceType, setServiceType] = useState('Exponential'); // Dropdown for service type
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const calculateMetrics = () => {
        let lamb, meu;
        
        // Determine lambda based on interarrivalType
        
        if (interarrivalType === 'Poisson' || interarrivalType === 'Exponential') {
            lamb = 1 / parseFloat(meanInterarrival);
        }
        
        if (serviceType === 'Exponential' || serviceType === 'Poisson') {
            meu = 1 / parseFloat(meanService);
        }

        const S = parseInt(numServers); // Number of servers

        if (isNaN(lamb) || isNaN(meu) || isNaN(S) || S <= 0) {
            setError("Please enter valid positive numbers for all fields.");
            setResult(null);
            return;
        }

        const rho = lamb / (S * meu); // Utilization rate (rho)
        if (rho >= 1) {
            setError("Utilization (rho) cannot be greater than or equal to 1.");
            setResult(null);
            return;
        }

        // Corrected calculation for P0
        let P0_inv = 0;
        for (let k = 0; k < S; k++) {
            P0_inv += ((S * rho) ** k) / factorial(k);
        }
        P0_inv += ((S * rho) ** S) / (factorial(S) * (1 - rho));
        const P0 = 1 / P0_inv;

        // Calculating metrics
        const Lq = P0 * (((lamb / meu) ** S * rho) / (factorial(S) * (1 - rho) ** 2));
        const Wq = Lq / lamb; // Average wait in queue
        const Ws = Wq + (1 / meu); // Average time spent in the system
        const Ls = lamb * Ws; // Average number of customers in the system
        const idle = 1 - rho; // Proportion of time server is idle

        // Setting results
        setResult({
            P0,
            Lq,
            Wq,
            Ws,
            Ls,
            idle,
            rho,
        });
        setError(''); // Clear previous errors
    };

    // Helper function to calculate factorial
    const factorial = (n) => {
        return n <= 1 ? 1 : n * factorial(n - 1);
    };

    return (
        <div>
            <h2>M/M/S Queue Model</h2>
            <div>
                <label>
                    Number of Servers (S):
                    <input
                        type="number"
                        value={numServers}
                        onChange={(e) => setNumServers(e.target.value)}
                        min="1"
                    />
                </label>
                <br />
                <label>
                    Mean Interarrival Time:
                    <select
                        value={interarrivalType}
                        onChange={(e) => setInterarrivalType(e.target.value)}
                    >
                        <option value="Exponential">Exponential</option>
                        <option value="Poisson">Poisson</option>
                    </select>
                    <input
                        type="number"
                        value={meanInterarrival}
                        onChange={(e) => setMeanInterarrival(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Mean Service Time:
                    <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                    >
                        <option value="Exponential">Exponential</option>
                        {/* <option value="Poisson">Poisson</option> */}
                    </select>
                    <input
                        type="number"
                        value={meanService}
                        onChange={(e) => setMeanService(e.target.value)}
                    />
                </label>
                <br />
                <button onClick={calculateMetrics}>Calculate</button>
            </div>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                result && (
                    <div style={{ marginTop: "20px" }}>
                        <h3>Performance Metrics</h3>
                        <p>Probability of zero customers in the system (P0): {result.P0.toFixed(3)}</p>
                        <p>Average number of customers in the system (Ls): {result.Ls.toFixed(3)}</p>
                        <p>Average time a customer spends in the system (Ws): {result.Ws.toFixed(3)} minutes</p>
                        <p>Average number of customers in the queue (Lq): {result.Lq.toFixed(3)}</p>
                        <p>Average time a customer spends waiting in the queue (Wq): {result.Wq.toFixed(3)} minutes</p>
                        <p>Time the server was idle: {result.idle.toFixed(3)}</p>
                        <p>Time the server was busy: {result.rho.toFixed(3)}</p>
                    </div>
                )
            )}
        </div>
    );
};

export default MMS;
