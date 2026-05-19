import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:8000/api";

const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // নতুন স্টেট: প্রতিটি কোর্সের প্রোগ্রেস শতাংশ সংরক্ষণ করতে
  const [progressMap, setProgressMap] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Set document title
  useEffect(() => {
    document.title = "My Courses - LWR";
  }, []);

  // Fetch profile, courses, and progress based on user role
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get(`${baseUrl}/users/profile/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setProfileData(profileRes.data);

        // Fetch courses based on role
        let courseData = [];
        if (profileRes.data.role === "TEACHER") {
          const teacherRes = await axios.get(
            `${baseUrl}/teachers/my-courses/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          courseData = teacherRes.data; // Array of courses: [{ id, title, modules, ... }, ...]
        } else if (profileRes.data.role === "STUDENT") {
          const studentRes = await axios.get(
            `${baseUrl}/students/my-courses/`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          courseData = studentRes.data; // Array of enrollments: [{ course: { id, title, modules, ... }, status, ... }, ...]
        }
        setCourses(courseData);

        // Fetch module progress for students only
        if (profileRes.data.role === "STUDENT") {
          const progressRes = await axios.get(`${baseUrl}/module-progress/`, {
            headers: { Authorization: `Token ${token}` },
          });
          // প্রোগ্রেস ডেটা থেকে কোর্স আইডি দিয়ে ম্যাপ তৈরি করা
          const courseProgress = {};
          courseData.forEach((item) => {
            const courseId = item.course.id;
            const modules = item.course.modules || [];
            const totalModules = modules.length;
            if (totalModules === 0) {
              courseProgress[courseId] = 0;
              return;
            }
            const completedModules = modules.filter((mod) =>
              progressRes.data.find((p) => p.module === mod.id && p.completed)
            ).length;
            courseProgress[courseId] = Math.round(
              (completedModules / totalModules) * 100
            );
          });
          setProgressMap(courseProgress);
        }
      } catch (err) {
        console.error("Error loading profile, courses, or progress:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        const res = await axios.get(`${baseUrl}/recommended-courses/`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setRecommendedCourses(res.data);
      } catch (err) {
        console.error("Failed to load recommended courses", err);
      }
    };

    if (profileData?.role === "STUDENT") {
      fetchRecommendedCourses();
    }
  }, [profileData]);

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.success) {
      alert(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle course deletion for teachers
  const onDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${baseUrl}/courses/${courseId}/delete/`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setCourses(courses.filter((item) => item.id !== courseId));
        setProgressMap((prev) => {
          const newMap = { ...prev };
          delete newMap[courseId];
          return newMap;
        });
        alert("Course deleted successfully.");
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  // Handle enrollment deletion for students
  const onDeleteEnrollment = async (enrollmentId, courseId) => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      try {
        await axios.delete(`${baseUrl}/enrollments/${enrollmentId}/delete/`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setCourses(courses.filter((item) => item.course.id !== courseId));
        setProgressMap((prev) => {
          const newMap = { ...prev };
          delete newMap[courseId];
          return newMap;
        });
        alert("Enrollment deleted successfully.");
      } catch (err) {
        console.error("Error deleting enrollment:", err);
        alert("Failed to delete enrollment. Please try again.");
      }
    }
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const enrolled = params.get("enrolled");

    if (enrolled === "1") {
      toast.success("✅ Enrollment successful!");
    } else if (enrolled === "0") {
      toast.info("ℹ️ You are already enrolled in this course.");
    }
  }, [location.search]);



  // Render loading state
  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading courses...</p>
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

  // Render no profile state
  if (!profileData) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Unable to load profile data.</div>
      </div>
    );
  }

  return (
    <>
      {/* Container 1: My Courses */}
      <div className="container mt-4 mb-3">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="fw-bold h4">My Courses</span>
          {profileData.role === "TEACHER" && (
            <Link
              to="/dashboard/create-course"
              className="btn btn-sm btn-primary"
            >
              + Create Course
            </Link>
          )}
        </div>

        <div className="row">
          {courses.length === 0 && (
            <p className="text-muted">
              {profileData.role === "TEACHER"
                ? "You haven't created any courses yet."
                : "You haven't enrolled in any courses yet."}
            </p>
          )}

          {courses.map((item) => {
            const course = profileData.role === "TEACHER" ? item : item.course;
            const status = profileData.role === "STUDENT" ? item.status : null;
            const enrollmentId =
              profileData.role === "STUDENT" ? item.id : null;

            return (
              <div className="col-md-4 mb-4" key={course.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={course.image_url || defaultImage}
                    alt={course.title}
                    className="card-img-top rounded"
                    style={{ height: "180px", objectFit: "cover" }}
                    onClick={() =>
                      navigate(`/dashboard/enrolled-course/${course.id}`)
                    }
                  />
                  <div
                    className="card-body"
                    onClick={() =>
                      navigate(`/dashboard/enrolled-course/${course.id}`)
                    }
                  >
                    <h5 className="card-title">
                      {course.title.length > 40
                        ? `${course.title.substring(0, 40)}...`
                        : course.title}
                    </h5>

                    {profileData.role === "STUDENT" && (
                      <>
                        <p
                          className={`text-${
                            status === "APPROVED" ? "success" : "warning"
                          }`}
                        >
                          Status: {status || "Unknown"}
                        </p>
                        <div className="progress" style={{ height: "10px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${progressMap[course.id] || 0}%` }}
                            aria-valuenow={progressMap[course.id] || 0}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <p className="text-muted small">
                          Progress: {progressMap[course.id] || 0}%
                        </p>
                      </>
                    )}

                    {profileData.role === "TEACHER" && (
                      <p className="text-muted small">
                        Enrolled: {course.total_enrolled || 0}
                      </p>
                    )}
                  </div>

                  {profileData.role === "TEACHER" && (
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDeleteCourse(course.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            navigate(`/dashboard/update-course/${course.id}`)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}

                  {profileData.role === "STUDENT" && (
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            onDeleteEnrollment(enrollmentId, course.id)
                          }
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            navigate(`/dashboard/enrolled-course/${course.id}`)
                          }
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <hr />
      </div>

      {/* Container 2: Recommended Courses */}
      {profileData.role === "STUDENT" && recommendedCourses.length > 0 && (
        <div className="container mt-2 mb-5">
          <h4 className="fw-bold mb-4">Recommended For You</h4>
          <div className="row">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="col-12 col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div
                    className="card-body"
                    onClick={() => navigate(`/courses/${course.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={course.image_url || defaultImage}
                      alt={course.title}
                      className="img-fluid mb-3 rounded shadow"
                      style={{
                        height: "150px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <h5 className="card-title">
                      {course.title.length > 30
                        ? `${course.title.substring(0, 30)}...`
                        : course.title}
                    </h5>
                    <div className="d-flex justify-content-between text-muted small">
                      <p className="card-text mb-0">
                        <i className="fas fa-tag me-1"></i>
                        {course.category_name}
                      </p>
                      <p className="card-text mb-0">
                        Modules: {course.modules.length}
                      </p>
                    </div>
                    <p className="card-text">
                      {course.description.length > 30
                        ? `${course.description.substring(0, 30)}...`
                        : course.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">
                        {course.price > 0 ? `${course.price} Tk` : "Free"}
                      </h5>
                      <span className="text-muted small">
                        Enrolled: {course.total_enrolled || 0}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        {course.teacher_name || course.teacher_username}
                      </small>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
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
        </div>
      )}
    </>
  );
  
}

export default MyCourses;
