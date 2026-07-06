"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function AdminLoginPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (values: z.infer<typeof adminSchema>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Hardcoded verification as requested
        if (values.email === "flyggoagency@gmail.com" && values.password === "Flyggo@8") {
          toast.success("Authentication successful. Welcome, Admin.");
          router.push("/admin");
        } else {
          toast.error("Access Denied. Invalid credentials.");
        }
        resolve(true);
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Dark mode background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="w-full max-w-md px-4 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Authentication</h1>
            <p className="text-slate-400 text-sm">Restricted Area. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@retailtalent.in"
                className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-white transition-all outline-none"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-white transition-all outline-none"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {isSubmitting ? "Authenticating..." : "Authorize"}
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
