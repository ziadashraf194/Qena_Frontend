import React from "react";

export default function StatusBadge({ type, value }) {
  // Normalize value to uppercase
  const val = String(value || "").toUpperCase();

  let text = val;
  let badgeClass = "badge-pending";

  if (type === "payment") {
    switch (val) {
      case "PAID":
        text = "تم الدفع";
        badgeClass = "badge-success";
        break;
      case "UNPAID":
        text = "غير مدفوع";
        badgeClass = "badge-error";
        break;
      default:
        text = "غير معروف";
    }
  } else if (type === "admin") {
    switch (val) {
      case "PENDING":
        text = "قيد المراجعة";
        badgeClass = "badge-pending";
        break;
      case "ACCEPTED":
        text = "مقبول مبدئياً";
        badgeClass = "badge-success";
        break;
      case "REJECTED":
        text = "مرفوض";
        badgeClass = "badge-error";
        break;
      default:
        text = "غير معروف";
    }
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {text}
    </span>
  );
}
