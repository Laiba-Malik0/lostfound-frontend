
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ItemCard from "../components/ItemCard";
import API from "../services/api";
import { Search, Flame, SlidersHorizontal } from "lucide-react";

function LostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const containerRef = useRef(null);

  const categories = [
    "All",
    "Electronics",
    "Documents",
    "Keys",
    "Clothing",
    "Jewelry",
    "Others",
  ];

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/items?type=lost");
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching lost items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      if (filteredItems.length > 0) {
        gsap.fromTo(
          ".gsap-card-wrapper",
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, search, selectedCategory]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#faf8fc] text-slate-700 px-4 sm:px-8 lg:px-12 py-12 relative overflow-hidden font-sans"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-[-100px] w-72 h-72 bg-[#85265e]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-100px] w-72 h-72 bg-[#48235f]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-9 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#85265e] bg-[#f8edf4] border border-[#efdce9] px-4 py-1.5 rounded-full">
            <Flame className="w-4 h-4" />
            Lost Directory
          </span>

         <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#321b3e]">
  Reported{" "}
  <span className="text-[#85265e]">
    Lost Belongings
  </span>
</h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
            Browse active posts for missing items. If you spot something you
            found, click on the card to reach out to the owner immediately.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eadde9] shadow-[0_8px_30px_rgba(65,28,75,0.05)] flex flex-col lg:flex-row gap-4 items-center justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#925276] pointer-events-none" />

            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-[#fbf9fc] border border-[#e9deea] pl-11 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#85265e] focus:bg-white focus:ring-4 focus:ring-[#85265e]/10 transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 pr-3 border-r border-[#eadde9] shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#85265e]" />
              Categories
            </div>

            {categories.map((cat) => {
              const active = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none ${
                    active
                      ? "bg-gradient-to-r from-[#85265e] to-[#48235f] text-white shadow-md shadow-[#702052]/15"
                      : "bg-[#faf7fb] text-slate-600 hover:bg-[#f5eaf2] hover:text-[#85265e]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        {!loading && filteredItems.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-[#85265e]">
                {filteredItems.length}
              </span>{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white border border-[#eadde9] animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-[#f5edf5] rounded-xl" />

                <div className="space-y-3 pt-2">
                  <div className="h-4 bg-[#f0e4f0] rounded w-3/4" />
                  <div className="h-3 bg-[#f5edf5] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <div key={item._id || idx} className="gsap-card-wrapper">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 px-5 rounded-2xl bg-white border border-[#eadde9] text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#f8edf4] border border-[#efdce9] text-[#85265e] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>

           <p className="text-lg font-semibold text-[#321b3e]">
  No Lost Items Found
</p>

            <p className="text-sm text-slate-500">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default LostItems;
