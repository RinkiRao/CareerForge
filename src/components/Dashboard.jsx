
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  BriefcaseBusiness,
  UserRound,
  Search,
  Bell,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Flame,
  Trophy,
  Target,
  Clock3,
  Play,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Compass,
  BrainCircuit,
} from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import "./Dashboard.css";

// Custom LinkedIn icon: avoids unsupported lucide-react exports
function LinkedInMark({ size = 19 }) {
  return (
    <span
      className="linkedin-mark"
      style={{ width: size, height: size }}
      role="img"
      aria-label="LinkedIn"
      title="LinkedIn"
    >
      in
    </span>
  );
}

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Learning", icon: BookOpen, path: "/learn" },
  { label: "Practice Arena", icon: Code2, path: "/leetcode" },
  { label: "Jobs & Internships", icon: BriefcaseBusiness, path: "/jobs" },
  { label: "GitHub Profile", icon: Code2, path: "/github" },
  { label: "LinkedIn Profile", icon: LinkedInMark, path: "/linkedin" },
  { label: "MIRA AI Companion", icon: BrainCircuit, path: "/mira" },
];

const courses = [
  {
    id: 1,
    category: "WEB DEVELOPMENT",
    title: "Full Stack Web Development",
    description:
      "Build modern websites with React, Node.js and MongoDB.",
    progress: 0,
    lessons: "Start your learning journey",
    duration: "12 hours",
    tone: "green",
    icon: Code2,
    path: "/learn",
  },
  {
    id: 2,
    category: "DATA STRUCTURES",
    title: "Data Structures & Algorithms",
    description:
      "Strengthen your problem-solving and coding skills.",
    progress: 0,
    lessons: "Practice at your own pace",
    duration: "16 hours",
    tone: "purple",
    icon: Target,
    path: "/leetcode",
  },
  {
    id: 3,
    category: "PERSONAL GROWTH",
    title: "Communication Skills",
    description:
      "Improve your confidence for interviews and teamwork.",
    progress: 0,
    lessons: "Start building confidence",
    duration: "8 hours",
    tone: "orange",
    icon: UserRound,
    path: "/learn",
  },
];

const activities = [
  {
    icon: CheckCircle2,
    title: "Welcome to CareerForge",
    detail: "Your career preparation workspace",
    time: "Get started",
    tone: "green",
  },
  {
    icon: Trophy,
    title: "Practice makes progress",
    detail: "Explore coding challenges",
    time: "Practice Arena",
    tone: "purple",
  },
  {
    icon: BookOpen,
    title: "Explore learning resources",
    detail: "Build your skills step by step",
    time: "My Learning",
    tone: "orange",
  },
];

