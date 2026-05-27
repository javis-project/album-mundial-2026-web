import React, { useState, useEffect } from "react";
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

  // Automatically save state when it changes
  useEffect(() => {
    saveState(albumState);
  }, [albumState]);

  // Handle mobile / browser back button and gestures using URL Hash routing
  useEffect(() => {
    const currentHash = window.location.hash;
    
    // Initialize hash routing stack so that dashboard is always behind any secondary tab
    if (!currentHash || currentHash === "#/" || currentHash === "#/dashboard") {
      window.history.replaceState(null, "", "#/dashboard");
      setActiveTab("dashboard");
    } else {
      // If loaded directly on a secondary tab, initialize the stack to [dashboard, secondaryTab]
      const targetTab = currentHash.replace(/^#\/?/, "");
      window.history.replaceState(null, "", "#/dashboard");
      window.history.pushState(null, "", "#/" + targetTab);
      setActiveTab(targetTab);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      const tab = currentHash.replace(/^#\/?/, "");
      
      if (tab === "dashboard" || !tab) {
        setActiveTab("dashboard");
      } else {
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
      // When navigating back to dashboard from a secondary tab, we pop history
      // to cleanly restore the history stack to [#/dashboard].
      window.history.back();
    } else {
      // Secondary tab (album, trade, tools)
      if (currentTab === "dashboard") {
        window.location.hash = "/" + targetTab; // Push history entry
      } else {
        window.location.replace("#/" + targetTab); // Replace history entry to avoid deep history stacks
      }
    }
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
    </div>
  );
}
