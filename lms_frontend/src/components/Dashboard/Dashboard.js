import { Link, Outlet, useLocation } from "react-router-dom";
import "../../custom.css";
import Profile from "./Profile";
import { useEffect } from "react";

function Dashboard() {
  const location = useLocation();
  const isDashboardRoot = location.pathname === "/dashboard";

  useEffect(() => {
    document.title = "Dashboard - LWR";
  }, []);
  

  return (
    <div className="container mt-5">
      <div className="row">
        <aside className="col-md-3">
          <div className="card">
            <h5 className="card-header">User Dashboard</h5>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item custom-list-item">
                  <Link to="profile" className="custom-link">
                    Profile
                  </Link>
                </li>
                <li className="list-group-item custom-list-item">
                  <Link to="courses" className="custom-link">
                    My Courses
                  </Link>
                </li>
                <li className="list-group-item custom-list-item">
                  <Link to="settings" className="custom-link">
                    Settings
                  </Link>
                </li>
                <li className="list-group-item custom-list-item">
                  <Link to="help" className="custom-link">
                    Help
                  </Link>
                </li>
                <li className="list-group-item custom-list-item">
                  <Link to="contact" className="custom-link">
                    Contact Support
                  </Link>
                </li>
                {/* <li className="list-group-item custom-list-item">
                  <Link to="feedback" className="custom-link">
                    Feedback
                  </Link>
                </li> */}
                <li className="list-group-item custom-list-item">
                  <Link to="faq" className="custom-link">
                    FAQ
                  </Link>
                </li>
                <li className="list-group-item custom-list-item">
                  <Link to="change-password" className="custom-link">
                    Change Password
                  </Link>
                </li>
                <li className="list-group-item custom-list-item">
                  <Link to="logout" className="custom-link">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Dashboard Overview</h5>
            <div className="card-body">
              {isDashboardRoot ? (
                <>
                  
                  <Profile />
                </>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Dashboard;
