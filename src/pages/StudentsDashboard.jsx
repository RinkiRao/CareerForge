
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Code2,
  BookOpen,
  ClipboardCheck,
  BriefcaseBusiness,
  FolderGit2,
  Award,
  Search,
  Bell,
  Menu,
  X,
  ExternalLink,
  Bookmark,
  MapPin,
  Clock,
  ChevronRight,
  Globe,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Filter,
  Target,
  LogOut,
  Mic,
  Volume2,
  BrainCircuit,
  Sparkles,
  Square,
  Trash2,
  History,
  Pause,
  Radio,
} from "lucide-react";

import { setAppLanguage } from "../utils/i18n";
import ProfileAvatar from "../components/ProfileAvatar";
import "./StudentsDashboard.css";

import {
  getCompanyJobs,
  getStudentNotifications,
  markNotificationsRead,
  applyForCompanyJob,
  getJobApplications,
} from "../utils/companyJobs";

// ==========================================
// CAREERFORGE LANGUAGES
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

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

async function updateAuthenticatedStudent(updates) {
  const token = localStorage.getItem("careerforge_student_token");
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success || !data.user) {
    throw new Error(data.message || "Unable to update your student profile.");
  }

  return data.user;
}

const normalizeLanguage = (value) => {
  if (!value) return "en";

  const aliases = {
    english: "en",
    hindi: "hi",
    hinglish: "hi",
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
    español: "es",
    français: "fr",
    deutsch: "de",
    العربية: "ar",
    português: "pt",
    中文: "zh",
    日本語: "ja",
    한국어: "ko",
  };

  const normalized = String(value).trim().toLowerCase().replace("_", "-");
  const baseLanguage = normalized.split("-")[0];
  const code = aliases[normalized] || aliases[baseLanguage] || normalized;

  return LANGUAGES.some((language) => language.code === code)
    ? code
    : "en";
};

// ==========================================
// TRANSLATIONS
// ==========================================

const translations = {
  en: {
    overview: "Overview",
    profile: "My Profile",
    learning: "Learning",
    dsa: "DSA Practice",
    assessments: "Assessments",
    projects: "My Projects",
    jobs: "Jobs & Internships",
    applications: "My Applications",
    achievements: "Achievements",
    studentPortal: "Student Portal",
    workspace: "WORKSPACE",
    welcome: "Welcome back",
    welcomeDescription:
      "Keep learning, practice your skills and prepare for your next opportunity.",
    careerEyebrow: "YOUR CAREER, YOUR JOURNEY",
    continueLearning: "Continue learning",
    coursesInProgress: "Courses in progress",
    codingPlatforms: "Coding platforms",
    applicationCount: "Applications",
    savedJobs: "Saved jobs",
    continueYourLearning: "Continue your learning",
    choosePractice: "Choose where to practice",
    submittedApplications: "Your submitted applications",
    opportunitiesToRevisit: "Opportunities to revisit",
    latestOpportunities: "Latest opportunities",
    publishedJobs: "Published company jobs and internships",
    continueCourse: "Continue learning",
    pickUpProgress: "Pick up where you left off",
    quickActions: "Quick actions",
    whatToDo: "What would you like to do?",
    practiceDSA: "Practice DSA",
    choosePlatform: "Choose a coding platform",
    exploreJobs: "Explore jobs",
    findOpportunities: "Find opportunities",
    takeAssessment: "Take assessment",
    testKnowledge: "Test your knowledge",
    completeProfile: "Complete profile",
    addDetails: "Add your details",
    personalProfile:
      "Build a profile that represents your skills and experience",
    saveProfile: "Save profile",
    fullName: "Full name",
    email: "Email address",
    country: "Country",
    college: "College / University",
    education: "Education",
    preferredRole: "Preferred role",
    skills: "Skills",
    codeProfile: "Code profile",
    linkedinProfile: "LinkedIn profile",
    yourName: "Your name",
    enterName: "Enter your name",
    learningCentre: "Learning centre",
    learningDescription:
      "Develop skills for college, competitive exams and placements",
    completed: "completed",
    courseIntegration:
      "Course catalogue and lesson progress are demo data until a learning API or backend is connected.",
    buildProblemSkills: "BUILD YOUR PROBLEM-SOLVING SKILLS",
    chooseCodingPlatform: "Choose a coding platform",
    platformDescription:
      "Solve problems on the platform that suits your goals",
    searchPlatforms: "Search platforms...",
    startPracticing: "Start practicing",
    practiceTips: "Practice tips",
    dailyPractice: "Make your daily practice count",
    startBasics: "Start with basics",
    basicsDescription: "Arrays, strings, sorting and searching.",
    practiceConsistently: "Practice consistently",
    practiceDescription: "Set aside a regular daily practice slot.",
    reviewMistakes: "Review mistakes",
    mistakesDescription:
      "Revisit failed problems and learn the pattern.",
    assessmentDescription:
      "Choose an assessment mode to prepare for exams and interviews",
    mcq: "MCQ Assessment",
    objective: "Objective",
    mcqDescription:
      "Practice aptitude, technical concepts and subject-wise multiple-choice questions.",
    written: "Written Assessment",
    descriptive: "Descriptive",
    writtenDescription:
      "Write answers and practise explaining technical concepts clearly.",
    mockInterview: "Mock Interview",
    interviewPrep: "Interview prep",
    interviewDescription:
      "Prepare for HR, communication and technical interview questions.",
    startAssessment: "Start assessment",
    showcaseProjects:
      "Showcase your work, code repositories and practical experience",
    projectName: "Project name",
    projectLink: "Code / Live link",
    projectDescription: "Description",
    projectPlaceholder: "What problem does your project solve?",
    addProject: "Add project",
    viewProject: "View project",
    nextOpportunity: "YOUR NEXT OPPORTUNITY",
    searchJobDescription:
      "Search by role, skills and work mode to find your next opportunity.",
    exploreOpportunities: "Explore opportunities",
    publishedOpportunities:
      "Published company opportunities appear here automatically",
    searchJobs: "Search role, company or skill...",
    all: "All",
    listings: "listings",
    noMatchingJobs: "No matching jobs",
    changeFilters: "Try changing your search or filters.",
    sampleListing: "Sample listing — not verified",
    recentlyPosted: "Recently posted",
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
    internship: "Internship",
    fullTime: "Full-time",
    notSpecified: "Not specified",
    sample: "Sample",
    applied: "Applied",
    apply: "Apply",
    saveJob: "Save job",
    applicationsDescription: "Track the jobs you have applied to",
    noApplications: "No applications yet",
    applyInstruction:
      "Save your email in My Profile, then apply to a published opportunity.",
    position: "Position",
    company: "Company",
    dateType: "Date / Type",
    status: "Status",
    applicationStorage:
      "Application records are shared through localStorage in this browser. Cross-device tracking requires the backend.",
    achievementDescription:
      "Record milestones and celebrate your progress",
    learningStarter: "Learning starter",
    learningStarterDescription: "Start your first course.",
    problemSolver: "Problem solver",
    problemSolverDescription: "Complete your first DSA problem.",
    projectBuilder: "Project builder",
    projectBuilderDescription: "Add a project to your profile.",
    careerReady: "Career ready",
    careerReadyDescription: "Complete your career profile.",
    goal: "Goal",
    achievementNote:
      "These are achievement goals, not verified awards.",
    viewAll: "View all",
    notifications: "Notifications",
    noNotifications:
      "No notifications yet. New published jobs will appear here.",
    latestUpdate: "Latest update",
    notificationsChecked: "notifications checked",
    logout: "Log out",
    logoutNotice: "Logout will be connected to authentication later.",
    keepMoving: "Keep moving forward",
    keepMovingDescription:
      "Small steps today create big opportunities tomorrow.",
    profileSaved: "Profile saved successfully.",
    projectNameRequired: "Enter a project name.",
    projectAdded: "Project added to the current session.",
    emailRequired:
      "Please enter and save your email in My Profile before applying.",
    sampleCannotApply:
      "This is a sample listing. Choose a published company opportunity.",
    applicationSubmitted: "Application submitted successfully.",
    applicationError: "Unable to submit your application.",
    courseNotice: "Course lesson integration can be connected next.",
    mcqNotice: "MCQ assessment engine will be connected next.",
    writtenNotice: "Written assessment engine will be connected next.",
    interviewNotice: "Mock interview flow will be connected next.",
    languageChanged: "Language preference updated.",
    student: "Student",
    preferredLanguage: "Preferred language",
    courseDSA: "Data Structures & Algorithms",
    courseReact: "React Development",
    courseCommunication: "Interview Communication",
    footerNote: "Learn · Practice · Grow",
    logoutNotConnected: "Logout will be connected to authentication later.",
    applicationNotOpen: "Applications are not open yet.",
    applicationClosed: "Application deadline has passed.",
  },

  hi: {
    overview: "मुख्य जानकारी",
    profile: "मेरी प्रोफाइल",
    learning: "सीखना",
    dsa: "DSA अभ्यास",
    assessments: "मूल्यांकन",
    projects: "मेरे प्रोजेक्ट",
    jobs: "नौकरियाँ और इंटर्नशिप",
    applications: "मेरे आवेदन",
    achievements: "उपलब्धियाँ",
    studentPortal: "स्टूडेंट पोर्टल",
    workspace: "कार्यक्षेत्र",
    welcome: "वापसी पर स्वागत है",
    welcomeDescription:
      "सीखना जारी रखें, अपनी स्किल्स का अभ्यास करें और नए अवसरों की तैयारी करें।",
    careerEyebrow: "आपका करियर, आपका सफर",
    continueLearning: "सीखना जारी रखें",
    coursesInProgress: "जारी कोर्स",
    codingPlatforms: "कोडिंग प्लेटफॉर्म",
    applicationCount: "आवेदन",
    savedJobs: "सेव की गई नौकरियाँ",
    continueYourLearning: "अपनी पढ़ाई जारी रखें",
    choosePractice: "अभ्यास के लिए प्लेटफॉर्म चुनें",
    submittedApplications: "आपके जमा किए गए आवेदन",
    opportunitiesToRevisit: "बाद में देखने के लिए अवसर",
    latestOpportunities: "नए अवसर",
    publishedJobs: "कंपनियों की प्रकाशित नौकरियाँ और इंटर्नशिप",
    continueCourse: "सीखना जारी रखें",
    pickUpProgress: "जहाँ छोड़ा था, वहीं से शुरू करें",
    quickActions: "त्वरित विकल्प",
    whatToDo: "आप क्या करना चाहेंगे?",
    practiceDSA: "DSA का अभ्यास करें",
    choosePlatform: "कोडिंग प्लेटफॉर्म चुनें",
    exploreJobs: "नौकरियाँ खोजें",
    findOpportunities: "नए अवसर खोजें",
    takeAssessment: "टेस्ट दें",
    testKnowledge: "अपना ज्ञान जाँचें",
    completeProfile: "प्रोफाइल पूरी करें",
    addDetails: "अपनी जानकारी जोड़ें",
    personalProfile: "अपनी स्किल्स और अनुभव के अनुसार प्रोफाइल बनाएँ",
    saveProfile: "प्रोफाइल सेव करें",
    fullName: "पूरा नाम",
    email: "ईमेल पता",
    country: "देश",
    college: "कॉलेज / विश्वविद्यालय",
    education: "शिक्षा",
    preferredRole: "पसंदीदा नौकरी",
    skills: "स्किल्स",
    codeProfile: "कोडिंग प्रोफाइल",
    linkedinProfile: "LinkedIn प्रोफाइल",
    yourName: "आपका नाम",
    enterName: "अपना नाम लिखें",
    learningCentre: "लर्निंग सेंटर",
    learningDescription:
      "कॉलेज, प्रतियोगी परीक्षाओं और प्लेसमेंट के लिए स्किल्स विकसित करें",
    completed: "पूरा हुआ",
    courseIntegration:
      "कोर्स और लेसन की प्रगति अभी डेमो डेटा है। इसके लिए लर्निंग API या बैकएंड जोड़ना होगा।",
    buildProblemSkills: "अपनी समस्या हल करने की क्षमता बढ़ाएँ",
    chooseCodingPlatform: "कोडिंग प्लेटफॉर्म चुनें",
    platformDescription:
      "अपने लक्ष्य के अनुसार कोडिंग प्लेटफॉर्म चुनकर समस्याएँ हल करें",
    searchPlatforms: "प्लेटफॉर्म खोजें...",
    startPracticing: "अभ्यास शुरू करें",
    practiceTips: "अभ्यास के सुझाव",
    dailyPractice: "रोज़ाना अभ्यास करें",
    startBasics: "बुनियादी चीज़ों से शुरू करें",
    basicsDescription: "Arrays, Strings, Sorting और Searching सीखें।",
    practiceConsistently: "नियमित अभ्यास करें",
    practiceDescription: "हर दिन अभ्यास के लिए समय निकालें।",
    reviewMistakes: "गलतियों से सीखें",
    mistakesDescription: "गलत हुए सवालों को दोबारा हल करें।",
    assessmentDescription:
      "परीक्षाओं और इंटरव्यू की तैयारी के लिए टेस्ट चुनें",
    mcq: "MCQ टेस्ट",
    objective: "वस्तुनिष्ठ",
    mcqDescription:
      "एप्टीट्यूड और तकनीकी विषयों के बहुविकल्पीय प्रश्न हल करें।",
    written: "लिखित टेस्ट",
    descriptive: "वर्णनात्मक",
    writtenDescription:
      "उत्तर लिखें और तकनीकी विषयों को समझाने का अभ्यास करें।",
    mockInterview: "मॉक इंटरव्यू",
    interviewPrep: "इंटरव्यू की तैयारी",
    interviewDescription:
      "HR, कम्युनिकेशन और तकनीकी इंटरव्यू की तैयारी करें।",
    startAssessment: "टेस्ट शुरू करें",
    showcaseProjects:
      "अपने काम, कोड रिपॉजिटरी और अनुभव को दिखाएँ",
    projectName: "प्रोजेक्ट का नाम",
    projectLink: "कोड / लाइव लिंक",
    projectDescription: "विवरण",
    projectPlaceholder: "आपका प्रोजेक्ट कौन-सी समस्या हल करता है?",
    addProject: "प्रोजेक्ट जोड़ें",
    viewProject: "प्रोजेक्ट देखें",
    nextOpportunity: "आपका अगला अवसर",
    searchJobDescription: "नौकरी, स्किल या काम के तरीके से अवसर खोजें।",
    exploreOpportunities: "अवसर खोजें",
    publishedOpportunities:
      "कंपनियों द्वारा प्रकाशित अवसर यहाँ दिखाई देंगे",
    searchJobs: "नौकरी, कंपनी या स्किल खोजें...",
    all: "सभी",
    listings: "अवसर",
    noMatchingJobs: "कोई नौकरी नहीं मिली",
    changeFilters: "अपनी खोज या फिल्टर बदलकर देखें।",
    sampleListing: "डेमो लिस्टिंग — सत्यापित नहीं",
    recentlyPosted: "हाल ही में प्रकाशित",
    remote: "रिमोट",
    hybrid: "हाइब्रिड",
    onsite: "ऑफिस से",
    internship: "इंटर्नशिप",
    fullTime: "फुल टाइम",
    notSpecified: "निर्दिष्ट नहीं",
    sample: "डेमो",
    applied: "आवेदन किया",
    apply: "आवेदन करें",
    saveJob: "नौकरी सेव करें",
    applicationsDescription:
      "आपने जिन नौकरियों के लिए आवेदन किया है, उन्हें देखें",
    noApplications: "अभी कोई आवेदन नहीं है",
    applyInstruction:
      "पहले मेरी प्रोफाइल में ईमेल सेव करें, फिर प्रकाशित अवसर पर आवेदन करें।",
    position: "पद",
    company: "कंपनी",
    dateType: "तारीख / प्रकार",
    status: "स्थिति",
    applicationStorage:
      "आवेदन इस ब्राउज़र में सेव हैं। अलग-अलग डिवाइस पर आवेदन देखने के लिए बैकएंड चाहिए।",
    achievementDescription: "अपनी उपलब्धियाँ और प्रगति दर्ज करें",
    learningStarter: "सीखने की शुरुआत",
    learningStarterDescription: "अपना पहला कोर्स शुरू करें।",
    problemSolver: "समस्या हल करने वाले",
    problemSolverDescription: "अपना पहला DSA सवाल पूरा करें।",
    projectBuilder: "प्रोजेक्ट निर्माता",
    projectBuilderDescription: "अपनी प्रोफाइल में प्रोजेक्ट जोड़ें।",
    careerReady: "करियर के लिए तैयार",
    careerReadyDescription: "अपनी करियर प्रोफाइल पूरी करें।",
    goal: "लक्ष्य",
    achievementNote: "ये उपलब्धि के लक्ष्य हैं, सत्यापित पुरस्कार नहीं।",
    viewAll: "सभी देखें",
    notifications: "सूचनाएँ",
    noNotifications:
      "अभी कोई सूचना नहीं है। नई प्रकाशित नौकरियाँ यहाँ दिखाई देंगी।",
    latestUpdate: "नई जानकारी",
    notificationsChecked: "सूचनाएँ देखी गईं",
    logout: "लॉगआउट",
    logoutNotice: "लॉगआउट की सुविधा बाद में Authentication से जोड़ी जाएगी।",
    keepMoving: "आगे बढ़ते रहें",
    keepMovingDescription:
      "आज के छोटे कदम कल बड़े अवसर बनाते हैं।",
    profileSaved: "प्रोफाइल सफलतापूर्वक सेव हो गई।",
    projectNameRequired: "प्रोजेक्ट का नाम लिखें।",
    projectAdded: "प्रोजेक्ट इस सेशन में जोड़ दिया गया है।",
    emailRequired:
      "आवेदन करने से पहले मेरी प्रोफाइल में ईमेल लिखकर सेव करें।",
    sampleCannotApply:
      "यह डेमो लिस्टिंग है। किसी प्रकाशित कंपनी अवसर को चुनें।",
    applicationSubmitted: "आवेदन सफलतापूर्वक जमा हो गया।",
    applicationError: "आवेदन जमा नहीं हो पाया।",
    courseNotice: "कोर्स लेसन की सुविधा आगे जोड़ी जाएगी।",
    mcqNotice: "MCQ टेस्ट सिस्टम आगे जोड़ा जाएगा।",
    writtenNotice: "लिखित टेस्ट सिस्टम आगे जोड़ा जाएगा।",
    interviewNotice: "मॉक इंटरव्यू की सुविधा आगे जोड़ी जाएगी।",
    languageChanged: "भाषा की पसंद अपडेट हो गई।",
    student: "विद्यार्थी",
    preferredLanguage: "पसंदीदा भाषा",
    courseDSA: "डेटा स्ट्रक्चर और एल्गोरिदम",
    courseReact: "React डेवलपमेंट",
    courseCommunication: "इंटरव्यू कम्युनिकेशन",
    footerNote: "सीखें · अभ्यास करें · आगे बढ़ें",
    logoutNotConnected: "लॉगआउट की सुविधा बाद में जोड़ी जाएगी।",
    applicationNotOpen: "अभी आवेदन शुरू नहीं हुए हैं।",
    applicationClosed: "आवेदन की अंतिम तारीख निकल चुकी है।",
  },
};

