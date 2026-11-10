
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  ImageOff,
} from "lucide-react";
import API from "../services/api";
import ClaimModal from "./ClaimModal";

function ItemCard({ item }) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiMatches, setAiMatches] = useState(null);
  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleCheckAiMatches = async () => {
    try {
      setLoadingAi(true);
      setError("");

      const res = await API.post("/ai/match", { itemId: item._id });
      setAiMatches(res.data.matches || []);
    } catch (err) {
      console.error("AI Match Error:", err);
      setError(
        err.response?.data?.message || "Failed to scan AI matches."
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const isLost = item.type === "lost";
  const imageUrl = item.image || item.imageUrl || item.photo || null;

  // Dynamic colors based on AI matching percentage
  const getMatchStyle = (score) => {
    if (score >= 75) {
      return {
        label: "Strong Match",
        badge: "bg-green-50 text-green-700 border-green-200",
        bar: "bg-green-500",
        icon: "text-green-600",
        border: "border-green-200",
        background: "bg-green-50/40",
      };
    }

    if (score >= 50) {
      return {
        label: "Moderate Match",
        badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
        bar: "bg-yellow-500",
        icon: "text-yellow-600",
        border: "border-yellow-200",
        background: "bg-yellow-50/40",
      };
    }

    return {
      label: "Low Match",
      badge: "bg-red-50 text-red-700 border-red-200",
      bar: "bg-red-500",
      icon: "text-red-600",
      border: "border-red-200",
      background: "bg-red-50/40",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full min-w-0 bg-white rounded-2xl border border-[#70245F]/10 p-4 sm:p-5 shadow-[0_4px_20px_rgba(65,35,65,0.05)] hover:shadow-[0_12px_30px_rgba(112,36,95,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group font-sans"
    >
      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#70245F] to-[#A35B91]" />

      {/* Header */}
      <div className="flex items-center justify-between pt-1 gap-3 min-w-0">
        <span
          className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-full border shrink-0 ${
            isLost
              ? "bg-red-100 text-red-700 border-red-200"
              : "bg-green-100 text-green-700 border-green-200"
          }`}
        >
          {item.type}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7A8D] flex items-center gap-1.5 min-w-0">
          <Tag className="w-3.5 h-3.5 text-[#873675] shrink-0" />
          <span className="truncate">{item.category}</span>
        </span>
      </div>

      {/* Image */}
      <div className="w-full h-44 rounded-xl overflow-hidden bg-[#F8F3F8] border border-[#70245F]/10 relative flex items-center justify-center shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-[#A18CA2]">
            <ImageOff className="w-8 h-8" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              No Image Provided
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 flex-1 min-w-0">
        <h3 className="text-base font-extrabold text-[#39283B] truncate leading-snug">
          {item.title}
        </h3>

        <p className="text-xs text-[#817284] font-medium line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-[10px] font-semibold text-[#897C8E]">
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#873675] shrink-0" />
            <span className="truncate">{item.location}</span>
          </span>

          {item.date && (
            <span className="flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#873675]" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </span>
          )}
        </div>
      </div>

      {/* AI Matchmaker */}
      <div className="pt-4 border-t border-[#70245F]/10 space-y-3 min-w-0 w-full">

        {/* Scan Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckAiMatches}
          disabled={loadingAi}
          className="w-full min-h-11 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 outline-none cursor-pointer border border-[#70245F]/15 bg-[#F8F1F7] hover:bg-gradient-to-r hover:from-[#70245F] hover:to-[#54204F] hover:text-white text-[#70245F] disabled:opacity-60"
        >
          <Sparkles
            className={`w-4 h-4 ${loadingAi ? "animate-spin" : ""}`}
          />
          {loadingAi ? "Scanning Database..." : "Scan AI Matches"}
        </motion.button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full p-3 rounded-xl bg-rose-50 border border-rose-200 text-[10px] font-semibold text-rose-600 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Results */}
        <AnimatePresence>
          {aiMatches && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="w-full min-w-0 bg-[#F8F9FA] rounded-2xl p-3 sm:p-4 border border-gray-200 space-y-4"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-200/70 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gray-700" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-gray-800">
                      AI Match Results
                    </h4>
                    <p className="text-[9px] text-gray-500 font-medium mt-0.5">
                      Potential matching items
                    </p>
                  </div>
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-gray-200 text-gray-700 whitespace-nowrap shrink-0">
                  {aiMatches.length}{" "}
                  {aiMatches.length === 1 ? "Match" : "Matches"} Found
                </span>
              </div>

              {/* Match Cards */}
              {aiMatches.length > 0 ? (
                <div className="flex flex-col gap-3 w-full min-w-0">
                  {aiMatches.map((m, idx) => {
                    const score = Math.min(
                      100,
                      Math.max(0, Number(m.matchScore) || 0)
                    );

                    const style = getMatchStyle(score);

                    return (
                      <motion.div
                        key={m.candidateId || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: idx * 0.08,
                        }}
                        className={`w-full min-w-0 bg-white p-3 sm:p-4 rounded-xl border ${style.border} shadow-sm flex flex-col gap-3 hover:shadow-md transition-all duration-300`}
                      >
                        {/* Match Title & Score */}
                        <div className="flex items-center justify-between gap-2 w-full min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <ShieldCheck
                              className={`w-4 h-4 shrink-0 ${style.icon}`}
                            />

                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-extrabold text-gray-800">
                                Potential Match
                              </span>
                              <span className={`text-[9px] font-semibold ${style.icon}`}>
                                {style.label}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] font-extrabold px-2.5 py-1.5 rounded-full border whitespace-nowrap shrink-0 ${style.badge}`}
                          >
                            {score}% Match
                          </span>
                        </div>

                        {/* Score Bar */}
                        <div className="w-full space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-semibold text-gray-500">
                            <span>Match Score</span>
                            <span>{score}%</span>
                          </div>

                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeOut",
                              }}
                              className={`h-full rounded-full ${style.bar}`}
                            />
                          </div>
                        </div>

                        {/* Match Reason */}
                        <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium leading-relaxed break-words">
                          {m.reason}
                        </p>

                        {/* Claim Button */}
                        <motion.button
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedMatch({
                              title: item.title,
                              category: item.category,
                              location: item.location,
                              description: m.reason,
                            })
                          }
                          className="w-full min-h-10 px-3 py-2.5 bg-gradient-to-r from-[#70245F] to-[#54204F] hover:from-[#602052] hover:to-[#43183F] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wide rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#70245F]/15"
                        >
                          <UserCheck className="w-4 h-4 shrink-0" />

                          <span className="text-center leading-tight">
                            Initiate Verification Claim
                          </span>

                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-5 px-3 text-center bg-white rounded-xl border border-gray-200">
                  <ShieldCheck className="w-6 h-6 text-gray-400 mx-auto mb-2" />

                  <p className="text-[10px] font-semibold text-gray-500">
                    No 50%+ AI match found in current directory.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchedItem={selectedMatch}
      />
    </motion.div>
  );
}

export default ItemCard;
