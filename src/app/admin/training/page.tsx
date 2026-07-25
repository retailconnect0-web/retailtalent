"use client";
import { useState } from "react";
import { PlusCircle, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminSalesTrainingPage() {
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call to save training details
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Sales Training created successfully!");
      setTitle("");
      setDate("");
      setLocation("");
      setCapacity("");
      setPrice("");
      setDescription("");
    } catch (err) {
      toast.error("Failed to create training.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-lg px-4 py-2.5 outline-none transition-all";
  const labelClass = "text-sm font-medium text-slate-400 block mb-1.5";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Training Programs</h1>
          <p className="text-slate-400 text-sm mt-1">Schedule and manage training for candidates</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-red-500" /> Create New Training
          </h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className={labelClass}>Training Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Advanced FMCG Sales Techniques" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}><Calendar className="w-4 h-4 inline mr-1" /> Date</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1" /> Location</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai HQ or Zoom" className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}><Users className="w-4 h-4 inline mr-1" /> Capacity</label>
                <input required type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g. 50" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Price (₹)</label>
                <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 500 or 0 for free" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description & Agenda</label>
              <textarea 
                required 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="What will the candidates learn?" 
                className={inputClass}
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg flex items-center transition-colors shadow-lg shadow-red-900/20 disabled:opacity-70"
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Publish Training"}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
