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

  // Handle mobile / browser back button and gestures using URL Hash routing
  useEffect(() => {
    // Initialize hash routing
    if (!window.location.hash || window.location.hash === "#/") {
      window.history.replaceState(null, "", "#/exit");
      window.history.pushState(null, "", "#/dashboard");
      setActiveTab("dashboard");
    } else {
      const initialTab = window.location.hash.replace("#/", "");
      if (initialTab === "exit") {
        setActiveTab("dashboard");
      } else {
        setActiveTab(initialTab || "dashboard");
      }
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      // Robust regex to extract tab name regardless of browser-specific hash slashes (e.g. #/album, #album)
      const tab = currentHash.replace(/^#\/?/, "");
      
      if (tab === "exit") {
        setShowExitModal(true);
      } else if (tab === "dashboard" || !tab) {
        setShowExitModal(false);
        setActiveTab("dashboard");
      } else {
        setShowExitModal(false);
        setActiveTab(tab);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // UI Navigation handler that updates the browser hash instead of setting state directly.
  // This allows the browser history and back gesture to manage the activeTab state naturally.
  const handleNavigate = (targetTab) => {
    const currentTab = activeTab;
    if (targetTab === currentTab) return;

    if (targetTab === "dashboard") {
      window.location.hash = "/dashboard";
    } else {
      // Secondary tab (album, trade, tools)
      if (currentTab === "dashboard") {
        window.location.hash = "/" + targetTab; // Push history entry
      } else {
        window.location.replace("#/" + targetTab); // Replace history entry to avoid deep history stacks
      }
    }
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    
    // 1. Attempt standard window close (works in standalone app wrappers/PWAs/webviews)
    try {
      window.close();
    } catch (e) {
      console.warn("window.close failed:", e);
    }

    // 2. Go back in history (navigates out of the app to the previous site)
    try {
      window.history.back();
    } catch (e) {
      console.warn("window.history.back failed:", e);
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    // Restore hash back to dashboard
    window.location.hash = "/dashboard";
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
              handleNavigate("album");
            }}
            onNavigateToAlbum={() => handleNavigate("album")}
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
              handleNavigate("album");
            }}
            onNavigateToAlbum={() => handleNavigate("album")}
            onFillRandom={handleFillRandomly}
            onAddSticker={handleAddSticker}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navigation sidebar (adaptive layout) */}
      <Navigation activeTab={activeTab} setActiveTab={handleNavigate} />
      
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
