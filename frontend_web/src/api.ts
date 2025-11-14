import axios from 'axios';
import { Dataset } from './types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  auth: {
    username: 'admin',
    password: 'admin123'
  }
});

export const uploadCSV = async (file: File, name?: string): Promise<Dataset> => {
  const formData = new FormData();
  formData.append('file', file);
  if (name) formData.append('name', name);
  
  const response = await api.post('/datasets/upload_csv/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getDatasets = async (): Promise<Dataset[]> => {
  const response = await api.get('/datasets/');
  return response.data;
};

export const getDatasetSummary = async (id: number) => {
  const response = await api.get(`/datasets/${id}/summary/`);
  return response.data;
};

export const generatePDF = async (id: number): Promise<Blob> => {
  const response = await api.get(`/datasets/${id}/generate_pdf/`, {
    responseType: 'blob'
  });
  return response.data;
};