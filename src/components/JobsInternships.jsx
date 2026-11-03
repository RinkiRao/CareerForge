
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock,
  Bookmark,
  ExternalLink,
  SlidersHorizontal,
  GraduationCap,
  Code2,
  IndianRupee,
  Building2,
  CheckCircle2,
} from "lucide-react";
import "./JobsInternships.css";

const opportunities = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Internshala Opportunities",
    location: "Remote",
    mode: "Remote",
    category: "Internship",
    duration: "3–6 months",
    pay: "Varies by company",
    skills: ["React", "JavaScript", "CSS"],
    description:
      "Explore frontend internships focused on building responsive web applications and user-friendly interfaces.",
    platform: "Internshala",
    applyUrl: "https://internshala.com/internships/",
  },
  {
    id: 2,
    title: "MERN Stack Developer",
    company: "LinkedIn Job Listings",
    location: "India",
    mode: "Hybrid",
    category: "Job",
    duration: "Full-time",
    pay: "As per company",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    description:
      "Explore developer openings involving REST APIs, database integration and full-stack web development.",
    platform: "LinkedIn",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "LinkedIn Internship Listings",
    location: "India",
    mode: "Remote",
    category: "Internship",
    duration: "3–6 months",
    pay: "Varies by company",
    skills: ["DSA", "JavaScript", "Problem Solving"],
    description:
      "Find internship opportunities to practise programming, problem-solving and software development.",
    platform: "LinkedIn",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
  {
    id: 4,
    title: "Flutter Developer",
    company: "Naukri Job Listings",
    location: "India",
    mode: "On-site",
    category: "Job",
    duration: "Full-time",
    pay: "As per company",
    skills: ["Flutter", "Dart", "REST API"],
    description:
      "Discover mobile development roles working on Flutter applications, API integration and UI implementation.",
    platform: "Naukri",
    applyUrl: "https://www.naukri.com/flutter-developer-jobs",
  },
  {
    id: 5,
    title: "Backend Developer Intern",
    company: "Internshala Opportunities",
    location: "Remote",
    mode: "Remote",
    category: "Internship",
    duration: "2–6 months",
    pay: "Varies by company",
    skills: ["Node.js", "Express", "MongoDB"],
    description:
      "Explore backend internships covering API development, database operations and server-side logic.",
    platform: "Internshala",
    applyUrl: "https://internshala.com/internships/",
  },
  {
    id: 6,
    title: "UI/UX Designer",
    company: "LinkedIn Job Listings",
    location: "India",
    mode: "Hybrid",
    category: "Job",
    duration: "Full-time",
    pay: "As per company",
    skills: ["Figma", "Wireframes", "Prototyping"],
    description:
      "Browse design roles involving user research, wireframes, prototypes and polished digital experiences.",
    platform: "LinkedIn",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
];

const readSaved = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("careerforge_saved_opportunities") || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export default function JobsInternships() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [location, setLocation] = useState("All");
  const [savedIds, setSavedIds] = useState(readSaved);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.title,
          item.company,
          item.location,
          item.category,
          item.description,
          ...item.skills,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesMode =
        workMode === "All" || item.mode === workMode;

      const matchesLocation =
        location === "All" || item.location === location;

      const matchesSaved = !showSavedOnly || savedIds.includes(item.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesLocation &&
        matchesSaved
      );
    });
  }, [search, category, workMode, location, showSavedOnly, savedIds]);

  const toggleSave = (id) => {
    setSavedIds((previous) => {
      const updated = previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id];

      localStorage.setItem(
        "careerforge_saved_opportunities",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setWorkMode("All");
    setLocation("All");
    setShowSavedOnly(false);
  };

  return (
    <div className="jobs-page">
      <header className="jobs-topbar">
        <button
          className="jobs-back-button"
          onClick={() => navigate("/linkedin")}
          aria-label="Back to CareerForge profile"
        >
          <ArrowLeft size={19} />
        </button>

        <button
          className="jobs-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="jobs-brand-icon">
            <GraduationCap size={24} />
          </span>
          <span>
            CareerForge
            <small>CAREER OPPORTUNITIES</small>
          </span>
        </button>

        <button
          className="jobs-profile-button"
          onClick={() => navigate("/linkedin")}
        >
          My Profile
        </button>
      </header>

      <main className="jobs-main">
        <section className="jobs-hero">
          <div className="jobs-hero-content">
            <span className="jobs-eyebrow">
              <BriefcaseBusiness size={15} />
              YOUR NEXT OPPORTUNITY
            </span>

            <h1>
              Find work that
              <br />
              <span>moves you forward.</span>
            </h1>

            <p>
              Explore jobs and internships, discover roles that match your
              skills, and save opportunities for later.
            </p>

            <div className="jobs-hero-stats">
              <div>
                <strong>{opportunities.length}</strong>
                <span>Sample listings</span>
              </div>
              <div>
                <strong>{savedIds.length}</strong>
                <span>Saved by you</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Opportunity types</span>
              </div>
            </div>
          </div>

          <div className="jobs-hero-art">
            <div className="jobs-art-circle">
              <BriefcaseBusiness size={68} strokeWidth={1.3} />
            </div>
            <div className="jobs-art-card jobs-art-card-one">
              <CheckCircle2 size={17} />
              <span>Build your future</span>
            </div>
            <div className="jobs-art-card jobs-art-card-two">
              <Code2 size={17} />
              <span>Grow your skills</span>
            </div>
          </div>
        </section>

        <section className="jobs-search-panel">
          <div className="jobs-search-box">
            <Search size={20} />
            <input
              type="search"
              placeholder="Search role, company or skill..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search opportunities"
            />
          </div>

          <button
            className={`jobs-saved-toggle ${showSavedOnly ? "active" : ""}`}
            onClick={() => setShowSavedOnly((value) => !value)}
          >
            <Bookmark size={17} fill={showSavedOnly ? "currentColor" : "none"} />
            Saved ({savedIds.length})
          </button>
        </section>

        <section className="jobs-content">
          <aside className="jobs-filters">
            <div className="jobs-filter-heading">
              <SlidersHorizontal size={18} />
              <h2>Filters</h2>
            </div>

            <div className="jobs-filter-group">
              <label htmlFor="job-category">Opportunity type</label>
              <select
                id="job-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="All">All opportunities</option>
                <option value="Job">Full-time jobs</option>
                <option value="Internship">Internships</option>
              </select>
            </div>

            <div className="jobs-filter-group">
              <label htmlFor="job-mode">Work mode</label>
              <select
                id="job-mode"
                value={workMode}
                onChange={(event) => setWorkMode(event.target.value)}
              >
                <option value="All">All work modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="jobs-filter-group">
              <label htmlFor="job-location">Location</label>
              <select
                id="job-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              >
                <option value="All">All locations</option>
                <option value="India">India</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <button className="jobs-reset-button" onClick={resetFilters}>
              Reset filters
            </button>

            <div className="jobs-filter-note">
              <GraduationCap size={21} />
              <p>
                Keep learning and building projects to strengthen your
                applications.
              </p>
            </div>
          </aside>

          <div className="jobs-results">
            <div className="jobs-results-heading">
              <div>
                <span className="jobs-section-kicker">CAREER DISCOVERY</span>
                <h2>
                  {showSavedOnly ? "Your saved opportunities" : "Explore opportunities"}
                </h2>
                <p>
                  {filteredOpportunities.length} result
                  {filteredOpportunities.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="jobs-demo-notice">
              <span>i</span>
              <p>
                Demo listings for exploring the page. These are not verified
                vacancies; use the external job site to find current openings.
              </p>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="jobs-list">
                {filteredOpportunities.map((item) => {
                  const isSaved = savedIds.includes(item.id);

                  return (
                    <article className="job-card" key={item.id}>
                      <div className="job-card-top">
                        <div className="job-company-icon">
                          <Building2 size={24} />
                        </div>

                        <div className="job-title-area">
                          <span className="job-category-tag">
                            {item.category}
                          </span>
                          <h3>{item.title}</h3>
                          <p className="job-company">{item.company}</p>
                        </div>

                        <button
                          className={`job-bookmark ${isSaved ? "saved" : ""}`}
                          onClick={() => toggleSave(item.id)}
                          aria-label={isSaved ? "Remove saved opportunity" : "Save opportunity"}
                          title={isSaved ? "Remove from saved" : "Save for later"}
                        >
                          <Bookmark
                            size={20}
                            fill={isSaved ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      <p className="job-description">{item.description}</p>

                      <div className="job-meta">
                        <span>
                          <MapPin size={15} />
                          {item.location}
                        </span>
                        <span>
                          <Clock size={15} />
                          {item.duration}
                        </span>
                        <span>
                          <IndianRupee size={15} />
                          {item.pay}
                        </span>
                      </div>

                      <div className="job-skills">
                        {item.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>

                      <div className="job-card-bottom">
                        <span className="job-mode-label">{item.mode}</span>
                        <button
                          className="job-apply-button"
                          onClick={() => window.open(item.applyUrl, "_blank", "noopener,noreferrer")}
                        >
                          Explore on {item.platform}
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="jobs-empty-state">
                <div>
                  <Search size={30} />
                </div>
                <h3>No opportunities found</h3>
                <p>
                  Try changing your search or removing one of the filters.
                </p>
                <button onClick={resetFilters}>Clear filters</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="jobs-footer">
        <span>CareerForge</span>
        <p>Learn. Build. Apply. Grow.</p>
      </footer>
    </div>
  );
}
