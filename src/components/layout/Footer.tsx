import Link from "next/link";
import { Briefcase, Globe, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="bg-primary text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Retail<span className="text-primary">Talent</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-8">
              India's Trusted Marketplace for Retail Promoters, Merchandisers, and Sales Executives. Connecting talent with opportunity.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Platform</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link href="/hire" className="hover:text-white transition-colors">Hire Staff</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Recruiter Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RetailTalent. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
