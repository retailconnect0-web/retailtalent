"use client";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Loader2, X } from "lucide-react";
import { trainingService, Training } from "@/services/TrainingService";

export default function SalesTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await trainingService.getAllTrainings();
        setTrainings(data);
      } catch (e) {
        console.error("Failed to load trainings");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainings();
  }, []);

  const handleRegisterClick = (training: Training) => {
    setSelectedTraining(training);
    setName("");
    setPhone("");
    setEmail("");
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraining) return;

    // Admin WhatsApp Number
    const adminPhone = "919986698096"; 
    
    const text = `Hello, I would like to register for the Sales Training:%0A%0A*Training:* ${selectedTraining.title}%0A*Date:* ${selectedTraining.date || 'TBD'}%0A*Location:* ${selectedTraining.location}%0A%0A*My Details:*%0AName: ${name}%0APhone: ${phone}%0AEmail: ${email}`;
    
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${text}`;
    window.open(whatsappUrl, '_blank');
    
    // Close modal
    setSelectedTraining(null);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Sales Training Programs</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Upgrade your skills and increase your earning potential with our expert-led retail and sales training sessions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center text-slate-500 py-20 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Training Programs Available</h3>
            <p>Please check back later for upcoming sessions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {trainings.map((training) => (
              <div key={training.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Retail Skills
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {training.price > 0 ? `₹${training.price}` : "Free"}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{training.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                    {training.description}
                  </p>

                  <div className="space-y-3 text-sm text-slate-600">
                    {training.date ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>{new Date(training.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>Date TBD</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{training.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>{training.capacity ? `Capacity: ${training.capacity}` : 'Open Capacity'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 pt-0 mt-auto">
                  <button 
                    onClick={() => handleRegisterClick(training)}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Registration Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setSelectedTraining(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Register for Training</h3>
              <p className="text-sm text-slate-500 mt-1">{selectedTraining.title}</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Please enter exactly 10 digits"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 9876543210" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Request on WhatsApp
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-4">
                    By clicking request, you will be redirected to WhatsApp to confirm your registration.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
