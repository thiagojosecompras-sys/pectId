
export type DifficultyType = 'motor' | 'cognitive' | 'dailyActivity';

export interface Evolution {
  id: string;
  date: string;
  note: string;
  professional: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  difficultyType: DifficultyType;
  status: 'pending' | 'completed' | 'skipped';
  createdAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  clinicalId: string;
  lastVisit: string;
  status: 'active' | 'critical' | 'discharged';
  type: string;
  evolutions: Evolution[];
  activities: Activity[];
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Maria das Dores Oliveira",
    age: 74,
    clinicalId: "HOSP-0021",
    lastVisit: "2024-03-15",
    status: "active",
    type: "Motor",
    evolutions: [
      { id: "e1_1", date: "2024-03-15", note: "Melhora na amplitude de movimento do ombro direito após 10 sessões.", professional: "Dr. Ricardo Silva" },
      { id: "e1_2", date: "2024-03-01", note: "Início do protocolo de exercícios isométricos para controle de edema.", professional: "Dra. Ana Paula" },
      { id: "e1_3", date: "2024-02-15", note: "Avaliação inicial: Limitação funcional severa e dor VAS 8/10.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { id: "a1_1", name: "Treino de Marcha", difficultyType: "motor", status: "pending", description: "3 séries de 10 metros com apoio de andador." },
      { id: "a1_2", name: "Pinça e Coordenação", difficultyType: "motor", status: "completed", description: "Manipulação de objetos pequenos para coordenação fina." }
    ]
  },
  {
    id: "p2",
    name: "José Roberto Santos",
    age: 62,
    clinicalId: "HOSP-0045",
    lastVisit: "2024-03-10",
    status: "active",
    type: "Cognitivo",
    evolutions: [
      { id: "e2_1", date: "2024-03-10", note: "Apresenta fadiga cognitiva após 15 min de atividade intensa.", professional: "Dr. Ricardo Silva" },
      { id: "e2_2", date: "2024-02-25", note: "Iniciado treino de memória operacional com estímulos visuais.", professional: "Psic. Carla M." }
    ],
    activities: [
      { id: "a2_1", name: "Jogo de Memória", difficultyType: "cognitive", status: "pending", description: "Nível médio com 12 pares de cartas temáticas." },
      { id: "a2_2", name: "Cálculo Simples", difficultyType: "cognitive", status: "completed", description: "Somas e subtrações para estimular raciocínio lógico." }
    ]
  },
  {
    id: "p3",
    name: "Alice Maria Ferreira",
    age: 48,
    clinicalId: "HOSP-0122",
    lastVisit: "2024-03-18",
    status: "critical",
    type: "ADL",
    evolutions: [
      { id: "e3_1", date: "2024-03-18", note: "Quadro estável, requer vigilância para prevenção de lesões por pressão.", professional: "Dr. Ricardo Silva" },
      { id: "e3_2", date: "2024-03-12", note: "Iniciou dieta pastosa sem episódios de broncoaspiração.", professional: "Fono. Marcos" }
    ],
    activities: [
      { id: "a3_1", name: "Treino de Higiene", difficultyType: "dailyActivity", status: "pending", description: "Escovação de dentes com escova adaptada." }
    ]
  },
  {
    id: "p4",
    name: "Benedito Silva",
    age: 81,
    clinicalId: "HOSP-0008",
    lastVisit: "2024-03-14",
    status: "active",
    type: "Motor",
    evolutions: [
      { id: "e4_1", date: "2024-03-14", note: "Consegue realizar ortostatismo com auxílio mínimo. Força Grau 3.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { id: "a4_1", name: "Fortalecimento de Quadríceps", difficultyType: "motor", status: "pending", description: "2 séries de 10 repetições sentado com caneleira de 1kg." }
    ]
  },
  {
    id: "p5",
    name: "Clara Mendes",
    age: 55,
    clinicalId: "HOSP-0099",
    lastVisit: "2024-03-16",
    status: "active",
    type: "Multimodal",
    evolutions: [
      { id: "e5_1", date: "2024-03-16", note: "Independente para transferências leito-cadeira.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { id: "a5_1", name: "Preparação de Lanche", difficultyType: "dailyActivity", status: "pending", description: "Simulação de cozinha segura focando em organização." }
    ]
  },
  {
    id: "p6",
    name: "Ricardo Augusto Neves",
    age: 39,
    clinicalId: "HOSP-0210",
    lastVisit: "2024-03-20",
    status: "active",
    type: "Motor",
    evolutions: [
      { id: "e6_1", date: "2024-03-20", note: "Atleta em reabilitação de LCA. Iniciado treino de pliometria leve.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { id: "a6_1", name: "Treino de Agilidade", difficultyType: "motor", status: "pending", description: "Exercícios de escada de agilidade em baixa intensidade." }
    ]
  }
];
