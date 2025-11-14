import React from 'react';
import { SummaryStats } from '../types';
import { generatePDF } from '../api';
import jsPDF from 'jspdf';

interface SummaryProps {
  stats: SummaryStats;
  datasetId: number;
}

const Summary: React.FC<SummaryProps> = ({ stats, datasetId }) => {
  const generateClientSidePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Equipment Report', 20, 30);
    
    // Summary Stats
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 50);
    
    doc.setFontSize(12);
    let y = 65;
    doc.text(`Total Equipment: ${stats?.total_count || 0}`, 20, y);
    y += 10;
    doc.text(`Average Flowrate: ${stats?.avg_flowrate?.toFixed(2) || '0.00'}`, 20, y);
    y += 10;
    doc.text(`Average Pressure: ${stats?.avg_pressure?.toFixed(2) || '0.00'}`, 20, y);
    y += 10;
    doc.text(`Average Temperature: ${stats?.avg_temperature?.toFixed(2) || '0.00'}`, 20, y);
    
    // Equipment Distribution
    y += 20;
    doc.setFontSize(14);
    doc.text('Equipment Distribution', 20, y);
    
    y += 15;
    doc.setFontSize(12);
    if (stats?.type_distribution) {
      Object.entries(stats.type_distribution).forEach(([type, count]) => {
        doc.text(`${type}: ${count}`, 25, y);
        y += 8;
      });
    }
    
    doc.save(`equipment_report_${datasetId}.pdf`);
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('Generating PDF for dataset ID:', datasetId);
      const blob = await generatePDF(datasetId);
      
      if (blob.size === 0) {
        console.log('Server PDF failed, using client-side generation');
        generateClientSidePDF();
        return;
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `equipment_report_${datasetId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Server PDF failed, using client-side generation:', error);
      generateClientSidePDF();
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#1e3a8a', margin: 0 }}>📊 Process Analytics Summary</h3>
        <button onClick={handleDownloadPDF} className="btn btn-secondary">
          📄 Generate Report
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.total_count || 0}</div>
          <div className="stat-label">🏭 Total Equipment</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.avg_flowrate?.toFixed(1) || '0.0'}</div>
          <div className="stat-label">💧 Avg Flowrate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.avg_pressure?.toFixed(1) || '0.0'}</div>
          <div className="stat-label">🔩 Avg Pressure</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.avg_temperature?.toFixed(1) || '0.0'}</div>
          <div className="stat-label">🌡️ Avg Temperature</div>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '20px', background: '#f8fafc' }}>
        <h4 style={{ color: '#1e3a8a', marginBottom: '15px' }}>🏢 Equipment Distribution</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {stats.type_distribution && Object.entries(stats.type_distribution).map(([type, count]) => (
            <div key={type} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'white', borderRadius: '6px' }}>
              <span>{type}</span>
              <strong style={{ color: '#3b82f6' }}>{count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;