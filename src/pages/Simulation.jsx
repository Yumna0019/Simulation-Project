import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function Simulation() {
  const navigate = useNavigate();
  return (
    <div className="container">
    <h1>Select a Simulator</h1>
    <div className="model-buttons">
        <button className='model-button' onClick={() => navigate('/mmSimulate')}>M/M/S</button>
        <button className='model-button' onClick={() => navigate('/MG')}>M/G/S</button>
        <button className='model-button' onClick={() => navigate('/GG')}>G/G/S</button>
        <button className='model-button' onClick={() => navigate('/GM')}>G/M/S</button>
    </div>
</div>
  )
}
