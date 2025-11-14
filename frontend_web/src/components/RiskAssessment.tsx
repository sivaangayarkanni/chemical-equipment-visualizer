import React from 'react';
import { Equipment } from '../types';

interface RiskAssessmentProps {
  equipment: Equipment[];
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ equipment }) => {
  if (!equipment || equipment.length === 0) {
    return (
      <div className="glass-card">
        <h3 style={{ color: 'white', marginBottom: '24px' }}>🛡️ Risk Assessment Dashboard</h3>
        <p style={{ color: 'white' }}>No equipment data available for risk assessment.</p>
      </div>
    );
  }

  const assessRisks = () => {
    const risks = equipment.map(item => {
      let riskLevel = 0;
      let riskFactors = [];

      // Temperature risk
      if (item.temperature > 200) {
        riskLevel += 3;
        riskFactors.push('High Temperature');
      } else if (item.temperature > 150) {
        riskLevel += 2;
        riskFactors.push('Elevated Temperature');
      }

      // Pressure risk
      if (item.pressure > 60) {
        riskLevel += 3;
        riskFactors.push('High Pressure');
      } else if (item.pressure > 40) {
        riskLevel += 2;
        riskFactors.push('Elevated Pressure');
      }

      // Flow rate risk
      if (item.flowrate > 250) {
        riskLevel += 2;
        riskFactors.push('High Flow Rate');
      }

      // Equipment type specific risks
      if (item.type === 'Reactor' && item.temperature > 180) {
        riskLevel += 2;
        riskFactors.push('Reactor Thermal Risk');
      }
      if (item.type === 'Compressor' && item.pressure > 50) {
        riskLevel += 2;
        riskFactors.push('Compressor Pressure Risk');
      }

      return {
        ...item,
        riskLevel,
        riskFactors,
        riskCategory: riskLevel >= 6 ? 'Critical' : riskLevel >= 4 ? 'High' : riskLevel >= 2 ? 'Medium' : 'Low'
      };
    });

    return risks.sort((a, b) => b.riskLevel - a.riskLevel);
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'Critical': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '⚡';
      case 'Low': return '✅';
      default: return '❓';
    }
  };

  const riskyEquipment = assessRisks();
  const criticalCount = riskyEquipment.filter(e => e.riskCategory === 'Critical').length;
  const highCount = riskyEquipment.filter(e => e.riskCategory === 'High').length;
  const mediumCount = riskyEquipment.filter(e => e.riskCategory === 'Medium').length;
  const lowCount = riskyEquipment.filter(e => e.riskCategory === 'Low').length;

  return (
    <div className="glass-card">
      <h3 style={{ color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        🛡️ Risk Assessment Dashboard
      </h3>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.1))' }}>
          <div className="stat-value" style={{ color: '#fca5a5' }}>{criticalCount}</div>
          <div className="stat-label">🚨 Critical Risk</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(194, 65, 12, 0.1))' }}>
          <div className="stat-value" style={{ color: '#fed7aa' }}>{highCount}</div>
          <div className="stat-label">⚠️ High Risk</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(180, 83, 9, 0.1))' }}>
          <div className="stat-value" style={{ color: '#fde68a' }}>{mediumCount}</div>
          <div className="stat-label">⚡ Medium Risk</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(4, 120, 87, 0.1))' }}>
          <div className="stat-value" style={{ color: '#a7f3d0' }}>{lowCount}</div>
          <div className="stat-label">✅ Low Risk</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '24px' }}>
        <h4 style={{ color: '#1f2937', marginBottom: '20px', fontSize: '1.2rem' }}>
          Equipment Risk Analysis
        </h4>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {riskyEquipment.map((item, index) => (
            <div 
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                marginBottom: '12px',
                background: index % 2 === 0 ? '#f9fafb' : 'white',
                borderRadius: '12px',
                border: `2px solid ${getRiskColor(item.riskCategory)}20`,
                borderLeft: `4px solid ${getRiskColor(item.riskCategory)}`
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{getRiskIcon(item.riskCategory)}</span>
                  <strong style={{ color: '#1f2937' }}>{item.name}</strong>
                  <span 
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'white',
                      background: getRiskColor(item.riskCategory)
                    }}
                  >
                    {item.riskCategory}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  <strong>Type:</strong> {item.type} | 
                  <strong> Temp:</strong> {item.temperature.toFixed(1)}°C | 
                  <strong> Pressure:</strong> {item.pressure.toFixed(1)} bar | 
                  <strong> Flow:</strong> {item.flowrate.toFixed(1)} L/min
                </div>
                {item.riskFactors.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '500' }}>
                      Risk Factors: {item.riskFactors.join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `conic-gradient(${getRiskColor(item.riskCategory)} ${(item.riskLevel / 10) * 360}deg, #e5e7eb 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                {item.riskLevel}/10
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;