export interface Equipment {
  id: number;
  name: string;
  type: string;
  flowrate: number;
  pressure: number;
  temperature: number;
}

export interface SummaryStats {
  total_count: number;
  avg_flowrate: number;
  avg_pressure: number;
  avg_temperature: number;
  type_distribution: { [key: string]: number };
}

export interface Dataset {
  id: number;
  name: string;
  uploaded_at: string;
  summary_stats: SummaryStats;
  equipment: Equipment[];
}