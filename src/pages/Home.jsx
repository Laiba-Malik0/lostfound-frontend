
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

import {
  Search,
  HandHeart,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Heart,
  Radar,
  Sparkles,
  MoveUpRight
} from "lucide-react";

const sectionVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
};

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/items");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const lostItems = items.filter(
    (i) => i.type?.toLowerCase() === "lost"
  );

  const foundItems = items.filter(
    (i) => i.type?.toLowerCase() === "found"
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF7FA] text-[#352239] font-['Inter',sans-serif]">

      {/* ================= HERO BANNER ================= */}

      <section className="relative min-h-[440px] sm:min-h-[475px] flex items-center justify-center overflow-hidden bg-[#54244F] px-5 py-16 sm:py-20">

        {/* Background effects */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          {/* Left white glow */}
          <motion.div
            animate={{
              opacity: [0.18, 0.35, 0.18],
              x: [-10, 15, -10]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -left-32 top-1/2 -translate-y-1/2 w-[330px] h-[330px] rounded-full bg-white/30 blur-[90px]"
          />

          {/* Right white glow */}
          <motion.div
            animate={{
              opacity: [0.2, 0.36, 0.2],
              x: [10, -15, 10]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-32 top-1/2 -translate-y-1/2 w-[330px] h-[330px] rounded-full bg-white/30 blur-[90px]"
          />

          {/* Center pink-purple glow */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#D99BCF]/30 rounded-full blur-[90px]"
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "45px 45px"
            }}
          />

          {/* Decorative rings */}
          <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.07]" />
          <div className="absolute w-[390px] h-[390px] rounded-full border border-white/[0.05]" />

        </div>

        {/* Hero content */}

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
          >
            <Radar className="w-4 h-4 text-[#F2C6E8]" />

            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              Smart Recovery Portal
            </span>

            <Sparkles className="w-3.5 h-3.5 text-[#F2C6E8]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.2] text-white"
          >
            Lost Something Important?

            <br />

            <span className="bg-gradient-to-r from-[#F1CDE9] via-white to-[#E6B7DC] bg-clip-text text-transparent">
              Reclaim It Effortlessly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-xl mx-auto mt-5 text-xs sm:text-sm text-white/75 font-medium leading-7"
          >
            Report lost belongings or submit found items in real-time.
            Connect with your community and make recovery easier,
            safer and smarter.
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row justify-center gap-3 mt-7 max-w-md mx-auto"
          >

            <Link
              to="/report"
              className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#54244F] text-xs font-extrabold shadow-lg hover:bg-[#F5EAF3] hover:-translate-y-1 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Report Lost Item
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/report"
              className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white text-xs font-extrabold backdrop-blur-sm hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <HandHeart className="w-4 h-4 text-[#F1CDE9]" />
              Report Found Item
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap justify-center gap-5 sm:gap-8 mt-7 text-[10px] font-semibold text-white/65"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8B9DE]" />
              Safe Community
            </span>

            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F3D3A2]" />
              Smart Matching
            </span>

            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B9DE]" />
              Easy Recovery
            </span>
          </motion.div>

        </div>

        {/* Bottom transition */}

        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#FAF7FA] to-transparent pointer-events-none" />

      </section>


      {/* ================= STATISTICS ================= */}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariant}
        className="px-5 sm:px-8 pt-5 pb-12"
      >

        <motion.div
          variants={containerVariant}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4"
        >

          {[
            {
              label: "Active Lost Posts",
              value: lostItems.length,
              icon: Search,
              iconColor: "text-[#9A713F]",
              iconBg: "bg-[#F9F0E5]"
            },
            {
              label: "Found & Saved",
              value: foundItems.length,
              icon: CheckCircle2,
              iconColor: "text-[#713665]",
              iconBg: "bg-[#F3E8F2]"
            },
            {
              label: "Total Reports",
              value: items.length,
              icon: Zap,
              iconColor: "text-[#873F79]",
              iconBg: "bg-[#F5EAF3]"
            }
          ].map((stat) => {

            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                variants={cardVariant}
                whileHover={{ y: -5 }}
                className="group bg-white border border-[#713665]/10 rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_18px_rgba(84,36,79,0.04)] hover:shadow-[0_10px_28px_rgba(84,36,79,0.09)] transition-shadow"
              >

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C7B8B]">
                    {stat.label}
                  </p>

                  <h3 className="text-2xl font-extrabold text-[#54244F] mt-1 tabular-nums">
                    {loading ? "—" : stat.value}
                  </h3>
                </div>

              </motion.div>
            );
          })}

        </motion.div>

      </motion.section>


      {/* ================= DIRECTORIES ================= */}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariant}
        className="px-5 sm:px-8 py-12 sm:py-16"
      >

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-9">

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3E8F2] border border-[#713665]/10 text-[#713665] text-[10px] font-extrabold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Explore Recovera
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#54244F] tracking-tight">
              Explore Directories
            </h2>

            <p className="text-xs sm:text-sm text-[#827181] mt-2 font-medium">
              Find missing belongings or help someone recover theirs.
            </p>

          </div>


          <motion.div
            variants={containerVariant}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* Lost Directory */}

            <motion.div variants={cardVariant} whileHover={{ y: -5 }}>
              <Link
                to="/lost-items"
                className="group relative flex flex-col justify-between min-h-[265px] h-full overflow-hidden rounded-2xl bg-white border border-[#713665]/10 p-6 sm:p-7 shadow-sm hover:shadow-[0_12px_30px_rgba(84,36,79,0.09)] hover:border-[#B78BAD]/50 transition-all duration-300"
              >

                <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#F5EAF3] rounded-full blur-3xl opacity-70 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative">

                  <div className="flex justify-between items-center">

                    <div className="w-12 h-12 rounded-xl bg-[#F9F0E5] text-[#98713F] flex items-center justify-center">
                      <Search className="w-6 h-6" />
                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-[#F9F0E5] text-[#98713F] border border-[#EEDFC8] text-[10px] font-extrabold">
                      {loading ? "..." : lostItems.length} Active Posts
                    </span>

                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#54244F] mt-6 group-hover:text-[#873F79] transition-colors">
                    Lost Directory
                  </h3>

                  <p className="text-xs text-[#827181] mt-2 leading-6 max-w-sm font-medium">
                    Browse community posts for missing keys, bags,
                    cards and devices to help owners find them.
                  </p>

                </div>

                <div className="relative flex items-center justify-between mt-6 pt-5 border-t border-[#713665]/10">

                  <span className="text-xs font-extrabold text-[#54244F]">
                    Open Lost Portal
                  </span>

                  <div className="w-9 h-9 rounded-full bg-[#F3E8F2] text-[#713665] flex items-center justify-center group-hover:bg-[#713665] group-hover:text-white group-hover:translate-x-1 transition-all">
                    <MoveUpRight className="w-4 h-4" />
                  </div>

                </div>

              </Link>
            </motion.div>


            {/* Found Directory */}

            <motion.div variants={cardVariant} whileHover={{ y: -5 }}>
              <Link
                to="/found-items"
                className="group relative flex flex-col justify-between min-h-[265px] h-full overflow-hidden rounded-2xl bg-[#54244F] border border-[#713665] p-6 sm:p-7 shadow-sm hover:shadow-[0_12px_30px_rgba(84,36,79,0.20)] transition-all duration-300"
              >

                <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#B66AA5]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                <div className="relative">

                  <div className="flex justify-between items-center">

                    <div className="w-12 h-12 rounded-xl bg-white/10 text-[#F0C8E8] border border-white/10 flex items-center justify-center">
                      <HandHeart className="w-6 h-6" />
                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-white/10 text-[#F0C8E8] border border-white/15 text-[10px] font-extrabold">
                      {loading ? "..." : foundItems.length} Active Posts
                    </span>

                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-6 group-hover:text-[#F0C8E8] transition-colors">
                    Found Directory
                  </h3>

                  <p className="text-xs text-white/70 mt-2 leading-6 max-w-sm font-medium">
                    Browse recovered belongings listed by community
                    members and help verify their rightful owners.
                  </p>

                </div>

                <div className="relative flex items-center justify-between mt-6 pt-5 border-t border-white/15">

                  <span className="text-xs font-extrabold text-[#F0C8E8]">
                    Open Found Portal
                  </span>

                  <div className="w-9 h-9 rounded-full bg-white/10 text-[#F0C8E8] flex items-center justify-center group-hover:bg-white group-hover:text-[#54244F] group-hover:translate-x-1 transition-all">
                    <MoveUpRight className="w-4 h-4" />
                  </div>

                </div>

              </Link>
            </motion.div>

          </motion.div>

        </div>

      </motion.section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#352239] text-white/65 px-5 sm:px-8 pt-11 pb-6">

        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-9 border-b border-white/10">

            {/* Brand */}

            <div className="space-y-3">

              <div className="flex items-center gap-2.5">

                <div className="w-9 h-9 rounded-xl bg-[#B879A9] flex items-center justify-center text-white font-extrabold text-sm">
                  LF
                </div>

                <span className="text-lg font-extrabold text-white">
                  RECOVER<span className="text-[#D9A7CE]">A</span>
                </span>

              </div>

              <p className="text-xs leading-6 text-white/55 max-w-xs">
                Smart community platform helping citizens recover
                lost belongings safely and quickly.
              </p>

            </div>


            {/* Portals */}

            <div>

              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-4">
                Portals
              </h4>

              <ul className="space-y-3 text-xs font-semibold">

                <li>
                  <Link to="/lost-items" className="hover:text-[#E5B9DC] transition-colors">
                    Lost Directory
                  </Link>
                </li>

                <li>
                  <Link to="/found-items" className="hover:text-[#E5B9DC] transition-colors">
                    Found Directory
                  </Link>
                </li>

                <li>
                  <Link to="/report" className="hover:text-[#E5B9DC] transition-colors">
                    Report Item
                  </Link>
                </li>

              </ul>

            </div>


            {/* Account */}

            <div>

              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-4">
                Account
              </h4>

              <ul className="space-y-3 text-xs font-semibold">

                <li>
                  <Link to="/login" className="hover:text-[#E5B9DC] transition-colors">
                    Sign In
                  </Link>
                </li>

                <li>
                  <Link to="/register" className="hover:text-[#E5B9DC] transition-colors">
                    Register
                  </Link>
                </li>

                <li>
                  <Link to="/dashboard" className="hover:text-[#E5B9DC] transition-colors">
                    User Dashboard
                  </Link>
                </li>

              </ul>

            </div>


            {/* Security */}

            <div>

              <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-4">
                Security
              </h4>

              <p className="text-xs leading-6 text-white/55 mb-4">
                Protected claims and verified item listing portal.
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-[#E5B9DC]">
                <ShieldCheck className="w-4 h-4" />
                Verified Match Engine
              </div>

            </div>

          </div>


          {/* Copyright */}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-[10px] font-semibold text-white/40">

            <p>
              © {new Date().getFullYear()} Recovera. All rights reserved.
            </p>

            <div className="flex items-center gap-1.5">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>for Community Safety</span>
            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}

export default Home;
