"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Loader2,
  Users
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function MessagesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded to empty for now.
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "recruiter") {
          setProfile(userProfile);
          // TODO: Fetch messages from MessageService
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 mt-1">Communicate directly with your applicants.</p>
        </div>
      </div>

      {messages.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex h-[600px]">
           {/* Future messages chat UI */}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Inbox is Empty</h2>
          <p className="text-slate-500 max-w-md mb-8">
            You don't have any messages yet. Start reviewing your applicants to initiate conversations!
          </p>
          <Link href="/dashboard/candidates">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-all text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              View Candidates
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
