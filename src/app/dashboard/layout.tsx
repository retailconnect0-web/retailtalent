"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Briefcase, Users, MessageSquare, Settings, Bell, Search, Menu, LogOut, Building2 } from "lucide-react";
import { userService, UserProfile } from "@/services/UserService";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || currentUser.role !== "recruiter") {
        router.push("/hire");
      } else {
        setUser(currentUser);
        if (currentUser.companyId) {
          const companyDetails = await userService.getCompanyDetails(currentUser.companyId);
          setCompany(companyDetails);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await userService.logout();
    router.push("/hire");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Loading Dashboard...</div>;
  }

  // Helper to get initials
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'RC';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-1.5 rounded group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Retail<span className="text-blue-600">Talent</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Briefcase className="w-5 h-5" />
            Jobs
          </Link>
          <Link href="/dashboard/candidates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Users className="w-5 h-5" />
            Candidates
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Messages
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Building2 className="w-5 h-5" />
            Company Profile
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search candidates, jobs..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.fullName}</p>
                <p className="text-xs text-slate-500">Recruiter</p>
              </div>
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt="Company Logo" className="w-9 h-9 rounded-full object-cover border border-slate-200 cursor-pointer hover:ring-2 hover:ring-blue-600/30 transition-all" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm ring-2 ring-transparent hover:ring-blue-600/30 transition-all cursor-pointer">
                  {initials}
                </div>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors ml-2" title="Log out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
