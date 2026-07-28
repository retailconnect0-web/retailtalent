"use client";
import { useState, useEffect } from "react";
import { PlusCircle, Calendar, MapPin, Users, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trainingService, Training } from "@/services/TrainingService";

export default function AdminSalesTrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const fetchTrainings = async () => {
    setFetching(true);
    try {
      const data = await trainingService.getAllTrainings();
      setTrainings(data);
    } catch (e) {
      toast.error("Failed to load trainings");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setLocation("");
    setCapacity("");
    setPrice("");
    setDescription("");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (t: Training) => {
    setTitle(t.title || "");
    setDate(t.date || "");
    setLocation(t.location || "");
    setCapacity(t.capacity ? t.capacity.toString() : "");
    setPrice(t.price !== undefined ? t.price.toString() : "0");
    setDescription(t.description || "");
    setIsEditing(true);
    setEditingId(t.id!);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    
    try {
      await trainingService.deleteTraining(id);
      toast.success("Training deleted successfully!");
      fetchTrainings();
    } catch (e) {
      toast.error("Failed to delete training");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        title,
        location,
        price: Number(price),
        description,
      };
      
      if (date) payload.date = date; else payload.date = null;
      if (capacity) payload.capacity = Number(capacity); else payload.capacity = null;

      if (isEditing && editingId) {
        await trainingService.updateTraining(editingId, payload);
        toast.success("Sales Training updated successfully!");
      } else {
        await trainingService.createTraining(payload);
        toast.success("Sales Training created successfully!");
      }
      
      resetForm();
      fetchTrainings();
    } catch (err: any) {
      console.error("Training Form Error:", err);
      toast.error(isEditing ? `Failed to update training: ${err.message}` : `Failed to create training: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-lg px-4 py-2.5 outline-none transition-all";
  const labelClass = "text-sm font-medium text-slate-400 block mb-1.5";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Training Programs</h1>
          <p className="text-slate-400 text-sm mt-1">Schedule and manage training for candidates</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            {isEditing ? <Edit className="w-5 h-5 text-amber-500" /> : <PlusCircle className="w-5 h-5 text-red-500" />}
            {isEditing ? "Edit Training" : "Create New Training"}
          </h2>
          {isEditing && (
            <button onClick={resetForm} className="text-xs text-slate-400 hover:text-white transition-colors">
              Cancel Edit
            </button>
          )}
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className={labelClass}>Training Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Advanced FMCG Sales Techniques" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}><Calendar className="w-4 h-4 inline mr-1" /> Date (Optional)</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1" /> Location</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai HQ or Zoom" className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}><Users className="w-4 h-4 inline mr-1" /> Capacity (Optional)</label>
                <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g. 50" className={inputClass} />
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

            <div className="flex justify-end pt-4 border-t border-slate-800 gap-3">
              {isEditing && (
                <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg text-slate-400 font-medium hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg flex items-center transition-colors shadow-lg shadow-red-900/20 disabled:opacity-70"
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isEditing ? "Updating..." : "Saving..."}</> : isEditing ? "Update Training" : "Publish Training"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-semibold text-white">Existing Trainings</h2>
        </div>
        
        <div className="p-0">
          {fetching ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-slate-500 animate-spin" /></div>
          ) : trainings.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No trainings found. Create one above.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {trainings.map(t => (
                <div key={t.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{t.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      {t.date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {t.date}</span>}
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {t.location}</span>
                      {t.capacity ? <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {t.capacity} seats</span> : <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Open</span>}
                      <span className="font-bold text-emerald-500">₹{t.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(t)} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(t.id!)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
