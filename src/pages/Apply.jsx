import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle, FileText, ArrowRight, Loader, AlertTriangle, ShieldCheck } from "lucide-react";
import API from "../services/api";
import Button from "../components/Button";
import Stepper from "../components/Stepper";

export default function Apply() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Load student profile & faculties parallel
    Promise.all([
      API.get("/student").catch(() => null),
      API.get("/faculty").catch(() => null)
    ]).then(([profileRes, facultyRes]) => {
      if (profileRes && profileRes.data && profileRes.data.status === "success") {
        setProfile(profileRes.data.data);
      }
      if (facultyRes && facultyRes.data && facultyRes.data.status === "success") {
        setFaculties(facultyRes.data.data);
      }
    }).catch(err => {
      console.error(err);
      setError("حدث خطأ أثناء تحميل البيانات");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleFacultyChange = (e) => {
    const id = e.target.value;
    setSelectedFacultyId(id);
    const faculty = faculties.find(f => f._id === id);
    setSelectedFaculty(faculty || null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFacultyId) {
      setError("برجاء اختيار الكلية التي ترغب في التقديم إليها");
      return;
    }

    if (profile.percentage < selectedFaculty.minPercentage) {
      setError(`عذراً، مجموعك الأكاديمي (${profile.percentage}%) أقل من الحد الأدنى للقبول بهذه الكلية (${selectedFaculty.minPercentage}%)`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await API.post("/application", { facultyId: selectedFacultyId });
      if (response.data && response.data.status === "success") {
        setSuccess(response.data.message);
        setTimeout(() => {
          navigate("/applications");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("حدث خطأ أثناء إرسال طلب التقديم");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <Loader style={{ animation: "spin 1s linear infinite", color: "var(--accent-color)" }} size={32} />
      </div>
    );
  }

  // If student hasn't filled profile yet, they cannot apply
  if (!profile) {
    return (
      <div className="container animate-fade-in" style={{ padding: "40px 0 80px" }}>
        <Stepper currentStep={1} />
        <div className="card text-center" style={{ maxWidth: "600px", margin: "0 auto", borderLeft: "6px solid var(--error-color)" }}>
          <div style={{ color: "var(--error-color)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
            <AlertTriangle size={28} />
            <h3 style={{ fontSize: "20px", fontWeight: 700 }}>ملفك الشخصي غير مكتمل</h3>
          </div>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.8" }}>
            عذراً، لا يمكنك التقديم على أي كلية قبل استكمال ملفك الشخصي ورفع الأوراق الثبوتية الخاصة بك أولاً.
          </p>
          <Link to="/profile" className="btn btn-primary">
            استكمال الملف الشخصي الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 0 80px" }}>
      <Stepper currentStep={2} />

      <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--primary-color)", marginBottom: "8px" }}>
          تقديم طلب التحاق جديد
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          اختر الكلية التي ترغب في الالتحاق بها للتأكد من مطابقة شروط التنسيق.
        </p>

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
            marginBottom: "24px"
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "var(--success-bg)",
            color: "var(--success-color)",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            fontSize: "14px",
            marginBottom: "24px"
          }}>
            <ShieldCheck size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Student info summary */}
        <div style={{
          backgroundColor: "var(--bg-color)",
          padding: "16px 20px",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          border: "1px solid var(--border-color)"
        }}>
          <div>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>اسم الطالب</span>
            <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>
              {`${profile.firstName} ${profile.fourthName}`}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>النسبة المئوية الحالية</span>
            <span style={{ fontWeight: 700, color: "var(--accent-color)" }}>
              {profile.percentage}%
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="facultyId">الكلية المطلوبة</label>
            <select
              id="facultyId"
              value={selectedFacultyId}
              onChange={handleFacultyChange}
              required
            >
              <option value="">-- اختر الكلية من القائمة --</option>
              {faculties.map((fac) => (
                <option key={fac._id} value={fac._id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Faculty details comparison */}
          {selectedFaculty && (
            <div className="animate-fade-in" style={{
              backgroundColor: "var(--bg-color)",
              padding: "20px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-secondary)" }}>الحد الأدنى لتنسيق الكلية:</span>
                <span style={{
                  fontWeight: 700,
                  color: profile.percentage >= selectedFaculty.minPercentage ? "var(--success-color)" : "var(--error-color)"
                }}>
                  {selectedFaculty.minPercentage}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-secondary)" }}>رسوم سداد الطلب:</span>
                <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>
                  {selectedFaculty.applicationFee} جنيه مصري
                </span>
              </div>
              
              {/* Validation alert */}
              {profile.percentage < selectedFaculty.minPercentage ? (
                <div style={{
                  marginTop: "8px",
                  display: "flex",
                  gap: "8px",
                  color: "var(--error-color)",
                  fontSize: "13px",
                  fontWeight: 500
                }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>مجموعك لا يؤهلك للقبول بهذه الكلية طبقاً للتنسيق المعلن.</span>
                </div>
              ) : (
                <div style={{
                  marginTop: "8px",
                  display: "flex",
                  gap: "8px",
                  color: "var(--success-color)",
                  fontSize: "13px",
                  fontWeight: 500
                }}>
                  <ShieldCheck size={16} style={{ flexShrink: 0 }} />
                  <span>مجموعك مستوفٍ للشروط. يمكنك إكمال التقديم بنجاح.</span>
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
            <Link to="/profile" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ArrowRight size={16} />
              <span>العودة للملف الشخصي</span>
            </Link>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={!selectedFaculty || profile.percentage < selectedFaculty.minPercentage}
              style={{ padding: "12px 32px" }}
            >
              <PlusCircle size={18} />
              <span>تأكيد وتسجيل الرغبة</span>
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
