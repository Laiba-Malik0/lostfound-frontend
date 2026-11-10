
import { Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  Heart,
  Mail,
  Phone,
  ArrowUpRight
} from "lucide-react";

function Footer() {
  return (
    <footer className="relative bg-white border-t border-[#70245F]/10 text-[#746777] text-xs mt-16 font-sans overflow-hidden">

      {/* Top Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#54204F] via-[#923D7D] to-[#70245F]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#70245F] to-[#54204F] p-2.5 rounded-xl text-white shadow-lg shadow-[#70245F]/20">
              <Search className="w-5 h-5" />
            </div>

            <span className="text-xl font-extrabold tracking-tight text-[#352536]">
              RECOVER<span className="text-[#873675]">A</span>
            </span>
          </div>

          <p className="text-[#807385] leading-7 max-w-xs text-[12px]">
            AI-powered community portal designed to reconnect individuals with lost personal belongings quickly and securely.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#F8F0F7] border border-[#70245F]/10 text-[#70245F] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safe & Trusted Community</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-extrabold text-[#39283B] uppercase tracking-[0.13em] mb-5 text-[11px]">
            Quick Navigation
          </h4>

          <ul className="space-y-3.5 font-medium">
            <li>
              <Link to="/lost-items" className="group flex items-center justify-between hover:text-[#70245F] transition-colors duration-200">
                Lost Items Search
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            </li>

            <li>
              <Link to="/found-items" className="group flex items-center justify-between hover:text-[#70245F] transition-colors duration-200">
                Found Belongings
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            </li>

            <li>
              <Link to="/report" className="group flex items-center justify-between hover:text-[#70245F] transition-colors duration-200">
                Submit New Report
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            </li>

            <li>
              <Link to="/dashboard" className="group flex items-center justify-between hover:text-[#70245F] transition-colors duration-200">
                User Dashboard
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Community Trust */}
        <div>
          <h4 className="font-extrabold text-[#39283B] uppercase tracking-[0.13em] mb-5 text-[11px]">
            Community Trust
          </h4>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5EDF5] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#70245F]" />
              </div>
              <div>
                <p className="font-bold text-[#49374A]">Verified Claims</p>
                <p className="text-[11px] text-[#928397] mt-1">
                  Verification-focused recovery process
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5EDF5] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-[#873675]" />
              </div>
              <div>
                <p className="font-bold text-[#49374A]">Community Driven</p>
                <p className="text-[11px] text-[#928397] mt-1">
                  100% Non-Profit Community Helper
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-extrabold text-[#39283B] uppercase tracking-[0.13em] mb-5 text-[11px]">
            Support Gateway
          </h4>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5EDF5] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#70245F]" />
              </div>
              <span className="font-semibold text-[#66566A] break-all">
                support@recovera.app
              </span>
            </li>

            <li className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5EDF5] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#70245F]" />
              </div>
              <span className="font-semibold text-[#66566A]">
                +1 (800) 555-RECOVER
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#70245F]/10 bg-[#FCF9FC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

          <p className="text-[11px] text-[#978A99]">
            © {new Date().getFullYear()} Recovera. All rights reserved.
          </p>

          <p className="text-[11px] text-[#978A99] flex items-center gap-1.5">
            Crafted with
            <Heart className="w-3 h-3 text-[#873675] fill-[#873675]" />
            Powered by Google Gemini AI
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
