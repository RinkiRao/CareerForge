
import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  BriefcaseBusiness,
  Users,
  Plus,
  Search,
  MapPin,
  Clock,
  Pencil,
  Trash2,
  CheckCircle2,
  GraduationCap,
  X,
  Send,
  Globe,
  Wallet,
  UserCheck,
  Eye,
  Home,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { setAppLanguage } from "../utils/i18n";
import { getCompanyJobs } from "../utils/companyJobs";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfilePhotoPicker from "../components/ProfilePhotoPicker";
import { persistCentralProfile } from "../utils/profilePhoto";

import "./CompanyDashboard.css";

// ==========================================
// STORAGE KEYS
// ==========================================

const PROFILE_KEY = "careerforge_company_profile";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const JOBS_KEY = "careerforge_company_jobs";
const APPLICATIONS_KEY = "careerforge_job_applications";
const COMPANY_LANGUAGE_KEY = "careerforge_company_language";
const NOTIFICATIONS_KEY = "careerforge_student_notifications";

// ==========================================
// SUPPORTED LANGUAGES
// ==========================================

const LANGUAGES = [
  { code: "en", nativeName: "English" },
  { code: "hi", nativeName: "हिन्दी" },
  { code: "es", nativeName: "Español" },
  { code: "fr", nativeName: "Français" },
  { code: "de", nativeName: "Deutsch" },
  { code: "ar", nativeName: "العربية" },
  { code: "pt", nativeName: "Português" },
  { code: "zh", nativeName: "中文" },
  { code: "ja", nativeName: "日本語" },
  { code: "ko", nativeName: "한국어" },
];

const normalizeLanguage = (value) => {
  const code = String(value || "en")
    .trim()
    .toLowerCase();

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
  };

  const normalized = aliases[code] || code;

  return LANGUAGES.some(
    (item) => item.code === normalized
  )
    ? normalized
    : "en";
};

// ==========================================
// TRANSLATIONS
// ==========================================

const en = {
  overview: "Overview",
  manageJobs: "Manage Jobs",
  studentApplications: "Student Applications",
  companyProfile: "Company Profile",
  companyPortal: "COMPANY PORTAL",
  workspace: "WORKSPACE",
  backHome: "Back to Home",
  postJob: "Post an Opportunity",

  buildTeam: "Build your team",
  buildTeamDesc:
    "Publish opportunities and discover student talent.",
  findPeople: "Find the right people",
  nextIdea: "for your next big idea.",
  welcomeDesc:
    "Publish opportunities, explore applicants and build your team with CareerForge.",

  publishOpportunity: "Publish an opportunity",
  publishedJobs: "Published opportunities",
  yourOpportunities: "Your published opportunities",
  applications: "Applications",
  applicationsLinked:
    "Applications linked to your opportunities",
  shortlisted: "Shortlisted",
  shortlistedDesc: "Candidates marked for next steps",
  recentJobs: "Recently published opportunities",
  viewAll: "View all",
  noJobs: "No opportunities published yet",
  createFirstJob:
    "Create your first job or internship to get started.",
  createJob: "Create first opportunity",

  jobManagement: "OPPORTUNITY MANAGEMENT",
  yourListings: "Your listings",
  publishedOpportunities: "published opportunities",
  addListing: "Add listing",
  searchJobs: "Search opportunities, skills or location...",
  noMatchingJobs: "No matching opportunities",
  trySearch: "Try another search term.",
  emptyJobList: "Your opportunity list is empty",
  publishToStart:
    "Publish an opportunity to start receiving applications.",
  postFirstJob: "Post your first opportunity",

  candidateManagement: "CANDIDATE MANAGEMENT",
  reviewCandidates:
    "Review candidates and update their application status.",
  noApplications: "No applications available",
  applicationsAppear:
    "Applications will appear here when students apply.",
  appliedFor: "Applied for",
  student: "Student",
  emailMissing: "Email not provided",
  applicationStatus: "Application status",

  organization: "YOUR ORGANISATION",
  companyInfo: "Company information",
  enterCompanyDetails: "Enter your company details.",
  companyName: "Company name",
  companyEmail: "Company email",
  website: "Website",
  industry: "Industry",
  companyLocation: "Company location",
  aboutCompany: "About the company",
  companyNamePlaceholder: "Your company name",
  companyEmailPlaceholder: "careers@company.com",
  websitePlaceholder: "https://yourcompany.com",
  industryPlaceholder: "Software / IT",
  locationPlaceholder: "City, Country",
  aboutPlaceholder:
    "Describe your company and work culture...",
  requiredFields: "* Required fields",
  saveProfile: "Save profile",

  opportunityBuilder: "OPPORTUNITY BUILDER",
  editOpportunity: "Edit opportunity",
  newOpportunity: "Post a new opportunity",
  accurateDetails:
    "Provide accurate role details for students.",
  jobTitle: "Opportunity title",
  opportunityType: "Opportunity type",
  workMode: "Work mode",
  location: "Location",
  requiredSkills: "Required skills",
  jobDescription: "Description",
  requirements: "Requirements",
  jobTitlePlaceholder: "MERN Stack Developer Intern",
  jobLocationPlaceholder: "Remote or city",
  skillsPlaceholder: "React, Node.js, MongoDB",
  descriptionPlaceholder:
    "Responsibilities and role details...",
  requirementsPlaceholder:
    "Eligibility, education, experience...",

  cancel: "Cancel",
  saveChanges: "Save changes",
  publish: "Publish opportunity",

  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
  internship: "Internship",
  fullTime: "Full-time Job",
  partTime: "Part-time Job",
  contract: "Contract",

  underReview: "Under Review",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
  appliedStatus: "Applied",
  published: "Published",

  edit: "Edit",
  delete: "Delete",
  locationUnknown: "Location not specified",
  notSpecified: "Not specified",

  companyRequired:
    "Company name and email are required.",
  profileSaved:
    "Company profile saved successfully.",
  saveProfileFirst:
    "First save your company name and email in Company Profile.",
  jobFieldsRequired:
    "Title, description and skills are required.",
  jobUpdated:
    "Opportunity successfully updated.",
  jobPublished:
    "Opportunity uploaded successfully!",
  jobSaveError:
    "Opportunity could not be saved. Please try again.",
  confirmDelete:
    "Are you sure you want to delete this opportunity?",
  jobDeleted: "Opportunity deleted successfully.",
  jobDeleteError: "Unable to delete opportunity.",
  statusUpdated: "Application status updated",
  statusUpdateError:
    "Unable to update application status.",
  languageChanged: "Language preference updated.",
  homeTitle: "Return to CareerForge home",
  footer: "Learn. Build. Hire. Grow.",
  companyLanguage: "Dashboard language",

  uploadSuccess: "Opportunity Uploaded Successfully!",
  updateSuccess: "Opportunity Updated Successfully!",
  uploadError: "Upload failed. Please try again.",
};

