import React, { useState } from 'react';

const MM1 = () => {
    const [meanInterarrival, setMeanInterarrival] = useState('10');
    const [meanService, setMeanService] = useState('8');
    const [interarrivalType, setInterarrivalType] = useState('Exponential');
    const [serviceType, setServiceType] = useState('Exponential');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const calculateMetrics = () => {
        if (!meanInterarrival || !meanService) {
            setError("Both mean interarrival time and mean service time must be provided.");
            setResult(null);
            return;
        }

        let lam, meu;

       
        if (interarrivalType === 'Poisson' || interarrivalType === 'Exponential') {
            lam = 1 / parseFloat(meanInterarrival);
        }
        
        if (serviceType === 'Exponential' || serviceType === 'Poisson') {
            meu = 1 / parseFloat(meanService);
        }
        

        // Utilization calculation
        const rho = lam / meu; // Utilization rate (rho)

        if (rho >= 1) {
            setError("Utilization (rho) cannot be greater than or equal to 1.  " + rho.toFixed(3) + "  lam: " + lam.toFixed(3) + "  meu: " + meu.toFixed(3));
            setResult(null);
            return;
        }

        // Calculating metrics
        const Lq = (rho ** 2) / (1 - rho); // Average number of customers in queue
        const Wq = Lq / lam; // Average wait time in queue
        const Ws = Wq + (1 / meu); // Average time spent in the system
        const Ls = Ws * lam; // Average number of customers in the system
        const idle = 1 - rho; // Proportion of time server is idle

        // Setting results
        setResult({
            Lq,
            Wq,
            Ws,
            Ls,
            idle,
            rho,
        });
        setError('');
    };

    return (
        <div>
            <h2>MM1 Queue Model</h2>
            <div>
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
                    <option value="Poisson">Poisson</option>
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
                        <p>Average number of customers in the system (Ls): {result.Ls.toFixed(3)}</p>
                        <p>Average time a customer spends in the system (Ws): {result.Ws.toFixed(3)} minutes</p>
                        <p>Average number of customers in the queue (Lq): {result.Lq.toFixed(3)}</p>
                        <p>Average time a customer spends waiting in the queue (Wq): {result.Wq.toFixed(3)} minutes</p>
                        <p>Time the server was idle: {result.idle.toFixed(3)}</p>
                        <p>Utilization (Time server was busy): {result.rho.toFixed(2)}</p>
                    </div>
                )
            )}
        </div>
    );
};

export default MM1;
