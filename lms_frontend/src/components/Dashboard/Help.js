import React from "react";

function Help() {
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">
          <i className="fas fa-info-circle me-2"></i>Help & Guide Center
        </h2>
        <p className="text-muted">
          Everything you need to know to get started and succeed with our LMS.
        </p>
      </div>

      <div className="row g-4">
        {/* How to Use the LMS Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow h-100 bg-light">
            <div className="card-body">
              <h4 className="text-success mb-3">
                <i className="fas fa-chalkboard-teacher me-2"></i>Using the LMS
              </h4>
              <ol className="ps-3">
                <li className="mb-2">
                  <i className="fas fa-user-plus text-primary me-2"></i>
                  <strong>Register/Login:</strong> Sign up or log in with your
                  credentials.
                </li>
                <li className="mb-2">
                  <i className="fas fa-user-edit text-secondary me-2"></i>
                  <strong>Update Profile:</strong> Add your personal and
                  educational info.
                </li>
                <li className="mb-2">
                  <i className="fas fa-search text-info me-2"></i>
                  <strong>Browse Courses:</strong> Discover available learning
                  resources.
                </li>
                <li className="mb-2">
                  <i className="fas fa-sign-in-alt text-success me-2"></i>
                  <strong>Enroll:</strong> Join the course of your choice
                  instantly.
                </li>
                <li className="mb-2">
                  <i className="fas fa-play-circle text-danger me-2"></i>
                  <strong>Start Learning:</strong> Watch videos, read, and
                  complete tasks.
                </li>
                <li className="mb-2">
                  <i className="fas fa-chart-line text-warning me-2"></i>
                  <strong>Track Progress:</strong> View lessons completed on
                  your dashboard.
                </li>
                <li>
                  <i className="fas fa-headset text-dark me-2"></i>
                  <strong>Need Help?</strong> Go to Contact page to connect with
                  us.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Certificate Instructions Card */}
        <div className="col-md-6">
          <div className="card border-0 shadow h-100 bg-light">
            <div className="card-body">
              <h4 className="text-warning mb-3">
                <i className="fas fa-award me-2"></i>Get Your Certificate
              </h4>
              <ul className="ps-3">
                <li className="mb-2">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Complete all lessons and activities in your course.
                </li>
                <li className="mb-2">
                  <i className="fas fa-percentage text-primary me-2"></i>
                  Score at least 60% in quizzes and tests.
                </li>
                <li className="mb-2">
                  <i className="fas fa-upload text-secondary me-2"></i>
                  Submit the final assignment if applicable.
                </li>
                <li className="mb-2">
                  <i className="fas fa-trophy text-warning me-2"></i>
                  Once passed, download your certificate from the course
                  dashboard.
                </li>
                <li>
                  <i className="fas fa-file-pdf text-danger me-2"></i>
                  Click <strong>Download Certificate</strong> to get your PDF.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Info */}
      <div className="alert alert-info text-center mt-5 shadow-sm">
        <i className="fas fa-envelope-open-text me-2"></i>
        Still have questions? Reach out via the <strong>Contact</strong> page.
        We’re here to help!
      </div>
    </div>
  );
}

export default Help;
