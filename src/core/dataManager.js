import { STICKER_CODES, GROUPS } from "./constants";

const LOCAL_STORAGE_KEY = "album_2026_state";

/**
 * Initializes a clean album state (all stickers at count 0)
 */
export function createEmptyState() {
  const state = {};
  for (const code of STICKER_CODES) {
    state[code] = 0;
  }
  return state;
}

/**
 * Loads the album state from localStorage, merging it with the full list of codes
 * to ensure backwards compatibility and completeness.
 */
export function loadState() {
  const defaultState = createEmptyState();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return defaultState;
    
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      // Merge with default state
      for (const [code, count] of Object.entries(parsed)) {
        if (code in defaultState) {
          defaultState[code] = Math.max(0, parseInt(count) || 0);
        }
      }
    }
  } catch (e) {
    console.error("Error loading album state from localStorage:", e);
  }
  return defaultState;
}

/**
 * Saves the album state to localStorage
 */
export function saveState(state) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving album state to localStorage:", e);
  }
}

/**
 * Reset album state to all zeros
 */
export function resetState() {
  const state = createEmptyState();
  saveState(state);
  return state;
}

/**
 * Fills the album randomly up to the target percentage.
 * Simulates both collected and duplicate stickers.
 */
export function fillRandomly(targetPercentage = 30) {
  const state = createEmptyState();
  const targetCount = Math.floor(STICKER_CODES.length * (targetPercentage / 100));
  
  // Shuffle a copy of codes to pick random ones
  const shuffled = [...STICKER_CODES].sort(() => 0.5 - Math.random());
  const selectedCodes = shuffled.slice(0, targetCount);
  
  for (const code of selectedCodes) {
    // 60% single, 30% double, 10% triple
    const rand = Math.random();
    if (rand < 0.6) {
      state[code] = 1;
    } else if (rand < 0.9) {
      state[code] = 2;
    } else {
      state[code] = 3;
    }
  }
  
  saveState(state);
  return state;
}

/**
 * Helper to safely convert an ArrayBuffer to a Base64 string in the browser
 */
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper to safely convert a Base64 string to a Uint8Array in the browser
 */
function base64ToUint8Array(base64Str) {
  const binary = atob(base64Str.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes and compresses the album state into a Base64 string.
 * Only includes stickers with count > 0 to minimize size.
 * Matches Python's zlib.compress + base64 encoding.
 */
export async function compressToCode(state) {
  const compact = {};
  for (const [code, count] of Object.entries(state)) {
    if (count > 0) {
      compact[code] = count;
    }
  }
  
  const jsonStr = JSON.stringify(compact);
  const stream = new Blob([jsonStr]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream("deflate"));
  const response = new Response(compressedStream);
  const buffer = await response.arrayBuffer();
  return arrayBufferToBase64(buffer);
}

/**
 * Decompresses and decodes the Base64 string into a state object.
 * Matches Python's zlib.decompress + base64 decoding.
 */
export async function decompressFromCode(codeStr) {
  try {
    const bytes = base64ToUint8Array(codeStr);
    const stream = new Blob([bytes]).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream("deflate"));
    const response = new Response(decompressedStream);
    const jsonStr = await response.text();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Error decompressing exchange code:", e);
    throw new Error("El código de intercambio no es válido o está corrupto.");
  }
}

/**
 * Computes general statistics for the given state
 */
export function getStats(state) {
  const total = STICKER_CODES.length;
  let collected = 0;
  let duplicates = 0;
  
  for (const count of Object.values(state)) {
    if (count > 0) {
      collected++;
      duplicates += (count - 1);
    }
  }
  
  const missing = total - collected;
  const percentage = total > 0 ? (collected / total) * 100 : 0;
  
  return {
    total,
    collected,
    missing,
    duplicates,
    percentage
  };
}

/**
 * Computes statistics for a specific category / group
 */
export function getGroupStats(state, groupName) {
  let groupStickers = [];
  if (groupName === "Especiales FWC") {
    groupStickers = STICKER_CODES.filter(c => c.startsWith("FWC"));
  } else if (groupName === "Leyendas LEG") {
    groupStickers = STICKER_CODES.filter(c => c.startsWith("LEG"));
  } else {
    const teams = GROUPS[groupName] || [];
    groupStickers = STICKER_CODES.filter(c => teams.some(t => c.startsWith(t)));
  }
  
  const total = groupStickers.length;
  const collected = groupStickers.filter(c => state[c] > 0).length;
  const missing = total - collected;
  const percentage = total > 0 ? (collected / total) * 100 : 0;
  
  return {
    total,
    collected,
    missing,
    percentage
  };
}

/**
 * Get list of stickers the user does NOT have (count == 0)
 */
export function getMissingList(state) {
  return STICKER_CODES.filter(c => state[c] === 0);
}

/**
 * Get object of stickers the user has duplicates for (count > 1)
 * Returns { code: duplicateCount } where duplicateCount is count - 1
 */
export function getDuplicatesList(state) {
  const dups = {};
  for (const [code, count] of Object.entries(state)) {
    if (count > 1) {
      dups[code] = count - 1;
    }
  }
  return dups;
}

/**
 * Imports progress data (merging it onto a clean slate or existing state)
 */
export function importStateData(importedData) {
  const state = createEmptyState();
  if (importedData && typeof importedData === "object") {
    for (const [code, count] of Object.entries(importedData)) {
      if (code in state) {
        state[code] = Math.max(0, parseInt(count) || 0);
      }
    }
  }
  saveState(state);
  return state;
}
