"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { userService } from "@/services/UserService";

const forgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    try {
      await userService.resetPassword(values.email);
      toast.success(`Password reset link sent to ${values.email}`);
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-500">Enter your email and we'll send you a password reset link.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