// Other supported languages use English fallback for untranslated
// dashboard labels. Their language selection and saved preference work.
// ==========================================
// STORAGE HELPERS
// ==========================================

const PROFILE_KEY = "careerforge_student_profile";
const CURRENT_STUDENT_KEY = "careerforge_current_student";
const JOBS_KEY = "careerforge_company_jobs";

function readJSON(key, fallback = {}) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function readCurrentStudent() {
  return readJSON(CURRENT_STUDENT_KEY, {});
}

function readProfile() {
  const saved = readJSON(PROFILE_KEY, {});
  const student = readCurrentStudent();

  return {
    name: saved.name || student.fullName || student.name || "",
    profileImage: saved.profileImage || student.profileImage || "",
    email: saved.email || student.email || "",
    country: saved.country || student.country || "",
    college: saved.college || student.college || "",
    education:
      saved.education ||
      [
        student.degree,
        student.branch,
        student.graduationYear,
      ].filter(Boolean).join(" - "),
    skills:
      saved.skills ||
      student.skills ||
      "React, JavaScript, HTML, CSS",
    Code2: saved.Code2 || saved.codeProfile || "",
    linkedin: saved.linkedin || "",
    preferredRole:
      saved.preferredRole ||
      student.preferredRole ||
      "MERN Stack Developer",
  };
}

// ==========================================
// DATE HELPERS
// ==========================================

