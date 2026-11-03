
import React, { useCallback, useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Clock3,
  Activity,
  ShieldCheck,
  CalendarDays,
  Monitor,
  Code2,
  BookOpen,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import ProfileAvatar from "../components/ProfileAvatar";
import "./AccountIntelligence.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDuration(seconds = 0) {
  const totalMinutes = Math.floor(Number(seconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getPageLabel(page = "") {
  const labels = {
    "/": "Home",
    "/learn": "Learning",
    "/leetcode": "Coding Practice",
    "/github": "GitHub Workspace",
    "/linkedin": "Student Network",
    "/jobs": "Jobs & Internships",
    "/dashboard": "Dashboard",
    "/students-dashboard": "Student Dashboard",
  };

  return labels[page] || page.replaceAll("/", " ").trim() || "Unknown";
}

export default function AccountIntelligence() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const isStudent = type === "student";
  const validType = isStudent || type === "company";

  const loadAccount = useCallback(
    async (isRefresh = false) => {
      const token = localStorage.getItem(
        "careerforge_owner_token"
      );

      if (!token) {
        navigate("/admin/register", { replace: true });
        return;
      }

      if (!validType || !id) {
        setError("Invalid account details link.");
        setLoading(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/account-activity/owner/${type}/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("careerforge_owner_token");
            localStorage.removeItem("careerforge_owner_profile");

            navigate("/admin/register", { replace: true });
            return;
          }

          throw new Error(
            data.message || "Unable to load account details."
          );
        }

        setAccount(data.account);
        setActivity(data.activity);
      } catch (err) {
        setError(err.message || "Unable to load account details.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id, type, validType, navigate]
  );

  useEffect(() => {
    loadAccount();

    // Refresh online status and activity.
    const intervalId = window.setInterval(() => {
      loadAccount(true);
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [loadAccount]);

  if (loading) {
    return (
      <div className="account-intel-loading">
        <div className="account-intel-spinner" />
        <h3>Account Intelligence</h3>
        <p>Account details load ho rahe hain...</p>
      </div>
    );
  }

  if (error || !account || !activity) {
    return (
      <div className="account-intel-error">
        <AlertCircle size={35} />
        <h2>Account details unavailable</h2>
        <p>{error || "Account record was not found."}</p>

        <button onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft size={17} />
          Back to Owner Dashboard
        </button>
      </div>
    );
  }

  const name = isStudent
    ? account.name || account.fullName || "Student"
    : account.companyName || account.name || "Company";

  const activeStatus = activity.isOnline;

  const accountStatus = isStudent
    ? account.isBlocked ||
      account.accountStatus === "blocked"
      ? "Blocked"
      : "Active"
    : account.isBlocked ||
      account.accountStatus === "blocked"
      ? "Blocked"
      : account.verificationStatus ||
        account.status ||
        account.accountStatus ||
        "Pending";

  const detailItems = isStudent
    ? [
        {
          label: "Full Name",
          value: name,
          icon: UserRound,
        },
        {
          label: "Email",
          value: account.email,
          icon: Mail,
        },
        {
          label: "Phone",
          value: account.phone,
          icon: Phone,
        },
        {
          label: "Location",
          value: [
            account.city,
            account.stateName || account.state,
            account.countryName || account.country,
          ]
            .filter(Boolean)
            .join(", "),
          icon: MapPin,
        },
        {
          label: "College",
          value: account.college,
          icon: GraduationCap,
        },
        {
          label: "Degree / Branch",
          value: [account.degree, account.branch]
            .filter(Boolean)
            .join(" / "),
          icon: GraduationCap,
        },
        {
          label: "Graduation Year",
          value: account.graduationYear,
          icon: CalendarDays,
        },
        {
          label: "Preferred Role",
          value: account.preferredRole,
          icon: Briefcase,
        },
        {
          label: "GitHub",
          value: account.githubUrl,
          icon: Code2,
        },
        {
          label: "LinkedIn",
          value: account.linkedinUrl,
          icon: Globe,
        },
      ]
    : [
        {
          label: "Company Name",
          value: name,
          icon: Building2,
        },
        {
          label: "Official Email",
          value: account.email || account.companyEmail,
          icon: Mail,
        },
        {
          label: "Phone",
          value: account.phone,
          icon: Phone,
        },
        {
          label: "Website",
          value: account.website,
          icon: Globe,
        },
        {
          label: "Industry",
          value: account.industry,
          icon: Briefcase,
        },
        {
          label: "Location",
          value: [
            account.city,
            account.state,
            account.country,
          ]
            .filter(Boolean)
            .join(", "),
          icon: MapPin,
        },
        {
          label: "Company Size",
          value: account.companySize,
          icon: UsersIcon,
        },
        {
          label: "Recruiter / Owner",
          value:
            account.ownerName ||
            account.recruiterName,
          icon: UserRound,
        },
        {
          label: "Registration Number",
          value: account.registrationNumber,
          icon: ShieldCheck,
        },
      ];

  const dailyEntries = Object.entries(
    activity.dailyActivity || {}
  ).sort(([a], [b]) => a.localeCompare(b));

  const maxDailySeconds = Math.max(
    1,
    ...dailyEntries.map(([, seconds]) => Number(seconds))
  );

  return (
    <div className="account-intel-page">

      {/* HEADER */}
      <header className="account-intel-header">

        <button
          className="account-back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft size={18} />
          <span>Back to Owner Dashboard</span>
        </button>

        <button
          className="account-refresh-button"
          onClick={() => loadAccount(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? "account-spin" : ""}
          />
          Refresh
        </button>

      </header>

      <main className="account-intel-content">

        {/* PROFILE HERO */}
        <section className="account-profile-hero">

          <div className="account-profile-identity">

            <ProfileAvatar
              className="account-large-avatar"
              image={isStudent ? account.profileImage : account.logo}
              name={name}
            />

            <div className="account-profile-name">

              <span className="account-profile-type">
                {isStudent ? "STUDENT ACCOUNT" : "COMPANY ACCOUNT"}
              </span>

              <h1>{name}</h1>

              <p>{account.email || account.companyEmail || "Email not provided"}</p>

              <div className="account-profile-badges">

                <span
                  className={`account-badge ${
                    activeStatus ? "online" : "offline"
                  }`}
                >
                  <span />
                  {activeStatus ? "Online" : "Offline"}
                </span>

                <span
                  className={`account-badge ${
                    accountStatus.toLowerCase() === "active" ||
                    accountStatus.toLowerCase() === "verified"
                      ? "verified"
                      : accountStatus.toLowerCase() === "blocked" ||
                          accountStatus.toLowerCase() === "rejected"
                        ? "blocked"
                        : "pending"
                  }`}
                >
                  {accountStatus}
                </span>

              </div>
            </div>
          </div>

          <div className="account-profile-registered">
            <span>Registered On</span>
            <strong>{formatDate(account.createdAt)}</strong>
          </div>

        </section>

        {/* LIVE ACTIVITY SUMMARY */}
        <section className="account-intel-section">

          <div className="account-intel-section-title">
            <div>
              <span>MONITORING</span>
              <h2>Activity Overview</h2>
              <p>CareerForge platform usage and session information.</p>
            </div>

            <Activity size={25} />
          </div>

          <div className="account-metrics-grid">

            <Metric
              label="Current Status"
              value={activeStatus ? "Online" : "Offline"}
              icon={Monitor}
              color={activeStatus ? "green" : "blue"}
            />

            <Metric
              label="Total Sessions"
              value={activity.totalSessions || 0}
              icon={Clock3}
              color="blue"
            />

            <Metric
              label="Total Active Time"
              value={formatDuration(activity.totalActiveSeconds)}
              icon={Activity}
              color="gold"
            />

            <Metric
              label="Last Seen"
              value={
                activity.lastSeen
                  ? formatDate(activity.lastSeen)
                  : "No activity yet"
              }
              icon={CalendarDays}
              color="purple"
            />

          </div>

          <div className="account-current-activity">

            <div className="account-current-icon">
              <Activity size={20} />
            </div>

            <div>
              <span>Currently Active In</span>

              <strong>
                {activeStatus && activity.currentPage
                  ? getPageLabel(activity.currentPage)
                  : "Not currently active"}
              </strong>
            </div>

          </div>

        </section>

        {/* PROFILE INFORMATION */}
        <section className="account-intel-section">

          <div className="account-intel-section-title">
            <div>
              <span>ACCOUNT INFORMATION</span>
              <h2>Complete Profile</h2>
              <p>Information saved in CareerForge account.</p>
            </div>

            {isStudent ? (
              <UserRound size={25} />
            ) : (
              <Building2 size={25} />
            )}
          </div>

          <div className="account-detail-grid">

            {detailItems.map((item) => (
              <DetailItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}

            {isStudent && (
              <DetailItem
                icon={Code2}
                label="Skills"
                value={
                  Array.isArray(account.skills)
                    ? account.skills.join(", ")
                    : account.skills
                }
              />
            )}

            {!isStudent && (
              <DetailItem
                icon={Globe}
                label="Description"
                value={account.description}
              />
            )}

          </div>
        </section>

        {/* DAILY ACTIVITY */}
        <section className="account-intel-section">

          <div className="account-intel-section-title">
            <div>
              <span>USAGE HISTORY</span>
              <h2>Daily Active Time</h2>
              <p>Recorded active time by session date.</p>
            </div>

            <Clock3 size={25} />
          </div>

          {dailyEntries.length === 0 ? (
            <div className="account-intel-empty">
              <Activity size={27} />
              <p>No activity recorded yet.</p>
            </div>
          ) : (
            <div className="account-daily-list">

              {dailyEntries.map(([day, seconds]) => (
                <div className="account-daily-row" key={day}>

                  <span>{day}</span>

                  <div className="account-daily-track">
                    <div
                      className="account-daily-fill"
                      style={{
                        width: `${
                          (Number(seconds) / maxDailySeconds) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <strong>{formatDuration(seconds)}</strong>

                </div>
              ))}

            </div>
          )}
        </section>

        {/* SESSIONS */}
        <section className="account-intel-section">

          <div className="account-intel-section-title">
            <div>
              <span>LOGIN HISTORY</span>
              <h2>Recent Sessions</h2>
              <p>Recent authenticated CareerForge sessions.</p>
            </div>

            <Monitor size={25} />
          </div>

          {activity.recentSessions?.length ? (
            <div className="account-session-list">

              {activity.recentSessions.map((session) => (
                <div
                  className="account-session-row"
                  key={session.id}
                >

                  <div className="account-session-icon">
                    <Monitor size={19} />
                  </div>

                  <div className="account-session-info">
                    <strong>
                      {getPageLabel(session.currentPage)}
                    </strong>

                    <span>
                      Started: {formatDate(session.startedAt)}
                    </span>

                    <span>
                      Last activity: {formatDate(session.lastSeen)}
                    </span>
                  </div>

                  <strong className="account-session-duration">
                    {formatDuration(session.activeSeconds)}
                  </strong>

                </div>
              ))}

            </div>
          ) : (
            <div className="account-intel-empty">
              <Clock3 size={27} />
              <p>No sessions recorded yet.</p>
            </div>
          )}
        </section>

        {/* ACTIVITY TIMELINE */}
        <section className="account-intel-section">

          <div className="account-intel-section-title">
            <div>
              <span>CAREERFORGE HISTORY</span>
              <h2>Activity Timeline</h2>
              <p>Recent CareerForge page visits and sessions.</p>
            </div>

            <Activity size={25} />
          </div>

          {activity.recentEvents?.length ? (
            <div className="account-timeline">

              {activity.recentEvents.map((item) => (
                <div
                  className="account-timeline-item"
                  key={item.id}
                >

                  <span className="account-timeline-dot" />

                  <div className="account-timeline-body">

                    <strong>
                      {item.event === "session_started"
                        ? "Session started"
                        : "Visited " + getPageLabel(item.page)}
                    </strong>

                    <span>{formatDate(item.createdAt)}</span>

                    <small>{item.page || "CareerForge"}</small>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="account-intel-empty">
              <Activity size={27} />
              <p>No activity history recorded yet.</p>
            </div>
          )}
        </section>

        <div className="account-intel-disclaimer">
          <ShieldCheck size={17} />
          Activity information is limited to authenticated usage within CareerForge.
          Online status is based on recent heartbeat activity, not physical location.
        </div>

      </main>
    </div>
  );
}

// ==========================================
// REUSABLE METRIC
// ==========================================

function Metric({ label, value, icon: Icon, color }) {
  return (
    <div className="account-metric-card">

      <div className={`account-metric-icon ${color}`}>
        <Icon size={21} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

// ==========================================
// REUSABLE DETAIL
// ==========================================

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="account-detail-item">

      <div className="account-detail-icon">
        <Icon size={18} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value || "Not provided"}</strong>
      </div>

    </div>
  );
}

// Reused in the detail component.
function UsersIcon(props) {
  return <UserRound {...props} />;
}
