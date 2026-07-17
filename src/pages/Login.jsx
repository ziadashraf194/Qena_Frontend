import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [nationalID, setNationalID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nationalID || nationalID.length !== 14) {
      setError("الرقم القومي يجب أن يتكون من 14 رقماً");
      return;
    }

    if (!password || password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/login", { nationalID, password });
      if (response.data && response.data.status === "success") {
        // Update auth context (which syncs to localStorage reactively)
        login(response.data.token, response.data.user);
        
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message === "Invalid nationalID or password") {
          setError("الرقم القومي أو كلمة المرور غير صحيحة");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError("حدث خطأ غير متوقع أثناء تسجيل الدخول");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 16px",
      minHeight: "calc(100vh - 280px)"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "450px", margin: 0 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary-color)", marginBottom: "8px" }}>
            تسجيل الدخول
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            بوابة القبول الموحدة لجامعة قنا الأهلية
          </p>
        </div>

        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "var(--error-bg)",
            color: "var(--error-color)",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "20px"
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input
            label="الرقم القومي للطالب (14 رقم)"
            id="nationalID"
            type="text"
            maxLength={14}
            value={nationalID}
            onChange={(e) => setNationalID(e.target.value.replace(/\D/g, ""))}
            placeholder="أدخل الرقم القومي بالكامل"
            required
          />

          <Input
            label="كلمة المرور"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة المرور"
            required
          />

          <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", height: "46px", marginTop: "10px" }}>
            <LogIn size={18} />
            <span>دخول</span>
          </Button>
        </form>

        <div style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "14px",
          color: "var(--text-secondary)"
        }}>
          ليس لديك حساب؟{" "}
          <Link to="/register" style={{ color: "var(--accent-color)", fontWeight: 600, textDecoration: "none" }}>
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}
