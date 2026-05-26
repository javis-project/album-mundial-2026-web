import React, { useState, useRef } from "react";
import { Download, Upload, Copy, Check, Trash2, RefreshCw, AlertTriangle, FileText } from "lucide-react";
import { compressToCode, decompressFromCode, importStateData } from "../core/dataManager";

export default function ToolsView({ state, onStateChange, onResetState }) {
  const [exchangeCode, setExchangeCode] = useState("");
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [importCodeSuccess, setImportCodeSuccess] = useState("");
  const [importCodeError, setImportCodeError] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonSuccess, setJsonSuccess] = useState("");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  const fileInputRef = useRef(null);

  // 1. Copy compressed Base64 code
  const handleCopyCode = async () => {
    try {
      const code = await compressToCode(state);
      await navigator.clipboard.writeText(code);
      setCopyCodeSuccess(true);
      setTimeout(() => setCopyCodeSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Import compressed Base64 code
  const handleImportCode = async () => {
    setImportCodeError("");
    setImportCodeSuccess("");
    if (!exchangeCode.trim()) {
      setImportCodeError("Por favor, pega un código de intercambio válido.");
      return;
    }

    try {
      const decoded = await decompressFromCode(exchangeCode.trim());
      const newState = importStateData(decoded);
      onStateChange(newState);
      setImportCodeSuccess("¡Progreso importado con éxito!");
      setExchangeCode("");
    } catch (e) {
      setImportCodeError(e.message || "El código ingresado no es válido.");
    }
  };

  // 3. Export JSON file
  const handleExportJSON = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(state, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", "album_mundial_2026_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Import JSON file
  const handleImportJSON = (e) => {
    setJsonError("");
    setJsonSuccess("");
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === "object") {
          const newState = importStateData(parsed);
          onStateChange(newState);
          setJsonSuccess("¡Copia de seguridad cargada con éxito!");
        } else {
          setJsonError("El formato del archivo JSON es incorrecto.");
        }
      } catch (err) {
        setJsonError("No se pudo leer el archivo. Asegúrate de que sea un archivo JSON válido.");
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be uploaded again
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.45rem", marginBottom: "8px", fontWeight: "700" }}>
          Herramientas y Portabilidad
        </h2>
        <p style={{ color: "var(--slate-text)", fontSize: "0.92rem" }}>
          Sincroniza y respalda tu colección. Puedes copiar tu código comprimido para compartirlo entre la versión web y el programa de PC (.exe).
        </p>
      </div>

      <div className="tools-grid">
        {/* Sync panel */}
        <div className="glass-panel tool-card">
          <h3 className="tool-card-title" style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw size={18} style={{ color: "var(--gold)" }} />
            Sincronización por Código (Cross-Platform)
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "15px" }}>
            Copia el código de tu álbum para importarlo en la PC, o pega el código generado por la versión de escritorio aquí.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <button className="btn btn-primary" onClick={handleCopyCode} style={{ width: "100%" }}>
              {copyCodeSuccess ? <Check size={18} /> : <Copy size={18} />}
              {copyCodeSuccess ? "¡Código Copiado!" : "Copiar Código de Álbum"}
            </button>

            <div style={{ borderTop: "1px solid var(--border-color)", margin: "10px 0" }}></div>

            <h4 className="tools-section-title" style={{ fontSize: "0.9rem", color: "var(--text-light)", fontWeight: "500", marginBottom: "6px" }}>
              Importar Código de Intercambio
            </h4>

            {importCodeError && (
              <div className="alert alert-error" style={{ padding: "8px 12px", fontSize: "0.8rem", marginBottom: "10px" }}>
                <span>{importCodeError}</span>
              </div>
            )}
            
            {importCodeSuccess && (
              <div className="alert alert-success" style={{ padding: "8px 12px", fontSize: "0.8rem", marginBottom: "10px" }}>
                <span>{importCodeSuccess}</span>
              </div>
            )}

            <textarea
              placeholder="Pega aquí el código base64 del álbum..."
              value={exchangeCode}
              onChange={(e) => setExchangeCode(e.target.value)}
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.8rem",
                minHeight: "80px",
                background: "rgba(0,0,0,0.3)"
              }}
            />

            <button className="btn btn-secondary" onClick={handleImportCode} style={{ width: "100%" }}>
              Importar Código
            </button>
          </div>
        </div>

        {/* Backups panel */}
        <div className="glass-panel tool-card">
          <h3 className="tool-card-title" style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} style={{ color: "var(--gold)" }} />
            Copias de Seguridad (JSON)
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "15px" }}>
            Guarda una copia de seguridad en tu disco o restaura tu álbum desde un archivo de respaldo.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
            {jsonError && (
              <div className="alert alert-error" style={{ padding: "8px 12px", fontSize: "0.8rem" }}>
                <span>{jsonError}</span>
              </div>
            )}
            {jsonSuccess && (
              <div className="alert alert-success" style={{ padding: "8px 12px", fontSize: "0.8rem" }}>
                <span>{jsonSuccess}</span>
              </div>
            )}

            <button className="btn btn-secondary" onClick={handleExportJSON} style={{ width: "100%", justifyContent: "center" }}>
              <Download size={18} />
              Exportar Archivo JSON
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => fileInputRef.current.click()} 
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Upload size={18} />
              Importar Archivo JSON
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportJSON}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Danger Zone panel */}
      <div className="glass-panel danger-zone-panel" style={{ padding: "24px" }}>
        <h3 className="danger-zone-header" style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "600", color: "#f87171", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={18} />
          Zona Peligrosa
        </h3>
        <p className="danger-zone-desc" style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "20px" }}>
          Acción crítica de vaciado. Si necesitas borrar todo el progreso actual para iniciar de cero.
        </p>

        <div className="danger-zone-actions" style={{ display: "flex", alignItems: "center" }}>
          {/* Reset Album */}
          {!showConfirmReset ? (
            <button 
              className="btn btn-danger" 
              onClick={() => setShowConfirmReset(true)}
            >
              <Trash2 size={18} />
              Reiniciar Álbum
            </button>
          ) : (
            <div className="danger-zone-confirm" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.85rem", color: "#f87171", fontWeight: "500" }}>
                ¿Confirmas borrar TODO tu progreso?
              </span>
              <button 
                className="btn btn-danger" 
                onClick={() => {
                  onResetState();
                  setShowConfirmReset(false);
                  setJsonSuccess("Álbum reiniciado a cero.");
                }}
                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
              >
                Sí, borrar
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirmReset(false)}
                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
