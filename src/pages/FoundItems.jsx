
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import ItemCard from "../components/ItemCard";
import {
  Search,
  PackageSearch,
  RefreshCw,
  SlidersHorizontal,
  HandHeart,
  Sparkles,
  ShieldCheck,
  MapPin,
  Heart,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Electronics",
  "Documents",
  "Keys",
  "Clothing",
  "Jewelry",
  "Others",
];

function FoundItems() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const fetchFoundItems = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/items");

      const foundOnly = (res.data || []).filter(
        (item) => item.type?.toLowerCase() === "found"
      );

      setItems(foundOnly);
      setFilteredItems(foundOnly);
    } catch (err) {
      console.error("Fetch items error:", err);
      setError("Failed to load found items. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = items;

    if (selectedCategory !== "All") {
      result = result.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query)
      );
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, items]);

  return (
    <div className="min-h-screen bg-[#FAF7FA] text-[#352239] font-sans pb-20">

      {/* Hero Section */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#241026] via-[#38143F] to-[#54204F] px-4 sm:px-8 py-16 sm:py-20 text-center">

        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-purple-300/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-pink-400/10 blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-5">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-pink-100 text-[11px] font-bold uppercase tracking-[2px] backdrop-blur-md">
            <HandHeart size={15} />
            Found Directory
            <Sparkles size={13} />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-tight">
            Explore{" "}
            <span className="text-pink-300">
              Found Items
            </span>
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 max-w-xl mx-auto leading-relaxed">
            Items reported by community members. Search and explore
            to reconnect with your missing belongings.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-purple-200">
            <ShieldCheck size={16} />
            <span>Helping people find what matters.</span>
          </div>

        </div>

      </section>

      {/* Main Container */}

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-8">

        {/* Search and Filter */}

        <section className="bg-white border border-[#EDE3ED] rounded-2xl p-4 sm:p-5 shadow-sm">

          <div className="flex flex-col lg:flex-row items-center gap-5">

            {/* Search Input */}

            <div className="relative w-full lg:max-w-sm shrink-0">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#87427A] pointer-events-none" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full h-12 bg-[#FAF7FA] border border-[#EADBEA] rounded-xl pl-12 pr-4 text-sm text-[#352239] font-medium placeholder:text-[#9A8398] outline-none focus:border-[#713665] focus:bg-white focus:ring-4 focus:ring-purple-100/70 transition-all"
              />

            </div>

            {/* Category Filters */}

            <div className="flex-1 w-full min-w-0">

              <div className="flex items-center gap-2 mb-3 text-[#713665]">

                <SlidersHorizontal size={16} />

                <span className="text-xs font-bold uppercase tracking-widest">
                  Filter by Category
                </span>

              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">

                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative h-10 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#38143F] to-[#54204F] text-white shadow-md shadow-purple-900/15"
                          : "bg-[#F8F1F8] text-[#54204F] border border-[#EADBEA] hover:bg-[#F0E4F0] hover:text-[#38143F]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}

              </div>

            </div>

          </div>

        </section>

        {/* Results Heading */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>
            <div className="flex items-center gap-2 text-[#87427A] text-xs font-bold uppercase tracking-widest mb-2">
              <PackageSearch size={16} />
              Community Collection
            </div>

            <h2 className="text-2xl font-bold text-[#352239]">
              Available Found Items
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Browse recently reported belongings.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 bg-white border border-[#EDE3ED] rounded-xl text-xs font-semibold text-[#713665]">
            <PackageSearch size={15} />
            {loading ? "Loading items..." : `${filteredItems.length} Items Found`}
          </div>

        </div>

        {/* Loading State */}

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (

              <div
                key={n}
                className="h-80 rounded-2xl bg-white border border-[#EDE3ED] animate-pulse p-4 flex flex-col justify-between"
              >

                <div className="w-full h-44 bg-[#F1E8F1] rounded-xl" />

                <div className="space-y-3 pt-3">
                  <div className="h-4 bg-[#F1E8F1] rounded-lg w-3/4" />
                  <div className="h-3 bg-[#F7F1F7] rounded-lg w-1/2" />
                  <div className="h-3 bg-[#F7F1F7] rounded-lg w-2/3" />
                </div>

              </div>

            ))}

          </div>

        ) : error ? (

          /* Error State */

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-4">

            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-base font-bold text-rose-800">
              Unable to Load Items
            </h3>

            <p className="text-sm text-rose-600">
              {error}
            </p>

            <button
              onClick={fetchFoundItems}
              className="px-5 py-3 bg-gradient-to-r from-[#38143F] to-[#54204F] hover:from-[#241026] hover:to-[#38143F] text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw size={15} />
              Try Again
            </button>

          </div>

        ) : filteredItems.length > 0 ? (

          /* Items Grid */

          <AnimatePresence mode="popLayout">

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >

              {filteredItems.map((item) => (

                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={item._id}
                >
                  <ItemCard item={item} />
                </motion.div>

              ))}

            </motion.div>

          </AnimatePresence>

        ) : (

          /* Empty State */

          <div className="bg-white border border-[#EDE3ED] rounded-3xl py-16 px-5 text-center shadow-sm">

            <div className="w-20 h-20 rounded-3xl bg-[#F5EDF5] border border-[#EADBEA] text-[#713665] flex items-center justify-center mx-auto mb-5">
              <PackageSearch size={34} />
            </div>

            <h3 className="text-lg font-bold text-[#352239]">
              No Found Items Match
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Try changing your search term or category filter
              to discover more reported items.
            </p>

            {(searchQuery || selectedCategory !== "All") && (

              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 px-5 py-3 rounded-xl bg-gradient-to-r from-[#38143F] to-[#54204F] text-white text-xs font-bold hover:shadow-lg transition cursor-pointer"
              >
                Clear All Filters
              </button>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default FoundItems;
