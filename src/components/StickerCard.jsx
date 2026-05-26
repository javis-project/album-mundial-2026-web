import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { TEAM_NAMES, TEAM_COLORS } from "../core/constants";

export default function StickerCard({ code, count, onAdd, onSubtract }) {
  const [activeTouch, setActiveTouch] = useState(false);
  const isSpecial = code.startsWith("FWC") || code.startsWith("LEG");
  const isOwned = count > 0;
  const isDuplicate = count > 1;

  // Split and format the code (e.g., "FWC15" -> FWC, 15, Copa Mundial)
  const parseCode = (stickerCode) => {
    if (stickerCode.startsWith("FWC")) {
      return {
        prefix: "FWC",
        num: stickerCode.replace("FWC", ""),
        label: "Copa Mundial"
      };
    }
    if (stickerCode.startsWith("LEG")) {
      return {
        prefix: "LEG",
        num: stickerCode.replace("LEG", ""),
        label: "Leyendas"
      };
    }
    const prefix = stickerCode.slice(0, 3);
    const num = stickerCode.slice(3);
    return {
      prefix,
      num,
      label: TEAM_NAMES[prefix] || prefix
    };
  };

  const { prefix, num, label } = parseCode(code);
  const colors = TEAM_COLORS[prefix] || ["#334155", "#475569"];
  const primaryColor = colors[0];

  const handleCardClick = (e) => {
    // If clicking overlays buttons, skip toggle
    if (e.target.closest(".overlay-btn")) {
      return;
    }
    setActiveTouch(!activeTouch);
  };

  const cardStyle = isOwned && !isSpecial ? {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}c0 60%, #0c0f16 100%)`,
    borderColor: primaryColor,
    boxShadow: `0 4px 15px rgba(0, 0, 0, 0.4), 0 0 12px ${primaryColor}30`,
  } : {};

  return (
    <div
      onClick={handleCardClick}
      onMouseLeave={() => setActiveTouch(false)}
      className={`sticker-card ${isOwned ? "owned" : ""} ${isSpecial ? "special" : ""} ${isDuplicate ? "duplicate" : ""} ${activeTouch ? "active-touch" : ""}`}
      style={cardStyle}
    >
      {/* Code prefix (top left) - Only shown for special categories (FWC / LEG) */}
      <span className="sticker-code">{isSpecial ? prefix : ""}</span>
      
      {/* Quantity badge (top right) */}
      {count > 0 && (
        <div className="sticker-qty-badge">
          {count}
        </div>
      )}

      {/* Large sticker number in the center (Image 2 style) */}
      <div 
        className="sticker-number"
        style={isOwned && !isSpecial ? { color: "#ffffff", textShadow: "0 2px 5px rgba(0,0,0,0.85)" } : {}}
      >
        {num}
      </div>

      {/* Card category display (bottom label) */}
      <span 
        className="sticker-label"
        style={isOwned && !isSpecial ? { color: "rgba(255, 255, 255, 0.9)", textShadow: "0 1px 3px rgba(0,0,0,0.85)" } : {}}
      >
        {label}
      </span>

      {/* Hover/Tap Overlay Controls */}
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
