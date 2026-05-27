import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Navigation from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import AlbumView from "./views/AlbumView";
import TradeView from "./views/TradeView";
import ToolsView from "./views/ToolsView";
import { loadState, saveState, resetState, fillRandomly } from "./core/dataManager";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeGroup, setActiveGroup] = useState("Especiales FWC");
  const [albumState, setAlbumState] = useState(() => loadState());
  const [showExitModal, setShowExitModal] = useState(false);

  // Automatically save state when it changes
  useEffect(() => {
    saveState(albumState);
  }, [albumState]);

  // Handle mobile / browser back button and gestures
  useEffect(() => {
    // 1. Initialize history state: replace with 'exit' sentinel, then push 'dashboard'
    window.history.replaceState({ tab: "exit" }, "");
    window.history.pushState({ tab: "dashboard" }, "");

    const handlePopState = (event) => {
      const state = event.state;
      if (!state) return;

      if (state.tab === "exit") {
        // User pressed back from dashboard -> Show premium exit confirmation modal
        setShowExitModal(true);
      } else if (state.tab === "dashboard") {
        // User went back to dashboard
        setShowExitModal(false);
        setActiveTab("dashboard");
      } else {
        // User went back to a secondary tab
        setShowExitModal(false);
        setActiveTab(state.tab);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Synchronize activeTab changes from UI actions to browser history
  useEffect(() => {
    const currentHistoryTab = window.history.state?.tab;

    if (activeTab === "dashboard") {
      // If we are at dashboard and history says otherwise, sync it
      if (currentHistoryTab && currentHistoryTab !== "dashboard" && currentHistoryTab !== "exit") {
        window.history.pushState({ tab: "dashboard" }, "");
      }
    } else {
      // Secondary tab (album, trade, tools)
      if (currentHistoryTab === "dashboard") {
        // Transition from dashboard to secondary -> push state
        window.history.pushState({ tab: activeTab }, "");
      } else if (currentHistoryTab && currentHistoryTab !== activeTab && currentHistoryTab !== "exit") {
        // Transition between secondary tabs -> replace state to avoid deep secondary menus history
        window.history.replaceState({ tab: activeTab }, "");
      }
    }
  }, [activeTab]);

  const handleConfirmExit = () => {
    setShowExitModal(false);
    window.history.back(); // Go back past 'exit' state to navigate out of the app
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    // Push dashboard back to history stack to restore intercepting back button
    window.history.pushState({ tab: "dashboard" }, "");
    setActiveTab("dashboard");
  };

  // Handler to increment sticker count
  const handleAddSticker = (code) => {
    setAlbumState((prev) => {
      const current = prev[code] || 0;
      return {
        ...prev,
        [code]: current + 1
      };
    });
  };

  // Handler to decrement sticker count
  const handleSubtractSticker = (code) => {
    setAlbumState((prev) => {
      const current = prev[code] || 0;
      if (current === 0) return prev;
      return {
        ...prev,
        [code]: current - 1
      };
    });
  };

  // Handler for full state resets
  const handleResetState = () => {
    const freshState = resetState();
    setAlbumState(freshState);
  };

  // Handler for fast simulation filling
  const handleFillRandomly = (percentage) => {
    const filledState = fillRandomly(percentage);
    setAlbumState(filledState);
  };

  // Render correct view based on active navigation tab
  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            state={albumState}
            onNavigateToGroup={(groupName) => {
              setActiveGroup(groupName);
              setActiveTab("album");
            }}
            onNavigateToAlbum={() => setActiveTab("album")}
            onFillRandom={handleFillRandomly}
            onAddSticker={handleAddSticker}
          />
        );
      case "album":
        return (
          <AlbumView
            state={albumState}
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
            onAddSticker={handleAddSticker}
            onSubtractSticker={handleSubtractSticker}
          />
        );
      case "trade":
        return <TradeView state={albumState} />;
      case "tools":
        return (
          <ToolsView
            state={albumState}
            onStateChange={setAlbumState}
            onResetState={handleResetState}
          />
        );
      default:
        return (
          <DashboardView
            state={albumState}
            onNavigateToGroup={(groupName) => {
              setActiveGroup(groupName);
              setActiveTab("album");
            }}
            onNavigateToAlbum={() => setActiveTab("album")}
            onFillRandom={handleFillRandomly}
            onAddSticker={handleAddSticker}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navigation sidebar (adaptive layout) */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main workspace scroll area */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Premium Exit Confirmation Modal */}
      {showExitModal && (
        <div className="exit-modal-overlay">
          <div className="exit-modal-card">
            <div className="exit-modal-icon-container">
              <LogOut size={28} />
            </div>
            <h3 className="exit-modal-title">¿Cerrar Aplicación?</h3>
            <p className="exit-modal-text">
              ¿Estás seguro de que deseas salir del Álbum Mundial 2026? Perderás el acceso rápido si cierras la pestaña.
            </p>
            <div className="exit-modal-actions">
              <button className="exit-modal-btn exit-modal-btn-cancel" onClick={handleCancelExit}>
                Cancelar
              </button>
              <button className="exit-modal-btn exit-modal-btn-confirm" onClick={handleConfirmExit}>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
