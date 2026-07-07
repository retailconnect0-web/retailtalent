"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Search,
  Filter,
  Loader2,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/firebase/config";


export default function ManageCandidatesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded to empty for now. In the future, fetch from Firestore applications collection
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribe: any;
      const initAuth = async () => {
        const { onAuthStateChanged } = await import("firebase/auth");
        const auth = await getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "recruiter") {
          setProfile(userProfile);
          // TODO: Fetch candidates from ApplicationService
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    }; initAuth(); return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Candidates</h1>
          <p className="text-slate-500 mt-1">Review applicants and discover new talent for your open roles.</p>
        </div>
      </div>

      {candidates.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
             <div className="relative">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search candidates..." 
                 className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-64 focus:outline-none focus:border-blue-500"
               />
             </div>
             <Button variant="outline" className="text-slate-600 rounded-lg flex items-center gap-2">
               <Filter className="w-4 h-4" />
               Filter
             </Button>
           </div>
           
           <div className="overflow-x-auto">
             {/* Future candidates table */}
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Candidates Found</h2>
          <p className="text-slate-500 max-w-md mb-8">
            You don't have any job applicants yet. Make sure your active job listings are published to start attracting top talent!
          </p>
          <Link href="/dashboard/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Manage Jobs
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
