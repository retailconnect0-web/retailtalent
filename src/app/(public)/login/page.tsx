"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User, Building2 } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/UserService";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function LoginPage() {
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const user = await userService.login(values.email, values.password);
      toast.success("Successfully logged in!");
      
      if (user?.role === "candidate") {
        router.push("/candidate/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      let message = error.message || "An authentication error occurred.";
      if (error.code === 'auth/configuration-not-found' || message.includes('auth/configuration-not-found')) {
        message = "Firebase Error: Authentication is not enabled. Please enable it in Firebase Console.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "User ID not found or incorrect credentials.";
      }
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Sign in to your RetailTalent account</p>
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
            <div className="space-y-4">
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
                className="w-full h-12 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium rounded-xl flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Sign in with Google
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-10 py-3 transition-all outline-none"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-10 py-3 transition-all outline-none"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
