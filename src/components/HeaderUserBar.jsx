import React from "react";

export default function HeaderUserBar({ userName = "John Doe", avatarUrl }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {/* GitHub Icon */}
      <button style={{ background: "none", border: "none", cursor: "pointer" }}>
        <svg width="24" height="24" fill="currentColor">
          <path d="M12 0.3a12 12 0 0 0-3.8 23.4c0.6 0.1 0.8-0.3 0.8-0.6v-2.2c-3.3 0.7-4-1.6-4-1.6-0.5-1.2-1.2-1.5-1.2-1.5-1-0.7 0.1-0.7 0.1-0.7 1.1 0.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2 0.9 0.1-0.7 0.4-1.2 0.7-1.5-2.7-0.3-5.5-1.3-5.5-5.7 0-1.3 0.5-2.3 1.1-3.2-0.1-0.3-0.5-1.5 0.1-3.1 0 0 0.9-0.3 3.2 1.1a11 11 0 0 1 5.8 0c2.3-1.4 3.2-1.1 3.2-1.1 0.6 1.6 0.2 2.8 0.1 3.1 0.7 0.9 1.1 2 1.1 3.2 0 4.4-2.8 5.4-5.5 5.7 0.4 0.3 0.8 1 0.8 2v3c0 0.3 0.2 0.7 0.8 0.6A12 12 0 0 0 12 0.3"/>
        </svg>
      </button>

      {/* Notification Icon with Badge */}
      <div style={{ position: "relative" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}>
          <svg width="24" height="24" fill="currentColor">
            <path d="M12 24a2.4 2.4 0 0 0 2.4-2.4h-4.8A2.4 2.4 0 0 0 12 24zm6-6v-5a6 6 0 0 0-5-5.9V6a1 1 0 1 0-2 0v1.1A6 6 0 0 0 6 13v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
        {/* Badge */}
        <span style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "#1976d2",
          color: "#fff",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "12px"
        }}>2</span>
      </div>

      {/* Avatar */}
      <img
        src={avatarUrl || "https://avatars.githubusercontent.com/u/583231?v=4"}
        alt="avatar"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid #b3e5fc",
          background: "#fff"
        }}
      />

      {/* User Name */}
      <span style={{ fontWeight: "500" }}>{userName}</span>
    </div>
  );
}