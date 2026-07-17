import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary', 'accent', 'secondary', 'danger'
  disabled = false,
  loading = false,
  style = {},
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant}`}
      style={{
        opacity: disabled || loading ? 0.6 : 1,
        position: "relative",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        ...style
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "16px",
            height: "16px",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginLeft: "8px"
          }}
        />
      )}
      {children}
      
      {/* Dynamic spinner animation declaration */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
