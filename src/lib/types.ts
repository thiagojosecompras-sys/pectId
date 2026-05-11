export type DifficultyType = 'motor' | 'cognitive' | 'dailyActivity';

export interface Patient {
  id: string;
  name: string;
  age: number;
  clinicalRecordNumber: string;
  lastAssessmentDate: string;
  status: 'active' | 'discharged' | 'on-hold';
  difficulties: {
    motor: string[];
    cognitive: string[];
    dailyActivity: string[];
  };
}

export interface Assessment {
  id: string;
  patientId: string;
  date: string;
  professionalId: string;
  difficulties: {
    motor: string[];
    cognitive: string[];
    dailyActivity: string[];
  };
  notes: string;
}

export interface ActivityPlan {
  id: string;
  patientId: string;
  date: string;
  activities: {
    name: string;
    description: string;
    difficultyType: DifficultyType;
    status: 'pending' | 'completed' | 'skipped';
  }[];
}