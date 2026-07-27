import { getFirebaseDb } from "@/lib/firebase/config";
export interface Job {
  id: string;
  title: "Promoter" | "Merchandiser" | "Sales Representative" | string;
  companyId: string; 
  companyName: string;
  companyLogoUrl?: string;
  
  // Location
  state: string;
  city: string;
  
  // Employment & Compensation
  employmentType: "Full Time" | "Event Based";
  salaryCost: number;
  salaryType: "Per Day" | "Per Month";
  
  // Requirements
  experienceDepartment: string;
  languages: Array<{ name: string; speak: number; read: number; write: number }>;
  skills: string[]; // e.g., ["Sampling", "Demo", "Merchandising", "Sales"]
  
  status: "Active" | "Closed";
  postedAt: string;
}

class JobService {
  // Fetch all active jobs (for public jobs board)
  async getAllJobs(): Promise<Job[]> {
    const { collection, getDocs, query, where } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("status", "==", "Active"));
    const querySnapshot = await getDocs(q);
    
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() } as Job);
    });
    
    return jobs;
  }

  // Fetch jobs ONLY for a specific company (for recruiter dashboard)
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    const { collection, getDocs, query, where } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("companyId", "==", companyId));
    const querySnapshot = await getDocs(q);
    
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() } as Job);
    });
    
    return jobs;
  }

  async getJobById(id: string): Promise<Job | null> {
    const { doc, getDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const docRef = doc(db, "jobs", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Job;
    }
    return null;
  }

  // Create a new job, associating it with the current user's company
  async createJob(jobData: Omit<Job, "id" | "postedAt">): Promise<Job> {
    const { collection, addDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const jobsRef = collection(db, "jobs");
    const newJobData = {
      ...jobData,
      postedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(jobsRef, newJobData);
    
    return {
      id: docRef.id,
      ...newJobData
    } as Job;
  }

  async updateJob(id: string, jobData: Partial<Omit<Job, "id" | "postedAt" | "companyId">>): Promise<void> {
    const { doc, updateDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const docRef = doc(db, "jobs", id);
    await updateDoc(docRef, jobData);
  }

  async deleteJob(id: string): Promise<void> {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const docRef = doc(db, "jobs", id);
    await deleteDoc(docRef);
  }
}

export const jobService = new JobService();
