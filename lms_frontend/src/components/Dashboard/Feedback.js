import React, { useState } from "react";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, rating, message } = formData;

    if (!name || !email || !rating || !message) {
      setError("Please fill out all fields.");
      return;
    }

    // TODO: Send feedback to backend
    console.log("Feedback submitted:", formData);

    setSuccess("Thank you for your feedback!");
    setFormData({
      name: "",
      email: "",
      rating: "",
      message: "",
    });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h4 className="mb-4 text-center">We Value Your Feedback</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rating</label>
            <select
              className="form-select"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="">Select rating</option>
              <option value="5">Excellent (5)</option>
              <option value="4">Very Good (4)</option>
              <option value="3">Good (3)</option>
              <option value="2">Fair (2)</option>
              <option value="1">Poor (1)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your feedback here..."
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
