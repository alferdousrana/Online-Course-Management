import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function TeacherDetail() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();
  document.title = `Teacher Detail - ${id} - LWR`;

  useEffect(() => {
    // Fetch teacher info
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${baseUrl}/teachers/${id}/`);
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher detail:", error);
      }
    };

    // Fetch teacher courses
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${baseUrl}/teachers/${id}/courses/`);
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchTeacher();
    fetchCourses();
  }, [id]);

  if (!teacher) {
    return <div className="container mt-5">Loading teacher details...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={teacher.image_url || defaultImage}
              className="img-fluid rounded-start"
              alt="teacher"
              style={{height: "400px", width: "100%", objectFit: "cover"}}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h4 className="card-title">{teacher.full_name}</h4>
              <p className="card-text">{teacher.bio || "No bio available"}</p>
              <p className="fw-bold">
                Qualification:{" "}
                <span className="text-muted">
                  {teacher.qualification || "Not specified"}
                </span>
              </p>
              <p className="fw-bold">
                Skills:{" "}
                <span className="text-muted">
                  {teacher.skills || "Not specified"}
                </span>
              </p>
              <p className="fw-bold">
                Total Courses:{" "}
                <span className="text-muted">{teacher.total_courses || 0}</span>
              </p>
              <p className="fw-bold">
                Total Students:{" "}
                <span className="text-muted">
                  {teacher.total_students || 0}
                </span>
              </p>
              {/* <p className="fw-bold">
                Rating:{" "}
                <span className="text-muted">{teacher.rating || 0} / 5</span>
              </p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher's Courses */}
      <h3 className="pb-1 mb-4 mt-5">
        Courses by {teacher.full_name}
        {/* {courses.length > 3 && (
          <a className="float-end text-decoration-none" href="#">
            See all
          </a>
        )} */}
      </h3>

      <div className="row">
        {courses.length === 0 && <p>No courses found.</p>}

        {courses.map((course) => (
          <div key={course.id} className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              <div
                className="card-body"
                onClick={() => navigate(`/courses/${course.id}`)}
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
  );
}

export default TeacherDetail;
