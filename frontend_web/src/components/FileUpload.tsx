import React, { useState } from 'react';
import { uploadCSV } from '../api';
import { Dataset } from '../types';

interface FileUploadProps {
  onUploadSuccess: (dataset: Dataset) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const dataset = await uploadCSV(file, name || file.name);
      onUploadSuccess(dataset);
      setFile(null);
      setName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <h3 style={{ color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        📁 Data Upload Center
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="file-drop-zone">
          <div className="upload-icon">📊</div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              width: '100%',
              fontSize: '16px'
            }}
          />
          <p style={{ marginTop: '16px', fontSize: '1rem', opacity: '0.9', color: 'white' }}>
            Drop your CSV file here or click to browse
          </p>
          <p style={{ fontSize: '0.9rem', opacity: '0.7', color: 'white', marginTop: '8px' }}>
            Supported format: Equipment Name, Type, Flowrate, Pressure, Temperature
          </p>
        </div>
        
        <input
          type="text"
          placeholder="Enter dataset name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        />
        
        <button 
          type="submit" 
          disabled={!file || uploading} 
          className={`btn ${uploading ? 'btn-secondary' : 'btn-primary'}`}
          style={{ width: '100%', fontSize: '16px', padding: '16px' }}
        >
          {uploading ? (
            <>
              <span className="loading-spinner" style={{ marginRight: '12px' }}></span>
              Processing Data...
            </>
          ) : (
            '🚀 Start Analysis'
          )}
        </button>
      </form>
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          padding: '16px',
          borderRadius: '12px',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          ⚠️ {error}
        </div>
      )}
    </>
  );
};

export default FileUpload;