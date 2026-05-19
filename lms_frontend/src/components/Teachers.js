import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

// Default image for teachers
const defaultImage =
  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

function Teachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/teachers/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Sort teachers by total_courses in descending order
        const sortedTeachers = response.data.sort(
          (a, b) => b.total_courses - a.total_courses
        );
        setTeachers(sortedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="pb-1 mb-4">Teachers</h3>
      <div className="row">
        {teachers.map((teacher) => (
          <div className="col-md-3" key={teacher.id}>
            <div className="card rounded mb-4 p-2 shadow-sm">
              <Link to={`/teachers/${teacher.id}`}>
                <img
                  src={teacher.image_url || defaultImage}
                  className="card-img-top rounded shadow"
                  alt="Teacher"
                  style={{ height: "300px", width: "100%", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <Link
                  to={`/teachers/${teacher.id}`}
                  className="custom-link mb-3"
                >
                  <h5 className="card-title text-center ">
                    {teacher.full_name}
                  </h5>
                </Link>
                <p className="text-center">
                  {teacher.qualification.length > 25
                    ? `${teacher.qualification.substring(0, 25)}...`
                    : teacher.qualification}
                </p>
                <p className="text-muted small text-center">
                  {teacher.total_courses} course
                  {teacher.total_courses > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teachers;
