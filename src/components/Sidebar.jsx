import React from "react";
import { LayoutDashboard, BookOpen, ArrowLeftRight, Settings, Sparkles } from "lucide-react";

export default function Navigation({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
    { id: "album", label: "Mi Álbum", icon: BookOpen },
    { id: "trade", label: "Intercambio", icon: ArrowLeftRight },
    { id: "tools", label: "Herramientas", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo-glow" style={{ background: "transparent", boxShadow: "none" }}>
            <span className="spinning-soccer-ball" style={{ fontSize: "2rem" }}>⚽</span>
          </div>
          <div>
            <h1 className="sidebar-title">Álbum 2026</h1>
            <span style={{ fontSize: "0.75rem", color: "var(--slate-light)" }}>
              Premium Collector
            </span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item btn-secondary ${activeTab === item.id ? "active" : ""}`}
                style={{
                  background: activeTab === item.id ? "rgba(223, 178, 59, 0.08)" : "transparent",
                  border: "none",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>Álbum Mundial 2026</div>
          <div>v2.0.0 • Web PWA</div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Layout */}
      <nav className="mobile-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-item ${activeTab === item.id ? "active" : ""}`}
              style={{
                background: "transparent",
                border: "none",
              }}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
