import { useState } from "react";
import { resolveProfilePhotoUrl } from "../utils/profilePhoto";
import { useCentralProfile } from "../utils/profileContextStore";

export default function ProfileAvatar({
  image,
  name,
  className = "",
  alt = "",
}) {
  const centralProfile = useCentralProfile();
  const [failedUrl, setFailedUrl] = useState("");
  const source = image === undefined
    ? centralProfile?.profileImage || centralProfile?.logo || ""
    : image;
  const displayName = name || centralProfile?.name || centralProfile?.companyName || "";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "?";
  const photoUrl = resolveProfilePhotoUrl(source);

  return (
    <span className={`cf-profile-avatar ${className}`.trim()}>
      {photoUrl && failedUrl !== photoUrl
        ? <img src={photoUrl} alt={alt} onError={() => setFailedUrl(photoUrl)} />
        : initials}
    </span>
  );
}
