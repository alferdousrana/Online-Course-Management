import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Modal from "bootstrap/js/dist/modal";

const baseUrl = "http://localhost:8000/api";

const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

// Convert YouTube URL to embed format
const toEmbedUrl = (url) => {
  if (!url) return "";

  try {
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("/embed/")[1].split(/[?&]/)[0];
    } else if (url.includes("youtube.com/v/")) {
      videoId = url.split("/v/")[1].split(/[?&]/)[0];
    }

    if (!videoId) {
      console.error("Could not extract video ID from URL:", url);
      return "";
    }

    videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;
  } catch (error) {
    console.error("Error parsing YouTube URL:", url, error);
    return "";
  }
};

function EnrolledCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollStatus, setEnrollStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [progress, setProgress] = useState({});
  // নতুন স্টেট: প্রোগ্রেস শতাংশ সংরক্ষণ করতে
  const [totalProgress, setTotalProgress] = useState(0);
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const watchedTimeRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const updateIntervalRef = useRef(null);

  // Load YouTube Iframe API
  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube Iframe API loaded successfully");
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  // Set document title and fetch data
  useEffect(() => {
    document.title = `Course Detail - ${id} - LWR`;
    fetchCourse();
    fetchEnrollStatus();
    fetchProgress();
  }, [id]);

  // Fetch course data
  const fetchCourse = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${baseUrl}/courses/${id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setCourse(response.data);
      console.log("Course data fetched:", response.data); // Debug: Confirm course data
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrollment status
  const fetchEnrollStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login"); // Debug: Token check
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${baseUrl}/enroll-status/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setEnrollStatus(res.data.status);
      console.log("Enrollment status:", res.data.status); // Debug: Confirm status
    } catch (err) {
      console.error("Failed to fetch status:", err);
      setError("Failed to load enrollment status.");
    }
  };

  // Fetch progress for all modules
  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token for progress fetch"); // Debug: Token check
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/module-progress/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const progressMap = response.data.reduce((acc, prog) => {
        acc[prog.module] = {
          watched_duration: prog.watched_duration,
          completed: prog.completed,
        };
        return acc;
      }, {});
      setProgress(progressMap);
      console.log("Progress fetched:", progressMap); // Debug: Confirm progress data
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  // নতুন: প্রোগ্রেস শতাংশ গণনা করা
  useEffect(() => {
    if (course && course.modules && progress) {
      const totalModules = course.modules.length;
      if (totalModules === 0) {
        setTotalProgress(0);
        return;
      }
      const completedModules = course.modules.filter(
        (mod) => progress[mod.id]?.completed
      ).length;
      const percentage = (completedModules / totalModules) * 100;
      setTotalProgress(Math.round(percentage));
    } else {
      setTotalProgress(0);
    }
  }, [course, progress]);

  // Update progress to backend
  const updateProgress = async (moduleId, duration) => {
    const token = localStorage.getItem("token");
    if (!token || !moduleId) {
      console.log("Cannot update progress: No token or moduleId", {
        token,
        moduleId,
      });
      return;
    }

    try {
      console.log("Sending progress update:", {
        moduleId,
        watched_duration: Math.floor(duration),
      });
      const response = await axios.post(
        `${baseUrl}/module-progress/${moduleId}/`,
        { watched_duration: Math.floor(duration) },
        { headers: { Authorization: `Token ${token}` } }
      );
      setProgress((prev) => ({
        ...prev,
        [moduleId]: {
          watched_duration: response.data.watched_duration,
          completed: response.data.completed,
        },
      }));
      console.log("Progress updated:", response.data);
    } catch (err) {
      console.error(
        "Failed to update progress:",
        err.response?.data || err.message
      );
    }
  };

  // Handle video playback
  const handleVideoPlay = (videoUrl, moduleId) => {
    const embedUrl = toEmbedUrl(videoUrl);
    if (!embedUrl) {
      alert("Invalid video URL. Please check the link.");
      return;
    }

    setVideoUrl(embedUrl);
    setCurrentModuleId(moduleId);

    // If a player from a previous modal opening exists, destroy it first.
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    const modalElement = document.getElementById("videoModal");
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();

      // Ensure YouTube API is ready
      if (window.YT && window.YT.Player) {
        const videoId = embedUrl.split("/embed/")[1].split("?")[0];

        playerRef.current = new window.YT.Player("youtube-player", {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              console.log(
                "SUCCESS: YouTube player ready for module:",
                moduleId
              );
              event.target.playVideo();
            },
            onStateChange: (event) => {
              console.log(
                "Player state changed:",
                event.data,
                "Module:",
                moduleId
              );

              if (event.data === window.YT.PlayerState.PLAYING) {
                lastUpdateTimeRef.current = Date.now();
                clearInterval(updateIntervalRef.current);

                updateIntervalRef.current = setInterval(() => {
                  const now = Date.now();
                  const elapsedSeconds =
                    (now - lastUpdateTimeRef.current) / 1000;
                  watchedTimeRef.current += elapsedSeconds;
                  lastUpdateTimeRef.current = now;

                  console.log(
                    `Module ${moduleId}: Watched for ${Math.floor(
                      watchedTimeRef.current
                    )}s in this session.`
                  );

                  if (watchedTimeRef.current >= 30) {
                    console.log(
                      `-- Reached 30s threshold. Updating backend with ${watchedTimeRef.current}s... --`
                    );
                    updateProgress(moduleId, watchedTimeRef.current);
                    watchedTimeRef.current = 0; // Reset counter
                  }
                }, 5000); // Check every 5 seconds
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                clearInterval(updateIntervalRef.current);
                if (watchedTimeRef.current > 0) {
                  const now = Date.now();
                  const elapsedSeconds =
                    (now - lastUpdateTimeRef.current) / 1000;
                  watchedTimeRef.current += elapsedSeconds;

                  console.log(
                    `-- Paused/Ended. Updating backend with remaining ${watchedTimeRef.current}s... --`
                  );
                  updateProgress(moduleId, watchedTimeRef.current);
                  watchedTimeRef.current = 0;
                }
              }
            },
            onError: (event) => {
              console.error(
                "YouTube player error:",
                event.data,
                "Module:",
                moduleId
              );
            },
          },
        });
      }
    }
  };

  // Handle video modal close
  const handleModalClose = () => {
    clearInterval(updateIntervalRef.current);
    if (watchedTimeRef.current > 0 && currentModuleId) {
      console.log(
        `-- Modal closed. Updating backend with final ${watchedTimeRef.current}s... --`
      );
      updateProgress(currentModuleId, watchedTimeRef.current);
    }

    watchedTimeRef.current = 0;
    setVideoUrl("");
    setCurrentModuleId(null);

    if (playerRef.current && playerRef.current.destroy) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  // Initialize video modal
  useEffect(() => {
    const initializeModal = () => {
      const modalElement = document.getElementById("videoModal");
      if (modalElement ) {
        const modal = new Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });
        return () => {
          if (modal) modal.dispose();
        };
      } else {
        console.log("Modal element not found"); // Debug: Modal initialization issue
      }
    };

    const timer = setTimeout(initializeModal, 100);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      clearInterval(updateIntervalRef.current);
      if (watchedTimeRef.current > 0 && currentModuleId) {
        updateProgress(currentModuleId, watchedTimeRef.current);
      }
      console.log("Component unmounted, cleanup performed"); // Debug: Cleanup
    };
  }, [currentModuleId]);

  // Render loading state
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading course...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // Render course not found
  if (!course) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      {/* Course Overview */}
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={course.image_url || defaultImage}
              alt={course.title}
              className="img-fluid m-3 rounded shadow"
              style={{ height: "180px", width: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-7 ms-3">
            <div className="card-body">
              <h5 className="card-title">{course.title}</h5>
              <p className="card-text">{course.description}</p>
              <p className="fw-bold">
                Course By:{" "}
                <Link
                  className="text-decoration-none"
                  to={`/teachers/${course.teacher}`}
                >
                  {course.teacher_name || course.teacher_username}
                </Link>
              </p>
              <p className="fw-bold">Duration: {course.duration || "N/A"}</p>
              <p className="fw-bold">
                Price: {course.price > 0 ? `${course.price} Tk` : "Free"}
              </p>
              <p className="fw-bold">Modules: {course.modules.length}</p>
              <p
                className={`fw-bold text-${
                  enrollStatus === "APPROVED" ? "success" : "warning"
                }`}
              >
                Enrollment Status: {enrollStatus || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modules Section */}
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between text-muted small">
          <p>Course Modules</p>
          {/* প্রোগ্রেস শতাংশ দেখানো */}
          
          <div className="progress" style={{ height: "20px" }}>
            {/* <p>Total: {totalProgress}%</p> */}
            <div
              className="progress-bar bg-success p-2 text-white"
              role="progressbar"
              style={{ width: `${totalProgress}%`}}
              aria-valuenow={totalProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              Total Progress: {totalProgress}%
            </div>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((mod, index) => (
              <li
                className="list-group-item d-flex align-items-center"
                key={index}
              >
                <span className="d-flex align-items-center">
                  {progress[mod.id]?.completed && (
                    <i
                      className="bi bi-check-circle-fill text-success me-2"
                      title="Module Completed"
                    ></i>
                  )}
                  {mod.title}
                </span>
                <span className="ms-auto">
                  <span className="me-5 text-muted">
                    {mod.duration || "N/A"}
                  </span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleVideoPlay(mod.video_url, mod.id)}
                    disabled={enrollStatus !== "APPROVED"}
                    title={
                      enrollStatus !== "APPROVED"
                        ? "Enrollment must be approved to view videos"
                        : ""
                    }
                  >
                    <i className="bi bi-youtube"></i>
                  </button>
                </span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No videos found</li>
          )}
        </ul>
      </div>

      {/* Video Modal */}
      <div
        className="modal fade"
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="videoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="videoModalLabel">
                Course Video
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleModalClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="ratio ratio-16x9">
                <div id="youtube-player"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrolledCourseDetail;
