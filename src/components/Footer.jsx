import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--primary-color)",
      color: "#ffffff",
      padding: "64px 0 32px",
      marginTop: "auto",
      borderTop: "4px solid var(--accent-color)"
    }}>
      <div className="container">
        <div className="grid grid-cols-3" style={{ marginBottom: "48px", gap: "40px" }}>
          
          {/* Logo & Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-color)",
                color: "var(--primary-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px"
              }}>
                قنا
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>جامعة قنا الأهلية</h3>
            </div>
            <p style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: "1.8" }}>
              جامعة أهلية رائدة تسعى لتقديم برامج أكاديمية متميزة تواكب العصر، بهدف إعداد أجيال واعدة قادرة على الريادة والابتكار ودعم جهود التنمية في صعيد مصر.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "var(--accent-color)", marginBottom: "20px" }}>
              روابط سريعة
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", padding: 0 }}>
              <li>
                <Link to="/" style={{ color: "#d0d0d0", textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  الرئيسية
                </Link>
              </li>
              <li>
                <a href="#faculties" style={{ color: "#d0d0d0", textDecoration: "none", fontSize: "14px" }}>
                  كليات الجامعة
                </a>
              </li>
              <li>
                <a href="#conditions" style={{ color: "#d0d0d0", textDecoration: "none", fontSize: "14px" }}>
                  شروط وتنسيق القبول
                </a>
              </li>
              <li>
                <a href="https://svu.edu.eg" target="_blank" rel="noopener noreferrer" style={{ color: "#d0d0d0", textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>بوابة جامعة جنوب الوادي</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "var(--accent-color)", marginBottom: "20px" }}>
              معلومات الاتصال
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px", padding: 0 }}>
              <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#d0d0d0" }}>
                <MapPin size={18} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
                <span>طريق قنا - سفاجا السياحي، قنا، مصر</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#d0d0d0" }}>
                <Phone size={18} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
                <span dir="ltr">+20 96 1234567</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#d0d0d0" }}>
                <Mail size={18} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
                <span>admission@qena.edu.eg</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #222222",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "13px",
          color: "#8c8c8c"
        }}>
          <span>© {new Date().getFullYear()} جميع الحقوق محفوظة لجامعة قنا الأهلية.</span>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link to="/privacy" style={{ color: "#8c8c8c", textDecoration: "none" }}>سياسة الخصوصية</Link>
            <span>•</span>
            <Link to="/terms" style={{ color: "#8c8c8c", textDecoration: "none" }}>الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
