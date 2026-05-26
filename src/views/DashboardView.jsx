import React, { useState, useMemo } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Trophy, Star, Search } from "lucide-react";
import MetricCard from "../components/MetricCard";
import SoccerBall from "../components/SoccerBall";
import { getStats, getGroupStats, getMissingList, getDuplicatesList } from "../core/dataManager";
import { GROUPS, TEAM_NAMES } from "../core/constants";

export default function DashboardView({ state, onAddSticker, onNavigateToGroup }) {
  const stats = getStats(state);
  
  // State for search queries in the dashboard panels
  const [dupQuery, setDupQuery] = useState("");
  const [missingQuery, setMissingQuery] = useState("");

  // Calculate stats for all groups
  const groupsList = [
    { name: "Especiales FWC", label: "Especiales FWC", icon: Star },
    ...Object.keys(GROUPS).map(g => ({ name: g, label: g, icon: Trophy })),
    { name: "Coca-Cola CC", label: "Coca-Cola CC", icon: Star }
  ];

  const groupProgresses = groupsList.map(grp => {
    const grpStats = getGroupStats(state, grp.name);
    return {
      ...grp,
      stats: grpStats
    };
  });

  // Helper to check if a code belongs to a country search
  const matchesSearch = (code, query) => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return true;
    
    // Check if code contains search
    if (code.toLowerCase().includes(cleanQuery)) return true;
    
    // Check if country name contains search
    if (code !== "00" && !code.startsWith("FWC") && !code.startsWith("CC")) {
      const prefix = code.slice(0, 3);
      const teamName = TEAM_NAMES[prefix] || "";
      if (teamName.toLowerCase().includes(cleanQuery)) return true;
    }
    return false;
  };

  // 1. Filtered Duplicates List
  const filteredDuplicates = useMemo(() => {
    const dups = getDuplicatesList(state); // returns { code: count - 1 }
    return Object.entries(dups)
      .map(([code, count]) => ({ code, count }))
      .filter(item => matchesSearch(item.code, dupQuery));
  }, [state, dupQuery]);

  // 2. Filtered Missing List
  const filteredMissing = useMemo(() => {
    const missing = getMissingList(state); // returns [code]
    return missing.filter(code => matchesSearch(code, missingQuery));
  }, [state, missingQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Welcome Banner with Creative Spinning Soccer Ball */}
      <div 
        className="glass-panel dashboard-welcome-banner" 
        style={{ 
          padding: "30px", 
          background: "linear-gradient(135deg, rgba(223, 178, 59, 0.05) 0%, rgba(16, 18, 27, 0.7) 100%)",
          borderLeft: "4px solid var(--gold)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div className="welcome-banner-content" style={{ width: "100%" }}>
          <div style={{ flexGrow: 1 }} className="welcome-banner-text">
            <h2 style={{ fontSize: "1.75rem", marginBottom: "8px", fontWeight: "700" }}>
              Panel del Coleccionista
            </h2>
            <p style={{ color: "var(--slate-text)", maxWidth: "650px", fontSize: "0.95rem" }}>
              Lleva el control total de tus cromos oficiales del Mundial 2026. Sincroniza tu progreso entre tu PC y tu dispositivo móvil mediante códigos de intercambio comprimidos.
            </p>
          </div>
          <div className="welcome-banner-ball">
            <SoccerBall size={55} />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <MetricCard
          title="Progreso Total"
          value={`${stats.percentage.toFixed(1)}%`}
          subtitle={`${stats.collected} de ${stats.total} coleccionados`}
          icon={Trophy}
          progress={stats.percentage}
          goldStyle={true}
        />
        <MetricCard
          title="Pegados"
          value={stats.collected.toString()}
          subtitle="Cromos únicos en el álbum"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Faltantes"
          value={stats.missing.toString()}
          subtitle="Cromos que te faltan conseguir"
          icon={AlertCircle}
        />
        <MetricCard
          title="Repetidos"
          value={stats.duplicates.toString()}
          subtitle="Cromos extras para intercambiar"
          icon={RefreshCw}
        />
      </div>

      {/* Bento Grid */}
      <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "5px" }}>
        Progreso por Grupos y Categorías
      </h3>
      
      <div className="bento-grid">
        {groupProgresses.map((grp) => {
          const GrpIcon = grp.icon;
          const teamsList = GROUPS[grp.name] || [];
          const teamsStr = teamsList.join(", "); // E.g., MEX, RSA, KOR, CZE
          
          return (
            <div 
              key={grp.name} 
              className="glass-panel bento-card"
              onClick={() => onNavigateToGroup(grp.name)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <GrpIcon size={16} style={{ color: grp.name.includes("FWC") || grp.name.includes("CC") ? "var(--gold)" : "var(--slate-light)" }} />
                  {grp.label}
                </h4>
                <span style={{ fontSize: "0.85rem", fontFamily: "var(--mono)", color: "var(--gold)" }}>
                  {grp.stats.percentage.toFixed(0)}%
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "10px" }}>
                {grp.stats.collected} / {grp.stats.total} cromos pegados
              </div>
              
              {/* Progress bar and Team codes in the bottom right (Point 3) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto", gap: "10px" }}>
                <div className="progress-container" style={{ flexGrow: 1, margin: 0 }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${grp.stats.percentage}%`,
                      background: grp.name.includes("FWC") || grp.name.includes("CC") ? "var(--gold)" : "var(--slate-light)"
                    }}
                  />
                </div>
                {teamsStr && (
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--slate-text)", whiteSpace: "nowrap" }}>
                    {teamsStr}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Search Panels (Duplicates vs Quick Missing Panel) */}
      <div className="tools-grid">
        {/* Left Column: Buscador de Repetidas */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", height: "450px" }}>
          <h3 style={{ fontSize: "1.15rem", marginBottom: "4px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)" }}>
            <RefreshCw size={18} />
            Buscador de Repetidas
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "15px" }}>
            Busca y visualiza tus cromos repetidos para intercambiar.
          </p>

          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Search 
              size={16} 
              style={{ 
                position: "absolute", 
                left: "12px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--slate-light)" 
              }} 
            />
            <input
              type="text"
              placeholder="Buscar repetida (ej. CC3, ARG)..."
              value={dupQuery}
              onChange={(e) => setDupQuery(e.target.value)}
              style={{ paddingLeft: "36px", paddingTop: "10px", paddingBottom: "10px" }}
            />
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", padding: "12px" }}>
            {filteredDuplicates.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" }}>
                {filteredDuplicates.map(item => {
                  const isSpecial = item.code === "00" || item.code.startsWith("FWC") || item.code.startsWith("CC");
                  return (
                    <div 
                      key={item.code} 
                      style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        padding: "8px", 
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: isSpecial ? "var(--gold)" : "var(--slate-medium)",
                        background: isSpecial ? "rgba(223, 178, 59, 0.05)" : "rgba(255,255,255,0.02)",
                        color: isSpecial ? "var(--gold)" : "var(--text-light)",
                        fontFamily: "var(--mono)",
                        fontSize: "0.85rem",
                        position: "relative"
                      }}
                    >
                      <span style={{ fontWeight: isSpecial ? "700" : "500" }}>{item.code}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--slate-text)", marginTop: "2px" }}>
                        Rep: {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--slate-text)", fontSize: "0.85rem" }}>
                No tienes repetidas que coincidan.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Panel Rápido de Faltantes */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", height: "450px" }}>
          <h3 style={{ fontSize: "1.15rem", marginBottom: "4px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)" }}>
            <AlertCircle size={18} />
            Panel Rápido de Faltantes
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "15px" }}>
            Haz clic en cualquier cromo para marcarlo como pegado en tu álbum.
          </p>

          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Search 
              size={16} 
              style={{ 
                position: "absolute", 
                left: "12px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--slate-light)" 
              }} 
            />
            <input
              type="text"
              placeholder="Filtrar faltantes (ej. FWC12, BRA)..."
              value={missingQuery}
              onChange={(e) => setMissingQuery(e.target.value)}
              style={{ paddingLeft: "36px", paddingTop: "10px", paddingBottom: "10px" }}
            />
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", padding: "12px" }}>
            {filteredMissing.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(75px, 1fr))", gap: "8px" }}>
                {filteredMissing.map(code => {
                  const isSpecial = code === "00" || code.startsWith("FWC") || code.startsWith("CC");
                  return (
                    <button
                      key={code}
                      onClick={() => onAddSticker(code)}
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px dashed",
                        borderColor: isSpecial ? "rgba(223, 178, 59, 0.4)" : "rgba(255,255,255,0.15)",
                        background: "rgba(10, 12, 18, 0.5)",
                        color: isSpecial ? "var(--gold)" : "var(--slate-text)",
                        fontFamily: "var(--mono)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        textAlign: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = isSpecial ? "var(--gold-bright)" : "var(--slate-light)";
                        e.target.style.color = isSpecial ? "var(--gold-bright)" : "var(--text-light)";
                        e.target.style.background = isSpecial ? "rgba(223, 178, 59, 0.1)" : "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = isSpecial ? "rgba(223, 178, 59, 0.4)" : "rgba(255,255,255,0.15)";
                        e.target.style.color = isSpecial ? "var(--gold)" : "var(--slate-text)";
                        e.target.style.background = "rgba(10, 12, 18, 0.5)";
                      }}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--slate-text)", fontSize: "0.85rem" }}>
                No hay cromos faltantes que coincidan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
