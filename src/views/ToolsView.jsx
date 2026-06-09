import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, Upload, Copy, Check, Trash2, RefreshCw, AlertTriangle, FileText, Printer } from "lucide-react";
import { compressToCode, decompressFromCode, importStateData, getStats, getMissingList, getDuplicatesList } from "../core/dataManager";
import { TEAMS, TEAM_NAMES } from "../core/constants";

// Helper to group sticker codes by their prefix for compact display
function groupStickersByPrefix(codes, duplicatesMap = null) {
  const groups = {};
  for (const code of codes) {
    let prefix, numStr, numVal;
    if (code === "00") {
      prefix = "FWC";
      numStr = "00";
      numVal = 0;
    } else if (code.startsWith("FWC")) {
      prefix = "FWC";
      numStr = code.slice(3);
      numVal = parseInt(numStr, 10) || 999;
    } else if (code.startsWith("CC")) {
      prefix = "CC";
      numStr = code.slice(2);
      numVal = parseInt(numStr, 10) || 999;
    } else {
      prefix = code.slice(0, 3);
      numStr = code.slice(3);
      numVal = parseInt(numStr, 10) || 999;
    }

    const qtySuffix = (duplicatesMap && duplicatesMap[code]) ? ` (x${duplicatesMap[code]})` : "";

    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push({ numVal, numStr, qtySuffix });
  }

  const groupedStrings = {};
  for (const [prefix, items] of Object.entries(groups)) {
    items.sort((a, b) => a.numVal - b.numVal);
    groupedStrings[prefix] = items.map(item => `${item.numStr}${item.qtySuffix}`).join(", ");
  }

  return groupedStrings;
}

// Helper to sort prefixes in the sequence of the physical album
function getSortedPrefixes(prefixes) {
  const order = ["FWC", ...TEAMS, "CC"];
  const orderMap = {};
  order.forEach((p, idx) => {
    orderMap[p] = idx;
  });
  return [...prefixes].sort((a, b) => {
    const idxA = orderMap[a] !== undefined ? orderMap[a] : 999;
    const idxB = orderMap[b] !== undefined ? orderMap[b] : 999;
    return idxA - idxB;
  });
}

