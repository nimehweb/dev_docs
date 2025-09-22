import React from "react";

export default function ComingSoon({ pageName }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "80vh",
      textAlign: "center",
      color: "#555"
    }}>
      <img
        src="https://stories.freepiklabs.com/storage/14449/Under-Construction_Mesa-de-trabajo-1.svg"
        alt="Page Under Construction"
        style={{ width: "350px", marginBottom: "20px" }}
      />
      <h2>{pageName} Page Coming Soon 🚀</h2>
      <p>We’re working hard to bring this feature to you.</p>
    </div>
  );
}