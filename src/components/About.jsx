import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Sparkles,
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  Users,
  FileText,
  Code2,
  Handshake,
  Target,
  Eye,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  Globe2,
  BookOpen,
  TrendingUp,
  Award,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

import "./About.css";

const opportunities = [
  {
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700",
    icon: BriefcaseBusiness,
    title: "Placement Opportunities",
    description: "Explore job openings and career opportunities.",
    path: "/jobs",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700",
    icon: GraduationCap,
    title: "Internships",
    description: "Gain practical knowledge and industry experience.",
    path: "/jobs",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700",
    icon: Building2,
    title: "Company Connections",
    description: "Discover organizations and hiring opportunities.",
    path: "/companies",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700",
    icon: Code2,
    title: "Career Resources",
    description: "Develop technical skills and prepare for interviews.",
    path: "/learn",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Transparency",
    description: "Clear and accessible career information.",
  },
  {
    icon: Users,
    title: "Student First",
    description: "Designed around student growth and needs.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Technology-enabled career development.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Encouraging continuous learning and improvement.",
  },
];

function About() {
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = (event) => {
    event.preventDefault();
    setContactMessage(
      "Contact form design is ready. Message submission will be enabled after backend integration."
    );
  };

  return (
    <main className="career-about">

      {/* NAVBAR */}
      <header className="career-about-navbar">

        <Link to="/" className="career-about-logo">
          <Sparkles size={32} />
          <span>
            Career<span>Forge</span>
          </span>
        </Link>

        <nav className="career-about-nav">
          <Link to="/" className="about-nav-link">Home</Link>
          <Link to="/jobs" className="about-nav-link">Jobs</Link>
          <Link to="/jobs" className="about-nav-link">Internships</Link>
          <Link to="/companies" className="about-nav-link">Companies</Link>
          <Link to="/learn" className="about-nav-link">Resources</Link>
          <Link to="/about" className="about-nav-link about-nav-active">
            About
          </Link>
          <a href="#contact" className="about-nav-link">Contact</a>

          <Link to="/register" className="about-nav-register">
            Login / Sign Up
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="career-about-hero">

        <div className="career-about-hero-content">

          <span className="career-about-eyebrow">
            <Sparkles size={16} />
            ABOUT CAREERFORGE
          </span>

          <h1>
            About <span>Us</span>
          </h1>

          <h3>Connecting Students with Opportunities</h3>

          <p>
            CareerForge is a career development and placement platform
            designed to connect talented students with learning resources,
            internships and employment opportunities.
          </p>

          <p>
            Our goal is to support your career journey with the right
            skills, guidance and professional connections.
          </p>

          <div className="career-about-hero-actions">
            <Link to="/jobs" className="career-yellow-button">
              Explore Opportunities
              <ArrowRight size={18} />
            </Link>

            <Link to="/register" className="career-blue-button">
              Join CareerForge
            </Link>
          </div>

        </div>

        <div className="career-about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200"
            alt="Students collaborating on a laptop at university"
          />
        </div>

      </section>

      {/* PLATFORM HIGHLIGHTS */}
      <section className="career-about-highlights">

        <Link to="/jobs" className="career-stat-card">
          <BriefcaseBusiness />
          <div>
            <h3>Job Opportunities</h3>
            <p>Explore career openings</p>
          </div>
        </Link>

        <Link to="/jobs" className="career-stat-card">
          <GraduationCap />
          <div>
            <h3>Internships</h3>
            <p>Discover practical experience</p>
          </div>
        </Link>

        <Link to="/companies" className="career-stat-card">
          <Building2 />
          <div>
            <h3>Companies</h3>
            <p>Discover organizations</p>
          </div>
        </Link>

        <Link to="/linkedin" className="career-stat-card">
          <Users />
          <div>
            <h3>Student Community</h3>
            <p>Build professional connections</p>
          </div>
        </Link>

      </section>

      {/* WHO WE ARE */}
      <section className="career-about-intro">

        <div className="career-about-intro-content">

          <span className="career-about-section-tag">
            WHO WE ARE
          </span>

          <h2>
            About <span>CareerForge</span>
          </h2>

          <p>
            We are building a connected platform for students, learners
            and companies. CareerForge brings together career discovery,
            learning resources, skill development and professional
            opportunities.
          </p>

          <p>
            Our aim is to make the journey from education to employment
            more organized, accessible and practical.
          </p>

          <div className="career-about-check-list">

            <div>
              <CheckCircle2 />
              <span>Explore jobs and placement opportunities</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Discover internships and industry exposure</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Build technical skills and project portfolios</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Connect with companies and professionals</span>
            </div>

          </div>

          <Link to="/jobs" className="career-explore-link">
            Explore Opportunities <ArrowRight size={17} />
          </Link>

        </div>

        <div className="career-about-campus-image">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1100"
            alt="University campus building"
          />
        </div>

      </section>

      {/* MISSION VISION VALUES */}
      <section className="career-about-mvv">

        <div className="career-mvv-card">
          <Target />
          <h3>Our Mission</h3>
          <p>
            To empower students with accessible learning, practical
            skills and relevant career opportunities.
          </p>
        </div>

        <div className="career-mvv-card">
          <Eye />
          <h3>Our Vision</h3>
          <p>
            To become a connected career platform where talent meets
            opportunity and individuals grow professionally.
          </p>
        </div>

        <div className="career-mvv-card">
          <Award />
          <h3>Our Values</h3>
          <ul>
            <li>Transparency</li>
            <li>Student First</li>
            <li>Innovation</li>
            <li>Growth</li>
          </ul>
        </div>

      </section>

      {/* WHAT WE OFFER */}
      <section className="career-about-offers">

        <div className="career-about-heading">
          <span className="career-about-section-tag">WHAT WE OFFER</span>
          <h2>
            Opportunities for <span>Your Future</span>
          </h2>
          <p>
            Explore the resources and connections designed to support
            your career development.
          </p>
        </div>

        <div className="career-about-offer-grid">

          {opportunities.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                to={item.path}
                className="career-offer-card"
                key={item.title}
              >

                <div className="career-offer-image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="career-offer-icon">
                  <Icon size={22} />
                </div>

                <div className="career-offer-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <span>
                    Explore More <ArrowRight size={15} />
                  </span>
                </div>

              </Link>
            );
          })}

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="career-about-why">

        <div className="career-about-why-content">

          <span className="career-about-section-tag">
            WHY CHOOSE US?
          </span>

          <h2>
            Your Career,
            <span> Our Priority.</span>
          </h2>

          <div className="career-about-why-list">

            <div>
              <CheckCircle2 />
              <span>Easy-to-explore career resources</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Job and internship discovery</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Technical learning and coding practice</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Project and portfolio showcasing</span>
            </div>

            <div>
              <CheckCircle2 />
              <span>Professional networking opportunities</span>
            </div>

          </div>

        </div>

        <div className="career-about-why-image">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000"
            alt="Laptop and workspace for career development"
          />

          <div className="career-why-quote">
            “Your Career, Our Priority”
          </div>
        </div>

      </section>

      {/* VALUES */}
      <section className="career-about-values">

        <div className="career-about-heading">
          <span className="career-about-section-tag">OUR VALUES</span>
          <h2>
            What Guides <span>CareerForge?</span>
          </h2>
        </div>

        <div className="career-values-grid">

          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div className="career-value-card" key={value.title}>
                <Icon />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            );
          })}

        </div>

      </section>

      {/* GET IN TOUCH */}
      <section className="career-about-contact" id="contact">

        <div className="career-contact-information">

          <span className="career-about-section-tag">
            CONTACT US
          </span>

          <h2>Get In Touch</h2>

          <p>
            Have questions or suggestions? Send us a message.
            We would love to hear from you.
          </p>

          <div className="career-contact-detail">
            <Mail />
            <span>Contact email will be added here</span>
          </div>

          <div className="career-contact-detail">
            <Globe2 />
            <span>CareerForge – Global Career Platform</span>
          </div>

        </div>

        <form
          className="career-contact-form"
          onSubmit={handleContactSubmit}
        >

          <div className="career-contact-form-row">
            <input
              type="text"
              placeholder="Your Name"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            required
          />

          <textarea
            placeholder="Your Message"
            rows="4"
            required
          />

          <button type="submit">
            Send Message <Send size={16} />
          </button>

          {contactMessage && (
            <p className="career-contact-notice">
              {contactMessage}
            </p>
          )}

        </form>

      </section>

      {/* FOOTER */}
      <footer className="career-about-footer">

        <div className="career-footer-main">

          <Link to="/" className="career-about-logo">
            <Sparkles size={30} />
            <span>
              Career<span>Forge</span>
            </span>
          </Link>

          <div className="career-footer-links">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/jobs">Internships</Link>
            <Link to="/about">About</Link>
            <Link to="/learn">Resources</Link>
          </div>

        </div>

        <div className="career-footer-bottom">
          © {new Date().getFullYear()} CareerForge. Learn. Practice. Build.
        </div>

      </footer>

    </main>
  );
}

export default About;