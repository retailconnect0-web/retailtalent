"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Settings as SettingsIcon,
  Bell, 
  Lock, 
  ShieldAlert,
  Loader2,
  Mail,
  Send
} from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReset, setSendingReset] = useState(false);

  // Placeholder states for UI toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "recruiter") {
          setProfile(userProfile);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handlePasswordReset = async () => {
    if (!profile?.email) return;
    
    try {
      setSendingReset(true);
      await userService.resetPassword(profile.email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send reset email.");
    } finally {
      setSendingReset(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          Account Settings
        </h1>
        <p className="text-slate-500 mt-1 pl-11">Manage your security and preferences.</p>
      </div>

      <div className="space-y-6">
        
        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  Reset Password via Email
                </p>
                <p className="text-sm text-slate-500 mt-1 max-w-md">
                  We will send a secure link to <span className="font-medium text-slate-700">{profile?.email}</span> to help you reset your password.
                </p>
              </div>
              <Button 
                onClick={handlePasswordReset}
                disabled={sendingReset}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm rounded-xl px-6 shrink-0"
              >
                {sendingReset ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2 text-blue-600" />}
                Send Reset Link
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Email Notifications</h2>
          </div>
          
          <div className="p-6 space-y-4">
            
            <label className="flex items-start justify-between cursor-pointer group p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
              <div>
                <p className="font-semibold text-slate-900">Candidate Applications</p>
                <p className="text-sm text-slate-500 mt-1">Receive an email whenever a candidate applies to one of your active jobs.</p>
              </div>
              <div className="relative inline-flex items-center mt-1">
                <input type="checkbox" className="sr-only peer" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>

            <label className="flex items-start justify-between cursor-pointer group p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
              <div>
                <p className="font-semibold text-slate-900">Marketing & Updates</p>
                <p className="text-sm text-slate-500 mt-1">Receive product updates, hiring tips, and promotional offers from RetailTalent.</p>
              </div>
              <div className="relative inline-flex items-center mt-1">
                <input type="checkbox" className="sr-only peer" checked={marketingEmails} onChange={() => setMarketingEmails(!marketingEmails)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>

          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-50 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Delete Account</p>
                <p className="text-sm text-slate-500 mt-1 max-w-md">
                  Once you delete your account, there is no going back. All your company data, active jobs, and candidate messages will be permanently destroyed.
                </p>
              </div>
              <Button 
                variant="destructive"
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 rounded-xl px-6 shrink-0 transition-colors"
                onClick={() => toast.error("Please contact support to delete your multi-tenant account.")}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
