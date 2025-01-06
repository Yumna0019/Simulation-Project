import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function GMSimulate() {
  const navigate = useNavigate();
  const [arrivalDistribution, setArrivalDistribution] = useState('Uniform');
  const [serviceDistribution, setServiceDistribution] = useState('Exponential');

  const handleSubmit = () => {

    if (arrivalDistribution === 'Normal' && serviceDistribution === 'Exponential') {
      navigate('/GM_without_norm_exp'); // Navigate when conditions are met
    } 
    if (arrivalDistribution === 'Normal' && serviceDistribution === 'Poisson') {
      navigate('/GM_without_norm_poisson'); // Navigate when conditions are met
    } 
    if (arrivalDistribution === 'Uniform' && serviceDistribution === 'Exponential') {
      navigate('/GM_without_uni_exp'); // Navigate when conditions are met
    } 
    if (arrivalDistribution === 'Uniform' && serviceDistribution === 'Poisson') {
      navigate('/GM_without_uni_poisson'); // Navigate when conditions are met
    } 
    else {
      console.log(`Selected Arrival: ${arrivalDistribution}, Service: ${serviceDistribution}`); // Log selected values if conditions don't match
    }
  };

  return (
    <div>
      <h1>G/M/S Simulation</h1>
      <div>
        <label>Arrival Distribution: </label>
        <select 
          value={arrivalDistribution} 
          onChange={(e) => setArrivalDistribution(e.target.value)}
        >
          <option value="Normal">Normal</option>
          <option value="Uniform">Uniform</option>
        </select>
      </div>

      <div>
        <label>Service Distribution: </label>
        <select 
          value={serviceDistribution} 
          onChange={(e) => setServiceDistribution(e.target.value)}
        >
          <option value="Exponential">Exponential</option>
          {/* <option value="Poisson">Poisson</option> */}
        </select>
      </div>

      <button onClick={handleSubmit}>Start Simulation</button>
    </div>
  );
}

export default GMSimulate;
