"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronDown, ChevronUp, Bookmark, Star, LogIn, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService, UserProfile } from "@/services/UserService";
import { jobService, Job } from "@/services/JobService";
import { applicationService } from "@/services/ApplicationService";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";

const FilterContent = () => (
  <div className="space-y-6">
    {/* Filter Header */}
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <h3 className="font-bold text-slate-900">All Filters</h3>
      <span className="text-sm font-semibold text-blue-600 cursor-pointer">Applied (2)</span>
    </div>

    {/* Department */}
    <div>
      <div className="flex items-center justify-between mb-3 cursor-pointer">
        <h4 className="font-bold text-[15px] text-slate-900">Department</h4>
        <ChevronUp className="w-4 h-4 text-slate-400" />
      </div>
      <div className="space-y-3">
        {[
          { label: 'Production, Manuf...', count: '7932', checked: true },
          { label: 'Construction & Sit...', count: '3555', checked: true },
          { label: 'Engineering - Soft...', count: '29524', checked: false },
          { label: 'Sales & Business D...', count: '20722', checked: false }
        ].map(dept => (
          <label key={dept.label} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={dept.checked}
              readOnly
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
            />
            <span className="group-hover:text-blue-600 transition-colors flex-1">{dept.label}</span>
            <span className="text-slate-400 text-xs">({dept.count})</span>
          </label>
        ))}
        <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline mt-2 inline-block">View More</span>
      </div>
    </div>

    {/* Experience */}
    <div className="pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4 cursor-pointer">
        <h4 className="font-bold text-[15px] text-slate-900">Experience</h4>
        <ChevronUp className="w-4 h-4 text-slate-400" />
      </div>
      <div className="px-2 pb-6">
        <div className="relative h-1 bg-slate-200 rounded-full w-full">
          <div className="absolute top-0 left-0 h-1 bg-slate-900 rounded-full w-full"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold cursor-pointer">
            Any
          </div>
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-500 font-medium">
          <span>0 Yrs</span>
          <span>Any</span>
        </div>
      </div>
    </div>
    
    {/* Salary */}
    <div className="pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3 cursor-pointer">
        <h4 className="font-bold text-[15px] text-slate-900">Salary</h4>
        <ChevronUp className="w-4 h-4 text-slate-400" />
      </div>
      <div className="space-y-3">
        {[
          { label: '0-3 Lakhs', count: '4222' },
          { label: '3-6 Lakhs', count: '6996' },
          { label: '6-10 Lakhs', count: '4492' },
          { label: '10-15 Lakhs', count: '2159' }
        ].map(salary => (
          <label key={salary.label} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="group-hover:text-blue-600 transition-colors flex-1">{salary.label}</span>
            <span className="text-slate-400 text-xs">({salary.count})</span>
          </label>
        ))}
        <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline mt-2 inline-block">View More</span>
      </div>
    </div>

    {/* Location */}
    <div className="pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3 cursor-pointer">
        <h4 className="font-bold text-[15px] text-slate-900">Location</h4>
        <ChevronUp className="w-4 h-4 text-slate-400" />
      </div>
      <div className="space-y-3">
        {[
          { label: 'Bengaluru', count: '1266' },
          { label: 'Mumbai', count: '890' },
          { label: 'Pune', count: '754' }
        ].map(loc => (
          <label key={loc.label} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="group-hover:text-blue-600 transition-colors flex-1">{loc.label}</span>
            <span className="text-slate-400 text-xs">({loc.count})</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default function JobsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isApplyingForId, setIsApplyingForId] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await userService.getCurrentUser();
        setUserProfile(profile);
        if (profile) {
          const ids = await applicationService.getAppliedJobIdsForCandidate(profile.uid);
          setAppliedJobIds(ids);
        }
      } else {
        setUserProfile(null);
        setAppliedJobIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await jobService.getAllJobs();
        // Sort by newest first based on postedAt
        fetchedJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (job: Job) => {
    if (appliedJobIds.includes(job.id)) return;
    
    setIsApplyingForId(job.id);
    try {
      let currentUser = userProfile;
      if (!currentUser) {
        // Not logged in, sign in with Google
        currentUser = await userService.signInWithGoogleCandidate();
        setUserProfile(currentUser);
      }
      
      // Perform the application
      await applicationService.createApplication(job.id, currentUser.uid, job.companyId);
      setAppliedJobIds(prev => [...prev, job.id]);
      toast.success("Successfully applied for the job!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to apply.");
    } finally {
      setIsApplyingForId(null);
    }
  };

  const formatDate = (isoString: string) => {
    const diff = new Date().getTime() - new Date(isoString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Top Search Bar mimicking Naukri */}
        <div className="bg-white rounded-full p-2 mb-8 flex items-center shadow-sm border border-slate-200">
          <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
          <input 
            type="text" 
            placeholder="Search jobs by Skills, Designation, Role" 
            className="w-full bg-transparent border-none outline-none text-slate-700 px-4 py-3"
          />
          <Button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 h-12 text-base font-semibold">Search</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Filters Column (Left) */}
          <div className="col-span-1 lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <details className="lg:hidden bg-white border border-slate-200 rounded-xl mb-6 shadow-sm group">
              <summary className="font-semibold flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="text-slate-800">All Filters</span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                <FilterContent />
              </div>
            </details>

            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-28">
              <FilterContent />
            </div>
          </div>

          {/* Job Listings Column (Center) */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
            
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[13px] font-semibold text-slate-600">
                {loadingJobs ? "Searching..." : `Showing ${jobs.length} Job${jobs.length === 1 ? '' : 's'}`}
              </span>
              <span className="text-[13px] text-slate-500 cursor-pointer flex items-center gap-1">Sort by: <b>Relevance</b> <ChevronDown className="w-3 h-3" /></span>
            </div>

            {loadingJobs ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500">Loading jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-[18px] text-slate-900 hover:text-blue-600 cursor-pointer mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-700 mb-3">
                        <span className="font-medium">{job.companyName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-2">
                        {job.experienceLevel && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {job.experienceLevel}</span>}
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded-full">{job.type}</span>
                      </div>
                      <div className="text-sm text-slate-600 truncate mb-1">
                        <span className="text-slate-500">Salary:</span> {job.salary}
                      </div>
                    </div>
                    {job.companyLogoUrl ? (
                      <div className="w-12 h-12 rounded-lg border border-slate-100 flex items-center justify-center bg-white shrink-0 overflow-hidden">
                        <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-slate-100 flex items-center justify-center p-1 bg-slate-50 shrink-0">
                        <span className="text-xl font-bold text-blue-600">{job.companyName.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  
                  {(job.skills || (job.categories && job.categories.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {job.skills?.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                        <span key={skill} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{skill}</span>
                      ))}
                      {job.categories?.map(cat => (
                        <span key={cat} className="text-[11px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{cat}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{formatDate(job.postedAt)}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 h-8 px-2">
                        <Bookmark className="w-4 h-4 mr-1" /> Save
                      </Button>
                      
                      {(() => {
                        const hasApplied = appliedJobIds.includes(job.id);
                        const isCurrentlyApplying = isApplyingForId === job.id;
                        
                        return (
                          <Button 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); handleApply(job); }}
                            disabled={hasApplied || isCurrentlyApplying}
                            className={`h-8 px-4 flex items-center gap-2 font-medium transition-colors ${
                              hasApplied 
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white opacity-100 cursor-default" 
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {isCurrentlyApplying ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : !userProfile && !hasApplied ? (
                              <LogIn className="w-3.5 h-3.5" />
                            ) : null}
                            {isCurrentlyApplying 
                              ? "Applying..." 
                              : hasApplied 
                                ? "Applied" 
                                : userProfile 
                                  ? "Apply Now" 
                                  : "Apply with Google"}
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <SearchX className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
                <p className="text-slate-500 mb-6 max-w-sm">There are currently no active job listings. Check back later or adjust your filters.</p>
                <Link href="/register">
                  <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Sign Up for Job Alerts</Button>
                </Link>
              </div>
            )}

          </div>

          {/* Right Sidebar (Ads / Featured) */}
          <div className="hidden lg:flex col-span-3 flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-[15px] text-slate-900 mb-4">Featured Companies</h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">AWS</div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">IBM</div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">TCS</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
