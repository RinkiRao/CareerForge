
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch as Github,
  Plus,
  Search,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  FolderGit2,
  Code2,
  Globe,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import "./GitHub.css";

const STORAGE_KEY = "careerforge_github_projects";

const initialProjects = [
  {
    id: "demo-1",
    name: "Interview Signal",
    description:
      "An interview preparation platform designed to help students practice assessments and identify areas for improvement.",
    technologies: ["Flutter", "Dart"],
    repository: "",
    demo: "",
    visibility: "Public",
    createdAt: "Sample project",
  },
  {
    id: "demo-2",
    name: "AURA AI Assistant",
    description:
      "A desktop assistant concept designed for voice interaction and everyday desktop productivity.",
    technologies: ["React", "Node.js", "Electron"],
    repository: "",
    demo: "",
    visibility: "Public",
    createdAt: "Sample project",
  },
];

const emptyForm = {
  name: "",
  description: "",
  technologies: "",
  repository: "",
  demo: "",
  visibility: "Public",
};

function readSavedProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Unable to read saved projects:", error);
  }

  return initialProjects;
}

function isValidWebUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function GitHub() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(readSavedProjects);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (storageError) {
      console.error("Unable to save projects:", storageError);
    }
  }, [projects]);

  const technologies = useMemo(() => {
    const allTechnologies = projects.flatMap(
      (project) => project.technologies || []
    );

    return ["All", ...new Set(allTechnologies)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((technology) =>
          technology.toLowerCase().includes(query)
        );

      const matchesFilter =
        activeFilter === "All" ||
        project.technologies.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, activeFilter]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (project) => {
    setEditingId(project.id);

    setForm({
      name: project.name,
      description: project.description,
      technologies: project.technologies.join(", "),
      repository: project.repository || "",
      demo: project.demo || "",
      visibility: project.visibility || "Public",
    });

    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("Project name aur description fill karna zaroori hai.");
      return;
    }

    if (!form.technologies.trim()) {
      setError("Kam se kam ek technology enter karo.");
      return;
    }

    if (
      !isValidWebUrl(form.repository) ||
      !isValidWebUrl(form.demo)
    ) {
      setError(
        "Repository aur demo links valid HTTP/HTTPS URLs hone chahiye."
      );
      return;
    }

    const projectData = {
      name: form.name.trim(),
      description: form.description.trim(),
      technologies: [
        ...new Set(
          form.technologies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
      ],
      repository: form.repository.trim(),
      demo: form.demo.trim(),
      visibility: form.visibility,
    };

    if (editingId) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...projectData }
            : project
        )
      );
    } else {
      setProjects((previous) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...projectData,
          createdAt: new Date().toLocaleDateString(),
        },
        ...previous,
      ]);
    }

    closeForm();
  };

  const deleteProject = (project) => {
    const confirmed = window.confirm(
      `Kya aap "${project.name}" project delete karna chahte ho?`
    );

    if (!confirmed) return;

    setProjects((previous) =>
      previous.filter((item) => item.id !== project.id)
    );
  };

  return (
    <div className="gh-page">
      <aside className="gh-sidebar">
        <button
          className="gh-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to CareerForge dashboard"
        >
          <span className="gh-brand-icon">C</span>
          <span>CareerForge</span>
        </button>

        <p className="gh-menu-label">WORKSPACE</p>

        <button
          className="gh-nav-item"
          onClick={() => navigate("/dashboard")}
        >
          <span>▦</span>
          Dashboard
        </button>

        <button
          className="gh-nav-item"
          onClick={() => navigate("/learn")}
        >
          <span>◈</span>
          Learn & Courses
        </button>

        <button className="gh-nav-item gh-nav-active">
          <Github size={18} />
          GitHub Projects
        </button>

        <div className="gh-sidebar-bottom">
          <Sparkles size={20} />
          <strong>Show your work</strong>
          <p>
            Build projects, demonstrate your skills, and grow your portfolio.
          </p>
        </div>
      </aside>

      <main className="gh-main">
        <header className="gh-topbar">
          <div className="gh-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>GitHub Projects</strong>
          </div>

          <div className="gh-user">
            <ProfileAvatar className="gh-avatar" />
            <div>
              <strong>Student</strong>
              <span>My portfolio</span>
            </div>
          </div>
        </header>

        <section className="gh-content">
          <div className="gh-hero">
            <div className="gh-hero-copy">
              <span className="gh-eyebrow">
                <Github size={14} />
                YOUR DEVELOPER PORTFOLIO
              </span>

              <h1>
                Your work speaks.
                <br />
                <span>Let it be seen.</span>
              </h1>

              <p>
                Collect your projects in one place. Showcase your skills
                through code, repositories, and live demos.
              </p>

              <button
                className="gh-primary-button"
                onClick={openAddForm}
              >
                <Plus size={17} />
                Add new project
              </button>
            </div>

            <div className="gh-hero-art">
              <Github size={100} strokeWidth={1.2} />
              <span className="gh-hero-dot dot-one" />
              <span className="gh-hero-dot dot-two" />
              <span className="gh-hero-dot dot-three" />
            </div>
          </div>

          <div className="gh-stats">
            <div className="gh-stat-card">
              <div className="gh-stat-icon green">
                <FolderGit2 size={21} />
              </div>
              <div>
                <span>Total projects</span>
                <strong>{projects.length}</strong>
              </div>
            </div>

            <div className="gh-stat-card">
              <div className="gh-stat-icon purple">
                <Code2 size={21} />
              </div>
              <div>
                <span>Technologies used</span>
                <strong>{technologies.length - 1}</strong>
              </div>
            </div>

            <div className="gh-stat-card">
              <div className="gh-stat-icon orange">
                <Globe size={21} />
              </div>
              <div>
                <span>Live demos</span>
                <strong>
                  {projects.filter((project) => project.demo).length}
                </strong>
              </div>
            </div>
          </div>

          <section className="gh-project-section">
            <div className="gh-section-heading">
              <div>
                <h2>My projects</h2>
                <p>Manage and showcase your development work.</p>
              </div>

              <span className="gh-count">
                {filteredProjects.length} projects
              </span>
            </div>

            <div className="gh-toolbar">
              <div className="gh-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search projects or technologies..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <button
                className="gh-secondary-button"
                onClick={openAddForm}
              >
                <Plus size={16} />
                New project
              </button>
            </div>

            <div className="gh-filters">
              {technologies.map((technology) => (
                <button
                  key={technology}
                  className={
                    activeFilter === technology
                      ? "gh-filter gh-filter-active"
                      : "gh-filter"
                  }
                  onClick={() => setActiveFilter(technology)}
                >
                  {technology}
                </button>
              ))}
            </div>

            <div className="gh-project-grid">
              {filteredProjects.map((project, index) => (
                <article className="gh-project-card" key={project.id}>
                  <div
                    className={`gh-project-cover gh-cover-${index % 4}`}
                  >
                    <div className="gh-cover-symbol">
                      <FolderGit2 size={34} />
                    </div>

                    <span className="gh-visibility">
                      {project.visibility}
                    </span>
                  </div>

                  <div className="gh-project-body">
                    <div className="gh-project-title-row">
                      <h3>{project.name}</h3>

                      <div className="gh-project-actions">
                        <button
                          className="gh-icon-button"
                          onClick={() => openEditForm(project)}
                          aria-label={`Edit ${project.name}`}
                          title="Edit project"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="gh-icon-button gh-delete-button"
                          onClick={() => deleteProject(project)}
                          aria-label={`Delete ${project.name}`}
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <p className="gh-project-description">
                      {project.description}
                    </p>

                    <div className="gh-tech-list">
                      {project.technologies.map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>

                    <div className="gh-project-footer">
                      <span className="gh-project-date">
                        {project.createdAt || "Project"}
                      </span>

                      <div className="gh-project-links">
                        {project.repository && (
                          <a
                            href={project.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open repository"
                          >
                            <Github size={16} />
                          </a>
                        )}

                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open live demo"
                          >
                            <ArrowUpRight size={17} />
                          </a>
                        )}
                      </div>
                    </div>

                    {!project.repository && !project.demo && (
                      <p className="gh-no-links">
                        <ExternalLink size={13} />
                        Add repository or demo links to showcase your work.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="gh-empty-state">
                <FolderGit2 size={40} />
                <h3>No projects found</h3>
                <p>
                  Search change karo, filter reset karo, ya apna first
                  project add karo.
                </p>

                <button
                  className="gh-primary-button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </section>
      </main>

      {isFormOpen && (
        <div
          className="gh-modal-overlay"
          onClick={closeForm}
        >
          <section
            className="gh-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gh-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="gh-modal-header">
              <div>
                <span className="gh-eyebrow">PROJECT DETAILS</span>
                <h2 id="gh-modal-title">
                  {editingId ? "Edit project" : "Add new project"}
                </h2>
              </div>

              <button
                className="gh-modal-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="gh-project-name">Project name *</label>
              <input
                id="gh-project-name"
                type="text"
                placeholder="e.g. My Portfolio Website"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                maxLength={100}
                required
              />

              <label htmlFor="gh-project-description">
                Project description *
              </label>
              <textarea
                id="gh-project-description"
                placeholder="What does your project do?"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                rows={4}
                maxLength={1000}
                required
              />

              <label htmlFor="gh-project-tech">
                Technologies * <span>(comma separated)</span>
              </label>
              <input
                id="gh-project-tech"
                type="text"
                placeholder="React, Node.js, MongoDB"
                value={form.technologies}
                onChange={(event) =>
                  setForm({ ...form, technologies: event.target.value })
                }
                required
              />

              <label htmlFor="gh-project-repo">
                GitHub repository URL
              </label>
              <input
                id="gh-project-repo"
                type="url"
                placeholder="https://github.com/username/repository"
                value={form.repository}
                onChange={(event) =>
                  setForm({ ...form, repository: event.target.value })
                }
              />

              <label htmlFor="gh-project-demo">
                Live demo URL
              </label>
              <input
                id="gh-project-demo"
                type="url"
                placeholder="https://your-project.example.com"
                value={form.demo}
                onChange={(event) =>
                  setForm({ ...form, demo: event.target.value })
                }
              />

              <label htmlFor="gh-project-visibility">Visibility</label>
              <select
                id="gh-project-visibility"
                value={form.visibility}
                onChange={(event) =>
                  setForm({ ...form, visibility: event.target.value })
                }
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>

              {error && <p className="gh-form-error">{error}</p>}

              <div className="gh-modal-actions">
                <button
                  type="button"
                  className="gh-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="gh-primary-button">
                  {editingId ? "Save changes" : "Add project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default GitHub;
