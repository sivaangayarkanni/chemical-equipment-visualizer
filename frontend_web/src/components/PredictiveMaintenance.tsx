import React from 'react';
import { Equipment } from '../types';

interface PredictiveMaintenanceProps {
  equipment: Equipment[];
}

const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({ equipment }) => {
  const predictMaintenance = (item: Equipment) => {
    // Simple ML-like algorithm for maintenance prediction
    const tempScore = item.temperature > 150 ? (item.temperature - 150) / 50 : 0;
    const pressureScore = item.pressure > 40 ? (item.pressure - 40) / 20 : 0;
    const flowScore = item.flowrate < 100 ? (100 - item.flowrate) / 50 : 0;
    
    const totalScore = (tempScore + pressureScore + flowScore) * 100;
    const daysUntilMaintenance = Math.max(7, 90 - Math.floor(totalScore));
    
    return {
      score: Math.min(100, totalScore),
      daysUntil: daysUntilMaintenance,
      priority: totalScore > 70 ? 'High' : totalScore > 40 ? 'Medium' : 'Low'
    };
  };

  const maintenanceData = equipment.map(item => ({
    ...item,
    maintenance: predictMaintenance(item)
  })).sort((a, b) => b.maintenance.score - a.maintenance.score);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      color: 'white'
    }}>
      <h3 style={{ color: '#a78bfa', marginBottom: '20px', margin: 0 }}>🤖 AI Predictive Maintenance</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {maintenanceData.slice(0, 5).map((item, index) => (
          <div key={item.id} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: `1px solid ${item.maintenance.priority === 'High' ? 'rgba(239, 68, 68, 0.5)' : 
                                 item.maintenance.priority === 'Medium' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                  Maintenance in {item.maintenance.daysUntil} days
                </div>
              </div>
              <div style={{
                background: `conic-gradient(${item.maintenance.priority === 'High' ? '#ef4444' : 
                                             item.maintenance.priority === 'Medium' ? '#f59e0b' : '#10b981'} ${item.maintenance.score * 3.6}deg, #374151 0deg)`,
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {Math.round(item.maintenance.score)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveMaintenance;