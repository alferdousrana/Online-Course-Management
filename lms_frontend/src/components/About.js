import React from "react";

const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function About() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">About Learn with Rana</h1>

      <section className="mb-5">
        <p>
          Welcome to <strong>Learn with Rana</strong>, your trusted platform for
          online learning. We provide a wide variety of online courses in
          technology, business, personal development, and more — all accessible
          from anywhere in the world.
        </p>
      </section>

      <section className="text-center mb-4">
        <h3 className="section-heading"> Our Services</h3>
        <div className="row text-center g-4">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <i className="fas fa-code fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold">Technical Courses</h5>
              <p className="text-muted">
                Learn Web Development, Python, JavaScript, and more with
                practical projects.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <i className="fas fa-users fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold">Soft Skills</h5>
              <p className="text-muted">
                Build communication, leadership, and productivity skills for
                career growth.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <i className="fas fa-file-alt fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold">Career Prep</h5>
              <p className="text-muted">
                Resume building, interview prep, and job search strategies for
                success.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <i className="fas fa-laptop-code fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold">Self-Paced Courses</h5>
              <p className="text-muted">
                Learn at your own speed with 24/7 access to course materials and
                support.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <i className="fas fa-chalkboard-teacher fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold">Instructor-Led Training</h5>
              <p className="text-muted">
                Live classes with industry experts to guide your learning
                journey.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm h-100">
              <i className="fas fa-briefcase fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold">Job Support</h5>
              <p className="text-muted">
                We help you connect with recruiters and land your dream role.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center mt-5">
        <h3 className="text-center section-heading">
            Our Mission, Vision & Values
          </h3>
          <div className="row text-center">
          {/* Mission */}
          <div className="col-md-4 mb-4">
            <div className="p-4 rounded h-100">
              <i className="fas fa-bullseye fa-2x text-primary mb-3"></i>
              <h5 className="fw-bold text-uppercase text-primary">
                Our Mission
              </h5>
              <p className="text-muted">
                To empower individuals through affordable and high-quality
                education that helps them build skills for today and tomorrow.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="col-md-4 mb-4">
            <div className="p-4  h-100">
              <i className="fas fa-rocket fa-2x text-success mb-3"></i>
              <h5 className="fw-bold text-uppercase text-success">
                Our Vision
              </h5>
              <p className="text-muted">
                To become the most inclusive and impactful e-learning platform
                across South Asia, fostering a culture of continuous growth and
                development.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="col-md-4 mb-4">
            <div className="p-4 h-100">
              <i className="fas fa-hand-holding-heart fa-2x text-info mb-3"></i>
              <h5 className="fw-bold text-uppercase text-info">Our Values</h5>
              <p className="text-muted">
                Integrity, inclusiveness, and impact – we prioritize lifelong
                learning and building a better future for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center mb-4">
        <h3 className="section-heading">In Our Platform</h3>
        <div className="row text-center">
          {/* Courses */}
          <div className="col-md-3 mb-4">
            <i className="fas fa-book-open fa-3x text-primary mb-2"></i>
            <h2 className="fw-bold">200+</h2>
            <p className="text-muted">Courses</p>
          </div>

          {/* Learners */}
          <div className="col-md-3 mb-4">
            <i className="fas fa-users fa-3x text-success mb-2"></i>
            <h2 className="fw-bold">2000+</h2>
            <p className="text-muted">Learners</p>
          </div>

          {/* Instructors */}
          <div className="col-md-3 mb-4">
            <i className="fas fa-chalkboard-teacher fa-3x text-warning mb-2"></i>
            <h2 className="fw-bold">30+</h2>
            <p className="text-muted">Instructors</p>
          </div>

          {/* Content Hours */}
          <div className="col-md-3 mb-4">
            <i className="fas fa-clock fa-3x text-danger mb-2"></i>
            <h2 className="fw-bold">1000+</h2>
            <p className="text-muted">Hours of Content</p>
          </div>
        </div>
      </section>

      <section className="text-center mb-4">
        <h3 className="section-heading">Our Team</h3>
        <div className="row">
          <div className="col-md-3 text-center">
            <img
              src="https://scontent.fdac31-1.fna.fbcdn.net/v/t39.30808-6/479930971_3947778308800449_298605210561270279_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=JhffjrXl30YQ7kNvwHWUvX2&_nc_oc=Adl6ZBRDA8N0BbnW7y51bjo__8ul1W9-X25ruJsHakUSKmIgq7vWNOZtwono_-SnkmI&_nc_zt=23&_nc_ht=scontent.fdac31-1.fna&_nc_gid=h0OJFlqjF_paIyXqWweoGg&oh=00_AfOPcebCLFjwdxHcgfLK5vGu3Q38R9L1ovCan7b859x5uQ&oe=685A3AD6"
              alt="Rana"
              className="img-fluid rounded-circle mb-2"
              style={{ height: "200px", width: "200px", objectFit: "cover" }}
            />
            <h5>Al Ferdous Rana</h5>
            <p>
              Full Stuck Web Developer <br /> Founder and CEO, Learn with Rana
            </p>
            <a
              href="https://www.linkedin.com/in/alferdousrana/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin me-1"></i>
            </a>
            <a
              href="https://www.facebook.com/alferdous.rana"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-square-facebook me-1"></i>
            </a>
          </div>

          <div className="col-md-3 text-center">
            <img
              src={defaultImage}
              alt="Rana"
              className="img-fluid rounded-circle mb-2"
              style={{ height: "200px", width: "200px", objectFit: "cover" }}
            />
            <h5>TBA</h5>
            <p>
              Digital Marketing and SEO Expert <br /> CMO, Learn with Rana
            </p>
            <a
              href="https://www.linkedin.com/in/alferdousrana/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin me-1"></i>
            </a>
            <a
              href="https://www.facebook.com/alferdous.rana"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-square-facebook me-1"></i>
            </a>
          </div>
          <div className="col-md-3 text-center">
            <img
              src={defaultImage}
              alt="Rana"
              className="img-fluid rounded-circle mb-2"
              style={{ height: "200px", width: "200px", objectFit: "cover" }}
            />
            <h5>TBA</h5>
            <p>
              Finance and Accounting Expert <br /> CFO, Learn with Rana
            </p>
            <a
              href="https://www.linkedin.com/in/alferdousrana/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin me-1"></i>
            </a>
            <a
              href="https://www.facebook.com/alferdous.rana"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-square-facebook me-1"></i>
            </a>
          </div>
          <div className="col-md-3 text-center">
            <img
              src={defaultImage}
              alt="Rana"
              className="img-fluid rounded-circle mb-2"
              style={{ height: "200px", width: "200px", objectFit: "cover" }}
            />
            <h5>TBA</h5>
            <p>
              HR and Recruitment Expert <br /> COO, Learn with Rana
            </p>
            <a
              href="https://www.linkedin.com/in/alferdousrana/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin me-1"></i>
            </a>
            <a
              href="https://www.facebook.com/alferdous.rana"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-square-facebook me-1"></i>
            </a>
          </div>
        </div>
      </section>

      <section className="text-center mb-4">
        <h3 className="section-heading">Our Office</h3>
        <p>
          Learn with Rana
          <br />
          123 Knowledge Street, Dhaka 1207, Bangladesh
        </p>
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902634869848!2d90.38990171536346!3d23.750803594960105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b88c078aaaab%3A0xd2d1d74ef1d5d87f!2sDhaka!5e0!3m2!1sen!2sbd!4v1629097659927!5m2!1sen!2sbd"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default About;
