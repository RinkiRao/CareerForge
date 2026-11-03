import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  CodeXml,
  ExternalLink,
  Globe2,
  GraduationCap,
  Home,
  Image,
  Link as LinkIcon,
  LockKeyhole,
  MessageCircle,
  MessageSquareText,
  MapPin,
  Bell,
  Pencil,
  Plus,
  Search,
  Share2,
  Send,
  Sparkles,
  ThumbsUp,
  Trash2,
  UserRound,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import ProfilePhotoPicker from "./ProfilePhotoPicker";
import { persistCentralProfile, resolveProfilePhotoUrl } from "../utils/profilePhoto";
import "./LinkedIn.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const TODAY_DATE = new Date().toISOString().slice(0, 10);

const skillGroups = [
  { title: "Frontend Development", match: /\b(react|angular|vue|html|css|javascript|typescript|next\.?js|tailwind)\b/i },
  { title: "Backend Development", match: /\b(node|express|java|spring|python|django|flask|php|ruby|api)\b/i },
  { title: "Databases", match: /\b(mongo|mongodb|mysql|postgres|sql|redis|firebase|dynamodb)\b/i },
  { title: "AI and Machine Learning", match: /\b(ai|ml|machine learning|deep learning|tensorflow|pytorch|llm|nlp)\b/i },
  { title: "Data Structures and Algorithms", match: /\b(dsa|algorithms?|data structures?|leetcode|problem solving)\b/i },
  { title: "Programming Languages", match: /\b(c\+\+|c#|c|python|java|kotlin|swift|dart|go|rust|javascript|typescript)\b/i },
  { title: "Communication", match: /\b(communication|writing|presentation|leadership|teamwork|collaboration)\b/i },
];

const roleSkills = [
  { role: /frontend|react|web developer/i, skills: ["JavaScript", "HTML", "CSS", "React", "Accessibility"] },
  { role: /backend|server/i, skills: ["API design", "Node.js", "Databases", "Authentication", "Testing"] },
  { role: /full.?stack|mern/i, skills: ["JavaScript", "React", "Node.js", "API design", "Databases"] },
  { role: /data|machine learning|ai/i, skills: ["Python", "Statistics", "Data Structures", "Machine Learning", "SQL"] },
  { role: /mobile|flutter|android/i, skills: ["Dart", "Flutter", "API integration", "Testing", "Mobile UI"] },
];

const skillCategoryLinks = {
  "Frontend Development": ["Programming Languages", "Backend Development"],
  "Backend Development": ["Databases", "Programming Languages"],
  Databases: ["Backend Development", "AI and Machine Learning"],
  "AI and Machine Learning": ["Databases", "Data Structures and Algorithms"],
  "Data Structures and Algorithms": ["Programming Languages", "AI and Machine Learning"],
  "Programming Languages": ["Frontend Development", "Backend Development"],
  Communication: ["Other professional skills"],
  "Other professional skills": ["Communication"],
};

const emptyEvidence = {
  title: "",
  description: "",
  kind: "project",
  url: "",
  screenshotUrl: "",
  technologies: "",
  linkedSkills: "",
  visibility: "public",
};

const emptyTeam = {
  title: "",
  description: "",
  desiredSkills: "",
  openToMembers: true,
};

const emptyTask = {
  title: "",
  description: "",
  technologies: "",
  requirements: "",
  deliverables: "",
  deadline: "",
  difficulty: "beginner",
};

function initials(name = "") {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "?";
}

function toList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not recorded"
    : date.toLocaleDateString();
}

function formatRelativeDate(value) {
  if (!value) return "Date not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not recorded";
  const elapsedDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (elapsedDays < 1) return "Today";
  if (elapsedDays === 1) return "1 day ago";
  if (elapsedDays < 7) return `${elapsedDays} days ago`;
  return formatDate(value);
}

function statusLabel(status = "") {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function apiRequest(endpoint, { token, method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function LinkedIn() {
  const navigate = useNavigate();
  const studentToken = localStorage.getItem("careerforge_student_token");
  const companyToken = localStorage.getItem("careerforge_company_token");
  const companyMode = !studentToken && Boolean(companyToken);
  const token = companyMode ? companyToken : studentToken;

  const [activeTab, setActiveTab] = useState(companyMode ? "recruiter" : "feed");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState(null);
  const [profileDraft, setProfileDraft] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoChanged, setProfilePhotoChanged] = useState(false);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [shareEvidenceOpen, setShareEvidenceOpen] = useState(false);
  const [evidence, setEvidence] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [teams, setTeams] = useState([]);
  const [openTeams, setOpenTeams] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [companyTasks, setCompanyTasks] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postDraft, setPostDraft] = useState({ content: "", visibility: "public" });
  const [editingPost, setEditingPost] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentParents, setCommentParents] = useState({});
  const [translations, setTranslations] = useState({});
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceDraft, setEvidenceDraft] = useState(emptyEvidence);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamDraft, setTeamDraft] = useState(emptyTeam);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskDraft, setTaskDraft] = useState(emptyTask);
  const [taskFilters, setTaskFilters] = useState({ technology: "", country: "", difficulty: "", deadline: "" });
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [companyApplications, setCompanyApplications] = useState({});

  const flash = useCallback((text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  }, []);

  const loadStudentData = useCallback(async () => {
    if (!studentToken) return;
    const [profileResult, postResult, connectionResult, evidenceResult, taskResult, appResult, teamResult, openTeamResult, peopleResult] =
      await Promise.all([
        apiRequest("/api/network/profile", { token: studentToken }),
        apiRequest("/api/network/posts", { token: studentToken }),
        apiRequest("/api/network/connections", { token: studentToken }),
        apiRequest("/api/network/evidence", { token: studentToken }),
        apiRequest("/api/network/micro-internships"),
        apiRequest("/api/network/micro-internships/my-applications", { token: studentToken }),
        apiRequest("/api/network/teams", { token: studentToken }),
        apiRequest("/api/network/teams/open", { token: studentToken }),
        apiRequest("/api/network/people", { token: studentToken }),
      ]);
    setProfile(profileResult.profile);
    setPosts(postResult.posts || []);
    setConnections(connectionResult.connections || []);
    setEvidence(evidenceResult.evidence || []);
    setTasks(taskResult.tasks || []);
    setApplications(appResult.applications || []);
    setTeams(teamResult.teams || []);
    setOpenTeams(openTeamResult.teams || []);
    setPeople(peopleResult.people || []);
    const ownTimeline = await apiRequest(
      `/api/network/timeline/${encodeURIComponent(profileResult.profile.id)}`,
      { token: studentToken }
    );
    setTimeline(ownTimeline.events || []);
  }, [studentToken]);

  const loadCompanyData = useCallback(async () => {
    if (!companyToken) return;
    const [taskResult, candidateResult, savedResult] = await Promise.all([
      apiRequest("/api/network/micro-internships/managed", { token: companyToken }),
      apiRequest("/api/network/recruiter/students", { token: companyToken }),
      apiRequest("/api/network/recruiter/saved", { token: companyToken }),
    ]);
    setCompanyTasks(taskResult.tasks || []);
    setCandidates(candidateResult.candidates || []);
    setSavedCandidates(savedResult.candidates || []);
  }, [companyToken]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (companyMode) await loadCompanyData();
      else if (studentToken) await loadStudentData();
      else setError("Sign in with a student or verified company account to use CareerForge Network.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [companyMode, loadCompanyData, loadStudentData, studentToken]);

  useEffect(() => {
    reload();
  }, [reload]);

  const feedPosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      `${post.author?.name || ""} ${post.author?.headline || ""} ${post.content || ""}`
        .toLocaleLowerCase()
        .includes(query)
    );
  }, [posts, search]);
  const displayedPosts = activeTab === "saved" ? savedPosts : feedPosts;

  const groupedSkills = useMemo(() => {
    const skills = Array.isArray(profile?.skills) ? profile.skills : [];
    const grouped = skillGroups.map((group) => ({
      ...group,
      skills: skills.filter((skill) => group.match.test(skill)),
    }));
    const knownSkills = new Set(grouped.flatMap((group) => group.skills));
    const otherSkills = skills.filter((skill) => !knownSkills.has(skill));
    if (otherSkills.length) grouped.push({ title: "Other professional skills", skills: otherSkills });
    return grouped.filter((group) => group.skills.length);
  }, [profile]);

  const roleSuggestions = useMemo(() => {
    if (!profile?.preferredRole) return [];
    const definition = roleSkills.find((item) => item.role.test(profile.preferredRole));
    if (!definition) return [];
    const currentSkills = new Set((profile.skills || []).map((skill) => skill.toLocaleLowerCase()));
    return definition.skills.filter((skill) => !currentSkills.has(skill.toLocaleLowerCase()));
  }, [profile]);

  const readiness = useMemo(() => {
    const claimed = new Set((profile?.skills || []).map((skill) => skill.toLocaleLowerCase()));
    const evidenced = new Set(evidence.flatMap((item) => item.linkedSkills || []).map((skill) => skill.toLocaleLowerCase()));
    return tasks.map((task) => {
      const requirements = [...new Set([...(task.technologies || []), ...(task.requirements || [])])];
      return {
        ...task,
        matched: requirements.filter((skill) => claimed.has(skill.toLocaleLowerCase())),
        evidenced: requirements.filter((skill) => evidenced.has(skill.toLocaleLowerCase())),
        missing: requirements.filter((skill) => !claimed.has(skill.toLocaleLowerCase())),
      };
    });
  }, [evidence, profile, tasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const technologyMatch = !taskFilters.technology ||
      task.technologies.some((technology) => technology.toLocaleLowerCase().includes(taskFilters.technology.toLocaleLowerCase()));
    const countryMatch = !taskFilters.country ||
      (task.country || "").toLocaleLowerCase().includes(taskFilters.country.toLocaleLowerCase());
    const difficultyMatch = !taskFilters.difficulty || task.difficulty === taskFilters.difficulty;
    const deadlineMatch = !taskFilters.deadline || task.deadline.slice(0, 10) <= taskFilters.deadline;
    const queryMatch = !search || [
      task.title,
      task.description,
      task.companyName,
      ...(task.technologies || []),
      ...(task.requirements || []),
    ].join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
    return technologyMatch && countryMatch && difficultyMatch && deadlineMatch && queryMatch;
  }), [search, taskFilters, tasks]);

  const runAction = async (action, successMessage) => {
    setBusy(true);
    setError("");
    try {
      await action();
      if (successMessage) flash(successMessage);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const searchPeople = async () => {
    await runAction(async () => {
      const result = await apiRequest(`/api/network/people?q=${encodeURIComponent(search)}`, { token: studentToken });
      setPeople(result.people || []);
    });
  };

  const openPublicProfile = (studentId) => runAction(async () => {
    const result = await apiRequest(`/api/network/profile/${encodeURIComponent(studentId)}`, {
      token: studentToken,
    });
    let events = [];
    if (result.profile.privacy?.showTimeline) {
      const timelineResult = await apiRequest(
        `/api/network/timeline/${encodeURIComponent(studentId)}`,
        { token: studentToken },
      );
      events = timelineResult.events || [];
    }
    setSelectedProfile({ ...result, events });
    setActiveTab("profile");
  });

  const showOwnProfile = () => {
    setSelectedProfile(null);
    setProfileMenuOpen(false);
    setActiveTab("profile");
  };

  const shareEvidence = (item) => {
    const content = `${item.title}${item.description ? ` — ${item.description}` : ""}\n${item.url}`;
    setPostDraft({ content, visibility: "public" });
    setEditingPost(null);
    setShareEvidenceOpen(false);
    setShowPostForm(true);
  };

  const savePost = async (event) => {
    event.preventDefault();
    const content = postDraft.content.trim();
    if (!content) return;
    await runAction(async () => {
      const result = editingPost
        ? await apiRequest(`/api/network/posts/${editingPost.id}`, {
            token: studentToken, method: "PATCH", body: { content, visibility: postDraft.visibility },
          })
        : await apiRequest("/api/network/posts", {
            token: studentToken, method: "POST", body: { content, visibility: postDraft.visibility },
          });
      if (editingPost) {
        setPosts((items) => items.map((item) => item.id === result.post.id ? result.post : item));
      } else {
        setPosts((items) => [result.post, ...items]);
      }
      setShowPostForm(false);
      setEditingPost(null);
      setPostDraft({ content: "", visibility: "public" });
    }, editingPost ? "Post updated." : "Post published.");
  };

  const togglePostAction = async (post, action) => {
    await runAction(async () => {
      await apiRequest(`/api/network/posts/${post.id}/${action}`, {
        token: studentToken, method: "POST",
      });
      const result = await apiRequest("/api/network/posts", { token: studentToken });
      setPosts(result.posts || []);
      if (activeTab === "saved" || action === "save") {
        const savedResult = await apiRequest("/api/network/saved-posts", { token: studentToken });
        setSavedPosts(savedResult.posts || []);
      }
    });
  };

  const sharePost = (post) => runAction(async () => {
    if (navigator.share) {
      await navigator.share({ title: "CareerForge professional update", text: post.content });
      return;
    }
    if (!navigator.clipboard?.writeText) {
      throw new Error("Sharing is not supported by this browser.");
    }
    await navigator.clipboard.writeText(post.content);
    flash("Post text copied to your clipboard.");
  });

  const submitComment = async (postId, parentId = null) => {
    const content = (commentDrafts[postId] || "").trim();
    if (!content) return;
    await runAction(async () => {
      await apiRequest(`/api/network/posts/${postId}/comments`, {
        token: studentToken, method: "POST", body: { content, parentId },
      });
      const result = await apiRequest("/api/network/posts", { token: studentToken });
      setPosts(result.posts || []);
      if (activeTab === "saved") {
        const savedResult = await apiRequest("/api/network/saved-posts", { token: studentToken });
        setSavedPosts(savedResult.posts || []);
      }
      setCommentDrafts((value) => ({ ...value, [postId]: "" }));
      setCommentParents((value) => ({ ...value, [postId]: null }));
    }, "Comment added.");
  };

  const requestConnection = (personId) => runAction(async () => {
    await apiRequest(`/api/network/connections/${personId}`, { token: studentToken, method: "POST" });
    const result = await apiRequest("/api/network/connections", { token: studentToken });
    setConnections(result.connections || []);
  }, "Connection request sent.");

  const respondConnection = (connectionId, decision) => runAction(async () => {
    await apiRequest(`/api/network/connections/${connectionId}/${decision}`, {
      token: studentToken, method: "PATCH",
    });
    const result = await apiRequest("/api/network/connections", { token: studentToken });
    setConnections(result.connections || []);
  }, decision === "accept" ? "Connection accepted." : "Request declined.");

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!profileDraft) return;
    await runAction(async () => {
      let photoUser = null;
      if (profilePhotoChanged) {
        if (profilePhoto) {
          const form = new FormData();
          form.append("profilePhoto", profilePhoto);
          const response = await fetch(`${API_BASE_URL}/api/users/me/profile-photo`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${studentToken}` },
            body: form,
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || !result.success || !result.user) {
            throw new Error(result.message || "Unable to update your profile photo.");
          }
          photoUser = result.user;
          persistCentralProfile(photoUser, "student");
          setProfile((current) => ({ ...current, ...photoUser }));
        } else {
          const result = await apiRequest("/api/users/me/profile-photo", {
            token: studentToken,
            method: "DELETE",
          });
          photoUser = result.user;
          persistCentralProfile(photoUser, "student");
          setProfile((current) => ({ ...current, ...photoUser }));
        }
      }

      const basic = await apiRequest("/api/users/me", {
        token: studentToken,
        method: "PATCH",
        body: {
          name: profileDraft.name,
          bio: profileDraft.bio,
          skills: toList(profileDraft.skillsText),
          preferredRole: profileDraft.preferredRole,
          college: profileDraft.college,
        },
      });
      const network = await apiRequest("/api/network/profile", {
        token: studentToken,
        method: "PATCH",
        body: {
          privacy: profileDraft.privacy,
          preferences: {
            availability: profileDraft.availability,
            interests: toList(profileDraft.interests),
            languages: toList(profileDraft.languages),
          },
        },
      });
      const savedUser = { ...basic.user, ...(photoUser || {}) };
      persistCentralProfile(savedUser, "student");
      setProfile({ ...network.profile, ...savedUser, privacy: network.profile.privacy, preferences: network.profile.preferences });
      setProfilePhoto(null);
      setProfilePhotoChanged(false);
      setEditingProfile(false);
    }, "Professional profile saved.");
  };

  const addEvidence = async (event) => {
    event.preventDefault();
    await runAction(async () => {
      const result = await apiRequest("/api/network/evidence", {
        token: studentToken,
        method: "POST",
        body: {
          ...evidenceDraft,
          technologies: toList(evidenceDraft.technologies),
          linkedSkills: toList(evidenceDraft.linkedSkills),
        },
      });
      setEvidence((items) => [result.evidence, ...items]);
      setEvidenceDraft(emptyEvidence);
      setShowEvidenceForm(false);
    }, "Portfolio evidence saved as Not Verified.");
  };

  const changeEvidenceVisibility = (item) => runAction(async () => {
    const visibility = item.visibility === "public" ? "private" : "public";
    const result = await apiRequest(`/api/network/evidence/${item.id}/visibility`, {
      token: studentToken, method: "PATCH", body: { visibility },
    });
    setEvidence((items) => items.map((entry) => entry.id === item.id ? result.evidence : entry));
  }, "Portfolio visibility updated.");

  const deleteEvidence = (item) => runAction(async () => {
    await apiRequest(`/api/network/evidence/${item.id}`, { token: studentToken, method: "DELETE" });
    setEvidence((items) => items.filter((entry) => entry.id !== item.id));
  }, "Portfolio evidence removed.");

  const applyForTask = (taskId) => runAction(async () => {
    await apiRequest(`/api/network/micro-internships/${taskId}/apply`, {
      token: studentToken, method: "POST",
    });
    const result = await apiRequest("/api/network/micro-internships/my-applications", { token: studentToken });
    setApplications(result.applications || []);
  }, "Application submitted to the company.");

  const submitWork = (taskId) => {
    const url = window.prompt("Enter your project or deliverable URL (HTTP/HTTPS):");
    if (!url) return;
    runAction(async () => {
      await apiRequest(`/api/network/micro-internships/${taskId}/submission`, {
        token: studentToken, method: "PATCH", body: { url },
      });
      const result = await apiRequest("/api/network/micro-internships/my-applications", { token: studentToken });
      setApplications(result.applications || []);
    }, "Work submission delivered to the company.");
  };

  const saveTeam = (event) => {
    event.preventDefault();
    runAction(async () => {
      const result = await apiRequest("/api/network/teams", {
        token: studentToken, method: "POST",
        body: { ...teamDraft, desiredSkills: toList(teamDraft.desiredSkills) },
      });
      setTeams((items) => [result.team, ...items]);
      setTeamDraft(emptyTeam);
      setShowTeamForm(false);
    }, "Collaboration request created.");
  };

  const inviteToTeam = (teamId, studentId) => runAction(async () => {
    await apiRequest(`/api/network/teams/${teamId}/invitations/${studentId}`, {
      token: studentToken, method: "POST",
    });
    await loadStudentData();
  }, "Team invitation sent.");

  const respondTeamInvitation = (teamId, invitationId, decision) => runAction(async () => {
    await apiRequest(`/api/network/teams/${teamId}/invitations/${invitationId}`, {
      token: studentToken, method: "PATCH", body: { decision },
    });
    const result = await apiRequest("/api/network/teams", { token: studentToken });
    setTeams(result.teams || []);
  }, decision === "accept" ? "Team invitation accepted." : "Team invitation declined.");

  const translatePost = (post) => {
    const targetLanguage = profile?.language || "en";
    runAction(async () => {
      const result = await apiRequest("/api/network/translate", {
        token: studentToken,
        method: "POST",
        body: { text: post.content, targetLanguage },
      });
      setTranslations((items) => ({ ...items, [post.id]: result.translatedText }));
    });
  };

  const createMicroInternship = (event) => {
    event.preventDefault();
    runAction(async () => {
      const result = await apiRequest("/api/network/micro-internships", {
        token: companyToken,
        method: "POST",
        body: {
          ...taskDraft,
          technologies: toList(taskDraft.technologies),
          requirements: toList(taskDraft.requirements),
          deliverables: toList(taskDraft.deliverables),
          deadline: new Date(`${taskDraft.deadline}T23:59:59.999Z`).toISOString(),
        },
      });
      setCompanyTasks((items) => [result.task, ...items]);
      setTaskDraft(emptyTask);
      setShowTaskForm(false);
    }, "Micro-internship published.");
  };

  const loadTaskApplications = (taskId) => runAction(async () => {
    const result = await apiRequest(`/api/network/micro-internships/${taskId}/applications`, { token: companyToken });
    setCompanyApplications((items) => ({ ...items, [taskId]: result.applications || [] }));
    setSelectedTaskId(taskId);
  });

  const updateApplication = (taskId, applicationId, status) => runAction(async () => {
    const feedback = status === "rejected" || status === "completed" || status === "under_review"
      ? window.prompt("Optional feedback for the student:", "") || ""
      : "";
    await apiRequest(`/api/network/micro-internships/${taskId}/applications/${applicationId}`, {
      token: companyToken, method: "PATCH", body: { status, feedback },
    });
    const result = await apiRequest(`/api/network/micro-internships/${taskId}/applications`, { token: companyToken });
    setCompanyApplications((items) => ({ ...items, [taskId]: result.applications || [] }));
  }, "Application status updated.");

  const saveCandidate = (candidate, saved) => runAction(async () => {
    await apiRequest(`/api/network/recruiter/saved/${candidate.id}`, {
      token: companyToken,
      method: saved ? "DELETE" : "POST",
    });
    const result = await apiRequest("/api/network/recruiter/saved", { token: companyToken });
    setSavedCandidates(result.candidates || []);
  }, saved ? "Candidate removed from saved list." : "Candidate saved.");

  const searchCandidates = () => runAction(async () => {
    const result = await apiRequest(`/api/network/recruiter/students?q=${encodeURIComponent(search)}`, { token: companyToken });
    setCandidates(result.candidates || []);
  });

  const openProfileEditor = () => {
    setProfilePhoto(null);
    setProfilePhotoChanged(false);
    setProfileDraft({
      ...profile,
      skillsText: (profile.skills || []).join(", "),
      interests: (profile.preferences?.interests || []).join(", "),
      languages: (profile.preferences?.languages || []).join(", "),
      availability: profile.preferences?.availability || "",
      privacy: { ...profile.privacy },
    });
    setEditingProfile(true);
  };

  const checklist = [
    ["Add your target role", Boolean(profile?.preferredRole)],
    ["Add your education", Boolean(profile?.college)],
    ["Add your skills", Boolean(profile?.skills?.length)],
    ["Add portfolio evidence", evidence.length > 0],
    ["Choose your profile visibility", profile?.privacy?.publicProfile === true],
  ];
  const profileCompletion = Math.round(
    (checklist.filter(([, complete]) => complete).length / checklist.length) * 100,
  );

  const currentConnections = connections.filter((item) => item.status === "connected");
  const incomingRequests = connections.filter((item) => item.status === "pending" && item.toId === profile?.id);
  const teamOwned = teams.filter((team) => team.ownerId === profile?.id);

  const nav = companyMode
    ? [
        ["recruiter", "Talent discovery", Search],
        ["micro", "Micro-internships", BriefcaseBusiness],
      ]
    : [
        ["feed", "Professional feed", Home],
        ["saved", "Saved posts", Bookmark],
        ["network", "My network", Users],
        ["career-dna", "Career DNA", Sparkles],
        ["portfolio", "Proof of work", CodeXml],
        ["micro", "Micro-internships", BriefcaseBusiness],
        ["readiness", "Opportunity match", Award],
        ["teams", "Team finder", Users],
        ["timeline", "Career journey", GraduationCap],
      ];

  if (!token && !loading) {
    return (
      <div className="ln-page">
        <main className="ln-auth-needed">
          <div className="ln-auth-card">
            <span className="ln-brand-icon"><span>CF</span></span>
            <p className="ln-eyebrow">CAREERFORGE PROFESSIONAL NETWORK</p>
            <h1>Build your next opportunity.</h1>
            <p>{error}</p>
            <button className="ln-primary-button" onClick={() => navigate("/register")}>Sign in to continue</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ln-page">
      <header className="ln-header">
        <button className="ln-brand" onClick={() => navigate(companyMode ? "/company-dashboard" : "/dashboard")}>
          <span className="ln-brand-icon"><span>CF</span></span>
          <span className="ln-brand-wordmark">Career<span>Forge</span></span>
        </button>
        <div className="ln-header-search">
          <Search size={18} />
          <input
            type="search"
            placeholder={companyMode ? "Search eligible candidates..." : "Search professionals, posts, companies and jobs..."}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (companyMode) searchCandidates();
                else {
                  if (!search.trim()) return;
                  setSelectedProfile(null);
                  setActiveTab("search");
                  searchPeople();
                }
              }
            }}
          />
        </div>
        <div className="ln-header-actions">
          <button className={!companyMode && activeTab === "feed" ? "active" : ""} title="Home feed" onClick={() => {
            setSelectedProfile(null);
            if (companyMode) navigate("/company-dashboard");
            else setActiveTab("feed");
          }}>
            <Home size={19} /><span>Home</span>
          </button>
          {!companyMode && <button className={activeTab === "network" ? "active" : ""} title="My network" onClick={() => {
            setSelectedProfile(null);
            setActiveTab("network");
          }}>
            <Users size={19} /><span>My Network</span>
          </button>}
          <button title="Jobs and internships" onClick={() => navigate("/jobs")}>
            <BriefcaseBusiness size={19} /><span>Jobs</span>
          </button>
          <button type="button" className="ln-unavailable-nav" disabled title="Messaging is not available in this version.">
            <MessageSquareText size={19} /><span>Messaging</span>
          </button>
          <button type="button" className="ln-unavailable-nav" disabled title="Notifications are not available in this version.">
            <Bell size={19} /><span>Notifications</span>
          </button>
          {!companyMode && profile && (
            <div className="ln-profile-menu-wrap">
              <button
                type="button"
                className={`ln-header-profile ${profileMenuOpen ? "active" : ""}`}
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <Avatar name={profile.name} image={profile.profileImage} />
                <span>Me</span>
              </button>
              {profileMenuOpen && <div className="ln-profile-dropdown">
                <div className="ln-dropdown-identity"><Avatar name={profile.name} image={profile.profileImage} /><div><strong>{profile.name}</strong><span>{profile.headline || profile.preferredRole || "CareerForge member"}</span></div></div>
                <button onClick={showOwnProfile}><UserRound size={16} /> View profile</button>
                <button onClick={() => { setProfileMenuOpen(false); openProfileEditor(); }}><Pencil size={16} /> Edit profile</button>
                <button onClick={() => navigate("/dashboard")}><Home size={16} /> CareerForge dashboard</button>
              </div>}
            </div>
          )}
        </div>
      </header>

      {notice && <div className="ln-toast" role="status">{notice}</div>}

      <main className="ln-layout ln-layout-network">
        <aside className="ln-left-column">
          {!companyMode && profile && (
            <section className="ln-card ln-profile-card">
              <button className="ln-cover ln-cover-button" aria-label="View your profile" onClick={showOwnProfile}>
                <span className="ln-cover-copy"><span>YOUR CAREER, IN MOTION</span><strong>Make your work<br />speak for you.</strong></span>
                <span className="ln-cover-mark">CF</span>
              </button>
              <button className="ln-profile-avatar-button" aria-label="View your profile" onClick={showOwnProfile}>
                <Avatar name={profile.name} image={profile.profileImage} />
              </button>
              <div className="ln-profile-intro">
                <h2>{profile.name || "CareerForge Student"}</h2>
                <p>{profile.headline || profile.preferredRole || "Add a professional headline"}</p>
                <span><MapPin size={14} />{profile.country || "Add your location"}</span>
                <button className="ln-text-button" onClick={showOwnProfile}>View your profile</button>
              </div>
              <div className="ln-profile-stats">
                <div><span>Connections</span><strong>{currentConnections.length}</strong></div>
                <div><span>Profile views</span><strong className="ln-stat-unavailable">Not tracked</strong></div>
              </div>
              <div className="ln-completion">
                <div><span>Profile strength</span><strong>{profileCompletion}%</strong></div>
                <div className="ln-progress-track"><span style={{ width: `${profileCompletion}%` }} /></div>
              </div>
              <button className="ln-outline-button ln-full-button" onClick={openProfileEditor}>
                <Pencil size={15} /> Edit profile
              </button>
            </section>
          )}

          <section className="ln-card ln-sidebar-menu">
            <p className="ln-sidebar-label">YOUR NETWORK</p>
            {nav.map(([id, label, Icon]) => (
              <button key={id} className={activeTab === id ? "active" : ""} onClick={() => {
                setSelectedProfile(null);
                setActiveTab(id);
                if (id === "saved") runAction(async () => {
                  const result = await apiRequest("/api/network/saved-posts", { token: studentToken });
                  setSavedPosts(result.posts || []);
                });
              }}>
                <Icon size={18} />{label}
                {id === "network" && <span>{currentConnections.length}</span>}
              </button>
            ))}
            {!companyMode && (
              <>
                <button onClick={() => navigate("/github")}><CodeXml size={18} />GitHub projects</button>
                <button onClick={() => navigate("/learn")}><GraduationCap size={18} />CareerForge learning</button>
              </>
            )}
          </section>

          {!companyMode && profile && (
            <section className="ln-card ln-recent-card">
              <div className="ln-section-heading"><h3>Recent activity</h3><button onClick={() => setActiveTab("timeline")}>See all</button></div>
              {timeline.slice(0, 3).map((event) => (
                <button className="ln-recent-item" key={event.id} onClick={() => setActiveTab("timeline")}>
                  <span className="ln-recent-dot" />
                  <span><strong>{event.title}</strong><small>{formatDate(event.occurredAt)}</small></span>
                </button>
              ))}
              {timeline.length === 0 && <p className="ln-muted">Your Career Journey will appear here as you add real work.</p>}
            </section>
          )}

          {!companyMode && profile && (
            <section className="ln-card ln-link-card">
              <h3>Profile shortcuts</h3>
              <button onClick={showOwnProfile}><UserRound size={15} />View professional profile</button>
              <button onClick={() => setActiveTab("portfolio")}><CodeXml size={15} />Proof of work</button>
              <button onClick={() => navigate("/jobs")}><BriefcaseBusiness size={15} />Explore jobs</button>
              {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><LinkIcon size={15} />LinkedIn profile<ExternalLink size={13} /></a>}
              {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><CodeXml size={15} />GitHub profile<ExternalLink size={13} /></a>}
            </section>
          )}
        </aside>

        <section className="ln-center-column">
          {loading && <section className="ln-card ln-network-panel"><p>Loading your CareerForge Network data…</p></section>}
          {error && !loading && <section className="ln-card ln-error-panel" role="alert"><strong>Could not complete the request</strong><p>{error}</p><button className="ln-outline-button" onClick={reload}>Try again</button></section>}

          {!loading && !error && !companyMode && activeTab === "profile" && (
            <ProfessionalProfileView
              profile={selectedProfile?.profile || profile}
              portfolio={selectedProfile?.portfolio || evidence}
              events={selectedProfile?.events || timeline}
              isOwner={!selectedProfile}
              connectionCount={currentConnections.length}
              connection={selectedProfile && connections.find((item) =>
                (item.fromId === profile.id && item.toId === selectedProfile.profile.id)
                || (item.toId === profile.id && item.fromId === selectedProfile.profile.id))}
              onEdit={openProfileEditor}
              onPortfolio={() => setActiveTab("portfolio")}
              onConnect={() => selectedProfile && requestConnection(selectedProfile.profile.id)}
              onBack={() => { setSelectedProfile(null); setActiveTab("network"); }}
              busy={busy}
            />
          )}

          {!loading && !error && !companyMode && activeTab === "search" && (
            <section className="ln-card ln-search-results">
              <div className="ln-panel-title">
                <div><p className="ln-eyebrow">NETWORK SEARCH</p><h2>Results for “{search.trim()}”</h2><p>Results are limited to public profiles, your available feed, and live opportunities from verified companies.</p></div>
                <Search size={24} />
              </div>
              <div className="ln-search-result-section">
                <div className="ln-section-heading"><h3>Professionals</h3><span>{people.length} results</span></div>
                {people.length
                  ? people.map((person) => {
                    const connection = connections.find((item) =>
                      (item.fromId === profile.id && item.toId === person.id)
                      || (item.toId === profile.id && item.fromId === person.id));
                    return <article className="ln-search-person" key={person.id}>
                      <Avatar name={person.name} image={person.profileImage} />
                      <div><button className="ln-person-name" onClick={() => openPublicProfile(person.id)}>{person.name}</button><p>{person.headline || person.preferredRole || "CareerForge member"}</p><small>{person.skills?.slice(0, 5).join(" · ") || "No skills listed"}{person.country ? ` · ${person.country}` : ""}</small></div>
                      {connection
                        ? <span className="ln-connected-label">{statusLabel(connection.status)}</span>
                        : <button className="ln-connect-button" onClick={() => requestConnection(person.id)}><UserRoundPlus size={14} />Connect</button>}
                    </article>;
                  })
                  : <p className="ln-muted">No opted-in public profiles matched this search.</p>}
              </div>
              <div className="ln-search-result-section">
                <div className="ln-section-heading"><h3>Posts</h3><button onClick={() => setActiveTab("feed")}>Open feed</button></div>
                {feedPosts.length
                  ? feedPosts.slice(0, 5).map((post) => <button className="ln-search-post" key={post.id} onClick={() => setActiveTab("feed")}>
                      <Avatar name={post.author?.name} image={post.author?.profileImage} />
                      <span><strong>{post.author?.name || "CareerForge member"}</strong><small>{formatRelativeDate(post.createdAt)}</small><span>{post.content}</span></span>
                    </button>)
                  : <p className="ln-muted">No posts in your available feed matched this search.</p>}
              </div>
              <div className="ln-search-result-section">
                <div className="ln-section-heading"><h3>Companies & live opportunities</h3><button onClick={() => setActiveTab("micro")}>Browse opportunities</button></div>
                {visibleTasks.length
                  ? visibleTasks.slice(0, 5).map((task) => <button className="ln-search-opportunity" key={task.id} onClick={() => setActiveTab("micro")}>
                      <span className="ln-company-mark"><Building2 size={17} /></span>
                      <span><strong>{task.companyName}</strong><small>{task.title} · {formatDate(task.deadline)}</small><small>{task.technologies?.join(" · ")}</small></span>
                    </button>)
                  : <p className="ln-muted">No live verified-company opportunities matched this search.</p>}
              </div>
              {!people.length && !feedPosts.length && !visibleTasks.length && <div className="ln-empty"><Search size={28} /><h3>No matching results</h3><p>Try another professional skill, post topic, company, or opportunity title.</p></div>}
            </section>
          )}

          {!loading && !error && !companyMode && (activeTab === "feed" || activeTab === "saved") && (
            <>
              {activeTab === "feed" && <section className="ln-card ln-create-post">
                <div className="ln-create-row">
                  <Avatar name={profile?.name} image={profile?.profileImage} />
                  <button className="ln-post-prompt" onClick={() => setShowPostForm(true)}>Start a professional conversation…</button>
                </div>
                <div className="ln-create-actions">
                  <button onClick={() => setShowPostForm(true)}><Pencil size={18} />Write a post</button>
                  <button onClick={() => setShareEvidenceOpen((open) => !open)}><CodeXml size={18} />Share work</button>
                  <button onClick={() => { setEvidenceDraft((draft) => ({ ...draft, kind: "certificate" })); setActiveTab("portfolio"); setShowEvidenceForm(true); }}><Award size={18} />Add certificate</button>
                  <button type="button" className="ln-unavailable-action" disabled title="Photo and video uploads are not supported by the current post API."><Image size={18} />Photo/video</button>
                </div>
                {shareEvidenceOpen && <div className="ln-share-evidence"><strong>Share an item from your portfolio</strong>{evidence.length ? evidence.map((item) => <button key={item.id} onClick={() => shareEvidence(item)}><span>{item.title}<small>{statusLabel(item.kind)} · Not Verified</small></span><Share2 size={16} /></button>) : <p>Add a real project or credential to your Proof of Work first.</p>}</div>}
              </section>}
              <div className="ln-feed-heading"><div><p className="ln-eyebrow">{activeTab === "saved" ? "YOUR COLLECTION" : "CAREERFORGE COMMUNITY"}</p><h2>{activeTab === "saved" ? "Saved posts" : "Professional feed"}</h2></div><span>{displayedPosts.length} {displayedPosts.length === 1 ? "post" : "posts"}</span></div>
              {displayedPosts.length === 0 && <section className="ln-card ln-empty"><Users size={28} /><h3>{activeTab === "saved" ? "No saved posts yet" : "Your feed is ready"}</h3><p>{activeTab === "saved" ? "Save posts from your feed to return to them later." : "No network posts are available yet. Share an update or connect with public CareerForge profiles."}</p>{activeTab === "feed" && <button className="ln-primary-button" onClick={() => setActiveTab("network")}>Find professionals</button>}</section>}
              {displayedPosts.map((post) => (
                <article className="ln-card ln-post" key={post.id}>
                  <div className="ln-post-header">
                    <Avatar name={post.author?.name} image={post.author?.profileImage} />
                    <div className="ln-post-author">
                      <strong>{post.author?.name || "CareerForge member"}</strong>
                      <span>{post.author?.headline || "CareerForge Network"}</span>
                      <small>{formatRelativeDate(post.createdAt)} · {post.visibility === "public" ? "Anyone" : "Only you"}</small>
                    </div>
                    {post.isAuthor && (
                      <div className="ln-post-owner-actions">
                        <button aria-label="Edit post" onClick={() => { setEditingPost(post); setPostDraft({ content: post.content, visibility: post.visibility }); setShowPostForm(true); }}><Pencil size={15} /></button>
                        <button aria-label="Delete post" onClick={() => runAction(async () => { await apiRequest(`/api/network/posts/${post.id}`, { token: studentToken, method: "DELETE" }); setPosts((items) => items.filter((item) => item.id !== post.id)); setSavedPosts((items) => items.filter((item) => item.id !== post.id)); }, "Post deleted.")}><Trash2 size={15} /></button>
                      </div>
                    )}
                  </div>
                  {post.repostOf && <p className="ln-repost-label">Reposted from a CareerForge network post</p>}
                  <p className="ln-post-content">{post.content}</p>
                  {translations[post.id] && <div className="ln-translation"><strong>Translated · {profile?.language?.toUpperCase()}</strong><p>{translations[post.id]}</p><small>Original text remains unchanged above.</small></div>}
                  <div className="ln-post-engagement"><span><ThumbsUp size={14} />{post.likesCount || 0} likes</span><span>{post.comments?.length || 0} comments</span></div>
                  <div className="ln-post-actions">
                    <button className={post.liked ? "ln-liked" : ""} onClick={() => togglePostAction(post, "like")}><ThumbsUp size={18} />{post.liked ? "Liked" : "Like"}</button>
                    <button onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}><MessageCircle size={18} />Comment</button>
                    <button onClick={() => togglePostAction(post, "repost")}><Send size={18} />Repost</button>
                    <button onClick={() => togglePostAction(post, "save")}><Bookmark size={18} />{post.saved ? "Saved" : "Save"}</button>
                    <button onClick={() => sharePost(post)}><Share2 size={18} />Send</button>
                    <button onClick={() => translatePost(post)}><Globe2 size={18} />Translate</button>
                  </div>
                  <div className="ln-comment-list">
                    {(post.comments || []).map((comment) => (
                      <div className={`ln-comment ${comment.parentId ? "ln-comment-reply" : ""}`} key={comment.id}>
                        <div className="ln-comment-author"><Avatar name={comment.authorName} image={comment.authorImage} /><strong>{comment.authorName}</strong></div><p>{comment.content}</p><small>{formatDate(comment.createdAt)}</small>
                        {!comment.parentId && <button onClick={() => { setCommentDrafts((items) => ({ ...items, [post.id]: `@${comment.authorName} ` })); setCommentParents((items) => ({ ...items, [post.id]: comment.id })); document.getElementById(`comment-${post.id}`)?.focus(); }}>Reply</button>}
                      </div>
                    ))}
                    <div className="ln-comment-input">
                      <input id={`comment-${post.id}`} value={commentDrafts[post.id] || ""} maxLength={1000} placeholder={commentParents[post.id] ? "Reply to this comment…" : "Write a comment…"} onChange={(event) => setCommentDrafts((items) => ({ ...items, [post.id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") submitComment(post.id, commentParents[post.id] || null); }} />
                      <button aria-label="Send comment" disabled={!commentDrafts[post.id]?.trim() || busy} onClick={() => submitComment(post.id, commentParents[post.id] || null)}><Send size={16} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </>
          )}

          {!loading && !error && !companyMode && activeTab === "network" && (
            <section className="ln-card ln-network-panel">
              <div className="ln-panel-title"><div><h2>My network</h2><p>Only real CareerForge student profiles that opted into discovery are shown.</p></div><Users size={27} /></div>
              <div className="ln-network-count"><strong>{currentConnections.length}</strong><span>Accepted connections</span></div>
              {incomingRequests.length > 0 && <div className="ln-subsection"><h3>Invitations</h3>{incomingRequests.map((item) => <div className="ln-person" key={item.id}><Avatar name={item.person?.name} image={item.person?.profileImage} /><div className="ln-person-info"><button className="ln-person-name" onClick={() => openPublicProfile(item.person?.id)}>{item.person?.name}</button><span>{item.person?.headline}</span><button className="ln-connect-button" onClick={() => respondConnection(item.id, "accept")}>Accept</button><button className="ln-connect-button ln-connect-decline" onClick={() => respondConnection(item.id, "reject")}>Decline</button></div></div>)}</div>}
              <div className="ln-inline-search"><input value={search} placeholder="Search skills, roles, country, or language" onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") searchPeople(); }} /><button className="ln-primary-button" onClick={searchPeople}><Search size={16} />Search people</button></div>
              {people.length === 0 && <div className="ln-empty"><Users size={30} /><h3>No matching public profiles</h3><p>Students must opt in to public profile discovery before they appear here.</p></div>}
              {people.map((person) => {
                const connected = connections.find((item) => (item.fromId === profile.id && item.toId === person.id) || (item.toId === profile.id && item.fromId === person.id));
                return <div className="ln-person ln-person-wide" key={person.id}><Avatar name={person.name} image={person.profileImage} /><div className="ln-person-info"><button className="ln-person-name" onClick={() => openPublicProfile(person.id)}>{person.name}</button><span>{person.headline}</span><span>{person.skills.join(" · ")}</span>{person.country && <span>{person.country}</span>}<button className="ln-text-button" onClick={() => openPublicProfile(person.id)}>View profile</button></div>{connected ? <span className="ln-connected-label">{statusLabel(connected.status)}</span> : <button className="ln-connect-button" onClick={() => requestConnection(person.id)}><UserRoundPlus size={14} />Connect</button>}</div>;
              })}
              {currentConnections.map((item) => item.person && <div className="ln-connection-row" key={`connected-${item.id}`}><Avatar name={item.person.name} image={item.person.profileImage} /><button className="ln-person-name" onClick={() => openPublicProfile(item.person.id)}>{item.person.name}</button><span className="ln-connected-label">Connected</span></div>)}
            </section>
          )}

          {!loading && !error && !companyMode && activeTab === "career-dna" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Career DNA</h2><p>Your skill map is based on your registered profile and submitted evidence—no inferred proficiency scores.</p></div><Sparkles size={27} /></div>
              <div className="ln-skill-summary"><strong>{profile?.skills?.length || 0}</strong><span>self-reported skills</span><span>{evidence.length} submitted evidence items · none independently verified</span></div>
              {groupedSkills.length ? <div className="ln-skill-graph" aria-label="Skill categories">
                {groupedSkills.map((group, index) => <section className="ln-skill-category" key={group.title}><div className="ln-skill-category-heading"><span className="ln-skill-node">{index + 1}</span><h3>{group.title}</h3></div><div className="ln-skill-pills">{group.skills.map((skill) => { const evidenceCount = evidence.filter((item) => item.linkedSkills?.some((entry) => entry.toLocaleLowerCase() === skill.toLocaleLowerCase())).length; return <span className="ln-skill-pill" key={skill}>{skill}<small>Self-reported{evidenceCount ? ` · ${evidenceCount} evidence link${evidenceCount > 1 ? "s" : ""}` : ""}</small></span>; })}</div><p className="ln-skill-related">Related disciplines: {(skillCategoryLinks[group.title] || []).join(" · ") || "No mapped relationship"}</p></section>)}
              </div> : <div className="ln-empty"><Sparkles size={30} /><h3>No skills recorded yet</h3><p>Add skills to your student profile to build your Career DNA.</p><button className="ln-outline-button" onClick={openProfileEditor}>Add skills</button></div>}
              <div className="ln-opportunity"><h3>Suggested next skills {profile?.preferredRole ? `for ${profile.preferredRole}` : ""}</h3>{roleSuggestions.length ? <p>{roleSuggestions.join(" · ")}. These are transparent role-based suggestions, not measured gaps or a proficiency assessment.</p> : <p>{profile?.preferredRole ? "No role-specific suggestion is available for this target yet." : "Set a target career role in your profile to see rule-based suggestions."}</p>}<button className="ln-outline-button" onClick={() => navigate("/learn")}>Explore CareerForge learning</button></div>
            </section>
          )}

          {!loading && !error && !companyMode && activeTab === "portfolio" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Proof of work</h2><p>Evidence links belong to your authenticated profile. Submitting a link does not verify its ownership or content.</p></div><CodeXml size={27} /></div>
              <div className="ln-evidence-toolbar"><span>{evidence.length} items</span><button className="ln-primary-button" onClick={() => setShowEvidenceForm(true)}><Plus size={16} />Add evidence</button></div>
              {evidence.length === 0 ? <div className="ln-empty"><CodeXml size={30} /><h3>Your portfolio starts with real work</h3><p>Add a repository, live demo, certificate, or assessment link. Each item will remain clearly marked Not Verified until an actual verification process exists.</p><button className="ln-primary-button" onClick={() => setShowEvidenceForm(true)}>Add portfolio evidence</button></div> : evidence.map((item) => <article className="ln-evidence-card" key={item.id}><div className="ln-evidence-heading"><div><span className="ln-evidence-kind">{statusLabel(item.kind)}</span><h3>{item.title}</h3></div><span className="ln-status-badge ln-status-unverified">Not Verified</span></div>{item.screenshotUrl && <img className="ln-evidence-screenshot" src={item.screenshotUrl} alt={`Screenshot for ${item.title}`} loading="lazy" referrerPolicy="no-referrer" />}<p>{item.description || "No description provided."}</p>{item.technologies?.length > 0 && <p><strong>Technologies:</strong> {item.technologies.join(", ")}</p>}{item.linkedSkills?.length > 0 && <p><strong>Linked skills:</strong> {item.linkedSkills.join(", ")}</p>}<div className="ln-evidence-meta"><span>{item.source} · Added {formatDate(item.submittedAt)}</span><span>{statusLabel(item.visibility)}</span></div><div className="ln-evidence-actions"><a href={item.url} target="_blank" rel="noopener noreferrer">Open evidence <ExternalLink size={14} /></a><button onClick={() => changeEvidenceVisibility(item)}>{item.visibility === "public" ? "Make private" : "Make public"}</button><button onClick={() => deleteEvidence(item)}>Remove</button></div></article>)}
              <p className="ln-disclaimer">Verification states are not assigned by link submission. CareerForge currently has no independent repository, certificate, or assessment verification workflow.</p>
            </section>
          )}

          {!loading && !error && !companyMode && activeTab === "micro" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Micro-internships</h2><p>Tasks published by active, verified CareerForge company accounts.</p></div><BriefcaseBusiness size={27} /></div>
              <div className="ln-subsection"><h3>My applications</h3>{applications.length === 0 ? <p className="ln-muted">No micro-internship applications yet.</p> : applications.map((application) => <div className="ln-application-row" key={application.id}><div><strong>{application.task?.title || "Task no longer available"}</strong><span>{application.task?.companyName || "Company record unavailable"} · {statusLabel(application.status)}</span>{application.feedback && <small>Company feedback: {application.feedback}</small>}{application.submissionUrl && <a href={application.submissionUrl} target="_blank" rel="noopener noreferrer">Submitted work <ExternalLink size={13} /></a>}</div>{["in_progress", "shortlisted"].includes(application.status) && <button className="ln-outline-button" onClick={() => submitWork(application.taskId)}>Submit work</button>}</div>)}</div>
              <div className="ln-subsection"><h3>Open tasks</h3><div className="ln-task-filters"><input aria-label="Filter by technology" placeholder="Technology" value={taskFilters.technology} onChange={(event) => setTaskFilters((value) => ({ ...value, technology: event.target.value }))} /><input aria-label="Filter by company country" placeholder="Country" value={taskFilters.country} onChange={(event) => setTaskFilters((value) => ({ ...value, country: event.target.value }))} /><select aria-label="Filter by difficulty" value={taskFilters.difficulty} onChange={(event) => setTaskFilters((value) => ({ ...value, difficulty: event.target.value }))}><option value="">All difficulty levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select><label>Deadline on or before<input aria-label="Deadline cutoff" type="date" min={TODAY_DATE} value={taskFilters.deadline} onChange={(event) => setTaskFilters((value) => ({ ...value, deadline: event.target.value }))} /></label></div>{tasks.length === 0 ? <div className="ln-empty"><BriefcaseBusiness size={30} /><h3>No verified-company tasks are open</h3><p>There are no live micro-internships from currently verified companies. This list does not contain sample tasks.</p></div> : visibleTasks.length === 0 ? <p className="ln-muted">No tasks match the selected filters.</p> : visibleTasks.map((task) => { const application = applications.find((item) => item.taskId === task.id); return <article className="ln-task-card" key={task.id}><div className="ln-evidence-heading"><Avatar name={task.companyName} image={task.companyLogo} /><div><span className="ln-evidence-kind">{task.companyName}</span><h3>{task.title}</h3></div><span className="ln-status-badge">{statusLabel(task.difficulty)}</span></div><p>{task.description}</p><p><strong>Requirements:</strong> {task.requirements.join(" · ")}</p><p><strong>Deliverables:</strong> {task.deliverables.join(" · ")}</p><p><strong>Stack:</strong> {task.technologies.join(" · ")} · <strong>Deadline:</strong> {formatDate(task.deadline)}{task.country ? ` · ${task.country}` : ""}</p>{application ? <span className="ln-status-badge">{statusLabel(application.status)}</span> : <button className="ln-primary-button" onClick={() => applyForTask(task.id)}>Apply</button>}</article>; })}</div>
            </section>
          )}

          {!loading && !error && !companyMode && activeTab === "readiness" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Opportunity readiness</h2><p>Transparent comparison against live micro-internship requirements. No AI-generated score or selection guarantee.</p></div><Award size={27} /></div>
              {readiness.length === 0 ? <div className="ln-empty"><Award size={30} /><h3>No live requirements to compare</h3><p>Readiness will show only opportunities published by active, verified companies. No job requirements have been invented.</p><button className="ln-outline-button" onClick={() => setActiveTab("micro")}>View micro-internships</button></div> : readiness.map((item) => <article className="ln-readiness-card" key={item.id}><h3>{item.title} <span>at {item.companyName}</span></h3><p>Source: verified company task · deadline {formatDate(item.deadline)}</p><div className="ln-readiness-groups"><div><strong>Profile skill matches</strong><p>{item.matched.length ? item.matched.join(", ") : "No matching self-reported skills"}</p></div><div><strong>Linked evidence</strong><p>{item.evidenced.length ? item.evidenced.join(", ") : "No evidence links tied to these skills"}</p></div><div><strong>Not listed on your profile</strong><p>{item.missing.length ? item.missing.join(", ") : "All listed technologies appear on your profile"}</p></div></div><button className="ln-outline-button" onClick={() => setActiveTab("micro")}>Review task requirements</button></article>)}
            </section>
          )}

          {!loading && !error && !companyMode && activeTab === "teams" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Team Finder</h2><p>Discover opted-in student profiles using real registered skills and collaboration preferences. Recommendations are rule-based, not AI-generated.</p></div><Users size={27} /></div>
              <div className="ln-evidence-toolbar"><span>Use profile search in the header to find skills and interests</span><button className="ln-primary-button" onClick={() => setShowTeamForm(true)}><Plus size={16} />Create collaboration request</button></div>
              <div className="ln-subsection"><h3>Your project teams</h3>{teams.length === 0 ? <p className="ln-muted">No project teams or invitations yet.</p> : teams.map((team) => <article className="ln-team-card" key={team.id}><h3>{team.title}</h3><p>{team.description}</p><p><strong>Looking for:</strong> {team.desiredSkills.join(", ")}</p><p>{team.memberIds.length} current member{team.memberIds.length === 1 ? "" : "s"}</p>{(team.invitations || []).filter((invite) => invite.studentId === profile.id && invite.status === "pending").map((invite) => <div className="ln-invitation" key={invite.id}><span>Invitation from {team.ownerName}</span><button onClick={() => respondTeamInvitation(team.id, invite.id, "accept")}>Accept</button><button onClick={() => respondTeamInvitation(team.id, invite.id, "reject")}>Decline</button></div>)}</article>)}</div>
              <div className="ln-subsection"><h3>Open collaboration requests</h3>{openTeams.length === 0 ? <p className="ln-muted">No open team requests are available.</p> : openTeams.map((team) => <article className="ln-team-card" key={team.id}><h3>{team.title}</h3><p>{team.description}</p><span>By {team.ownerName} · Seeking {team.desiredSkills.join(", ")}</span></article>)}</div>
              <div className="ln-subsection"><h3>Public students</h3><div className="ln-inline-search"><input value={search} placeholder="Search complementary skills, role, or language" onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") searchPeople(); }} /><button className="ln-primary-button" onClick={searchPeople}><Search size={16} />Find teammates</button></div>{people.map((person) => <div className="ln-person" key={person.id}><Avatar name={person.name} image={person.profileImage} /><div className="ln-person-info"><strong>{person.name}</strong><span>{person.headline}</span><span>{person.skills.join(" · ")}</span><span>{person.preferences.availability || "Availability not specified"}</span></div>{teamOwned.length > 0 && <select aria-label={`Invite ${person.name} to a team`} defaultValue="" onChange={(event) => { if (event.target.value) inviteToTeam(event.target.value, person.id); }}><option value="" disabled>Invite to team</option>{teamOwned.map((team) => <option value={team.id} key={team.id}>{team.title}</option>)}</select>}</div>)}</div>
            </section>
          )}

          {!loading && !error && !companyMode && activeTab === "timeline" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Career journey</h2><p>Only dated account activity, portfolio evidence, posts, and completed micro-internships are included. Course completion imports are unavailable.</p></div><GraduationCap size={27} /></div>
              <div className="ln-privacy-note">Timeline visibility: {profile?.privacy?.showTimeline ? "Public" : "Private"} · manage this in Edit profile.</div>
              {timeline.length === 0 ? <div className="ln-empty"><GraduationCap size={30} /><h3>No dated milestones recorded yet</h3><p>CareerForge will not invent course, certificate, competition, or work-history milestones.</p></div> : <div className="ln-timeline">{timeline.map((item) => <article className="ln-timeline-item" key={item.id}><span className="ln-timeline-dot" /><small>{formatDate(item.occurredAt)}</small><h3>{item.title}</h3><span>{statusLabel(item.kind)}</span>{item.verificationStatus && <span className="ln-status-badge ln-status-unverified">{statusLabel(item.verificationStatus)}</span>}{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">View source <ExternalLink size={13} /></a>}</article>)}</div>}
            </section>
          )}

          {!loading && !error && companyMode && activeTab === "recruiter" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Recruiter talent discovery</h2><p>Only eligible public student profiles are searchable. Personal contact details and private records are not returned.</p></div><Search size={27} /></div>
              <div className="ln-inline-search"><input value={search} placeholder="Search public skills, role, country, or education" onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") searchCandidates(); }} /><button className="ln-primary-button" onClick={searchCandidates}><Search size={16} />Search</button></div>
              <div className="ln-subsection"><h3>Saved candidates ({savedCandidates.length})</h3>{savedCandidates.map((candidate) => <CandidateCard key={`saved-${candidate.id}`} candidate={candidate} saved onSave={() => saveCandidate(candidate, true)} />)}</div>
              <div className="ln-subsection"><h3>Eligible candidates</h3>{candidates.length === 0 ? <div className="ln-empty"><Users size={28} /><h3>No eligible profiles found</h3><p>Student profile visibility is controlled by each student.</p></div> : candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} saved={savedCandidates.some((item) => item.id === candidate.id)} onSave={() => saveCandidate(candidate, savedCandidates.some((item) => item.id === candidate.id))} />)}</div>
            </section>
          )}

          {!loading && !error && companyMode && activeTab === "micro" && (
            <section className="ln-card ln-feature-panel">
              <div className="ln-panel-title"><div><h2>Company micro-internships</h2><p>Publishing and application review are available only to active, verified company accounts.</p></div><BriefcaseBusiness size={27} /></div>
              <div className="ln-evidence-toolbar"><span>{companyTasks.length} tasks</span><button className="ln-primary-button" onClick={() => setShowTaskForm(true)}><Plus size={16} />Create task</button></div>
              {companyTasks.length === 0 && <div className="ln-empty"><BriefcaseBusiness size={28} /><h3>No tasks published yet</h3><p>Create a specific task with requirements, technologies, deadline, and deliverables.</p></div>}
              {companyTasks.map((task) => <article className="ln-task-card" key={task.id}><div className="ln-evidence-heading"><div><span className="ln-evidence-kind">{statusLabel(task.status)}</span><h3>{task.title}</h3></div><button className="ln-outline-button" onClick={() => loadTaskApplications(task.id)}>Review applications</button></div><p>{task.description}</p><p><strong>Stack:</strong> {task.technologies.join(", ")} · <strong>Deadline:</strong> {formatDate(task.deadline)}</p>{selectedTaskId === task.id && (companyApplications[task.id] || []).map((application) => <div className="ln-application-row" key={application.id}><div><strong>{application.studentName}</strong><span>{statusLabel(application.status)} · applied {formatDate(application.appliedAt)}</span>{application.submissionUrl && <a href={application.submissionUrl} target="_blank" rel="noopener noreferrer">Submitted deliverable <ExternalLink size={13} /></a>}</div><select aria-label={`Set status for ${application.studentName}`} value={application.status} onChange={(event) => updateApplication(task.id, application.id, event.target.value)}><option value={application.status}>{statusLabel(application.status)}</option>{["shortlisted", "in_progress", "under_review", "completed", "rejected"].filter((status) => status !== application.status).map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}</select></div>)}</article>)}
            </section>
          )}

          {!loading && !error && !companyMode && activeTab !== "feed" && activeTab !== "saved" && activeTab !== "network" && activeTab !== "profile" && activeTab !== "search" && activeTab !== "career-dna" && activeTab !== "portfolio" && activeTab !== "micro" && activeTab !== "readiness" && activeTab !== "teams" && activeTab !== "timeline" && <section className="ln-card ln-empty"><h2>Choose a network feature</h2></section>}
        </section>

        {!companyMode && !loading && profile && (
          <aside className="ln-right-column">
            <section className="ln-card ln-recommendation-card">
              <div className="ln-section-heading"><h3>People you may know</h3><button onClick={() => { setSelectedProfile(null); setActiveTab("network"); }}>See all</button></div>
              {people.slice(0, 3).map((person) => {
                const connection = connections.find((item) =>
                  (item.fromId === profile.id && item.toId === person.id)
                  || (item.toId === profile.id && item.fromId === person.id));
                return <div className="ln-suggestion" key={person.id}>
                  <button className="ln-suggestion-person" onClick={() => openPublicProfile(person.id)}>
                    <Avatar name={person.name} image={person.profileImage} />
                    <span><strong>{person.name}</strong><small>{person.headline || person.preferredRole || "CareerForge member"}</small></span>
                  </button>
                  {connection ? <span className="ln-connected-label">{statusLabel(connection.status)}</span> : <button className="ln-connect-button" aria-label={`Connect with ${person.name}`} onClick={() => requestConnection(person.id)}><UserRoundPlus size={14} />Connect</button>}
                </div>;
              })}
              {people.length === 0 && <p className="ln-muted">No other public profiles are available yet. Recommendations only include students who opted into discovery.</p>}
            </section>

            <section className="ln-card ln-recommendation-card">
              <div className="ln-section-heading"><h3>Companies & opportunities</h3><button onClick={() => setActiveTab("micro")}>Explore</button></div>
              {tasks.slice(0, 3).map((task) => <button className="ln-opportunity-link" key={task.id} onClick={() => setActiveTab("micro")}>
                <span className="ln-company-mark"><Building2 size={17} /></span>
                <span><strong>{task.companyName}</strong><small>{task.title}</small><small>{(task.technologies || []).slice(0, 3).join(" · ") || "Verified-company opportunity"}</small></span>
              </button>)}
              {tasks.length === 0 && <p className="ln-muted">No live opportunities from verified companies right now. New listings will appear here when available.</p>}
              <button className="ln-more-link" onClick={() => navigate("/jobs")}>Browse jobs & internships <ExternalLink size={14} /></button>
            </section>

            <section className="ln-card ln-recommendation-card">
              <div className="ln-section-heading"><h3>Explore your skills</h3><Globe2 size={17} /></div>
              {profile.skills?.length ? profile.skills.slice(0, 4).map((skill, index) => <button className="ln-topic-row" key={skill} onClick={() => {
                setSelectedProfile(null);
                setActiveTab("network");
                runAction(async () => {
                  const result = await apiRequest(`/api/network/people?q=${encodeURIComponent(skill)}`, { token: studentToken });
                  setPeople(result.people || []);
                });
              }}>
                <span>0{index + 1}</span><strong>{skill}</strong><small>Explore profiles</small>
              </button>) : <p className="ln-muted">Add skills to your profile to explore relevant professional topics.</p>}
            </section>

            <section className="ln-card ln-news-card">
              <div className="ln-right-title"><h3>Strengthen your profile</h3><Award size={19} /></div>
              <p className="ln-muted">Complete your profile to improve discovery.</p>
              <div className="ln-sidebar-progress"><strong>{profileCompletion}%</strong><span>Profile strength</span><div className="ln-progress-track"><span style={{ width: `${profileCompletion}%` }} /></div></div>
              {checklist.map(([label, complete]) => <div className="ln-check-row" key={label}><span className={complete ? "ln-check done" : "ln-check"}>{complete ? "✓" : ""}</span><span>{label}</span></div>)}
              <button className="ln-outline-button ln-full-button" onClick={openProfileEditor}>Edit profile & privacy</button>
            </section>
            <section className="ln-card ln-people-card">
              <h3>Public profile controls</h3>
              <p className="ln-muted">Discovery is opt-in. Recruiters and students see only fields you permit.</p>
              <span className="ln-privacy-note">Profile {profile.privacy?.publicProfile ? "public" : "private"} · Timeline {profile.privacy?.showTimeline ? "public" : "private"} · Portfolio {profile.privacy?.showPortfolio ? "public" : "private"}</span>
              <button className="ln-outline-button ln-full-button" onClick={openProfileEditor}>Manage visibility</button>
            </section>
            <section className="ln-card ln-news-card">
              <div className="ln-right-title"><h3>CareerForge for your career</h3><Sparkles size={18} /></div>
              <p className="ln-muted">Build skills, practice coding, and showcase projects alongside your professional network.</p>
              <a className="ln-more-link" href="/learn">Explore learning <ExternalLink size={14} /></a>
              <a className="ln-more-link" href="/github">Connect GitHub <ExternalLink size={14} /></a>
              <p className="ln-product-note"><LockKeyhole size={13} /> Messaging and notifications are not yet available in this version.</p>
            </section>
            <footer className="ln-footer"><p>CareerForge Network · Professional community</p><p>Real profiles. Real work. Clear credentials.</p></footer>
          </aside>
        )}
      </main>

      {showPostForm && (
        <Modal title={editingPost ? "Edit post" : "Create a post"} onClose={() => { setShowPostForm(false); setEditingPost(null); }}>
          <div className="ln-modal-author"><Avatar name={profile?.name} image={profile?.profileImage} /><div><strong>{profile?.name}</strong><span>{profile?.headline || profile?.preferredRole}</span></div></div>
          <form onSubmit={savePost}><textarea className="ln-post-textarea" value={postDraft.content} maxLength={3000} rows={6} autoFocus placeholder="Share a real project, learning, or career update…" onChange={(event) => setPostDraft((value) => ({ ...value, content: event.target.value }))} /><label className="ln-form-label">Visibility<select value={postDraft.visibility} onChange={(event) => setPostDraft((value) => ({ ...value, visibility: event.target.value }))}><option value="public">Public</option><option value="private">Only me</option></select></label><div className="ln-modal-footer"><span>{postDraft.content.length}/3000</span><button className="ln-primary-button" disabled={!postDraft.content.trim() || busy}>{busy ? "Saving…" : "Publish"}</button></div></form>
        </Modal>
      )}

      {editingProfile && profileDraft && (
        <Modal title="Professional profile & privacy" onClose={() => setEditingProfile(false)} wide>
          <form className="ln-profile-form" onSubmit={saveProfile}>
            <ProfilePhotoPicker
              label="Profile photo"
              value={profileDraft.profileImage || ""}
              onChange={(file) => {
                setProfilePhoto(file);
                setProfilePhotoChanged(true);
              }}
            />
            <label htmlFor="ln-name">Full name</label><input id="ln-name" required value={profileDraft.name || ""} onChange={(event) => setProfileDraft((value) => ({ ...value, name: event.target.value }))} />
            <label htmlFor="ln-role">Target career role</label><input id="ln-role" maxLength={120} value={profileDraft.preferredRole || ""} onChange={(event) => setProfileDraft((value) => ({ ...value, preferredRole: event.target.value }))} />
            <label htmlFor="ln-college">Education</label><input id="ln-college" value={profileDraft.college || ""} onChange={(event) => setProfileDraft((value) => ({ ...value, college: event.target.value }))} />
            <label htmlFor="ln-bio">About</label><textarea id="ln-bio" maxLength={1000} rows={3} value={profileDraft.bio || ""} onChange={(event) => setProfileDraft((value) => ({ ...value, bio: event.target.value }))} />
            <label htmlFor="ln-skills">Self-reported skills (comma separated)</label><input id="ln-skills" value={profileDraft.skillsText} onChange={(event) => setProfileDraft((value) => ({ ...value, skillsText: event.target.value }))} />
            <label htmlFor="ln-interests">Collaboration interests (comma separated)</label><input id="ln-interests" value={profileDraft.interests} onChange={(event) => setProfileDraft((value) => ({ ...value, interests: event.target.value }))} />
            <label htmlFor="ln-languages">Preferred languages (comma separated)</label><input id="ln-languages" value={profileDraft.languages} onChange={(event) => setProfileDraft((value) => ({ ...value, languages: event.target.value }))} />
            <label htmlFor="ln-availability">Collaboration availability</label><select id="ln-availability" value={profileDraft.availability} onChange={(event) => setProfileDraft((value) => ({ ...value, availability: event.target.value }))}><option value="">Not specified</option><option value="open">Open</option><option value="limited">Limited</option><option value="unavailable">Unavailable</option></select>
            <div className="ln-privacy-options"><strong>Public profile permissions</strong>{[["publicProfile", "Allow my profile in search"], ["showLocation", "Show my country"], ["showLanguage", "Show my preferred language"], ["showProfessionalLinks", "Show GitHub and LinkedIn links"], ["showTimeline", "Make my career timeline public"], ["showPortfolio", "Show public portfolio evidence"]].map(([key, label]) => <label key={key}><input type="checkbox" checked={profileDraft.privacy?.[key] === true} onChange={(event) => setProfileDraft((value) => ({ ...value, privacy: { ...value.privacy, [key]: event.target.checked } }))} />{label}</label>)}</div>
            <div className="ln-modal-footer"><button type="button" className="ln-outline-button" onClick={() => setEditingProfile(false)}>Cancel</button><button className="ln-primary-button" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button></div>
          </form>
        </Modal>
      )}

      {showEvidenceForm && (
        <Modal title="Add proof-of-work link" onClose={() => setShowEvidenceForm(false)} wide>
          <form className="ln-profile-form" onSubmit={addEvidence}>
            <p className="ln-disclaimer">Links are stored with your authenticated profile and marked Not Verified. Only an independent verification process could change that status; none is currently available.</p>
            <label htmlFor="evidence-title">Title</label><input id="evidence-title" required maxLength={160} value={evidenceDraft.title} onChange={(event) => setEvidenceDraft((value) => ({ ...value, title: event.target.value }))} />
            <label htmlFor="evidence-kind">Evidence type</label><select id="evidence-kind" value={evidenceDraft.kind} onChange={(event) => setEvidenceDraft((value) => ({ ...value, kind: event.target.value }))}>{["project", "repository", "demo", "certificate", "assessment", "achievement"].map((kind) => <option value={kind} key={kind}>{statusLabel(kind)}</option>)}</select>
            <label htmlFor="evidence-url">HTTP/HTTPS URL</label><input id="evidence-url" type="url" required value={evidenceDraft.url} onChange={(event) => setEvidenceDraft((value) => ({ ...value, url: event.target.value }))} />
            <label htmlFor="evidence-screenshot">Optional screenshot URL</label><input id="evidence-screenshot" type="url" value={evidenceDraft.screenshotUrl} onChange={(event) => setEvidenceDraft((value) => ({ ...value, screenshotUrl: event.target.value }))} />
            <label htmlFor="evidence-description">Description</label><textarea id="evidence-description" rows={3} maxLength={1000} value={evidenceDraft.description} onChange={(event) => setEvidenceDraft((value) => ({ ...value, description: event.target.value }))} />
            <label htmlFor="evidence-tech">Technologies (comma separated)</label><input id="evidence-tech" value={evidenceDraft.technologies} onChange={(event) => setEvidenceDraft((value) => ({ ...value, technologies: event.target.value }))} />
            <label htmlFor="evidence-skills">Related skills (comma separated)</label><input id="evidence-skills" value={evidenceDraft.linkedSkills} onChange={(event) => setEvidenceDraft((value) => ({ ...value, linkedSkills: event.target.value }))} />
            <label htmlFor="evidence-visibility">Visibility</label><select id="evidence-visibility" value={evidenceDraft.visibility} onChange={(event) => setEvidenceDraft((value) => ({ ...value, visibility: event.target.value }))}><option value="public">Public</option><option value="private">Private</option></select>
            <div className="ln-modal-footer"><button type="button" className="ln-outline-button" onClick={() => setShowEvidenceForm(false)}>Cancel</button><button className="ln-primary-button" disabled={busy}>Save evidence</button></div>
          </form>
        </Modal>
      )}

      {showTeamForm && (
        <Modal title="Create project collaboration request" onClose={() => setShowTeamForm(false)} wide>
          <form className="ln-profile-form" onSubmit={saveTeam}>
            <label htmlFor="team-title">Project name</label><input id="team-title" required maxLength={140} value={teamDraft.title} onChange={(event) => setTeamDraft((value) => ({ ...value, title: event.target.value }))} />
            <label htmlFor="team-description">Project description</label><textarea id="team-description" required maxLength={1000} rows={3} value={teamDraft.description} onChange={(event) => setTeamDraft((value) => ({ ...value, description: event.target.value }))} />
            <label htmlFor="team-skills">Skills you are seeking</label><input id="team-skills" required value={teamDraft.desiredSkills} onChange={(event) => setTeamDraft((value) => ({ ...value, desiredSkills: event.target.value }))} placeholder="React, UI/UX, Node.js" />
            <label className="ln-checkbox-label"><input type="checkbox" checked={teamDraft.openToMembers} onChange={(event) => setTeamDraft((value) => ({ ...value, openToMembers: event.target.checked }))} />List this request for public students</label>
            <div className="ln-modal-footer"><button type="button" className="ln-outline-button" onClick={() => setShowTeamForm(false)}>Cancel</button><button className="ln-primary-button" disabled={busy}>Create request</button></div>
          </form>
        </Modal>
      )}

      {showTaskForm && (
        <Modal title="Publish micro-internship task" onClose={() => setShowTaskForm(false)} wide>
          <form className="ln-profile-form" onSubmit={createMicroInternship}>
            <label htmlFor="task-title">Title</label><input id="task-title" required maxLength={160} value={taskDraft.title} onChange={(event) => setTaskDraft((value) => ({ ...value, title: event.target.value }))} />
            <label htmlFor="task-description">Description</label><textarea id="task-description" required rows={3} maxLength={3000} value={taskDraft.description} onChange={(event) => setTaskDraft((value) => ({ ...value, description: event.target.value }))} />
            <label htmlFor="task-tech">Technology stack (comma separated)</label><input id="task-tech" required value={taskDraft.technologies} onChange={(event) => setTaskDraft((value) => ({ ...value, technologies: event.target.value }))} />
            <label htmlFor="task-requirements">Requirements (comma separated)</label><input id="task-requirements" required value={taskDraft.requirements} onChange={(event) => setTaskDraft((value) => ({ ...value, requirements: event.target.value }))} />
            <label htmlFor="task-deliverables">Expected deliverables (comma separated)</label><input id="task-deliverables" required value={taskDraft.deliverables} onChange={(event) => setTaskDraft((value) => ({ ...value, deliverables: event.target.value }))} />
            <label htmlFor="task-deadline">Deadline</label><input id="task-deadline" type="date" required min={TODAY_DATE} value={taskDraft.deadline} onChange={(event) => setTaskDraft((value) => ({ ...value, deadline: event.target.value }))} />
            <label htmlFor="task-difficulty">Difficulty</label><select id="task-difficulty" value={taskDraft.difficulty} onChange={(event) => setTaskDraft((value) => ({ ...value, difficulty: event.target.value }))}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
            <div className="ln-modal-footer"><button type="button" className="ln-outline-button" onClick={() => setShowTaskForm(false)}>Cancel</button><button className="ln-primary-button" disabled={busy}>Publish task</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function CandidateCard({ candidate, saved, onSave }) {
  return (
    <article className="ln-candidate-card">
      <Avatar name={candidate.name} image={candidate.profileImage} />
      <div><h4>{candidate.name}</h4><p>{candidate.headline}</p><span>{candidate.college}</span>{candidate.country && <span> · {candidate.country}</span>}{candidate.language && <span> · {candidate.language.toUpperCase()}</span>}<p><strong>Skills:</strong> {candidate.skills.join(", ") || "No skills listed"}</p>{candidate.publicEvidence?.map((item) => <p className="ln-candidate-evidence" key={item.id}>{item.screenshotUrl && <img src={item.screenshotUrl} alt={`Screenshot for ${item.title}`} loading="lazy" referrerPolicy="no-referrer" />}<a href={item.url} target="_blank" rel="noopener noreferrer">{item.title} · Not Verified <ExternalLink size={12} /></a></p>)}</div>
      <button className="ln-outline-button" onClick={onSave}>{saved ? <Check size={15} /> : <Bookmark size={15} />}{saved ? "Saved" : "Save"}</button>
    </article>
  );
}

function Avatar({ name = "", image = "", large = false }) {
  const [failed, setFailed] = useState(false);
  const imageUrl = resolveProfilePhotoUrl(image);
  useEffect(() => setFailed(false), [imageUrl]);

  return (
    <span className={`ln-avatar ${large ? "ln-avatar-large" : ""}`}>
      {imageUrl && !failed
        ? <img src={imageUrl} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
        : initials(name)}
    </span>
  );
}

function ProfessionalProfileView({
  profile,
  portfolio = [],
  events = [],
  isOwner,
  connectionCount,
  connection,
  onEdit,
  onPortfolio,
  onConnect,
  onBack,
  busy,
}) {
  if (!profile) {
    return <section className="ln-card ln-empty"><h2>Profile unavailable</h2><p>This profile could not be loaded.</p></section>;
  }

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const publicEvidence = Array.isArray(portfolio) ? portfolio : [];

  return (
    <div className="ln-profile-page">
      {!isOwner && <button className="ln-back-link" onClick={onBack}>← Back to your network</button>}
      <section className="ln-card ln-public-hero">
        <div className="ln-profile-banner">
          <span className="ln-banner-wordmark">CAREERFORGE · PROFESSIONAL PROFILE</span>
          <span className="ln-banner-monogram">CF</span>
        </div>
        <div className="ln-public-identity">
          <Avatar name={profile.name} image={profile.profileImage} large />
          <div className="ln-public-identity-copy">
            <p className="ln-eyebrow">{isOwner ? "YOUR PROFESSIONAL PROFILE" : "CAREERFORGE MEMBER"}</p>
            <h1>{profile.name || "CareerForge member"}</h1>
            <p>{profile.headline || profile.preferredRole || "Professional headline not added"}</p>
            <div className="ln-public-meta">
              {profile.country && <span><MapPin size={15} />{profile.country}</span>}
              {profile.language && <span><Globe2 size={15} />{profile.language.toUpperCase()}</span>}
              {profile.college && <span><GraduationCap size={15} />{profile.college}</span>}
              {isOwner && <span><Users size={15} />{connectionCount} connections</span>}
            </div>
          </div>
          <div className="ln-public-actions">
            {isOwner
              ? <button className="ln-primary-button" onClick={onEdit}><Pencil size={16} />Edit profile</button>
              : connection
                ? <span className="ln-connected-label">{statusLabel(connection.status)}</span>
                : <button className="ln-primary-button" disabled={busy} onClick={onConnect}><UserRoundPlus size={16} />Connect</button>}
          </div>
        </div>
        <div className="ln-profile-privacy-line">
          <LockKeyhole size={14} />
          {isOwner
            ? `Profile is ${profile.privacy?.publicProfile ? "public in discovery" : "private in discovery"}`
            : "Only profile details permitted by this member are shown"}
        </div>
      </section>

      <section className="ln-card ln-profile-section">
        <div className="ln-section-heading"><h2>About</h2>{isOwner && <button onClick={onEdit}>Edit</button>}</div>
        {profile.bio
          ? <p className="ln-profile-about">{profile.bio}</p>
          : <p className="ln-muted">{isOwner ? "Add an introduction to tell your professional story." : "This member has not added an introduction."}</p>}
        {profile.preferredRole && <div className="ln-target-role"><span>Career interest</span><strong>{profile.preferredRole}</strong></div>}
      </section>

      <section className="ln-card ln-profile-section">
        <div className="ln-section-heading"><h2>Career DNA</h2><Sparkles size={19} /></div>
        {skills.length
          ? <div className="ln-skill-pills">{skills.map((skill) => <span className="ln-skill-pill" key={skill}>{skill}<small>Self-reported</small></span>)}</div>
          : <p className="ln-muted">{isOwner ? "Add skills to make your professional profile easier to discover." : "No skills are listed on this public profile."}</p>}
        {profile.preferences?.interests?.length > 0 && <p className="ln-profile-interests"><strong>Professional interests</strong><br />{profile.preferences.interests.join(" · ")}</p>}
      </section>

      <section className="ln-card ln-profile-section">
        <div className="ln-section-heading"><h2>Education</h2><GraduationCap size={19} /></div>
        {profile.college
          ? <div className="ln-profile-record"><span className="ln-profile-record-icon"><GraduationCap size={19} /></span><span><strong>{profile.college}</strong><small>Education listed on profile</small></span></div>
          : <p className="ln-muted">{isOwner ? "Add your school or education in profile settings." : "Education is not listed on this public profile."}</p>}
      </section>

      <section className="ln-card ln-profile-section">
        <div className="ln-section-heading"><h2>Proof of work & credentials</h2>{isOwner && <button onClick={onPortfolio}>Manage portfolio</button>}</div>
        {publicEvidence.length
          ? publicEvidence.map((item) => <article className="ln-profile-evidence" key={item.id}>
              <div><span className="ln-evidence-kind">{statusLabel(item.kind)}</span><h3>{item.title}</h3></div>
              <span className="ln-status-badge ln-status-unverified">Not Verified</span>
              {item.description && <p>{item.description}</p>}
              {item.technologies?.length > 0 && <p className="ln-muted">Technologies: {item.technologies.join(" · ")}</p>}
              <a href={item.url} target="_blank" rel="noopener noreferrer">Open evidence <ExternalLink size={14} /></a>
            </article>)
          : <p className="ln-muted">{isOwner ? "Add projects, repositories, certificates, and achievements to your portfolio." : "No public portfolio evidence has been shared."}</p>}
      </section>

      {(isOwner || profile.privacy?.showTimeline) && (
        <section className="ln-card ln-profile-section">
          <div className="ln-section-heading"><h2>Career journey</h2><GraduationCap size={19} /></div>
          {events.length
            ? <div className="ln-profile-timeline">{events.map((event) => <article className="ln-profile-event" key={event.id}>
                <span className="ln-timeline-marker" />
                <div><strong>{event.title}</strong><small>{statusLabel(event.kind)} · {formatDate(event.occurredAt)}</small>
                  {event.url && <a href={event.url} target="_blank" rel="noopener noreferrer">View work <ExternalLink size={13} /></a>}
                  {event.verificationStatus === "not_verified" && <span className="ln-event-note">Not Verified</span>}
                </div>
              </article>)}</div>
            : <p className="ln-muted">No timeline events have been recorded.</p>}
        </section>
      )}

      <section className="ln-card ln-profile-section">
        <div className="ln-section-heading"><h2>Contact & professional links</h2><LinkIcon size={18} /></div>
        {profile.githubUrl && <a className="ln-profile-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><CodeXml size={17} />GitHub profile <ExternalLink size={14} /></a>}
        {profile.linkedinUrl && <a className="ln-profile-link" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><LinkIcon size={17} />LinkedIn profile <ExternalLink size={14} /></a>}
        {!profile.githubUrl && !profile.linkedinUrl && <p className="ln-muted">{isOwner ? "Add portfolio links in your student dashboard." : "No professional links have been shared."}</p>}
        <p className="ln-product-note"><LockKeyhole size={13} />Personal email and phone details are not shown in public discovery.</p>
      </section>
    </div>
  );
}

function Modal({ title, onClose, wide = false, children }) {
  return (
    <div className="ln-modal-overlay" onClick={onClose}>
      <section className={`ln-modal ${wide ? "ln-modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="ln-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="ln-modal-header"><h2 id="ln-modal-title">{title}</h2><button className="ln-close-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></div>
        {children}
      </section>
    </div>
  );
}

export default LinkedIn;
