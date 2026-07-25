"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Calendar, Briefcase, Globe, Building2, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { bookingService } from "@/services/BookingService";
import { notificationService } from "@/services/NotificationService";
import { userService } from "@/services/UserService";
import { toast } from "sonner";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

export default function BookStaffPage() {
  const router = useRouter();
  const [recruiterId, setRecruiterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState("FMCG");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setRecruiterId(firebaseUser.uid);
          const userProfile = await userService.getCurrentUser();
          if (userProfile && userProfile.role === "recruiter") {
             // We can pre-fill company name if we fetch company details, but keeping it simple
             setCompanyName(userProfile.fullName + "'s Company");
          }
        } else {
          router.push("/login");
        }
      });
    };
    initAuth();
  }, [router]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock candidate ID for prototype
      const dummyCandidateId = "weekend_promoter_123"; 

      await bookingService.createBooking({
        recruiterId,
        candidateId: dummyCandidateId,
        companyName,
        brand,
        industry,
        companyWebsite,
        startDate,
        endDate
      });

      // Send WhatsApp Notification to Admin
      await notificationService.notifyBookingConfirmed({
        companyName,
        brand,
        industry,
        website: companyWebsite,
        candidateName: "Weekend Promoter (Dummy)"
      });

      setSuccess(true);
      toast.success("Booking confirmed! The admin has been notified.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-3 outline-none transition-all";

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
        <p className="text-slate-600 text-lg mb-8">
          Your weekend promoter has been successfully booked. Our admin has received an instant WhatsApp notification with your details.
        </p>
        <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-6">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Book a Weekend Promoter</h1>
        <p className="text-slate-600">Quickly reserve verified weekend promoters for your store or event.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleBooking} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" /> Company Details</h3>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Company Name</label>
                <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} placeholder="e.g. Reliance Retail" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Brand</label>
                <input required type="text" value={brand} onChange={e => setBrand(e.target.value)} className={inputClass} placeholder="e.g. Smart Bazaar" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Industry</label>
                  <select required value={industry} onChange={e => setIndustry(e.target.value)} className={inputClass}>
                    <option value="FMCG">FMCG</option>
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Apparel & Fashion">Apparel & Fashion</option>
                    <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Company Website</label>
                  <input required type="url" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} className={inputClass} placeholder="https://..." />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> Booking Dates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Start Date</label>
                  <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">End Date</label>
                  <input required type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl mt-6 shadow-lg shadow-blue-600/20 text-lg">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : "Confirm Booking"}
            </Button>
            
          </form>
        </div>

        {/* Right Col: Summary */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">How it works</h3>
            <ul className="space-y-4 relative">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <p className="text-sm text-slate-600">Provide your brand details and the dates you need staff.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <p className="text-sm text-slate-600">Our admin receives a WhatsApp alert instantly.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                <p className="text-sm text-slate-600">We assign the best available candidate and notify you.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
            <MessageCircle className="w-8 h-8 text-green-600 shrink-0" />
            <div>
              <h4 className="font-bold text-green-900 mb-1">Instant WhatsApp Alerts</h4>
              <p className="text-sm text-green-800">Our team gets notified on WhatsApp the second you hit confirm, ensuring zero delays.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
