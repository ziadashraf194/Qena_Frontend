import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, CreditCard, RefreshCw, Eye, MessageSquare, Clock, Copy, Check, Loader, AlertCircle } from "lucide-react";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Stepper from "../components/Stepper";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fawry Payment Modal State
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loadingPaymentId, setLoadingPaymentId] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchApplications = () => {
    setLoading(true);
    API.get("/application/my-applications")
      .then((res) => {
        if (res.data && res.data.status === "success") {
          setApplications(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("فشل تحميل طلبات التقديم الخاصة بك");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handlePay = async (appId) => {
    setError("");
    setLoadingPaymentId(appId);
    try {
      const response = await API.post("/fawry/initiate", { applicationId: appId });
      if (response.data && response.data.status === "success") {
        setPaymentDetails({
          appId,
          ...response.data.data
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("فشل الاتصال بسيرفر فوري لتوليد كود الدفع. الرجاء المحاولة مرة أخرى.");
      }
    } finally {
      setLoadingPaymentId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine current stepper state based on applications
  // If we have applications, check if any is paid
  const hasPaid = applications.some(app => app.paymentStatus === "PAID");
  const hasApproved = applications.some(app => app.adminStatus === "ACCEPTED");
  
  let currentStep = 2; // Submitted profile (1) and select faculty (2)
  if (applications.length > 0) {
    currentStep = 3; // Submitted applications (3)
  }
  if (hasPaid) {
    currentStep = 4; // Fees paid -> Admin review (4)
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
        <Loader style={{ animation: "spin 1s linear infinite", color: "var(--accent-color)" }} size={32} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 0 80px" }}>
      <Stepper currentStep={currentStep} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary-color)" }}>
            طلبات التقديم الأكاديمية
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            تابع حالة دفع ومراجعة طلباتك المقدمة لكليات جامعة قنا.
          </p>
        </div>
        <Button onClick={fetchApplications} variant="secondary" style={{ padding: "8px 16px" }}>
          <RefreshCw size={16} />
          <span>تحديث الحالة</span>
        </Button>
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
          marginBottom: "24px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card text-center" style={{ padding: "64px 32px" }}>
          <FileText size={48} style={{ color: "var(--text-light)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>لا يوجد طلبات تقديم حالية</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            لم تقم بالتقديم على أي كليات حتى الآن. يرجى التوجه لصفحة التقديم لتسجيل رغبتك.
          </p>
          <Link to="/apply" className="btn btn-primary">
            تقديم طلب التحاق جديد
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {applications.map((app) => (
            <div key={app._id} className="card" style={{
              margin: 0,
              borderRight: app.paymentStatus === "PAID" ? "6px solid var(--success-color)" : "6px solid var(--pending-color)",
              position: "relative"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "24px"
              }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary-color)", marginBottom: "8px" }}>
                    {app.facultyId?.name || "اسم الكلية غير متوفر"}
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "16px" }}>
                    تاريخ التقديم: {new Date(app.createdAt).toLocaleDateString("ar-EG")}
                  </span>

                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>رسوم التقديم</span>
                      <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>
                        {app.facultyId?.applicationFee} جنيه مصري
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>حالة الدفع</span>
                      <StatusBadge type="payment" value={app.paymentStatus} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>حالة القبول الإداري</span>
                      <StatusBadge type="admin" value={app.adminStatus} />
                    </div>
                  </div>
                </div>

                {/* Left side actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
                  {app.paymentStatus === "UNPAID" && (
                    <Button
                      onClick={() => handlePay(app._id)}
                      variant="accent"
                      loading={loadingPaymentId === app._id}
                      style={{ height: "42px" }}
                    >
                      <CreditCard size={18} />
                      <span>دفع الرسوم عبر فوري</span>
                    </Button>
                  )}
                  {app.paymentStatus === "PAID" && app.successfulTransactionId && (
                    <div style={{ fontSize: "12px", color: "var(--success-color)", fontWeight: 500, textAlign: "left" }}>
                      رقم المعاملة: {app.successfulTransactionId}
                    </div>
                  )}
                </div>
              </div>

              {/* Admin response message */}
              {app.massage && (
                <div style={{
                  marginTop: "20px",
                  padding: "16px",
                  backgroundColor: "var(--bg-color)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}>
                  <MessageSquare size={18} style={{ color: "var(--accent-color)", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-color)", display: "block", marginBottom: "4px" }}>
                      رسالة مكتب القبول والتنسيق:
                    </span>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                      {app.massage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fawry Payment Details Modal / Expanded Section */}
      {paymentDetails && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: "16px"
        }}>
          <div className="card animate-fade-in" style={{
            width: "100%",
            maxWidth: "500px",
            margin: 0,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary-color)", marginBottom: "16px", textAlign: "center" }}>
              بيانات الدفع عبر فوري
            </h3>
            
            <div style={{
              backgroundColor: "var(--bg-color)",
              padding: "24px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  كود الدفع المرجعي (Fawry Reference Number)
                </span>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px"
                }}>
                  <span style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "var(--primary-color)",
                    letterSpacing: "1px"
                  }}>
                    {paymentDetails.fawryReferenceNumber}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(paymentDetails.fawryReferenceNumber)} 
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: "4px",
                      color: copied ? "var(--success-color)" : "var(--text-secondary)"
                    }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>المبلغ الكلي المطلوب:</span>
                <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>{paymentDetails.amount} جنيه</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={16} />
                  <span>تاريخ انتهاء كود الدفع:</span>
                </span>
                <span style={{ fontWeight: 600, color: "var(--error-color)" }}>
                  {new Date(paymentDetails.expiryDate).toLocaleDateString("ar-EG")} {new Date(paymentDetails.expiryDate).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: "1.8",
              marginBottom: "24px",
              padding: "12px",
              borderLeft: "4px solid var(--accent-color)",
              backgroundColor: "var(--pending-bg)"
            }}>
              <strong>خطوات الدفع:</strong> توجه لأي منفذ بيع تجزئة يحتوي ماكينة فوري (سوبر ماركت، صيدلية) أو استخدم تطبيق Fawry Pay، واطلب الدفع لصالح خدمات جامعة قنا الأهلية باستخدام <strong>كود الدفع المرجعي</strong> الموضح أعلاه.
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={() => setPaymentDetails(null)} variant="primary" style={{ width: "100%" }}>
                إغلاق النافذة
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
