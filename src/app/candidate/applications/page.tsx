"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { applicationService } from "@/services/ApplicationService";
import { jobService } from "@/services/JobService";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Temporary interface until backend logic is fully wired up
interface EnrichedApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  status: "Applied" | "Reviewed" | "Shortlisted" | "Rejected";
  appliedDate: string;
}

export default function CandidateApplicationsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // We initialize with an empty array. In the future, this will be fetched from Firestore.
  const [applications, setApplications] = useState<EnrichedApplication[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "candidate") {
          setProfile(userProfile);
          
          const apps = await applicationService.getApplicationsForCandidate(userProfile.uid);
          
          const enrichedApps = await Promise.all(
            apps.map(async (app) => {
              const job = await jobService.getJobById(app.jobId);
              return {
                id: app.id,
                jobTitle: job?.title || "Unknown Job",
                companyName: job?.companyName || "Unknown Company",
                companyLogoUrl: job?.companyLogoUrl,
                status: app.status as any,
                appliedDate: app.appliedAt
              };
            })
          );
          
          enrichedApps.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
          
          setApplications(enrichedApps);
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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1">Track the status of jobs you've applied for.</p>
      </div>

      {applications.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm font-medium text-slate-500 bg-slate-50">
                  <th className="p-4 pl-6">Job Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {app.companyLogoUrl ? (
                          <div className="w-10 h-10 rounded-lg border border-slate-100 flex items-center justify-center bg-white shrink-0 overflow-hidden">
                            <img src={app.companyLogoUrl} alt={app.companyName} className="w-full h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-slate-100 flex items-center justify-center bg-emerald-50 shrink-0">
                            <span className="font-bold text-emerald-600">{app.companyName.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{app.jobTitle}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{app.companyName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-600 bg-emerald-50">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <Briefcase className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Applications Yet</h2>
          <p className="text-slate-500 max-w-md mb-8">
            You haven't applied to any jobs yet. Start exploring opportunities that match your skills and take the next step in your career!
          </p>
          <Link href="/jobs">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Discover Jobs
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
