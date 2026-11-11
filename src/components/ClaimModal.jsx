import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Phone, Send, MapPin, Tag, CheckCircle2, Sparkles, Loader2, ArrowRight } from "lucide-react";
import API from "../services/api";

function ClaimModal({ isOpen, onClose, matchedItem }) {
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAnswers({ q1: "", q2: "", q3: "" });
      setSubmitted(false);
      setErrorMsg("");
      setLoading(false);
    }
  }, [isOpen, matchedItem?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    const targetItemId = matchedItem?._id;

    if (!targetItemId) {
      setErrorMsg("The exact matched item ID is missing. Please scan matches again.");
      return;
    }

    if (!Object.values(answers).every((answer) => answer.trim())) {
      setErrorMsg("Please answer all ownership questions.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const combinedMessage = `Q1: ${answers.q1.trim()} | Q2: ${answers.q2.trim()} | Q3: ${answers.q3.trim()}`;

      const response = await API.post("/claims", {
        itemId: targetItemId,
        message: combinedMessage,
        answers: {
          q1: answers.q1.trim(),
          q2: answers.q2.trim(),
          q3: answers.q3.trim(),
        },
      });

      console.log("Claim submitted successfully:", response.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Claim submission error:", err.response?.data || err);
      setErrorMsg(err.response?.data?.message || "Failed to submit claim request.");
    } finally {
      setLoading(false);
    }
  };

  const questions = [
    { name: "q1", number: "01", title: "Unique identification", question: "Unique mark, scratch, or distinct feature?", placeholder: "e.g. Small scratch on corner, sticker..." },
    { name: "q2", number: "02", title: "Item information", question: "Where/how lost or what was inside?", placeholder: "e.g. Lost near cafeteria, ID card inside..." },
    { name: "q3", number: "03", title: "Ownership proof", question: "Any secret proof only owner knows?", placeholder: "e.g. Specific wallpaper, serial number..." },
  ];

  const inputClass = "w-full h-11 bg-[#FAF8FA] border border-[#70245F]/15 rounded-xl px-3.5 text-xs sm:text-sm font-medium text-[#382B3B] placeholder:text-[#A99BAA] outline-none transition-all duration-300 focus:border-[#70245F] focus:bg-white focus:ring-4 focus:ring-[#70245F]/5";

  return createPortal(
    <AnimatePresence>
      {isOpen && matchedItem && (
        <motion.div key="claim-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-[#241326]/65 backdrop-blur-md overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 25 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 27 }} className="w-full max-w-lg bg-white border border-[#70245F]/10 rounded-3xl shadow-[0_25px_80px_rgba(36,19,38,0.25)] overflow-hidden text-[#302432] font-sans my-auto relative">
            <div className="relative px-5 py-5 sm:px-6 sm:py-6 bg-gradient-to-r from-[#70245F] to-[#54204F] text-white overflow-hidden">
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-8 -top-12 w-40 h-40 rounded-full bg-white/5" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0"><div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5 text-white" /></div><div className="min-w-0"><h3 className="font-extrabold text-base sm:text-lg tracking-tight">Claim Verification</h3><p className="text-[9px] sm:text-[10px] text-white/75 mt-1 tracking-[0.12em] uppercase font-semibold">Ownership Verification Process</p></div></div>
                <motion.button whileHover={{ rotate: 90, scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={onClose} disabled={loading} className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer shrink-0 disabled:opacity-50"><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="relative mt-5 flex items-center gap-2 text-[10px] font-semibold text-white/75"><Sparkles className="w-3.5 h-3.5" />Answer these questions to prove item ownership.</div>
            </div>

            <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 sm:p-5 bg-[#FAF6FA] rounded-2xl border border-[#70245F]/10 space-y-3">
                <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#806F82]">Matched Item Details</span><span className="flex items-center gap-1 text-[9px] font-bold text-[#70245F]"><ShieldCheck className="w-3.5 h-3.5" />Verification</span></div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {matchedItem.imageUrl || matchedItem.image ? <img src={matchedItem.imageUrl || matchedItem.image} alt={matchedItem.title || "Matched item"} className="w-12 h-12 rounded-xl object-cover shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-[#70245F]/10 flex items-center justify-center shrink-0"><Tag className="w-5 h-5 text-[#70245F]" /></div>}
                    <div className="min-w-0"><h4 className="text-sm sm:text-base font-extrabold text-[#40263F] break-words">{matchedItem.title || "Matched Item"}</h4><p className="text-[10px] text-[#96879A] font-medium mt-0.5">{matchedItem.type || "Opposite-type"} item under verification</p><p className="text-[10px] text-[#96879A] mt-0.5">Posted by: {matchedItem.user?.name || "Community Member"}</p></div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full bg-[#70245F]/10 text-[#70245F] border border-[#70245F]/15 shrink-0">{matchedItem.category || "General"}</span>
                </div>
                <p className="text-xs text-[#716474] font-medium leading-relaxed">{matchedItem.description || "No specific details provided."}</p>
                {matchedItem.location && <div className="flex items-center gap-2 pt-3 border-t border-[#70245F]/10 text-[11px] font-semibold text-[#806F82]"><MapPin className="w-4 h-4 text-[#70245F] shrink-0" /><span>Location: {matchedItem.location}</span></div>}
                {matchedItem.matchReason && <p className="text-[10px] text-[#70245F] font-semibold pt-2 border-t border-[#70245F]/10">AI reason: {matchedItem.matchReason}</p>}
              </motion.div>

              <AnimatePresence>{errorMsg && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 break-words">{errorMsg}</motion.div>}</AnimatePresence>

              {submitted ? (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="py-6 text-center space-y-5">
                  <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 12 }} className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm"><CheckCircle2 className="w-10 h-10" /></motion.div>
                  <div><h4 className="text-lg font-extrabold text-[#492542]">Verification Request Sent!</h4><p className="text-xs font-medium text-[#847587] mt-2 max-w-xs mx-auto leading-relaxed">Your answers have been forwarded to the owner of this matched item for review.</p></div>
                  <div className="p-4 bg-[#FAF6FA] rounded-xl border border-[#70245F]/10 text-xs font-semibold text-[#70245F] flex items-center justify-center gap-2"><Phone className="w-4 h-4 shrink-0" /><span>Contact info routed to Dashboard</span></div>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="w-full h-12 bg-[#70245F] hover:bg-[#55204E] text-white text-xs font-bold tracking-wider rounded-xl transition shadow-lg shadow-[#70245F]/15 cursor-pointer">Close Window</motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-5">
                  <div className="space-y-1"><h4 className="text-sm font-extrabold text-[#40263F]">Ownership Questions</h4><p className="text-[10px] text-[#958598] font-medium">Provide accurate details to support your claim.</p></div>
                  <div className="space-y-4">{questions.map((question, index) => (
                    <motion.div key={question.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 + index * 0.08 }} className="space-y-2">
                      <div className="flex items-start gap-3"><div className="w-7 h-7 rounded-lg bg-[#70245F]/10 text-[#70245F] flex items-center justify-center shrink-0 text-[10px] font-extrabold">{question.number}</div><div className="flex-1 min-w-0 pt-0.5"><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#705B70] leading-relaxed">{question.question}</p><p className="text-[10px] text-[#A394A5] font-medium mt-0.5">{question.title}</p></div></div>
                      <motion.div whileFocus={{ scale: 1.005 }} className="relative"><input type="text" name={question.name} required value={answers[question.name]} onChange={handleInputChange} placeholder={question.placeholder} disabled={loading} className={inputClass} /></motion.div>
                    </motion.div>
                  ))}</div>
                  <motion.button type="submit" disabled={loading} whileHover={!loading ? { y: -2, scale: 1.005 } : {}} whileTap={{ scale: 0.98 }} className="w-full min-h-12 px-4 bg-gradient-to-r from-[#70245F] to-[#54204F] hover:from-[#602052] hover:to-[#43183F] text-white text-[11px] sm:text-xs font-extrabold tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#70245F]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting Your Claim...</span></> : <><Send className="w-4 h-4" /><span>Submit Verification Answers</span><ArrowRight className="w-4 h-4" /></>}
                  </motion.button>
                  <p className="text-center text-[9px] text-[#A394A5] font-medium leading-relaxed">Your information will be shared with the owner of this matched item for verification.</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default ClaimModal;
