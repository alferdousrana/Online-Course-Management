import React, { useState, useEffect } from "react";
import axios from "axios";

const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    educationLevel: "",
    interestedCourses: "",
    skills: "",
    address: "",
    bio: "",
    image_url:"",
    role: "",
  });

  useEffect(() => {
    document.title = "Profile - LWR";
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/users/profile/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("User data fetched:", data);

      setProfileData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.mobile_no || "",
        educationLevel: data.qualification || "",
        interestedCourses: data.interested_categories || "",
        skills: data.skills || "",
        address: data.address || "",
        bio: data.bio || "",
        image_url:data.image_url || "",
        role: data.role || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage.");
      return;
    }

    try {
      const updatedData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        mobile_no: profileData.phone,
        qualification: profileData.educationLevel,
        interested_categories:
          profileData.role === "STUDENT" ? profileData.interestedCourses : "",
        skills: profileData.role === "TEACHER" ? profileData.skills : "",
        address: profileData.address,
        image_url: profileData.image_url,
        bio: profileData.role === "TEACHER" ? profileData.bio : "",
      };

      await axios.put(
        "http://127.0.0.1:8000/api/users/profile/update/",
        updatedData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setIsEditing(false);
      fetchUserData(); // Refresh after update
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
 

  return (
    <div className="container my-3">
      <h4 className="mb-3">
        👋 Welcome, {profileData.first_name} {profileData.last_name}!
      </h4>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{profileData.role} Profile</h5>
        </div>
        <div className="card-body">
          <img
            src={profileData.image_url || defaultImage}
            className="rounded-circle shadow mb-3"
            style={{ height: "120px", width: "120px", objectFit: "cover" }}
            alt="Teacher"
          />
          {isEditing && (
            <div className="mb-3">
              <label className="form-label fw-bold">Input your facebook profile image link</label>
              <textarea
                className="form-control"
                name="image_url"
                rows="5"
                value={profileData.image_url}
                onChange={handleChange}
                placeholder="Enter image URL here"
              />
            </div>
          )}

          <table className="table table-bordered">
            <tbody>
              {/* Fields */}
              <tr>
                <th>First Name</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      value={profileData.first_name}
                      onChange={handleChange}
                    />
                  ) : (
                    profileData.first_name
                  )}
                </td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      value={profileData.last_name}
                      onChange={handleChange}
                    />
                  ) : (
                    profileData.last_name
                  )}
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={profileData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    profileData.email
                  )}
                </td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={profileData.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    profileData.phone
                  )}
                </td>
              </tr>
              <tr>
                <th>Education Level</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="educationLevel"
                      className="form-control"
                      value={profileData.educationLevel}
                      onChange={handleChange}
                    />
                  ) : (
                    profileData.educationLevel
                  )}
                </td>
              </tr>

              {profileData.role === "STUDENT" && (
                <tr>
                  <th>Interested Courses</th>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        name="interestedCourses"
                        className="form-control"
                        value={profileData.interestedCourses}
                        onChange={handleChange}
                      />
                    ) : (
                      profileData.interestedCourses
                    )}
                  </td>
                </tr>
              )}

              {profileData.role === "TEACHER" && (
                <>
                  <tr>
                    <th>Skills</th>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="skills"
                          className="form-control"
                          value={profileData.skills}
                          onChange={handleChange}
                        />
                      ) : (
                        profileData.skills
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Bio</th>
                    <td>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          className="form-control"
                          rows="3"
                          value={profileData.bio}
                          onChange={handleChange}
                        />
                      ) : (
                        profileData.bio
                      )}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <th>Address</th>
                <td>
                  {isEditing ? (
                    <textarea
                      name="address"
                      className="form-control"
                      rows="2"
                      value={profileData.address}
                      onChange={handleChange}
                    />
                  ) : (
                    profileData.address
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center mt-3">
            {isEditing ? (
              <button className="btn btn-success px-4" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button className="btn btn-primary px-4" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
