import { useNavigate } from "react-router-dom";
import { ArrowLeft, BrainCircuit, Sparkles } from "lucide-react";
import MiraVoiceGuide from "./MiraVoiceGuide";
import { useCentralProfile } from "../utils/profileContextStore";
import "./MiraApplication.css";

function readStoredProfile(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") || {};
  } catch {
    return {};
  }
}

export default function MiraApplication() {
  const navigate = useNavigate();
  const centralProfile = useCentralProfile();
  const savedProfile = readStoredProfile("careerforge_student_profile");
  const savedStudent = readStoredProfile("careerforge_current_student");
  const profile = {
    name:
      centralProfile?.name ||
      savedProfile.name ||
      savedStudent.fullName ||
      savedStudent.name ||
      "Student",
    language:
      centralProfile?.language ||
      savedProfile.language ||
      savedStudent.language ||
      localStorage.getItem("careerforge_language") ||
      "en",
  };

  const openStudentSection = (section) => {
    navigate("/students-dashboard", { state: { activePage: section } });
  };

  return (
    <div className="mira-application">
      <header className="mira-application-header">
        <div className="mira-application-brand">
          <span className="mira-application-mark">
            <BrainCircuit size={22} />
          </span>
          <span>
            <strong>CareerForge</strong>
            <small>AI COMPANION</small>
          </span>
        </div>
        <button
          type="button"
          className="mira-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>
      </header>

      <main className="mira-application-main">
        <div className="mira-application-heading">
          <span className="mira-eyebrow">
            <Sparkles size={15} />
            YOUR PRIVATE CAREER COMPANION
          </span>
          <h1>MIRA AI Companion</h1>
          <p>
            Ask MIRA anything by voice, or enable wake-word listening while
            this page is open. MIRA only requests microphone access after you
            choose a voice action.
          </p>
        </div>

        <MiraVoiceGuide
          profile={profile}
          pageContext="MIRA AI Companion"
          onNavigate={openStudentSection}
        />

        <button
          type="button"
          className="mira-dashboard-link"
          onClick={() => navigate("/students-dashboard")}
        >
          Return to Student Dashboard
        </button>
      </main>
    </div>
  );
}
