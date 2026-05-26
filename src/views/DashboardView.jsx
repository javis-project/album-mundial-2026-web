import React from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Trophy, Star, ShieldAlert } from "lucide-react";
import MetricCard from "../components/MetricCard";
import { getStats, getGroupStats } from "../core/dataManager";
import { GROUPS } from "../core/constants";

export default function DashboardView({ state, onNavigateToAlbum, onFillRandom }) {
  const stats = getStats(state);
  
  // Calculate stats for all groups
  const groupsList = [
    { name: "Especiales FWC", label: "Especiales FWC", icon: Star },
    ...Object.keys(GROUPS).map(g => ({ name: g, label: g, icon: Trophy })),
    { name: "Leyendas LEG", label: "Leyendas LEG", icon: Star }
  ];

  const groupProgresses = groupsList.map(grp => {
    const grpStats = getGroupStats(state, grp.name);
    return {
      ...grp,
      stats: grpStats
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Welcome Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "30px", 
          background: "linear-gradient(135deg, rgba(223, 178, 59, 0.05) 0%, rgba(16, 18, 27, 0.7) 100%)",
          borderLeft: "4px solid var(--gold)" 
        }}
      >
        <h2 style={{ fontSize: "1.75rem", marginBottom: "8px", fontWeight: "700" }}>
          Panel del Coleccionista
        </h2>
        <p style={{ color: "var(--slate-text)", maxWidth: "600px", fontSize: "0.95rem" }}>
          Lleva el control total de tus cromos oficiales del Mundial 2026. Sincroniza tu progreso entre tu PC y tu dispositivo móvil mediante códigos de intercambio comprimidos.
        </p>
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
          return (
            <div key={grp.name} className="glass-panel bento-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <GrpIcon size={16} style={{ color: grp.name.includes("FWC") || grp.name.includes("LEG") ? "var(--gold)" : "var(--slate-light)" }} />
                  {grp.label}
                </h4>
                <span style={{ fontSize: "0.85rem", fontFamily: "var(--mono)", color: "var(--gold)" }}>
                  {grp.stats.percentage.toFixed(0)}%
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "10px" }}>
                {grp.stats.collected} / {grp.stats.total} cromos pegados
              </div>
              <div className="progress-container" style={{ marginTop: "auto" }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${grp.stats.percentage}%`,
                    background: grp.name.includes("FWC") || grp.name.includes("LEG") ? "var(--gold)" : "var(--slate-light)"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action shortcuts / Quick Start */}
      {stats.collected === 0 && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: "24px", 
            textAlign: "center", 
            background: "rgba(30, 41, 59, 0.15)",
            border: "1px dashed var(--border-color)",
            borderRadius: "var(--radius-md)" 
          }}
        >
          <ShieldAlert size={36} style={{ color: "var(--gold)", marginBottom: "12px" }} />
          <h4 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "600" }}>
            ¿Tu álbum está vacío?
          </h4>
          <p style={{ fontSize: "0.9rem", color: "var(--slate-text)", marginBottom: "18px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            Puedes simular un progreso inicial rápido para probar la aplicación, o ir directamente a marcar tus cromos en la pestaña Mi Álbum.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={onNavigateToAlbum}>
              Ir a Mi Álbum
            </button>
            <button className="btn btn-secondary" onClick={() => onFillRandom(30)}>
              Llenar 30% Aleatorio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
