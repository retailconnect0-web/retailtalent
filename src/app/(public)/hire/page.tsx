"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/UserService";

export default function HirePage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      if (isForgotPassword) {
        await userService.resetPassword(email);
        setSuccessMsg("Password reset email sent! Please check your inbox.");
        setIsForgotPassword(false);
      } else if (isLogin) {
        await userService.login(email, password);
        router.push("/dashboard");
      } else {
        const fullName = `${firstName} ${lastName}`;
        await userService.registerRecruiter(email, password, fullName, companyName, "", "", "");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      let message = error.message || "An authentication error occurred.";
      
      if (error.code === 'auth/configuration-not-found' || message.includes('auth/configuration-not-found')) {
        message = "Firebase Error: Authentication is not enabled. Please go to Firebase Console -> Authentication -> Sign-in method -> Enable Email/Password.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "User ID not found or incorrect credentials.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      }
      
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMode = (login: boolean) => {
    setIsLogin(login);
    setIsForgotPassword(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="pt-32 pb-16 min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">Hire the Best Retail Talent in India</h1>
        <p className="text-slate-600 text-lg md:text-xl mb-12 font-medium">
          Access a verified pool of 50,000+ promoters, merchandisers, and field staff.
        </p>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm text-left max-w-xl mx-auto">
          
          {/* Auth Toggle Header */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {isForgotPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
            
            {!isForgotPassword && (
              <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-sm">
                <button 
                  type="button"
                  onClick={() => toggleLoginMode(false)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign Up
                </button>
                <button 
                  type="button"
                  onClick={() => toggleLoginMode(true)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium border border-emerald-100">
                {successMsg}
              </div>
            )}

            {!isLogin && !isForgotPassword && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-slate-700">First Name</label>
                    <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="John" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-slate-700">Last Name</label>
                    <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Doe" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-slate-700">Company Name</label>
                  <input required value={companyName} onChange={e => setCompanyName(e.target.value)} type="text" placeholder="Acme Retail" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
              </>
            )}
            
            <div>
              <label className="text-sm font-medium mb-1.5 block text-slate-700">Work Email</label>
              <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="john@acmeretail.com" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>

            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  {isLogin && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs font-semibold text-blue-600 hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input required value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl mt-2 shadow-lg shadow-blue-600/20 transition-all text-base"
            >
              {isLoading ? "Please wait..." : isForgotPassword ? "Send Reset Link" : isLogin ? "Log In to Dashboard" : "Create Account"}
            </Button>
            
            {isForgotPassword && (
              <button 
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mt-2"
              >
                Back to Login
              </button>
            )}
            
          </form>
        </div>
      </div>
    </div>
  );
}
