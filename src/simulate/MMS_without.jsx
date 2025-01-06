import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function MGSimulate() {
  const navigate = useNavigate();
  const [arrivalDistribution, setArrivalDistribution] = useState('Poisson');
  const [serviceDistribution, setServiceDistribution] = useState('Exponential');

  const handleSubmit = () => {
    console.log(`Navigating to /MG_exp_uni`); // Added console.log for debugging

    if (arrivalDistribution === 'Poisson' && serviceDistribution === 'Exponential') {
      navigate('/MMS_without_poisson_exp'); // Navigate when conditions are met
    } 
    if (arrivalDistribution === 'Poisson' && serviceDistribution === 'Poisson') {
      navigate('/MMS_without_poisson_poisson'); // Navigate when conditions are met
    } 
    if (arrivalDistribution === 'Exponential' && serviceDistribution === 'Poisson') {
      navigate('/MMS_without_exp_poisson'); // Navigate when conditions are met
    } 
    if (arrivalDistribution === 'Exponential' && serviceDistribution === 'Exponential') {
      navigate('/MMS_without_exp_exp'); // Navigate when conditions are met
    } 
    else {
      console.log(`Selected Arrival: ${arrivalDistribution}, Service: ${serviceDistribution}`); // Log selected values if conditions don't match
    }
  };

  return (
    <div>
      <h1>M/M/S Simulation</h1>
      <div>
        <label>Arrival Distribution: </label>
        <select 
          value={arrivalDistribution} 
          onChange={(e) => setArrivalDistribution(e.target.value)}
        >
          <option value="Poisson">Poisson</option>
          <option value="Exponential">Exponential</option>
        </select>
      </div>

      <div>
        <label>Service Distribution: </label>
        <select 
          value={serviceDistribution} 
          onChange={(e) => setServiceDistribution(e.target.value)}
        >
          {/* <option value="Poisson">Poisson</option> */}
          <option value="Exponential">Exponential</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Start Simulation</button>
    </div>
  );
}

export default MGSimulate;
