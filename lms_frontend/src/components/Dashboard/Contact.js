import React, { useState, useEffect } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // your app uses Token scheme

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to access this page.");
      return;
    }

    // Fetch user info to pre-fill name and email
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const user = response.data;
        setFormData((prev) => ({
          ...prev,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        }));
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Unable to fetch user information.");
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/contact/",
        { name, email, message },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Your message has been sent successfully!");
        setFormData((prev) => ({ ...prev, message: "" }));
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please log in to send your message.");
      } else {
        setError("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h4 className="text-center mb-4">Contact Us</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!token ? (
          <div className="alert alert-warning text-center">
            Please log in to access the contact form.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly
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
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
