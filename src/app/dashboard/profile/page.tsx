"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { userService, UserProfile, CompanyProfile } from "@/services/UserService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Loader2, 
  Save, 
  Edit3, 
  Map,
  User,
  Briefcase,
  Globe,
  Tag,
  FileText
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase/config";


const CLOUDINARY_CLOUD_NAME = "ddnv4rmh4";
const CLOUDINARY_UPLOAD_PRESET = "retailconnect_uploads";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CompanyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [companyData, setCompanyData] = useState({
    name: "",
    gstName: "",
    brandName: "",
    gstNumber: "",
    products: "",
    website: "",
    state: "",
    city: "",
    contactPhone: "",
  });

  const [userData, setUserData] = useState({
    fullName: "",
    designation: "",
    whatsappNumber: "",
    altPhoneNumber: "",
  });

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
            setUserData({
              fullName: userProfile.fullName || "",
              designation: userProfile.designation || "",
              whatsappNumber: userProfile.whatsappNumber || "",
              altPhoneNumber: userProfile.altPhoneNumber || "",
            });
            
            if (userProfile.companyId) {
              const fetchedCompany = await userService.getCompanyDetails(userProfile.companyId);
              if (fetchedCompany) {
                setCompany(fetchedCompany);
                setCompanyData({
                  name: fetchedCompany.name || "",
                  gstName: fetchedCompany.gstName || "",
                  brandName: fetchedCompany.brandName || "",
                  gstNumber: fetchedCompany.gstNumber || "",
                  products: fetchedCompany.products || "",
                  website: fetchedCompany.website || "",
                  state: fetchedCompany.state || "",
                  city: fetchedCompany.city || "",
                  contactPhone: fetchedCompany.contactPhone || "",
                });
                
                // If it's a new profile lacking details, start in edit mode
                if (!fetchedCompany.gstNumber) {
                  setIsEditing(true);
                }
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

    }; initAuth(); return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Failed to upload file");
    }

    const data = await res.json();
    return data.secure_url; 
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.companyId || !company) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploadingLogo(true);
      const url = await uploadFileToCloudinary(file);
      
      await userService.updateCompanyDetails(profile.companyId, { logoUrl: url });
      
      setCompany(prev => prev ? { ...prev, logoUrl: url } : null);
      toast.success("Company logo updated successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.companyId || !profile?.uid) return;
    
    try {
      setSaving(true);
      // Ensure the 'name' field is a fallback if brandName isn't provided
      const finalCompanyData = {
        ...companyData,
        name: companyData.brandName || companyData.gstName || companyData.name
      };

      await Promise.all([
        userService.updateCompanyDetails(profile.companyId, finalCompanyData),
        userService.updateUserProfile(profile.uid, userData)
      ]);
      
      setCompany(prev => prev ? { ...prev, ...finalCompanyData } : null);
      toast.success("Employer details saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const inputClass = `w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-slate-700 transition-all outline-none ${isEditing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white" : "opacity-70 cursor-not-allowed"}`;
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employer Profile</h1>
          <p className="text-slate-500 mt-1">Manage your company and contact details.</p>
        </div>
        
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white shadow-lg flex items-center gap-2 rounded-xl px-6 py-5 h-auto"
          >
            <Edit3 className="w-5 h-5" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Banner & Logo Section */}
        <div className="h-32 bg-gradient-to-r from-blue-600/20 to-blue-600/5 relative">
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            
            {/* Logo Avatar Upload */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                {uploadingLogo ? (
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                ) : company?.logoUrl ? (
                  <img src={company.logoUrl} alt="Company Logo" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  type="button"
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg hover:scale-110 hover:bg-blue-700 transition-all"
                  title="Upload Logo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input 
                type="file" 
                ref={logoInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="pb-2 hidden sm:block">
              <h2 className="text-2xl font-bold text-slate-900">{companyData.brandName || companyData.gstName || companyData.name || "Company Name"}</h2>
              <p className="text-slate-500 text-sm font-medium">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Spacer for banner overlap */}
        <div className="h-24 sm:h-20"></div>

        {/* Form Details */}
        <form onSubmit={handleSaveProfile} className="p-8 space-y-10">
          
          {/* Section: Company Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className={labelClass}>Company Name (As per GST)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="gstName" value={companyData.gstName} onChange={handleCompanyChange} disabled={!isEditing} placeholder="Acme Private Limited" className={inputClass} />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Brand Name</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" name="brandName" value={companyData.brandName} onChange={handleCompanyChange} disabled={!isEditing} placeholder="Acme Corp" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Company GST Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="gstNumber" value={companyData.gstNumber} onChange={handleCompanyChange} disabled={!isEditing} placeholder="22AAAAA0000A1Z5" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Company Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="url" name="website" value={companyData.website} onChange={handleCompanyChange} disabled={!isEditing} placeholder="https://www.example.com" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Company Products/Industry</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" name="products" value={companyData.products} onChange={handleCompanyChange} disabled={!isEditing} placeholder="FMCG, Apparel, Electronics..." className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact Person Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-5 h-5 text-blue-600" /> Contact Person Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className={labelClass}>Representative Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="fullName" value={userData.fullName} onChange={handleUserChange} disabled={!isEditing} placeholder="John Doe" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="designation" value={userData.designation} onChange={handleUserChange} disabled={!isEditing} placeholder="HR Manager" className={inputClass} />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className={labelClass}>Official E-Mail Id (Login Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={profile?.email || ""} disabled={true} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-10 py-3 text-slate-500 cursor-not-allowed outline-none" title="Email cannot be changed directly." />
                </div>
              </div>

              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="tel" name="whatsappNumber" value={userData.whatsappNumber} onChange={handleUserChange} disabled={!isEditing} placeholder="+91 9876543210" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Alternative Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" name="altPhoneNumber" value={userData.altPhoneNumber} onChange={handleUserChange} disabled={!isEditing} placeholder="+91 9876543210" className={inputClass} />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                 <label className={labelClass}>Company Main Contact Number (Optional)</label>
                 <div className="relative">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   <input type="tel" name="contactPhone" value={companyData.contactPhone} onChange={handleCompanyChange} disabled={!isEditing} placeholder="Office Board Line" className={inputClass} />
                 </div>
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Company Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>State</label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select required name="state" value={companyData.state} onChange={handleCompanyChange} disabled={!isEditing} className={`${inputClass} appearance-none pr-4`}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="city" value={companyData.city} onChange={handleCompanyChange} disabled={!isEditing} placeholder="Mumbai" className={inputClass} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10 pb-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={saving} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-600/20 flex items-center gap-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Employer Profile
              </Button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
