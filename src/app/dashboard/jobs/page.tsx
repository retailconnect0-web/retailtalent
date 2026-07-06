"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { jobService, Job } from "@/services/JobService";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Plus,
  Loader2,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function ManageJobsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "recruiter") {
          setProfile(userProfile);
          if (userProfile.companyId) {
            const companyJobs = await jobService.getJobsByCompany(userProfile.companyId);
            // Sort by newest first
            companyJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
            setJobs(companyJobs);
          }
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
          <h1 className="text-3xl font-bold text-slate-900">Manage Jobs</h1>
          <p className="text-slate-500 mt-1">Create, view, and manage your active job listings.</p>
        </div>
        
        <Link href="/dashboard/jobs/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 flex items-center gap-2 rounded-xl px-6 py-5 h-auto w-full md:w-auto">
            <Plus className="w-5 h-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           {/* Future Job List Table */}
           <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
             <div className="relative">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search jobs..." 
                 className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-64 focus:outline-none focus:border-blue-500"
               />
             </div>
             <Button variant="outline" className="text-slate-600 rounded-lg flex items-center gap-2">
               <Filter className="w-4 h-4" />
               Filter
             </Button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-slate-100 text-sm font-medium text-slate-500">
                   <th className="p-4 pl-6">Job Title</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Applicants</th>
                   <th className="p-4">Posted Date</th>
                   <th className="p-4 pr-6"></th>
                 </tr>
               </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-900">{job.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{job.location} • {job.type}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-700">0</td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(job.postedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Briefcase className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Jobs Posted Yet</h2>
          <p className="text-slate-500 max-w-md mb-8">
            You haven't created any job listings. Post your first job to start receiving applications from top retail talent!
          </p>
          <Link href="/dashboard/jobs/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Post Your First Job
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
