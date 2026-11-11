
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
  Bell,
} from "lucide-react";

function Navbar({ notificationCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const brandRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      brandRef.current,
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-[#70245F]/10 sticky top-0 z-50 font-sans shadow-[0_3px_20px_rgba(65,35,65,0.04)] transition-colors">

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center gap-3">

        {/* Brand Logo */}
        <Link
          ref={brandRef}
          to="/"
          onClick={() => setIsOpen(false)}
          className="group flex items-center gap-3 shrink-0"
        >
          <motion.div
            whileHover={{ scale: 1.06, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#70245F] via-[#873675] to-[#54204F] shadow-lg shadow-[#70245F]/25"
          >
            <Search className="h-6 w-6 text-white stroke-[2.5]" />

            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A35B91] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D5A3CA] border-2 border-white" />
            </span>
          </motion.div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#352536] leading-none">
              RECOVER<span className="text-[#873675]">A</span>
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#927A91] mt-1">
              Smart Lost & Found
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { name: "Home", path: "/" },
            { name: "Lost Directory", path: "/lost-items" },
            { name: "Found Directory", path: "/found-items" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                isActive(link.path)
                  ? "text-[#70245F] bg-[#70245F]/[0.07]"
                  : "text-[#766779] hover:text-[#70245F] hover:bg-[#F8F1F7]"
              }`}
            >
              {link.name}

              {isActive(link.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-1 left-3 right-3 h-[2px] bg-[#873675] rounded-full"
                />
              )}
            </Link>
          ))}

          <Link
            to="/report"
            className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7EFF6] text-[#70245F] hover:bg-gradient-to-r hover:from-[#70245F] hover:to-[#54204F] hover:text-white transition-all duration-300 text-xs font-bold tracking-wide uppercase border border-[#70245F]/15 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            Report Item
          </Link>
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">

              {/* User Badge */}
              <div className="flex items-center gap-2 bg-[#FAF6FA] border border-[#70245F]/10 px-3 py-2.5 rounded-xl text-xs font-medium text-[#6F5C72] whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-[#873675] animate-pulse shrink-0" />

                <span>
                  User:{" "}
                  <span className="text-[#70245F] font-bold capitalize">
                    {user?.name}
                  </span>
                </span>
              </div>

              {/* Notification Bell */}
              <Link
                to="/dashboard"
                className="relative p-2.5 bg-white hover:bg-[#F8F1F7] border border-[#70245F]/15 rounded-xl text-[#70245F] transition shadow-sm"
                title="AI Match Notifications"
              >
                <Bell className="w-4 h-4" />

                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#873675] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {notificationCount}
                  </span>
                )}
              </Link>

              {/* Dashboard Button */}
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 min-w-max whitespace-nowrap text-xs bg-gradient-to-r from-[#70245F] to-[#54204F] hover:from-[#602052] hover:to-[#43183F] text-white px-5 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md shadow-[#70245F]/20"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-white" />
                <span className="flex items-center justify-center gap-2 text-white">
  My Dashboard
</span>
              </Link>

              {/* Logout */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2.5 bg-[#FBF2F5] hover:bg-rose-100 text-rose-600 border border-rose-200/70 rounded-xl transition shadow-sm cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-wide text-[#70245F] hover:bg-[#F8F1F7] px-4 py-2.5 rounded-xl transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="text-xs bg-gradient-to-r from-[#70245F] to-[#54204F] hover:from-[#602052] hover:to-[#43183F] text-white font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#70245F]/15 whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-[#F8F1F7] border border-[#70245F]/15 text-[#70245F] transition shadow-sm shrink-0"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-[#70245F]/10 px-5 sm:px-7 py-5 space-y-4 shadow-xl overflow-hidden"
          >
            {user && (
              <div className="flex items-center gap-3 bg-[#FAF6FA] p-3.5 rounded-xl text-xs font-medium text-[#6F5C72] border border-[#70245F]/10">
                <div className="w-9 h-9 rounded-lg bg-[#70245F]/10 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-[#70245F]" />
                </div>

                <span>
                  Signed in as{" "}
                  <span className="text-[#70245F] font-bold">
                    {user?.name}
                  </span>
                </span>
              </div>
            )}

            {/* Mobile Links */}
            <div className="flex flex-col space-y-1 text-xs font-semibold uppercase tracking-wider text-[#5E4B61]">
              {[
                { name: "Home Page", path: "/" },
                { name: "Lost Directory", path: "/lost-items" },
                { name: "Found Directory", path: "/found-items" },
                { name: "Report Item", path: "/report" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`p-3.5 rounded-xl transition ${
                    isActive(item.path)
                      ? "bg-[#70245F]/10 text-[#70245F] font-bold"
                      : "hover:bg-[#FAF6FA] hover:text-[#70245F]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="p-3.5 bg-gradient-to-r from-[#70245F] to-[#54204F] text-white rounded-xl font-bold text-center shadow-md shadow-[#70245F]/15 mt-2"
                >
                  <span className="flex items-center justify-center gap-2 text-white">
  <LayoutDashboard className="w-4 h-4 shrink-0" />
  My Dashboard
</span>
                </Link>
              )}
            </div>

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-[#70245F]/10">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-3.5 rounded-xl font-bold uppercase tracking-wider transition"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center text-xs bg-[#FAF6FA] text-[#70245F] py-3.5 rounded-xl font-bold uppercase tracking-wider border border-[#70245F]/15"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center text-xs bg-gradient-to-r from-[#70245F] to-[#54204F] text-white font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
