"use client";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { getFirebaseAuth } from "@/lib/firebase/config";

export default function ReviewsPage() {
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
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Ratings & Reviews</h1>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="flex flex-col items-center text-center">
          <span className="text-5xl font-extrabold text-slate-900 mb-2">{profile?.rating?.toFixed(1) || "0.0"}</span>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-5 h-5 ${i <= (profile?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
            ))}
          </div>
          <span className="text-sm text-slate-500">Overall Rating</span>
        </div>
        
        <div className="flex-1 w-full space-y-3">
          {[5, 4, 3, 2, 1].map(stars => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 w-3">{stars}</span>
              <Star className="w-4 h-4 text-slate-400" />
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: stars === 5 && profile?.rating ? '100%' : '0%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Client Reviews</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No reviews yet</p>
          <p className="text-slate-400 text-sm">After you complete assignments, recruiters will leave reviews here.</p>
        </div>
      </div>
    </div>
  );
}
