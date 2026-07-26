"use client";

import { useState, useEffect } from "react";
import { userService, UserProfile } from "@/services/UserService";
import { Star, MessageSquare, Briefcase, ThumbsUp } from "lucide-react";

export default function ReviewsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/config");
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userProfile = await userService.getCurrentUser();
          setProfile(userProfile);
        }
      });
    };
    initAuth();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const rating = profile?.rating || 0;
  const reviewCount = 0; 

  const reviews: any[] = [];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ratings & Reviews</h1>
        <p className="text-slate-500 mt-1">See what recruiters are saying about your work.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        {/* Rating Summary */}
        <div className="md:col-span-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
            <h3 className="text-slate-500 font-medium mb-4">Overall Rating</h3>
            <div className="text-6xl font-black text-slate-900 mb-4">{rating > 0 ? rating.toFixed(1) : "N/A"}</div>
            <div className="flex justify-center items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 ${star <= Math.round(rating) && rating > 0 ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
              ))}
            </div>
            <p className="text-sm text-slate-500">Based on {reviewCount} reviews</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="md:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Rating Breakdown</h3>
            <div className="space-y-4">
              {[
                { stars: 5, pct: 0, count: 0 },
                { stars: 4, pct: 0, count: 0 },
                { stars: 3, pct: 0, count: 0 },
                { stars: 2, pct: 0, count: 0 },
                { stars: 1, pct: 0, count: 0 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12 text-sm font-medium text-slate-700">
                    {row.stars} <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }}></div>
                  </div>
                  <div className="w-8 text-right text-sm text-slate-500">{row.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" /> Recent Feedback
        </h3>
        
        {reviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <p>You don't have any reviews yet. Complete your first job to get feedback!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900">{review.author}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" /> {review.company}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                "{review.text}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
