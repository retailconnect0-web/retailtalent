import { getFirebaseDb } from "@/lib/firebase/config";
export interface Job {
  id: string;
  title: string;
  companyId: string; 
  companyName: string;
  companyLogoUrl?: string;
  location: string;
  salary: string;
  type: "Full Time" | "Part Time" | "Contract" | "Internship";
  status: "Active" | "Closed";
  postedAt: string;
  
  // Advanced Fields
  skills?: string;
  experienceLevel?: string;
  categories?: string[]; // e.g., ["Remote", "MNC", "Startup", "HR", etc.]
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
}

export const jobService = new JobService();
