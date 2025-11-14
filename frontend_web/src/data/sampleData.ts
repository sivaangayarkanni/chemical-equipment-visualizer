export const sampleEquipment = [
  { id: 1, name: "Pump-1", type: "Pump", flowrate: 120.0, pressure: 5.2, temperature: 110.0 },
  { id: 2, name: "Compressor-1", type: "Compressor", flowrate: 95.0, pressure: 8.4, temperature: 95.0 },
  { id: 3, name: "Valve-1", type: "Valve", flowrate: 60.0, pressure: 4.1, temperature: 105.0 },
  { id: 4, name: "HeatExchanger-1", type: "HeatExchanger", flowrate: 150.0, pressure: 6.2, temperature: 130.0 },
  { id: 5, name: "Pump-2", type: "Pump", flowrate: 132.0, pressure: 5.6, temperature: 118.0 },
  { id: 6, name: "Valve-2", type: "Valve", flowrate: 58.0, pressure: 4.0, temperature: 102.0 },
  { id: 7, name: "Reactor-1", type: "Reactor", flowrate: 140.0, pressure: 7.5, temperature: 140.0 },
  { id: 8, name: "Pump-3", type: "Pump", flowrate: 125.0, pressure: 5.3, temperature: 115.0 },
  { id: 9, name: "Condenser-1", type: "Condenser", flowrate: 160.0, pressure: 6.8, temperature: 125.0 },
  { id: 10, name: "Compressor-2", type: "Compressor", flowrate: 100.0, pressure: 8.0, temperature: 98.0 }
];

export const sampleStats = {
  total_count: 10,
  avg_flowrate: 119.8,
  avg_pressure: 6.11,
  avg_temperature: 117.47,
  type_distribution: {
    "Compressor": 2,
    "Condenser": 1,
    "HeatExchanger": 1,
    "Pump": 3,
    "Reactor": 1,
    "Valve": 2
  }
};