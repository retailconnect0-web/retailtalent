import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: "candidate" | "recruiter" | "admin";
  profileComplete: boolean;
  // Recruiter fields
  companyId?: string; 
  // Candidate fields
  resumeUrl?: string;
  photoUrl?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  dob?: string;
  qualification?: string;
  college?: string;
  languages?: string;
  skills?: string;
  experience?: string;
  location?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  state?: string;
  city?: string;
  contactPhone?: string;
  logoUrl?: string;
  createdAt?: string;
}

class UserService {
  
  // Gets the current user profile from Firestore based on Auth state
  async getCurrentUser(): Promise<UserProfile | null> {
    const { onAuthStateChanged } = await import("firebase/auth");
    const { doc, getDoc } = await import("firebase/firestore");
    const auth = await getFirebaseAuth();
    const db = await getFirebaseDb();

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Only need one execution for this method
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              resolve(docSnap.data() as UserProfile);
            } else {
              resolve(null);
            }
          } catch (e) {
            console.error("Error fetching user profile:", e);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  // Register a new Candidate
  async registerCandidate(email: string, password: string, fullName: string): Promise<UserProfile> {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { doc, setDoc } = await import("firebase/firestore");
    const auth = await getFirebaseAuth();
    const db = await getFirebaseDb();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      fullName,
      role: "candidate",
      profileComplete: false,
    };

    // Create User document
    await setDoc(doc(db, "users", user.uid), userProfile);
    
    return userProfile;
  }

  // Register a new Recruiter (creating a Company portal for them)
  async registerRecruiter(email: string, password: string, fullName: string, companyName: string, state: string, city: string, phone: string): Promise<UserProfile> {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { doc, setDoc, addDoc, collection } = await import("firebase/firestore");
    const auth = await getFirebaseAuth();
    const db = await getFirebaseDb();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Company document
    const companyRef = await addDoc(collection(db, "companies"), {
      name: companyName,
      state: state,
      city: city,
      contactPhone: phone,
      createdAt: new Date().toISOString()
    });

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      fullName,
      role: "recruiter",
      profileComplete: true,
      companyId: companyRef.id // Link recruiter to their new multi-tenant portal
    };

    // Create User document
    await setDoc(doc(db, "users", user.uid), userProfile);
    
    return userProfile;
  }
  
  // Update User Profile (used by candidates to complete profile)
  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const { doc, updateDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      profileComplete: true
    });
  }

  // Get Company Details
  async getCompanyDetails(companyId: string): Promise<CompanyProfile | null> {
    const { doc, getDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();

    try {
      const docRef = doc(db, "companies", companyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CompanyProfile;
      }
      return null;
    } catch (e) {
      console.error("Error fetching company profile:", e);
      return null;
    }
  }

  // Update Company Details
  async updateCompanyDetails(companyId: string, data: Partial<CompanyProfile>): Promise<void> {
    const { doc, updateDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();

    const companyRef = doc(db, "companies", companyId);
    await updateDoc(companyRef, data);
  }

  // Candidate Google Sign-In
  async signInWithGoogleCandidate(): Promise<UserProfile> {
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const { doc, getDoc, setDoc } = await import("firebase/firestore");
    const auth = await getFirebaseAuth();
    const db = await getFirebaseDb();

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      // Create new candidate profile
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        fullName: user.displayName || "Candidate",
        role: "candidate",
        profileComplete: false,
      };
      await setDoc(docRef, userProfile);
      return userProfile;
    }
  }

  // Standard Login
  async login(email: string, password: string): Promise<UserProfile | null> {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const { doc, getDoc } = await import("firebase/firestore");
    const auth = await getFirebaseAuth();
    const db = await getFirebaseDb();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch profile
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }

  async logout(): Promise<void> {
    const { signOut } = await import("firebase/auth");
    const auth = await getFirebaseAuth();
    await signOut(auth);
  }

  // Send Password Reset Email
  async resetPassword(email: string): Promise<void> {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    const auth = await getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  }
}

export const userService = new UserService();
