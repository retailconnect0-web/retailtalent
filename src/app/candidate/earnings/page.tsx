"use client";
import { IndianRupee, ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { getFirebaseAuth } from "@/lib/firebase/config";

export default function EarningsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userProfile = await userService.getCurrentUser();
          setProfile(userProfile);
        }
        setLoading(false);
      });
    };
    initAuth();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Earnings Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Earnings</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">₹{profile?.totalEarnings?.toLocaleString() || "0"}</h2>
          <span className="text-xs font-medium text-emerald-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> Lifetime</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">This Month</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">₹0</h2>
          <span className="text-xs font-medium text-slate-400 flex items-center">No earnings yet this month</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Clearance</p>
          <h2 className="text-3xl font-extrabold text-amber-600 mb-2">₹0</h2>
          <span className="text-xs font-medium text-amber-600 flex items-center">From recent weekend jobs</span>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Transaction History</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <IndianRupee className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No transactions found</p>
          <p className="text-slate-400 text-sm">Once you complete jobs and get paid, they will appear here.</p>
        </div>
      </div>
    </div>
  );
}
