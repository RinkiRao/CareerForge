
const JOBS_KEY = "careerforge_company_jobs";
const APPLICATIONS_KEY = "careerforge_job_applications";
const NOTIFICATIONS_KEY = "careerforge_student_notifications";

// ==========================================
// STORAGE HELPERS
// ==========================================

function readStorage(key) {
  try {
    const data = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return [];
  }
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
}

function createId(prefix) {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`
  );
}

function notifyChange(eventName) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(eventName));
  }
}

// ==========================================
// DATE HELPERS
// ==========================================

// Local date in YYYY-MM-DD format
export function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ==========================================
// APPLICATION WINDOW STATUS
// ==========================================

// Returns:
// upcoming = application has not started
// open = students can apply
// closed = application deadline passed
// unknown = dates are not available

export function getApplicationWindowStatus(job) {
  if (!job) {
    return "unknown";
  }

  const startDate = job.applicationStartDate;
  const endDate = job.applicationEndDate;

  // Older jobs without dates remain compatible.
  if (!startDate || !endDate) {
    return "unknown";
  }

  const today = getTodayDate();

  if (today < startDate) {
    return "upcoming";
  }

  if (today > endDate) {
    return "closed";
  }

  return "open";
}

// Check whether an opportunity currently accepts applications.

export function canApplyForCompanyJob(job) {
  if (!job || !job.id) {
    return false;
  }

  if (
    job.status &&
    job.status !== "published"
  ) {
    return false;
  }

  const applicationStatus =
    getApplicationWindowStatus(job);

  // Legacy opportunities without dates are allowed.
  return (
    applicationStatus === "open" ||
    applicationStatus === "unknown"
  );
}

// ==========================================
// GET ALL PUBLISHED COMPANY JOBS
// ==========================================

export function getCompanyJobs() {
  return readStorage(JOBS_KEY).filter(
    (job) =>
      job &&
      job.status === "published"
  );
}

// ==========================================
// GET OPPORTUNITY DETAILS
// ==========================================

export function getCompanyJobById(jobId) {
  if (!jobId) return null;

  return (
    getCompanyJobs().find(
      (job) =>
        String(job.id) === String(jobId)
    ) || null
  );
}

// ==========================================
// PUBLISH A NEW COMPANY OPPORTUNITY
// ==========================================

export function publishCompanyJob(job) {
  if (!job || typeof job !== "object") {
    throw new Error("Invalid opportunity details.");
  }

  if (
    !job.title?.trim() ||
    !job.company?.trim() ||
    !job.companyEmail?.trim()
  ) {
    throw new Error(
      "Opportunity title and company details are required."
    );
  }

  const jobs = readStorage(JOBS_KEY);

  const newJob = {
    ...job,

    id: job.id || createId("job"),

    // Keep the category and type fields consistent.
    category:
      job.category ||
      job.opportunityType ||
      "Internship",

    opportunityType:
      job.opportunityType ||
      job.category ||
      "Internship",

    status: "published",

    postedAt:
      job.postedAt ||
      new Date().toISOString(),

    createdAt:
      job.createdAt ||
      new Date().toISOString(),
  };

  const saved = writeStorage(
    JOBS_KEY,
    [...jobs, newJob]
  );

  if (!saved) {
    throw new Error(
      "Unable to publish opportunity. Storage may be full."
    );
  }

  // ======================================
  // CREATE STUDENT NOTIFICATION
  // ======================================

  const notifications = readStorage(
    NOTIFICATIONS_KEY
  );

  const newNotification = {
    id: createId("notification"),

    jobId: newJob.id,
    title: "New opportunity available",

    message: `${
      newJob.company || "A company"
    } published ${
      newJob.title || "a new opportunity"
    }. Apply before the closing date.`,

    category: newJob.category,
    company: newJob.company,

    applicationStartDate:
      newJob.applicationStartDate || "",

    applicationEndDate:
      newJob.applicationEndDate || "",

    createdAt: new Date().toISOString(),
    read: false,
  };

  const notificationSaved = writeStorage(
    NOTIFICATIONS_KEY,
    [...notifications, newNotification]
  );

  if (!notificationSaved) {
    console.warn(
      "Opportunity published, but notification could not be saved."
    );
  }

  notifyChange("careerforge-jobs-updated");
  notifyChange("careerforge-notifications-updated");

  return newJob;
}

// ==========================================
// UPDATE COMPANY OPPORTUNITY
// ==========================================

export function updateCompanyJob(jobId, updates) {
  if (!jobId || !updates) {
    return {
      success: false,
      message: "Opportunity details are missing.",
    };
  }

  const jobs = readStorage(JOBS_KEY);

  const index = jobs.findIndex(
    (job) =>
      String(job.id) === String(jobId)
  );

  if (index === -1) {
    return {
      success: false,
      message: "Opportunity not found.",
    };
  }

  const updatedJob = {
    ...jobs[index],
    ...updates,
    id: jobs[index].id,
    updatedAt: new Date().toISOString(),
  };

  jobs[index] = updatedJob;

  const saved = writeStorage(JOBS_KEY, jobs);

  if (!saved) {
    return {
      success: false,
      message: "Unable to update opportunity.",
    };
  }

  notifyChange("careerforge-jobs-updated");

  return {
    success: true,
    job: updatedJob,
    message: "Opportunity updated successfully.",
  };
}

// ==========================================
// DELETE COMPANY OPPORTUNITY
// ==========================================

export function deleteCompanyJob(jobId) {
  if (!jobId) {
    return {
      success: false,
      message: "Opportunity ID is missing.",
    };
  }

  const jobs = readStorage(JOBS_KEY);

  const updatedJobs = jobs.filter(
    (job) =>
      String(job.id) !== String(jobId)
  );

  if (updatedJobs.length === jobs.length) {
    return {
      success: false,
      message: "Opportunity not found.",
    };
  }

  const saved = writeStorage(
    JOBS_KEY,
    updatedJobs
  );

  if (!saved) {
    return {
      success: false,
      message: "Unable to delete opportunity.",
    };
  }

  notifyChange("careerforge-jobs-updated");

  return {
    success: true,
    message: "Opportunity deleted successfully.",
  };
}

// ==========================================
// GET STUDENT NOTIFICATIONS
// ==========================================

export function getStudentNotifications() {
  return readStorage(NOTIFICATIONS_KEY).sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
  );
}

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

export function markNotificationsRead() {
  const notifications = readStorage(
    NOTIFICATIONS_KEY
  ).map((notification) => ({
    ...notification,
    read: true,
  }));

  const saved = writeStorage(
    NOTIFICATIONS_KEY,
    notifications
  );

  if (saved) {
    notifyChange(
      "careerforge-notifications-updated"
    );
  }

  return notifications;
}

// ==========================================
// GET STUDENT APPLICATIONS
// ==========================================

export function getStudentApplications(email) {
  const applications = readStorage(
    APPLICATIONS_KEY
  );

  if (!email) return [];

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  return applications.filter(
    (application) =>
      (
        application.studentEmail ||
        application.email ||
        ""
      )
        .trim()
        .toLowerCase() === normalizedEmail
  );
}

// ==========================================
// GET ALL APPLICATIONS FOR A PARTICULAR JOB
// ==========================================

export function getJobApplications(jobId) {
  const applications = readStorage(
    APPLICATIONS_KEY
  );

  if (!jobId) return [];

  return applications.filter(
    (application) =>
      String(application.jobId) === String(jobId)
  );
}

// ==========================================
// APPLY FOR A COMPANY OPPORTUNITY
// ==========================================

export function applyForCompanyJob(job, profile) {
  if (!job?.id) {
    return {
      success: false,
      message: "Opportunity details are missing.",
    };
  }

  // Check whether the opportunity is published.
  if (
    job.status &&
    job.status !== "published"
  ) {
    return {
      success: false,
      message: "This opportunity is not currently published.",
    };
  }

  // ======================================
  // CHECK APPLICATION DATES
  // ======================================

  const windowStatus =
    getApplicationWindowStatus(job);

  if (windowStatus === "upcoming") {
    return {
      success: false,
      code: "APPLICATION_NOT_STARTED",
      message: `Applications open on ${job.applicationStartDate}.`,
    };
  }

  if (windowStatus === "closed") {
    return {
      success: false,
      code: "APPLICATION_CLOSED",
      message: `Application deadline was ${job.applicationEndDate}.`,
    };
  }

  // ======================================
  // CHECK STUDENT PROFILE
  // ======================================

  const studentName =
    profile?.name?.trim() || "";

  const studentEmail =
    profile?.email?.trim().toLowerCase() || "";

  if (!studentName || !studentEmail) {
    return {
      success: false,
      code: "PROFILE_INCOMPLETE",
      message:
        "Please enter your name and email in your profile first.",
    };
  }

  // ======================================
  // CHECK DUPLICATE APPLICATION
  // ======================================

  const applications = readStorage(
    APPLICATIONS_KEY
  );

  const alreadyApplied = applications.some(
    (application) =>
      String(application.jobId) === String(job.id) &&
      (
        application.studentEmail ||
        application.email ||
        ""
      )
        .trim()
        .toLowerCase() === studentEmail
  );

  if (alreadyApplied) {
    return {
      success: false,
      code: "ALREADY_APPLIED",
      message:
        "You have already applied for this opportunity.",
    };
  }

  // ======================================
  // CREATE APPLICATION
  // ======================================

  const application = {
    id: createId("application"),

    jobId: job.id,
    jobTitle: job.title || "",
    company: job.company || "",
    companyEmail: job.companyEmail || "",

    studentName,
    studentEmail,
    email: studentEmail,
    profileImage: profile?.profileImage || "",

    category:
      job.category ||
      job.opportunityType ||
      "",

    status: "Applied",

    // Preserve opportunity information in application record.
    applicationStartDate:
      job.applicationStartDate || "",

    applicationEndDate:
      job.applicationEndDate || "",

    salary: job.salary || job.pay || "",

    duration: job.duration || "",

    monthlyStipend:
      job.monthlyStipend || "",

    stipendCurrency:
      job.stipendCurrency || "",

    totalStipend:
      job.totalStipend || 0,

    minSalary:
      job.minSalary || "",

    maxSalary:
      job.maxSalary || "",

    salaryCurrency:
      job.salaryCurrency || "",

    experienceLevel:
      job.experienceLevel || "",

    workMode:
      job.mode || job.workMode || "",

    createdAt: new Date().toISOString(),
  };

  const saved = writeStorage(
    APPLICATIONS_KEY,
    [...applications, application]
  );

  if (!saved) {
    return {
      success: false,
      code: "SAVE_FAILED",
      message:
        "Application could not be saved. Please try again.",
    };
  }

  notifyChange(
    "careerforge-applications-updated"
  );

  return {
    success: true,
    message:
      "Application submitted successfully!",
    application,
  };
}
