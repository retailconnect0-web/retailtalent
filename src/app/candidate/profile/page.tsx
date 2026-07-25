"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  FileText, MapPin, Briefcase, Award, Loader2, 
  Phone, Calendar, GraduationCap, Languages, 
  Camera, UploadCloud, Edit3, Image as ImageIcon, CreditCard
} from "lucide-react";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/firebase/config";

export default function CandidateProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [altPhoneNumber, setAltPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualification, setQualification] = useState("");
  const [college, setCollege] = useState("");
  
  const [experience, setExperience] = useState(""); // Brand/Store/Category
  const [skills, setSkills] = useState(""); // Sampling, Demo, Merchandising
  const [availability, setAvailability] = useState(""); // Daily/Monthly/Event-based
  
  const [photoUrl, setPhotoUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [aadhaarUrl, setAadhaarUrl] = useState("");
  const [panUrl, setPanUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const auth = await getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userProfile = await userService.getCurrentUser();
          if (userProfile && userProfile.role === "candidate") {
            setProfile(userProfile);
            setFullName(userProfile.fullName || "");
            setPhoneNumber(userProfile.phoneNumber || "");
            setAltPhoneNumber(userProfile.altPhoneNumber || "");
            setDob(userProfile.dob || "");
            setCity(userProfile.city || userProfile.location || "");
            setLanguages(userProfile.languages || "");
            setQualification(userProfile.qualification || "");
            setCollege(userProfile.college || "");
            setExperience(userProfile.experience || "");
            setSkills(userProfile.skills || "");
            setAvailability(userProfile.availability || "");
            setPhotoUrl(userProfile.photoUrl || "");
            setResumeUrl(userProfile.resumeUrl || "");
            setAadhaarUrl(userProfile.aadhaarUrl || "");
            setPanUrl(userProfile.panUrl || "");
            
            setIsEditing(!userProfile.profileComplete);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
        setLoading(false);
      });
    }; initAuth(); return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  const uploadToCloudinary = async (file: File, type: 'image' | 'raw') => {
    if (type === 'image' && file.size > 5 * 1024 * 1024) throw new Error("Image must be less than 5MB");
    if (type === 'raw' && file.size > 10 * 1024 * 1024) throw new Error("PDF must be less than 10MB");
    if (type === 'image' && !file.type.startsWith('image/')) throw new Error("Only images are allowed for this upload");
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'retailconnect_uploads'); // Use your real preset here
    
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
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0], 'image');
      setPhotoUrl(url);
      toast.success("Profile photo uploaded!");
    } catch (error: any) { toast.error(error.message); } 
    finally { setUploadingImage(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: 'aadhaar' | 'pan') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const setter = docType === 'aadhaar' ? setUploadingAadhaar : setUploadingPan;
    const urlSetter = docType === 'aadhaar' ? setAadhaarUrl : setPanUrl;
    const ref = docType === 'aadhaar' ? aadhaarInputRef : panInputRef;
    
    setter(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0], 'image');
      urlSetter(url);
      toast.success(`${docType.toUpperCase()} uploaded successfully!`);
    } catch (error: any) { toast.error(error.message); } 
    finally { setter(false); if (ref.current) ref.current.value = ""; }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await userService.updateUserProfile(profile.uid, {
        fullName, phoneNumber, altPhoneNumber, dob, city,
        languages, qualification, college, experience, skills,
        availability, photoUrl, resumeUrl, aadhaarUrl, panUrl
      });
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) { toast.error("Failed to save profile."); } 
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  const inputClass = "w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg px-4 py-3 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">{isEditing ? "Complete your profile to get noticed by top recruiters." : "Review your profile details below."}</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          {!isEditing && <Button onClick={() => setIsEditing(true)} className="bg-slate-800 hover:bg-slate-900 text-white"><Edit3 className="w-4 h-4 mr-2" /> Edit</Button>}
          <Link href="/jobs"><Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">Browse Jobs</Button></Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Photo */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {uploadingImage ? <Loader2 className="w-8 h-8 animate-spin text-emerald-500" /> : photoUrl ? <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-slate-300" />}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-slate-900 mb-1">Profile Photo</h3>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <Button type="button" variant="outline" size="sm" onClick={() => isEditing && fileInputRef.current?.click()} disabled={uploadingImage || !isEditing}>
                Change Photo
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <input type="text" disabled={!isEditing} value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <input type="text" disabled={!isEditing} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <input type="tel" disabled={!isEditing} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Languages Known</label>
                <input type="text" disabled={!isEditing} value={languages} onChange={e => setLanguages(e.target.value)} placeholder="English, Hindi, Marathi" className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Work Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Work Experience & Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Experience (Brand / Store / Category)</label>
                <input type="text" disabled={!isEditing} value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 2 yrs at Puma, Retail Sales" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Skills (Sampling, Demo, Merchandising)</label>
                <input type="text" disabled={!isEditing} value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Sampling, Demo, Sales" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <select disabled={!isEditing} value={availability} onChange={e => setAvailability(e.target.value)} className={inputClass}>
                  <option value="">Select Availability</option>
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Event-based">Event-based / Weekends</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">Documents (Aadhaar / PAN)</h3>
            <p className="text-sm text-slate-500 mb-6">These documents are securely stored and only shared with verified recruiters.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Aadhaar Upload */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-slate-50 relative overflow-hidden">
                <input type="file" accept="image/*" className="hidden" ref={aadhaarInputRef} onChange={e => handleDocumentUpload(e, 'aadhaar')} />
                {aadhaarUrl ? (
                  <>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Aadhaar Uploaded (Masked View)</span>
                      {isEditing && <Button type="button" variant="outline" size="sm" className="mt-4 border-white/40 bg-black/40 hover:bg-black/60" onClick={() => aadhaarInputRef.current?.click()}>Update</Button>}
                    </div>
                    <img src={aadhaarUrl} alt="Aadhaar" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50" />
                  </>
                ) : (
                  <>
                    {uploadingAadhaar ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mb-2" /> : <CreditCard className="w-8 h-8 text-slate-400 mb-3" />}
                    <Button type="button" variant="outline" disabled={!isEditing || uploadingAadhaar} onClick={() => aadhaarInputRef.current?.click()}>Upload Aadhaar</Button>
                  </>
                )}
              </div>

              {/* PAN Upload */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-slate-50 relative overflow-hidden">
                <input type="file" accept="image/*" className="hidden" ref={panInputRef} onChange={e => handleDocumentUpload(e, 'pan')} />
                {panUrl ? (
                  <>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">PAN Uploaded (Masked View)</span>
                      {isEditing && <Button type="button" variant="outline" size="sm" className="mt-4 border-white/40 bg-black/40 hover:bg-black/60" onClick={() => panInputRef.current?.click()}>Update</Button>}
                    </div>
                    <img src={panUrl} alt="PAN" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50" />
                  </>
                ) : (
                  <>
                    {uploadingPan ? <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mb-2" /> : <CreditCard className="w-8 h-8 text-slate-400 mb-3" />}
                    <Button type="button" variant="outline" disabled={!isEditing || uploadingPan} onClick={() => panInputRef.current?.click()}>Upload PAN Card</Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl mt-4 text-base">
              {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</> : "Save Profile Details"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
