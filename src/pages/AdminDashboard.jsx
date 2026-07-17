import React, { useState, useEffect } from "react";
import { 
  Users, CheckCircle2, XCircle, Search, Filter, Loader, Eye, ExternalLink, 
  MessageSquare, ChevronLeft, ChevronRight, Check, X, ShieldAlert, Image as ImageIcon 
} from "lucide-react";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Input from "../components/Input";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Filters
  const [searchName, setSearchName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [minPercentage, setMinPercentage] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalResults: 0
  });

  // Modal / Review details
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("PENDING");
  const [reviewMessage, setReviewMessage] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // منع تمرير الخلفية عند فتح معاينة الصورة
  useEffect(() => {
    if (previewImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewImage]);

  const fetchFaculties = () => {
    API.get("/faculty")
      .then((res) => {
        if (res.data && res.data.status === "success") {
          setFaculties(res.data.data);
        }
      })
      .catch((err) => console.error("Error loading faculties:", err));
  };

  const fetchApplications = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 10
    };
    if (searchName) params.searchName = searchName;
    if (facultyId) params.facultyId = facultyId;
    if (paymentStatus) params.paymentStatus = paymentStatus;
    if (adminStatus) params.adminStatus = adminStatus;
    if (minPercentage) params.minPercentage = minPercentage;

    API.get("/application", { params })
      .then((res) => {
        if (res.data && res.data.status === "success") {
          setApplications(res.data.data);
          setPagination({
            totalPages: res.data.pagination.totalPages,
            totalResults: res.data.pagination.totalResults
          });
        }
      })
      .catch((err) => {
        console.error("Error loading applications:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, facultyId, paymentStatus, adminStatus, minPercentage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications();
  };

  const handleOpenReview = (app) => {
    setSelectedApp(app);
    setReviewStatus(app.adminStatus);
    setReviewMessage(app.massage || "");
    setModalError("");
    setModalSuccess("");
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");
    
    if (reviewStatus === "ACCEPTED" && selectedApp.paymentStatus !== "PAID") {
      setModalError("لا يمكن قبول الطلب إدارياً قبل أن يقوم الطالب بسداد رسوم التقديم أولاً");
      return;
    }

    setUpdatingId(selectedApp._id);
    try {
      const response = await API.put(`/application/${selectedApp._id}/status`, {
        adminStatus: reviewStatus,
        massage: reviewMessage
      });
      
      if (response.data && response.data.status === "success") {
        setModalSuccess("تم تحديث حالة الطلب بنجاح");
        
        setApplications((prev) => 
          prev.map((app) => 
            app._id === selectedApp._id 
              ? { ...app, adminStatus: reviewStatus, massage: reviewMessage } 
              : app
          )
        );

        setTimeout(() => {
          setSelectedApp(null);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setModalError(err.response.data.message);
      } else {
        setModalError("حدث خطأ أثناء تحديث حالة الطلب");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:3000${path}`;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 0 80px" }}>
      
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "var(--primary-color)" }}>
            لوحة تحكم إدارة القبول والتنسيق
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            إدارة ومراجعة طلبات الالتحاق بجميع الكليات والتأكد من توافق الشروط الأكاديمية والمالية.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: "20px", marginBottom: "32px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            
            <div style={{ flex: 2, minWidth: "200px" }}>
              <Input
                label="بحث باسم الطالب"
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="أدخل اسم الطالب للبحث..."
                style={{ height: "42px" }}
              />
            </div>

            <div style={{ flex: 1, minWidth: "150px", display: "flex", flexDirection: "column" }}>
              <label htmlFor="filterFaculty">تصفية حسب الكلية</label>
              <select 
                id="filterFaculty"
                value={facultyId}
                onChange={(e) => { setFacultyId(e.target.value); setCurrentPage(1); }}
                style={{ height: "42px" }}
              >
                <option value="">جميع الكليات</option>
                {faculties.map((f) => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: "150px", display: "flex", flexDirection: "column" }}>
              <label htmlFor="filterPayment">حالة السداد</label>
              <select
                id="filterPayment"
                value={paymentStatus}
                onChange={(e) => { setPaymentStatus(e.target.value); setCurrentPage(1); }}
                style={{ height: "42px" }}
              >
                <option value="">الكل</option>
                <option value="PAID">تم الدفع</option>
                <option value="UNPAID">غير مدفوع</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: "150px", display: "flex", flexDirection: "column" }}>
              <label htmlFor="filterAdmin">القبول الإداري</label>
              <select
                id="filterAdmin"
                value={adminStatus}
                onChange={(e) => { setAdminStatus(e.target.value); setCurrentPage(1); }}
                style={{ height: "42px" }}
              >
                <option value="">الكل</option>
                <option value="PENDING">قيد الانتظار</option>
                <option value="ACCEPTED">مقبول</option>
                <option value="REJECTED">مرفوض</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: "120px" }}>
              <Input
                label="الحد الأدنى للمجموع (%)"
                id="minPercentage"
                type="number"
                value={minPercentage}
                onChange={(e) => { setMinPercentage(e.target.value); setCurrentPage(1); }}
                placeholder="أكبر من"
                style={{ height: "42px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button type="submit" variant="primary" style={{ height: "42px", padding: "0 24px" }}>
                <Search size={18} />
                <span>بحث</span>
              </Button>
            </div>

          </div>
        </form>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <Loader style={{ animation: "spin 1s linear infinite", color: "var(--accent-color)" }} size={32} />
        </div>
      ) : applications.length === 0 ? (
        <div className="card text-center" style={{ padding: "64px 32px" }}>
          <ShieldAlert size={48} style={{ color: "var(--text-light)", marginBottom: "16px", display: "inline-block" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>لا توجد طلبات تقديم مطابقة للبحث</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            جرب تعديل خيارات البحث أو التصفية للوصول لنتائج أخرى.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card" style={{ padding: 0, overflowX: "auto", margin: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "right" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--primary-color)", color: "#ffffff", borderBottom: "2px solid var(--border-color)" }}>
                  <th style={{ padding: "16px 20px" }}>اسم الطالب</th>
                  <th style={{ padding: "16px 20px" }}>الكلية المطلوبة</th>
                  <th style={{ padding: "16px 20px" }}>النسبة المئوية</th>
                  <th style={{ padding: "16px 20px" }}>حالة الدفع</th>
                  <th style={{ padding: "16px 20px" }}>القبول الإداري</th>
                  <th style={{ padding: "16px 20px" }}>تاريخ الطلب</th>
                  <th style={{ padding: "16px 20px", textAlign: "center" }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const student = app.studentDataId;
                  const fullName = student 
                    ? `${student.firstName} ${student.secondName} ${student.thirdName || ""} ${student.fourthName}`.replace(/\s+/g, " ")
                    : "بيانات الطالب مفقودة";

                  return (
                    <tr key={app._id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fdfbf7"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "16px 20px", fontWeight: 600 }}>{fullName}</td>
                      <td style={{ padding: "16px 20px" }}>{app.facultyId?.name || "مفقود"}</td>
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "var(--primary-color)" }}>
                        {student ? `${student.percentage}%` : "—"}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <StatusBadge type="payment" value={app.paymentStatus} />
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <StatusBadge type="admin" value={app.adminStatus} />
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        {new Date(app.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <Button 
                          onClick={() => handleOpenReview(app)} 
                          variant="secondary"
                          style={{ padding: "6px 14px", fontSize: "13px", height: "34px" }}
                        >
                          <Eye size={14} />
                          <span>مراجعة المستندات</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "16px" }}>
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                variant="secondary"
                style={{ padding: "8px 12px" }}
              >
                <ChevronRight size={18} />
                <span>السابق</span>
              </Button>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                صفحة {currentPage} من {pagination.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                variant="secondary"
                style={{ padding: "8px 12px" }}
              >
                <span>التالي</span>
                <ChevronLeft size={18} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Review details Modal */}
      {selectedApp && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          zIndex: 9999,
          padding: "16px",
          pointerEvents: "none",
          overflowY: "auto",
        }}
        onClick={() => setSelectedApp(null)}>
          <div 
            className="card animate-fade-in" 
            style={{
              width: "100%",
              maxWidth: "950px",
              maxHeight: "90vh",
              overflowY: "auto",
              margin: "80px auto 20px auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              pointerEvents: "auto",
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "16px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                تفاصيل مراجعة طلب الالتحاق
              </h3>
              <button 
                onClick={() => setSelectedApp(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <X size={24} />
              </button>
            </div>

            {modalError && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "var(--error-bg)",
                color: "var(--error-color)",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                marginBottom: "20px"
              }}>
                <ShieldAlert size={18} />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "var(--success-bg)",
                color: "var(--success-color)",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                fontSize: "14px",
                marginBottom: "20px"
              }}>
                <CheckCircle2 size={18} />
                <span>{modalSuccess}</span>
              </div>
            )}

            {/* Modal Content - Two columns */}
            <div className="grid grid-cols-2" style={{ gap: "32px", marginBottom: "32px" }}>
              
              {/* Left column: Student & Parent Info */}
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  بيانات الطالب الشخصية
                </h4>
                {selectedApp.studentDataId ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>الاسم بالكامل:</span>
                      <span style={{ fontWeight: 600 }}>
                        {`${selectedApp.studentDataId.firstName} ${selectedApp.studentDataId.secondName} ${selectedApp.studentDataId.thirdName || ""} ${selectedApp.studentDataId.fourthName}`}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>النسبة المئوية:</span>
                      <span style={{ fontWeight: 700, color: "var(--accent-color)" }}>{selectedApp.studentDataId.percentage}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>مجموع الدرجات:</span>
                      <span>{selectedApp.studentDataId.score} درجة</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>رقم الهاتف:</span>
                      <span>{selectedApp.studentDataId.phone}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>واتساب:</span>
                      <span>{selectedApp.studentDataId.whatsapp}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>البريد الإلكتروني:</span>
                      <span>{selectedApp.studentDataId.email}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>تاريخ الميلاد:</span>
                      <span>{new Date(selectedApp.studentDataId.birthDate).toLocaleDateString("ar-EG")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>العنوان:</span>
                      <span>{selectedApp.studentDataId.address}</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "var(--error-color)" }}>لم يكمل الطالب ملء الملف الشخصي!</p>
                )}

                <h4 style={{ fontSize: "15px", fontWeight: 700, marginTop: "24px", marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  بيانات ولي الأمر
                </h4>
                {selectedApp.studentDataId?.parent ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>اسم ولي الأمر:</span>
                      <span style={{ fontWeight: 600 }}>{selectedApp.studentDataId.parent.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>صلة القرابة:</span>
                      <span>{selectedApp.studentDataId.parent.relation}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>رقم هاتف ولي الأمر:</span>
                      <span>{selectedApp.studentDataId.parent.phone}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>الرقم القومي لولي الأمر:</span>
                      <span>{selectedApp.studentDataId.parent.nationalID}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-secondary)" }}>عنوان ولي الأمر:</span>
                      <span>{selectedApp.studentDataId.parent.address}</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "var(--text-secondary)" }}>لا يوجد بيانات</p>
                )}
              </div>

              {/* Right column: Documents and Decision */}
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  الوثائق المرفوعة (صور)
                </h4>
                
                {selectedApp.studentDataId ? (
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "32px" }}>
                    {/* National ID Thumbnail */}
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
                        onClick={() => setPreviewImage(getImageUrl(selectedApp.studentDataId.nationalIdImage))}
                      >
                        <img
                          src={getImageUrl(selectedApp.studentDataId.nationalIdImage)}
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

                    {/* Certificate Thumbnail */}
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
                        onClick={() => setPreviewImage(getImageUrl(selectedApp.studentDataId.certificateImage))}
                      >
                        <img
                          src={getImageUrl(selectedApp.studentDataId.certificateImage)}
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
                ) : (
                  <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>لا يوجد ملفات مرفوعة</p>
                )}

                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  اتخاذ قرار بشأن الطلب
                </h4>

                <form onSubmit={handleUpdateStatus} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="reviewStatus">حالة القبول الإداري</label>
                    <select
                      id="reviewStatus"
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    >
                      <option value="PENDING">قيد الانتظار (PENDING)</option>
                      <option value="ACCEPTED">موافقة مبدئية وقبول (ACCEPTED)</option>
                      <option value="REJECTED">رفض الطلب (REJECTED)</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="reviewMessage">رسالة مكتب القبول (تظهر للطالب)</label>
                    <textarea
                      id="reviewMessage"
                      value={reviewMessage}
                      onChange={(e) => setReviewMessage(e.target.value)}
                      placeholder="مثال: يرجى الحضور لمقر الجامعة ومعك أصول الأوراق يوم الأحد القادم."
                      rows={4}
                      style={{ width: "100%", padding: "12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", resize: "none", fontSize: "14px", fontFamily: "var(--font-family)" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Button 
                      onClick={() => setSelectedApp(null)} 
                      variant="secondary"
                      style={{ padding: "10px 20px" }}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      loading={updatingId !== null}
                      style={{ padding: "10px 24px" }}
                    >
                      <span>تأكيد وحفظ القرار</span>
                    </Button>
                  </div>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Image Preview Modal (Lightbox) - زر الإغلاق في أعلى يمين الصورة مع هامش علوي */}
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
            zIndex: 10000,
            padding: "40px 20px",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "95vw",
              maxHeight: "calc(100vh - 120px)",
              backgroundColor: "transparent",
              padding: "0",
              cursor: "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "80px", // مسافة من الأعلى لتجنب الهيدر
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق في أعلى يمين الصورة */}
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                borderRadius: "8px",
                overflow: "hidden",
                maxWidth: "95vw",
                maxHeight: "calc(100vh - 120px)",
              }}
            >
              <img
                src={previewImage}
                alt="معاينة المستند"
                style={{
                  maxWidth: "95vw",
                  maxHeight: "calc(100vh - 120px)",
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