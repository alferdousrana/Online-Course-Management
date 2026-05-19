import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  render() {
    // Get current year for copyright
    const currentYear = new Date().getFullYear();

    return (
      <footer
        className="bg-dark text-white py-5 mt-5"
        style={{
          borderTop: "1px solid #444",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div className="container">
          {/* Back to Top Button */}
          <div className="float-end mb-3" style={{ cursor: "pointer" }}>
            <a href="#top" className="text-decoration-none">
              <img
                src="/back_to_top.png"
                alt="Back to Top"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.3)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
            </a>
          </div>

          <div className="row">
            {/* Company Info */}
            <div className="col-md-4 mb-4">
              <img src="/logo512.png" alt="logo" style={{ width: "100px" }} />
              <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                Learn with Rana
              </h5>
              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                Empowering education through innovative online courses. Join us
                to learn, grow, and succeed!
              </p>
            </div>

            {/* Navigation Links */}
            <div className="col-md-4 mb-4">
              <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                Quick Links
              </h5>
              <ul className="list-unstyled" style={{ fontSize: "0.9rem" }}>
                <li className="mb-2">
                  <Link
                    to="/"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                    onMouseOver={(e) => (e.target.style.opacity = 1)}
                    onMouseOut={(e) => (e.target.style.opacity = 0.8)}
                  >
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/courses"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                    onMouseOver={(e) => (e.target.style.opacity = 1)}
                    onMouseOut={(e) => (e.target.style.opacity = 0.8)}
                  >
                    Courses
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/teachers"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                    onMouseOver={(e) => (e.target.style.opacity = 1)}
                    onMouseOut={(e) => (e.target.style.opacity = 0.8)}
                  >
                    Teachers
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/about"
                    className="text-white text-decoration-none"
                    style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                    onMouseOver={(e) => (e.target.style.opacity = 1)}
                    onMouseOut={(e) => (e.target.style.opacity = 0.8)}
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Icons */}
            <div className="col-md-4 mb-4">
              <h5 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                Follow Us
              </h5>
              <div className="d-flex">
                <a
                  href="https://www.facebook.com/alferdous.rana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white me-3"
                  style={{ fontSize: "1.5rem", transition: "color 0.3s ease" }}
                  onMouseOver={(e) => (e.target.style.color = "#3b5998")}
                  onMouseOut={(e) => (e.target.style.color = "#fff")}
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://x.com/alferdous10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white me-3"
                  style={{ fontSize: "1.5rem", transition: "color 0.3s ease" }}
                  onMouseOver={(e) => (e.target.style.color = "#1da1f2")}
                  onMouseOut={(e) => (e.target.style.color = "#fff")}
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/al-ferdous-rana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white me-3"
                  style={{ fontSize: "1.5rem", transition: "color 0.3s ease" }}
                  onMouseOver={(e) => (e.target.style.color = "#0077b5")}
                  onMouseOut={(e) => (e.target.style.color = "#fff")}
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href="https://www.youtube.com/@rcoding1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  style={{ fontSize: "1.5rem", transition: "color 0.3s ease" }}
                  onMouseOver={(e) => (e.target.style.color = "#ff0000")}
                  onMouseOut={(e) => (e.target.style.color = "#fff")}
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div
            className="text-center mt-4 pt-3 border-top"
            style={{
              borderColor: "#444 !important",
              fontSize: "0.85rem",
              opacity: 0.7,
            }}
          >
            <p className="mb-0">
              &copy; {currentYear} Learn with Rana. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }
}
