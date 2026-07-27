"use client";

import { useState, useEffect } from "react";
import { userService, UserProfile, CompanyProfile } from "@/services/UserService";
import { applicationService, JobApplication } from "@/services/ApplicationService";
import { jobService, Job } from "@/services/JobService";
import { CheckCircle, XCircle, Loader2, FileText, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<(JobApplication & { job?: Job | null, candidate?: UserProfile | null, company?: CompanyProfile | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const pendingApps = await applicationService.getPendingAdminApplications();
      
      const enrichedApps = await Promise.all(
        pendingApps.map(async (app) => {
          const job = await jobService.getJobById(app.jobId);
          const company = await userService.getCompanyDetails(app.companyId);
          return { ...app, job, company };
        })
      );
      
      setApplications(enrichedApps);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId: string) => {
    try {
      await applicationService.updateApplicationStatus(appId, "Forwarded to Recruiter");
      setApplications(applications.filter(a => a.id !== appId));
      toast.success("Application forwarded to recruiter!");
    } catch (error) {
      toast.error("Failed to approve application");
    }
  };

  const handleReject = async (appId: string) => {
    try {
      await applicationService.updateApplicationStatus(appId, "Rejected by Admin");
      setApplications(applications.filter(a => a.id !== appId));
      toast.success("Application rejected.");
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Application Moderation</h1>
        <p className="text-slate-400 text-sm">Review job applications before forwarding them to recruiters.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Pending Applications
          </h2>
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
            {applications.length} Pending
          </span>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <CheckCircle className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-lg font-medium text-slate-400">All caught up!</p>
              <p className="text-sm">There are no applications pending approval.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">App ID</th>
                  <th className="px-6 py-4 font-semibold">Job Details</th>
                  <th className="px-6 py-4 font-semibold">Company</th>
                  <th className="px-6 py-4 font-semibold">Date Applied</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {app.displayId || app.id.substring(0, 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{app.job?.title || "Unknown Job"}</div>
                      <div className="text-xs text-slate-500">{app.job?.employmentType || "Unknown"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">{app.company?.name || "Unknown Company"}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleReject(app.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(app.id)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-medium shadow-lg shadow-emerald-500/20 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Forward
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
