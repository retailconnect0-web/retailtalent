const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/(public)/jobs/page.tsx',
  'src/app/candidate/applications/page.tsx',
  'src/app/candidate/layout.tsx',
  'src/app/candidate/profile/page.tsx',
  'src/app/dashboard/candidates/page.tsx',
  'src/app/dashboard/jobs/new/page.tsx',
  'src/app/dashboard/jobs/page.tsx',
  'src/app/dashboard/messages/page.tsx',
  'src/app/dashboard/profile/page.tsx',
  'src/app/dashboard/settings/page.tsx',
  'src/app/test-db/page.tsx',
  'src/services/ApplicationService.ts',
  'src/services/JobService.ts'
];

filesToFix.forEach(relPath => {
  const filePath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace import { auth } from "@/lib/firebase/config"
  content = content.replace(/import\s+{\s*auth\s*}\s+from\s+['"]@\/lib\/firebase\/config['"];?/g, 'import { getFirebaseAuth } from "@/lib/firebase/config";');
  
  // Replace import { db } from "@/lib/firebase/config"
  content = content.replace(/import\s+{\s*db\s*}\s+from\s+['"]@\/lib\/firebase\/config['"];?/g, 'import { getFirebaseDb } from "@/lib/firebase/config";');
  
  content = content.replace(/import\s+{\s*db\s*,\s*auth\s*}\s+from\s+['"]@\/lib\/firebase\/config['"];?/g, 'import { getFirebaseDb, getFirebaseAuth } from "@/lib/firebase/config";');
  content = content.replace(/import\s+{\s*auth\s*,\s*db\s*}\s+from\s+['"]@\/lib\/firebase\/config['"];?/g, 'import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";');

  // Replace static firebase/auth imports
  const authRegex = /import\s+{([^}]+)}\s+from\s+['"]firebase\/auth['"];?/g;
  content = content.replace(authRegex, ''); // Remove the static import

  // Replace static firebase/firestore imports
  const firestoreRegex = /import\s+{([^}]+)}\s+from\s+['"]firebase\/firestore['"];?/g;
  content = content.replace(firestoreRegex, ''); // Remove the static import

  // For pages using useEffect to init auth:
  // Instead of trying to regex complex useEffects, if it's a page component, we can just replace the standard onAuthStateChanged blocks
  // Find instances of onAuthStateChanged(auth,
  if (content.includes('onAuthStateChanged(auth,')) {
    content = content.replace(/const\s+unsubscribe\s*=\s*onAuthStateChanged\(auth,\s*async\s*\(([^)]+)\)\s*=>\s*{/g, 
      `let unsubscribe: any;
      const initAuth = async () => {
        const { onAuthStateChanged } = await import("firebase/auth");
        const auth = await getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, async ($1) => {`);
    
    // Replace the return statement
    content = content.replace(/return\s*\(\)\s*=>\s*unsubscribe\(\);/g, `}; initAuth(); return () => { if (unsubscribe) unsubscribe(); };`);
  }

  // If the file is ApplicationService.ts or JobService.ts, rewrite it completely or replace methods
  if (relPath.includes('ApplicationService.ts')) {
    content = `import { getFirebaseDb } from "@/lib/firebase/config";
export interface JobApplication { id?: string; jobId: string; candidateId: string; status: string; appliedAt: string; }
class ApplicationService {
  async applyForJob(application: JobApplication): Promise<void> {
    const { collection, addDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    await addDoc(collection(db, "applications"), application);
  }
  async getApplicationsByCandidate(candidateId: string): Promise<JobApplication[]> {
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    const q = query(collection(db, "applications"), where("candidateId", "==", candidateId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
  }
}
export const applicationService = new ApplicationService();`;
  }

  if (relPath.includes('JobService.ts')) {
    content = `import { getFirebaseDb } from "@/lib/firebase/config";
export interface JobInfo { id?: string; title: string; company: string; location: string; type: string; salary?: string; description?: string; requirements?: string[]; postedBy?: string; createdAt?: string; }
class JobService {
  async getJobs(): Promise<JobInfo[]> {
    const { collection, getDocs } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    const snapshot = await getDocs(collection(db, "jobs"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobInfo));
  }
  async addJob(job: JobInfo): Promise<void> {
    const { collection, addDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    await addDoc(collection(db, "jobs"), job);
  }
}
export const jobService = new JobService();`;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
