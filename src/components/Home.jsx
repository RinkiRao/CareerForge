import React from "react";
import { Link } from "react-router-dom";

import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  Trophy,
  Users,
  Gem,
  Target,
  Eye,
  FolderOpen,
  BrainCircuit,
  Globe2,
  Rocket,
} from "lucide-react";

import "./Home.css";

// CAREERFORGE FEATURES
const features = [
  {
    title: "Learning & Courses",
    description: "Learn new skills and technologies.",
    icon: GraduationCap,
    className: "blue",
    path: "/learn",
  },
  {
    title: "AI Career Assistant",
    description: "Get guidance for your career journey.",
    icon: BrainCircuit,
    className: "purple",
    path: "/learn",
  },
  {
    title: "Coding & DSA Practice",
    description: "Improve your coding and problem-solving.",
    icon: Code2,
    className: "cyan",
    path: "/leetcode",
  },
  {
    title: "Build Your Portfolio",
    description: "Showcase your projects and skills.",
    icon: FolderOpen,
    className: "cyan",
    path: "/github",
  },
  {
    title: "Jobs & Internships",
    description: "Explore career opportunities.",
    icon: BriefcaseBusiness,
    className: "yellow",
    path: "/jobs",
  },
  {
    title: "Global Opportunities",
    description: "Connect with a global career community.",
    icon: Globe2,
    className: "cyan",
    path: "/linkedin",
  },
];

function Home() {
  return (
    <main className="home-page">

      {/* NAVBAR */}
      <header className="home-navbar">

        {/* CAREERFORGE LOGO */}
        <Link to="/" className="home-logo">
          <Sparkles className="logo-sparkle" size={34} />

          <span>
            Career<span>Forge</span>
          </span>
        </Link>

        {/* ABOUT AND REGISTRATION */}
        <nav className="home-nav-links">

          <Link to="/about" className="nav-about">
            About
          </Link>

          <Link to="/register" className="nav-register">
            Registration
          </Link>

        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="home-hero" id="about">

        {/* LEFT CONTENT */}
        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={18} />

            <span>
              ABOUT CAREER<span>FORGE</span>
            </span>
          </div>

          <h1>
            Your Career Journey,
            <br />
            <span>Connected</span> in One Place.
          </h1>

          <p className="hero-description">
            CareerForge is a global AI-powered platform designed to help
            students, professionals and companies learn, grow and connect
            with the right opportunities.
          </p>

          {/* HERO BUTTONS */}
          <div className="hero-actions">

            <a href="#features" className="primary-button">
              Explore Features
              <ArrowRight size={19} />
            </a>

            <Link to="/linkedin" className="secondary-button">
              <Users size={19} />
              Join Our Community
            </Link>

          </div>
        </div>

        {/* RIGHT SIDE HERO VISUAL */}
        <div className="hero-visual">

          <div className="visual-stars"></div>

          {/* SAME BOY AND GLOBE IMAGE */}
          <div className="hero-artwork">
            <img
              src="/careerforge-hero-boy.png"
              alt="CareerForge student working on a laptop in front of a glowing global globe"
            />
          </div>

          {/* CLICKABLE LEARNING BOX */}
          <Link
            to="/learn"
            className="floating-feature floating-learn"
          >
            <GraduationCap />

            <span>
              Learn
              <br />
              New Skills
            </span>
          </Link>

          {/* CLICKABLE JOBS BOX */}
          <Link
            to="/jobs"
            className="floating-feature floating-jobs"
          >
            <BriefcaseBusiness />

            <span>
              Find Jobs &
              <br />
              Internships
            </span>
          </Link>

          {/* CLICKABLE CODING BOX */}
          <Link
            to="/leetcode"
            className="floating-feature floating-code"
          >
            <Code2 />

            <span>
              Practice
              <br />
              Coding
            </span>
          </Link>

          {/* CLICKABLE PROJECTS BOX */}
          <Link
            to="/github"
            className="floating-feature floating-projects"
          >
            <Trophy />

            <span>
              Build
              <br />
              Projects
            </span>
          </Link>

        </div>
      </section>

      {/* INFORMATION CARDS */}
      <section className="home-information">

        {/* WHAT IS CAREERFORGE */}
        <Link
          to="/register"
          className="info-card what-card"
        >

          <div className="info-heading">
            <Sparkles />
            <h2>What is CareerForge?</h2>
          </div>

          <p>
            CareerForge is an all-in-one platform that combines learning,
            coding practice, AI career assistance, project building and
            job opportunities. It bridges the gap between education and
            employment, empowering you to achieve your dreams.
          </p>

          <div className="info-highlight">
            <Rocket size={29} />

            <span>
              Learn. Practice. Build. Get Hired.
            </span>
          </div>

        </Link>

        {/* KEY FEATURES */}
        <section
          className="info-card features-card"
          id="features"
        >

          <div className="info-heading">
            <Gem />
            <h2>Our Key Features</h2>
          </div>

          <div className="feature-grid">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <Link
                  to={feature.path}
                  className="feature-item"
                  key={feature.title}
                >

                  <Icon
                    className={`feature-icon ${feature.className}`}
                  />

                  <h3>
                    {feature.title}
                  </h3>

                  <span className="feature-description">
                    {feature.description}
                  </span>

                </Link>
              );
            })}

          </div>
        </section>

        {/* MISSION AND VISION */}
        <div className="mission-column">

          {/* OUR MISSION */}
          <a
            href="#mission"
            className="info-card mission-card"
            id="mission"
          >

            <div className="info-heading">
              <Target />
              <h2>Our Mission</h2>
            </div>

            <p>
              To make quality education, skill development and career
              opportunities accessible to every learner, everywhere.
            </p>

            <Rocket className="mission-decoration" />

          </a>

          {/* OUR VISION */}
          <a
            href="#vision"
            className="info-card vision-card"
            id="vision"
          >

            <div className="info-heading">
              <Eye />
              <h2>Our Vision</h2>
            </div>

            <p>
              A globally connected platform where talent meets opportunity
              and everyone builds a successful career.
            </p>

            <Trophy className="vision-decoration" />

          </a>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="home-cta">

        <div className="cta-trophy">
          <Trophy size={70} />
          <Sparkles size={22} />
        </div>

        <div className="cta-content">

          <h2>
            Be a Part of <span>CareerForge</span>
          </h2>

          <p>
            Join our growing community and take the first step towards
            a brighter future.
          </p>

        </div>

        <Link
          to="/register"
          className="cta-button"
        >
          Get Started
          <ArrowRight size={20} />
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="home-footer">

        <p>
          © {new Date().getFullYear()} CareerForge.
          Learn. Practice. Build.
        </p>

      </footer>

    </main>
  );
}

export default Home;