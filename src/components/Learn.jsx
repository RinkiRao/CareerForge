
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import "./Learn.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85";

const courses = [
  {
    id: 1,
    title: "Complete MERN Stack Development",
    category: "Development",
    level: "Beginner",
    duration: "8 weeks",
    instructor: "CareerForge Academy",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=85",
    description:
      "Learn to build full-stack web applications using MongoDB, Express, React and Node.js.",
    topics: [
      { title: "Introduction to Web Development & MERN", duration: "25 min" },
      { title: "HTML, CSS and JavaScript Fundamentals", duration: "45 min" },
      { title: "React JS Components, Props and Hooks", duration: "50 min" },
      { title: "Node.js and Express REST APIs", duration: "55 min" },
      { title: "MongoDB and Full Stack Project", duration: "60 min" },
    ],
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    category: "Programming",
    level: "Intermediate",
    duration: "10 weeks",
    instructor: "CareerForge Academy",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    description:
      "Build problem-solving skills and prepare for coding interviews with DSA.",
    topics: [
      { title: "Introduction to Data Structures and Algorithms", duration: "30 min" },
      { title: "Arrays and Strings", duration: "45 min" },
      { title: "Linked Lists, Stacks and Queues", duration: "50 min" },
      { title: "Trees, Binary Search Trees and Graphs", duration: "60 min" },
      { title: "Sorting, Searching and Time Complexity", duration: "55 min" },
    ],
  },
  {
    id: 3,
    title: "Flutter App Development",
    category: "Development",
    level: "Beginner",
    duration: "6 weeks",
    instructor: "CareerForge Academy",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9?auto=format&fit=crop&w=1200&q=85",
    description:
      "Understand mobile app development, Flutter widgets, Dart and app navigation.",
    topics: [
      { title: "Introduction to Flutter and Dart", duration: "30 min" },
      { title: "Dart Programming Fundamentals", duration: "45 min" },
      { title: "Flutter Widgets and Layouts", duration: "50 min" },
      { title: "Navigation, Forms and State Management", duration: "55 min" },
      { title: "Build Your First Flutter App", duration: "60 min" },
    ],
  },
  {
    id: 4,
    title: "AI & Generative AI Fundamentals",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "4 weeks",
    instructor: "CareerForge Academy",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    description:
      "Explore artificial intelligence, machine learning, generative AI and prompt engineering.",
    topics: [
      { title: "Introduction to Artificial Intelligence", duration: "30 min" },
      { title: "Machine Learning Fundamentals", duration: "45 min" },
      { title: "Deep Learning and Neural Networks", duration: "50 min" },
      { title: "Generative AI and Large Language Models", duration: "55 min" },
      { title: "Prompt Engineering and AI Projects", duration: "45 min" },
    ],
  },
  {
    id: 5,
    title: "Interview & Communication Skills",
    category: "Career",
    level: "Beginner",
    duration: "3 weeks",
    instructor: "CareerForge Academy",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    description:
      "Improve communication, interview confidence, resume presentation and workplace skills.",
    topics: [
      { title: "How to Introduce Yourself in an Interview", duration: "20 min" },
      { title: "Resume Building and ATS Fundamentals", duration: "35 min" },
      { title: "Technical Interview Preparation", duration: "40 min" },
      { title: "Communication and Speaking Skills", duration: "30 min" },
      { title: "HR Interview Questions and Mock Interviews", duration: "45 min" },
    ],
  },
  {
    id: 6,
    title: "JavaScript Programming",
    category: "Programming",
    level: "Beginner",
    duration: "5 weeks",
    instructor: "CareerForge Academy",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85",
    description:
      "Learn JavaScript from basics to modern ES6 concepts and practical programming.",
    topics: [
      { title: "JavaScript Introduction and Variables", duration: "30 min" },
      { title: "Functions, Arrays and Objects", duration: "45 min" },
      { title: "DOM Manipulation and Events", duration: "45 min" },
      { title: "Promises, Async Await and Fetch API", duration: "50 min" },
      { title: "Build a JavaScript Mini Project", duration: "60 min" },
    ],
  },
];

const categories = [
  "All",
  "Development",
  "Programming",
  "Artificial Intelligence",
  "Career",
];

function readLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getStudentName() {
  const keys = [
    "careerforge_student_profile",
    "careerforge_current_student",
  ];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const data = JSON.parse(raw);

      if (typeof data === "string" && data.trim()) {
        return data.trim();
      }

      const user = data?.user || data?.student || data || {};

      const name =
        user.fullName ||
        user.name ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username;

      if (name) return String(name).trim();
    } catch {
      // Try the next profile key.
    }
  }

  return "CareerForge Student";
}

function createCertificateId() {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();

  return `CF-${year}-${randomPart}`;
}