function displayJobDate(value) {
  if (!value) return "Not specified";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getApplicationAvailability(job, language = "en") {
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (job.applicationStartDate) {
    const start = new Date(`${job.applicationStartDate}T00:00:00`);

    if (!Number.isNaN(start.getTime()) && todayDate < start) {
      return {
        canApply: false,
        message:
          translations[language]?.applicationNotOpen ||
          translations.en.applicationNotOpen,
      };
    }
  }

  if (job.applicationEndDate) {
    const end = new Date(`${job.applicationEndDate}T23:59:59`);

    if (!Number.isNaN(end.getTime()) && today > end) {
      return {
        canApply: false,
        message:
          translations[language]?.applicationClosed ||
          translations.en.applicationClosed,
      };
    }
  }

  return { canApply: true, message: "" };
}

// ==========================================
// COMPANY JOB NORMALIZATION
// ==========================================

function normalizeJob(job) {
  const rawCategory = String(
    job.category || job.type || "Internship"
  ).trim();

  let type = rawCategory;

  if (/intern/i.test(rawCategory)) {
    type = "Internship";
  } else if (/part[\s-]?time/i.test(rawCategory)) {
    type = "Part-time Job";
  } else if (/contract/i.test(rawCategory)) {
    type = "Contract";
  } else if (/full[\s-]?time/i.test(rawCategory)) {
    type = "Full-time Job";
  }

  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
      ? job.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const company =
    job.company ||
    job.companyName ||
    job.companyProfile?.name ||
    job.profile?.name ||
    "Company";

  const currency =
    job.stipendCurrency ||
    job.salaryCurrency ||
    "INR";

  let payLabel = job.stipend || job.salary || job.pay || "Not specified";

  if (type === "Internship") {
    if (String(job.stipendStatus).toLowerCase() === "unpaid") {
      payLabel = "Unpaid";
    } else if (job.monthlyStipend) {
      payLabel =
        `${currency} ${Number(job.monthlyStipend).toLocaleString("en-IN")} / month`;
    }
  } else if (job.minSalary || job.maxSalary) {
    const min = job.minSalary ? String(job.minSalary) : "";
    const max = job.maxSalary ? String(job.maxSalary) : "";

    payLabel = `${currency} ${min}${min && max ? " - " : ""}${max} LPA`;
  }

  return {
    ...job,
    id: job.id || job._id,
    title: job.title || "Untitled Opportunity",
    company,
    location: job.location || "Location not specified",
    type,
    mode: job.mode || job.workMode || "On-site",
    stipend: payLabel,
    skills,
    description: job.description || "No job description provided.",
    posted: job.postedAt
      ? new Date(job.postedAt).toLocaleDateString()
      : "Recently posted",
  };
}

function loadPublishedCompanyJobs() {
  try {
    const utilityJobs = getCompanyJobs();
    const storedJobs = readJSON(JOBS_KEY, []);

    const combinedJobs = [
      ...(Array.isArray(utilityJobs) ? utilityJobs : []),
      ...(Array.isArray(storedJobs) ? storedJobs : []),
    ];

    const uniqueJobs = new Map();

    combinedJobs.forEach((job, index) => {
      if (!job) return;

      if (String(job.status || "").toLowerCase() !== "published") {
        return;
      }

      const key = String(
        job.id ||
        job._id ||
        `${job.title || "job"}-${job.company || job.companyName || index}`
      );

      uniqueJobs.set(key, job);
    });

    return Array.from(uniqueJobs.values());
  } catch (error) {
    console.error("Unable to load company opportunities:", error);
    return [];
  }
}

// ==========================================
// SAMPLE DATA
// ==========================================

const platforms = [
  {
    name: "LeetCode",
    description: "Interview preparation and coding problems",
    url: "https://leetcode.com/",
    color: "#f5a623",
    letter: "L",
  },
  {
    name: "GeeksforGeeks",
    description: "Topic-wise DSA practice and tutorials",
    url: "https://www.geeksforgeeks.org/",
    color: "#2f9e44",
    letter: "G",
  },
  {
    name: "HackerRank",
    description: "Coding challenges and skill practice",
    url: "https://www.hackerrank.com/",
    color: "#16864a",
    letter: "H",
  },
  {
    name: "Codeforces",
    description: "Competitive programming and contests",
    url: "https://codeforces.com/",
    color: "#3478c9",
    letter: "C",
  },
  {
    name: "CodeChef",
    description: "Programming practice and contests",
    url: "https://www.codechef.com/",
    color: "#8a5a36",
    letter: "C",
  },
];

const initialJobs = [
  {
    id: "demo-1",
    title: "Frontend Developer Intern",
    company: "Example Technology Company",
    location: "Remote",
    category: "Internship",
    type: "Internship",
    mode: "Remote",
    stipend: "To be announced",
    skills: ["React", "JavaScript", "CSS"],
    description:
      "Work on frontend development and responsive interfaces.",
    status: "Demo listing",
    posted: "Sample",
  },
  {
    id: "demo-2",
    title: "MERN Stack Developer",
    company: "Example Software Company",
    location: "Hybrid",
    category: "Full-time Job",
    type: "Full-time Job",
    mode: "Hybrid",
    stipend: "To be announced",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    description:
      "Build and maintain full-stack web applications.",
    status: "Demo listing",
    posted: "Sample",
  },
  {
    id: "demo-3",
    title: "Flutter Developer Intern",
    company: "Example Product Company",
    location: "Remote",
    category: "Internship",
    type: "Internship",
    mode: "Remote",
    stipend: "To be announced",
    skills: ["Flutter", "Dart", "REST API"],
    description:
      "Develop mobile application features with Flutter.",
    status: "Demo listing",
    posted: "Sample",
  },
];

const initialCourses = [
  {
    titleKey: "courseDSA",
    progress: 65,
    lessons: "13 of 20 lessons",
    color: "#438b70",
  },
  {
    titleKey: "courseReact",
    progress: 40,
    lessons: "8 of 20 lessons",
    color: "#5488d8",
  },
  {
    titleKey: "courseCommunication",
    progress: 25,
    lessons: "5 of 20 lessons",
    color: "#a27bd1",
  },
];

const navItems = [
  { id: "overview", icon: LayoutDashboard },
  { id: "profile", icon: UserRound },
  { id: "learning", icon: BookOpen },
  { id: "dsa", icon: Code2 },
  { id: "assessments", icon: ClipboardCheck },
  { id: "projects", icon: FolderGit2 },
  { id: "jobs", icon: BriefcaseBusiness },
  { id: "applications", icon: FileText },
  { id: "achievements", icon: Award },
  { id: "mira", icon: BrainCircuit },
];

// ==========================================
// MAIN STUDENT DASHBOARD
// ==========================================

function getVoiceLanguage(language) {
  const normalizedLanguage = String(language || "en")
    .toLowerCase()
    .replace("_", "-");
  const voiceMap = {
    en: "en-IN",
    "en-in": "en-IN",
    hi: "hi-IN",
    hinglish: "hi-IN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    ar: "ar-SA",
    pt: "pt-BR",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
  };

  return voiceMap[normalizedLanguage] ||
    voiceMap[normalizedLanguage.split("-")[0]] ||
    "en-US";
}

export function VoiceGuide({ profile, pageContext, onNavigate }) {
  const supported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const [status, setStatus] = useState(
    supported ? "microphoneOff" : "unsupported"
  );
  const [wakeEnabled, setWakeEnabled] = useState(false);
  const [voiceLanguageOverride, setVoiceLanguageOverride] = useState(null);
  const voiceLanguage =
    voiceLanguageOverride || normalizeLanguage(profile.language || "en");
  const [statusDetail, setStatusDetail] = useState(
    supported
      ? "Microphone listening starts only after you enable wake word or select Ask now."
      : "Speech recognition is not supported by this browser."
  );
  const [recognizedQuestion, setRecognizedQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [repeatResponse, setRepeatResponse] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);
  const recognitionStartingRef = useRef(false);
  const microphoneRequestRef = useRef(false);
  const recognitionNoSpeechRef = useRef(false);
  const recognitionFailureRef = useRef(false);
  const recognitionModeRef = useRef("wake");
  const wakeEnabledRef = useRef(false);
  const microphoneGrantedRef = useRef(false);
  const processingRef = useRef(false);
  const pendingQuestionRef = useRef("");
  const currentSpeechRef = useRef("");
  const speechSequenceRef = useRef(0);
  const voiceRequestIdRef = useRef(0);
  const requestControllerRef = useRef(null);
  const restartTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const lastResponseRef = useRef("");
  const handleVoiceRequestRef = useRef(null);
  const startRecognitionRef = useRef(null);
  const speakResponseRef = useRef(null);
  const [listeningMode, setListeningMode] = useState("wake");

  const setRecognitionMode = useCallback((mode) => {
    recognitionModeRef.current = mode;
    setListeningMode(mode);
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return undefined;

    const refreshVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) setAvailableVoices(voices);
    };
    refreshVoices();
    let previousVoicesChanged;
    if (window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    } else {
      previousVoicesChanged = window.speechSynthesis.onvoiceschanged;
      window.speechSynthesis.onvoiceschanged = (event) => {
        previousVoicesChanged?.call(window.speechSynthesis, event);
        refreshVoices();
      };
    }

    let pollCount = 0;
    const voicePoll = window.setInterval(() => {
      refreshVoices();
      pollCount += 1;
      if (pollCount >= 20) window.clearInterval(voicePoll);
    }, 250);

    return () => {
      window.clearInterval(voicePoll);
      if (window.speechSynthesis.removeEventListener) {
        window.speechSynthesis.removeEventListener("voiceschanged", refreshVoices);
      } else if (window.speechSynthesis.onvoiceschanged !== previousVoicesChanged) {
        window.speechSynthesis.onvoiceschanged = previousVoicesChanged || null;
      }
    };
  }, []);

  const speakResponse = useCallback(
    (message, onComplete, finalStatus) => {
      if (
        !message ||
        !("speechSynthesis" in window) ||
        typeof window.SpeechSynthesisUtterance !== "function"
      ) {
        setStatus("synthesisUnsupported");
        setStatusDetail("Spoken responses are not supported by this browser.");
        wakeEnabledRef.current = false;
        microphoneGrantedRef.current = false;
        recognitionFailureRef.current = true;
        processingRef.current = false;
        setWakeEnabled(false);
        recognitionRef.current?.stop();
        return;
      }

      const speechSequence = ++speechSequenceRef.current;
      const preferredLocale = getVoiceLanguage(voiceLanguage);
      const preferredLanguage = preferredLocale.split("-")[0].toLowerCase();
      const languageVoices = availableVoices.filter((voice) => {
        const voiceLanguage = voice.lang?.toLowerCase();
        return (
          voiceLanguage === preferredLanguage ||
          voiceLanguage?.startsWith(`${preferredLanguage}-`)
        );
      });
      const preferredVoice =
        languageVoices.find(
          (voice) =>
            voice.lang?.toLowerCase() === preferredLocale.toLowerCase()
        ) ||
        (preferredLanguage === "en" && languageVoices[0]) ||
        null;

      if (!preferredVoice) {
        setStatus("voiceUnavailable");
        setStatusDetail(
          preferredLanguage === "hi"
            ? "No Hindi speech voice is installed or available in this browser. Add a Hindi text-to-speech voice in system settings, then try again."
            : `No ${preferredLanguage === "en" ? "English" : preferredLanguage} speech voice is available in this browser.`
        );
        wakeEnabledRef.current = false;
        microphoneGrantedRef.current = false;
        recognitionFailureRef.current = true;
        processingRef.current = false;
        pendingQuestionRef.current = "";
        setWakeEnabled(false);
        recognitionRef.current?.stop();
        return;
      }

      window.speechSynthesis.cancel();
      currentSpeechRef.current = message
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new window.SpeechSynthesisUtterance(message);
      utterance.lang = preferredLocale;
      utterance.voice = preferredVoice;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => {
        if (speechSequence !== speechSequenceRef.current) return;
        setStatus("speaking");
        if (
          microphoneGrantedRef.current &&
          document.visibilityState === "visible"
        ) {
          startRecognitionRef.current?.("interrupt");
        }
      };
      utterance.onend = () => {
        if (speechSequence !== speechSequenceRef.current) return;
        currentSpeechRef.current = "";
        if (onComplete) {
          onComplete();
        } else if (finalStatus) {
          setStatus(finalStatus);
        } else if (
          wakeEnabledRef.current &&
          document.visibilityState === "visible"
        ) {
          startRecognitionRef.current?.("wake");
        } else {
          setStatus(
            wakeEnabledRef.current && document.visibilityState !== "visible"
              ? "paused"
              : "idle"
          );
        }
      };
      utterance.onerror = () => {
        if (speechSequence !== speechSequenceRef.current) return;
        currentSpeechRef.current = "";
        setStatus("synthesisError");
        setStatusDetail(
          "The browser could not play this spoken response. Check your device audio settings and try again."
        );
        wakeEnabledRef.current = false;
        microphoneGrantedRef.current = false;
        recognitionFailureRef.current = true;
        processingRef.current = false;
        pendingQuestionRef.current = "";
        setWakeEnabled(false);
        recognitionRef.current?.stop();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        if (speechSequence !== speechSequenceRef.current) return;
        currentSpeechRef.current = "";
        setStatus("synthesisError");
        setStatusDetail(error.message || "Unable to start spoken playback.");
        wakeEnabledRef.current = false;
        microphoneGrantedRef.current = false;
        recognitionFailureRef.current = true;
        processingRef.current = false;
        pendingQuestionRef.current = "";
        setWakeEnabled(false);
        recognitionRef.current?.stop();
      }
    },
    [availableVoices, voiceLanguage]
  );

  const stopSpeech = useCallback(() => {
    wakeEnabledRef.current = false;
    microphoneGrantedRef.current = false;
    setWakeEnabled(false);
    recognitionFailureRef.current = true;
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    voiceRequestIdRef.current += 1;
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    speechSequenceRef.current += 1;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    currentSpeechRef.current = "";
    setStatusDetail("");
    processingRef.current = false;
    if (recognitionActiveRef.current) {
      recognitionRef.current?.stop();
    }
    setStatus("idle");
  }, []);

  const handleVoiceRequest = useCallback(
    async (userMessage) => {
      const trimmedMessage = String(userMessage || "").trim();

      if (!trimmedMessage) {
        processingRef.current = false;
        if (wakeEnabledRef.current) {
          startRecognitionRef.current?.("wake");
        }
        return;
      }

      setRecognizedQuestion(trimmedMessage);
      setAiResponse("");
      setStatusDetail("");
      setStatus("processing");
      const requestId = ++voiceRequestIdRef.current;

      const command = trimmedMessage
        .toLocaleLowerCase()
        .replace(/[.!?。؟]+$/g, "")
        .trim();

      if (
        /^(repeat|repeat that|explain again|say that again|एक बार फिर|फिर से समझाओ)$/.test(
          command
        )
      ) {
        processingRef.current = false;
        speakResponse(
          lastResponseRef.current || "There is no previous answer to repeat yet."
        );
        return;
      }

      if (/^(stop|stop speaking|रुको|बंद करो)$/.test(command)) {
        stopSpeech();
        return;
      }

      const navigationRequest = command.match(
        /^(?:open|go to|show|navigate to)\s+(?:the\s+)?(.+)$/
      );
      if (navigationRequest) {
        const destination = navigationRequest[1];
        const navigationTargets = [
          { page: "learning", match: /\b(learn|learning|course|courses)\b/ },
          { page: "jobs", match: /\b(jobs?|internships?)\b/ },
          { page: "profile", match: /\bprofile\b/ },
          { page: "projects", match: /\bprojects?\b/ },
          { page: "dsa", match: /\b(coding|practice|dsa)\b/ },
          { page: "assessments", match: /\b(assessments?|tests?)\b/ },
          { page: "applications", match: /\bapplications?\b/ },
          { page: "achievements", match: /\bachievements?\b/ },
          { page: "overview", match: /\b(dashboard|overview)\b/ },
        ];
        const target = navigationTargets.find((item) =>
          item.match.test(destination)
        );

        if (target) {
          processingRef.current = false;
          onNavigate(target.page);
          const navReply =
            voiceLanguage === "hi"
              ? "ठीक है, मैं वह सेक्शन खोल रहा हूँ।"
              : `Opening ${target.page === "dsa" ? "coding practice" : target.page}.`;
          lastResponseRef.current = navReply;
          setRepeatResponse(navReply);
          speakResponse(navReply);
          return;
        }
      }

      const request =
        command === "continue" || command === "continue please"
          ? "Continue the previous explanation from where you left off."
          : trimmedMessage;

      setStatus("processing");
      const token = localStorage.getItem("careerforge_student_token");

      if (!token) {
        processingRef.current = false;
        const message = "Please log in to use your private voice guide.";
        setStatusDetail(message);
        wakeEnabledRef.current = false;
        recognitionFailureRef.current = true;
        setWakeEnabled(false);
        recognitionRef.current?.stop();
        speakResponse(message, undefined, "authRequired");
        return;
      }

      const controller = new AbortController();
      requestControllerRef.current = controller;
      try {
        const result = await fetch(`${API_BASE_URL}/api/ai/voice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: request,
            preferredLanguage: voiceLanguage,
            pageContext: `${window.location.pathname} — ${pageContext}`,
          }),
          signal: controller.signal,
        });
        const data = await result.json().catch(() => ({}));
        if (requestId !== voiceRequestIdRef.current) return;

        if (!result.ok) {
          const error = new Error(
            data?.message || "CareerForge AI could not answer this request."
          );
          error.responseStatus = result.status;
          throw error;
        }

        const responseText = data.reply;
        if (typeof responseText !== "string" || !responseText.trim()) {
          throw new Error("The AI service returned no spoken answer.");
        }

        lastResponseRef.current = responseText.trim();
        setRepeatResponse(responseText.trim());
        setAiResponse(responseText.trim());
        processingRef.current = false;
        setStatusDetail("");
        speakResponse(responseText);
      } catch (error) {
        if (requestId !== voiceRequestIdRef.current || error?.name === "AbortError") {
          return;
        }
        processingRef.current = false;
        const responseStatus = error?.responseStatus;
        const failureStatus =
          responseStatus === 401 || responseStatus === 403
            ? "authRequired"
            : responseStatus === 429
              ? "rateLimited"
              : error instanceof TypeError
                ? "networkError"
                : "aiUnavailable";
        const failureMessage =
          error?.message ||
          "CareerForge AI is temporarily unavailable. Please try again.";
        setStatusDetail(failureMessage);
        wakeEnabledRef.current = false;
        recognitionFailureRef.current = true;
        setWakeEnabled(false);
        recognitionRef.current?.stop();
        speakResponse(failureMessage, undefined, failureStatus);
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
        }
      }
    },
    [
      onNavigate,
      pageContext,
      voiceLanguage,
      speakResponse,
      stopSpeech,
    ]
  );

  useEffect(() => {
    handleVoiceRequestRef.current = handleVoiceRequest;
  }, [handleVoiceRequest]);
  useEffect(() => {
    speakResponseRef.current = speakResponse;
  }, [speakResponse]);

  const startRecognition = useCallback(
    (mode = "wake") => {
      const recognition = recognitionRef.current;
      if (
        !recognition ||
        document.visibilityState !== "visible" ||
        processingRef.current
      ) {
        return;
      }

      if (mode === "wake" && !wakeEnabledRef.current) {
        return;
      }

      if (recognitionStartingRef.current) {
        if (recognitionModeRef.current !== mode) {
          setRecognitionMode(mode);
        }
        return;
      }

      if (recognitionActiveRef.current) {
        if (recognitionModeRef.current === mode) return;
        setRecognitionMode(mode);
        recognition.stop();
        return;
      }

      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }

      setRecognitionMode(mode);
      recognition.lang = getVoiceLanguage(voiceLanguage);
      recognitionFailureRef.current = false;
      recognitionNoSpeechRef.current = false;
      recognitionStartingRef.current = true;
      setStatusDetail("");
      try {
        recognition.start();
      } catch (error) {
        recognitionStartingRef.current = false;
        if (error.name !== "InvalidStateError") {
          recognitionFailureRef.current = true;
          setStatus(
            error.name === "NotAllowedError"
              ? "permissionDenied"
              : "networkError"
          );
          setStatusDetail(
            error.message || "The browser could not start speech recognition."
          );
        }
      }
    },
    [setRecognitionMode, voiceLanguage]
  );

  useEffect(() => {
    startRecognitionRef.current = startRecognition;
  }, [startRecognition]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = getVoiceLanguage(voiceLanguage);

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];
      if (!result?.isFinal) return;

      const transcript = String(result[0]?.transcript || "").trim();
      if (!transcript) return;
      const mode = recognitionModeRef.current;

      if (mode === "interrupt") {
        const normalized = transcript
          .toLocaleLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, " ")
          .replace(/\s+/g, " ")
          .trim();
        const spoken = currentSpeechRef.current;
        const wordCount = normalized.split(" ").filter(Boolean).length;
        const matchesSpeech =
          spoken &&
          (spoken.includes(normalized) ||
            normalized.includes(spoken) ||
            (wordCount > 2 &&
              normalized
                .split(" ")
                .filter((word) => spoken.split(" ").includes(word)).length /
                wordCount >
                0.7));

        if (matchesSpeech) return;

        if ("speechSynthesis" in window) {
          speechSequenceRef.current += 1;
          window.speechSynthesis.cancel();
        }
        currentSpeechRef.current = "";
        processingRef.current = true;
        setRecognitionMode("processing");
        recognition.stop();
        handleVoiceRequestRef.current?.(transcript);
        return;
      }

      if (mode === "wake") {
        const wakePattern = /(?:\bhey\s+)?\bmira\b|(?:हे\s*)?मीरा|मिरा/i;
        const match = wakePattern.exec(transcript);
        if (!match) return;

        const question = transcript
          .slice(match.index + match[0].length)
          .replace(/^[\s,.:;!?-]+/, "")
          .trim();
        pendingQuestionRef.current = question;
        processingRef.current = true;
        setRecognitionMode("acknowledging");
        recognition.stop();
        speakResponseRef.current?.(
          "Yes, I'm listening. How can I help you?",
          () => {
            const pending = pendingQuestionRef.current;
            pendingQuestionRef.current = "";
            if (pending) {
              handleVoiceRequestRef.current?.(pending);
              return;
            }

            if (wakeEnabledRef.current) {
              processingRef.current = false;
              startRecognitionRef.current?.("question");
            }
          }
        );
        return;
      }

      if (mode === "question") {
        processingRef.current = true;
        setRecognitionMode("processing");
        recognition.stop();
        handleVoiceRequestRef.current?.(transcript);
      }
    };

    recognition.onerror = (event) => {
      recognitionActiveRef.current = false;
      recognitionStartingRef.current = false;
      if (event.error === "not-allowed") {
        recognitionFailureRef.current = true;
        wakeEnabledRef.current = false;
        microphoneGrantedRef.current = false;
        setWakeEnabled(false);
        setStatus("permissionDenied");
        setStatusDetail(
          "Microphone permission was denied. Allow microphone access for CareerForge in your browser settings."
        );
        return;
      }

      if (event.error === "network") {
        recognitionFailureRef.current = true;
        wakeEnabledRef.current = false;
        microphoneGrantedRef.current = false;
        setWakeEnabled(false);
        setStatus("networkError");
        setStatusDetail(
          "The browser speech-recognition service could not be reached. Check your connection or try Chrome or Edge outside this embedded browser."
        );
        return;
      }

      if (event.error === "service-not-allowed") {
        recognitionFailureRef.current = true;
        wakeEnabledRef.current = false;
        setWakeEnabled(false);
        setStatus("unsupported");
        setStatusDetail(
          "This browser does not allow its speech-recognition service. Try Chrome or Edge."
        );
        return;
      }

      if (event.error === "audio-capture") {
        recognitionFailureRef.current = true;
        wakeEnabledRef.current = false;
        setWakeEnabled(false);
        setStatus("microphoneUnavailable");
        setStatusDetail(
          "No usable microphone was found. Connect or enable a microphone, then try again."
        );
        return;
      }

      if (event.error === "language-not-supported") {
        recognitionFailureRef.current = true;
        wakeEnabledRef.current = false;
        setWakeEnabled(false);
        setStatus("languageUnsupported");
        setStatusDetail(
          `Speech recognition does not support ${getVoiceLanguage(voiceLanguage)} in this browser.`
        );
        return;
      }

      if (event.error === "no-speech") {
        if (recognitionModeRef.current === "question") {
          setRecognitionMode(
            wakeEnabledRef.current ? "wake" : "question"
          );
          recognitionNoSpeechRef.current = !wakeEnabledRef.current;
          setStatus(wakeEnabledRef.current ? "listening" : "noSpeech");
          setStatusDetail(
            wakeEnabledRef.current
              ? "No speech was detected. MIRA is still listening for its wake word."
              : "No speech was detected. Select Ask now and try again."
          );
        }
        return;
      }

      if (event.error !== "aborted") {
        recognitionFailureRef.current = true;
        wakeEnabledRef.current = false;
        setWakeEnabled(false);
        setStatus("networkError");
        setStatusDetail(
          event.message ||
            `Speech recognition failed (${event.error || "unknown error"}). Try again or use a supported browser.`
        );
      }
    };

    recognition.onstart = () => {
      recognitionStartingRef.current = false;
      recognitionActiveRef.current = true;
      recognitionFailureRef.current = false;
      recognitionNoSpeechRef.current = false;
      if (recognitionModeRef.current !== "interrupt") {
        setStatus("listening");
      }
    };

    recognition.onend = () => {
      recognitionActiveRef.current = false;
      recognitionStartingRef.current = false;
      if (recognitionFailureRef.current) return;
      if (
        !wakeEnabledRef.current ||
        document.visibilityState !== "visible" ||
        processingRef.current
      ) {
        if (!wakeEnabledRef.current) {
          setStatus(recognitionNoSpeechRef.current ? "noSpeech" : "idle");
        }
        return;
      }

      const nextMode =
        window.speechSynthesis?.speaking
          ? "interrupt"
          : recognitionModeRef.current === "question"
            ? "question"
            : "wake";
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
      }
      restartTimerRef.current = window.setTimeout(
        () => startRecognitionRef.current?.(nextMode),
        500
      );
    };

    recognitionRef.current = recognition;
    if (wakeEnabledRef.current) {
      startRecognitionRef.current?.("wake");
    }

    return () => {
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      recognitionActiveRef.current = false;
      recognitionStartingRef.current = false;
      recognitionFailureRef.current = true;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onstart = null;
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [setRecognitionMode, voiceLanguage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        if (restartTimerRef.current) {
          window.clearTimeout(restartTimerRef.current);
          restartTimerRef.current = null;
        }
        recognitionFailureRef.current = true;
        recognitionRef.current?.stop();
        speechSequenceRef.current += 1;
        window.speechSynthesis?.cancel();
        currentSpeechRef.current = "";
        setStatus(wakeEnabledRef.current ? "paused" : "idle");
        return;
      }

      if (wakeEnabledRef.current) {
        startRecognitionRef.current?.("wake");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(
    () => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        wakeEnabledRef.current = false;
        voiceRequestIdRef.current += 1;
        requestControllerRef.current?.abort();
        requestControllerRef.current = null;
        if (restartTimerRef.current) {
          window.clearTimeout(restartTimerRef.current);
          restartTimerRef.current = null;
        }
        recognitionRef.current?.stop();
        speechSequenceRef.current += 1;
        window.speechSynthesis?.cancel();
      };
    },
    []
  );

  const enableWakeWord = async () => {
    if (!supported || !recognitionRef.current) {
      setStatus("unsupported");
      setStatusDetail("Speech recognition is not supported by this browser.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setStatusDetail("This browser does not provide microphone access.");
      return;
    }

    if (!window.isSecureContext) {
      setStatus("secureContextRequired");
      setStatusDetail("Microphone access requires HTTPS or localhost.");
      return;
    }

    if (microphoneRequestRef.current) return;
    microphoneRequestRef.current = true;
    try {
      setStatus("requestingPermission");
      setStatusDetail("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      if (!mountedRef.current) return;
      microphoneGrantedRef.current = true;
      wakeEnabledRef.current = true;
      setWakeEnabled(true);
      startRecognitionRef.current?.("wake");
    } catch (error) {
      if (!mountedRef.current) return;
      microphoneGrantedRef.current = false;
      const denied =
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError";
      setStatus(
        denied
          ? "permissionDenied"
          : error.name === "NotFoundError" || error.name === "NotReadableError"
            ? "microphoneUnavailable"
            : "networkError"
      );
      setStatusDetail(
        denied
          ? "Microphone permission was denied. Allow microphone access for CareerForge in your browser settings."
          : error.message || "Unable to access the microphone."
      );
    } finally {
      microphoneRequestRef.current = false;
    }
  };

  const askNow = async () => {
    if (!supported || !recognitionRef.current) {
      setStatus("unsupported");
      setStatusDetail("Speech recognition is not supported by this browser.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setStatusDetail("This browser does not provide microphone access.");
      return;
    }

    if (!window.isSecureContext) {
      setStatus("secureContextRequired");
      setStatusDetail("Microphone access requires HTTPS or localhost.");
      return;
    }

    if (microphoneRequestRef.current) return;
    microphoneRequestRef.current = true;
    try {
      setStatus("requestingPermission");
      setStatusDetail("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      if (!mountedRef.current) return;
      microphoneGrantedRef.current = true;
      processingRef.current = false;
      startRecognitionRef.current?.("question");
    } catch (error) {
      if (!mountedRef.current) return;
      microphoneGrantedRef.current = false;
      const denied =
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError";
      setStatus(
        denied
          ? "permissionDenied"
          : error.name === "NotFoundError" || error.name === "NotReadableError"
            ? "microphoneUnavailable"
            : "networkError"
      );
      setStatusDetail(
        denied
          ? "Microphone permission was denied. Allow microphone access for CareerForge in your browser settings."
          : error.message || "Unable to access the microphone."
      );
    } finally {
      microphoneRequestRef.current = false;
    }
  };

  const pauseWakeWord = () => {
    wakeEnabledRef.current = false;
    microphoneGrantedRef.current = false;
    setWakeEnabled(false);
    processingRef.current = false;
    voiceRequestIdRef.current += 1;
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    pendingQuestionRef.current = "";
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    recognitionFailureRef.current = true;
    recognitionRef.current?.stop();
    speechSequenceRef.current += 1;
    window.speechSynthesis?.cancel();
    currentSpeechRef.current = "";
    setStatus("paused");
    setStatusDetail("");
  };

  const languageLocked = [
    "listening",
    "requestingPermission",
    "processing",
    "speaking",
  ].includes(status);

  const reviewMemory = async () => {
    const token = localStorage.getItem("careerforge_student_token");
    if (!token) {
      speakResponse("Please log in to review your private AI memory.");
      return;
    }

    setStatus("processing");
    try {
      const result = await fetch(`${API_BASE_URL}/api/ai/memory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await result.json().catch(() => ({}));

      if (!result.ok || !data.memory) {
        throw new Error(data.message || "Unable to load your AI memory.");
      }

      const memory = data.memory;
      const turns = Math.floor((memory.messages?.length || 0) / 2);
      const lastInteraction = memory.lastInteractionAt
        ? new Date(memory.lastInteractionAt).toLocaleString(
            getVoiceLanguage(voiceLanguage)
          )
        : "none recorded yet";
      const rememberedRole = memory.profileSnapshot?.preferredRole
        ? ` Your target career is ${memory.profileSnapshot.preferredRole}.`
        : "";
      const summary = `Your private memory contains ${turns} saved conversation turns. Your first recorded interaction was ${
        memory.firstInteractionAt
          ? new Date(memory.firstInteractionAt).toLocaleString(
              getVoiceLanguage(voiceLanguage)
            )
          : "not recorded yet"
      }, and your last interaction was ${lastInteraction}.${rememberedRole}`;
      lastResponseRef.current = summary;
      setRepeatResponse(summary);
      speakResponse(summary);
    } catch (error) {
      speakResponse(error.message || "Unable to load your AI memory.");
    }
  };

  const clearMemory = async () => {
    if (
      !window.confirm(
        "Delete your private CareerForge AI memory? This cannot be undone."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("careerforge_student_token");
    if (!token) {
      speakResponse("Please log in to delete your private AI memory.");
      return;
    }

    setStatus("processing");
    try {
      const result = await fetch(`${API_BASE_URL}/api/ai/memory`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await result.json().catch(() => ({}));
      if (!result.ok) {
        throw new Error(data.message || "Unable to delete your AI memory.");
      }

      lastResponseRef.current = "";
      setRepeatResponse("");
      speakResponse("Your private CareerForge AI memory has been deleted.");
    } catch (error) {
      speakResponse(error.message || "Unable to delete your AI memory.");
    }
  };

  const statusLabels = {
    idle: "Microphone off",
    microphoneOff: "Microphone off",
    listening:
      listeningMode === "question"
        ? "Listening for your question"
        : wakeEnabled
          ? "Listening for wake word"
          : "Listening",
    requestingPermission: "Requesting microphone permission",
    processing: "Processing",
    speaking: "Speaking",
    paused: "Paused",
    noSpeech: "No speech detected",
    permissionDenied: "Microphone permission denied",
    unsupported: "Speech recognition unsupported",
    networkError: "Network error",
    microphoneUnavailable: "Microphone unavailable",
    languageUnsupported: "Language unavailable",
    voiceUnavailable: "Selected language voice unavailable",
    synthesisUnsupported: "Spoken responses unsupported",
    synthesisError: "Speech playback error",
    aiUnavailable: "AI service unavailable",
    authRequired: "Sign-in required",
    rateLimited: "AI request limit reached",
    secureContextRequired: "Secure connection required",
  };
  const indicatorLabel = statusLabels[status] || "Voice ready";

  return (
    <aside className="cf-voice-guide" aria-label="MIRA voice assistant">
      <div className="cf-voice-header">
        <div className="cf-voice-icon">
          <BrainCircuit size={20} />
        </div>
        <div>
          <span className="cf-voice-label">MIRA · Personal AI Companion</span>
          <strong>{profile.name || "Student"}</strong>
        </div>
      </div>

      <div
        className={`cf-voice-status cf-voice-status-${status}`}
        role="status"
        aria-live="polite"
      >
        <span className="cf-voice-dot" />
        <span>{indicatorLabel}</span>
      </div>
      {statusDetail && (
        <p className="cf-voice-detail" role="status">
          {statusDetail}
        </p>
      )}

      <label className="cf-voice-language">
        <span>Voice language</span>
        <select
          value={voiceLanguage}
          onChange={(event) => {
            setVoiceLanguageOverride(event.target.value);
            setStatusDetail("");
          }}
          disabled={!supported || languageLocked}
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.nativeName} ({language.name})
            </option>
          ))}
        </select>
      </label>

      {(recognizedQuestion || aiResponse) && (
        <div className="cf-voice-transcript" aria-live="polite">
          {recognizedQuestion && (
            <p>
              <strong>You said</strong>
              <span>{recognizedQuestion}</span>
            </p>
          )}
          {aiResponse && (
            <p>
              <strong>MIRA</strong>
              <span>{aiResponse}</span>
            </p>
          )}
        </div>
      )}

      <div className="cf-voice-actions">
        <button
          type="button"
          className="cf-voice-button cf-voice-primary"
          onClick={wakeEnabled ? pauseWakeWord : enableWakeWord}
          aria-label={
            wakeEnabled
              ? "Pause MIRA wake word"
              : status === "paused"
                ? "Resume MIRA listening"
                : "Enable MIRA wake word"
          }
          disabled={!supported || status === "requestingPermission"}
        >
          {wakeEnabled ? <Pause size={17} /> : <Radio size={18} />}
          {wakeEnabled
            ? "Pause wake word"
            : status === "paused"
              ? "Resume listening"
              : "Enable wake word"}
        </button>
        <button
          type="button"
          className="cf-voice-button cf-voice-secondary"
          onClick={askNow}
          aria-label="Ask MIRA now"
          disabled={!supported || status === "requestingPermission"}
        >
          <Mic size={17} />
          Ask now
        </button>
        <button
          type="button"
          className="cf-voice-button cf-voice-secondary"
          onClick={() => speakResponse(repeatResponse)}
          aria-label="Repeat MIRA's last response"
          disabled={!repeatResponse}
        >
          <Volume2 size={16} />
          Repeat
        </button>
        <button
          type="button"
          className="cf-voice-button cf-voice-secondary"
          onClick={stopSpeech}
          aria-label="Stop MIRA"
        >
          <Square size={15} />
          Stop
        </button>
      </div>

      <div className="cf-voice-actions">
        <button
          type="button"
          className="cf-voice-button cf-voice-secondary"
          onClick={reviewMemory}
        >
          <History size={16} />
          Review memory
        </button>
        <button
          type="button"
          className="cf-voice-button cf-voice-secondary"
          onClick={clearMemory}
        >
          <Trash2 size={16} />
          Delete memory
        </button>
      </div>

      <div className="cf-voice-note">
        <Sparkles size={14} />
        <span>
          {supported
            ? "Wake-word listening starts only after you enable it, while this tab is active. Say “Hey Mira” or “Mira”. Browser speech recognition may process audio using your browser provider."
            : "This browser does not support the required speech-recognition API. Try a supported browser such as Chrome or Edge."}
        </span>
      </div>
    </aside>
  );
}

