import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";
const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function Home() {
  const [latestCourses, setLatestCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [popularTeachers, setPopularTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroImages, setHeroImages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Home - LWR`;
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [latestRes, freeRes, teacherRes, heroRes] = await Promise.all([
        axios.get(`${baseUrl}/courses/latest/`),
        axios.get(`${baseUrl}/courses/free/`),
        axios.get(`${baseUrl}/teachers/popular/`),
        axios.get(`${baseUrl}/hero-image/`),
      ]);
      setLatestCourses(latestRes.data);
      setFreeCourses(freeRes.data);
      setPopularTeachers(teacherRes.data);
      setHeroImages(heroRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch home data", err);
      setError("Something went wrong while loading homepage data.");
      setLoading(false);
    }
  };
  useEffect(() => {
    axios
      .get(`${baseUrl}/testimonials/`)
      .then((response) => {
        setTestimonials(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load testimonials");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const carouselElement = document.getElementById(
      "carouselExampleIndicators"
    );
    if (carouselElement && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 5000, // Auto-slide every 5 seconds
        wrap: true, // Loop back to first slide
      });
      return () => {
        carousel.dispose(); // Clean up on unmount
      };
    }
  }, [testimonials]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading data...</p>
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

  return (
    <>
      <div className="w-100 mt-2">
        {/* --- Hero carousel banner --- */}
        {heroImages.length > 0 && (
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            <div className="carousel-indicators">
              {heroImages.map((_, index) => (
                <button
                  style={{ backgroundColor: "rgba(24, 173, 163, 0.68)" }}
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : undefined}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            <div className="carousel-inner">
              {heroImages.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={item.image_url || defaultImage}
                    className="d-block w-100"
                    alt={item.title || `Slide ${index + 1}`}
                    onClick={() => navigate("/courses/")}
                  />
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                left: "20px",
              }}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                right: "20px",
              }}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        )}
      </div>

      <div className="container mt-5">
        {/* --- Free Courses Carousel --- */}
        <h3 className="pb-1 mb-4 mt-5">
          Free Courses
          <Link
            className="float-end text-decoration-none"
            style={{ fontSize: "20px" }}
            to="/courses/"
          >
            See all
          </Link>
        </h3>

        <div
          id="freeCoursesCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-inner">
            {Array.from({ length: Math.ceil(freeCourses.length / 4) }).map(
              (_, idx) => (
                <div
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                  key={idx}
                >
                  <div className="row">
                    {freeCourses.slice(idx * 4, idx * 4 + 4).map((course) => (
                      <div key={course.id} className="col-md-3">
                        <div className="card h-100 shadow-sm mx-1">
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
                                {course.price > 0
                                  ? `${course.price} Tk`
                                  : "Free"}
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
                                onClick={() =>
                                  navigate(`/courses/${course.id}`)
                                }
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
              )
            )}
          </div>

          {/* Carousel Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#freeCoursesCarousel"
            data-bs-slide="prev"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{
                backgroundColor: "#333",
                width: "20px",
                height: "20px",
                borderRadius: "2px",
              }}
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#freeCoursesCarousel"
            data-bs-slide="next"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{
                backgroundColor: "#333",
                width: "20px",
                height: "20px",
                borderRadius: "2px",
              }}
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* --- Latest Courses --- */}
        <h3 className="pb-1 mb-4 mt-5">
          Latest Courses
          <Link
            className="float-end text-decoration-none"
            style={{ fontSize: "20px" }}
            to="/courses"
          >
            See all
          </Link>
        </h3>
        <div className="row">
          {latestCourses.map((course) => (
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

        {/* --- Popular Teachers --- */}
        <h3 className="pb-1 mb-4 mt-5">
          Popular Instructors
          <Link
            className="float-end text-decoration-none"
            style={{ fontSize: "20px" }}
            to="/teachers"
          >
            See all
          </Link>
        </h3>
        <div className="row">
          {popularTeachers.map((teacher) => (
            <div key={teacher.id} className="col-md-3 mb-4">
              <div className="card rounded mb-4 p-2 shadow-sm">
                <Link to={`/teachers/${teacher.id}`}>
                  <img
                    src={teacher.image_url || defaultImage}
                    className="card-img-top rounded shadow"
                    alt="Teacher"
                    style={{
                      height: "280px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
                <div className="card-body">
                  <Link
                    to={`/teachers/${teacher.id}`}
                    className="custom-link mb-3"
                  >
                    <h5 className="card-title text-center ">
                      {teacher.full_name}
                    </h5>
                  </Link>
                  <p className="text-center">
                    {teacher.qualification.length > 25
                      ? `${teacher.qualification.substring(0, 25)}...`
                      : teacher.qualification}
                  </p>
                  <p className="text-muted small text-center">
                    {teacher.total_courses} course
                    {teacher.total_courses > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3
          className="pb-1 mb-4 mt-5 text-decoration-none"
          style={{
            fontWeight: "bold",
            color: "#343a40",
            textAlign: "center",
          }}
        >
          Student Testimonials
        </h3>
        <div
          id="carouselExampleIndicators"
          className="carousel slide bg-dark text-white py-5"
          data-bs-ride="carousel"
          style={{
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="carousel-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
                style={{
                  backgroundColor:
                    index === 0 ? "#fff" : "rgba(255, 255, 255, 0.5)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  margin: "0 5px",
                }}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <figure
                  className="text-center"
                  style={{
                    padding: "20px",
                    maxWidth: "800px",
                    margin: "0 auto",
                  }}
                >
                  <blockquote
                    className="blockquote"
                    style={{
                      fontSize: "1.2rem",
                      fontStyle: "italic",
                      marginBottom: "1rem",
                    }}
                  >
                    <p>{testimonial.quote}</p>
                  </blockquote>
                  <figcaption
                    className="blockquote-footer"
                    style={{
                      color: "#adb5bd",
                      fontSize: "0.9rem",
                    }}
                  >
                    {testimonial.author} in{" "}
                    <cite title={testimonial.source_title}>
                      {testimonial.source_title}
                    </cite>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
