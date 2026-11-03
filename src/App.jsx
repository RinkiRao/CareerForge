import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Home & About
import Home from "./components/Home";
import About from "./components/About";

// Existing Components
import Dashboard from "./components/Dashboard";
import LeetCode from "./components/LeetCode";
import Learn from "./components/Learn";
import GitHub from "./components/GitHub";
import LinkedIn from "./components/LinkedIn";
import JobsInternships from "./components/JobsInternships";

// Account Activity Tracker
import AccountActivityTracker from "./components/AccountActivityTracker";

// Existing Pages
import StudentsDashboard from "./pages/StudentsDashboard";
import MiraApplication from "./pages/MiraApplication";
import CompanyDashboard from "./pages/CompanyDashboard";

// Registration
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import StudentRegister from "./pages/StudentRegister.jsx";

// Company
import CompanyRegister from "./company/CompanyRegister.jsx";

// Owner
import OwnerRegister from "./admin/OwnerRegister.jsx";
import OwnerDashboard from "./admin/OwnerDashboard.jsx";
import AccountIntelligence from "./admin/AccountIntelligence.jsx";

import "./utils/i18n";
import "./App.css";
import { ProfileProvider } from "./utils/ProfileProvider";

export default function App() {
  const ownerToken = localStorage.getItem("careerforge_owner_token");

  return (
    <BrowserRouter>
      <ProfileProvider>
        {/* Track logged-in student/company activity */}
        <AccountActivityTracker />

        <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/landing" element={<Landing />} />

        {/* GENERAL REGISTRATION */}
        <Route path="/register" element={<Register />} />

        {/* STUDENT REGISTRATION */}
        <Route
          path="/register/student"
          element={<StudentRegister />}
        />

        {/* COMPANY REGISTRATION */}
        <Route
          path="/register/company"
          element={<CompanyRegister />}
        />

        {/* OWNER REGISTRATION */}
        <Route
          path="/admin/register"
          element={<OwnerRegister />}
        />

        {/* OWNER DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            ownerToken ? (
              <OwnerDashboard />
            ) : (
              <Navigate to="/admin/register" replace />
            )
          }
        />

        {/* OWNER ACCOUNT INTELLIGENCE */}
        <Route
          path="/admin/accounts/:type/:id"
          element={<AccountIntelligence />}
        />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/students-dashboard"
          element={<StudentsDashboard />}
        />

        {/* Dedicated MIRA AI Companion */}
        <Route path="/mira" element={<MiraApplication />} />

        {/* GENERAL DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* LEARNING & CAREER */}
        <Route path="/leetcode" element={<LeetCode />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/github" element={<GitHub />} />
        <Route path="/linkedin" element={<LinkedIn />} />
        <Route path="/jobs" element={<JobsInternships />} />

        {/* COMPANY DASHBOARD */}
        <Route
          path="/company-dashboard"
          element={<CompanyDashboard />}
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        </Routes>
      </ProfileProvider>
    </BrowserRouter>
  );
}