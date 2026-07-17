import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, LayoutDashboard, FileText, PlusCircle, LogIn, UserPlus, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on click outside
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Branding / Logo */}
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo-icon">قنا</div>
            <div className="navbar-logo-text">
              <h1>جامعة قنا الأهلية</h1>
              <span>بوابة القبول الإلكترونية</span>
            </div>
          </Link>

          {/* Desktop Center Navigation */}
          <nav className="navbar-nav-desktop">
            <Link to="/" className={`navbar-nav-link ${isActive("/") ? "active" : ""}`}>
              الرئيسية
            </Link>
            <a href="/#faculties" className="navbar-nav-link">
              الكليات
            </a>
            <a href="/#conditions" className="navbar-nav-link">
              شروط القبول
            </a>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="navbar-actions-desktop">
            {isAuthenticated && user ? (
              <>
                {user.role === "admin" ? (
                  <Link to="/admin" className="btn btn-primary navbar-btn">
                    <LayoutDashboard size={18} />
                    <span>لوحة التحكم</span>
                  </Link>
                ) : (
                  <>
                    <Link to="/profile" className={`btn btn-secondary navbar-btn ${isActive("/profile") ? "active-link" : ""}`}>
                      <User size={18} />
                      <span>ملفي الشخصي</span>
                    </Link>
                    <Link to="/apply" className="btn btn-accent navbar-btn">
                      <PlusCircle size={18} />
                      <span>تقديم جديد</span>
                    </Link>
                    <Link to="/applications" className={`btn btn-secondary navbar-btn ${isActive("/applications") ? "active-link" : ""}`}>
                      <FileText size={18} />
                      <span>طلبات التقديم</span>
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="navbar-logout-btn">
                  <LogOut size={18} />
                  <span className="navbar-logout-text">تسجيل خروج</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary navbar-btn">
                  <LogIn size={18} />
                  <span>تسجيل الدخول</span>
                </Link>
                <Link to="/register" className="btn btn-primary navbar-btn">
                  <UserPlus size={18} />
                  <span>حساب جديد</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div className={`navbar-mobile-overlay ${mobileOpen ? "open" : ""}`} />

      {/* Mobile Slide-in Menu */}
      <div ref={menuRef} className={`navbar-mobile-menu ${mobileOpen ? "open" : ""}`}>
        {/* Mobile Nav Links */}
        <nav className="navbar-mobile-nav">
          <Link to="/" className={`navbar-mobile-link ${isActive("/") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
            الرئيسية
          </Link>
          <a href="#faculties" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>
            الكليات
          </a>
          <a href="#conditions" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>
            شروط القبول
          </a>
        </nav>

        <div className="navbar-mobile-divider" />

        {/* Mobile Auth Actions */}
        <div className="navbar-mobile-actions">
          {isAuthenticated && user ? (
            <>
              {user.role === "admin" ? (
                <Link to="/admin" className="btn btn-primary navbar-mobile-btn" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={18} />
                  <span>لوحة التحكم</span>
                </Link>
              ) : (
                <>
                  <Link to="/profile" className="btn btn-secondary navbar-mobile-btn" onClick={() => setMobileOpen(false)}>
                    <User size={18} />
                    <span>ملفي الشخصي</span>
                  </Link>
                  <Link to="/apply" className="btn btn-accent navbar-mobile-btn" onClick={() => setMobileOpen(false)}>
                    <PlusCircle size={18} />
                    <span>تقديم جديد</span>
                  </Link>
                  <Link to="/applications" className="btn btn-secondary navbar-mobile-btn" onClick={() => setMobileOpen(false)}>
                    <FileText size={18} />
                    <span>طلبات التقديم</span>
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="navbar-mobile-logout">
                <LogOut size={18} />
                <span>تسجيل خروج</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary navbar-mobile-btn" onClick={() => setMobileOpen(false)}>
                <LogIn size={18} />
                <span>تسجيل الدخول</span>
              </Link>
              <Link to="/register" className="btn btn-primary navbar-mobile-btn" onClick={() => setMobileOpen(false)}>
                <UserPlus size={18} />
                <span>حساب جديد</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
