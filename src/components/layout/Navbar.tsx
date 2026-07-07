"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { userService, UserProfile } from "@/services/UserService";
import { getFirebaseAuth } from "@/lib/firebase/config";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let unsubscribe: any;
    
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await userService.getCurrentUser();
          setUser(profile);
        } else {
          setUser(null);
        }
      });
    };
    
    initAuth();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Retail<span className="text-primary">Talent</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Find Jobs
          </Link>
          <Link href="/hire" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Hire Staff
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About Us
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link href={user.role === "candidate" ? "/candidate/profile" : "/dashboard"}>
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary hover:border-primary/80 hover:scale-105 transition-all shadow-md cursor-pointer">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=2563eb&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden"
        >
          <Link href="/" className="text-base font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/jobs" className="text-base font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
            Find Jobs
          </Link>
          <Link href="/hire" className="text-base font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
            Hire Staff
          </Link>
          <Link href="/pricing" className="text-base font-medium p-2 hover:bg-muted rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </Link>
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {user ? (
              <Link href={user.role === "candidate" ? "/candidate/profile" : "/dashboard"} className="w-full flex items-center justify-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 shrink-0">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=2563eb&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="font-semibold text-slate-700">{user.role === "candidate" ? "My Profile" : "Dashboard"}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full justify-center bg-primary text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
