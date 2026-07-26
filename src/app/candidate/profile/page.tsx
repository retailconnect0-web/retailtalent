"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  FileText, MapPin, Briefcase, Award, Loader2, 
  Phone, Calendar, GraduationCap, Languages, 
  Camera, UploadCloud, Edit3, Image as ImageIcon, CreditCard, Plus, Trash2
} from "lucide-react";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/firebase/config";

// --- Types for Languages ---
interface LanguageProficiency {
  name: string;
  speak: number;
  read: number;
  write: number;
}

export default function CandidateProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAadhaar, setUploadingAadhaar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- Form State ---
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [altPhoneNumber, setAltPhoneNumber] = useState("");
  
  // Education & Bio
  const [qualification, setQualification] = useState("");
  const [qualificationStatus, setQualificationStatus] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [languages, setLanguages] = useState<LanguageProficiency[]>([]);
  
  // Work Info
  const [experienceCategory, setExperienceCategory] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [candidateType, setCandidateType] = useState("");
  const [availability, setAvailability] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");

  const [photoUrl, setPhotoUrl] = useState("");
  const [aadhaarUrl, setAadhaarUrl] = useState("");
  const [panUrl, setPanUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate age whenever DOB changes
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge > 0 ? calculatedAge : null);
    } else {
      setAge(null);
    }
  }, [dob]);

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
            
            // Populate form
            setFullName(userProfile.fullName || "");
            setDob(userProfile.dob || "");
            setGender(userProfile.gender || "");
            setMaritalStatus(userProfile.maritalStatus || "");
            setFatherName(userProfile.fatherName || "");
            setState(userProfile.state || "");
            setCity(userProfile.city || userProfile.location || "");
            setWhatsappNumber(userProfile.whatsappNumber || userProfile.phoneNumber || "");
            setAltPhoneNumber(userProfile.altPhoneNumber || "");
            
            setQualification(userProfile.qualification || "");
            setQualificationStatus(userProfile.qualificationStatus || "");
            setShortBio(userProfile.shortBio || "");
            setLanguages(userProfile.languages || []);
            
            setExperienceCategory(userProfile.experienceCategory || "");
            setSkills(userProfile.skills ? userProfile.skills.split(", ") : []);
            setCandidateType(userProfile.candidateType || "");
            setAvailability(userProfile.availability || "");
            setNoticePeriod(userProfile.noticePeriod || "");
            
            setPhotoUrl(userProfile.photoUrl || "");
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

  const uploadToCloudinary = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be less than 5MB");
    if (!file.type.startsWith('image/')) throw new Error("Only images are allowed for this upload");
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'retailconnect_uploads'); 
    formData.append('fetch_format', 'auto');
    formData.append('quality', 'auto');

    const res = await fetch(`https://api.cloudinary.com/v1_1/ddnv4rmh4/image/upload`, {
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
      const url = await uploadToCloudinary(e.target.files[0]);
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
      const url = await uploadToCloudinary(e.target.files[0]);
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
        fullName, dob, gender, maritalStatus, fatherName, state, city,
        whatsappNumber, altPhoneNumber,
        qualification, qualificationStatus, shortBio, languages,
        experienceCategory, skills: skills.join(", "), candidateType, availability, noticePeriod,
        photoUrl, aadhaarUrl, panUrl
      });
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) { toast.error("Failed to save profile."); } 
    finally { setSaving(false); }
  };

  // Language Handlers
  const addLanguage = () => setLanguages([...languages, { name: "", speak: 0, read: 0, write: 0 }]);
  const updateLanguage = (index: number, field: keyof LanguageProficiency, value: any) => {
    const newLangs = [...languages];
    newLangs[index] = { ...newLangs[index], [field]: value };
    setLanguages(newLangs);
  };
  const removeLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));

  // Skills Handler
  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  const inputClass = "w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg px-4 py-3 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";
  const labelClass = "text-sm font-semibold mb-2 block text-slate-700";

  return (
    <div className="max-w-4xl mx-auto py-8">
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

          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name</label>
                <input required type="text" disabled={!isEditing} value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Father's Name</label>
                <input type="text" disabled={!isEditing} value={fatherName} onChange={e => setFatherName(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input required type="date" disabled={!isEditing} value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Age (Auto)</label>
                  <input type="text" disabled value={age !== null ? `${age} yrs` : ""} className={`${inputClass} bg-slate-50 font-medium`} placeholder="--" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Gender</label>
                  <select disabled={!isEditing} value={gender} onChange={e => setGender(e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Marital Status</label>
                  <select disabled={!isEditing} value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input required type="tel" disabled={!isEditing} value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className={inputClass} placeholder="10-digit number" />
              </div>
              <div>
                <label className={labelClass}>Alternative Number</label>
                <input type="tel" disabled={!isEditing} value={altPhoneNumber} onChange={e => setAltPhoneNumber(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input required type="text" disabled={!isEditing} value={state} onChange={e => setState(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input required type="text" disabled={!isEditing} value={city} onChange={e => setCity(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Education & Bio */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Education & Bio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Qualification</label>
                <select disabled={!isEditing} value={qualification} onChange={e => setQualification(e.target.value)} className={inputClass}>
                  <option value="">Select Qualification</option>
                  <option value="SSLC">SSLC</option>
                  <option value="PUC">PUC</option>
                  <option value="Degree">Degree</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select disabled={!isEditing} value={qualificationStatus} onChange={e => setQualificationStatus(e.target.value)} className={inputClass}>
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In-completed">In-completed</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Short Bio</label>
              <textarea disabled={!isEditing} value={shortBio} onChange={e => setShortBio(e.target.value)} rows={3} placeholder="Tell recruiters a bit about yourself..." className={inputClass}></textarea>
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex justify-between items-center mb-4 border-l-4 border-emerald-500 pl-3">
              <h3 className="text-lg font-bold text-slate-900">Languages Known</h3>
              {isEditing && <Button type="button" variant="outline" size="sm" onClick={addLanguage}><Plus className="w-4 h-4 mr-1"/> Add Language</Button>}
            </div>
            
            <div className="space-y-4">
              {languages.length === 0 && <p className="text-sm text-slate-500 italic">No languages added yet.</p>}
              {languages.map((lang, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="md:col-span-3">
                    <label className="text-xs font-semibold mb-1 block">Language</label>
                    <input type="text" disabled={!isEditing} value={lang.name} onChange={e => updateLanguage(index, 'name', e.target.value)} placeholder="e.g. English" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1 block text-center">Speak (0-5)</label>
                    <input type="number" min="0" max="5" disabled={!isEditing} value={lang.speak} onChange={e => updateLanguage(index, 'speak', parseInt(e.target.value)||0)} className={`${inputClass} text-center`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1 block text-center">Read (0-5)</label>
                    <input type="number" min="0" max="5" disabled={!isEditing} value={lang.read} onChange={e => updateLanguage(index, 'read', parseInt(e.target.value)||0)} className={`${inputClass} text-center`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1 block text-center">Write (0-5)</label>
                    <input type="number" min="0" max="5" disabled={!isEditing} value={lang.write} onChange={e => updateLanguage(index, 'write', parseInt(e.target.value)||0)} className={`${inputClass} text-center`} />
                  </div>
                  {isEditing && (
                    <div className="md:col-span-3 flex justify-end pb-2">
                      <Button type="button" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeLanguage(index)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Professional Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Experience Category</label>
                <select disabled={!isEditing} value={experienceCategory} onChange={e => setExperienceCategory(e.target.value)} className={inputClass}>
                  <option value="">Select Category</option>
                  <option value="Alco-Beverage">Alco-Beverage</option>
                  <option value="Food">Food</option>
                  <option value="Non-Food">Non-Food</option>
                  <option value="Cosmetic">Cosmetic</option>
                  <option value="Telecom">Telecom</option>
                  <option value="Apparel">Apparel</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Candidate Type</label>
                <select disabled={!isEditing} value={candidateType} onChange={e => setCandidateType(e.target.value)} className={inputClass}>
                  <option value="">Select Role</option>
                  <option value="Promotor">Promotor</option>
                  <option value="Merchandiser">Merchandiser</option>
                  <option value="Sales Representative">Sales Representative</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Availability</label>
                <select disabled={!isEditing} value={availability} onChange={e => setAvailability(e.target.value)} className={inputClass}>
                  <option value="">Select Availability</option>
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Event-based">Event-based</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Notice Period</label>
                <select disabled={!isEditing} value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)} className={inputClass}>
                  <option value="">Select Notice Period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Skills</label>
              <div className="flex flex-wrap gap-3">
                {["Sampling", "Demo", "Merchandising", "Sales"].map(skill => (
                  <label key={skill} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                    skills.includes(skill) 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  } ${!isEditing && "opacity-70 pointer-events-none"}`}>
                    <input type="checkbox" className="hidden" checked={skills.includes(skill)} onChange={() => toggleSkill(skill)} disabled={!isEditing} />
                    {skill}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Documents */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Verification Documents</h3>
            <p className="text-sm text-slate-500 mb-6">These documents are securely stored and only shared with verified recruiters.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Aadhaar Upload */}
              <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-slate-50 relative overflow-hidden">
                <input type="file" accept="image/*" className="hidden" ref={aadhaarInputRef} onChange={e => handleDocumentUpload(e, 'aadhaar')} />
                {aadhaarUrl ? (
                  <>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Aadhaar Uploaded</span>
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
                      <span className="text-sm font-medium">PAN Uploaded</span>
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
            <div className="sticky bottom-0 bg-white p-4 border-t border-slate-200 rounded-b-2xl mt-8 -mx-6 md:-mx-8">
              <Button type="submit" disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-emerald-500/20">
                {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving Profile...</> : "Save Profile Details"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
