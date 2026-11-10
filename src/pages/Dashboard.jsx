
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
  Package,
  Inbox,
  Send,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  ArrowUpRight,
  ShieldCheck,
  UserRound,
  FileText,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my-posts");
  const [myItems, setMyItems] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [itemsRes, receivedRes, sentRes] =
        await Promise.allSettled([
          API.get("/items/my-posts"),
          API.get("/claims/received"),
          API.get("/claims/my-claims"),
        ]);

      if (itemsRes.status === "fulfilled") {
        setMyItems(itemsRes.value.data || []);
      }

      if (receivedRes.status === "fulfilled") {
        setReceivedClaims(receivedRes.value.data || []);
      }

      if (sentRes.status === "fulfilled") {
        setMyClaims(sentRes.value.data || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?"))
      return;

    try {
      await API.delete(`/items/${id}`);
      setMyItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item.");
    }
  };

  const handleClaimStatus = async (claimId, newStatus) => {
    try {
      await API.put(`/claims/${claimId}`, { status: newStatus });

      setReceivedClaims((prev) =>
        prev.map((c) =>
          c._id === claimId ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      alert("Failed to update claim status.");
    }
  };

  const pendingClaims = receivedClaims.filter(
    (claim) => !claim.status || claim.status === "Pending"
  ).length;

  const stats = [
    {
      title: "My Reports",
      value: myItems.length,
      icon: Package,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Received Claims",
      value: receivedClaims.length,
      icon: Inbox,
      color: "bg-pink-100 text-pink-700",
    },
    {
      title: "Pending Requests",
      value: pendingClaims,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "My Claims",
      value: myClaims.length,
      icon: Send,
      color: "bg-violet-100 text-violet-700",
    },
  ];

  const tabs = [
    {
      id: "my-posts",
      label: "My Reports",
      count: myItems.length,
      icon: Package,
    },
    {
      id: "received-claims",
      label: "Received Claims",
      count: receivedClaims.length,
      icon: Inbox,
    },
    {
      id: "my-claims",
      label: "Submitted Claims",
      count: myClaims.length,
      icon: Send,
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "Rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="bg-white border border-[#EADFEA] rounded-3xl py-16 px-6 text-center shadow-sm">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F7EDF5] flex items-center justify-center mb-5">
        <Icon className="w-9 h-9 text-[#713665]" />
      </div>

      <h3 className="text-lg font-bold text-[#352239]">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {title === "No Reports Posted Yet" && (
        <Link
          to="/report"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#713665] text-white text-sm font-semibold hover:bg-[#54244F] transition shadow-lg shadow-purple-900/10"
        >
          <PlusCircle size={17} />
          Create Your First Report
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7FA] text-[#352239] font-sans px-4 sm:px-6 lg:px-10 py-7 sm:py-10">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Header */}

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#241026] via-[#38143F] to-[#54204F] p-6 sm:p-9 shadow-xl shadow-purple-950/10">

          <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute right-40 -bottom-32 w-64 h-64 rounded-full bg-pink-300/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-7">

            <div className="flex items-center gap-4 sm:gap-5">

              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-pink-200 text-xs font-semibold uppercase tracking-[2px] mb-2">
                  <Sparkles size={14} />
                  Personal Dashboard
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white capitalize tracking-tight">
                  Welcome, {user.name || "User"}!
                </h1>

                <p className="text-sm text-purple-100 mt-2 break-all">
                  {user.email || "Manage your reports and claims"}
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={fetchDashboardData}
                title="Refresh Data"
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition cursor-pointer"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>

              <Link
                to="/report"
                className="flex-1 sm:flex-none h-12 px-5 rounded-xl bg-white text-[#713665] font-bold text-sm flex items-center justify-center gap-2 hover:bg-pink-50 transition shadow-lg"
              >
                <PlusCircle size={18} />
                New Report
              </Link>

            </div>
          </div>

          <div className="relative mt-8 pt-5 border-t border-white/15 flex items-center gap-2 text-xs text-purple-100">
            <ShieldCheck size={16} />
            <span>Your community dashboard for safer lost and found reporting.</span>
          </div>

        </section>

        {/* Statistics */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white border border-[#EDE3ED] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-center gap-2">

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon size={21} />
                  </div>

                  <span className="text-[10px] font-bold text-gray-400">
                    0{index + 1}
                  </span>

                </div>

                <h2 className="text-3xl font-bold text-[#38243A] mt-5">
                  {stat.value}
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  {stat.title}
                </p>

              </div>
            );
          })}

        </section>

        {/* Main Content */}

        <section className="space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">

            <div>
              <div className="flex items-center gap-2 text-[#87427A] text-xs font-bold uppercase tracking-widest mb-2">
                <LayoutDashboard size={15} />
                Account Overview
              </div>

              <h2 className="text-2xl font-bold text-[#352239]">
                Manage Your Activity
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Keep track of your reports and item claim requests.
              </p>
            </div>

            <div className="text-xs font-semibold text-gray-400 flex items-center gap-2">
              <CalendarDays size={15} />
              Your Personal Workspace
            </div>

          </div>

          {/* Tabs */}

          <div className="bg-white border border-[#EDE3ED] rounded-2xl p-2 shadow-sm flex flex-col sm:flex-row gap-2">

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#38143F] to-[#54204F] text-white shadow-md shadow-purple-900/15"
                      : "bg-[#F8F1F8] text-[#54204F] border border-[#EADBEA] hover:bg-[#F0E4F0] hover:text-[#38143F]"
                  }`}
                >

                  <span className="flex items-center gap-2.5">
                    <Icon size={18} />
                    {tab.label}
                  </span>

                  <span className={`min-w-7 h-7 px-2 rounded-lg flex items-center justify-center text-xs font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#EADBEA] text-[#54204F]"
                  }`}>
                    {tab.count}
                  </span>

                </button>
              );
            })}

          </div>

          {/* Error */}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold rounded-xl flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </span>

              <button
                onClick={fetchDashboardData}
                className="underline shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-56 bg-white border border-[#EDE3ED] rounded-2xl animate-pulse"
                />
              ))}
            </div>

          ) : (

            <div className="min-h-[300px]">

              {/* MY REPORTS */}

              {activeTab === "my-posts" && (

                myItems.length > 0 ? (

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {myItems.map((item) => (

                      <div
                        key={item._id}
                        className="group bg-white border border-[#EDE3ED] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                      >

                        <div>

                          <div className="flex justify-between items-center gap-2 mb-5">

                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                              item.type === "lost"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                              {item.type === "lost" ? "Lost Item" : "Found Item"}
                            </span>

                            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                              <CalendarDays size={13} />
                              {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                            </span>

                          </div>

                          <h3 className="text-lg font-bold text-[#352239] group-hover:text-[#713665] transition truncate">
                            {item.title}
                          </h3>

                          <p className="text-sm text-gray-500 leading-relaxed mt-2 line-clamp-3">
                            {item.description}
                          </p>

                        </div>

                        <div className="pt-5 mt-5 border-t border-[#F0E9F0] flex items-center justify-between">

                          <button
                            onClick={() => navigate(`/items/${item._id}`)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#713665] hover:text-[#54244F] transition cursor-pointer"
                          >
                            View Details
                            <ArrowUpRight size={15} />
                          </button>

                          <div className="flex items-center gap-1">

                            <Link
                              to={`/edit-item/${item._id}`}
                              title="Edit Report"
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#713665] hover:bg-[#F5EDF5] transition"
                            >
                              <Edit3 size={17} />
                            </Link>

                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              title="Delete Report"
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <EmptyState
                    icon={Package}
                    title="No Reports Posted Yet"
                    description="You haven't reported any lost or found items. Create your first report to get started."
                  />

                )

              )}

              {/* RECEIVED CLAIMS */}

              {activeTab === "received-claims" && (

                receivedClaims.length > 0 ? (

                  <div className="space-y-4">

                    {receivedClaims.map((claim) => (

                      <div
                        key={claim._id}
                        className="bg-white border border-[#EDE3ED] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                          <div className="space-y-3 flex-1 min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="w-9 h-9 rounded-xl bg-[#F5EDF5] flex items-center justify-center text-[#713665]">
                                <Inbox size={18} />
                              </span>

                              <h3 className="font-bold text-[#352239]">
                                {claim.item?.title || "Reported Item"}
                              </h3>

                              <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(claim.status)}`}>
                                {claim.status || "Pending"}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <UserRound size={15} className="text-[#87427A]" />
                              Requested by:
                              <span className="font-semibold text-[#713665]">
                                {claim.requestedBy?.name || "User"}
                              </span>
                            </div>

                            <div className="bg-[#FAF7FA] border border-[#F0E8F0] rounded-xl p-4">

                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#87427A] mb-2">
                                Proof Message
                              </p>

                              <p className="text-sm text-gray-600 leading-relaxed">
                                "{claim.message}"
                              </p>

                            </div>

                            {claim.requestedBy?.email && (

                              <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                                <PhoneCall size={14} className="text-[#87427A]" />
                                Contact: {claim.requestedBy.phone || claim.requestedBy.email}
                              </p>

                            )}

                          </div>

                          <div className="flex items-center gap-2 shrink-0">

                            {claim.status === "Pending" || !claim.status ? (

                              <>
                                <button
                                  onClick={() => handleClaimStatus(claim._id, "Approved")}
                                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                                >
                                  <CheckCircle2 size={16} />
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleClaimStatus(claim._id, "Rejected")}
                                  className="px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                                >
                                  <XCircle size={16} />
                                  Reject
                                </button>
                              </>

                            ) : (

                              <span className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${getStatusStyle(claim.status)}`}>
                                {claim.status}
                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <EmptyState
                    icon={Inbox}
                    title="No Claims Received Yet"
                    description="When someone submits a claim on your reported items, their requests will appear here."
                  />

                )

              )}

              {/* MY SUBMITTED CLAIMS */}

              {activeTab === "my-claims" && (

                myClaims.length > 0 ? (

                  <div className="space-y-4">

                    {myClaims.map((claim) => (

                      <div
                        key={claim._id}
                        className="bg-white border border-[#EDE3ED] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                          <div className="flex-1 min-w-0 space-y-3">

                            <div className="flex flex-wrap items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-[#F5EDF5] flex items-center justify-center text-[#713665]">
                                <FileText size={19} />
                              </div>

                              <h3 className="font-bold text-[#352239]">
                                {claim.item?.title || "Item Requested"}
                              </h3>

                              <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase flex items-center gap-1.5 ${getStatusStyle(claim.status)}`}>

                                {claim.status === "Approved" && <CheckCircle2 size={13} />}
                                {claim.status === "Rejected" && <XCircle size={13} />}
                                {(claim.status === "Pending" || !claim.status) && <Clock size={13} />}

                                {claim.status || "Pending"}

                              </span>

                            </div>

                            <div className="bg-[#FAF7FA] border border-[#F0E8F0] rounded-xl p-4">

                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#87427A] mb-2">
                                Your Proof Message
                              </p>

                              <p className="text-sm text-gray-600 leading-relaxed">
                                "{claim.message}"
                              </p>

                            </div>

                          </div>

                          {claim.item && (

                            <button
                              onClick={() => navigate(`/items/${claim.item._id || claim.item}`)}
                              className="px-5 py-3 rounded-xl bg-[#F5EDF5] hover:bg-[#EEDFED] text-[#713665] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                            >
                              View Item
                              <ExternalLink size={15} />
                            </button>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <EmptyState
                    icon={Send}
                    title="No Claims Submitted Yet"
                    description="You haven't submitted any item claims yet. Explore available reports to find your belongings."
                  />

                )

              )}

            </div>

          )}

        </section>

        {/* Bottom Note */}

        <div className="border-t border-[#EDE3ED] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray-400 flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#87427A]" />
            Lost & Found Community Platform
          </p>

          <p className="text-xs text-gray-400">
            Helping people reconnect with their belongings.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
