import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { SummaryStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsProps {
  stats: SummaryStats;
}

const Charts: React.FC<ChartsProps> = ({ stats }) => {
  if (!stats) {
    return <div>No data available</div>;
  }

  const averagesData = {
    labels: ['Flowrate', 'Pressure', 'Temperature'],
    datasets: [
      {
        label: 'Average Values',
        data: [stats.avg_flowrate || 0, stats.avg_pressure || 0, stats.avg_temperature || 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const typeDistributionData = {
    labels: stats.type_distribution ? Object.keys(stats.type_distribution) : [],
    datasets: [
      {
        data: stats.type_distribution ? Object.values(stats.type_distribution) : [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>📈 Process Parameters</h3>
        <Bar data={averagesData} options={{ 
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }} />
      </div>
      <div className="chart-card">
        <h3>🏢 Equipment Distribution</h3>
        <Pie data={typeDistributionData} options={{ 
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }} />
      </div>
    </div>
  );
};

export default Charts;