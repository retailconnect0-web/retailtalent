"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { KeyRound, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }).regex(/^\d+$/, "Only numbers allowed"),
});

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (values: z.infer<typeof otpSchema>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success("Email verified successfully! You can now reset your password.");
        router.push("/login"); // In a real app, this would go to a reset password screen
        resolve(true);
      }, 1500);
    });
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Check your email</h1>
          <p className="text-slate-500">We sent a 6-digit verification code to <span className="font-semibold text-slate-800">{email}</span>.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("otp")}
                type="text"
                maxLength={6}
                placeholder="123456"
                className="w-full bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-10 py-3 transition-all outline-none tracking-widest text-lg font-medium text-center"
              />
            </div>
            {errors.otp && <p className="text-red-500 text-sm mt-1 ml-1 text-center">{errors.otp.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-medium rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Didn't receive the email?{" "}
          <button onClick={() => toast.success("OTP resent to email!")} className="font-semibold text-primary hover:underline">
            Click to resend
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <Suspense fallback={<div className="animate-pulse w-96 h-96 bg-white/50 rounded-3xl"></div>}>
        <OTPForm />
      </Suspense>
    </div>
  );
}
