import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";

import {
  Building2,
  Globe,
  Users,
  ShieldCheck,
  FileCheck,
  BriefcaseBusiness,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  X,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Home,
} from "lucide-react";

import { setAppLanguage } from "../utils/i18n";
import ProfilePhotoPicker from "../components/ProfilePhotoPicker";
import { persistCentralProfile } from "../utils/profilePhoto";
import "./CompanyRegister.css";

// ==========================================
// STORAGE KEYS
// ==========================================

const COMPANIES_KEY = "careerforge_companies";
const PROFILE_KEY = "careerforge_company_profile";
const CURRENT_COMPANY_KEY = "careerforge_current_company";
const COMPANY_LANGUAGE_KEY = "careerforge_company_language";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// ==========================================
// SUPPORTED LANGUAGES
// ==========================================

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
];

const normalizeLanguage = (value) => {
  const aliases = {
    english: "en",
    hindi: "hi",
    spanish: "es",
    french: "fr",
    german: "de",
    arabic: "ar",
    portuguese: "pt",
    chinese: "zh",
    japanese: "ja",
    korean: "ko",
    "हिन्दी": "hi",
    "हिंदी": "hi",
  };

  const normalized = String(value || "en").trim().toLowerCase();
  const code = aliases[normalized] || normalized;

  return LANGUAGES.some((item) => item.code === code)
    ? code
    : "en";
};

// ==========================================
// INITIAL FORM
// ==========================================

const initialForm = {
  companyName: "",
  officialEmail: "",
  website: "",
  industry: "",
  companySize: "",
  foundedYear: "",
  country: "",
  state: "",
  city: "",
  address: "",
  registrationNumber: "",
  recruiterName: "",
  designation: "",
  recruiterEmail: "",
  countryCode: "+91",
  phone: "",
  linkedin: "",
  language: "en",
  password: "",
  confirmPassword: "",
  terms: false,
};

// ==========================================
// OPTIONS
// ==========================================

const industryOptions = [
  "Information Technology",
  "Software Development",
  "Artificial Intelligence",
  "FinTech",
  "EdTech",
  "Healthcare",
  "E-commerce",
  "Manufacturing",
  "Banking & Finance",
  "Consulting",
  "Telecommunications",
  "Education",
  "Other",
];

const companySizes = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501–1000 employees",
  "1001–5000 employees",
  "5000+ employees",
];

const callingCodes = [
  "+91",
  "+1",
  "+44",
  "+61",
  "+971",
  "+65",
  "+49",
  "+33",
  "+81",
  "+82",
  "+86",
  "+351",
  "+55",
  "+27",
];

// ==========================================
// LOCAL STORAGE HELPERS
// ==========================================

function readCompanies() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(COMPANIES_KEY) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

// ==========================================
// PASSWORD HASHING
// ==========================================

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error(
      "Secure password storage is unavailable. Use localhost or HTTPS."
    );
  }

  const encoder = new TextEncoder();

  const key = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ==========================================
// FORM FIELD
// ==========================================

