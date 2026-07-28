"use client";

import { useState, useEffect } from "react";
import { userService, UserProfile, CompanyProfile } from "@/services/UserService";
import { CheckCircle, XCircle, Loader2, AlertCircle, Eye, X, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { applicationService, JobApplication } from "@/services/ApplicationService";
import { jobService, Job } from "@/services/JobService";

export default function AdminApprovalsPage() {
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile | null>(null);
  const [candidateApps, setCandidateApps] = useState<(JobApplication & { job?: Job | null, company?: CompanyProfile | null })[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const pending = await userService.getPendingCandidates();
      setCandidates(pending);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const openCandidateModal = async (candidate: UserProfile) => {
    setSelectedCandidate(candidate);
    setLoadingApps(true);
    try {
      const apps = await applicationService.getApplicationsForCandidate(candidate.uid);
      const enrichedApps = await Promise.all(
        apps.map(async (app) => {
          const job = await jobService.getJobById(app.jobId);
          const company = await userService.getCompanyDetails(app.companyId);
          return { ...app, job, company };
        })
      );
      setCandidateApps(enrichedApps);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load candidate applications");
    } finally {
      setLoadingApps(false);
    }
  };

  const handleApprove = async (uid: string, name: string) => {
    try {
      await userService.updateCandidateStatus(uid, "approved");
      setCandidates(candidates.filter(c => c.uid !== uid));
      toast.success(`${name} has been approved and published!`);
    } catch (error) {
      toast.error("Failed to approve candidate.");
    }
  };

  const handleReject = async (uid: string, name: string) => {
    try {
      await userService.updateCandidateStatus(uid, "rejected");
      setCandidates(candidates.filter(c => c.uid !== uid));
      toast.success(`${name} has been rejected.`);
    } catch (error) {
      toast.error("Failed to reject candidate.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Candidate Approvals</h1>
        <p className="text-slate-400 text-sm">Review candidate profiles before they are published to the talent pool.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Interview / Review
          </h2>
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
            {candidates.length} Profiles
          </span>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Loading pending candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <CheckCircle className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-lg font-medium text-slate-400">All caught up!</p>
              <p className="text-sm">There are no candidates pending approval.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Candidate Info</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold">Documents</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.uid} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {candidate.photoUrl ? (
                            <img src={candidate.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-400 font-bold">{candidate.fullName?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{candidate.fullName}</div>
                          <div className="text-xs text-slate-500">{candidate.email} • {candidate.whatsappNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {candidate.city ? `${candidate.city}, ${candidate.state}` : "Not specified"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">{candidate.candidateType || "Not specified"}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">{candidate.experienceCategory}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {candidate.aadhaarUrl ? (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-sm border border-emerald-500/20 w-fit">Aadhaar: Yes</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-sm border border-red-500/20 w-fit">Aadhaar: No</span>
                        )}
                        {candidate.panUrl ? (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-sm border border-emerald-500/20 w-fit">PAN: Yes</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-sm border border-red-500/20 w-fit">PAN: No</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openCandidateModal(candidate)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button 
                          onClick={() => handleReject(candidate.uid, candidate.fullName)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApprove(candidate.uid, candidate.fullName)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-medium shadow-lg shadow-emerald-500/20 transition-colors"
                        >
                          Approve
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

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="text-xl font-bold text-white">Candidate Details</h2>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-1">
                  <div className="w-32 h-32 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center mb-4 shadow-inner">
                    {selectedCandidate.photoUrl ? (
                      <img src={selectedCandidate.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 text-4xl font-bold">{selectedCandidate.fullName?.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{selectedCandidate.fullName}</h3>
                  <p className="text-slate-400 text-sm mb-4">{selectedCandidate.candidateType || "No Type Specified"}</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Contact</span>
                      <span className="text-slate-300">{selectedCandidate.email}</span>
                      <span className="text-slate-300">{selectedCandidate.whatsappNumber} (WA)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Location</span>
                      <span className="text-slate-300">{selectedCandidate.city}, {selectedCandidate.state}</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Personal Info</span>
                      <span className="text-slate-300">
                        {selectedCandidate.gender || "Gender Not Specified"}
                        {selectedCandidate.dob && ` • ${new Date().getFullYear() - new Date(selectedCandidate.dob).getFullYear()} yrs`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Professional Summary</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedCandidate.shortBio || "No bio provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Education</h4>
                      <p className="text-slate-300 text-sm">{selectedCandidate.qualification || "Not specified"}</p>
                      <p className="text-slate-500 text-xs mt-1">{selectedCandidate.college || ""}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Experience</h4>
                      <p className="text-slate-300 text-sm">{selectedCandidate.experienceCategory || "Not specified"}</p>
                      <p className="text-slate-500 text-xs mt-1">{selectedCandidate.skills || ""}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Job Applications ({candidateApps.length})</h3>
                {loadingApps ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  </div>
                ) : candidateApps.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">This candidate has not applied to any jobs yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidateApps.map((app) => (
                      <div key={app.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-200">{app.job?.title || "Unknown Job"}</h4>
                              {app.displayId && (
                                <span className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                  {app.displayId}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{app.job?.employmentType}</p>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            {app.status}
                          </span>
                        </div>
                        
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                          <p className="text-sm font-medium text-slate-300 mb-2">🏢 {app.company?.name || "Unknown Company"}</p>
                          <div className="flex flex-col gap-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Contact: {app.company?.contactPhone || "N/A"}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location: {app.company?.city || ""}, {app.company?.state || ""}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
              <button onClick={() => setSelectedCandidate(null)} className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                Close
              </button>
              <button onClick={() => { handleApprove(selectedCandidate.uid, selectedCandidate.fullName); setSelectedCandidate(null); }} className="px-5 py-2 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all">
                Approve Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
