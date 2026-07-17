import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [nationalID, setNationalID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/register", { nationalID, password });
      if (response.data && response.data.status === "success") {
        // Update auth context (which syncs to localStorage reactively)
        login(response.data.token, response.data.user);
        
        // Redirect student to fill profile first
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message === "User already exists") {
          setError("هذا الرقم القومي مسجل بالفعل في النظام");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError("حدث خطأ غير متوقع أثناء تسجيل الحساب");
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
            إنشاء حساب جديد
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            أنشئ حسابك للبدء في تقديم طلب الالتحاق بالجامعة
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
            placeholder="أدخل 14 رقماً"
            required
          />

          <Input
            label="كلمة المرور"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة مرور قوية"
            required
          />

          <Input
            label="تأكيد كلمة المرور"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
            required
          />

          <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", height: "46px", marginTop: "10px" }}>
            <UserPlus size={18} />
            <span>إنشاء حساب</span>
          </Button>
        </form>

        <div style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "14px",
          color: "var(--text-secondary)"
        }}>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" style={{ color: "var(--accent-color)", fontWeight: 600, textDecoration: "none" }}>
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
