import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImage_url] = useState("");
  const [intro_url, setIntro_url] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [teacherId, setTeacherId] = useState(null);
  const [modules, setModules] = useState([
    { title: "", duration: "", video_url: "" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${baseUrl}/api/categories/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch failed", err));

    axios
      .get(`${baseUrl}/api/users/profile/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setTeacherId(res.data.id))
      .catch((err) => console.error("User profile fetch failed", err));
  }, []);

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, { title: "", duration: "", video_url: "" }]);
  };

  const removeModule = (index) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${baseUrl}/api/courses/create/`,
        {
          title,
          description,
          price,
          duration,
          image_url,
          intro_url,
          category: selectedCategory,
          teacher: teacherId,
          modules: modules.map((mod) => ({
            title: mod.title,
            duration: mod.duration,
            video_url: mod.video_url,
          })),
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      alert("Course created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setDuration("");
      setImage_url("");
      setIntro_url("");
      setSelectedCategory("");
      setModules([{ title: "", duration: "", video_url: "" }]);
    } catch (error) {
      console.error("Course creation failed", error.response?.data);
      alert("Failed to create course.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create New Course</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Course Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="text"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duration</label>
          <input
            type="text"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            rows="2"
            type="text"
            className="form-control"
            value={image_url}
            onChange={(e) => setImage_url(e.target.value)}
            placeholder="Image Link from Internet (e.g., Unsplash, Pexels)"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Intro Video URL</label>
          <textarea
            rows="2"
            type="text"
            className="form-control"
            value={intro_url}
            onChange={(e) => setIntro_url(e.target.value)}
            placeholder="Intro video Link from Internet (e.g., Youtube, Vimeo)"
          ></textarea>
        </div>

        <h5>Modules</h5>
        {modules.map((mod, index) => (
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
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
