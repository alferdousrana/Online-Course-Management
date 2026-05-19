import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Courses from "./Courses";
import CourseDetail from "./CourseDetail";
import Teachers from "./Teachers";
import TeacherDetails from "./TeacherDetails";
import About from "./About";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Register from "./Register";

import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";
import MyCourses from "./Dashboard/MyCourses";
import EnrolledCourseDetail from "./Dashboard/EnrolledCourseDetail";
import CreateCourse from "./Dashboard/CreateCourse";
import EditCourse from "./Dashboard/EditCourse";
import Settings from "./Dashboard/Settings";
import Help from "./Dashboard/Help";
import Contact from "./Dashboard/Contact";
import Feedback from "./Dashboard/Feedback";
import Faq from "./Dashboard/Faq";
import ChangePassword from "./Dashboard/ChangePassword";
import Logout from "./Dashboard/Logout";


import { Routes, Route } from "react-router-dom";

function Main() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/teachers/:id" element={<TeacherDetails />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard and its nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<MyCourses />} />
          <Route
            path="enrolled-course/:id"
            element={<EnrolledCourseDetail />}
          />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="update-course/:id" element={<EditCourse />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="contact" element={<Contact />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="faq" element={<Faq />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default Main;
