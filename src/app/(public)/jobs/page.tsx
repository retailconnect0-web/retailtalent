"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronDown, ChevronUp, Bookmark, Star, LogIn, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService, UserProfile } from "@/services/UserService";
import { jobService, Job } from "@/services/JobService";
import { applicationService } from "@/services/ApplicationService";
import { toast } from "sonner";

import { getFirebaseAuth } from "@/lib/firebase/config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function JobsContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isApplyingForId, setIsApplyingForId] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const searchParams = useSearchParams();
  const initQ = searchParams?.get('q') || "";
  const initLoc = searchParams?.get('loc') || "";
  const initDept = searchParams?.get('dept') || "";

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initQ);
  const [selectedDepts, setSelectedDepts] = useState<string[]>(initDept ? [initDept] : []);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initLoc ? [initLoc] : []);

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, async (user) => {
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
    }; initAuth(); return () => { if (unsubscribe) unsubscribe(); };
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
        currentUser = await userService.signInWithGoogleCandidate();
        setUserProfile(currentUser);
      }
      
      const app = await applicationService.createApplication(job.id, currentUser.uid, job.companyId);
      setAppliedJobIds(prev => [...prev, job.id]);
      toast.success("Successfully applied! Redirecting to WhatsApp...");
      
      const adminPhone = "919986698096"; 
      const text = `New Application (ID: ${app.displayId || app.id.substring(0, 6).toUpperCase()})%0A%0A*Job Details:*%0ATitle: ${job.title}%0ACompany: ${job.companyName}%0A%0A*Candidate Details:*%0AName: ${currentUser.fullName || "Candidate"}%0AEmail: ${currentUser.email}%0ALocation: ${currentUser.city || 'N/A'}, ${currentUser.state || 'N/A'}%0AExperience: ${currentUser.experienceCategory || 'N/A'}`;
      
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${text}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to apply.");
    } finally {
      setIsApplyingForId(null);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "Recently";
    const diff = new Date().getTime() - new Date(isoString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  // Toggle helpers
  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const filteredJobs = jobs.filter(job => {
    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const skillsArray = Array.isArray(job.skills) ? job.skills : (typeof job.skills === 'string' ? (job.skills as string).split(',') : []);
      const match = job.title.toLowerCase().includes(q) || 
                    job.companyName.toLowerCase().includes(q) || 
                    (skillsArray.length > 0 && skillsArray.some((s: string) => s.toLowerCase().includes(q))) ||
                    (job.city && job.city.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Department
    if (selectedDepts.length > 0) {
      if (!selectedDepts.includes(job.experienceDepartment)) return false;
    }

    // 3. Job Title
    if (selectedTitles.length > 0) {
      if (!selectedTitles.includes(job.title)) return false;
    }

    // 4. Salary
    if (selectedSalaries.length > 0) {
      const salaryMatch = selectedSalaries.some(range => {
         if (range === 'Below ₹10,000') return job.salaryCost < 10000;
         if (range === '₹10,000 - ₹20,000') return job.salaryCost >= 10000 && job.salaryCost <= 20000;
         if (range === '₹20,000 - ₹30,000') return job.salaryCost > 20000 && job.salaryCost <= 30000;
         if (range === 'Above ₹30,000') return job.salaryCost > 30000;
         return false;
      });
      if (!salaryMatch) return false;
    }

    // 5. Location
    if (selectedLocations.length > 0) {
      if (!job.city || !selectedLocations.some(l => job.city.toLowerCase().includes(l.toLowerCase()))) return false;
    }

    return true;
  });

  // Dynamically extract unique cities from active jobs for the location filter
  const uniqueCities = Array.from(new Set(jobs.map(j => j.city).filter(Boolean))).sort();

  const FilterContentComponent = () => {
    const activeFiltersCount = selectedDepts.length + selectedTitles.length + selectedSalaries.length + selectedLocations.length + (searchQuery ? 1 : 0);

    const clearFilters = () => {
      setSelectedDepts([]);
      setSelectedTitles([]);
      setSelectedSalaries([]);
      setSelectedLocations([]);
      setSearchQuery("");
    };

    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">All Filters</h3>
          {activeFiltersCount > 0 && (
            <span onClick={clearFilters} className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">Clear All</span>
          )}
        </div>

        {/* Department */}
        <div>
          <div className="flex items-center justify-between mb-3 cursor-pointer">
            <h4 className="font-bold text-[15px] text-slate-900">Department</h4>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {[
              "Alco-Beverage", "Food", "Non-Food", "Cosmetic", "Telecom", "Apparel"
            ].map(dept => (
              <label key={dept} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedDepts.includes(dept)}
                  onChange={() => toggleSelection(setSelectedDepts, dept)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="group-hover:text-blue-600 transition-colors flex-1">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Title */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 cursor-pointer">
            <h4 className="font-bold text-[15px] text-slate-900">Job Title</h4>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {[
              "Promoter", "Merchandiser", "Sales Representative"
            ].map(title => (
              <label key={title} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedTitles.includes(title)}
                  onChange={() => toggleSelection(setSelectedTitles, title)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="group-hover:text-blue-600 transition-colors flex-1">{title}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Salary */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 cursor-pointer">
            <h4 className="font-bold text-[15px] text-slate-900">Salary Scale</h4>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {[
              'Below ₹10,000',
              '₹10,000 - ₹20,000',
              '₹20,000 - ₹30,000',
              'Above ₹30,000'
            ].map(salary => (
              <label key={salary} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedSalaries.includes(salary)}
                  onChange={() => toggleSelection(setSelectedSalaries, salary)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="group-hover:text-blue-600 transition-colors flex-1">{salary}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location (City) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 cursor-pointer">
            <h4 className="font-bold text-[15px] text-slate-900">Location (City)</h4>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {uniqueCities.length > 0 ? (
              uniqueCities.map(city => (
                <label key={city} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedLocations.includes(city)}
                    onChange={() => toggleSelection(setSelectedLocations, city)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="group-hover:text-blue-600 transition-colors flex-1">{city}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-400">No active cities available.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Top Search Bar */}
        <div className="bg-white rounded-full p-2 mb-8 flex items-center shadow-sm border border-slate-200">
          <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by Title, Skills, Company or Location" 
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
                <span className="text-slate-800 flex items-center gap-2">
                  All Filters 
                  {(selectedDepts.length + selectedTitles.length + selectedSalaries.length + selectedLocations.length) > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">Active</span>
                  )}
                </span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                <FilterContentComponent />
              </div>
            </details>

            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-28">
              <FilterContentComponent />
            </div>
          </div>

          {/* Job Listings Column (Center) */}
          <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
            
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[13px] font-semibold text-slate-600">
                {loadingJobs ? "Searching..." : `Showing ${filteredJobs.length} Job${filteredJobs.length === 1 ? '' : 's'}`}
              </span>
              <span className="text-[13px] text-slate-500 cursor-pointer flex items-center gap-1">Sort by: <b>Relevance</b> <ChevronDown className="w-3 h-3" /></span>
            </div>

            {loadingJobs ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500">Loading jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-[18px] text-slate-900 hover:text-blue-600 cursor-pointer mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-700 mb-3">
                        <span className="font-medium">{job.companyName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-2">
                        {job.experienceDepartment && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {job.experienceDepartment}</span>}
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.city}, {job.state}</span>
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-100 px-2 py-0.5 rounded-full">{job.employmentType}</span>
                      </div>
                      <div className="text-sm text-slate-600 truncate mb-1">
                        <span className="text-slate-500">Salary:</span> ₹{job.salaryCost?.toLocaleString('en-IN')} {job.salaryType}
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
                  
                  {job.skills && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {(Array.isArray(job.skills) ? job.skills : (typeof job.skills === 'string' ? (job.skills as string).split(',') : [])).map((skill: string) => (
                        <span key={skill.trim()} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{skill.trim()}</span>
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
                <p className="text-slate-500 mb-6 max-w-sm">There are currently no active job listings matching your filters. Adjust your filters or try a different search.</p>
                <Button variant="outline" onClick={() => {setSearchQuery(""); setSelectedDepts([]); setSelectedTitles([]); setSelectedSalaries([]); setSelectedLocations([]);}} className="text-blue-600 border-blue-200 hover:bg-blue-50">Clear All Filters</Button>
              </div>
            )}

          </div>

          {/* Right Sidebar (Ads / Featured) */}
          <div className="hidden lg:flex col-span-3 flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-[15px] text-slate-900 mb-4">Top Companies Hiring</h4>
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">PUMA</div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">L'OREAL</div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600">HUL</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
