import React, { useState } from "react";
import { ArrowLeftRight, CheckCircle2, Copy, Check, Info } from "lucide-react";
import { decompressFromCode, getStats, compressToCode } from "../core/dataManager";
import { STICKER_CODES } from "../core/constants";

export default function TradeView({ state }) {
  const [friendCode, setFriendCode] = useState("");
  const [friendState, setFriendState] = useState(null);
  const [friendStats, setFriendStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Matchmaker Lists
  const [toGive, setToGive] = useState([]);
  const [toReceive, setToReceive] = useState([]);
  const [compared, setCompared] = useState(false);

  const handleCompare = async () => {
    setErrorMsg("");
    setCompared(false);
    if (!friendCode.trim()) {
      setErrorMsg("Por favor, ingresa el código de tu amigo.");
      return;
    }

    try {
      const decoded = await decompressFromCode(friendCode.trim());
      
      // Compute matchmaker lists
      const giveList = [];
      const receiveList = [];

      for (const code of STICKER_CODES) {
        const myCount = state[code] || 0;
        const friendCount = decoded[code] || 0;

        // Yo doy: Tengo más de 1 (repetido) y mi amigo tiene 0 (le falta)
        if (myCount > 1 && friendCount === 0) {
          giveList.push(code);
        }

        // Yo recibo: Mi amigo tiene más de 1 (repetido) y yo tengo 0 (me falta)
        if (friendCount > 1 && myCount === 0) {
          receiveList.push(code);
        }
      }

      setToGive(giveList);
      setToReceive(receiveList);
      setFriendState(decoded);
      
      // Calculate friend's stats
      // Standardize decoded object structure (missing keys default to 0)
      const fullFriendState = {};
      for (const c of STICKER_CODES) {
        fullFriendState[c] = decoded[c] || 0;
      }
      setFriendStats(getStats(fullFriendState));
      
      setCompared(true);
    } catch (e) {
      setErrorMsg("El código de tu amigo no es válido. Verifica que esté copiado correctamente.");
      setFriendState(null);
      setCompared(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      const myCompressedCode = await compressToCode(state);
      await navigator.clipboard.writeText(myCompressedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error("Error copy code:", e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Intro Banner */}
      <div className="glass-panel trade-intro-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.45rem", marginBottom: "8px", fontWeight: "700" }}>
          Matchmaker de Intercambios
        </h2>
        <p style={{ color: "var(--slate-text)", fontSize: "0.92rem", marginBottom: "15px" }}>
          Compara tus cromos repetidos con los de un amigo para saber al instante cuáles pueden intercambiarse. 
          Pídele a tu amigo que te envíe su código de álbum de la versión Web o Escritorio y pégalo abajo.
        </p>
        
        {/* User Code Sharing Card */}
        <div className="trade-share-card">
          <div className="trade-share-info">
            <h4 style={{ fontSize: "0.95rem", color: "var(--gold)", fontWeight: "600", marginBottom: "3px" }}>
              ¿Quieres compartir tu progreso?
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--slate-text)" }}>
              Copia tu código comprimido para enviárselo a tu amigo.
            </p>
          </div>
          <button className="btn btn-primary trade-share-btn" onClick={handleCopyCode}>
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            {isCopied ? "¡Copiado!" : "Copiar Mi Código"}
          </button>
        </div>
      </div>

      {/* Code Input Card */}
      <div className="glass-panel trade-input-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", fontWeight: "600" }}>
          Pegar código de tu amigo
        </h3>
        
        {errorMsg && (
          <div className="alert alert-error">
            <Info size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <textarea
            placeholder="Pega aquí el código base64 de tu amigo..."
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            style={{ 
              fontFamily: "var(--mono)", 
              fontSize: "0.85rem", 
              minHeight: "100px", 
              background: "rgba(0,0,0,0.3)" 
            }}
          />
          <button 
            className="btn btn-primary trade-compare-btn" 
            onClick={handleCompare}
          >
            <ArrowLeftRight size={18} />
            Comparar Álbumes
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {compared && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Friend stats summary banner */}
          {friendStats && (
            <div 
              className="glass-panel friend-stats-banner" 
              style={{ 
                padding: "20px", 
                background: "rgba(255,255,255,0.015)" 
              }}
            >
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--slate-text)" }}>PROGRESO DE TU AMIGO</span>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-light)" }}>
                  Completado al {friendStats.percentage.toFixed(1)}%
                </h4>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--slate-text)" }}>CROMOS CONSEGUIDOS</span>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--gold)" }}>
                  {friendStats.collected} / {friendStats.total}
                </h4>
              </div>
            </div>
          )}

          {/* Parallel columns */}
          <div className="trade-container">
            {/* Column Yo Doy */}
            <div className="glass-panel trade-panel">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "6px", color: "var(--gold)", fontWeight: "600" }}>
                Tus Repetidas que le Faltan (Yo Doy)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "15px" }}>
                Tienes repetidas estas figuritas y a tu amigo le faltan en su álbum ({toGive.length} cromos).
              </p>

              <div className="trade-list-container">
                {toGive.length > 0 ? (
                  <div className="trade-list-grid">
                    {toGive.map(code => (
                      <div key={code} className="trade-chip give">
                        {code}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--slate-text)", fontSize: "0.85rem" }}>
                    No tienes repetidas que le sirvan a tu amigo.
                  </div>
                )}
              </div>
            </div>

            {/* Column Yo Recibo */}
            <div className="glass-panel trade-panel">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "6px", color: "#60a5fa", fontWeight: "600" }}>
                Repetidas de tu Amigo que te Faltan (Yo Recibo)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "15px" }}>
                A tu amigo le sobran estas figuritas y a ti te faltan en tu álbum ({toReceive.length} cromos).
              </p>

              <div className="trade-list-container">
                {toReceive.length > 0 ? (
                  <div className="trade-list-grid">
                    {toReceive.map(code => (
                      <div key={code} className="trade-chip receive">
                        {code}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--slate-text)", fontSize: "0.85rem" }}>
                    Tu amigo no tiene repetidas que te falten.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder illustration when not compared */}
      {!compared && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: "60px", 
            textAlign: "center", 
            border: "1px dashed var(--border-color)", 
            opacity: 0.7 
          }}
        >
          <ArrowLeftRight size={48} style={{ color: "var(--slate-light)", marginBottom: "16px" }} />
          <h4 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "8px" }}>
            Esperando código de amigo
          </h4>
          <p style={{ fontSize: "0.9rem", color: "var(--slate-text)", maxWidth: "400px", margin: "0 auto" }}>
            Ingresa y compara un código de álbum para ver las combinaciones de intercambio disponibles.
          </p>
        </div>
      )}
    </div>
  );
}
