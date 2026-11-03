import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Search,
  ExternalLink,
  Trophy,
  Globe,
  Terminal,
  Target,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import "./LeetCode.css";

const platforms = [
  {
    id: 1,
    name: "LeetCode",
    logo: "LC",
    logoUrl: "https://cdn.simpleicons.org/leetcode/F89F1B",
    color: "orange",
    category: "Interview Preparation",
    description:
      "Practice coding problems, improve data structures and algorithms, and prepare for technical interviews.",
    skills: ["DSA", "Algorithms", "Problem Solving"],
    level: "Beginner to Advanced",
    website: "https://leetcode.com/",
    featured: true,
  },
  {
    id: 2,
    name: "HackerRank",
    logo: "HR",
    logoUrl: "https://cdn.simpleicons.org/hackerrank/00EA64",
    color: "green",
    category: "Skill Assessment",
    description:
      "Develop programming skills through practice challenges, certifications, and technical assessments.",
    skills: ["Java", "Python", "SQL", "Problem Solving"],
    level: "Beginner to Advanced",
    website: "https://www.hackerrank.com/",
    featured: true,
  },
  {
    id: 3,
    name: "CodeChef",
    logo: "CC",
    logoUrl: "https://cdn.simpleicons.org/codechef/5B4638",
    color: "brown",
    category: "Competitive Programming",
    description:
      "Improve your competitive programming skills through coding contests, practice problems, and learning resources.",
    skills: ["DSA", "Algorithms", "Contests"],
    level: "Beginner to Advanced",
    website: "https://www.codechef.com/",
  },
  {
    id: 4,
    name: "Codeforces",
    logo: "CF",
    logoUrl: "https://cdn.simpleicons.org/codeforces/1F8ACB",
    color: "blue",
    category: "Competitive Programming",
    description:
      "Participate in programming contests and solve algorithmic problems with a global coding community.",
    skills: ["Algorithms", "Contests", "Problem Solving"],
    level: "Intermediate to Advanced",
    website: "https://codeforces.com/",
  },
  {
    id: 5,
    name: "GeeksforGeeks",
    logo: "GFG",
    logoUrl: "https://cdn.simpleicons.org/geeksforgeeks/2F8D46",
    color: "darkgreen",
    category: "Learning & Practice",
    description:
      "Explore computer science tutorials, interview preparation material, coding problems, and courses.",
    skills: ["DSA", "Computer Science", "Interview Prep"],
    level: "Beginner to Advanced",
    website: "https://www.geeksforgeeks.org/",
    featured: true,
  },
  {
    id: 6,
    name: "HackerEarth",
    logo: "HE",
    logoUrl: "https://cdn.simpleicons.org/hackerearth/2C3454",
    color: "purple",
    category: "Skill Assessment",
    description:
      "Practice programming challenges and explore coding competitions and technical assessment resources.",
    skills: ["Coding", "Algorithms", "Challenges"],
    level: "Beginner to Advanced",
    website: "https://www.hackerearth.com/",
  },
  {
    id: 7,
    name: "AtCoder",
    logo: "AC",
    logoUrl: "https://www.google.com/s2/favicons?domain=atcoder.jp&sz=128",
    color: "red",
    category: "Competitive Programming",
    description:
      "Build algorithmic problem-solving ability through regular programming contests and practice tasks.",
    skills: ["Algorithms", "Mathematics", "Contests"],
    level: "Beginner to Advanced",
    website: "https://atcoder.jp/",
  },
  {
    id: 8,
    name: "Topcoder",
    logo: "TC",
    logoUrl: "https://cdn.simpleicons.org/topcoder/29A8E0",
    color: "navy",
    category: "Competitive Programming",
    description:
      "Explore competitive programming challenges, algorithm competitions, and community coding events.",
    skills: ["Algorithms", "Development", "Challenges"],
    level: "Intermediate to Advanced",
    website: "https://www.topcoder.com/",
  },
];

const categories = [
  "All Platforms",
  "Interview Preparation",
  "Competitive Programming",
  "Skill Assessment",
  "Learning & Practice",
];

/* =========================================
   PLATFORM LOGO COMPONENT
========================================= */

