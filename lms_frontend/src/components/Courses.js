import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://127.0.0.1:8000";
const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // New state for price range filtering
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 }); // Default max, will be updated
  const [maxPrice, setMaxPrice] = useState(50000); // Will store max price from courses

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchAllCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/categories/`);
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Failed to load categories");
    }
  };

  const fetchAllCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${baseUrl}/api/courses/`);
      setCourses(response.data);
      // Find the maximum price from courses
      const maxCoursePrice = Math.max(
        ...response.data.map((course) => course.price),
        50000 // Fallback max price
      );
      setMaxPrice(maxCoursePrice);
      setPriceRange({ min: 0, max: maxCoursePrice }); // Initialize price range
      setSelectedCategory(null);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesByCategory = async (categoryId) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${baseUrl}/api/courses/category/${categoryId}/`
      );
      setCourses(response.data);
      // Find the maximum price from filtered courses
      const maxCoursePrice = Math.max(
        ...response.data.map((course) => course.price),
        50000 // Fallback max price
      );
      setMaxPrice(maxCoursePrice);
      setPriceRange({ min: 0, max: maxCoursePrice }); // Reset price range for category
      setSelectedCategory(categoryId);
    } catch (err) {
      console.error("Failed to fetch courses by category", err);
      setError("Failed to load courses for this category");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      fetchAllCourses();
    } else {
      fetchCoursesByCategory(categoryId);
    }
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // Filtered and sorted courses
  const filteredCourses = courses
    .filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Add price range filtering
    .filter(
      (course) =>
        course.price >= priceRange.min && course.price <= priceRange.max
    )
    .sort((a, b) => {
      const term = searchTerm.toLowerCase();
      const aStarts = a.title.toLowerCase().startsWith(term);
      const bStarts = b.title.toLowerCase().startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        {/* Left Sidebar - Categories */}
        <div className="col-md-3">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">Price Range</h5>
            </div>
            <div className="card-body p-3">
              <div className="mb-3">
                <label htmlFor="minPrice" className="form-label">
                  Min Price: {priceRange.min} Tk
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="minPrice"
                  name="min"
                  min="0"
                  max={priceRange.max}
                  value={priceRange.min}
                  onChange={handlePriceChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxPrice" className="form-label">
                  Max Price: {priceRange.max} Tk
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="maxPrice"
                  name="max"
                  min={priceRange.min}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
          </div>
          {/* Category List */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Course Categories</h5>
            </div>
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action ${
                  selectedCategory === null ? "active" : ""
                }`}
                onClick={() => fetchAllCourses()}
              >
                <i className="fas fa-list me-2"></i>
                All Courses
                <span className="badge bg-primary rounded-pill float-end">
                  {filteredCourses.length}
                </span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`list-group-item list-group-item-action ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <i className="fas fa-folder me-2"></i>
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Courses */}
        <div className="col-md-9">
          {/* Header with search and selected category info */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>
              {selectedCategory
                ? `${
                    categories.find((cat) => cat.id === selectedCategory)?.title
                  } Courses`
                : "All Courses"}
            </h4>
            <span className="badge bg-info">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* 🔍 Search Input */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading courses...</p>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && filteredCourses.length > 0 && (
            <div className="row">
              {filteredCourses.map((course) => (
                <div key={course.id} className="col-md-3 col-lg-4 mb-4">
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
          )}

          {/* No Courses Message */}
          {!loading && filteredCourses.length === 0 && !error && (
            <div className="text-center py-5">
              <i className="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No matching courses found</h5>
              <p className="text-muted">
                Try a different keyword or adjust the price range.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
