"use client";

import Link from "next/link";
import { Home, Search, Briefcase, User, Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "candidate") {
          setProfile(userProfile);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: "/candidate", label: "Dashboard", icon: Home },
    { href: "/jobs", label: "Find Jobs", icon: Search },
    { href: "/candidate/applications", label: "My Applications", icon: Briefcase },
    { href: "/candidate/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="py-5 px-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="bg-emerald-500 text-white p-1.5 rounded group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Retail<span className="text-emerald-500">Connect</span>
            </span>
          </Link>
          <div className="text-sm text-slate-500 font-medium pl-9">
            Candidate - Hello, <span className="text-slate-800">{profile?.fullName ? profile.fullName.split(' ')[0] : '...'}</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={async () => {
              await userService.logout();
              window.location.href = "/";
            }}
            className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex flex-col md:hidden">
            <span className="font-bold text-lg tracking-tight">
              Retail<span className="text-emerald-500">Connect</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Candidate - Hello, {profile?.fullName ? profile.fullName.split(' ')[0] : '...'}
            </span>
          </div>
          
          <div className="hidden md:flex flex-1"></div> {/* Spacer on desktop */}
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              {profile?.photoUrl ? (
                <img src={profile.photoUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "User")}&background=10b981&color=fff`} alt="User" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-50 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={clsx(
                "flex flex-col items-center gap-1 p-2 transition-colors",
                isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label === "My Applications" ? "Apps" : link.label.replace("Find ", "")}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
