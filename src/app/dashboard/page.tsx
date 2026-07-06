"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, CheckCircle2, TrendingUp, X, Loader2 } from "lucide-react";
import { userService, UserProfile } from "@/services/UserService";
import { jobService, Job } from "@/services/JobService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ALL_CATEGORIES = [
  "Remote", "MNC", "Startup", "Project Mgmt", "Internship", 
  "Engineering", "Supply Chain", "HR", "Fortune 500", 
  "Software & IT", "Analytics"
];

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState<"Full Time" | "Part Time" | "Contract" | "Internship">("Full Time");
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const currentUser = await userService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.companyId) {
      const companyJobs = await jobService.getJobsByCompany(currentUser.companyId);
      setJobs(companyJobs);
    }
    setLoading(false);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.companyId) return;

    setIsSubmitting(true);
    try {
      await jobService.createJob({
        title,
        companyId: user.companyId,
        companyName: user.fullName, // using fullName as company name for now
        location,
        salary,
        type,
        status: "Active",
        skills,
        experienceLevel,
        categories: selectedCategories
      });
      toast.success("Job posted successfully!");
      setIsModalOpen(false);
      
      // Reset form
      setTitle(""); setLocation(""); setSalary(""); setType("Full Time"); 
      setSkills(""); setExperienceLevel(""); setSelectedCategories([]);
      
      // Reload jobs
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !jobs.length) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] || 'There';

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName} 👋</h1>
        <p className="text-slate-500">Here is what's happening with your retail hiring today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500">Active Jobs</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{jobs.length}</h3>
          <p className="text-sm text-slate-400 font-medium">Published</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Recent Jobs</h2>
          </div>
          <div className="p-0">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                You haven't posted any jobs yet.
              </div>
            ) : (
              jobs.map((job, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{job.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-slate-500">{job.location} • {job.salary}</span>
                        {job.categories?.slice(0,2).map(c => (
                          <span key={c} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/dashboard/jobs/new"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
            >
              <span className="font-medium text-sm text-slate-700 group-hover:text-blue-600">Post a New Job</span>
              <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Job Posting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900">Post a New Job</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePostJob} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Job Title</label>
                  <input required value={title} onChange={e=>setTitle(e.target.value)} type="text" placeholder="e.g. Senior Data Analyst" className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2.5 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Location</label>
                  <input required value={location} onChange={e=>setLocation(e.target.value)} type="text" placeholder="e.g. Bangalore" className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2.5 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Salary Range</label>
                  <input required value={salary} onChange={e=>setSalary(e.target.value)} type="text" placeholder="e.g. ₹12L - ₹15L PA" className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2.5 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Job Type</label>
                  <select required value={type} onChange={e=>setType(e.target.value as any)} className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2.5 outline-none transition-all">
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Required Skills</label>
                <input value={skills} onChange={e=>setSkills(e.target.value)} type="text" placeholder="e.g. React, Node.js, Python (comma separated)" className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2.5 outline-none transition-all" />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Experience Level</label>
                <select required value={experienceLevel} onChange={e=>setExperienceLevel(e.target.value)} className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-4 py-2.5 outline-none transition-all">
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-3">Categories & Tags</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                        selectedCategories.includes(cat)
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Job"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
