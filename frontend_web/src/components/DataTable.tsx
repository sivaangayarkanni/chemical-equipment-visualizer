import React from 'react';
import { Equipment } from '../types';

interface DataTableProps {
  equipment: Equipment[];
}

const DataTable: React.FC<DataTableProps> = ({ equipment }) => {
  if (!equipment || equipment.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <p>No equipment data available. Please upload a CSV file to view the data table.</p>
      </div>
    );
  }
  const getEquipmentBadgeClass = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'Pump': 'badge-pump',
      'Reactor': 'badge-reactor', 
      'Heat Exchanger': 'badge-heat-exchanger',
      'Compressor': 'badge-compressor',
      'Valve': 'badge-valve',
      'Distillation Column': 'badge-default',
      'Separator': 'badge-default',
      'Turbine': 'badge-compressor',
      'Filter': 'badge-default',
      'Mixer': 'badge-default'
    };
    return typeMap[type] || 'badge-default';
  };

  const getEquipmentIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'Pump': '⛽',
      'Reactor': '⚙️',
      'Heat Exchanger': '🔥',
      'Compressor': '💪',
      'Valve': '🔧',
      'Distillation Column': '🏢',
      'Separator': '🔄',
      'Turbine': '⚡',
      'Filter': '📎',
      'Mixer': '🌀'
    };
    return iconMap[type] || '⚙️';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>🏷️ Equipment Name</th>
            <th>🏢 Type</th>
            <th>💧 Flowrate (L/min)</th>
            <th>🔩 Pressure (bar)</th>
            <th>🌡️ Temperature (°C)</th>
            <th>📊 Status</th>
          </tr>
        </thead>
        <tbody>
          {equipment && equipment.map((item, index) => {
            const tempStatus = item.temperature > 150 ? 'High' : item.temperature > 100 ? 'Normal' : 'Low';
            const pressureStatus = item.pressure > 50 ? 'High' : item.pressure > 25 ? 'Normal' : 'Low';
            
            return (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getEquipmentIcon(item.type)}</span>
                    <strong>{item.name}</strong>
                  </div>
                </td>
                <td>
                  <span className={`equipment-badge ${getEquipmentBadgeClass(item.type)}`}>
                    {item.type}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {item.flowrate.toFixed(1)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                      {item.pressure.toFixed(1)}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      color: 'white',
                      background: pressureStatus === 'High' ? '#ef4444' : pressureStatus === 'Normal' ? '#10b981' : '#6b7280'
                    }}>
                      {pressureStatus}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                      {item.temperature.toFixed(1)}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      color: 'white',
                      background: tempStatus === 'High' ? '#ef4444' : tempStatus === 'Normal' ? '#10b981' : '#3b82f6'
                    }}>
                      {tempStatus}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '500' }}>Online</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;