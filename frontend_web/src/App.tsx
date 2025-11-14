import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import Charts from './components/Charts';
import Summary from './components/Summary';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import RiskAssessment from './components/RiskAssessment';
import DigitalTwin from './components/HealthMonitor';
import PredictiveMaintenance from './components/PredictiveMaintenance';
import Equipment3D from './components/Equipment3D';
import { Dataset } from './types';
import { getDatasets } from './api';

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await getDatasets();
      setDatasets(data);
      if (data.length > 0) {
        setSelectedDataset(data[0]);
      }
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (dataset: Dataset) => {
    setDatasets([dataset, ...datasets.slice(0, 4)]);
    setSelectedDataset(dataset);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>⚗️ ChemLab Analytics Pro</h1>
        <p>Advanced Chemical Process Intelligence & Risk Assessment Platform</p>
      </div>
      
      <div className="main-content">
        <div className="glass-card upload-section">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        
        {datasets.length > 0 && (
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              📊 Dataset Management
            </h3>
            <select 
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '14px',
                minWidth: '300px'
              }}
              value={selectedDataset?.id || ''} 
              onChange={(e) => {
                const dataset = datasets.find(d => d.id === parseInt(e.target.value));
                setSelectedDataset(dataset || null);
              }}
            >
              {datasets.map(dataset => (
                <option key={dataset.id} value={dataset.id} style={{ color: '#1f2937' }}>
                  {dataset.name} ({new Date(dataset.uploaded_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        )}
        
        {selectedDataset && (
          <>
            <Summary stats={selectedDataset.summary_stats} datasetId={selectedDataset.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <DigitalTwin equipment={selectedDataset.equipment} />
              <PredictiveMaintenance equipment={selectedDataset.equipment} />
            </div>
            <Equipment3D equipment={selectedDataset.equipment} />
            <AdvancedAnalytics stats={selectedDataset.summary_stats} equipment={selectedDataset.equipment} />
            <Charts stats={selectedDataset.summary_stats} />
            <RiskAssessment equipment={selectedDataset.equipment} />
            <div className="data-table-container">
              <div style={{ padding: '24px 32px 0' }}>
                <h3 style={{ color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  📋 Equipment Inventory Database
                </h3>
              </div>
              <DataTable equipment={selectedDataset.equipment} />
            </div>
          </>
        )}
        
        {datasets.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon">🧪</div>
            <h3>Welcome to ChemLab Analytics Pro</h3>
            <p>Upload your chemical equipment data to unlock advanced analytics, risk assessment, and performance insights for your process systems.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
