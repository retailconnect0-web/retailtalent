"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, CheckCircle2, TrendingUp, X, Loader2 } from "lucide-react";
import { userService, UserProfile } from "@/services/UserService";
import { jobService, Job } from "@/services/JobService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ALL_CATEGORIES = [
  "Remote", "MNC", "Startup", "Project Mgmt", "Internship", 
  "Engineering", "Supply Chain", "HR", "Fortune 500", 
  "Software & IT", "Analytics"
];

  const [user, setUser] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await userService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.companyId) {
      const companyJobs = await jobService.getJobsByCompany(currentUser.companyId);
      setJobs(companyJobs);
    }
    setLoading(false);
  };

  if (loading && !jobs.length) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] || 'There';

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName} 👋</h1>
        <p className="text-slate-500">Here is what's happening with your retail hiring today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500">Active Jobs</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{jobs.length}</h3>
          <p className="text-sm text-slate-400 font-medium">Published</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Recent Jobs</h2>
          </div>
          <div className="p-0">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                You haven't posted any jobs yet.
              </div>
            ) : (
              jobs.map((job, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{job.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-slate-500">{job.city}, {job.state} • ₹{job.salaryCost?.toLocaleString('en-IN')} {job.salaryType}</span>
                        {job.experienceDepartment && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">{job.experienceDepartment}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/dashboard/jobs/new"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
            >
              <span className="font-medium text-sm text-slate-700 group-hover:text-blue-600">Post a New Job</span>
              <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>

      </div>


    </div>
  );
}
