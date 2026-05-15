import { doc, setDoc, getDoc, collection, Firestore, serverTimestamp } from 'firebase/firestore';

export const demoPatients = [
  { 
    id: "p1", 
    name: "Maria das Dores Oliveira", 
    age: 74, 
    clinicalId: "HOSP-0021", 
    lastVisit: "2024-03-15", 
    status: "active", 
    type: "Motor",
    evolutions: [
      { id: "e1_1", date: "2024-03-15", note: "Paciente apresenta melhora significativa na amplitude de movimento do ombro direito após 10 sessões.", professional: "Dr. Ricardo Silva" },
      { id: "e1_2", date: "2024-03-01", note: "Início do protocolo de exercícios isométricos e crioterapia para controle de edema.", professional: "Dra. Ana Paula" },
      { id: "e1_3", date: "2024-02-15", note: "Avaliação inicial: Dor aguda na região lombar (VAS 8/10) e limitação funcional severa.", professional: "Dr. Ricardo Silva" },
      { id: "e1_4", date: "2024-02-10", note: "Encaminhamento da ortopedia: Pós-operatório de manguito rotador.", professional: "Dr. Marcos Santos" }
    ],
    activities: [
      { id: "a1_1", name: "Treino de Marcha", difficultyType: "motor", status: "pending", description: "3 séries de 10 metros com apoio de andador para estabilização." },
      { id: "a1_2", name: "Exercício de Pinça", difficultyType: "motor", status: "completed", description: "Coordenação motora fina com objetos de diferentes texturas." }
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
      { id: "e2_1", date: "2024-03-10", note: "Responde bem a estímulos visuais, mas apresenta fadiga cognitiva após 15 min de atividade.", professional: "Dr. Ricardo Silva" },
      { id: "e2_2", date: "2024-02-25", note: "Dificuldade em manter foco e atenção dividida. Iniciado treino de memória operacional.", professional: "Psic. Carla M." },
      { id: "e2_3", date: "2024-02-10", note: "Avaliação Neuropsicológica: Déficit leve em funções executivas pós-AVC.", professional: "Dra. Simone" }
    ],
    activities: [
      { id: "a2_1", name: "Jogo de Memória", difficultyType: "cognitive", status: "pending", description: "Nível médio com 12 pares de cartas temáticas." },
      { id: "a2_2", name: "Cálculo Simples", difficultyType: "cognitive", status: "completed", description: "Somas e subtrações básicas para estimular raciocínio lógico." }
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
      { id: "e3_1", date: "2024-03-18", note: "Quadro estável, porém requer vigilância constante para prevenção de escaras.", professional: "Dr. Ricardo Silva" },
      { id: "e3_2", date: "2024-03-12", note: "Paciente iniciou alimentação por via oral com dieta pastosa, sem episódios de engasgo.", professional: "Fono. Marcos" },
      { id: "e3_3", date: "2024-03-05", note: "Início de mobilização passiva em leito para evitar contraturas.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { id: "a3_1", name: "Treino de Higiene", difficultyType: "dailyActivity", status: "pending", description: "Escovação de dentes com escova adaptada e supervisão." }
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
      { id: "e4_1", date: "2024-03-14", note: "Força muscular em MMII evoluiu para grau 3. Consegue realizar ortostatismo com auxílio.", professional: "Dr. Ricardo Silva" },
      { id: "e4_2", date: "2024-03-01", note: "Redução de edema bilateral em tornozelos. Iniciado treino de equilíbrio estático.", professional: "Dra. Ana Paula" },
      { id: "e4_3", date: "2024-02-15", note: "Paciente apresenta quadro de sarcopenia. Necessário foco em fortalecimento proximal.", professional: "Dr. Ricardo Silva" }
    ],
    activities: [
      { id: "a4_1", name: "Fortalecimento de Quadríceps", difficultyType: "motor", status: "pending", description: "Caneleira de 1kg, 2 séries de 10 repetições sentado." }
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
      { id: "e5_1", date: "2024-03-16", note: "Independente para transferências leito-cadeira e marcha domiciliar.", professional: "Dr. Ricardo Silva" },
      { id: "e5_2", date: "2024-03-05", note: "Melhora na autoconfiança para realização de tarefas domésticas simples.", professional: "Dr. Ricardo Silva" },
      { id: "e5_3", date: "2024-02-20", note: "Iniciado treino de dupla tarefa (motor + cognitivo).", professional: "Dra. Beatriz" }
    ],
    activities: [
      { id: "a5_1", name: "Preparação de Lanche", difficultyType: "dailyActivity", status: "pending", description: "Simulação de cozinha segura focando em organização de utensílios." },
      { id: "a5_2", name: "Sequenciamento Lógico", difficultyType: "cognitive", status: "completed", description: "Organizar passos de uma tarefa complexa (ex: lavar roupa)." }
    ]
  }
];

export async function seedDemoData(db: Firestore) {
  for (const patientData of demoPatients) {
    const patientDocRef = doc(db, 'patients', patientData.id);
    const patientSnap = await getDoc(patientDocRef);
    
    // Se o paciente específico não existe, cria ele e seus dados relacionados
    if (!patientSnap.exists()) {
      const { evolutions, activities, ...patientInfo } = patientData;
      
      // 1. Criar Paciente
      await setDoc(patientDocRef, { 
        ...patientInfo, 
        createdAt: serverTimestamp() 
      });

      // 2. Criar Evoluções
      const evolutionsColl = collection(db, 'evolutions');
      for (const ev of evolutions) {
        await setDoc(doc(evolutionsColl, ev.id), { 
          ...ev, 
          patientId: patientData.id, 
          createdAt: serverTimestamp() 
        });
      }

      // 3. Criar Atividades
      const activityColl = collection(db, 'activities');
      for (const act of activities) {
        await setDoc(doc(activityColl, act.id), { 
          ...act, 
          patientId: patientData.id, 
          createdAt: serverTimestamp() 
        });
      }
    }
  }
}
