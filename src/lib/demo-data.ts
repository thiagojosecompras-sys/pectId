
import { doc, setDoc, getDoc, collection, Firestore, serverTimestamp } from 'firebase/firestore';
import demoData from '@/app/lib/demo-patients.json';

export async function seedDemoData(db: Firestore) {
  const { patients } = demoData;

  for (const patientData of patients) {
    const patientDocRef = doc(db, 'patients', patientData.id);
    const patientSnap = await getDoc(patientDocRef);
    
    // Alimenta apenas se o paciente não existir no banco
    if (!patientSnap.exists()) {
      const { evolutions, activities, ...patientInfo } = patientData;
      
      // 1. Criar Registro do Paciente
      await setDoc(patientDocRef, { 
        ...patientInfo, 
        createdAt: serverTimestamp() 
      });

      // 2. Criar Evoluções (Histórico de Consultas)
      const evolutionsColl = collection(db, 'evolutions');
      for (const ev of evolutions) {
        await setDoc(doc(evolutionsColl, ev.id), { 
          ...ev, 
          patientId: patientData.id, 
          createdAt: serverTimestamp() 
        });
      }

      // 3. Criar Atividades (Cronograma)
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
