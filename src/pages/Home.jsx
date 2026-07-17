import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Users, Compass, ShieldAlert, CheckCircle, GraduationCap, ArrowLeft, Loader } from "lucide-react";
import API from "../services/api";

export default function Home() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/faculty")
      .then((res) => {
        if (res.data && res.data.status === "success") {
          setFaculties(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching faculties:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in home-page">
      
      {/* Hero Section */}
      <section className="home-hero">
        {/* Subtle geometric gold design elements in background */}
        <div style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(246, 195, 56, 0.1) 0%, transparent 70%)"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-80px",
          right: "-30px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(246, 195, 56, 0.08) 0%, transparent 70%)"
        }} />

        <div className="container home-hero-content">
          <span className="home-hero-badge">
            التسجيل للعام الأكاديمي الجديد
          </span>
          <h1 className="home-hero-title">
            مستقبلك الأكاديمي يبدأ من هنا في <span style={{ color: "var(--accent-color)" }}>جامعة قنا الأهلية</span>
          </h1>
          <p className="home-hero-desc">
            تعلن جامعة قنا الأهلية عن فتح باب القبول للطلاب الحاصلين على شهادة الثانوية العامة والشهادات المعادلة للالتحاق بكلياتها المتميزة. سارع بملء بياناتك والتقديم.
          </p>
          <div className="home-hero-actions">
            <Link to="/register" className="btn btn-accent home-hero-btn">
              <span>أنشئ حسابك وابدأ التقديم</span>
              <ArrowLeft size={18} />
            </Link>
            <a href="#faculties" className="btn btn-secondary home-hero-btn" style={{ color: "#ffffff", borderColor: "#ffffff" }}>
              استكشف الكليات
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container">
        <div className="home-stats-grid">
          {[
            { value: "+25", label: "برنامج أكاديمي متميز", icon: <BookOpen size={24} /> },
            { value: "12k+", label: "طالب وباحث نشط", icon: <Users size={24} /> },
            { value: "+2050", label: "خريج في سوق العمل", icon: <GraduationCap size={24} /> }
          ].map((stat, i) => (
            <div key={i} className="card text-center" style={{
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)",
              borderBottom: "3px solid var(--accent-color)",
              padding: "32px 24px"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(246, 195, 56, 0.1)",
                color: "var(--primary-color)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px"
              }}>
                {stat.icon}
              </div>
              <h3 className="home-stat-value">
                {stat.value}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About & Vision Section */}
      <section className="container">
        <div className="home-about-grid">
          <div>
            <h2 className="home-section-title">
              جامعة قنا الأهلية: منارة العلم والتميز
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8", marginBottom: "24px" }}>
              تم إنشاء جامعة جنوب الوادي الأهلية بموجب القرار الجمهوري رقم 420 لعام 2022 كخطوة للتوسع في مجال إتاحة التعليم العالي، وإتاحة فرص تعليمية جديدة لأبناء الوطن بالجامعات المصرية، والتي تسير وفق ما هو مخطط له، وتعتبر نموذجاً مميزاً على مستوى هذا النوع من المشروعات القومية.
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8" }}>
              وتقع داخل الحرم الجامعي الرئيسي لجامعة جنوب الوادي على مساحة 41 فداناً، ولها سور وبوابة مستقلة على طريق "قنا - سفاجا السياحي"، وملاصقة للمدينة الطبية للجامعة الأم لتقديم أفضل التدريبات العملية.
            </p>
          </div>
          <div className="grid" style={{ gap: "20px" }}>
            {[
              { title: "رؤيتنا", text: "أن نكون مؤسسة تعليمية رائدة عالمياً، تساهم في بناء مجتمع المعرفة من خلال التميز في التعليم والبحث العلمي.", icon: <Compass size={20} /> },
              { title: "رسالتنا", text: "تقديم برامج أكاديمية متميزة تلبي احتياجات سوق العمل، وتعزيز بيئة محفزة للابتكار والخدمة المجتمعية في صعيد مصر.", icon: <Award size={20} /> },
              { title: "أهدافنا", text: "تطوير المهارات الطلابية، دعم البحث التطبيقي، وتحقيق الريادة في التحول الرقمي الأكاديمي الشامل.", icon: <CheckCircle size={20} /> }
            ].map((item, i) => (
              <div key={i} className="card home-vision-card">
                <div style={{
                  padding: "10px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--primary-color)",
                  color: "#ffffff"
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>{item.title}</h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculties Section */}
      <section id="faculties" className="container" style={{ scrollMarginTop: "100px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 className="home-section-title" style={{ textAlign: "center" }}>
            كليات الجامعة المتاحة للتقديم
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
            تضم الجامعة مجموعة من الكليات الرائدة المصممة خصيصاً لتأهيل الطلاب لسوق العمل المحلي والإقليمي.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
            <Loader className="animate-spin" size={32} style={{ color: "var(--accent-color)" }} />
            <style>{`
              .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {faculties.length > 0 ? (
              faculties.map((fac) => (
                <div key={fac._id} className="card" style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  margin: 0
                }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "var(--primary-color)" }}>
                      {fac.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>الحد الأدنى للمجموع:</span>
                        <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>{fac.minPercentage}%</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>رسوم تقديم الطلب:</span>
                        <span style={{ fontWeight: 600, color: "var(--accent-color)" }}>{fac.applicationFee} جنيه مصري</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/apply" className="btn btn-primary" style={{ width: "100%" }}>
                    قدّم الآن
                  </Link>
                </div>
              ))
            ) : (
              // Fallback list if DB contains no seeded faculties
              [
                { name: "كلية الطب البشري والجراحة", min: 80, fee: 1000 },
                { name: "كلية الهندسة والذكاء الاصطناعي", min: 70, fee: 800 },
                { name: "كلية الحاسبات والذكاء الاصطناعي", min: 65, fee: 600 }
              ].map((item, i) => (
                <div key={i} className="card" style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  margin: 0
                }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "var(--primary-color)" }}>
                      {item.name}
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>الحد الأدنى للمجموع:</span>
                        <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>{item.min}%</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>رسوم تقديم الطلب:</span>
                        <span style={{ fontWeight: 600, color: "var(--accent-color)" }}>{item.fee} جنيه</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/apply" className="btn btn-primary" style={{ width: "100%" }}>
                    قدّم الآن
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Conditions Section */}
      <section id="conditions" className="container" style={{ scrollMarginTop: "100px" }}>
        <div className="card home-conditions-card">
          <div className="home-conditions-header">
            <ShieldAlert size={28} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>شروط وأحكام عامة للقبول</h2>
          </div>
          <ul style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "15px",
            color: "var(--text-secondary)",
            paddingRight: "20px"
          }}>
            <li>يجب ملء البيانات الشخصية وملف الطالب بالكامل كخطوة أولى أساسية قبل التقدم لأي رغبة.</li>
            <li>يجب أن يتطابق المجموع والنسبة المئوية مع الأوراق الرسمية المرفوعة (صورة شهادة الثانوية وصورة بطاقة الرقم القومي).</li>
            <li>لن يُقبل طلب التقديم ما لم يسدد الطالب رسوم التقديم المقررة للكلية عبر نظام فوري خلال 3 أيام من إصدار كود الدفع.</li>
            <li>تعتبر كافة طلبات التقديم معلقة مبدئياً لحين مراجعة البيانات ومطابقتها بمعرفة مكتب التنسيق والقبول بالجامعة.</li>
          </ul>
        </div>
      </section>

    </div>
  );
}
