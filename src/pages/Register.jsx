import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import "./Register.css";

const registrationOptions = [
  {
    title: "Student",
    subtitle: "For students and job seekers",
    description:
      "Explore internships, learn new skills, build projects and prepare for placements.",
    icon: GraduationCap,
    path: "/register/student",
    button: "Register as Student",
  },
  {
    title: "Company",
    subtitle: "For companies and recruiters",
    description:
      "Publish internships, discover talented candidates and manage applications.",
    icon: Building2,
    path: "/register/company",
    button: "Register as Company",
  },
  {
    title: "Owner",
    subtitle: "For authorized administrators",
    description:
      "Manage users, verify companies and monitor platform activities.",
    icon: ShieldCheck,
    path: "/admin/register",
    button: "Register as Owner",
  },
];

function Register() {
  return (
    <main className="register-page">

      {/* NAVBAR */}
      <header className="register-navbar">
        <Link to="/" className="register-logo">
          <span className="register-logo-icon">
            <Sparkles size={21} />
          </span>

          CareerForge <span>AI</span>
        </Link>

        <Link to="/" className="register-back-link">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </header>

      {/* REGISTRATION SECTION */}
      <section className="register-container">

        {/* HEADING */}
        <div className="register-heading">
          <span className="register-tag">
            <Sparkles size={15} />
            YOUR FUTURE STARTS HERE
          </span>

          <h1>
            Join <span>CareerForge AI</span>
          </h1>

          <p>
            Choose your account type and become part of our global
            career development platform.
          </p>
        </div>

        {/* REGISTRATION CARDS */}
        <div className="register-options">

          {registrationOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                className="register-card"
                key={option.title}
              >
                <div className="register-card-icon">
                  <Icon size={30} />
                </div>

                <span className="register-card-subtitle">
                  {option.subtitle}
                </span>

                <h2>{option.title}</h2>

                <p>{option.description}</p>

                <Link
                  to={option.path}
                  className="register-card-button"
                >
                  {option.button}
                  <ArrowRight size={18} />
                </Link>
              </article>
            );
          })}

        </div>

        {/* FOOTER */}
        <div className="register-footer">
          <p>
            Already have an account?
            <Link to="/login"> Login here</Link>
          </p>

          <span>
            Admin registration is restricted to authorized access.
          </span>
        </div>

      </section>
    </main>
  );
}

export default Register;