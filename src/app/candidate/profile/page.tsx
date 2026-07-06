"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  FileText, MapPin, Briefcase, Award, Loader2, 
  Phone, Calendar, GraduationCap, Languages, 
  Camera, UploadCloud, Edit3 
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function CandidateProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [altPhoneNumber, setAltPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualification, setQualification] = useState("");
  const [college, setCollege] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await userService.getCurrentUser();
        if (userProfile && userProfile.role === "candidate") {
          setProfile(userProfile);
          setFullName(userProfile.fullName || "");
          setPhoneNumber(userProfile.phoneNumber || "");
          setAltPhoneNumber(userProfile.altPhoneNumber || "");
          setDob(userProfile.dob || "");
          setLocation(userProfile.location || "");
          setLanguages(userProfile.languages || "");
          setQualification(userProfile.qualification || "");
          setCollege(userProfile.college || "");
          setExperience(userProfile.experience || "");
          setSkills(userProfile.skills || "");
          setPhotoUrl(userProfile.photoUrl || "");
          setResumeUrl(userProfile.resumeUrl || "");
          
          // Lock profile if it's already complete
          setIsEditing(!userProfile.profileComplete);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const uploadToCloudinary = async (file: File, type: 'image' | 'raw') => {
    if (type === 'image' && file.size > 5 * 1024 * 1024) throw new Error("Image must be less than 5MB");
    if (type === 'raw' && file.size > 10 * 1024 * 1024) throw new Error("PDF must be less than 10MB");
    if (type === 'image' && !file.type.startsWith('image/')) throw new Error("Only images are allowed for profile photo");
    if (type === 'raw' && file.type !== 'application/pdf') throw new Error("Only PDF files are allowed for resume");

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'retailconnect_uploads');
    
    if (type === 'image') {
      formData.append('fetch_format', 'auto');
      formData.append('quality', 'auto');
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/ddnv4rmh4/${type}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error("Failed to upload file to Cloudinary");
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file, 'image');
      setPhotoUrl(url);
      toast.success("Profile photo uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingResume(true);
    try {
      const url = await uploadToCloudinary(file, 'raw');
      setResumeUrl(url);
      toast.success("Resume uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload resume.");
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    try {
      await userService.updateUserProfile(profile.uid, {
        fullName,
        phoneNumber,
        altPhoneNumber,
        dob,
        location,
        languages,
        qualification,
        college,
        experience,
        skills,
        photoUrl,
        resumeUrl
      });
      toast.success("Profile saved successfully!");
      setIsEditing(false); // Hide save button and lock fields after save
      window.dispatchEvent(new Event('auth-state-changed'));
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await userService.logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg px-4 py-3 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? "Complete your profile to get noticed by top recruiters." : "Review your profile details below."}
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
          <Link href="/jobs" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full sm:w-auto border-emerald-200 text-emerald-600 hover:bg-emerald-50">
              Browse Jobs
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50">
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserPlaceholder />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-slate-900 mb-1">Profile Photo</h3>
              <p className="text-sm text-slate-500 mb-3">Upload a professional photo (Max 5MB, JPG/PNG).</p>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => isEditing && fileInputRef.current?.click()}
                disabled={uploadingImage || !isEditing}
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 disabled:opacity-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>

          {/* Contact Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-500" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={profile?.email || ""}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Alternative Number</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  value={altPhoneNumber}
                  onChange={e => setAltPhoneNumber(e.target.value)}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Personal Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  disabled={!isEditing}
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Current Location</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, India"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2 flex items-center gap-1">
                  Languages Known
                </label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={languages}
                  onChange={e => setLanguages(e.target.value)}
                  placeholder="e.g. English, Hindi"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Education & Experience Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-500" /> Education & Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Highest Qualification</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={qualification}
                  onChange={e => setQualification(e.target.value)}
                  placeholder="e.g. B.Tech, MBA, B.Com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">College / University Studied</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. Mumbai University"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Experience Level</label>
                <select 
                  disabled={!isEditing}
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Key Skills</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="e.g. Sales, React"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Resume Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" /> Resume / CV
            </h3>
            
            <div 
              className={`border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors bg-slate-50 ${isEditing ? 'hover:border-emerald-300 cursor-pointer' : 'opacity-80'}`} 
              onClick={() => isEditing && !uploadingResume && resumeInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".pdf,application/pdf" 
                className="hidden" 
                ref={resumeInputRef}
                onChange={handleResumeUpload}
              />
              {uploadingResume ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-3" />
                  <p className="text-slate-600 font-medium">Uploading your resume...</p>
                </div>
              ) : resumeUrl ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-emerald-700 font-medium mb-1">Resume uploaded successfully!</p>
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-emerald-500 text-sm hover:underline" onClick={e => e.stopPropagation()}>View current resume</a>
                  {isEditing && <p className="text-slate-400 text-xs mt-3">Click anywhere in this box to replace it.</p>}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-slate-700 font-medium mb-1">{isEditing ? "Click to upload your resume (PDF)" : "No resume uploaded"}</p>
                  {isEditing && <p className="text-slate-500 text-sm">Maximum file size: 10MB</p>}
                </div>
              )}
            </div>
          </div>

          {/* Conditional Save/Edit Buttons */}
          {isEditing ? (
            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl mt-4 shadow-lg shadow-emerald-600/20 transition-all text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Profile...
                </>
              ) : "Save Profile Details"}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-6 rounded-xl mt-4 shadow-lg shadow-slate-900/20 transition-all text-base"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          )}

        </form>
      </div>
    </div>
  );
}

function UserPlaceholder() {
  return (
    <svg className="w-12 h-12 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
