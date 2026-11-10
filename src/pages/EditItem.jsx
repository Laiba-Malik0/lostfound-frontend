
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import API from "../services/api";
import {
  CheckCircle,
  AlertCircle,
  Tag,
  Calendar,
  MapPin,
  Upload,
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  Phone,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
} from "lucide-react";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const cardRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Electronics",
    date: "",
    location: "",
    contactInfo: "",
    description: "",
    type: "found",
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scanningImage, setScanningImage] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing report
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/items/${id}`);
        const item = response.data;

        if (!item || !item._id) {
          throw new Error("Report not found.");
        }

        // Check report ownership
        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const ownerId =
          typeof item.user === "object"
            ? item.user?._id
            : item.user;

        const currentUserId = user._id || user.id;

        if (
          !currentUserId ||
          !ownerId ||
          String(ownerId) !== String(currentUserId)
        ) {
          setError("You are not authorized to edit this report.");
          return;
        }

        setFormData({
          title: item.title || "",
          category: item.category || "Electronics",
          date: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : "",
          location: item.location || "",
          contactInfo: item.contactInfo || "",
          description: item.description || "",
          type: item.type || "found",
        });

        setExistingImage(item.imageUrl || "");
      } catch (err) {
        console.error("Fetch Item Error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load report."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  // Entrance animation
  useEffect(() => {
    if (loading || error || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".form-element",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.055,
          ease: "power2.out",
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, [loading, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select replacement image
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      setScanningImage(true);

      try {
        const response = await API.post("/ai/analyze-image", {
          imageBase64: reader.result,
          mimeType: file.type || "image/jpeg",
        });

        if (response.data?.success && response.data?.analysis) {
          const {
            title,
            category,
            description,
          } = response.data.analysis;

          setFormData((prev) => ({
            ...prev,
            title: title || prev.title,
            category: category || prev.category,
            description: description || prev.description,
          }));
        }
      } catch (err) {
        console.warn("AI image analysis skipped:", err);
      } finally {
        setScanningImage(false);
      }
    };
  };

  // Update report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || scanningImage) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const submissionData = new FormData();

      submissionData.append("title", formData.title);
      submissionData.append("category", formData.category);
      submissionData.append("date", formData.date);
      submissionData.append("location", formData.location);
      submissionData.append("contactInfo", formData.contactInfo);
      submissionData.append("description", formData.description);
      submissionData.append("type", formData.type);

      if (imageFile) {
        submissionData.append("image", imageFile);
      }

      await API.put(`/items/${id}`, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Report updated successfully!");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Update Report Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isFound = formData.type === "found";

  const inputClass = `w-full h-10 bg-[#F4F7F5] border border-emerald-900/10 rounded-lg px-3 text-sm font-medium text-emerald-950 outline-none transition-all duration-300 focus:bg-white focus:shadow-sm ${
    isFound
      ? "focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
      : "focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
  }`;

  const labelClass =
    "text-[11px] font-bold uppercase tracking-wider text-emerald-900/60 flex items-center gap-1.5";

  const iconClass = `w-3.5 h-3.5 ${
    isFound ? "text-emerald-700" : "text-rose-600"
  }`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-emerald-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-600 mb-4" />

        <h2 className="text-xl font-bold text-emerald-950">
          Unable to Edit Report
        </h2>

        <p className="text-sm text-gray-500 mt-2">{error}</p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-5 py-3 rounded-xl bg-emerald-900 text-white text-sm font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      className="min-h-[calc(100vh-80px)] bg-[#F4F7F5] text-emerald-950 py-8 px-3 sm:px-4 flex items-center justify-center relative font-sans"
    >
      <motion.div
        ref={cardRef}
        initial={false}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className="w-full min-w-[300px] max-w-md bg-white/95 backdrop-blur-md border border-emerald-900/10 rounded-2xl p-5 sm:p-7 shadow-sm relative z-10 space-y-5"
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="form-element flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>

        {/* Found / Lost Toggle */}
        <div className="form-element flex bg-[#F4F7F5] p-1 rounded-xl border border-emerald-900/10 relative">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: "found" }))
            }
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 relative z-10 ${
              isFound
                ? "text-white"
                : "text-emerald-900/60 hover:text-emerald-950"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Found Item
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: "lost" }))
            }
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 relative z-10 ${
              !isFound
                ? "text-white"
                : "text-emerald-900/60 hover:text-emerald-950"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Lost Item
          </button>

          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className={`absolute top-1 bottom-1 rounded-lg ${
              isFound
                ? "left-1 w-[calc(50%-4px)] bg-emerald-900 shadow-sm"
                : "left-[calc(50%+2px)] w-[calc(50%-4px)] bg-rose-600 shadow-sm"
            }`}
          />
        </div>

        {/* Header */}
        <div className="form-element text-center space-y-1.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={formData.type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-emerald-950 tracking-tight">
                Edit{" "}
                <span className={isFound ? "text-emerald-700" : "text-rose-600"}>
                  {isFound ? "Found Item" : "Missing Item"}
                </span>
              </h1>

              <p className="text-xs font-medium text-emerald-900/60 mt-1">
                Update your report details below.
              </p>
            </motion.div>
          </AnimatePresence>

          {scanningImage && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-bold mt-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              AI Scanning Image...
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <Tag className={iconClass} />
                Item Name
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <MapPin className={iconClass} />
                {isFound ? "Found At" : "Lost At"}
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <Sparkles className={iconClass} />
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Keys">Keys</option>
                <option value="Clothing">Clothing</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <Calendar className={iconClass} />
                Date
              </label>

              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <Phone className={iconClass} />
                Contact Info
              </label>

              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="contactInfo"
                required
                value={formData.contactInfo}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <Upload className={iconClass} />
                Replace Photo
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />

                <div className="w-full h-10 flex items-center justify-center gap-1.5 bg-[#F4F7F5] border border-dashed border-emerald-900/20 rounded-lg px-3 text-xs text-emerald-900/60">
                  {imageFile ? (
                    <span className="text-emerald-700 font-bold truncate text-[10px]">
                      {imageFile.name}
                    </span>
                  ) : (
                    <>
                      <ImageIcon className={iconClass} />
                      <span className="text-[10px] font-bold uppercase">
                        Choose New Image
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Existing Image Preview */}
          {(existingImage || imageFile) && (
            <div className="form-element space-y-2">
              <label className={labelClass}>Image Preview</label>

              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : existingImage
                }
                alt="Report preview"
                className="w-full h-40 object-cover rounded-xl border border-emerald-900/10"
              />
            </div>
          )}

          <div className="form-element space-y-1.5">
            <label className={labelClass}>
              <FileText className={iconClass} />
              Description
            </label>

            <motion.textarea
              whileFocus={{ scale: 1.005 }}
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className={`w-full bg-[#F4F7F5] border border-emerald-900/10 rounded-lg p-3 text-sm font-medium text-emerald-950 outline-none transition-all duration-300 resize-none focus:bg-white ${
                isFound
                  ? "focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
                  : "focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
              }`}
            />
          </div>

          <div className="form-element pt-1">
            <motion.button
              type="submit"
              disabled={submitting || scanningImage}
              whileHover={
                !submitting && !scanningImage
                  ? { y: -2, scale: 1.005 }
                  : {}
              }
              whileTap={{ scale: 0.98 }}
              className={`w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-white ${
                isFound
                  ? "bg-emerald-900 hover:bg-emerald-950 shadow-emerald-950/20"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}

              {submitting ? "Updating..." : "Update Report"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default EditItem;
