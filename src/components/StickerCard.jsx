import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function StickerCard({ code, count, onAdd, onSubtract }) {
  const [activeTouch, setActiveTouch] = useState(false);
  const isSpecial = code.startsWith("FWC") || code.startsWith("LEG");
  const isOwned = count > 0;
  const isDuplicate = count > 1;

  const handleCardClick = (e) => {
    // If clicking the buttons, don't do anything here
    if (e.target.closest(".overlay-btn")) {
      return;
    }
    setActiveTouch(!activeTouch);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseLeave={() => setActiveTouch(false)}
      className={`sticker-card ${isOwned ? "owned" : ""} ${isSpecial ? "special" : ""} ${isDuplicate ? "duplicate" : ""} ${activeTouch ? "active-touch" : ""}`}
    >
      {/* Code */}
      <span className="sticker-code">{code}</span>
      
      {/* Quantity badge */}
      {count > 0 && (
        <div className="sticker-qty-badge">
          {count}
        </div>
      )}

      {/* Card center decoration */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1, margin: "6px 0" }}>
        {isSpecial ? (
          <span style={{ fontSize: "1.1rem", filter: "drop-shadow(0 0 5px var(--gold-glow))" }}>⭐</span>
        ) : (
          <span style={{ fontSize: "0.85rem", color: "var(--slate-light)" }}>⚽</span>
        )}
      </div>

      {/* Card category display */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.65rem", color: "var(--slate-text)" }}>
          {isSpecial ? (code.startsWith("LEG") ? "LEYENDA" : "FWC") : "COMÚN"}
        </span>
      </div>

      {/* Overlay controls */}
      <div className="sticker-card-overlay">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (count > 0) onSubtract();
          }}
          className="overlay-btn btn-dec"
          title="Restar cromo"
          disabled={count === 0}
          style={{ opacity: count === 0 ? 0.3 : 1, cursor: count === 0 ? "not-allowed" : "pointer" }}
        >
          <Minus size={16} />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="overlay-btn btn-inc"
          title="Sumar cromo"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
