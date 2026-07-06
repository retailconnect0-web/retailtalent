"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Building2, MapPin, Phone, Map } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { userService } from "@/services/UserService";

const recruiterSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  state: z.string().min(1, "State is required."),
  city: z.string().min(1, "City is required."),
  phone: z.string().min(10, "Valid phone number is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function RegisterPage() {
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof recruiterSchema>>({
    resolver: zodResolver(recruiterSchema),
  });

  const onSubmit = async (values: z.infer<typeof recruiterSchema>) => {
    try {
      const registerPromise = userService.registerRecruiter(
        values.email, 
        values.password, 
        values.companyName, // Use company name as fullName for now
        values.companyName,
        values.state,
        values.city,
        values.phone
      );

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("FIRESTORE_TIMEOUT")), 8000)
      );

      await Promise.race([registerPromise, timeoutPromise]);
      
      toast.success(`Recruiter account created successfully!`);
      router.push("/dashboard");
      
    } catch (error: any) {
      console.error(error);
      let message = error.message || "An authentication error occurred.";
      
      if (message === "FIRESTORE_TIMEOUT") {
        message = "Connection timeout! Please make sure you have enabled 'Firestore Database' in your Firebase Console.";
      } else if (error.code === 'auth/configuration-not-found' || message.includes('auth/configuration-not-found')) {
        message = "Firebase Error: Authentication is not enabled. Please enable it in Firebase Console.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists.";
      }
      toast.error(message);
    }
  };

  const inputClass = "w-full bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-10 py-3 transition-all outline-none";

  return (
    <div className="min-h-screen pt-28 pb-24 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="w-full max-w-lg px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create an account</h1>
            <p className="text-slate-500">Join India's largest retail hiring network</p>
          </div>

          <div className="flex bg-slate-100/80 p-1 rounded-xl mb-6">
            <button
              onClick={() => setRole("candidate")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                role === "candidate" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              I am a Candidate
            </button>
            <button
              onClick={() => setRole("recruiter")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                role === "recruiter" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              I am a Recruiter
            </button>
          </div>

          {role === "candidate" ? (
            <div className="space-y-4 min-h-[300px] flex items-center">
              <Button
                onClick={async () => {
                  try {
                    await userService.signInWithGoogleCandidate();
                    toast.success("Signed in successfully!");
                    router.push("/candidate/profile");
                  } catch (error: any) {
                    toast.error(error.message || "Failed to sign in with Google.");
                  }
                }}
                className="w-full h-14 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium rounded-xl flex items-center justify-center gap-3 transition-all text-base"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register("companyName")}
                    type="text"
                    placeholder="Company Name"
                    className={inputClass}
                  />
                </div>
                {errors.companyName && <p className="text-red-500 text-sm mt-1 ml-1">{errors.companyName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      {...register("state")}
                      className={`w-full bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-10 pr-4 py-3 transition-all outline-none appearance-none`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {errors.state && <p className="text-red-500 text-sm mt-1 ml-1">{errors.state.message}</p>}
                </div>
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...register("city")}
                      type="text"
                      placeholder="City"
                      className={inputClass}
                    />
                  </div>
                  {errors.city && <p className="text-red-500 text-sm mt-1 ml-1">{errors.city.message}</p>}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Contact Number"
                    className={inputClass}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1 ml-1">{errors.phone.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@company.com"
                    className={inputClass}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                      className={inputClass}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="Re-enter password"
                      className={inputClass}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-2 text-base font-medium rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Creating company..." : "Create Company Account"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
               Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
