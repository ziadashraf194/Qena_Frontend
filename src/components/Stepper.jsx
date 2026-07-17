import React from "react";
import { Check } from "lucide-react";

export default function Stepper({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: "البيانات الشخصية" },
    { number: 2, label: "اختيار الكلية" },
    { number: 3, label: "سداد الرسوم" },
    { number: 4, label: "مراجعة القبول" }
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "24px 0",
      marginBottom: "32px",
      position: "relative"
    }}>
      {/* Background Line */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "var(--border-color)",
        zIndex: 1,
        transform: "translateY(-50%)"
      }} />

      {/* Progress Line */}
      <div style={{
        position: "absolute",
        top: "50%",
        right: 0,
        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
        height: "2px",
        backgroundColor: "var(--accent-color)",
        zIndex: 2,
        transform: "translateY(-50%)",
        transition: "width 0.3s ease"
      }} />

      {steps.map((step) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 3,
            position: "relative"
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: isCompleted 
                ? "var(--accent-color)" 
                : isActive 
                  ? "var(--primary-color)" 
                  : "#ffffff",
              border: `2px solid ${
                isCompleted 
                  ? "var(--accent-color)" 
                  : isActive 
                    ? "var(--primary-color)" 
                    : "var(--border-color)"
              }`,
              color: isCompleted
                ? "var(--primary-color)"
                : isActive
                  ? "#ffffff"
                  : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "14px",
              marginBottom: "8px",
              transition: "all 0.3s ease"
            }}>
              {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
            </div>
            <span style={{
              fontSize: "13px",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
              whiteSpace: "nowrap"
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
