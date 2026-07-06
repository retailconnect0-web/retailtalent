"use client";

import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronRight, Home, Building2, Rocket, CheckCircle2, GraduationCap, Settings, Box, Users, Award, Monitor, PieChart } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const categories = [
    { name: "Remote", icon: Home },
    { name: "MNC", icon: Building2 },
    { name: "Startup", icon: Rocket },
    { name: "Project Mgmt", icon: CheckCircle2 },
    { name: "Internship", icon: GraduationCap },
    { name: "Engineering", icon: Settings },
    { name: "Supply Chain", icon: Box },
    { name: "HR", icon: Users },
    { name: "Fortune 500", icon: Award },
    { name: "Software & IT", icon: Monitor },
    { name: "Analytics", icon: PieChart },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-slate-50/50">
      {/* Abstract Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-400/10 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-10">
            Find your dream job now
          </h1>

          {/* Search Bar Container */}
          <div className="bg-white rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 md:p-3 mb-12 flex flex-col md:flex-row items-center border border-slate-100 max-w-4xl mx-auto transition-all">
            
            {/* Skills Input */}
            <div className="flex items-center flex-1 w-full px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Enter skills / designations / companies" 
                className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-sm md:text-base ml-3"
              />
            </div>

            {/* Experience Dropdown (Mock) */}
            <div className="flex items-center w-full md:w-auto px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-slate-200 cursor-pointer group shrink-0">
              <div className="w-full flex items-center justify-between gap-4">
                <span className="text-slate-400 text-sm md:text-base group-hover:text-slate-600 transition-colors whitespace-nowrap">Select experience</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Location Input */}
            <div className="flex items-center flex-1 w-full px-4 py-3 md:py-0">
              <input 
                type="text" 
                placeholder="Enter location" 
                className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
              />
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto mt-2 md:mt-0 px-2 md:px-0 pb-2 md:pb-0">
              <Button className="w-full md:w-auto h-12 md:h-12 px-8 rounded-2xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all">
                Search
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {categories.map((category, i) => (
              <Link 
                key={i} 
                href="/jobs"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <category.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{category.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