const hi = {
  ...en,

  overview: "मुख्य जानकारी",
  manageJobs: "अवसर मैनेज करें",
  studentApplications: "स्टूडेंट आवेदन",
  companyProfile: "कंपनी प्रोफाइल",
  companyPortal: "कंपनी पोर्टल",
  workspace: "कार्यक्षेत्र",
  backHome: "होम पर वापस जाएँ",
  postJob: "अवसर पोस्ट करें",

  buildTeam: "अपनी टीम बनाएँ",
  buildTeamDesc:
    "नए अवसर पोस्ट करें और प्रतिभाशाली विद्यार्थियों को खोजें।",
  findPeople: "सही लोगों को खोजें",
  nextIdea: "अपने अगले बड़े विचार के लिए।",
  welcomeDesc:
    "CareerForge के साथ अवसर पोस्ट करें, आवेदन देखें और अपनी टीम बनाएँ।",

  publishOpportunity: "अवसर प्रकाशित करें",
  publishedJobs: "प्रकाशित अवसर",
  yourOpportunities: "आपके प्रकाशित अवसर",
  applications: "आवेदन",
  applicationsLinked: "आपके अवसरों से जुड़े आवेदन",
  shortlisted: "शॉर्टलिस्ट किए गए",
  shortlistedDesc: "अगले चरण के लिए चुने गए उम्मीदवार",
  recentJobs: "हाल ही में प्रकाशित अवसर",
  viewAll: "सभी देखें",
  noJobs: "अभी कोई अवसर प्रकाशित नहीं हुआ",
  createFirstJob:
    "शुरुआत करने के लिए पहली नौकरी या इंटर्नशिप बनाएँ।",
  createJob: "पहला अवसर बनाएँ",

  jobManagement: "अवसर प्रबंधन",
  yourListings: "आपकी लिस्टिंग",
  addListing: "नई लिस्टिंग जोड़ें",
  searchJobs: "अवसर, स्किल या स्थान खोजें...",
  noMatchingJobs: "कोई अवसर नहीं मिला",
  trySearch: "दूसरे शब्द से खोजें।",
  emptyJobList: "आपकी अवसर सूची खाली है",
  publishToStart:
    "आवेदन प्राप्त करने के लिए अवसर प्रकाशित करें।",
  postFirstJob: "अपना पहला अवसर पोस्ट करें",

  candidateManagement: "उम्मीदवार प्रबंधन",
  reviewCandidates:
    "उम्मीदवारों की समीक्षा करें और आवेदन की स्थिति बदलें।",
  noApplications: "अभी कोई आवेदन उपलब्ध नहीं है",
  applicationsAppear:
    "विद्यार्थियों के आवेदन यहाँ दिखाई देंगे।",
  appliedFor: "जिस पद के लिए आवेदन किया",
  student: "विद्यार्थी",
  emailMissing: "ईमेल उपलब्ध नहीं है",
  applicationStatus: "आवेदन की स्थिति",

  organization: "आपका संगठन",
  companyInfo: "कंपनी की जानकारी",
  enterCompanyDetails: "अपनी कंपनी की जानकारी भरें।",
  companyName: "कंपनी का नाम",
  companyEmail: "कंपनी ईमेल",
  website: "वेबसाइट",
  industry: "उद्योग",
  companyLocation: "कंपनी का स्थान",
  aboutCompany: "कंपनी के बारे में",
  companyNamePlaceholder: "अपनी कंपनी का नाम",
  locationPlaceholder: "शहर, देश",
  requiredFields: "* आवश्यक जानकारी",
  saveProfile: "प्रोफाइल सेव करें",

  opportunityBuilder: "अवसर बनाएँ",
  editOpportunity: "अवसर एडिट करें",
  newOpportunity: "नया अवसर पोस्ट करें",
  accurateDetails: "विद्यार्थियों के लिए सही जानकारी दें।",
  jobTitle: "अवसर का नाम",
  opportunityType: "अवसर का प्रकार",
  workMode: "काम का तरीका",
  location: "स्थान",
  requiredSkills: "आवश्यक स्किल्स",
  jobDescription: "विवरण",
  requirements: "आवश्यक योग्यताएँ",

  cancel: "रद्द करें",
  saveChanges: "बदलाव सेव करें",
  publish: "अवसर प्रकाशित करें",

  remote: "रिमोट",
  hybrid: "हाइब्रिड",
  onsite: "ऑफिस से",
  internship: "इंटर्नशिप",
  fullTime: "फुल टाइम नौकरी",
  partTime: "पार्ट टाइम नौकरी",
  contract: "कॉन्ट्रैक्ट",

  underReview: "समीक्षा में",
  interview: "इंटरव्यू",
  offer: "ऑफर",
  hired: "नियुक्त",
  rejected: "अस्वीकृत",
  appliedStatus: "आवेदन किया",
  published: "प्रकाशित",

  edit: "एडिट करें",
  delete: "हटाएँ",
  locationUnknown: "स्थान नहीं दिया गया",
  notSpecified: "निर्दिष्ट नहीं",

  companyRequired:
    "कंपनी का नाम और ईमेल जरूरी हैं।",
  profileSaved:
    "कंपनी प्रोफाइल सफलतापूर्वक सेव हो गई।",
  saveProfileFirst:
    "पहले कंपनी प्रोफाइल में नाम और ईमेल सेव करें।",
  jobFieldsRequired:
    "नाम, विवरण और स्किल्स भरना जरूरी है।",
  jobUpdated:
    "अवसर सफलतापूर्वक अपडेट हो गया।",
  jobPublished:
    "अवसर सफलतापूर्वक प्रकाशित हो गया।",
  jobSaveError:
    "अवसर सेव नहीं हो सका। दोबारा कोशिश करें।",
  confirmDelete:
    "क्या आप इस अवसर को हटाना चाहते हैं?",
  jobDeleted: "अवसर हटा दिया गया।",
  jobDeleteError:
    "अवसर हटाया नहीं जा सका।",
  statusUpdated:
    "आवेदन की स्थिति अपडेट हो गई",
  statusUpdateError:
    "आवेदन की स्थिति अपडेट नहीं हो सकी।",
  languageChanged:
    "भाषा की पसंद अपडेट हो गई।",
  homeTitle: "CareerForge होम पर वापस जाएँ",
  footer: "सीखें। बनाएँ। नियुक्त करें। आगे बढ़ें।",
  companyLanguage: "डैशबोर्ड की भाषा",

  uploadSuccess:
    "अवसर सफलतापूर्वक अपलोड हो गया!",
  updateSuccess:
    "अवसर सफलतापूर्वक अपडेट हो गया!",
  uploadError:
    "अपलोड नहीं हो सका। दोबारा कोशिश करें।",
};

// Other languages use translated common navigation labels.
// Untranslated opportunity field labels fall back to English.

