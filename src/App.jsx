import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Apply from "./pages/Apply";
import MyApplications from "./pages/MyApplications";
import AdminDashboard from "./pages/AdminDashboard";

// Route Guard for logged in students
function StudentRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "student") {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Route Guard for logged in admins
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Route Guard for non-logged in users (auth pages)
function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/profile"} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "var(--bg-color)"
    }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes (unauthenticated only) */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Student Protected Routes */}
          <Route path="/profile" element={
            <StudentRoute>
              <Profile />
            </StudentRoute>
          } />
          <Route path="/apply" element={
            <StudentRoute>
              <Apply />
            </StudentRoute>
          } />
          <Route path="/applications" element={
            <StudentRoute>
              <MyApplications />
            </StudentRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
