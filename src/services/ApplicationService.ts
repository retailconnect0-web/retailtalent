import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  query, 
  where 
} from "firebase/firestore";

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  companyId: string;
  status: "Applied" | "Reviewed" | "Shortlisted" | "Rejected";
  appliedAt: string;
}

class ApplicationService {
  
  // Apply for a job
  async createApplication(jobId: string, candidateId: string, companyId: string): Promise<JobApplication> {
    // Check if already applied
    const hasApplied = await this.hasUserApplied(jobId, candidateId);
    if (hasApplied) {
      throw new Error("You have already applied for this job.");
    }

    const applicationsRef = collection(db, "applications");
    const newApplicationData = {
      jobId,
      candidateId,
      companyId,
      status: "Applied",
      appliedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(applicationsRef, newApplicationData);
    
    return {
      id: docRef.id,
      ...newApplicationData
    } as JobApplication;
  }

  // Check if a user has applied to a specific job
  async hasUserApplied(jobId: string, candidateId: string): Promise<boolean> {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef, 
      where("jobId", "==", jobId),
      where("candidateId", "==", candidateId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Get all job IDs that a specific candidate has applied for
  async getAppliedJobIdsForCandidate(candidateId: string): Promise<string[]> {
    const applicationsRef = collection(db, "applications");
    const q = query(applicationsRef, where("candidateId", "==", candidateId));
    const querySnapshot = await getDocs(q);
    
    const appliedJobIds: string[] = [];
    querySnapshot.forEach((doc) => {
      appliedJobIds.push(doc.data().jobId);
    });
    
    return appliedJobIds;
  }

  // Get full applications for a candidate
  async getApplicationsForCandidate(candidateId: string): Promise<JobApplication[]> {
    const applicationsRef = collection(db, "applications");
    const q = query(applicationsRef, where("candidateId", "==", candidateId));
    const querySnapshot = await getDocs(q);
    
    const applications: JobApplication[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as JobApplication);
    });
    
    return applications;
  }
}

export const applicationService = new ApplicationService();
