import React from "react";

export default function MetricCard({ title, value, subtitle, icon: Icon, progress, goldStyle }) {
  return (
    <div className={`glass-panel metric-card ${goldStyle ? "gold-style" : ""}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className="metric-icon-box">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div>
        <div className="metric-value" style={goldStyle ? { color: "var(--gold)" } : {}}>
          {value}
        </div>
        {subtitle && <div className="metric-subtitle">{subtitle}</div>}
        
        {progress !== undefined && (
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
