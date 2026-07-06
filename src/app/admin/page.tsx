import { Users, Building2, AlertTriangle, TrendingUp, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">System Overview</h1>
        <p className="text-slate-400 text-sm">Monitor platform health and pending approvals.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-400">Total Users</p>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">12,450</h3>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +124 this week
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-400">Active Recruiters</p>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">842</h3>
          <p className="text-xs text-blue-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +12 this week
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-400">Pending Approvals</p>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">14</h3>
          <p className="text-xs text-slate-500 font-medium">
            Requires attention
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-400">Flagged Jobs</p>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">3</h3>
          <p className="text-xs text-red-400 font-medium">
            Reported by users
          </p>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Pending Recruiter KYC</h2>
          <button className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Representative</th>
                <th className="px-6 py-4 font-semibold">Date Submitted</th>
                <th className="px-6 py-4 font-semibold">Documents</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { company: "RetailMax India", rep: "Amit Singh", date: "Oct 24, 2024", docs: "PAN, GSTIN" },
                { company: "Fashion Hub", rep: "Priya Patel", date: "Oct 24, 2024", docs: "GSTIN Only" },
                { company: "Tech Store", rep: "Rahul Desai", date: "Oct 23, 2024", docs: "PAN, GSTIN, Aadhaar" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{row.company}</td>
                  <td className="px-6 py-4 text-slate-400">{row.rep}</td>
                  <td className="px-6 py-4 text-slate-400">{row.date}</td>
                  <td className="px-6 py-4 text-slate-400">
                    <span className="bg-slate-800 px-2 py-1 rounded text-xs">{row.docs}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    <button className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Reject">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { ShieldAlert } from "lucide-react";
