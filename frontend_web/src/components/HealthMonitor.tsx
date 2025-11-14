import React, { useState, useEffect } from 'react';
import { Equipment } from '../types';

interface DigitalTwinProps {
  equipment: Equipment[];
}

const DigitalTwin: React.FC<DigitalTwinProps> = ({ equipment }) => {
  const [simulation, setSimulation] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const runSimulation = () => {
      const totalEnergy = equipment.reduce((sum, item) => 
        sum + (item.temperature * item.pressure * item.flowrate / 1000), 0);
      
      const efficiency = Math.min(95, (totalEnergy / equipment.length) * 0.8);
      const carbonFootprint = totalEnergy * 0.45; // kg CO2
      const powerConsumption = totalEnergy * 1.2; // kWh
      
      setSimulation({
        totalEnergy: totalEnergy.toFixed(1),
        efficiency: efficiency.toFixed(1),
        carbonFootprint: carbonFootprint.toFixed(2),
        powerConsumption: powerConsumption.toFixed(1),
        timestamp: new Date().toLocaleTimeString()
      });
    };

    if (isRunning) {
      runSimulation();
      const interval = setInterval(runSimulation, 2000);
      return () => clearInterval(interval);
    }
  }, [equipment, isRunning]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#10b981' }}>🔬 Digital Twin Simulation</h3>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          style={{
            background: isRunning ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 16px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
      </div>
      
      {isRunning && simulation.totalEnergy ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#34d399' }}>{simulation.totalEnergy}</div>
            <div style={{ fontSize: '0.9rem', color: '#a7f3d0' }}>kW Total Energy</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22d3ee' }}>{simulation.efficiency}%</div>
            <div style={{ fontSize: '0.9rem', color: '#a5f3fc' }}>System Efficiency</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fbbf24' }}>{simulation.powerConsumption}</div>
            <div style={{ fontSize: '0.9rem', color: '#fde68a' }}>kWh/Hour</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(139, 69, 19, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a78bfa' }}>{simulation.carbonFootprint}</div>
            <div style={{ fontSize: '0.9rem', color: '#c4b5fd' }}>kg CO₂/hr</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6ee7b7' }}>
          🎯 Click Start to begin real-time process simulation
        </div>
      )}
      
      {isRunning && (
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: '#a7f3d0' }}>
          Last updated: {simulation.timestamp}
        </div>
      )}
    </div>
  );
};

export default DigitalTwin;