import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "bootstrap/js/dist/modal";

const baseUrl = "http://127.0.0.1:8000/api";

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


function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [latestCourses, setLatestCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [modalInstance, setModalInstance] = useState(null);
  // const [videoUrl, setVideoUrl] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [enrollStatus, setEnrollStatus] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false); // New: Track enrollment loading state

  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${baseUrl}/users/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

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
    return () => delete window.onYouTubeIframeAPIReady;
  }, []);

 

    
  // Set document title and fetch data on mount (UNCHANGED)
  useEffect(() => {
    document.title = `Course Detail - ${id} - LWR`;
    fetchCourse();
    fetchRelatedCourses();
  }, [id]);

  // Initialize video modal (UNCHANGED)
  useEffect(() => {
    const modalElement = document.getElementById("videoModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      return () => modal.dispose();
    }
  }, []);

 

  // Handle enrollment submission
  const handleEnrollSubmit = async (e) => {
    e && e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (course.price > 0) {
      // পেইড কোর্সের জন্য handlePayment কল করুন
      handlePayment();
      return;
    }

    setEnrollLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/enroll/`,
        { course_id: course.id },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      alert(res.data.detail || "Enrollment successful!");
      setEnrollStatus("approved");
    } catch (err) {
      console.error("Enrollment error:", err.response || err);
      const errorMessage =
        err.response?.data?.detail || "Enrollment failed. Please try again.";
      alert(errorMessage);
    } finally {
      setEnrollLoading(false);
    }
  };

  // Fetch course details (UNCHANGED)
  const fetchCourse = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${baseUrl}/courses/${id}/`);
      setCourse(response.data);
    } catch (err) {
      console.error("Failed to fetch course", err);
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCourses = async () => {
    try {
      const response = await axios.get(`${baseUrl}/courses/${id}/related/`);
      setLatestCourses(response.data); // still using latestCourses state for now
    } catch (err) {
      console.error("Failed to fetch related courses", err);
    }
  };

  
  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      console.log("Sending payment data:", {
        course_id: course?.id,
        course_title: course?.title,
        amount: course?.price,
        cus_name: user.full_name,
        cus_email: user.email,
        cus_phone: user.phone,
        cus_add1: user.address,
        cus_city: user.city,
        cus_postcode: user.postcode,
        cus_country: user.country,
      });

      const res = await axios.post(
        `${baseUrl}/payment/init/`,
        {
          course_id: course.id,
          course_title: course.title,
          amount: course.price,
          cus_name: user.full_name,
          cus_email: user.email,
          cus_phone: user.phone,
          cus_add1: user.address,
          cus_city: user.city,
          cus_postcode: user.postcode,
          cus_country: user.country,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log("Payment response:", res.data);

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert("❌ Payment failed to initialize.");
      }
    } catch (err) {
      console.error("Payment init error:", err);
      alert("❌ Something went wrong while initializing payment.");
    }
  };
  




  // Fetch latest courses (UNCHANGED)
  // const fetchLatestCourses = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/courses/latest/`);
  //     setLatestCourses(response.data);
  //   } catch (err) {
  //     console.error("Failed to fetch latest courses", err);
  //   }
  // };


  // Fetch enrollment status (UNCHANGED)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !course) return;

    axios
      .get(`${baseUrl}/enroll-status/${course.id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setEnrollStatus(res.data.status))
      .catch((err) => console.error("Status error:", err));
  }, [course]);

  const handlePreviewClick = () => {
    const embedUrl = toEmbedUrl(course.intro_url);
    if (!embedUrl) return alert("No Preview available for this course");
    const playerDiv = document.getElementById("youtube-player");
    if (playerDiv) {
      playerDiv.innerHTML = `<iframe width="100%" height="100%" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    const modalElement = document.getElementById("videoModal");
    if (modalElement) {
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  const handleModalClose = () => {
    const playerDiv = document.getElementById("youtube-player");
    if (playerDiv) playerDiv.innerHTML = "";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Course not found</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Course Overview (UNCHANGED except for price display) */}
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={course.image_url || defaultImage}
              alt={course.title}
              className="img-fluid m-3 rounded shadow"
              style={{ height: "300px", width: "100%", objectFit: "cover" }}
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
              <p className="fw-bold">
                Category: {course.category_name || "N/A"}
              </p>
              <p className="fw-bold">Duration: {course.duration || "N/A"}</p>
              <p className="fw-bold">
                Number Of Modules: {course.modules.length || "N/A"}
              </p>
              <p className="fw-bold">
                Total Enrolled: {course.total_enrolled || 0}
              </p>

              <p className="fw-bold">
                Price: {course.price > 0 ? `${course.price} Tk` : "Free"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Now Button */}
      <div className="text-center my-4">
        <div className="d-flex justify-content-center gap-3">
          {enrollStatus === "approved" ? (
            <button className="btn btn-secondary" disabled>
              Already Enrolled
            </button>
          ) : enrollStatus === "pending" ? (
            <button className="btn btn-warning" disabled>
              Pending Approval
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={course.price > 0 ? handlePayment : handleEnrollSubmit}
              disabled={enrollLoading}
            >
              {enrollLoading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : null}
              Enroll Now
            </button>
          )}
          <button
            className="btn btn-outline-primary"
            onClick={handlePreviewClick}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Enroll Modal (UNCHANGED except for loading state) */}
      {course.price > 0 && (
        <div
          className="modal fade"
          id="enrollModal"
          tabIndex="-1"
          aria-labelledby="enrollModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="enrollModalLabel">
                  Enroll in Course
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  To complete your enrollment, please send the enrollment fee(
                  <strong>{course.price} Tk</strong>) via <strong>bKash</strong>{" "}
                  or <strong>Nagad</strong> to <strong>01767457345</strong>.
                  After sending the payment, enter the{" "}
                  <strong>transaction ID</strong> and submit the form.
                  <p>
                    <strong>Note:</strong> Your enrollment will not be approved
                    without a valid payment confirmation.
                  </p>
                </p>
                <form onSubmit={handleEnrollSubmit}>
                  <div className="mb-3">
                    <label htmlFor="transactionNumber" className="form-label">
                      Enter Transaction ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="transactionNumber"
                      placeholder="ABC123DEF4"
                      value={transactionNumber}
                      onChange={(e) => setTransactionNumber(e.target.value)}
                      required
                      disabled={enrollLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={enrollLoading}
                  >
                    {enrollLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Submit Enrollment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Modules Section (UNCHANGED) */}
      <div className="card mt-4">
        <div className="card-header">Course Videos</div>
        <ul className="list-group list-group-flush">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((mod, index) => (
              <li className="list-group-item" key={index}>
                {mod.title}
                <span className="float-end">
                  <span className="me-5 text-muted">
                    {mod.duration || "N/A"}
                  </span>
                  <button
                    className="btn btn-sm btn-danger"
                    // onClick={() => handleVideoPlay(mod.video_url)}
                    disabled={enrollStatus !== "approved"}
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

      {/* Related Courses Section (UNCHANGED) */}
      <h3 className="pb-1 mb-4 mt-5">
        Related Courses
        <Link
          className="float-end text-decoration-none"
          style={{ fontSize: "20px" }}
          to="/courses"
        >
          See all
        </Link>
      </h3>
      <div className="row">
        {latestCourses.map((latestCourse) => (
          <div key={latestCourse.id} className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              <div
                className="card-body"
                onClick={() => navigate(`/courses/${latestCourse.id}`)}
              >
                <img
                  src={latestCourse.image_url || defaultImage}
                  alt={latestCourse.title}
                  className="img-fluid mb-3 rounded shadow"
                  style={{
                    height: "150px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <h5 className="card-title">
                  {latestCourse.title.length > 30
                    ? `${latestCourse.title.substring(0, 30)}...`
                    : latestCourse.title}
                </h5>
                <div className="d-flex justify-content-between text-muted small">
                  <p className="card-text mb-0">
                    <i className="fas fa-tag me-1"></i>
                    {latestCourse.category_name}
                  </p>
                  <p className="card-text mb-0">
                    Modules: {latestCourse.modules.length}
                  </p>
                </div>

                <p className="card-text">
                  {latestCourse.description.length > 30
                    ? `${latestCourse.description.substring(0, 30)}...`
                    : latestCourse.description}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    {latestCourse.price > 0
                      ? `${latestCourse.price} Tk`
                      : "Free"}
                  </h5>
                  <span className="text-muted small">
                    Enrolled: {latestCourse.total_enrolled || 0}
                  </span>
                </div>
              </div>
              <div className="card-footer bg-transparent">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-user me-1"></i>
                    {latestCourse.teacher_name || latestCourse.teacher_username}
                  </small>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/courses/${latestCourse.id}`)}
                  >
                    <i className="fas fa-eye me-1"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
              <h5 className="modal-title">Course Video</h5>
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

export default CourseDetail;
