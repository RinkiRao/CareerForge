import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import {
  supportedLanguages,
  setAppLanguage,
} from "../utils/i18n";
import ProfilePhotoPicker from "../components/ProfilePhotoPicker";
import { persistCentralProfile } from "../utils/profilePhoto";
import "./StudentRegister.css";

// ======================================
// BACKEND API
// ======================================

const API_BASE_URL = "http://localhost:5000";

// ======================================
// API ERROR HELPER
// ======================================

const getApiError = (error, fallbackMessage) => {
  if (
    error instanceof TypeError ||
    error?.message?.toLowerCase().includes("failed to fetch")
  ) {
    return "Backend server se connection nahi ho pa raha. Port 5000 par backend start karke dobara try karein.";
  }

  return error?.message || fallbackMessage;
};

// ======================================
// TRANSLATIONS: ENGLISH + HINDI
// ======================================

const translations = {
  en: {
    studentAccount: "STUDENT ACCOUNT",
    buildCareer: "Build your",
    careerJourney: "career journey.",
    sidebarDescription:
      "Create your student profile and prepare for internships, placements, interviews and your future career.",
    placementPreparation: "Placement Preparation",
    placementDescription: "DSA, aptitude and interview practice",
    careerOpportunities: "Career Opportunities",
    careerDescription: "Explore internships and jobs",
    trackGrowth: "Track Your Growth",
    growthDescription: "Build skills and monitor progress",
    backToRegister: "Back to Register",
    getStarted: "GET STARTED",
    createStudent: "Create Student Account",
    registrationDescription:
      "Enter your details to create your CareerForge profile.",
    personalInformation: "Personal Information",
    profilePhoto: "Profile Photo (optional)",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    mobile: "Mobile Number",
    mobilePlaceholder: "Mobile number",
    preferredLanguage: "Preferred Language",
    languageHelp: "Select your preferred platform language.",
    emailVerification: "Email Verification",
    sendEmailOtp: "Send Email OTP",
    enterEmailFirst: "Enter email above first",
    enterEmailOtp: "Enter email OTP",
    verify: "Verify",
    emailVerified: "Email verified",
    mobileVerification: "Mobile Verification",
    sendSmsOtp: "Send SMS OTP",
    enterMobileFirst: "Enter mobile number above first",
    enterMobileOtp: "Enter mobile OTP",
    mobileVerified: "Mobile number verified",
    locationDetails: "Location Details",
    country: "Country",
    selectCountry: "Select Country",
    state: "State / Province",
    selectState: "Select State",
    noState: "No state selection required",
    city: "City",
    selectCity: "Select City",
    educationDetails: "Education Details",
    college: "College / University",
    collegePlaceholder: "Enter college or university name",
    degree: "Degree",
    branch: "Branch / Specialization",
    branchPlaceholder: "e.g. Computer Science",
    graduationYear: "Graduation Year",
    selectYear: "Select Year",
    currentYear: "Current Year / Semester",
    select: "Select",
    cgpa: "CGPA / Percentage",
    cgpaPlaceholder: "e.g. 8.5 CGPA or 85%",
    careerProfile: "Career & Placement Profile",
    technicalSkills: "Technical Skills",
    skillsPlaceholder: "e.g. JavaScript, React, Node.js, MongoDB",
    preferredRole: "Preferred Role",
    selectRole: "Select Preferred Role",
    workMode: "Preferred Work Mode",
    remote: "Remote",
    onsite: "On-site",
    hybrid: "Hybrid",
    any: "Any",
    accountSecurity: "Account Security",
    password: "Password",
    passwordPlaceholder: "Minimum 8 characters",
    confirmPassword: "Confirm Password",
    confirmPlaceholder: "Re-enter password",
    terms: "I agree to the Terms & Conditions and Privacy Policy.",
    createAccount: "Create Student Account",
    creatingAccount: "Creating Account...",
    alreadyRegistered: "Already registered?",
    studentLogin: "Student Login",
    welcomeBack: "Welcome back to",
    continueJourney:
      "Continue learning, building projects and discovering career opportunities with CareerForge.",
    continueLearning: "Continue Learning",
    improveSkills: "Improve your technical skills",
    exploreOpportunities: "Explore Opportunities",
    discoverJobs: "Discover jobs and internships",
    trackProgress: "Track Your Progress",
    continueCareer: "Continue your career journey",
    studentPortal: "STUDENT PORTAL",
    studentLoginTitle: "Student Login",
    loginDescription:
      "Login using your registered email and password.",
    registeredEmail: "Registered Email Address",
    registeredEmailPlaceholder: "Enter your registered email",
    enterPassword: "Enter your password",
    loginDashboard: "Login to Student Dashboard",
    loggingIn: "Logging in...",
    newStudent: "New student?",
    registerHere: "Register here",
    backToRegistration: "Back to Registration",
    languageSaved: "Your preferred language has been saved.",
    registrationSuccess:
      "Registration successful! Now login with your password.",
    existingEmail:
      "This email is already registered. Please login.",
    emailRequired: "Please enter your email address.",
    nameRequired: "Please enter your full name.",
    phoneRequired: "Please enter your mobile number.",
    locationRequired:
      "Please complete your country, state/province and city.",
    collegeRequired: "Please enter your college or university.",
    passwordRequired:
      "Password must contain at least 8 characters.",
    passwordMismatch: "Passwords do not match.",
    termsRequired: "Please accept the terms and conditions.",
    accountNotFound: "Account not found. Please register first.",
    incorrectPassword: "Incorrect email or password.",
    loginFailed: "Login failed. Please try again.",
    registrationFailed: "Registration failed. Please try again.",
    otpNotConnected:
      "OTP service is not connected yet. Backend integration is required.",
    otpRequired: "Please enter your OTP.",
    emailOtpNotConnected: "Email OTP verification is not connected yet.",
    mobileOtpNotConnected: "Mobile OTP verification is not connected yet.",
  },

  hi: {
    studentAccount: "विद्यार्थी अकाउंट",
    buildCareer: "अपना",
    careerJourney: "करियर सफर बनाएँ।",
    sidebarDescription:
      "अपनी विद्यार्थी प्रोफाइल बनाएँ और इंटर्नशिप, प्लेसमेंट तथा इंटरव्यू की तैयारी करें।",
    placementPreparation: "प्लेसमेंट की तैयारी",
    placementDescription: "DSA, एप्टीट्यूड और इंटरव्यू अभ्यास",
    careerOpportunities: "करियर के अवसर",
    careerDescription: "इंटर्नशिप और नौकरियाँ खोजें",
    trackGrowth: "अपनी प्रगति देखें",
    growthDescription: "नई स्किल्स सीखें और प्रगति देखें",
    backToRegister: "रजिस्ट्रेशन पर वापस जाएँ",
    getStarted: "शुरू करें",
    createStudent: "स्टूडेंट अकाउंट बनाएँ",
    registrationDescription:
      "अपनी CareerForge प्रोफाइल बनाने के लिए जानकारी भरें।",
    personalInformation: "व्यक्तिगत जानकारी",
    profilePhoto: "प्रोफ़ाइल फ़ोटो (वैकल्पिक)",
    fullName: "पूरा नाम",
    enterFullName: "अपना पूरा नाम लिखें",
    email: "ईमेल पता",
    emailPlaceholder: "you@example.com",
    mobile: "मोबाइल नंबर",
    mobilePlaceholder: "मोबाइल नंबर लिखें",
    preferredLanguage: "पसंदीदा भाषा",
    languageHelp: "अपनी पसंदीदा प्लेटफॉर्म भाषा चुनें।",
    emailVerification: "ईमेल सत्यापन",
    sendEmailOtp: "ईमेल OTP भेजें",
    enterEmailFirst: "पहले ऊपर ईमेल भरें",
    enterEmailOtp: "ईमेल OTP दर्ज करें",
    verify: "सत्यापित करें",
    emailVerified: "ईमेल सत्यापित है",
    mobileVerification: "मोबाइल सत्यापन",
    sendSmsOtp: "SMS OTP भेजें",
    enterMobileFirst: "पहले ऊपर मोबाइल नंबर भरें",
    enterMobileOtp: "मोबाइल OTP दर्ज करें",
    mobileVerified: "मोबाइल नंबर सत्यापित है",
    locationDetails: "स्थान की जानकारी",
    country: "देश",
    selectCountry: "देश चुनें",
    state: "राज्य / प्रांत",
    selectState: "राज्य चुनें",
    noState: "राज्य चुनना आवश्यक नहीं है",
    city: "शहर",
    selectCity: "शहर चुनें",
    educationDetails: "शिक्षा की जानकारी",
    college: "कॉलेज / विश्वविद्यालय",
    collegePlaceholder: "कॉलेज या विश्वविद्यालय का नाम लिखें",
    degree: "डिग्री",
    branch: "ब्रांच / विशेषज्ञता",
    branchPlaceholder: "जैसे कंप्यूटर साइंस",
    graduationYear: "ग्रेजुएशन वर्ष",
    selectYear: "वर्ष चुनें",
    currentYear: "वर्तमान वर्ष / सेमेस्टर",
    select: "चुनें",
    cgpa: "CGPA / प्रतिशत",
    cgpaPlaceholder: "जैसे 8.5 CGPA या 85%",
    careerProfile: "करियर और प्लेसमेंट प्रोफाइल",
    technicalSkills: "तकनीकी स्किल्स",
    skillsPlaceholder: "जैसे JavaScript, React, Node.js, MongoDB",
    preferredRole: "पसंदीदा नौकरी",
    selectRole: "नौकरी का प्रकार चुनें",
    workMode: "काम करने का तरीका",
    remote: "रिमोट",
    onsite: "ऑफिस से",
    hybrid: "हाइब्रिड",
    any: "कोई भी",
    accountSecurity: "अकाउंट सुरक्षा",
    password: "पासवर्ड",
    passwordPlaceholder: "कम से कम 8 अक्षर",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPlaceholder: "पासवर्ड दोबारा लिखें",
    terms: "मैं नियम और शर्तों तथा प्राइवेसी पॉलिसी से सहमत हूँ।",
    createAccount: "स्टूडेंट अकाउंट बनाएँ",
    creatingAccount: "अकाउंट बनाया जा रहा है...",
    alreadyRegistered: "पहले से अकाउंट है?",
    studentLogin: "स्टूडेंट लॉगिन",
    welcomeBack: "वापसी पर स्वागत है",
    continueJourney:
      "सीखना जारी रखें, प्रोजेक्ट बनाएँ और CareerForge पर करियर के अवसर खोजें।",
    continueLearning: "सीखना जारी रखें",
    improveSkills: "अपनी तकनीकी स्किल्स सुधारें",
    exploreOpportunities: "नए अवसर खोजें",
    discoverJobs: "नौकरियाँ और इंटर्नशिप खोजें",
    trackProgress: "अपनी प्रगति देखें",
    continueCareer: "अपना करियर सफर जारी रखें",
    studentPortal: "स्टूडेंट पोर्टल",
    studentLoginTitle: "स्टूडेंट लॉगिन",
    loginDescription:
      "अपने रजिस्टर्ड ईमेल और पासवर्ड से लॉगिन करें।",
    registeredEmail: "रजिस्टर्ड ईमेल पता",
    registeredEmailPlaceholder: "अपना रजिस्टर्ड ईमेल लिखें",
    enterPassword: "अपना पासवर्ड लिखें",
    loginDashboard: "स्टूडेंट डैशबोर्ड में लॉगिन करें",
    loggingIn: "लॉगिन हो रहा है...",
    newStudent: "नए विद्यार्थी हैं?",
    registerHere: "यहाँ रजिस्टर करें",
    backToRegistration: "रजिस्ट्रेशन पर वापस जाएँ",
    languageSaved: "आपकी पसंदीदा भाषा सेव हो गई है।",
    registrationSuccess:
      "रजिस्ट्रेशन सफल! अब अपने पासवर्ड से लॉगिन करें।",
    existingEmail:
      "यह ईमेल पहले से रजिस्टर है। कृपया लॉगिन करें।",
    emailRequired: "कृपया अपना ईमेल पता लिखें।",
    nameRequired: "कृपया अपना पूरा नाम लिखें।",
    phoneRequired: "कृपया अपना मोबाइल नंबर लिखें।",
    locationRequired:
      "कृपया देश, राज्य और शहर की जानकारी पूरी करें।",
    collegeRequired: "कृपया अपने कॉलेज या विश्वविद्यालय का नाम लिखें।",
    passwordRequired:
      "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordMismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    termsRequired: "कृपया नियम और शर्तें स्वीकार करें।",
    accountNotFound: "अकाउंट नहीं मिला। पहले रजिस्ट्रेशन करें।",
    incorrectPassword: "ईमेल या पासवर्ड गलत है।",
    loginFailed: "लॉगिन नहीं हो पाया। दोबारा कोशिश करें।",
    registrationFailed: "रजिस्ट्रेशन नहीं हुआ। दोबारा कोशिश करें।",
    otpNotConnected:
      "OTP सेवा अभी बैकएंड से जुड़ी नहीं है।",
    otpRequired: "कृपया OTP दर्ज करें।",
    emailOtpNotConnected: "ईमेल OTP सत्यापन अभी उपलब्ध नहीं है।",
    mobileOtpNotConnected: "मोबाइल OTP सत्यापन अभी उपलब्ध नहीं है।",
  },
};

