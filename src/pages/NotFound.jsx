
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8fc] text-[#321b3e] flex flex-col items-center justify-center p-6 text-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-6"
      >
        <div className="h-16 w-16 mx-auto rounded-2xl bg-[#f8edf4] text-[#85265e] flex items-center justify-center border border-[#ead5e3] shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-[#48235f]">
            404
          </h1>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#321b3e]">
            Page Not Found
          </h2>

          <p className="text-sm sm:text-base font-normal text-[#786b7d] leading-relaxed">
            The page you are looking for might have been removed, renamed, or
            is temporarily unavailable.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#85265e] to-[#48235f] hover:shadow-lg hover:shadow-[#85265e]/20 text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
