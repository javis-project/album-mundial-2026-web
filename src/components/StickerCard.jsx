import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { TEAM_NAMES } from "../core/constants";

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

  const handleCardClick = (e) => {
    // If clicking overlays buttons, skip toggle
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
      {/* Code prefix (top left) - Only shown for special categories (FWC / LEG) */}
      <span className="sticker-code">{isSpecial ? prefix : ""}</span>
      
      {/* Quantity badge (top right) */}
      {count > 0 && (
        <div className="sticker-qty-badge">
          {count}
        </div>
      )}

      {/* Large sticker number in the center (Image 2 style) */}
      <div className="sticker-number">
        {num}
      </div>

      {/* Card category display (bottom label) */}
      <span className="sticker-label">
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
