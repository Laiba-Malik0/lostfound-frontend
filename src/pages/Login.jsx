
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  LogIn,
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      if (res.data?.token) {
        if (login) {
          login(res.data.user, res.data.token);
        } else {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        if (res.data.user?.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8fc] text-slate-700 flex items-center justify-center px-4 py-10 font-sans relative overflow-hidden">

      {/* Background */}
      <div className="absolute -top-32 -left-24 w-80 h-80 bg-[#85265e]/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-32 -right-24 w-80 h-80 bg-[#48235f]/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
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

        {/* Login Card */}
        <div className="bg-white border border-[#eadde9] rounded-2xl p-7 sm:p-8 shadow-[0_12px_40px_rgba(65,28,75,0.08)]">

          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8edf4] text-[#85265e] text-xs font-medium mb-4">
              <ShieldCheck size={15} />
              Secure Sign In
            </div>

            <h2 className="text-2xl sm:text-[27px] font-semibold text-[#321b3e] tracking-tight">
              Welcome Back
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Sign in to report, track, or claim your lost belongings.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#925276]" />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full bg-[#fbf9fc] border border-[#e9deea] rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#85265e] focus:ring-4 focus:ring-[#85265e]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#925276]" />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full bg-[#fbf9fc] border border-[#e9deea] rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#85265e] focus:ring-4 focus:ring-[#85265e]/10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#85265e] to-[#48235f] hover:from-[#70204e] hover:to-[#37184f] text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-md shadow-[#702052]/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-[#f0e8f0] text-center space-y-3">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[#85265e] hover:text-[#48235f] transition"
              >
                Create an account
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
          Helping lost belongings find their way home.
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
