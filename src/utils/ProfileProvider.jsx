import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, persistCentralProfile } from "./profilePhoto";
import { ProfileContext } from "./profileContextStore";

function cachedProfile(type) {
  const key = type === "company"
    ? "careerforge_company_profile"
    : "careerforge_student_profile";
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export function ProfileProvider({ children }) {
  const location = useLocation();
  const [profile, setProfile] = useState(() => {
    const type = localStorage.getItem("careerforge_student_token")
      ? "student"
      : localStorage.getItem("careerforge_company_token")
        ? "company"
        : null;
    return type ? cachedProfile(type) : null;
  });
  const [accountType, setAccountType] = useState(() =>
    localStorage.getItem("careerforge_student_token")
      ? "student"
      : localStorage.getItem("careerforge_company_token")
        ? "company"
        : null
  );

  const refresh = useCallback(async () => {
    const studentToken = localStorage.getItem("careerforge_student_token");
    const companyToken = localStorage.getItem("careerforge_company_token");
    const type = studentToken ? "student" : companyToken ? "company" : null;
    const token = studentToken || companyToken;
    await Promise.resolve();
    setAccountType(type);

    if (!type || !token) {
      setProfile(null);
      return;
    }

    const endpoint = type === "student"
      ? "/api/users/me"
      : "/api/company-auth/me";
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      const currentProfile = data.user || data.company;
      if (!response.ok || !currentProfile) {
        if (response.status === 401 || response.status === 403) {
          setProfile(null);
        }
        return;
      }

      persistCentralProfile(currentProfile, type);
      setProfile(currentProfile);
    } catch (error) {
      console.error("Unable to refresh authenticated profile:", error);
    }
  }, []);

  useEffect(() => {
    const refreshTimeout = window.setTimeout(() => {
      refresh();
    }, 0);
    const handleProfileUpdated = () => {
      const type = localStorage.getItem("careerforge_student_token")
        ? "student"
        : localStorage.getItem("careerforge_company_token")
          ? "company"
          : null;
      setAccountType(type);
      setProfile(type ? cachedProfile(type) : null);
    };
    window.addEventListener("careerforge-profile-updated", handleProfileUpdated);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener("careerforge-profile-updated", handleProfileUpdated);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh, location.pathname]);

  return (
    <ProfileContext.Provider value={{ profile, accountType, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}
