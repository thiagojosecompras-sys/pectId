
import { doc, setDoc, collection, getDocs, Firestore, serverTimestamp } from 'firebase/firestore';

export const demoPatients = [
  { 
    id: "1", 
    name: "Maria das Dores Oliveira", 
    age: 74, 
    clinicalId: "HOSP-0021", 
    lastVisit: "2024-03-15", 
    status: "active", 
    type: "Motor",
    evolutions: [
      { date: "2024-03-15", note: "Paciente apresenta melhora na amplitude de movimento do ombro direito.", professional: "Dr. Ricardo Silva" },
      { date: "2024-03-01", note: "Início do protocolo de exercícios isométricos.", professional: "Dra. Ana Paula" },
      { date: "2024-02-15", note: "Avaliação inicial: Dor aguda na região lombar.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { name: "Treino de Marcha", difficultyType: "motor", status: "pending", description: "3 séries de 10 metros com apoio." },
      { name: "Exercício de Pinça", difficultyType: "motor", status: "completed", description: "Coordenação motora fina com objetos pequenos." }
    ]
  },
  { 
    id: "2", 
    name: "José Roberto Santos", 
    age: 62, 
    clinicalId: "HOSP-0045", 
    lastVisit: "2024-03-10", 
    status: "active", 
    type: "Cognitivo",
    evolutions: [
      { date: "2024-03-10", note: "Responde bem a estímulos visuais, mas apresenta cansaço rápido.", professional: "Dr. Ricardo Silva" },
      { date: "2024-02-25", note: "Dificuldade em manter foco por mais de 5 minutos.", professional: "Psic. Carla M." }
    ],
    activities: [
      { name: "Jogo de Memória", difficultyType: "cognitive", status: "pending", description: "Nível médio com 12 pares." },
      { name: "Cálculo Simples", difficultyType: "cognitive", status: "completed", description: "Somas e subtrações básicas." }
    ]
  },
  { 
    id: "3", 
    name: "Alice Maria Ferreira", 
    age: 48, 
    clinicalId: "HOSP-0122", 
    lastVisit: "2024-03-18", 
    status: "critical", 
    type: "ADL",
    evolutions: [
      { date: "2024-03-18", note: "Quadro estável, porém requer vigilância constante.", professional: "Dr. Ricardo Silva" },
      { date: "2024-03-12", note: "Paciente iniciou alimentação por via oral sem engasgos.", professional: "Fono. Marcos" }
    ],
    activities: [
      { name: "Treino de Higiene", difficultyType: "dailyActivity", status: "pending", description: "Escovação de dentes com adaptação." }
    ]
  },
  { 
    id: "4", 
    name: "Benedito Silva", 
    age: 81, 
    clinicalId: "HOSP-0008", 
    lastVisit: "2024-03-14", 
    status: "active", 
    type: "Motor",
    evolutions: [
      { date: "2024-03-14", note: "Força muscular em MMII grau 3.", professional: "Dr. Ricardo Silva" },
      { date: "2024-02-28", note: "Redução de edema em tornozelos.", professional: "Dra. Ana Paula" }
    ],
    activities: [
      { name: "Fortalecimento de Quadríceps", difficultyType: "motor", status: "pending", description: "Caneleira de 1kg, 2 séries de 10." }
    ]
  },
  { 
    id: "5", 
    name: "Clara Mendes", 
    age: 55, 
    clinicalId: "HOSP-0099", 
    lastVisit: "2024-03-16", 
    status: "active", 
    type: "Multimodal",
    evolutions: [
      { date: "2024-03-16", note: "Independente para transferências leito-cadeira.", professional: "Dr. Ricardo Silva" },
      { date: "2024-03-05", note: "Aumento da confiança em atividades domésticas.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { name: "Preparação de Lanche", difficultyType: "dailyActivity", status: "pending", description: "Simulação de cozinha segura." },
      { name: "Sequenciamento Lógico", difficultyType: "cognitive", status: "completed", description: "Organizar passos de uma tarefa." }
    ]
  }
];

export async function seedDemoData(db: Firestore) {
  const querySnapshot = await getDocs(collection(db, 'patients'));
  if (querySnapshot.empty) {
    for (const patientData of demoPatients) {
      const { evolutions, activities, ...patient } = patientData;
      const patientRef = doc(db, 'patients', patient.id);
      
      // Salvar paciente
      await setDoc(patientRef, { ...patient, createdAt: serverTimestamp() });

      // Salvar Evoluções
      const evolutionColl = collection(db, 'patients', patient.id, 'evolutions');
      for (const ev of evolutions) {
        await setDoc(doc(evolutionColl), { ...ev, createdAt: serverTimestamp() });
      }

      // Salvar Atividades
      const activityColl = collection(db, 'patients', patient.id, 'suggestedActivities');
      for (const act of activities) {
        await setDoc(doc(activityColl), { ...act, createdAt: serverTimestamp() });
      }
    }
  }
}