const exploreItems = [
  {
    title: "Jobs & Internships",
    description:
      "Explore opportunities for your next career move.",
    icon: BriefcaseBusiness,
    tone: "green",
    path: "/jobs",
    action: "Explore jobs",
  },
  {
    title: "Learning Resources",
    description:
      "Explore courses and improve your technical skills.",
    icon: GraduationCap,
    tone: "purple",
    path: "/learn",
    action: "Start learning",
  },
  {
    title: "Coding Practice",
    description:
      "Strengthen your DSA and problem-solving skills.",
    icon: Code2,
    tone: "orange",
    path: "/leetcode",
    action: "Start practicing",
  },
  {
    title: "GitHub Profile",
    description:
      "Showcase your coding projects and repositories.",
    icon: Code2,
    tone: "blue",
    path: "/github",
    action: "View GitHub",
  },
  {
    title: "LinkedIn Profile",
    description: "Build your professional presence.",
    icon: LinkedInMark,
    tone: "purple",
    path: "/linkedin",
    action: "View LinkedIn",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return courses;

    return courses.filter((course) =>
      `${course.title} ${course.category} ${course.description}`
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery]);

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="dashboard">
      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <Sparkles size={23} />
          </div>

          <div>
            <span className="dashboard-brand-name">
              CareerForge
            </span>
            <span className="dashboard-brand-caption">
              YOUR CAREER, FORGED
            </span>
          </div>

          <button
            type="button"
            className="dashboard-close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="dashboard-nav-label">
          STUDENT WORKSPACE
        </div>

        <nav className="dashboard-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.path === "/dashboard";

            return (
              <button
                type="button"
                key={item.label}
                className={`dashboard-nav-item ${
                  active ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-spacer" />

        <div className="dashboard-goal-card">
          <div className="dashboard-goal-icon">
            <Target size={20} />
          </div>

          <p className="dashboard-goal-title">
            Your weekly goal
          </p>

          <p className="dashboard-goal-description">
            Make time for learning and practice to move closer
            to your career goals.
          </p>

          <div className="dashboard-goal-progress">
            <span style={{ width: "0%" }} />
          </div>

          <div className="dashboard-goal-footer">
            <span>Start your weekly goal</span>
            <strong>0%</strong>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-sidebar-profile"
          onClick={() => handleNavigation("/github")}
        >
          <ProfileAvatar className="dashboard-avatar" />

          <div className="dashboard-profile-info">
            <strong>Student Account</strong>
            <span>CareerForge workspace</span>
          </div>

          <UserRound size={17} />
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button
              type="button"
              className="dashboard-menu-button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="dashboard-breadcrumb">
                STUDENT WORKSPACE / OVERVIEW
              </p>
              <h1>Dashboard</h1>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <label className="dashboard-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search learning paths..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                aria-label="Search learning paths"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={15} />
                </button>
              )}
            </label>

            <button
              type="button"
              className="dashboard-notification"
              aria-label="Notifications"
              title="Notifications"
              onClick={() =>
                window.alert(
                  "Notifications will be available when this feature is connected."
                )
              }
            >
              <Bell size={19} />
            </button>

            <ProfileAvatar className="dashboard-header-avatar" />
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-hero">
            <div className="dashboard-hero-decoration dashboard-hero-decoration-one" />
            <div className="dashboard-hero-decoration dashboard-hero-decoration-two" />

            <div className="dashboard-hero-content">
              <div className="dashboard-hero-eyebrow">
                <Sparkles size={15} />
                YOUR PERSONAL CAREER SPACE
              </div>

              <h2>
                Build skills.
                <br />
                <span>Shape your future.</span>
              </h2>

              <p>
                Discover learning resources, practice coding, and
                explore career opportunities—all from one place.
              </p>

              <button
                type="button"
                className="dashboard-primary-button"
                onClick={() => handleNavigation("/learn")}
              >
                Explore learning
                <ArrowRight size={17} />
              </button>
            </div>

            <div
              className="dashboard-hero-visual"
              aria-hidden="true"
            >
              <div className="dashboard-hero-orbit dashboard-orbit-one" />
              <div className="dashboard-hero-orbit dashboard-orbit-two" />

              <div className="dashboard-hero-center">
                <TrendingUp size={46} strokeWidth={1.5} />
              </div>

              <div className="dashboard-floating-card dashboard-floating-card-top">
                <Flame size={17} />
                <span>Build your streak</span>
              </div>

              <div className="dashboard-floating-card dashboard-floating-card-bottom">
                <Trophy size={17} />
                <span>Keep growing!</span>
              </div>
            </div>
          </section>

          <div className="dashboard-section-heading dashboard-stats-heading">
            <div>
              <p className="dashboard-overline">
                YOUR CAREER JOURNEY
              </p>
              <h2>Your workspace at a glance</h2>
            </div>

            <span className="dashboard-updated">
              <span className="dashboard-live-dot" />
              Ready to explore
            </span>
          </div>

          <section className="dashboard-stats-grid">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon green">
                  <BookOpen size={20} />
                </span>
                <span className="dashboard-stat-tag">
                  Learning
                </span>
              </div>

              <p className="dashboard-stat-label">
                Learning paths
              </p>
              <div className="dashboard-stat-value">
                {courses.length}
              </div>

              <p className="dashboard-stat-footnote">
                Sample learning paths to explore
              </p>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon purple">
                  <Code2 size={20} />
                </span>
                <span className="dashboard-stat-tag">
                  Practice
                </span>
              </div>

              <p className="dashboard-stat-label">
                Coding practice
              </p>
              <div className="dashboard-stat-value">
                <Code2 size={30} />
              </div>

              <p className="dashboard-stat-footnote">
                Practice problem-solving skills
              </p>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon orange">
                  <BriefcaseBusiness size={20} />
                </span>
                <span className="dashboard-stat-tag">
                  Career
                </span>
              </div>

              <p className="dashboard-stat-label">
                Career opportunities
              </p>
              <div className="dashboard-stat-value">
                <Compass size={30} />
              </div>

              <p className="dashboard-stat-footnote">
                Discover jobs and internships
              </p>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon blue">
                  <UserRound size={20} />
                </span>
                <span className="dashboard-stat-tag">
                  Profile
                </span>
              </div>

              <p className="dashboard-stat-label">
                Career readiness
              </p>
              <div className="dashboard-stat-value">
                <Target size={30} />
              </div>

              <p className="dashboard-stat-footnote">
                Build your professional profile
              </p>
            </article>
          </section>

          <section className="dashboard-courses-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-overline">
                  START BUILDING YOUR SKILLS
                </p>
                <h2>Learning paths</h2>
              </div>

              <button
                type="button"
                className="dashboard-text-button"
                onClick={() => handleNavigation("/learn")}
              >
                View all <ArrowUpRight size={17} />
              </button>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="dashboard-courses-grid">
                {filteredCourses.map((course) => {
                  const Icon = course.icon;

                  return (
                    <article
                      className="dashboard-course-card"
                      key={course.id}
                    >
                      <div
                        className={`dashboard-course-art ${course.tone}`}
                      >
                        <div className="dashboard-course-art-grid" />

                        <div className="dashboard-course-art-icon">
                          <Icon size={30} strokeWidth={1.7} />
                        </div>

                        <span className="dashboard-course-art-label">
                          {course.category}
                        </span>
                      </div>

                      <div className="dashboard-course-body">
                        <div className="dashboard-course-meta">
                          <span>
                            <Clock3 size={14} />
                            {course.duration}
                          </span>
                          <span>Get started</span>
                        </div>

                        <h3>{course.title}</h3>

                        <p className="dashboard-course-description">
                          {course.description}
                        </p>

                        <div className="dashboard-course-progress">
                          <span
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />
                        </div>

                        <div className="dashboard-course-footer">
                          <span>{course.lessons}</span>

                          <button
                            type="button"
                            className="dashboard-course-button"
                            onClick={() =>
                              handleNavigation(course.path)
                            }
                            aria-label={`Open ${course.title}`}
                          >
                            <Play size={15} fill="currentColor" />
                            Explore
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <Search size={25} />
                <h3>No learning paths found</h3>
                <p>Try searching with another keyword.</p>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </div>
            )}
          </section>

          <section className="dashboard-courses-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-overline">
                  DISCOVER YOUR NEXT STEP
                </p>
                <h2>Explore CareerForge</h2>
              </div>
            </div>

            <div className="dashboard-courses-grid">
              {exploreItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    className="dashboard-course-card"
                    key={item.title}
                  >
                    <div
                      className={`dashboard-course-art ${item.tone}`}
                    >
                      <div className="dashboard-course-art-grid" />

                      <div className="dashboard-course-art-icon">
                        <Icon size={30} strokeWidth={1.7} />
                      </div>

                      <span className="dashboard-course-art-label">
                        CAREERFORGE
                      </span>
                    </div>

                    <div className="dashboard-course-body">
                      <h3>{item.title}</h3>

                      <p className="dashboard-course-description">
                        {item.description}
                      </p>

                      <div className="dashboard-course-footer">
                        <span>Explore feature</span>

                        <button
                          type="button"
                          className="dashboard-course-button"
                          onClick={() =>
                            handleNavigation(item.path)
                          }
                        >
                          {item.action}
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="dashboard-bottom-grid">
            <article className="dashboard-panel dashboard-activity-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <p className="dashboard-overline">
                    GETTING STARTED
                  </p>
                  <h2>Your career journey</h2>
                </div>

                <span className="dashboard-skills-symbol">
                  <Compass size={21} />
                </span>
              </div>

              <div className="dashboard-activity-list">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      className="dashboard-activity-item"
                      key={activity.title}
                    >
                      <div
                        className={`dashboard-activity-icon ${activity.tone}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="dashboard-activity-info">
                        <strong>{activity.title}</strong>
                        <span>{activity.detail}</span>
                      </div>

                      <span>{activity.time}</span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="dashboard-panel-link"
                onClick={() => handleNavigation("/learn")}
              >
                Start learning <ChevronRight size={17} />
              </button>
            </article>

            <article className="dashboard-panel dashboard-skills-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <p className="dashboard-overline">
                    YOUR PROFESSIONAL PROFILE
                  </p>
                  <h2>Skills passport</h2>
                </div>

                <span className="dashboard-skills-symbol">
                  <Trophy size={21} />
                </span>
              </div>

              <p className="dashboard-skills-description">
                Build your professional presence by showcasing your
                projects, coding practice, and learning achievements.
              </p>

              <div className="dashboard-skill-tags">
                <span>React.js</span>
                <span>JavaScript</span>
                <span>Problem solving</span>
                <span>Communication</span>
              </div>

              <div className="dashboard-skills-footer">
                <div>
                  <strong>Skills to build</strong>
                  <span>Keep learning and growing</span>
                </div>

                <button
                  type="button"
                  className="dashboard-text-button"
                  onClick={() => handleNavigation("/linkedin")}
                >
                  LinkedIn <ArrowRight size={16} />
                </button>
              </div>
            </article>
          </section>

          <footer className="dashboard-footer">
            <span>© 2026 CareerForge</span>

            <span>
              Small steps. Big futures.{" "}
              <span className="dashboard-footer-heart">♥</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