function FormField({ label, children, wide = false }) {
  return (
    <label className={`cr-field ${wide ? "cr-field-wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CompanyRegister() {
  const navigate = useNavigate();

  const savedLanguage = normalizeLanguage(
    localStorage.getItem(COMPANY_LANGUAGE_KEY) ||
    localStorage.getItem("careerforge_language") ||
    "en"
  );

  const [form, setForm] = useState({
    ...initialForm,
    language: savedLanguage,
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // ======================================
  // COUNTRY / STATE / CITY
  // ======================================

  const countries = useMemo(
    () => Country.getAllCountries(),
    []
  );

  const states = useMemo(() => {
    if (!form.country) return [];

    return State.getStatesOfCountry(form.country) || [];
  }, [form.country]);

  const cities = useMemo(() => {
    if (!form.country) return [];

    if (states.length === 0) {
      return City.getCitiesOfCountry(form.country) || [];
    }

    if (!form.state) return [];

    return City.getCitiesOfState(
      form.country,
      form.state
    ) || [];
  }, [form.country, form.state, states]);

  // ======================================
  // MESSAGE
  // ======================================

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  // ======================================
  // FORM CHANGE
  // ======================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "country") {
        updated.state = "";
        updated.city = "";
      }

      if (name === "state") {
        updated.city = "";
      }

      return updated;
    });
  };

  // ======================================
  // LANGUAGE CHANGE
  // ======================================

  const handleLanguageChange = (event) => {
    const language = normalizeLanguage(event.target.value);

    setForm((previous) => ({
      ...previous,
      language,
    }));

    setAppLanguage(language);

    localStorage.setItem(
      COMPANY_LANGUAGE_KEY,
      language
    );

    localStorage.setItem(
      "careerforge_language",
      language
    );
  };

  // ======================================
  // DOCUMENT UPLOAD SELECTION
  // ======================================

  const handleDocumentChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      showMessage(
        "Please upload a PDF, JPG, PNG or WEBP file.",
        "error"
      );

      event.target.value = "";
      setDocumentFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showMessage(
        "Document size must be 5 MB or less.",
        "error"
      );

      event.target.value = "";
      setDocumentFile(null);
      return;
    }

    setDocumentFile(selectedFile);

    showMessage(
      "Document selected. Actual upload requires backend integration.",
      "info"
    );
  };

  // ======================================
  // EMAIL OTP PLACEHOLDER
  // ======================================

  const handleSendOtp = () => {
    if (!form.officialEmail.trim()) {
      showMessage(
        "Please enter your official company email first.",
        "error"
      );
      return;
    }

    showMessage(
      "Email OTP service is not connected yet. Backend email verification API is required.",
      "info"
    );
  };

  // ======================================
  // GET COUNTRY / STATE NAMES
  // ======================================

  const selectedCountry = countries.find(
    (item) => item.isoCode === form.country
  );

  const selectedState = states.find(
    (item) => item.isoCode === form.state
  );

  // ======================================
  // COMPANY REGISTRATION
  // ======================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const email = form.officialEmail.trim().toLowerCase();

    if (!form.companyName.trim()) {
      showMessage("Please enter your company name.", "error");
      return;
    }

    if (!email) {
      showMessage(
        "Please enter your official company email.",
        "error"
      );
      return;
    }

    if (!form.industry || !form.companySize) {
      showMessage(
        "Please select your industry and company size.",
        "error"
      );
      return;
    }

    if (
      !form.country ||
      !form.city ||
      (states.length > 0 && !form.state)
    ) {
      showMessage(
        "Please complete your country, state and city.",
        "error"
      );
      return;
    }

    if (!form.registrationNumber.trim()) {
      showMessage(
        "Please enter your business registration number.",
        "error"
      );
      return;
    }

    if (!documentFile) {
      showMessage(
        "Please upload your company registration document.",
        "error"
      );
      return;
    }

    if (
      !form.recruiterName.trim() ||
      !form.designation.trim() ||
      !form.recruiterEmail.trim() ||
      !form.phone.trim()
    ) {
      showMessage(
        "Please complete all required recruiter details.",
        "error"
      );
      return;
    }

    if (!form.password || form.password.length < 8) {
      showMessage(
        "Password must contain at least 8 characters.",
        "error"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    if (!form.terms) {
      showMessage(
        "Please accept the Terms & Conditions.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const requestBody = new FormData();
      const registrationData = {
        companyName: form.companyName.trim(),
        ownerName: form.recruiterName.trim(),
        email,
        password: form.password,
        phone: `${form.countryCode} ${form.phone.trim()}`,
        countryCode: form.countryCode,
        website: form.website.trim(),
        industry: form.industry,
        country: form.country,
        countryName: selectedCountry?.name || "",
        state: form.state,
        stateName: selectedState?.name || "",
        city: form.city,
        registrationNumber: form.registrationNumber.trim(),
        address: form.address.trim(),
        description: form.address.trim(),
        companySize: form.companySize,
        foundedYear: form.foundedYear,
        language: form.language,
        designation: form.designation.trim(),
        recruiterEmail: form.recruiterEmail.trim().toLowerCase(),
        linkedin: form.linkedin.trim(),
      };
      Object.entries(registrationData).forEach(([key, value]) => {
        requestBody.append(key, value);
      });
      if (companyLogo) requestBody.append("profilePhoto", companyLogo);

      const response = await fetch(`${API_BASE_URL}/api/company-auth/register`, {
        method: "POST",
        body: requestBody,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        if (response.status === 409) {
          setLoginEmail(email);
          setShowLogin(true);
        }
        throw new Error(result.message || "Unable to register company.");
      }

      // Automatically fill login email
      setLoginEmail(email);
      setLoginPassword("");

      // Keep selected company language
      setAppLanguage(form.language);

      localStorage.setItem(
        COMPANY_LANGUAGE_KEY,
        form.language
      );

      localStorage.setItem(
        "careerforge_language",
        form.language
      );

      showMessage(
        `${result.message || "Registration submitted successfully."} Login is available after administrator verification.`,
        "success"
      );

      // Open login screen on the same page
      setShowLogin(true);
    } catch (error) {
      console.error("Company registration error:", error);

      showMessage(
        error.message ||
          "Unable to complete registration. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // COMPANY LOGIN
  // ======================================

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    const email = loginEmail.trim().toLowerCase();

    if (!email || !loginPassword) {
      showMessage(
        "Please enter your company email and password.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/company-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: loginPassword }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success || !result.company || !result.token) {
        if (response.status === 403) {
          throw new Error(result.message || "Company account is awaiting verification.");
        }

        const legacyCompany = readCompanies().find(
          (item) => item.email?.toLowerCase() === email
        );
        if (!legacyCompany || !legacyCompany.salt || !legacyCompany.passwordHash) {
          throw new Error(result.message || "Company account not found. Please register first.");
        }

        const enteredHash = await hashPassword(loginPassword, legacyCompany.salt);
        if (enteredHash !== legacyCompany.passwordHash) {
          throw new Error("Incorrect email or password. Please try again.");
        }

        const legacyLanguage = normalizeLanguage(
          legacyCompany.language || legacyCompany.profile?.language || "en"
        );
        localStorage.setItem(
          PROFILE_KEY,
          JSON.stringify({ ...legacyCompany.profile, language: legacyLanguage })
        );
        localStorage.setItem(
          CURRENT_COMPANY_KEY,
          JSON.stringify({
            id: legacyCompany.id,
            email: legacyCompany.email,
            language: legacyLanguage,
            name: legacyCompany.profile?.name || "",
          })
        );
        localStorage.removeItem("careerforge_company_token");
        window.dispatchEvent(new Event("careerforge-profile-updated"));
        localStorage.setItem(COMPANY_LANGUAGE_KEY, legacyLanguage);
        localStorage.setItem("careerforge_language", legacyLanguage);
        setAppLanguage(legacyLanguage);
        navigate("/company-dashboard", { replace: true });
        return;
      }

      const company = result.company;
      const selectedLanguage = normalizeLanguage(company.language || "en");
      const dashboardProfile = {
        id: company.id,
        name: company.companyName,
        companyName: company.companyName,
        email: company.email,
        website: company.website || "",
        industry: company.industry || "",
        location: company.location || "",
        description: company.description || "",
        logo: company.logo || "",
        language: selectedLanguage,
        companySize: company.companySize || "",
        foundedYear: company.foundedYear || "",
        registrationNumber: company.registrationNumber || "",
        recruiterName: company.ownerName || "",
        designation: company.designation || "",
        recruiterEmail: company.recruiterEmail || "",
        phone: company.phone || "",
        countryCode: company.countryCode || "",
        linkedin: company.linkedin || "",
        address: company.address || "",
        verificationStatus: company.verificationStatus,
      };

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(dashboardProfile)
      );

      // Save current company session without password data
      localStorage.setItem(
        CURRENT_COMPANY_KEY,
        JSON.stringify({
          id: company.id,
          email: company.email,
          language: selectedLanguage,
          name: company.companyName,
          logo: company.logo || "",
        })
      );
      localStorage.setItem("careerforge_company_token", result.token);
      persistCentralProfile(dashboardProfile, "company");

      localStorage.setItem(
        COMPANY_LANGUAGE_KEY,
        selectedLanguage
      );

      localStorage.setItem(
        "careerforge_language",
        selectedLanguage
      );

      setAppLanguage(selectedLanguage);

      // Login successful -> Company Dashboard
      navigate("/company-dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Company login error:", error);

      showMessage(
        error.message ||
          "Login failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // SWITCH TO LOGIN
  // ======================================

  const openLogin = () => {
    setLoginEmail(form.officialEmail.trim().toLowerCase());
    setLoginPassword("");
    setShowLogin(true);
    setMessage("");
  };

  const openRegistration = () => {
    setShowLogin(false);
    setMessage("");
  };

  // ======================================
  // HOME NAVIGATION
  // ======================================

  const goHome = () => navigate("/");

  // ======================================
  // SHARED NAVBAR
  // ======================================

  const renderNavbar = () => (
    <nav className="cr-navbar">
      <button
        type="button"
        className="cr-brand"
        onClick={goHome}
      >
        <span className="cr-brand-icon">
          <Building2 size={21} />
        </span>
        <span>CareerForge</span>
      </button>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          className="cr-back-link"
          onClick={goHome}
        >
          <Home size={16} />
          Back to Home
        </button>

        {showLogin ? (
          <button
            type="button"
            className="cr-back-link"
            onClick={openRegistration}
          >
            <ArrowLeft size={16} />
            Back to Register
          </button>
        ) : (
          <button
            type="button"
            className="cr-back-link"
            onClick={openLogin}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );

  // ======================================
  // COMMON MESSAGE
  // ======================================

  const renderMessage = () =>
    message ? (
      <div
        className={`cr-message ${messageType}`}
        role="status"
      >
        {messageType === "success" ? (
          <CheckCircle2 size={18} />
        ) : (
          <ShieldCheck size={18} />
        )}

        <span>{message}</span>

        <button
          type="button"
          onClick={() => setMessage("")}
          aria-label="Dismiss message"
        >
          <X size={16} />
        </button>
      </div>
    ) : null;

  // ======================================
  // LOGIN SCREEN
  // ======================================

  if (showLogin) {
    return (
      <main className="company-register-page">
        {renderNavbar()}

        <div className="cr-layout">
          <aside className="cr-sidebar">
            <div className="cr-sidebar-content">
              <span className="cr-eyebrow">
                COMPANY & RECRUITER PORTAL
              </span>

              <h1>
                Welcome back.
                <span> Let's build together.</span>
              </h1>

              <p>
                Sign in to manage your company profile, publish
                opportunities and discover student talent from
                around the world.
              </p>

              <div className="cr-benefits">
                <div className="cr-benefit">
                  <span className="cr-benefit-icon">
                    <BriefcaseBusiness size={20} />
                  </span>

                  <div>
                    <strong>Manage Opportunities</strong>
                    <small>
                      Publish and manage your job listings.
                    </small>
                  </div>
                </div>

                <div className="cr-benefit">
                  <span className="cr-benefit-icon">
                    <Users size={20} />
                  </span>

                  <div>
                    <strong>Review Applications</strong>
                    <small>
                      View and shortlist student candidates.
                    </small>
                  </div>
                </div>

                <div className="cr-benefit">
                  <span className="cr-benefit-icon">
                    <ShieldCheck size={20} />
                  </span>

                  <div>
                    <strong>Company Workspace</strong>
                    <small>
                      Access your organisation dashboard.
                    </small>
                  </div>
                </div>
              </div>

              <div className="cr-sidebar-note">
                <Sparkles size={18} />
                <span>
                  Your company journey continues with CareerForge.
                </span>
              </div>
            </div>
          </aside>

          <main className="cr-main">
            <div className="cr-form-card">
              <div className="cr-form-heading">
                <span className="cr-eyebrow">
                  COMPANY ACCOUNT
                </span>

                <h2>Company Login</h2>

                <p>
                  Enter your registered official company email
                  and password to continue.
                </p>
              </div>

              {renderMessage()}

              <form onSubmit={handleLogin}>
                <section className="cr-section">
                  <div className="cr-section-heading">
                    <span className="cr-section-icon">
                      <LockKeyhole size={19} />
                    </span>

                    <div>
                      <h3>Login Details</h3>
                      <p>
                        Use the details provided during registration.
                      </p>
                    </div>
                  </div>

                  <FormField label="Official Company Email *">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(event) =>
                        setLoginEmail(event.target.value)
                      }
                      placeholder="careers@company.com"
                      autoComplete="username"
                      required
                    />
                  </FormField>

                  <FormField label="Password *">
                    <div className="cr-password-wrapper">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowLoginPassword((previous) => !previous)
                        }
                        aria-label={
                          showLoginPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Dashboard Language">
                    <select
                      value={normalizeLanguage(
                        form.language
                      )}
                      onChange={handleLanguageChange}
                    >
                      {LANGUAGES.map((item) => (
                        <option
                          key={item.code}
                          value={item.code}
                        >
                          {item.nativeName} ({item.name})
                        </option>
                      ))}
                    </select>
                  </FormField>
                </section>

                <button
                  type="submit"
                  className="cr-submit-button"
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : "Login to Company Dashboard"}

                  <ArrowLeft
                    size={18}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </button>

                <p className="cr-login-link">
                  New company?{" "}
                  <button
                    type="button"
                    onClick={openRegistration}
                  >
                    Register here
                  </button>
                </p>

                <div className="cr-approval-note">
                  <ShieldCheck size={18} />

                  <span>
                    Use the same official company email and
                    password that you entered during registration.
                  </span>
                </div>
              </form>
            </div>
          </main>
        </div>
      </main>
    );
  }

  // ======================================
  // REGISTRATION SCREEN
  // ======================================

  return (
    <main className="company-register-page">
      {renderNavbar()}

      <div className="cr-layout">
        {/* LEFT INTRODUCTION */}

        <aside className="cr-sidebar">
          <div className="cr-sidebar-content">
            <span className="cr-eyebrow">
              COMPANY & RECRUITER PORTAL
            </span>

            <h1>
              Discover talent.
              <span> Build the future.</span>
            </h1>

            <p>
              Bring your organisation to CareerForge. Connect with
              skilled students, publish opportunities and discover
              future-ready talent from around the world.
            </p>

            <div className="cr-benefits">
              <div className="cr-benefit">
                <span className="cr-benefit-icon">
                  <Users size={20} />
                </span>

                <div>
                  <strong>Discover Student Talent</strong>
                  <small>
                    Explore skills, projects and student profiles.
                  </small>
                </div>
              </div>

              <div className="cr-benefit">
                <span className="cr-benefit-icon">
                  <BriefcaseBusiness size={20} />
                </span>

                <div>
                  <strong>Publish Opportunities</strong>
                  <small>
                    Post internships and full-time jobs.
                  </small>
                </div>
              </div>

              <div className="cr-benefit">
                <span className="cr-benefit-icon">
                  <ShieldCheck size={20} />
                </span>

                <div>
                  <strong>Verified Company Access</strong>
                  <small>
                    Build trust through company verification.
                  </small>
                </div>
              </div>
            </div>

            <div className="cr-sidebar-note">
              <Sparkles size={18} />

              <span>
                Connect with talent. Create opportunities. Grow together.
              </span>
            </div>
          </div>
        </aside>

        {/* REGISTRATION FORM */}

        <main className="cr-main">
          <div className="cr-form-card">
            <div className="cr-form-heading">
              <span className="cr-eyebrow">
                JOIN CAREERFORGE
              </span>

              <h2>Register Your Company</h2>

              <p>
                Complete your organisation and recruiter details
                to create your company account.
              </p>
            </div>

            {renderMessage()}

            <form onSubmit={handleSubmit}>
              {/* COMPANY INFORMATION */}

              <section className="cr-section">
                <div className="cr-section-heading">
                  <span className="cr-section-icon">
                    <Building2 size={19} />
                  </span>

                  <div>
                    <h3>Company Information</h3>
                    <p>Tell us about your organisation.</p>
                  </div>
                </div>

                <div className="cr-grid">
                  <FormField
                    label="Legal Company Name *"
                    wide
                  >
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Enter registered company name"
                      required
                    />
                  </FormField>

                  <div className="cr-field cr-field-wide">
                    <ProfilePhotoPicker
                      label="Company logo (optional)"
                      company
                      onChange={setCompanyLogo}
                    />
                  </div>

                  <FormField label="Official Company Email *">
                    <input
                      type="email"
                      name="officialEmail"
                      value={form.officialEmail}
                      onChange={handleChange}
                      placeholder="careers@company.com"
                      required
                    />
                  </FormField>

                  <FormField label="Company Website">
                    <input
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="https://company.com"
                    />
                  </FormField>

                  <FormField label="Industry / Sector *">
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select industry</option>

                      {industryOptions.map((industry) => (
                        <option
                          key={industry}
                          value={industry}
                        >
                          {industry}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Company Size *">
                    <select
                      name="companySize"
                      value={form.companySize}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select company size
                      </option>

                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Year Established">
                    <select
                      name="foundedYear"
                      value={form.foundedYear}
                      onChange={handleChange}
                    >
                      <option value="">Select year</option>

                      {Array.from(
                        { length: 126 },
                        (_, index) => {
                          const year =
                            new Date().getFullYear() - index;

                          return (
                            <option
                              key={year}
                              value={year}
                            >
                              {year}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </FormField>

                  <FormField label="Dashboard Language *">
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleLanguageChange}
                      required
                    >
                      {LANGUAGES.map((item) => (
                        <option
                          key={item.code}
                          value={item.code}
                        >
                          {item.nativeName} ({item.name})
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </section>

              {/* COMPANY LOCATION */}

              <section className="cr-section">
                <div className="cr-section-heading">
                  <span className="cr-section-icon">
                    <Globe size={19} />
                  </span>

                  <div>
                    <h3>Company Location</h3>
                    <p>Where is your organisation based?</p>
                  </div>
                </div>

                <div className="cr-grid">
                  <FormField label="Country *">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select country</option>

                      {countries.map((country) => (
                        <option
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="State / Province *">
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      disabled={!form.country || states.length === 0}
                      required={states.length > 0}
                    >
                      <option value="">
                        {states.length > 0
                          ? "Select state / province"
                          : "No state selection required"}
                      </option>

                      {states.map((state) => (
                        <option
                          key={state.isoCode}
                          value={state.isoCode}
                        >
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="City *">
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      disabled={
                        !form.country ||
                        (states.length > 0 && !form.state)
                      }
                      required
                    >
                      <option value="">Select city</option>

                      {cities.map((city, index) => (
                        <option
                          key={`${city.name}-${index}`}
                          value={city.name}
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Office Address" wide>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Building, street, area and postal code"
                      rows={3}
                    />
                  </FormField>
                </div>
              </section>

              {/* COMPANY VERIFICATION */}

              <section className="cr-section">
                <div className="cr-section-heading">
                  <span className="cr-section-icon">
                    <FileCheck size={19} />
                  </span>

                  <div>
                    <h3>Company Verification</h3>
                    <p>
                      Provide details for organisation verification.
                    </p>
                  </div>
                </div>

                <div className="cr-grid">
                  <FormField
                    label="Business Registration Number *"
                    wide
                  >
                    <input
                      name="registrationNumber"
                      value={form.registrationNumber}
                      onChange={handleChange}
                      placeholder="Enter your official registration number"
                      required
                    />
                  </FormField>

                  <div className="cr-field cr-field-wide">
                    <label>
                      Company Registration Document *
                    </label>

                    <label className="cr-upload-box">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleDocumentChange}
                      />

                      <span className="cr-upload-icon">
                        <Upload size={23} />
                      </span>

                      <strong>
                        {documentFile
                          ? documentFile.name
                          : "Upload company registration certificate"}
                      </strong>

                      <small>
                        PDF, JPG, PNG or WEBP · Maximum 5 MB
                      </small>
                    </label>

                    <p className="cr-field-help">
                      The document will require actual backend upload
                      and administrator review.
                    </p>
                  </div>
                </div>
              </section>

              {/* RECRUITER DETAILS */}

              <section className="cr-section">
                <div className="cr-section-heading">
                  <span className="cr-section-icon">
                    <Users size={19} />
                  </span>

                  <div>
                    <h3>Authorised Recruiter Details</h3>
                    <p>Who will manage the company account?</p>
                  </div>
                </div>

                <div className="cr-grid">
                  <FormField label="Recruiter / HR Full Name *">
                    <input
                      name="recruiterName"
                      value={form.recruiterName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </FormField>

                  <FormField label="Designation *">
                    <input
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="e.g. HR Manager"
                      required
                    />
                  </FormField>

                  <FormField label="Recruiter Work Email *">
                    <input
                      type="email"
                      name="recruiterEmail"
                      value={form.recruiterEmail}
                      onChange={handleChange}
                      placeholder="recruiter@company.com"
                      required
                    />
                  </FormField>

                  <FormField label="Contact Number *">
                    <div className="cr-phone-input">
                      <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                        aria-label="Country calling code"
                      >
                        {callingCodes.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Mobile number"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Recruiter LinkedIn Profile"
                    wide
                  >
                    <input
                      type="url"
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </FormField>
                </div>
              </section>

              {/* EMAIL VERIFICATION */}

              <section className="cr-section">
                <div className="cr-section-heading">
                  <span className="cr-section-icon">
                    <ShieldCheck size={19} />
                  </span>

                  <div>
                    <h3>Official Email Verification</h3>
                    <p>
                      Verify your company email before activating the account.
                    </p>
                  </div>
                </div>

                <div className="cr-verify-row">
                  <input
                    type="email"
                    value={form.officialEmail}
                    readOnly
                    placeholder="Enter official company email above"
                    aria-label="Official company email"
                  />

                  <button
                    type="button"
                    className="cr-secondary-button"
                    onClick={handleSendOtp}
                  >
                    Send Email OTP
                  </button>
                </div>

                <p className="cr-field-help">
                  OTP sending and verification require a backend email
                  service. This button currently displays an informational
                  message only.
                </p>
              </section>

              {/* ACCOUNT SECURITY */}

              <section className="cr-section">
                <div className="cr-section-heading">
                  <span className="cr-section-icon">
                    <ShieldCheck size={19} />
                  </span>

                  <div>
                    <h3>Account Security</h3>
                    <p>
                      Create a password for your company account.
                    </p>
                  </div>
                </div>

                <div className="cr-grid">
                  <FormField label="Password *">
                    <div className="cr-password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        minLength={8}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Confirm Password *">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      required
                    />
                  </FormField>
                </div>
              </section>

              {/* TERMS */}

              <label className="cr-terms">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                />

                <span>
                  I confirm that the information provided is accurate
                  and agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>

              {/* REGISTER */}

              <button
                type="submit"
                className="cr-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating company account..."
                  : "Create Company Account"}

                <CheckCircle2 size={18} />
              </button>

              <p className="cr-login-link">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={openLogin}
                >
                  Company Login
                </button>
              </p>

              <div className="cr-approval-note">
                <ShieldCheck size={18} />

                <span>
                  Company verification and administrator approval
                  are handled by CareerForge administrators. Companies
                  can log in after their account is approved.
                </span>
              </div>
            </form>
          </div>
        </main>
      </div>
    </main>
  );
}