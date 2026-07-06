"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, ShieldAlert, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't render the sidebar on the login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-950 text-slate-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-red-500 text-white p-1 rounded">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Admin<span className="text-red-500 font-light">Portal</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Management</div>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 font-medium transition-colors border border-red-500/20">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link href="/admin/approvals" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <Users className="w-4 h-4" />
            Approvals
          </Link>
          <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <Briefcase className="w-4 h-4" />
            Job Moderation
          </Link>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">System</div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F19]">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-white font-medium">System Administrator</h2>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm text-slate-400">System Online</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