export default function ToolsView({ state, onStateChange, onResetState }) {
  const [exchangeCode, setExchangeCode] = useState("");
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [importCodeSuccess, setImportCodeSuccess] = useState("");
  const [importCodeError, setImportCodeError] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [jsonSuccess, setJsonSuccess] = useState("");
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  // PDF / Print configuration states
  const [exportMode, setExportMode] = useState("standard"); // "standard" or "available"
  const [collectorName, setCollectorName] = useState("Coleccionista");
  const [contactInfo, setContactInfo] = useState("");
  const [includeMissing, setIncludeMissing] = useState(true);
  const [includeDuplicates, setIncludeDuplicates] = useState(true);
  const [includeSingle, setIncludeSingle] = useState(true);
  const [includeCode, setIncludeCode] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [compCode, setCompCode] = useState("");
  
  const fileInputRef = useRef(null);

  // Automatically compress code for print block when state or selection changes
  useEffect(() => {
    if (includeCode) {
      compressToCode(state)
        .then(code => setCompCode(code))
        .catch(err => console.error("Error compressing state for print:", err));
    }
  }, [state, includeCode]);

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

  // Trigger browser's print dialog
  const handlePrint = () => {
    window.print();
  };

  // Calculate statistics and lists for print preview
  const stats = getStats(state);
  const missingList = getMissingList(state);
  const duplicatesList = getDuplicatesList(state); // { code: qty }
  const ownedList = Object.keys(state).filter(c => state[c] > 0);
  const singlesList = Object.keys(state).filter(c => state[c] === 1);

  const groupedMissing = groupStickersByPrefix(missingList);
  const groupedDuplicates = groupStickersByPrefix(Object.keys(duplicatesList), duplicatesList);
  const groupedOwned = groupStickersByPrefix(ownedList);
  const groupedSingles = groupStickersByPrefix(singlesList);

  const sortedMissingPrefixes = getSortedPrefixes(Object.keys(groupedMissing));
  const sortedDuplicatePrefixes = getSortedPrefixes(Object.keys(groupedDuplicates));
  const sortedOwnedPrefixes = getSortedPrefixes(Object.keys(groupedOwned));
  const sortedSinglesPrefixes = getSortedPrefixes(Object.keys(groupedSingles));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title */}
      <div className="glass-panel tools-intro-card" style={{ padding: "24px" }}>
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

      {/* Export to PDF / Print Configuration Panel (Full Width) */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <Printer size={18} style={{ color: "var(--gold)" }} />
          Reporte para Imprimir (PDF / Papel)
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--slate-text)", marginBottom: "20px" }}>
          Personaliza y genera una lista optimizada para imprimir en papel o guardar como PDF. Ideal para llevar a reuniones de intercambio.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Tipo de Reporte</label>
            <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer", color: "var(--slate-text)" }}>
                <input
                  type="radio"
                  name="exportMode"
                  checked={exportMode === "standard"}
                  onChange={() => setExportMode("standard")}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                Reporte Estándar de Intercambio
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer", color: "var(--slate-text)" }}>
                <input
                  type="radio"
                  name="exportMode"
                  checked={exportMode === "available"}
                  onChange={() => setExportMode("available")}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                Solo Figuritas Disponibles
              </label>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", margin: "4px 0" }}></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", opacity: exportMode === "standard" ? 1 : 0.5 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Nombre del Coleccionista</label>
              <input
                type="text"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                placeholder="Ej: Matias"
                disabled={exportMode !== "standard"}
                style={{ background: "rgba(0,0,0,0.3)", cursor: exportMode === "standard" ? "text" : "not-allowed" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Datos de Contacto (opcional)</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Ej: Cel / IG / Twitter"
                disabled={exportMode !== "standard"}
                style={{ background: "rgba(0,0,0,0.3)", cursor: exportMode === "standard" ? "text" : "not-allowed" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px", opacity: exportMode === "standard" ? 1 : 0.5 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: exportMode === "standard" ? "pointer" : "not-allowed", color: "var(--slate-text)" }}>
              <input
                type="checkbox"
                checked={includeMissing}
                disabled={exportMode !== "standard"}
                onChange={(e) => setIncludeMissing(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: exportMode === "standard" ? "pointer" : "not-allowed" }}
              />
              Incluir Faltantes
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: exportMode === "standard" ? "pointer" : "not-allowed", color: "var(--slate-text)" }}>
              <input
                type="checkbox"
                checked={includeDuplicates}
                disabled={exportMode !== "standard"}
                onChange={(e) => setIncludeDuplicates(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: exportMode === "standard" ? "pointer" : "not-allowed" }}
              />
              Incluir Repetidas
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: exportMode === "standard" ? "pointer" : "not-allowed", color: "var(--slate-text)" }}>
              <input
                type="checkbox"
                checked={includeSingle}
                disabled={exportMode !== "standard"}
                onChange={(e) => setIncludeSingle(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: exportMode === "standard" ? "pointer" : "not-allowed" }}
              />
              Incluir Únicas (x1)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: exportMode === "standard" ? "pointer" : "not-allowed", color: "var(--slate-text)" }}>
              <input
                type="checkbox"
                checked={includeCode}
                disabled={exportMode !== "standard"}
                onChange={(e) => setIncludeCode(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: exportMode === "standard" ? "pointer" : "not-allowed" }}
              />
              Incluir Código Digital
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: exportMode === "standard" ? "pointer" : "not-allowed", color: "var(--slate-text)" }}>
              <input
                type="checkbox"
                checked={includeNotes}
                disabled={exportMode !== "standard"}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: exportMode === "standard" ? "pointer" : "not-allowed" }}
              />
              Incluir Espacio de Notas
            </label>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handlePrint}
            style={{ width: "100%", marginTop: "10px", gap: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Printer size={18} />
            Imprimir o Exportar PDF
          </button>
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

      {/* ========================================== */}
      {/* PRINT-ONLY AREA (RENDERED HIDDEN ON SCREEN) */}
      {/* ========================================== */}
      {createPortal(
        <div id="print-area">
          <div className="print-container">
            <div className="print-header">
              <h1 className="print-title">ÁLBUM COPA MUNDIAL FIFA 2026</h1>
              {exportMode === "standard" && <p className="print-subtitle">REPORTE DE INTERCAMBIO Y CONTROL DE COLECCIÓN</p>}
            </div>
            
            {exportMode === "standard" && (
              <div className="print-meta-box">
                <div className="print-meta-item">
                  <strong>Coleccionista:</strong> {collectorName}<br />
                  <strong>Contacto:</strong> {contactInfo || "No especificado"}<br />
                  <strong>Fecha de Reporte:</strong> {new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                </div>
                <div className="print-meta-item">
                  <strong>Progreso General:</strong> {stats.percentage.toFixed(1)}% ({stats.collected}/{stats.total})<br />
                  <strong>Faltantes:</strong> {stats.missing}<br />
                  <strong>Repetidas (Extras):</strong> {stats.duplicates}
                </div>
              </div>
            )}
            
            {exportMode === "standard" ? (
              <>
                {/* 1. Duplicates list */}
                {includeDuplicates && (
                  <div>
                    <h3 className="print-section-title">Figuritas Repetidas (Disponibles para Intercambio)</h3>
                    {Object.keys(groupedDuplicates).length > 0 ? (
                      <table className="print-table duplicates-table">
                        <thead>
                          <tr>
                            <th style={{ width: "160px" }}>Selección / Sección</th>
                            <th>Figuritas y Cantidades Extras</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedDuplicatePrefixes.map(prefix => {
                            const teamName = prefix === "FWC" ? "Especiales FWC" : prefix === "CC" ? "Coca-Cola" : TEAM_NAMES[prefix] || prefix;
                            return (
                              <tr key={prefix}>
                                <td><strong>{teamName}</strong> ({prefix})</td>
                                <td>{groupedDuplicates[prefix]}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontSize: "10px", color: "#4b5563" }}>No tienes figuritas repetidas disponibles en este momento.</p>
                    )}
                  </div>
                )}
                
                 {/* 2. Missing list */}
                {includeMissing && (
                  <div>
                    <h3 className="print-section-title">Figuritas Faltantes (Necesitadas)</h3>
                    {Object.keys(groupedMissing).length > 0 ? (
                      <table className="print-table missing-table">
                        <thead>
                          <tr>
                            <th style={{ width: "160px" }}>Selección / Sección</th>
                            <th>Números Faltantes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedMissingPrefixes.map(prefix => {
                            const teamName = prefix === "FWC" ? "Especiales FWC" : prefix === "CC" ? "Coca-Cola" : TEAM_NAMES[prefix] || prefix;
                            return (
                              <tr key={prefix}>
                                <td><strong>{teamName}</strong> ({prefix})</td>
                                <td>{groupedMissing[prefix]}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontSize: "10px", color: "#4b5563" }}>¡Felicidades! Álbum completo. No tienes figuritas faltantes.</p>
                    )}
                  </div>
                )}

                {/* 3. Singles list */}
                {includeSingle && (
                  <div>
                    <h3 className="print-section-title">Figuritas Obtenidas Solo Una Vez (No Repetidas)</h3>
                    {Object.keys(groupedSingles).length > 0 ? (
                      <table className="print-table singles-table">
                        <thead>
                          <tr>
                            <th style={{ width: "160px" }}>Selección / Sección</th>
                            <th>Figuritas Únicas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedSinglesPrefixes.map(prefix => {
                            const teamName = prefix === "FWC" ? "Especiales FWC" : prefix === "CC" ? "Coca-Cola" : TEAM_NAMES[prefix] || prefix;
                            return (
                              <tr key={prefix}>
                                <td><strong>{teamName}</strong> ({prefix})</td>
                                <td>{groupedSingles[prefix]}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontSize: "10px", color: "#4b5563" }}>No tienes figuritas obtenidas solo una vez en este momento.</p>
                    )}
                  </div>
                )}

                
                {/* 3. Sync code */}
                {includeCode && compCode && (
                  <div>
                    <h3 className="print-section-title">Sincronización Digital</h3>
                    <p style={{ fontSize: "9px", color: "#4b5563", marginBottom: "6px" }}>
                      Para transferir tu progreso a otro dispositivo o compartir tu colección con un amigo digitalmente, copia y pega este código comprimido en la opción 'Importar Código' de la sección Herramientas en la versión web o de escritorio:
                    </p>
                    <div className="print-code-box">
                      {compCode}
                    </div>
                  </div>
                )}
                
                {/* 4. Lined notes */}
                {includeNotes && (
                  <div>
                    <h3 className="print-section-title">Notas / Acuerdos de Intercambio (Firma o Figuritas Pactadas)</h3>
                    <p style={{ fontSize: "9px", color: "#4b5563", marginBottom: "12px" }}>
                      Usa este espacio durante tus reuniones de intercambio para registrar tratos pendientes, figuritas prestadas o datos de contacto de otros coleccionistas:
                    </p>
                    <div className="print-notes-lines">
                      <div className="print-notes-line"></div>
                      <div className="print-notes-line"></div>
                      <div className="print-notes-line"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Figuritas disponibles mode */
              <div>
                <h3 className="print-section-title">Figuritas disponibles</h3>
                {Object.keys(groupedOwned).length > 0 ? (
                  <table className="print-table owned-table">
                    <thead>
                      <tr>
                        <th style={{ width: "160px" }}>Selección / Sección</th>
                        <th>Figuritas disponibles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOwnedPrefixes.map(prefix => {
                        const teamName = prefix === "FWC" ? "Especiales FWC" : prefix === "CC" ? "Coca-Cola" : TEAM_NAMES[prefix] || prefix;
                        return (
                          <tr key={prefix}>
                            <td><strong>{teamName}</strong> ({prefix})</td>
                            <td>{groupedOwned[prefix]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: "10px", color: "#4b5563" }}>No tienes figuritas disponibles en este momento.</p>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
