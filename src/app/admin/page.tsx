"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { userService } from "@/services/UserService";

export default function AdminDashboardPage() {
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const candidates = await userService.getPendingCandidates();
        setPendingCount(candidates.length);
      } catch (error) {
        console.error("Failed to fetch pending count", error);
        setPendingCount(0);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">System Overview</h1>
        <p className="text-slate-400 text-sm">Monitor platform health and pending approvals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/approvals" className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all block group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Pending Approvals</p>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {pendingCount === null ? "..." : pendingCount}
          </h3>
          <div className="flex items-center gap-1 text-xs text-blue-400 font-medium mt-4 group-hover:text-blue-300 transition-colors">
            View Candidate Approvals <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>
    </div>
  );
}

import { ShieldAlert } from "lucide-react";
