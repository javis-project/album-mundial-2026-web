import React, { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import StickerCard from "../components/StickerCard";
import { GROUPS, TEAM_NAMES, TEAM_EMOJIS, TEAM_COLORS, STICKER_CODES } from "../core/constants";

export default function AlbumView({ state, onAddSticker, onSubtractSticker, activeGroup, setActiveGroup }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'missing', 'owned', 'duplicates'

  const groupTabs = [
    "Especiales FWC",
    ...Object.keys(GROUPS),
    "Leyendas LEG"
  ];

  // Helper to check if a code belongs to a group
  const isCodeInGroup = (code, grp) => {
    if (grp === "Especiales FWC") {
      return code.startsWith("FWC");
    }
    if (grp === "Leyendas LEG") {
      return code.startsWith("LEG");
    }
    const teams = GROUPS[grp] || [];
    const prefix = code.slice(0, 3);
    return teams.includes(prefix);
  };

  // Filtered sticker list
  const filteredStickers = useMemo(() => {
    return STICKER_CODES.filter((code) => {
      // 1. Status Filter
      const qty = state[code] || 0;
      if (statusFilter === "missing" && qty > 0) return false;
      if (statusFilter === "owned" && qty === 0) return false;
      if (statusFilter === "duplicates" && qty <= 1) return false;

      // 2. Search Query (Overrides group tabs if not empty)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = code.toLowerCase().includes(query);
        
        // Match team names
        let matchesTeam = false;
        if (!code.startsWith("FWC") && !code.startsWith("LEG")) {
          const teamPrefix = code.slice(0, 3);
          const teamName = TEAM_NAMES[teamPrefix] || "";
          matchesTeam = teamName.toLowerCase().includes(query);
        }
        
        return matchesCode || matchesTeam;
      }

      // 3. Active Group Tab
      return isCodeInGroup(code, activeGroup);
    });
  }, [state, activeGroup, searchQuery, statusFilter]);

  // Group filtered stickers by team or category for structured rendering
  const groupedSections = useMemo(() => {
    if (searchQuery.trim() !== "") {
      // Render as a single unified search result block
      return [{ id: "search_results", title: "Resultados de la Búsqueda", emoji: "🔎", codes: filteredStickers }];
    }

    if (activeGroup === "Especiales FWC") {
      return [{ id: "fwc", title: "Cromos Especiales FWC", emoji: "⭐", codes: filteredStickers, colors: ["#dfb23b", "#ffd700"] }];
    }

    if (activeGroup === "Leyendas LEG") {
      return [{ id: "leg", title: "Leyendas de la Copa del Mundo", emoji: "🏆", codes: filteredStickers, colors: ["#dfb23b", "#9c7c25"] }];
    }

    // Render by teams in the selected group (Removing code suffix BR, MX in headers as requested)
    const teams = GROUPS[activeGroup] || [];
    return teams.map((teamCode) => {
      const teamCodes = filteredStickers.filter((c) => c.startsWith(teamCode));
      const emoji = TEAM_EMOJIS[teamCode] || "⚽";
      const colors = TEAM_COLORS[teamCode] || ["#334155", "#475569"];
      return {
        id: teamCode,
        title: `${TEAM_NAMES[teamCode] || teamCode}`, // Removed the (ARG), (MEX) parentheses prefix
        emoji,
        colors,
        codes: teamCodes,
        stats: {
          collected: teamCodes.filter((c) => state[c] > 0).length,
          total: STICKER_CODES.filter((c) => c.startsWith(teamCode)).length,
        }
      };
    });
  }, [filteredStickers, activeGroup, searchQuery, state]);

  return (
    <div className="sticker-grid-container">
      {/* Search and Filters panel */}
      <div className="glass-panel" style={{ padding: "20px" }}>
        <div className="sticker-filters">
          {/* Search bar */}
          <div style={{ position: "relative", flexGrow: 1, maxWidth: "450px" }}>
            <Search 
              size={18} 
              style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--slate-light)" 
              }} 
            />
            <input
              type="text"
              placeholder="Buscar por código (ej. ARG10) o país (ej. Brasil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "42px" }}
            />
          </div>

          {/* Premium Segmented Controls */}
          <div className="segmented-control">
            <button
              className={`segmented-control-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              Todas
            </button>
            <button
              className={`segmented-control-btn ${statusFilter === "owned" ? "active" : ""}`}
              onClick={() => setStatusFilter("owned")}
            >
              Tengo
            </button>
            <button
              className={`segmented-control-btn ${statusFilter === "missing" ? "active" : ""}`}
              onClick={() => setStatusFilter("missing")}
            >
              Me Faltan
            </button>
            <button
              className={`segmented-control-btn ${statusFilter === "duplicates" ? "active" : ""}`}
              onClick={() => setStatusFilter("duplicates")}
            >
              Repetidas
            </button>
          </div>
        </div>

        {/* Group Tabs (hidden if searching) */}
        {searchQuery.trim() === "" && (
          <div className="group-tabs" style={{ marginTop: "15px" }}>
            {groupTabs.map((tab) => (
              <button
                key={tab}
                className={`group-tab ${activeGroup === tab ? "active" : ""}`}
                onClick={() => setActiveGroup(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sections and Cards Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {groupedSections.map((section) => {
          if (section.codes.length === 0) return null;
          
          const primaryColor = section.colors ? section.colors[0] : "rgba(255,255,255,0.06)";
          const secondaryColor = section.colors ? (section.colors[1] || section.colors[0]) : "rgba(255,255,255,0.06)";
          
          return (
            <div 
              key={section.id} 
              className="team-section"
              style={{
                borderLeft: `4px solid ${primaryColor}`,
                background: `linear-gradient(135deg, ${primaryColor}10 0%, rgba(10, 12, 18, 0.4) 60%, rgba(5, 7, 10, 0.95) 100%)`,
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${primaryColor}08`,
                padding: "24px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Massive faint watermark flag in the background behind cards (UX visual request) */}
              {section.emoji && (
                <div className="team-bg-flag">
                  {section.emoji}
                </div>
              )}

              {/* National Team Banner Header */}
              <div 
                className="team-header"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingBottom: "12px",
                  marginBottom: "20px",
                  zIndex: 2,
                  position: "relative"
                }}
              >
                <h3 className="team-title" style={{ fontSize: "1.35rem", fontWeight: "700" }}>
                  <span style={{ fontSize: "1.65rem", marginRight: "6px" }}>{section.emoji}</span>
                  {section.title}
                  
                  {/* Soccer ball micro-animation only on specials/legends */}
                  {(section.id === "fwc" || section.id === "leg" || section.id === "search_results") && (
                    <span className="spinning-soccer-ball" style={{ fontSize: "1.1rem", marginLeft: "10px" }}>⚽</span>
                  )}
                </h3>

                {section.stats && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span 
                      className="team-progress-text"
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "var(--text-light)",
                        background: "rgba(255,255,255,0.03)",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}
                    >
                      Pegados: <strong style={{ color: "var(--gold)" }}>{section.stats.collected}</strong> / {section.stats.total}
                    </span>
                    
                    {/* Representing selection flag colors ribbon */}
                    <div 
                      style={{ 
                        display: "flex", 
                        gap: "2px", 
                        height: "4px", 
                        width: "50px", 
                        borderRadius: "2px", 
                        overflow: "hidden", 
                        marginTop: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.5)"
                      }}
                    >
                      <div style={{ background: primaryColor, flex: 1 }}></div>
                      <div style={{ background: secondaryColor, flex: 1 }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Stickers Grid */}
              <div className="sticker-grid" style={{ zIndex: 1, position: "relative" }}>
                {section.codes.map((code) => (
                  <StickerCard
                    key={code}
                    code={code}
                    count={state[code] || 0}
                    onAdd={() => onAddSticker(code)}
                    onSubtract={() => onSubtractSticker(code)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state if nothing matches */}
        {filteredStickers.length === 0 && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: "40px", 
              textAlign: "center", 
              border: "1px dashed var(--border-color)" 
            }}
          >
            <BookOpen size={48} style={{ color: "var(--slate-light)", marginBottom: "16px", opacity: 0.5 }} />
            <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" }}>
              No se encontraron cromos
            </h4>
            <p style={{ fontSize: "0.9rem", color: "var(--slate-text)" }}>
              Intenta cambiar los filtros seleccionados o limpiar tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