const translatedNavigation = {
  es: {
    overview: "Resumen",
    manageJobs: "Gestionar empleos",
    studentApplications: "Solicitudes de estudiantes",
    companyProfile: "Perfil de empresa",
    companyPortal: "PORTAL DE EMPRESA",
    workspace: "ESPACIO DE TRABAJO",
    backHome: "Volver al inicio",
    postJob: "Publicar oportunidad",
    applications: "Solicitudes",
    publishedJobs: "Oportunidades publicadas",
    shortlisted: "Preseleccionados",
    companyInfo: "Información de la empresa",
    saveProfile: "Guardar perfil",
    cancel: "Cancelar",
    saveChanges: "Guardar cambios",
    publish: "Publicar oportunidad",
    internship: "Prácticas",
    fullTime: "Tiempo completo",
    partTime: "Tiempo parcial",
    contract: "Contrato",
    remote: "Remoto",
    hybrid: "Híbrido",
    onsite: "Presencial",
    published: "Publicado",
    edit: "Editar",
    delete: "Eliminar",
    companyLanguage: "Idioma del panel",
    footer: "Aprender. Crear. Contratar. Crecer.",
    uploadSuccess: "¡Oportunidad publicada correctamente!",
    updateSuccess: "¡Oportunidad actualizada correctamente!",
  },

  fr: {
    overview: "Vue d'ensemble",
    manageJobs: "Gérer les opportunités",
    studentApplications: "Candidatures étudiantes",
    companyProfile: "Profil de l'entreprise",
    companyPortal: "PORTAIL ENTREPRISE",
    workspace: "ESPACE DE TRAVAIL",
    backHome: "Retour à l'accueil",
    postJob: "Publier une opportunité",
    applications: "Candidatures",
    publishedJobs: "Opportunités publiées",
    shortlisted: "Présélectionnés",
    companyInfo: "Informations sur l'entreprise",
    saveProfile: "Enregistrer le profil",
    cancel: "Annuler",
    saveChanges: "Enregistrer les modifications",
    publish: "Publier l'opportunité",
    internship: "Stage",
    fullTime: "Temps plein",
    partTime: "Temps partiel",
    contract: "Contrat",
    remote: "À distance",
    hybrid: "Hybride",
    onsite: "Sur site",
    published: "Publié",
    edit: "Modifier",
    delete: "Supprimer",
    companyLanguage: "Langue du tableau de bord",
    footer: "Apprendre. Construire. Recruter. Grandir.",
    uploadSuccess: "Opportunité publiée avec succès !",
    updateSuccess: "Opportunité mise à jour !",
  },

  de: {
    overview: "Übersicht",
    manageJobs: "Chancen verwalten",
    studentApplications: "Studentenbewerbungen",
    companyProfile: "Unternehmensprofil",
    companyPortal: "UNTERNEHMENSPORTAL",
    workspace: "ARBEITSBEREICH",
    backHome: "Zur Startseite",
    postJob: "Chance veröffentlichen",
    applications: "Bewerbungen",
    publishedJobs: "Veröffentlichte Chancen",
    shortlisted: "Vorausgewählt",
    companyInfo: "Unternehmensinformationen",
    saveProfile: "Profil speichern",
    cancel: "Abbrechen",
    saveChanges: "Änderungen speichern",
    publish: "Chance veröffentlichen",
    internship: "Praktikum",
    fullTime: "Vollzeit",
    partTime: "Teilzeit",
    contract: "Vertrag",
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "Vor Ort",
    published: "Veröffentlicht",
    edit: "Bearbeiten",
    delete: "Löschen",
    companyLanguage: "Dashboard-Sprache",
    footer: "Lernen. Bauen. Einstellen. Wachsen.",
    uploadSuccess: "Chance erfolgreich veröffentlicht!",
    updateSuccess: "Chance erfolgreich aktualisiert!",
  },

  ar: {
    overview: "نظرة عامة",
    manageJobs: "إدارة الفرص",
    studentApplications: "طلبات الطلاب",
    companyProfile: "ملف الشركة",
    companyPortal: "بوابة الشركة",
    workspace: "مساحة العمل",
    backHome: "العودة إلى الرئيسية",
    postJob: "نشر فرصة",
    applications: "الطلبات",
    publishedJobs: "الفرص المنشورة",
    shortlisted: "القائمة المختصرة",
    companyInfo: "معلومات الشركة",
    saveProfile: "حفظ الملف",
    cancel: "إلغاء",
    saveChanges: "حفظ التغييرات",
    publish: "نشر الفرصة",
    internship: "تدريب",
    fullTime: "دوام كامل",
    partTime: "دوام جزئي",
    contract: "عقد",
    remote: "عن بُعد",
    hybrid: "مختلط",
    onsite: "في الموقع",
    published: "منشور",
    edit: "تعديل",
    delete: "حذف",
    companyLanguage: "لغة لوحة التحكم",
    footer: "تعلّم. ابنِ. وظّف. انمُ.",
    uploadSuccess: "تم نشر الفرصة بنجاح!",
    updateSuccess: "تم تحديث الفرصة بنجاح!",
  },

  pt: {
    overview: "Visão geral",
    manageJobs: "Gerenciar oportunidades",
    studentApplications: "Candidaturas de estudantes",
    companyProfile: "Perfil da empresa",
    companyPortal: "PORTAL DA EMPRESA",
    workspace: "ÁREA DE TRABALHO",
    backHome: "Voltar ao início",
    postJob: "Publicar oportunidade",
    applications: "Candidaturas",
    publishedJobs: "Oportunidades publicadas",
    shortlisted: "Pré-selecionados",
    companyInfo: "Informações da empresa",
    saveProfile: "Salvar perfil",
    cancel: "Cancelar",
    saveChanges: "Salvar alterações",
    publish: "Publicar oportunidade",
    internship: "Estágio",
    fullTime: "Tempo integral",
    partTime: "Meio período",
    contract: "Contrato",
    remote: "Remoto",
    hybrid: "Híbrido",
    onsite: "Presencial",
    published: "Publicado",
    edit: "Editar",
    delete: "Excluir",
    companyLanguage: "Idioma do painel",
    footer: "Aprender. Criar. Contratar. Crescer.",
    uploadSuccess: "Oportunidade publicada com sucesso!",
    updateSuccess: "Oportunidade atualizada com sucesso!",
  },

  zh: {
    overview: "概览",
    manageJobs: "机会管理",
    studentApplications: "学生申请",
    companyProfile: "公司资料",
    companyPortal: "企业门户",
    workspace: "工作区",
    backHome: "返回首页",
    postJob: "发布机会",
    applications: "申请",
    publishedJobs: "已发布机会",
    shortlisted: "已入围",
    companyInfo: "公司信息",
    saveProfile: "保存资料",
    cancel: "取消",
    saveChanges: "保存更改",
    publish: "发布机会",
    internship: "实习",
    fullTime: "全职",
    partTime: "兼职",
    contract: "合同",
    remote: "远程",
    hybrid: "混合办公",
    onsite: "现场办公",
    published: "已发布",
    edit: "编辑",
    delete: "删除",
    companyLanguage: "面板语言",
    footer: "学习。创造。招聘。成长。",
    uploadSuccess: "机会发布成功！",
    updateSuccess: "机会更新成功！",
  },

  ja: {
    overview: "概要",
    manageJobs: "機会管理",
    studentApplications: "学生の応募",
    companyProfile: "企業プロフィール",
    companyPortal: "企業ポータル",
    workspace: "ワークスペース",
    backHome: "ホームに戻る",
    postJob: "機会を投稿",
    applications: "応募",
    publishedJobs: "公開中の機会",
    shortlisted: "候補者",
    companyInfo: "企業情報",
    saveProfile: "プロフィールを保存",
    cancel: "キャンセル",
    saveChanges: "変更を保存",
    publish: "機会を公開",
    internship: "インターンシップ",
    fullTime: "フルタイム",
    partTime: "パートタイム",
    contract: "契約",
    remote: "リモート",
    hybrid: "ハイブリッド",
    onsite: "出社",
    published: "公開済み",
    edit: "編集",
    delete: "削除",
    companyLanguage: "ダッシュボードの言語",
    footer: "学ぶ。作る。採用する。成長する。",
    uploadSuccess: "機会を公開しました！",
    updateSuccess: "機会を更新しました！",
  },

  ko: {
    overview: "개요",
    manageJobs: "기회 관리",
    studentApplications: "학생 지원",
    companyProfile: "회사 프로필",
    companyPortal: "기업 포털",
    workspace: "작업 공간",
    backHome: "홈으로 돌아가기",
    postJob: "기회 게시",
    applications: "지원서",
    publishedJobs: "게시된 기회",
    shortlisted: "최종 후보",
    companyInfo: "회사 정보",
    saveProfile: "프로필 저장",
    cancel: "취소",
    saveChanges: "변경 사항 저장",
    publish: "기회 게시",
    internship: "인턴십",
    fullTime: "정규직",
    partTime: "파트타임",
    contract: "계약직",
    remote: "원격",
    hybrid: "하이브리드",
    onsite: "현장 근무",
    published: "게시됨",
    edit: "수정",
    delete: "삭제",
    companyLanguage: "대시보드 언어",
    footer: "배우기. 만들기. 채용하기. 성장하기.",
    uploadSuccess: "기회가 성공적으로 게시되었습니다!",
    updateSuccess: "기회가 업데이트되었습니다!",
  },
};

const dictionaries = {
  en,
  hi,
  es: { ...en, ...translatedNavigation.es },
  fr: { ...en, ...translatedNavigation.fr },
  de: { ...en, ...translatedNavigation.de },
  ar: { ...en, ...translatedNavigation.ar },
  pt: { ...en, ...translatedNavigation.pt },
  zh: { ...en, ...translatedNavigation.zh },
  ja: { ...en, ...translatedNavigation.ja },
  ko: { ...en, ...translatedNavigation.ko },
};

// ==========================================
// STORAGE HELPERS
// ==========================================

function readJSON(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
}

// ==========================================
// DEFAULT PROFILE
// ==========================================

const emptyProfile = {
  name: "",
  email: "",
  website: "",
  industry: "",
  location: "",
  description: "",
  logo: "",
  language: "en",
};

// ==========================================
// DEFAULT OPPORTUNITY
// ==========================================

const emptyJob = {
  title: "",
  category: "Internship",
  mode: "Remote",
  location: "Remote",

  duration: "3 months",
  salary: "",
  skills: "",
  description: "",
  requirements: "",

  // Internship details
  internshipWorkType: "Full-time",
  durationMonths: "3",
  stipendStatus: "Paid",
  stipendCurrency: "INR",
  monthlyStipend: "",
  internshipStartDate: "",
  internshipEndDate: "",
  ppoAvailable: "No",

  // Placement details
  salaryCurrency: "INR",
  minSalary: "",
  maxSalary: "",
  fixedSalary: "",
  variableSalary: "",
  experienceLevel: "Fresher",
  expectedJoiningDate: "",

  // Application window
  applicationStartDate: "",
  applicationEndDate: "",
};

// ==========================================
// DATE HELPERS
// ==========================================

