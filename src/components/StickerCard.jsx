import React from "react";
import { Plus, Minus } from "lucide-react";
import { TEAM_NAMES, TEAM_COLORS } from "../core/constants";

export default function StickerCard({ code, count, onAdd, onSubtract }) {
  const isSpecial = code === "00" || code.startsWith("FWC") || code.startsWith("CC");
  const isOwned = count > 0;
  const isDuplicate = count > 1;

  // Split and format the code (e.g., "FWC15" -> FWC, 15, Copa Mundial)
  const parseCode = (stickerCode) => {
    if (stickerCode === "00") {
      return {
        prefix: "",
        num: "00",
        label: "Cromo Inicial"
      };
    }
    if (stickerCode.startsWith("FWC")) {
      return {
        prefix: "FWC",
        num: stickerCode.replace("FWC", ""),
        label: "Copa Mundial"
      };
    }
    if (stickerCode.startsWith("CC")) {
      return {
        prefix: "CC",
        num: stickerCode.replace("CC", ""),
        label: "Coca-Cola"
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

  const cardStyle = isOwned && !isSpecial ? {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}c0 60%, #0c0f16 100%)`,
    borderColor: primaryColor,
    boxShadow: `0 4px 15px rgba(0, 0, 0, 0.4), 0 0 12px ${primaryColor}30`,
  } : {};

  const handleClick = (e) => {
    if (e.target.closest(".sticker-card-subtract-btn")) {
      return;
    }
    onAdd();
  };

  return (
    <div
      onClick={handleClick}
      className={`sticker-card ${isOwned ? "owned" : ""} ${isSpecial ? "special" : ""} ${isDuplicate ? "duplicate" : ""}`}
      style={cardStyle}
    >
      {/* Subtract button (top left) - Only shown when owned */}
      {isOwned && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering onAdd click
            onSubtract();
          }}
          className="sticker-card-subtract-btn"
          title="Restar cromo"
        >
          <Minus size={10} strokeWidth={3} />
        </button>
      )}

      {/* Code prefix (top center) - Only shown for special categories (FWC / CC) */}
      {isSpecial && (
        <span className="sticker-code">
          {prefix}
        </span>
      )}
      
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
    </div>
  );
}
