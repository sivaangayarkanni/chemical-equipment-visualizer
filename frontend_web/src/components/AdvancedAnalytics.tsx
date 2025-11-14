import React from 'react';
import { SummaryStats, Equipment } from '../types';

interface AdvancedAnalyticsProps {
  stats: SummaryStats;
  equipment: Equipment[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ stats, equipment }) => {
  const calculateEfficiencyMetrics = () => {
    const avgTemp = stats?.avg_temperature || 0;
    const avgPressure = stats?.avg_pressure || 0;
    const avgFlowrate = stats?.avg_flowrate || 0;
    
    // Efficiency calculations (simplified for demo)
    const thermalEfficiency = Math.min(100, (avgTemp / 250) * 100);
    const pressureEfficiency = Math.min(100, (avgPressure / 100) * 100);
    const flowEfficiency = Math.min(100, (avgFlowrate / 300) * 100);
    const overallEfficiency = (thermalEfficiency + pressureEfficiency + flowEfficiency) / 3;
    
    return {
      thermal: thermalEfficiency,
      pressure: pressureEfficiency,
      flow: flowEfficiency,
      overall: overallEfficiency
    };
  };

  const calculatePerformanceMetrics = () => {
    const equipmentCount = equipment?.length || 0;
    const typeVariety = stats?.type_distribution ? Object.keys(stats.type_distribution).length : 0;
    
    // Performance indicators
    const systemComplexity = (typeVariety / 10) * 100;
    const operationalLoad = Math.min(100, (equipmentCount / 20) * 100);
    const avgPressure = stats?.avg_pressure || 0;
    const avgTemp = stats?.avg_temperature || 1;
    const balanceScore = 100 - Math.abs(50 - ((avgPressure / avgTemp) * 100));
    
    return {
      complexity: systemComplexity,
      load: operationalLoad,
      balance: balanceScore,
      reliability: (85 + Math.random() * 10) // Simulated reliability score
    };
  };

  const getRiskAssessment = () => {
    if (!equipment || equipment.length === 0) {
      return {
        temperature: 0,
        pressure: 0,
        overall: 0,
        level: 'Low'
      };
    }
    
    const highTempEquipment = equipment.filter(e => e.temperature > 150).length;
    const highPressureEquipment = equipment.filter(e => e.pressure > 50).length;
    
    const tempRisk = (highTempEquipment / equipment.length) * 100;
    const pressureRisk = (highPressureEquipment / equipment.length) * 100;
    const overallRisk = (tempRisk + pressureRisk) / 2;
    
    return {
      temperature: tempRisk,
      pressure: pressureRisk,
      overall: overallRisk,
      level: overallRisk > 60 ? 'High' : overallRisk > 30 ? 'Medium' : 'Low'
    };
  };

  const efficiency = calculateEfficiencyMetrics();
  const performance = calculatePerformanceMetrics();
  const risk = getRiskAssessment();

  return (
    <div className="analysis-section">
      <div className="glass-card efficiency-card">
        <h3 style={{ color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          ⚡ System Efficiency Analysis
        </h3>
        
        <div className="metric-row">
          <span className="metric-label">🌡️ Thermal Efficiency</span>
          <span className="metric-value">{efficiency.thermal.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${efficiency.thermal}%` }}></div>
        </div>

        <div className="metric-row">
          <span className="metric-label">🔧 Pressure Efficiency</span>
          <span className="metric-value">{efficiency.pressure.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${efficiency.pressure}%` }}></div>
        </div>

        <div className="metric-row">
          <span className="metric-label">💧 Flow Efficiency</span>
          <span className="metric-value">{efficiency.flow.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${efficiency.flow}%` }}></div>
        </div>

        <div className="metric-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="metric-label">🎯 Overall Efficiency</span>
          <span className="metric-value" style={{ fontSize: '1.3rem', color: '#10b981' }}>
            {efficiency.overall.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="glass-card performance-card">
        <h3 style={{ color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          📊 Performance Metrics
        </h3>
        
        <div className="metric-row">
          <span className="metric-label">🔄 System Complexity</span>
          <span className="metric-value">{performance.complexity.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${performance.complexity}%` }}></div>
        </div>

        <div className="metric-row">
          <span className="metric-label">⚙️ Operational Load</span>
          <span className="metric-value">{performance.load.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${performance.load}%` }}></div>
        </div>

        <div className="metric-row">
          <span className="metric-label">⚖️ System Balance</span>
          <span className="metric-value">{performance.balance.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${performance.balance}%` }}></div>
        </div>

        <div className="metric-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="metric-label">🛡️ Reliability Score</span>
          <span className="metric-value" style={{ fontSize: '1.3rem', color: '#f59e0b' }}>
            {performance.reliability.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;