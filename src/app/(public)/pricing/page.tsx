import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Dynamic & Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Our pricing is tailored to the capacity, experience, and role of the candidate you hire.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="border rounded-2xl p-8 md:p-12 bg-white shadow-xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Pay for Performance & Capacity</h3>
              <p className="text-muted-foreground mb-6">
                We don't believe in one-size-fits-all subscription plans. You only pay based on the specific requirements of your booking:
              </p>
              <ul className="flex flex-col gap-4 mb-8">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> <span className="font-medium text-slate-700">Role Type</span> (Promoter, Merchandiser, Sales)</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> <span className="font-medium text-slate-700">Experience Level & Skillset</span></li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> <span className="font-medium text-slate-700">Duration</span> (Weekend, Daily, Monthly, Event-based)</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> <span className="font-medium text-slate-700">Candidate Ratings & Reviews</span></li>
              </ul>
            </div>
            
            <div className="w-full md:w-[320px] border rounded-xl p-6 bg-slate-50 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">₹</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Get a Custom Quote</h4>
              <p className="text-sm text-slate-500 mb-6">Connect with us to find the right talent at the right price for your specific needs.</p>
              <button className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
