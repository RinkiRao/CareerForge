import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import "./Landing.css";

function Landing() {
  return (
    <main className="landing-page">
      <nav className="landing-navbar">
        <Link to="/" className="landing-logo">
          <Sparkles size={23} />
          CareerForge <span>AI</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="landing-nav-button">
            Get Started <ArrowRight size={17} />
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-badge">
            <Sparkles size={15} />
            YOUR CAREER, REIMAGINED WITH AI
          </span>

          <h1>
            Build Skills.
            <br />
            Find Opportunities.
            <br />
            <span>Shape Your Future.</span>
          </h1>

          <p>
            CareerForge AI brings learning, interview preparation,
            internships and career opportunities together on one
            global platform.
          </p>

          <div className="landing-hero-actions">
            <Link to="/register" className="landing-primary-button">
              Start Your Journey <ArrowRight size={19} />
            </Link>

            <a href="#features" className="landing-secondary-button">
              Explore Platform
            </a>
          </div>

          <div className="landing-trust">
            <span><ShieldCheck size={17} /> Student focused</span>
            <span><BrainCircuit size={17} /> AI powered</span>
            <span><TrendingUp size={17} /> Career growth</span>
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="landing-preview-card">
            <div className="preview-top">
              <div>
                <span className="preview-label">YOUR CAREER OVERVIEW</span>
                <h3>Ready to grow?</h3>
              </div>
              <span className="preview-icon">
                <Rocket size={23} />
              </span>
            </div>

            <div className="preview-progress">
              <div className="preview-progress-heading">
                <span>Career readiness</span>
                <strong>78%</strong>
              </div>
              <div className="preview-progress-track">
                <div />
              </div>
            </div>

            <div className="preview-stats">
              <div>
                <Code2 size={20} />
                <strong>Skills</strong>
                <span>Build expertise</span>
              </div>
              <div>
                <Target size={20} />
                <strong>Practice</strong>
                <span>Track progress</span>
              </div>
              <div>
                <BriefcaseBusiness size={20} />
                <strong>Careers</strong>
                <span>Explore jobs</span>
              </div>
            </div>

            <div className="preview-bottom">
              <Sparkles size={18} />
              <span>Your next opportunity starts with one step.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-heading">
          <span>ONE PLATFORM, MANY POSSIBILITIES</span>
          <h2>Everything you need to move forward</h2>
          <p>
            Learn, practice, showcase your work and connect with
            opportunities.
          </p>
        </div>

        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <div><GraduationCap size={27} /></div>
            <h3>Learn & Grow</h3>
            <p>
              Discover learning resources and develop skills for your
              career goals.
            </p>
          </article>

          <article className="landing-feature-card">
            <div><BrainCircuit size={27} /></div>
            <h3>AI Interview Prep</h3>
            <p>
              Practice interviews, assess your answers and identify
              areas to improve.
            </p>
          </article>

          <article className="landing-feature-card">
            <div><Code2 size={27} /></div>
            <h3>Developer Practice</h3>
            <p>
              Improve coding skills and build a stronger technical
              profile.
            </p>
          </article>

          <article className="landing-feature-card">
            <div><BriefcaseBusiness size={27} /></div>
            <h3>Jobs & Internships</h3>
            <p>
              Explore career opportunities and connect with companies
              worldwide.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-about" id="about">
        <div>
          <span>ABOUT CAREERFORGE </span>
          <h2>Your career journey, connected in one place.</h2>
        </div>

        <p>
          Whether you are a student preparing for placements or a
          company looking for talent, CareerForge helps bring
          learning and opportunities closer together.
        </p>

        <Link to="/register" className="landing-about-link">
          Join CareerForge <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-logo">
          <Sparkles size={20} />
          CareerForge <span>AI</span>
        </Link>
        <p>© 2026 CareerForge AI. Build your future.</p>
      </footer>
    </main>
  );
}

export default Landing;