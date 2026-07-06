import { ChevronRight, Clock, MapPin, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-bold mb-1 relative z-10">Hello, Rahul 👋</h1>
        <p className="text-emerald-100 mb-4 relative z-10">You have 2 upcoming interviews this week.</p>
        
        {/* Profile Completion Widget */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 relative z-10">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Profile Completion</span>
            <span>80%</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 mb-3">
            <div className="bg-white h-2 rounded-full w-[80%]"></div>
          </div>
          <p className="text-xs text-emerald-50 mb-2">Complete your profile to get 3x more interview calls.</p>
          <Link href="/candidate/profile" className="text-xs font-bold text-white flex items-center hover:underline">
            Add Aadhaar Details <ChevronRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* Application Status */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
          <Link href="/candidate/applications" className="text-sm text-emerald-600 font-medium hover:underline">View all</Link>
        </div>
        
        <div className="space-y-3">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
                L
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 leading-tight mb-1">Store Manager</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> Lifestyle</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">Interviewing</span>
              <span className="text-xs text-slate-400">Tom, 10:00 AM</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl shrink-0">
                B
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 leading-tight mb-1">Beauty Advisor</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> Body Shop</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">Under Review</span>
              <span className="text-xs text-slate-400">Applied 2d ago</span>
            </div>
          </div>
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
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Retail Sales Associate</h3>
            <p className="text-sm text-slate-500 mb-4">Puma Sports India</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bandra West</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Full Time</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">R</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">₹300 - ₹500/day</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Weekend Promoter</h3>
            <p className="text-sm text-slate-500 mb-4">Reliance Smart</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Andheri East</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Part Time</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