// ======================================
// INITIAL FORM
// ======================================

const savedLanguage =
  localStorage.getItem("careerforge_language") || "en";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  countryCode: "+91",
  country: "",
  state: "",
  city: "",
  language: savedLanguage,
  college: "",
  degree: "B.Tech",
  branch: "",
  graduationYear: "",
  studyYear: "",
  cgpa: "",
  skills: "",
  preferredRole: "",
  workMode: "Remote",
  password: "",
  confirmPassword: "",
  terms: false,
};

// ======================================
// STUDENT REGISTRATION COMPONENT
// ======================================

export default function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const languageText =
    translations[form.language] || translations.en;

  const t = (key) =>
    languageText[key] || translations.en[key] || key;

  // ======================================
  // COUNTRIES
  // ======================================

  const countries = useMemo(() => {
    return Country.getAllCountries();
  }, []);

  // ======================================
  // STATES
  // ======================================

  const states = useMemo(() => {
    if (!form.country) return [];

    return State.getStatesOfCountry(form.country) || [];
  }, [form.country]);

  // ======================================
  // CITIES
  // ======================================

  const cities = useMemo(() => {
    if (!form.country) return [];

    if (states.length === 0) {
      return City.getCitiesOfCountry(form.country) || [];
    }

    if (!form.state) return [];

    return City.getCitiesOfState(form.country, form.state) || [];
  }, [form.country, form.state, states]);

  // ======================================
  // MESSAGE
  // ======================================

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  // ======================================
  // LANGUAGE CHANGE
  // ======================================

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setForm((previous) => ({
      ...previous,
      language: selectedLanguage,
    }));

    setAppLanguage(selectedLanguage);

    localStorage.setItem(
      "careerforge_language",
      selectedLanguage
    );

    const selectedText =
      translations[selectedLanguage] || translations.en;

    setMessage(
      selectedText.languageSaved || translations.en.languageSaved
    );

    setMessageType("success");
  };

  // ======================================
  // HANDLE INPUT CHANGE
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

    if (name === "email") {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp("");
    }

    if (name === "phone" || name === "countryCode") {
      setPhoneVerified(false);
      setPhoneOtpSent(false);
      setPhoneOtp("");
    }

    setMessage("");
  };

  // ======================================
  // EMAIL OTP
  // ======================================

  const handleSendEmailOtp = () => {
    if (!form.email.trim()) {
      showMessage(t("emailRequired"), "error");
      return;
    }

    showMessage(t("otpNotConnected"), "info");
  };

  const handleVerifyEmailOtp = () => {
    if (!emailOtp.trim()) {
      showMessage(t("otpRequired"), "error");
      return;
    }

    showMessage(t("emailOtpNotConnected"), "info");
  };

  // ======================================
  // MOBILE OTP
  // ======================================

  const handleSendPhoneOtp = () => {
    if (!form.phone.trim()) {
      showMessage(t("phoneRequired"), "error");
      return;
    }

    showMessage(t("otpNotConnected"), "info");
  };

  const handleVerifyPhoneOtp = () => {
    if (!phoneOtp.trim()) {
      showMessage(t("otpRequired"), "error");
      return;
    }

    showMessage(t("mobileOtpNotConnected"), "info");
  };

  // ======================================
  // STUDENT REGISTRATION - BACKEND
  // ======================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!form.fullName.trim()) {
      showMessage(t("nameRequired"), "error");
      return;
    }

    if (!form.email.trim()) {
      showMessage(t("emailRequired"), "error");
      return;
    }

    if (!form.phone.trim()) {
      showMessage(t("phoneRequired"), "error");
      return;
    }

    if (
      !form.country ||
      !form.city ||
      (states.length > 0 && !form.state)
    ) {
      showMessage(t("locationRequired"), "error");
      return;
    }

    if (!form.college.trim()) {
      showMessage(t("collegeRequired"), "error");
      return;
    }

    if (
      form.password.length < 8 ||
      form.password.length > 72
    ) {
      showMessage(t("passwordRequired"), "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showMessage(t("passwordMismatch"), "error");
      return;
    }

    if (!form.terms) {
      showMessage(t("termsRequired"), "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const selectedCountry = countries.find(
        (item) => item.isoCode === form.country
      );

      const selectedState = states.find(
        (item) => item.isoCode === form.state
      );

      const registrationData = {
        name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,

        phone: `${form.countryCode} ${form.phone.trim()}`,
        countryCode: form.countryCode,

        country: form.country,
        countryName: selectedCountry?.name || "",
        state: form.state,
        stateName: selectedState?.name || "",
        city: form.city,

        language: form.language,

        college: form.college.trim(),
        degree: form.degree,
        branch: form.branch,
        graduationYear: form.graduationYear,
        studyYear: form.studyYear,
        cgpa: form.cgpa,

        skills: form.skills,
        preferredRole: form.preferredRole,
        workMode: form.workMode,
      };

      const requestBody = new FormData();

      Object.entries(registrationData).forEach(([key, value]) => {
        requestBody.append(key, String(value ?? ""));
      });

      if (profilePhoto) {
        requestBody.append("profilePhoto", profilePhoto);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          body: requestBody,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        if (response.status === 409) {
          setLoginEmail(form.email.trim().toLowerCase());
          setLoginPassword("");
          setShowLogin(true);

          showMessage(t("existingEmail"), "info");
          return;
        }

        throw new Error(
          data.message || t("registrationFailed")
        );
      }

      setAppLanguage(form.language);

      localStorage.setItem(
        "careerforge_language",
        form.language
      );

      setLoginEmail(form.email.trim().toLowerCase());
      setLoginPassword("");
      setShowLogin(true);

      showMessage(
        t("registrationSuccess"),
        "success"
      );
    } catch (error) {
      console.error("Student registration error:", error);

      showMessage(
        getApiError(error, t("registrationFailed")),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // STUDENT LOGIN - BACKEND
  // ======================================

  const handleStudentLogin = async (event) => {
    event.preventDefault();

    if (loginLoading) return;

    if (!loginEmail.trim() || !loginPassword) {
      showMessage(
        `${t("emailRequired")} ${t("password")}`,
        "error"
      );
      return;
    }

    setLoginLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail.trim().toLowerCase(),
            password: loginPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || t("loginFailed")
        );
      }

      if (!data.token || !data.user) {
        throw new Error(
          "Backend did not return the student login session."
        );
      }

      const studentLanguage = supportedLanguages.some(
        (language) => language.code === data.user.language
      )
        ? data.user.language
        : "en";

      setAppLanguage(studentLanguage);

      localStorage.setItem(
        "careerforge_language",
        studentLanguage
      );

      localStorage.setItem(
        "careerforge_student_token",
        data.token
      );

      persistCentralProfile(data.user, "student");

      navigate("/students-dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Student login error:", error);

      showMessage(
        getApiError(error, t("loginFailed")),
        "error"
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // ======================================
  // LOGIN VIEW
  // ======================================

  if (showLogin) {
    return (
      <div className="student-register-page">
        <nav className="sr-navbar">
          <Link to="/" className="sr-brand">
            <span className="sr-brand-icon">CF</span>
            <span>
              CareerForge <strong>AI</strong>
            </span>
          </Link>

          <button
            type="button"
            className="sr-back-link"
            onClick={() => {
              setShowLogin(false);
              setMessage("");
            }}
          >
            {t("backToRegistration")}
          </button>
        </nav>

        <div className="sr-layout">
          <aside className="sr-sidebar">
            <div className="sr-sidebar-content">
              <span className="sr-eyebrow">
                {t("studentPortal")}
              </span>

              <h1>
                {t("welcomeBack")}
                <span> {t("careerJourney")}</span>
              </h1>

              <p>{t("continueJourney")}</p>

              <div className="sr-benefits">
                <div className="sr-benefit">
                  <span>01</span>
                  <div>
                    <strong>{t("continueLearning")}</strong>
                    <small>{t("improveSkills")}</small>
                  </div>
                </div>

                <div className="sr-benefit">
                  <span>02</span>
                  <div>
                    <strong>{t("exploreOpportunities")}</strong>
                    <small>{t("discoverJobs")}</small>
                  </div>
                </div>

                <div className="sr-benefit">
                  <span>03</span>
                  <div>
                    <strong>{t("trackProgress")}</strong>
                    <small>{t("continueCareer")}</small>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="sr-main">
            <div className="sr-form-card">
              <div className="sr-form-heading">
                <span className="sr-eyebrow">
                  {t("studentAccount")}
                </span>

                <h2>{t("studentLoginTitle")}</h2>

                <p>{t("loginDescription")}</p>
              </div>

              {message && (
                <div className={`sr-message ${messageType}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleStudentLogin}>
                <div className="sr-field">
                  <label>{t("registeredEmail")} *</label>

                  <input
                    type="email"
                    placeholder={t("registeredEmailPlaceholder")}
                    value={loginEmail}
                    onChange={(event) => {
                      setLoginEmail(event.target.value);
                      setMessage("");
                    }}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="sr-field">
                  <label>{t("password")} *</label>

                  <div className="sr-login-password">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("enterPassword")}
                      value={loginPassword}
                      onChange={(event) => {
                        setLoginPassword(event.target.value);
                        setMessage("");
                      }}
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="sr-submit-btn"
                  disabled={loginLoading}
                >
                  {loginLoading
                    ? t("loggingIn")
                    : t("loginDashboard")}
                </button>

                <p className="sr-login-link">
                  {t("newStudent")}{" "}

                  <button
                    type="button"
                    className="sr-inline-link"
                    onClick={() => {
                      setShowLogin(false);
                      setMessage("");
                      setLoginPassword("");
                    }}
                  >
                    {t("registerHere")}
                  </button>
                </p>
              </form>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ======================================
  // REGISTRATION VIEW
  // ======================================

  return (
    <div className="student-register-page">
      <nav className="sr-navbar">
        <Link to="/" className="sr-brand">
          <span className="sr-brand-icon">CF</span>
          <span>
            CareerForge <strong>AI</strong>
          </span>
        </Link>

        <Link to="/register" className="sr-back-link">
          {t("backToRegister")}
        </Link>
      </nav>

      <div className="sr-layout">
        {/* LEFT SIDEBAR */}

        <aside className="sr-sidebar">
          <div className="sr-sidebar-content">
            <span className="sr-eyebrow">
              {t("studentAccount")}
            </span>

            <h1>
              {t("buildCareer")}
              <span> {t("careerJourney")}</span>
            </h1>

            <p>{t("sidebarDescription")}</p>

            <div className="sr-benefits">
              <div className="sr-benefit">
                <span>01</span>
                <div>
                  <strong>{t("placementPreparation")}</strong>
                  <small>{t("placementDescription")}</small>
                </div>
              </div>

              <div className="sr-benefit">
                <span>02</span>
                <div>
                  <strong>{t("careerOpportunities")}</strong>
                  <small>{t("careerDescription")}</small>
                </div>
              </div>

              <div className="sr-benefit">
                <span>03</span>
                <div>
                  <strong>{t("trackGrowth")}</strong>
                  <small>{t("growthDescription")}</small>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* REGISTRATION FORM */}

        <main className="sr-main">
          <div className="sr-form-card">
            <div className="sr-form-heading">
              <span className="sr-eyebrow">
                {t("getStarted")}
              </span>

              <h2>{t("createStudent")}</h2>

              <p>{t("registrationDescription")}</p>
            </div>

            {message && (
              <div className={`sr-message ${messageType}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* PERSONAL INFORMATION */}

              <section className="sr-section">
                <h3>{t("personalInformation")}</h3>

                <div className="sr-grid">
                  <div className="sr-field sr-full">
                    <label>{t("fullName")} *</label>

                    <input
                      type="text"
                      name="fullName"
                      placeholder={t("enterFullName")}
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="sr-field sr-full">
                    <ProfilePhotoPicker
                      label={t("profilePhoto")}
                      onChange={setProfilePhoto}
                    />
                  </div>

                  <div className="sr-field">
                    <label>{t("email")} *</label>

                    <input
                      type="email"
                      name="email"
                      placeholder={t("emailPlaceholder")}
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="sr-field">
                    <label>{t("mobile")} *</label>

                    <div className="sr-phone-input">
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
                        placeholder={t("mobilePlaceholder")}
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* LANGUAGE SELECTOR */}

                  <div className="sr-field sr-full">
                    <label>{t("preferredLanguage")} *</label>

                    <select
                      name="language"
                      value={form.language}
                      onChange={handleLanguageChange}
                      required
                    >
                      {supportedLanguages.map((language) => (
                        <option
                          key={language.code}
                          value={language.code}
                        >
                          {language.nativeName} ({language.name})
                        </option>
                      ))}
                    </select>

                    <small>{t("languageHelp")}</small>
                  </div>
                </div>
              </section>

              {/* EMAIL VERIFICATION */}

              <section className="sr-section">
                <h3>{t("emailVerification")}</h3>

                <div className="sr-verify-row">
                  <input
                    type="email"
                    value={form.email}
                    placeholder={t("enterEmailFirst")}
                    readOnly
                  />

                  <button
                    type="button"
                    className="sr-secondary-btn"
                    onClick={handleSendEmailOtp}
                  >
                    {t("sendEmailOtp")}
                  </button>
                </div>

                {emailOtpSent && (
                  <div className="sr-otp-row">
                    <input
                      type="text"
                      placeholder={t("enterEmailOtp")}
                      value={emailOtp}
                      onChange={(event) =>
                        setEmailOtp(event.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="sr-secondary-btn"
                      onClick={handleVerifyEmailOtp}
                    >
                      {t("verify")}
                    </button>
                  </div>
                )}

                {emailVerified && (
                  <p className="sr-verified">
                    {t("emailVerified")}
                  </p>
                )}
              </section>

              {/* MOBILE VERIFICATION */}

              <section className="sr-section">
                <h3>{t("mobileVerification")}</h3>

                <div className="sr-verify-row">
                  <input
                    type="tel"
                    value={`${form.countryCode} ${form.phone}`}
                    placeholder={t("enterMobileFirst")}
                    readOnly
                  />

                  <button
                    type="button"
                    className="sr-secondary-btn"
                    onClick={handleSendPhoneOtp}
                  >
                    {t("sendSmsOtp")}
                  </button>
                </div>

                {phoneOtpSent && (
                  <div className="sr-otp-row">
                    <input
                      type="text"
                      placeholder={t("enterMobileOtp")}
                      value={phoneOtp}
                      onChange={(event) =>
                        setPhoneOtp(event.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="sr-secondary-btn"
                      onClick={handleVerifyPhoneOtp}
                    >
                      {t("verify")}
                    </button>
                  </div>
                )}

                {phoneVerified && (
                  <p className="sr-verified">
                    {t("mobileVerified")}
                  </p>
                )}
              </section>

              {/* LOCATION DETAILS */}

              <section className="sr-section">
                <h3>{t("locationDetails")}</h3>

                <div className="sr-grid">
                  <div className="sr-field">
                    <label>{t("country")} *</label>

                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        {t("selectCountry")}
                      </option>

                      {countries.map((country) => (
                        <option
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sr-field">
                    <label>{t("state")}</label>

                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      disabled={
                        !form.country || states.length === 0
                      }
                      required={states.length > 0}
                    >
                      <option value="">
                        {states.length > 0
                          ? t("selectState")
                          : t("noState")}
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
                  </div>

                  <div className="sr-field sr-full">
                    <label>{t("city")} *</label>

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
                      <option value="">
                        {t("selectCity")}
                      </option>

                      {cities.map((city, index) => (
                        <option
                          key={`${city.name}-${index}`}
                          value={city.name}
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* EDUCATION DETAILS */}

              <section className="sr-section">
                <h3>{t("educationDetails")}</h3>

                <div className="sr-grid">
                  <div className="sr-field sr-full">
                    <label>{t("college")} *</label>

                    <input
                      type="text"
                      name="college"
                      placeholder={t("collegePlaceholder")}
                      value={form.college}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="sr-field">
                    <label>{t("degree")}</label>

                    <select
                      name="degree"
                      value={form.degree}
                      onChange={handleChange}
                    >
                      <option>B.Tech</option>
                      <option>B.E.</option>
                      <option>BCA</option>
                      <option>MCA</option>
                      <option>M.Tech</option>
                      <option>B.Sc</option>
                      <option>M.Sc</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="sr-field">
                    <label>{t("branch")}</label>

                    <input
                      type="text"
                      name="branch"
                      placeholder={t("branchPlaceholder")}
                      value={form.branch}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sr-field">
                    <label>{t("graduationYear")}</label>

                    <select
                      name="graduationYear"
                      value={form.graduationYear}
                      onChange={handleChange}
                    >
                      <option value="">
                        {t("selectYear")}
                      </option>

                      {Array.from(
                        { length: 12 },
                        (_, index) => {
                          const year =
                            new Date().getFullYear() + index - 4;

                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>

                  <div className="sr-field">
                    <label>{t("currentYear")}</label>

                    <select
                      name="studyYear"
                      value={form.studyYear}
                      onChange={handleChange}
                    >
                      <option value="">{t("select")}</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>5th Year</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="sr-field sr-full">
                    <label>{t("cgpa")}</label>

                    <input
                      type="text"
                      name="cgpa"
                      placeholder={t("cgpaPlaceholder")}
                      value={form.cgpa}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              {/* PLACEMENT PROFILE */}

              <section className="sr-section">
                <h3>{t("careerProfile")}</h3>

                <div className="sr-grid">
                  <div className="sr-field sr-full">
                    <label>{t("technicalSkills")}</label>

                    <textarea
                      name="skills"
                      placeholder={t("skillsPlaceholder")}
                      value={form.skills}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <div className="sr-field">
                    <label>{t("preferredRole")}</label>

                    <select
                      name="preferredRole"
                      value={form.preferredRole}
                      onChange={handleChange}
                    >
                      <option value="">
                        {t("selectRole")}
                      </option>
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>Full Stack Developer</option>
                      <option>Flutter Developer</option>
                      <option>Software Engineer</option>
                      <option>Data Analyst</option>
                      <option>AI / ML Engineer</option>
                      <option>UI / UX Designer</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="sr-field">
                    <label>{t("workMode")}</label>

                    <select
                      name="workMode"
                      value={form.workMode}
                      onChange={handleChange}
                    >
                      <option value="Remote">{t("remote")}</option>
                      <option value="On-site">{t("onsite")}</option>
                      <option value="Hybrid">{t("hybrid")}</option>
                      <option value="Any">{t("any")}</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ACCOUNT SECURITY */}

              <section className="sr-section">
                <h3>{t("accountSecurity")}</h3>

                <div className="sr-grid">
                  <div className="sr-field">
                    <label>{t("password")} *</label>

                    <input
                      type="password"
                      name="password"
                      placeholder={t("passwordPlaceholder")}
                      value={form.password}
                      onChange={handleChange}
                      minLength="8"
                      maxLength="72"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  <div className="sr-field">
                    <label>{t("confirmPassword")} *</label>

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder={t("confirmPlaceholder")}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      maxLength="72"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* TERMS */}

              <label className="sr-terms">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                />

                <span>{t("terms")}</span>
              </label>

              {/* SUBMIT */}

              <button
                type="submit"
                className="sr-submit-btn"
                disabled={loading}
              >
                {loading
                  ? t("creatingAccount")
                  : t("createAccount")}
              </button>

              <p className="sr-login-link">
                {t("alreadyRegistered")}{" "}

                <button
                  type="button"
                  className="sr-inline-link"
                  onClick={() => {
                    setLoginEmail(form.email.trim().toLowerCase());
                    setLoginPassword("");
                    setShowLogin(true);
                    setMessage("");
                  }}
                >
                  {t("studentLogin")}
                </button>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}