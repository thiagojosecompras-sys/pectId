
import { doc, setDoc, collection, getDocs, Firestore } from 'firebase/firestore';

export const demoPatients = [
  { id: "1", name: "Maria das Dores Oliveira", age: 74, clinicalId: "HOSP-0021", lastVisit: "2023-11-20", status: "active", type: "Motor" },
  { id: "2", name: "José Roberto Santos", age: 62, clinicalId: "HOSP-0045", lastVisit: "2023-11-22", status: "active", type: "Cognitivo" },
  { id: "3", name: "Alice Maria Ferreira", age: 48, clinicalId: "HOSP-0122", lastVisit: "2023-11-19", status: "critical", type: "ADL" },
  { id: "4", name: "Benedito Silva", age: 81, clinicalId: "HOSP-0008", lastVisit: "2023-11-23", status: "active", type: "Motor" },
  { id: "5", name: "Clara Mendes", age: 55, clinicalId: "HOSP-0099", lastVisit: "2023-11-15", status: "active", type: "Multimodal" },
];

export async function seedDemoData(db: Firestore) {
  const querySnapshot = await getDocs(collection(db, 'patients'));
  if (querySnapshot.empty) {
    for (const patient of demoPatients) {
      const patientRef = doc(db, 'patients', patient.id);
      await setDoc(patientRef, patient);
    }
  }
}
