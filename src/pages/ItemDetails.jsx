
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import API from "../services/api";

import {
  ArrowLeft,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  X,
  Sparkles,
  Package,
  CalendarDays
} from "lucide-react";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimMessage, setClaimMessage] = useState("");

  const [claimStatus, setClaimStatus] = useState({
    loading: false,
    success: "",
    error: ""
  });

  const [showClaimModal, setShowClaimModal] = useState(false);

  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const defaultPlaceholder =
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=600";

  // Current user detection
  let currentUser = {};

  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    currentUser = {};
  }

  const currentUserId =
    currentUser._id ||
    currentUser.id ||
    localStorage.getItem("userId");

  const isLoggedIn = Boolean(
    currentUserId || localStorage.getItem("token")
  );

  // Fetch item details
  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  // GSAP entrance animation
  useLayoutEffect(() => {
    if (!item || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 25
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [item]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/items/${id}`);
      setItem(res.data);

    } catch (err) {
      console.error("Fetch Item Details Error:", err);
      setError("Failed to load item details.");
    } finally {
      setLoading(false);
    }
  };

  // Claim button
  const handleActionClick = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: `/items/${id}` }
      });
      return;
    }

    setShowClaimModal(true);
  };

  // Submit claim
  const handleSubmitClaim = async (e) => {
    e.preventDefault();

    if (!claimMessage.trim()) {
      return;
    }

    try {
      setClaimStatus({
        loading: true,
        success: "",
        error: ""
      });

      const res = await API.post("/claims", {
        itemId: id,
        message: claimMessage
      });

      console.log("Claim Response:", res.data);

      setClaimStatus({
        loading: false,
        success: "Claim request submitted successfully!",
        error: ""
      });

      setClaimMessage("");

      setTimeout(() => {
        setShowClaimModal(false);
        setClaimStatus({
          loading: false,
          success: "",
          error: ""
        });
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.error(
        "Submit Claim Error:",
        err.response?.data || err.message
      );

      const errorMsg =
        err.response?.data?.message ||
        "Failed to submit claim. Please try again.";

      setClaimStatus({
        loading: false,
        success: "",
        error: errorMsg
      });
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7FA] flex flex-col items-center justify-center gap-4">

        <div className="w-11 h-11 border-[3px] border-[#713665]/15 border-t-[#713665] rounded-full animate-spin" />

        <p className="text-xs font-bold text-[#713665]/65 tracking-wide">
          Loading item details...
        </p>

      </div>
    );
  }

  // Error screen
  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#FAF7FA] flex items-center justify-center p-6">

        <div className="max-w-sm w-full text-center bg-white rounded-3xl border border-[#713665]/10 p-9 shadow-sm">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F5EAF3] text-[#873F79] flex items-center justify-center mb-5">
            <Package className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-extrabold text-[#54244F]">
            Item Not Found
          </h2>

          <p className="text-xs text-[#827181] mt-2 leading-6">
            {error || "The requested item is unavailable."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-[#54244F] hover:bg-[#713665] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  const isLost = item.type?.toLowerCase() === "lost";

  const itemOwnerId =
    typeof item.user === "object"
      ? item.user?._id || item.user?.id
      : item.user;

  const isMyPost = Boolean(
    currentUserId &&
    String(itemOwnerId) === String(currentUserId)
  );

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[#FAF7FA] text-[#352239] px-4 sm:px-6 py-8 sm:py-12 font-['Inter',sans-serif]"
    >

      <div className="max-w-4xl mx-auto space-y-5">

        {/* ================= BACK BUTTON ================= */}

        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-xs font-bold text-[#713665]/70 hover:text-[#54244F] transition-colors cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-white border border-[#713665]/10 flex items-center justify-center group-hover:bg-[#F3E8F2] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </span>

          Back to Directory
        </button>


        {/* ================= ITEM CARD ================= */}

        <div
          ref={cardRef}
          className="bg-white rounded-3xl border border-[#713665]/10 shadow-[0_8px_35px_rgba(84,36,79,0.05)] overflow-hidden"
        >

          {/* Card Header */}

          <div className="px-6 sm:px-8 py-5 border-b border-[#713665]/10 flex items-center justify-between gap-3">

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#A28BA0]">
                Community Listing
              </p>

              <h2 className="text-sm font-extrabold text-[#54244F] mt-1">
                Item Information
              </h2>
            </div>

            <div className="w-9 h-9 rounded-xl bg-[#F5EAF3] flex items-center justify-center text-[#713665]">
              <Sparkles className="w-4 h-4" />
            </div>

          </div>


          {/* Main Content */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 p-5 sm:p-8">

            {/* Image */}

            <div className="relative">

              <div className="relative h-[270px] sm:h-[320px] w-full rounded-2xl overflow-hidden bg-[#F5EDF5] border border-[#713665]/10 group">

                <img
                  src={item.imageUrl || item.image || defaultPlaceholder}
                  alt={item.title || "Reported item"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultPlaceholder;
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#352239]/25 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4">

                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                      isLost
                        ? "bg-[#FFF3F0]/95 text-[#B34C5A] border-[#F2D3D4]"
                        : "bg-[#F3E8F2]/95 text-[#713665] border-[#E5D0E2]"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isLost ? "bg-[#B34C5A]" : "bg-[#873F79]"
                    }`} />

                    {item.type}
                  </span>

                </div>

              </div>

              <div className="flex items-center gap-2 mt-3 px-1 text-[10px] font-semibold text-[#A28BA0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#873F79]" />
                Community reported listing
              </div>

            </div>


            {/* Item Information */}

            <div className="flex flex-col justify-between gap-6">

              <div className="space-y-4">

                <div>

                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#A28BA0] mb-2">
                    {isLost ? "Missing Belonging" : "Recovered Belonging"}
                  </p>

                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#54244F] capitalize leading-tight break-words">
                    {item.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-[#827181] leading-7 font-medium mt-3">
                    {item.description || "No description provided."}
                  </p>

                </div>


                {/* Details */}

                <div className="space-y-3 py-5 border-y border-[#713665]/10">

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 rounded-xl bg-[#F5EAF3] text-[#713665] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#A28BA0]">
                        Location
                      </p>

                      <p className="text-xs font-bold text-[#54244F] mt-1 break-words">
                        {item.location || "Not specified"}
                      </p>
                    </div>

                  </div>


                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 rounded-xl bg-[#F5EAF3] text-[#713665] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#A28BA0]">
                        Posted By
                      </p>

                      <p className="text-xs font-bold text-[#54244F] mt-1">
                        {item.user?.name || "Community Member"}
                      </p>
                    </div>

                  </div>


                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 rounded-xl bg-[#F5EAF3] text-[#713665] flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#A28BA0]">
                        Listing Type
                      </p>

                      <p className="text-xs font-bold text-[#54244F] mt-1 capitalize">
                        {item.type || "Item"}
                      </p>
                    </div>

                  </div>

                </div>

              </div>


              {/* Action Button */}

              <div>

                {isMyPost ? (

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#F3E8F2] text-[#54244F] hover:bg-[#EBD9E9] font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    Manage My Post
                  </button>

                ) : (

                  <button
                    onClick={handleActionClick}
                    className="group w-full py-3.5 px-4 rounded-xl bg-[#54244F] hover:bg-[#713665] text-white font-extrabold text-xs transition-all duration-300 shadow-[0_5px_18px_rgba(84,36,79,0.16)] hover:shadow-[0_8px_24px_rgba(84,36,79,0.22)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F1CDE9]" />

                    {isLost
                      ? "I Found This Item!"
                      : "Claim This Item"}

                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>

                )}

                <p className="text-center text-[10px] text-[#A28BA0] font-medium mt-3">
                  {isMyPost
                    ? "You are the owner of this listing."
                    : "Help reunite belongings with their rightful owners."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= CLAIM MODAL ================= */}

      {showClaimModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#352239]/55 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (
              e.target === e.currentTarget &&
              !claimStatus.loading
            ) {
              setShowClaimModal(false);
            }
          }}
        >

          <div className="bg-white border border-[#713665]/15 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_20px_70px_rgba(35,15,36,0.25)] animate-[modalIn_0.3s_ease-out]">

            {/* Modal Header */}

            <div className="flex justify-between items-center border-b border-[#713665]/10 pb-4 mb-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#F3E8F2] text-[#713665] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#54244F]">
                    Verification Claim
                  </h3>

                  <p className="text-[10px] text-[#A28BA0] font-medium mt-0.5">
                    Provide details to verify ownership
                  </p>
                </div>

              </div>

              <button
                type="button"
                disabled={claimStatus.loading}
                onClick={() => setShowClaimModal(false)}
                className="w-8 h-8 rounded-lg bg-[#F5EDF5] text-[#713665]/60 hover:bg-[#EBD9E9] hover:text-[#54244F] flex items-center justify-center transition cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>

            </div>


            {/* Success Message */}

            {claimStatus.success && (
              <div className="p-3 mb-4 bg-[#F1F8F2] border border-[#D5E9D7] text-[#39734A] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {claimStatus.success}
              </div>
            )}


            {/* Error Message */}

            {claimStatus.error && (
              <div className="p-3 mb-4 bg-[#FFF2F1] border border-[#F2D3D4] text-[#B34C5A] text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {claimStatus.error}
              </div>
            )}


            {/* Claim Form */}

            <form
              onSubmit={handleSubmitClaim}
              className="space-y-5"
            >

              <div className="space-y-2">

                <label className="text-[10px] font-extrabold uppercase text-[#713665] tracking-wider">
                  Ownership Proof / Message
                </label>

                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  placeholder="Describe unique marks, exact color, identifying details or proof of ownership..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  disabled={claimStatus.loading || Boolean(claimStatus.success)}
                  className="w-full rounded-xl bg-[#FAF7FA] border border-[#713665]/15 p-4 text-xs font-medium text-[#54244F] placeholder:text-[#A28BA0] outline-none focus:border-[#873F79] focus:ring-2 focus:ring-[#873F79]/10 transition resize-none disabled:opacity-60"
                />

                <div className="flex justify-between text-[9px] font-semibold text-[#A28BA0]">
                  <span>Provide accurate identifying information.</span>
                  <span>{claimMessage.length}/1000</span>
                </div>

              </div>


              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-1">

                <button
                  type="button"
                  disabled={claimStatus.loading}
                  onClick={() => setShowClaimModal(false)}
                  className="px-5 py-3 rounded-xl text-xs font-extrabold text-[#827181] hover:bg-[#F5EDF5] transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    claimStatus.loading ||
                    !claimMessage.trim() ||
                    Boolean(claimStatus.success)
                  }
                  className="px-6 py-3 rounded-xl bg-[#54244F] hover:bg-[#713665] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >

                  {claimStatus.loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Send Claim Request
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Modal animations */}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

    </main>
  );
}

export default ItemDetails;
