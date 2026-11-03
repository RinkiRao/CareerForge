
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Search,
  RefreshCw,
  Ban,
  CheckCircle2,
  XCircle,
  LogOut,
  Menu,
  Activity,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  Clock3,
  UserRound,
  AlertCircle,
  X,
  Home,
} from "lucide-react";

import "./OwnerDashboard.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const getToken = () =>
  localStorage.getItem("careerforge_owner_token");

// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed (${response.status})`
    );
  }

  return data;
}

// ==========================================
// OWNER DASHBOARD
// ==========================================

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [overview, setOverview] = useState({});
  const [activities, setActivities] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboard = useCallback(
    async (showRefresh = false) => {
      if (!getToken()) {
        navigate("/admin/register", { replace: true });
        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        // Verify Owner authentication
        const profileResponse = await apiRequest(
          "/api/owner-auth/me"
        );

        const currentOwner =
          profileResponse.owner ||
          profileResponse.user ||
          profileResponse;

        setOwner(currentOwner);

        // Load real data from backend
        const [
          overviewResponse,
          studentResponse,
          companyResponse,
        ] = await Promise.all([
          apiRequest("/api/owner-management/overview"),
          apiRequest("/api/owner-management/students"),
          apiRequest("/api/owner-management/companies"),
        ]);

        setOverview(
          overviewResponse.overview || overviewResponse
        );

        setStudents(
          Array.isArray(studentResponse)
            ? studentResponse
            : studentResponse.students || []
        );

        setCompanies(
          Array.isArray(companyResponse)
            ? companyResponse
            : companyResponse.companies || []
        );

        setActivities(
          Array.isArray(overviewResponse.activities)
            ? overviewResponse.activities
            : []
        );
      } catch (err) {
        console.error("Owner dashboard error:", err);

        const errorMessage = String(err.message || "");

        if (
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("authentication") ||
          errorMessage.toLowerCase().includes("expired")
        ) {
          localStorage.removeItem("careerforge_owner_token");
          localStorage.removeItem("careerforge_owner_profile");

          navigate("/admin/register", { replace: true });
          return;
        }

        setError(errorMessage || "Unable to load dashboard.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const counts = useMemo(
    () => ({
      students: Number(
        overview.totalStudents ?? students.length
      ),

      companies: Number(
        overview.totalCompanies ?? companies.length
      ),

      activeStudents: Number(
        overview.activeStudents ??
          students.filter((item) => !item.isBlocked).length
      ),

      pendingCompanies: Number(
        overview.pendingCompanies ??
          companies.filter((item) => {
            const verified =
              item.verificationStatus === "verified" ||
              item.status === "verified";

            const rejected =
              item.verificationStatus === "rejected" ||
              item.status === "rejected";

            const blocked =
              item.isBlocked ||
              item.accountStatus === "blocked";

            return !verified && !rejected && !blocked;
          }).length
      ),
    }),
    [overview, students, companies]
  );

  // ==========================================
  // SEARCH STUDENTS
  // ==========================================

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return students;

    return students.filter((student) =>
      [
        student.name,
        student.fullName,
        student.email,
        student.college,
        student.preferredRole,
        student.countryName,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item).toLowerCase().includes(value)
        )
    );
  }, [students, search]);

  // ==========================================
  // SEARCH COMPANIES
  // ==========================================

  const filteredCompanies = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return companies;

    return companies.filter((company) =>
      [
        company.companyName,
        company.name,
        company.email,
        company.industry,
        company.country,
        company.ownerName,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item).toLowerCase().includes(value)
        )
    );
  }, [companies, search]);

  // ==========================================
  // NOTIFICATION
  // ==========================================

  const showMessage = (message, type = "success") => {
    if (type === "error") {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
  };

  // ==========================================
  // COMMON MANAGEMENT ACTION
  // ==========================================

  const performAction = async (
    endpoint,
    message,
    payload = {}
  ) => {
    try {
      setActionLoading(endpoint);
      setError("");
      setSuccess("");

      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showMessage(message);

      await loadDashboard(true);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // BLOCK STUDENT
  // ==========================================

  const blockStudent = (student) => {
    const id = student.id || student._id;

    if (!id) {
      return showMessage("Student ID nahi mila.", "error");
    }

    if (
      !window.confirm(
        `Kya aap ${student.name || student.fullName || "is student"} ko block karna chahte hain?`
      )
    ) {
      return;
    }

    performAction(
      `/api/owner-management/students/${encodeURIComponent(id)}/block`,
      "Student successfully blocked.",
      {
        reason: "Blocked by platform owner",
      }
    );
  };

  // ==========================================
  // UNBLOCK STUDENT
  // ==========================================

  const unblockStudent = (student) => {
    const id = student.id || student._id;

    if (!id) {
      return showMessage("Student ID nahi mila.", "error");
    }

    performAction(
      `/api/owner-management/students/${encodeURIComponent(id)}/unblock`,
      "Student successfully unblocked."
    );
  };

  // ==========================================
  // VERIFY COMPANY
  // ==========================================

  const verifyCompany = (company) => {
    const id = company.id || company._id;

    if (!id) {
      return showMessage("Company ID nahi mila.", "error");
    }

    if (
      !window.confirm(
        `Kya aap ${company.companyName || company.name || "is company"} ko verify karna chahte hain?`
      )
    ) {
      return;
    }

    performAction(
      `/api/owner-management/companies/${encodeURIComponent(id)}/verify`,
      "Company successfully verified."
    );
  };

  // ==========================================
  // REJECT COMPANY
  // ==========================================

  const rejectCompany = (company) => {
    const id = company.id || company._id;

    if (!id) {
      return showMessage("Company ID nahi mila.", "error");
    }

    if (
      !window.confirm(
        "Kya aap is company registration ko reject karna chahte hain?"
      )
    ) {
      return;
    }

    performAction(
      `/api/owner-management/companies/${encodeURIComponent(id)}/reject`,
      "Company registration rejected.",
      {
        reason: "Verification rejected by platform owner",
      }
    );
  };

  // ==========================================
  // BLOCK / UNBLOCK COMPANY
  // ==========================================

  const toggleCompanyBlock = (company) => {
    const id = company.id || company._id;

    if (!id) {
      return showMessage("Company ID nahi mila.", "error");
    }

    const blocked =
      company.isBlocked ||
      company.accountStatus === "blocked";

    const action = blocked ? "unblock" : "block";

    if (
      !window.confirm(
        `Kya aap is company ko ${action} karna chahte hain?`
      )
    ) {
      return;
    }

    performAction(
      `/api/owner-management/companies/${encodeURIComponent(id)}/${action}`,
      blocked
        ? "Company successfully unblocked."
        : "Company successfully blocked."
    );
  };

  // ==========================================
  // NAVIGATION ACTIONS
  // ==========================================

  const goHome = () => {
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("careerforge_owner_token");
    localStorage.removeItem("careerforge_owner_profile");

    navigate("/admin/register", {
      replace: true,
    });
  };

  // ==========================================
  // DISPLAY HELPERS
  // ==========================================

  const displayName =
    owner?.fullName || owner?.name || "Platform Owner";

  const getStudentStatus = (student) =>
    student.isBlocked ||
    student.accountStatus === "blocked"
      ? "Blocked"
      : "Active";

  const getCompanyStatus = (company) => {
    if (
      company.isBlocked ||
      company.accountStatus === "blocked"
    ) {
      return "Blocked";
    }

    return (
      company.verificationStatus ||
      company.status ||
      company.accountStatus ||
      "Pending"
    );
  };

  const sidebarItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
    },
    {
      id: "companies",
      label: "Companies",
      icon: Building2,
    },
  ];

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="owner-loading">
        <div className="owner-spinner" />

        <h3>CareerForge Owner Panel</h3>

        <p>Dashboard data load ho raha hai...</p>
      </div>
    );
  }

  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="owner-layout">

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="owner-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`owner-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="owner-brand">
          <div className="owner-brand-icon">
            <Briefcase size={23} />
          </div>

          <div>
            <h2>CareerForge</h2>
            <span>OWNER CONTROL</span>
          </div>

          <button
            className="owner-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="owner-sidebar-label">
          WORKSPACE
        </div>

        <nav className="owner-navigation">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`owner-nav-item ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearch("");
                  setSidebarOpen(false);
                  setSelectedRecord(null);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="owner-sidebar-bottom">

          <div className="owner-security-card">
            <ShieldCheck size={24} />

            <div>
              <strong>Owner Access</strong>
              <span>Protected workspace</span>
            </div>
          </div>

          <button
            className="owner-logout"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="owner-main">

        {/* TOPBAR */}
        <header className="owner-topbar">

          <div className="owner-top-left">

            <button
              className="owner-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="owner-breadcrumb">
                CareerForge <span>/</span> Owner Panel
              </div>

              <h1>
                {activeTab === "overview"
                  ? "Platform Overview"
                  : activeTab === "students"
                    ? "Student Management"
                    : "Company Management"}
              </h1>
            </div>

          </div>

          <div className="owner-top-actions">

            {/* BACK TO HOME BUTTON */}
            <button
              className="owner-home-button"
              onClick={goHome}
              title="Back to CareerForge Home"
            >
              <Home size={17} />
              <span>Back to Home</span>
            </button>

            {/* OWNER PROFILE */}
            <div className="owner-profile">

              <div className="owner-avatar">
                {(displayName[0] || "O").toUpperCase()}
              </div>

              <div className="owner-profile-info">
                <strong>{displayName}</strong>
                <span>Super Owner</span>
              </div>

            </div>

            {/* REFRESH BUTTON */}
            <button
              className="owner-refresh"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              title="Refresh dashboard"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "spin" : ""}
              />
            </button>

          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <section className="owner-content">

          {/* ERROR MESSAGE */}
          {error && (
            <div className="owner-alert error">
              <AlertCircle size={18} />

              <span>{error}</span>

              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="owner-alert success">
              <CheckCircle2 size={18} />

              <span>{success}</span>

              <button
                onClick={() => setSuccess("")}
                aria-label="Dismiss success"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* ==================================
              OVERVIEW TAB
          ================================== */}

          {activeTab === "overview" && (
            <>
              {/* WELCOME BANNER */}
              <div className="owner-welcome">

                <div>
                  <span className="owner-eyebrow">
                    PLATFORM CONTROL CENTER
                  </span>

                  <h2>
                    Welcome back, {displayName.split(" ")[0]}!
                  </h2>

                  <p>
                    Monitor registrations, manage users and oversee
                    CareerForge activity from one place.
                  </p>
                </div>

                <div className="owner-welcome-icon">
                  <ShieldCheck size={42} />
                </div>

              </div>

              {/* STATISTICS HEADING */}
              <div className="owner-section-heading">

                <div>
                  <h2>Platform Statistics</h2>
                  <p>Live data received from your server</p>
                </div>

                <span className="owner-live-indicator">
                  <span />
                  LIVE DATA
                </span>

              </div>

              {/* STATISTICS CARDS */}
              <div className="owner-stats-grid">

                <div className="owner-stat-card">
                  <div className="owner-stat-top">
                    <span className="owner-stat-icon blue">
                      <Users size={22} />
                    </span>

                    <span className="owner-stat-caption">
                      ALL USERS
                    </span>
                  </div>

                  <h3>
                    {counts.students.toLocaleString("en-IN")}
                  </h3>

                  <p>Total Students</p>

                  <div className="owner-stat-footer">
                    Registered student accounts
                  </div>
                </div>

                <div className="owner-stat-card">
                  <div className="owner-stat-top">
                    <span className="owner-stat-icon gold">
                      <Building2 size={22} />
                    </span>

                    <span className="owner-stat-caption">
                      BUSINESS
                    </span>
                  </div>

                  <h3>
                    {counts.companies.toLocaleString("en-IN")}
                  </h3>

                  <p>Total Companies</p>

                  <div className="owner-stat-footer">
                    Registered company accounts
                  </div>
                </div>

                <div className="owner-stat-card">
                  <div className="owner-stat-top">
                    <span className="owner-stat-icon green">
                      <CheckCircle2 size={22} />
                    </span>

                    <span className="owner-stat-caption">
                      ACTIVE
                    </span>
                  </div>

                  <h3>
                    {counts.activeStudents.toLocaleString("en-IN")}
                  </h3>

                  <p>Active Students</p>

                  <div className="owner-stat-footer">
                    Students not currently blocked
                  </div>
                </div>

                <div className="owner-stat-card">
                  <div className="owner-stat-top">
                    <span className="owner-stat-icon orange">
                      <Clock3 size={22} />
                    </span>

                    <span className="owner-stat-caption">
                      ACTION NEEDED
                    </span>
                  </div>

                  <h3>
                    {counts.pendingCompanies.toLocaleString("en-IN")}
                  </h3>

                  <p>Pending Companies</p>

                  <div className="owner-stat-footer">
                    Awaiting verification
                  </div>
                </div>

              </div>

              {/* RECENT RECORDS */}
              <div className="owner-overview-grid">

                {/* RECENT STUDENTS */}
                <div className="owner-panel">

                  <div className="owner-panel-heading">

                    <div>
                      <h3>Recent Students</h3>
                      <p>Latest student registrations</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("students");
                        setSearch("");
                      }}
                    >
                      View all
                    </button>

                  </div>

                  {students.length === 0 ? (
                    <div className="owner-empty">
                      <Users size={30} />
                      <p>No student registrations yet.</p>
                    </div>
                  ) : (
                    <div className="owner-recent-list">

                      {[...students]
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                        )
                        .slice(0, 5)
                        .map((student, index) => (
                          <div
                            className="owner-recent-item"
                            key={student.id || student._id || index}
                          >
                            <div className="owner-small-avatar">
                              {(
                                student.name ||
                                student.fullName ||
                                "S"
                              )[0].toUpperCase()}
                            </div>

                            <div className="owner-recent-info">
                              <strong>
                                {student.name ||
                                  student.fullName ||
                                  "Student"}
                              </strong>

                              <span>
                                {student.email || "No email"}
                              </span>
                            </div>

                            <span
                              className={`owner-status ${
                                student.isBlocked ||
                                student.accountStatus === "blocked"
                                  ? "blocked"
                                  : "active"
                              }`}
                            >
                              {getStudentStatus(student)}
                            </span>
                          </div>
                        ))}

                    </div>
                  )}

                </div>

                {/* RECENT COMPANIES */}
                <div className="owner-panel">

                  <div className="owner-panel-heading">

                    <div>
                      <h3>Recent Companies</h3>
                      <p>Latest company registrations</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("companies");
                        setSearch("");
                      }}
                    >
                      View all
                    </button>

                  </div>

                  {companies.length === 0 ? (
                    <div className="owner-empty">
                      <Building2 size={30} />
                      <p>No company registrations yet.</p>
                    </div>
                  ) : (
                    <div className="owner-recent-list">

                      {[...companies]
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                        )
                        .slice(0, 5)
                        .map((company, index) => {
                          const status = getCompanyStatus(company);

                          return (
                            <div
                              className="owner-recent-item"
                              key={company.id || company._id || index}
                            >
                              <div className="owner-small-avatar gold-avatar">
                                {(
                                  company.companyName ||
                                  company.name ||
                                  "C"
                                )[0].toUpperCase()}
                              </div>

                              <div className="owner-recent-info">
                                <strong>
                                  {company.companyName ||
                                    company.name ||
                                    "Company"}
                                </strong>

                                <span>
                                  {company.email || "No email"}
                                </span>
                              </div>

                              <span
                                className={`owner-status ${
                                  status.toLowerCase() === "verified"
                                    ? "active"
                                    : status.toLowerCase() === "blocked" ||
                                        status.toLowerCase() === "rejected"
                                      ? "blocked"
                                      : "pending"
                                }`}
                              >
                                {status}
                              </span>
                            </div>
                          );
                        })}

                    </div>
                  )}

                </div>

              </div>

              {/* RECENT ACTIVITIES */}
              <div className="owner-panel owner-activity-panel">

                <div className="owner-panel-heading">

                  <div>
                    <h3>
                      <Activity size={18} />
                      Recent Platform Activity
                    </h3>

                    <p>
                      Recorded activities from the backend
                    </p>
                  </div>

                </div>

                {activities.length === 0 ? (
                  <div className="owner-empty horizontal">
                    <Activity size={25} />
                    <p>No recorded activity available yet.</p>
                  </div>
                ) : (
                  <div className="owner-activity-list">

                    {activities.slice(0, 8).map((activity, index) => (
                      <div
                        className="owner-activity-row"
                        key={activity.id || index}
                      >
                        <span className="owner-activity-dot" />

                        <div>
                          <strong>
                            {activity.message ||
                              activity.action ||
                              "Platform activity"}
                          </strong>

                          <span>
                            {activity.createdAt
                              ? new Date(
                                  activity.createdAt
                                ).toLocaleString("en-IN")
                              : "Date unavailable"}
                          </span>
                        </div>
                      </div>
                    ))}

                  </div>
                )}

              </div>
            </>
          )}

          {/* ==================================
              STUDENTS TAB
          ================================== */}

          {activeTab === "students" && (
            <section className="owner-panel owner-management-panel">

              <div className="owner-panel-heading management-heading">

                <div>
                  <h2>All Students</h2>
                  <p>
                    View student profiles and manage account access.
                  </p>
                </div>

                <span className="owner-count-pill">
                  {students.length} Students
                </span>

              </div>

              {/* SEARCH */}
              <div className="owner-table-toolbar">

                <div className="owner-search">
                  <Search size={18} />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by name, email or college..."
                  />
                </div>

              </div>

              {/* STUDENT TABLE */}
              <div className="owner-table-wrap">

                <table className="owner-table">

                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>COLLEGE</th>
                      <th>COUNTRY</th>
                      <th>ROLE</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student, index) => {
                      const blocked =
                        student.isBlocked ||
                        student.accountStatus === "blocked";

                      return (
                        <tr key={student.id || student._id || index}>

                          <td>
                            <div className="owner-table-user">

                              <div className="owner-small-avatar">
                                {(
                                  student.name ||
                                  student.fullName ||
                                  "S"
                                )[0].toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {student.name ||
                                    student.fullName ||
                                    "Student"}
                                </strong>

                                <span>
                                  {student.email || "No email"}
                                </span>
                              </div>

                            </div>
                          </td>

                          <td>{student.college || "—"}</td>

                          <td>
                            {student.countryName ||
                              student.country ||
                              "—"}
                          </td>

                          <td>
                            {student.preferredRole ||
                              student.degree ||
                              "—"}
                          </td>

                          <td>
                            <span
                              className={`owner-status ${
                                blocked ? "blocked" : "active"
                              }`}
                            >
                              {getStudentStatus(student)}
                            </span>
                          </td>

                          <td>
                            <div className="owner-row-actions">

                              <button
                                className="owner-detail-button"
                                onClick={() =>
                                  setSelectedRecord({
                                    ...student,
                                    recordType: "student",
                                  })
                                }
                              >
                                Details
                              </button>

                              {blocked ? (
                                <button
                                  className="owner-action-button unblock"
                                  disabled={!!actionLoading}
                                  onClick={() =>
                                    unblockStudent(student)
                                  }
                                >
                                  <CheckCircle2 size={15} />
                                  Unblock
                                </button>
                              ) : (
                                <button
                                  className="owner-action-button block"
                                  disabled={!!actionLoading}
                                  onClick={() =>
                                    blockStudent(student)
                                  }
                                >
                                  <Ban size={15} />
                                  Block
                                </button>
                              )}

                            </div>
                          </td>

                        </tr>
                      );
                    })}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="6" className="owner-no-results">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </section>
          )}

          {/* ==================================
              COMPANIES TAB
          ================================== */}

          {activeTab === "companies" && (
            <section className="owner-panel owner-management-panel">

              <div className="owner-panel-heading management-heading">

                <div>
                  <h2>All Companies</h2>
                  <p>
                    Review company details and manage verification.
                  </p>
                </div>

                <span className="owner-count-pill">
                  {companies.length} Companies
                </span>

              </div>

              {/* SEARCH */}
              <div className="owner-table-toolbar">

                <div className="owner-search">
                  <Search size={18} />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search company, email or industry..."
                  />
                </div>

              </div>

              {/* COMPANY TABLE */}
              <div className="owner-table-wrap">

                <table className="owner-table">

                  <thead>
                    <tr>
                      <th>COMPANY</th>
                      <th>INDUSTRY</th>
                      <th>COUNTRY</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCompanies.map((company, index) => {
                      const status = getCompanyStatus(company);

                      const verified =
                        status.toLowerCase() === "verified";

                      const blocked =
                        company.isBlocked ||
                        company.accountStatus === "blocked";

                      return (
                        <tr key={company.id || company._id || index}>

                          <td>
                            <div className="owner-table-user">

                              <div className="owner-small-avatar gold-avatar">
                                {(
                                  company.companyName ||
                                  company.name ||
                                  "C"
                                )[0].toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {company.companyName ||
                                    company.name ||
                                    "Company"}
                                </strong>

                                <span>
                                  {company.email || "No email"}
                                </span>
                              </div>

                            </div>
                          </td>

                          <td>{company.industry || "—"}</td>
                          <td>{company.country || "—"}</td>

                          <td>
                            <span
                              className={`owner-status ${
                                verified
                                  ? "active"
                                  : blocked ||
                                      status.toLowerCase() === "rejected"
                                    ? "blocked"
                                    : "pending"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <div className="owner-row-actions">

                              <button
                                className="owner-detail-button"
                                onClick={() =>
                                  setSelectedRecord({
                                    ...company,
                                    recordType: "company",
                                  })
                                }
                              >
                                Details
                              </button>

                              {!verified &&
                                !blocked &&
                                status.toLowerCase() !== "rejected" && (
                                  <button
                                    className="owner-action-button unblock"
                                    disabled={!!actionLoading}
                                    onClick={() =>
                                      verifyCompany(company)
                                    }
                                  >
                                    <CheckCircle2 size={15} />
                                    Verify
                                  </button>
                                )}

                              {!blocked &&
                                status.toLowerCase() !== "rejected" && (
                                  <button
                                    className="owner-action-button block"
                                    disabled={!!actionLoading}
                                    onClick={() =>
                                      rejectCompany(company)
                                    }
                                  >
                                    <XCircle size={15} />
                                    Reject
                                  </button>
                                )}

                              <button
                                className={`owner-action-button ${
                                  blocked ? "unblock" : "block"
                                }`}
                                disabled={!!actionLoading}
                                onClick={() =>
                                  toggleCompanyBlock(company)
                                }
                              >
                                {blocked ? "Unblock" : "Block"}
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })}

                    {filteredCompanies.length === 0 && (
                      <tr>
                        <td colSpan="5" className="owner-no-results">
                          No companies found.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </section>
          )}

        </section>
      </main>

      {/* ======================================
          PROFILE DETAILS MODAL
      ====================================== */}

      {selectedRecord && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="owner-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="owner-modal-heading">

              <div>
                <span>PROFILE DETAILS</span>

                <h2>
                  {selectedRecord.recordType === "company"
                    ? selectedRecord.companyName ||
                      selectedRecord.name ||
                      "Company"
                    : selectedRecord.name ||
                      selectedRecord.fullName ||
                      "Student"}
                </h2>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>

            </div>

            <div className="owner-detail-content">

              <Detail
                icon={Mail}
                label="Email"
                value={selectedRecord.email}
              />

              <Detail
                icon={UserRound}
                label="Contact"
                value={selectedRecord.phone}
              />

              <Detail
                icon={MapPin}
                label="Location"
                value={[
                  selectedRecord.city,
                  selectedRecord.stateName ||
                    selectedRecord.state,
                  selectedRecord.countryName ||
                    selectedRecord.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />

              <Detail
                icon={Globe}
                label="Website"
                value={selectedRecord.website}
              />

              {selectedRecord.recordType === "company" ? (
                <>
                  <Detail
                    icon={Briefcase}
                    label="Industry"
                    value={selectedRecord.industry}
                  />

                  <Detail
                    icon={UserRound}
                    label="Recruiter / Owner"
                    value={
                      selectedRecord.ownerName ||
                      selectedRecord.recruiterName
                    }
                  />

                  <Detail
                    icon={ShieldCheck}
                    label="Registration Number"
                    value={selectedRecord.registrationNumber}
                  />

                  <Detail
                    icon={ShieldCheck}
                    label="Verification Status"
                    value={getCompanyStatus(selectedRecord)}
                  />
                </>
              ) : (
                <>
                  <Detail
                    icon={Briefcase}
                    label="College"
                    value={selectedRecord.college}
                  />

                  <Detail
                    icon={ShieldCheck}
                    label="Degree"
                    value={selectedRecord.degree}
                  />

                  <Detail
                    icon={Activity}
                    label="Skills"
                    value={
                      Array.isArray(selectedRecord.skills)
                        ? selectedRecord.skills.join(", ")
                        : selectedRecord.skills
                    }
                  />

                  <Detail
                    icon={Briefcase}
                    label="Preferred Role"
                    value={selectedRecord.preferredRole}
                  />

                  <Detail
                    icon={UserRound}
                    label="Graduation Year"
                    value={selectedRecord.graduationYear}
                  />
                </>
              )}

              <Detail
                icon={Clock3}
                label="Registered On"
                value={
                  selectedRecord.createdAt
                    ? new Date(
                        selectedRecord.createdAt
                      ).toLocaleString("en-IN")
                    : "Not available"
                }
              />

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// REUSABLE DETAIL ITEM
// ==========================================

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="owner-detail-item">

      <span className="owner-detail-icon">
        <Icon size={17} />
      </span>

      <div>
        <small>{label}</small>
        <strong>{value || "Not provided"}</strong>
      </div>

    </div>
  );
}