function todayISO() {
  const date = new Date();

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoChanged, setCompanyLogoChanged] = useState(false);

  const [profile, setProfile] = useState(() => ({
    ...emptyProfile,
    ...readJSON(PROFILE_KEY, {}),
  }));

  const initialLanguage = normalizeLanguage(
    profile.language ||
      localStorage.getItem(COMPANY_LANGUAGE_KEY) ||
      localStorage.getItem("careerforge_language") ||
      "en"
  );

  const [language, setLanguage] = useState(initialLanguage);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jobForm, setJobForm] = useState({ ...emptyJob });
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const t = (key) =>
    dictionaries[language]?.[key] ||
    dictionaries.en[key] ||
    key;

  // ======================================
  // APPLY LANGUAGE
  // ======================================

  useEffect(() => {
    setAppLanguage(language);

    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const handleLanguageChange = (event) => {
    const selected = normalizeLanguage(event.target.value);

    setLanguage(selected);
    setAppLanguage(selected);

    const updatedProfile = {
      ...profile,
      language: selected,
    };

    setProfile(updatedProfile);

    saveJSON(PROFILE_KEY, updatedProfile);

    localStorage.setItem(
      COMPANY_LANGUAGE_KEY,
      selected
    );

    localStorage.setItem(
      "careerforge_language",
      selected
    );

    showMessage(
      dictionaries[selected]?.languageChanged ||
        dictionaries.en.languageChanged
    );
  };

  // ======================================
  // NOTICE / SUCCESS MESSAGE
  // ======================================

  const showMessage = (message, type = "success") => {
    setNotice(message);
    setNoticeType(type);

    window.clearTimeout(showMessage.timer);

    showMessage.timer = window.setTimeout(() => {
      setNotice("");
    }, 6000);
  };

  // ======================================
  // REFRESH DATA
  // ======================================

  const refreshData = () => {
    try {
      const savedJobs = getCompanyJobs();

      setJobs(
        Array.isArray(savedJobs) ? savedJobs : []
      );

      const savedApplications = readJSON(
        APPLICATIONS_KEY,
        []
      );

      setApplications(
        Array.isArray(savedApplications)
          ? savedApplications
          : []
      );
    } catch (error) {
      console.error("Dashboard refresh error:", error);
    }
  };

  useEffect(() => {
    refreshData();

    const handleUpdate = () => refreshData();

    window.addEventListener("focus", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    window.addEventListener(
      "careerforge-jobs-updated",
      handleUpdate
    );

    window.addEventListener(
      "careerforge-applications-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("storage", handleUpdate);

      window.removeEventListener(
        "careerforge-jobs-updated",
        handleUpdate
      );

      window.removeEventListener(
        "careerforge-applications-updated",
        handleUpdate
      );
    };
  }, []);

  // ======================================
  // COMPANY DATA
  // ======================================

  const companyJobs = useMemo(() => {
    const email = (profile.email || "")
      .trim()
      .toLowerCase();

    return jobs.filter((job) => {
      if (!job.companyEmail) return true;

      return (
        job.companyEmail.trim().toLowerCase() === email
      );
    });
  }, [jobs, profile.email]);

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return companyJobs.filter((job) => {
      const skills = Array.isArray(job.skills)
        ? job.skills.join(" ")
        : job.skills || "";

      return (
        `${job.title || ""} ${job.location || ""} ${skills}`
          .toLowerCase()
          .includes(query)
      );
    });
  }, [companyJobs, search]);

  const companyApplications = useMemo(() => {
    return applications.filter((application) =>
      companyJobs.some(
        (job) =>
          String(job.id) === String(application.jobId)
      )
    );
  }, [applications, companyJobs]);

  const shortlistedCount = companyApplications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  // ======================================
  // NAVIGATION
  // ======================================

  const goHome = () => {
    navigate("/");
  };

  const navigation = [
    {
      id: "overview",
      labelKey: "overview",
      icon: LayoutDashboard,
    },
    {
      id: "jobs",
      labelKey: "manageJobs",
      icon: BriefcaseBusiness,
    },
    {
      id: "applications",
      labelKey: "studentApplications",
      icon: Users,
    },
    {
      id: "profile",
      labelKey: "companyProfile",
      icon: Building2,
    },
  ];

  const currentPage = navigation.find(
    (item) => item.id === activeTab
  );

  // ======================================
  // PROFILE
  // ======================================

  const saveProfile = async (event) => {
    event.preventDefault();

    if (
      !profile.name.trim() ||
      !profile.email.trim()
    ) {
      showMessage(t("companyRequired"), "error");
      return;
    }

    let updatedLogo = profile.logo || "";
    if (companyLogoChanged) {
      const token = localStorage.getItem("careerforge_company_token");
      if (!token) {
        showMessage(
          "Logo updates require a backend-authenticated company account. Existing browser-only accounts cannot upload logos.",
          "error"
        );
        return;
      }

      let response;
      try {
        response = companyLogoFile
          ? await fetch(`${API_BASE_URL}/api/company-auth/profile/logo`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
              body: (() => {
                const body = new FormData();
                body.append("profilePhoto", companyLogoFile);
                return body;
              })(),
            })
          : await fetch(`${API_BASE_URL}/api/company-auth/profile/logo`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
      } catch (error) {
        console.error("Company logo request failed:", error);
        showMessage("Unable to reach the server to update the company logo.", "error");
        return;
      }
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success || !result.company) {
        showMessage(result.message || "Unable to update the company logo.", "error");
        return;
      }
      updatedLogo = result.company.logo || "";
      persistCentralProfile({
        ...result.company,
        name: result.company.companyName,
        logo: updatedLogo,
      }, "company");
      setCompanyLogoFile(null);
      setCompanyLogoChanged(false);
    }

    const cleanProfile = {
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
      logo: updatedLogo,
      language,
    };

    if (!saveJSON(PROFILE_KEY, cleanProfile)) {
      showMessage("Unable to save company profile.", "error");
      return;
    }

    localStorage.setItem(
      COMPANY_LANGUAGE_KEY,
      language
    );

    setProfile(cleanProfile);
    window.dispatchEvent(new Event("careerforge-profile-updated"));

    showMessage(t("profileSaved"));
  };

  // ======================================
  // OPEN / EDIT OPPORTUNITY FORM
  // ======================================

  const openNewJobForm = () => {
    setEditingId(null);
    setJobForm({ ...emptyJob });
    setShowJobForm(true);
    setNotice("");
  };

  const openEditJobForm = (job) => {
    const oldDuration = String(job.duration || "");
    const durationMatch = oldDuration.match(/\d+/);

    setEditingId(job.id);

    setJobForm({
      ...emptyJob,
      ...job,

      durationMonths:
        job.durationMonths ||
        durationMatch?.[0] ||
        "3",

      salary: job.salary || job.pay || "",

      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",

      applicationStartDate:
        job.applicationStartDate || "",

      applicationEndDate:
        job.applicationEndDate || "",
    });

    setShowJobForm(true);
    setNotice("");
  };

  const updateJobField = (field, value) => {
    setJobForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setJobForm((previous) => ({
      ...previous,
      category,
    }));
  };

  // ======================================
  // VALIDATE OPPORTUNITY
  // ======================================

  const validateJob = () => {
    if (
      !jobForm.title.trim() ||
      !jobForm.description.trim() ||
      !jobForm.skills.trim()
    ) {
      showMessage(t("jobFieldsRequired"), "error");
      return false;
    }

    // Application dates
    if (
      !jobForm.applicationStartDate ||
      !jobForm.applicationEndDate
    ) {
      showMessage(
        "Please enter application opening and closing dates.",
        "error"
      );
      return false;
    }

    if (
      jobForm.applicationStartDate < todayISO()
    ) {
      showMessage(
        "Application opening date cannot be in the past.",
        "error"
      );
      return false;
    }

    if (
      jobForm.applicationEndDate <
      jobForm.applicationStartDate
    ) {
      showMessage(
        "Application closing date cannot be before opening date.",
        "error"
      );
      return false;
    }

    // Internship validation
    if (jobForm.category === "Internship") {
      const months = Number(jobForm.durationMonths);

      if (
        !Number.isFinite(months) ||
        months < 1 ||
        months > 36
      ) {
        showMessage(
          "Internship duration must be between 1 and 36 months.",
          "error"
        );
        return false;
      }

      if (
        !jobForm.internshipStartDate ||
        !jobForm.internshipEndDate
      ) {
        showMessage(
          "Please enter internship start and end dates.",
          "error"
        );
        return false;
      }

      if (
        jobForm.internshipEndDate <
        jobForm.internshipStartDate
      ) {
        showMessage(
          "Internship end date cannot be before start date.",
          "error"
        );
        return false;
      }

      if (
        jobForm.stipendStatus === "Paid" &&
        (
          jobForm.monthlyStipend === "" ||
          !Number.isFinite(Number(jobForm.monthlyStipend)) ||
          Number(jobForm.monthlyStipend) <= 0
        )
      ) {
        showMessage(
          "Please enter a valid monthly stipend.",
          "error"
        );
        return false;
      }
    } else {
      // Placement validation
      const minimum = Number(jobForm.minSalary);
      const maximum = Number(jobForm.maxSalary);
      const fixed = Number(jobForm.fixedSalary || 0);
      const variable = Number(jobForm.variableSalary || 0);

      if (
        jobForm.minSalary === "" ||
        jobForm.maxSalary === "" ||
        !Number.isFinite(minimum) ||
        !Number.isFinite(maximum) ||
        minimum < 0 ||
        maximum < minimum
      ) {
        showMessage(
          "Please enter a valid annual salary range.",
          "error"
        );
        return false;
      }

      if (
        fixed < 0 ||
        variable < 0 ||
        fixed + variable > maximum
      ) {
        showMessage(
          "Please check fixed and variable salary values.",
          "error"
        );
        return false;
      }
    }

    return true;
  };

  // ======================================
  // SAVE / PUBLISH OPPORTUNITY
  // ======================================

  const saveJob = (event) => {
    event.preventDefault();

    try {
      // Read the latest company profile.
      const storedProfile = readJSON(
        PROFILE_KEY,
        {}
      );

      const companyName = (
        profile.name ||
        storedProfile.name ||
        ""
      ).trim();

      const companyEmail = (
        profile.email ||
        storedProfile.email ||
        ""
      ).trim().toLowerCase();

      if (!companyName || !companyEmail) {
        showMessage(
          t("saveProfileFirst"),
          "error"
        );

        setShowJobForm(false);
        setActiveTab("profile");
        return;
      }

      if (!validateJob()) return;

      const isInternship =
        jobForm.category === "Internship";

      let duration = "";
      let salaryDisplay = "";
      let totalStipend = 0;

      if (isInternship) {
        const months = Number(jobForm.durationMonths);
        const stipend = Number(
          jobForm.monthlyStipend || 0
        );

        duration = `${months} months`;

        if (jobForm.stipendStatus === "Unpaid") {
          salaryDisplay = "Unpaid";
        } else {
          totalStipend = stipend * months;

          salaryDisplay =
            `${jobForm.stipendCurrency} ${stipend.toLocaleString("en-IN")} / month`;
        }
      } else {
        const minimum = Number(jobForm.minSalary);
        const maximum = Number(jobForm.maxSalary);

        duration = jobForm.category;

        if (jobForm.salaryCurrency === "INR") {
          salaryDisplay =
            `${minimum} - ${maximum} LPA`;
        } else {
          salaryDisplay =
            `${jobForm.salaryCurrency} ${minimum.toLocaleString()} - ${maximum.toLocaleString()} / year`;
        }
      }

      const skills = jobForm.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const now = new Date().toISOString();

      const jobData = {
        ...jobForm,

        title: jobForm.title.trim(),

        company: companyName,
        companyEmail,
        companyLogo: profile.logo || storedProfile.logo || "",

        companyWebsite:
          profile.website ||
          storedProfile.website ||
          "",

        industry:
          profile.industry ||
          storedProfile.industry ||
          "",

        category: jobForm.category,
        opportunityType: jobForm.category,

        mode: jobForm.mode,
        workMode: jobForm.mode,

        location:
          jobForm.location.trim() ||
          jobForm.mode,

        duration,
        salary: salaryDisplay,
        pay: salaryDisplay,
        totalStipend,

        skills,

        status: "published",
        companyLanguage: language,

        applicationStartDate:
          jobForm.applicationStartDate,

        applicationEndDate:
          jobForm.applicationEndDate,

        updatedAt: now,
      };

      // IMPORTANT:
      // Student Dashboard reads this same storage key.
      const storedJobs = readJSON(
        JOBS_KEY,
        []
      );

      if (!Array.isArray(storedJobs)) {
        throw new Error(
          "Opportunity storage is invalid."
        );
      }

      const isEditing = Boolean(editingId);

      let savedJobId;
      let updatedJobs;

      if (isEditing) {
        const existingJob = storedJobs.find(
          (job) =>
            String(job.id) === String(editingId)
        );

        if (!existingJob) {
          throw new Error(
            "The opportunity you are editing was not found."
          );
        }

        if (
          existingJob.companyEmail &&
          existingJob.companyEmail.toLowerCase() !==
            companyEmail
        ) {
          throw new Error(
            "You cannot edit another company's opportunity."
          );
        }

        savedJobId = existingJob.id;

        updatedJobs = storedJobs.map((job) =>
          String(job.id) === String(editingId)
            ? {
                ...job,
                ...jobData,
                id: existingJob.id,
              }
            : job
        );
      } else {
        savedJobId =
          globalThis.crypto?.randomUUID?.() ||
          `job-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

        const newJob = {
          ...jobData,
          id: savedJobId,
          createdAt: now,
          postedAt: now,
        };

        updatedJobs = [
          ...storedJobs,
          newJob,
        ];
      }

      // STEP 1: SAVE OPPORTUNITY
      localStorage.setItem(
        JOBS_KEY,
        JSON.stringify(updatedJobs)
      );

      // STEP 2: VERIFY SAVED OPPORTUNITY
      const verification = JSON.parse(
        localStorage.getItem(JOBS_KEY) || "[]"
      );

      const savedJob = verification.find(
        (job) =>
          String(job.id) === String(savedJobId)
      );

      if (
        !savedJob ||
        savedJob.status !== "published"
      ) {
        throw new Error(
          "Opportunity could not be verified after saving."
        );
      }

      // STEP 3: CREATE STUDENT NOTIFICATION
      // Notification failure must not cancel a saved job.
      if (!isEditing) {
        try {
          const notifications = readJSON(
            NOTIFICATIONS_KEY,
            []
          );

          notifications.unshift({
            id: `notification-${Date.now()}`,
            jobId: savedJob.id,
            title: "New opportunity available",
            message:
              `${companyName} published ${savedJob.title}.`,
            category: savedJob.category,
            company: companyName,
            applicationStartDate:
              savedJob.applicationStartDate,
            applicationEndDate:
              savedJob.applicationEndDate,
            createdAt: now,
            read: false,
          });

          localStorage.setItem(
            NOTIFICATIONS_KEY,
            JSON.stringify(notifications)
          );

          window.dispatchEvent(
            new Event(
              "careerforge-notifications-updated"
            )
          );
        } catch (notificationError) {
          console.error(
            "Notification could not be saved:",
            notificationError
          );
        }
      }

      // STEP 4: REFRESH COMPANY DASHBOARD
      setJobs(
        verification.filter(
          (job) => job.status === "published"
        )
      );

      // STEP 5: UPDATE OTHER COMPONENTS
      window.dispatchEvent(
        new Event("careerforge-jobs-updated")
      );

      // STEP 6: CLOSE AND RESET FORM
      setShowJobForm(false);
      setEditingId(null);
      setJobForm({ ...emptyJob });
      setActiveTab("jobs");

      // STEP 7: SHOW SUCCESS MESSAGE
      showMessage(
        isEditing
          ? t("updateSuccess")
          : t("uploadSuccess"),
        "success"
      );
    } catch (error) {
      console.error(
        "CareerForge opportunity publishing error:",
        error
      );

      showMessage(
        error.message || t("uploadError"),
        "error"
      );
    }
  };

  // ======================================
  // DELETE OPPORTUNITY
  // ======================================

  const deleteJob = (jobId) => {
    if (!window.confirm(t("confirmDelete"))) {
      return;
    }

    try {
      const allJobs = readJSON(JOBS_KEY, []);

      const target = allJobs.find(
        (job) =>
          String(job.id) === String(jobId)
      );

      if (
        target?.companyEmail &&
        target.companyEmail.toLowerCase() !==
          (profile.email || "").trim().toLowerCase()
      ) {
        showMessage(
          "You cannot delete another company's opportunity.",
          "error"
        );
        return;
      }

      const updatedJobs = allJobs.filter(
        (job) =>
          String(job.id) !== String(jobId)
      );

      if (!saveJSON(JOBS_KEY, updatedJobs)) {
        throw new Error(
          "Unable to save updated opportunity list."
        );
      }

      setJobs(
        updatedJobs.filter(
          (job) => job.status === "published"
        )
      );

      window.dispatchEvent(
        new Event("careerforge-jobs-updated")
      );

      showMessage(t("jobDeleted"));
    } catch (error) {
      console.error(error);

      showMessage(
        error.message || t("jobDeleteError"),
        "error"
      );
    }
  };

  // ======================================
  // APPLICATION STATUS
  // ======================================

  const updateApplicationStatus = (
    applicationId,
    status
  ) => {
    try {
      const allApplications = readJSON(
        APPLICATIONS_KEY,
        []
      );

      const updated = allApplications.map(
        (application) =>
          String(application.id) ===
          String(applicationId)
            ? { ...application, status }
            : application
      );

      if (!saveJSON(APPLICATIONS_KEY, updated)) {
        throw new Error(
          "Could not save application status."
        );
      }

      setApplications(updated);

      window.dispatchEvent(
        new Event(
          "careerforge-applications-updated"
        )
      );

      showMessage(
        `${t("statusUpdated")}: ${getStatusLabel(status)}`
      );
    } catch (error) {
      console.error(error);

      showMessage(
        t("statusUpdateError"),
        "error"
      );
    }
  };

  const getStatusLabel = (status) => {
    const statusKeys = {
      Applied: "appliedStatus",
      "Under Review": "underReview",
      Shortlisted: "shortlisted",
      Interview: "interview",
      Offer: "offer",
      Hired: "hired",
      Rejected: "rejected",
    };

    return t(statusKeys[status] || status);
  };

  // ======================================
  // INLINE STYLES
  // ======================================

  const homeButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 16px",
    borderRadius: "10px",
    border: "1px solid #dce5e2",
    background: "#ffffff",
    color: "#25483d",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const languageSelectStyle = {
    minWidth: "145px",
    maxWidth: "190px",
    height: "42px",
    padding: "0 12px",
    border: "1px solid #dce5e2",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#29483e",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  };

  // ======================================
  // MAIN JSX
  // ======================================

  return (
    <div
      className={`company-dashboard ${
        language === "ar" ? "company-rtl" : ""
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* SIDEBAR */}

      <aside className="company-sidebar">
        <button
          className="company-brand"
          onClick={goHome}
          title={t("homeTitle")}
        >
          <span className="company-brand-icon">
            <GraduationCap size={25} />
          </span>

          <span>
            CareerForge
            <small>{t("companyPortal")}</small>
          </span>
        </button>

        <div className="company-side-label">
          {t("workspace")}
        </div>

        <nav className="company-nav">
          {navigation.map(
            ({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                className={
                  activeTab === id ? "active" : ""
                }
                onClick={() => {
                  setActiveTab(id);
                  setNotice("");
                }}
              >
                <Icon size={19} />
                <span>{t(labelKey)}</span>

                {id === "jobs" &&
                  companyJobs.length > 0 && (
                    <span className="company-nav-count">
                      {companyJobs.length}
                    </span>
                  )}

                {id === "applications" &&
                  companyApplications.length > 0 && (
                    <span className="company-nav-count">
                      {companyApplications.length}
                    </span>
                  )}
              </button>
            )
          )}
        </nav>

        <div className="company-sidebar-bottom">
          <div className="company-help-card">
            <Building2 size={23} />

            <strong>{t("buildTeam")}</strong>

            <p>{t("buildTeamDesc")}</p>

            <button onClick={openNewJobForm}>
              <Plus size={16} />
              {t("postJob")}
            </button>
          </div>

          <button
            className="company-back-link"
            onClick={goHome}
            title={t("homeTitle")}
          >
            <Home size={16} />
            {t("backHome")}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}

      <main className="company-main">
        {/* TOPBAR */}

        <header className="company-topbar">
          <div>
            <span className="company-topbar-kicker">
              {t("companyPortal")}
            </span>

            <h1>
              {t(currentPage?.labelKey || "overview")}
            </h1>
          </div>

          <div className="company-topbar-actions">
            <select
              value={language}
              onChange={handleLanguageChange}
              style={languageSelectStyle}
              aria-label={t("companyLanguage")}
              title={t("companyLanguage")}
            >
              {LANGUAGES.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                >
                  {item.nativeName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={goHome}
              style={homeButtonStyle}
              title={t("homeTitle")}
            >
              <Home size={17} />
              {t("backHome")}
            </button>

            <button
              className="company-primary-button"
              onClick={openNewJobForm}
            >
              <Plus size={18} />
              {t("postJob")}
            </button>
          </div>
        </header>

        {/* SUCCESS / ERROR NOTICE */}

        {notice && (
          <div
            className={`company-notice ${
              noticeType === "error"
                ? "company-notice-error"
                : "company-notice-success"
            }`}
            role="status"
            aria-live="polite"
          >
            {noticeType === "error" ? (
              <X size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}

            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ==================================
            OVERVIEW
        ================================== */}

        {activeTab === "overview" && (
          <>
            <section className="company-welcome">
              <div>
                <span className="company-welcome-tag">
                  <CheckCircle2 size={15} />
                  {t("companyPortal")}
                </span>

                <h2>
                  {t("findPeople")}
                  <br />
                  <span>{t("nextIdea")}</span>
                </h2>

                <p>{t("welcomeDesc")}</p>

                <button
                  className="company-welcome-button"
                  onClick={openNewJobForm}
                >
                  {t("publishOpportunity")}
                  <Plus size={17} />
                </button>
              </div>

              <div className="company-welcome-art">
                <div className="company-art-circle">
                  <Users
                    size={66}
                    strokeWidth={1.3}
                  />
                </div>

                <span className="company-art-badge">
                  <CheckCircle2 size={16} />
                  {t("buildTeam")}
                </span>
              </div>
            </section>

            <section className="company-stat-grid">
              <StatCard
                icon={BriefcaseBusiness}
                color="green"
                label={t("publishedJobs")}
                value={companyJobs.length}
                description={t("yourOpportunities")}
              />

              <StatCard
                icon={Users}
                color="blue"
                label={t("applications")}
                value={companyApplications.length}
                description={t("applicationsLinked")}
              />

              <StatCard
                icon={UserCheck}
                color="purple"
                label={t("shortlisted")}
                value={shortlistedCount}
                description={t("shortlistedDesc")}
              />
            </section>

            <section className="company-panel">
              <div className="company-panel-heading">
                <div>
                  <span className="company-panel-kicker">
                    {t("yourOpportunities")}
                  </span>

                  <h2>{t("recentJobs")}</h2>
                </div>

                <button
                  className="company-text-button"
                  onClick={() => setActiveTab("jobs")}
                >
                  {t("viewAll")}
                  <Eye size={16} />
                </button>
              </div>

              {companyJobs.length === 0 ? (
                <EmptyState
                  icon={BriefcaseBusiness}
                  title={t("noJobs")}
                  message={t("createFirstJob")}
                  buttonLabel={t("createJob")}
                  onClick={openNewJobForm}
                />
              ) : (
                <div className="company-recent-list">
                  {companyJobs
                    .slice(0, 4)
                    .map((job) => (
                      <JobRow
                        key={job.id}
                        job={job}
                        t={t}
                        onEdit={openEditJobForm}
                        onDelete={deleteJob}
                      />
                    ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ==================================
            MANAGE JOBS
        ================================== */}

        {activeTab === "jobs" && (
          <section className="company-panel">
            <div className="company-panel-heading">
              <div>
                <span className="company-panel-kicker">
                  {t("jobManagement")}
                </span>

                <h2>{t("yourListings")}</h2>

                <p>
                  {companyJobs.length}{" "}
                  {t("publishedOpportunities")}
                </p>
              </div>

              <button
                className="company-primary-button"
                onClick={openNewJobForm}
              >
                <Plus size={17} />
                {t("addListing")}
              </button>
            </div>

            <div className="company-job-search">
              <Search size={19} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t("searchJobs")}
              />
            </div>

            {filteredJobs.length === 0 ? (
              <EmptyState
                icon={Search}
                title={
                  companyJobs.length
                    ? t("noMatchingJobs")
                    : t("emptyJobList")
                }
                message={
                  companyJobs.length
                    ? t("trySearch")
                    : t("publishToStart")
                }
                buttonLabel={
                  companyJobs.length
                    ? undefined
                    : t("postFirstJob")
                }
                onClick={openNewJobForm}
              />
            ) : (
              <div className="company-recent-list">
                {filteredJobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    t={t}
                    onEdit={openEditJobForm}
                    onDelete={deleteJob}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ==================================
            STUDENT APPLICATIONS
        ================================== */}

        {activeTab === "applications" && (
          <section className="company-panel">
            <div className="company-panel-heading">
              <div>
                <span className="company-panel-kicker">
                  {t("candidateManagement")}
                </span>

                <h2>{t("studentApplications")}</h2>

                <p>{t("reviewCandidates")}</p>
              </div>
            </div>

            {companyApplications.length === 0 ? (
              <EmptyState
                icon={Users}
                title={t("noApplications")}
                message={t("applicationsAppear")}
              />
            ) : (
              <div className="company-applications-list">
                {companyApplications.map(
                  (application) => {
                    const job = companyJobs.find(
                      (item) =>
                        String(item.id) ===
                        String(application.jobId)
                    );

                    return (
                      <article
                        className="company-application-card"
                        key={application.id}
                      >
                        <ProfileAvatar
                          className="company-applicant-avatar"
                          image={application.profileImage}
                          name={application.studentName}
                        />

                        <div className="company-applicant-details">
                          <h3>
                            {application.studentName ||
                              t("student")}
                          </h3>

                          <p>
                            {t("appliedFor")}:{" "}
                            {job?.title ||
                              application.jobTitle ||
                              "Opportunity"}
                          </p>

                          <p>
                            {application.email ||
                              t("emailMissing")}
                          </p>

                          <span className="company-application-status">
                            {getStatusLabel(
                              application.status || "Applied"
                            )}
                          </span>
                        </div>

                        <div className="company-applicant-actions">
                          <label>
                            {t("applicationStatus")}

                            <select
                              value={
                                application.status || "Applied"
                              }
                              onChange={(event) =>
                                updateApplicationStatus(
                                  application.id,
                                  event.target.value
                                )
                              }
                            >
                              <option value="Applied">
                                {t("appliedStatus")}
                              </option>

                              <option value="Under Review">
                                {t("underReview")}
                              </option>

                              <option value="Shortlisted">
                                {t("shortlisted")}
                              </option>

                              <option value="Interview">
                                {t("interview")}
                              </option>

                              <option value="Offer">
                                {t("offer")}
                              </option>

                              <option value="Hired">
                                {t("hired")}
                              </option>

                              <option value="Rejected">
                                {t("rejected")}
                              </option>
                            </select>
                          </label>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* ==================================
            COMPANY PROFILE
        ================================== */}

        {activeTab === "profile" && (
          <section className="company-panel">
            <div className="company-panel-heading">
              <div>
                <span className="company-panel-kicker">
                  {t("organization")}
                </span>

                <h2>{t("companyInfo")}</h2>
                <p>{t("enterCompanyDetails")}</p>
              </div>
            </div>

            <form
              className="company-form"
              onSubmit={saveProfile}
            >
              <ProfilePhotoPicker
                key={profile.logo || "company-logo-empty"}
                label="Company logo"
                company
                value={profile.logo || ""}
                onChange={(file) => {
                  setCompanyLogoFile(file);
                  setCompanyLogoChanged(true);
                }}
              />
              <div className="company-profile-preview">
                <ProfileAvatar className="company-profile-avatar" image={profile.logo} name={profile.name} />
                <span>The same saved logo appears wherever your company profile is shown.</span>
              </div>
              <div className="company-form-grid">
                <FormField label={`${t("companyName")} *`}>
                  <input
                    required
                    value={profile.name}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        name: event.target.value,
                      })
                    }
                    placeholder={t("companyNamePlaceholder")}
                  />
                </FormField>

                <FormField label={`${t("companyEmail")} *`}>
                  <input
                    required
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        email: event.target.value,
                      })
                    }
                    placeholder={t("companyEmailPlaceholder")}
                  />
                </FormField>

                <FormField label={t("website")}>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        website: event.target.value,
                      })
                    }
                    placeholder={t("websitePlaceholder")}
                  />
                </FormField>

                <FormField label={t("industry")}>
                  <input
                    value={profile.industry}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        industry: event.target.value,
                      })
                    }
                    placeholder={t("industryPlaceholder")}
                  />
                </FormField>

                <FormField label={t("companyLocation")}>
                  <input
                    value={profile.location}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        location: event.target.value,
                      })
                    }
                    placeholder={t("locationPlaceholder")}
                  />
                </FormField>
              </div>

              <FormField label={t("aboutCompany")}>
                <textarea
                  rows={5}
                  value={profile.description}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      description: event.target.value,
                    })
                  }
                  placeholder={t("aboutPlaceholder")}
                />
              </FormField>

              <div className="company-form-footer">
                <p>{t("requiredFields")}</p>

                <button
                  className="company-primary-button"
                  type="submit"
                >
                  <CheckCircle2 size={17} />
                  {t("saveProfile")}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* FOOTER */}

        <footer className="company-footer">
          <span>CareerForge</span>
          <p>{t("footer")}</p>
        </footer>
      </main>

      {/* ==================================
          OPPORTUNITY MODAL
      ================================== */}

      {showJobForm && (
        <div
          className="company-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowJobForm(false);
            }
          }}
        >
          <section
            className="company-job-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-job-modal-title"
          >
            <div className="company-modal-header">
              <div>
                <span className="company-panel-kicker">
                  {t("opportunityBuilder")}
                </span>

                <h2 id="company-job-modal-title">
                  {editingId
                    ? t("editOpportunity")
                    : t("newOpportunity")}
                </h2>

                <p>{t("accurateDetails")}</p>
              </div>

              <button
                type="button"
                className="company-modal-close"
                onClick={() => setShowJobForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="company-form"
              onSubmit={saveJob}
              noValidate
            >
              {/* BASIC DETAILS */}

              <FormField label={`${t("jobTitle")} *`}>
                <input
                  required
                  value={jobForm.title}
                  onChange={(event) =>
                    updateJobField(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder={t("jobTitlePlaceholder")}
                />
              </FormField>

              <div className="company-form-grid">
                <FormField label={`${t("opportunityType")} *`}>
                  <select
                    value={jobForm.category}
                    onChange={(event) =>
                      handleCategoryChange(
                        event.target.value
                      )
                    }
                  >
                    <option value="Internship">
                      {t("internship")}
                    </option>

                    <option value="Full-time Job">
                      {t("fullTime")}
                    </option>

                    <option value="Part-time Job">
                      {t("partTime")}
                    </option>

                    <option value="Contract">
                      {t("contract")}
                    </option>
                  </select>
                </FormField>

                <FormField label={`${t("workMode")} *`}>
                  <select
                    value={jobForm.mode}
                    onChange={(event) =>
                      updateJobField(
                        "mode",
                        event.target.value
                      )
                    }
                  >
                    <option value="Remote">
                      {t("remote")}
                    </option>

                    <option value="Hybrid">
                      {t("hybrid")}
                    </option>

                    <option value="On-site">
                      {t("onsite")}
                    </option>
                  </select>
                </FormField>

                <FormField label={t("location")}>
                  <input
                    value={jobForm.location}
                    onChange={(event) =>
                      updateJobField(
                        "location",
                        event.target.value
                      )
                    }
                    placeholder={t("jobLocationPlaceholder")}
                  />
                </FormField>
              </div>

              {/* INTERNSHIP DETAILS */}

              {jobForm.category === "Internship" && (
                <>
                  <div className="company-form-section-heading">
                    <GraduationCap size={19} />
                    <h3>Internship Details</h3>
                  </div>

                  <div className="company-form-grid">
                    <FormField label="Internship Work Type *">
                      <select
                        value={jobForm.internshipWorkType}
                        onChange={(event) =>
                          updateJobField(
                            "internshipWorkType",
                            event.target.value
                          )
                        }
                      >
                        <option value="Full-time">
                          Full-time
                        </option>

                        <option value="Part-time">
                          Part-time
                        </option>
                      </select>
                    </FormField>

                    <FormField label="Duration (Months) *">
                      <input
                        type="number"
                        min="1"
                        max="36"
                        required
                        value={jobForm.durationMonths}
                        onChange={(event) =>
                          updateJobField(
                            "durationMonths",
                            event.target.value
                          )
                        }
                        placeholder="Example: 6"
                      />
                    </FormField>

                    <FormField label="Payment Type *">
                      <select
                        value={jobForm.stipendStatus}
                        onChange={(event) =>
                          updateJobField(
                            "stipendStatus",
                            event.target.value
                          )
                        }
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    </FormField>

                    <FormField label="Stipend Currency">
                      <select
                        value={jobForm.stipendCurrency}
                        onChange={(event) =>
                          updateJobField(
                            "stipendCurrency",
                            event.target.value
                          )
                        }
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="JPY">JPY</option>
                        <option value="KRW">KRW</option>
                      </select>
                    </FormField>

                    <FormField label="Monthly Stipend *">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={
                          jobForm.stipendStatus === "Unpaid"
                        }
                        required={
                          jobForm.stipendStatus === "Paid"
                        }
                        value={jobForm.monthlyStipend}
                        onChange={(event) =>
                          updateJobField(
                            "monthlyStipend",
                            event.target.value
                          )
                        }
                        placeholder="Example: 15000"
                      />
                    </FormField>

                    <FormField label="PPO Available?">
                      <select
                        value={jobForm.ppoAvailable}
                        onChange={(event) =>
                          updateJobField(
                            "ppoAvailable",
                            event.target.value
                          )
                        }
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </FormField>

                    <FormField label="Internship Start Date *">
                      <input
                        type="date"
                        required
                        min={todayISO()}
                        value={jobForm.internshipStartDate}
                        onChange={(event) =>
                          updateJobField(
                            "internshipStartDate",
                            event.target.value
                          )
                        }
                      />
                    </FormField>

                    <FormField label="Internship End Date *">
                      <input
                        type="date"
                        required
                        min={
                          jobForm.internshipStartDate ||
                          todayISO()
                        }
                        value={jobForm.internshipEndDate}
                        onChange={(event) =>
                          updateJobField(
                            "internshipEndDate",
                            event.target.value
                          )
                        }
                      />
                    </FormField>
                  </div>

                  <div className="company-field-note">
                    <Wallet size={17} />

                    <span>
                      Total stipend is calculated from monthly
                      stipend multiplied by internship duration.
                    </span>
                  </div>
                </>
              )}

              {/* PLACEMENT DETAILS */}

              {jobForm.category !== "Internship" && (
                <>
                  <div className="company-form-section-heading">
                    <BriefcaseBusiness size={19} />
                    <h3>Placement / Job Details</h3>
                  </div>

                  <div className="company-form-grid">
                    <FormField label="Employment Type *">
                      <select
                        value={jobForm.category}
                        onChange={(event) =>
                          handleCategoryChange(
                            event.target.value
                          )
                        }
                      >
                        <option value="Full-time Job">
                          Full-time
                        </option>

                        <option value="Part-time Job">
                          Part-time
                        </option>

                        <option value="Contract">
                          Contract
                        </option>
                      </select>
                    </FormField>

                    <FormField label="Annual Salary Currency *">
                      <select
                        value={jobForm.salaryCurrency}
                        onChange={(event) =>
                          updateJobField(
                            "salaryCurrency",
                            event.target.value
                          )
                        }
                      >
                        <option value="INR">INR (LPA)</option>
                        <option value="USD">USD (Yearly)</option>
                        <option value="EUR">EUR (Yearly)</option>
                        <option value="GBP">GBP (Yearly)</option>
                        <option value="CAD">CAD (Yearly)</option>
                        <option value="AUD">AUD (Yearly)</option>
                        <option value="JPY">JPY (Yearly)</option>
                        <option value="KRW">KRW (Yearly)</option>
                      </select>
                    </FormField>

                    <FormField label="Minimum Annual Salary *">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={jobForm.minSalary}
                        onChange={(event) =>
                          updateJobField(
                            "minSalary",
                            event.target.value
                          )
                        }
                        placeholder={
                          jobForm.salaryCurrency === "INR"
                            ? "Example: 6 (LPA)"
                            : "Annual salary amount"
                        }
                      />
                    </FormField>

                    <FormField label="Maximum Annual Salary *">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={jobForm.maxSalary}
                        onChange={(event) =>
                          updateJobField(
                            "maxSalary",
                            event.target.value
                          )
                        }
                        placeholder={
                          jobForm.salaryCurrency === "INR"
                            ? "Example: 12 (LPA)"
                            : "Annual salary amount"
                        }
                      />
                    </FormField>

                    <FormField label="Fixed Annual Pay">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={jobForm.fixedSalary}
                        onChange={(event) =>
                          updateJobField(
                            "fixedSalary",
                            event.target.value
                          )
                        }
                        placeholder="Fixed annual amount"
                      />
                    </FormField>

                    <FormField label="Variable Pay / Bonus">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={jobForm.variableSalary}
                        onChange={(event) =>
                          updateJobField(
                            "variableSalary",
                            event.target.value
                          )
                        }
                        placeholder="Variable annual amount"
                      />
                    </FormField>

                    <FormField label="Required Experience *">
                      <select
                        value={jobForm.experienceLevel}
                        onChange={(event) =>
                          updateJobField(
                            "experienceLevel",
                            event.target.value
                          )
                        }
                      >
                        <option value="Fresher">Fresher</option>
                        <option value="0-1 years">0–1 years</option>
                        <option value="1-2 years">1–2 years</option>
                        <option value="2-5 years">2–5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </FormField>

                    <FormField label="Expected Joining Date">
                      <input
                        type="date"
                        min={todayISO()}
                        value={jobForm.expectedJoiningDate}
                        onChange={(event) =>
                          updateJobField(
                            "expectedJoiningDate",
                            event.target.value
                          )
                        }
                      />
                    </FormField>
                  </div>

                  <div className="company-field-note">
                    <Wallet size={17} />

                    <span>
                      For INR, enter annual CTC in LPA.
                      For international currencies, enter
                      annual salary in that currency.
                    </span>
                  </div>
                </>
              )}

              {/* REQUIRED SKILLS */}

              <FormField label={`${t("requiredSkills")} *`}>
                <input
                  required
                  value={jobForm.skills}
                  onChange={(event) =>
                    updateJobField(
                      "skills",
                      event.target.value
                    )
                  }
                  placeholder={t("skillsPlaceholder")}
                />
              </FormField>

              {/* APPLICATION WINDOW */}

              <div className="company-form-section-heading">
                <CalendarDays size={19} />
                <h3>Application Schedule</h3>
              </div>

              <div className="company-form-grid">
                <FormField label="Application Start Date *">
                  <input
                    type="date"
                    required
                    min={todayISO()}
                    value={jobForm.applicationStartDate}
                    onChange={(event) =>
                      updateJobField(
                        "applicationStartDate",
                        event.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Application Last Date *">
                  <input
                    type="date"
                    required
                    min={
                      jobForm.applicationStartDate ||
                      todayISO()
                    }
                    value={jobForm.applicationEndDate}
                    onChange={(event) =>
                      updateJobField(
                        "applicationEndDate",
                        event.target.value
                      )
                    }
                  />
                </FormField>
              </div>

              {/* DESCRIPTION */}

              <FormField label={`${t("jobDescription")} *`}>
                <textarea
                  required
                  rows={4}
                  value={jobForm.description}
                  onChange={(event) =>
                    updateJobField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder={t("descriptionPlaceholder")}
                />
              </FormField>

              <FormField label={t("requirements")}>
                <textarea
                  rows={3}
                  value={jobForm.requirements}
                  onChange={(event) =>
                    updateJobField(
                      "requirements",
                      event.target.value
                    )
                  }
                  placeholder={t("requirementsPlaceholder")}
                />
              </FormField>

              {/* FOOTER BUTTONS */}

              <div className="company-modal-footer">
                <button
                  type="button"
                  className="company-secondary-button"
                  onClick={() => setShowJobForm(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  className="company-primary-button"
                >
                  <Send size={17} />

                  {editingId
                    ? t("saveChanges")
                    : t("publish")}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon: Icon,
  color,
  label,
  value,
  description,
}) {
  return (
    <article className="company-stat-card">
      <span className={`company-stat-icon ${color}`}>
        <Icon size={22} />
      </span>

      <p>{label}</p>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}

// ==========================================
// FORM FIELD
// ==========================================

function FormField({ label, children }) {
  return (
    <label className="company-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================

function EmptyState({
  icon: Icon,
  title,
  message,
  buttonLabel,
  onClick,
}) {
  return (
    <div className="company-empty">
      <span>
        <Icon size={27} />
      </span>

      <h3>{title}</h3>
      <p>{message}</p>

      {buttonLabel && (
        <button
          type="button"
          className="company-primary-button"
          onClick={onClick}
        >
          <Plus size={17} />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

// ==========================================
// JOB ROW
// ==========================================

function JobRow({ job, onEdit, onDelete, t }) {
  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
      ? job.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const displayMode =
    job.mode === "Remote"
      ? t("remote")
      : job.mode === "Hybrid"
        ? t("hybrid")
        : job.mode === "On-site"
          ? t("onsite")
          : job.mode || t("notSpecified");

  const isInternship =
    job.category === "Internship";

  const salaryText =
    job.pay ||
    job.salary ||
    t("notSpecified");

  const applicationDeadline =
    job.applicationEndDate
      ? formatDate(job.applicationEndDate)
      : "";

  return (
    <article className="company-job-row">
      <div className="company-job-icon">
        <BriefcaseBusiness size={22} />
      </div>

      <div className="company-job-details">
        <div className="company-job-title-line">
          <h3>{job.title}</h3>

          <span className="company-published-badge">
            <CheckCircle2 size={13} />
            {t("published")}
          </span>
        </div>

        <div className="company-job-meta">
          <span>
            <MapPin size={14} />
            {job.location || t("locationUnknown")}
          </span>

          <span>
            <Clock size={14} />
            {isInternship
              ? job.durationMonths
                ? `${job.durationMonths} months`
                : job.duration || t("notSpecified")
              : job.experienceLevel || t("notSpecified")}
          </span>

          <span>
            <Wallet size={14} />
            {salaryText}
          </span>

          <span>
            <Globe size={14} />
            {displayMode}
          </span>
        </div>

        <div className="company-job-extra-info">
          <span>
            <BadgeCheck size={14} />

            {isInternship
              ? `PPO: ${job.ppoAvailable || "No"}`
              : job.category || "Job"}
          </span>

          {applicationDeadline && (
            <span>
              <CalendarDays size={14} />
              Apply by: {applicationDeadline}
            </span>
          )}
        </div>

        {skills.length > 0 && (
          <div className="company-job-skills">
            {skills.slice(0, 5).map((skill, index) => (
              <span key={`${skill}-${index}`}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="company-job-actions">
        <button
          type="button"
          title={t("edit")}
          aria-label={t("edit")}
          onClick={() => onEdit(job)}
        >
          <Pencil size={17} />
        </button>

        <button
          type="button"
          className="delete"
          title={t("delete")}
          aria-label={t("delete")}
          onClick={() => onDelete(job.id)}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
