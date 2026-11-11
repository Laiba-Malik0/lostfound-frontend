
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

// ========================================
// IMAGE OPTIMIZATION
// ========================================

const compressImage = async (file) => {
  try {
    const bitmap = await createImageBitmap(file);

    const maxSize = 1024;

    const scale = Math.min(
      1,
      maxSize / Math.max(bitmap.width, bitmap.height)
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(
      bitmap,
      0,
      0,
      canvas.width,
      canvas.height
    );

    bitmap.close();

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        "image/jpeg",
        0.78
      );
    });

    if (!blob) return file;

    return new File(
      [blob],
      "item-image.jpg",
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  } catch (error) {
    console.warn(
      "Image compression skipped:",
      error.message
    );

    return file;
  }
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = () => {
      reject(new Error("Unable to read image."));
    };

    reader.readAsDataURL(file);
  });
};

// ========================================
// REPORT ITEM COMPONENT
// ========================================

function ReportItem() {
  const navigate = useNavigate();

  const formRef = useRef(null);
  const cardRef = useRef(null);
  const scanRequestRef = useRef(0);

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
  const [submitting, setSubmitting] = useState(false);
  const [scanningImage, setScanningImage] = useState(false);

  // ========================================
  // GSAP ENTRANCE ANIMATIONS
  // ========================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 24,
          scale: 0.97,
        },
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
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.055,
          ease: "power2.out",
          delay: 0.15,
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  // ========================================
  // FORM INPUT HANDLER
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // IMAGE SCAN AND AUTO-FILL
  // ========================================

  const handleFileChange = async (e) => {
    const input = e.target;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      input.value = "";
      return;
    }

    // Store original file for actual report upload.
    setImageFile(file);

    // Track latest scan to prevent old requests
    // from overwriting a newly selected image.
    const currentScan = ++scanRequestRef.current;

    setScanningImage(true);

    try {
      // Compress image before sending to Gemini.
      const optimizedImage = await compressImage(file);

      const base64Image = await readFileAsDataURL(
        optimizedImage
      );

      const response = await API.post(
        "/ai/analyze-image",
        {
          imageBase64: base64Image,
          mimeType: optimizedImage.type || "image/jpeg",
        }
      );

      // Ignore older scan responses.
      if (currentScan !== scanRequestRef.current) {
        return;
      }

      if (
        response.data?.success &&
        response.data?.analysis &&
        !response.data?.fallback
      ) {
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
      } else {
        console.warn(
          "AI scan unavailable. Manual entry is available."
        );
      }
    } catch (error) {
      if (currentScan === scanRequestRef.current) {
        console.error(
          "Image AI Scan Error:",
          error.response?.data || error.message
        );
      }
    } finally {
      if (currentScan === scanRequestRef.current) {
        setScanningImage(false);
      }

      input.value = "";
    }
  };

  // ========================================
  // REPORT SUBMISSION
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first to submit a report!");

        navigate("/login");
        return;
      }

      const submissionData = new FormData();

      submissionData.append(
        "title",
        formData.title.trim()
      );

      submissionData.append(
        "category",
        formData.category
      );

      submissionData.append(
        "date",
        formData.date || new Date().toISOString()
      );

      submissionData.append(
        "location",
        formData.location.trim()
      );

      submissionData.append(
        "contactInfo",
        formData.contactInfo.trim()
      );

      submissionData.append(
        "description",
        formData.description.trim()
      );

      submissionData.append(
        "type",
        formData.type
      );

      if (imageFile) {
        submissionData.append("image", imageFile);
      }

      const response = await API.post(
        "/items",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newItemId =
        response.data?.item?._id ||
        response.data?._id;

      // Start matching independently.
      // Do not wait for matching before navigating.
      if (newItemId) {
        API.post("/ai/match", {
          itemId: newItemId,
        }).catch((error) => {
          console.warn(
            "Background matching failed:",
            error.message
          );
        });
      }

      alert(
        `Report submitted successfully as ${formData.type.toUpperCase()}!`
      );

      navigate(
        formData.type === "found"
          ? "/found-items"
          : "/lost-items"
      );
    } catch (error) {
      console.error(
        "Submission error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Error submitting report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // STYLING
  // ========================================

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

  // ========================================
  // JSX
  // ========================================

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
        {/* FOUND / LOST TOGGLE */}

        <div className="form-element flex bg-[#F4F7F5] p-1 rounded-xl border border-emerald-900/10 relative">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                type: "found",
              }))
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
              setFormData((prev) => ({
                ...prev,
                type: "lost",
              }))
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

        {/* HEADER */}

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
                Report{" "}
                <span
                  className={
                    isFound
                      ? "text-emerald-700"
                      : "text-rose-600"
                  }
                >
                  {isFound
                    ? "Found Item"
                    : "Missing Item"}
                </span>
              </h1>

              <p className="text-xs font-medium text-emerald-900/60 mt-1">
                {isFound
                  ? "Provide details to help return this item."
                  : "Provide details to help find your item."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* SCANNER STATUS */}

          <AnimatePresence>
            {scanningImage && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-bold mt-2 border border-emerald-300"
              >
                <Loader2 className="w-3 h-3 animate-spin text-emerald-700" />
                AI Scanning Image & Auto-filling...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* ITEM NAME AND LOCATION */}

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
                placeholder={
                  isFound ? "e.g. Keys" : "e.g. Wallet"
                }
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
                placeholder="e.g. Cafeteria"
                className={inputClass}
              />
            </div>
          </div>

          {/* CATEGORY AND DATE */}

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
                <option value="Electronics">
                  Electronics
                </option>

                <option value="Documents">
                  Documents
                </option>

                <option value="Keys">Keys</option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Jewelry">
                  Jewelry
                </option>

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

          {/* CONTACT AND IMAGE UPLOAD */}

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
                placeholder="Phone / Email"
                className={inputClass}
              />
            </div>

            <div className="form-element space-y-1.5">
              <label className={labelClass}>
                <Upload className={iconClass} />
                Upload Photo
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />

                <motion.div
                  whileHover={{
                    borderColor: isFound
                      ? "#047857"
                      : "#e11d48",
                  }}
                  className={`w-full h-10 flex items-center justify-center gap-1.5 bg-[#F4F7F5] border border-dashed border-emerald-900/20 rounded-lg px-3 text-xs text-emerald-900/60 transition text-center relative z-10 ${
                    isFound
                      ? "hover:bg-emerald-50/50"
                      : "hover:bg-rose-50/50"
                  }`}
                >
                  {imageFile ? (
                    <div
                      className={`flex items-center gap-1 font-bold truncate ${
                        isFound
                          ? "text-emerald-700"
                          : "text-rose-600"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />

                      <span className="truncate text-[10px]">
                        {imageFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className={iconClass} />

                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Choose Image
                      </span>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}

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
              placeholder="Marks, color, condition..."
              className={`w-full bg-[#F4F7F5] border border-emerald-900/10 rounded-lg p-3 text-sm font-medium text-emerald-950 outline-none transition-all duration-300 resize-none focus:bg-white ${
                isFound
                  ? "focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
                  : "focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
              }`}
            />
          </div>

          {/* SUBMIT BUTTON */}

          <div className="form-element pt-1">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={
                !submitting
                  ? { y: -2, scale: 1.005 }
                  : {}
              }
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
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

              <span>
                {submitting
                  ? "Uploading..."
                  : `Submit ${
                      isFound ? "Found" : "Lost"
                    } Report`}
              </span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ReportItem;
