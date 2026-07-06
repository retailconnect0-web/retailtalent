import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Choose the perfect plan for your hiring needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="border rounded-2xl p-8 bg-white shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-muted-foreground text-sm mb-6">Perfect for small retail stores.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">Free</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Post up to 2 jobs/month</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Basic candidate filtering</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Standard support</li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-primary rounded-2xl p-8 bg-white shadow-xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-muted-foreground text-sm mb-6">For growing retail brands.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹4,999</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Post up to 20 jobs/month</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Advanced filtering & AI matching</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Priority support</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Candidate background checks</li>
            </ul>
            <button className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
              Choose Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-2xl p-8 bg-white shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-muted-foreground text-sm mb-6">For pan-India retail operations.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">Custom</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Unlimited job postings</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Dedicated account manager</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> API access</li>
              <li className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-emerald-500" /> Custom analytics reports</li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
