
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAccountSession() {
  const studentToken = localStorage.getItem(
    "careerforge_student_token"
  );

  const companyToken = localStorage.getItem(
    "careerforge_company_token"
  );

  if (studentToken) {
    return {
      type: "student",
      token: studentToken,
    };
  }

  if (companyToken) {
    return {
      type: "company",
      token: companyToken,
    };
  }

  return null;
}

function getSessionId(type) {
  const key = `careerforge_activity_session_${type}`;

  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

export default function AccountActivityTracker() {
  const location = useLocation();

  useEffect(() => {
    const account = getAccountSession();

    if (!account) return;

    const sessionId = getSessionId(account.type);

    let cancelled = false;

    const sendActivity = async (event) => {
      if (cancelled) return;

      try {
        await fetch(
          `${API_BASE_URL}/api/account-activity/heartbeat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${account.token}`,
            },
            body: JSON.stringify({
              sessionId,
              page: location.pathname,
              event,
            }),
          }
        );
      } catch {
        // A temporary network issue must not interrupt the app.
      }
    };

    // Record the current CareerForge page.
    sendActivity("page_view");

    // Record active time while this tab is visible.
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sendActivity("heartbeat");
      }
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [location.pathname]);

  return null;
}