function CourseImage({ course, className = "learn-course-photo" }) {
  const [imageSrc, setImageSrc] = useState(course.image);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageError = () => {
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
    } else {
      setImageFailed(true);
    }
  };

  if (imageFailed) {
    return (
      <div className="learn-image-fallback">
        Course image unavailable
      </div>
    );
  }

  return (
    <img
      className={className}
      src={imageSrc}
      alt={course.title}
      loading="lazy"
      onError={handleImageError}
    />
  );
}

function Learn() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [completedLessons, setCompletedLessons] = useState(() =>
    readLocalArray("careerforge_completed_lessons").reduce(
      (result, item) => result,
      (() => {
        try {
          const saved = JSON.parse(
            localStorage.getItem("careerforge_completed_lessons") || "{}"
          );
          return saved && typeof saved === "object" && !Array.isArray(saved)
            ? saved
            : {};
        } catch {
          return {};
        }
      })()
    )
  );

  const [certificates, setCertificates] = useState(() =>
    readLocalArray("careerforge_certificates")
  );

  useEffect(() => {
    localStorage.setItem(
      "careerforge_completed_lessons",
      JSON.stringify(completedLessons)
    );
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem(
      "careerforge_certificates",
      JSON.stringify(certificates)
    );
  }, [certificates]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        course.title.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText) ||
        course.instructor.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || course.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const getCompletedCount = (course) => {
    return (completedLessons[course.id] || []).length;
  };

  const getProgress = (course) => {
    return Math.round(
      (getCompletedCount(course) / course.topics.length) * 100
    );
  };

  const isCourseCompleted = (course) => {
    return (
      getCompletedCount(course) >= course.topics.length
    );
  };

  const getCourseCertificate = (courseId) => {
    return certificates.find(
      (certificate) => certificate.courseId === courseId
    );
  };

  const toggleLessonComplete = (courseId, lessonIndex) => {
    setCompletedLessons((previous) => {
      const current = previous[courseId] || [];

      const updated = current.includes(lessonIndex)
        ? current.filter((item) => item !== lessonIndex)
        : [...current, lessonIndex];

      return {
        ...previous,
        [courseId]: updated,
      };
    });
  };

  const openLecture = (course, topic) => {
    const searchQuery = `${course.title} ${topic} full lecture tutorial`;

    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      searchQuery
    )}`;

    window.open(youtubeUrl, "_blank", "noopener,noreferrer");
  };

  const openCourse = (course) => {
    setSelectedCourse(course);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToCourses = () => {
    setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateCertificate = (course) => {
    if (!isCourseCompleted(course)) {
      window.alert("Please complete all course lessons first.");
      return;
    }

    const existing = getCourseCertificate(course.id);

    if (existing) {
      setSelectedCertificate(existing);
      return;
    }

    const certificate = {
      id: createCertificateId(),
      courseId: course.id,
      studentName: getStudentName(),
      courseTitle: course.title,
      instructor: course.instructor,
      issueDate: new Date().toISOString(),
      issuer: "CareerForge Academy",
    };

    setCertificates((previous) => [...previous, certificate]);
    setSelectedCertificate(certificate);
  };

  const closeCertificate = () => {
    setSelectedCertificate(null);
  };

  return (
    <div className="learn-page">
      {/* SIDEBAR */}
      <aside className="learn-sidebar">
        <div className="learn-brand">
          <div className="learn-brand-icon">C</div>
          <span>CareerForge</span>
        </div>

        <p className="learn-menu-label">WORKSPACE</p>

        <button
          className="learn-nav-item"
          onClick={() => navigate("/dashboard")}
        >
          <span>▦</span>
          Dashboard
        </button>

        <button className="learn-nav-item active">
          <span>◈</span>
          Learn & Courses
        </button>

        <button
          className="learn-nav-item"
          onClick={() => window.alert("Practice page abhi banaya nahi hai.")}
        >
          <span>⌘</span>
          Practice
        </button>

        <button
          className="learn-nav-item"
          onClick={() =>
            window.alert("Opportunities page abhi banaya nahi hai.")
          }
        >
          <span>↗</span>
          Opportunities
        </button>

        <button
          className="learn-nav-item"
          onClick={() => window.alert("Profile page abhi banaya nahi hai.")}
        >
          <span>◎</span>
          My Profile
        </button>

        <div className="learn-sidebar-bottom">
          <div className="learn-help-icon">✦</div>
          <strong>Keep growing!</strong>
          <p>Small steps today. Big opportunities tomorrow.</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="learn-main">
        <header className="learn-topbar">
          <div className="learn-breadcrumb-area">
            <span className="learn-breadcrumb">Workspace / </span>
            <strong>
              {selectedCourse ? selectedCourse.title : "Learn & Courses"}
            </strong>
          </div>

          <div className="learn-user">
            <div className="learn-notification">♧</div>
            <ProfileAvatar className="learn-avatar" name={getStudentName()} />

            <div className="learn-user-info">
              <strong>{getStudentName()}</strong>
              <span>Learner account</span>
            </div>
          </div>
        </header>

        <section className="learn-content">
          {!selectedCourse ? (
            <>
              <div className="learn-welcome">
                <div className="learn-welcome-text">
                  <span className="learn-eyebrow">
                    YOUR LEARNING SPACE
                  </span>

                  <h1>
                    Learn something <span>remarkable.</span>
                  </h1>

                  <p>
                    Build practical skills, complete courses, and prepare
                    for your next career opportunity.
                  </p>
                </div>

                <div className="learn-welcome-art">🚀</div>
              </div>

              <div className="learn-stats">
                <div className="learn-stat-card">
                  <div className="learn-stat-icon mint">◈</div>
                  <div>
                    <span>Available courses</span>
                    <strong>{courses.length}</strong>
                  </div>
                </div>

                <div className="learn-stat-card">
                  <div className="learn-stat-icon purple">▤</div>
                  <div>
                    <span>Learning hours</span>
                    <strong>120+</strong>
                  </div>
                </div>

                <div className="learn-stat-card">
                  <div className="learn-stat-icon orange">✦</div>
                  <div>
                    <span>Your certificates</span>
                    <strong>{certificates.length}</strong>
                  </div>
                </div>
              </div>

              <section className="learn-courses-section">
                <div className="learn-section-heading">
                  <div>
                    <h2>Explore courses</h2>
                    <p>
                      Choose a skill and start learning at your own pace.
                    </p>
                  </div>

                  <span className="learn-course-count">
                    {filteredCourses.length} courses
                  </span>
                </div>

                <div className="learn-search">
                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search courses or skills..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  {search && (
                    <button
                      className="learn-search-clear"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="learn-filters">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={
                        category === item
                          ? "learn-filter active"
                          : "learn-filter"
                      }
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="learn-course-grid">
                  {filteredCourses.map((course) => {
                    const courseCertificate = getCourseCertificate(course.id);

                    return (
                      <article className="learn-course-card" key={course.id}>
                        <div className="learn-course-art">
                          <CourseImage course={course} />
                          <span className="learn-level">
                            {course.level}
                          </span>
                        </div>

                        <div className="learn-course-body">
                          <span className="learn-course-category">
                            {course.category}
                          </span>

                          <h3>{course.title}</h3>

                          <p className="learn-instructor">
                            By {course.instructor}
                          </p>

                          <div className="learn-course-meta">
                            <span>◷ {course.duration}</span>
                            <span>▤ {course.topics.length} lessons</span>
                          </div>

                          <div className="learn-card-progress">
                            <div className="learn-card-progress-label">
                              <span>Your progress</span>
                              <strong>{getProgress(course)}%</strong>
                            </div>

                            <div className="learn-progress-track">
                              <div
                                className="learn-progress-fill"
                                style={{ width: `${getProgress(course)}%` }}
                              />
                            </div>
                          </div>

                          <button
                            className="learn-start-button"
                            onClick={() => openCourse(course)}
                          >
                            {courseCertificate
                              ? "View Certificate"
                              : "View course"}
                            <span>↗</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="learn-empty">
                    <span>🔎</span>
                    <h3>No courses found</h3>
                    <p>Try another search term or category.</p>

                    <button onClick={clearFilters}>
                      Clear filters
                    </button>
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="learn-detail-page">
              <button
                className="learn-back-button"
                onClick={backToCourses}
              >
                ← Back to courses
              </button>

              <div className="learn-detail-hero">
                <div className="learn-detail-image">
                  <CourseImage
                    key={selectedCourse.id}
                    course={selectedCourse}
                  />
                </div>

                <div className="learn-detail-info">
                  <span className="learn-course-category">
                    {selectedCourse.category}
                  </span>

                  <span className="learn-detail-level">
                    {selectedCourse.level}
                  </span>

                  <h1>{selectedCourse.title}</h1>

                  <p>{selectedCourse.description}</p>

                  <div className="learn-detail-meta">
                    <span>◷ {selectedCourse.duration}</span>
                    <span>▤ {selectedCourse.topics.length} lessons</span>
                    <span>By {selectedCourse.instructor}</span>
                  </div>

                  <div className="learn-detail-progress">
                    <div className="learn-detail-progress-text">
                      <span>Your learning progress</span>
                      <strong>{getProgress(selectedCourse)}%</strong>
                    </div>

                    <div className="learn-progress-track">
                      <div
                        className="learn-progress-fill"
                        style={{
                          width: `${getProgress(selectedCourse)}%`,
                        }}
                      />
                    </div>

                    <small>
                      {getCompletedCount(selectedCourse)} of{" "}
                      {selectedCourse.topics.length} lessons completed
                    </small>
                  </div>
                </div>
              </div>

              <div className="learn-syllabus">
                <div className="learn-syllabus-heading">
                  <div>
                    <h2>Course curriculum</h2>
                    <p>
                      Follow these lessons in order and learn step by step.
                    </p>
                  </div>

                  <span>{selectedCourse.topics.length} Lessons</span>
                </div>

                <div className="learn-lesson-list">
                  {selectedCourse.topics.map((topic, index) => {
                    const isCompleted = (
                      completedLessons[selectedCourse.id] || []
                    ).includes(index);

                    return (
                      <article
                        className="learn-lesson-card"
                        key={`${selectedCourse.id}-${index}`}
                      >
                        <div className="learn-lesson-number">
                          {isCompleted
                            ? "✓"
                            : String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="learn-lesson-info">
                          <span>LESSON {index + 1}</span>
                          <h3>{topic.title}</h3>
                          <p>◷ {topic.duration}</p>
                        </div>

                        <div className="learn-lesson-actions">
                          <button
                            className="learn-watch-button"
                            onClick={() =>
                              openLecture(selectedCourse, topic.title)
                            }
                          >
                            ▶ Watch Lecture
                          </button>

                          <button
                            className={
                              isCompleted
                                ? "learn-complete-button completed"
                                : "learn-complete-button"
                            }
                            onClick={() =>
                              toggleLessonComplete(selectedCourse.id, index)
                            }
                          >
                            {isCompleted
                              ? "✓ Completed"
                              : "Mark complete"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* CERTIFICATE SECTION */}
              {isCourseCompleted(selectedCourse) && (
                <div className="learn-certificate-ready">
                  <div className="learn-certificate-ready-icon">🏆</div>

                  <div className="learn-certificate-ready-text">
                    <h2>Congratulations! Course completed.</h2>
                    <p>
                      You have completed all lessons. Your CareerForge
                      course-completion certificate is ready.
                    </p>
                  </div>

                  <button
                    className="learn-generate-certificate"
                    onClick={() => generateCertificate(selectedCourse)}
                  >
                    {getCourseCertificate(selectedCourse.id)
                      ? "View Certificate"
                      : "Generate Certificate"}
                    <span>↗</span>
                  </button>
                </div>
              )}

              <div className="learn-learning-note">
                <span>ⓘ</span>
                <p>
                  Lecture links open related YouTube search results.
                  Your lesson completion and generated certificates are
                  currently saved in this browser.
                </p>
              </div>
            </section>
          )}
        </section>
      </main>

      {/* CERTIFICATE PREVIEW */}
      {selectedCertificate && (
        <div className="learn-certificate-overlay">
          <div className="learn-certificate-modal">
            <div className="learn-certificate-toolbar">
              <button
                className="learn-certificate-close"
                onClick={closeCertificate}
              >
                × Close
              </button>

              <button
                className="learn-certificate-print"
                onClick={() => window.print()}
              >
                ↓ Download / Print Certificate
              </button>
            </div>

            <div className="learn-certificate">
              <div className="learn-certificate-inner">
                <div className="learn-certificate-brand">
                  <div className="learn-certificate-logo">C</div>
                  <span>CareerForge</span>
                </div>

                <div className="learn-certificate-seal">★</div>

                <p className="learn-certificate-overline">
                  CERTIFICATE OF COMPLETION
                </p>

                <h1>Certificate</h1>

                <p className="learn-certificate-presented">
                  This certificate is proudly presented to
                </p>

                <h2>{selectedCertificate.studentName}</h2>

                <div className="learn-certificate-line" />

                <p className="learn-certificate-description">
                  For successfully completing the course
                </p>

                <h3>{selectedCertificate.courseTitle}</h3>

                <p className="learn-certificate-description">
                  Organized by {selectedCertificate.issuer}
                </p>

                <div className="learn-certificate-footer">
                  <div>
                    <strong>
                      {new Date(
                        selectedCertificate.issueDate
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                    <span>DATE OF ISSUE</span>
                  </div>

                  <div className="learn-certificate-signature">
                    <strong>CareerForge Academy</strong>
                    <span>AUTHORIZED SIGNATORY</span>
                  </div>

                  <div>
                    <strong>{selectedCertificate.id}</strong>
                    <span>CERTIFICATE ID</span>
                  </div>
                </div>

                <div className="learn-certificate-bottom">
                  Learn. Build. Achieve.
                </div>
              </div>
            </div>

            <p className="learn-certificate-footnote">
              This is a CareerForge course-completion certificate.
              It is not an accredited academic qualification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Learn;
