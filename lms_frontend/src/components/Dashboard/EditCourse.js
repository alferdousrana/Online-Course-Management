import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    intro_url: "",
    price: "",
    duration: "",
    category: "",
    modules: [],
  });
  const [teacherId, setTeacherId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${baseUrl}/api/users/profile/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setTeacherId(res.data.id));

    axios
      .get(`${baseUrl}/api/categories/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setCategories(res.data));

    axios
      .get(`${baseUrl}/api/courses/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setFormData({
          title: res.data.title,
          description: res.data.description,
          image_url: res.data.image_url,
          intro_url: res.data.intro_url,
          price: res.data.price,
          duration: res.data.duration,
          category: res.data.category,
          modules: res.data.modules || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { title: "", duration: "", video_url: "" },
      ],
    });
  };

  const removeModule = (index) => {
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const submitData = {
      ...formData,
      teacher: teacherId || formData.teacher,
    };

    try {
      await axios.patch(`${baseUrl}/api/courses/${id}/update/`, submitData, {
        headers: { Authorization: `Token ${token}` },
      });
      navigate("/dashboard/courses", {
        state: {
          success: true,
          message: "Course updated successfully!",
        },
      });
    } catch (err) {
      console.error("Update error:", err.response?.data);
      alert("Course update failed. See console for details.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h3>Edit Course</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Course Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="text"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duration</label>
          <input
            type="text"
            name="duration"
            className="form-control"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <textarea
            name="image_url"
            rows="2"
            className="form-control"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Image Link from Internet (e.g., Unsplash, Pexels)"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Intro Video URL</label>
          <textarea
            name="intro_url"
            rows="2"
            className="form-control"
            value={formData.intro_url}
            onChange={handleChange}
            placeholder="Video Link from Internet (e.g., YouTube, Vimeo)"
          />
        </div>

        <h5>Modules</h5>
        {formData.modules.map((mod, index) => (
          <div key={index} className="mb-3 border p-2 rounded">
            <label>Module Title</label>
            <input
              type="text"
              className="form-control mb-2"
              value={mod.title}
              onChange={(e) =>
                handleModuleChange(index, "title", e.target.value)
              }
              required
            />

            <label>Module Duration</label>
            <input
              type="text"
              className="form-control mb-2"
              value={mod.duration}
              onChange={(e) =>
                handleModuleChange(index, "duration", e.target.value)
              }
              required
            />

            <label>Video URL</label>
            <input
              type="text"
              className="form-control mb-2"
              value={mod.video_url}
              onChange={(e) =>
                handleModuleChange(index, "video_url", e.target.value)
              }
              required
            />

            <button
              type="button"
              onClick={() => removeModule(index)}
              className="btn btn-sm btn-danger"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addModule}
          className="btn btn-secondary btn-sm mb-3"
        >
          + Add Module
        </button>
      
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary">
          Update Course
        </button>
        </div>
        
      </form>
    </div>
  );
}

export default EditCourse;