function PlatformLogo({ platform }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`lc-platform-logo ${platform.color}`}>
      {!imageFailed ? (
        <img
          src={platform.logoUrl}
          alt={`${platform.name} logo`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{platform.logo}</span>
      )}
    </div>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

export default function LeetCode() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Platforms");

  const filteredPlatforms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return platforms.filter((platform) => {
      const matchesSearch =
        !query ||
        [
          platform.name,
          platform.category,
          platform.description,
          platform.level,
          ...platform.skills,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        activeCategory === "All Platforms" ||
        platform.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const openPlatform = (website) => {
    window.open(website, "_blank", "noopener,noreferrer");
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Platforms");
  };

  return (
    <div className="lc-page">
      {/* HEADER */}
      <header className="lc-header">
        <button
          className="lc-back"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={19} />
        </button>

        <button
          className="lc-brand"
          onClick={() => navigate("/dashboard")}
        >
          <span className="lc-brand-icon">
            <Code2 size={23} />
          </span>

          <span>
            CareerForge
            <small>CODING PLATFORMS</small>
          </span>
        </button>

        <div className="lc-header-right">
          <span className="lc-header-label">
            <Trophy size={16} />
            Practice &amp; Grow
          </span>

          <button
            className="lc-exit"
            onClick={() => navigate("/jobs")}
          >
            Explore Jobs
          </button>
        </div>
      </header>

      <main className="lc-main">
        {/* HERO */}
        <section className="lc-hero">
          <div className="lc-hero-content">
            <span className="lc-eyebrow">
              <Terminal size={15} />
              YOUR CODING JOURNEY STARTS HERE
            </span>

            <h1>
              Code. Compete.
              <br />
              <span>Grow Together.</span>
            </h1>

            <p>
              Discover popular coding platforms, practise programming,
              participate in competitions, and prepare for technical
              interviews.
            </p>

            <button
              className="lc-hero-button"
              onClick={() =>
                document
                  .getElementById("lc-platform-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore platforms
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="lc-hero-art">
            <div className="lc-art-circle">
              <Code2 size={75} strokeWidth={1.4} />
            </div>

            <div className="lc-floating-card lc-floating-one">
              <Trophy size={17} />
              <span>Coding Contests</span>
            </div>

            <div className="lc-floating-card lc-floating-two">
              <Target size={17} />
              <span>DSA Practice</span>
            </div>

            <span className="lc-art-dot dot-one" />
            <span className="lc-art-dot dot-two" />
          </div>
        </section>

        {/* STATS */}
        <section className="lc-stats">
          <div className="lc-stat-card">
            <span className="lc-stat-icon">
              <Globe size={21} />
            </span>

            <div>
              <strong>{platforms.length}</strong>
              <span>Coding platforms</span>
            </div>
          </div>

          <div className="lc-stat-card">
            <span className="lc-stat-icon yellow">
              <Trophy size={21} />
            </span>

            <div>
              <strong>Global</strong>
              <span>Competitive community</span>
            </div>
          </div>

          <div className="lc-stat-card">
            <span className="lc-stat-icon green">
              <GraduationCap size={21} />
            </span>

            <div>
              <strong>Multiple</strong>
              <span>Learning opportunities</span>
            </div>
          </div>
        </section>

        {/* PLATFORM SECTION */}
        <section
          className="lc-platform-section"
          id="lc-platform-section"
        >
          <div className="lc-section-heading">
            <div>
              <span className="lc-section-kicker">
                <Sparkles size={14} />
                EXPLORE &amp; LEARN
              </span>

              <h2>Popular Coding Platforms</h2>

              <p>
                Choose a platform that matches your learning and coding goals.
              </p>
            </div>

            <span className="lc-platform-count">
              {filteredPlatforms.length} Platforms
            </span>
          </div>

          {/* SEARCH */}
          <div className="lc-toolbar">
            <div className="lc-search">
              <Search size={19} />

              <input
                type="search"
                placeholder="Search platforms, skills or topics..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search coding platforms"
              />
            </div>

            <div className="lc-filter-label">
              <Filter size={17} />
              Filter platforms
            </div>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="lc-category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "lc-category active"
                    : "lc-category"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* PLATFORM CARDS */}
          <div className="lc-platform-grid">
            {filteredPlatforms.map((platform) => (
              <article
                className="lc-platform-card"
                key={platform.id}
              >
                <div className="lc-platform-card-top">
                  <PlatformLogo platform={platform} />

                  {platform.featured && (
                    <span className="lc-featured-tag">
                      <Sparkles size={12} />
                      Popular
                    </span>
                  )}
                </div>

                <div className="lc-platform-info">
                  <span className="lc-platform-category">
                    {platform.category}
                  </span>

                  <h3>{platform.name}</h3>

                  <p>{platform.description}</p>
                </div>

                <div className="lc-platform-level">
                  <GraduationCap size={15} />
                  <span>{platform.level}</span>
                </div>

                <div className="lc-platform-skills">
                  {platform.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <button
                  className="lc-platform-button"
                  onClick={() => openPlatform(platform.website)}
                >
                  Visit Platform
                  <ExternalLink size={16} />
                </button>
              </article>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredPlatforms.length === 0 && (
            <div className="lc-empty-state">
              <Search size={35} />

              <h3>No platforms found</h3>

              <p>
                Try another search term or choose a different category.
              </p>

              <button onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* BOTTOM INFORMATION */}
        <section className="lc-bottom-banner">
          <div className="lc-bottom-icon">
            <GraduationCap size={29} />
          </div>

          <div className="lc-bottom-copy">
            <h3>Keep learning. Keep building.</h3>

            <p>
              Regular coding practice can help strengthen your problem-solving
              skills and prepare you for technical interviews.
            </p>
          </div>

          <button onClick={() => navigate("/learn")}>
            Explore Courses
            <ArrowUpRight size={16} />
          </button>
        </section>
      </main>

      <footer className="lc-footer">
        <strong>CareerForge</strong>
        <span>Learn. Practise. Compete. Grow.</span>
      </footer>
    </div>
  );
}