export default function StudentsDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedStudent = readCurrentStudent();

  const getSavedLanguage = () => {
    const studentLanguage = savedStudent.language;
    const globalLanguage = localStorage.getItem("careerforge_language");

    return normalizeLanguage(
      studentLanguage || globalLanguage || "en"
    );
  };

  const [language, setLanguage] = useState(getSavedLanguage);
  const [activePage, setActivePage] = useState(
    () => location.state?.activePage || "overview"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All");
  const [jobMode, setJobMode] = useState("All");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [companyJobs, setCompanyJobs] = useState(() =>
    loadPublishedCompanyJobs()
  );
  const [studentNotifications, setStudentNotifications] = useState(
    () => getStudentNotifications()
  );
  const [notice, setNotice] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  const [profile, setProfile] = useState(() => readProfile());

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "CareerForge",
      description: "Student career and placement platform",
      link: "",
    },
  ]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations.en[key] ||
      key
    );
  };

  // ======================================
  // LANGUAGE
  // ======================================

  useEffect(() => {
    try {
      setAppLanguage(language);
      localStorage.setItem("careerforge_language", language);
    } catch (error) {
      console.warn("Language preference:", error);
    }
  }, [language]);

  const handleLanguageChange = async (event) => {
    const selectedLanguage = normalizeLanguage(event.target.value);

    setLanguage(selectedLanguage);
    localStorage.setItem("careerforge_language", selectedLanguage);

    try {
      setAppLanguage(selectedLanguage);
    } catch (error) {
      console.warn("Global language update:", error);
    }

    const currentStudent = readCurrentStudent();

    if (currentStudent.email) {
      const updatedStudent = {
        ...currentStudent,
        language: selectedLanguage,
      };

      localStorage.setItem(
        CURRENT_STUDENT_KEY,
        JSON.stringify(updatedStudent)
      );

      const students = readJSON("careerforge_students", []);

      if (Array.isArray(students)) {
        const updatedStudents = students.map((student) =>
          (student.email || "").toLowerCase() ===
          (currentStudent.email || "").toLowerCase()
            ? { ...student, language: selectedLanguage }
            : student
        );

        localStorage.setItem(
          "careerforge_students",
          JSON.stringify(updatedStudents)
        );
      }
    }

    try {
      const updatedUser = await updateAuthenticatedStudent({
        language: selectedLanguage,
      });

      if (updatedUser) {
        localStorage.setItem(
          CURRENT_STUDENT_KEY,
          JSON.stringify(updatedUser)
        );
      }

      setNotice(
        translations[selectedLanguage]?.languageChanged ||
          translations.en.languageChanged
      );
    } catch (error) {
      console.error("Language preference sync error:", error);
      setNotice(
        "Language changed on this device, but could not be synced to your account."
      );
    }
  };

  // ======================================
  // NOTICE
  // ======================================

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  // ======================================
  // JOBS / NOTIFICATIONS / APPLICATIONS SYNC
  // ======================================

  useEffect(() => {
    const refreshJobs = () => {
      setCompanyJobs(loadPublishedCompanyJobs());
    };

    const refreshNotifications = () => {
      setStudentNotifications(getStudentNotifications());
    };

    const refreshApplications = () => {
      const email = (profile.email || "").trim().toLowerCase();

      let applications = [];

      try {
        applications = getJobApplications();
      } catch (error) {
        console.error("Unable to load applications:", error);
      }

      if (!Array.isArray(applications)) applications = [];

      const ownApplications = applications.filter((application) => {
        const applicationEmail = (
          application.email ||
          application.studentEmail ||
          ""
        ).trim().toLowerCase();

        return email && applicationEmail === email;
      });

      const liveJobs = loadPublishedCompanyJobs().map(normalizeJob);

      setAppliedJobs(
        ownApplications.map((application) => {
          const job = liveJobs.find(
            (item) =>
              String(item.id) === String(application.jobId)
          );

          return {
            ...(job || {}),
            id: application.jobId,
            title:
              application.jobTitle ||
              job?.title ||
              "Job opportunity",
            company:
              application.company ||
              job?.company ||
              "Company",
            type: job?.type || "Opportunity",
            applicationStatus: application.status || "Applied",
            applicationDate: application.createdAt || "",
          };
        })
      );
    };

    const refreshAll = () => {
      refreshJobs();
      refreshNotifications();
      refreshApplications();
    };

    refreshAll();

    window.addEventListener("careerforge-jobs-updated", refreshJobs);
    window.addEventListener(
      "careerforge-notifications-updated",
      refreshNotifications
    );
    window.addEventListener(
      "careerforge-applications-updated",
      refreshApplications
    );
    window.addEventListener("storage", refreshAll);
    window.addEventListener("focus", refreshAll);

    return () => {
      window.removeEventListener(
        "careerforge-jobs-updated",
        refreshJobs
      );
      window.removeEventListener(
        "careerforge-notifications-updated",
        refreshNotifications
      );
      window.removeEventListener(
        "careerforge-applications-updated",
        refreshApplications
      );
      window.removeEventListener("storage", refreshAll);
      window.removeEventListener("focus", refreshAll);
    };
  }, [profile.email]);

  // ======================================
  // JOB FILTERING
  // ======================================

  const normalizedCompanyJobs = useMemo(
    () => companyJobs.map(normalizeJob),
    [companyJobs]
  );

  const allJobs = useMemo(
    () => [...normalizedCompanyJobs, ...initialJobs],
    [normalizedCompanyJobs]
  );

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const query = search.toLowerCase().trim();

      const matchesSearch = [
        job.title,
        job.company,
        job.location,
        ...(Array.isArray(job.skills) ? job.skills : []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesType =
        jobType === "All" || job.type === jobType;

      const matchesMode =
        jobMode === "All" || job.mode === jobMode;

      return matchesSearch && matchesType && matchesMode;
    });
  }, [allJobs, search, jobType, jobMode]);

  const unreadNotificationCount = studentNotifications.filter(
    (notification) => !notification.read
  ).length;

  // ======================================
  // PROFILE
  // ======================================

  const updateProfile = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    const cleanedProfile = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
    };

    if (!cleanedProfile.email) {
      showNotice(t("emailRequired"));
      return;
    }

    try {
      const updatedUser = await updateAuthenticatedStudent({
        ...(cleanedProfile.name ? { name: cleanedProfile.name } : {}),
        skills: cleanedProfile.skills,
        college: cleanedProfile.college,
        education: cleanedProfile.education,
        githubUrl: cleanedProfile.Code2,
        linkedinUrl: cleanedProfile.linkedin,
        preferredRole: cleanedProfile.preferredRole,
        country: cleanedProfile.country,
      });

      if (updatedUser) {
        localStorage.setItem(
          CURRENT_STUDENT_KEY,
          JSON.stringify(updatedUser)
        );
      }

      setProfile(cleanedProfile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(cleanedProfile));
      showNotice(t("profileSaved"));
    } catch (error) {
      console.error("Student profile sync error:", error);
      showNotice(
        error.message || "Unable to sync your profile. Please try again."
      );
    }
  };

  // ======================================
  // APPLY FOR COMPANY JOB
  // ======================================

  const applyForJob = (job) => {
    if (job.status === "Demo listing") {
      showNotice(t("sampleCannotApply"));
      return;
    }

    if (!profile.email.trim()) {
      showNotice(t("emailRequired"));
      setActivePage("profile");
      return;
    }

    const availability = getApplicationAvailability(job, language);

    if (!availability.canApply) {
      showNotice(availability.message);
      return;
    }

    const alreadyApplied = appliedJobs.some(
      (item) => String(item.id) === String(job.id)
    );

    if (alreadyApplied) {
      showNotice("You have already applied to this opportunity.");
      return;
    }

    try {
      const application = applyForCompanyJob(job, profile);

      setAppliedJobs((previous) => [
        ...previous.filter(
          (item) => String(item.id) !== String(job.id)
        ),
        {
          ...job,
          id: application.jobId,
          applicationStatus: application.status || "Applied",
          applicationDate: application.createdAt,
        },
      ]);

      showNotice(t("applicationSubmitted"));
      window.dispatchEvent(
        new Event("careerforge-applications-updated")
      );
    } catch (error) {
      showNotice(error.message || t("applicationError"));
    }
  };

  // ======================================
  // SAVE JOB
  // ======================================

  const toggleSavedJob = (job) => {
    setSavedJobs((previous) =>
      previous.some(
        (item) => String(item.id) === String(job.id)
      )
        ? previous.filter(
            (item) => String(item.id) !== String(job.id)
          )
        : [...previous, job]
    );
  };

  // ======================================
  // CODING PLATFORM
  // ======================================

  const openPlatform = (platform) => {
    window.open(
      platform.url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ======================================
  // PROJECTS
  // ======================================

  const addProject = (event) => {
    event.preventDefault();

    if (!projectTitle.trim()) {
      showNotice(t("projectNameRequired"));
      return;
    }

    setProjects((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: projectTitle.trim(),
        description: projectDescription.trim(),
        link: projectLink.trim(),
      },
    ]);

    setProjectTitle("");
    setProjectLink("");
    setProjectDescription("");

    showNotice(t("projectAdded"));
  };

  // ======================================
  // NOTIFICATIONS
  // ======================================

  const handleNotifications = () => {
    const notifications = getStudentNotifications();

    if (!notifications.length) {
      showNotice(t("noNotifications"));
      return;
    }

    const updated = markNotificationsRead();
    setStudentNotifications(updated);

    const latest = updated[0];

    showNotice(
      latest?.message
        ? `${t("latestUpdate")}: ${latest.message}`
        : `${updated.length} ${t("notificationsChecked")}`
    );

    setActivePage("jobs");
  };

  // ======================================
  // JOB CARD
  // ======================================

  const renderJobCard = (job) => {
    const saved = savedJobs.some(
      (item) => String(item.id) === String(job.id)
    );

    const applied = appliedJobs.some(
      (item) => String(item.id) === String(job.id)
    );

    const isDemo = job.status === "Demo listing";

    const availability = isDemo
      ? {
          canApply: false,
          message: t("sampleCannotApply"),
        }
      : getApplicationAvailability(job, language);

    const displayType =
      job.type === "Internship"
        ? t("internship")
        : job.type === "Full-time Job"
          ? t("fullTime")
          : job.type;

    const displayMode =
      job.mode === "Remote"
        ? t("remote")
        : job.mode === "Hybrid"
          ? t("hybrid")
          : job.mode === "On-site"
            ? t("onsite")
            : job.mode;

    const isInternship = job.type === "Internship";

    const detailItems = isInternship
      ? [
          job.internshipWorkType &&
            `Work type: ${job.internshipWorkType}`,
          job.durationMonths &&
            `Duration: ${job.durationMonths} months`,
          job.internshipStartDate &&
            `Start: ${displayJobDate(job.internshipStartDate)}`,
          job.internshipEndDate &&
            `End: ${displayJobDate(job.internshipEndDate)}`,
          job.ppoAvailable &&
            `PPO: ${job.ppoAvailable}`,
        ].filter(Boolean)
      : [
          job.experienceLevel &&
            `Level: ${job.experienceLevel}`,
          job.fixedSalary &&
            `Fixed pay: ${job.fixedSalary} LPA`,
          job.variableSalary &&
            `Variable pay: ${job.variableSalary} LPA`,
          job.expectedJoiningDate &&
            `Joining: ${displayJobDate(job.expectedJoiningDate)}`,
        ].filter(Boolean);

    return (
      <article
        className="cf-job-card"
        key={`${job.id}-${job.company}`}
      >
        <div className="cf-job-top">
          <ProfileAvatar className="cf-company-logo" image={job.companyLogo} name={job.company} />

          <div className="cf-job-heading">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
          </div>

          <button
            type="button"
            className={`cf-icon-button ${
              saved ? "cf-saved" : ""
            }`}
            onClick={() => toggleSavedJob(job)}
            aria-label={t("saveJob")}
            title={t("saveJob")}
          >
            <Bookmark size={18} />
          </button>
        </div>

        <div className="cf-job-meta">
          <span>
            <MapPin size={15} />
            {job.location}
          </span>
          <span>
            <BriefcaseBusiness size={15} />
            {displayType}
          </span>
          <span>
            <Globe size={15} />
            {displayMode}
          </span>
        </div>

        <p className="cf-job-description">
          {job.description}
        </p>

        {job.requirements && (
          <p className="cf-job-description">
            <strong>Requirements: </strong>
            {job.requirements}
          </p>
        )}

        <div className="cf-company-job-details">
          {job.applicationStartDate && (
            <span>
              <Clock size={14} />
              Applications open:{" "}
              {displayJobDate(job.applicationStartDate)}
            </span>
          )}

          {job.applicationEndDate && (
            <span>
              <Clock size={14} />
              Deadline:{" "}
              {displayJobDate(job.applicationEndDate)}
            </span>
          )}

          {detailItems.map((detail, index) => (
            <span key={`${job.id}-detail-${index}`}>
              <CheckCircle2 size={14} />
              {detail}
            </span>
          ))}
        </div>

        <div className="cf-tags">
          {(job.skills || []).map((skill, index) => (
            <span key={`${skill}-${index}`}>
              {skill}
            </span>
          ))}
        </div>

        <div className="cf-job-bottom">
          <div>
            <strong>{job.stipend}</strong>
            <small>
              {isDemo ? t("sampleListing") : job.posted}
            </small>
          </div>

          <button
            type="button"
            className="cf-button cf-button-primary"
            onClick={() => applyForJob(job)}
            disabled={
              applied ||
              isDemo ||
              !availability.canApply
            }
            title={
              isDemo
                ? t("sampleCannotApply")
                : availability.message
            }
          >
            {applied
              ? t("applied")
              : isDemo
                ? t("sample")
                : !availability.canApply
                  ? "Not Open"
                  : t("apply")}

            {!applied &&
              !isDemo &&
              availability.canApply && (
                <ExternalLink size={15} />
              )}
          </button>
        </div>

        {!isDemo && !availability.canApply && (
          <p className="cf-job-deadline-message">
            {availability.message}
          </p>
        )}
      </article>
    );
  };

  // ======================================
  // OVERVIEW PAGE
  // ======================================

  const renderOverview = () => (
    <>
      <section className="cf-welcome">
        <div>
          <span className="cf-eyebrow">
            {t("careerEyebrow")}
          </span>

          <h2>
            {t("welcome")}
            {profile.name.trim()
              ? `, ${profile.name.trim()}`
              : "!"}
          </h2>

          <p>{t("welcomeDescription")}</p>

          <button
            className="cf-button cf-button-light"
            onClick={() => setActivePage("learning")}
          >
            {t("continueLearning")}
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="cf-welcome-art">
          <GraduationCap size={82} strokeWidth={1.25} />
        </div>
      </section>

      <section className="cf-stats-grid">
        <StatCard
          icon={BookOpen}
          label={t("coursesInProgress")}
          value={initialCourses.length}
          note={t("continueYourLearning")}
        />
        <StatCard
          icon={Code2}
          label={t("codingPlatforms")}
          value="5"
          note={t("choosePractice")}
        />
        <StatCard
          icon={BriefcaseBusiness}
          label={t("applicationCount")}
          value={appliedJobs.length}
          note={t("submittedApplications")}
        />
        <StatCard
          icon={Target}
          label={t("savedJobs")}
          value={savedJobs.length}
          note={t("opportunitiesToRevisit")}
        />
      </section>

      <div className="cf-content-grid">
        <section className="cf-panel">
          <PanelHeading
            title={t("continueCourse")}
            subtitle={t("pickUpProgress")}
            action={() => setActivePage("learning")}
            actionLabel={t("viewAll")}
          />

          <div className="cf-course-list">
            {initialCourses.map((course) => (
              <div
                className="cf-course-row"
                key={course.titleKey}
              >
                <div
                  className="cf-course-icon"
                  style={{
                    background: `${course.color}18`,
                    color: course.color,
                  }}
                >
                  <BookOpen size={21} />
                </div>

                <div className="cf-course-info">
                  <div className="cf-course-title">
                    <strong>{t(course.titleKey)}</strong>
                    <span>{course.progress}%</span>
                  </div>

                  <div className="cf-progress-track">
                    <div
                      style={{
                        width: `${course.progress}%`,
                        background: course.color,
                      }}
                    />
                  </div>

                  <small>{course.lessons}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cf-panel">
          <PanelHeading
            title={t("quickActions")}
            subtitle={t("whatToDo")}
          />

          <div className="cf-quick-actions">
            <QuickAction
              icon={Code2}
              title={t("practiceDSA")}
              subtitle={t("choosePlatform")}
              onClick={() => setActivePage("dsa")}
            />
            <QuickAction
              icon={BriefcaseBusiness}
              title={t("exploreJobs")}
              subtitle={t("findOpportunities")}
              onClick={() => setActivePage("jobs")}
            />
            <QuickAction
              icon={ClipboardCheck}
              title={t("takeAssessment")}
              subtitle={t("testKnowledge")}
              onClick={() => setActivePage("assessments")}
            />
            <QuickAction
              icon={UserRound}
              title={t("completeProfile")}
              subtitle={t("addDetails")}
              onClick={() => setActivePage("profile")}
            />
          </div>
        </section>
      </div>

      <section className="cf-panel cf-section-gap">
        <PanelHeading
          title={t("latestOpportunities")}
          subtitle={t("publishedJobs")}
          action={() => setActivePage("jobs")}
          actionLabel={t("viewAll")}
        />

        <div className="cf-jobs-grid">
          {(normalizedCompanyJobs.length
            ? normalizedCompanyJobs.slice(0, 2)
            : initialJobs.slice(0, 2)
          ).map(renderJobCard)}
        </div>
      </section>
    </>
  );

  // ======================================
  // PROFILE PAGE
  // ======================================

  const renderProfile = () => (
    <section className="cf-panel">
      <PanelHeading
        title={t("profile")}
        subtitle={t("personalProfile")}
      />

      <form
        className="cf-profile-form"
        onSubmit={saveProfile}
      >
        <div className="cf-profile-banner">
          <ProfileAvatar className="cf-avatar" image={profile.profileImage} name={profile.name} />

          <div>
            <h3>{profile.name || t("yourName")}</h3>
            <p>{profile.preferredRole}</p>
          </div>
        </div>

        <div className="cf-form-grid">
          <FormField label={t("fullName")}>
            <input
              name="name"
              value={profile.name}
              onChange={updateProfile}
              placeholder={t("enterName")}
            />
          </FormField>

          <FormField label={t("email")}>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={updateProfile}
              placeholder="you@example.com"
              required
            />
          </FormField>

          <FormField label={t("country")}>
            <input
              name="country"
              value={profile.country}
              onChange={updateProfile}
              placeholder={t("country")}
            />
          </FormField>

          <FormField label={t("college")}>
            <input
              name="college"
              value={profile.college}
              onChange={updateProfile}
              placeholder={t("college")}
            />
          </FormField>

          <FormField label={t("education")}>
            <input
              name="education"
              value={profile.education}
              onChange={updateProfile}
              placeholder={t("education")}
            />
          </FormField>

          <FormField label={t("preferredRole")}>
            <select
              name="preferredRole"
              value={profile.preferredRole}
              onChange={updateProfile}
            >
              <option>MERN Stack Developer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Flutter Developer</option>
              <option>Software Engineer</option>
              <option>Data Analyst</option>
            </select>
          </FormField>

          <FormField label={t("skills")} wide>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={updateProfile}
              placeholder="React, JavaScript, Node.js..."
              rows={3}
            />
          </FormField>

          <FormField label={t("codeProfile")}>
            <input
              name="Code2"
              value={profile.Code2}
              onChange={updateProfile}
              placeholder="Your coding profile URL"
            />
          </FormField>

          <FormField label={t("linkedinProfile")}>
            <input
              name="linkedin"
              value={profile.linkedin}
              onChange={updateProfile}
              placeholder="https://linkedin.com/in/username"
            />
          </FormField>
        </div>

        <button
          className="cf-button cf-button-primary"
          type="submit"
        >
          {t("saveProfile")}
        </button>
      </form>
    </section>
  );

  // ======================================
  // LEARNING PAGE
  // ======================================

  const renderLearning = () => (
    <section className="cf-panel">
      <PanelHeading
        title="Learning Centre"
        subtitle={t("learningDescription")}
      />

      <div className="cf-jobs-grid">
        {initialCourses.map((course) => (
          <article
            className="cf-learning-card"
            key={course.titleKey}
          >
            <div
              className="cf-large-course-icon"
              style={{
                color: course.color,
                background: `${course.color}18`,
              }}
            >
              <BookOpen size={28} />
            </div>

            <h3>{t(course.titleKey)}</h3>
            <p>{course.lessons}</p>

            <div className="cf-progress-track">
              <div
                style={{
                  width: `${course.progress}%`,
                  background: course.color,
                }}
              />
            </div>

            <div className="cf-learning-bottom">
              <span>
                {course.progress}% {t("completed")}
              </span>

              <button
                className="cf-text-button"
                onClick={() => showNotice(t("courseNotice"))}
              >
                {t("continueLearning")}
                <ChevronRight size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="cf-info-note">
        <BookOpen size={18} />
        <span>{t("courseIntegration")}</span>
      </div>
    </section>
  );

  // ======================================
  // DSA PAGE
  // ======================================

  const renderDSA = () => {
    const visiblePlatforms =
      selectedPlatform === "All"
        ? platforms
        : platforms.filter(
            (platform) =>
              platform.name === selectedPlatform
          );

    return (
      <>
        <section className="cf-welcome cf-dsa-welcome">
          <div>
            <span className="cf-eyebrow">
              {t("buildProblemSkills")}
            </span>
            <h2>{t("dsa")}</h2>
            <p>{t("platformDescription")}</p>
          </div>

          <Code2 size={72} strokeWidth={1.3} />
        </section>

        <section className="cf-panel">
          <PanelHeading
            title={t("chooseCodingPlatform")}
            subtitle={t("platformDescription")}
          />

          <div className="cf-filter-row">
            <label className="cf-search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t("searchPlatforms")}
              />
            </label>

            <select
              value={selectedPlatform}
              onChange={(event) =>
                setSelectedPlatform(event.target.value)
              }
            >
              <option value="All">{t("all")}</option>
              {platforms.map((platform) => (
                <option
                  key={platform.name}
                  value={platform.name}
                >
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div className="cf-platform-grid">
            {visiblePlatforms
              .filter((platform) =>
                platform.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((platform) => (
                <article
                  className="cf-platform-card"
                  key={platform.name}
                >
                  <div
                    className="cf-platform-brand"
                    style={{
                      color: platform.color,
                      background: `${platform.color}16`,
                    }}
                  >
                    {platform.letter}
                  </div>

                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>

                  <button
                    className="cf-button cf-button-primary cf-full-button"
                    onClick={() => openPlatform(platform)}
                  >
                    {t("startPracticing")}
                    <ExternalLink size={16} />
                  </button>
                </article>
              ))}
          </div>
        </section>

        <section className="cf-panel cf-section-gap">
          <PanelHeading
            title={t("practiceTips")}
            subtitle={t("dailyPractice")}
          />

          <div className="cf-tip-grid">
            <Tip
              icon={Target}
              title={t("startBasics")}
              text={t("basicsDescription")}
            />
            <Tip
              icon={Clock}
              title={t("practiceConsistently")}
              text={t("practiceDescription")}
            />
            <Tip
              icon={TrendingUp}
              title={t("reviewMistakes")}
              text={t("mistakesDescription")}
            />
          </div>
        </section>
      </>
    );
  };

  // ======================================
  // ASSESSMENTS PAGE
  // ======================================

  const renderAssessments = () => (
    <section className="cf-panel">
      <PanelHeading
        title={t("assessments")}
        subtitle={t("assessmentDescription")}
      />

      <div className="cf-assessment-grid">
        <AssessmentCard
          icon={CheckCircle2}
          title={t("mcq")}
          tag={t("objective")}
          text={t("mcqDescription")}
          buttonText="Start assessment"
          onClick={() => showNotice(t("mcqNotice"))}
        />

        <AssessmentCard
          icon={FileText}
          title={t("written")}
          tag={t("descriptive")}
          text={t("writtenDescription")}
          buttonText="Start assessment"
          onClick={() => showNotice(t("writtenNotice"))}
        />

        <AssessmentCard
          icon={Play}
          title={t("mockInterview")}
          tag={t("interviewPrep")}
          text={t("interviewDescription")}
          buttonText="Start assessment"
          onClick={() => showNotice(t("interviewNotice"))}
        />
      </div>
    </section>
  );

  // ======================================
  // PROJECTS PAGE
  // ======================================

  const renderProjects = () => (
    <div className="cf-page-stack">
      <section className="cf-panel">
        <PanelHeading
          title={t("projects")}
          subtitle={t("showcaseProjects")}
        />

        <form
          className="cf-project-form"
          onSubmit={addProject}
        >
          <FormField label={t("projectName")}>
            <input
              value={projectTitle}
              onChange={(event) =>
                setProjectTitle(event.target.value)
              }
              placeholder="e.g. CareerForge"
            />
          </FormField>

          <FormField label={t("projectLink")}>
            <input
              value={projectLink}
              onChange={(event) =>
                setProjectLink(event.target.value)
              }
              placeholder="https://..."
            />
          </FormField>

          <FormField label={t("projectDescription")} wide>
            <textarea
              value={projectDescription}
              onChange={(event) =>
                setProjectDescription(event.target.value)
              }
              placeholder={t("projectPlaceholder")}
              rows={3}
            />
          </FormField>

          <div>
            <button
              className="cf-button cf-button-primary"
              type="submit"
            >
              {t("addProject")}
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </section>

      <section className="cf-project-grid">
        {projects.map((project) => (
          <article
            className="cf-panel cf-project-card"
            key={project.id}
          >
            <div className="cf-project-icon">
              <FolderGit2 size={24} />
            </div>

            <h3>{project.title}</h3>
            <p>
              {project.description ||
                t("projectDescription")}
            </p>

            {project.link &&
              /^https?:\/\//i.test(project.link) && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("viewProject")}
                  <ExternalLink size={14} />
                </a>
              )}
          </article>
        ))}
      </section>
    </div>
  );

  // ======================================
  // JOBS PAGE
  // ======================================

  const renderJobs = () => (
    <>
      <section className="cf-welcome cf-jobs-welcome">
        <div>
          <span className="cf-eyebrow">
            {t("nextOpportunity")}
          </span>
          <h2>{t("jobs")}</h2>
          <p>{t("searchJobDescription")}</p>
        </div>

        <BriefcaseBusiness size={70} strokeWidth={1.3} />
      </section>

      <section className="cf-panel">
        <PanelHeading
          title={t("exploreOpportunities")}
          subtitle={t("publishedOpportunities")}
        />

        <div className="cf-job-filters">
          <label className="cf-search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={t("searchJobs")}
            />
          </label>

          <label className="cf-filter-select">
            <Filter size={16} />
            <select
              value={jobType}
              onChange={(event) =>
                setJobType(event.target.value)
              }
            >
              <option value="All">{t("all")}</option>
              <option value="Internship">
                {t("internship")}
              </option>
              <option value="Full-time Job">
                {t("fullTime")}
              </option>
              <option value="Part-time Job">
                Part-time
              </option>
              <option value="Contract">Contract</option>
            </select>
          </label>

          <label className="cf-filter-select">
            <Globe size={16} />
            <select
              value={jobMode}
              onChange={(event) =>
                setJobMode(event.target.value)
              }
            >
              <option value="All">{t("all")}</option>
              <option value="Remote">{t("remote")}</option>
              <option value="Hybrid">{t("hybrid")}</option>
              <option value="On-site">{t("onsite")}</option>
            </select>
          </label>
        </div>

        <div className="cf-list-count">
          {filteredJobs.length} {t("listings")}
        </div>

        <div className="cf-jobs-grid">
          {filteredJobs.map(renderJobCard)}

          {filteredJobs.length === 0 && (
            <div className="cf-empty-state">
              <Search size={30} />
              <h3>{t("noMatchingJobs")}</h3>
              <p>{t("changeFilters")}</p>
            </div>
          )}
        </div>

        <div className="cf-info-note">
          <Bell size={18} />
          <span>
            Published company opportunities are loaded from
            this browser's shared storage. Sample listings
            are clearly marked and cannot accept applications.
          </span>
        </div>
      </section>
    </>
  );

  // ======================================
  // APPLICATIONS PAGE
  // ======================================

  const renderApplications = () => (
    <section className="cf-panel">
      <PanelHeading
        title={t("applications")}
        subtitle={t("applicationsDescription")}
      />

      {appliedJobs.length === 0 ? (
        <div className="cf-empty-state">
          <BriefcaseBusiness size={35} />
          <h3>{t("noApplications")}</h3>
          <p>{t("applyInstruction")}</p>

          <button
            className="cf-button cf-button-primary"
            onClick={() => setActivePage("jobs")}
          >
            {t("exploreJobs")}
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="cf-table-wrap">
          <table className="cf-table">
            <thead>
              <tr>
                <th>{t("position")}</th>
                <th>{t("company")}</th>
                <th>{t("dateType")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>

            <tbody>
              {appliedJobs.map((job, index) => (
                <tr key={`${job.id}-${index}`}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>
                    {job.applicationDate
                      ? new Date(
                          job.applicationDate
                        ).toLocaleDateString()
                      : job.type}
                  </td>
                  <td>
                    <span className="cf-status-pill">
                      {job.applicationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="cf-info-note">
        <FileText size={18} />
        <span>{t("applicationStorage")}</span>
      </div>
    </section>
  );

  // ======================================
  // ACHIEVEMENTS PAGE
  // ======================================

  const renderAchievements = () => (
    <section className="cf-panel">
      <PanelHeading
        title={t("achievements")}
        subtitle={t("achievementDescription")}
      />

      <div className="cf-achievement-grid">
        <Achievement
          icon={GraduationCap}
          title={t("learningStarter")}
          text={t("learningStarterDescription")}
          status={t("goal")}
        />
        <Achievement
          icon={Code2}
          title={t("problemSolver")}
          text={t("problemSolverDescription")}
          status={t("goal")}
        />
        <Achievement
          icon={FolderGit2}
          title={t("projectBuilder")}
          text={t("projectBuilderDescription")}
          status={t("goal")}
        />
        <Achievement
          icon={BriefcaseBusiness}
          title={t("careerReady")}
          text={t("careerReadyDescription")}
          status={t("goal")}
        />
      </div>

      <div className="cf-info-note">
        <Award size={18} />
        <span>{t("achievementNote")}</span>
      </div>
    </section>
  );

  // ======================================
  // ACTIVE PAGE SWITCH
  // ======================================

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return renderProfile();
      case "learning":
        return renderLearning();
      case "dsa":
        return renderDSA();
      case "assessments":
        return renderAssessments();
      case "projects":
        return renderProjects();
      case "jobs":
        return renderJobs();
      case "applications":
        return renderApplications();
      case "achievements":
        return renderAchievements();
      default:
        return renderOverview();
    }
  };

  // ======================================
  // MAIN JSX
  // ======================================

  return (
    <div
      className={`cf-app-shell ${
        language === "ar" ? "cf-rtl" : ""
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {sidebarOpen && (
        <button
          className="cf-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`cf-sidebar ${
          sidebarOpen ? "cf-sidebar-open" : ""
        }`}
      >
        <div className="cf-brand">
          <div className="cf-brand-mark">C</div>

          <div>
            <strong>CareerForge</strong>
            <small>{t("studentPortal").toUpperCase()}</small>
          </div>

          <button
            className="cf-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="cf-sidebar-caption">
          {t("workspace")}
        </div>

        <nav className="cf-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`cf-nav-item ${
                  activePage === item.id
                    ? "cf-nav-active"
                    : ""
                }`}
                onClick={() => {
                  if (item.id === "mira") {
                    navigate("/mira");
                    setSidebarOpen(false);
                    return;
                  }
                  setActivePage(item.id);
                  setSidebarOpen(false);
                  setSearch("");
                }}
              >
                <Icon size={19} />
                <span>
                  {item.id === "mira" ? "MIRA AI Companion" : t(item.id)}
                </span>

                {item.id === "applications" &&
                  appliedJobs.length > 0 && (
                    <span className="cf-nav-count">
                      {appliedJobs.length}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="cf-sidebar-bottom">
          <div className="cf-sidebar-help">
            <Target size={22} />
            <strong>{t("keepMoving")}</strong>
            <p>{t("keepMovingDescription")}</p>
          </div>

          <button
            className="cf-nav-item"
            onClick={() => showNotice(t("logoutNotice"))}
          >
            <LogOut size={18} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      <main className="cf-main">
        <header className="cf-topbar">
          <div className="cf-topbar-left">
            <button
              className="cf-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="cf-breadcrumb">
                {t("studentPortal")}
                <ChevronRight size={14} />
                <strong>{t(activePage)}</strong>
              </div>

              <h1>{t(activePage)}</h1>
            </div>
          </div>

          <div className="cf-topbar-actions">
            <select
              className="cf-language-select"
              aria-label={t("preferredLanguage")}
              value={language}
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

            <button
              className="cf-icon-button cf-notification"
              onClick={handleNotifications}
              aria-label={t("notifications")}
              title={`${unreadNotificationCount} ${t("notifications")}`}
            >
              <Bell size={19} />
              {unreadNotificationCount > 0 && (
                <span className="notification-count">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              className="cf-user-chip"
              onClick={() => setActivePage("profile")}
            >
              <ProfileAvatar className="cf-avatar-small" image={profile.profileImage} name={profile.name} />
              <span>
                {profile.name.trim() || t("student")}
              </span>
            </button>
          </div>
        </header>

        <div className="cf-page-content">
          {renderContent()}
        </div>

        <footer className="cf-footer">
          <span>
            © {new Date().getFullYear()} CareerForge
          </span>
          <span>{t("footerNote")}</span>
        </footer>
      </main>

      {notice && (
        <div className="cf-toast">
          <CheckCircle2 size={19} />
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <article className="cf-stat-card">
      <div className="cf-stat-top">
        <span>{label}</span>
        <div>
          <Icon size={20} />
        </div>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function PanelHeading({
  title,
  subtitle,
  action,
  actionLabel = "View all",
}) {
  return (
    <div className="cf-panel-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {action && (
        <button
          type="button"
          className="cf-text-button"
          onClick={action}
        >
          {actionLabel}
          <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      className="cf-quick-action"
      onClick={onClick}
    >
      <div>
        <Icon size={20} />
      </div>
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <ChevronRight size={17} />
    </button>
  );
}

function FormField({ label, children, wide }) {
  return (
    <label
      className={`cf-form-field ${
        wide ? "cf-field-wide" : ""
      }`}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}

function Tip({ icon: Icon, title, text }) {
  return (
    <article className="cf-tip-card">
      <Icon size={23} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function AssessmentCard({
  icon: Icon,
  title,
  tag,
  text,
  buttonText = "Start assessment",
  onClick,
}) {
  return (
    <article className="cf-assessment-card">
      <div className="cf-assessment-icon">
        <Icon size={25} />
      </div>
      <span className="cf-assessment-tag">{tag}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <button
        className="cf-button cf-button-outline"
        onClick={onClick}
      >
        {buttonText}
        <ChevronRight size={16} />
      </button>
    </article>
  );
}

function Achievement({
  icon: Icon,
  title,
  text,
  status = "Goal",
}) {
  return (
    <article className="cf-achievement-card">
      <div>
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span>
        <Circle size={13} />
        {status}
      </span>
    </article>
  );
}
