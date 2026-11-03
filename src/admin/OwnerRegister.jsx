
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../utils/i18n";
import "./OwnerRegister.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  countryCode: "+91",
  language: "English",
  setupCode: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const languageCodes = {
  English: "en",
  Hindi: "hi",
  Spanish: "es",
  French: "fr",
  German: "de",
  Arabic: "ar",
  Other: "en",
};

export default function OwnerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState("register");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  // Input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "language") {
      const selectedLanguage = languageCodes[value] || "en";

      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem("careerforge_language", selectedLanguage);
    }

    setMessage("");
  };

  // Switch between registration and login
  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // OTP notice
  const handleVerificationNotice = (type) => {
    if (type === "Email" && !form.email.trim()) {
      showMessage("Please enter your official email first.", "error");
      return;
    }

    if (type === "Mobile" && !form.phone.trim()) {
      showMessage("Please enter your mobile number first.", "error");
      return;
    }

    showMessage(
      `${type} OTP verification is not connected yet. Please use the authorized owner setup code.`,
      "info"
    );
  };

  // ==========================================
  // OWNER REGISTRATION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!form.fullName.trim()) {
      showMessage("Please enter your full name.", "error");
      return;
    }

    if (!form.email.trim()) {
      showMessage("Please enter your official email address.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!form.phone.trim()) {
      showMessage("Please enter your mobile number.", "error");
      return;
    }

    if (!form.setupCode.trim()) {
      showMessage("Please enter your secure setup code.", "error");
      return;
    }

    if (form.password.length < 8 || form.password.length > 72) {
      showMessage(
        "Password must contain between 8 and 72 characters.",
        "error"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    if (!form.terms) {
      showMessage("Please accept the security agreement.", "error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/owner-auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: `${form.countryCode} ${form.phone.trim()}`,
            language: form.language,
            setupCode: form.setupCode.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Owner registration failed."
        );
      }

      // Do not save the registration token.
      // Authentication happens only after login.

      // Keep email and password for the login form.
      setForm((previous) => ({
        ...initialForm,
        email: previous.email.trim().toLowerCase(),
        password: previous.password,
        language: previous.language,
      }));

      setShowPassword(false);
      setShowConfirmPassword(false);

      setMode("login");

      showMessage(
        data.message || "Owner account created successfully! Please login.",
        "success"
      );
    } catch (error) {
      console.error("Owner registration error:", error);

      showMessage(
        error.message || "Unable to connect to CareerForge backend.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // OWNER LOGIN
  // ==========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!form.email.trim() || !form.password) {
      showMessage("Please enter your email and password.", "error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/owner-auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Owner login failed.");
      }

      if (!data.token) {
        throw new Error(
          "Authentication token was not received from the server."
        );
      }

      // Save token only after successful login.
      localStorage.setItem(
        "careerforge_owner_token",
        data.token
      );

      const owner = data.owner || data.user;

      if (owner) {
        localStorage.setItem(
          "careerforge_owner_profile",
          JSON.stringify(owner)
        );
      }

      // Open the Owner Dashboard.
      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Owner login error:", error);

      showMessage(
        error.message || "Unable to connect to CareerForge backend.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="owner-register-page">

      {/* NAVBAR */}
      <nav className="owner-navbar">
        <Link to="/" className="owner-brand">
          <span className="owner-brand-icon">CF</span>
          <span>CareerForge</span>
        </Link>

        <Link to="/register" className="owner-back-link">
          Back to Register
        </Link>
      </nav>

      <div className="owner-layout">

        {/* LEFT SIDEBAR */}
        <aside className="owner-sidebar">
          <div className="owner-sidebar-content">

            <span className="owner-eyebrow">
              PLATFORM OWNER
            </span>

            <h1>
              Lead your
              <span> CareerForge platform.</span>
            </h1>

            <p>
              Securely manage the CareerForge ecosystem,
              students, companies and platform operations.
            </p>

            <div className="owner-benefits">

              <div className="owner-benefit">
                <span>01</span>
                <div>
                  <strong>Platform Management</strong>
                  <small>
                    Manage the overall CareerForge platform
                  </small>
                </div>
              </div>

              <div className="owner-benefit">
                <span>02</span>
                <div>
                  <strong>Admin Control</strong>
                  <small>
                    Manage students and company accounts
                  </small>
                </div>
              </div>

              <div className="owner-benefit">
                <span>03</span>
                <div>
                  <strong>Platform Security</strong>
                  <small>
                    Oversee access and platform operations
                  </small>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <main className="owner-main">
          <div className="owner-form-card">

            {/* DYNAMIC HEADING */}
            <div className="owner-form-heading">

              <span className="owner-eyebrow">
                {mode === "register"
                  ? "SECURE OWNER SETUP"
                  : "SECURE OWNER ACCESS"}
              </span>

              <h2>
                {mode === "register"
                  ? "Create Owner Account"
                  : "Owner Login"}
              </h2>

              <p>
                {mode === "register"
                  ? "Register the primary administrator of CareerForge."
                  : "Sign in with your registered Owner credentials."}
              </p>

            </div>

            {/* RESPONSE MESSAGE */}
            {message && (
              <div
                className={`owner-message ${messageType}`}
                role="alert"
              >
                {message}
              </div>
            )}

            {/* ================================== */}
            {/* REGISTRATION FORM */}
            {/* ================================== */}

            {mode === "register" && (
              <form onSubmit={handleSubmit}>

                {/* OWNER INFORMATION */}
                <section className="owner-section">

                  <h3>Owner Information</h3>

                  <div className="owner-grid">

                    <div className="owner-field owner-full">
                      <label>Full Name *</label>

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter owner's full name"
                        value={form.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="owner-field">
                      <label>Official Email Address *</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="owner@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="owner-field">
                      <label>Mobile Number *</label>

                      <div className="owner-phone-input">

                        <select
                          name="countryCode"
                          value={form.countryCode}
                          onChange={handleChange}
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+61">+61</option>
                          <option value="+971">+971</option>
                        </select>

                        <input
                          type="tel"
                          name="phone"
                          placeholder="Mobile number"
                          value={form.phone}
                          onChange={handleChange}
                          autoComplete="tel-national"
                          required
                        />

                      </div>
                    </div>

                    <div className="owner-field owner-full">
                      <label>Preferred Language</label>

                      <select
                        name="language"
                        value={form.language}
                        onChange={handleChange}
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Arabic</option>
                        <option>Other</option>
                      </select>
                    </div>

                  </div>
                </section>

                {/* OWNER VERIFICATION */}
                <section className="owner-section">

                  <h3>Owner Verification</h3>

                  <div className="owner-grid">

                    <div className="owner-field owner-full">

                      <label>
                        Secure Setup / Invitation Code *
                      </label>

                      <input
                        type="password"
                        name="setupCode"
                        placeholder="Enter your authorized setup code"
                        value={form.setupCode}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      />

                      <small>
                        This code is validated by the backend.
                      </small>

                    </div>

                  </div>

                  {/* EMAIL VERIFICATION */}
                  <div className="owner-verify-row">

                    <input
                      type="email"
                      value={form.email}
                      placeholder="Official email address"
                      readOnly
                    />

                    <button
                      type="button"
                      className="owner-secondary-btn"
                      onClick={() =>
                        handleVerificationNotice("Email")
                      }
                    >
                      Verify Email
                    </button>

                  </div>

                  {/* MOBILE VERIFICATION */}
                  <div className="owner-verify-row">

                    <input
                      type="tel"
                      value={`${form.countryCode} ${form.phone}`}
                      placeholder="Mobile number"
                      readOnly
                    />

                    <button
                      type="button"
                      className="owner-secondary-btn"
                      onClick={() =>
                        handleVerificationNotice("Mobile")
                      }
                    >
                      Verify Mobile
                    </button>

                  </div>

                </section>

                {/* PLATFORM OWNERSHIP */}
                <section className="owner-section">

                  <h3>Platform Ownership</h3>

                  <div className="owner-field owner-full">

                    <label>Account Role</label>

                    <input
                      type="text"
                      value="Owner / Super Admin"
                      readOnly
                    />

                    <small>
                      Highest administrative role on CareerForge.
                    </small>

                  </div>

                </section>

                {/* ACCOUNT SECURITY */}
                <section className="owner-section">

                  <h3>Account Security</h3>

                  <div className="owner-grid">

                    <div className="owner-field">

                      <label>Create Password *</label>

                      <div className="owner-password-wrapper">

                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Minimum 8 characters"
                          value={form.password}
                          onChange={handleChange}
                          minLength="8"
                          maxLength="72"
                          autoComplete="new-password"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>

                      </div>

                    </div>

                    <div className="owner-field">

                      <label>Confirm Password *</label>

                      <div className="owner-password-wrapper">

                        <input
                          type={
                            showConfirmPassword ? "text" : "password"
                          }
                          name="confirmPassword"
                          placeholder="Re-enter password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </button>

                      </div>

                    </div>

                  </div>
                </section>

                {/* SECURITY AGREEMENT */}
                <label className="owner-terms">

                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    required
                  />

                  <span>
                    I understand that the Owner account has full
                    administrative privileges and I accept responsibility
                    for platform security and management.
                  </span>

                </label>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="owner-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Owner Account"}
                </button>

                <p className="owner-login-link">
                  Already have an Owner account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                  >
                    Owner Login
                  </button>
                </p>

              </form>
            )}

            {/* ================================== */}
            {/* LOGIN FORM */}
            {/* ================================== */}

            {mode === "login" && (
              <form onSubmit={handleLogin}>

                <section className="owner-section">

                  <h3>Owner Login Credentials</h3>

                  <div className="owner-grid">

                    <div className="owner-field owner-full">
                      <label>Official Email Address *</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter registered email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                      />
                    </div>

                    <div className="owner-field owner-full">
                      <label>Password *</label>

                      <div className="owner-password-wrapper">

                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your Owner password"
                          value={form.password}
                          onChange={handleChange}
                          autoComplete="current-password"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>

                      </div>
                    </div>

                  </div>
                </section>

                <button
                  type="submit"
                  className="owner-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Signing In..."
                    : "Login to Owner Dashboard"}
                </button>

                <p className="owner-login-link">
                  New Owner?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                  >
                    Create Account
                  </button>
                </p>

              </form>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
