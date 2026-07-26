"use client";

import { useState, useEffect } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock } from "lucide-react";

export default function EarningsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/config");
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userProfile = await userService.getCurrentUser();
          setProfile(userProfile);
        }
      });
    };
    initAuth();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const totalEarnings = profile?.totalEarnings || 0;
  
  // Mock data for transactions since we don't have a payments collection yet
  const transactions = [
    { id: 1, type: "earned", title: "Promoter - Puma Weekend Sale", date: "Oct 24, 2024", amount: 1200, status: "completed" },
    { id: 2, type: "earned", title: "Merchandising - Reliance Smart", date: "Oct 18, 2024", amount: 800, status: "completed" },
    { id: 3, type: "withdrawn", title: "Bank Transfer (HDFC ***1234)", date: "Oct 15, 2024", amount: 2000, status: "completed" },
    { id: 4, type: "earned", title: "Sampling Campaign - L'Oreal", date: "Oct 05, 2024", amount: 1500, status: "pending" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Earnings Dashboard</h1>
        <p className="text-slate-500 mt-1">Track your income and withdraw your earnings.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <IndianRupee className="w-24 h-24" />
          </div>
          <p className="text-emerald-100 font-medium mb-1">Total Earned</p>
          <h2 className="text-4xl font-bold mb-4 flex items-center">
            <IndianRupee className="w-8 h-8 mr-1" /> {totalEarnings.toLocaleString('en-IN')}
          </h2>
          <div className="flex items-center text-sm bg-black/10 w-max px-3 py-1 rounded-full border border-white/10">
            <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-200" />
            <span className="text-emerald-100">+12% this month</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">Available to Withdraw</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
            <IndianRupee className="w-7 h-7 mr-1" /> {(totalEarnings > 2000 ? totalEarnings - 2000 : 0).toLocaleString('en-IN')}
          </h2>
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors">
            Withdraw Funds
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">Pending Clearance</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
            <IndianRupee className="w-7 h-7 mr-1 text-slate-400" /> 1,500
          </h2>
          <p className="text-sm text-slate-500 flex items-center">
            <Clock className="w-4 h-4 mr-1.5" /> Automatically clears in 2 days
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Download Statement</button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tx.type === "earned" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                }`}>
                  {tx.type === "earned" ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{tx.title}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" /> {tx.date}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold text-lg flex items-center justify-end ${
                  tx.type === "earned" ? "text-emerald-600" : "text-slate-900"
                }`}>
                  {tx.type === "earned" ? "+" : "-"} <IndianRupee className="w-4 h-4" /> {tx.amount.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  {tx.status === "completed" ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span className="text-xs font-medium text-emerald-600 uppercase">Completed</span></>
                  ) : (
                    <><Clock className="w-3.5 h-3.5 text-amber-500" /><span className="text-xs font-medium text-amber-600 uppercase">Pending</span></>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
