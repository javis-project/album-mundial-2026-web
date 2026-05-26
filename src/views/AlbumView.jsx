import React, { useState, useMemo } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import StickerCard from "../components/StickerCard";
import { GROUPS, TEAM_NAMES, STICKER_CODES } from "../core/constants";

export default function AlbumView({ state, onAddSticker, onSubtractSticker }) {
  const [activeGroup, setActiveGroup] = useState("Especiales FWC");
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
      return [{ id: "search_results", title: "Resultados de la Búsqueda", codes: filteredStickers }];
    }

    if (activeGroup === "Especiales FWC") {
      return [{ id: "fwc", title: "Cromos Especiales FWC", codes: filteredStickers }];
    }

    if (activeGroup === "Leyendas LEG") {
      return [{ id: "leg", title: "Leyendas de la Copa del Mundo", codes: filteredStickers }];
    }

    // Render by teams in the selected group
    const teams = GROUPS[activeGroup] || [];
    return teams.map((teamCode) => {
      const teamCodes = filteredStickers.filter((c) => c.startsWith(teamCode));
      return {
        id: teamCode,
        title: `${TEAM_NAMES[teamCode] || teamCode} (${teamCode})`,
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

          {/* Status filter dropdown */}
          <div className="filter-group">
            <Filter size={18} style={{ color: "var(--slate-light)" }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="all">Todos los Cromos</option>
              <option value="missing">Faltantes</option>
              <option value="owned">Pegados</option>
              <option value="duplicates">Repetidos</option>
            </select>
          </div>
        </div>

        {/* Group Tabs (hidden if searching) */}
        {searchQuery.trim() === "" && (
          <div className="group-tabs">
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
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {groupedSections.map((section) => {
          if (section.codes.length === 0) return null;
          
          return (
            <div key={section.id} className="team-section">
              <div className="team-header">
                <h3 className="team-title">{section.title}</h3>
                {section.stats && (
                  <span className="team-progress-text">
                    Pegados: {section.stats.collected} / {section.stats.total}
                  </span>
                )}
              </div>
              
              <div className="sticker-grid">
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
