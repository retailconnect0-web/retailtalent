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
  Map
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
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    city: "",
    contactPhone: "",
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
          if (userProfile.companyId) {
            const companyData = await userService.getCompanyDetails(userProfile.companyId);
            if (companyData) {
              setCompany(companyData);
              setFormData({
                name: companyData.name || "",
                state: companyData.state || "",
                city: companyData.city || "",
                contactPhone: companyData.contactPhone || "",
              });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    return data.secure_url; // The HTTPS URL of the uploaded asset
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
      
      // Update Firestore immediately
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

  const handleSaveProfile = async () => {
    if (!profile?.companyId) return;
    
    try {
      setSaving(true);
      await userService.updateCompanyDetails(profile.companyId, formData);
      setCompany(prev => prev ? { ...prev, ...formData } : null);
      toast.success("Company details saved successfully!");
      setIsEditing(false); // Lock the form after saving
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const inputClass = `w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-slate-700 transition-all outline-none ${isEditing ? "focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" : "opacity-70 cursor-not-allowed"}`;

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company Profile</h1>
          <p className="text-slate-500 mt-1">Manage your company details and logo.</p>
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
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 relative">
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            
            {/* Logo Avatar Upload */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                {uploadingLogo ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                  className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-xl shadow-lg hover:scale-110 hover:bg-primary/90 transition-all"
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
              <h2 className="text-2xl font-bold text-slate-900">{company?.name || "Company Name"}</h2>
              <p className="text-slate-500 text-sm font-medium">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Spacer for banner overlap */}
        <div className="h-24 sm:h-20"></div>

        {/* Form Details */}
        <div className="p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Company Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Acme Corp"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email (Disabled always) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account Email (Cannot be changed)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled={true}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-10 py-3 text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+91 9876543210"
                  className={inputClass}
                />
              </div>
            </div>
            
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Mumbai"
                  className={inputClass}
                />
              </div>
            </div>

            {/* State */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
              <div className="relative">
                <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`${inputClass} appearance-none pr-4`}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
          
          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Company Details
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
