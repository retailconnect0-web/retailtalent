"use client";

import { useState, useEffect } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { CheckCircle, XCircle, Loader2, AlertCircle, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminApprovalsPage() {
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

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
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors">
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
    </div>
  );
}
