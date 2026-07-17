import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  error = "",
  helperText = "",
  style = {},
  containerStyle = {},
  ...props
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", ...containerStyle }}>
      {label && (
        <label htmlFor={id} style={{ display: "block", marginBottom: "6px" }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        style={{
          borderColor: error ? "var(--error-color)" : "var(--border-color)",
          boxShadow: error ? "0 0 0 2px rgba(186, 26, 26, 0.1)" : undefined,
          ...style
        }}
        {...props}
      />
      {error ? (
        <span style={{
          color: "var(--error-color)",
          fontSize: "12px",
          marginTop: "4px",
          fontWeight: 500
        }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{
          color: "var(--text-secondary)",
          fontSize: "12px",
          marginTop: "4px"
        }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
