"use client";
import { ChevronRight, Clock, MapPin, Building2, User, Star, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { getFirebaseAuth } from "@/lib/firebase/config";

export default function CandidateDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userProfile = await userService.getCurrentUser();
          setProfile(userProfile);
        }
      });
    };
    initAuth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
          {/* Candidate Photo */}
          <div className="w-20 h-20 bg-white/20 rounded-full border-4 border-white/30 overflow-hidden shrink-0 flex items-center justify-center backdrop-blur-sm shadow-xl">
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white/70" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello, {profile?.fullName?.split(" ")[0] || "Candidate"} 👋</h1>
            <p className="text-emerald-100 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" /> {profile?.city || "City not added"}
            </p>
          </div>
        </div>
        
        {/* Profile Stats Widget */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 relative z-10 w-full md:w-64 border border-white/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Avg Rating</span>
            <span className="text-sm font-bold flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {profile?.rating || "New"}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Availability</span>
            <span className="text-xs font-bold">{profile?.availability || "Not set"}</span>
          </div>
          <Link href="/candidate/profile" className="text-xs font-bold text-white flex items-center hover:underline">
            Update Profile & KYC <ChevronRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <IndianRupee className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Total Earnings</h2>
          <p className="text-3xl font-extrabold text-slate-800 mb-4">₹{profile?.totalEarnings?.toLocaleString() || "0"}</p>
          <Link href="/candidate/earnings" className="text-sm text-blue-600 font-medium flex items-center hover:underline">
            View Earnings Dashboard <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Reviews Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">My Ratings</h2>
          <p className="text-3xl font-extrabold text-slate-800 mb-4">{profile?.rating || "No ratings yet"}</p>
          <Link href="/candidate/reviews" className="text-sm text-amber-600 font-medium flex items-center hover:underline">
            View Client Reviews <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">P</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">₹25k - ₹35k/mo</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Full-time Promoter</h3>
            <p className="text-sm text-slate-500 mb-4">Puma Sports India</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Retail Malls</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Full Time</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">R</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">₹800 - ₹1200/day</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Weekend Promoter</h3>
            <p className="text-sm text-slate-500 mb-4">Reliance Smart</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Supermarkets</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Weekend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
