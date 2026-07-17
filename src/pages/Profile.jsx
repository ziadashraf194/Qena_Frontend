import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, UploadCloud, CheckCircle, AlertCircle, Loader, X, Image as ImageIcon } from "lucide-react";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Stepper from "../components/Stepper";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
    birthDate: "",
    gender: "male",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    percentage: "",
    score: "",
    nationalIdImage: "",
    certificateImage: "",
    parentName: "",
    parentRelation: "father",
    parentPhone: "",
    parentAddress: "",
    parentNationalID: ""
  });

  // Upload States
  const [uploadingId, setUploadingId] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  // Scroll to middle of page when error appears
  useEffect(() => {
    if (error) {
      const scrollY = (document.documentElement.scrollHeight - window.innerHeight) / 2;
      window.scrollTo({ top: Math.max(0, scrollY), behavior: "smooth" });
    }
  }, [error]);

  useEffect(() => {
    API.get("/student")
      .then((res) => {
        if (res.data && res.data.status === "success") {
          setHasProfile(true);
          setProfileData(res.data.data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status !== 404) {
          setError("حدث خطأ أثناء تحميل بيانات الملف الشخصي");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الملف يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const fileData = new FormData();
    fileData.append("file", file);

    if (type === "nationalId") {
      setUploadingId(true);
    } else {
      setUploadingCert(true);
    }

    setError("");

    try {
      const response = await API.post("/student/upload", fileData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data && response.data.url) {
        setFormData((prev) => ({
          ...prev,
          [type === "nationalId" ? "nationalIdImage" : "certificateImage"]: response.data.url
        }));
      }
    } catch (err) {
      console.error(err);
      setError("فشل رفع الملف. تأكد من حجم ونوع الملف المدعوم (PDF, JPEG, PNG)");
    } finally {
      setUploadingId(false);
      setUploadingCert(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nationalIdImage) {
      setError("برجاء رفع صورة بطاقة الرقم القومي");
      return;
    }
    if (!formData.certificateImage) {
      setError("برجاء رفع صورة شهادة الثانوية العامة");
      return;
    }

    setSubmitting(true);

    const payload = {
      firstName: formData.firstName,
      secondName: formData.secondName,
      thirdName: formData.thirdName,
      fourthName: formData.fourthName,
      birthDate: formData.birthDate,
      gender: formData.gender,
      address: formData.address,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      percentage: Number(formData.percentage),
      score: Number(formData.score),
      nationalIdImage: formData.nationalIdImage,
      certificateImage: formData.certificateImage,
      parent: {
        name: formData.parentName,
        relation: formData.parentRelation,
        phone: formData.parentPhone,
        address: formData.parentAddress,
        nationalID: formData.parentNationalID
      }
    };

    try {
      const response = await API.post("/student/fill", payload);
      if (response.data && response.data.status === "success") {
        setSuccess("تم حفظ البيانات الشخصية والأكاديمية بنجاح!");
        setHasProfile(true);
        const detailsRes = await API.get("/student");
        if (detailsRes.data && detailsRes.data.status === "success") {
          setProfileData(detailsRes.data.data);
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("حدث خطأ أثناء حفظ البيانات");
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

  if (hasProfile && profileData) {
    const formattedBirthDate = profileData.birthDate
      ? new Date(profileData.birthDate).toLocaleDateString("ar-EG")
      : "";

    const getImageUrl = (path) => `http://localhost:3000${path}`;

    return (
      <div className="container animate-fade-in" style={{ padding: "40px 0 80px" }}>
        <div className="card text-center" style={{ borderLeft: "6px solid var(--success-color)", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--success-color)", marginBottom: "8px" }}>
            <CheckCircle size={24} />
            <h3 style={{ fontSize: "20px", fontWeight: 700 }}>ملفك الشخصي مكتمل وجاهز</h3>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>
            تم تسجيل بياناتك الأكاديمية والشخصية بنجاح في النظام. يمكنك الآن الانتقال لتقديم طلب الكلية.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Button onClick={() => navigate("/apply")} variant="accent">
              الانتقال لتقديم طلب كلية
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "32px" }}>
          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "var(--primary-color)", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              البيانات الشخصية والدراسية
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>الاسم الكامل:</span>
                <span style={{ fontWeight: 600 }}>{`${profileData.firstName} ${profileData.secondName} ${profileData.thirdName} ${profileData.fourthName}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>تاريخ الميلاد:</span>
                <span>{formattedBirthDate}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>الجنس:</span>
                <span>{profileData.gender === "male" ? "ذكر" : "أنثى"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>العنوان:</span>
                <span>{profileData.address}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>رقم الهاتف:</span>
                <span>{profileData.phone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>واتساب:</span>
                <span>{profileData.whatsapp}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>البريد الإلكتروني:</span>
                <span>{profileData.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border-color)", paddingTop: "12px" }}>
                <span style={{ color: "var(--text-secondary)" }}>النسبة المئوية:</span>
                <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>{profileData.percentage}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>المجموع الكلي:</span>
                <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>{profileData.score} درجة</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div className="card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "var(--primary-color)", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                بيانات ولي الأمر
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>اسم ولي الأمر:</span>
                  <span style={{ fontWeight: 600 }}>{profileData.parent?.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>صلة القرابة:</span>
                  <span>
                    {profileData.parent?.relation === "father" ? "أب" :
                      profileData.parent?.relation === "mother" ? "أم" : "ولي أمر"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>رقم هاتف ولي الأمر:</span>
                  <span>{profileData.parent?.phone}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>الرقم القومي لولي الأمر:</span>
                  <span>{profileData.parent?.nationalID}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "var(--primary-color)", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                المستندات المرفوعة
              </h3>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {/* National ID Image */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "160px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5"
                    }}
                    onClick={() => setPreviewImage(getImageUrl(profileData.nationalIdImage))}
                  >
                    <img
                      src={getImageUrl(profileData.nationalIdImage)}
                      alt="بطاقة الرقم القومي"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<span style="font-size:12px;color:var(--text-secondary)">لا توجد صورة</span>`;
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
                    بطاقة الرقم القومي
                  </span>
                </div>

                {/* Certificate Image */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "160px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5"
                    }}
                    onClick={() => setPreviewImage(getImageUrl(profileData.certificateImage))}
                  >
                    <img
                      src={getImageUrl(profileData.certificateImage)}
                      alt="شهادة الثانوية"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<span style="font-size:12px;color:var(--text-secondary)">لا توجد صورة</span>`;
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
                    شهادة الثانوية
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview Modal - transparent background, clear close button, responsive image */}
        {previewImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              backgroundColor: "transparent", // fully transparent
              cursor: "pointer",
            }}
            onClick={() => setPreviewImage(null)}
          >
            <div
              style={{
                position: "relative",
                maxWidth: "95vw",
                maxHeight: "95vh",
                backgroundColor: "transparent",
                padding: "0",
                cursor: "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - solid white background, visible */}
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  position: "absolute",
                  top: "-18px",
                  left: "-18px",
                  background: "#ffffff",
                  color: "#333333",
                  border: "1px solid #dddddd",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease",
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
              >
                <X size={20} />
              </button>

              {/* Image container with responsive sizing */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  overflow: "hidden",
                  maxWidth: "95vw",
                  maxHeight: "95vh",
                }}
              >
                <img
                  src={previewImage}
                  alt="معاينة المستند"
                  style={{
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Profile Form (Step 1 of Stepper) - unchanged
  return (
    <div className="container animate-fade-in" style={{ padding: "40px 0 80px" }}>
      <Stepper currentStep={1} />

      <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--primary-color)", marginBottom: "24px" }}>
          استكمال الملف الشخصي للطالب
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* ... (all form fields remain exactly as before) ... */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent-color)", marginBottom: "16px" }}>
              1. البيانات الشخصية
            </h3>
            <div className="grid grid-cols-2" style={{ gap: "20px", marginBottom: "20px" }}>
              <Input
                label="الاسم الأول"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="الاسم الأول للطالب"
                required
              />
              <Input
                label="اسم الأب"
                id="secondName"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                placeholder="اسم الأب"
                required
              />
            </div>
            <div className="grid grid-cols-2" style={{ gap: "20px", marginBottom: "20px" }}>
              <Input
                label="اسم الجد"
                id="thirdName"
                name="thirdName"
                value={formData.thirdName}
                onChange={handleChange}
                placeholder="اسم الجد"
                required
              />
              <Input
                label="اللقب / العائلة"
                id="fourthName"
                name="fourthName"
                value={formData.fourthName}
                onChange={handleChange}
                placeholder="اللقب / اسم العائلة"
                required
              />
            </div>
            <div className="grid grid-cols-3" style={{ gap: "20px" }}>
              <Input
                label="تاريخ الميلاد"
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="gender">الجنس</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <Input
                label="العنوان بالكامل"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="مثال: قنا، ش الجمهورية"
                required
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent-color)", marginBottom: "16px" }}>
              2. بيانات التواصل والاتصال
            </h3>
            <div className="grid grid-cols-3" style={{ gap: "20px" }}>
              <Input
                label="رقم الهاتف المحمول"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                required
              />
              <Input
                label="رقم واتساب"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                required
              />
              <Input
                label="البريد الإلكتروني"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent-color)", marginBottom: "16px" }}>
              3. البيانات الأكاديمية (الثانوية العامة)
            </h3>
            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              <Input
                label="النسبة المئوية (%)"
                id="percentage"
                name="percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.percentage}
                onChange={handleChange}
                placeholder="مثال: 85.5"
                required
              />
              <Input
                label="المجموع الكلي للدرجات"
                id="score"
                name="score"
                type="number"
                value={formData.score}
                onChange={handleChange}
                placeholder="مثال: 350.5"
                required
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent-color)", marginBottom: "16px" }}>
              4. بيانات ولي الأمر
            </h3>
            <div className="grid grid-cols-3" style={{ gap: "20px", marginBottom: "20px" }}>
              <Input
                label="اسم ولي الأمر بالكامل"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="الاسم الثلاثي أو الرباعي"
                required
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="parentRelation">صلة القرابة</label>
                <select
                  id="parentRelation"
                  name="parentRelation"
                  value={formData.parentRelation}
                  onChange={handleChange}
                  required
                >
                  <option value="father">أب</option>
                  <option value="mother">أم</option>
                  <option value="guardian">وصي / ولي أمر</option>
                  <option value="brother">أخ</option>
                  <option value="sister">أخت</option>
                  <option value="uncle">عم</option>
                  <option value="maternal_uncle">خال</option>
                </select>
              </div>
              <Input
                label="رقم هاتف ولي الأمر"
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                required
              />
            </div>
            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              <Input
                label="الرقم القومي لولي الأمر"
                id="parentNationalID"
                name="parentNationalID"
                value={formData.parentNationalID}
                onChange={handleChange}
                placeholder="14 رقماً"
                required
              />
              <Input
                label="عنوان ولي الأمر"
                id="parentAddress"
                name="parentAddress"
                value={formData.parentAddress}
                onChange={handleChange}
                placeholder="العنوان بالكامل"
                required
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent-color)", marginBottom: "16px" }}>
              5. المستندات المرفقة (الملفات)
            </h3>
            <div className="grid grid-cols-2" style={{ gap: "24px" }}>
              <div style={{
                border: "2px dashed var(--border-color)",
                padding: "24px",
                borderRadius: "var(--radius-sm)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                backgroundColor: formData.nationalIdImage ? "var(--success-bg)" : "transparent"
              }}>
                <UploadCloud size={32} style={{ color: formData.nationalIdImage ? "var(--success-color)" : "var(--text-secondary)" }} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>صورة بطاقة الرقم القومي</span>
                <input
                  type="file"
                  id="nationalIdFile"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, "nationalId")}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("nationalIdFile").click()}
                  className="btn btn-secondary"
                  disabled={uploadingId}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  {uploadingId ? "جاري الرفع..." : formData.nationalIdImage ? "تعديل الملف" : "اختر ملف"}
                </button>
                {formData.nationalIdImage && (
                  <span style={{ fontSize: "12px", color: "var(--success-color)", fontWeight: 500 }}>
                    تم الرفع بنجاح ✓
                  </span>
                )}
              </div>

              <div style={{
                border: "2px dashed var(--border-color)",
                padding: "24px",
                borderRadius: "var(--radius-sm)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                backgroundColor: formData.certificateImage ? "var(--success-bg)" : "transparent"
              }}>
                <UploadCloud size={32} style={{ color: formData.certificateImage ? "var(--success-color)" : "var(--text-secondary)" }} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>صورة شهادة الثانوية العامة</span>
                <input
                  type="file"
                  id="certificateFile"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, "certificate")}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("certificateFile").click()}
                  className="btn btn-secondary"
                  disabled={uploadingCert}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  {uploadingCert ? "جاري الرفع..." : formData.certificateImage ? "تعديل الملف" : "اختر ملف"}
                </button>
                {formData.certificateImage && (
                  <span style={{ fontSize: "12px", color: "var(--success-color)", fontWeight: 500 }}>
                    تم الرفع بنجاح ✓
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
            <Button type="submit" variant="primary" loading={submitting} style={{ padding: "14px 40px", fontSize: "16px" }}>
              حفظ وتأكيد البيانات الشخصية
            </Button>
          </div>
        </form>
      </div>

      {/* Error Modal - transparent background, centered */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            pointerEvents: "none",
          }}
          onClick={() => setError("")}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              maxWidth: "480px",
              width: "100%",
              padding: "32px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              position: "relative",
              textAlign: "center",
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setError("")}
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                padding: "4px",
              }}
            >
              <X size={20} />
            </button>
            <div style={{ marginBottom: "16px" }}>
              <AlertCircle size={40} color="var(--error-color)" />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--error-color)", marginBottom: "8px" }}>
              حدث خطأ
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.6 }}>
              {error}
            </p>
            <Button
              onClick={() => setError("")}
              variant="danger"
              style={{ marginTop: "24px", padding: "10px 32px" }}
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}