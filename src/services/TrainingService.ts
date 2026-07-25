import { getFirebaseDb } from "@/lib/firebase/config";

export interface Training {
  id?: string;
  title: string;
  date?: string;
  location: string;
  capacity?: number;
  price: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

class TrainingService {
  async getAllTrainings(): Promise<Training[]> {
    const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    try {
      const q = query(collection(db, "trainings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const trainings: Training[] = [];
      querySnapshot.forEach((doc) => {
        trainings.push({ id: doc.id, ...doc.data() } as Training);
      });
      
      return trainings;
    } catch (e) {
      console.error("Error fetching trainings:", e);
      return [];
    }
  }

  async createTraining(training: Omit<Training, "id" | "createdAt" | "updatedAt">): Promise<Training> {
    const { collection, addDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const newTraining = {
      ...training,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, "trainings"), newTraining);
    
    return {
      id: docRef.id,
      ...newTraining
    } as Training;
  }

  async updateTraining(id: string, training: Partial<Training>): Promise<void> {
    const { doc, updateDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const trainingRef = doc(db, "trainings", id);
    await updateDoc(trainingRef, {
      ...training,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteTraining(id: string): Promise<void> {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const trainingRef = doc(db, "trainings", id);
    await deleteDoc(trainingRef);
  }
}

export const trainingService = new TrainingService();
