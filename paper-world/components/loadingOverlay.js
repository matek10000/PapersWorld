import React from "react";
import "../styles/loading.css"; // Import stylów animacji

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Ładowanie...</p>
    </div>
  );
};

export default LoadingOverlay;
