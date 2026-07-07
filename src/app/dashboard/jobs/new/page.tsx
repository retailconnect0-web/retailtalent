"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userService, UserProfile, CompanyProfile } from "@/services/UserService";
import { jobService } from "@/services/JobService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Briefcase, 
  MapPin, 
  Banknote, 
  GraduationCap, 
  Sparkles,
  ArrowLeft,
  Loader2,
  Send
} from "lucide-react";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/firebase/config";


const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters."),
  location: z.string().min(2, "Location is required."),
  salary: z.string().min(2, "Salary range is required."),
  type: z.enum(["Full Time", "Part Time", "Contract", "Internship"]),
  experienceLevel: z.string().min(1, "Experience level is required."),
  skills: z.string().optional(),
  categories: z.string().optional()
});

export default function PostNewJobPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: "Full Time"
    }
  });

  useEffect(() => {
    let unsubscribe: any;
      const initAuth = async () => {
        const { onAuthStateChanged } = await import("firebase/auth");
        const auth = await getFirebaseAuth();
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "recruiter" && userProfile.companyId) {
          setProfile(userProfile);
          const companyData = await userService.getCompanyDetails(userProfile.companyId);
          if (companyData) {
            setCompany(companyData);
          } else {
            toast.error("Company profile not found.");
            router.push("/dashboard");
          }
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoadingAuth(false);
    });

    }; initAuth(); return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  const onSubmit = async (values: z.infer<typeof jobSchema>) => {
    if (!profile?.companyId || !company?.name) {
      toast.error("Missing company information.");
      return;
    }

    try {
      // Convert comma-separated string to array and trim whitespace
      const categoriesArray = values.categories 
        ? values.categories.split(',').map(c => c.trim()).filter(c => c)
        : [];

      await jobService.createJob({
        title: values.title,
        companyId: profile.companyId,
        companyName: company.name,
        companyLogoUrl: company.logoUrl || "",
        location: values.location,
        salary: values.salary,
        type: values.type,
        status: "Active", // Instantly active upon posting
        skills: values.skills || "",
        experienceLevel: values.experienceLevel,
        categories: categoriesArray
      });

      toast.success("Job posted successfully!");
      router.push("/dashboard/jobs");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const inputClass = "w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-11 py-3 text-slate-700 transition-all outline-none";

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-12">
      <Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
        <p className="text-slate-500 mt-1">Fill out the details below to publish your listing instantly.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Senior Store Manager"
                className={inputClass}
              />
            </div>
            {errors.title && <p className="text-red-500 text-sm mt-1 ml-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("location")}
                  type="text"
                  placeholder="e.g. Mumbai, MH or Remote"
                  className={inputClass}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1 ml-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Employment Type</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  {...register("type")}
                  className={`${inputClass} appearance-none pr-4 cursor-pointer`}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              {errors.type && <p className="text-red-500 text-sm mt-1 ml-1">{errors.type.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range</label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("salary")}
                  type="text"
                  placeholder="e.g. ₹3,00,000 - ₹5,00,000 PA"
                  className={inputClass}
                />
              </div>
              {errors.salary && <p className="text-red-500 text-sm mt-1 ml-1">{errors.salary.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Required</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("experienceLevel")}
                  type="text"
                  placeholder="e.g. 2-4 Years"
                  className={inputClass}
                />
              </div>
              {errors.experienceLevel && <p className="text-red-500 text-sm mt-1 ml-1">{errors.experienceLevel.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Key Skills Required</label>
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("skills")}
                type="text"
                placeholder="e.g. Sales, Customer Service, Inventory"
                className={inputClass}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Separate multiple skills with commas.</p>
            {errors.skills && <p className="text-red-500 text-sm mt-1 ml-1">{errors.skills.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Categories / Tags</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                {...register("categories")}
                type="text"
                placeholder="e.g. Retail, Management, Store Operations"
                className={inputClass}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Helps candidates filter for this job. Separate with commas.</p>
            {errors.categories && <p className="text-red-500 text-sm mt-1 ml-1">{errors.categories.message}</p>}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl px-8 py-6 h-auto text-base font-semibold flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing Job...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
