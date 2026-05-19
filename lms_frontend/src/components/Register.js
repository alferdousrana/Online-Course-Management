import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000/api/users/";
function Register() {
  useEffect(() => {
    document.title = "Register - LWR";
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  
    try {
      // Step 1: Register the user
      const registerResponse = await axios.post(baseUrl, {
        ...formData,
        role: "STUDENT"
      });
      console.log("Registration successful:", registerResponse.data);
  
      // Step 2: Log in the user
      const loginResponse = await axios.post('http://127.0.0.1:8000/api-token-auth/', {
        username: formData.username,
        password: formData.password
      });
  
      const token = loginResponse.data.token;
      localStorage.setItem("token", token); // Save the token
  
      // Optional: Redirect or update UI
      console.log("Login successful, token saved.");
      alert("Registration and login successful!");
      navigate('/dashboard'); // if you're using React Router
  
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Registration or login failed.");
    }
  };


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6 offset-3">
          <div className="card">
            <h5 className="card-header">User Registration</h5>
            <div className="card-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="first_name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      onChange={handleChange}
                      value={formData.first_name}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      onChange={handleChange}
                      value={formData.last_name}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    id="username"
                    onChange={handleChange}
                    value={formData.username}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleSubmit}

                >
                  Register
                </button>
              </form>

              <div className="mt-3 text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
