"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { jobService, Job } from "@/services/JobService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Briefcase, MapPin, Map, IndianRupee, Tag, 
  Languages as LanguagesIcon, 
  CheckSquare, Loader2, ArrowLeft, Trash2, Plus
} from "lucide-react";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/firebase/config";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const DEPARTMENTS = [
  "Alco-Beverage", "Food", "Non-Food", "Cosmetic", "Telecom", "Apparel"
];

const AVAILABLE_SKILLS = [
  "Sampling", "Demo", "Merchandising", "Sales"
];

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "Promoter",
    employmentType: "Full Time" as "Full Time" | "Event Based",
    state: "",
    city: "",
    salaryCost: "",
    experienceDepartment: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<Array<{ name: string; speak: number; read: number; write: number }>>([]);
  const [newLangName, setNewLangName] = useState("");

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userProfile = await userService.getCurrentUser();
          if (userProfile && userProfile.role === "recruiter") {
            setProfile(userProfile);
            if (userProfile.companyId) {
              const fetchedCompany = await userService.getCompanyDetails(userProfile.companyId);
              if (fetchedCompany) {
                setCompanyName(fetchedCompany.brandName || fetchedCompany.gstName || fetchedCompany.name || "Company");
                if (fetchedCompany.logoUrl) setCompanyLogoUrl(fetchedCompany.logoUrl);
              }
            }
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
        setLoading(false);
      });
    }; 
    
    initAuth(); 
    return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  // Fetch Job details
  useEffect(() => {
    const fetchJob = async () => {
      if (!id || typeof id !== 'string') return;
      try {
        const job = await jobService.getJobById(id);
        if (job) {
          setFormData({
            title: job.title as any,
            employmentType: job.employmentType,
            state: job.state,
            city: job.city,
            salaryCost: job.salaryCost.toString(),
            experienceDepartment: job.experienceDepartment,
          });
          if (job.skills) setSkills(job.skills);
          if (job.languages) setLanguages(job.languages);
        }
      } catch (err) {
        console.error("Error fetching job", err);
      }
    };
    if (profile) {
      fetchJob();
    }
  }, [id, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "title" && (value === "Merchandiser" || value === "Sales Representative")) {
      setFormData((prev) => ({ ...prev, [name]: value, employmentType: "Full Time" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addLanguage = () => {
    if (!newLangName.trim()) return;
    setLanguages(prev => [...prev, { name: newLangName.trim(), speak: 0, read: 0, write: 0 }]);
    setNewLangName("");
  };

  const updateLanguage = (index: number, field: 'speak'|'read'|'write', val: number) => {
    const updated = [...languages];
    updated[index][field] = val;
    setLanguages(updated);
  };

  const removeLanguage = (index: number) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.companyId) return;

    if (!formData.state || !formData.city || !formData.salaryCost || !formData.experienceDepartment) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      
      const salaryType = (formData.title === "Promoter" && formData.employmentType === "Event Based") 
        ? "Per Day" 
        : "Per Month";

      const jobData: Omit<Job, "id" | "postedAt"> = {
        title: formData.title,
        companyId: profile.companyId,
        companyName: companyName,
        companyLogoUrl: companyLogoUrl,
        state: formData.state,
        city: formData.city,
        employmentType: formData.employmentType,
        salaryCost: Number(formData.salaryCost),
        salaryType: salaryType,
        experienceDepartment: formData.experienceDepartment,
        languages: languages,
        skills: skills,
        status: "Active",
      };

      await jobService.updateJob(id as string, jobData);
      toast.success("Job updated successfully!");
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post job.");
    } finally {
      setSaving(false);
    }
  };

  // Determine Salary Label dynamically
  const salaryLabel = (formData.title === "Promoter" && formData.employmentType === "Event Based")
    ? "Per Day Cost"
    : "Per Month Cost";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Job</h1>
          <p className="text-slate-500 mt-1">Update the details of your job listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" /> Role Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Job Title *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="title" value={formData.title} onChange={handleInputChange} className={`${inputClass} appearance-none pr-4`} required>
                  <option value="Promoter">Promoter</option>
                  <option value="Merchandiser">Merchandiser</option>
                  <option value="Sales Representative">Sales Representative</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Employment Type *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  name="employmentType" 
                  value={formData.employmentType} 
                  onChange={handleInputChange} 
                  className={`${inputClass} appearance-none pr-4 ${formData.title !== "Promoter" ? "opacity-60 bg-slate-200 cursor-not-allowed" : ""}`} 
                  required
                  disabled={formData.title !== "Promoter"}
                >
                  <option value="Full Time">Full Time</option>
                  {formData.title === "Promoter" && <option value="Event Based">Event Based</option>}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>State *</label>
              <div className="relative">
                <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="state" value={formData.state} onChange={handleInputChange} className={`${inputClass} appearance-none pr-4`} required>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>City *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" className={inputClass} required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Salary Range ({salaryLabel}) *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="number" name="salaryCost" value={formData.salaryCost} onChange={handleInputChange} placeholder="e.g. 15000" min="0" className={inputClass} required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Experience Department *</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="experienceDepartment" value={formData.experienceDepartment} onChange={handleInputChange} className={`${inputClass} appearance-none pr-4`} required>
                  <option value="">Select Category</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="p-8 bg-slate-50 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" /> Required Skills
          </h3>
          <div className="flex flex-wrap gap-4">
            {AVAILABLE_SKILLS.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  skills.includes(skill)
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-300"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <LanguagesIcon className="w-5 h-5 text-blue-600" /> Languages Required
          </h3>
          <p className="text-slate-500 text-sm mb-6">Specify the language proficiencies needed for this role (Scale 0 to 5).</p>
          
          <div className="space-y-4 mb-6">
            {languages.map((lang, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row gap-6 items-center">
                <div className="font-bold text-slate-800 w-32">{lang.name}</div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {(['speak', 'read', 'write'] as const).map((field) => (
                    <div key={field} className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase w-12">{field}</label>
                      <input 
                        type="range" 
                        min="0" max="5" step="1" 
                        value={lang[field]} 
                        onChange={(e) => updateLanguage(index, field, parseInt(e.target.value))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="text-sm font-bold w-4 text-center">{lang[field]}</span>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={() => removeLanguage(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 max-w-sm">
            <input 
              type="text" 
              value={newLangName} 
              onChange={(e) => setNewLangName(e.target.value)} 
              placeholder="e.g. English" 
              className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <Button type="button" onClick={addLanguage} disabled={!newLangName.trim()} className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg px-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-6 shadow-lg shadow-blue-600/20 text-lg flex items-center gap-2">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Briefcase className="w-5 h-5" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
