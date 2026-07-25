"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function OnboardingModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already made a selection
    const hasSelected = sessionStorage.getItem("onboarding_complete");
    if (!hasSelected) {
      setIsOpen(true);
    }
  }, []);

  const handleSelection = (role: 'candidate' | 'recruiter') => {
    sessionStorage.setItem("onboarding_complete", "true");
    setIsOpen(false);
    
    if (role === 'candidate') {
      router.push("/jobs");
    } else {
      router.push("/hire");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 w-full max-w-4xl rounded-2xl p-8 md:p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        <h2 className="text-2xl md:text-3xl font-medium text-slate-500 mb-8 text-left">
          What do you want to do?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          
          {/* Candidate Card */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => handleSelection('candidate')}
              className="w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all relative group flex bg-blue-600"
            >
              {/* Left blue section with text */}
              <div className="w-1/2 relative z-10 flex flex-col justify-center pl-8 text-white">
                <h3 className="text-3xl font-bold leading-tight">I want a<br />job</h3>
              </div>
              
              {/* Diagonal separator + Image */}
              <div className="w-1/2 absolute right-0 top-0 bottom-0 h-full overflow-hidden" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                <img 
                  src="/images/candidate_card.jpg" 
                  alt="Candidate looking for a job" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => handleSelection('recruiter')}
              className="w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all relative group flex bg-blue-600"
            >
              {/* Left blue section with text */}
              <div className="w-1/2 relative z-10 flex flex-col justify-center pl-8 text-white">
                <h3 className="text-3xl font-bold leading-tight">I want to<br />hire people</h3>
              </div>
              
              {/* Diagonal separator + Image */}
              <div className="w-1/2 absolute right-0 top-0 bottom-0 h-full overflow-hidden" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
                <img 
                  src="/images/recruiter_card.jpg" 
                  alt="Recruiter looking to hire" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Optional close button if you want them to be able to close without selecting */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
