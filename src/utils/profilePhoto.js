export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export function resolveProfilePhotoUrl(image) {
  if (!image) return "";
  if (/^(https?:|blob:)/i.test(image)) return image;
  return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

export function persistCentralProfile(profile, type = "student") {
  if (!profile) return;

  const isCompany = type === "company";
  const profileKey = isCompany
    ? "careerforge_company_profile"
    : "careerforge_student_profile";
  localStorage.setItem(profileKey, JSON.stringify(profile));

  if (isCompany) {
    const currentCompany = JSON.parse(
      localStorage.getItem("careerforge_current_company") || "{}"
    );
    localStorage.setItem(
      "careerforge_current_company",
      JSON.stringify({
        ...currentCompany,
        id: profile.id || currentCompany.id,
        email: profile.email || currentCompany.email,
        name: profile.companyName || profile.name || currentCompany.name,
        logo: profile.logo || "",
      })
    );
  } else {
    localStorage.setItem("careerforge_current_student", JSON.stringify(profile));
  }

  window.dispatchEvent(new Event("careerforge-profile-updated"));
}
