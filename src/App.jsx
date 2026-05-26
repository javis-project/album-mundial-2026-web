import React, { useState, useEffect } from "react";
import Navigation from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import AlbumView from "./views/AlbumView";
import TradeView from "./views/TradeView";
import ToolsView from "./views/ToolsView";
import { loadState, saveState, resetState, fillRandomly } from "./core/dataManager";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [albumState, setAlbumState] = useState(() => loadState());

  // Automatically save state when it changes
  useEffect(() => {
    saveState(albumState);
  }, [albumState]);

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
            onNavigateToAlbum={() => setActiveTab("album")}
            onFillRandom={handleFillRandomly}
          />
        );
      case "album":
        return (
          <AlbumView
            state={albumState}
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
            onFillRandom={handleFillRandomly}
          />
        );
      default:
        return (
          <DashboardView
            state={albumState}
            onNavigateToAlbum={() => setActiveTab("album")}
            onFillRandom={handleFillRandomly}
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
    </div>
  );
}
