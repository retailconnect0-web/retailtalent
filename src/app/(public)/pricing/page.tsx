import { Calendar, MapPin, Users, IndianRupee } from "lucide-react";

export default function SalesTrainingPage() {
  // Mock data for sales trainings
  const trainings = [
    {
      id: 1,
      title: "Advanced FMCG Sales Techniques",
      date: "2026-08-15",
      location: "Mumbai HQ",
      capacity: 50,
      price: 500,
      description: "Learn advanced techniques for selling fast-moving consumer goods in retail environments."
    },
    {
      id: 2,
      title: "Customer Engagement Masterclass",
      date: "2026-08-22",
      location: "Zoom Online",
      capacity: 100,
      price: 0,
      description: "Master the art of engaging customers on the floor and increasing conversion rates."
    },
    {
      id: 3,
      title: "Visual Merchandising Basics",
      date: "2026-09-05",
      location: "Delhi Branch",
      capacity: 30,
      price: 1500,
      description: "Learn how to arrange store displays to maximize sales and highlight key products."
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Sales Training Programs</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Upgrade your skills and increase your earning potential with our expert-led retail and sales training sessions.
          </p>
        </div>

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
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>{new Date(training.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{training.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>Capacity: {training.capacity}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
