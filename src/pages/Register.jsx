
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", formData);

      if (res.data?.token) {
        if (login) {
          login(res.data.user, res.data.token);
        } else {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      }

      alert(
        `Account created successfully! Welcome, ${
          res.data?.user?.name || "User"
        } 🎉`
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#fbf9fc] border border-[#e9deea] rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-[#85265e] focus:ring-4 focus:ring-[#85265e]/10";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#925276] pointer-events-none";

  return (
    <div className="min-h-screen bg-[#faf8fc] text-slate-700 flex items-center justify-center px-4 py-10 font-sans relative overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute -top-32 -left-24 w-80 h-80 bg-[#85265e]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-80 h-80 bg-[#48235f]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >

        {/* Brand */}
        <div className="flex justify-center mb-7">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#85265e] to-[#48235f] flex items-center justify-center text-white text-xl font-semibold shadow-md">
              R
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#321b3e]">
                Recover<span className="text-[#85265e]">a</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Lost & Found Community
              </p>
            </div>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-[#eadde9] rounded-2xl p-7 sm:p-8 shadow-[0_12px_40px_rgba(65,28,75,0.08)]">

          {/* Heading */}
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-[27px] font-semibold text-[#321b3e] tracking-tight">
              Create Account
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Join our community and help lost belongings find their way home.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -7 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User className={iconClass} />

                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className={iconClass} />

                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Phone Number
              </label>

              <div className="relative">
                <Phone className={iconClass} />

                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className={iconClass} />

                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#85265e] to-[#48235f] hover:from-[#70204e] hover:to-[#37184f] text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-md shadow-[#702052]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-[#f0e8f0] text-center space-y-3">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#85265e] hover:text-[#48235f] transition"
              >
                Sign In
              </Link>
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#85265e] transition"
            >
              <ArrowLeft size={15} />
              Back to Home
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Your account helps make our community safer.
        </p>

      </motion.div>
    </div>
  );
}

export default Register;
